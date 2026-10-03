/**
 * Calculadora de Imposto do Selo em heranças (Portugal).
 *
 * Porta de `scripts/imposto_selo_heranca.py`. Calcula o Imposto do Selo (IS)
 * devido na transmissão gratuita de bens — herança ou doação (verba 1.2 da TGIS).
 *
 *   - Cônjuge / unido de facto, descendentes e ascendentes: ISENTOS do IS de
 *     10% sobre a transmissão (CIS, art. 6.º, al. e)).
 *   - Outros beneficiários: 10% sobre o valor dos bens.
 *   - Doação de imóvel: acresce 0,8% sobre o VPT (verba 1.1 — "aquisição onerosa
 *     ou por doação"), mesmo para os isentos da verba 1.2. Nas heranças (sucessão
 *     por morte) a verba 1.1 não se aplica.
 */

type Herdeiro = "conjuge" | "descendente" | "ascendente" | "outro";

const TAXA_TRANSMISSAO = 0.1; // 10% — verba 1.2 TGIS
const TAXA_IMOVEL = 0.008; // 0,8% sobre o VPT do imóvel — só nas doações (verba 1.1 TGIS)

// Herdeiros isentos do IS de 10% sobre a transmissão.
const HERDEIROS_ISENTOS: Set<Herdeiro> = new Set([
  "conjuge",
  "descendente",
  "ascendente",
]);

export function impostoSeloHeranca(
  valor: number,
  herdeiro: Herdeiro,
  incluiImovel: boolean,
  vptImovel: number,
  doacao = false
): { isTransmissao: number; isImovel: number; total: number; isento: boolean } {
  if (!Number.isFinite(valor) || valor < 0 || !Number.isFinite(vptImovel) || vptImovel < 0) {
    throw new Error("O valor dos bens e o VPT não podem ser negativos.");
  }
  const isento = HERDEIROS_ISENTOS.has(herdeiro);
  const isTransmissao = isento ? 0.0 : valor * TAXA_TRANSMISSAO;
  // Verba 1.1: só a aquisição onerosa ou por doação de imóveis; a herança não paga os 0,8%.
  const isImovel = doacao && incluiImovel ? vptImovel * TAXA_IMOVEL : 0.0;
  const total = isTransmissao + isImovel;
  return { isTransmissao, isImovel, total, isento };
}
