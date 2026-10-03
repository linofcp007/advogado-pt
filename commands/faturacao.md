---
description: Faturas e fatura eletrónica em 2027 (PDF, ATCUD, QR, selo qualificado). Invoicing and 2027 e-invoicing rules (PDF, qualified seal).
argument-hint: "[dúvida sobre faturas / 'PDF 2027' / 'contratos públicos' / 'checklist']"
---

Ativa a skill `juridico-pt` para a questão de faturação em $ARGUMENTS.

Lê a referência `faturacao` (via tool MCP `ler_referencia` com `nome: faturacao`, ou `references/faturacao.md`). Se a questão for a passagem a 1/1/2027 (faturas em PDF, selo ou assinatura eletrónica qualificada, faturas recebidas de fornecedores, contratos públicos com CIUS-PT), segue o playbook `faturacao-eletronica-2027` (via `obter_playbook` com `nome: faturacao-eletronica-2027`, ou `playbooks/faturacao-eletronica-2027.md`). Para auditar a faturação, percorre a checklist `checklist-faturacao` (via `obter_checklist` com `nome: checklist-faturacao`, ou `assets/checklists/checklist-faturacao.md`). Adapta ao perfil da empresa (`obter_perfil_empresa`): como emite as faturas e que clientes tem. Para dúvidas de enquadramento a levar à AT, usa o template `pedido-informacao-vinculativa` (via `obter_template` com `nome: pedido-informacao-vinculativa`).

Oferece registar as datas relevantes com `registar_prazo`: 31/12/2026 (fim das faturas em PDF sem assinatura qualificada), 1/1/2027 (CIUS-PT para PME nos contratos públicos), a comunicação mensal à AT até ao dia 5 e a renovação do certificado qualificado.

**EN:** Activate the `juridico-pt` skill for the invoicing question in $ARGUMENTS. Read the `faturacao` reference (via the `ler_referencia` MCP tool with `nome: faturacao`). For the 1 January 2027 change (PDF invoices, qualified electronic seal or signature, supplier invoices, CIUS-PT in public contracts), follow the `faturacao-eletronica-2027` playbook (via `obter_playbook` with `nome: faturacao-eletronica-2027`). To audit invoicing, go through the `checklist-faturacao` checklist (via `obter_checklist` with `nome: checklist-faturacao`). Offer to record the key dates with `registar_prazo`.

*Exemplos · Examples: "as minhas faturas em PDF valem em 2027?", "preciso de selo eletrónico qualificado?", "do my PDF invoices still count in 2027?".*
