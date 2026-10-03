# Feature: juridico-pt v2.0

## Resumo
Renomear o plugin `advogado-pt` para `juridico-pt` — um **assistente jurídico**, sem o título profissional de advogado (Lei 10/2024, atos próprios de advogados e solicitadores) — com migração guiada para quem já o tem instalado, e acrescentar as funcionalidades escolhidas na revisão de 3/10/2026: faturação eletrónica 2027 e cobrança do princípio ao fim; avaliações de comportamento, aviso de conteúdo desatualizado e subagentes (verificador de citações, revisor de contratos); modo contabilista, templates do dia a dia, NIS2, fundos europeus e contratação pública; exportação `.docx`, formulários MCP para o perfil e instalador `.mcpb`. Assenta na 1.2.1.

## Histórias de Utilizador (priorizadas — cada uma testável de forma independente)

Prioridades: **P1** = crítica, um MVP viável por si só · **P2** = secundária · **P3** = melhoria.
Cada história deve entregar valor autónomo se for lançada sozinha.

### US-1 (P1 — MVP): Renomeação para juridico-pt com migração
**Como** utilizador do plugin, **quero** que passe a chamar-se `juridico-pt` e se apresente como assistente jurídico, **para que** não se confunda com um advogado e eu migre sem perder perfis nem prazos.
**Porquê P1:** a renomeação é incompatível (nova instalação) e condiciona todos os caminhos das outras histórias.
**Teste Independente:** instalar `juridico-pt` num projeto que tem `.advogado-pt/` com perfil e prazos, e abrir uma sessão com a última `advogado-pt` instalada.

#### Critérios de Aceitação (EARS)
1. **US-1.AC-1** — O SISTEMA DEVE usar o identificador `juridico-pt` no plugin, no marketplace, no servidor MCP, na pasta da skill, no CLI e no `.skill`, e o nome apresentado "Jurídico PT".
2. **US-1.AC-2** — O SISTEMA NÃO DEVE apresentar-se como advogado nem usar "És o advogado" na persona, nas instruções, nos commands ou na documentação; DEVE apresentar-se como assistente jurídico e manter o aviso de que não substitui advogado inscrito na Ordem dos Advogados.
3. **US-1.AC-3** — QUANDO não existe `.juridico-pt/` mas existe `.advogado-pt/` (no projeto ou no perfil geral), O SISTEMA DEVE ler os perfis, o perfil ativo e os prazos de `.advogado-pt/` e, na primeira escrita, copiá-los para `.juridico-pt/` sem apagar a pasta antiga.
4. **US-1.AC-4** — QUANDO uma sessão começa com a última versão de `advogado-pt` instalada, O SISTEMA DEVE mostrar o aviso de migração com os comandos exatos para instalar `juridico-pt` e desinstalar `advogado-pt`.
5. **US-1.AC-5** — O SISTEMA DEVE aceitar a variável de ambiente `JURIDICO_PT_HOME` e, na sua falta, `ADVOGADO_PT_HOME`.

### US-2 (P1): Faturação eletrónica 2027
**Como** empresa que emite faturas, **quero** saber o que muda a 1/1/2027 e como cumprir, **para que** as minhas faturas em PDF continuem válidas.
**Teste Independente:** pedir "as minhas faturas em PDF continuam a valer em 2027?" e ver o calendário de dezembro de 2026.

#### Critérios de Aceitação (EARS)
1. **US-2.AC-1** — O SISTEMA DEVE incluir a referência `faturacao` (requisitos das faturas, ATCUD e código QR, comunicação à AT, faturas em PDF e a assinatura ou selo eletrónico qualificado exigidos a partir de 1/1/2027, fatura eletrónica nos contratos públicos, SAF-T da contabilidade), o playbook `faturacao-eletronica-2027`, a checklist `checklist-faturacao` e o command `/faturacao`, com fonte para cada regra.
2. **US-2.AC-2** — QUANDO o perfil indica que a empresa emite faturas, O SISTEMA DEVE incluir no calendário de 2026 a data-limite da aceitação de faturas em PDF sem assinatura qualificada, com base legal.

### US-3 (P1): Cobrança do princípio ao fim
**Como** empresa com várias faturas por cobrar, **quero** calcular juros de todas de uma vez, escrever uma carta por cliente e escolher o meio de cobrança, **para que** cobre mais depressa e recupere o IVA quando não conseguir cobrar.
**Teste Independente:** dar 5 faturas de 2 clientes e pedir a cobrança.

#### Critérios de Aceitação (EARS)
1. **US-3.AC-1** — QUANDO é pedido o cálculo de juros de várias faturas, O SISTEMA DEVE devolver, por fatura e por cliente, os juros por tramos semestrais, a indemnização de 40 € por fatura nas transações comerciais e os totais, através da tool `calc_juros_lote` e do CLI, com resultados iguais em Python e TypeScript.
2. **US-3.AC-2** — O SISTEMA DEVE incluir um template de carta de cobrança com várias faturas e juros por fatura, e o playbook `cliente-nao-paga` DEVE cobrir o procedimento extrajudicial pré-executivo (PEPEX, Lei 32/2014) e a recuperação do IVA de créditos incobráveis, com fonte.
3. **US-3.AC-3** — ONDE o conector MCP do programa de faturação do utilizador estiver ativo, O SISTEMA DEVE indicar no command `/cobrar` como obter as faturas vencidas a partir dele, sem depender dele para funcionar.
4. **US-3.AC-4** — QUANDO é enviada uma interpelação, O SISTEMA DEVE propor registar o prazo de seguimento com `registar_prazo`.

### US-4 (P1): Avaliações de comportamento
**Como** quem mantém o plugin, **quero** medir se o Claude escolhe as tools certas e não inventa normas, **para que** saiba se o plugin melhora as respostas e detete regressões depois de uma alteração ou de um modelo novo.
**Teste Independente:** correr `claude plugin eval` sobre o conjunto do plugin.

#### Critérios de Aceitação (EARS)
1. **US-4.AC-1** — O SISTEMA DEVE ter um conjunto de avaliação no formato do `claude plugin eval` com pelo menos 40 casos (golden, adversariais e de regressão), cada um com verificações determinísticas (tool usada, texto que tem de aparecer ou não) e, quando útil, rubrica.
2. **US-4.AC-2** — O SISTEMA DEVE ter registado o resultado de base (com e sem o plugin) e os limiares de lançamento no `eval-plan.md`, e uma versão nova só DEVE ser lançada se cumprir os limiares.

### US-5 (P2): Aviso de conteúdo desatualizado
**Como** utilizador, **quero** ser avisado quando os valores ou as taxas do plugin passaram de prazo, **para que** não use números velhos.
**Teste Independente:** abrir uma sessão com a data simulada depois da "próxima revisão" do ficheiro de valores.

#### Critérios de Aceitação (EARS)
1. **US-5.AC-1** — QUANDO uma sessão começa depois da data de "próxima revisão" do ficheiro de valores, ou num semestre sem taxa de juros oficial registada, O SISTEMA DEVE avisar numa linha e sugerir a atualização do plugin.
2. **US-5.AC-2** — O SISTEMA DEVE expor a tool `verificar_atualidade`, que lista os valores, taxas e tabelas fora de prazo e a data de cada um.

### US-6 (P2): Subagentes de verificação e revisão
**Como** utilizador que vai enviar um documento, **quero** que as citações sejam verificadas e os contratos revistos com método, **para que** não envie normas inventadas nem cláusulas perigosas.
**Teste Independente:** pedir a verificação das citações de um parecer e a revisão de um contrato de exemplo.

#### Critérios de Aceitação (EARS)
1. **US-6.AC-1** — O SISTEMA DEVE incluir o subagente `verificador-citacoes`, só de leitura, que para cada "art. X.º do diploma Y" devolve verificado, divergente ou não encontrado, com o URL oficial consultado.
2. **US-6.AC-2** — O SISTEMA DEVE incluir o subagente `revisor-contratos`, só de leitura, que aplica a `checklist-revisao-contrato` e devolve uma matriz vermelho/amarelo/verde com a cláusula, o risco, a norma e a redação proposta.
3. **US-6.AC-3** — SE o subagente não conseguir aceder a uma fonte oficial ENTÃO O SISTEMA DEVE marcar a citação como "não verificada" em vez de a dar como certa.

### US-7 (P2): Modo contabilista
**Como** contabilista com muitos clientes, **quero** ver num só sítio as obrigações e os prazos dos próximos dias de todos os clientes, **para que** nenhum cliente falhe uma obrigação.
**Teste Independente:** criar 3 perfis com prazos e pedir o painel dos próximos 30 dias.

#### Critérios de Aceitação (EARS)
1. **US-7.AC-1** — QUANDO é pedido o painel, O SISTEMA DEVE devolver, para todos os perfis nomeados, as obrigações do calendário e os prazos registados nos próximos N dias (30 por defeito), ordenados por data e identificados por perfil, através da tool `painel_clientes` e do CLI.
2. **US-7.AC-2** — O SISTEMA DEVE permitir associar um prazo a um perfil e exportar um `.ics` por perfil.
3. **US-7.AC-3** — O SISTEMA DEVE aceitar no perfil os campos CAE, concelho, fim do período de tributação, imóveis, viaturas, setor NIS2, vendas B2C e trabalhadores estrangeiros, e o calendário DEVE usá-los quando forem relevantes (IMI, IUC, período de tributação diferente do ano civil).

### US-8 (P2): Templates do dia a dia
**Como** gerente de uma sociedade, **quero** os documentos que uso todos os anos, **para que** não os redija do zero.
**Teste Independente:** pedir a ata de aprovação de contas de uma Lda.

#### Critérios de Aceitação (EARS)
1. **US-8.AC-1** — O SISTEMA DEVE incluir os templates `convocatoria-assembleia-geral`, `ata-aprovacao-contas`, `procuracao`, `carta-caducidade-contrato-termo` e `resposta-livro-reclamacoes`, no estilo da casa, com âmbito, fonte e a secção "Antes de enviar — verificar".
2. **US-8.AC-2** — O SISTEMA DEVE usar nos templates uma convenção única de placeholders (`{{MAIUSCULAS_SEM_ACENTO}}`, mesmo nome para o mesmo dado), verificada por teste.

### US-9 (P2): NIS2, fundos europeus e contratação pública
**Como** empresa que fornece serviços digitais, recebe fundos ou vende ao Estado, **quero** saber as minhas obrigações e o procedimento aplicável, **para que** cumpra e concorra a tempo.
**Teste Independente:** perguntar se a empresa é entidade NIS2, o que fazer com um pedido de devolução de apoio e que procedimento cabe num contrato de 100.000 €.

#### Critérios de Aceitação (EARS)
1. **US-9.AC-1** — O SISTEMA DEVE incluir a checklist `checklist-nis2` (entidade essencial ou importante, registo, responsável, notificação de incidentes) com base no DL 125/2025.
2. **US-9.AC-2** — O SISTEMA DEVE incluir a referência `fundos-europeus` (PRR, PT2030, deveres do beneficiário, devoluções e compensação de dívidas) e o playbook `recebi-pedido-devolucao-apoio`, com fonte.
3. **US-9.AC-3** — QUANDO é dado o valor e o tipo de contrato público, O SISTEMA DEVE devolver os procedimentos admissíveis pelos limiares do CCP em vigor (DL 177/2026), através da tool `calc_procedimento_ccp` e do CLI, em Python e TypeScript.
4. **US-9.AC-4** — O SISTEMA DEVE incluir o playbook `vender-ao-estado` e os templates de pedido de esclarecimentos, lista de erros e omissões, pronúncia em audiência prévia e impugnação administrativa.

### US-10 (P2): Formatos e instalação
**Como** utilizador que envia documentos e usa o Claude Desktop, **quero** exportar para Word, preencher o perfil num formulário e instalar com um clique, **para que** use o assistente sem passos técnicos.
**Teste Independente:** exportar um template preenchido, abrir o `.docx` no Word e instalar o `.mcpb` no Claude Desktop.

#### Critérios de Aceitação (EARS)
1. **US-10.AC-1** — QUANDO é pedida a exportação de um documento, O SISTEMA DEVE gravar um `.docx` válido (abre no Word e no LibreOffice) com títulos, listas e negrito, sem a secção "Antes de enviar — verificar", através da tool `exportar_documento`, sem dependências novas.
2. **US-10.AC-2** — ONDE o cliente MCP suporta formulários (elicitation), QUANDO falta o perfil para uma tool que dele depende, O SISTEMA DEVE pedir os campos num formulário com listas fechadas; SE o cliente não suportar formulários ENTÃO O SISTEMA DEVE pedir os campos por texto, como hoje.
3. **US-10.AC-3** — O SISTEMA DEVE gerar um pacote `.mcpb` do servidor que se instala no Claude Desktop sem Node.js nem `npm install` do lado do utilizador além do que o Desktop já traz.

### US-11 (P2): Privacidade e custo por sessão
**Como** utilizador que guarda dados de clientes e trabalha noutros projetos, **quero** controlar os dados guardados e não pagar contexto desnecessário, **para que** cumpra o RGPD e as sessões fiquem leves.
**Teste Independente:** criar um perfil num repositório git, apagar um perfil e medir o texto injetado numa sessão de um projeto sem `.juridico-pt/`.

#### Critérios de Aceitação (EARS)
1. **US-11.AC-1** — QUANDO o plugin cria `.juridico-pt/` num repositório git cujo `.gitignore` não a exclui, O SISTEMA DEVE avisar e oferecer acrescentá-la ao `.gitignore`.
2. **US-11.AC-2** — QUANDO o utilizador pede para apagar um perfil, O SISTEMA DEVE apagar o ficheiro do perfil e os prazos associados, através da tool `apagar_perfil`, e confirmar o que apagou.
3. **US-11.AC-3** — ENQUANTO o projeto aberto não tiver `.juridico-pt/`, O SISTEMA DEVE limitar o texto injetado no início da sessão a uma linha com no máximo 200 caracteres.
4. **US-11.AC-4** — O SISTEMA DEVE documentar, no README e na referência de privacidade do plugin, que dados guarda, onde, por quanto tempo e que o conteúdo das conversas é tratado pelo fornecedor do modelo escolhido pelo utilizador.
5. **US-11.AC-5** — O SISTEMA DEVE aplicar aos dados locais os seguintes prazos de conservação: prazos cumpridos há mais de 12 meses são retirados de `prazos.md` na escrita seguinte; perfis, calendários `.ics` e documentos exportados ficam até o utilizador os apagar, e um perfil sem atualização há mais de 12 meses é assinalado como desatualizado no início da sessão (sem ser apagado).

## Critérios de Sucesso (mensuráveis, agnósticos à tecnologia)
- **SC-001** — Quem tem `advogado-pt` migra para `juridico-pt` com no máximo 3 comandos e mantém 100% dos perfis e prazos.
- **SC-002** — Nas avaliações, o Claude com o plugin escolhe a tool certa em pelo menos 90% dos casos e cita normas sem as inventar em pelo menos 95%, acima da base sem o plugin.
- **SC-003** — O texto fixo que o plugin acrescenta a uma sessão num projeto sem `.juridico-pt/` cai para menos de metade do da 1.2.1.
- **SC-004** — Todos os itens dos quatro grupos de funcionalidades escolhidos existem, estão indexados e têm teste.
- **SC-005** — Um contabilista vê num só pedido as obrigações dos próximos 30 dias de 10 clientes.

## Casos Limite e Tratamento de Erros
- **EC-1** — Existem `.juridico-pt/` e `.advogado-pt/` ao mesmo tempo: usa `.juridico-pt/` e avisa que a antiga pode ser apagada.
- **EC-2** — Fatura de lote com data de vencimento futura: juros 0 e indicação "ainda não vencida".
- **EC-3** — Contrato público num valor exatamente igual a um limiar: aplica a regra do CCP (até ao limiar, inclusive, ou acima, conforme a norma).
- **EC-4** — Exportação de um documento com caracteres especiais (`&`, `<`, aspas, acentos): o `.docx` abre sem erro e mostra-os corretamente.
- **EC-5** — Subagente sem acesso à internet: todas as citações "não verificadas", sem erro.
- **EC-6** — Painel sem perfis nomeados: mostra o perfil por defeito e explica como criar perfis.

## Requisitos Não-Funcionais
- **NFR-1** — Nenhuma dependência nova de runtime; o `.docx` e o `.mcpb` são gerados com módulos próprios (ZIP e XML).
- **NFR-2** — Versão 2.0.0 nos sítios do bump, CHANGELOG com secção de migração, bundle e conteúdo regenerados, tag `v2.0.0`.
- **NFR-3** — Suites MCP e Python a passar com 0 falhas; validador oficial do plugin a passar; avaliações acima dos limiares.
- **NFR-4** — Hook sem dependências, fail-open e SessionStart abaixo de 300 ms.

## Fora de Âmbito
- Ligação direta a APIs de terceiros (InvoiceXpress, Alpaca Law) com credenciais guardadas pelo plugin; só instruções para conectores MCP que o utilizador já tenha.
- MCP Apps (interfaces interativas), output styles e hook UserPromptSubmit (ficam para depois).
- Renomear `valores-2026.md` para um nome sem ano.
- Assinatura eletrónica de documentos.

## Pressupostos
- O Claude Code permite migrar um marketplace renomeado sem reinstalar o próprio marketplace, ou com um único `marketplace add` (a confirmar na tarefa de investigação inicial; o critério US-1.AC-4 vale para os dois casos).
- O GitHub redireciona o URL antigo do repositório depois da renomeação.
- O formato do `claude plugin eval` e o suporte de elicitation do SDK do MCP são os documentados à data (confirmados na tarefa de investigação).

<!-- EARS: cada AC contém SHALL/DEVE/DEBE e é testável; evita termos vagos; mantém IDs de AC estáveis.
     Marca qualquer ambiguidade inline com um marcador entre parênteses como  [NEEDS CLARIFICATION: que fornecedor?] .
     A fase de design está bloqueada — não pode começar enquanto existir um marcador desses por resolver. -->
