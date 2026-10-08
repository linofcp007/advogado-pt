# Decisões: juridico-pt v2.0

<!-- Registo de decisões — só se acrescenta, é versionado com a spec. O spec_decide (dev-spec decide) acrescenta cada
     entrada: D-1, D-2… nunca renumeradas, nunca reescritas. _Affects:_ indica os AC IDs, T-IDs e secções do design em
     que a decisão toca; uma decisão posterior que substitua outra diz _Supersedes: D-n_. As descobertas (factos
     aprendidos durante o trabalho) usam o mesmo registo (_Kind: discovery_). -->

## D-1 — Renomeação direta para juridico-pt, sem migração (marketplace incluído)

- _Kind: decision_
- _Date: 2026-10-03T22:40:37.267Z_
- _Affects: US-1.AC-3, US-1.AC-4, US-1.AC-5, EC-1, SC-001, T-303, T-304, T-305_

**Contexto:** A investigação (tarefa 2) confirmou na documentação oficial do Claude Code (Host and maintain a marketplace) que (1) o mecanismo suportado para renomear um plugin é o mapa `renames` do marketplace.json (Claude Code v2.1.193+), (2) mudar o `name` do marketplace parte as atualizações de quem já o adicionou e não tem migração documentada, e (3) a renomeação do repositório no GitHub não está documentada. Um teste local isolado (CLAUDE_CONFIG_DIR temporário, marketplace de diretório) mostrou que o `renames` funciona dentro do mesmo registo ("Renamed to p-new"), mas a mudança de nome do marketplace não é aplicada ao registo existente (continua listado com o nome antigo). Perguntado, o Carlos escolheu primeiro o mapa `renames` e renomear o marketplace para juridico-pt, e depois decidiu: "Esquece a migração pois só eu é que tenho usado".

**Decisão:** Renomeação direta e completa para `juridico-pt` (plugin, marketplace, servidor MCP, skill, CLI, hook, URIs, .skill, pasta de dados) sem qualquer mecanismo de migração: sem plugin legado 1.2.2, sem mapa `renames`, sem leitura/cópia de `.advogado-pt/` e sem `ADVOGADO_PT_HOME`. O CHANGELOG 2.0.0 e o README documentam os passos manuais (remover `advogado-pt-marketplace`, adicionar o marketplace `juridico-pt`, instalar `juridico-pt`, renomear `.advogado-pt/` para `.juridico-pt/`).

**Consequências:** US-1.AC-3, US-1.AC-4, US-1.AC-5, EC-1 e SC-001 reescritos (mesmos IDs); T-303, T-304 e T-305 ajustados; a tarefa 8 passa a ser documentação (XS); o design deixa de ter o plugin legado e o fallback de pasta. Menos código e testes de transição. A renomeação do repositório no GitHub continua a exigir a confirmação explícita do Carlos (tarefa 38).

## D-2 — Formato do claude plugin eval, manifesto .mcpb e elicitation (investigação da tarefa 2)

- _Kind: discovery_
- _Date: 2026-10-03T22:40:47.943Z_

**Descoberta:** **claude plugin eval** (code.claude.com/docs/en/plugin-evals): casos em `evals/<caso>/prompt.md` (frontmatter: tags, runs, max_turns, allowed_tools, model…; corpo = prompt) + `evals/<caso>/graders/<nome>.md` (type: regex | tool_used | tool_order | file_exists | llm | baseline; regex com `match: not_contains`); resultados em `evals/results/<timestamp>/aggregate-result.json`; opções `--runs`, `--ablation with-without`, `--threshold`, `--json`, `--max-cost-usd`, `--trust-plugin`, `--no-publish`; corre em sandbox (HOME temporário, só o plugin alvo). Os graders regex/tool_used são gratuitos e determinísticos.

**.mcpb** (github.com/modelcontextprotocol/mcpb): ZIP simples com `manifest.json` na raiz; `manifest_version` "0.3" para Node (schema estrito: chaves desconhecidas dão erro); `server: {type: "node", entry_point: "server/index.js", mcp_config: {command: "node", args: ["${__dirname}/server/index.js"]}}`; só `${__dirname}`, `${/}`, `${pathSeparator}` e `${user_config.*}` em mcp_config; incluir `package.json` com `"type":"module"`; o conteúdo vai em `<raiz>/content/` (o content.ts resolve `../content` a partir do entry). ZIP sem ZIP64, nomes ASCII com `/`, CRC-32, sem comentário; preferir entradas **stored** (método 0) por um relato de falha do Desktop com deflate > 16 KB; **não assinar** (issue #278 aberta). `prompts_generated: true` em vez de listar prompts.

**Elicitation** (spec 2025-11-25, SDK 1.31): `server.server.getClientCapabilities()?.elicitation?.form` e `server.server.elicitInput({mode:"form", message, requestedSchema}, {timeout})`; schema plano só de primitivos (string/number/integer/boolean/enum; sem `pattern`); respostas accept/decline/cancel; o SDK lança se o cliente não suportar e valida o `content` com Ajv (já no bundle). Documentada no Claude Code (v2.1.76+); **não documentada no Claude Desktop/claude.ai** → todos os campos pedidos por formulário existem também como argumentos opcionais da tool, e sem capacidade (ou com decline/cancel) a tool devolve texto com o que falta.

**Consequências:** O design aprovado mantém-se para US-4 (avaliações), US-10 (.mcpb com escritor de ZIP próprio) e elicitation com recurso a texto; acertos de implementação: entradas stored no .mcpb, sem assinatura, package.json type module, conteúdo em content/ ao lado de server/.
