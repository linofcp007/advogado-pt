# Instalar o juridico-pt (agentes & Cline)

O `juridico-pt` inclui um **servidor MCP local** em TypeScript (Node.js ≥ 18). Expõe assessoria
jurídica de Portugal — referências, templates e calculadoras — a qualquer cliente compatível com MCP.
Todas as operações são locais: sem rede, sem API key.

## Passos

1. **Clona o repositório** para um local permanente e anota o caminho absoluto:

   ```bash
   git clone https://github.com/linofcp007/juridico-pt.git
   # guarda o caminho absoluto, ex.: /home/you/juridico-pt (ou C:\tools\juridico-pt)
   ```

2. **Constrói o servidor MCP** (um comando na raiz):

   ```bash
   cd juridico-pt
   npm run setup      # instala + compila o MCP (gera dist/index.js) + doctor
   ```

3. **Regista o servidor** no teu cliente MCP. Substitui `/ABSOLUTE/PATH/` pelo caminho do passo 1.
   Para o **Cline** (`cline_mcp_settings.json`) e para a maioria dos clientes:

   ```json
   {
     "mcpServers": {
       "juridico-pt": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/juridico-pt/mcp-server/dist/index.js"]
       }
     }
   }
   ```

   A mesma shape `mcpServers` funciona em **Cursor, Claude Desktop, Windsurf, Gemini e Cline**.
   Dica: `node cli/juridico-pt.mjs mcp-config <host>` imprime o bloco com o caminho absoluto já preenchido.

4. **Recarrega o cliente MCP.** O servidor anuncia **17 tools** (8 calculadoras jurídicas + 9
   ferramentas de conteúdo), **resources** (todo o conteúdo jurídico em
   `juridico-pt://{categoria}/{nome}`) e o **prompt** `assistente_juridico` (persona de advogado de Portugal).

## Notes

- **Requisitos:** Node.js ≥ 18.
- **Línguas:** PT e EN.
- **Privacidade:** o conteúdo é local e o servidor nunca acede à rede.
- **Aviso:** orientação informativa — não substitui advogado inscrito na Ordem dos Advogados.
