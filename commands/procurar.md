---
description: Procura um termo em todo o conteúdo jurídico (referências, templates, playbooks, checklists). Searches a term across all legal content.
argument-hint: "[termo]"
---

Ativa a skill `advogado-pt` e procura o termo em $ARGUMENTS em todo o conteúdo jurídico usando a tool MCP `procurar_conteudo` (`query`). Se não houver MCP, procura nos ficheiros de `references/`, `assets/templates/`, `playbooks/` e `assets/checklists/`.

Apresenta os resultados por categoria e ficheiro, com os trechos correspondentes, e sugere a referência/template/playbook mais relevante.
