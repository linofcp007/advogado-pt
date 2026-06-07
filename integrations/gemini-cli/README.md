# Gemini CLI — `advogado-pt-mcp`

Liga o servidor MCP `advogado-pt-mcp` ao **Gemini CLI** e carrega a persona como contexto de
projeto.

## Ficheiros

```text
gemini-cli/
├── settings.snippet.json   # Bloco mcpServers → vai para ~/.gemini/settings.json
└── GEMINI.md               # Persona → contexto de projeto (raiz do projeto ou ~/.gemini/)
```

## 1. Configurar o servidor MCP

O Gemini CLI lê as definições de `settings.json`:

| Âmbito | Caminho |
|---|---|
| **Global (utilizador)** | `~/.gemini/settings.json`  (Windows: `C:\Users\<utilizador>\.gemini\settings.json`) |
| **Por projeto** | `.gemini/settings.json` na raiz do projeto |

Clona o repo e compila o servidor **uma vez** (`npm install && npm run build` em
`mcp-server/`). Depois cola o bloco `mcpServers` de
[`settings.snippet.json`](./settings.snippet.json), com o caminho **absoluto** para
`dist/index.js`. Se o ficheiro já existir, acrescenta apenas a chave `"advogado-pt"` dentro
do `mcpServers` existente:

```json
{
  "mcpServers": {
    "advogado-pt": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/advogado-pt/mcp-server/dist/index.js"]
    }
  }
}
```

> Substitui `/ABSOLUTE/PATH/TO/advogado-pt` pelo caminho absoluto na tua máquina, ou corre
> `node bin/advogado-pt.mjs mcp-config gemini` na raiz do repo para gerar o bloco com o
> caminho **absoluto** já preenchido.

Inicia o `gemini` e confirma com o comando `/mcp` que o servidor `advogado-pt` está ligado e
que as tools estão listadas.

## 2. Carregar a persona

Copia [`GEMINI.md`](./GEMINI.md) para a raiz do projeto (ou para `~/.gemini/GEMINI.md` para
ser global). O Gemini CLI carrega automaticamente o `GEMINI.md` como contexto hierárquico.
