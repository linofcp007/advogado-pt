/**
 * Calculadora de juros de mora (Portugal).
 *
 * Porta de `scripts/juros_mora.py`. Calcula juros de mora simples sobre um
 * capital em dívida, entre uma data de início e uma data de fim, aplicando a
 * taxa comercial (DL 62/2013) ou a taxa civil (Portaria 291/2003).
 *
 *   juros = capital * taxa_anual * (dias / 365)
 *   total = capital + juros
 *
 * Os dias são contados como dias corridos entre as duas datas (em UTC, para
 * evitar desvios de fuso).
 */

// Taxas anuais embebidas (1.º semestre de 2026).
const TAXAS: Record<"comercial" | "civil", number> = {
  comercial: 0.1015, // 10,15%/ano — DL 62/2013, transações comerciais
  civil: 0.04, // 4%/ano — Portaria 291/2003
};

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Número de dias corridos entre duas datas, em UTC. */
function diasCorridos(inicio: Date, fim: Date): number {
  const inicioUTC = Date.UTC(
    inicio.getUTCFullYear(),
    inicio.getUTCMonth(),
    inicio.getUTCDate()
  );
  const fimUTC = Date.UTC(
    fim.getUTCFullYear(),
    fim.getUTCMonth(),
    fim.getUTCDate()
  );
  return Math.round((fimUTC - inicioUTC) / MS_POR_DIA);
}

export function calcularJuros(
  capital: number,
  dataInicio: Date,
  dataFim: Date,
  tipo: "comercial" | "civil"
): { dias: number; taxa: number; juros: number; total: number } {
  if (!(tipo in TAXAS)) {
    throw new Error(`Tipo desconhecido: ${tipo}`);
  }
  const dias = diasCorridos(dataInicio, dataFim);
  if (dias < 0) {
    throw new Error("A data de fim é anterior à data de início.");
  }
  const taxa = TAXAS[tipo];
  const juros = capital * taxa * (dias / 365);
  const total = capital + juros;
  return { dias, taxa, juros, total };
}
