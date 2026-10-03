---
description: Recebi uma notificação das Finanças (AT) — prazos, meios de defesa e documentos. I got a tax authority (AT) notice — deadlines, remedies and documents.
argument-hint: "[tipo de notificação, data em que foi recebida e valor]"
---

Ativa a skill `advogado-pt` para a notificação da AT em $ARGUMENTS.

Segue o playbook `recebi-notificacao-at` (via tool MCP `obter_playbook` com `nome: recebi-notificacao-at`, ou lê `playbooks/recebi-notificacao-at.md`): identifica o tipo de notificação (audição prévia, projeto de relatório de inspeção, liquidação, citação em execução fiscal, coima) e a data em que se considera feita, e conta o prazo com `calc_prazo`. Para o enquadramento, lê a referência `contencioso-tributario` (via `ler_referencia` com `nome: contencioso-tributario`). Para documentos, usa os templates `reclamacao-graciosa`, `direito-audicao-previa`, `pedido-pagamento-prestacoes-at` ou `pedido-informacao-vinculativa` (via `obter_template`). Adapta ao perfil da empresa (`obter_perfil_empresa`) e lembra a responsabilidade subsidiária dos gerentes quando for uma sociedade.

**EN:** Activate the `advogado-pt` skill for the tax authority notice in $ARGUMENTS. Follow the `recebi-notificacao-at` playbook (via the `obter_playbook` MCP tool with `nome: recebi-notificacao-at`): identify the type of notice and when it is deemed served, and count the deadline with `calc_prazo`. Read the `contencioso-tributario` reference for the legal framework and use the `reclamacao-graciosa`, `direito-audicao-previa`, `pedido-pagamento-prestacoes-at` or `pedido-informacao-vinculativa` templates.

*Exemplos · Examples: "recebi uma liquidação adicional de IVA", "fui citado numa execução fiscal", "I got a VAT assessment from the tax office".*
