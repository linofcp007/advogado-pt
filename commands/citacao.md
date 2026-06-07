---
description: Recebi citação/injunção/carta do tribunal — playbook e prazo. Received a court summons/injunction — playbook and deadline.
argument-hint: "[tipo de carta e data de receção]"
---

Ativa a skill `advogado-pt` para a notificação recebida descrita em $ARGUMENTS.

Segue o playbook `recebi-citacao-ou-injuncao` (via tool MCP `obter_playbook` com `nome: recebi-citacao-ou-injuncao`, ou lê `playbooks/recebi-citacao-ou-injuncao.md`). Calcula o prazo de resposta a partir da data de receção com `calc_prazo` e destaca-o como PRAZO IMPORTANTE com a consequência do incumprimento (revelia/oposição). Recomenda advogado da OA se houver prazo judicial a correr.

**EN:** Activate the `advogado-pt` skill for the notice received described in $ARGUMENTS. Follow the `recebi-citacao-ou-injuncao` playbook (via the `obter_playbook` MCP tool with `nome: recebi-citacao-ou-injuncao`, or read `playbooks/recebi-citacao-ou-injuncao.md`). Compute the response deadline from the receipt date with `calc_prazo` and highlight it as an IMPORTANT DEADLINE with the consequence of missing it (default judgment/opposition). Recommend a Bar-registered lawyer if a judicial deadline is running.
