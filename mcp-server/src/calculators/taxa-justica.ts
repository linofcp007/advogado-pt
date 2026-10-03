/**
 * Taxa de justiça pelo valor da causa — Regulamento das Custas Processuais, art. 6.º e Tabela I
 * (colunas A, B e C). UC de 2026: 102 € (congelada — OE 2026, art. 242.º).
 *
 * - Até 275.000 €: escalões da Tabela I (taxa inicial).
 * - Acima: +3 UC (A), 1,5 UC (B) ou 4,5 UC (C) por cada 25.000 € ou fração — o remanescente,
 *   considerado na conta a final e dispensável pelo juiz (art. 6.º, n.º 7).
 * - Redução a 90% quando a entrega eletrónica NÃO é obrigatória e a parte entrega todas as peças
 *   por via eletrónica (art. 6.º, n.ºs 3 e 4) — aplicada só à taxa inicial.
 *
 * Igual a skills/advogado-pt/scripts/taxa_justica.py.
 */

import { formatarEuros } from "./format.js";

export interface ResultadoTaxaJustica {
  ucValor: number;
  escalao: string;
  taxaInicialUC: number;
  remanescenteUC: number;
  totalUC: number;
  taxaInicialEuros: number;
  totalEuros: number;
}

export const UC_2026 = 102;

const LIMITES = [2000, 8000, 16000, 24000, 30000, 40000, 60000, 80000, 100000, 150000, 200000, 250000, 275000];
const UC_COLUNA_A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16];
const FATOR: Record<"A" | "B" | "C", number> = { A: 1, B: 0.5, C: 1.5 };

const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
const fmt = (v: number) => formatarEuros(v).replace(/\s*€$/, "");

export function calcularTaxaJustica(
  valorAcao: number,
  opts: { tabela?: "A" | "B" | "C"; reducaoEletronica?: boolean; uc?: number } = {}
): ResultadoTaxaJustica {
  const valor = Number(valorAcao);
  if (!Number.isFinite(valor) || valor <= 0) throw new Error("O valor da ação tem de ser um número > 0.");
  const col = opts.tabela ?? "A";
  if (!(col in FATOR)) throw new Error(`Coluna inválida: '${col}' (A, B ou C).`);
  const uc = opts.uc ?? UC_2026;
  const f = FATOR[col];
  const i = LIMITES.findIndex((l) => valor <= l);
  const idx = i === -1 ? LIMITES.length - 1 : i;
  const taxaInicialUC = UC_COLUNA_A[idx] * f;
  const remanescenteUC = valor > 275000 ? Math.ceil((valor - 275000) / 25000) * 3 * f : 0;
  const totalUC = taxaInicialUC + remanescenteUC;
  const escalao =
    i === -1
      ? "Acima de 275.000,00 €"
      : idx === 0
        ? "Até 2.000,00 €"
        : `De ${fmt(LIMITES[idx - 1] + 0.01)} € a ${fmt(LIMITES[idx])} €`;
  const reducao = opts.reducaoEletronica ? 0.9 : 1;
  const taxaInicialEuros = r2(taxaInicialUC * uc * reducao);
  return {
    ucValor: uc,
    escalao,
    taxaInicialUC,
    remanescenteUC,
    totalUC,
    taxaInicialEuros,
    totalEuros: r2(taxaInicialEuros + remanescenteUC * uc),
  };
}
