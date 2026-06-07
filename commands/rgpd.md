---
description: Questões de RGPD e violação de dados — referência, playbook e checklist. GDPR and data-breach matters — reference, playbook and checklist.
argument-hint: "[questão de RGPD ou incidente]"
---

Ativa a skill `advogado-pt` para a questão de RGPD em $ARGUMENTS.

Lê a referência `rgpd` (via tool MCP `ler_referencia` com `nome: rgpd`). Se for violação de dados, segue o playbook `data-breach` (via `obter_playbook`) — atenção ao prazo de 72h de notificação à CNPD. Verifica a conformidade com a `checklist-rgpd` (via `obter_checklist`). Para documentos, usa templates como `politica-privacidade`, `dpa-bilingue` ou `cookie-policy`.
