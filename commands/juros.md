---
description: Calcula juros de mora (comercial ou civil) entre datas. Computes default interest (commercial or civil) between dates.
argument-hint: "[capital e data, ex.: 5000 2025-03-01]"
---

Ativa a skill `advogado-pt` e calcula os juros de mora a partir de $ARGUMENTS usando a tool MCP `calc_juros_mora` (`capital`, `data_inicio` em YYYY-MM-DD, `data_fim` opcional, `tipo`: comercial/civil). Se não houver MCP, usa `scripts/juros_mora.py`.

Devolve período, taxa, juros e total. Apresenta o resultado como estimativa de apoio.
