alter table public.service_intervals
  add column if not exists custom_service_name text;

alter table public.service_intervals
  add column if not exists custom_service_key text
  generated always as (lower(coalesce(nullif(regexp_replace(trim(custom_service_name), '\s+', ' ', 'g'), ''), ''))) stored;

alter table public.service_intervals
  drop constraint if exists service_intervals_vehicle_id_service_type_key;

alter table public.service_intervals
  drop constraint if exists service_intervals_vehicle_type_custom_key;

alter table public.service_intervals
  add constraint service_intervals_vehicle_type_custom_key
  unique (vehicle_id, service_type, custom_service_key);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can update own vehicles" on public.vehicles;
create policy "Users can update own vehicles" on public.vehicles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can insert own service records" on public.service_records;
create policy "Users can insert own service records" on public.service_records
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.vehicles
      where vehicles.id = service_records.vehicle_id
      and vehicles.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own service records" on public.service_records;
create policy "Users can update own service records" on public.service_records
  for update using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.vehicles
      where vehicles.id = service_records.vehicle_id
      and vehicles.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own reminders" on public.reminders;
create policy "Users can insert own reminders" on public.reminders
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.vehicles
      where vehicles.id = reminders.vehicle_id
      and vehicles.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own reminders" on public.reminders;
create policy "Users can update own reminders" on public.reminders
  for update using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.vehicles
      where vehicles.id = reminders.vehicle_id
      and vehicles.user_id = auth.uid()
    )
  );

create or replace function public.create_profile_for_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Service Saja User'),
    coalesce(new.email, '')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.create_next_service_reminder()
returns trigger as $$
declare
  interval_km integer := 5000;
  interval_months integer := 6;
  service_key text := lower(coalesce(nullif(regexp_replace(trim(new.custom_service_name), '\s+', ' ', 'g'), ''), ''));
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
