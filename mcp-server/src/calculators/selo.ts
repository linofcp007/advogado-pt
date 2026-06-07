/**
 * Calculadora de Imposto do Selo em heranças (Portugal).
 *
 * Porta de `scripts/imposto_selo_heranca.py`. Calcula o Imposto do Selo (IS)
 * devido na transmissão gratuita de bens por herança (verba 1.2 da TGIS).
 *
 *   - Cônjuge / unido de facto, descendentes e ascendentes: ISENTOS do IS de
 *     10% sobre a transmissão.
 *   - Outros herdeiros: 10% sobre o valor dos bens.
 *   - Com imóvel na herança: acresce 0,8% sobre o VPT do imóvel,
 *     independentemente do grau de parentesco.
 */

type Herdeiro = "conjuge" | "descendente" | "ascendente" | "outro";

const TAXA_TRANSMISSAO = 0.1; // 10% — verba 1.2 TGIS
const TAXA_IMOVEL = 0.008; // 0,8% sobre o VPT do imóvel

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
  vptImovel: number
): { isTransmissao: number; isImovel: number; total: number; isento: boolean } {
  const isento = HERDEIROS_ISENTOS.has(herdeiro);
  const isTransmissao = isento ? 0.0 : valor * TAXA_TRANSMISSAO;
  const isImovel = incluiImovel ? vptImovel * TAXA_IMOVEL : 0.0;
  const total = isTransmissao + isImovel;
  return { isTransmissao, isImovel, total, isento };
}
