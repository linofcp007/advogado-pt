---
description: Arrendamento — referência, contrato habitacional e atualização de renda. Tenancy — reference, residential lease and rent-update letter.
argument-hint: "[questão de arrendamento]"
---

Ativa a skill `advogado-pt` para a questão de arrendamento em $ARGUMENTS.

Lê a referência `arrendamento` (via tool MCP `ler_referencia` com `nome: arrendamento`) — regime do NRAU, prazos, denúncia, oposição à renovação e despejo. Para documentos, usa `obter_template` com o template `contrato-arrendamento-habitacional` (novo contrato) ou `carta-atualizacao-renda` (atualização anual de renda pelo coeficiente do IHRU).

**EN:** Activate the `advogado-pt` skill for the tenancy matter in $ARGUMENTS. Read the `arrendamento` reference (via the `ler_referencia` MCP tool with `nome: arrendamento`) — NRAU regime, deadlines, termination, opposition to renewal and eviction. For documents, use `obter_template` with the `contrato-arrendamento-habitacional` template (new lease) or `carta-atualizacao-renda` (annual rent update by the IHRU coefficient).

*Exemplos · Examples: "o senhorio quer aumentar a renda", "landlord wants to raise the rent".*
