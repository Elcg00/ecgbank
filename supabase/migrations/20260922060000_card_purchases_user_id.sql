alter table credit_card_purchases add column user_id uuid references profiles(id) on delete set null;
