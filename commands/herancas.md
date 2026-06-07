---
description: Heranças e partilhas — referência, acordo de partilha e imposto do selo. Inheritance and estate division — reference, settlement deed and stamp duty.
argument-hint: "[situação da herança]"
---

Ativa a skill `advogado-pt` para a situação de herança em $ARGUMENTS.

Lê a referência `herancas` (via tool MCP `ler_referencia` com `nome: herancas`). Se houver elemento internacional (bens ou herdeiros no estrangeiro, Regulamento (UE) 650/2012), lê também `ler_referencia` com `nome: sucessorio-internacional`.

Para a partilha extrajudicial, usa o template `acordo-partilha-extrajudicial` (via `obter_template`). Estima o imposto do selo da transmissão com `calc_imposto_selo_heranca` (lembra que cônjuge, descendentes e ascendentes são isentos da quota de 10%; sobre imóveis acresce 0,8% do VPT).

**EN:** Activate the `advogado-pt` skill for the inheritance situation in $ARGUMENTS. Read the `herancas` reference (via the `ler_referencia` MCP tool with `nome: herancas`). If there is an international element (assets or heirs abroad, Regulation (EU) 650/2012), also read `ler_referencia` with `nome: sucessorio-internacional`. For an out-of-court estate division, use the `acordo-partilha-extrajudicial` template (via `obter_template`). Estimate the transfer stamp duty with `calc_imposto_selo_heranca` (note that spouse, descendants and ascendants are exempt from the 10% rate; an extra 0.8% of the VPT applies to real estate).
