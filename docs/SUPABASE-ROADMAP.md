# Estado da integração Supabase

A implementação está em `dist/cloud.js`, `dist/sync-core.js` e `supabase/migrations/202609210001_households.sql`.

O build usa as variáveis públicas `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`. Sem essas variáveis, o aplicativo permanece local.

O projeto Supabase ainda precisa ser criado. O roteiro de ativação está em [ATIVACAO-ONLINE.md](ATIVACAO-ONLINE.md).

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

- Criar projeto, aplicar migração e configurar autenticação e e-mail.
- Configurar variáveis públicas no GitHub Actions.
- Executar o aceite com duas contas reais e dois aparelhos.
- Verificar isolamento com uma conta de outra família no ambiente hospedado.

Os testes locais usam dados sintéticos. Eles não comprovam Realtime ou entrega de e-mail no Supabase hospedado.