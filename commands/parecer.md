---
description: Produz um parecer jurídico estruturado sobre a situação. Produces a structured legal opinion on the situation.
argument-hint: "[descrição da situação]"
---

Ativa a skill `advogado-pt`. Produz um parecer jurídico estruturado sobre a situação em $ARGUMENTS, seguindo o formato de parecer do `SKILL.md` (SITUAÇÃO · ENQUADRAMENTO · POSIÇÃO · OPÇÕES · RECOMENDAÇÃO · PRAZOS).

Parte do template `parecer-juridico` (via tool MCP `obter_template` com `nome: parecer-juridico`, ou lê `assets/templates/parecer-juridico.md`). Cita diplomas/artigos com rigor e sinaliza o nível de confiança quando a citação for determinante.

**EN:** Activate the `advogado-pt` skill. Produce a structured legal opinion on the situation in $ARGUMENTS, following the opinion format in `SKILL.md` (SITUATION · FRAMEWORK · POSITION · OPTIONS · RECOMMENDATION · DEADLINES). Start from the `parecer-juridico` template (via the `obter_template` MCP tool with `nome: parecer-juridico`, or read `assets/templates/parecer-juridico.md`). Cite statutes/articles precisely and flag the confidence level when a citation is decisive.
