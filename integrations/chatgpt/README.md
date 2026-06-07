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

O servidor MCP corre a partir do **build local** do repositório e arranca por **stdio**.
Clona o repo e compila-o **uma vez** (`npm install && npm run build` em `mcp-server/`); depois
aponta os clientes ao `dist/index.js` com `command: "node"` e o caminho **absoluto** em
`args`. Ferramentas que falam stdio diretamente consomem-no sem mais nada:

- **Codex CLI** (ver [`../codex/`](../codex/)) — `~/.codex/config.toml`.
- **OpenAI Agents SDK** — podes ligar um servidor MCP **stdio** localmente (parâmetro de
  servidor MCP stdio do SDK), apontando `command: "node"`,
  `args: ["/ABSOLUTE/PATH/TO/advogado-pt/mcp-server/dist/index.js"]`.

### ChatGPT web / Responses API exigem um endpoint remoto (HTTP)

O conector MCP do **ChatGPT (web)** e o parâmetro `tools: [{ type: "mcp", server_url: ... }]`
da **Responses API** esperam um servidor MCP **remoto, acessível por HTTP(S)** — não
conseguem arrancar um processo stdio local. Para os usar tens de **expor o servidor local
via um wrapper HTTP/remoto**:

1. Coloca um adaptador stdio→HTTP à frente do servidor (ex.: `mcp-proxy`/`supergateway`, ou
   o transporte Streamable HTTP do MCP) que execute por baixo
   `node /ABSOLUTE/PATH/TO/advogado-pt/mcp-server/dist/index.js`.
2. Publica esse endpoint num URL acessível (HTTPS), com autenticação adequada.
3. No ChatGPT, adiciona-o em **Settings → Connectors** (ou no campo de conector MCP do modo
   Agent/Deep Research). Na Responses API, passa o `server_url` do teu wrapper.

Resumo:

| Cliente OpenAI | Transporte que aceita | Como ligar o servidor advogado-pt |
|---|---|---|
| Codex CLI | stdio | direto (`node …/mcp-server/dist/index.js`) |
| Agents SDK | stdio (local) ou HTTP | direto via servidor MCP stdio do SDK |
| ChatGPT web (Connectors) | HTTP remoto | via wrapper HTTP/remoto |
| Responses API (`type: "mcp"`) | HTTP remoto | via wrapper HTTP/remoto |

### Forma local (para o wrapper / Agents SDK)

- Compila (`npm install && npm run build` em `mcp-server/`) e usa `command: "node"`,
  `args: ["/ABSOLUTE/PATH/TO/advogado-pt/mcp-server/dist/index.js"]` (caminho **absoluto**).
- Atalho: corre `node bin/advogado-pt.mjs mcp-config codex` (ou outro host) na raiz do repo
  para obter o bloco com o caminho **absoluto** já preenchido para a tua máquina.

---

## Qual escolher?

- Só queres conselho jurídico no ChatGPT web, rápido → **Caminho A** (Custom GPT).
- Queres calculadoras exatas e conteúdo sempre sincronizado, ou estás a construir um
  agente → **Caminho B** (MCP; direto no Codex/Agents SDK, ou via wrapper HTTP no ChatGPT
  web/Responses API).
