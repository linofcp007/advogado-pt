# Avaliações do juridico-pt (`claude plugin eval`)

53 casos: golden (cálculos, fluxos, conteúdo e rigor, perfil), adversariais e de regressão (erros corrigidos na revisão de 3/10/2026). Plano, limiares e base em `.specs/juridico-pt-v2-0/eval-plan.md`.

Cada caso tem `prompt.md` e verificações determinísticas em `graders/` (regex sobre a resposta final ou sobre o trace, para confirmar a tool MCP chamada — `mcp__plugin_<plugin>_<servidor>__<tool>`). Não há graders com juiz: correr o conjunto não tem custo de juiz, só o das execuções do Claude.

Correr (custa uso do teu plano ou da tua API — define um teto):

```bash
claude plugin eval . --mocks off --allow-tools "mcp__plugin_juridico-pt_juridico-pt__*" --runs 1 --max-cost-usd 10 --json evals/results/ultima.json
```

Etiquetas: `golden`, `adversarial`, `regressao` (`--tag`).
