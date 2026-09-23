# Ativação do Casa hoje

## Estado

O código local inclui duas migrações. Os testes locais passaram. A versão pública ainda informa `backendConfigured: false`.

O projeto informado é `texazhyvvhsqmboxjqis`. A URL pública é `https://texazhyvvhsqmboxjqis.supabase.co`.

## 1. Verificação do banco — Diego

1. Abra [SQL Editor](https://supabase.com/dashboard/project/texazhyvvhsqmboxjqis/sql).
2. Execute [activation-preflight.sql](../supabase/activation-preflight.sql).
3. Envie os seis valores retornados ao Codex.
4. Aguarde a indicação da migração correta.

Se todos os campos forem falsos, o banco ainda não contém as tabelas do Casa. Se os campos diferirem, peça análise antes de executar SQL.

## 2. Migrações — Diego, após a verificação

1. Execute [202609210001_households.sql](../supabase/migrations/202609210001_households.sql) somente se a migração inicial não existir.
2. Execute [202609230001_atomic_import.sql](../supabase/migrations/202609230001_atomic_import.sql) somente se a função `import_household_changes` não existir.
3. Execute novamente a consulta de verificação.
4. Envie o resultado ao Codex.

Não execute a migração inicial duas vezes. Ela cria tabelas e funções sem cláusulas de repetição.

## 3. Autenticação — Diego

1. Abra Authentication > URL Configuration no projeto.
2. Defina Site URL como `https://dilocris.github.io/Householder/`.
3. Adicione a mesma URL em Redirect URLs.
4. Mantenha o provedor Email ativo.
5. Se existir SMTP próprio, configure e teste a entrega antes dos cadastros.
6. Se não existir SMTP, crie duas contas pelo painel com e-mails próprios e senhas distintas.
7. Selecione a confirmação administrativa para cada conta criada pelo painel.
8. Mantenha a exigência global de confirmação de e-mail ativa.

O envio padrão do Supabase restringe os destinatários. Sem SMTP próprio, a recuperação de senha por e-mail não está validada.

## 4. Chave pública e publicação — Codex

1. Copie a chave `sb_publishable_` em Settings > API Keys.
2. Envie somente essa chave pública ao Codex.
3. Aguarde o Codex configurar a variável, publicar o código e verificar `release.json`.

Nunca envie `sb_secret_`, `service_role`, senha ou token de acesso no chat.

## 5. Aceite nos celulares — Diego e esposa

1. Abra `https://dilocris.github.io/Householder/` no Chrome de cada Android.
2. Aceite a atualização do aplicativo, se aparecer.
3. Entre com uma conta diferente em cada aparelho.
4. Crie o espaço familiar no primeiro aparelho.
5. Gere um convite em Configurações > Convidar pessoa.
6. Use o código no segundo aparelho.
7. Crie uma compra de teste no primeiro aparelho.
8. Verifique a compra no segundo aparelho sem recarregar.
9. Edite e conclua a compra nos dois sentidos.
10. Repita uma inclusão de teste em tarefas, despesas e eventos.
11. Informe ao Codex os resultados e as mensagens de erro.

## 6. Dados existentes

1. Exporte os dados do navegador original.
2. Guarde o arquivo fora do repositório.
3. Confira a contagem e os registros antes da importação.
4. Importe somente para um espaço vazio.
5. Verifique os dados nos dois aparelhos.

A importação não apaga a cópia local original. A publicação do código também não altera os registros locais.
