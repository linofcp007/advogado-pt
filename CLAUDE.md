# CLAUDE.md — Guia de Manutenção do plugin `advogado-pt`

Orienta quem (humano ou Claude) **mantém ou desenvolve** o plugin. Não é runtime jurídico — o conteúdo da skill está em `skills/advogado-pt/SKILL.md`.

## O que é

Plugin Claude Code de assessoria jurídica de Portugal, com 4 superfícies sobre o mesmo conteúdo:

- **Skill** (`skills/advogado-pt/`) — `SKILL.md` + `references/`, `assets/templates/`, `assets/checklists/`, `playbooks/`, `scripts/` (calculadoras Python).
- **Servidor MCP** (`mcp-server/`, TypeScript) — calculadoras (port TS) + conteúdo como tools/resources + persona como prompt.
- **Slash commands** (`commands/`) — wrappers finos que invocam a skill / tools.
- **Hooks** (`hooks/`) + **CLI** (`bin/advogado-pt.mjs`).

Distribuição: plugin via marketplace git (`.claude-plugin/`) + `.skill` (Anthropic Skills) gerado por `build.py`. **Sem npm publish e sem CI, por opção** (zero custo).

## Princípios invioláveis

1. **Ponto único de verdade para valores**: todos os montantes/taxas/limiares vivem em `skills/advogado-pt/references/valores-2026.md`. Os outros ficheiros **remetem** para lá. Ao mudar de ano, atualizar e renomear.
2. **Anti-alucinação**: nunca inventar artigos ou jurisprudência. Marcar "(a confirmar)" e verificar em dre.pt/dgsi.pt. Ver "Princípios de Rigor" no `SKILL.md`.
3. **Estilo da casa**: H1; `## Legislação Base`; secções em bullets; `## Para o contexto do utilizador`; `## Templates`. O `.markdownlint.jsonc` já silencia o ruído (MD022/MD032/…) — é estilo intencional.
4. **Cross-refs com nomes reais**: usar caminhos que existem mesmo (o teste `mcp-server/test/plugin.test.mjs` valida commands→tools e conteúdo referenciado).

## Calendário de manutenção (valores mudam!)

| Quando | Rever em `skills/advogado-pt/references/valores-2026.md` |
|---|---|
| **Janeiro** (pós-OE) | IRC, IRS, IAS, salário mínimo, deduções, IMT/IMI, isenções jovem |
| **Julho** | juros de mora comerciais do 2.º semestre (aviso da ETF) |
| **Outubro** | coeficiente de atualização de rendas (INE) |

Ao corrigir um valor: atualizar a "Última atualização" no topo do `valores-2026.md` **e** o port TS em `mcp-server/src/calculators/` se for uma taxa usada numa calculadora.

## Como adicionar

Caminhos relativos a `skills/advogado-pt/`:

- **Nova área** → `references/nova-area.md` + ligar em `SKILL.md` (Áreas de Competência), no `README.md` e (opcional) um command.
- **Novo template** → `assets/templates/nome.md` (comentário `<!-- Template: -->`, placeholders `{{...}}`) + índice `assets/templates/README.md`.
- **Novo playbook / checklist** → `playbooks/nome.md` / `assets/checklists/nome.md` + índice.
- **Nova calculadora** → **dois lados**: Python em `scripts/nome.py` (stdlib, `argparse`, `formatar_euros`, AVISO) + teste em `scripts/test_scripts.py`; **e** o port TS em `mcp-server/src/calculators/nome.ts` (reexportar em `index.ts`) + teste em `mcp-server/test/calculators.test.mjs` + registar a tool em `mcp-server/src/tools.ts`.
- **Novo command** → `commands/nome.md` (frontmatter `description` PT+EN + `argument-hint`; corpo fino que nomeia a tool/ficheiro real).
- **Novo hook** → registar em `hooks/hooks.json`; manter o dispatcher `hooks/advogado-hook.mjs` dependency-free e fail-open.

## Build, testes e versões

```bash
npm run setup                                    # bootstrap: instala + compila o MCP + doctor
python build.py                                  # gera advogado-pt.skill (empacota skills/advogado-pt/)
cd mcp-server && npm test                        # calculadoras + estrutura do plugin
python skills/advogado-pt/scripts/test_scripts.py  # testes das calculadoras Python
```

**Bump de versão**: alterar em SIMULTÂNEO `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `package.json`, `mcp-server/package.json` e adicionar entrada no `CHANGELOG.md` (Keep a Changelog + SemVer).

## Distribuição

Plugin: `git push` → `/plugin marketplace add linofcp007/advogado-pt` → `/plugin install advogado-pt`. Depois, build único do MCP. Noutras IAs: `node bin/advogado-pt.mjs mcp-config <host>`.

## Notas técnicas

- Scripts Python e CLI/MCP reconfiguram stdout para UTF-8 (consola cp1252 do Windows); usar `->` em vez de setas unicode nas mensagens.
- `mcp-server/dist/` e `mcp-server/content/` são gerados (gitignored) — o plugin exige o build único.
- Conteúdo jurídico parcialmente gerado por subagentes; rever citações determinantes antes de confiar.
