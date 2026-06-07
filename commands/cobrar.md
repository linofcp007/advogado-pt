---
description: Cliente não paga — segue o playbook de cobrança e gera as cartas. Client not paying — runs the debt-collection playbook and drafts letters.
argument-hint: "[valor / cliente / nº fatura]"
---

Ativa a skill `advogado-pt` e segue o playbook `cliente-nao-paga` (via tool MCP `obter_playbook` com `nome: cliente-nao-paga`, ou lê `playbooks/cliente-nao-paga.md`) para a dívida em $ARGUMENTS.

Percorre a árvore de decisão e gera as cartas adequadas a partir dos templates (`carta-cobranca-amigavel`, `carta-cobranca-formal-registada`, `carta-interpelacao-incumprimento`, `requerimento-injuncao`) via `obter_template`. Calcula juros de mora com `calc_juros_mora` e, se aplicável, a taxa de injunção com `calc_custas_injuncao`.
