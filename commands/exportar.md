---
description: Exporta um documento para Word (.docx). Export a document to Word (.docx).
argument-hint: "[documento ou template] [nome do ficheiro]"
---

Exporta para `.docx` o documento em $ARGUMENTS com a tool MCP `exportar_documento`:

- documento já preparado nesta conversa (carta, contrato, minuta) → `conteudo` com o texto em Markdown, já preenchido;
- template tal como está → `template` com o nome (vê `listar_templates`).

O ficheiro fica em `.juridico-pt/exportados/<nome>.docx`, com títulos, listas, tabelas e negrito, sem os comentários nem a secção "Antes de enviar — verificar". Antes de exportar, confirma que não ficaram campos `{{...}}` nem `[VERIFICAR]` por preencher e lembra ao utilizador os itens dessa lista. Sem MCP: `node "${CLAUDE_PLUGIN_ROOT}/cli/juridico-pt.mjs" exportar --nome <nome> --ficheiro <documento.md>`.

**EN:** Export the document in $ARGUMENTS to `.docx` with the `exportar_documento` MCP tool (`conteudo` = filled-in Markdown, or `template` = template name). The file goes to `.juridico-pt/exportados/<name>.docx`; check for unfilled `{{...}}` fields first.

*Exemplos · Examples: "/exportar a carta de cobrança como carta-cliente-x", "/exportar nda-bilingue".*
