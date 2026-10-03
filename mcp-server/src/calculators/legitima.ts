/**
 * Legítima e quota disponível (arts. 2156.º a 2162.º CC). Port de
 * `scripts/legitima.py`. (Stub — Phase 4; implementação na tarefa 21.)
 */

export type Ascendentes = "nenhum" | "pais" | "outros";

export interface ParamsLegitima {
  bens: number;
  doacoes?: number;
  dividas?: number;
  conjuge: boolean;
  filhos: number;
  ascendentes?: Ascendentes;
}

export interface ParteLegitima {
  herdeiro: string;
  fracaoDaLegitima: number;
  valor: number;
}

export interface ResultadoLegitima {
  valorHeranca: number;
  fracaoLegitima: number;
  legitima: number;
  quotaDisponivel: number;
  quotaDisponivelPct: number;
  partes: ParteLegitima[];
  fundamento: string;
  avisos: string[];
}

export function calcularLegitima(_p: ParamsLegitima): ResultadoLegitima {
  throw new Error("não implementado");
}
