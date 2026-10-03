/**
 * Reexporta todas as calculadoras jurídicas portadas para TypeScript.
 *
 * Porta das calculadoras Python em `scripts/`. Imports relativos usam extensão
 * `.js` por causa de `module: Node16` no tsconfig.
 */

export { formatarEuros } from "./format.js";
export { calcularJuros, memoriaJuros, taxaDoSemestre, TAXAS_SEMESTRAIS } from "./juros.js";
export type { TipoJuros, ResultadoJuros, TramoJuros } from "./juros.js";
export { contarPrazo } from "./prazos.js";
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
