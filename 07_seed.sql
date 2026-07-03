-- ============================================================
-- SEED — dados iniciais opcionais
-- ============================================================

insert into categorias_presentes (nome, ordem) values
  ('Cozinha', 1),
  ('Casa', 2),
  ('Eletrodomésticos', 3),
  ('Lua de Mel', 4),
  ('Diversos', 5)
on conflict do nothing;

insert into configuracoes_site (chave, valor) values
  ('nome_noivos', 'Amanda & Deivison'),
  ('data_casamento', '2026-11-14T17:30:00-03:00'),
  ('local_cerimonia', 'Paróquia Senhor do Bonfim, Ipatinga - MG')
on conflict (chave) do update set valor = excluded.valor;
