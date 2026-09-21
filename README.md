# Casa — protótipo de UX

O protótipo permite avaliar a navegação e os formulários do painel familiar. Os dados iniciais são fictícios.

## Execução local

1. Instale Node.js, caso o computador ainda não tenha esse programa.
2. Abra um terminal na pasta do projeto.
3. Execute `npm start`.
4. Abra `http://127.0.0.1:4173` no navegador.

## Publicação

O diretório `dist` contém o site estático publicado pelo GitHub Pages.

Cada push na branch `main` inicia o workflow `.github/workflows/pages.yml`.

O endereço público será `https://dilocris.github.io/Householder/` após a primeira publicação.

## Recursos disponíveis

O painel Comprados permanece aberto após alterações na lista de mercado.

Despesas podem ser criadas e editadas como recorrentes, com frequência mensal, semanal ou anual.

O avatar abre Configurações. O tema aceita Sistema, Claro e Escuro.

O layout móvel adapta as colunas ao espaço disponível. Mensagens longas não expandem a agenda. O CSS não oculta transbordamentos do documento.

Os temas usam fundos neutros e lavanda para ações e seleção. Cores de estado possuem pares próprios de fundo e texto.

A revisão visual removeu slogans e uniformizou cartões, formulários, navegação e indicadores nos dois temas.

Planos agora usa decks livres. Os registros anteriores são preservados por uma migração única.

Decks e tarefas permitem criação, consulta, edição e exclusão. A visão Todas as tarefas agrupa as linhas por deck.

Datas aparecem como DD/MM/AAAA, inclusive nos formulários. Horários usam HH:mm e valores usam reais.

Despesas, categorias e produtos acompanhados também possuem edição e exclusão. A exclusão de categorias preserva seus registros.

O botão Agendar evento cria eventos locais. Mensagens agendadas aparecem em uma lista compacta no início de cada dia.

O seletor de contatos depende do suporte do navegador Android e de contexto seguro. O teste em aparelho real ainda está pendente.

Mensagens possuem avisos internos com a página aberta. O protótipo não envia notificações ao aparelho de outra pessoa.

- Cinco telas responsivas: Hoje, Agenda, Mercado, Finanças e Planos.
- Inclusão, edição e conclusão de itens de mercado.
- Acompanhamento opcional de reposição, com registros locais de compra.
- Cadastro de despesas, pagamentos e parcelamentos.
- Prévia dos valores e vencimentos das parcelas.
- Cadastro de planos e tarefas.
- Persistência local e restauração dos exemplos.
- Desfazer para alterações selecionadas.

## Limites desta etapa

Os registros ficam somente no navegador atual. Não existe sincronização entre celulares, autenticação ou conexão ao Google Calendar.

A previsão de reposição contém exemplos demonstrativos. O aprendizado por ciclos, as compras extras e as notificações pertencem à próxima implementação.

O servidor aceita conexões apenas deste computador. O protótipo ainda não possui instalação PWA ou funcionamento offline após recarga.

A aparência segue a direção do Material Design. Os componentes desta prévia usam HTML e CSS, sem biblioteca visual externa.

O modelo financeiro simplificado não contém edição de séries, contas recorrentes ou conciliação de cartões. Esses recursos não estão implícitos nos dados demonstrativos.

## Validação realizada

A revisão visual de 20/09/2026 verificou as cinco telas em 390 pixels no tema escuro e 320 pixels no tema claro.

Em todas essas telas, `scrollWidth` correspondeu a `clientWidth`. A agenda também passou em 1280 pixels. Nenhum erro apareceu no console durante essa revisão.

O formulário de deck recebeu inspeção visual no tema escuro. A troca entre temas funcionou pelo menu de configurações.

- O JavaScript passou na verificação de sintaxe.
- O servidor respondeu com HTTP 200.
- A interface foi inspecionada em uma janela de 390 por 844 pixels.
- A inclusão e a conclusão de um item funcionaram no navegador.
- O cadastro de R$ 100 em três parcelas produziu R$ 33,33, R$ 33,33 e R$ 33,34.
- O registro financeiro apareceu no mês correspondente.
- A navegação WebMCP aceitou uma seção válida e rejeitou uma seção inválida.
- Os exemplos foram restaurados após os testes.

A avaliação em aparelhos Android reais ainda está pendente. O protótipo não substitui os testes de colaboração previstos no plano de UX.

## Referência

## Ajustes de UX posteriores

- A agenda mostra o dia selecionado e os compromissos seguintes.
- A tela Hoje contém três eventos visíveis e rolagem para eventos adicionais.
- Cada plano aceita uma checklist com responsáveis e prazos individuais.
- Planos e novas tarefas aceitam prazo.
- O formulário financeiro permite criar categorias.
- O mercado permite criar e remover categorias, com transferência dos itens para Outros.
- O rodapé com localização e frase foi removido.

A remoção de categorias e a restauração dos itens passaram na verificação pelo navegador. O cadastro da checklist preservou responsável e prazo.

Em uma janela de 390 pixels, a lista diária apresentou 312 pixels de altura e quatro eventos com rolagem.

O documento `docs/PLANO-UX.md` descreve o produto pretendido. Este protótipo representa a etapa inicial de validação visual e de interação.
