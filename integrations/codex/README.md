# Codex CLI (OpenAI) — `juridico-pt-mcp`

Liga o servidor MCP `juridico-pt-mcp` ao **Codex CLI** da OpenAI. O Codex consome servidores
MCP por **stdio** diretamente, pelo que o `juridico-pt-mcp` funciona sem qualquer wrapper.

## Ficheiros

```text
codex/
├── config.snippet.toml   # Bloco [mcp_servers.juridico-pt] → vai para ~/.codex/config.toml
└── AGENTS.md             # Persona → contexto do agente (raiz do projeto)
```

## 1. Configurar o servidor MCP

O Codex CLI lê a configuração de **`~/.codex/config.toml`**:

| Sistema | Caminho |
|---|---|
| **Windows** | `%USERPROFILE%\.codex\config.toml` |
| **macOS / Linux** | `~/.codex/config.toml` |

Clona o repo: o servidor já vem compilado e autocontido em `mcp-server/dist/index.js`
(basta ter Node ≥ 18, sem `npm install` nem build). Depois cola o bloco de [`config.snippet.toml`](./config.snippet.toml), com o
caminho **absoluto** para `dist/index.js`:

```toml
[mcp_servers.juridico-pt]
command = "node"
args = ["/ABSOLUTE/PATH/TO/juridico-pt/mcp-server/dist/index.js"]
```

> Substitui `/ABSOLUTE/PATH/TO/juridico-pt` pelo caminho absoluto na tua máquina, ou corre
> `node cli/juridico-pt.mjs mcp-config codex` na raiz do repo para gerar o bloco com o
> caminho **absoluto** já preenchido.

Inicia o `codex` e confirma com `/mcp` que o servidor `juridico-pt` está ligado e que as
tools aparecem listadas.

## 2. Carregar a persona

Copia [`AGENTS.md`](./AGENTS.md) para a raiz do projeto. O Codex CLI lê o `AGENTS.md`
automaticamente como instruções do agente.
