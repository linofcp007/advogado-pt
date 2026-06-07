---
description: Calcula o IMT (e Imposto do Selo) na compra de imóvel. Computes property transfer tax (IMT + stamp duty) on a purchase.
argument-hint: "[valor do imóvel, ex.: 250000 hpp]"
---

Ativa a skill `advogado-pt` e calcula o IMT a partir de $ARGUMENTS usando a tool MCP `calc_imt` (`valor` = maior entre preço e VPT, `tipo`: hpp/secundaria, `jovem`: true para IMT Jovem). Se não houver MCP, usa `scripts/imt.py`.

Devolve regime, IMT, Imposto do Selo (0,8%) e total de impostos. Apresenta o resultado como estimativa de apoio (valores 2026, Continente).

**EN:** Activate the `advogado-pt` skill and compute the IMT from $ARGUMENTS using the `calc_imt` MCP tool (`valor` = the higher of price and VPT, `tipo`: hpp/secundaria, `jovem`: true for IMT Jovem). If no MCP is available, use `scripts/imt.py`. Return the regime, IMT, Stamp Duty (0.8%) and total taxes. Present the result as a supporting estimate (2026 values, mainland Portugal).

*Exemplos · Examples: "quanto pago de IMT numa casa de 250 mil", "IMT on a 250k home".*
