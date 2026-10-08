# Cursor — `juridico-pt-mcp`

Liga o servidor MCP `juridico-pt-mcp` ao **Cursor** e adiciona a persona como regra.

## Ficheiros

```text
cursor/
├── mcp.json                  # Configuração MCP → vai para .cursor/mcp.json
└── rules/
    └── juridico-pt.mdc       # Regra com a persona → vai para .cursor/rules/
```

## 1. Configurar o servidor MCP

Clona o repo: o servidor já vem compilado e autocontido em `mcp-server/dist/index.js`
(basta ter Node ≥ 18, sem `npm install` nem build). Depois copia [`mcp.json`](./mcp.json) para uma destas localizações,
preenchendo o caminho **absoluto** para `dist/index.js`:

- **Por projeto**: `.cursor/mcp.json` na raiz do projeto.
- **Global (todos os projetos)**: `~/.cursor/mcp.json`
  (em Windows: `C:\Users\<utilizador>\.cursor\mcp.json`).

```json
{
  "mcpServers": {
    "juridico-pt": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/juridico-pt/mcp-server/dist/index.js"]
    }
  }
}
```

> Substitui `/ABSOLUTE/PATH/TO/juridico-pt` pelo caminho absoluto na tua máquina, ou corre
> `node cli/juridico-pt.mjs mcp-config cursor` na raiz do repo para gerar o bloco com o
> caminho **absoluto** já preenchido.

Depois vai a **Settings → Cursor Settings → MCP** e confirma que `juridico-pt` está
**ligado** (toggle verde). As tools ficam disponíveis no chat/Composer (modo Agent).

## 2. Instalar a regra (persona)

Copia [`rules/juridico-pt.mdc`](./rules/juridico-pt.mdc) para `.cursor/rules/` na raiz do
projeto. O frontmatter usa `alwaysApply: false` — a regra é aplicada por relevância
(descrição) ou quando a referencias explicitamente com `@juridico-pt`. Para a ter sempre
ativa, muda para `alwaysApply: true`.
