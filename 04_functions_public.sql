-- ============================================================
-- FUNÇÕES — Parte 2: Fluxos públicos (RSVP e Presentes)
-- ============================================================

-- Busca o convite pelo código. Não expõe a existência/inexistência de
-- outros códigos: retorna null se não encontrado.
create or replace function lookup_invite_code(p_codigo text)
returns table (
  familia_nome text,
  codigo_convite_id uuid,
  quantidade_maxima int,
  ja_confirmado boolean
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_codigo codigos_convite%rowtype;
begin
  select * into v_codigo from codigos_convite where codigo = upper(p_codigo);

  if v_codigo.id is null then
    return;
  end if;

  return query
    select
      f.nome,
      v_codigo.id,
      v_codigo.quantidade_maxima,
      v_codigo.utilizado
    from familias f
    where f.id = v_codigo.familia_id;
end;
$$;

revoke all on function lookup_invite_code(text) from public;
grant execute on function lookup_invite_code(text) to anon, authenticated;

-- Confirma presença de forma atômica: valida que o código existe e não
-- foi usado, insere a confirmação + acompanhantes, e marca o código como
-- utilizado — tudo em uma única transação de função, prevenindo condição
-- de corrida entre dois envios simultâneos do mesmo código.
create or replace function confirm_attendance(
  p_codigo_convite_id uuid,
  p_status text,
  p_acompanhantes jsonb,
  p_mensagem text
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_codigo codigos_convite%rowtype;
  v_confirmacao_id uuid;
  v_acompanhante jsonb;
begin
  if p_status not in ('confirmado', 'recusado') then
    raise exception 'invalid_status';
  end if;

  select * into v_codigo
  from codigos_convite
  where id = p_codigo_convite_id
  for update; -- trava a linha até o fim da transação

  if v_codigo.id is null then
    raise exception 'invalid_code';
  end if;

  if v_codigo.utilizado then
    raise exception 'already_used';
  end if;

  insert into confirmacoes (codigo_convite_id, familia_id, status, quantidade_acompanhantes, mensagem)
  values (
    v_codigo.id,
    v_codigo.familia_id,
    p_status,
    coalesce(jsonb_array_length(p_acompanhantes), 0),
    nullif(p_mensagem, '')
  )
  returning id into v_confirmacao_id;

  for v_acompanhante in select * from jsonb_array_elements(coalesce(p_acompanhantes, '[]'::jsonb))
  loop
    insert into acompanhantes (confirmacao_id, nome, restricao_alimentar)
    values (
      v_confirmacao_id,
      v_acompanhante ->> 'nome',
      nullif(v_acompanhante ->> 'restricao_alimentar', '')
    );
  end loop;

  update codigos_convite set utilizado = true where id = v_codigo.id;

  return v_confirmacao_id;
end;
$$;

revoke all on function confirm_attendance(uuid, text, jsonb, text) from public;
grant execute on function confirm_attendance(uuid, text, jsonb, text) to anon, authenticated;

-- Reserva um presente de forma atômica: só muda de "disponivel" para
-- "reservado" se ainda estiver disponível, evitando dois convidados
-- reservando o mesmo item ao mesmo tempo.
create or replace function reserve_gift(p_presente_id uuid, p_nome_convidado text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_updated int;
begin
  update presentes
  set status = 'reservado', reservado_por = p_nome_convidado
  where id = p_presente_id and status = 'disponivel';

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    raise exception 'already_reserved';
  end if;
end;
$$;

revoke all on function reserve_gift(uuid, text) from public;
grant execute on function reserve_gift(uuid, text) to anon, authenticated;
