# ChatGPT / OpenAI — `advogado-pt`

Há **dois caminhos** para usar o Advogado PT no ecossistema OpenAI. Escolhe consoante
queiras a experiência mais simples (Custom GPT) ou as tools MCP "ao vivo" (conector MCP).

---

## Caminho A — Custom GPT com ficheiros de conhecimento (sem MCP)

O mais simples e 100% no ChatGPT web. Um Custom GPT **não fala MCP**, por isso replicamos o
conteúdo do servidor anexando ficheiros.

1. ChatGPT (plano com GPTs) → **Explore GPTs → Create**.
2. Em **Configure → Instructions**, cola o conteúdo de
   [`custom-gpt-instructions.md`](./custom-gpt-instructions.md) (a persona completa).
3. Em **Configure → Knowledge**, anexa os ficheiros de conhecimento a partir da raiz da
   skill:
   - todos os `.md` de **`references/`** (inclui sempre `valores-2026.md` e
     `glossario-pt-en.md`);
   - os templates de **`assets/templates/`**;
   - (opcional) **`playbooks/`** e **`assets/checklists/`**.
4. Guarda/Publica. O GPT passa a responder com a persona e a citar os ficheiros anexados.

> Limitação: como não há tools, as **calculadoras** do servidor não correm. O GPT explica a
> fórmula e a base legal, mas para cálculos exatos usa o caminho B ou as calculadoras
> diretamente.

---

## Caminho B — Conector MCP (ChatGPT / Agents / Responses API)

Aqui usam-se as **tools MCP reais** (calculadoras, referências, templates, playbooks).
Importante perceber o transporte:

### O servidor é local (stdio)

O `advogado-pt-mcp` é distribuído como pacote npm que arranca por **stdio**
(`npx -y advogado-pt-mcp`). Ferramentas que falam stdio diretamente consomem-no sem mais
nada:

- **Codex CLI** (ver [`../codex/`](../codex/)) — `~/.codex/config.toml`.
- **OpenAI Agents SDK** — podes ligar um servidor MCP **stdio** localmente (parâmetro de
  servidor MCP stdio do SDK), apontando `command: "npx"`, `args: ["-y","advogado-pt-mcp"]`.

### ChatGPT web / Responses API exigem um endpoint remoto (HTTP)

O conector MCP do **ChatGPT (web)** e o parâmetro `tools: [{ type: "mcp", server_url: ... }]`
da **Responses API** esperam um servidor MCP **remoto, acessível por HTTP(S)** — não
conseguem arrancar um processo stdio local. Para os usar tens de **expor o `advogado-pt-mcp`
via um wrapper HTTP/remoto**:

1. Coloca um adaptador stdio→HTTP à frente do servidor (ex.: `mcp-proxy`/`supergateway`, ou
   o transporte Streamable HTTP do MCP) que execute por baixo `npx -y advogado-pt-mcp`.
2. Publica esse endpoint num URL acessível (HTTPS), com autenticação adequada.
3. No ChatGPT, adiciona-o em **Settings → Connectors** (ou no campo de conector MCP do modo
   Agent/Deep Research). Na Responses API, passa o `server_url` do teu wrapper.

Resumo:

| Cliente OpenAI | Transporte que aceita | Como ligar `advogado-pt-mcp` |
|---|---|---|
| Codex CLI | stdio | direto (`npx -y advogado-pt-mcp`) |
| Agents SDK | stdio (local) ou HTTP | direto via servidor MCP stdio do SDK |
| ChatGPT web (Connectors) | HTTP remoto | via wrapper HTTP/remoto |
| Responses API (`type: "mcp"`) | HTTP remoto | via wrapper HTTP/remoto |

### Modo publicado vs. local (para o wrapper / Agents SDK)

- **Publicado:** `command: "npx"`, `args: ["-y", "advogado-pt-mcp"]`.
- **Local (dev):** compila (`npm install && npm run build` em `mcp-server/`) e usa
  `command: "node"`, `args: ["C:/Users/Administrator/Desktop/CLAUDE SKILLS/advogado-pt/mcp-server/dist/index.js"]`
  (caminho **absoluto**).

---

## Qual escolher?

- Só queres conselho jurídico no ChatGPT web, rápido → **Caminho A** (Custom GPT).
- Queres calculadoras exatas e conteúdo sempre sincronizado, ou estás a construir um
  agente → **Caminho B** (MCP; direto no Codex/Agents SDK, ou via wrapper HTTP no ChatGPT
  web/Responses API).
