# Codex CLI (OpenAI) — `advogado-pt-mcp`

Liga o servidor MCP `advogado-pt-mcp` ao **Codex CLI** da OpenAI. O Codex consome servidores
MCP por **stdio** diretamente, pelo que o `advogado-pt-mcp` funciona sem qualquer wrapper.

## Ficheiros

```text
codex/
├── config.snippet.toml   # Bloco [mcp_servers.advogado-pt] → vai para ~/.codex/config.toml
└── AGENTS.md             # Persona → contexto do agente (raiz do projeto)
```

## 1. Configurar o servidor MCP

O Codex CLI lê a configuração de **`~/.codex/config.toml`**:

| Sistema | Caminho |
|---|---|
| **Windows** | `%USERPROFILE%\.codex\config.toml` |
| **macOS / Linux** | `~/.codex/config.toml` |

Cola o bloco de [`config.snippet.toml`](./config.snippet.toml):

```toml
[mcp_servers.advogado-pt]
command = "npx"
args = ["-y", "advogado-pt-mcp"]
```

Inicia o `codex` e confirma com `/mcp` que o servidor `advogado-pt` está ligado e que as
tools aparecem listadas.

## 2. Carregar a persona

Copia [`AGENTS.md`](./AGENTS.md) para a raiz do projeto. O Codex CLI lê o `AGENTS.md`
automaticamente como instruções do agente.

## Modo local (desenvolvimento)

Compila o servidor (`npm install && npm run build` em `mcp-server/`) e usa esta variante no
`config.toml` (caminho **absoluto** para `dist/index.js`):

```toml
[mcp_servers.advogado-pt]
command = "node"
args = ["C:/Users/Administrator/Desktop/CLAUDE SKILLS/advogado-pt/mcp-server/dist/index.js"]
```
