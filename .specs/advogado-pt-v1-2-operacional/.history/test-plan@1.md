# Test Plan: advogado-pt v1.2 operacional

## Estratégia
- **Test runner:** `node --test` (novo `mcp-server/test/v12.test.mjs` + `factos.test.mjs`, importando `../dist/`) e `unittest` (`scripts/test_scripts.py`, classes `T131`/`T132`/`T136`).
- **Mocking:** nenhum — funções puras com `hoje`, `projeto`, `home` explícitos; ficheiros em `mkdtempSync`; CLI por `spawnSync`.
- **Alvo:** cada AC com ≥ 1 teste; cada calculadora com ≥ 2 casos de referência nos dois lados.
- **Caminhos críticos (100% de ramos):** escolha do escalão de retenção (incl. fórmula dos escalões baixos e regra dos 3+ dependentes), escalões de IRC/derrama estadual, aplicabilidade das regras do calendário, transferência de datas.
- **IDs:** a partir de T-101 (a v1.1 usa a numeração 1 a 46).

## Dados de referência (calculados à mão a partir das fontes oficiais)
- **Retenção IRS 2026 (Despacho 233-A/2026, Continente)** — Tabela I, 1 500 € -> 24,10% × 1 500 − 193,33 = **168,17 €**; SS 165,00 €; líquido **1 166,83 €**. Tabela I, 1 000 € -> 125 − 12,5% × 2,60 × (1 273,85 − 1 000) = **36,00 €**; líquido **854,00 €**. Tabela I, 900 € -> **0 €**. Tabela III, 2 000 €, 2 dependentes -> 19,38% × 2 000 − 213,53 − 2 × 42,86 = **88,35 €**; líquido **1 691,65 €**. Tabela II, 2 000 €, 3 dependentes (−1 p.p.) -> 30,10% × 2 000 − 320,66 − 3 × 34,29 = **178,47 €**.
- **Subsídio de refeição 2026:** isento até 6,15 €/dia em numerário e 10,46 €/dia em cartão; 8 € × 22 dias em numerário -> 40,70 € tributáveis.
- **Custo do trabalhador:** base 1 500 €, refeição 6 € × 22 × 11, seguro AT 1% -> 21 000 + 4 987,50 (TSU 23,75%) + 1 452 + 210 = **27 649,50 €/ano**, **2 304,13 €/mês**.
- **IRC 2026 (Lei 64/2025; arts. 52.º, 87.º, 87.º-A, 88.º CIRC):** PME, LT 100 000, derrama 1,5%, TA 600 -> IRC 17 000 + 1 500 + 0 + 600 = **19 100 €**. Não PME, LT 2 000 000 -> 380 000 + 30 000 + 15 000 = **425 000 €**. LT 100 000 com 80 000 de prejuízos -> dedução limitada a 65% -> MC 35 000 -> IRC **5 250 €**. LT 40 M€ -> derrama estadual **2 005 000 €**.
- **Taxa de justiça (RCP, Tabela I-A; UC 102 €):** 1 500 € -> 1 UC = **102 €**; 30 000 € -> 5 UC = **510 €**; 300 000 € -> 16 UC + 3 UC de remanescente = **19 UC (1 938 €)**; 310 000 € -> 16 + 6 UC.
- **Compensação (art. 366.º CT; Lei 69/2013, art. 5.º; Lei 13/2023, art. 35.º/2):** casos do simulador oficial da ACT (portal.act.gov.pt, RMMG 920 €) — ver T-135; frações de ano = anos + (meses + dias/30)/12, com o dia final incluído.

## Matriz de Rastreabilidade

| Test ID | Camada | Tipo | Descrição | Cobre (AC IDs) | Ficheiro |
|---------|--------|------|-----------|----------------|----------|
| T-101 | integração | property | ≤ 3 marcas `[VERIFICAR — valores-2026]` restantes e cada uma indica onde confirmar; os valores resolvidos estão em `valores-2026.md` com base legal | US-1.AC-1, US-1.AC-2, SC-001 | `mcp-server/test/v12.test.mjs` |
| T-102 | integração | example | os 4 pontos de doutrina têm "Posição recomendada" e "Grau de certeza" com fonte nos ficheiros afetados | US-1.AC-3 | `mcp-server/test/v12.test.mjs` |
| T-103 | unit | example | calendário 2026 de Lda, IVA trimestral, 12 trabalhadores, contabilidade organizada: ≥ 15 obrigações, todas com base legal; inclui IVA, DMR, Modelo 22, IES, aprovação de contas, Relatório Único, mapa de férias, RCBE | US-2.AC-1, SC-002 | `mcp-server/test/v12.test.mjs` |
| T-104 | unit | example | DMR de janeiro de 2026 (10/1 = sábado) passa para 12/1 com `dataOriginal`; IVA de junho (regime mensal) vai para 21/9 (20/9 = domingo); obrigações de agosto passam para 31/8 (férias fiscais); Modelo 22 de 2026 sem transferência ("independentemente de ser útil") e com a prorrogação por despacho para 30/6; nenhuma data transferível cai em sábado/domingo/feriado | US-2.AC-2 | `mcp-server/test/v12.test.mjs` |
| T-105 | unit | example | ENI isento (art. 53.º) sem trabalhadores: sem declaração periódica de IVA nem DMR; com Modelo 3 de IRS | US-2.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-106 | unit | example | sem perfil: obrigações gerais marcadas `aConfirmar` com `camposEmFalta` | US-2.AC-4, EC-1 | `mcp-server/test/v12.test.mjs` |
| T-107 | unit | property | `.ics`: BEGIN/END VCALENDAR, VERSION:2.0, PRODID, um VEVENT por obrigação, CRLF, linhas ≤ 75 octetos, `,` `;` escapados, UID estável | US-2.AC-3 | `mcp-server/test/v12.test.mjs` |
| T-108 | integração | example | tool `calendario_obrigacoes` registada; `cli calendario --ano 2026` imprime obrigações; `--ics` cria o ficheiro | US-2.AC-5, US-2.AC-3 | `mcp-server/test/v12.test.mjs` |
| T-109 | unit | example | registar/listar/concluir prazo em `.advogado-pt/prazos.md`; data inválida dá erro | US-3.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-110 | unit | example | `prazosProximos`: vencidos e ≤ 7 dias com `faltam`; prazo no passado = vencido | US-3.AC-2, EC-2 | `mcp-server/test/v12.test.mjs` |
| T-111 | unit | example | hook SessionStart avisa vencidos e próximos; ficheiro ilegível não lança | US-3.AC-2, US-3.AC-3 | `mcp-server/test/v12.test.mjs` |
| T-112 | integração | example | referência `compliance`, 2 templates e checklist existem, com âmbito e indexados | US-4.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-113 | unit | example | perfil com 60 trabalhadores inclui obrigações RGPC; com 10 não inclui | US-4.AC-2 | `mcp-server/test/v12.test.mjs` |
| T-114 | integração | example | 2 templates, checklist SST e playbooks lay-off/despedimento coletivo existem e estão indexados | US-5.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-115 | unit | example | salário líquido TS: os 5 casos de referência + refeição em numerário e em cartão | US-5.AC-2, EC-3, SC-003 | `mcp-server/test/v12.test.mjs` |
| T-116 | unit | example | custo do trabalhador TS: 27 649,50 €/ano e 2 304,13 €/mês; refeição acima do limite paga TSU sobre o excesso | US-5.AC-3, SC-003 | `mcp-server/test/v12.test.mjs` |
| T-117 | unit | example | erros: vencimento negativo, dependentes negativos, tabela inválida | US-5.AC-4 | `mcp-server/test/v12.test.mjs` |
| T-118 | unit | example | IRC TS: PME 19 100 €; não PME 425 000 €; derrama estadual de 40 M€ = 2 005 000 € | US-6.AC-1, SC-003 | `mcp-server/test/v12.test.mjs` |
| T-119 | unit | example | IRC com prejuízos (limite 65%) e com prejuízo fiscal do ano (IRC 0; TA +10 p.p. salvo exceção) | EC-4, US-6.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-120 | unit | example | decisor de IVA: serviços B2B UE (autoliquidação), bens B2B UE com VIES (isento RITI), sem VIES (IVA PT), bens B2C UE acima do limiar (OSS), exportação (isento) | US-6.AC-2, EC-5 | `mcp-server/test/v12.test.mjs` |
| T-121 | integração | example | referência `iva-internacional` e playbook `faturar-cliente-estrangeiro` existem e estão indexados | US-6.AC-3 | `mcp-server/test/v12.test.mjs` |
| T-122 | integração | example | 8 templates de contratos/societário e playbook `dissolucao-liquidacao` existem e estão indexados | US-7.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-123 | integração | example | templates `oposicao-injuncao` e `oposicao-execucao` existem e estão indexados | US-8.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-124 | unit | example | taxa de justiça TS: 102 €, 510 €, 300 000 € = 19 UC, 310 000 € = 22 UC | US-8.AC-2, EC-6 | `mcp-server/test/v12.test.mjs` |
| T-125 | integração | example | `licenciamento-setorial` tem as 5 secções (AL, restauração, construção, transportes/TVDE, mediação imobiliária) | US-9.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-126 | integração | example | 3 políticas (IA com art. 4.º AI Act, videovigilância, monitorização) existem e estão indexadas | US-10.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-127 | unit | example | gravar perfis nomeados, listar com o ativo, ativar e ler o ativo | US-11.AC-1, US-11.AC-2, US-11.AC-3 | `mcp-server/test/v12.test.mjs` |
| T-128 | unit | example | perfil ativo inexistente -> usa `perfil-empresa.md` e devolve aviso | US-11.AC-4 | `mcp-server/test/v12.test.mjs` |
| T-129 | unit | example | hook mostra o perfil ativo (nome e origem) | US-11.AC-2 | `mcp-server/test/v12.test.mjs` |
| T-130 | integração | property | ≥ 40 factos de `factos.json` verificados (texto obrigatório presente, texto proibido ausente) | US-12.AC-1, SC-005 | `mcp-server/test/factos.test.mjs` |
| T-131 | unit | example | Python: salário líquido e custo do trabalhador com os mesmos casos | US-5.AC-2, US-5.AC-3, SC-003 | `skills/advogado-pt/scripts/test_scripts.py` |
| T-132 | unit | example | Python: IRC, taxa de justiça e decisor de IVA com os mesmos casos | US-6.AC-1, US-6.AC-2, US-8.AC-2, SC-003 | `skills/advogado-pt/scripts/test_scripts.py` |
| T-133 | integração | example | todos os itens pedidos (v1.2 + "Depois") nos índices, SKILL.md e README; commands novos nomeiam tools reais | SC-004 | `mcp-server/test/v12.test.mjs` |
| T-134 | integração | example | versão 1.2.0 em todos os manifestos e CHANGELOG | US-12.AC-1 | `mcp-server/test/v12.test.mjs` |
| T-135 | unit | example | compensação TS por datas = simulador oficial da ACT: sem termo 01/05/2015–30/04/2024, 1 500 € -> 5 500,00 €; 01/01/2010–31/12/2025, 1 500 € -> 12 783,33 €; 31/10/2011–31/01/2013 -> 4 500,00 € (mínimo de 3 meses só no regime anterior a 1/11/2011); 01/01/2025–31/03/2025 -> 175,00 € (sem mínimo); 01/12/2000–31/12/2025, 2 000 € -> 24 000,00 € (teto 12×); 01/01/1995–31/12/2025, 2 000 € -> 35 666,67 € (alínea a) não cortada); 01/01/2014–31/12/2025, 25 000 € -> 91 591,11 € (20×RMMG); extinção do posto = 14 dias; função por anos sem mínimo (1 500 €, 4 anos -> 2 800 €) | US-1.AC-4 | `mcp-server/test/v12.test.mjs` |
| T-136 | unit | example | compensação Python com os mesmos casos | US-1.AC-4 | `skills/advogado-pt/scripts/test_scripts.py` |

## Verificação de Cobertura
Todos os ACs aparecem em pelo menos uma célula. NFR-1/NFR-3/NFR-4 são verificados pelas tarefas (suites completas, testes de dependências da v1.1, hook fail-open em T-111/T-128). T-134 mapeia a NFR-2 via a tarefa de release.

## Dados de Teste e Fixtures
- Tabelas e taxas oficiais acima (URL na investigação: Despacho 233-A/2026; Lei 64/2025; CIRC arts. 52.º/87.º/87.º-A/88.º; RCP Tabela I; Portaria 51-B/2026/1).
- Calendário: regras e datas do calendário fiscal oficial da AT de 2026 (obrigações declarativas e de pagamento), despachos SEAF de prorrogação, DL 127/2025 (Segurança Social), CT 241.º, CSC 65.º, RJRCBE 15.º — fonte por regra.

## Fora de Âmbito para Testes
- Qualidade da redação jurídica dos templates (revisão humana + factos de regressão).
