---
description: Abre um caso novo e recolhe os factos de forma estruturada. Opens a new case and collects the facts.
argument-hint: "[breve descrição do caso]"
---

Ativa a skill `advogado-pt` para abrir um caso novo a partir de $ARGUMENTS. Recolhe de forma estruturada PARTES, FACTOS (cronologia com datas), VALORES, DOCUMENTOS, PRAZOS e OBJETIVO, e monta uma cronologia inicial.

Usa o template `intake-caso` (via tool MCP `obter_template` com `nome: intake-caso`, ou lê `assets/templates/intake-caso.md`). Pergunta só o que faltar e sinaliza de imediato prazos de prescrição/caducidade/resposta.
