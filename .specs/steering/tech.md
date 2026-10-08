# Tecnologia

## Stack
- Conteúdo: Markdown em `skills/juridico-pt/` (references, assets/templates, assets/checklists, playbooks).
- Calculadoras: Python 3 (stdlib) em `skills/juridico-pt/scripts/` + port TypeScript em `mcp-server/src/calculators/`.
- Servidor MCP: TypeScript, `@modelcontextprotocol/sdk` + `zod`, bundle self-contained com esbuild (`mcp-server/dist/index.js`).
- CLI e hook: Node ESM sem dependências (`cli/juridico-pt.mjs`, `hooks/juridico-hook.mjs`).
- Base de dados / Auth: n/a — tudo local, sem estado.

## Infraestrutura
- Hosting: nenhum. Distribuição por marketplace git (GitHub) e ficheiro `.skill` gerado por `build.py`.

## Convenções
- Linguagem do conteúdo e mensagens: PT-PT (EN onde bilingue); `->` em vez de setas unicode em saídas de consola.
- Test runner: `node --test` (mcp-server/test) e `unittest` (scripts/test_scripts.py).
- Build: `npm --prefix mcp-server run build` (bundle do conteúdo + tsc + esbuild).
- Commits: conventional commits em PT (`feat:`, `fix:`, `docs:`), com versão no título dos releases.

## Restrições
- Node >= 18; Python 3 stdlib; Windows (consola cp1252) suportado — stdout reconfigurado para UTF-8.
- Sem CI e sem npm publish (opção de custo zero).
