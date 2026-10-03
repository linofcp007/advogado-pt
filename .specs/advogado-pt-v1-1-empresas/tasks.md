# Tasks: advogado-pt v1.1 empresas

<!-- Tracks: core +tdd. Organizado por história; [P] = paralelizável. -->

## Restrições Globais
- Node >= 18 e Python 3 stdlib · nenhuma dependência nova (NFR-1) · nunca criar `bin/` na raiz.
- Conteúdo: PT-PT; estilo da casa (referências: H1, `## Legislação Base`, bullets, `## Para o contexto do utilizador`, `## Templates`; templates: `<!-- Template: … -->` com linha `Âmbito:`, placeholders `{{...}}`, `[VERIFICAR]` para o que falta confirmar, fecho `## Antes de enviar — verificar` com ≥ 3 `- [ ]`).
- Anti-alucinação: artigo, prazo ou valor não confirmado em fonte oficial → "(a confirmar)" ou `[VERIFICAR]`; montantes remetem para `references/valores-2026.md`.
- Mensagens de consola com `->`, não setas unicode; stdout UTF-8.
- Taxas comerciais §3 por semestre (DL 62/2013 = §3 + 1 p.p.): 2013-2 7,50 · 2014-1 7,25 · 2014-2 7,15 · 2015-1 7,05 · 2015-2 7,05 · 2016-1 7,05 · 2016-2 a 2022-2 7,00 · 2023-1 9,50 · 2023-2 11,00 · 2024-1 11,50 · 2024-2 11,25 · 2025-1 10,15 · 2025-2 9,15 · 2026-1 9,15 · 2026-2 9,40.
- Perfil: só `<dir>/.advogado-pt/perfil-empresa.md`; campos `forma_juridica, denominacao, setor, trabalhadores, volume_negocios, regime_iva, contabilidade, clientes, dados_pessoais, linguas, notas, atualizado_em`.

## Fase: Setup
- [x] 1. [shared] Criar o branch `feat/v1.1-empresas` e fazer commit dos specs e dos testes a falhar (`test(v1.1): scaffold failing tests`)
  - _Requirements: NFR-2_
  - _Verify: git rev-parse --abbrev-ref HEAD_
  - _Size: XS_

## Fase: Fundacional (bloqueia todas as histórias)
- [x] 2. [shared] `content.ts`: `lerAmbito`, `listarComAmbito`, `formatarProcura`, `listar` sem README; `procurar` devolve `ambito`
  - _Requirements: US-2.AC-3, US-5.AC-3_
  - _Makes green: T-30, T-31_
  - _Implements: mcp-server/src/content.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(30|31)" mcp-server/test/content.test.mjs_
  - _Size: S_

## História US-1 (P1 — MVP): correções
- [x] 3. [US1][P] Corrigir a frase da prescrição no template de cobrança formal (arts. 323.º/325.º CC)
  - _Requirements: US-1.AC-1_
  - _Makes green: T-23_
  - _Implements: skills/advogado-pt/assets/templates/carta-cobranca-formal-registada.md_
  - _Verify: node --test --test-name-pattern="T-23" mcp-server/test/plugin.test.mjs_
  - _Size: XS_
- [x] 4. [US1] Juros em TS: tabela semestral, tramos, `comercial-geral`, estimada, erros, `memoriaJuros`; `calc_juros_mora` e `cli calc juros` com a memória
  - _Requirements: US-1.AC-2, US-1.AC-3, US-1.AC-4, US-1.AC-5, US-1.AC-6, US-1.AC-8, EC-1, EC-2_
  - _Makes green: T-01, T-02, T-03, T-04, T-05, T-06, T-07, T-08_
  - _Implements: mcp-server/src/calculators/juros.ts, mcp-server/src/calculators/index.ts, mcp-server/src/tools.ts, cli/advogado-pt.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(01|02|03|04|05|06|07|08)" mcp-server/test/calculators.test.mjs_
  - _Size: M_
- [x] 5. [US1][P] Juros em Python: a mesma tabela, `calcular_juros` com tramos e `memoria_juros`, CLI argparse com `comercial-geral`
  - _Requirements: US-1.AC-2, US-1.AC-3, US-1.AC-4, US-1.AC-5, US-1.AC-6_
  - _Makes green: T-18_
  - _Implements: skills/advogado-pt/scripts/juros_mora.py_
  - _Verify: python skills/advogado-pt/scripts/test_scripts.py -k T18_
  - _Size: S_
- [x] 6. [US1][P] `valores-2026.md`: taxas do 2.º semestre de 2026 (Aviso n.º 16623/2026/2), "Última atualização" 2026-10, nota de que a tabela histórica vive nas calculadoras
  - _Requirements: US-1.AC-7_
  - _Makes green: T-24_
  - _Implements: skills/advogado-pt/references/valores-2026.md_
  - _Verify: node --test --test-name-pattern="T-24" mcp-server/test/plugin.test.mjs_
  - _Size: XS_
**Checkpoint:** US-1 — cobranças corretas e juros por tramos nos dois lados, testáveis sem as outras histórias.

## História US-2 (P1): método nos templates e referências
- [x] 7. [US2][P] Linha `Âmbito:` nas 25 referências existentes
  - _Requirements: US-2.AC-2, US-2.AC-5_
  - _Implements: skills/advogado-pt/references/_
  - _Verify: node --test --test-name-pattern="T-22" mcp-server/test/plugin.test.mjs_
  - _Size: S_
- [x] 8. [US2][P] Bloco `## Antes de enviar — verificar` específico de cada documento + `Âmbito:` nos 29 templates existentes
  - _Requirements: US-2.AC-1, US-2.AC-2, US-2.AC-5, SC-001_
  - _Makes green: T-21, T-22_
  - _Implements: skills/advogado-pt/assets/templates/_
  - _Verify: node --test --test-name-pattern="T-(21|22)" mcp-server/test/plugin.test.mjs_
  - _Size: L_
- [x] 9. [US2] Convenção `{{CAMPO}}` vs `[VERIFICAR]` e entrega separada do "Antes de enviar" no README de templates e no SKILL.md; `listar_*` mostram o âmbito
  - _Requirements: US-2.AC-3, US-2.AC-4_
  - _Makes green: T-28_
  - _Implements: skills/advogado-pt/assets/templates/README.md, skills/advogado-pt/SKILL.md, mcp-server/src/tools.ts_
  - _Verify: node --test --test-name-pattern="T-28" mcp-server/test/plugin.test.mjs_
  - _Size: S_
**Checkpoint:** US-2 — teste de estrutura verde para os conteúdos existentes; listagens com âmbito.

## História US-3 (P1): qualquer empresa
- [x] 10. [US3] Persona genérica nos 8 sítios + secção "Perfil da Empresa" no SKILL.md (projeto → geral, só o necessário, nunca dados de outra entidade, confirmar se > 12 meses)
  - _Requirements: US-3.AC-1, US-3.AC-8, US-3.AC-10, EC-7_
  - _Makes green: T-26, T-43_
  - _Implements: mcp-server/src/persona.ts, skills/advogado-pt/SKILL.md, AGENTS.md, GEMINI.md, integrations/_
  - _Verify: node --test --test-name-pattern="T-(26|43)" mcp-server/test/plugin.test.mjs_
  - _Size: M_
- [x] 11. [US3] `perfil.ts` (lerPerfil, guardarPerfil, textoPerguntasPerfil) + tools `obter_perfil_empresa` e `guardar_perfil_empresa`
  - _Requirements: US-3.AC-7, US-3.AC-8, US-3.AC-9, US-3.AC-10, US-3.AC-11, EC-6, NFR-4_
  - _Makes green: T-37, T-38, T-39, T-40_
  - _Implements: mcp-server/src/perfil.ts, mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test mcp-server/test/perfil.test.mjs_
  - _Size: M_
- [x] 12. [US3] Hook SessionStart com o perfil (`mensagemSessionStart`, fail-open)
  - _Requirements: US-3.AC-7, US-3.AC-8, US-3.AC-10, US-3.AC-11_
  - _Makes green: T-41, T-42_
  - _Implements: hooks/advogado-hook.mjs_
  - _Verify: node --test --test-name-pattern="T-(41|42)" mcp-server/test/hooks.test.mjs_
  - _Size: S_
- [x] 13. [US3][P] Referências novas: `contencioso-tributario`, `bancario`, `concorrencia`, `uniao-europeia`
  - _Requirements: US-3.AC-2, US-3.AC-5_
  - _Implements: skills/advogado-pt/references/_
  - _Verify: node --test --test-name-pattern="T-(22|29)" mcp-server/test/plugin.test.mjs_
  - _Size: L_
- [x] 14. [US3][P] Fisco: templates `reclamacao-graciosa`, `direito-audicao-previa`, `pedido-pagamento-prestacoes-at`, `pedido-informacao-vinculativa` + playbook `recebi-notificacao-at`
  - _Requirements: US-3.AC-3, US-3.AC-4, US-3.AC-5_
  - _Implements: skills/advogado-pt/assets/templates/, skills/advogado-pt/playbooks/_
  - _Verify: node --test --test-name-pattern="T-(21|22|29)" mcp-server/test/plugin.test.mjs_
  - _Size: M_
- [x] 15. [US3][P] Sociedades e PI: `pacto-social-unipessoal-lda`, `decisao-socio-unico`, `contrato-desenvolvimento-software`, `carta-cessacao-violacao-pi`, `notificacao-remocao-conteudo` + checklist `checklist-registo-marca`
  - _Requirements: US-3.AC-3, US-3.AC-4, US-3.AC-5_
  - _Implements: skills/advogado-pt/assets/templates/, skills/advogado-pt/assets/checklists/_
  - _Verify: node --test --test-name-pattern="T-(21|22|29)" mcp-server/test/plugin.test.mjs_
  - _Size: M_
- [x] 16. [US3][P] Insolvência e laboral: playbook `cliente-insolvente` + templates `reclamacao-creditos-insolvencia`, `pacto-nao-concorrencia`, `politica-prevencao-assedio`
  - _Requirements: US-3.AC-3, US-3.AC-4, US-3.AC-5_
  - _Implements: skills/advogado-pt/assets/templates/, skills/advogado-pt/playbooks/_
  - _Verify: node --test --test-name-pattern="T-(21|22|29)" mcp-server/test/plugin.test.mjs_
  - _Size: M_
- [x] 17. [US3][P] Consumo, banca, RGPD, UE e concorrência: `formulario-livre-resolucao`, `reclamacao-banco-operacao-nao-autorizada`, `registo-atividades-tratamento`, `resposta-pedido-titular-dados`, `queixa-comissao-europeia` + checklists `checklist-loja-online`, `checklist-concorrencia`
  - _Requirements: US-3.AC-3, US-3.AC-4, US-3.AC-5_
  - _Implements: skills/advogado-pt/assets/templates/, skills/advogado-pt/assets/checklists/_
  - _Verify: node --test --test-name-pattern="T-(21|22|29)" mcp-server/test/plugin.test.mjs_
  - _Size: M_
- [x] 18. [US3] Índices (READMEs de templates/checklists/playbooks, Áreas de Competência no SKILL.md, README.md) + commands `fisco`, `insolvencia`, `perfil`
  - _Requirements: US-3.AC-2, US-3.AC-3, US-3.AC-4, US-3.AC-6, SC-003_
  - _Makes green: T-25, T-27_
  - _Implements: skills/advogado-pt/assets/templates/README.md, skills/advogado-pt/assets/checklists/README.md, skills/advogado-pt/playbooks/README.md, skills/advogado-pt/SKILL.md, README.md, commands/_
  - _Verify: node --test --test-name-pattern="T-(25|27)" mcp-server/test/plugin.test.mjs_
  - _Size: S_
  - _Depends: 13, 14, 15, 16, 17_
- [x] 19. [US3] Revisão jurídica das citações determinantes (prazos ⏰, artigos) dos conteúdos novos contra fonte oficial; o que não se confirmar fica "(a confirmar)"
  - _Requirements: US-3.AC-5_
  - _Makes green: T-29_
  - _Verify: node --test --test-name-pattern="T-29" mcp-server/test/plugin.test.mjs_
  - _Size: M_
  - _Depends: 13, 14, 15, 16, 17_
**Checkpoint:** US-3 — persona genérica, perfil guardado e 10 áreas empresariais cobertas.

## História US-4 (P2): calculadoras novas
- [x] 20. [US4] Créditos laborais: `creditos.ts` + `creditos_laborais.py` + tool `calc_creditos_laborais` + `cli calc creditos`; `/despedir` cita a tool
  - _Requirements: US-4.AC-1, US-4.AC-2, US-4.AC-5, US-4.AC-6, EC-3, EC-4_
  - _Makes green: T-09, T-10, T-11, T-12, T-19_
  - _Implements: mcp-server/src/calculators/creditos.ts, skills/advogado-pt/scripts/creditos_laborais.py, mcp-server/src/tools.ts, cli/advogado-pt.mjs, commands/despedir.md_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(09|10|11|12)" mcp-server/test/calculators.test.mjs_
  - _Size: M_
- [x] 21. [US4] Legítima: `legitima.ts` + `legitima.py` + tool `calc_legitima` + `cli calc legitima`; `/herancas` cita a tool
  - _Requirements: US-4.AC-3, US-4.AC-4, US-4.AC-5, US-4.AC-6, EC-5_
  - _Makes green: T-13, T-14, T-15, T-16, T-17, T-20, T-35, T-36_
  - _Implements: mcp-server/src/calculators/legitima.ts, skills/advogado-pt/scripts/legitima.py, mcp-server/src/tools.ts, cli/advogado-pt.mjs, commands/herancas.md_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-(13|14|15|16|17|35|36)" mcp-server/test/calculators.test.mjs mcp-server/test/plugin.test.mjs mcp-server/test/cli.test.mjs_
  - _Size: M_
  - _Depends: 11, 20_
- [x] 22. [US4] Python: créditos e legítima verdes no unittest
  - _Requirements: US-4.AC-6_
  - _Makes green: T-19, T-20_
  - _Verify: python skills/advogado-pt/scripts/test_scripts.py -k T19 -k T20_
  - _Size: XS_
  - _Depends: 20, 21_
**Checkpoint:** US-4 — duas calculadoras nos dois lados, tools e CLI.

## História US-5 (P2): distribuição e descoberta
- [x] 23. [US5] `procurar_conteudo` agrupado por tipo com âmbito (usa `formatarProcura`)
  - _Requirements: US-5.AC-3_
  - _Implements: mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-31" mcp-server/test/content.test.mjs_
  - _Size: XS_
  - _Depends: 2_
- [x] 24. [US5] `cli prompt <nome> [--tipo …]` com persona do `persona.ts` + erro com lista
  - _Requirements: US-5.AC-1, US-5.AC-2, SC-004_
  - _Makes green: T-32, T-33_
  - _Implements: cli/advogado-pt.mjs_
  - _Verify: node --test --test-name-pattern="T-(32|33)" mcp-server/test/cli.test.mjs_
  - _Size: S_
- [x] 25. [US5] README.md: secção "Exemplo trabalhado" + novas tools, commands e perfil
  - _Requirements: US-5.AC-4_
  - _Makes green: T-34_
  - _Implements: README.md_
  - _Verify: node --test --test-name-pattern="T-34" mcp-server/test/plugin.test.mjs_
  - _Size: S_
**Checkpoint:** US-5 — prompt exportável e pesquisa agrupada.

## Fase: Acabamento (transversal)
- [x] 26. [shared] Bump 1.1.0 nos 6 sítios + CHANGELOG + `npm run build` (bundle + content) + `python build.py`
  - _Requirements: NFR-1, NFR-2_
  - _Makes green: T-44, T-45, T-46_
  - _Implements: .claude-plugin/plugin.json, .claude-plugin/marketplace.json, package.json, mcp-server/package.json, mcp-server/src/index.ts, CHANGELOG.md, mcp-server/dist/index.js, mcp-server/content/_
  - _Verify: npm --prefix mcp-server test_
  - _Size: S_
  - _Depends: 22, 25_
- [x] 27. [shared] Suites completas (MCP + Python), `cli doctor` e smoke do servidor MCP
  - _Requirements: NFR-3_
  - _Verify: python skills/advogado-pt/scripts/test_scripts.py_
  - _Size: XS_
  - _Depends: 26_

## Fase: Correções encontradas na revisão
- [x] 28. [US3] Corrigir 7 erros jurídicos em conteúdo existente detetados na revisão e confirmados na fonte: título executivo (art. 703.º/1/b CPC), comunicação do arrendamento (art. 60.º/2 CIS), segredos comerciais (CPI DL 110/2018), forma da cessão de direitos de autor (arts. 43.º/44.º CDADC), teletrabalho (art. 167.º CT), Modelo 1 IS (art. 26.º CIS), admissão à SS (art. 29.º/2 Cód. Contributivo)
  - _Requirements: US-3.AC-5_
  - _Implements: skills/advogado-pt/assets/templates/reconhecimento-divida.md, skills/advogado-pt/references/cobrancas.md, skills/advogado-pt/playbooks/cliente-nao-paga.md, skills/advogado-pt/assets/templates/contrato-arrendamento-habitacional.md, skills/advogado-pt/references/arrendamento.md, skills/advogado-pt/assets/templates/nda-bilingue.md, skills/advogado-pt/references/pi.md, skills/advogado-pt/assets/templates/contrato-prestacao-servicos-ti.md, skills/advogado-pt/assets/templates/acordo-teletrabalho.md, skills/advogado-pt/references/valores-2026.md, skills/advogado-pt/assets/templates/acordo-partilha-extrajudicial.md, skills/advogado-pt/references/herancas.md, skills/advogado-pt/references/laboral.md, skills/advogado-pt/assets/templates/contrato-trabalho-sem-termo.md_
  - _Verify: node --test --test-name-pattern="T-(21|22|23)" mcp-server/test/plugin.test.mjs_
  - _Size: S_
**Checkpoint:** as tarefas de convergência estão concluídas e verificadas — a spec e o código voltam a coincidir.
