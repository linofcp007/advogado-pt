# Evals

Harness de avaliação local, funciona offline. Corre a partir da raiz do projeto:

```
node <plugin>/mcp/evals/run-evals.js <slug-da-feature>
```

- Usa o teu próprio `ANTHROPIC_API_KEY` (env). Sem CI, sem terceiros além do teu fornecedor de modelo.
- Sem chave de API (ou com `--dry-run`) valida os conjuntos e imprime o plano sem chamar um modelo.
- `--set-baseline` regista as pontuações atuais como baseline para comparar com execuções futuras.

Ficheiros de conjunto: `golden.json`, `adversarial.json`, opcional `regression.json`.
Formato de item: `{ id, input, expect: { type, value|rubric } }`. Tipos de grader: contains | equals | regex | refuse | judge.
O system prompt é lido do `../prompts/vN.md` mais recente (a sua secção `## System`).
