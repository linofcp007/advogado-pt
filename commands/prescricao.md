---
description: Calcula a data-limite de prescrição/caducidade. Computes the limitation/expiry deadline.
argument-hint: "[data e tipo, ex.: 2025-01-15 creditos-comerciais]"
---

Ativa a skill `juridico-pt` e calcula a prescrição/caducidade a partir de $ARGUMENTS usando a tool MCP `calc_prescricao` (`inicio` em YYYY-MM-DD, `tipo`, ex.: creditos-comerciais (faturas entre empresas, 20 anos), servicos-profissionais ou vendas-a-consumidor (2 anos, presuntivas), rendas, juros). Se não houver MCP, usa `python "${CLAUDE_PLUGIN_ROOT}/skills/juridico-pt/scripts/prescricao.py"`.

Devolve a base legal, o prazo e a DATA-LIMITE, e lembra que a prescrição se interrompe com citação/notificação judicial ou reconhecimento da dívida (Arts. 323.º/325.º CC). Estimativa de apoio.

**EN:** Activate the `juridico-pt` skill and compute the prescription/expiry from $ARGUMENTS using the `calc_prescricao` MCP tool (`inicio` in YYYY-MM-DD, `tipo`, e.g. creditos-comerciais (B2B invoices, 20 years), servicos-profissionais or vendas-a-consumidor (2 years, presumptive), rendas, juros). If no MCP is available, use `python "${CLAUDE_PLUGIN_ROOT}/skills/juridico-pt/scripts/prescricao.py"`. Return the legal basis, the period and the DEADLINE, and note that prescription is interrupted by a court summons/notification or acknowledgement of the debt (Arts. 323.º/325.º CC). Supporting estimate.

*Exemplos · Examples: "esta dívida de 2020 ainda dá para cobrar?", "is this 2021 invoice still enforceable?".*
