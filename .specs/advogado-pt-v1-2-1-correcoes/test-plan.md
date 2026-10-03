# Test Plan: advogado-pt v1.2.1 correções

## Estratégia
- **Test runner:** `node --test` (TS compilado em `mcp-server/dist/`, via `npm --prefix mcp-server test`) e `unittest` (`python skills/advogado-pt/scripts/test_scripts.py`). Testes da versão em `mcp-server/test/v121.test.mjs`; regressão de conteúdo em `mcp-server/test/factos.json` (ids `v121-…`), filtrados por tema pelos testes desta versão e corridos todos pelo teste de factos de referência já existente.
- **Abordagem de mocking:** sem mocks — motores puros com datas fixas; estado local em pastas temporárias (`mkdtemp`); symlinks/junctions criados no teste; hook chamado como função exportada e como processo (`spawnSync`).
- **Alvo de cobertura:** cada AC com pelo menos um teste; cada correção jurídica com um facto (`contem` + `naoContem`).
- **Caminhos críticos que exigem 100% de cobertura de ramos:** `contarPrazo` (três tipos, férias, urgente, transferência), tabela de prescrição, Selo do IMT Jovem, `fs-seguro` (recusa de links, tmp + rename).
- **Valores de referência:** calculados à mão a partir da lei: contestação de 30 dias citada a 1/10/2026 → 31/10 (sábado) → **2/11/2026**; 30 dias desde 1/7/2026 → 14 dias até 15/7, suspensão 16/7–31/8, 16 dias desde 1/9 → **16/9/2026**; 15 dias desde 10/8/2026 → **15/9/2026** (urgente: **25/8/2026**); 10 dias desde 15/12/2026 → 6 dias até 21/12, suspensão até 3/1, 4 dias → **7/1/2027**; IMT Jovem 400.000 € → Selo 0,8% × 69.461 € = **555,69 €**.

## Matriz de Rastreabilidade

| Test ID | Camada | Tipo | Descrição | Cobre (AC IDs) | Ficheiro |
|---------|--------|------|-----------|----------------|----------|
| T-201 | unit | example | `judicial`: 30 dias desde 1/10/2026 → 2/11/2026 (termo ao sábado transferido) | US-1.AC-1 | `mcp-server/test/v121.test.mjs` |
| T-202 | unit | example | `judicial` com férias: 1/7 → 16/9; início em férias 10/8 (15 d) → 15/9; urgente → 25/8; Natal 15/12 (10 d) → 7/1/2027 | US-1.AC-1, EC-1, EC-2 | `mcp-server/test/v121.test.mjs` |
| T-203 | unit | example | `corridos`: 30 dias desde 1/10/2026 → 2/11/2026 com data legal 31/10 | US-1.AC-2 | `mcp-server/test/v121.test.mjs` |
| T-204 | integração | example | `calc_prazo` tem `judicial` e default `corridos`; SKILL.md, playbooks e tool indicam o tipo por meio de defesa (factos `v121-prazos-`) | US-1.AC-3 | `mcp-server/test/v121.test.mjs` |
| T-205 | unit | example | data inválida, dias negativos ou > 3650 recusados; `calc prazo --inicio amanha` termina com erro em < 5 s | US-1.AC-4 | `mcp-server/test/v121.test.mjs` |
| T-206 | unit | example | Python: os casos de T-201 a T-203 e T-205 em `prazos.py` | US-1.AC-1, US-1.AC-2, US-1.AC-4 | `skills/advogado-pt/scripts/test_scripts.py` |
| T-207 | unit | example | prescrição TS: crédito comercial 20 anos (309.º); serviços profissionais e venda a consumidor 2 anos presuntivos com aviso; rendas al. b); juros al. d) | US-2.AC-1, US-2.AC-2, US-2.AC-3 | `mcp-server/test/v121.test.mjs` |
| T-208 | unit | example | prescrição Python: os mesmos casos | US-2.AC-1, US-2.AC-2 | `skills/advogado-pt/scripts/test_scripts.py` |
| T-209 | integração | example | `cliente-nao-paga.md` e SKILL.md com os mesmos prazos da calculadora (factos `v121-prescricao-`) | US-2.AC-3 | `mcp-server/test/v121.test.mjs` |
| T-210 | unit | example | IMT Jovem: 300.000 € → Selo 0 e total 0; 400.000 € → Selo 555,69 € | US-3.AC-1, EC-3 | `mcp-server/test/v121.test.mjs` |
| T-211 | unit | example | IRS: propriedade intelectual 0,95; serviços em geral 0,35; tabela do 151.º 0,75; `valores-2026.md` e `fiscal.md` com 4.587,09 € | US-3.AC-2 | `mcp-server/test/v121.test.mjs` |
| T-212 | integração | example | ENI a 25,2%, base 1/3 do rendimento relevante, mínimo 20 €; MOE art. 69.º (factos `v121-ss-`) | US-3.AC-3 | `mcp-server/test/v121.test.mjs` |
| T-213 | integração | example | injunção B2B sem limite de valor no playbook, `cobrancas.md` e calculadora de custas (40.000 € → 1,5 UC, sem erro) | US-3.AC-4 | `mcp-server/test/v121.test.mjs` |
| T-214 | integração | example | notificações AT ao 5.º dia; contraordenações laborais contínuas, 20 dias, efeito devolutivo; RGCO 1/3/5 anos (factos `v121-notif-`, `v121-coima-`) | US-4.AC-1, US-4.AC-2 | `mcp-server/test/v121.test.mjs` |
| T-215 | integração | example | arrendamento: 5 anos, 120/90/60 dias ou 1/3, renovação de 3 anos, 1.ª renovação, mora ≥ 3 meses (factos `v121-arrend-`) | US-4.AC-3 | `mcp-server/test/v121.test.mjs` |
| T-216 | integração | example | afirmações desatualizadas corrigidas: CISG, CRA, CCP, NIS2, diplomas revogados, ICE, IFICI, período experimental, réplica, retenção, seguro AT, Lei 147/2015, 368.º-A, social scoring (factos `v121-atual-`) | US-4.AC-4 | `mcp-server/test/v121.test.mjs` |
| T-217 | integração | example | contradições resolvidas: alçada/Julgados de Paz, graduação, coima RGIT 75%, marca, limiar B2C, autoliquidação, FGCT, remissões IVA (factos `v121-contra-`) | US-4.AC-5 | `mcp-server/test/v121.test.mjs` |
| T-218 | integração | example | playbooks com os prazos em falta (embargos, penhora, 139.º/5, 357.º, 329.º, 387.º, CITE, 323.º/2, 40 €) (factos `v121-playbook-`) | US-4.AC-6 | `mcp-server/test/v121.test.mjs` |
| T-219 | integração | example | o que não se confirmou fica "(a confirmar)" com fonte (ex.: coeficiente de rendas 2027 até ao aviso no DR); há pelo menos 30 factos `v121-` | US-4.AC-7, US-4.AC-8, EC-6, SC-003 | `mcp-server/test/v121.test.mjs` |
| T-220 | integração | example | templates sem cláusulas nulas: CPCV sem "afastam", revogação sem quitação total, SaaS sem resolução por insolvência, sem "eficácia real" em documento particular | US-5.AC-1 | `mcp-server/test/v121.test.mjs` |
| T-221 | integração | example | templates com os requisitos: CITE, motivo–termo, cônjuge (4 templates), art. 28.º RGPD no DPA, ressalva de dolo/culpa grave, loja online (devolução, rejeição, Roma I, função de livre resolução) | US-5.AC-2 | `mcp-server/test/v121.test.mjs` |
| T-222 | integração | example | citações corrigidas nos templates e cláusulas enganadoras retiradas | US-5.AC-3 | `mcp-server/test/v121.test.mjs` |
| T-223 | integração | example | perfil, prazos e `.ics` gravados em `CLAUDE_PROJECT_DIR` e lidos pelo hook; notas de `prazos.md` preservadas; sem ficheiro temporário deixado | US-6.AC-1, EC-4 | `mcp-server/test/v121.test.mjs` |
| T-224 | integração | example | caso de abuso: `.advogado-pt` e `prazos.md` como symlink/junction → escrita recusada e alvo intacto (perfil, prazos, perfil ativo, calendário) | US-6.AC-10, EC-5 | `mcp-server/test/v121.test.mjs` |
| T-225 | integração | property | caso de abuso: para qualquer perfil (incluindo 21 KB e "SYSTEM: …"), o texto injetado tem campos ≤ 200, total ≤ 1500, sem quebras de linha e rotulado como dados | US-6.AC-11 | `mcp-server/test/v121.test.mjs` |
| T-226 | integração | example | caso de abuso: resource `advogado-pt://../README` e nomes com `/` ou `\` recusados | US-6.AC-12 | `mcp-server/test/v121.test.mjs` |
| T-227 | integração | example | hook chamado através de junction produz a mensagem do SessionStart | US-6.AC-13 | `mcp-server/test/v121.test.mjs` |
| T-228 | integração | property | nenhum erro de tool ou do CLI contém stack trace ou caminho interno; ficheiros `.advogado-pt/` sem padrões de segredos | US-6.AC-14 | `mcp-server/test/v121.test.mjs` |
| T-229 | unit | example | tools recusam 2026-02-30, 2025-13-01 e 01/02/2026 nomeando o campo | US-7.AC-1 | `mcp-server/test/v121.test.mjs` |
| T-230 | integração | example | CLI: argumento em falta ou montante negativo → código ≠ 0, sem `NaN`/`undefined` (juros, créditos, injunção, selo) | US-7.AC-2 | `mcp-server/test/v121.test.mjs` |
| T-231 | integração | property | todas as tools registadas, chamadas com entradas inválidas, devolvem texto de erro sem lançar | US-7.AC-3 | `mcp-server/test/v121.test.mjs` |
| T-232 | unit | example | juros sem data de fim usam a data de Lisboa (00:30 de 2/10/2026 em Lisboa = 2/10) | US-7.AC-4 | `mcp-server/test/v121.test.mjs` |
| T-233 | unit | example | `name` da skill no padrão e `description` ≤ 1024 sem `<`/`>`; `build.py` falha com uma description longa | US-8.AC-1 | `mcp-server/test/plugin.test.mjs` |
| T-234 | unit | example | instruções do servidor ≤ 2000 caracteres e nomeiam todas as tools; o prompt `advogado_pt` tem a persona completa | US-8.AC-2 | `mcp-server/test/plugin.test.mjs` |
| T-235 | unit | example | nenhum command com nome de comando nativo (`doctor`, `help`, `config`, …); existe `/diagnostico`; hook e README atualizados | US-8.AC-3 | `mcp-server/test/plugin.test.mjs` |
| T-236 | unit | example | commands citam ficheiros do plugin com `${CLAUDE_PLUGIN_ROOT}` e não mandam compilar | US-8.AC-4 | `mcp-server/test/plugin.test.mjs` |
| T-237 | integração | example | o `.skill` gerado tem `advogado-pt/SKILL.md` (pasta na raiz) | US-8.AC-5 | `mcp-server/test/plugin.test.mjs` |
| T-238 | segurança | example | `npm --prefix mcp-server audit --omit=dev --audit-level=high` sai com 0 | US-8.AC-5, SC-005 | `npm audit (comando local)` |
| T-239 | unit | example | não existe `bin/` na raiz; o hook analisa os `edits` do MultiEdit | US-8.AC-6 | `mcp-server/test/plugin.test.mjs` |
| T-240 | unit | property | paridade TS: para todos os casos de `fixtures/paridade.json` (salário, custo, IRC, IVA, taxa de justiça, IMT, IRS), o resultado é o esperado ao cêntimo e com os mesmos textos | US-9.AC-1 | `mcp-server/test/v121.test.mjs` |
| T-241 | unit | property | paridade Python: os mesmos casos de `fixtures/paridade.json`, mais IMT Jovem, IRS e injunção | US-9.AC-1 | `skills/advogado-pt/scripts/test_scripts.py` |
| T-242 | integração | example | testes de `contarPrazo`, custas de injunção e Selo nas heranças; `npm test` corre o smoke do servidor | US-9.AC-2 | `mcp-server/test/v121.test.mjs` |
| T-243 | unit | example | os testes antigos que fixavam o erro (prescrição 5 anos, IMT Jovem sem Selo, PI 0,50) foram substituídos por casos com fonte | US-9.AC-3 | `mcp-server/test/calculators.test.mjs` |
| T-244 | integração | example | nenhuma referência ou checklist com perfil fixo ("Como ENI (situação atual)", "Regime Atual — ENI", "Unipessoal Lda (futuro)") | US-10.AC-1 | `mcp-server/test/plugin.test.mjs` |
| T-245 | integração | example | SKILL.md tem a tabela cálculo → tool → script (todas as `calc_*`), a de encaminhamento, as regras de contagem e as superfícies | US-10.AC-2 | `mcp-server/test/v121.test.mjs` |
| T-246 | integração | property | todo o montante em € ≥ 100 nas references (fora do `valores-2026.md` e da lista de exemplos) aparece no `valores-2026.md` ou a linha remete para ele | US-10.AC-3 | `mcp-server/test/v121.test.mjs` |
| T-247 | integração | example | integrações geradas estão em sincronia com a fonte; contagens do README/GEMINI/mcp-server README batem com o repositório | US-10.AC-4 | `mcp-server/test/v121.test.mjs` |
| T-248 | integração | example | secções `## Templates` das references usam nomes de ficheiro existentes ou "(a pedido)" | US-10.AC-5 | `mcp-server/test/v121.test.mjs` |
| T-249 | unit | example | versão 1.2.1 nos 6 sítios + `package-lock.json`; CHANGELOG `## [1.2.1]` | NFR-2 | `mcp-server/test/plugin.test.mjs` |
| T-250 | integração | example | SessionStart do hook demora < 300 ms com perfil e prazos | NFR-4 | `mcp-server/test/v121.test.mjs` |
| T-251 | integração | example | `claude plugin validate` passa no repositório | NFR-3, SC-004 | `claude plugin validate (comando local)` |

## Verificação de Cobertura
Cada AC aparece em pelo menos uma célula "Cobre". Notas:
- **US-9.AC-3** é coberto pelo T-243 e, indiretamente, pelos T-207, T-210 e T-211, que substituem os testes antigos.
- **SC-001** (100% dos achados) verifica-se na revisão final contra a lista da revisão de 3/10/2026 (quickstart); **SC-002** pelos T-201 a T-213; **SC-003** pelo T-219.
- **NFR-1** verifica-se pelo teste de dependências já existente da v1.1 (só `@modelcontextprotocol/sdk` e `zod` no runtime).

## Dados de Teste e Fixtures
- `mcp-server/test/fixtures/paridade.json` — casos partilhados TS/Python (entrada → resultado esperado ao cêntimo e textos), lido pelos dois lados; o teste Python salta-o se o ficheiro não existir (o `.skill` não leva `mcp-server/`).
- Factos `v121-<tema>-…` em `mcp-server/test/factos.json`.
- Pastas temporárias por teste; symlinks com `symlinkSync(alvo, link, "junction")` no Windows.

## Fora de Âmbito para Testes
- Upload real do `.skill` em claude.ai (manual, no quickstart).
- Sync do Claude Desktop com o marketplace (manual, no quickstart).
- Raciocínio jurídico do modelo (avaliações de comportamento vão na 2.0.0).
