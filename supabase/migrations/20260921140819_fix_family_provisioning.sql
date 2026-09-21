-- The previous flow (insert into families, then .select().single() to read
-- the new row back) tripped over Postgres RLS: RETURNING after an INSERT is
-- also filtered by the table's SELECT policy, and current_family_id() still
-- resolved to null for the inserting user at that point (their profile
-- hadn't been linked yet), so the newly inserted row came back invisible —
-- PostgREST then reported "no rows returned" as an error.
--
-- Doing both writes inside one SECURITY DEFINER function sidesteps RLS for
-- this specific, narrow operation (create a family, link the calling user
-- to it as admin) instead of trying to thread a chicken-and-egg RLS policy.
create function provision_family(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family_id uuid;
begin
  insert into families (name) values (coalesce(nullif(trim(p_name), ''), 'Minha família'))
  returning id into v_family_id;

  update profiles set family_id = v_family_id, role = 'admin' where id = auth.uid();

  return v_family_id;
end;
$$;

revoke execute on function provision_family(text) from public, anon;
grant execute on function provision_family(text) to authenticated;
