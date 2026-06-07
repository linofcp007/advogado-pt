// Expõe todo o conteúdo jurídico como RESOURCES MCP, via URIs advogado-pt://{categoria}/{nome},
// com autocomplete (complete) dos argumentos para clientes que o suportam.
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listarTudo, listar, ler, CATEGORIAS, type Categoria } from "./content.js";

function comeca(value: string | undefined, nome: string): boolean {
  return nome.toLowerCase().startsWith((value || "").toLowerCase());
}

export function registerResources(server: McpServer): void {
  server.registerResource(
    "conteudo-juridico",
    new ResourceTemplate("advogado-pt://{categoria}/{nome}", {
      list: async () => ({
        resources: listarTudo().map(({ categoria, nome, label }) => ({
          uri: `advogado-pt://${categoria}/${nome}`,
          name: `${label}: ${nome}`,
          description: `${label} de direito português — ${nome}`,
          mimeType: "text/markdown",
        })),
      }),
      complete: {
        categoria: (value) => CATEGORIAS.filter((c) => comeca(value, c)),
        nome: (value, context) => {
          const cat = context?.arguments?.categoria as Categoria | undefined;
          const base =
            cat && CATEGORIAS.includes(cat)
              ? listar(cat)
              : listarTudo().map((x) => x.nome);
          return base.filter((n) => comeca(value, n));
        },
      },
    }),
    {
      title: "Conteúdo jurídico (Portugal)",
      description:
        "Referências por área, templates de documentos, playbooks e checklists de direito português. Categorias: references, templates, checklists, playbooks.",
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
