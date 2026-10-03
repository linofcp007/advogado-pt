/**
 * IRC estimado de um período (2026 e seguintes): taxa geral e PME, dedução de prejuízos,
 * derrama municipal, derrama estadual e tributações autónomas.
 *
 * - Taxa geral: 19% em 2026, 18% em 2027, 17% desde 2028 (Lei 64/2025, art. 3.º);
 *   PME/Small Mid Cap: 15% nos primeiros 50.000 € de matéria coletável (CIRC 87.º, n.º 2).
 * - Prejuízos: dedução até 65% do lucro tributável (CIRC 52.º, n.º 2).
 * - Derrama municipal: até 1,5% do lucro tributável (Lei 73/2013, art. 18.º).
 * - Derrama estadual (CIRC 87.º-A): 3% de 1,5 a 7,5 M€, 5% de 7,5 a 35 M€, 9% acima.
 * - Tributação autónoma (CIRC 88.º): viaturas 8/25/32% (PHEV/GNV 2,5/7,5/15%; elétricas 10%
 *   só acima de 62.500 €), representação 10%, ajudas de custo 5%, não documentadas 50%;
 *   +10 p.p. com prejuízo fiscal (n.º 14), salvo as exceções (ver `isentoAgravamento`).
 *
 * Igual a skills/advogado-pt/scripts/irc.py.
 */

export interface Viatura {
  custoAquisicao: number;
  tipo: "combustao" | "phev" | "gnv" | "eletrico";
  /** Encargos do ano (depreciações, combustível, seguro, manutenção, rendas...). */
  encargos: number;
}

export interface ParamsIRC {
  lucroTributavel: number;
  prejuizosDedutiveis?: number;
  pme: boolean;
  /** Taxa da derrama municipal (ex.: 0,015 = 1,5%). */
  derramaMunicipal: number;
  despesasRepresentacao?: number;
  viaturas?: Viatura[];
  ajudasCusto?: number;
  despesasNaoDocumentadas?: number;
  /** Sem agravamento de 10 p.p. apesar do prejuízo (início de atividade e 2 anos seguintes; em 2026, lucro num dos 3 anos anteriores com declarações cumpridas). */
  isentoAgravamento?: boolean;
  /** Ano do período de tributação (por defeito 2026). */
  ano?: number;
}

export interface ResultadoIRC {
  materiaColetavel: number;
  deducaoPrejuizos: number;
  irc: number;
  derramaMunicipal: number;
  derramaEstadual: number;
  tributacaoAutonoma: number;
  total: number;
  taxaGeral: number;
}

const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

export const VIATURA_LIMITES = [37500, 45000] as const;
export const VIATURA_ELETRICA_LIMITE = 62500;
const TAXAS_VIATURA: Record<"combustao" | "phev" | "gnv", [number, number, number]> = {
  combustao: [8, 25, 32],
  phev: [2.5, 7.5, 15],
  gnv: [2.5, 7.5, 15],
};

/** Taxa geral de IRC do ano (Lei 64/2025, art. 3.º). */
export function taxaGeralIRC(ano: number): number {
  if (!Number.isInteger(ano) || ano < 2026) {
    throw new Error(`Ano não suportado: ${ano} (a calculadora cobre 2026 e seguintes).`);
  }
  return ano === 2026 ? 19 : ano === 2027 ? 18 : 17;
}

function naoNeg(nome: string, v: number | undefined): number {
  const x = Number(v ?? 0);
  if (!Number.isFinite(x) || x < 0) throw new Error(`${nome} tem de ser um valor ≥ 0.`);
  return x;
}

function taxaViatura(v: Viatura): number {
  const custo = naoNeg("custoAquisicao", v.custoAquisicao);
  if (v.tipo === "eletrico") return custo > VIATURA_ELETRICA_LIMITE ? 10 : 0;
  const taxas = TAXAS_VIATURA[v.tipo];
  if (!taxas) throw new Error(`Tipo de viatura inválido: '${v.tipo}' (combustao, phev, gnv ou eletrico).`);
  return custo < VIATURA_LIMITES[0] ? taxas[0] : custo < VIATURA_LIMITES[1] ? taxas[1] : taxas[2];
}

export function calcularIRC(p: ParamsIRC): ResultadoIRC {
  const lucro = Number(p.lucroTributavel);
  if (!Number.isFinite(lucro)) throw new Error("O lucro tributável (lucroTributavel) tem de ser um número.");
  const dm = Number(p.derramaMunicipal);
  if (!Number.isFinite(dm) || dm < 0 || dm > 0.015) {
    throw new Error("A derrama municipal tem de ser uma taxa entre 0 e 0,015 (1,5%).");
  }
  const taxaGeral = taxaGeralIRC(p.ano ?? 2026);
  const prejuizos = naoNeg("prejuizosDedutiveis", p.prejuizosDedutiveis);

  const deducaoPrejuizos = lucro > 0 ? r2(Math.min(prejuizos, lucro * 0.65)) : 0;
  const materiaColetavel = r2(Math.max(0, lucro - deducaoPrejuizos));
  const irc = p.pme
    ? r2(Math.min(materiaColetavel, 50000) * 0.15 + Math.max(0, materiaColetavel - 50000) * (taxaGeral / 100))
    : r2(materiaColetavel * (taxaGeral / 100));
  const derramaMunicipal = lucro > 0 ? r2(lucro * dm) : 0;
  const derramaEstadual = r2(
    Math.max(0, Math.min(lucro, 7.5e6) - 1.5e6) * 0.03 +
      Math.max(0, Math.min(lucro, 35e6) - 7.5e6) * 0.05 +
      Math.max(0, lucro - 35e6) * 0.09
  );

  const agravamento = lucro < 0 && !p.isentoAgravamento ? 10 : 0;
  const ta = (base: number, taxa: number) => (taxa > 0 ? base * ((taxa + agravamento) / 100) : 0);
  let tributacaoAutonoma =
    ta(naoNeg("despesasRepresentacao", p.despesasRepresentacao), 10) +
    ta(naoNeg("ajudasCusto", p.ajudasCusto), 5) +
    ta(naoNeg("despesasNaoDocumentadas", p.despesasNaoDocumentadas), 50);
  for (const v of p.viaturas ?? []) tributacaoAutonoma += ta(naoNeg("encargos", v.encargos), taxaViatura(v));
  tributacaoAutonoma = r2(tributacaoAutonoma);

  return {
    materiaColetavel,
    deducaoPrejuizos,
    irc,
    derramaMunicipal,
    derramaEstadual,
    tributacaoAutonoma,
    total: r2(irc + derramaMunicipal + derramaEstadual + tributacaoAutonoma),
    taxaGeral,
  };
}
