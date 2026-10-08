---
description: Calcula juros de mora (comercial ou civil) entre datas. Computes default interest (commercial or civil) between dates.
argument-hint: "[capital e data, ex.: 5000 2025-03-01]"
---

Ativa a skill `juridico-pt` e calcula os juros de mora a partir de $ARGUMENTS usando a tool MCP `calc_juros_mora` (`capital`, `data_inicio` em YYYY-MM-DD, `data_fim` opcional, `tipo`: comercial/civil). Se não houver MCP, usa `python "${CLAUDE_PLUGIN_ROOT}/skills/juridico-pt/scripts/juros_mora.py"`.

Devolve período, taxa, juros e total. Apresenta o resultado como estimativa de apoio.

**EN:** Activate the `juridico-pt` skill and compute default interest from $ARGUMENTS using the `calc_juros_mora` MCP tool (`capital`, `data_inicio` in YYYY-MM-DD, optional `data_fim`, `tipo`: comercial/civil). If no MCP is available, use `python "${CLAUDE_PLUGIN_ROOT}/skills/juridico-pt/scripts/juros_mora.py"`. Return period, rate, interest and total. Present the result as a supporting estimate.

*Exemplos · Examples: "quanto rende de juros 5000€ desde março", "interest on 5000 since March".*
