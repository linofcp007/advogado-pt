# Integration Plan: advogado-pt v1.2.1 correções

## Pontos de Integração
- Motores TS (`mcp-server/src/calculators/`) e Python (`skills/advogado-pt/scripts/`): prazos, prescrição, IMT, IRS, injunção, arredondamento.
- Estado local (`perfil.ts`, `prazos-estado.ts`, `calendario.ts`) e o hook (`hooks/advogado-hook.mjs`), que leem e escrevem `.advogado-pt/`.
- Servidor MCP (`index.ts` instruções, `tools.ts`, `resources.ts`, `prompts.ts`) e o bundle versionado `mcp-server/dist/index.js`.
- Conteúdo da skill (references, playbooks, templates, checklists, SKILL.md) e a cópia em `mcp-server/content/`.
- Distribuição: `.claude-plugin/`, `commands/`, `build.py`, integrações em `integrations/`.

## Modificações Necessárias
- `contarPrazo` e `calc_prazo` ganham `judicial`; o default passa a `corridos` (mais conservador).
- A tabela de prescrição muda os prazos de `creditos-comerciais` e `servicos-profissionais` e ganha tipos novos.
- `calcularIMT` passa a aplicar a isenção do Selo no IMT Jovem.
- Toda a escrita passa por `fs-seguro.ts`; o diretório do projeto passa a ser o mesmo do hook.
- As instruções do servidor deixam de ser a persona completa (passa para o prompt).
- `commands/doctor.md` passa a `commands/diagnostico.md`.
- Testes antigos que fixavam resultados errados são substituídos.

## Sequenciamento
- Fase 1: testes a falhar e helpers (`fs-seguro`, `arredondar`, datas).
- Fase 2: motores (prazos, prescrição, IMT, IRS, injunção) nos dois lados.
- Fase 3: conteúdo e templates, em paralelo, cada correção com o seu facto.
- Fase 4: segurança (estado local, hook, resources) e entradas inválidas.
- Fase 5: distribuição (skill, instruções, commands, dependências) e manutenção (paridade, integrações, montantes).
- Fase 6: bump 1.2.1, build, validação e push (com aprovação).

## Riscos e Mitigações
- Mudança de resultados das calculadoras surpreende quem já as usava: CHANGELOG explica cada mudança com a norma; respostas das tools indicam a regra aplicada.
- Correção jurídica nova errada: reconfirmação em fonte oficial por tarefa; "(a confirmar)" quando não se confirma; rollback por `git revert` do commit da tarefa.
- Atualização do SDK do MCP: smoke e suite completa contra o bundle antes do commit; se falhar, fixa-se a versão anterior e corrige-se só a transitiva vulnerável.

## Ficheiros Afetados (melhor estimativa)
- `mcp-server/src/calculators/{prazos,prescricao,imt,irs,injuncao,salario,irc,taxa-justica,arredondar,datas}.ts` → correções e helpers
- `mcp-server/src/{tools,resources,index,persona,perfil,prazos-estado,calendario,fs-seguro}.ts` → validação, escrita segura, instruções
- `skills/advogado-pt/scripts/{prazos,prescricao,imt,irs_simplificado,custas_injuncao,iva_operacao,test_scripts}.py` → paridade
- `hooks/advogado-hook.mjs` → perfil limitado, realpath, MultiEdit
- `skills/advogado-pt/{SKILL.md,references/*.md,playbooks/*.md,assets/templates/*.md,assets/checklists/*.md}` → correções de conteúdo
- `commands/{diagnostico,juros,prazo,imt,prescricao}.md`, `README.md`, `build.py`, `integrations/**`, `AGENTS.md`, `GEMINI.md` → distribuição
- `mcp-server/test/{v121.test.mjs,plugin.test.mjs,calculators.test.mjs,factos.json,fixtures/paridade.json}` → testes
