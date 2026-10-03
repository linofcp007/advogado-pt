// IRC 2026 (taxa normal/PME, derramas, tributação autónoma). Stub — Phase 4 (tarefa 16).
export interface Viatura { custoAquisicao: number; tipo: "combustao" | "phev" | "gnv" | "eletrico"; encargos: number }
export interface ParamsIRC { lucroTributavel: number; prejuizosDedutiveis?: number; pme: boolean; derramaMunicipal: number; despesasRepresentacao?: number; viaturas?: Viatura[]; ajudasCusto?: number; despesasNaoDocumentadas?: number; isentoAgravamento?: boolean }
export interface ResultadoIRC { materiaColetavel: number; deducaoPrejuizos: number; irc: number; derramaMunicipal: number; derramaEstadual: number; tributacaoAutonoma: number; total: number }
export function calcularIRC(_p: ParamsIRC): ResultadoIRC { throw new Error("não implementado"); }
