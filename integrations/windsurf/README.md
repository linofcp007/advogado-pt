# Windsurf — `advogado-pt-mcp`

Liga o servidor MCP `advogado-pt-mcp` ao **Windsurf** (Cascade) e adiciona a persona como
regras do espaço de trabalho.

## Ficheiros

```text
windsurf/
├── mcp_config.json     # Configuração MCP → vai para ~/.codeium/windsurf/mcp_config.json
└── .windsurfrules      # Persona → vai para a raiz do projeto
```

## 1. Configurar o servidor MCP

Copia o conteúdo de [`mcp_config.json`](./mcp_config.json) para o ficheiro de configuração
MCP do Windsurf:

| Sistema | Caminho |
|---|---|
| **Windows** | `%USERPROFILE%\.codeium\windsurf\mcp_config.json` |
| **macOS / Linux** | `~/.codeium/windsurf/mcp_config.json` |

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

Em alternativa, abre o painel do **Cascade → MCP servers → Configure** (ícone do martelo) e
cola o bloco. Carrega em **Refresh** para o Windsurf detetar as novas tools.

## 2. Instalar as regras (persona)

Copia [`.windsurfrules`](./.windsurfrules) para a **raiz do projeto**. O Cascade carrega
estas regras automaticamente como contexto persistente do espaço de trabalho.

## Modo local (desenvolvimento)

Compila o servidor (`npm install && npm run build` em `mcp-server/`) e usa esta variante no
`mcp_config.json` (caminho **absoluto** para `dist/index.js`):

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
