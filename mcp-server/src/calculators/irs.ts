/**
 * Rendimento tributável no regime simplificado de IRS (Categoria B / ENI).
 *
 * Porta de `scripts/irs_simplificado.py`. No regime simplificado, o rendimento
 * tributável da Categoria B obtém-se aplicando um COEFICIENTE ao rendimento
 * bruto anual, consoante o tipo de atividade (Art. 31.º CIRS). Calcula apenas o
 * rendimento tributável, NÃO o imposto final.
 *
 *   rendimento_tributavel = rendimento_bruto * coeficiente
 */

type TipoAtividade =
  | "mercadorias"
  | "servicos-151"
  | "servicos-outros"
  | "propriedade-intelectual";

// Coeficientes do regime simplificado (Art. 31.º CIRS).
const COEFICIENTES: Record<TipoAtividade, number> = {
  mercadorias: 0.15,
  "servicos-151": 0.75,
  "servicos-outros": 0.35,
  "propriedade-intelectual": 0.5,
};

export function calcularIRSSimplificado(
  rendimento: number,
  tipo: TipoAtividade
): { coeficiente: number; tributavel: number } {
  if (!(tipo in COEFICIENTES)) {
    throw new Error(`Tipo desconhecido: ${tipo}`);
  }
  if (rendimento < 0) {
    throw new Error("O rendimento não pode ser negativo.");
  }
  const coeficiente = COEFICIENTES[tipo];
  return { coeficiente, tributavel: rendimento * coeficiente };
}
