/**
 * Salário líquido mensal e custo anual do trabalhador para a empresa (Continente, 2026).
 *
 * Retenção na fonte de IRS: Despacho n.º 233-A/2026 (tabelas I, II e III de trabalho
 * dependente; fórmula R × taxa − parcela a abater − parcela adicional × dependentes,
 * nunca negativa; com 3 ou mais dependentes, −1 p.p. na taxa — n.º 5, al. h)).
 * Segurança Social: 11% (trabalhador) e 23,75% (empregador).
 * Subsídio de refeição isento até 6,15 €/dia em numerário ou 10,46 €/dia em cartão
 * (Portaria 51-B/2026/1; art. 2.º, n.º 3, al. b), 2), CIRS); o excesso é rendimento
 * do trabalho (IRS e SS). Valores resumidos em references/valores-2026.md.
 *
 * Igual a skills/advogado-pt/scripts/salario_liquido.py.
 */

export type TabelaRetencao = "I" | "II" | "III";

export interface ParamsSalario {
  /** Retribuição mensal bruta (base + diuturnidades + outras prestações sujeitas). */
  bruto: number;
  tabela: TabelaRetencao;
  dependentes: number;
  subsidioRefeicaoDia?: number;
  diasRefeicao?: number;
  refeicaoCartao?: boolean;
}

export interface ResultadoSalario {
  rendimentoTributavel: number;
  segurancaSocial: number;
  taxaMarginal: number;
  retencaoIRS: number;
  refeicaoIsenta: number;
  refeicaoTributavel: number;
  liquido: number;
}

export const TSU_TRABALHADOR = 0.11;
export const TSU_EMPREGADOR = 0.2375;
export const REFEICAO_LIMITE_NUMERARIO = 6.15;
export const REFEICAO_LIMITE_CARTAO = 10.46;

/** Parcela a abater: valor fixo ou fórmula "taxa × k × (L − R)" dos primeiros escalões. */
type Parcela = number | { taxa: number; k: number; l: number };

interface Escalao {
  ate: number; // Infinity no último
  taxa: number; // %
  parcela: Parcela;
}

interface Tabela {
  escaloes: Escalao[];
  adicional: number; // parcela adicional por dependente
}

// Despacho n.º 233-A/2026 — tabelas para o Continente (trabalho dependente).
const ESC_I_II: Escalao[] = [
  { ate: 920, taxa: 0, parcela: 0 },
  { ate: 1042, taxa: 12.5, parcela: { taxa: 12.5, k: 2.6, l: 1273.85 } },
  { ate: 1108, taxa: 15.7, parcela: { taxa: 15.7, k: 1.35, l: 1554.83 } },
  { ate: 1154, taxa: 15.7, parcela: 94.71 },
  { ate: 1212, taxa: 21.2, parcela: 158.18 },
  { ate: 1819, taxa: 24.1, parcela: 193.33 },
  { ate: 2119, taxa: 31.1, parcela: 320.66 },
  { ate: 2499, taxa: 34.9, parcela: 401.19 },
  { ate: 3305, taxa: 38.36, parcela: 487.66 },
  { ate: 5547, taxa: 39.69, parcela: 531.62 },
  { ate: 20221, taxa: 44.95, parcela: 823.4 },
  { ate: Infinity, taxa: 47.17, parcela: 1272.31 },
];

const TABELAS: Record<TabelaRetencao, Tabela> = {
  I: { escaloes: ESC_I_II, adicional: 21.43 }, // não casado sem dependentes / casado dois titulares
  II: { escaloes: ESC_I_II, adicional: 34.29 }, // não casado com dependentes
  III: {
    // casado, único titular
    adicional: 42.86,
    escaloes: [
      { ate: 991, taxa: 0, parcela: 0 },
      { ate: 1042, taxa: 12.5, parcela: { taxa: 12.5, k: 2.6, l: 1372.15 } },
      { ate: 1108, taxa: 12.5, parcela: { taxa: 12.5, k: 1.35, l: 1677.85 } },
      { ate: 1119, taxa: 12.5, parcela: 96.17 },
      { ate: 1432, taxa: 12.72, parcela: 98.64 },
      { ate: 1962, taxa: 15.7, parcela: 141.32 },
      { ate: 2240, taxa: 19.38, parcela: 213.53 },
      { ate: 2773, taxa: 22.77, parcela: 289.47 },
      { ate: 3389, taxa: 25.7, parcela: 370.72 },
      { ate: 5965, taxa: 28.81, parcela: 476.12 },
      { ate: 20265, taxa: 38.43, parcela: 1049.96 },
      { ate: Infinity, taxa: 47.17, parcela: 2821.13 },
    ],
  },
};

const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

function retencao(r: number, tabela: TabelaRetencao, dependentes: number): { valor: number; taxa: number } {
  const t = TABELAS[tabela];
  const e = t.escaloes.find((x) => r <= x.ate)!;
  if (e.taxa === 0) return { valor: 0, taxa: 0 };
  const taxa = dependentes >= 3 ? e.taxa - 1 : e.taxa; // n.º 5, al. h)
  const parcela =
    typeof e.parcela === "number" ? e.parcela : (e.parcela.taxa / 100) * e.parcela.k * (e.parcela.l - r);
  const valor = r * (taxa / 100) - parcela - t.adicional * dependentes;
  return { valor: Math.max(0, r2(valor)), taxa };
}

function refeicao(dia: number, dias: number, cartao: boolean): { isenta: number; tributavel: number; total: number } {
  const limite = cartao ? REFEICAO_LIMITE_CARTAO : REFEICAO_LIMITE_NUMERARIO;
  const total = dia * dias;
  const isenta = Math.min(dia, limite) * dias;
  return { isenta: r2(isenta), tributavel: r2(total - isenta), total: r2(total) };
}

/** Salário líquido mensal (retenção de IRS de 2026 + SS 11%). Subsídios de férias/Natal: retenção autónoma. */
export function calcularSalarioLiquido(p: ParamsSalario): ResultadoSalario {
  const bruto = Number(p.bruto);
  if (!Number.isFinite(bruto) || bruto < 0) throw new Error("O vencimento bruto (bruto) tem de ser um valor ≥ 0.");
  if (!Number.isInteger(p.dependentes) || p.dependentes < 0) {
    throw new Error("O número de dependentes tem de ser um inteiro ≥ 0.");
  }
  if (!(p.tabela in TABELAS)) throw new Error(`Tabela de retenção inválida: '${p.tabela}' (I, II ou III).`);
  const dia = Number(p.subsidioRefeicaoDia ?? 0);
  const dias = Number(p.diasRefeicao ?? 0);
  if (!(dia >= 0) || !(dias >= 0)) throw new Error("Subsídio de refeição e dias têm de ser ≥ 0.");
  const ref = refeicao(dia, dias, Boolean(p.refeicaoCartao));
  const rendimentoTributavel = r2(bruto + ref.tributavel);
  const segurancaSocial = r2(rendimentoTributavel * TSU_TRABALHADOR);
  const irs = retencao(rendimentoTributavel, p.tabela, p.dependentes);
  return {
    rendimentoTributavel,
    segurancaSocial,
    taxaMarginal: irs.taxa,
    retencaoIRS: irs.valor,
    refeicaoIsenta: ref.isenta,
    refeicaoTributavel: ref.tributavel,
    liquido: r2(bruto + ref.total - segurancaSocial - irs.valor),
  };
}

export interface ParamsCusto {
  base: number;
  diuturnidades?: number;
  subsidioRefeicaoDia?: number;
  diasRefeicaoMes?: number;
  mesesRefeicao?: number;
  refeicaoCartao?: boolean;
  /** Taxa do seguro de acidentes de trabalho sobre a retribuição anual (ex.: 0,01). */
  taxaSeguroAT?: number;
}

export interface ResultadoCusto {
  retribuicaoAnual: number;
  tsuAnual: number;
  refeicaoAnual: number;
  seguroAnual: number;
  total: number;
  mensalMedio: number;
}

/** Custo anual para a empresa: 14 retribuições + TSU 23,75% (incl. excesso de refeição) + refeição + seguro AT. */
export function calcularCustoTrabalhador(p: ParamsCusto): ResultadoCusto {
  const base = Number(p.base);
  if (!Number.isFinite(base) || base < 0) throw new Error("A retribuição base (base) tem de ser um valor ≥ 0.");
  const diut = Number(p.diuturnidades ?? 0);
  const dia = Number(p.subsidioRefeicaoDia ?? 0);
  const diasMes = Number(p.diasRefeicaoMes ?? 22);
  const meses = Number(p.mesesRefeicao ?? 11);
  const seguro = Number(p.taxaSeguroAT ?? 0);
  for (const [nome, v] of [["diuturnidades", diut], ["subsidioRefeicaoDia", dia], ["diasRefeicaoMes", diasMes], ["mesesRefeicao", meses], ["taxaSeguroAT", seguro]] as const) {
    if (!Number.isFinite(v) || v < 0) throw new Error(`${nome} tem de ser ≥ 0.`);
  }
  const retribuicaoAnual = r2((base + diut) * 14);
  const ref = refeicao(dia, diasMes * meses, Boolean(p.refeicaoCartao));
  const tsuAnual = r2((retribuicaoAnual + ref.tributavel) * TSU_EMPREGADOR);
  const seguroAnual = r2(retribuicaoAnual * seguro);
  const total = r2(retribuicaoAnual + tsuAnual + ref.total + seguroAnual);
  return { retribuicaoAnual, tsuAnual, refeicaoAnual: ref.total, seguroAnual, total, mensalMedio: total / 12 };
}
