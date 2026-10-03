# Tasks: advogado-pt v1.2 operacional

<!-- Tracks: core +tdd. Testes desta feature numerados a partir de T-101 (a v1.1 usa a numeração 1 a 46). -->

## Restrições Globais
- Node >= 18 e Python 3 stdlib · nenhuma dependência nova · nunca `bin/` na raiz · hook sem dependências e fail-open.
- Calculadoras em Python E TypeScript com os mesmos casos de teste; dados de 2026 com fonte (URL) por linha, tal como recolhidos na investigação desta feature.
- Escrita só em `<dir>/.advogado-pt/` (nomes fixos ou `[a-z0-9][a-z0-9-]{0,40}`); texto normalizado para uma linha.
- Conteúdo novo: estilo da casa, `Âmbito:`, `## Antes de enviar — verificar` (templates), marcas de confirmação; montantes só em `valores-2026.md`.
- Mensagens de consola com `->`; stdout UTF-8.

## Fase: Setup
- [ ] 1. [shared] Commit da spec e dos testes a falhar no branch `feat/v1.2-operacional`
  - _Requirements: NFR-2_
  - _Verify: git rev-parse --abbrev-ref HEAD_
  - _Size: XS_

## Fase: Fundacional (bloqueia todas as histórias)
- [ ] 2. [shared] Exportar `feriadosNacionais` e `ehDiaUtil` de `calculators/prazos.ts`; tabelas de 2026 da investigação em `valores-2026.md` (IRS retenção — resumo, IRC, RCP/UC, TSU, subsídio de refeição)
  - _Requirements: US-2.AC-2, US-1.AC-1_
  - _Implements: mcp-server/src/calculators/prazos.ts, skills/advogado-pt/references/valores-2026.md_
  - _Verify: npm --prefix mcp-server run build_
  - _Size: S_

## História US-1 (P1 — MVP): valores e doutrina
- [ ] 3. [US1] Resolver as 18 marcas `[VERIFICAR — valores-2026]` com os valores confirmados (registo em `valores-2026.md` + remissão no ficheiro de origem); as não confirmáveis ficam com a fonte onde confirmar
  - _Requirements: US-1.AC-1, US-1.AC-2, SC-001_
  - _Makes green: T-101_
  - _Verify: node --test --test-name-pattern="T-101" mcp-server/test/v12.test.mjs_
  - _Size: M_
- [ ] 4. [US1] Posição doutrinal (posição recomendada, fonte, grau de certeza, cláusula segura) nos 4 pontos em aberto
  - _Requirements: US-1.AC-3_
  - _Makes green: T-102_
  - _Verify: node --test --test-name-pattern="T-102" mcp-server/test/v12.test.mjs_
  - _Size: M_
- [ ] 30. [US1] Corrigir `calc_compensacao_despedimento` (TS + Python): sem mínimo de 3 meses, extinção do posto a 14 dias, tetos do art. 366.º, regime transitório por períodos de antiguidade; `valores-2026.md` alinhado
  - _Requirements: US-1.AC-4_
  - _Makes green: T-135, T-136_
  - _Implements: mcp-server/src/calculators/compensacao.ts, skills/advogado-pt/scripts/compensacao_despedimento.py, mcp-server/src/tools.ts, skills/advogado-pt/references/valores-2026.md_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-135" mcp-server/test/v12.test.mjs_
  - _Size: M_
**Checkpoint:** US-1 — nenhum valor sem fonte; doutrina documentada; compensação correta.

## História US-11 (P3, fundação do perfil para US-2/US-3): vários perfis
- [ ] 5. [US11] `perfil.ts`: perfis nomeados, `perfil-ativo`, `listarPerfis`, `ativarPerfil`; tools `listar_perfis`, `ativar_perfil`; parâmetro `perfil` em obter/guardar
  - _Requirements: US-11.AC-1, US-11.AC-2, US-11.AC-3, US-11.AC-4_
  - _Makes green: T-127, T-128_
  - _Implements: mcp-server/src/perfil.ts, mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(127|128)" mcp-server/test/v12.test.mjs_
  - _Size: M_
- [ ] 6. [US11] Hook: carregar o perfil ativo
  - _Requirements: US-11.AC-2, NFR-4_
  - _Makes green: T-129_
  - _Implements: hooks/advogado-hook.mjs_
  - _Verify: node --test --test-name-pattern="T-129" mcp-server/test/v12.test.mjs_
  - _Size: S_
  - _Depends: 5_

## História US-2 (P1): calendário de obrigações
- [ ] 7. [US2] `calendario.ts`: tabela de regras 2026 (fonte por regra), aplicabilidade pelo perfil, transferência para dia útil, `aConfirmar`, `paraICS`
  - _Requirements: US-2.AC-1, US-2.AC-2, US-2.AC-3, US-2.AC-4, EC-1, SC-002_
  - _Makes green: T-103, T-104, T-105, T-106, T-107_
  - _Implements: mcp-server/src/calendario.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(103|104|105|106|107)" mcp-server/test/v12.test.mjs_
  - _Size: L_
  - _Depends: 2, 5_
- [ ] 8. [US2] Tool `calendario_obrigacoes` (com exportação `.ics`) + CLI `calendario`
  - _Requirements: US-2.AC-3, US-2.AC-5_
  - _Makes green: T-108_
  - _Implements: mcp-server/src/tools.ts, cli/advogado-pt.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-108" mcp-server/test/v12.test.mjs_
  - _Size: S_
  - _Depends: 7_
**Checkpoint:** US-2 — calendário de 2026 por perfil, exportável.

## História US-3 (P1): prazos em curso
- [ ] 9. [US3] `prazos-estado.ts` + tools `registar_prazo`, `listar_prazos`, `concluir_prazo`
  - _Requirements: US-3.AC-1, US-3.AC-2, EC-2_
  - _Makes green: T-109, T-110_
  - _Implements: mcp-server/src/prazos-estado.ts, mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(109|110)" mcp-server/test/v12.test.mjs_
  - _Size: M_
- [ ] 10. [US3] Hook: aviso de prazos vencidos e a 7 dias (fail-open)
  - _Requirements: US-3.AC-2, US-3.AC-3, NFR-4_
  - _Makes green: T-111_
  - _Implements: hooks/advogado-hook.mjs_
  - _Verify: node --test --test-name-pattern="T-111" mcp-server/test/v12.test.mjs_
  - _Size: S_
  - _Depends: 6, 9_
**Checkpoint:** US-3 — prazos registados e avisados.

## História US-4 (P1): cumprimento por dimensão
- [ ] 11. [US4][P] Conteúdo: referência `compliance`, templates `plano-prevencao-riscos-corrupcao` e `regulamento-canal-denuncias`, checklist `checklist-compliance-dimensao`
  - _Requirements: US-4.AC-1_
  - _Makes green: T-112_
  - _Implements: skills/advogado-pt/references/, skills/advogado-pt/assets/templates/, skills/advogado-pt/assets/checklists/_
  - _Verify: node --test --test-name-pattern="T-112" mcp-server/test/v12.test.mjs_
  - _Size: M_
- [ ] 12. [US4] Regras RGPC no calendário (perfil com >= 50 trabalhadores)
  - _Requirements: US-4.AC-2_
  - _Makes green: T-113_
  - _Implements: mcp-server/src/calendario.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-113" mcp-server/test/v12.test.mjs_
  - _Size: S_
  - _Depends: 7_

## História US-5 (P1): pacote do empregador
- [ ] 13. [US5][P] Conteúdo: `regulamento-interno`, `politica-registo-tempos-trabalho`, `checklist-seguranca-saude-trabalho`, playbooks `lay-off` e `despedimento-coletivo`
  - _Requirements: US-5.AC-1_
  - _Makes green: T-114_
  - _Implements: skills/advogado-pt/assets/templates/, skills/advogado-pt/assets/checklists/, skills/advogado-pt/playbooks/_
  - _Verify: node --test --test-name-pattern="T-114" mcp-server/test/v12.test.mjs_
  - _Size: M_
- [ ] 14. [US5] Calculadora de salário líquido (TS + Python + tool `calc_salario_liquido` + CLI)
  - _Requirements: US-5.AC-2, US-5.AC-4, EC-3, SC-003_
  - _Makes green: T-115, T-117, T-131_
  - _Implements: mcp-server/src/calculators/salario.ts, skills/advogado-pt/scripts/salario_liquido.py, mcp-server/src/tools.ts, cli/advogado-pt.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(115|117)" mcp-server/test/v12.test.mjs_
  - _Size: L_
  - _Depends: 2_
- [ ] 15. [US5] Calculadora de custo do trabalhador (TS + Python + tool `calc_custo_trabalhador` + CLI)
  - _Requirements: US-5.AC-3, SC-003_
  - _Makes green: T-116_
  - _Implements: mcp-server/src/calculators/salario.ts, skills/advogado-pt/scripts/salario_liquido.py, mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-116" mcp-server/test/v12.test.mjs_
  - _Size: M_
  - _Depends: 14_
**Checkpoint:** US-5 — documentos do empregador e duas calculadoras.

## História US-6 (P1): fisco do dia a dia
- [ ] 16. [US6] Calculadora de IRC (TS + Python + tool `calc_irc` + CLI)
  - _Requirements: US-6.AC-1, EC-4, SC-003_
  - _Makes green: T-118, T-119_
  - _Implements: mcp-server/src/calculators/irc.ts, skills/advogado-pt/scripts/irc.py, mcp-server/src/tools.ts, cli/advogado-pt.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(118|119)" mcp-server/test/v12.test.mjs_
  - _Size: M_
  - _Depends: 2_
- [ ] 17. [US6] Decisor de IVA em operações internacionais (TS + Python + tool `calc_iva_operacao` + CLI)
  - _Requirements: US-6.AC-2, EC-5_
  - _Makes green: T-120_
  - _Implements: mcp-server/src/calculators/iva.ts, skills/advogado-pt/scripts/iva_operacao.py, mcp-server/src/tools.ts, cli/advogado-pt.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-120" mcp-server/test/v12.test.mjs_
  - _Size: M_
- [ ] 18. [US6][P] Conteúdo: referência `iva-internacional` + playbook `faturar-cliente-estrangeiro`
  - _Requirements: US-6.AC-3_
  - _Makes green: T-121_
  - _Verify: node --test --test-name-pattern="T-121" mcp-server/test/v12.test.mjs_
  - _Size: M_
- [ ] 19. [US6] Python: IRC, IVA e taxa de justiça verdes no unittest
  - _Requirements: US-6.AC-1, US-6.AC-2, US-8.AC-2, SC-003_
  - _Makes green: T-132_
  - _Verify: python skills/advogado-pt/scripts/test_scripts.py -k T132_
  - _Size: XS_
  - _Depends: 16, 17, 21_
**Checkpoint:** US-6 — IRC e IVA.

## História US-7 (P2): contratos e societário
- [ ] 20. [US7][P] Conteúdo: 8 templates (agência, distribuição, franquia, SaaS B2B, parassocial, cessão de quotas, arrendamento não habitacional, trespasse) + playbook `dissolucao-liquidacao`
  - _Requirements: US-7.AC-1_
  - _Makes green: T-122_
  - _Verify: node --test --test-name-pattern="T-122" mcp-server/test/v12.test.mjs_
  - _Size: L_

## História US-8 (P2): tribunais
- [ ] 21. [US8] Calculadora de taxa de justiça (TS + Python + tool `calc_taxa_justica` + CLI)
  - _Requirements: US-8.AC-2, EC-6_
  - _Makes green: T-124_
  - _Implements: mcp-server/src/calculators/taxa-justica.ts, skills/advogado-pt/scripts/taxa_justica.py, mcp-server/src/tools.ts, cli/advogado-pt.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-124" mcp-server/test/v12.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [ ] 22. [US8][P] Conteúdo: templates `oposicao-injuncao` e `oposicao-execucao`
  - _Requirements: US-8.AC-1_
  - _Makes green: T-123_
  - _Verify: node --test --test-name-pattern="T-123" mcp-server/test/v12.test.mjs_
  - _Size: M_

## História US-9 (P2): setores regulados
- [ ] 23. [US9][P] Conteúdo: referência `licenciamento-setorial` (AL, restauração, construção, transportes/TVDE, mediação imobiliária)
  - _Requirements: US-9.AC-1_
  - _Makes green: T-125_
  - _Verify: node --test --test-name-pattern="T-125" mcp-server/test/v12.test.mjs_
  - _Size: M_

## História US-10 (P2): IA, videovigilância e monitorização
- [ ] 24. [US10][P] Conteúdo: `politica-uso-ia`, `politica-videovigilancia`, `politica-monitorizacao-trabalhadores`
  - _Requirements: US-10.AC-1_
  - _Makes green: T-126_
  - _Verify: node --test --test-name-pattern="T-126" mcp-server/test/v12.test.mjs_
  - _Size: M_

## História US-12 (P3): perguntas de referência
- [ ] 25. [US12] `factos.json` (>= 40 factos verificados com fonte) + `factos.test.mjs`
  - _Requirements: US-12.AC-1, SC-005_
  - _Makes green: T-130_
  - _Implements: mcp-server/test/factos.json, mcp-server/test/factos.test.mjs_
  - _Verify: node --test mcp-server/test/factos.test.mjs_
  - _Size: M_
  - _Depends: 3, 4_

## Fase: Acabamento (transversal)
- [ ] 26. [shared] Índices (READMEs, Áreas e Ferramentas no SKILL.md, README), commands `/calendario`, `/prazos`, `/irc`, `/salario`, `/compliance`, persona (tools novas), hook (lista de comandos)
  - _Requirements: SC-004_
  - _Makes green: T-133_
  - _Verify: node --test --test-name-pattern="T-133" mcp-server/test/v12.test.mjs_
  - _Size: M_
  - _Depends: 11, 13, 18, 20, 22, 23, 24_
- [ ] 27. [shared] Revisão jurídica das citações determinantes do conteúdo novo; correções em conteúdo antigo que surgirem
  - _Requirements: US-1.AC-2_
  - _Verify: node --test mcp-server/test/plugin.test.mjs_
  - _Size: M_
  - _Depends: 26_
- [ ] 28. [shared] Bump 1.2.0 (6 sítios) + CHANGELOG + build + `.skill`; o teste de versão da v1.1 passa a validar a versão corrente
  - _Requirements: NFR-1, NFR-2_
  - _Makes green: T-134_
  - _Verify: npm --prefix mcp-server test_
  - _Size: S_
  - _Depends: 27_
- [ ] 29. [shared] Suites completas (MCP + Python), smoke MCP e `cli doctor`
  - _Requirements: NFR-3_
  - _Verify: python skills/advogado-pt/scripts/test_scripts.py_
  - _Size: XS_
  - _Depends: 28_
