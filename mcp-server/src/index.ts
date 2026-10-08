#!/usr/bin/env node
// Servidor MCP "juridico-pt" — assessoria jurídica de Portugal (referências, templates,
// playbooks, checklists e calculadoras) para qualquer cliente compatível com MCP:
// Claude Desktop/Code, Cursor, Windsurf, Codex, Gemini CLI, OpenAI Agents/ChatGPT.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools.js";
import { registerResources } from "./resources.js";
import { registerPrompts } from "./prompts.js";
import { INSTRUCOES_MCP } from "./persona.js";

/**
 * O MCP permite pedir um prompt sem `arguments`, mas o SDK 1.31 valida `undefined` contra o
 * schema e recusa-o (corrigido no SDK 1.32, com `arguments ?? {}`). Enquanto o 1.32 não for
 * adotado, normaliza o pedido aqui. Sem o mapa interno esperado, não faz nada (fail-open).
 */
function argumentosOpcionaisNosPrompts(server: McpServer): void {
  type Handler = (pedido: { params?: Record<string, unknown> }, extra: unknown) => unknown;
  const handlers = (server.server as unknown as { _requestHandlers?: Map<string, Handler> })._requestHandlers;
  const original = handlers?.get("prompts/get");
  if (!handlers || !original) return;
  handlers.set("prompts/get", (pedido, extra) =>
    original({ ...pedido, params: { ...pedido.params, arguments: pedido.params?.arguments ?? {} } }, extra)
  );
}

async function main(): Promise<void> {
  const server = new McpServer(
    {
      name: "juridico-pt",
      version: "2.0.2",
    },
    {
      // Muitos clientes MCP injetam estas instruções como contexto do servidor (com um limite
      // de tamanho): regras e mapa intenção -> tool. A persona completa está no prompt assistente_juridico.
      instructions: INSTRUCOES_MCP,
    }
  );

  registerTools(server);
  registerResources(server);
  registerPrompts(server);
  argumentosOpcionaisNosPrompts(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Logs vão para stderr para não interferir com o protocolo JSON-RPC em stdout.
  console.error("juridico-pt MCP server ativo (stdio).");
}

main().catch((err) => {
  console.error("Erro fatal no juridico-pt MCP server:", err);
  process.exit(1);
});
