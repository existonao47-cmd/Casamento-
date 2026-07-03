-- ============================================================
-- FUNÇÕES — Parte 3: Painel Administrativo
-- Todas exigem p_token válido (validate_admin_session lança exceção
-- 'invalid_session' caso contrário, que a função propaga).
-- ============================================================

-- ---------- Dashboard ----------
create or replace function get_dashboard_stats(p_token uuid)
returns table (
  "totalConvidados" int,
  "confirmados" int,
  "pendentes" int,
  "recusados" int,
  "totalAcompanhantes" int,
  "presentesReservados" int,
  "totalMensagens" int
)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform validate_admin_session(p_token);

  return query
    select
      (select count(*)::int from convidados),
      (select count(*)::int from confirmacoes where status = 'confirmado'),
      (select count(*)::int from codigos_convite where utilizado = false),
      (select count(*)::int from confirmacoes where status = 'recusado'),
      (select coalesce(sum(quantidade_acompanhantes), 0)::int from confirmacoes where status = 'confirmado'),
      (select count(*)::int from presentes where status = 'reservado'),
      (select count(*)::int from mensagens);
end;
$$;

revoke all on function get_dashboard_stats(uuid) from public;
grant execute on function get_dashboard_stats(uuid) to anon, authenticated;

-- ---------- Famílias ----------
create or replace function admin_list_families(p_token uuid)
returns setof familias
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  return query select * from familias order by nome;
end;
$$;
revoke all on function admin_list_families(uuid) from public;
grant execute on function admin_list_families(uuid) to anon, authenticated;

create or replace function admin_create_family(p_token uuid, p_nome text)
returns familias
language plpgsql security definer set search_path = public, extensions as $$
declare v_row familias%rowtype;
begin
  perform validate_admin_session(p_token);
  insert into familias (nome) values (p_nome) returning * into v_row;
  return v_row;
end;
$$;
revoke all on function admin_create_family(uuid, text) from public;
grant execute on function admin_create_family(uuid, text) to anon, authenticated;

create or replace function admin_delete_family(p_token uuid, p_id uuid)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  delete from familias where id = p_id;
end;
$$;
revoke all on function admin_delete_family(uuid, uuid) from public;
grant execute on function admin_delete_family(uuid, uuid) to anon, authenticated;

-- ---------- Convidados ----------
create or replace function admin_list_guests(p_token uuid)
returns setof convidados
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  return query select * from convidados order by nome;
end;
$$;
revoke all on function admin_list_guests(uuid) from public;
grant execute on function admin_list_guests(uuid) to anon, authenticated;

create or replace function admin_create_guest(
  p_token uuid, p_familia_id uuid, p_nome text, p_email text, p_telefone text
)
returns convidados
language plpgsql security definer set search_path = public, extensions as $$
declare v_row convidados%rowtype;
begin
  perform validate_admin_session(p_token);
  insert into convidados (familia_id, nome, email, telefone)
  values (p_familia_id, p_nome, nullif(p_email, ''), nullif(p_telefone, ''))
  returning * into v_row;
  return v_row;
end;
$$;
revoke all on function admin_create_guest(uuid, uuid, text, text, text) from public;
grant execute on function admin_create_guest(uuid, uuid, text, text, text) to anon, authenticated;

create or replace function admin_update_guest(
  p_token uuid, p_id uuid, p_nome text, p_email text, p_telefone text
)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  update convidados
  set nome = coalesce(p_nome, nome),
      email = nullif(p_email, ''),
      telefone = nullif(p_telefone, '')
  where id = p_id;
end;
$$;
revoke all on function admin_update_guest(uuid, uuid, text, text, text) from public;
grant execute on function admin_update_guest(uuid, uuid, text, text, text) to anon, authenticated;

create or replace function admin_delete_guest(p_token uuid, p_id uuid)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  delete from convidados where id = p_id;
end;
$$;
revoke all on function admin_delete_guest(uuid, uuid) from public;
grant execute on function admin_delete_guest(uuid, uuid) to anon, authenticated;

-- ---------- Códigos de convite ----------
create or replace function generate_invite_code(p_token uuid, p_familia_id uuid, p_quantidade_maxima int)
returns codigos_convite
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_row codigos_convite%rowtype;
  v_codigo text;
  v_tentativas int := 0;
begin
  perform validate_admin_session(p_token);

  loop
    v_codigo := 'FAM' || lpad((floor(random() * 900) + 100)::int::text, 3, '0');
    exit when not exists (select 1 from codigos_convite where codigo = v_codigo);
    v_tentativas := v_tentativas + 1;
    if v_tentativas > 20 then
      raise exception 'could_not_generate_unique_code';
    end if;
  end loop;

  insert into codigos_convite (codigo, familia_id, quantidade_maxima)
  values (v_codigo, p_familia_id, greatest(1, p_quantidade_maxima))
  returning * into v_row;

  return v_row;
end;
$$;
revoke all on function generate_invite_code(uuid, uuid, int) from public;
grant execute on function generate_invite_code(uuid, uuid, int) to anon, authenticated;

create or replace function admin_list_invite_codes(p_token uuid)
returns setof codigos_convite
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  return query select * from codigos_convite order by codigo;
end;
$$;
revoke all on function admin_list_invite_codes(uuid) from public;
grant execute on function admin_list_invite_codes(uuid) to anon, authenticated;

-- ---------- Confirmações ----------
create or replace function admin_list_confirmations(p_token uuid)
returns table (
  id uuid,
  status text,
  quantidade_acompanhantes int,
  restricao_alimentar text,
  mensagem text,
  confirmado_em timestamptz,
  familia_nome text
)
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  return query
    select c.id, c.status, c.quantidade_acompanhantes, c.restricao_alimentar, c.mensagem, c.confirmado_em, f.nome
    from confirmacoes c
    join familias f on f.id = c.familia_id
    order by c.confirmado_em desc;
end;
$$;
revoke all on function admin_list_confirmations(uuid) from public;
grant execute on function admin_list_confirmations(uuid) to anon, authenticated;

-- ---------- Presentes (admin) ----------
create or replace function admin_create_gift(
  p_token uuid, p_categoria_id uuid, p_nome text, p_descricao text, p_valor numeric, p_imagem_url text
)
returns presentes
language plpgsql security definer set search_path = public, extensions as $$
declare v_row presentes%rowtype;
begin
  perform validate_admin_session(p_token);
  insert into presentes (categoria_id, nome, descricao, valor, imagem_url, status)
  values (p_categoria_id, p_nome, nullif(p_descricao, ''), p_valor, nullif(p_imagem_url, ''), 'disponivel')
  returning * into v_row;
  return v_row;
end;
$$;
revoke all on function admin_create_gift(uuid, uuid, text, text, numeric, text) from public;
grant execute on function admin_create_gift(uuid, uuid, text, text, numeric, text) to anon, authenticated;

create or replace function admin_update_gift(
  p_token uuid, p_id uuid, p_nome text, p_descricao text, p_valor numeric, p_imagem_url text
)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  update presentes
  set nome = coalesce(p_nome, nome),
      descricao = nullif(p_descricao, ''),
      valor = coalesce(p_valor, valor),
      imagem_url = nullif(p_imagem_url, '')
  where id = p_id;
end;
$$;
revoke all on function admin_update_gift(uuid, uuid, text, text, numeric, text) from public;
grant execute on function admin_update_gift(uuid, uuid, text, text, numeric, text) to anon, authenticated;

create or replace function admin_delete_gift(p_token uuid, p_id uuid)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  delete from presentes where id = p_id;
end;
$$;
revoke all on function admin_delete_gift(uuid, uuid) from public;
grant execute on function admin_delete_gift(uuid, uuid) to anon, authenticated;

-- ---------- Mural (admin) ----------
create or replace function admin_list_messages(p_token uuid)
returns setof mensagens
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  return query select * from mensagens order by created_at desc;
end;
$$;
revoke all on function admin_list_messages(uuid) from public;
grant execute on function admin_list_messages(uuid) to anon, authenticated;

create or replace function admin_delete_message(p_token uuid, p_id uuid)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  delete from mensagens where id = p_id;
end;
$$;
revoke all on function admin_delete_message(uuid, uuid) from public;
grant execute on function admin_delete_message(uuid, uuid) to anon, authenticated;

-- ---------- Galeria (admin) ----------
create or replace function admin_add_gallery_item(p_token uuid, p_imagem_url text, p_legenda text, p_ordem int)
returns galeria
language plpgsql security definer set search_path = public, extensions as $$
declare v_row galeria%rowtype;
begin
  perform validate_admin_session(p_token);
  insert into galeria (imagem_url, legenda, ordem)
  values (p_imagem_url, nullif(p_legenda, ''), coalesce(p_ordem, 0))
  returning * into v_row;
  return v_row;
end;
$$;
revoke all on function admin_add_gallery_item(uuid, text, text, int) from public;
grant execute on function admin_add_gallery_item(uuid, text, text, int) to anon, authenticated;

create or replace function admin_delete_gallery_item(p_token uuid, p_id uuid)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform validate_admin_session(p_token);
  delete from galeria where id = p_id;
end;
$$;
revoke all on function admin_delete_gallery_item(uuid, uuid) from public;
grant execute on function admin_delete_gallery_item(uuid, uuid) to anon, authenticated;
