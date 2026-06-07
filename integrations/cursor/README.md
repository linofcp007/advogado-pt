# Cursor — `advogado-pt-mcp`

Liga o servidor MCP `advogado-pt-mcp` ao **Cursor** e adiciona a persona como regra.

## Ficheiros

```text
cursor/
├── mcp.json                  # Configuração MCP → vai para .cursor/mcp.json
└── rules/
    └── advogado-pt.mdc       # Regra com a persona → vai para .cursor/rules/
```

## 1. Configurar o servidor MCP

Clona o repo e compila o servidor **uma vez** (`npm install && npm run build` em
`mcp-server/`). Depois copia [`mcp.json`](./mcp.json) para uma destas localizações,
preenchendo o caminho **absoluto** para `dist/index.js`:

- **Por projeto**: `.cursor/mcp.json` na raiz do projeto.
- **Global (todos os projetos)**: `~/.cursor/mcp.json`
  (em Windows: `C:\Users\<utilizador>\.cursor\mcp.json`).

```json
{
  "mcpServers": {
    "advogado-pt": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/advogado-pt/mcp-server/dist/index.js"]
    }
  }
}
```

> Substitui `/ABSOLUTE/PATH/TO/advogado-pt` pelo caminho absoluto na tua máquina, ou corre
> `node bin/advogado-pt.mjs mcp-config cursor` na raiz do repo para gerar o bloco com o
> caminho **absoluto** já preenchido.

Depois vai a **Settings → Cursor Settings → MCP** e confirma que `advogado-pt` está
**ligado** (toggle verde). As tools ficam disponíveis no chat/Composer (modo Agent).

## 2. Instalar a regra (persona)

Copia [`rules/advogado-pt.mdc`](./rules/advogado-pt.mdc) para `.cursor/rules/` na raiz do
projeto. O frontmatter usa `alwaysApply: false` — a regra é aplicada por relevância
(descrição) ou quando a referencias explicitamente com `@advogado-pt`. Para a ter sempre
ativa, muda para `alwaysApply: true`.
