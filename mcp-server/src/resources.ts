// Expõe todo o conteúdo jurídico como RESOURCES MCP, via URIs advogado-pt://{categoria}/{nome}.
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listarTudo, ler, type Categoria } from "./content.js";

export function registerResources(server: McpServer): void {
  server.registerResource(
    "conteudo-juridico",
    new ResourceTemplate("advogado-pt://{categoria}/{nome}", {
      list: async () => ({
        resources: listarTudo().map(({ categoria, nome, label }) => ({
          uri: `advogado-pt://${categoria}/${nome}`,
          name: `${label}: ${nome}`,
          description: `${label} — ${nome}`,
          mimeType: "text/markdown",
        })),
      }),
    }),
    {
      title: "Conteúdo jurídico (Portugal)",
      description:
        "Referências por área, templates de documentos, playbooks e checklists de direito português.",
    },
    async (uri, variables) => {
      const categoria = String(variables.categoria) as Categoria;
      const nome = String(variables.nome);
      const txt = ler(categoria, nome) ?? `(não encontrado: ${categoria}/${nome})`;
      return {
        contents: [{ uri: uri.href, mimeType: "text/markdown", text: txt }],
      };
    }
  );
}
