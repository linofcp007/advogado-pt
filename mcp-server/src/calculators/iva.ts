// Decisor de IVA em operações internacionais. Stub — Phase 4 (tarefa 17).
export interface ParamsIVA { tipo: "bens" | "servicos"; cliente: "empresa" | "consumidor"; destino: "PT" | "UE" | "fora-UE"; nifVIES?: boolean; vendasDistanciaUE?: number; servico?: "geral" | "eletronico" | "imovel" | "evento" | "transporte-passageiros" | "restauracao"; regime53?: boolean }
export interface DecisaoIVA { tributacao: string; liquida: string; codigo: string | null; mencaoFatura: string | null; declaracoes: string[]; base: string; avisos: string[] }
export function decidirIVA(_p: ParamsIVA): DecisaoIVA { throw new Error("não implementado"); }
