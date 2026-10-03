---
description: IRC estimado (taxa PME, derramas, tributação autónoma, prejuízos). Corporate income tax estimate.
argument-hint: "[lucro tributável, PME sim/não, município/derrama, viaturas e despesas de representação]"
---

Ativa a skill `juridico-pt` para o IRC: $ARGUMENTS.

1. Confirma no perfil (`obter_perfil_empresa`) que é uma sociedade e se é PME (certificação IAPMEI). Pede o que faltar: lucro tributável (ou prejuízo), prejuízos de anos anteriores, taxa da derrama do município, viaturas (custo de aquisição, tipo e encargos anuais), despesas de representação, ajudas de custo.
2. Calcula com a tool MCP `calc_irc` e explica cada parcela (IRC, derrama municipal, derrama estadual, tributação autónoma) com a base legal (CIRC arts. 52.º, 87.º, 87.º-A e 88.º; Lei 64/2025 para as taxas de 2026-2028).
3. Quando houver viaturas, compara o impacto de combustão, plug-in e elétrico (limiares de 37.500 €, 45.000 € e 62.500 €). Lembra o agravamento de 10 p.p. com prejuízo e as exceções.
4. Para os prazos (Modelo 22, pagamentos por conta, IES), usa `calendario_obrigacoes`. Para faturação ao estrangeiro, usa `calc_iva_operacao` e a referência `iva-internacional`. Fundamenta com `ler_referencia` `fiscal` e os valores de `valores-2026`.

**EN:** Activate the `juridico-pt` skill for corporate income tax: $ARGUMENTS. Check the profile, compute with the `calc_irc` MCP tool and explain each component (CIT, municipal and state surcharges, autonomous taxation). Use `calendario_obrigacoes` for the filing and payment deadlines.

*Exemplos · Examples: "/irc lucro 120.000 € PME Lisboa", "/irc quanto pago de tributação autónoma num carro de 40.000 €", "/irc tivemos prejuízo de 30.000 €".*
