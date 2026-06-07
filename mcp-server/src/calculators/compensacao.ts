/**
 * Calculadora de compensação por cessação de contrato de trabalho (Portugal).
 *
 * Porta de `scripts/compensacao_despedimento.py`. Calcula a compensação devida
 * ao trabalhador por cessação do contrato (Art. 366.º CT, valores desde
 * 01/05/2023).
 *
 *   base = retribuicao_base + diuturnidades
 *   compensacao = base / 30 * dias_por_ano * anos
 *
 * Mínimo de 3 meses de (RB + diuturnidades) nas modalidades sem-termo,
 * extincao-posto e coletivo (não se aplica a contratos a termo).
 */

type Modalidade = "sem-termo" | "extincao-posto" | "coletivo" | "termo";

// Dias de retribuição por ano de antiguidade, por modalidade (desde 01/05/2023).
const DIAS_POR_ANO: Record<Modalidade, number> = {
  "sem-termo": 14,
  "extincao-posto": 12,
  coletivo: 14,
  termo: 24,
};

// Modalidades sujeitas ao mínimo legal de 3 meses de (RB + diuturnidades).
const COM_MINIMO: Set<Modalidade> = new Set([
  "sem-termo",
  "extincao-posto",
  "coletivo",
]);

export const COMPENSACAO_MODALIDADES: string[] = Object.keys(DIAS_POR_ANO);

export function calcularCompensacao(
  retribuicaoBase: number,
  diuturnidades: number,
  anos: number,
  modalidade: Modalidade
): { diasAno: number; bruto: number; minimoAplicado: boolean } {
  if (!(modalidade in DIAS_POR_ANO)) {
    throw new Error(`Modalidade desconhecida: ${modalidade}`);
  }
  const base = retribuicaoBase + diuturnidades;
  const diasAno = DIAS_POR_ANO[modalidade];
  let bruto = (base / 30) * diasAno * anos;

  let minimoAplicado = false;
  if (COM_MINIMO.has(modalidade)) {
    const minimo = base * 3; // 3 meses de RB + diuturnidades
    if (bruto < minimo) {
      bruto = minimo;
      minimoAplicado = true;
    }
  }

  return { diasAno, bruto, minimoAplicado };
}
