-- profiles."update own profile" only checks id = auth.uid(), with no column
-- restriction, so it defaults to allowing ANY column on the caller's own row
-- to be changed — including family_id and role. That means any authenticated
-- user could PATCH their own profile's family_id directly via the REST API
-- (bypassing the app entirely) and instantly gain full read/write access to
-- any other family's transactions, bills, cards, debts and goals, since every
-- one of those tables is scoped only by current_family_id(), which just
-- reads the caller's own profile row. Locking this down at the column-grant
-- level closes it regardless of any RLS policy wording, and doesn't rely on
-- family_id UUIDs staying secret.
revoke update on public.profiles from authenticated;
grant update (
  full_name,
  avatar_color,
  theme_preference,
  accent_theme,
  heading_style,
  deactivated_at,
  onboarding_completed_at
) on public.profiles to authenticated;

-- The "join family via pending invite" path (src/lib/family.ts ensureFamily)
-- used to set family_id/role with a plain client update, which the grant
-- change above would now block. Move it into a SECURITY DEFINER function,
-- mirroring provision_family, so it keeps working but only ever assigns a
-- family_id that has an actual pending invite addressed to the caller's own
-- authenticated e-mail — never an arbitrary one supplied by the client.
create or replace function public.accept_pending_invite()
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_invite_id uuid;
  v_family_id uuid;
begin
  select id, family_id into v_invite_id, v_family_id
  from family_invites
  where status = 'pending'
    and lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
  order by created_at asc
  limit 1;

  if v_family_id is null then
    return null;
  end if;

  update profiles set family_id = v_family_id, role = 'member' where id = auth.uid();
  update family_invites set status = 'accepted' where id = v_invite_id;

  return v_family_id;
end;
$$;

grant execute on function public.accept_pending_invite() to authenticated;

-- New functions get EXECUTE granted to PUBLIC by default in Postgres, unlike
-- the project's existing family-management functions which already had it
-- revoked. Match that pattern: signing in is required before this can be
-- called at all (an anon caller has no auth.jwt() email to match anyway, but
-- there's no reason to expose the endpoint to unauthenticated callers).
revoke execute on function public.accept_pending_invite() from public;
revoke execute on function public.accept_pending_invite() from anon;

-- No app code inserts into families directly (family creation always goes
-- through provision_family, a SECURITY DEFINER function that bypasses RLS
-- anyway); this policy just let any authenticated user insert arbitrary rows
-- into families via the REST API for no legitimate reason.
drop policy if exists "authenticated creates family" on public.families;
