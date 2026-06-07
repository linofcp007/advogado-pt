---
description: Gera ou revê um contrato a partir de template e checklist. Drafts or reviews a contract from template and checklist.
argument-hint: "[tipo de contrato]"
---

Ativa a skill `advogado-pt` para gerar ou rever o contrato em $ARGUMENTS.

Parte do template aplicável via tool MCP `obter_template` (ex.: `contrato-prestacao-servicos-ti`, `nda-bilingue`, `contrato-promessa-compra-venda`; ou lê `assets/templates/`). Para revisão, aplica a `checklist-revisao-contrato` (via `obter_checklist` com `nome: checklist-revisao-contrato`). Substitui os `{{PLACEHOLDERS}}` pelos dados do caso e confirma partes, objeto, preço, rescisão, lei aplicável e foro.

**EN:** Activate the `advogado-pt` skill to draft or review the contract in $ARGUMENTS. Start from the applicable template via the `obter_template` MCP tool (e.g. `contrato-prestacao-servicos-ti`, `nda-bilingue`, `contrato-promessa-compra-venda`; or read `assets/templates/`). For a review, apply the `checklist-revisao-contrato` (via `obter_checklist` with `nome: checklist-revisao-contrato`). Replace the `{{PLACEHOLDERS}}` with the case data and confirm parties, subject matter, price, termination, governing law and jurisdiction.

*Exemplos · Examples: "preciso de um NDA para um freelancer", "I need a services agreement".*
