-- ============================================================
-- SCHEMA — Amanda & Deivison
-- Execute este arquivo primeiro no SQL Editor do Supabase.
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ---------- usuarios_admin ----------
create table if not exists usuarios_admin (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  senha_hash text not null,
  criado_em timestamptz not null default now()
);

-- ---------- admin_sessions ----------
-- Tokens de sessão do painel administrativo (não usamos Supabase Auth aqui
-- porque o login é feito via RPC customizada com hash pgcrypto).
create table if not exists admin_sessions (
  token uuid primary key default gen_random_uuid(),
  usuario_admin_id uuid not null references usuarios_admin(id) on delete cascade,
  criado_em timestamptz not null default now(),
  expira_em timestamptz not null
);

-- ---------- familias ----------
create table if not exists familias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

-- ---------- convidados ----------
create table if not exists convidados (
  id uuid primary key default gen_random_uuid(),
  familia_id uuid not null references familias(id) on delete cascade,
  nome text not null,
  email text,
  telefone text,
  created_at timestamptz not null default now()
);

-- ---------- codigos_convite ----------
create table if not exists codigos_convite (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  familia_id uuid not null references familias(id) on delete cascade,
  quantidade_maxima int not null default 1 check (quantidade_maxima > 0),
  utilizado boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_codigos_convite_codigo on codigos_convite (codigo);

-- ---------- confirmacoes ----------
create table if not exists confirmacoes (
  id uuid primary key default gen_random_uuid(),
  codigo_convite_id uuid not null unique references codigos_convite(id) on delete cascade,
  familia_id uuid not null references familias(id) on delete cascade,
  status text not null check (status in ('pendente', 'confirmado', 'recusado')) default 'pendente',
  quantidade_acompanhantes int not null default 0,
  restricao_alimentar text,
  mensagem text,
  confirmado_em timestamptz not null default now()
);

-- ---------- acompanhantes ----------
create table if not exists acompanhantes (
  id uuid primary key default gen_random_uuid(),
  confirmacao_id uuid not null references confirmacoes(id) on delete cascade,
  nome text not null,
  restricao_alimentar text
);

-- ---------- mensagens (mural) ----------
create table if not exists mensagens (
  id uuid primary key default gen_random_uuid(),
  nome_convidado text not null,
  mensagem text not null,
  aprovado boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- categorias_presentes ----------
create table if not exists categorias_presentes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ordem int not null default 0
);

-- ---------- presentes ----------
create table if not exists presentes (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias_presentes(id) on delete restrict,
  nome text not null,
  descricao text,
  valor numeric(10, 2) not null check (valor >= 0),
  imagem_url text,
  status text not null check (status in ('disponivel', 'reservado')) default 'disponivel',
  reservado_por text,
  created_at timestamptz not null default now()
);

create index if not exists idx_presentes_status on presentes (status);
create index if not exists idx_presentes_categoria on presentes (categoria_id);

-- ---------- galeria ----------
create table if not exists galeria (
  id uuid primary key default gen_random_uuid(),
  imagem_url text not null,
  legenda text,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- configuracoes_site ----------
create table if not exists configuracoes_site (
  chave text primary key,
  valor text not null
);

-- ============================================================
-- STORAGE
-- ============================================================
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;
