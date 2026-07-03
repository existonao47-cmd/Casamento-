-- ============================================================
-- FUNÇÕES — Parte 1: Autenticação Admin
-- Execute depois do 02_rls_policies.sql.
--
-- IMPORTANTE: toda função abaixo define "set search_path = public, extensions"
-- explicitamente. Sem isso, funções SECURITY DEFINER podem falhar ao
-- resolver "crypt"/"gen_salt" do pgcrypto (ou pior, resolver um "crypt"
-- de outro schema), pois o search_path de uma função SECURITY DEFINER
-- não herda o search_path da sessão que a chama.
-- ============================================================

-- Helper interno: valida um token de sessão admin e retorna o id do
-- usuário, ou lança exceção 'invalid_session' se inválido/expirado.
create or replace function validate_admin_session(p_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_admin_id uuid;
begin
  select usuario_admin_id into v_admin_id
  from admin_sessions
  where token = p_token and expira_em > now();

  if v_admin_id is null then
    raise exception 'invalid_session';
  end if;

  return v_admin_id;
end;
$$;

revoke all on function validate_admin_session(uuid) from public;

-- Login: compara o hash com pgcrypto e cria uma sessão de 8 horas.
create or replace function admin_login(p_email text, p_senha text)
returns table (token uuid, email text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_admin usuarios_admin%rowtype;
  v_token uuid;
  v_expira timestamptz;
begin
  select * into v_admin from usuarios_admin where usuarios_admin.email = lower(p_email);

  if v_admin.id is null or v_admin.senha_hash <> crypt(p_senha, v_admin.senha_hash) then
    raise exception 'invalid_credentials';
  end if;

  v_expira := now() + interval '8 hours';

  insert into admin_sessions (usuario_admin_id, expira_em)
  values (v_admin.id, v_expira)
  returning admin_sessions.token into v_token;

  -- limpa sessões expiradas do mesmo usuário para não acumular lixo
  delete from admin_sessions
  where usuario_admin_id = v_admin.id and expira_em <= now();

  return query select v_token, v_admin.email, v_expira;
end;
$$;

revoke all on function admin_login(text, text) from public;
grant execute on function admin_login(text, text) to anon, authenticated;

-- Troca de senha: exige a senha atual e um token válido.
create or replace function admin_change_password(p_token uuid, p_senha_atual text, p_nova_senha text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_admin_id uuid;
  v_hash text;
begin
  v_admin_id := validate_admin_session(p_token);

  select senha_hash into v_hash from usuarios_admin where id = v_admin_id;

  if v_hash <> crypt(p_senha_atual, v_hash) then
    raise exception 'invalid_credentials';
  end if;

  if char_length(p_nova_senha) < 8 then
    raise exception 'weak_password';
  end if;

  update usuarios_admin
  set senha_hash = crypt(p_nova_senha, gen_salt('bf'))
  where id = v_admin_id;
end;
$$;

revoke all on function admin_change_password(uuid, text, text) from public;
grant execute on function admin_change_password(uuid, text, text) to anon, authenticated;

-- Cadastro do primeiro usuário admin (rode manualmente uma única vez, com
-- SUA senha, direto no SQL Editor do Supabase — depois disso, o cadastro
-- de novos admins deve ser feito por quem já está logado, com uma função
-- equivalente protegida por validate_admin_session).
-- Exemplo de uso (troque o e-mail e a senha antes de rodar):
--
-- insert into usuarios_admin (email, senha_hash)
-- values ('seuemail@exemplo.com', crypt('sua-senha-forte-aqui', gen_salt('bf')));
