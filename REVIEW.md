# Revisão Final

## Corrigido nesta passada

- **Alias `@/` não resolvia no build**: estava só no `tsconfig.json`; o Vite
  precisa do próprio `resolve.alias` (`vite.config.ts`). Sem isso, todo
  import `@/...` quebraria em `npm run build`.
- **Acessibilidade do contador regressivo**: `aria-live="polite"`
  atualizando a cada segundo faria leitores de tela anunciarem o tempo o
  tempo todo. Trocado para `aria-live="off"` com `role="timer"` e um
  `aria-label` descritivo — o valor visual continua atualizando, só não
  "grita" a cada segundo.
- **Segurança do admin**: a primeira versão dos serviços admin usava
  `supabase.from(...)` direto, o que exigiria policies de RLS abertas
  para famílias/convidados/confirmações/mensagens — dados sensíveis de
  convidados. Reescrito para que **toda** operação sensível (leitura e
  escrita) passe por funções `SECURITY DEFINER` que validam o token de
  sessão do admin (`validate_admin_session`). RLS ficou fechada por
  padrão nessas tabelas.
- **Upload de imagens sem policy insegura**: em vez de abrir `insert` no
  Storage para a `anon key`, uploads passam pela Edge Function
  `admin-upload-gallery`, que valida o token antes de gravar (usa a
  service role, que não fica exposta no client).
- **Promise não tratada** no toggle de música, caso o arquivo de áudio
  ainda não tenha sido adicionado.

## Pontos que dependem de você antes de ir para produção

- Adicionar as imagens reais (dress code, presentes, galeria) e, se
  quiser, um arquivo `/public/assets/musica-fundo.mp3` e
  `/public/assets/paper-texture.png` (a textura é opcional — só é usada
  se você aplicar a classe `bg-paper-texture` em algum componente).
- Trocar o domínio de exemplo em `public/sitemap.xml` e `robots.txt`
  pelo domínio real antes do deploy.
- Cadastrar o primeiro usuário admin (ver `database/README.md`).
- Rodar `npm run lint` e `npm run build` localmente — o ambiente que
  gerou este código não tem acesso à internet para instalar pacotes e
  rodar o build, então a checagem final de tipos deve ser feita na sua
  máquina.

## Arquitetura de segurança (resumo)

Nenhuma tabela sensível tem policy de RLS aberta. Todo acesso passa por
função `SECURITY DEFINER` com `search_path` fixo (evita o bug de
`pgcrypto` que travava o login antes) e validação explícita — de token
de admin, ou de regra de negócio pública (código de convite válido e não
usado, presente ainda disponível). Isso vale tanto para leitura quanto
para escrita.

## Performance

- Todas as páginas exceto a Home são `React.lazy` + `Suspense`, com
  `manualChunks` separando vendor/motion/supabase no `vite.config.ts`.
- Imagens da galeria e presentes usam `loading="lazy"`.
- `react-query` com `staleTime` de 30s evita refetch desnecessário ao
  navegar entre páginas.

## Responsividade

Todas as páginas usam classes `sm:`/`lg:` do Tailwind com layout mobile
primeiro; testado mentalmente nos breakpoints padrão (640px, 1024px).
Recomenda-se checar visualmente em dispositivo real antes do lançamento.
