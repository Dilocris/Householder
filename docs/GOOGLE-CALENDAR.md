# Google Calendar no Casa

## Estado

O código lê eventos da agenda Google escolhida no aparelho. Ele não grava eventos no Google ou no Supabase.

A conexão exige um OAuth Client ID do Google. O ID ainda não foi configurado nem testado nos celulares.

Cada pessoa conecta sua conta Google e escolhe a mesma agenda compartilhada. O token fica somente na memória do app.

Após fechar o app, conecte a conta Google novamente. A agenda escolhida permanece neste aparelho.

## Configuração no Google Cloud

1. Abra o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto para o Casa ou selecione um projeto existente.
3. Ative a Google Calendar API na biblioteca de APIs.
4. Abra Google Auth Platform > Branding.
5. Defina o nome do app como Casa e informe o e-mail de suporte.
6. Abra Audience e selecione External com estado Testing.
7. Adicione as duas contas Google em Test users.
8. Abra Data Access e adicione os escopos de leitura:

    https://www.googleapis.com/auth/calendar.events.readonly

    https://www.googleapis.com/auth/calendar.calendarlist.readonly

9. Abra Clients e crie um OAuth client do tipo Web application.
10. Adicione https://dilocris.github.io em Authorized JavaScript origins.
11. Copie somente o Client ID que termina em .apps.googleusercontent.com.

O fluxo de token no navegador não usa Redirect URI. Não envie o Client Secret.

## Configuração no GitHub

1. Abra Settings > Secrets and variables > Actions > Variables no repositório.
2. Crie GOOGLE_CLIENT_ID com o Client ID público.
3. Execute o workflow Validate and deploy Casa.
4. Verifique que release.json informa googleCalendarConfigured: true.

## Teste nos aparelhos

1. Aceite a atualização do Casa nos dois aparelhos.
2. Abra Configurações > Google Calendar em cada aparelho.
3. Toque em Conectar ou atualizar agenda.
4. Escolha a conta Google com acesso à agenda compartilhada.
5. Selecione a mesma agenda compartilhada nos dois aparelhos.
6. Abra Agenda e verifique um evento existente.
7. Altere esse evento no Google Calendar.
8. Volte ao Casa e verifique a atualização.

O Casa consulta a agenda Google ao conectar e ao retornar ao app após cinco minutos. Os eventos Google aparecem somente para leitura.

A sincronização nos dois sentidos exige uma etapa posterior. Ela precisa resolver conflitos e evitar eventos duplicados.