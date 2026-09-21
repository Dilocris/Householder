# Planejamento de produto e UX

Data: 20/09/2026. Estado: direção definida, com propostas de interação para validação no protótipo.

## 1. Objetivo e contexto

O painel ajuda duas pessoas a coordenar compromissos, compras e despesas compartilhadas. A família vive em Vila Velha, ES, e tem uma criança de dois anos.

O acesso principal ocorre em celulares Android. O produto será um site com atalho na tela inicial, em português brasileiro.

As prioridades são agenda compartilhada, mercado ao vivo e contas e despesas. Reparos, atividades em família e reposição completam o escopo.

### Decisões confirmadas

| Tema | Decisão |
|---|---|
| Design | Material Design do Google, base neutra e cores intencionais |
| Calendário | Consulta do calendário compartilhado, com edição no Google Calendar |
| Finanças | Despesas compartilhadas, sem acertos entre o casal ou limites de orçamento |
| Mês financeiro | Total pago e a pagar no mês |
| Parcelas | Qualquer forma de pagamento, com datas e valores ajustáveis |
| Mercado | Uma lista efêmera, com filtros por setor ou loja |
| Reposição | Compra e nova necessidade, com quantidade opcional |
| Avisos | Alertas individuais, com preferências por pessoa |
| Tarefas | Atribuição direta, sem aprovação do responsável |
| Hospedagem | Computador da família, inicialmente |

As opções identificadas como propostas abaixo não substituem essas decisões. Elas orientam o protótipo e podem mudar após uso nos celulares.

## 2. Princípios de UX

- A ação frequente exige poucos toques e nenhum campo desnecessário.
- O registro rápido aceita detalhes posteriores.
- O sistema mostra o estado compartilhado com clareza.
- A cor nunca comunica um estado sozinha.
- Uma ação reversível oferece Desfazer.
- Um erro preserva os dados que a pessoa digitou.
- A interface mantém o contexto após abrir um detalhe.
- O produto evita cobranças automáticas entre o casal.

O sucesso depende da confiança dos dois usuários. Um registro aparentemente salvo não pode desaparecer sem explicação.

## 3. Arquitetura de navegação

A barra inferior terá cinco destinos fixos: Hoje, Agenda, Mercado, Finanças e Planos. Todos terão ícone e texto.

Hoje será a entrada inicial. O aplicativo preservará a aba durante a sessão, com atalhos diretos a partir dos avisos.

| Destino | Pergunta principal | Ação principal |
|---|---|---|
| Hoje | O que precisa da nossa atenção? | Abrir o próximo assunto |
| Agenda | Quais são os próximos compromissos? | Abrir no Google Calendar |
| Mercado | O que falta comprar? | Adicionar item |
| Finanças | Quanto já pagamos e quanto falta? | Novo registro |
| Planos | O que queremos resolver ou fazer? | Nova tarefa ou plano |

O perfil dará acesso às preferências e conexões. Configurações não ocuparão a navegação principal.

Áreas serão filtros, não uma sexta aba. As áreas iniciais serão Filho, Casa, Carro e Família.

Uma tarefa terá uma área principal e um plano opcional. Um plano reunirá tarefas, compras maiores e vínculos com compromissos.

Um evento do Google poderá receber uma área local. Essa classificação não alterará o evento original.

Cada aba preservará sua posição e seus filtros. Um filtro ativo terá indicação visível e ação Limpar filtros.

## 4. Estrutura das telas

### Hoje

A primeira tela terá uma síntese curta, sem gráficos decorativos. A ordem proposta será:

1. Data e próximo compromisso.
2. Até três pendências relevantes, com acesso à lista completa.
3. Tarefas do dia.
4. Atalhos para mercado e resumo financeiro.

Pendências vencidas aparecerão antes das próximas. O texto informará a data, sem linguagem de culpa.

Uma tela sem pendências mostrará o próximo compromisso e acesso às ideias da família. Ela não criará tarefas artificiais.

### Agenda

A agenda abrirá em lista cronológica, com seletor compacto de datas. Uma grade mensal servirá para localizar datas.

Cada evento mostrará horário, título e local, quando disponível. Eventos de dia inteiro aparecerão separados dos horários.

O detalhe terá a ação Abrir no Google Calendar. A ação de criação terá o rótulo Criar no Google Calendar.

Prazos de tarefas aparecerão apenas com um filtro explícito. Um prazo não ganhará horário fictício nem virará evento automaticamente.

Alterações e cancelamentos do Google atualizarão a cópia local. A tela mostrará a última atualização e oferecerá Atualizar agora.

Uma falha de conexão manterá os eventos anteriores visíveis, com indicação de possível desatualização. Falta de permissão terá a ação Reconectar calendário.

O fuso inicial será America/Sao_Paulo. Datas sem horário manterão sua data original, sem deslocamento de fuso.

### Mercado

A tela terá uma lista principal, campo Adicionar item e contagem de itens pendentes. O campo ficará acessível junto ao teclado.

O cadastro rápido exigirá apenas o nome. Quantidade, unidade, setor, loja e observação serão opcionais.

A caixa de seleção marcará a compra. O toque no texto abrirá os detalhes, para reduzir marcações acidentais.

Itens comprados passarão para uma seção recolhida. A lista preservará a posição de leitura após mudanças locais ou remotas.

A ordenação padrão será manual. O agrupamento por setor será uma opção visível, com preferência preservada por pessoa.

Ao adicionar um nome semelhante, o sistema mostrará o item existente. A pessoa poderá manter entradas distintas, sem bloqueio.

A ação Limpar comprados removerá apenas os itens concluídos que a pessoa viu. Itens recém-concluídos pelo outro usuário não desaparecerão inesperadamente.

A limpeza terá Desfazer. O sistema preservará os registros de reposição vinculados.

A lista não terá checkout nem exigirá total pago. Nenhuma ação de mercado criará uma despesa automaticamente.

### Finanças

A tela abrirá no mês atual. O seletor de mês permitirá consultar meses anteriores e compromissos futuros.

O resumo mostrará Pago no mês, A pagar no mês e Total previsto. Cada indicador abrirá os registros que compõem seu valor.

A seção Vencidas de meses anteriores ficará separada. Ela evitará que dívidas antigas desapareçam sem alterar silenciosamente o total do mês selecionado.

O mês de um registro pago será sua data efetiva de pagamento. O mês de um registro pendente será seu vencimento.

Uma conta atrasada paga neste mês entrará no total pago deste mês. A conta deixará a seção de pendências antigas.

A ação Novo registro abrirá duas opções: Já paguei e Tenho a pagar. O formulário usará linguagem cotidiana.

| Campo | Já paguei | Tenho a pagar |
|---|---|---|
| Descrição | Obrigatório | Obrigatório |
| Valor | Obrigatório | Obrigatório, com opção Estimado |
| Data | Hoje como padrão | Vencimento obrigatório |
| Pessoa que pagou | Usuário atual como padrão | Somente no pagamento |
| Categoria | Opcional, com Sem categoria | Opcional, com Sem categoria |
| Forma de pagamento | Opcional | Opcional |

Recorrência e parcelamento ficarão em opções adicionais. O formulário mostrará apenas os campos relevantes à escolha.

Uma conta recorrente representará compromissos sem término obrigatório. Um parcelamento terá quantidade definida de parcelas.

O parcelamento exigirá valor total, número de parcelas e primeiro vencimento. Uma prévia mostrará todas as datas e valores antes do registro.

Centavos residuais entrarão na última parcela. Meses sem o dia escolhido usarão seu último dia, com retorno ao dia original no mês seguinte.

Valores e datas individuais poderão mudar. Alterações em séries oferecerão Somente esta e Esta e as próximas.

O pagamento atualizará o mesmo compromisso e preservará seu vínculo. Ele não criará uma segunda despesa sem relação com a primeira.

Dois registros de pagamento do mesmo compromisso não produzirão duas saídas. O segundo usuário verá o pagamento já registrado.

O produto não terá gestão completa de fatura na primeira versão. Parcelas poderão indicar cartão como forma de pagamento.

A interface explicará o risco de duplicidade entre parcelas detalhadas e uma fatura total. Um aviso não impedirá registros legítimos.

### Planos

A tela terá filtros por área e responsável. As visões serão Ideias, Em andamento e Concluídos.

Uma ideia exigirá somente título. Ela poderá existir sem data ou responsável.

Uma tarefa terá responsável opcional, prazo opcional e estado. Sem responsável será um estado explícito.

Cada plano destacará a próxima ação. Aguarda resposta terá pessoa ou serviço e uma data opcional de retorno.

Compras maiores ficarão nos planos. Elas terão opções, preços previstos e estados como Pesquisar, Decidir, Comprar e Receber.

Programas em família poderão incluir local, custo estimado e duração. Observações sobre descanso da criança serão opcionais.

Concluir uma compra maior não gerará despesa automaticamente. A ação Registrar despesa abrirá um formulário com os dados disponíveis.

## 5. Reposição sem controle diário de estoque

A opção Acompanhar reposição ficará nos detalhes do item de mercado. Seu padrão será desativado.

Ao ativar a opção, a pessoa escolherá um produto existente ou criará um. O produto terá unidade consistente e histórico independente da lista.

Marcar a compra registrará a data no produto acompanhado. A quantidade será opcional e não bloqueará o uso da lista.

Uma mensagem oferecerá Ajustar quantidade e Desfazer. Desmarcar a compra reverterá o registro vinculado, sem apagar outros registros.

A repetição de uma operação durante a sincronização não criará outra compra. Cada ação terá uma identidade única.

O produto terá a ação Preciso comprar novamente. Ela registrará a necessidade e oferecerá Adicionar ao mercado.

Se o produto já estiver pendente na lista, a ação abrirá esse item. O sistema não criará uma duplicata automaticamente.

### Regra proposta para a estimativa

O intervalo entre compra e nova necessidade será a medida inicial. A interface usará Previsão de reposição, sem afirmar uma data exata de esgotamento.

Com um ciclo, a previsão será inicial. Com mais ciclos válidos, a mediana dos últimos cinco intervalos reduzirá o efeito de valores extremos.

Quantidades diferentes só terão ajuste proporcional quando os registros forem comparáveis. O sistema não presumirá consumo constante em compras antecipadas.

Uma compra durante um ciclo aberto terá a opção Compra extra. Sem informação suficiente, o sistema sinalizará previsão incerta e excluirá esse ciclo da estimativa.

O primeiro registro não produzirá uma estimativa inventada. A pessoa poderá informar uma duração aproximada ou aguardar o primeiro ciclo completo.

O lembrete terá antecedência ajustável por produto. Ainda temos bastante permitirá adiar o aviso, sem inventar uma nova data de consumo.

## 6. Colaboração e ausência de conexão

| Situação | Comportamento esperado |
|---|---|
| Alteração local | A interface responde imediatamente e mostra o estado de envio |
| Alteração remota | A tela recebe a mudança sem recarga manual |
| Sem conexão | A lista permanece disponível e aceita alterações locais |
| Servidor indisponível | O sistema preserva alterações e informa o impedimento |
| Retorno da conexão | Alterações pendentes seguem para o servidor uma única vez |
| Falha persistente | A pessoa vê os itens afetados e a ação Tentar novamente |

Os estados serão Atualizado, Alterações pendentes e Sem conexão. Atualizado exigirá confirmação do servidor.

Alterações em campos diferentes serão combinadas. Conflitos no mesmo texto preservarão as versões e oferecerão resolução.

Operações de seleção enviarão um estado explícito, como comprado, em vez de uma instrução de alternância. Isso evita inversões após repetição.

Uma exclusão em conflito com uma edição preservará o conteúdo recuperável. Exclusões não ressuscitarão automaticamente após reconexão.

No primeiro uso sem conexão, a tela explicará que ainda não existe uma cópia local. Dados anteriores nunca serão apresentados como atuais sem indicação.

## 7. Avisos e entrada inicial

O primeiro acesso terá identificação individual e vínculo ao mesmo núcleo familiar. Contas e autorizações serão exclusivas dos dois usuários.

As áreas iniciais virão prontas. Alterar nomes e criar outras áreas será opcional.

A conexão do calendário será uma etapa separada. O restante do produto continuará disponível antes dessa conexão.

A solicitação de permissão para notificações ocorrerá após a pessoa escolher seu primeiro alerta. A instalação do atalho terá orientação curta.

Alertas de tarefas terão destinatário explícito. Contas poderão avisar ambos, e cada pessoa poderá silenciar sua cópia.

O Google Calendar continuará responsável pelos avisos de eventos na primeira versão. Isso evita alertas duplicados entre os dois aplicativos.

Uma tarefa concluída ou conta paga cancelará lembretes futuros. Um toque no aviso abrirá o registro correto e seu estado atual.

Horários de silêncio serão configuráveis. A tela bloqueada terá texto discreto como padrão, sem valores financeiros ou detalhes da criança.

O servidor doméstico precisa estar disponível para sincronizar e enviar avisos. Após uma interrupção, avisos antigos serão agrupados, sem uma sequência excessiva.

## 8. Sistema visual e acessibilidade

Os componentes seguirão Material Design 3. A aplicação web adaptará as interações ao navegador e ao Android.

| Elemento | Proposta visual |
|---|---|
| Fundo | Cinza muito claro |
| Superfícies | Branco e cinza claro, com contraste entre níveis |
| Texto principal | Quase preto |
| Ação principal | Fundo escuro e texto claro |
| Erro ou atraso | Vermelho, ícone e texto |
| Atenção próxima | Âmbar, ícone e texto |
| Conclusão | Confirmação breve em verde, seguida de estado neutro |

As categorias não terão cores próprias. Eventos terão marcas neutras, com horário e título como elementos principais.

O corpo de texto terá proposta inicial de 16 px. Controles frequentes terão alvo mínimo de 48 por 48 px CSS na web.

O tamanho web será validado nos celulares. A referência Android recomenda alvos de 48 dp, unidade distinta de pixels físicos.

O contraste mínimo proposto será 4,5:1 para texto comum. Texto grande terá pelo menos 3:1.

Ícones terão nomes acessíveis e campos terão rótulos persistentes. Erros aparecerão junto ao campo, com orientação específica.

Texto ampliado, TalkBack e navegação por teclado farão parte da validação. A interface respeitará a preferência de movimento reduzido.

Formulários curtos usarão painéis inferiores. Formulários financeiros extensos usarão uma tela completa, com ação de salvar acessível acima do teclado.

Gestos serão atalhos opcionais. Nenhuma ação dependerá exclusivamente de deslizar, arrastar ou pressionar por tempo prolongado.

Voltar fechará primeiro o detalhe ou painel aberto. Alterações incompletas ficarão em rascunho ou terão aviso antes do descarte.

## 9. Estados e textos essenciais

| Contexto | Texto proposto | Ação |
|---|---|---|
| Mercado vazio | A lista está vazia. | Adicionar item |
| Filtro vazio | Nenhum item corresponde aos filtros. | Limpar filtros |
| Rede ausente | Sem conexão. Suas alterações estão neste celular. | Ver pendências |
| Agenda desatualizada | Não foi possível atualizar a agenda. | Tentar novamente |
| Calendário desconectado | Conecte o calendário compartilhado. | Conectar |
| Conta já paga | Esta conta já foi marcada como paga. | Ver pagamento |
| Reposição inicial | Ainda falta um ciclo completo para estimar a reposição. | Informar duração aproximada |
| Compra desfeita | A compra e seu registro de reposição foram desfeitos. | Fechar |

Carregamento inicial terá uma estrutura provisória estável. Atualizações posteriores manterão o conteúdo visível.

## 10. Sequência de entrega

| Etapa | Entrega | Critério de saída |
|---|---|---|
| 1 | Protótipo navegável das cinco telas | Fluxos principais completos com dados fictícios |
| 2 | Avaliação nos dois Androids | Problemas de navegação, teclado e leitura resolvidos |
| 3 | Núcleo compartilhado e mercado ao vivo | Edições simultâneas e reconexão sem perda |
| 4 | Agenda conectada e finanças | Cancelamentos refletidos e totais corretos |
| 5 | Planos, reposição e alertas | Histórico preservado e avisos coerentes |
| 6 | Piloto doméstico | Uso dos dois usuários e restauração de backup validada |

O protótipo usará dados fictícios claramente identificados. Ele não representará integrações reais nem prometerá entrega de notificações.

A arquitetura técnica terá estado compartilhado no servidor e cópia local para continuidade. A seleção de bibliotecas ficará para o plano técnico.

O acesso remoto inicial usará uma solução de túnel. O piloto persistente precisará de endereço estável, autenticação e backups.

Quick Tunnels servem para testes e não oferecem garantia de disponibilidade. Sua ausência de SSE precisa ser considerada na escolha do transporte ao vivo.

## 11. Plano de avaliação de UX

Os tempos abaixo são metas de projeto, não resultados medidos. Cada usuário realizará os cenários sem instrução sobre onde tocar.

| Cenário | Meta inicial | Falha relevante |
|---|---|---|
| Identificar o próximo compromisso | Até 10 segundos | Confusão sobre dia ou horário |
| Adicionar três itens ao mercado | Até 30 segundos | Formulário excessivo ou perda do teclado |
| Marcar um item comprado | Um toque | Abertura involuntária dos detalhes |
| Ver alteração do outro celular | Até 2 segundos em conexão estável | Necessidade de recarga |
| Localizar uma conta e marcar pagamento | Até 30 segundos | Despesa duplicada |
| Registrar compra em três parcelas | Até 60 segundos | Total ou vencimentos incorretos |
| Ativar reposição e registrar nova necessidade | Fluxo compreendido sem ajuda | Confusão entre previsão e estoque real |
| Retomar após perda de conexão | Nenhuma perda de registro | Alteração pendente apresentada como salva no servidor |

### Procedimento de validação

1. Abra o protótipo em cada celular.
2. Execute cada cenário com dados fictícios.
3. Registre dúvidas, erros e tempo aproximado.
4. Amplie o texto do aparelho.
5. Repita os fluxos principais com TalkBack.
6. Teste o teclado aberto nas telas de cadastro.
7. Na versão funcional, interrompa a conexão de um celular.
8. Altere o mesmo item nos dois celulares.
9. Restaure a conexão.
10. Verifique a recuperação e o estado compartilhado.

### Casos obrigatórios antes do piloto

- Duas pessoas marcam a mesma compra acompanhada.
- Uma pessoa limpa concluídos enquanto a outra adiciona um item.
- Uma pessoa paga uma conta que a outra já pagou.
- Uma parcela vence no dia 31 em um mês mais curto.
- Uma conta antiga recebe pagamento no mês atual.
- Um evento recorrente muda apenas em uma ocorrência.
- O acesso ao Google Calendar perde autorização.
- Uma compra extra interrompe a comparabilidade do ciclo de reposição.
- O computador servidor reinicia com operações locais pendentes.

## 12. Limites e decisões posteriores

O primeiro ciclo não inclui integração bancária, gestão completa de cartões ou criação de eventos pelo painel. Ele também não inclui registros clínicos da criança.

A hospedagem definitiva depende do computador disponível e da rotina de uso. Endereço, backup e conexão ao Google serão definidos na implementação.

Modo escuro e importação de despesas ficam após os fluxos prioritários. Recursos de IA não são necessários para atender ao escopo atual.

## 13. Agenda, identidade e preferências — evolução solicitada

A Agenda terá Agendar evento e Agendar mensagem como ações distintas. Mensagens aparecerão antes dos compromissos, agrupadas por dia.

Cada mensagem mostrará contato, horário, texto truncado e responsável. O detalhe preservará o texto completo e o acesso ao WhatsApp.

O cadastro de evento terá título, data, início, fim opcional, local, área e observações. A prévia salva eventos somente no navegador.

A escrita no Google Calendar será uma integração opcional. Ela exigirá autorização de edição e a seleção explícita do calendário compartilhado.

O sistema preservará o identificador do evento remoto para evitar duplicações. Uma falha de sincronização terá estado visível e ação de nova tentativa.

O formulário de mensagem oferecerá o seletor de contatos quando o navegador tiver suporte. O usuário escolherá os dados de cada contato.

Sem suporte, o telefone manual e os contatos salvos permanecerão disponíveis. Vários telefones do mesmo contato terão uma escolha explícita.

### Login proposto

Entrar com Google será a opção recomendada para o casal. As duas contas terão identidades individuais e acesso ao mesmo núcleo familiar.

O servidor restringirá o acesso aos membros autorizados. Ele validará a identidade e manterá uma sessão protegida para cada pessoa.

O identificador estável do Google será a referência do usuário. O nome exibido não será usado como identidade ou regra de acesso.

A conexão ao calendário será separada do login. Avisos terão destinatários vinculados às contas e aos dispositivos cadastrados.

O seletor de responsável da prévia não representa autenticação. A implementação real depende de servidor, contas autorizadas e endereço estável.

### Configurações — etapa futura

- Aparência: Claro, Escuro e Sistema, com preferência individual.
- Usuário: nome, conta conectada e saída da sessão.
- Notificações: dispositivos, permissões e horários de silêncio.
- Integrações: calendário selecionado e estado da conexão.
- Novas preferências, conforme as necessidades da família.

O menu ficará disponível no perfil. Sistema será a proposta inicial para o tema.

## 14. Decks livres e formatos brasileiros

Esta revisão substitui a organização rígida por áreas na seção Planos. Cada deck possui título e descrição editáveis.

Cada tarefa pertence a um deck. Ela pode mudar de deck e contém responsável, prazo, descrição e checklist opcionais.

A visão Decks mostra as coleções. A visão Todas as tarefas mostra linhas agrupadas por deck.

Os dados anteriores passam por uma migração única. As áreas antigas originam decks editáveis, e os planos anteriores viram tarefas com suas checklists preservadas.

As checklists usam linhas discretas. Responsável e prazo ficam em detalhes expansíveis, sem caixas grandes por item.

O usuário pode criar, consultar, editar e excluir decks e tarefas. A exclusão de um deck inclui suas tarefas e oferece Desfazer.

Categorias do mercado e das despesas aceitam criação, edição e exclusão. A exclusão preserva os registros em uma categoria de destino.

Despesas aceitam edição e exclusão por registro. Alterações em parcelas afetam somente a parcela selecionada.

O usuário esclareceu que ABNT significa formatos relevantes ao Brasil, sem exigência de uma norma específica.

- Datas: DD/MM/AAAA.
- Horários: HH:mm, com 24 horas.
- Valores: reais, com vírgula decimal.
- Idioma: português brasileiro.

Os campos de data e horário usam apresentação explícita. Sua aparência não depende do idioma do navegador.

## 15. Lista de mercado, recorrência e configurações

O painel Comprados permanece aberto durante alterações na lista. A abertura é uma preferência temporária da tela, e não uma mudança de dados.

Despesas podem ser recorrentes. A regra guarda frequência, início, categoria e pessoa que pagou.

O cadastro e a edição de uma despesa mostram a opção recorrente. A regra não duplica uma despesa já registrada.

O layout móvel adapta as colunas sem ocultar transbordamentos. Os sete dias da agenda cabem na largura disponível.

A paleta usa lavanda, coral, azul claro e teal como acentos. Cada acento representa uma intenção de interface, com texto e ícone complementares.

O menu de configurações abre pelo avatar. A primeira versão inclui tema Claro, Escuro ou Sistema e o nome do usuário.

## 16. Revisão visual

Os temas usam superfícies neutras e cores centralizadas por função. O tema escuro distingue fundo, cartões e controles sem grandes áreas claras.

Lavanda identifica ações e seleção. Teal identifica pagamentos. Âmbar identifica pendências. Azul identifica recorrência. Coral fica reservado para erros.

Textos decorativos foram removidos. Títulos, rótulos e instruções descrevem conteúdo ou ações. Descrições cadastradas pelo usuário permanecem nos decks.

O modo Sistema acompanha mudanças do tema do dispositivo enquanto a página está aberta.

As cinco telas passaram na verificação de largura em 390 pixels no tema escuro e 320 pixels no tema claro.

A agenda também passou em 1280 pixels. A verificação usou a igualdade entre `scrollWidth` e `clientWidth`, sem ocultar rolagem horizontal.

## 17. Ajustes de navegação, planos e eventos

A barra móvel usa cinco colunas fixas. O espaçamento não depende da presença da barra de rolagem vertical.

Os cartões de decks usam menos altura, espaçamento e padding. A leitura do título, da quantidade e do progresso permanece direta.

O formulário de evento aceita Dia inteiro. Quando essa opção está ativa, os campos de horário ficam ocultos.

O formulário de evento não possui Área. Eventos antigos ainda podem mostrar a área já gravada.

Os títulos principais possuem ícones. Eventos com local usam um ícone de localização.

Os arquivos estáticos usam caminhos relativos. Essa escolha permite hospedagem em um subdiretório do GitHub Pages.

## 18. Finanças e preparação para produção

Finanças mostra dois meses anteriores, o mês atual e três meses projetados. O gráfico compara receitas e despesas.

Um lançamento pode ser uma despesa ou uma receita. O estado muda entre pagar, paga, receber e recebida.

Uma despesa única pode usar parcelas. Um lançamento recorrente usa frequência e número de ocorrências.

Cada ocorrência recebe seu próprio registro, data e identificador de série. Esse formato permite sincronização por registro no Supabase.

As mensagens agendadas aparecem somente no topo de cada dia. A Agenda não possui um painel separado de avisos.

A interface não mostra textos sobre dados fictícios, prévias ou limitações temporárias.

## Referências

- [Material Design 3: navegação](https://m3.material.io/components/navigation-bar/guidelines). Referência oficial de componentes. A página depende de JavaScript.
- [Android: acessibilidade](https://developer.android.com/guide/topics/ui/accessibility/apps). Referência para alvos de toque, contraste e rótulos.
- [Google Calendar: sincronização](https://developers.google.com/workspace/calendar/api/guides/sync). Referência para mudanças e exclusões de eventos.
- [Cloudflare: Quick Tunnels](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/). Referência para limites do acesso temporário.
