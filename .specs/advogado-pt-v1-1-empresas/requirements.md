# Feature: advogado-pt v1.1 empresas

## Resumo
Correções (prescrição, juros por semestre), método dos templates, cobertura para qualquer empresa (tributário, societário, PI, insolvência, laboral, consumo, bancário, RGPD, concorrência, UE), novas calculadoras e exportação como prompt.

## Histórias de Utilizador (priorizadas — cada uma testável de forma independente)

Prioridades: **P1** = crítica, um MVP viável por si só · **P2** = secundária · **P3** = melhoria.

### US-1 (P1 — MVP): Correções jurídicas e de cálculo
**Como** empresa credora, **quero** cartas de cobrança juridicamente corretas e juros calculados com a taxa de cada semestre, **para que** não perca direitos nem peça valores errados ao devedor.
**Porquê P1:** são erros já em produção que chegam a documentos enviados a terceiros.
**Teste Independente:** ler o template corrigido e correr a calculadora de juros sobre um período que atravessa semestres, comparando com o cálculo manual por tramos.

#### Critérios de Aceitação (EARS)
1. **US-1.AC-1** — O SISTEMA DEVE indicar, no template `carta-cobranca-formal-registada`, que a carta não interrompe a prescrição e que a interrupção exige citação ou notificação judicial ou o reconhecimento da dívida pelo devedor (arts. 323.º e 325.º CC).
2. **US-1.AC-2** — QUANDO o período de mora atravessa mais de um semestre, O SISTEMA DEVE dividir o período em tramos semestrais (1 de janeiro e 1 de julho) e aplicar a cada tramo a taxa publicada para esse semestre, em Python e em TypeScript com os mesmos resultados.
3. **US-1.AC-3** — O SISTEMA DEVE suportar os tipos `comercial` (art. 102.º §5 CCom / DL 62/2013), `comercial-geral` (art. 102.º §3 CCom) e `civil` (4%, Portaria 291/2003), com taxas semestrais do 2.º semestre de 2013 ao 2.º semestre de 2026 e o aviso de cada semestre.
4. **US-1.AC-4** — QUANDO um cálculo de juros é pedido (tool `calc_juros_mora`, script Python ou CLI), O SISTEMA DEVE devolver a memória de cálculo com um tramo por linha (período, dias, taxa, juros) e o total.
5. **US-1.AC-5** — SE o período inclui um semestre posterior ao último publicado na tabela ENTÃO O SISTEMA DEVE aplicar a esse tramo a última taxa conhecida e marcá-lo como estimado na memória de cálculo.
6. **US-1.AC-6** — SE a data de início é anterior a 2013-07-01 ou a data de fim é anterior à data de início ENTÃO O SISTEMA DEVE recusar o cálculo com uma mensagem de erro que nomeia o problema.
7. **US-1.AC-7** — O SISTEMA DEVE registar em `valores-2026.md` as taxas do 2.º semestre de 2026 (9,40% e 10,40%, Aviso n.º 16623/2026/2) e a "Última atualização" de 2026-10.
8. **US-1.AC-8** — QUANDO o tipo é `comercial`, O SISTEMA DEVE lembrar na memória de cálculo a indemnização mínima de 40 € por custos de cobrança prevista no DL 62/2013.

### US-2 (P1): Método nos templates e referências
**Como** utilizador que vai enviar um documento, **quero** uma lista final do que confirmar e saber se o regime é nacional, da UE ou misto, **para que** não envie um documento com prazos, formalidades ou normas por verificar.
**Teste Independente:** correr o teste de estrutura sobre `assets/templates/` e `references/` e listar os templates no MCP.

#### Critérios de Aceitação (EARS)
1. **US-2.AC-1** — O SISTEMA DEVE terminar cada template de `assets/templates/` (exceto o README) com uma secção `## Antes de enviar — verificar` com pelo menos 3 itens `- [ ]` sobre prazos, forma de envio ou assinatura e normas a confirmar.
2. **US-2.AC-2** — O SISTEMA DEVE declarar em cada template e em cada referência o âmbito `nacional`, `ue` ou `misto` numa linha `Âmbito:` nas primeiras 15 linhas.
3. **US-2.AC-3** — QUANDO `listar_templates` ou `listar_areas_juridicas` são chamadas, O SISTEMA DEVE mostrar o âmbito ao lado de cada nome.
4. **US-2.AC-4** — O SISTEMA DEVE documentar no índice de templates e no `SKILL.md` a convenção `{{CAMPO}}` (dado a preencher) versus `[VERIFICAR]` (facto ou norma por confirmar) e que o bloco "Antes de enviar" é entregue ao utilizador separado do documento final.
5. **US-2.AC-5** — SE um template ou uma referência não cumprir US-2.AC-1 ou US-2.AC-2 ENTÃO o teste de estrutura DEVE falhar nomeando cada ficheiro em falta.

### US-3 (P1): Cobertura para qualquer empresa
**Como** empresa de qualquer forma jurídica, setor ou dimensão, **quero** que o advogado se adapte ao meu perfil e cubra o fisco, sociedades, PI, insolvência de clientes, laboral, loja online, banca, RGPD, concorrência e UE, **para que** o plugin sirva qualquer empresa em Portugal e não só um ENI de tecnologia.
**Teste Independente:** pedir ao MCP as novas referências, templates, playbooks e checklists e verificar que existem, estão indexados e que nenhuma persona fixa o perfil ENI.

#### Critérios de Aceitação (EARS)
1. **US-3.AC-1** — O SISTEMA DEVE usar uma persona genérica (qualquer forma jurídica: ENI, Unipessoal Lda, Lda, SA; qualquer setor e dimensão) em `persona.ts`, `SKILL.md`, `AGENTS.md`, `GEMINI.md` e `integrations/*`, e o intake DEVE recolher forma jurídica, setor, número de trabalhadores e volume de negócios quando forem relevantes para a resposta.
2. **US-3.AC-2** — O SISTEMA DEVE incluir as referências `contencioso-tributario`, `bancario`, `concorrencia` e `uniao-europeia`, ligadas nas Áreas de Competência do `SKILL.md` e no `README.md`.
3. **US-3.AC-3** — O SISTEMA DEVE incluir os templates `reclamacao-graciosa`, `direito-audicao-previa`, `pedido-pagamento-prestacoes-at`, `pedido-informacao-vinculativa`, `pacto-social-unipessoal-lda`, `decisao-socio-unico`, `contrato-desenvolvimento-software`, `carta-cessacao-violacao-pi`, `notificacao-remocao-conteudo`, `reclamacao-creditos-insolvencia`, `pacto-nao-concorrencia`, `politica-prevencao-assedio`, `formulario-livre-resolucao`, `reclamacao-banco-operacao-nao-autorizada`, `registo-atividades-tratamento`, `resposta-pedido-titular-dados` e `queixa-comissao-europeia`, indexados no README de templates.
4. **US-3.AC-4** — O SISTEMA DEVE incluir os playbooks `recebi-notificacao-at` e `cliente-insolvente` e as checklists `checklist-registo-marca`, `checklist-loja-online` e `checklist-concorrencia`, indexados nos respetivos READMEs.
5. **US-3.AC-5** — O SISTEMA DEVE marcar com "(a confirmar)" ou `[VERIFICAR]`, em cada conteúdo novo, todo o artigo, prazo ou valor que não tenha sido confirmado em fonte oficial durante a redação.
6. **US-3.AC-6** — QUANDO o utilizador invoca `/fisco` ou `/insolvencia`, O SISTEMA DEVE encaminhar para o playbook real correspondente (`recebi-notificacao-at`, `cliente-insolvente`) através das tools MCP existentes.
7. **US-3.AC-7** — QUANDO uma sessão começa, O SISTEMA DEVE carregar o perfil da empresa de `<projeto>/.advogado-pt/perfil-empresa.md` ou, se não existir, do perfil geral `~/.advogado-pt/perfil-empresa.md` (hook SessionStart no Claude Code; tool `obter_perfil_empresa` nos outros clientes), indicando a origem (projeto ou geral).
8. **US-3.AC-8** — SE não existir perfil no projeto nem no perfil geral ENTÃO O SISTEMA DEVE, na primeira questão empresarial, perguntar apenas os campos do perfil relevantes para a resposta e oferecer guardá-los no projeto ou no perfil geral.
9. **US-3.AC-9** — QUANDO o utilizador aceita guardar ou atualizar o perfil, O SISTEMA DEVE gravar `perfil-empresa.md` no destino escolhido (projeto ou geral) com os campos dados e a data `atualizado_em`, mantendo os campos que não mudaram (tool `guardar_perfil_empresa`).
10. **US-3.AC-10** — SE o perfil carregado tiver `atualizado_em` há mais de 12 meses ou sem data ENTÃO O SISTEMA DEVE pedir ao utilizador que confirme os dados antes de os usar.
11. **US-3.AC-11** — SE o perfil não puder ser lido (ficheiro ilegível ou sem campos reconhecidos) ENTÃO O SISTEMA DEVE continuar a sessão sem perfil e sem erro (fail-open).

### US-4 (P2): Novas calculadoras
**Como** empregador ou herdeiro, **quero** calcular os créditos laborais devidos na cessação e a legítima de uma herança, **para que** tenha valores determinísticos em vez de contas feitas pela IA.
**Teste Independente:** correr as duas calculadoras em Python e TS sobre casos de referência calculados à mão.

#### Critérios de Aceitação (EARS)
1. **US-4.AC-1** — QUANDO são dados a retribuição base, as diuturnidades, a data de admissão e a data de cessação, O SISTEMA DEVE devolver os proporcionais de férias, subsídio de férias e subsídio de Natal do ano da cessação (fração = dias de serviço no ano / dias do ano), as férias vencidas e não gozadas (valor diário = retribuição mensal / 22) e o subsídio de férias vencido em falta quando indicado, com o total bruto.
2. **US-4.AC-2** — SE o contrato cessar no ano civil seguinte ao da admissão ou tiver durado até 12 meses ENTÃO O SISTEMA DEVE assinalar no resultado o limite do art. 245.º, n.º 3, do Código do Trabalho.
3. **US-4.AC-3** — QUANDO são dados o valor dos bens, as doações, as dívidas e os herdeiros legitimários (cônjuge, número de filhos, ascendentes), O SISTEMA DEVE devolver o valor da herança para cálculo da legítima (art. 2162.º CC), a quota legitimária, a quota disponível e a divisão da legítima por herdeiro (arts. 2139.º, 2142.º e 2156.º a 2161.º CC).
4. **US-4.AC-4** — SE não houver herdeiros legitimários ENTÃO O SISTEMA DEVE devolver legítima 0 e quota disponível de 100%.
5. **US-4.AC-5** — SE um valor de entrada for negativo ou a data de cessação for anterior à de admissão ENTÃO O SISTEMA DEVE recusar o cálculo com uma mensagem de erro que nomeia o campo.
6. **US-4.AC-6** — O SISTEMA DEVE expor as duas calculadoras em Python e TypeScript com os mesmos resultados, como tools MCP `calc_creditos_laborais` e `calc_legitima` e como `calc creditos` e `calc legitima` no CLI.

### US-5 (P2): Distribuição e descoberta
**Como** utilizador de ChatGPT, Gemini ou outra IA sem MCP, **quero** exportar um template como prompt autocontido e encontrar conteúdo agrupado por tipo, **para que** use o rigor do plugin em qualquer assistente.
**Teste Independente:** correr `node cli/advogado-pt.mjs prompt nda-bilingue` e `procurar_conteudo` com um termo comum.

#### Critérios de Aceitação (EARS)
1. **US-5.AC-1** — QUANDO o utilizador corre `node cli/advogado-pt.mjs prompt <nome>`, O SISTEMA DEVE imprimir um prompt autocontido com a persona, as regras de rigor e o conteúdo do template, pronto a colar noutra IA, sem depender do build do MCP.
2. **US-5.AC-2** — SE o nome pedido não existir ENTÃO O SISTEMA DEVE listar os nomes disponíveis e sair com código 1.
3. **US-5.AC-3** — QUANDO `procurar_conteudo` encontra resultados, O SISTEMA DEVE agrupá-los por tipo (Referências, Templates, Playbooks, Checklists) e mostrar o âmbito de cada item que o declare.
4. **US-5.AC-4** — O SISTEMA DEVE incluir no `README.md` um exemplo trabalhado, do caso às tools e ao documento final.

## Critérios de Sucesso (mensuráveis, agnósticos à tecnologia)
- **SC-001** — 0 templates sem lista "Antes de enviar" e 0 templates ou referências sem âmbito declarado.
- **SC-002** — A calculadora de juros reproduz ao cêntimo 3 cálculos manuais por tramos (mesmo semestre, dois semestres, vários anos).
- **SC-003** — As 10 áreas empresariais da v1.1 (tributário, societário, PI, insolvência, laboral, consumo, bancário, RGPD, concorrência, UE) têm cada uma pelo menos uma referência e um documento, playbook ou checklist acionável.
- **SC-004** — Um utilizador sem MCP obtém um prompt utilizável com 1 comando.

## Casos Limite e Tratamento de Erros
- **EC-1** — Mora que começa ou acaba exatamente a 1 de janeiro ou 1 de julho: os tramos não se sobrepõem e a soma dos dias dos tramos é igual ao total de dias.
- **EC-2** — Mora de 0 dias (início = fim): juros 0 e nenhum tramo com dias negativos.
- **EC-3** — Cessação no próprio ano da admissão: a fração dos proporcionais conta desde a data de admissão.
- **EC-4** — Ano bissexto: a fração dos proporcionais usa 366 dias.
- **EC-5** — Cônjuge com 4 ou mais filhos: a parte do cônjuge na legítima não fica abaixo de 1/4 (art. 2139.º, n.º 1, CC).
- **EC-6** — Perfil no projeto e perfil geral ambos presentes: vale o do projeto; o geral é ignorado nessa pasta.
- **EC-7** — A questão é sobre outra entidade (ex.: um cliente do utilizador): o perfil guardado não é sobrescrito com os dados dessa entidade.

## Requisitos Não-Funcionais
- **NFR-1** — Nenhuma dependência nova (runtime ou dev) no MCP, no CLI, no hook ou nos scripts Python.
- **NFR-2** — Versão 1.1.0 em simultâneo nos 6 sítios do bump e entrada no `CHANGELOG.md`; bundle `mcp-server/dist/index.js` e `mcp-server/content/` regenerados.
- **NFR-3** — `npm --prefix mcp-server test` e `python skills/advogado-pt/scripts/test_scripts.py` passam com 0 falhas.
- **NFR-4** — O perfil da empresa fica só em ficheiros locais do utilizador (projeto ou `~`); nenhum dado é enviado para fora da máquina e o perfil não pede dados pessoais de trabalhadores ou clientes.

## Fora de Âmbito
- Site/landing page, área de membros ou pagamentos.
- "Modo profissional" para advogados (cabeçalho de sociedade, peças processuais em massa).
- Pesquisa de jurisprudência online.
- Áreas urbanismo, ambiente, saúde e desportivo (ficam no roadmap).
- Divisão da legítima com direito de representação (netos de filho pré-falecido): a calculadora avisa e remete.

## Pressupostos
- Taxas comerciais §3 de 2008 a 2026 tiradas da tabela da Home Page Jurídica, que cita o aviso de cada semestre; as do 1.º e 2.º semestres de 2026 foram confirmadas em fontes independentes (Aviso n.º 822/2026/2 e Aviso n.º 16623/2026/2).
- A taxa do DL 62/2013 (§5) é a taxa §3 + 1 p.p. (BCE + 8 vs BCE + 7) desde a entrada em vigor do DL 62/2013 (2.º semestre de 2013); confirmado para 2023–2026 em fontes independentes.
- Juros simples, base 365 dias (mantém o comportamento atual).
