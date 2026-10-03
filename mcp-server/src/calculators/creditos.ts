/**
 * Créditos laborais na cessação do contrato (proporcionais de férias, subsídio de
 * férias e subsídio de Natal; férias vencidas e não gozadas). Port de
 * `scripts/creditos_laborais.py`. (Stub — Phase 4; implementação na tarefa 20.)
 */

export interface ParamsCreditos {
  retribuicaoBase: number;
  diuturnidades?: number;
  dataAdmissao: Date;
  dataCessacao: Date;
  feriasVencidasNaoGozadas?: number;
  subsidioFeriasVencidoEmFalta?: boolean;
}

export interface ResultadoCreditos {
  diasServicoAno: number;
  diasAno: number;
  fracao: number;
  proporcionalFerias: number;
  proporcionalSubsidioFerias: number;
  proporcionalSubsidioNatal: number;
  feriasVencidas: number;
  subsidioFeriasVencido: number;
  total: number;
  limite245n3: boolean;
}

export function calcularCreditosCessacao(_p: ParamsCreditos): ResultadoCreditos {
  throw new Error("não implementado");
}
