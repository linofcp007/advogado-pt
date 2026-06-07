---
description: Gera ou revê um contrato a partir de template e checklist. Drafts or reviews a contract from template and checklist.
argument-hint: "[tipo de contrato]"
---

Ativa a skill `advogado-pt` para gerar ou rever o contrato em $ARGUMENTS.

Parte do template aplicável via tool MCP `obter_template` (ex.: `contrato-prestacao-servicos-ti`, `nda-bilingue`, `contrato-promessa-compra-venda`; ou lê `assets/templates/`). Para revisão, aplica a `checklist-revisao-contrato` (via `obter_checklist` com `nome: checklist-revisao-contrato`). Substitui os `{{PLACEHOLDERS}}` pelos dados do caso e confirma partes, objeto, preço, rescisão, lei aplicável e foro.
