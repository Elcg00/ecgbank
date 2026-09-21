# ECG Bank

App de organização financeira para casal/família — onboarding guiado, lançamento de
movimentações, orçamento por grupos, contas a pagar, cartão de crédito, dívidas, metas
compartilhadas e gestão de família. Next.js (App Router) + Tailwind CSS + Supabase.

## Stack

- **Next.js 16** (App Router, Server Components e Server Actions — o mínimo de JavaScript
  possível chega ao navegador; cada rota carrega só o próprio código).
- **Tailwind CSS v4**, com os tokens de cor/tipografia/raio do design em `src/app/globals.css`.
- **Supabase**: Postgres com Row Level Security (cada família só enxerga seus próprios
  dados) + Auth (e-mail/senha) para login.

## Configuração local

1. Copie `.env.example` para `.env.local` e preencha com a URL e a chave publicável do
   seu projeto Supabase (Project Settings → API).
2. `npm install`
3. `npm run dev` e abra http://localhost:3000

## Banco de dados (Supabase)

O schema completo (tabelas, índices e políticas de RLS) está em
`supabase/migrations/`, com um reforço de segurança aplicado logo em seguida (extensão
`citext` fora do schema `public` e permissões das funções `SECURITY DEFINER` reduzidas ao
necessário). Já foi aplicado no projeto Supabase criado para este app; se precisar recriar
em outro projeto, rode essas migrations com a CLI do Supabase ou cole o SQL no editor do
painel.

Ao se cadastrar, o primeiro usuário vira administrador de uma nova família. Convidar o
parceiro(a) (na tela de onboarding ou em Família) cria um convite pelo e-mail; quando essa
pessoa se cadastrar com o mesmo e-mail, ela entra automaticamente na mesma família e passa
a ver e lançar tudo em conjunto.

## Estrutura

- `src/app/(auth)/` — login, cadastro, recuperação de senha.
- `src/app/onboarding/` — os 7 passos guiados após o primeiro cadastro.
- `src/app/(app)/` — o app em si (Início, Extrato, Lançar, Orçamento, Contas a pagar,
  Cartão de crédito, Dívidas, Metas, Família), com sidebar no desktop e barra inferior no
  mobile.
- `src/lib/` — cliente Supabase (browser/servidor/proxy), consultas e helpers de formatação.

## Deploy

Qualquer host de Next.js funciona (Vercel é o mais direto). Configure as mesmas variáveis
de `.env.example` nas variáveis de ambiente do projeto de produção.
