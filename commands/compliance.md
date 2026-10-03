---
description: Cumprimento obrigatório por dimensão da empresa — RGPC e plano anticorrupção, canal de denúncias, SST, regulamento interno. Mandatory compliance by company size — anti-corruption plan, whistleblowing channel, health and safety.
argument-hint: "[n.º de trabalhadores, forma jurídica e setor | documento pretendido, ex.: 'PPR' ou 'canal de denúncias']"
---

Ativa a skill `juridico-pt` para o cumprimento normativo: $ARGUMENTS.

1. Lê o perfil (`obter_perfil_empresa`): forma jurídica, n.º de trabalhadores e setor determinam as obrigações. Se faltarem, pergunta-os.
2. Percorre a checklist `checklist-compliance-dimensao` (via `obter_checklist`) e explica, escalão a escalão, o que se aplica, com base na referência `compliance` (via `ler_referencia` com `nome: compliance`): RGPC (DL 109-E/2021) e Plano de Prevenção de Riscos de Corrupção a partir de 50 trabalhadores, canal de denúncias (Lei 93/2021), SST (`checklist-seguranca-saude-trabalho`), código de conduta contra o assédio, regulamento interno, igualdade salarial e quotas.
3. Para os documentos, parte dos templates `plano-prevencao-riscos-corrupcao`, `regulamento-canal-denuncias`, `regulamento-interno`, `politica-prevencao-assedio`, `politica-uso-ia`, `politica-videovigilancia` ou `politica-monitorizacao-trabalhadores` (via `obter_template`).
4. As datas periódicas (relatório anual do PPR em abril, intercalar em outubro) aparecem no `calendario_obrigacoes`. Indica as coimas a partir de `valores-2026` e quando chamar advogado.

**EN:** Activate the `juridico-pt` skill for mandatory compliance: $ARGUMENTS. Read the profile, walk through the `checklist-compliance-dimensao` checklist and the `compliance` reference (anti-corruption plan for 50+ employees, whistleblowing channel, health and safety), and draft the documents from the matching templates.

*Exemplos · Examples: "/compliance temos 60 trabalhadores", "/compliance preciso do canal de denúncias", "/compliance what applies to a 250-employee company".*
