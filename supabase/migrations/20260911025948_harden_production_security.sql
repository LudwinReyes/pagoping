-- Production hardening: least-privilege grants, consolidated RLS, trusted roles,
-- hot-path indexes and removal of the service credential from trigger metadata.

create index if not exists payments_user_created_at_idx
  on public.payments (user_id, created_at desc);
create index if not exists payments_user_device_created_at_idx
  on public.payments (user_id, device_id, created_at desc);
create index if not exists payments_device_id_idx
  on public.payments (device_id);
create index if not exists devices_user_id_idx
  on public.devices (user_id);

revoke all on public.app_config, public.plans, public.subscriptions,
  public.payments, public.devices, public.collaborators from anon;
grant select on public.app_config, public.plans to anon;

revoke insert, update, delete on public.app_config, public.plans from authenticated;
grant select on public.app_config, public.plans, public.subscriptions,
  public.payments, public.devices, public.collaborators to authenticated;
grant insert on public.payments, public.devices to authenticated;
grant update, delete on public.devices to authenticated;
grant update on public.subscriptions to authenticated;

drop policy if exists "Admin ve config" on public.app_config;
drop policy if exists "Config publica lectura" on public.app_config;
create policy app_config_public_read on public.app_config
  for select to anon, authenticated using (true);
create policy app_config_admin_manage on public.app_config
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Allow read access to all users" on public.plans;
create policy plans_public_read on public.plans
  for select to anon, authenticated using (true);

drop policy if exists "Admin ve todo devices" on public.devices;
drop policy if exists "Usuarios actualizan dispositivos" on public.devices;
drop policy if exists "Usuarios actualizan sus dispositivos" on public.devices;
drop policy if exists "Usuarios eliminan dispositivos" on public.devices;
drop policy if exists "Usuarios insertan dispositivos" on public.devices;
drop policy if exists "Usuarios ven sus dispositivos" on public.devices;
drop policy if exists devices_collaborator_delete on public.devices;
drop policy if exists devices_collaborator_insert on public.devices;
drop policy if exists devices_collaborator_read on public.devices;
drop policy if exists devices_collaborator_update on public.devices;
drop policy if exists devices_owner_delete on public.devices;
drop policy if exists devices_owner_insert on public.devices;
drop policy if exists devices_owner_update on public.devices;
create policy devices_admin_all on public.devices
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy devices_authorized_read on public.devices
  for select to authenticated
  using (
    (select auth.uid()) = user_id
    or (select auth.uid()) = auth_user_id
    or private.is_active_collaborator_for(user_id)
  );
create policy devices_owner_insert on public.devices
  for insert to authenticated
  with check ((select auth.uid()) = user_id and role = 'listener');
create policy devices_owner_update on public.devices
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy devices_owner_delete on public.devices
  for delete to authenticated using ((select auth.uid()) = user_id);
create policy devices_collaborator_insert on public.devices
  for insert to authenticated
  with check (
    role = 'viewer'
    and auth_user_id = (select auth.uid())
    and private.is_active_collaborator_for(user_id)
  );
create policy devices_collaborator_update on public.devices
  for update to authenticated
  using (auth_user_id = (select auth.uid()) and private.is_active_collaborator_for(user_id))
  with check (auth_user_id = (select auth.uid()) and private.is_active_collaborator_for(user_id));
create policy devices_collaborator_delete on public.devices
  for delete to authenticated
  using (auth_user_id = (select auth.uid()) and private.is_active_collaborator_for(user_id));

drop policy if exists "Admin ve todo pagos" on public.payments;
drop policy if exists "Usuarios insertan sus pagos" on public.payments;
drop policy if exists "Usuarios ven sus pagos" on public.payments;
drop policy if exists payments_active_collaborator_read on public.payments;
create policy payments_admin_all on public.payments
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy payments_owner_read on public.payments
  for select to authenticated using ((select auth.uid()) = user_id);
create policy payments_collaborator_read on public.payments
  for select to authenticated using (private.is_active_collaborator_for(user_id));
create policy payments_owner_insert on public.payments
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Admin ve todo subs" on public.subscriptions;
drop policy if exists "Usuarios ven su plan" on public.subscriptions;
drop policy if exists subscriptions_active_collaborator_read on public.subscriptions;
drop policy if exists subscriptions_owner_update on public.subscriptions;
create policy subscriptions_admin_all on public.subscriptions
  for all to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create policy subscriptions_authorized_read on public.subscriptions
  for select to authenticated
  using ((select auth.uid()) = user_id or private.is_active_collaborator_for(user_id));
create policy subscriptions_owner_update on public.subscriptions
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists collaborators_owner_or_self_read on public.collaborators;
create policy collaborators_authorized_read on public.collaborators
  for select to authenticated
  using ((select auth.uid()) = owner_id or (select auth.uid()) = auth_user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(new.raw_app_meta_data ->> 'role', 'owner') = 'employee' then
    return new;
  end if;

  insert into public.subscriptions (
    user_id, email, tier, starts_at, validations_count, max_validations,
    max_devices, can_export, is_active, business_name, display_name, phone_number
  ) values (
    new.id, coalesce(new.email, ''), 'free', now(), 0, 5,
    1, false, true,
    nullif(trim(new.raw_user_meta_data ->> 'business_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'phone_number'), '')
  )
  on conflict (user_id) do update set
    email = excluded.email,
    business_name = coalesce(public.subscriptions.business_name, excluded.business_name),
    display_name = coalesce(public.subscriptions.display_name, excluded.display_name),
    phone_number = coalesce(public.subscriptions.phone_number, excluded.phone_number);
  return new;
end;
$$;

-- Copy the existing webhook credential directly into Vault without exposing it
-- to migration output, then replace the generic trigger (which stored it in tgargs).
do $$
declare
  webhook_token text;
begin
  if not exists (select 1 from vault.secrets where name = 'pagoping_payment_webhook_service_role') then
    select (regexp_match(pg_get_triggerdef(t.oid), 'Bearer ([^"\\]+)'))[1]
      into webhook_token
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'payments'
      and t.tgname = 'payment-notification' and not t.tgisinternal;
    if webhook_token is null then
      raise exception 'Could not safely migrate payment webhook credential to Vault';
    end if;
    perform vault.create_secret(webhook_token, 'pagoping_payment_webhook_service_role', 'PagoPing payment webhook credential');
  end if;
end;
$$;

create or replace function private.notify_payment_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_id bigint;
  webhook_token text;
begin
  select decrypted_secret into webhook_token
  from vault.decrypted_secrets
  where name = 'pagoping_payment_webhook_service_role';
  if webhook_token is null then
    raise warning 'PagoPing payment webhook secret is unavailable';
    return new;
  end if;
  select net.http_post(
    url := 'https://tgeoqtjmpypebnffhoop.supabase.co/functions/v1/send-payment-notification',
    body := jsonb_build_object('record', to_jsonb(new), 'type', tg_op, 'table', tg_table_name, 'schema', tg_table_schema),
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || webhook_token),
    timeout_milliseconds := 5000
  ) into request_id;
  return new;
end;
$$;
revoke all on function private.notify_payment_insert() from public, anon, authenticated;

drop trigger if exists "payment-notification" on public.payments;
create trigger "payment-notification"
after insert on public.payments
for each row execute function private.notify_payment_insert();
