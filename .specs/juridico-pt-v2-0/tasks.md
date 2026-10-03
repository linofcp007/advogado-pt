# Tasks: juridico-pt v2.0

<!-- Tracks: core +tdd +ai +privacy. Testes desta feature numerados de T-301 a T-341. Assenta na 1.2.1
     (fs-seguro, datas estritas, INSTRUCOES_MCP, arredondamento único). Ações externas (renomear o
     repositório no GitHub, push) só com confirmação explícita do Carlos. -->

## Restrições Globais
- Node >= 18 e Python 3 só com a biblioteca-padrão · nenhuma dependência nova de runtime · `.docx`, ZIP e `.mcpb` com módulos próprios · nunca `bin/` na raiz · hook sem dependências, fail-open e SessionStart < 300 ms.
- Identificador novo `juridico-pt` (nome apresentado "Jurídico PT"); nunca "És o advogado" — sempre "assistente jurídico", com o aviso de que não substitui advogado inscrito na OA.
- Dados em `.juridico-pt/` (projeto ou `~/.juridico-pt/`), sem leitura nem migração de `.advogado-pt/` — só o Carlos usava o plugin (D-1).
- Calculadoras novas em Python E TypeScript com os mesmos casos; montantes e limiares em `valores-2026.md` com fonte.
- Toda a escrita através de `fs-seguro` (sem links, tmp + rename), dentro do projeto ou de `~/.juridico-pt/`.
- Cada regra jurídica nova com fonte oficial e um facto em `factos.json` (ids `v20-…`); o que não se confirmar fica "(a confirmar)".
- Mensagens de consola com `->`; stdout UTF-8; erros sem stack trace.

## Fase: Setup
- [x] 1. [shared] Branch `feat/v2.0-juridico-pt` a partir do `main` com a 1.2.1; commit da spec aprovada
  - _Requirements: NFR-2_
  - _Verify: git rev-parse --abbrev-ref HEAD_
  - _Size: XS_
- [x] 2. [shared] Investigação: confirmar na documentação oficial (claude-code-guide e docs) (a) o que acontece a um marketplace instalado quando o `name` do `marketplace.json` e o repositório mudam, (b) o formato e as opções do `claude plugin eval`, (c) o manifesto `.mcpb` para servidores Node, (d) a elicitation no SDK do MCP e o anúncio da capacidade pelo cliente; registar as decisões em `decisions.md` e ajustar o design se a alternativa de recurso for necessária
  - _Requirements: US-1.AC-1, US-1.AC-4, US-4.AC-1, US-10.AC-2, US-10.AC-3_
  - _Size: S_
  - _Depends: 1_
- [ ] 3. [shared] Escrever os testes a falhar: `mcp-server/test/v20.test.mjs` (T-302 a T-340 exceto T-309, T-313, T-316, T-326, T-336 a T-338), os casos novos de `plugin.test.mjs` (T-301, T-316, T-336, T-337), `test_scripts.py` (T-309, T-326), fixtures do contabilista e factos `v20-` esperados
  - _Requirements: US-1.AC-1, US-1.AC-3, US-3.AC-1, US-7.AC-1, US-9.AC-3, US-10.AC-1, US-11.AC-2_
  - _Implements: mcp-server/test/v20.test.mjs, mcp-server/test/plugin.test.mjs, mcp-server/test/fixtures/contabilista/_
  - _Verify: npm --prefix mcp-server test_
  - _Expect: fail_
  - _Size: L_
  - _Depends: 2_
- [ ] 4. [shared] Conjunto de avaliação (`evals/`, ≥ 40 casos golden/adversariais/regressão com verificações determinísticas) e base registada no `eval-plan.md` (sem plugin e com a 1.2.1)
  - _Requirements: US-4.AC-1, US-4.AC-2_
  - _Makes green: T-312_
  - _Implements: evals/_
  - _Verify: node --test --test-name-pattern="T-312" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 2_

## História US-1 (P1 — MVP): renomeação e migração
- [ ] 5. [US1] `dados.ts`: pasta `.juridico-pt/` no projeto e no perfil geral (`JURIDICO_PT_HOME` ou a home), sem ler `.advogado-pt/`; perfil, prazos e calendário passam a usá-la
  - _Requirements: US-1.AC-3, US-1.AC-5, EC-1_
  - _Makes green: T-303, T-305_
  - _Implements: mcp-server/src/dados.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-303|T-305" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 3_
- [ ] 6. [US1] Renomear identificadores: manifesto, marketplace, servidor MCP, `skills/juridico-pt/` (git mv), `cli/juridico-pt.mjs`, `hooks/juridico-hook.mjs`, URI `juridico-pt://`, prompt `assistente_juridico`, `build.py` → `juridico-pt.skill`, integrações, README, AGENTS, GEMINI, CLAUDE.md e constituição
  - _Requirements: US-1.AC-1_
  - _Makes green: T-301_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-301" mcp-server/test/plugin.test.mjs_
  - _Size: L_
  - _Depends: 5_
- [ ] 7. [US1] Persona e textos de "assistente jurídico" em persona, instruções, SKILL.md, commands, agents e documentação; aviso da OA mantido
  - _Requirements: US-1.AC-2_
  - _Makes green: T-302_
  - _Verify: node --test --test-name-pattern="T-302" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 6_
- [ ] 8. [US1] CHANGELOG 2.0.0 e README com os passos para trocar a instalação (remover `advogado-pt-marketplace`, adicionar o marketplace `juridico-pt`, instalar `juridico-pt`) e renomear `.advogado-pt/` à mão
  - _Requirements: US-1.AC-4, SC-001_
  - _Makes green: T-304_
  - _Verify: node --test --test-name-pattern="T-304" mcp-server/test/v20.test.mjs_
  - _Size: XS_
  - _Depends: 6_
**Checkpoint:** US-1 — `juridico-pt` instalável, dados em `.juridico-pt/`, passos de troca documentados.

## História US-2 (P1): faturação 2027
- [ ] 9. [US2] Referência `faturacao`, playbook `faturacao-eletronica-2027`, checklist `checklist-faturacao`, command `/faturacao`, datas em `valores-2026.md` — cada regra confirmada no DR/Portal das Finanças; factos `v20-fatura-`
  - _Requirements: US-2.AC-1_
  - _Makes green: T-306_
  - _Verify: node --test --test-name-pattern="T-306" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 6_
- [ ] 10. [US2] Calendário: campo `emite_faturas` e evento da data-limite das faturas em PDF sem assinatura qualificada
  - _Requirements: US-2.AC-2_
  - _Makes green: T-307_
  - _Implements: mcp-server/src/calendario.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-307" mcp-server/test/v20.test.mjs_
  - _Size: S_
  - _Depends: 9_

## História US-3 (P1): cobrança
- [ ] 11. [US3] `calcularJurosLote` + tool `calc_juros_lote` + CLI `calc lote`
  - _Requirements: US-3.AC-1, EC-2_
  - _Makes green: T-308_
  - _Implements: mcp-server/src/calculators/juros-lote.ts, mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-308" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 3_
- [ ] 12. [US3] Python `calcular_juros_lote` com os mesmos casos
  - _Requirements: US-3.AC-1_
  - _Makes green: T-309_
  - _Implements: skills/juridico-pt/scripts/juros_mora.py_
  - _Verify: python skills/juridico-pt/scripts/test_scripts.py -k T309_
  - _Size: S_
  - _Depends: 11_
- [ ] 13. [US3][P] Template de carta com várias faturas; PEPEX (Lei 32/2014) e IVA de créditos incobráveis no playbook `cliente-nao-paga` e em `cobrancas.md`, com fonte
  - _Requirements: US-3.AC-2_
  - _Makes green: T-310_
  - _Verify: node --test --test-name-pattern="T-310" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 6_
- [ ] 14. [US3] `/cobrar` com instruções para o conector de faturação (quando existe) e proposta de `registar_prazo`
  - _Requirements: US-3.AC-3, US-3.AC-4_
  - _Makes green: T-311_
  - _Verify: node --test --test-name-pattern="T-311" mcp-server/test/v20.test.mjs_
  - _Size: XS_
  - _Depends: 11_
**Checkpoint:** US-1 a US-3 — o MVP da 2.0.

## História US-5 (P2): atualidade
- [ ] 15. [US5] `atualidade.ts` + tool `verificar_atualidade` + linha no SessionStart; "Próxima revisão" no topo de `valores-2026.md`
  - _Requirements: US-5.AC-1, US-5.AC-2_
  - _Makes green: T-314, T-315_
  - _Implements: mcp-server/src/atualidade.ts, hooks/juridico-hook.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-314|T-315" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 6_

## História US-6 (P2): subagentes
- [ ] 16. [US6] `agents/verificador-citacoes.md` e `agents/revisor-contratos.md` (só leitura, `model: inherit`, saída estruturada, "não verificada" sem fonte)
  - _Requirements: US-6.AC-1, US-6.AC-2, US-6.AC-3, EC-5_
  - _Makes green: T-316, T-317_
  - _Implements: agents/verificador-citacoes.md, agents/revisor-contratos.md_
  - _Verify: node --test --test-name-pattern="T-316" mcp-server/test/plugin.test.mjs_
  - _Size: S_
  - _Depends: 6_

## História US-7 (P2): modo contabilista
- [ ] 17. [US7] Campos novos do perfil e regras do calendário que os usam (IMI, IUC, período de tributação diferente do ano civil)
  - _Requirements: US-7.AC-3_
  - _Makes green: T-320_
  - _Implements: mcp-server/src/perfil.ts, mcp-server/src/calendario.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-320" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 5_
- [ ] 18. [US7] Prazos com perfil e `.ics` por perfil
  - _Requirements: US-7.AC-2_
  - _Makes green: T-319_
  - _Implements: mcp-server/src/prazos-estado.ts, mcp-server/src/calendario.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-319" mcp-server/test/v20.test.mjs_
  - _Size: S_
  - _Depends: 5_
- [ ] 19. [US7] `painel.ts` + tool `painel_clientes` + CLI `painel` + command `/painel`
  - _Requirements: US-7.AC-1, EC-6, SC-005_
  - _Makes green: T-318_
  - _Implements: mcp-server/src/painel.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-318" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 17, 18_

## História US-8 (P2): templates do dia a dia
- [ ] 20. [US8][P] Templates `convocatoria-assembleia-geral`, `ata-aprovacao-contas`, `procuracao`, `carta-caducidade-contrato-termo`, `resposta-livro-reclamacoes` (fonte por regra) e índice
  - _Requirements: US-8.AC-1_
  - _Makes green: T-321_
  - _Verify: node --test --test-name-pattern="T-321" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 6_
- [ ] 21. [US8] Convenção única de placeholders em todos os templates
  - _Requirements: US-8.AC-2_
  - _Makes green: T-322_
  - _Verify: node --test --test-name-pattern="T-322" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 20_

## História US-9 (P2): NIS2, fundos e contratação pública
- [ ] 22. [US9][P] `checklist-nis2` (DL 125/2025) e atualização de `compliance.md`/`digital-ue.md`
  - _Requirements: US-9.AC-1_
  - _Makes green: T-323_
  - _Verify: node --test --test-name-pattern="T-323" mcp-server/test/v20.test.mjs_
  - _Size: S_
  - _Depends: 6_
- [ ] 23. [US9][P] Referência `fundos-europeus` e playbook `recebi-pedido-devolucao-apoio`
  - _Requirements: US-9.AC-2_
  - _Makes green: T-324_
  - _Verify: node --test --test-name-pattern="T-324" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 6_
- [ ] 24. [US9] `calcularProcedimentoCCP` + tool `calc_procedimento_ccp` + CLI `calc ccp` (limiares do DL 177/2026 confirmados no DR)
  - _Requirements: US-9.AC-3, EC-3_
  - _Makes green: T-325_
  - _Implements: mcp-server/src/calculators/ccp.ts, mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-325" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 3_
- [ ] 25. [US9] Python `procedimento_ccp` com os mesmos casos
  - _Requirements: US-9.AC-3_
  - _Makes green: T-326_
  - _Implements: skills/juridico-pt/scripts/procedimento_ccp.py_
  - _Verify: python skills/juridico-pt/scripts/test_scripts.py -k T326_
  - _Size: S_
  - _Depends: 24_
- [ ] 26. [US9][P] Playbook `vender-ao-estado` e templates de esclarecimentos, erros e omissões, audiência prévia e impugnação administrativa
  - _Requirements: US-9.AC-4_
  - _Makes green: T-327_
  - _Verify: node --test --test-name-pattern="T-327" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 24_

## História US-10 (P2): formatos e instalação
- [ ] 27. [US10] `zip.ts` + `docx.ts` + tool `exportar_documento` + CLI `exportar` + command `/exportar`
  - _Requirements: US-10.AC-1, EC-4, NFR-1_
  - _Makes green: T-328_
  - _Implements: mcp-server/src/zip.ts, mcp-server/src/docx.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-328" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 5_
- [ ] 28. [US10] Elicitation do perfil com recurso a perguntas em texto
  - _Requirements: US-10.AC-2_
  - _Makes green: T-329_
  - _Implements: mcp-server/src/elicitacao.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-329" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 5_
- [ ] 29. [US10] `build-mcpb.mjs` e pacote `.mcpb`
  - _Requirements: US-10.AC-3_
  - _Makes green: T-330_
  - _Implements: mcp-server/scripts/build-mcpb.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-330" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 27_

## História US-11 (P2): privacidade e custo
- [ ] 30. [US11] Aviso de `.gitignore` e `acrescentar_gitignore`
  - _Requirements: US-11.AC-1_
  - _Makes green: T-331_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-331" mcp-server/test/v20.test.mjs_
  - _Size: S_
  - _Depends: 5_
- [ ] 31. [US11] Tool `apagar_perfil`
  - _Requirements: US-11.AC-2_
  - _Makes green: T-332_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-332" mcp-server/test/v20.test.mjs_
  - _Size: S_
  - _Depends: 18_
- [ ] 32. [US11] SessionStart numa linha fora de projetos com dados; descrições dos commands ≤ 150 caracteres
  - _Requirements: US-11.AC-3, SC-003_
  - _Makes green: T-333_
  - _Implements: hooks/juridico-hook.mjs_
  - _Verify: node --test --test-name-pattern="T-333" mcp-server/test/v20.test.mjs_
  - _Size: S_
  - _Depends: 15_
- [ ] 33. [US11][P] Referência `privacidade-plugin` e secção no README
  - _Requirements: US-11.AC-4_
  - _Makes green: T-334_
  - _Verify: node --test --test-name-pattern="T-334" mcp-server/test/v20.test.mjs_
  - _Size: S_
  - _Depends: 6_
- [ ] 34. [US11] Conservação: prazos cumpridos há mais de 12 meses retirados; perfil antigo assinalado
  - _Requirements: US-11.AC-5_
  - _Makes green: T-335_
  - _Implements: mcp-server/src/prazos-estado.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-335" mcp-server/test/v20.test.mjs_
  - _Size: S_
  - _Depends: 18_

## Fase: Acabamento (transversal)
- [ ] 35. [shared] Índices, SKILL.md (tabelas), README, persona, lista de commands do hook e integrações com tudo o que é novo
  - _Requirements: SC-004_
  - _Makes green: T-340_
  - _Verify: node --test --test-name-pattern="T-340" mcp-server/test/v20.test.mjs_
  - _Size: M_
  - _Depends: 10, 14, 16, 19, 21, 23, 26, 29, 33_
- [ ] 36. [shared] Bump 2.0.0, CHANGELOG com "Migração", bundle e conteúdo regenerados, `juridico-pt.skill`, `.mcpb`, tag `v2.0.0`
  - _Requirements: NFR-1, NFR-2_
  - _Makes green: T-336, T-337_
  - _Verify: npm --prefix mcp-server test_
  - _Size: S_
  - _Depends: 35_
- [ ] 37. [shared] Avaliações contra os limiares, suites completas, validador oficial, desempenho do hook
  - _Requirements: US-4.AC-2, NFR-3, NFR-4, SC-002_
  - _Makes green: T-313, T-338, T-339_
  - _Verify: python skills/juridico-pt/scripts/test_scripts.py_
  - _Size: M_
  - _Depends: 36_
- [ ] 38. [shared] Push, renomear o repositório no GitHub para `juridico-pt` (com confirmação explícita do Carlos) e quickstart manual (`.mcpb` no Desktop, `.docx` no Word/LibreOffice, troca da instalação real seguindo o CHANGELOG)
  - _Requirements: US-1.AC-4, US-10.AC-1, US-10.AC-3, SC-001_
  - _Makes green: T-341_
  - _Size: S_
  - _Depends: 37_
