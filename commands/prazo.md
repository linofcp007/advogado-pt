---
description: Calcula um prazo legal (judicial com férias judiciais, corridos ou úteis). Computes a legal deadline (court, calendar or business days).
argument-hint: "[início e dias, ex.: 2026-06-01 15 úteis]"
---

Ativa a skill `juridico-pt` e calcula o prazo legal a partir de $ARGUMENTS usando a tool MCP `calc_prazo` (`inicio` em YYYY-MM-DD, `dias`, `tipo`: judicial para prazos de processos em tribunal — contestação, oposição, recurso —, corridos por defeito, ou uteis; `urgente`: true nos processos urgentes). Se não houver MCP, usa `python "${CLAUDE_PLUGIN_ROOT}/skills/juridico-pt/scripts/prazos.py"`.

Devolve a DATA-LIMITE (e o termo legal, se foi transferido) e, se relevante, a consequência do incumprimento; oferece registá-la com `registar_prazo`. Apresenta o resultado como estimativa de apoio.

**EN:** Activate the `juridico-pt` skill and compute the legal deadline from $ARGUMENTS using the `calc_prazo` MCP tool (`inicio` in YYYY-MM-DD, `dias`, `tipo`: judicial for court deadlines, corridos by default, or uteis; `urgente`: true for urgent proceedings). If no MCP is available, use `python "${CLAUDE_PLUGIN_ROOT}/skills/juridico-pt/scripts/prazos.py"`. Return the DEADLINE and, where relevant, the consequence of missing it. Present the result as a supporting estimate.

*Exemplos · Examples: "tenho 15 dias úteis a partir de hoje", "deadline 30 days from 2026-06-01".*
