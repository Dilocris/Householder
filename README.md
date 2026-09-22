# Casa

PWA familiar com publicação pelo GitHub Pages.

A integração compartilhada depende de um projeto Supabase. Sem configuração, os registros permanecem somente no navegador atual.

Instalação: abra https://dilocris.github.io/Householder/ no Chrome do Android e use Instalar aplicativo.

Não é necessário baixar o repositório para instalar o PWA.

## Desenvolvimento

1. Execute `npm ci`.
2. Execute `npm test`.
3. Execute `npm run build`.
4. Execute `npm start`.
5. Abra `http://127.0.0.1:4173`.

Para conectar o backend, copie `.env.example` para `.env` e configure os valores públicos do seu projeto.

O diretório `dist` contém o código-fonte da interface. O diretório `build` contém os arquivos publicados e não entra no Git.

O workflow executa testes antes da publicação. O hash do conteúdo identifica cada versão do service worker.

## Estado verificado em 21/09/2026

Quinze testes locais passaram. Eles cobrem banco, permissões, conflitos, duas sessões simuladas, importação e atualização do PWA.

O projeto Supabase ainda não está conectado. A instalação Android e a sincronização hospedada aguardam aceite em aparelhos reais.

[Ativação e critérios de aceite](docs/ATIVACAO-ONLINE.md).

[Plano de UX](docs/PLANO-UX.md).

## Recursos

- Agenda local compartilhável e mensagens com link para o WhatsApp.
- Lista de mercado, categorias e acompanhamento de reposição.
- Receitas, despesas, parcelas e séries com quantidade definida de ocorrências.
- Decks, tarefas, responsáveis e checklists.
- Temas claro, escuro e do sistema.
- Login, espaço privado, convite e sincronização quando o backend está configurado.

## Limites

O PWA não envia mensagens pelo WhatsApp. Ele abre a conversa com o texto preenchido.

Google Calendar e notificações com o aplicativo fechado ainda não estão conectados.

O modo compartilhado permite consulta offline. Novas edições exigem conexão.