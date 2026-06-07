// Regista o PROMPT MCP "advogado_pt" que ativa a persona em qualquer cliente compatível.
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PERSONA } from "./persona.js";

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "advogado_pt",
    {
      title: "Advogado PT — assessor jurídico de Portugal",
      description:
        "Ativa a persona de advogado pessoal e empresarial especializado em direito português.",
      argsSchema: {
        assunto: z
          .string()
          .optional()
          .describe("Questão ou tarefa jurídica concreta (opcional)"),
      },
    },
    ({ assunto }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: PERSONA + (assunto ? `\n\n---\nTarefa do utilizador: ${assunto}` : ""),
          },
        },
      ],
    })
  );
}
