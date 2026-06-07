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

Copia [`mcp.json`](./mcp.json) para uma destas localizações:

- **Por projeto**: `.cursor/mcp.json` na raiz do projeto.
- **Global (todos os projetos)**: `~/.cursor/mcp.json`
  (em Windows: `C:\Users\<utilizador>\.cursor\mcp.json`).

```json
{
  "mcpServers": {
    "advogado-pt": {
      "command": "npx",
      "args": ["-y", "advogado-pt-mcp"]
    }
  }
}
```

Depois vai a **Settings → Cursor Settings → MCP** e confirma que `advogado-pt` está
**ligado** (toggle verde). As tools ficam disponíveis no chat/Composer (modo Agent).

## 2. Instalar a regra (persona)

Copia [`rules/advogado-pt.mdc`](./rules/advogado-pt.mdc) para `.cursor/rules/` na raiz do
projeto. O frontmatter usa `alwaysApply: false` — a regra é aplicada por relevância
(descrição) ou quando a referencias explicitamente com `@advogado-pt`. Para a ter sempre
ativa, muda para `alwaysApply: true`.

## Modo local (desenvolvimento)

Compila o servidor (`npm install && npm run build` em `mcp-server/`) e usa esta variante em
`.cursor/mcp.json` (caminho **absoluto** para `dist/index.js`):

```json
{
  "mcpServers": {
    "advogado-pt": {
      "command": "node",
      "args": ["C:/Users/Administrator/Desktop/CLAUDE SKILLS/advogado-pt/mcp-server/dist/index.js"]
    }
  }
}
```
