# Estrutura do Projeto

## Layout
```
.claude-plugin/        plugin.json + marketplace.json
commands/              slash commands (wrappers finos)
hooks/                 hooks.json + advogado-hook.mjs (dispatcher fail-open)
cli/advogado-pt.mjs    CLI universal (mcp-config, calc, doctor)
skills/advogado-pt/    SKILL.md + references/ + assets/{templates,checklists}/ + playbooks/ + scripts/
mcp-server/            src/ (tools, content, calculators, persona) + test/ + scripts/ + dist/ + content/
integrations/          instruções para outras IAs (Cursor, Windsurf, Gemini, ChatGPT, Codex)
build.py               gera advogado-pt.skill
```

## Fronteiras de Módulos
- `skills/advogado-pt/` é a fonte do conteúdo; `mcp-server/content/` é uma cópia gerada (nunca editar à mão).
- `mcp-server/src/calculators/*` são funções puras; `tools.ts` só formata e regista; o CLI importa as calculadoras compiladas.
- O hook não importa nada do servidor MCP.

## Código Partilhado
- Formatação de euros: `calculators/format.ts` (TS) e `formatar_euros` em cada script Python.
- Leitura de conteúdo: `mcp-server/src/content.ts` (listar, ler, procurar).

## Nomenclatura
- Ficheiros de conteúdo em kebab-case PT sem acentos (`pacto-social-unipessoal-lda.md`).
- Tools MCP: `calc_*`, `listar_*`, `obter_*`, `ler_referencia`, `procurar_conteudo`.

## Commits
Conventional commits: `type(scope): description`. Tipos: feat|fix|refactor|test|docs|chore|style|perf

## Branches e Revisões
- main + feature/<nome>; merge local (sem PR nem CI).
