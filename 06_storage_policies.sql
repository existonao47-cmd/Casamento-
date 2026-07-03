-- ============================================================
-- STORAGE POLICIES — bucket "site-assets"
-- Leitura pública (para exibir fotos no site), mas NENHUMA policy de
-- insert/update/delete para anon/authenticated: uploads só acontecem
-- através da Edge Function `admin-upload-gallery`, que roda com a
-- service role key (bypassa RLS) e só faz o upload depois de validar o
-- token de sessão do admin via `validate_admin_session`.
-- ============================================================

create policy "site_assets_select_publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-assets');

-- Nenhuma policy de insert/update/delete é criada aqui de propósito.
