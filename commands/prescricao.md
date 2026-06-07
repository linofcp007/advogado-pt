---
description: Calcula a data-limite de prescrição/caducidade. Computes the limitation/expiry deadline.
argument-hint: "[data e tipo, ex.: 2025-01-15 creditos-comerciais]"
---

Ativa a skill `advogado-pt` e calcula a prescrição/caducidade a partir de $ARGUMENTS usando a tool MCP `calc_prescricao` (`inicio` em YYYY-MM-DD, `tipo`, ex.: creditos-comerciais, servicos). Se não houver MCP, usa `scripts/prescricao.py`.

Devolve a base legal, o prazo e a DATA-LIMITE, e lembra que a prescrição se interrompe com citação/notificação judicial ou reconhecimento da dívida (Arts. 323.º/325.º CC). Estimativa de apoio.
