---
description: Cessar contrato de trabalho — playbook, compensação e créditos finais. End an employment contract — severance.
argument-hint: "[modalidade, retribuição e antiguidade]"
---

Ativa a skill `juridico-pt` para a cessação de contrato em $ARGUMENTS.

Segue o playbook `quero-despedir` (via tool MCP `obter_playbook` com `nome: quero-despedir`, ou lê `playbooks/quero-despedir.md`): identifica a modalidade correta e os requisitos legais. Calcula a compensação com `calc_compensacao_despedimento` (`retribuicao_base`, `diuturnidades`, `anos`, `modalidade`) e o acerto final (proporcionais de férias, subsídios de férias e de Natal, férias não gozadas) com `calc_creditos_laborais`. Para documentos, usa templates como `notificacao-resolucao-contrato`, `nota-de-culpa` ou `acordo-revogacao`.

**EN:** Activate the `juridico-pt` skill for the contract termination in $ARGUMENTS. Follow the `quero-despedir` playbook (via the `obter_playbook` MCP tool with `nome: quero-despedir`, or read `playbooks/quero-despedir.md`): identify the correct form of termination and the legal requirements. Compute the severance with `calc_compensacao_despedimento` (`retribuicao_base`, `diuturnidades`, `anos`, `modalidade`) and the final pay (pro-rata holiday, holiday and Christmas allowances, untaken leave) with `calc_creditos_laborais`. For documents, use templates such as `notificacao-resolucao-contrato`, `nota-de-culpa` or `acordo-revogacao`.

*Exemplos · Examples: "quanto custa despedir um trabalhador com 4 anos", "severance for a 4-year employee".*
