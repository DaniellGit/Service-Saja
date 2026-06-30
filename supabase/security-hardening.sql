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
