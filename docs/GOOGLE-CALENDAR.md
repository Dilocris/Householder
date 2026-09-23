# Conectar o Google Calendar ao Casa

## O que esta configuração faz

O Casa lê uma agenda Google que aparece nas duas contas. Cada pessoa conecta sua própria conta Google no celular.

O Casa não altera eventos Google. Ele não copia esses eventos para o Supabase.

A conexão ainda está inativa. Falta criar um OAuth Client ID no Google Cloud e informar esse ID ao Codex.

## Antes de começar

Use um computador com a conta Google que administra o projeto no Google Cloud.

Confirme que a agenda compartilhada já aparece no Google Calendar das duas contas. Você informou que ela aparece.

O Google Cloud possui dois seletores diferentes: conta Google e projeto.

Verifique o projeto selecionado no topo de cada página.

## 1. Escolher o projeto e ativar a API

1. Abra o [Google Cloud Console](https://console.cloud.google.com/).
2. Entre com a conta Google que administra o projeto.
3. Clique no nome do projeto no topo da página.
4. Selecione um projeto existente para o Casa ou crie um projeto novo.
5. Abra Menu > APIs e serviços > Biblioteca.
6. Pesquise Google Calendar API.
7. Abra o resultado com esse nome.
8. Clique em Ativar.

Se o botão mostrar Gerenciar, a API já está ativa.

## 2. Configurar a tela de consentimento

1. Abra Menu > Google Auth Platform > Branding.
2. Se aparecer Get started ou Começar, clique nesse botão.
3. Informe Casa em App name.
4. Escolha seu e-mail em User support email.
5. Avance para Audience.
6. Escolha External se vocês usam contas Google pessoais.
7. Informe seu e-mail em Contact Information.
8. Aceite a política apresentada e conclua a configuração.
9. Abra Google Auth Platform > Audience.
10. Confirme que o estado do app é Testing.
11. Em Test users, clique em Add users.
12. Adicione sua conta Google e a conta Google da sua esposa.
13. Clique em Save.

Use as contas Google que vão autorizar a agenda. Elas podem ser diferentes dos e-mails usados no Supabase.

## 3. Data Access: adicionar os dois escopos

Esta é a parte que autoriza o Casa a ler a lista de agendas e os eventos.

1. Confira o projeto selecionado no topo do Google Cloud Console.
2. Abra Menu > Google Auth Platform > Data Access.
3. Clique em Add or Remove Scopes.
4. Na janela aberta, procure o campo de filtro ou pesquisa.
5. Pesquise calendar.events.readonly.
6. Marque a linha com o endereço exato abaixo:

    https://www.googleapis.com/auth/calendar.events.readonly

7. Limpe o filtro.
8. Pesquise calendar.calendarlist.readonly.
9. Marque a linha com o endereço exato abaixo:

    https://www.googleapis.com/auth/calendar.calendarlist.readonly

10. Confirme que as duas linhas estão marcadas.
11. Clique em Update ou Atualizar na janela de seleção, se esse botão aparecer.
12. Clique em Save ou Salvar na página Data Access.
13. Confirme que os dois endereços aparecem na lista de escopos do app.

O primeiro escopo permite ler eventos. O segundo permite listar as agendas disponíveis na conta Google.

Não selecione o escopo calendar sem o sufixo readonly. Esse escopo concede permissões mais amplas.

### Se a pesquisa não encontrar os escopos

1. Volte à Biblioteca de APIs.
2. Confirme que Google Calendar API mostra Gerenciar.
3. Retorne a Google Auth Platform > Data Access.
4. Abra Add or Remove Scopes novamente.
5. Se existir Manually add scopes, cole o primeiro endereço completo.
6. Clique em Add to table, se esse botão aparecer.
7. Repita os passos para o segundo endereço.
8. Marque os dois endereços na tabela.
9. Salve a janela e depois a página Data Access.

Se os nomes dos botões forem diferentes, pare e envie uma captura da página Data Access. Não selecione escopos mais amplos.

## 4. Criar o OAuth Client ID

1. Abra Google Auth Platform > Clients.
2. Clique em Create client.
3. Escolha Web application em Application type.
4. Informe Casa PWA em Name.
5. Em Authorized JavaScript origins, clique em Add URI.
6. Informe exatamente o endereço abaixo:

    https://dilocris.github.io

7. Deixe Authorized redirect URIs vazio.
8. Clique em Create.
9. Copie o Client ID que termina em .apps.googleusercontent.com.

O endereço de origem não inclui /Householder/. O fluxo do Casa não precisa de Redirect URI.

Não copie o Client Secret. Não envie senha, token de acesso ou chave administrativa.

## 5. Enviar o ID ao Codex

Envie somente o OAuth Client ID. O Codex configurará a variável pública GOOGLE_CLIENT_ID no GitHub e verificará a publicação.

O Client ID identifica o aplicativo. Ele não concede acesso à agenda sem o consentimento de cada pessoa.

## 6. Conectar nos dois celulares

1. Abra o Casa nos dois celulares.
2. Aceite o aviso Atualização disponível · atualizar, se ele aparecer.
3. Abra Configurações > Google Calendar no primeiro celular.
4. Toque em Conectar ou atualizar agenda.
5. Escolha a conta Google que vê a agenda compartilhada.
6. Autorize os dois acessos de leitura.
7. Selecione a agenda compartilhada na lista Agenda Google.
8. Repita os passos no segundo celular.
9. Confirme que um evento existente aparece na Agenda do Casa.

O Casa guarda o ID da agenda escolhida neste aparelho. Ele mantém o token de acesso somente na memória.

Após fechar o app, conecte a conta Google novamente.

O modo Testing limita a duração da autorização a sete dias.

## Problemas comuns

- Se aparecer access_denied, confira as duas contas em Audience > Test users.
- Se aparecer origin_mismatch, confira https://dilocris.github.io em Authorized JavaScript origins.
- Se a lista de agendas vier vazia, confira a Google Calendar API e os dois escopos em Data Access.
- Se a agenda compartilhada não aparecer, abra o Google Calendar dessa conta e confirme que a agenda está visível.
- Se a autorização mostrar um aviso de app não verificado, confira o projeto, o estado Testing e os test users.

Não avance por um aviso de segurança se o nome do app ou a conta não corresponder ao projeto que você criou.

## Referências oficiais

- [Configurar consentimento e escopos](https://developers.google.com/workspace/guides/configure-oauth-consent)
- [Escopos do Google Calendar](https://developers.google.com/workspace/calendar/api/auth)
- [Criar um cliente OAuth para JavaScript](https://developers.google.com/workspace/calendar/api/quickstart/js)

A sincronização nos dois sentidos ainda não está implementada. A leitura exige menos permissões e evita alterações duplicadas.
