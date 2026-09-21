-- Allow every family member to read each other's onboarding income
-- (needed to compute a shared "renda familiar" total). Own row keeps
-- being the only one insertable/updatable/deletable, via the existing
-- "own onboarding answers" policy.
create policy "family reads incomes" on onboarding_answers
  for select using (
    user_id in (select id from profiles where family_id = current_family_id())
  );
