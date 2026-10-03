---
description: Ver ou atualizar o perfil da empresa (forma jurídica, setor, trabalhadores…) usado em todas as respostas. View or update the company profile used in every answer.
argument-hint: "[vazio para ver | dados a atualizar, ex.: 'somos uma Lda com 12 trabalhadores' | 'geral' para o perfil por defeito]"
---

Ativa a skill `advogado-pt` para o perfil da empresa: $ARGUMENTS.

1. Lê o perfil atual com a tool MCP `obter_perfil_empresa` — o do projeto (`.advogado-pt/perfil-empresa.md`) ou, na falta, o perfil geral (`~/.advogado-pt/perfil-empresa.md`) — e mostra-o de forma resumida, indicando a origem e se tem mais de 12 meses.
2. Se $ARGUMENTS trouxer dados novos, ou se não houver perfil, confirma com o utilizador os campos a gravar (forma jurídica, denominação, setor, trabalhadores, volume de negócios, regime de IVA, contabilidade, clientes, dados pessoais tratados, línguas, notas) e grava com `guardar_perfil_empresa`, com destino `projeto` (esta empresa/pasta) ou `geral` (empresa por defeito em todas as pastas) — pergunta qual, se não for claro.
3. Nunca gravar dados de outra entidade (cliente, fornecedor) nem dados pessoais de trabalhadores. No fim, indica o que muda nas respostas com o novo perfil (ex.: IRC em vez de IRS Cat. B, obrigações por n.º de trabalhadores).

**EN:** Activate the `advogado-pt` skill for the company profile: $ARGUMENTS. Read it with `obter_perfil_empresa` (project file first, then the global one), and save changes with `guardar_perfil_empresa` (destination `projeto` or `geral`) after confirming the fields with the user. Never store data about another entity.

*Exemplos · Examples: "/perfil", "/perfil passámos a Lda e temos 12 trabalhadores", "/perfil geral ENI de consultoria".*
