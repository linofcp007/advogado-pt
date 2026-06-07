// Regista os PROMPTS MCP: o `advogado_pt` (persona geral) + prompts por área para
// ativação granular em clientes que listam prompts.
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PERSONA } from "./persona.js";

function mensagem(texto: string) {
  return { messages: [{ role: "user" as const, content: { type: "text" as const, text: texto } }] };
}

// Prompts por área: nome → (título, foco/instrução específica).
const AREAS: Record<string, { titulo: string; foco: string }> = {
  cobranca: {
    titulo: "Cobrança de dívidas",
    foco: "Foco: recuperação de uma dívida. Segue o playbook `cliente-nao-paga`, usa `ler_referencia cobrancas`, gera cartas com `obter_template`, calcula juros com `calc_juros_mora` e custas com `calc_custas_injuncao`.",
  },
  contrato: {
    titulo: "Contratos",
    foco: "Foco: redigir ou rever um contrato. Parte de `obter_template` (ex.: contrato-prestacao-servicos-ti, nda-bilingue) e usa a `checklist-revisao-contrato`; enquadra com `ler_referencia contratos`.",
  },
  rgpd: {
    titulo: "RGPD / Proteção de dados",
    foco: "Foco: proteção de dados. Usa `ler_referencia rgpd`, o playbook `data-breach` (72h CNPD) e a `checklist-rgpd`; para IA, `ler_referencia digital-ue`.",
  },
  laboral: {
    titulo: "Direito do trabalho",
    foco: "Foco: relação laboral. Usa `ler_referencia laboral`; para cessação, `calc_compensacao_despedimento` e o playbook `quero-despedir`; templates de contrato/nota de culpa via `obter_template`.",
  },
  imovel: {
    titulo: "Imobiliário (compra/venda)",
    foco: "Foco: comprar/vender imóvel. Usa `ler_referencia imobiliario`, `calc_imt` (incl. IMT Jovem), o playbook `comprar-imovel` e a `checklist-due-diligence-imovel`.",
  },
  heranca: {
    titulo: "Heranças e partilhas",
    foco: "Foco: herança/partilha. Usa `ler_referencia herancas` (e `sucessorio-internacional` se houver bens/herdeiros no estrangeiro) e `calc_imposto_selo_heranca`.",
  },
  sociedade: {
    titulo: "Sociedades / ENI→Lda",
    foco: "Foco: constituir sociedade ou transitar de ENI para Lda. Usa `ler_referencia societario` e `fiscal`, e a `checklist-constituicao-sociedade`.",
  },
};

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "advogado_pt",
    {
      title: "Advogado PT — assessor jurídico de Portugal",
      description:
        "Ativa a persona de advogado pessoal e empresarial especializado em direito português (geral).",
      argsSchema: {
        assunto: z.string().optional().describe("Questão ou tarefa jurídica concreta (opcional)"),
      },
    },
    ({ assunto }) =>
      mensagem(PERSONA + (assunto ? `\n\n---\nTarefa do utilizador: ${assunto}` : ""))
  );

  for (const [nome, { titulo, foco }] of Object.entries(AREAS)) {
    server.registerPrompt(
      nome,
      {
        title: `Advogado PT — ${titulo}`,
        description: `Persona de advogado de Portugal focada em: ${titulo.toLowerCase()}.`,
        argsSchema: {
          assunto: z.string().optional().describe("Situação concreta (opcional)"),
        },
      },
      ({ assunto }) =>
        mensagem(
          PERSONA + "\n\n---\n" + foco + (assunto ? `\n\nSituação: ${assunto}` : "")
        )
    );
  }
}
