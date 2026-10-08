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

2. **Não é preciso compilar o servidor.** Já vem compilado e autocontido em
   `mcp-server/dist/index.js` — basta Node ≥ 18. Só o **CLI** (`calc`, `calendario`, `prazos`,
   `painel`, `exportar`, `atualidade`) precisa de um build local:

   ```bash
   cd juridico-pt
   npm run setup      # opcional, só para o CLI: instala + compila + doctor
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

4. **Recarrega o cliente MCP.** O servidor anuncia **38 tools** (17 calculadoras jurídicas,
   10 de perfil, calendário e prazos, 11 de conteúdo e documentos), **resources** (todo o conteúdo jurídico em
   `juridico-pt://{categoria}/{nome}`) e o **prompt** `assistente_juridico` (persona de assistente jurídico de Portugal).

## Notes

- **Requisitos:** Node.js ≥ 18.
- **Línguas:** PT e EN.
- **Privacidade:** o conteúdo é local e o servidor nunca acede à rede. O perfil da empresa e os
  prazos ficam em ficheiros de texto em `.juridico-pt/` (projeto) e `~/.juridico-pt/` (geral).
- **Aviso:** orientação informativa — não substitui advogado inscrito na Ordem dos Advogados.
