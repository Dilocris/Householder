# Roadmap do Supabase

## Estado atual

O site usa arquivos estáticos no diretório `dist`.

O servidor local existe somente para a prévia em `127.0.0.1:4173`.

Os dados do protótipo ficam no navegador atual.

O site ainda não possui conta, sincronização ou banco remoto.

## Tarefas adequadas para Luna Extra High

Estas tarefas possuem escopo local e baixo risco.

- Mapear as chaves e os formatos atuais do armazenamento local.
- Separar o código de inicialização do código de interface.
- Preparar o cliente Supabase sem inserir chaves reais.
- Adicionar `.env.example` com nomes de variáveis públicas.
- Preparar `npm run build` para o GitHub Actions.
- Criar uma exportação JSON dos dados locais.
- Criar estados de carregamento, erro e sessão.
- Adicionar testes para o cliente e para a exportação.

## Tarefas reservadas para um modelo mais robusto

Estas tarefas exigem decisões de segurança ou de arquitetura.

- Definir o modelo final de casas, membros e papéis.
- Definir a migração dos dados locais para uma casa autenticada.
- Escrever e revisar as políticas RLS de todas as tabelas.
- Testar o bloqueio de acesso entre casas diferentes.
- Definir convites, recuperação de conta e troca de e-mail.
- Definir a política para conflito entre dois celulares.
- Definir a fila offline e a idempotência das operações.
- Revisar exposição de dados pessoais e requisitos de privacidade.
- Aprovar SMTP, backups, logs e critérios de aceitação pública.

## Ordem de execução

1. Concluir o inventário local.
2. Preparar o build e o cliente Supabase.
3. Criar um projeto Supabase de teste.
4. Aprovar o modelo de dados e as políticas RLS.
5. Implementar a autenticação.
6. Migrar uma tela completa para o banco.
7. Validar dois usuários em duas casas.
8. Migrar as outras telas.
9. Configurar produção e executar o aceite público.

## Gate de segurança

Não publicar dados reais antes da revisão das políticas RLS.
