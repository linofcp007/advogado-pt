# Instalar o Advogado PT em qualquer IA

O Advogado PT distribui-se por **dois canais**:

| Canal | Para quê | Onde |
|---|---|---|
| **A. Skill (.skill)** | Claude.ai, Claude Code, Claude Desktop (sistema de Skills) | `advogado-pt.skill` (gerar com `python build.py`) |
| **B. Servidor MCP** | Cursor, Windsurf, Codex, Gemini CLI, ChatGPT/OpenAI, Claude (via MCP) | `mcp-server/` (Node, build local — sem npm publish) |

O **MCP** é o que torna isto disponível em "todas as IAs": é um padrão aberto que Claude, OpenAI, Google e os editores (Cursor/Windsurf) já falam. Um único servidor serve todos.

---

## A. Skill para Claude

```bash
python build.py            # gera advogado-pt.skill
```
Carrega em **Claude → Settings → Skills**. (Claude Code: coloca a pasta em `~/.claude/skills/` ou usa o plugin — ver canal B.)

---

## B. Servidor MCP (universal)

### 1. Construir (uma vez)

Na raiz do repositório, um comando:

```bash
npm run setup             # instala + compila o servidor MCP + diagnóstico (doctor)
```

> Não há pacote npm publicado (por opção): o servidor corre localmente a partir de `mcp-server/dist/index.js`. Equivale a `cd mcp-server && npm install && npm run build`.

### 2. Ligar a cada plataforma

Config genérica — substitui pelo caminho absoluto da tua máquina, ou corre `node bin/advogado-pt.mjs mcp-config <host>` para o gerar:

```json
{ "mcpServers": { "advogado-pt": { "command": "node", "args": ["/CAMINHO/ABSOLUTO/advogado-pt/mcp-server/dist/index.js"] } } }
```

| Plataforma | Instruções | Persona |
|---|---|---|
| **Claude Code** (plugin) | `/plugin marketplace add linofcp007/advogado-pt` | prompt MCP `advogado_pt` |
| **Claude Desktop** | `integrations/claude-desktop/` | prompt MCP `advogado_pt` |
| **Cursor** | `integrations/cursor/` (`.cursor/mcp.json` + rule) | `.cursor/rules/advogado-pt.mdc` |
| **Windsurf** | `integrations/windsurf/` | `.windsurfrules` |
| **Gemini CLI** | `integrations/gemini-cli/` (`~/.gemini/settings.json`) | `GEMINI.md` |
| **Codex CLI** | `integrations/codex/` (`~/.codex/config.toml`) | `AGENTS.md` |
| **ChatGPT / OpenAI** | `integrations/chatgpt/` (Custom GPT ou conector MCP) | `custom-gpt-instructions.md` |

> **Persona**: clientes com suporte a *prompts* MCP (Claude) ativam-na com o prompt `advogado_pt`. Os restantes carregam o ficheiro de regras/instruções da respetiva pasta (mesma persona, formato nativo).

### 3. Verificar

```bash
cd mcp-server
node test/smoke-client.mjs   # liga via MCP e exercita tools/resources/prompt
```

---

## Notas

- **ChatGPT web** consome MCP via *connectors* (dev mode) mas precisa do servidor exposto por HTTP/remoto; **Codex** e **OpenAI Agents SDK** consomem o stdio diretamente. Em alternativa, o **Custom GPT** usa a persona + ficheiros de conhecimento (de `references/` e `assets/templates/`).
- Ao atualizar o conteúdo jurídico da skill, corre `cd mcp-server && npm run build` para re-empacotar o conteúdo no servidor.
- Tudo é **MIT** / uso pessoal; orientação informativa, não substitui advogado inscrito na OA.
