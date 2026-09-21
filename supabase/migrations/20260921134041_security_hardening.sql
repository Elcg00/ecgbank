-- Move citext out of the public schema.
create schema if not exists extensions;
alter extension citext set schema extensions;

-- handle_new_user is only ever invoked by the auth.users trigger; it should
-- not be directly callable through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- current_family_id() is used inside RLS policies evaluated as the
-- authenticated user; anonymous (logged-out) callers have no use for it.
revoke execute on function public.current_family_id() from public, anon;
grant execute on function public.current_family_id() to authenticated;
