# Tasks: advogado-pt v1.2.1 correções

<!-- Tracks: core +tdd +sec. Testes desta feature numerados de T-201 a T-251. Cada correção jurídica é
     reconfirmada em fonte oficial antes de aplicada; o que não se confirmar fica "(a confirmar)" com a fonte. -->

## Restrições Globais
- Node >= 18 e Python 3 só com a biblioteca-padrão · nenhuma dependência nova (só atualizar as existentes) · nunca `bin/` na raiz · hook sem dependências e fail-open.
- Calculadoras corrigidas em Python E TypeScript com os mesmos casos de referência; arredondamento ao cêntimo meio para cima nos dois lados.
- Montantes só em `skills/advogado-pt/references/valores-2026.md`; os outros ficheiros remetem para lá.
- Cada correção de conteúdo tem um facto em `mcp-server/test/factos.json` com id `v121-<tema>-…`, fonte e o texto errado em `naoContem`.
- Escrita só em `<projeto>/.advogado-pt/` ou `~/.advogado-pt/`, através de `fs-seguro.ts`, sem seguir links.
- Nomes e parâmetros das tools mantêm-se; só `calc_prazo.tipo` muda de valor por defeito (`corridos`) e ganha `judicial`.
- Mensagens de consola com `->`; stdout UTF-8; erros sem stack trace.

## Fase: Setup
- [x] 1. [shared] Branch `fix/v1.2.1-correcoes` a partir do `main`; commit da spec aprovada
  - _Requirements: NFR-2_
  - _Verify: git rev-parse --abbrev-ref HEAD_
  - _Size: XS_
- [x] 2. [shared] Escrever os testes a falhar: `mcp-server/test/v121.test.mjs` (T-201 a T-250 exceto T-206, T-208, T-241, T-243), os novos casos de `plugin.test.mjs` (T-233 a T-237, T-239, T-244, T-249), `test_scripts.py` (T-206, T-208, T-241), `fixtures/paridade.json` e os factos `v121-` esperados
  - _Requirements: US-1.AC-1, US-2.AC-1, US-3.AC-1, US-4.AC-8, US-6.AC-10, US-8.AC-1, US-9.AC-1, US-10.AC-1_
  - _Implements: mcp-server/test/v121.test.mjs, mcp-server/test/plugin.test.mjs, mcp-server/test/fixtures/paridade.json, skills/advogado-pt/scripts/test_scripts.py_
  - _Verify: npm --prefix mcp-server test_
  - _Expect: fail_
  - _Size: L_
  - _Depends: 1_

## Fase: Fundacional (bloqueia todas as histórias)
- [x] 3. [shared] `fs-seguro.ts` (`dirProjeto`, `escreverSeguro`: `lstat` em cada componente, recusa de links, tmp + `rename`) e `calculators/arredondar.ts` (r2 meio para cima)
  - _Requirements: US-6.AC-1, US-6.AC-10, US-9.AC-1_
  - _Implements: mcp-server/src/fs-seguro.ts, mcp-server/src/calculators/arredondar.ts_
  - _Verify: npm --prefix mcp-server run build_
  - _Size: S_
  - _Depends: 2_
- [x] 4. [shared] Helper de datas estrito (AAAA-MM-DD com verificação de calendário) partilhado por tools e CLI
  - _Requirements: US-7.AC-1_
  - _Implements: mcp-server/src/calculators/datas.ts_
  - _Verify: npm --prefix mcp-server run build_
  - _Size: XS_
  - _Depends: 2_

## História US-1 (P1 — MVP): prazos
- [x] 5. [US1] `contarPrazo` com `judicial` (art. 138.º CPC, férias judiciais da LOSJ, urgente, transferência) e `corridos` com transferência e data legal; `calc_prazo` com `judicial`, `urgente` e default `corridos`; CLI `calc prazo --tipo judicial [--urgente]`
  - _Requirements: US-1.AC-1, US-1.AC-2, US-1.AC-4, EC-1, EC-2_
  - _Makes green: T-201, T-202, T-203, T-205_
  - _Implements: mcp-server/src/calculators/prazos.ts, mcp-server/src/tools.ts, cli/advogado-pt.mjs_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-201|T-202|T-203|T-205" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 4_
- [x] 6. [US1] `prazos.py` com os mesmos tipos e casos
  - _Requirements: US-1.AC-1, US-1.AC-2, US-1.AC-4_
  - _Makes green: T-206_
  - _Implements: skills/advogado-pt/scripts/prazos.py_
  - _Verify: python skills/advogado-pt/scripts/test_scripts.py -k T206_
  - _Size: S_
  - _Depends: 5_
- [x] 7. [US1] Tipo de contagem por meio de defesa no SKILL.md, na description da tool e nos playbooks (`recebi-citacao-ou-injuncao`, `recebi-notificacao-at`, `cliente-nao-paga`); factos `v121-prazos-`
  - _Requirements: US-1.AC-3_
  - _Makes green: T-204_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-204" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 5_
**Checkpoint:** US-1 — prazos certos em TS, Python, tool, CLI e conteúdo.

## História US-2 (P1): prescrição
- [x] 8. [US2] Tabela de prescrição por tipos do CC (309.º, 310.º b)/d)/g), 317.º b)/c) presuntivas com aviso) em TS e Python; tool com os tipos novos
  - _Requirements: US-2.AC-1, US-2.AC-2, US-2.AC-3_
  - _Makes green: T-207, T-208_
  - _Implements: mcp-server/src/calculators/prescricao.ts, skills/advogado-pt/scripts/prescricao.py, mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-207" mcp-server/test/v121.test.mjs && python skills/advogado-pt/scripts/test_scripts.py -k T208_
  - _Size: M_
  - _Depends: 2_
- [x] 9. [US2] `cliente-nao-paga.md` e SKILL.md alinhados com a calculadora; factos `v121-prescricao-`
  - _Requirements: US-2.AC-3_
  - _Makes green: T-209_
  - _Verify: node --test --test-name-pattern="T-209" mcp-server/test/v121.test.mjs_
  - _Size: XS_
  - _Depends: 8_

## História US-3 (P1): impostos, contribuições e custas
- [x] 10. [US3] Imposto do Selo com a isenção do IMT Jovem (total e parcial) em TS e Python — reconfirmar a regra da isenção parcial em fonte oficial
  - _Requirements: US-3.AC-1, EC-3_
  - _Makes green: T-210_
  - _Implements: mcp-server/src/calculators/imt.ts, skills/advogado-pt/scripts/imt.py_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-210" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 11. [US3] Coeficientes do IRS simplificado e dedução de 4.587,09 € em TS, Python, `valores-2026.md` e `fiscal.md`
  - _Requirements: US-3.AC-2_
  - _Makes green: T-211_
  - _Implements: mcp-server/src/calculators/irs.ts, skills/advogado-pt/scripts/irs_simplificado.py_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-211" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 12. [US3][P] Segurança Social do ENI (25,2%, base, mínimo 20 €) e MOE (art. 69.º) em `valores-2026.md` e `fiscal.md`; factos `v121-ss-`
  - _Requirements: US-3.AC-3_
  - _Makes green: T-212_
  - _Verify: node --test --test-name-pattern="T-212" mcp-server/test/v121.test.mjs_
  - _Size: XS_
  - _Depends: 2_
- [x] 13. [US3] Injunção nas transações comerciais sem limite de valor: playbook, `cobrancas.md`, calculadora de custas (TS e Python)
  - _Requirements: US-3.AC-4_
  - _Makes green: T-213_
  - _Implements: mcp-server/src/calculators/injuncao.ts, skills/advogado-pt/scripts/custas_injuncao.py_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-213" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_
**Checkpoint:** US-1 a US-3 — todas as calculadoras com resultados da lei.

## História US-4 (P1): conteúdo jurídico
- [x] 14. [US4][P] Notificações eletrónicas da AT (5.º dia) e contraordenações laborais/RGCO; factos `v121-notif-`, `v121-coima-`
  - _Requirements: US-4.AC-1, US-4.AC-2_
  - _Makes green: T-214_
  - _Verify: node --test --test-name-pattern="T-214" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 15. [US4][P] `arrendamento.md` (arts. 1083.º, 1096.º a 1101.º CC); factos `v121-arrend-`
  - _Requirements: US-4.AC-3_
  - _Makes green: T-215_
  - _Verify: node --test --test-name-pattern="T-215" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 16. [US4][P] Afirmações desatualizadas (CISG, CRA, CCP com o DL 177/2026 e secção de contratação pública em `valores-2026.md`, NIS2, diplomas revogados, ICE, IFICI, laboral, réplica, retenção, seguros, 368.º-A, social scoring); factos `v121-atual-`
  - _Requirements: US-4.AC-4_
  - _Makes green: T-216_
  - _Verify: node --test --test-name-pattern="T-216" mcp-server/test/v121.test.mjs_
  - _Size: L_
  - _Depends: 2_
- [x] 17. [US4][P] Contradições entre ficheiros; factos `v121-contra-`
  - _Requirements: US-4.AC-5_
  - _Makes green: T-217_
  - _Verify: node --test --test-name-pattern="T-217" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 2_
- [x] 18. [US4][P] Prazos em falta nos playbooks; factos `v121-playbook-`
  - _Requirements: US-4.AC-6_
  - _Makes green: T-218_
  - _Verify: node --test --test-name-pattern="T-218" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 19. [US4] Marcas: fechar as já confirmadas pela revisão; o que não se confirmar fica "(a confirmar)" com fonte; coeficiente de rendas 2027 conforme o aviso no DR (ou "a confirmar" até sair)
  - _Requirements: US-4.AC-7, US-4.AC-8, EC-6_
  - _Makes green: T-219_
  - _Verify: node --test --test-name-pattern="T-219" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 14, 15, 16, 17, 18_

## História US-5 (P1): templates
- [x] 20. [US5][P] Retirar as cláusulas nulas ou ineficazes (CPCV, acordo de revogação, SaaS, eficácia real)
  - _Requirements: US-5.AC-1_
  - _Makes green: T-220_
  - _Verify: node --test --test-name-pattern="T-220" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 21. [US5][P] Acrescentar os requisitos (CITE, motivo–termo, cônjuge, art. 28.º RGPD no DPA, ressalva de dolo/culpa grave, loja online)
  - _Requirements: US-5.AC-2_
  - _Makes green: T-221_
  - _Verify: node --test --test-name-pattern="T-221" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 2_
- [x] 22. [US5][P] Citações de artigos e cláusulas enganadoras nos templates
  - _Requirements: US-5.AC-3_
  - _Makes green: T-222_
  - _Verify: node --test --test-name-pattern="T-222" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_

## História US-6 (P1): escrita e hook seguros
- [x] 23. [US6] `perfil.ts`, `prazos-estado.ts` e `calendario.ts` passam a gravar com `fs-seguro` no `dirProjeto`; `prazos.md` preserva as notas
  - _Requirements: US-6.AC-1, US-6.AC-10, EC-4, EC-5_
  - _Makes green: T-223, T-224_
  - _Implements: mcp-server/src/perfil.ts, mcp-server/src/prazos-estado.ts, mcp-server/src/calendario.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-223|T-224" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 3_
- [x] 24. [US6] Hook: perfil limitado e rotulado como dados, ponto de entrada por caminho real, mesmo diretório dos prazos, leitura até 256 KB, MultiEdit
  - _Requirements: US-6.AC-11, US-6.AC-13, US-8.AC-6, NFR-4_
  - _Makes green: T-225, T-227, T-250_
  - _Implements: hooks/advogado-hook.mjs_
  - _Verify: node --test --test-name-pattern="T-225|T-227|T-250" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 3_
- [x] 25. [US6] Resources com lista fechada de categorias e nomes; erros sem stack trace nem caminhos; sem segredos
  - _Requirements: US-6.AC-12, US-6.AC-14_
  - _Makes green: T-226, T-228_
  - _Implements: mcp-server/src/resources.ts, mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-226|T-228" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_
**Checkpoint:** US-6 — casos de abuso recusados.

## História US-7 (P2): entradas inválidas
- [x] 26. [US7] Tools: datas estritas, montantes não negativos, `try/catch` em todas, juros com a data de Lisboa
  - _Requirements: US-7.AC-1, US-7.AC-3, US-7.AC-4_
  - _Makes green: T-229, T-231, T-232_
  - _Implements: mcp-server/src/tools.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-229|T-231|T-232" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 4_
- [x] 27. [US7] CLI: argumentos estritos, códigos de saída, sem `NaN`/`undefined`
  - _Requirements: US-7.AC-2_
  - _Makes green: T-230_
  - _Implements: cli/advogado-pt.mjs_
  - _Verify: node --test --test-name-pattern="T-230" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 4_

## História US-8 (P1): distribuição
- [x] 28. [US8] Description da skill ≤ 1024 (com exclusões) e validação no `build.py`; `.skill` com a pasta na raiz
  - _Requirements: US-8.AC-1, US-8.AC-5_
  - _Makes green: T-233, T-237_
  - _Implements: skills/advogado-pt/SKILL.md, build.py_
  - _Verify: node --test --test-name-pattern="T-233|T-237" mcp-server/test/plugin.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 29. [US8] `INSTRUCOES_MCP` (≤ 2000, todas as tools) nas instruções do servidor; persona completa no prompt `advogado_pt`
  - _Requirements: US-8.AC-2_
  - _Makes green: T-234_
  - _Implements: mcp-server/src/persona.ts, mcp-server/src/index.ts_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-234" mcp-server/test/plugin.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 30. [US8] `/doctor` → `/diagnostico`; `${CLAUDE_PLUGIN_ROOT}` nos commands; README sem `npm run setup` para quem instala pelo marketplace
  - _Requirements: US-8.AC-3, US-8.AC-4_
  - _Makes green: T-235, T-236_
  - _Verify: node --test --test-name-pattern="T-235|T-236" mcp-server/test/plugin.test.mjs_
  - _Size: S_
  - _Depends: 2_
- [x] 31. [US8] Atualizar o SDK do MCP e as transitivas (`npm audit fix`) e regenerar o bundle; teste contra `bin/`
  - _Requirements: US-8.AC-5, US-8.AC-6, NFR-1_
  - _Makes green: T-238, T-239_
  - _Verify: npm --prefix mcp-server audit --omit=dev --audit-level=high_
  - _Size: S_
  - _Depends: 2_

## História US-9 (P2): paridade e testes
- [x] 32. [US9] Arredondamento único em TS; `formatar_euros` meio para cima em Python; textos do decisor de IVA iguais; casos partilhados nos dois lados
  - _Requirements: US-9.AC-1_
  - _Makes green: T-240, T-241_
  - _Implements: mcp-server/src/calculators/salario.ts, mcp-server/src/calculators/irc.ts, mcp-server/src/calculators/taxa-justica.ts, skills/advogado-pt/scripts/iva_operacao.py_
  - _Verify: npm --prefix mcp-server run build && node --test --test-name-pattern="T-240" mcp-server/test/v121.test.mjs && python skills/advogado-pt/scripts/test_scripts.py -k T241_
  - _Size: M_
  - _Depends: 3_
- [ ] 33. [US9] Testes em falta (`contarPrazo`, custas, Selo nas heranças), smoke no `npm test`, substituição dos testes que fixavam o erro
  - _Requirements: US-9.AC-2, US-9.AC-3_
  - _Makes green: T-242, T-243_
  - _Verify: npm --prefix mcp-server test_
  - _Size: S_
  - _Depends: 5, 8, 10, 11_

## História US-10 (P3): coerência e manutenção
- [x] 34. [US10][P] Perfil genérico nas references e checklists; teste estendido
  - _Requirements: US-10.AC-1_
  - _Makes green: T-244_
  - _Verify: node --test --test-name-pattern="T-244" mcp-server/test/plugin.test.mjs_
  - _Size: M_
  - _Depends: 2_
- [x] 35. [US10] SKILL.md: tabela cálculo → tool → script, encaminhamento, regras de contagem, superfícies; `scripts/README.md` e índice de templates corrigidos
  - _Requirements: US-10.AC-2_
  - _Makes green: T-245_
  - _Verify: node --test --test-name-pattern="T-245" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 7, 28_
- [x] 36. [US10][P] Montantes duplicados → remissões; teste dos montantes que ficam
  - _Requirements: US-10.AC-3_
  - _Makes green: T-246_
  - _Verify: node --test --test-name-pattern="T-246" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 2_
- [x] 37. [US10] Gerador das integrações a partir da fonte única; contagens da documentação
  - _Requirements: US-10.AC-4_
  - _Makes green: T-247_
  - _Implements: mcp-server/scripts/gerar-integracoes.mjs_
  - _Verify: node --test --test-name-pattern="T-247" mcp-server/test/v121.test.mjs_
  - _Size: M_
  - _Depends: 29_
- [x] 38. [US10][P] Secções `## Templates` das references com nomes de ficheiro ou "(a pedido)"
  - _Requirements: US-10.AC-5_
  - _Makes green: T-248_
  - _Verify: node --test --test-name-pattern="T-248" mcp-server/test/v121.test.mjs_
  - _Size: S_
  - _Depends: 2_

## Fase: Acabamento (transversal)
- [ ] 39. [shared] Bump 1.2.1 (6 sítios + `package-lock.json`), CHANGELOG com a lista dos achados corrigidos, bundle e conteúdo regenerados, `.skill`, tags `v1.1.0`, `v1.2.0` e `v1.2.1`
  - _Requirements: NFR-2_
  - _Makes green: T-249_
  - _Verify: npm --prefix mcp-server test_
  - _Size: S_
  - _Depends: 19, 22, 25, 27, 31, 33, 37_
- [ ] 40. [shared] Suites completas, smoke, validador oficial do plugin, `npm audit`, desempenho do hook e scan local de segurança
  - _Requirements: NFR-3, NFR-4, SC-004, SC-005_
  - _Makes green: T-251_
  - _Verify: python skills/advogado-pt/scripts/test_scripts.py_
  - _Size: S_
  - _Depends: 39_
- [ ] 41. [shared] Revisão final contra os cinco relatórios de 3/10/2026 (cada achado corrigido ou "(a confirmar)" com fonte) e quickstart no que for automatizável
  - _Requirements: SC-001, SC-002, SC-003_
  - _Verify: npm --prefix mcp-server test_
  - _Size: S_
  - _Depends: 40_
