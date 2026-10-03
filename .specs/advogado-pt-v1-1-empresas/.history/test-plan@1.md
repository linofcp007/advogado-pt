# Test Plan: advogado-pt v1.1 empresas

## Estratégia
- **Test runner:** `node --test` (mcp-server/test, importando `../dist/`; `npm --prefix mcp-server test` faz build + testes) e `unittest` (`skills/advogado-pt/scripts/test_scripts.py`).
- **Abordagem de mocking:** nenhuma — funções puras com datas explícitas; ficheiros em diretórios temporários (`mkdtempSync`); CLI via `spawnSync`; perfil geral redirecionado com o parâmetro `home` / `ADVOGADO_PT_HOME`.
- **Alvo de cobertura:** cada AC com pelo menos um teste; cada calculadora com os casos de referência abaixo nos dois lados.
- **Caminhos críticos que exigem 100% de cobertura de ramos:** escolha da taxa por semestre (inclui estimada e erro), frações da legítima (6 combinações de herdeiros), deteção do art. 245.º/3.

## Matriz de Rastreabilidade

| Test ID | Camada | Tipo | Descrição | Cobre (AC IDs) | Ficheiro |
|---------|--------|------|-----------|----------------|----------|
| T-01 | unit | example | juros comercial 5.000 € de 2025-01-01 a 2026-01-01: 2 tramos (181 d a 11,15%, 184 d a 10,15%), juros 532,29 € | US-1.AC-2, SC-002 | `mcp-server/test/calculators.test.mjs` |
| T-02 | unit | example | juros comercial 10.000 € de 2026-07-01 a 2026-10-01: 1 tramo, 92 d, 10,40%, 262,14 € | US-1.AC-2, US-1.AC-3, SC-002 | `mcp-server/test/calculators.test.mjs` |
| T-03 | unit | example | juros comercial-geral 1.000 € de 2022-03-15 a 2024-03-15: 5 tramos (7%, 7%, 9,5%, 11%, 11,5%), 181,88 € | US-1.AC-3, SC-002 | `mcp-server/test/calculators.test.mjs` |
| T-04 | unit | example | juros civil 1.000 € num ano: 4% em todos os tramos, 40,00 € | US-1.AC-3 | `mcp-server/test/calculators.test.mjs` |
| T-05 | unit | example | juros comercial 2.000 € de 2026-12-01 a 2027-03-01: tramo de 2027 estimado a 10,40%, total 51,29 € | US-1.AC-5 | `mcp-server/test/calculators.test.mjs` |
| T-06 | unit | example | erro se início < 2013-07-01 e se fim < início (mensagem nomeia o problema) | US-1.AC-6 | `mcp-server/test/calculators.test.mjs` |
| T-07 | unit | property | para 200 pares de datas gerados (semente fixa) e nas fronteiras 1 jan/1 jul: tramos contíguos, sem dias negativos, soma dos dias = total; 0 dias → juros 0 | US-1.AC-2, EC-1, EC-2 | `mcp-server/test/calculators.test.mjs` |
| T-08 | unit | example | `memoriaJuros` devolve uma linha por tramo (período, dias, taxa, juros), o total e a nota dos 40 € só no tipo comercial | US-1.AC-4, US-1.AC-8 | `mcp-server/test/calculators.test.mjs` |
| T-09 | unit | example | créditos: 1.500 €, admissão 2020-03-01, cessação 2026-06-30, 5 dias de férias vencidas, SF em falta → fração 181/365, proporcionais 743,84 € ×3, férias vencidas 340,91 €, total 4.072,42 € | US-4.AC-1 | `mcp-server/test/calculators.test.mjs` |
| T-10 | unit | example | créditos: admissão 2025-09-01, cessação 2026-03-31 → limite 245.º/3 assinalado; cessação no ano da admissão conta desde a admissão | US-4.AC-2, EC-3 | `mcp-server/test/calculators.test.mjs` |
| T-11 | unit | example | créditos em ano bissexto: 1.200 € + 50 € diut., 2028-02-01 a 2028-08-31 → 213/366, total 2.182,38 € | EC-4 | `mcp-server/test/calculators.test.mjs` |
| T-12 | unit | example | créditos: erro com retribuição negativa e com cessação anterior à admissão (mensagem nomeia o campo) | US-4.AC-5 | `mcp-server/test/calculators.test.mjs` |
| T-13 | unit | example | legítima: 300.000 €, cônjuge + 2 filhos → 2/3 = 200.000 €, QD 100.000 €, 66.666,67 € cada | US-4.AC-3 | `mcp-server/test/calculators.test.mjs` |
| T-14 | unit | example | legítima: 120.000 €, cônjuge + 5 filhos → cônjuge 20.000 € (1/4), filhos 12.000 € cada | EC-5, US-4.AC-3 | `mcp-server/test/calculators.test.mjs` |
| T-15 | unit | example | legítima: 1 filho (1/2), 2 filhos (2/3), cônjuge só (1/2), cônjuge + pais (2/3; 2/3–1/3), só pais (1/2), só outros ascendentes (1/3); VTH = bens + doações − dívidas | US-4.AC-3 | `mcp-server/test/calculators.test.mjs` |
| T-16 | unit | example | legítima sem herdeiros legitimários → 0 € e QD 100% | US-4.AC-4 | `mcp-server/test/calculators.test.mjs` |
| T-17 | unit | example | legítima: erro com bens negativos ou filhos negativos | US-4.AC-5 | `mcp-server/test/calculators.test.mjs` |
| T-18 | unit | example | Python `juros_mora`: os mesmos casos de T-01…T-06 e a memória de cálculo | US-1.AC-2, US-1.AC-3, US-1.AC-4, US-1.AC-5, US-1.AC-6, SC-002 | `skills/advogado-pt/scripts/test_scripts.py` |
| T-19 | unit | example | Python `creditos_laborais`: os mesmos casos de T-09…T-12 | US-4.AC-1, US-4.AC-2, US-4.AC-5, US-4.AC-6 | `skills/advogado-pt/scripts/test_scripts.py` |
| T-20 | unit | example | Python `legitima`: os mesmos casos de T-13…T-17 | US-4.AC-3, US-4.AC-4, US-4.AC-5, US-4.AC-6 | `skills/advogado-pt/scripts/test_scripts.py` |
| T-21 | integração | property | todos os templates (exceto README) acabam com `## Antes de enviar — verificar` e ≥ 3 itens `- [ ]`; a falha nomeia os ficheiros | US-2.AC-1, US-2.AC-5, SC-001 | `mcp-server/test/plugin.test.mjs` |
| T-22 | integração | property | todos os templates e referências declaram `Âmbito:` nacional, ue ou misto nas primeiras 15 linhas; a falha nomeia os ficheiros | US-2.AC-2, US-2.AC-5, SC-001 | `mcp-server/test/plugin.test.mjs` |
| T-23 | integração | example | template de cobrança formal: não afirma que a carta interrompe a prescrição; diz que não interrompe e cita os arts. 323.º e 325.º CC | US-1.AC-1 | `mcp-server/test/plugin.test.mjs` |
| T-24 | integração | example | `valores-2026.md` tem 9,40% / 10,40%, o Aviso n.º 16623/2026/2 e "Última atualização:** 2026-10" | US-1.AC-7 | `mcp-server/test/plugin.test.mjs` |
| T-25 | integração | example | as 4 referências, 17 templates, 2 playbooks e 3 checklists novos existem e estão nos índices (READMEs, Áreas de Competência do SKILL.md, README.md) | US-3.AC-2, US-3.AC-3, US-3.AC-4, SC-003 | `mcp-server/test/plugin.test.mjs` |
| T-26 | integração | example | nenhuma persona (persona.ts, SKILL.md, AGENTS.md, GEMINI.md, integrations/*) fixa o perfil "ENI com possível transição"; todas mencionam o perfil da empresa guardado | US-3.AC-1 | `mcp-server/test/plugin.test.mjs` |
| T-27 | integração | example | commands `fisco`, `insolvencia` e `perfil` existem, têm frontmatter `description` + `argument-hint` e nomeiam o playbook/tool real | US-3.AC-6 | `mcp-server/test/plugin.test.mjs` |
| T-28 | integração | example | README de templates e SKILL.md documentam `{{CAMPO}}` vs `[VERIFICAR]` e a entrega separada do "Antes de enviar" | US-2.AC-4 | `mcp-server/test/plugin.test.mjs` |
| T-29 | integração | example | as referências novas seguem o estilo da casa (`## Legislação Base`, `## Para o contexto do utilizador`) e cada conteúdo novo tem pelo menos uma marca de confirmação ("(a confirmar)", `[VERIFICAR]`, dre.pt ou `valores-2026`) | US-3.AC-5 | `mcp-server/test/plugin.test.mjs` |
| T-30 | unit | example | `listarComAmbito("templates")` devolve nome + âmbito e `listar` não inclui o README | US-2.AC-3 | `mcp-server/test/content.test.mjs` |
| T-31 | unit | example | `formatarProcura` agrupa por tipo com cabeçalhos e mostra o âmbito | US-5.AC-3 | `mcp-server/test/content.test.mjs` |
| T-32 | integração | example | `node cli/advogado-pt.mjs prompt nda-bilingue` → exit 0, contém a persona ("RIGOR") e o template | US-5.AC-1, SC-004 | `mcp-server/test/cli.test.mjs` |
| T-33 | integração | example | `prompt nao-existe` → exit 1 e lista de templates disponíveis | US-5.AC-2 | `mcp-server/test/cli.test.mjs` |
| T-34 | integração | example | README.md tem a secção "Exemplo trabalhado" com caso, tools usadas e documento | US-5.AC-4 | `mcp-server/test/plugin.test.mjs` |
| T-35 | integração | example | o servidor regista `calc_creditos_laborais`, `calc_legitima`, `obter_perfil_empresa` e `guardar_perfil_empresa` | US-4.AC-6, US-3.AC-7, US-3.AC-9 | `mcp-server/test/plugin.test.mjs` |
| T-36 | integração | example | `cli calc creditos …` e `cli calc legitima …` imprimem o total; `cli calc juros` imprime os tramos | US-4.AC-6, US-1.AC-4 | `mcp-server/test/cli.test.mjs` |
| T-37 | unit | example | `lerPerfil`: perfil do projeto tem prioridade sobre o geral; sem projeto usa o geral; indica a origem | US-3.AC-7, EC-6 | `mcp-server/test/perfil.test.mjs` |
| T-38 | unit | example | `guardarPerfil`: grava só em `<dir>/.advogado-pt/perfil-empresa.md`, funde com os campos existentes, ignora campos desconhecidos, normaliza quebras de linha e põe `atualizado_em` | US-3.AC-9, NFR-4 | `mcp-server/test/perfil.test.mjs` |
| T-39 | unit | example | perfil com `atualizado_em` há mais de 12 meses ou sem data → `desatualizado: true` | US-3.AC-10 | `mcp-server/test/perfil.test.mjs` |
| T-40 | unit | example | sem perfil → `lerPerfil` devolve null e `textoPerguntasPerfil()` lista os campos a perguntar e os dois destinos | US-3.AC-8 | `mcp-server/test/perfil.test.mjs` |
| T-41 | unit | example | hook `mensagemSessionStart`: com perfil inclui o resumo e a origem; sem perfil manda perguntar e oferecer guardar; desatualizado pede confirmação | US-3.AC-7, US-3.AC-8, US-3.AC-10 | `mcp-server/test/hooks.test.mjs` |
| T-42 | unit | example | hook com perfil ilegível ou sem campos → não lança e devolve a mensagem sem perfil | US-3.AC-11 | `mcp-server/test/hooks.test.mjs` |
| T-43 | integração | example | SKILL.md tem a secção "Perfil da Empresa" com a ordem projeto → geral e a regra de não gravar dados de outra entidade | EC-7, US-3.AC-8 | `mcp-server/test/plugin.test.mjs` |
| T-44 | integração | example | sem dependências novas: `dependencies` do mcp-server só `@modelcontextprotocol/sdk` + `zod`, `devDependencies` iguais, raiz sem dependências | NFR-1 | `mcp-server/test/plugin.test.mjs` |
| T-45 | integração | example | versão 1.1.0 em plugin.json, marketplace.json (2 campos), package.json, mcp-server/package.json, src/index.ts e entrada `[1.1.0]` no CHANGELOG | NFR-2 | `mcp-server/test/plugin.test.mjs` |
| T-46 | integração | example | o bundle `mcp-server/content/` tem os conteúdos novos (build regenerado) | NFR-2 | `mcp-server/test/plugin.test.mjs` |

## Verificação de Cobertura
Cada AC aparece em pelo menos uma célula "Cobre". Lacunas (com justificação):
- **NFR-3** (suites passam) não é um teste: é o `_Verify:_` das tarefas e o check do projeto (`mcp-test`, `py-test`).
- **US-3.AC-5** é coberto por T-29 só de forma estrutural; a exatidão jurídica das citações é verificada na tarefa de revisão (manual, registada no relatório final).

## Dados de Teste e Fixtures
- Casos de referência de juros, créditos e legítima calculados à mão (valores em T-01…T-17).
- Taxas: tabela §3 2008–2026 da Home Page Jurídica (aviso de cada semestre) + confirmação de 2023–2026 em ECO/APCMC/SFJ.
- Perfis de teste escritos em `mkdtempSync` (projeto e home separados).

## Fora de Âmbito para Testes
- Qualidade da redação jurídica dos templates (revisão humana).
- Comportamento do modelo ao perguntar o perfil (instrução no SKILL.md/persona; testado só estruturalmente).
