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

Clona o repo e compila o servidor **uma vez** (`npm install && npm run build` em
`mcp-server/`). Depois cola o bloco de [`config.snippet.toml`](./config.snippet.toml), com o
caminho **absoluto** para `dist/index.js`:

```toml
[mcp_servers.advogado-pt]
command = "node"
args = ["/ABSOLUTE/PATH/TO/advogado-pt/mcp-server/dist/index.js"]
```

> Substitui `/ABSOLUTE/PATH/TO/advogado-pt` pelo caminho absoluto na tua máquina, ou corre
> `node bin/advogado-pt.mjs mcp-config codex` na raiz do repo para gerar o bloco com o
> caminho **absoluto** já preenchido.

Inicia o `codex` e confirma com `/mcp` que o servidor `advogado-pt` está ligado e que as
tools aparecem listadas.

## 2. Carregar a persona

Copia [`AGENTS.md`](./AGENTS.md) para a raiz do projeto. O Codex CLI lê o `AGENTS.md`
automaticamente como instruções do agente.
