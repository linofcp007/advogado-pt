// Que procedimento de contratação pública se pode usar, pelo valor do contrato (CCP, arts. 19.º e 20.º).
// Limiares do DL 177/2026 (em vigor a 1/10/2026, para os procedimentos iniciados a partir dessa data);
// os anteriores continuam a valer para os iniciados até 30/9/2026. Os valores estão em
// references/valores-2026.md (secção Contratação Pública) — manter os dois alinhados.
// Porta Python: skills/juridico-pt/scripts/procedimento_ccp.py — mesmos casos em paridade.json.
import { formatarEuros } from "./format.js";

export type TipoContratoCCP = "bens-servicos" | "empreitada";
export type ProcedimentoCCP = "ajuste-direto" | "consulta-previa" | "concurso-publico" | "concurso-limitado";

/** Início do regime do DL 177/2026. */
export const INICIO_DL_177_2026 = "2026-10-01";

// Valor do contrato INFERIOR a (sem IVA).
const LIMIARES = {
  atual: {
    "bens-servicos": { ajuste: 75_000, consulta: 130_000 },
    empreitada: { ajuste: 150_000, consulta: 1_000_000 },
  },
  anterior: {
    "bens-servicos": { ajuste: 20_000, consulta: 75_000 },
    empreitada: { ajuste: 30_000, consulta: 150_000 },
  },
} as const;

const NOMES: Record<ProcedimentoCCP, string> = {
  "ajuste-direto": "Ajuste direto",
  "consulta-previa": "Consulta prévia (convite a 3 ou mais entidades)",
  "concurso-publico": "Concurso público",
  "concurso-limitado": "Concurso limitado por prévia qualificação",
};

export interface ProcedimentoAdmissivel {
  procedimento: ProcedimentoCCP;
  nome: string;
  /** Limiar superior (exclusivo) ou null quando não há limite pelo valor. */
  ate: number | null;
  base: string;
}

export interface ResultadoCCP {
  valor: number;
  tipo: TipoContratoCCP;
  regime: "DL 177/2026" | "anterior ao DL 177/2026";
  admissiveis: ProcedimentoAdmissivel[];
  notas: string[];
}

export interface PedidoCCP {
  valor: number;
  tipo: TipoContratoCCP;
  /** Data de início do procedimento (AAAA-MM-DD ou Date); por defeito, o regime atual. */
  inicio?: Date | string;
}

export function calcularProcedimentoCCP({ valor, tipo, inicio }: PedidoCCP): ResultadoCCP {
  if (!(typeof valor === "number" && Number.isFinite(valor) && valor >= 0)) {
    throw new Error("O valor do contrato tem de ser um número positivo (sem IVA).");
  }
  if (tipo !== "bens-servicos" && tipo !== "empreitada") {
    throw new Error(`Tipo de contrato desconhecido: '${tipo}' (usa bens-servicos ou empreitada).`);
  }
  const data = inicio === undefined ? null : (inicio instanceof Date ? inicio.toISOString() : String(inicio)).slice(0, 10);
  const anterior = data !== null && data < INICIO_DL_177_2026;
  const l = (anterior ? LIMIARES.anterior : LIMIARES.atual)[tipo];
  const artigo = tipo === "empreitada" ? "art. 19.º" : "art. 20.º";
  const redacao = anterior ? "redação anterior ao DL 177/2026" : "redação do DL 177/2026";
  const base = `CCP, ${artigo} (${redacao})`;

  const admissiveis: ProcedimentoAdmissivel[] = [];
  if (valor < l.ajuste) admissiveis.push({ procedimento: "ajuste-direto", nome: NOMES["ajuste-direto"], ate: l.ajuste, base });
  if (valor < l.consulta) admissiveis.push({ procedimento: "consulta-previa", nome: NOMES["consulta-previa"], ate: l.consulta, base });
  admissiveis.push({ procedimento: "concurso-publico", nome: NOMES["concurso-publico"], ate: null, base: `${base} — qualquer valor` });
  admissiveis.push({ procedimento: "concurso-limitado", nome: NOMES["concurso-limitado"], ate: null, base: `${base} — qualquer valor` });

  const notas = [
    "O valor é o do contrato a celebrar, sem IVA, incluindo prorrogações e opções; dividir o contrato para ficar abaixo de um limiar não é permitido (CCP, art. 22.º).",
    "O ajuste direto e a consulta prévia dependem da escolha da entidade adjudicante; há ainda escolhas por critérios materiais, independentes do valor (CCP, arts. 24.º a 27.º).",
    "Acima dos limiares europeus, o anúncio do concurso é publicado também no Jornal Oficial da UE — confirmar os limiares em vigor.",
    anterior
      ? `Procedimento iniciado antes de ${INICIO_DL_177_2026}: aplicam-se os limiares anteriores ao DL 177/2026.`
      : `Limiares do DL 177/2026, para procedimentos iniciados a partir de ${INICIO_DL_177_2026}.`,
  ];
  return { valor, tipo, regime: anterior ? "anterior ao DL 177/2026" : "DL 177/2026", admissiveis, notas };
}

/** Texto para a tool e o CLI. */
export function textoProcedimentoCCP(r: ResultadoCCP): string {
  const tipo = r.tipo === "empreitada" ? "empreitada de obras públicas" : "aquisição de bens ou serviços";
  return [
    `Contrato de ${formatarEuros(r.valor)} (sem IVA) — ${tipo} (${r.regime})`,
    "",
    "Procedimentos admissíveis pelo valor:",
    ...r.admissiveis.map((a) => `- ${a.nome}${a.ate !== null ? ` (abaixo de ${formatarEuros(a.ate)})` : ""} — ${a.base}`),
    "",
    ...r.notas.map((n) => `• ${n}`),
  ].join("\n");
}
