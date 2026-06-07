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

Cola o bloco `mcpServers` de [`settings.snippet.json`](./settings.snippet.json). Se o
ficheiro já existir, acrescenta apenas a chave `"advogado-pt"` dentro do `mcpServers`
existente:

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

Inicia o `gemini` e confirma com o comando `/mcp` que o servidor `advogado-pt` está ligado e
que as tools estão listadas.

## 2. Carregar a persona

Copia [`GEMINI.md`](./GEMINI.md) para a raiz do projeto (ou para `~/.gemini/GEMINI.md` para
ser global). O Gemini CLI carrega automaticamente o `GEMINI.md` como contexto hierárquico.

## Modo local (desenvolvimento)

Compila o servidor (`npm install && npm run build` em `mcp-server/`) e usa esta variante no
`settings.json` (caminho **absoluto** para `dist/index.js`):

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
