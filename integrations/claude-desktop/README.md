# Claude Desktop — `advogado-pt-mcp`

Liga o servidor MCP `advogado-pt-mcp` à app **Claude Desktop**.

## Onde fica o ficheiro de configuração

O Claude Desktop lê um ficheiro `claude_desktop_config.json`:

| Sistema | Caminho |
|---|---|
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json`  (normalmente `C:\Users\<utilizador>\AppData\Roaming\Claude\claude_desktop_config.json`) |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |

Atalho para abrir a partir da app: **Settings → Developer → Edit Config**.

## Como configurar

1. Abre (ou cria) o `claude_desktop_config.json`.
2. Cola o bloco `mcpServers` de [`claude_desktop_config.snippet.json`](./claude_desktop_config.snippet.json).
   Se o ficheiro já tiver outros servidores, acrescenta apenas a chave `"advogado-pt"`
   dentro do `mcpServers` existente (não dupliques a chave `mcpServers`).

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

3. **Fecha e reabre** o Claude Desktop (sai por completo, não apenas a janela).
4. Confirma no ícone de ferramentas/plug (🔌) da caixa de conversa que o servidor
   `advogado-pt` está ligado. O prompt `advogado_pt` aparece no menu de prompts.

## Modo local (desenvolvimento)

Compila primeiro o servidor:

```powershell
# dentro de mcp-server/
npm install
npm run build
```

e usa esta variante no `mcpServers` (caminho **absoluto** para `dist/index.js`):

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

## Resolução de problemas

- **O servidor não aparece** — confirma que o JSON é válido (sem vírgulas a mais) e que o
  `node`/`npx` estão no PATH. No Windows pode ser necessário usar `"command": "npx.cmd"`.
- **Logs** — em macOS, `~/Library/Logs/Claude/`; em Windows, `%APPDATA%\Claude\logs\`.
