# Feature: advogado-pt v1.2 operacional

## Resumo
Fechar o que ficou em aberto na v1.1 (18 valores por confirmar e 4 pontos de doutrina) e tornar o advogado operacional para o dia a dia de qualquer empresa: calendário de obrigações e prazos em curso a partir do perfil; cumprimento por dimensão (RGPC, canal de denúncias); pacote do empregador; fisco do dia a dia; contratos, societário, tribunais, setores regulados, IA e videovigilância; vários perfis; perguntas de referência contra regressões jurídicas.

## Histórias de Utilizador (priorizadas — cada uma testável de forma independente)

### US-1 (P1 — MVP): Rigor — valores e doutrina em aberto
**Como** utilizador que envia documentos, **quero** que os valores marcados `[VERIFICAR]` e os pontos de doutrina em aberto fiquem resolvidos com fonte, **para que** não tenha de confirmar eu cada montante.
**Porquê P1:** são lacunas conhecidas em documentos já publicados.
**Teste Independente:** contar as marcas `[VERIFICAR — valores-2026]` e ler as posições doutrinais nos templates afetados.

#### Critérios de Aceitação (EARS)
1. **US-1.AC-1** — O SISTEMA DEVE registar em `valores-2026.md`, com base legal e data, cada valor das marcas `[VERIFICAR — valores-2026]` que for confirmado em fonte oficial, e o ficheiro de origem DEVE remeter para esse registo.
2. **US-1.AC-2** — SE um valor não puder ser confirmado em fonte oficial ENTÃO O SISTEMA DEVE manter a marca `[VERIFICAR]` acompanhada da fonte onde se confirma.
3. **US-1.AC-3** — O SISTEMA DEVE indicar, nos templates e referências afetados, a posição recomendada, a fonte e o grau de certeza para a forma da cessão de direitos sobre software, os adiantamentos sobre lucros em sociedades por quotas, a transposição do "botão de livre resolução" (Diretiva (UE) 2023/2673) e a compensação do pacto de não concorrência.
4. **US-1.AC-4** — QUANDO é calculada a compensação por despedimento, O SISTEMA DEVE aplicar os dias por ano do art. 366.º CT a todas as modalidades que para ele remetem (incluindo a extinção do posto de trabalho), os tetos legais (retribuição até 20 RMMG; total até 12 retribuições ou 240 RMMG) e o regime transitório da antiguidade anterior a 1/5/2023, sem o mínimo de 3 meses, em Python e TypeScript.

### US-2 (P1): Calendário de obrigações a partir do perfil
**Como** gerente ou contabilista, **quero** o calendário anual das obrigações legais da minha empresa, **para que** não falhe IVA, IES, Modelo 22, aprovação de contas, Relatório Único ou mapa de férias.
**Teste Independente:** gerar o calendário de 2026 para três perfis e importar o `.ics` num calendário.

#### Critérios de Aceitação (EARS)
1. **US-2.AC-1** — QUANDO é pedido o calendário de um ano, O SISTEMA DEVE devolver as obrigações aplicáveis ao perfil (forma jurídica, regime de IVA, trabalhadores, contabilidade) com data, descrição e base legal, a partir de uma tabela de regras verificadas.
2. **US-2.AC-2** — SE a data de uma obrigação calhar em sábado, domingo ou feriado nacional ENTÃO O SISTEMA DEVE aplicar a regra de transferência dessa obrigação e indicar a data original.
3. **US-2.AC-3** — QUANDO o utilizador pede a exportação, O SISTEMA DEVE gravar um ficheiro iCalendar (RFC 5545) em `<projeto>/.advogado-pt/calendario-<ano>.ics`, importável no Google Calendar.
4. **US-2.AC-4** — SE faltarem campos do perfil necessários para decidir uma obrigação ENTÃO O SISTEMA DEVE incluí-la marcada "a confirmar" e listar os campos em falta.
5. **US-2.AC-5** — O SISTEMA DEVE expor o calendário como tool MCP `calendario_obrigacoes` e como comando do CLI `calendario`.

### US-3 (P1): Prazos em curso com aviso
**Como** utilizador com prazos a correr, **quero** registá-los no projeto e ser avisado ao abrir a sessão, **para que** nenhum prazo perentório passe.
**Teste Independente:** registar um prazo a 3 dias e um vencido e abrir uma sessão.

#### Critérios de Aceitação (EARS)
1. **US-3.AC-1** — QUANDO o utilizador regista um prazo, O SISTEMA DEVE guardá-lo em `<projeto>/.advogado-pt/prazos.md` com data-limite, descrição e origem, através das tools `registar_prazo`, `listar_prazos` e `concluir_prazo`.
2. **US-3.AC-2** — QUANDO uma sessão começa, O SISTEMA DEVE avisar os prazos vencidos e os que terminam nos 7 dias seguintes, com os dias em falta.
3. **US-3.AC-3** — SE o ficheiro de prazos não puder ser lido ENTÃO O SISTEMA DEVE continuar a sessão sem aviso de prazos e sem erro.

### US-4 (P1): Cumprimento obrigatório por dimensão
**Como** empresa com 50 ou mais trabalhadores, **quero** saber e cumprir o regime anticorrupção e o canal de denúncias, **para que** evite coimas e responsabilidade dos administradores.
**Teste Independente:** pedir a referência e os documentos e gerar o calendário de um perfil com 60 trabalhadores.

#### Critérios de Aceitação (EARS)
1. **US-4.AC-1** — O SISTEMA DEVE incluir a referência `compliance` (RGPC — DL 109-E/2021; proteção de denunciantes — Lei 93/2021; limiares por número de trabalhadores) e os documentos `plano-prevencao-riscos-corrupcao`, `regulamento-canal-denuncias` e `checklist-compliance-dimensao`.
2. **US-4.AC-2** — QUANDO o perfil indica 50 ou mais trabalhadores, O SISTEMA DEVE incluir no calendário as obrigações periódicas do RGPC.

### US-5 (P1): Pacote do empregador
**Como** empregador, **quero** os documentos internos obrigatórios e calcular salário líquido e custo total de um trabalhador, **para que** contrate e gira pessoas sem surpresas.
**Teste Independente:** calcular dois salários de referência e ler os novos templates e playbooks.

#### Critérios de Aceitação (EARS)
1. **US-5.AC-1** — O SISTEMA DEVE incluir os templates `regulamento-interno` e `politica-registo-tempos-trabalho`, a checklist `checklist-seguranca-saude-trabalho` e os playbooks `lay-off` e `despedimento-coletivo`.
2. **US-5.AC-2** — QUANDO são dados o vencimento bruto mensal, a situação familiar (tabela de retenção), o número de dependentes e o subsídio de refeição, O SISTEMA DEVE devolver a contribuição do trabalhador para a Segurança Social, a retenção de IRS pelas tabelas de 2026 do Continente e o salário líquido.
3. **US-5.AC-3** — QUANDO são dados o vencimento base, diuturnidades, subsídio de refeição e a taxa do seguro de acidentes de trabalho, O SISTEMA DEVE devolver o custo anual e o custo mensal médio do trabalhador para a empresa, discriminando 14 meses de retribuição, TSU da entidade empregadora, subsídio de refeição e seguro.
4. **US-5.AC-4** — SE o vencimento for negativo ou o número de dependentes for negativo ENTÃO O SISTEMA DEVE recusar com erro que nomeia o campo.

### US-6 (P1): Fisco do dia a dia
**Como** empresa, **quero** estimar o IRC e saber como faturar a clientes estrangeiros, **para que** planeie impostos e emita faturas corretas.
**Teste Independente:** calcular o IRC de dois casos de referência e decidir o IVA de cinco operações.

#### Critérios de Aceitação (EARS)
1. **US-6.AC-1** — QUANDO são dados o lucro tributável, os prejuízos dedutíveis, se é PME, a taxa de derrama municipal e os encargos sujeitos a tributação autónoma, O SISTEMA DEVE devolver o IRC (com a taxa reduzida PME quando aplicável), a derrama municipal, a derrama estadual, a tributação autónoma e o total, com as taxas de 2026.
2. **US-6.AC-2** — QUANDO são dados o tipo de operação (bens ou serviços), o tipo de cliente (empresa ou consumidor), o país (Portugal, outro Estado-Membro ou fora da UE) e, se aplicável, o NIF válido no VIES e o volume de vendas à distância, O SISTEMA DEVE devolver onde é tributada, quem liquida o IVA, a menção obrigatória na fatura, as declarações a entregar e a base legal.
3. **US-6.AC-3** — O SISTEMA DEVE incluir a referência `iva-internacional` e o playbook `faturar-cliente-estrangeiro`.

### US-7 (P2): Contratos e societário
**Como** empresa, **quero** os contratos comerciais e atos societários mais frequentes, **para que** não parta do zero.
**Teste Independente:** obter cada template novo pelo MCP.

#### Critérios de Aceitação (EARS)
1. **US-7.AC-1** — O SISTEMA DEVE incluir os templates `contrato-agencia` (com indemnização de clientela), `contrato-distribuicao`, `contrato-franquia`, `contrato-saas-b2b`, `acordo-parassocial`, `contrato-cessao-quotas`, `contrato-arrendamento-nao-habitacional` e `contrato-trespasse`, e o playbook `dissolucao-liquidacao`.

### US-8 (P2): Tribunais
**Como** empresa demandada, **quero** reagir a uma injunção ou execução e saber a taxa de justiça, **para que** me defenda a tempo e saiba o custo.
**Teste Independente:** obter os templates e calcular a taxa de justiça de três valores de ação.

#### Critérios de Aceitação (EARS)
1. **US-8.AC-1** — O SISTEMA DEVE incluir os templates `oposicao-injuncao` e `oposicao-execucao`.
2. **US-8.AC-2** — QUANDO é dado o valor da ação, O SISTEMA DEVE devolver a taxa de justiça pela tabela do Regulamento das Custas Processuais em UC e em euros, com o valor da UC de 2026.

### US-9 (P2): Setores regulados
**Como** empresa de um setor licenciado, **quero** saber que licenças e registos preciso, **para que** opere legalmente.
**Teste Independente:** ler a referência e verificar as cinco secções.

#### Critérios de Aceitação (EARS)
1. **US-9.AC-1** — O SISTEMA DEVE incluir a referência `licenciamento-setorial` com secções para alojamento local, restauração e bebidas, construção, transportes (incluindo TVDE) e mediação imobiliária.

### US-10 (P2): IA, videovigilância e monitorização
**Como** empregador que usa IA e câmaras, **quero** as regras internas obrigatórias, **para que** cumpra o AI Act, o RGPD e o Código do Trabalho.
**Teste Independente:** obter os três templates.

#### Critérios de Aceitação (EARS)
1. **US-10.AC-1** — O SISTEMA DEVE incluir os templates `politica-uso-ia` (com o plano de literacia em IA do art. 4.º do AI Act), `politica-videovigilancia` e `politica-monitorizacao-trabalhadores`.

### US-11 (P3): Vários perfis
**Como** contabilista ou consultor, **quero** guardar o perfil de cada cliente e escolher o ativo, **para que** o advogado responda para a empresa certa.
**Teste Independente:** criar dois perfis, ativar um e ler o perfil.

#### Critérios de Aceitação (EARS)
1. **US-11.AC-1** — QUANDO o utilizador grava um perfil com nome, O SISTEMA DEVE guardá-lo em `.advogado-pt/perfis/<nome>.md` (projeto ou geral).
2. **US-11.AC-2** — QUANDO o utilizador ativa um perfil, O SISTEMA DEVE usá-lo como perfil da sessão (tools, hook e calendário) até ser ativado outro.
3. **US-11.AC-3** — O SISTEMA DEVE listar os perfis existentes e indicar o ativo (tool `listar_perfis`).
4. **US-11.AC-4** — SE o perfil ativo não existir ENTÃO O SISTEMA DEVE usar o perfil por defeito (`perfil-empresa.md`) e avisar.

### US-12 (P3): Perguntas de referência contra regressões
**Como** quem mantém o plugin, **quero** um conjunto de factos jurídicos verificados testados automaticamente, **para que** uma edição futura não reintroduza um erro corrigido.
**Teste Independente:** correr o teste e alterar um facto para o ver falhar.

#### Critérios de Aceitação (EARS)
1. **US-12.AC-1** — O SISTEMA DEVE manter pelo menos 40 factos jurídicos verificados (pergunta, ficheiro, texto que tem de aparecer, texto que não pode aparecer, fonte) e um teste que falha nomeando o facto quebrado.

## Critérios de Sucesso (mensuráveis, agnósticos à tecnologia)
- **SC-001** — Pelo menos 80% dos 18 valores por confirmar ficam resolvidos com fonte oficial; nenhum fica sem indicação de onde confirmar.
- **SC-002** — O calendário de 2026 de uma Lda com IVA trimestral e trabalhadores tem pelo menos 15 obrigações, todas com base legal.
- **SC-003** — Cada calculadora nova reproduz ao cêntimo 2 casos de referência calculados à mão, em Python e em TypeScript.
- **SC-004** — Todos os itens pedidos (v1.2 e "Depois") existem e estão indexados.
- **SC-005** — Pelo menos 40 factos jurídicos estão sob teste de regressão.

## Casos Limite e Tratamento de Erros
- **EC-1** — Calendário pedido sem perfil guardado: devolve as obrigações gerais marcadas "a confirmar" e indica os campos a recolher.
- **EC-2** — Prazo registado com data no passado: aparece como vencido no aviso.
- **EC-3** — Vencimento abaixo do limiar de retenção: retenção de IRS 0 €.
- **EC-4** — IRC com prejuízo fiscal: IRC 0 €, sem derrama estadual, tributação autónoma com o agravamento legal quando aplicável.
- **EC-5** — Venda de bens a empresa da UE sem NIF válido no VIES: tributa-se em Portugal com IVA português.
- **EC-6** — Valor da ação acima do último escalão da tabela do RCP: aplica-se o acréscimo por fração.

## Requisitos Não-Funcionais
- **NFR-1** — Nenhuma dependência nova (runtime ou dev); o `.ics` é gerado sem bibliotecas.
- **NFR-2** — Versão 1.2.0 nos 6 sítios do bump e entrada no CHANGELOG; bundle e conteúdo regenerados.
- **NFR-3** — `npm --prefix mcp-server test` e `python skills/advogado-pt/scripts/test_scripts.py` passam com 0 falhas.
- **NFR-4** — Prazos, calendários e perfis ficam só em ficheiros locais; o hook continua fail-open e sem dependências.

## Fora de Âmbito
- Criar eventos diretamente no Google Calendar por API (o `.ics` importa-se; com um conector de calendário ativo, o assistente pode criar os eventos a partir da lista).
- Processamento salarial completo (recibos, DMR); a calculadora é uma estimativa mensal.
- IRC de grupos (RETGS), regimes especiais e benefícios fiscais.
- Pesquisa de jurisprudência automática.

## Pressupostos
- As tabelas de retenção na fonte, as taxas de IRC e a tabela do RCP de 2026 são as publicadas em fonte oficial (recolhidas e citadas na investigação desta feature).
- O exercício das sociedades coincide com o ano civil (o calendário indica-o).
