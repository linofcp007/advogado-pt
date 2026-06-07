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

1. Clona o repo e compila o servidor **uma vez**:

   ```powershell
   # dentro de mcp-server/
   npm install
   npm run build
   ```

2. Abre (ou cria) o `claude_desktop_config.json`.
3. Cola o bloco `mcpServers` de [`claude_desktop_config.snippet.json`](./claude_desktop_config.snippet.json),
   usando o caminho **absoluto** para `dist/index.js`. Se o ficheiro já tiver outros
   servidores, acrescenta apenas a chave `"advogado-pt"` dentro do `mcpServers` existente
   (não dupliques a chave `mcpServers`).

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
   > `node bin/advogado-pt.mjs mcp-config claude-desktop` na raiz do repo para gerar o bloco
   > com o caminho **absoluto** já preenchido.

4. **Fecha e reabre** o Claude Desktop (sai por completo, não apenas a janela).
5. Confirma no ícone de ferramentas/plug (🔌) da caixa de conversa que o servidor
   `advogado-pt` está ligado. O prompt `advogado_pt` aparece no menu de prompts.

## Resolução de problemas

- **O servidor não aparece** — confirma que o JSON é válido (sem vírgulas a mais), que o
  `node` está no PATH e que o caminho para `dist/index.js` existe (compilaste o servidor com
  `npm run build`?).
- **Logs** — em macOS, `~/Library/Logs/Claude/`; em Windows, `%APPDATA%\Claude\logs\`.
