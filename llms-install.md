# Instalar o advogado-pt (agentes & Cline)

O `advogado-pt` inclui um **servidor MCP local** em TypeScript (Node.js ≥ 18). Expõe assessoria
jurídica de Portugal — referências, templates e calculadoras — a qualquer cliente compatível com MCP.
Todas as operações são locais: sem rede, sem API key.

## Passos

1. **Clona o repositório** para um local permanente e anota o caminho absoluto:

   ```bash
   git clone https://github.com/linofcp007/advogado-pt.git
   # guarda o caminho absoluto, ex.: /home/you/advogado-pt (ou C:\tools\advogado-pt)
   ```

2. **Constrói o servidor MCP** (compila o TypeScript e empacota o conteúdo):

   ```bash
   cd advogado-pt/mcp-server
   npm install
   npm run build      # gera dist/index.js
   ```

3. **Regista o servidor** no teu cliente MCP. Substitui `/ABSOLUTE/PATH/` pelo caminho do passo 1.
   Para o **Cline** (`cline_mcp_settings.json`) e para a maioria dos clientes:

   ```json
   {
     "mcpServers": {
       "advogado-pt": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/advogado-pt/mcp-server/dist/index.js"]
       }
     }
   }
   ```

   A mesma shape `mcpServers` funciona em **Cursor, Claude Desktop, Windsurf, Gemini e Cline**.

   Em alternativa, se o pacote estiver publicado no npm, não precisas de clonar nem construir:

   ```json
   {
     "mcpServers": {
       "advogado-pt": { "command": "npx", "args": ["-y", "advogado-pt-mcp"] }
     }
   }
   ```

4. **Recarrega o cliente MCP.** O servidor anuncia **17 tools** (8 calculadoras jurídicas + 9
   ferramentas de conteúdo), **resources** (todo o conteúdo jurídico em
   `advogado-pt://{categoria}/{nome}`) e o **prompt** `advogado_pt` (persona de advogado de Portugal).

## Notes

- **Requisitos:** Node.js ≥ 18.
- **Línguas:** PT e EN.
- **Privacidade:** o conteúdo é local e o servidor nunca acede à rede.
- **Aviso:** orientação informativa — não substitui advogado inscrito na Ordem dos Advogados.
