---
description: Comprar imóvel — playbook, due diligence e cálculo do IMT. Buying property — playbook, due diligence and IMT calculation.
argument-hint: "[valor do imóvel e tipo]"
---

Ativa a skill `advogado-pt` para a compra de imóvel em $ARGUMENTS.

Segue o playbook `comprar-imovel` (via tool MCP `obter_playbook` com `nome: comprar-imovel`, ou lê `playbooks/comprar-imovel.md`) e verifica a `checklist-due-diligence-imovel` (via `obter_checklist`). Calcula o IMT e o Imposto do Selo com `calc_imt`. Para a promessa, parte do template `contrato-promessa-compra-venda` (via `obter_template`).
