---
description: Diagnostica a instalação do advogado-pt — Node, build do MCP e tools. Diagnoses the advogado-pt install — Node, MCP build and tools.
argument-hint: "[opcional: o que falhou]"
---

Ativa a skill `advogado-pt` e faz um diagnóstico da instalação ($ARGUMENTS, se indicado).

Verifica, por esta ordem, e reporta o que falta:

1. **Node ≥ 18** — corre `node --version`. Se inferior a 18, avisa que o servidor MCP e o CLI exigem Node 18 ou superior (ver `mcp-server/package.json` → `engines`).
2. **Build do servidor MCP** — confirma se `mcp-server/dist/index.js` existe. Se não existir, instrui: `cd mcp-server && npm install && npm run build`.
3. **CLI disponível** — se `bin/advogado-pt.mjs doctor` estiver disponível, corre-o; caso contrário usa `node bin/advogado-pt.mjs` (ajuda) e `node bin/advogado-pt.mjs mcp-config claude-code` para validar que o caminho do servidor resolve.
4. **Tools MCP respondem** — chama uma tool de conteúdo leve, p. ex. `listar_areas_juridicas` (ou `listar_templates`), e confirma que devolve resultados. Se falhar, é sinal de que o servidor não está a correr ou não foi compilado (volta ao passo 2).

No fim, apresenta um resumo claro: o que está OK e o que precisa de ser corrigido, com os comandos exatos a executar.

**EN:** Activate the `advogado-pt` skill and run an install diagnostic ($ARGUMENTS, if given). Check, in order, and report what is missing:

1. **Node ≥ 18** — run `node --version`; below 18, warn that the MCP server and CLI require Node 18+ (see `mcp-server/package.json` → `engines`).
2. **MCP server build** — confirm `mcp-server/dist/index.js` exists; if not, instruct `cd mcp-server && npm install && npm run build`.
3. **CLI available** — if `bin/advogado-pt.mjs doctor` works, run it; otherwise use `node bin/advogado-pt.mjs` (help) and `node bin/advogado-pt.mjs mcp-config claude-code` to validate the server path resolves.
4. **MCP tools respond** — call a light content tool, e.g. `listar_areas_juridicas` (or `listar_templates`), and confirm it returns results; if it fails, the server is not running or not built (back to step 2).

Finally, give a clear summary of what is OK and what needs fixing, with the exact commands to run.
