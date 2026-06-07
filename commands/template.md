---
description: Obtém um template de documento jurídico pelo nome. Fetches a legal document template by name.
argument-hint: "[nome do template, ex.: nda-bilingue]"
---

Ativa a skill `advogado-pt` e obtém o template indicado em $ARGUMENTS usando a tool MCP `obter_template` (`nome`: ex.: `requerimento-injuncao`, `nda-bilingue`, `contrato-promessa-compra-venda`). Se não houver MCP, lê o ficheiro em `assets/templates/`.

Se o nome não existir, lista os templates disponíveis. Substitui os `{{PLACEHOLDERS}}` pelos dados do caso e remove os comentários `<!-- ... -->`.

**EN:** Activate the `advogado-pt` skill and fetch the template named in $ARGUMENTS using the `obter_template` MCP tool (`nome`: e.g. `requerimento-injuncao`, `nda-bilingue`, `contrato-promessa-compra-venda`). If no MCP is available, read the file in `assets/templates/`. If the name does not exist, list the available templates. Replace the `{{PLACEHOLDERS}}` with the case data and remove the `<!-- ... -->` comments.
