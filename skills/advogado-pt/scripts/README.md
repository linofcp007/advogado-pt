# Scripts — Calculadoras Jurídicas (advogado-pt)

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

### 1. `juros_mora.py` — Juros de mora
Calcula juros de mora simples (comerciais — DL 62/2013, ou civis —
Portaria 291/2003) sobre um capital, entre duas datas.

```bash
python scripts/juros_mora.py --capital 5000 --data-inicio 2025-01-15
```

Argumentos: `--capital`, `--data-inicio`, `--data-fim` (default: hoje),
`--tipo` (`comercial` | `civil`, default `comercial`).

### 2. `prazos.py` — Contagem de prazos legais
Conta um prazo em dias úteis (saltando fins-de-semana e feriados nacionais,
incluindo Sexta-Feira Santa e Corpo de Deus) ou em dias corridos.

```bash
python scripts/prazos.py --inicio 2026-03-02 --dias 10
```

Argumentos: `--inicio`, `--dias`, `--tipo` (`uteis` | `corridos`,
default `uteis`).

### 3. `compensacao_despedimento.py` — Compensação por cessação
Calcula a compensação por cessação de contrato (Art. 366.º CT), com mínimo
legal de 3 meses quando aplicável.

```bash
python scripts/compensacao_despedimento.py --retribuicao-base 1200 --anos 5
```

Argumentos: `--retribuicao-base`, `--diuturnidades` (default 0), `--anos`,
`--modalidade` (`sem-termo` | `extincao-posto` | `coletivo` | `termo`,
default `sem-termo`).

### 4. `custas_injuncao.py` — Taxa de justiça de injunção
Estima a taxa de justiça de um procedimento de injunção (UC 2026 = 102€).

```bash
python scripts/custas_injuncao.py --valor 3500
```

Argumentos: `--valor` (valor da dívida).

### 5. `imposto_selo_heranca.py` — Imposto do Selo em heranças
Calcula o Imposto do Selo na transmissão por herança (verba 1.2 TGIS), com
isenção para cônjuge/descendentes/ascendentes e acréscimo de 0,8% sobre
imóveis.

```bash
python scripts/imposto_selo_heranca.py --valor 50000 --herdeiro descendente
```

Argumentos: `--valor`, `--herdeiro`
(`conjuge` | `descendente` | `ascendente` | `outro`, default `outro`),
`--inclui-imovel` (flag), `--vpt-imovel` (default 0).

### 6. `imt.py` — IMT 2026 (Continente)
Calcula o IMT na aquisição de imóvel para habitação (tabelas de 2026,
Continente). Aplica o método português `IMT = valor * taxa - parcela`, com a
parcela a abater derivada por continuidade; suporta taxas únicas (6% / 7,5%)
e a isenção IMT Jovem. Mostra também o Imposto do Selo (0,8%) e o total.

```bash
python scripts/imt.py --valor 200000
python scripts/imt.py --valor 250000 --tipo secundaria
python scripts/imt.py --valor 300000 --tipo hpp --jovem
```

Argumentos: `--valor` (o maior entre preço e VPT), `--tipo`
(`hpp` | `secundaria`, default `hpp`), `--jovem` (flag, isenção IMT Jovem).

### 7. `prescricao.py` — Prazos de prescrição / caducidade
Calcula a data-limite a partir de uma data de início, contando em anos/meses
civis (não dias úteis), com ajuste de 29 de fevereiro / fim de mês.

```bash
python scripts/prescricao.py --inicio 2025-01-01 --tipo servicos-profissionais
```

Argumentos: `--inicio` (YYYY-MM-DD), `--tipo` (`civil-geral` |
`servicos-profissionais` | `creditos-comerciais` | `juros` | `rendas` |
`telecom-energia-agua` | `queixa-crime-semipublico` | `garantia-bens-consumo`).

### 8. `irs_simplificado.py` — Rendimento tributável (regime simplificado)
Aplica o coeficiente da Categoria B (ENI) ao rendimento bruto para obter o
rendimento tributável. Não calcula o imposto final (escalões progressivos).

```bash
python scripts/irs_simplificado.py --rendimento 30000 --tipo servicos-151
```

Argumentos: `--rendimento` (bruto anual), `--tipo` (`mercadorias` |
`servicos-151` | `servicos-outros` | `propriedade-intelectual`).

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
