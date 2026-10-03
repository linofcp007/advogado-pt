// Pedido do perfil por formulário (MCP elicitation, modo "form") quando falta e o cliente o suporta.
// Sem suporte, recusado, cancelado ou com erro -> null, e a tool pede os campos por texto (como na 1.2).
// O formulário só tem campos planos com listas fechadas (a spec não aceita objetos aninhados).
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/** Campos pedidos no formulário e no texto de recurso (os que o calendário usa). */
export const CAMPOS_FORMULARIO = ["forma_juridica", "regime_iva", "trabalhadores", "contabilidade"] as const;

const ESQUEMA = {
  type: "object" as const,
  properties: {
    forma_juridica: {
      type: "string" as const,
      title: "Forma jurídica",
      enum: ["ENI", "Unipessoal Lda", "Lda", "SA", "Associação ou cooperativa", "Particular"],
    },
    regime_iva: {
      type: "string" as const,
      title: "Regime de IVA",
      enum: ["mensal", "trimestral", "isento (art. 53.º)"],
    },
    trabalhadores: { type: "integer" as const, title: "N.º de trabalhadores", minimum: 0 },
    contabilidade: { type: "string" as const, title: "Contabilidade", enum: ["organizada", "simplificado"] },
    guardar: {
      type: "boolean" as const,
      title: "Guardar como perfil deste projeto (.juridico-pt/)",
      default: false,
    },
  },
  required: ["forma_juridica", "regime_iva"],
};

/** O cliente aceita formulários? (`elicitation: {}` sem modos conta como formulário.) */
export function suportaFormulario(servidor: McpServer): boolean {
  const e = servidor.server.getClientCapabilities()?.elicitation as Record<string, unknown> | undefined;
  if (!e) return false;
  return Object.keys(e).length === 0 || e.form !== undefined;
}

/**
 * Pede o perfil num formulário. Devolve os campos (texto) e se o utilizador quer guardá-lo,
 * ou null quando não há formulário (sem suporte, recusa, cancelamento, erro ou tempo esgotado).
 */
export async function pedirPerfil(
  servidor: McpServer,
  motivo: string
): Promise<{ campos: Record<string, string>; guardar: boolean } | null> {
  if (!suportaFormulario(servidor)) return null;
  try {
    const r = await servidor.server.elicitInput(
      { mode: "form", message: `Para ${motivo}, preciso de alguns dados da empresa (só os usados no cálculo).`, requestedSchema: ESQUEMA },
      { timeout: 5 * 60 * 1000 }
    );
    if (r.action !== "accept" || !r.content) return null;
    const campos: Record<string, string> = {};
    for (const k of CAMPOS_FORMULARIO) {
      const v = (r.content as Record<string, unknown>)[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") campos[k] = String(v).trim();
    }
    if (Object.keys(campos).length === 0) return null;
    return { campos, guardar: (r.content as Record<string, unknown>).guardar === true };
  } catch {
    return null; // fail-open: segue para as perguntas em texto
  }
}
