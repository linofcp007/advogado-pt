---
description: Cliente não paga — playbook de cobrança, juros e cartas. Client not paying — debt-collection playbook, interest and letters.
argument-hint: "[valor / cliente / nº fatura]"
---

Ativa a skill `juridico-pt` e segue o playbook `cliente-nao-paga` (via tool MCP `obter_playbook` com `nome: cliente-nao-paga`, ou lê `playbooks/cliente-nao-paga.md`) para a dívida em $ARGUMENTS.

1. **Faturas em dívida**: se houver um conector de faturação ligado (ex.: o programa de faturação ou o ERP do utilizador, como servidor MCP), usa-o para obter as faturas em aberto do cliente (número, data, vencimento, valor) e confirma-as com o utilizador; sem conector, pede a lista ou o extrato de conta corrente.
2. **Juros**: uma fatura → `calc_juros_mora`; várias → `calc_juros_lote` (juros por fatura, 40 € por fatura comercial vencida e totais por cliente).
3. **Cartas**: percorre a árvore de decisão e gera as cartas a partir dos templates (`carta-cobranca-amigavel`, `carta-cobranca-formal-registada`, `carta-cobranca-varias-faturas`, `carta-interpelacao-incumprimento`, `requerimento-injuncao`) via `obter_template`; a taxa de injunção vem de `calc_custas_injuncao`.
4. **Prazo**: quando a carta der um prazo ao devedor (ou houver uma prescrição a correr — `calc_prescricao`), propõe registá-lo com `registar_prazo` para o aviso ao abrir a sessão.

**EN:** Activate the `juridico-pt` skill and follow the `cliente-nao-paga` playbook for the debt in $ARGUMENTS. If an invoicing connector (MCP) is available, use it to fetch the client's open invoices and confirm them with the user; otherwise ask for the list. Use `calc_juros_mora` for one invoice or `calc_juros_lote` for several, draft the letters with `obter_template` (including `carta-cobranca-varias-faturas`), and offer `registar_prazo` for the deadline given to the debtor.

*Exemplos · Examples: "o cliente X não me pagou a fatura 123", "client hasn't paid invoices 123 and 124".*
