# Integration Plan: advogado-pt v1.2 operacional

## Pontos de Integração
- `mcp-server/src/perfil.ts` — perfis nomeados e perfil ativo (retrocompatível).
- `mcp-server/src/calculators/prazos.ts` — exportar `feriadosNacionais` / `ehDiaUtil` para o calendário.
- `mcp-server/src/tools.ts` — 11 tools novas; `obter/guardar_perfil_empresa` com `perfil?`.
- `hooks/advogado-hook.mjs` — SessionStart lê o perfil ativo e `prazos.md`.
- `cli/advogado-pt.mjs` — `calendario`, `calc salario|custo|irc|iva|taxa-justica`.
- Conteúdo: `skills/advogado-pt/**` + índices, SKILL.md, README, persona, commands.

## Modificações Necessárias
- O teste de versão da v1.1 (que fixava "1.1.0") passa a validar que todos os manifestos têm a mesma versão que `plugin.json` e que o CHANGELOG tem essa entrada.
- `listar` de perfis ignora `perfil-empresa.md` como nomeado (é o "default").

## Sequenciamento
- Fase 1: testes a falhar + fundação (feriados exportados, valores 2026).
- Fase 2: US-1 (valores/doutrina) e US-11 (perfis) — base para hook e calendário.
- Fase 3: US-2 (calendário) e US-3 (prazos) + hook.
- Fase 4: calculadoras (US-5, US-6, US-8) em paralelo com o conteúdo por subagentes (US-4..US-10).
- Fase 5: factos de referência (US-12), índices, revisão, bump 1.2.0, build.

## Riscos e Mitigações
- Prazos legais alterados em 2026 → regras com fonte; testes por obrigação; aviso de confirmação.
- Conteúdo por subagentes → briefing comum da v1.1 + revisão + factos de regressão.
- Rollback: `git revert` do merge; marketplace volta a 1.1.0.

## Ficheiros Afetados (melhor estimativa)
- Código: `perfil.ts`, `calendario.ts` (novo), `prazos-estado.ts` (novo), `calculators/{salario,irc,taxa-justica,iva}.ts` (novos), `calculators/{prazos,index}.ts`, `tools.ts`, hook, CLI.
- Python: `scripts/{salario_liquido,irc,taxa_justica,iva_operacao}.py` + `test_scripts.py`.
- Testes: `mcp-server/test/v12.test.mjs`, `factos.json`, `factos.test.mjs`, ajuste do teste de versão.
- Conteúdo: ~25 ficheiros novos + valores-2026 + 18 remissões + 4 posições doutrinais.
