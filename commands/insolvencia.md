---
description: Devedor em insolvência ou PER — reclamar créditos a tempo. Debtor insolvent or restructuring — file your claim.
argument-hint: "[nome do devedor, tipo de processo e data da sentença/despacho]"
---

Ativa a skill `juridico-pt` para o crédito sobre o devedor insolvente em $ARGUMENTS.

Segue o playbook `cliente-insolvente` (via tool MCP `obter_playbook` com `nome: cliente-insolvente`, ou lê `playbooks/cliente-insolvente.md`): identifica o processo (insolvência, PER, PEAP), o prazo para reclamar créditos (fixado na sentença ou contado da publicação do despacho) e conta-o com `calc_prazo`. Calcula os juros até à data da declaração com `calc_juros_mora`. Para o documento, usa o template `reclamacao-creditos-insolvencia` (via `obter_template`). Para o enquadramento, lê `ler_referencia` com `nome: insolvencia`.

**EN:** Activate the `juridico-pt` skill for the claim against the insolvent debtor in $ARGUMENTS. Follow the `cliente-insolvente` playbook (via the `obter_playbook` MCP tool with `nome: cliente-insolvente`): identify the proceedings, the claim deadline (count it with `calc_prazo`), compute interest with `calc_juros_mora` and draft the claim with the `reclamacao-creditos-insolvencia` template.

*Exemplos · Examples: "um cliente que me deve 12.000 € entrou em PER", "my customer was declared insolvent".*
