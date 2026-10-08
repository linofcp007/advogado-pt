# Scripts — Calculadoras Jurídicas (juridico-pt)

Calculadoras Python determinísticas para apoio à decisão jurídica em Portugal.
Cada script é autónomo (standalone), usa apenas a biblioteca-padrão (stdlib),
tem `argparse` com `--help`, e produz output em português.

Requisito: Python 3.x (testado com Python 3.14). Não há dependências externas.

> ⚠️ **Importante:** Estes scripts dão **estimativas** para apoio à decisão.
> **Não substituem** cálculo oficial nem validação por contabilista/advogado.
> Os valores embebidos (taxas, UC, IAS) são de **2026** e devem ser confirmados
> em `references/valores-2026.md`.

---

## Índice dos scripts

Cada script tem o port TypeScript equivalente no servidor MCP (`mcp-server/src/calculators/`) e a tool correspondente — os dois lados dão o mesmo resultado (casos partilhados em `mcp-server/test/fixtures/paridade.json`). Os valores em euros são arredondados ao cêntimo meio para cima.

| Script | Tool MCP | O que calcula |
|---|---|---|
| `juros_mora.py` | `calc_juros_mora` / `calc_juros_lote` | Juros de mora por tramos semestrais (comercial, comercial-geral, civil); `--lote` para várias faturas, com 40 € por fatura comercial e totais por cliente |
| `prazos.py` | `calc_prazo` | Prazos `judicial` (CPC 138.º, férias judiciais), `corridos` (por defeito) ou `uteis` |
| `prescricao.py` | `calc_prescricao` | Prescrição e caducidade pelos tipos do CC, com aviso nas presuntivas |
| `compensacao_despedimento.py` | `calc_compensacao_despedimento` | Compensação por cessação (art. 366.º CT; regime transitório com as datas) |
| `creditos_laborais.py` | `calc_creditos_laborais` | Créditos na cessação (proporcionais, férias não gozadas) |
| `salario_liquido.py` | `calc_salario_liquido` / `calc_custo_trabalhador` | Salário líquido (`salario`) e custo anual do trabalhador (`custo`) |
| `irc.py` | `calc_irc` | IRC, derramas e tributação autónoma |
| `irs_simplificado.py` | `calc_irs_simplificado` | Rendimento tributável da Cat. B no regime simplificado |
| `iva_operacao.py` | `calc_iva_operacao` | IVA em operações com o estrangeiro (código e menção da AT) |
| `imt.py` | `calc_imt` | IMT e Imposto do Selo na compra de imóvel (com IMT Jovem) |
| `imposto_selo_heranca.py` | `calc_imposto_selo_heranca` | Imposto do Selo em heranças e doações |
| `legitima.py` | `calc_legitima` | Legítima e quota disponível |
| `taxa_justica.py` | `calc_taxa_justica` | Taxa de justiça de uma ação (RCP, Tabela I) |
| `custas_injuncao.py` | `calc_custas_injuncao` | Taxa de justiça da injunção |
| `procedimento_ccp.py` | `calc_procedimento_ccp` | Procedimento de contratação pública admissível pelo valor (limiares do DL 177/2026) |

### Exemplos

```bash
python scripts/juros_mora.py --capital 5000 --data-inicio 2025-01-15 [--data-fim AAAA-MM-DD] [--tipo comercial|comercial-geral|civil]
python scripts/prazos.py --inicio 2026-10-01 --dias 30 --tipo judicial [--urgente]
python scripts/prescricao.py --inicio 2024-01-10 --tipo servicos-profissionais
python scripts/compensacao_despedimento.py --retribuicao-base 1500 --admissao 2015-05-01 --cessacao 2024-04-30
python scripts/creditos_laborais.py --retribuicao 1500 --admissao 2020-03-01 --cessacao 2026-06-30
python scripts/salario_liquido.py salario --bruto 1500 --tabela I --dependentes 0
python scripts/salario_liquido.py custo --base 1500 --refeicao 6 --seguro 0.01
python scripts/irc.py --lucro 100000 --pme --derrama 0.015
python scripts/irs_simplificado.py --rendimento 30000 --tipo servicos-151
python scripts/iva_operacao.py --tipo servicos --cliente empresa --destino UE
python scripts/imt.py --valor 400000 --tipo hpp --jovem
python scripts/imposto_selo_heranca.py --valor 50000 --herdeiro descendente
python scripts/legitima.py --bens 300000 --conjuge --filhos 2
python scripts/taxa_justica.py --valor 30000
python scripts/custas_injuncao.py --valor 3500
python scripts/juros_mora.py --data-fim 2026-10-01 --lote '[{"cliente": "A", "fatura": "FT 1", "capital": 1000, "vencimento": "2026-01-15"}]'
python scripts/procedimento_ccp.py --valor 100000 --tipo bens-servicos
```

Tipos de prescrição (`--tipo`): `civil-geral`, `creditos-comerciais` (20 anos), `servicos-profissionais` e `vendas-a-consumidor` (2 anos, presuntivas), `rendas`, `juros`, `prestacoes-periodicas` (5 anos), `telecom-energia-agua`, `queixa-crime-semipublico` (6 meses), `garantia-bens-consumo` (3 anos).

### `test_scripts.py` — Testes de regressão
Testes `unittest` (stdlib) das funções de cálculo. **Correr antes de editar
taxas, coeficientes ou tabelas** para garantir que nada parte:

```bash
python scripts/test_scripts.py
```

---

## Ajuda de cada script

Todos aceitam `--help`:

```bash
python scripts/juros_mora.py --help
python scripts/prazos.py --help
python scripts/compensacao_despedimento.py --help
python scripts/custas_injuncao.py --help
python scripts/imposto_selo_heranca.py --help
python scripts/imt.py --help
python scripts/prescricao.py --help
python scripts/irs_simplificado.py --help
```
