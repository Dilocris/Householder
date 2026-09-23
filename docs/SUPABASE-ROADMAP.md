# Estado da integração Supabase

A implementação está em `dist/cloud.js`, `dist/sync-core.js` e nas migrações em `supabase/migrations/`. A segunda migração impede duas importações para o mesmo espaço.

O build usa as variáveis públicas `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`. Sem essas variáveis, o aplicativo permanece local.

Diego informou o projeto `texazhyvvhsqmboxjqis`. A aplicação das migrações e o acesso hospedado ainda não foram verificados. O roteiro está em [ATIVACAO-ONLINE.md](ATIVACAO-ONLINE.md).

## Concluído no código

- Autenticação por e-mail, cadastro e recuperação de senha.
- Criação de espaço e convite de uso único para o segundo membro.
- Políticas RLS de leitura e funções de gravação com verificação de membro.
- Controle de revisão por registro e transações atômicas.
- Reenvio idempotente de gravações interrompidas.
- Sincronização Realtime e consulta periódica de recuperação.
- Importação explícita para espaço vazio e exportação de tentativa em conflito.
- Preferências de tema por aparelho.
- Atualização do PWA com confirmação e caches restritos ao Casa.
- Testes locais de banco, interface, importação e PWA.

## Pendente para produção compartilhada

- Verificar o projeto informado, aplicar as duas migrações e configurar autenticação e e-mail.
- Configurar variáveis públicas no GitHub Actions.
- Executar o aceite com duas contas reais e dois aparelhos.
- Verificar isolamento com uma conta de outra família no ambiente hospedado.

Os testes locais usam dados sintéticos. Eles não comprovam Realtime ou entrega de e-mail no Supabase hospedado.