---
description: Recebi citação/injunção/carta do tribunal — playbook e prazo. Received a court summons/injunction — playbook and deadline.
argument-hint: "[tipo de carta e data de receção]"
---

Ativa a skill `advogado-pt` para a notificação recebida descrita em $ARGUMENTS.

Segue o playbook `recebi-citacao-ou-injuncao` (via tool MCP `obter_playbook` com `nome: recebi-citacao-ou-injuncao`, ou lê `playbooks/recebi-citacao-ou-injuncao.md`). Calcula o prazo de resposta a partir da data de receção com `calc_prazo` e destaca-o como PRAZO IMPORTANTE com a consequência do incumprimento (revelia/oposição). Recomenda advogado da OA se houver prazo judicial a correr.
