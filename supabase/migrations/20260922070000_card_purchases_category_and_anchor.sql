alter table credit_card_purchases
  add column budget_group_id uuid references budget_groups(id) on delete set null,
  add column installment_anchor_at date;

update credit_card_purchases set installment_anchor_at = created_at::date where installment_anchor_at is null;

alter table credit_card_purchases
  alter column installment_anchor_at set not null,
  alter column installment_anchor_at set default current_date;

create index if not exists idx_credit_card_purchases_budget_group_id on credit_card_purchases(budget_group_id);
