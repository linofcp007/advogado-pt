---
description: Calcula o IMT (e Imposto do Selo) na compra de imóvel. Computes property transfer tax (IMT + stamp duty) on a purchase.
argument-hint: "[valor do imóvel, ex.: 250000 hpp]"
---

Ativa a skill `advogado-pt` e calcula o IMT a partir de $ARGUMENTS usando a tool MCP `calc_imt` (`valor` = maior entre preço e VPT, `tipo`: hpp/secundaria, `jovem`: true para IMT Jovem). Se não houver MCP, usa `scripts/imt.py`.

Devolve regime, IMT, Imposto do Selo (0,8%) e total de impostos. Apresenta o resultado como estimativa de apoio (valores 2026, Continente).
