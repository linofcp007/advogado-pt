# Integration Plan: advogado-pt v1.1 empresas

## Pontos de Integração
- `mcp-server/src/tools.ts` — 4 tools novas, 3 com saída alterada (`calc_juros_mora`, `listar_*`, `procurar_conteudo`).
- `mcp-server/src/content.ts` — âmbito e agrupamento; `listar` deixa de incluir o README.
- `mcp-server/src/calculators/juros.ts` + `scripts/juros_mora.py` — mudança do resultado (`taxa` -> `tramos`).
- `hooks/advogado-hook.mjs` — SessionStart passa a ler o perfil.
- `cli/advogado-pt.mjs` — `prompt`, `calc creditos`, `calc legitima`, memória nos juros.
- Persona copiada em 8 sítios (persona.ts, SKILL.md, AGENTS.md, GEMINI.md, integrations/*).

## Modificações Necessárias
- Atualizar todos os usos de `r.taxa` dos juros (tools.ts, CLI, testes TS e Python) para `r.tramos`.
- O teste existente `juros comercial 5000 / 365 dias` assumia taxa única (10,15%) num período que atravessa 2 semestres — passa a T-01 (532,29 €), que é o valor juridicamente correto.
- Retocar os 29 templates e as 25 referências existentes (âmbito + verificação final).

## Sequenciamento
- Fase 1: testes a falhar (Phase 4) + fundação `content.ts`.
- Fase 2: US-1 (correções) e US-2 (método) — independentes.
- Fase 3: US-3 (perfil + persona + conteúdos, conteúdos em paralelo por área).
- Fase 4: US-4 e US-5.
- Fase 5: bump 1.1.0, build, bundle, `.skill`, suites completas.

## Riscos e Mitigações
- Saída das tools muda de formato: nenhum consumidor programático conhecido; os commands só citam nomes de tools (validado por `plugin.test.mjs`).
- Bundle esquecido -> plugin do marketplace sem as novidades: T-46 verifica o `content/`; a tarefa 26 regenera `dist/index.js`.
- Rollback: `git revert` do merge e `git push` (o marketplace volta a 1.0.5).

## Ficheiros Afetados (melhor estimativa)
- `mcp-server/src/{content,tools,perfil,persona,index}.ts`, `calculators/{juros,creditos,legitima,index}.ts` -> código.
- `mcp-server/test/{calculators,plugin,hooks,content,perfil,cli}.test.mjs` -> testes.
- `skills/advogado-pt/scripts/{juros_mora,creditos_laborais,legitima,test_scripts}.py` -> Python.
- `skills/advogado-pt/{SKILL.md,references/*,assets/templates/*,assets/checklists/*,playbooks/*}` -> conteúdo.
- `commands/{fisco,insolvencia,perfil,despedir,herancas}.md`, `hooks/advogado-hook.mjs`, `cli/advogado-pt.mjs`, `README.md`, `AGENTS.md`, `GEMINI.md`, `integrations/**`, manifests, `CHANGELOG.md`.
