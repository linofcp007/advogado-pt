# Instalar o Jurídico PT em qualquer IA

O Jurídico PT distribui-se por **dois canais**:

| Canal | Para quê | Onde |
|---|---|---|
| **A. Skill (.skill)** | Claude.ai, Claude Code, Claude Desktop (sistema de Skills) | `juridico-pt.skill` (gerar com `python build.py`) |
| **B. Servidor MCP** | Cursor, Windsurf, Codex, Gemini CLI, ChatGPT/OpenAI, Claude (via MCP) | `mcp-server/` (Node, build local — sem npm publish) |

O **MCP** é o que torna isto disponível em "todas as IAs": é um padrão aberto que Claude, OpenAI, Google e os editores (Cursor/Windsurf) já falam. Um único servidor serve todos.

---

## A. Skill para Claude

```bash
python build.py            # gera juridico-pt.skill
```
Carrega em **Claude → Settings → Skills**. (Claude Code: coloca a pasta em `~/.claude/skills/` ou usa o plugin — ver canal B.)

---

## B. Servidor MCP (universal)

### 1. Obter o servidor

O servidor vem já compilado e autocontido no repositório (`mcp-server/dist/index.js`): basta clonar e ter **Node ≥ 18** — não é preciso instalar dependências nem compilar.

> Não há pacote npm publicado (por opção). Só para **desenvolver** o plugin: `npm run setup` na raiz (instala as dependências, compila o servidor e corre o diagnóstico).

### 2. Ligar a cada plataforma

Config genérica — substitui pelo caminho absoluto da tua máquina, ou corre `node cli/juridico-pt.mjs mcp-config <host>` para o gerar:

```json
{ "mcpServers": { "juridico-pt": { "command": "node", "args": ["/CAMINHO/ABSOLUTO/juridico-pt/mcp-server/dist/index.js"] } } }
```

| Plataforma | Instruções | Persona |
|---|---|---|
| **Claude Code** (plugin) | `/plugin marketplace add linofcp007/juridico-pt` | prompt MCP `assistente_juridico` |
| **Claude Desktop** | `integrations/claude-desktop/` | prompt MCP `assistente_juridico` |
| **Cursor** | `integrations/cursor/` (`.cursor/mcp.json` + rule) | `.cursor/rules/juridico-pt.mdc` |
| **Windsurf** | `integrations/windsurf/` | `.windsurfrules` |
| **Gemini CLI** | `integrations/gemini-cli/` (`~/.gemini/settings.json`) | `GEMINI.md` |
| **Codex CLI** | `integrations/codex/` (`~/.codex/config.toml`) | `AGENTS.md` |
| **ChatGPT / OpenAI** | `integrations/chatgpt/` (Custom GPT ou conector MCP) | `custom-gpt-instructions.md` |

> **Persona**: clientes com suporte a *prompts* MCP (Claude) ativam-na com o prompt `assistente_juridico`. Os restantes carregam o ficheiro de regras/instruções da respetiva pasta (mesma persona, formato nativo).

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
