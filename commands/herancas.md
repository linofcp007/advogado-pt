---
description: Heranças e partilhas — referência, acordo de partilha e imposto do selo. Inheritance and estate division — reference, settlement deed and stamp duty.
argument-hint: "[situação da herança]"
---

Ativa a skill `advogado-pt` para a situação de herança em $ARGUMENTS.

Lê a referência `herancas` (via tool MCP `ler_referencia` com `nome: herancas`). Se houver elemento internacional (bens ou herdeiros no estrangeiro, Regulamento (UE) 650/2012), lê também `ler_referencia` com `nome: sucessorio-internacional`.

Para a partilha extrajudicial, usa o template `acordo-partilha-extrajudicial` (via `obter_template`). Estima o imposto do selo da transmissão com `calc_imposto_selo_heranca` (lembra que cônjuge, descendentes e ascendentes são isentos da quota de 10%; sobre imóveis acresce 0,8% do VPT).
