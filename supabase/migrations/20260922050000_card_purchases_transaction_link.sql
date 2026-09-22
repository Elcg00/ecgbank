alter table credit_card_purchases
  add column installment_start int,
  add column transaction_id uuid references transactions(id) on delete set null;

update credit_card_purchases set installment_start = installment_current where installment_start is null;

alter table credit_card_purchases
  alter column installment_start set not null,
  alter column installment_start set default 1;
