# Casa: ativação do espaço compartilhado

## Estado desta entrega

O GitHub Pages hospeda o PWA. O build contém autenticação, convites, importação e sincronização por registro.

Diego informou o projeto Supabase `texazhyvvhsqmboxjqis`. A migração hospedada ainda não foi verificada. A versão publicada mantém o modo local enquanto as variáveis públicas estão vazias.

O banco possui testes locais com PostgreSQL em memória. A interface possui testes com duas sessões simuladas.

Esses testes não substituem o aceite com duas contas no Supabase hospedado e dois celulares Android.

## Evidência atual

| Camada | Estado verificado |
| --- | --- |
| Código local | Duas migrações, importação atômica e 16 testes aprovados. |
| Supabase hospedado | Projeto informado por Diego. Migrações, autenticação e Realtime sem verificação. |
| Publicação | `release.json` mostra `backendConfigured: false` e versão `47745239f53a94ec`. |
| Celulares Android | Sem teste de duas contas ou aceite nos aparelhos. |

## Configuração do Supabase

1. Abra o [projeto informado](https://supabase.com/dashboard/project/texazhyvvhsqmboxjqis).
2. Verifique o esquema e os registros existentes antes de executar SQL.
3. Execute `supabase/migrations/202609210001_households.sql` somente se a migração inicial não existir.
4. Execute `supabase/migrations/202609230001_atomic_import.sql` depois da migração inicial.
5. Configure o Site URL como `https://dilocris.github.io/Householder/`.
6. Adicione esse mesmo endereço aos redirecionamentos permitidos.
7. Ative a autenticação por e-mail e senha.
8. Configure o SMTP para confirmação de cadastro e recuperação de senha.
9. Verifique os limites e os destinatários permitidos do provedor de e-mail.
10. Cadastre duas contas de teste antes de importar dados reais.

## Configuração do GitHub

1. Abra Settings > Secrets and variables > Actions > Variables.
2. Adicione `SUPABASE_URL` com a URL pública do projeto.
3. Adicione `SUPABASE_PUBLISHABLE_KEY` com a chave publishable ou anon.
4. Execute o workflow Validate and deploy Casa.
5. Verifique o resultado dos testes e da publicação.

Não use `service_role` ou uma chave `sb_secret_` no aplicativo. O build rejeita essas chaves administrativas.

## Uso por duas pessoas

1. Abra o endereço publicado no Chrome do Android.
2. Instale o aplicativo pelo menu do navegador.
3. Crie sua conta e confirme o e-mail.
4. Entre e crie o espaço da família.
5. Abra Configurações > Convidar pessoa.
6. Compartilhe o código diretamente com a outra pessoa.
7. Na segunda conta, informe o código em Espaço da família.

O convite vale por 24 horas e permite uma entrada. Cada espaço aceita duas contas nesta versão.

## Importação

1. Exporte os dados do navegador original antes da migração.
2. Abra Configurações > Importar dados na conta autenticada.
3. Selecione a exportação ou os dados locais deste navegador.
4. Confira a contagem de registros.
5. Confirme a importação para um espaço vazio.

A importação preserva o armazenamento local original. Registros demonstrativos também entram na importação se estiverem no arquivo escolhido.

## Contrato de sincronização

Cada registro possui uma revisão. O servidor aceita a gravação somente quando a revisão recebida coincide com a revisão atual.

Um lote altera vários registros de forma atômica. Um conflito cancela todo o lote.

Cada tentativa possui um identificador. O reenvio da mesma tentativa não duplica os registros.

Exclusões mantêm um marcador de versão. Uma edição antiga não restaura um registro excluído.

A interface aguarda o fim da edição antes de aplicar dados recebidos. Ela não substitui formulários abertos durante uma atualização remota.

Sem conexão, a interface permite consulta ao último estado carregado. Novas edições offline não estão disponíveis nesta versão.

Uma gravação interrompida permanece no aparelho para reenvio. Um conflito oferece exportação da tentativa e recarga da versão compartilhada.

A lista de responsáveis usa os nomes únicos dos membros nesta versão. Alteração de nome e identificadores de responsáveis precisam de uma migração futura.

## Aceite obrigatório na instalação hospedada

- Duas contas da mesma família recebem inclusão, edição e conclusão de uma compra.
- Uma terceira conta em outro espaço não lê nem altera os registros da família.
- Duas edições do mesmo registro produzem um conflito visível.
- Uma queda de conexão durante a gravação não duplica dados após o reenvio.
- A sessão expirada não permite leitura ou edição de outra conta.
- O aplicativo abre após instalação no Android.
- Uma atualização troca a versão após aceite do usuário.
- O modo offline mostra os últimos dados e bloqueia novas edições.

## Limites restantes

Notificações com o aplicativo fechado, integração Google Calendar, alterações de conta e edição offline continuam pendentes.

Os lembretes de WhatsApp ainda exigem o aplicativo aberto. Abrir o WhatsApp não envia a mensagem automaticamente.

O modelo financeiro atual cria uma quantidade finita de ocorrências. A geração contínua de vencimentos exige um processo no servidor.

O banco mantém os recibos de operações para idempotência. A manutenção desses recibos precisa de uma política de retenção antes de uso em escala.