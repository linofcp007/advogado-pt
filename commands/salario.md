---
description: Salário líquido de um trabalhador e custo total para a empresa (2026). Net salary and total employer cost (2026).
argument-hint: "[bruto mensal, situação familiar e dependentes, subsídio de refeição | 'custo' para o custo da empresa]"
---

Ativa a skill `juridico-pt` para salário e custo do trabalhador: $ARGUMENTS.

- **Salário líquido**: identifica a tabela de retenção (I: não casado sem dependentes ou casado dois titulares; II: não casado com dependentes; III: casado, único titular), o n.º de dependentes e o subsídio de refeição (valor por dia, dinheiro ou cartão). Calcula com a tool MCP `calc_salario_liquido` e explica a retenção de IRS (Despacho 233-A/2026) e a Segurança Social (11%).
- **Custo para a empresa**: calcula com `calc_custo_trabalhador` (14 retribuições, TSU 23,75%, subsídio de refeição e seguro de acidentes de trabalho) e lista o que fica de fora (medicina do trabalho, formação de 40 h, seguros de saúde, prémios).
- Se o pedido for de contratação, liga ao perfil da empresa (`obter_perfil_empresa`), ao template do contrato (`obter_template` `contrato-trabalho-sem-termo` ou `contrato-trabalho-termo-certo`) e lembra a comunicação de admissão à Segurança Social até ao início da execução do contrato (DL 127/2025).

Valores em `valores-2026` (`ler_referencia`). Açores e Madeira têm tabelas de retenção próprias.

**EN:** Activate the `juridico-pt` skill for salary questions: $ARGUMENTS. Compute the net salary with `calc_salario_liquido` (IRS withholding tables for 2026 + 11% social security) and the employer's total cost with `calc_custo_trabalhador`.

*Exemplos · Examples: "/salario 1.800 € casado único titular 2 filhos", "/salario custo de contratar alguém a 1.500 €", "/salario net pay for 2.500 € single".*
