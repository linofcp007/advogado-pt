# Changelog

Todas as alterações relevantes ao **advogado-pt**. O formato segue
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adere ao
[Versionamento Semântico](https://semver.org/lang/pt-BR/). A versão refere-se ao plugin como um todo.

## [1.1.0] - 2026-10

**Advogado para qualquer empresa.** O plugin deixa de assumir um "ENI de tecnologia": guarda o perfil da empresa, corrige erros jurídicos encontrados numa revisão comparativa e acrescenta cobertura empresarial (fisco, banca, concorrência, UE).

### Added

- **Perfil da empresa guardado** em `<projeto>/.advogado-pt/perfil-empresa.md` (prioridade) ou no perfil geral `~/.advogado-pt/perfil-empresa.md`: carregado pelo hook `SessionStart`, lido/gravado pelas tools `obter_perfil_empresa` / `guardar_perfil_empresa` e pelo comando `/perfil`; pede confirmação se tiver mais de 12 meses; nunca grava dados de terceiros.
- **Juros de mora por tramos semestrais** (`calc_juros_mora`, `scripts/juros_mora.py`, `cli calc juros`): tabela de taxas do 2.º semestre de 2013 ao 2.º semestre de 2026 (com o aviso de cada semestre), novo tipo `comercial-geral` (art. 102.º §3 CCom), memória de cálculo pronta a anexar, taxa estimada para semestres sem aviso e lembrete dos 40 € (art. 7.º DL 62/2013).
- **Calculadoras novas** (Python + TS + tool + CLI): `calc_creditos_laborais` (proporcionais de férias, subsídios de férias e de Natal, férias não gozadas; alerta do art. 245.º/3 CT) e `calc_legitima` (legítima, quota disponível e divisão por herdeiro, arts. 2156.º-2162.º CC).
- **Referências**: `contencioso-tributario`, `bancario`, `concorrencia`, `uniao-europeia`.
- **Templates (17)**: reclamação graciosa, audição prévia, prestações na execução fiscal, informação vinculativa, pacto social unipessoal, decisão do sócio único, desenvolvimento de software com cessão de direitos, cease and desist de PI, notice and takedown (DSA), reclamação de créditos na insolvência, pacto de não concorrência, código contra o assédio, formulário de livre resolução, reclamação ao banco por operação não autorizada, registo de atividades de tratamento, resposta a pedidos de titulares, queixa à Comissão Europeia.
- **Playbooks** `recebi-notificacao-at` e `cliente-insolvente`; **checklists** de registo de marca, loja online e concorrência; **commands** `/fisco`, `/insolvencia`, `/perfil`.
- **Método em todos os templates**: linha `Âmbito:` (nacional / ue / misto) e secção final `## Antes de enviar — verificar`, entregue separada do documento; convenção `{{CAMPO}}` vs `[VERIFICAR]`. Um teste de estrutura impede regressões.
- **`cli prompt <nome>`**: exporta um template/playbook/checklist/referência como prompt autocontido para ChatGPT, Gemini, Copilot, etc.
- `procurar_conteudo` agrupa os resultados por tipo; `listar_*` mostram o âmbito.

### Changed

- Persona genérica (qualquer forma jurídica, setor e dimensão) em `persona.ts`, `SKILL.md`, `AGENTS.md`, `GEMINI.md` e em todas as `integrations/`.
- `valores-2026.md`: taxas do 2.º semestre de 2026 (10,40% / 9,40%, Aviso n.º 16623/2026/2) e indemnização de 40 €.
- `listar()` deixa de devolver o `README` como se fosse um template.

### Fixed

- **`carta-cobranca-formal-registada`** dizia que a carta interrompe a prescrição — falso: só a citação/notificação judicial ou o reconhecimento da dívida a interrompem (arts. 323.º e 325.º CC).
- **Juros com taxa única** aplicada a períodos que atravessam semestres (ex.: 2025 inteiro dava 507,50 € em vez de 532,29 €) e taxa do 1.º semestre de 2026 ainda em uso em outubro.
- **Título executivo**: um reconhecimento de dívida só com assinatura reconhecida, ou uma fatura assinada, já não é título executivo — é preciso documento autenticado (art. 703.º, n.º 1, al. b), CPC) (`reconhecimento-divida`, `cobrancas`, `cliente-nao-paga`).
- Comunicação do arrendamento às Finanças: até ao fim do mês seguinte ao do início (art. 60.º, n.º 2, CIS), não "30 dias".
- Segredos comerciais: Código da Propriedade Industrial (DL 110/2018, arts. 313.º e ss.), não "DL 49/2018".
- Cessão de direitos de autor: escrito com reconhecimento notarial (parcial) ou escritura pública (total e definitiva) — arts. 43.º/44.º CDADC.
- Teletrabalho: regime de duração/cessação do art. 167.º CT (60 dias na duração indeterminada; até 6 meses renováveis; denúncia nos primeiros 30 dias).
- Modelo 1 do Imposto do Selo: até ao fim do 3.º mês seguinte ao do óbito (art. 26.º CIS).
- Comunicação de admissão à Segurança Social: nos 15 dias anteriores ao início do contrato (art. 29.º, n.º 2, Código Contributivo).
- `SKILL.md` "Prazos comuns": impugnação judicial tributária é de 3 meses (art. 102.º CPPT), recurso de coima 20 dias (art. 59.º/3 RGCO).
- `fiscal.md` / `fiscal-pessoal.md`: impugnação judicial em **3 meses** (art. 102.º, n.º 1, CPPT), não "90 dias".
- `multas.md` / `recebi-citacao-ou-injuncao.md` / `defesa-contraordenacao.md`: coimas fiscais (RGIT) têm defesa e recurso em **30 dias** (arts. 70.º e 80.º); redução e pagamento antecipado de coimas com os artigos certos (arts. 29.º-32.º e 75.º RGIT).
- Notificações eletrónicas da AT: consideram-se feitas no **15.º dia** após a disponibilização (art. 39.º, n.º 10, CPPT).
- `insolvencia.md`: suspensão das execuções no PER de **4 meses + 1** (art. 17.º-E CIRE, Lei 9/2022); reclamação de créditos também sem advogado (e-mail/carta registada — art. 128.º).
- `consumo.md`: presunção de não conformidade de **2 anos** e bens usados redutíveis a **18 meses** (arts. 12.º-13.º DL 84/2021); plataforma ODR encerrada em 20/07/2025.
- `pi.md`: software feito por encomenda pertence, por defeito, ao **cliente** (art. 3.º, n.º 3, DL 252/94).
- Reserva legal das Lda com o mínimo de **2.500 €** (art. 218.º, n.º 2, CSC) em `societario.md`, na checklist de constituição e em `valores-2026.md`.
- `digital-ue.md`: execução nacional do DSA pela **Lei 12-A/2026** (ANACOM como Coordenador dos Serviços Digitais; revogação dos arts. 12.º-19.º do DL 7/2004).
- Hook `PostToolUse`: reconhece os novos tipos de ato (reclamação graciosa, pedido de informação vinculativa, código de boa conduta, ata, formulário de livre resolução…) sem disparar em títulos técnicos parecidos (testes de regressão).

### Valores (`valores-2026.md`)

- Novas secções **Fisco — contencioso e execução fiscal**, **Banca, pagamentos e branqueamento** e **Concorrência e direito da UE**, com valores confirmados na lei (CAAD 10 M€; dispensa de garantia 5.000/10.000 €; numerário 3.000 €; franquia de 50 € em operações não autorizadas; RCBE; limiares de concentrações; *de minimis* 300.000 €; pequeno montante 5.000 €; OSS 10.000 €). O que não foi confirmado fica `[VERIFICAR]`.

## [1.0.5] - 2026-08

Correção da **sincronização do marketplace** no Claude Desktop / claude.ai.

### Fixed

- O diretório de topo `bin/` foi renomeado para `cli/`. O Claude Desktop não clona o repositório localmente — delega a validação num serviço remoto da Anthropic, que rejeitava o plugin com `status=failed_content`: *"Plugin contains a top-level bin/ directory ('bin/advogado-pt.mjs'). claude.ai-hosted plugins may not ship bin/ executables because they are added to PATH on the CLI but are not shown on the admin approval surface."* Na UI isto aparecia apenas como **"Falha na sincronização do marketplace. Verifique a URL do repositório"** — mensagem enganadora, porque a URL estava correta e o repositório é público. A instalação pelo CLI (`/plugin marketplace add`) nunca foi afetada, porque usa `git clone` local e não passa por esta validação.
- Atualizadas as 16 referências a `bin/advogado-pt.mjs` (README, INSTALL, CONTRIBUTING, CLAUDE.md, llms-install, `commands/doctor.md`, todas as `integrations/` e o campo `bin` + script `setup` do `package.json`). O comando passa a ser `node cli/advogado-pt.mjs`.

## [1.0.4] - 2026-07

Correção de **falsos positivos** do hook `PostToolUse`.

### Fixed

- O hook `PostToolUse` deixou de anunciar *"Documento jurídico detetado"* em ficheiros técnicos. Detetava por presença de palavras (`contrato`, `cláusula`, `NDA`, …), mas num plugin de direito esse vocabulário **é** o assunto: disparava em 105 ficheiros do próprio repositório — incluindo `mcp-server/src/tools.ts`, todas as `references/` e todos os `playbooks/` — e em specs de software que dizem "contrato" no sentido de *contrato de interface*. Passa a classificar pela **estrutura do instrumento** (título de documento, bloco de outorgantes, cláusulas numeradas, assunto/fecho de carta), ignorando ficheiros que não sejam prosa, caminhos técnicos (`.specs/`, `src/`, `scripts/`, …) e referências da casa (`## Legislação Base`). Medido no repositório: 52/56 templates detetados, **0 falsos positivos em 190** ficheiros não-jurídicos.

### Added

- `mcp-server/test/hooks.test.mjs` — testes do detetor, incluindo o caso de regressão que originou a correção.
- `detetarDocumentoJuridico()` passa a ser exportada de `hooks/advogado-hook.mjs`; o dispatcher só corre quando o ficheiro é executado diretamente, para ser testável sem efeitos secundários.

## [1.0.3] - 2026-06

Correção do **carregamento de hooks** após instalação.

### Fixed

- `plugin.json`: removida a referência `"hooks": "./hooks/hooks.json"`. O Claude Code carrega `hooks/hooks.json` (caminho padrão) **automaticamente**, pelo que declará-lo no manifesto provocava *"Duplicate hooks file detected"* e a falha do carregamento dos hooks (`SessionStart`, `PostToolUse`). O campo `manifest.hooks` só deve apontar para ficheiros de hooks **adicionais**, fora do caminho padrão.

## [1.0.2] - 2026-06

Correção de **instalação via marketplace**: o plugin instala e o servidor MCP arranca sem passos manuais.

### Fixed

- `marketplace.json`: o campo `author` da entrada do plugin passou de string para objeto `{name, email}`, como exige o schema. Antes, a validação da entrada falhava e o Claude Code mostrava o erro genérico *"This plugin uses a source type your Claude Code version does not support. Update Claude Code"* — impedindo a instalação (o problema não era a versão do Claude Code nem o `source`).
- Servidor MCP deixou de exigir `npm install`/build manual depois de instalado: `mcp-server/dist/index.js` passou a ser um **bundle self-contained** (dependências `@modelcontextprotocol/sdk` e `zod` embebidas via esbuild) e é versionado, tal como `mcp-server/content/`. Sem isto, `node dist/index.js` falhava com *"Cannot find package"* num plugin instalado via marketplace (onde não há `node_modules`).

### Changed

- Build do servidor MCP: novo passo `build:server` (esbuild) dentro de `npm run build`; `esbuild` adicionado como devDependency. O `tsc` mantém-se para type-check e para a árvore `dist/` usada nos testes.
- `.gitignore` (raiz e `mcp-server/`) passam a versionar `mcp-server/dist/index.js` e `mcp-server/content/`, mantendo ignorado o resto da saída do `tsc`.

## [1.0.1] - 2026-06

Ronda de **semântica de utilização** — melhora a ativação do plugin e a seleção das ferramentas certas, em PT e EN.

### Added

- `instructions` ao nível do servidor MCP (persona + router intenção→ferramenta) — clientes injetam como contexto.
- Annotations `readOnlyHint` nas 17 tools; autocomplete (`completable`/`complete`) dos argumentos de conteúdo e dos resources.
- 7 prompts MCP por área (`cobranca`, `contrato`, `rgpd`, `laboral`, `imovel`, `heranca`, `sociedade`), além do `advogado_pt`.
- Dicionário de sinónimos/calão na persona; exemplos de gatilho (PT/EN) nos 22 commands.

### Changed

- `SKILL.md` description com gatilhos EN (paridade) e mais frases coloquiais PT.
- Descrições das 17 tools reescritas em estilo "usa-quando" + sinónimos + pista EN.
- `plugin.json` keywords (10→20, PT/EN); `marketplace.json` description com frases-gatilho.

## [1.0.0] - 2026-06

Primeira versão pública consolidada. Reúne o trabalho desenvolvido de forma incremental (v1→v6, antes
registado informalmente no `README.md`) numa única release versionada, com distribuição multi-plataforma.

### Added

- **Skill de assessoria jurídica de Portugal** (`skills/advogado-pt/`): persona de advogado pessoal e
  empresarial (PT/EN), com **26 referências** de conhecimento por área (empresarial, pessoal e
  transversal), **28 templates** de documentos com placeholders `{{...}}`, **5 playbooks** (árvores de
  decisão) e **5 checklists** acionáveis.
- **8 calculadoras determinísticas**: juros de mora, IMT, prazos legais, prescrição/caducidade,
  compensação por cessação de contrato, custas (injunção), imposto do selo e IRS simplificado.
- **Ficheiro central de valores** `valores-2026.md` — ponto único de verdade para taxas, montantes,
  prazos e tabela de IMT; as restantes referências remetem para lá em vez de repetir números.
- **Servidor MCP em TypeScript** (`mcp-server/`): **17 tools** (as 8 calculadoras + 9 ferramentas de
  conteúdo), **resources** (todo o conteúdo jurídico em `advogado-pt://{categoria}/{nome}`) e um
  **prompt** `advogado_pt` (persona). Funciona em Claude, Cursor, Windsurf, Codex, Gemini e
  ChatGPT/OpenAI.
- **Plugin do Claude Code**: `commands/`, `hooks/` e `.claude-plugin/` (com `marketplace.json` para
  instalação local).
- **Integrações multi-plataforma** (`integrations/`): manifestos e ficheiros de persona prontos a usar
  para Claude Code (plugin), Claude Desktop, Cursor, Windsurf, Gemini CLI, Codex CLI e ChatGPT/OpenAI.

### Changed

- Conteúdo reestruturado para `skills/advogado-pt/`, separando a skill do empacotamento MCP e do plugin.
  O pacote `.skill` passa a excluir `mcp-server/` e `integrations/`.

### Fixed

- **IRC** corrigido para as taxas vigentes (15% / 19%), eliminando os valores residuais 17% / 21%.
- **Compensação por cessação** corrigida para 14 dias/ano (de 12) nas modalidades aplicáveis.
- **Custas de injunção** atualizadas (escalões e taxa de justiça desatualizados).
- Removido o link da **Plataforma ODR** (extinta) e demais correções de revisão de QA.

[1.0.3]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.3
[1.0.2]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.2
[1.0.1]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.1
[1.0.0]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.0
