---
description: Lê uma referência jurídica por área. Reads a legal reference by practice area.
argument-hint: "[área, ex.: laboral]"
---

Ativa a skill `advogado-pt` e lê a referência da área indicada em $ARGUMENTS usando a tool MCP `ler_referencia` (`nome`: ex.: `laboral`, `cobrancas`, `rgpd`, `imobiliario`, `valores-2026`). Se não houver MCP, lê o ficheiro em `references/`.

Se a área não existir, lista as referências disponíveis. Resume o essencial para o caso e cita diplomas/artigos com rigor.
