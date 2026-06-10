#!/usr/bin/env node
// Servidor MCP "advogado-pt" — assessoria jurídica de Portugal (referências, templates,
// playbooks, checklists e calculadoras) para qualquer cliente compatível com MCP:
// Claude Desktop/Code, Cursor, Windsurf, Codex, Gemini CLI, OpenAI Agents/ChatGPT.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools.js";
import { registerResources } from "./resources.js";
import { registerPrompts } from "./prompts.js";
import { PERSONA } from "./persona.js";

async function main(): Promise<void> {
  const server = new McpServer(
    {
      name: "advogado-pt",
      version: "1.0.2",
    },
    {
      // Muitos clientes MCP injetam estas instruções como contexto do servidor,
      // melhorando a ativação e a seleção de ferramentas.
      instructions: PERSONA,
    }
  );

  registerTools(server);
  registerResources(server);
  registerPrompts(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Logs vão para stderr para não interferir com o protocolo JSON-RPC em stdout.
  console.error("advogado-pt MCP server ativo (stdio).");
}

main().catch((err) => {
  console.error("Erro fatal no advogado-pt MCP server:", err);
  process.exit(1);
});
