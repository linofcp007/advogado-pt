# Claude Desktop — `juridico-pt-mcp`

Liga o servidor MCP `juridico-pt-mcp` à app **Claude Desktop**. Há duas formas; a extensão é a mais simples.

> **Extensão, plugin ou servidor manual?** A extensão `.mcpb` e a configuração manual dão o mesmo: as 38 tools, o conteúdo jurídico como resources e o prompt `assistente_juridico` nas conversas do Desktop. O **plugin** (conta claude.ai, **Customize > Plugins**) traz também os slash commands, os hooks e os subagentes, e sincroniza com o Claude Code. Se as tools do `juridico-pt` já aparecem nas conversas do Desktop através do plugin, não precisas de nada desta página.

## A. Extensão `.mcpb` (recomendado)

Não precisa de Node nem de editar JSON: a extensão usa o Node que o Claude Desktop traz.

1. Descarrega `juridico-pt-<versão>.mcpb` da [última release](https://github.com/linofcp007/juridico-pt/releases/latest),
   ou gera-o na raiz de um clone do repositório:

   ```powershell
   npm --prefix mcp-server run build:mcpb   # → dist/juridico-pt-<versão>.mcpb
   ```

2. No Claude Desktop, **Definições → Extensões → Instalar extensão…** e escolhe o ficheiro `.mcpb`.
3. Abre uma conversa e pede, por exemplo, os juros de mora de uma fatura: a tool `calc_juros_mora` deve responder.

Para atualizar, gera e instala o `.mcpb` da versão nova. Para remover, **Definições → Extensões**.

## B. Configuração manual do servidor

### Onde fica o ficheiro de configuração

O Claude Desktop lê um ficheiro `claude_desktop_config.json`. O atalho mais seguro é abri-lo a partir da app: **Settings → Developer → Edit Config**.

| Sistema | Caminho |
|---|---|
| **Windows** (instalador) | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Windows** (Microsoft Store) | `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\claude_desktop_config.json` |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |

### Como configurar

1. Clona o repositório. O servidor já vem compilado e autocontido em `mcp-server/dist/index.js`: só precisas de **Node ≥ 18** no PATH, sem `npm install` nem build.
2. Abre (ou cria) o `claude_desktop_config.json`.
3. Cola o bloco `mcpServers` de [`claude_desktop_config.snippet.json`](./claude_desktop_config.snippet.json),
   usando o caminho **absoluto** para `dist/index.js`. Se o ficheiro já tiver outros
   servidores, acrescenta apenas a chave `"juridico-pt"` dentro do `mcpServers` existente
   (não dupliques a chave `mcpServers`).

   ```json
   {
     "mcpServers": {
       "juridico-pt": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/juridico-pt/mcp-server/dist/index.js"]
       }
     }
   }
   ```

   > Substitui `/ABSOLUTE/PATH/TO/juridico-pt` pelo caminho absoluto na tua máquina, ou corre
   > `node cli/juridico-pt.mjs mcp-config claude-desktop` na raiz do repo para gerar o bloco
   > com o caminho **absoluto** já preenchido.

4. **Fecha e reabre** o Claude Desktop (sai por completo, não apenas a janela).
5. Confirma no ícone de ferramentas/plug (🔌) da caixa de conversa que o servidor
   `juridico-pt` está ligado. O prompt `assistente_juridico` aparece no menu de prompts.

Não uses a extensão e a configuração manual ao mesmo tempo: terias as mesmas tools em duplicado.

## Resolução de problemas

- **O servidor não aparece** — confirma que o JSON é válido (sem vírgulas a mais), que o
  `node` está no PATH e que o caminho para `mcp-server/dist/index.js` existe. Na raiz do repo,
  `node cli/juridico-pt.mjs doctor` diz o que falta.
- **Logs** — em macOS, `~/Library/Logs/Claude/`; em Windows, `%APPDATA%\Claude\logs\` (instalador)
  ou `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\logs\` (Microsoft Store).
