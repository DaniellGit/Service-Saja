create extension if not exists "uuid-ossp";

create type vehicle_type as enum ('Motorcycle', 'Car');
create type service_type as enum (
  'engine oil',
  'gear oil',
  'air filter',
  'spark plug',
  'CVT belt',
  'rollers',
  'brake pad',
  'tire',
  'coolant',
  'battery',
  'other'
);
create type reminder_status as enum ('due soon', 'overdue', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  plate_number text not null,
  type vehicle_type not null,
  model text not null,
  current_mileage integer not null default 0 check (current_mileage >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  service_date date not null,
  mileage integer not null check (mileage >= 0),
  service_type service_type not null,
  cost numeric(10, 2) not null default 0 check (cost >= 0),
  shop_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  service_type service_type not null,
  due_mileage integer check (due_mileage >= 0),
  due_date date,
  status reminder_status not null default 'due soon',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vehicles_user_id_idx on public.vehicles(user_id);
create index service_records_user_id_idx on public.service_records(user_id);
create index service_records_vehicle_id_idx on public.service_records(vehicle_id);
create index reminders_user_id_idx on public.reminders(user_id);
create index reminders_vehicle_id_idx on public.reminders(vehicle_id);
create index reminders_status_idx on public.reminders(status);

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.service_records enable row level security;
alter table public.reminders enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can read own vehicles" on public.vehicles
  for select using (auth.uid() = user_id);

create policy "Users can insert own vehicles" on public.vehicles
  for insert with check (auth.uid() = user_id);

create policy "Users can update own vehicles" on public.vehicles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own vehicles" on public.vehicles
  for delete using (auth.uid() = user_id);

create policy "Users can read own service records" on public.service_records
  for select using (auth.uid() = user_id);

create policy "Users can insert own service records" on public.service_records
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.vehicles
      where vehicles.id = service_records.vehicle_id
      and vehicles.user_id = auth.uid()
    )
  );

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

create policy "Users can delete own service records" on public.service_records
  for delete using (auth.uid() = user_id);

create policy "Users can read own reminders" on public.reminders
  for select using (auth.uid() = user_id);

create policy "Users can insert own reminders" on public.reminders
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.vehicles
      where vehicles.id = reminders.vehicle_id
      and vehicles.user_id = auth.uid()
    )
  );

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

create policy "Users can delete own reminders" on public.reminders
  for delete using (auth.uid() = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'ServiceLog User'),
    coalesce(new.email, '')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create or replace function public.create_next_service_reminder()
returns trigger as $$
declare
  interval_km integer := 5000;
begin
  if not exists (
    select 1 from public.vehicles
    where vehicles.id = new.vehicle_id
    and vehicles.user_id = new.user_id
  ) then
    raise exception 'Vehicle does not belong to this user';
  end if;

  if new.service_type in ('spark plug', 'air filter') then
    interval_km := 10000;
  elsif new.service_type in ('CVT belt', 'tire', 'battery') then
    interval_km := 20000;
  end if;

  insert into public.reminders (user_id, vehicle_id, service_type, due_mileage, due_date, status)
  values (
    new.user_id,
    new.vehicle_id,
    new.service_type,
    new.mileage + interval_km,
    new.service_date + interval '6 months',
    'due soon'
  );

  update public.vehicles
  set current_mileage = greatest(current_mileage, new.mileage), updated_at = now()
  where id = new.vehicle_id
  and user_id = new.user_id;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_service_record_created
  after insert on public.service_records
  for each row execute procedure public.create_next_service_reminder();
