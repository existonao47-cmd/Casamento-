# Amanda & Deivison — Site de Casamento

Projeto completo, seguindo a identidade visual do convite (paleta vinho/
azul-marinho/dourado/sálvia sobre papel creme, tipografia script + serifada,
cantos florais, monograma "A | D").

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha com suas credenciais do Supabase
npm run dev
```

## Como publicar o banco de dados

Siga `database/README.md` — execute os arquivos SQL na ordem indicada e
faça o deploy da Edge Function de upload.

## Estrutura

```
src/
  components/     componentes reutilizáveis (cards, modais, navbar, etc.)
  components/admin/  componentes exclusivos do painel
  pages/          uma página por rota pública
  pages/admin/    telas do painel administrativo
  layouts/        MainLayout (público) e AdminLayout (painel)
  hooks/          useCountdown, useSEO
  services/       toda comunicação com Supabase (RPCs e queries)
  context/        ThemeContext (modo escuro), AdminAuthContext
  lib/            cliente Supabase, helpers
  utils/          formatação, sanitização, geração de .ics
  types/          tipos espelhando o schema SQL
database/         schema, RLS, funções SQL, seed — ver README próprio
supabase/functions/  Edge Function de upload seguro da galeria
public/           robots.txt, sitemap.xml, .htaccess (Hostinger)
```

## Funcionalidades implementadas

- Home com hero em tela cheia, contador regressivo em tempo real, parallax leve e animações
- Nossa História — timeline animada com scroll reveal
- Galeria — grid com lazy loading, lightbox fullscreen com zoom e navegação por teclado
- Cerimônia — data/local/mapa incorporado, botão "Como Chegar" e "Adicionar à Agenda" (.ics)
- Dress Code com paleta visual e orientações
- Lista de Presentes conectada ao Supabase — filtros, busca, barra de progresso, reserva atômica
- RSVP por código exclusivo do convite (não por nome), com acompanhantes e restrições alimentares
- Mural de recados público, com moderação no painel
- Painel administrativo completo: dashboard, convidados, famílias, geração de códigos,
  confirmações (exportação PDF), presentes (CRUD), mural (moderação), galeria (upload seguro)
- Banco de dados com RLS fechada por padrão e todo acesso sensível via RPC `SECURITY DEFINER`
- SEO (title/description dinâmicos, Open Graph, sitemap, robots.txt)
- Dark mode, pétalas caindo discretamente, cursor elegante, loader, música opcional
- Responsivo mobile-first, lazy loading de rotas e imagens

Veja `REVIEW.md` para a revisão final (bugs corrigidos e pontos que
dependem de você antes do deploy).
