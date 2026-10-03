// Taxa de justiça (RCP, Tabela I). Stub — Phase 4 (tarefa 21).
export interface ResultadoTaxaJustica { ucValor: number; escalao: string; taxaInicialUC: number; remanescenteUC: number; totalUC: number; taxaInicialEuros: number; totalEuros: number }
export function calcularTaxaJustica(_valorAcao: number, _opts: { tabela?: "A" | "B" | "C"; reducaoEletronica?: boolean } = {}): ResultadoTaxaJustica { throw new Error("não implementado"); }
