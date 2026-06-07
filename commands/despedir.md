---
description: Cessar contrato de trabalho — playbook e cálculo da compensação. End an employment contract — playbook and severance calculation.
argument-hint: "[modalidade, retribuição e antiguidade]"
---

Ativa a skill `advogado-pt` para a cessação de contrato em $ARGUMENTS.

Segue o playbook `quero-despedir` (via tool MCP `obter_playbook` com `nome: quero-despedir`, ou lê `playbooks/quero-despedir.md`): identifica a modalidade correta e os requisitos legais. Calcula a compensação com `calc_compensacao_despedimento` (`retribuicao_base`, `diuturnidades`, `anos`, `modalidade`). Para documentos, usa templates como `notificacao-resolucao-contrato`, `nota-de-culpa` ou `acordo-revogacao`.
