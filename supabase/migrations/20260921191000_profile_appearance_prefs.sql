alter table profiles
  add column accent_theme text not null default 'verde'
    check (accent_theme in ('verde', 'azul', 'roxo', 'terracota', 'grafite')),
  add column heading_style text not null default 'divertido'
    check (heading_style in ('divertido', 'neutro'));
