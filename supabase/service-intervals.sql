alter table public.service_records
  add column if not exists custom_service_name text;

alter table public.reminders
  add column if not exists custom_service_name text;

create table if not exists public.service_intervals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  service_type service_type not null,
  custom_service_name text,
  custom_service_key text generated always as (coalesce(nullif(trim(custom_service_name), ''), '')) stored,
  interval_mileage integer not null check (interval_mileage > 0),
  interval_months integer not null check (interval_months > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vehicle_id, service_type, custom_service_key)
);

alter table public.service_intervals
  add column if not exists custom_service_name text;

alter table public.service_intervals
  add column if not exists custom_service_key text
  generated always as (coalesce(nullif(trim(custom_service_name), ''), '')) stored;

alter table public.service_intervals
  drop constraint if exists service_intervals_vehicle_id_service_type_key;

alter table public.service_intervals
  drop constraint if exists service_intervals_vehicle_type_custom_key;

alter table public.service_intervals
  add constraint service_intervals_vehicle_type_custom_key
  unique (vehicle_id, service_type, custom_service_key);

create index if not exists service_intervals_user_id_idx on public.service_intervals(user_id);
create index if not exists service_intervals_vehicle_id_idx on public.service_intervals(vehicle_id);

alter table public.service_intervals enable row level security;

drop policy if exists "Users can read own service intervals" on public.service_intervals;
create policy "Users can read own service intervals" on public.service_intervals
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own service intervals" on public.service_intervals;
create policy "Users can insert own service intervals" on public.service_intervals
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.vehicles
      where vehicles.id = service_intervals.vehicle_id
      and vehicles.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own service intervals" on public.service_intervals;
create policy "Users can update own service intervals" on public.service_intervals
  for update using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.vehicles
      where vehicles.id = service_intervals.vehicle_id
      and vehicles.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own service intervals" on public.service_intervals;
create policy "Users can delete own service intervals" on public.service_intervals
  for delete using (auth.uid() = user_id);

create or replace function public.create_next_service_reminder()
returns trigger as $$
declare
  interval_km integer := 5000;
  interval_months integer := 6;
  service_key text := coalesce(nullif(trim(new.custom_service_name), ''), '');
begin
  if not exists (
    select 1 from public.vehicles
    where vehicles.id = new.vehicle_id
    and vehicles.user_id = new.user_id
  ) then
    raise exception 'Vehicle does not belong to this user';
  end if;

  select service_intervals.interval_mileage, service_intervals.interval_months
  into interval_km, interval_months
  from public.service_intervals
  where service_intervals.vehicle_id = new.vehicle_id
  and service_intervals.user_id = new.user_id
  and service_intervals.service_type = new.service_type
  and service_intervals.custom_service_key = service_key;

  if interval_km is null or interval_months is null then
    if new.service_type in ('spark plug', 'air filter') then
      interval_km := 10000;
      interval_months := 6;
    elsif new.service_type in ('CVT belt', 'tire', 'battery') then
      interval_km := 20000;
      interval_months := 12;
    else
      interval_km := 5000;
      interval_months := 6;
    end if;
  end if;

  insert into public.reminders (user_id, vehicle_id, service_type, custom_service_name, due_mileage, due_date, status)
  values (
    new.user_id,
    new.vehicle_id,
    new.service_type,
    nullif(trim(coalesce(new.custom_service_name, '')), ''),
    new.mileage + interval_km,
    new.service_date + make_interval(months => interval_months),
    'due soon'
  );

  update public.vehicles
  set current_mileage = greatest(current_mileage, new.mileage), updated_at = now()
  where id = new.vehicle_id
  and user_id = new.user_id;

  return new;
end;
$$ language plpgsql security definer set search_path = public;
