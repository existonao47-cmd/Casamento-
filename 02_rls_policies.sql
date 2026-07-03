-- ============================================================
-- ROW LEVEL SECURITY — Amanda & Deivison
-- Execute depois do 01_schema.sql.
--
-- Estratégia: RLS habilitada em TODAS as tabelas. Para dados públicos
-- (presentes, categorias, galeria, mural aprovado) criamos policies de
-- leitura restritas às colunas necessárias via view/policy simples.
-- Para tudo que envolve dados sensíveis (convidados, famílias, códigos de
-- convite, confirmações, acompanhantes, usuários admin, sessões) NÃO
-- criamos nenhuma policy — o acesso só é possível através de funções
-- SECURITY DEFINER (arquivo 03_functions.sql), que rodam com privilégios
-- do dono da função e validam o token de sessão internamente. Isso evita
-- qualquer leitura ou escrita direta dessas tabelas pelo client, mesmo
-- com a anon key.
-- ============================================================

alter table usuarios_admin enable row level security;
alter table admin_sessions enable row level security;
alter table familias enable row level security;
alter table convidados enable row level security;
alter table codigos_convite enable row level security;
alter table confirmacoes enable row level security;
alter table acompanhantes enable row level security;
alter table mensagens enable row level security;
alter table categorias_presentes enable row level security;
alter table presentes enable row level security;
alter table galeria enable row level security;
alter table configuracoes_site enable row level security;

-- ---------- Leitura pública ----------

create policy "categorias_presentes_select_publica"
  on categorias_presentes for select
  to anon, authenticated
  using (true);

create policy "presentes_select_publica"
  on presentes for select
  to anon, authenticated
  using (true);

create policy "galeria_select_publica"
  on galeria for select
  to anon, authenticated
  using (true);

create policy "configuracoes_site_select_publica"
  on configuracoes_site for select
  to anon, authenticated
  using (true);

-- Mural: leitura pública apenas de mensagens aprovadas.
create policy "mensagens_select_aprovadas"
  on mensagens for select
  to anon, authenticated
  using (aprovado = true);

-- Mural: inserção pública permitida (moderação/remoção fica só no admin,
-- via RPC). O valor de "aprovado" é forçado a true na sanitização feita
-- no client e pode ser revisto no painel administrativo.
create policy "mensagens_insert_publica"
  on mensagens for insert
  to anon, authenticated
  with check (
    char_length(nome_convidado) between 1 and 80
    and char_length(mensagem) between 1 and 2000
  );

-- Todas as demais tabelas (usuarios_admin, admin_sessions, familias,
-- convidados, codigos_convite, confirmacoes, acompanhantes) permanecem
-- sem nenhuma policy: nenhuma linha é visível ou editável diretamente
-- pelo client, em nenhuma operação. Só as funções SECURITY DEFINER
-- (executadas com o privilégio do owner, ignorando RLS) conseguem
-- acessá-las — e cada uma delas valida o token de sessão do admin ou a
-- regra de negócio pública correspondente (ex.: lookup por código).
