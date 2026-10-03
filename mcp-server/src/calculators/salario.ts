// Salário líquido e custo do trabalhador (2026). Stub — Phase 4 (tarefas 14-15).
export type TabelaRetencao = "I" | "II" | "III";
export interface ParamsSalario { bruto: number; tabela: TabelaRetencao; dependentes: number; subsidioRefeicaoDia?: number; diasRefeicao?: number; refeicaoCartao?: boolean }
export interface ResultadoSalario { rendimentoTributavel: number; segurancaSocial: number; taxaMarginal: number; retencaoIRS: number; refeicaoIsenta: number; refeicaoTributavel: number; liquido: number }
export function calcularSalarioLiquido(_p: ParamsSalario): ResultadoSalario { throw new Error("não implementado"); }
export interface ParamsCusto { base: number; diuturnidades?: number; subsidioRefeicaoDia?: number; diasRefeicaoMes?: number; mesesRefeicao?: number; refeicaoCartao?: boolean; taxaSeguroAT?: number }
export interface ResultadoCusto { retribuicaoAnual: number; tsuAnual: number; refeicaoAnual: number; seguroAnual: number; total: number; mensalMedio: number }
export function calcularCustoTrabalhador(_p: ParamsCusto): ResultadoCusto { throw new Error("não implementado"); }
