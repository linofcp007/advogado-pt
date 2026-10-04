# Roadmap — advogado-pt

<!-- AUTO-GERADO por dev-spec — não editar à mão. -->

**Progresso: 100%** ▰▰▰▰▰▰▰▰▰▰ · 3/4 features completas · 136/137 tasks feitas

_Velocidade: 341 ponto(s)/dia útil — 136 tarefa(s), 341 ponto(s) concluídos desde 2026-10-03 (últimos 28 dias)_

Legenda: ✅ feito · 🟡 em curso · ⛔ bloqueada · 📋 planeada · ⬜ por começar

## ▶ A seguir
- **juridico-pt-v2-0** (core +tdd +ai +privacy) — próxima #38 Push, renomear o repositório no GitHub par

## Features

| | Feature | Tracks | Fase | % | Tasks | Deps | Próxima | Previsão |
|---|---|---|---|---|---|---|---|---|
| ✅ | [advogado-pt-v1-1-empresas](./advogado-pt-v1-1-empresas/requirements.md) | core +tdd | concluída | 100% | 28/28 | — | — | — |
| ✅ | [advogado-pt-v1-2-1-correcoes](./advogado-pt-v1-2-1-correcoes/requirements.md) | core +tdd +sec | concluída | 100% | 41/41 | advogado-pt-v1-2-operacional ✓, advogado-pt-v1-1-empresas ✓ | — | — |
| ✅ | [advogado-pt-v1-2-operacional](./advogado-pt-v1-2-operacional/requirements.md) | core +tdd | concluída | 100% | 30/30 | advogado-pt-v1-1-empresas ✓ | — | — |
| 🟡 | [juridico-pt-v2-0](./juridico-pt-v2-0/requirements.md) | core +tdd +ai +privacy | em execução | 98% | 37/38 | advogado-pt-v1-2-1-correcoes ✓ | #38 Push, renomear o repositório no GitHub par | 2026-10-05 |

Previsão = pontos por fazer ÷ velocidade, em dias úteis (±25%) · `_Size: XS|S|M|L|XL_` numa tarefa = 1/2/3/5/8 pontos; uma tarefa sem tamanho conta como a mediana da sua feature (senão M) · uma feature à espera de uma dependência começa depois da previsão dessa.

## Dependências

```mermaid
graph LR
  advogado_pt_v1_2_operacional["advogado-pt-v1-2-operacional"] --> advogado_pt_v1_2_1_correcoes["advogado-pt-v1-2-1-correcoes"]
  advogado_pt_v1_1_empresas["advogado-pt-v1-1-empresas"] --> advogado_pt_v1_2_1_correcoes["advogado-pt-v1-2-1-correcoes"]
  advogado_pt_v1_1_empresas["advogado-pt-v1-1-empresas"] --> advogado_pt_v1_2_operacional["advogado-pt-v1-2-operacional"]
  advogado_pt_v1_2_1_correcoes["advogado-pt-v1-2-1-correcoes"] --> juridico_pt_v2_0["juridico-pt-v2-0"]
```

## ⚠ Precisa de atenção

- **juridico-pt-v2-0** — alterado desde a aprovação — rever de novo: eval-plan.md

## Backlog (planeadas, ainda sem spec)

_(vazio)_
