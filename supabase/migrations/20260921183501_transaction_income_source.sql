alter table transactions
  add column income_source text
  check (income_source in ('salario', 'extra', 'reembolso', 'outro'));
