---
description: Defesa de contraordenação/multa — referência, prazo e minuta. Defence against an administrative fine — reference, deadline and draft.
argument-hint: "[tipo de coima]"
---

Ativa a skill `advogado-pt` para preparar a defesa da contraordenação/multa em $ARGUMENTS.

Lê a referência das multas (via tool MCP `ler_referencia` com `nome: multas`) e parte do template `defesa-contraordenacao` (via `obter_template`). Calcula o prazo de impugnação com `calc_prazo` (regra geral: 15 dias úteis) e destaca-o como PRAZO IMPORTANTE com a consequência do incumprimento.

**EN:** Activate the `advogado-pt` skill to prepare the defence against the administrative offence/fine in $ARGUMENTS. Read the fines reference (via the `ler_referencia` MCP tool with `nome: multas`) and start from the `defesa-contraordenacao` template (via `obter_template`). Compute the challenge deadline with `calc_prazo` (general rule: 15 business days) and highlight it as an IMPORTANT DEADLINE with the consequence of missing it.

*Exemplos · Examples: "levei uma coima da ASAE", "I got an ACT fine".*
