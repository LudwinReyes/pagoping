-- Keep one permissive policy per role/action to avoid evaluating overlapping
-- policies on every request. Privileged mutations continue through service_role.

drop policy if exists app_config_admin_manage on public.app_config;

drop policy if exists devices_admin_all on public.devices;
drop policy if exists devices_authorized_read on public.devices;
drop policy if exists devices_owner_insert on public.devices;
drop policy if exists devices_collaborator_insert on public.devices;
drop policy if exists devices_owner_update on public.devices;
drop policy if exists devices_collaborator_update on public.devices;
drop policy if exists devices_owner_delete on public.devices;
drop policy if exists devices_collaborator_delete on public.devices;

create policy devices_authorized_read on public.devices
  for select to authenticated
  using (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or (select auth.uid()) = user_id
    or (select auth.uid()) = auth_user_id
    or private.is_active_collaborator_for(user_id)
  );
create policy devices_authorized_insert on public.devices
  for insert to authenticated
  with check (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or ((select auth.uid()) = user_id and role = 'listener')
    or (
      role = 'viewer'
      and auth_user_id = (select auth.uid())
      and private.is_active_collaborator_for(user_id)
    )
  );
create policy devices_authorized_update on public.devices
  for update to authenticated
  using (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or (select auth.uid()) = user_id
    or (auth_user_id = (select auth.uid()) and private.is_active_collaborator_for(user_id))
  )
  with check (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or (select auth.uid()) = user_id
    or (auth_user_id = (select auth.uid()) and private.is_active_collaborator_for(user_id))
  );
create policy devices_authorized_delete on public.devices
  for delete to authenticated
  using (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or (select auth.uid()) = user_id
    or (auth_user_id = (select auth.uid()) and private.is_active_collaborator_for(user_id))
  );

drop policy if exists payments_admin_all on public.payments;
drop policy if exists payments_owner_read on public.payments;
drop policy if exists payments_collaborator_read on public.payments;
drop policy if exists payments_owner_insert on public.payments;
create policy payments_authorized_read on public.payments
  for select to authenticated
  using (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or (select auth.uid()) = user_id
    or private.is_active_collaborator_for(user_id)
  );
create policy payments_authorized_insert on public.payments
  for insert to authenticated
  with check (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or (select auth.uid()) = user_id
  );

drop policy if exists subscriptions_admin_all on public.subscriptions;
drop policy if exists subscriptions_authorized_read on public.subscriptions;
create policy subscriptions_authorized_read on public.subscriptions
  for select to authenticated
  using (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or (select auth.uid()) = user_id
    or private.is_active_collaborator_for(user_id)
  );
