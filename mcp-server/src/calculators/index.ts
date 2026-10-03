/**
 * Reexporta todas as calculadoras jurídicas portadas para TypeScript.
 *
 * Porta das calculadoras Python em `scripts/`. Imports relativos usam extensão
 * `.js` por causa de `module: Node16` no tsconfig.
 */

export { formatarEuros } from "./format.js";
export { calcularJuros, memoriaJuros, taxaDoSemestre, TAXAS_SEMESTRAIS } from "./juros.js";
export { calcularJurosLote, memoriaJurosLote, INDEMNIZACAO_COBRANCA } from "./juros-lote.js";
export type { FaturaLote, ResultadoLote } from "./juros-lote.js";
export type { TipoJuros, ResultadoJuros, TramoJuros } from "./juros.js";
export { contarPrazo, emFeriasJudiciais } from "./prazos.js";
export type { TipoPrazo, ResultadoPrazo } from "./prazos.js";
export { parseDataEstrita, hojeLisboa } from "./datas.js";
export { r2 } from "./arredondar.js";
export {
  calcularCompensacao,
  COMPENSACAO_MODALIDADES,
} from "./compensacao.js";
export { custasInjuncao } from "./injuncao.js";
export { impostoSeloHeranca } from "./selo.js";
export { calcularIMT } from "./imt.js";
export {
  calcularPrescricao,
  addAnos,
  addMeses,
  PRESCRICAO_TIPOS,
} from "./prescricao.js";
export { calcularIRSSimplificado } from "./irs.js";
export { calcularCreditosCessacao } from "./creditos.js";
export { calcularLegitima } from "./legitima.js";
export { calcularCompensacaoPorDatas } from "./compensacao.js";
export { calcularSalarioLiquido, calcularCustoTrabalhador } from "./salario.js";
export { calcularIRC } from "./irc.js";
export { calcularTaxaJustica } from "./taxa-justica.js";
export { decidirIVA } from "./iva.js";
export { calcularProcedimentoCCP, textoProcedimentoCCP, INICIO_DL_177_2026 } from "./ccp.js";
export type { ResultadoCCP, TipoContratoCCP } from "./ccp.js";
