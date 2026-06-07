---
description: Calcula a data-limite de prescrição/caducidade. Computes the limitation/expiry deadline.
argument-hint: "[data e tipo, ex.: 2025-01-15 creditos-comerciais]"
---

Ativa a skill `advogado-pt` e calcula a prescrição/caducidade a partir de $ARGUMENTS usando a tool MCP `calc_prescricao` (`inicio` em YYYY-MM-DD, `tipo`, ex.: creditos-comerciais, servicos). Se não houver MCP, usa `scripts/prescricao.py`.

Devolve a base legal, o prazo e a DATA-LIMITE, e lembra que a prescrição se interrompe com citação/notificação judicial ou reconhecimento da dívida (Arts. 323.º/325.º CC). Estimativa de apoio.

**EN:** Activate the `advogado-pt` skill and compute the prescription/expiry from $ARGUMENTS using the `calc_prescricao` MCP tool (`inicio` in YYYY-MM-DD, `tipo`, e.g. creditos-comerciais, servicos). If no MCP is available, use `scripts/prescricao.py`. Return the legal basis, the period and the DEADLINE, and note that prescription is interrupted by a court summons/notification or acknowledgement of the debt (Arts. 323.º/325.º CC). Supporting estimate.
