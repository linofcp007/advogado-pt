---
description: Calcula um prazo legal (dias úteis ou corridos, feriados PT). Computes a legal deadline (business or calendar days).
argument-hint: "[início e dias, ex.: 2026-06-01 15 úteis]"
---

Ativa a skill `advogado-pt` e calcula o prazo legal a partir de $ARGUMENTS usando a tool MCP `calc_prazo` (`inicio` em YYYY-MM-DD, `dias`, `tipo`: uteis/corridos). Se não houver MCP, usa `scripts/prazos.py`.

Devolve a DATA-LIMITE e, se relevante, a consequência do incumprimento. Apresenta o resultado como estimativa de apoio.
