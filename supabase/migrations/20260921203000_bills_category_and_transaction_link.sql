alter table bills
  add column budget_group_id uuid references budget_groups(id) on delete set null,
  add column transaction_id uuid references transactions(id) on delete set null;
