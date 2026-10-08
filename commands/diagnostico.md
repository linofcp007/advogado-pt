---
description: Diagnostica a instalação do juridico-pt — Node, servidor MCP e tools. Diagnoses the juridico-pt install — Node, MCP server and tools.
argument-hint: "[opcional: o que falhou]"
---

Ativa a skill `juridico-pt` e faz um diagnóstico da instalação ($ARGUMENTS, se indicado). (Chama-se `/diagnostico` porque `/doctor` é um comando nativo do Claude Code.)

Verifica, por esta ordem, e reporta o que falta:

1. **Node ≥ 18** — corre `node --version`. Se inferior a 18, avisa que o servidor MCP e o CLI exigem Node 18 ou superior.
2. **Servidor MCP** — o plugin traz o servidor já compilado em `${CLAUDE_PLUGIN_ROOT}/mcp-server/dist/index.js`; não é preciso compilar nada. Se o ficheiro não existir, a instalação está incompleta: sugere reinstalar o plugin (`/plugin marketplace update` e `/plugin install juridico-pt`).
3. **Diagnóstico do CLI** — corre `node "${CLAUDE_PLUGIN_ROOT}/cli/juridico-pt.mjs" doctor` e mostra o resultado; `node "${CLAUDE_PLUGIN_ROOT}/cli/juridico-pt.mjs" mcp-config claude-code` confirma que o caminho do servidor resolve.
4. **Tools MCP respondem** — chama uma tool de conteúdo leve, p. ex. `listar_areas_juridicas` (ou `listar_templates`), e confirma que devolve resultados. Se falhar, vê `/mcp` (estado do servidor `juridico-pt`) e volta ao passo 2.

No fim, apresenta um resumo claro: o que está OK e o que precisa de ser corrigido, com os comandos exatos a executar.

**EN:** Activate the `juridico-pt` skill and run an install diagnostic ($ARGUMENTS, if given). It is called `/diagnostico` because `/doctor` is a built-in Claude Code command. Check, in order, and report what is missing:

1. **Node ≥ 18** — run `node --version`; below 18, warn that the MCP server and CLI require Node 18+.
2. **MCP server** — the plugin ships the server prebuilt at `${CLAUDE_PLUGIN_ROOT}/mcp-server/dist/index.js`; nothing needs compiling. If the file is missing, the install is incomplete: suggest reinstalling the plugin (`/plugin marketplace update` and `/plugin install juridico-pt`).
3. **CLI diagnostic** — run `node "${CLAUDE_PLUGIN_ROOT}/cli/juridico-pt.mjs" doctor`; `node "${CLAUDE_PLUGIN_ROOT}/cli/juridico-pt.mjs" mcp-config claude-code` confirms the server path resolves.
4. **MCP tools respond** — call a light content tool, e.g. `listar_areas_juridicas` (or `listar_templates`), and confirm it returns results; if it fails, check `/mcp` (status of the `juridico-pt` server) and go back to step 2.

Finally, give a clear summary of what is OK and what needs fixing, with the exact commands to run.

*Exemplos · Examples: "as tools do juridico-pt não respondem", "check why the MCP server isn't loading".*
