---
description: Arrendamento — referência, contrato habitacional e atualização de renda. Tenancy — reference, residential lease and rent-update letter.
argument-hint: "[questão de arrendamento]"
---

Ativa a skill `advogado-pt` para a questão de arrendamento em $ARGUMENTS.

Lê a referência `arrendamento` (via tool MCP `ler_referencia` com `nome: arrendamento`) — regime do NRAU, prazos, denúncia, oposição à renovação e despejo. Para documentos, usa `obter_template` com o template `contrato-arrendamento-habitacional` (novo contrato) ou `carta-atualizacao-renda` (atualização anual de renda pelo coeficiente do IHRU).
