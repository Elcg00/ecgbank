-- Wrap auth.<fn>() calls in (select ...) so Postgres evaluates them once
-- per statement instead of once per row (RLS initplan optimization), and
-- consolidate overlapping permissive policies into one per action so the
-- planner doesn't have to run multiple policies for the same query.

drop policy "read family members" on profiles;
create policy "read family members" on profiles
  for select using (family_id = current_family_id() or id = (select auth.uid()));

drop policy "update own profile" on profiles;
create policy "update own profile" on profiles
  for update using (id = (select auth.uid()));

drop policy "create own profile" on profiles;
create policy "create own profile" on profiles
  for insert with check (id = (select auth.uid()));

drop policy "manage own family invites" on family_invites;
drop policy "read invite by email" on family_invites;
drop policy "accept own invite" on family_invites;

create policy "select family invites" on family_invites
  for select using (
    family_id = current_family_id()
    or lower(email::text) = lower(coalesce(((select auth.jwt()) ->> 'email'), ''))
  );

create policy "insert family invites" on family_invites
  for insert with check (family_id = current_family_id());

create policy "update family invites" on family_invites
  for update using (
    family_id = current_family_id()
    or lower(email::text) = lower(coalesce(((select auth.jwt()) ->> 'email'), ''))
  ) with check (
    family_id = current_family_id()
    or lower(email::text) = lower(coalesce(((select auth.jwt()) ->> 'email'), ''))
  );

create policy "delete family invites" on family_invites
  for delete using (family_id = current_family_id());

drop policy "own onboarding answers" on onboarding_answers;
drop policy "family reads incomes" on onboarding_answers;

create policy "select onboarding answers" on onboarding_answers
  for select using (
    user_id = (select auth.uid())
    or user_id in (select id from profiles where family_id = current_family_id())
  );

create policy "insert onboarding answers" on onboarding_answers
  for insert with check (user_id = (select auth.uid()));

create policy "update onboarding answers" on onboarding_answers
  for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "delete onboarding answers" on onboarding_answers
  for delete using (user_id = (select auth.uid()));
