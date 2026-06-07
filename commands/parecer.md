---
description: Produz um parecer jurídico estruturado sobre a situação. Produces a structured legal opinion on the situation.
argument-hint: "[descrição da situação]"
---

Ativa a skill `advogado-pt`. Produz um parecer jurídico estruturado sobre a situação em $ARGUMENTS, seguindo o formato de parecer do `SKILL.md` (SITUAÇÃO · ENQUADRAMENTO · POSIÇÃO · OPÇÕES · RECOMENDAÇÃO · PRAZOS).

Parte do template `parecer-juridico` (via tool MCP `obter_template` com `nome: parecer-juridico`, ou lê `assets/templates/parecer-juridico.md`). Cita diplomas/artigos com rigor e sinaliza o nível de confiança quando a citação for determinante.
