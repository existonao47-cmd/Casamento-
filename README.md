# Banco de Dados — Amanda & Deivison

Execute os arquivos **nesta ordem**, no SQL Editor do Supabase:

1. `01_schema.sql` — tabelas, relacionamentos, extensões (pgcrypto, uuid-ossp), bucket de storage
2. `02_rls_policies.sql` — habilita RLS em tudo; só cria policies públicas para dados não sensíveis
3. `03_functions_auth.sql` — login admin, troca de senha, validação de sessão
4. `04_functions_public.sql` — busca de convite, confirmação de presença, reserva de presente
5. `05_functions_admin.sql` — todo o CRUD do painel administrativo
6. `06_storage_policies.sql` — leitura pública do bucket `site-assets`
7. `07_seed.sql` — categorias de presentes e configurações iniciais (opcional)

Depois, faça o deploy da Edge Function de upload:

```bash
supabase functions deploy admin-upload-gallery
```

## Criando o primeiro usuário admin

Depois de rodar os arquivos acima, cadastre seu usuário admin rodando (com
sua própria senha) diretamente no SQL Editor:

```sql
insert into usuarios_admin (email, senha_hash)
values ('seuemail@exemplo.com', crypt('sua-senha-forte-aqui', gen_salt('bf')));
```

## Por que tudo passa por funções em vez de policies diretas?

Não usamos Supabase Auth para o admin (login é por e-mail/senha com hash
`pgcrypto` numa tabela própria, `usuarios_admin`), então não existe
`auth.uid()` para as policies de RLS usarem. Em vez de deixar qualquer
tabela sensível (`convidados`, `familias`, `codigos_convite`,
`confirmacoes`, `acompanhantes`, `mensagens` completas) acessível por
policies "abertas", **nenhuma policy é criada para elas** — o RLS bloqueia
tudo por padrão. Todo acesso passa por funções `SECURITY DEFINER`, que
rodam com o privilégio do dono da função (ignorando RLS) e cada uma
valida explicitamente:

- Para rotas públicas (RSVP, presentes): a regra de negócio (ex.: código
  de convite existe e não foi usado, presente ainda está disponível).
- Para rotas do painel: um token de sessão válido e não expirado, via
  `validate_admin_session(p_token)`.

Isso também resolve, de forma definitiva, o bug de `search_path` do
`pgcrypto` que travava o login antes: toda função aqui declara
`set search_path = public, extensions` explicitamente, então `crypt()` e
`gen_salt()` são sempre resolvidos do schema correto, independentemente
de onde a extensão foi instalada ou do search_path da sessão que chama a
função.

## Uploads de imagem (galeria)

O client nunca tem permissão de escrita direta no Storage. O upload
passa pela Edge Function `admin-upload-gallery`
(`supabase/functions/admin-upload-gallery/index.ts`), que:

1. Recebe o token de sessão + arquivo via `FormData`
2. Valida o token com `validate_admin_session` (usando a service role key)
3. Só então faz o upload no bucket `site-assets` e insere a linha em `galeria`

Isso evita que a `anon key` (exposta no client) tenha qualquer permissão
de escrita em Storage.
