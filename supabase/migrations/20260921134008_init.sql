-- ECG Bank core schema
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Families & profiles
-- ---------------------------------------------------------------------------
create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Minha família',
  debt_strategy text not null default 'menor_primeiro'
    check (debt_strategy in ('menor_primeiro', 'maior_juros')),
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  family_id uuid references families (id) on delete set null,
  full_name text not null default '',
  avatar_color text not null default '#2d5535',
  role text not null default 'member' check (role in ('admin', 'member')),
  onboarding_completed_at timestamptz,
  theme_preference text not null default 'system' check (theme_preference in ('system', 'light', 'dark')),
  created_at timestamptz not null default now()
);

-- Helper (security definer to dodge RLS recursion on profiles/families).
create function current_family_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select family_id from profiles where id = auth.uid();
$$;

-- Auto-create a profile row whenever a new auth user signs up.
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

create extension if not exists "citext";

create table family_invites (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  email citext not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table onboarding_answers (
  user_id uuid primary key references profiles (id) on delete cascade,
  monthly_income_cents bigint not null default 0,
  fixed_cost_chips text[] not null default '{}',
  has_debts boolean,
  first_goal text,
  org_model text,
  completed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Budget groups & transactions
-- ---------------------------------------------------------------------------
create table budget_groups (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  name text not null,
  monogram text not null,
  kind text not null default 'spending' check (kind in ('spending', 'saving')),
  limit_cents bigint not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null check (type in ('entrada', 'saida')),
  amount_cents bigint not null check (amount_cents > 0),
  budget_group_id uuid references budget_groups (id) on delete set null,
  payment_method text check (payment_method in ('dinheiro', 'pix', 'debito', 'credito')),
  installments int not null default 1,
  recurring boolean not null default false,
  occurred_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index transactions_family_occurred_idx on transactions (family_id, occurred_at desc);

-- ---------------------------------------------------------------------------
-- Bills (contas a pagar)
-- ---------------------------------------------------------------------------
create table bills (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  name text not null,
  amount_cents bigint not null,
  due_date date not null,
  paid boolean not null default false,
  paid_at date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Credit cards
-- ---------------------------------------------------------------------------
create table credit_cards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  name text not null default 'Cartão',
  limit_cents bigint not null default 0,
  closing_day int not null default 15,
  due_day int not null default 5,
  created_at timestamptz not null default now()
);

create table credit_card_purchases (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references credit_cards (id) on delete cascade,
  name text not null,
  amount_cents bigint not null,
  installment_current int not null default 1,
  installment_total int not null default 1,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Debts
-- ---------------------------------------------------------------------------
create table debts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  name text not null,
  original_amount_cents bigint not null,
  remaining_cents bigint not null,
  interest_rate_monthly numeric(6, 3) not null default 0,
  installment_count int not null default 1,
  installment_amount_cents bigint not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Goals
-- ---------------------------------------------------------------------------
create table goals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  name text not null,
  target_cents bigint not null,
  deadline date,
  shared boolean not null default true,
  monthly_target_cents bigint not null default 0,
  created_at timestamptz not null default now()
);

create table goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  amount_cents bigint not null default 0,
  updated_at timestamptz not null default now(),
  unique (goal_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table families enable row level security;
alter table profiles enable row level security;
alter table family_invites enable row level security;
alter table onboarding_answers enable row level security;
alter table budget_groups enable row level security;
alter table transactions enable row level security;
alter table bills enable row level security;
alter table credit_cards enable row level security;
alter table credit_card_purchases enable row level security;
alter table debts enable row level security;
alter table goals enable row level security;
alter table goal_contributions enable row level security;

create policy "read own family" on families
  for select using (id = current_family_id());
create policy "admin updates family" on families
  for update using (id = current_family_id());
create policy "authenticated creates family" on families
  for insert to authenticated with check (true);

create policy "read family members" on profiles
  for select using (family_id = current_family_id() or id = auth.uid());
create policy "update own profile" on profiles
  for update using (id = auth.uid());
create policy "create own profile" on profiles
  for insert with check (id = auth.uid());

create policy "manage own family invites" on family_invites
  for all using (family_id = current_family_id())
  with check (family_id = current_family_id());
-- Invited users need to find (and accept) an invite addressed to their own email
-- before they belong to a family, i.e. before current_family_id() resolves.
create policy "read invite by email" on family_invites
  for select using (
    lower(email::text) = lower(coalesce((auth.jwt() ->> 'email'), ''))
  );
create policy "accept own invite" on family_invites
  for update using (
    lower(email::text) = lower(coalesce((auth.jwt() ->> 'email'), ''))
  );

create policy "own onboarding answers" on onboarding_answers
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "family budget groups" on budget_groups
  for all using (family_id = current_family_id()) with check (family_id = current_family_id());

create policy "family transactions" on transactions
  for all using (family_id = current_family_id()) with check (family_id = current_family_id());

create policy "family bills" on bills
  for all using (family_id = current_family_id()) with check (family_id = current_family_id());

create policy "family credit cards" on credit_cards
  for all using (family_id = current_family_id()) with check (family_id = current_family_id());

create policy "family credit card purchases" on credit_card_purchases
  for all using (
    card_id in (select id from credit_cards where family_id = current_family_id())
  ) with check (
    card_id in (select id from credit_cards where family_id = current_family_id())
  );

create policy "family debts" on debts
  for all using (family_id = current_family_id()) with check (family_id = current_family_id());

create policy "family goals" on goals
  for all using (family_id = current_family_id()) with check (family_id = current_family_id());

create policy "family goal contributions" on goal_contributions
  for all using (
    goal_id in (select id from goals where family_id = current_family_id())
  ) with check (
    goal_id in (select id from goals where family_id = current_family_id())
  );
