/**
 * Calculadora de IMT 2026 — Continente.
 *
 * Porta de `scripts/imt.py`. Calcula o IMT na aquisição onerosa de imóvel
 * urbano para habitação, com as tabelas de 2026 (Continente):
 *
 *   IMT = valor * taxa_marginal_do_escalão - parcela_a_abater
 *
 * A "parcela a abater" NÃO é hardcoded: é derivada por CONTINUIDADE. No limite
 * inferior de cada escalão, o IMT calculado pelo escalão atual coincide com o
 * IMT calculado pelo escalão anterior; daí extrai-se a parcela de cada escalão
 * (o primeiro escalão tem parcela 0).
 *
 * Acima dos escalões marginais aplicam-se TAXAS ÚNICAS sobre o valor total.
 *
 * Além do IMT, devolve o Imposto do Selo (0,8% sobre o valor) e o total de
 * impostos na aquisição.
 */

type TipoImt = "hpp" | "secundaria";

// Escalões marginais de 2026 (Continente): [limite_inf, limite_sup, taxa].
const ESCALOES: Record<TipoImt, Array<[number, number, number]>> = {
  hpp: [
    [0, 106346, 0.0],
    [106346, 145470, 0.02],
    [145470, 198347, 0.05],
    [198347, 330539, 0.07],
    [330539, 660982, 0.08],
  ],
  secundaria: [
    [0, 106346, 0.01],
    [106346, 145470, 0.02],
    [145470, 198347, 0.05],
    [198347, 330539, 0.07],
    [330539, 633931, 0.08],
  ],
};

// Taxas únicas (acima do último escalão marginal).
const TAXA_UNICA_6 = 0.06;
const TAXA_UNICA_75 = 0.075;
const LIMITE_UNICA_6 = 1150853; // acima deste valor, 7,5% único (ambos os tipos)

// Imposto do Selo na aquisição: 0,8% sobre o valor.
const TAXA_SELO = 0.008;

// Parâmetros do IMT Jovem (HPP).
const IMT_JOVEM_ISENCAO_TOTAL = 330539;
const IMT_JOVEM_LIMITE = 660982;
const IMT_JOVEM_TAXA = 0.08;

/**
 * Deriva a parcela a abater de cada escalão marginal por continuidade.
 *
 * No limite inferior `li` do escalão i (i > 0), o IMT pelo escalão anterior é
 * `li * taxa_(i-1) - parcela_(i-1)`. Para o escalão atual dar o mesmo IMT
 * nesse ponto: `parcela_i = li * taxa_i - imt_anterior`. O primeiro escalão
 * tem parcela 0.
 */
function parcelasAAbater(escaloes: Array<[number, number, number]>): number[] {
  const parcelas: number[] = [0.0];
  for (let i = 1; i < escaloes.length; i++) {
    const li = escaloes[i][0];
    const taxaAnterior = escaloes[i - 1][2];
    const imtAnterior = li * taxaAnterior - parcelas[i - 1];
    const taxaI = escaloes[i][2];
    parcelas.push(li * taxaI - imtAnterior);
  }
  return parcelas;
}

export function calcularIMT(
  valor: number,
  tipo: TipoImt,
  jovem: boolean
): {
  imt: number;
  taxa: number;
  parcela: number;
  regime: string;
  isento: boolean;
  selo: number;
  total: number;
} {
  if (!(tipo in ESCALOES)) {
    throw new Error(`Tipo desconhecido: ${tipo}`);
  }
  if (valor < 0) {
    throw new Error("O valor não pode ser negativo.");
  }

  const selo = valor * TAXA_SELO;
  const comTotais = (r: {
    imt: number;
    taxa: number;
    parcela: number;
    regime: string;
    isento: boolean;
  }) => ({ ...r, selo, total: r.imt + selo });

  // IMT Jovem só se aplica a habitação própria e permanente.
  if (jovem && tipo === "hpp") {
    if (valor <= IMT_JOVEM_ISENCAO_TOTAL) {
      return comTotais({
        imt: 0.0,
        taxa: 0.0,
        parcela: 0.0,
        isento: true,
        regime: "IMT Jovem — isenção total (valor <= 330.539 €)",
      });
    }
    if (valor <= IMT_JOVEM_LIMITE) {
      const imt = (valor - IMT_JOVEM_ISENCAO_TOTAL) * IMT_JOVEM_TAXA;
      return comTotais({
        imt,
        taxa: IMT_JOVEM_TAXA,
        parcela: 0.0,
        isento: false,
        regime: "IMT Jovem — isenção parcial: (valor - 330.539) * 8%",
      });
    }
    // valor > 660.982: sem isenção; segue o regime normal de HPP.
  }

  const escaloes = ESCALOES[tipo];
  const limiteTopoMarginal = escaloes[escaloes.length - 1][1];

  // Taxas únicas acima do último escalão marginal.
  if (valor > limiteTopoMarginal) {
    if (valor <= LIMITE_UNICA_6) {
      const imt = valor * TAXA_UNICA_6;
      return comTotais({
        imt,
        taxa: TAXA_UNICA_6,
        parcela: 0.0,
        isento: false,
        regime: "Taxa única de 6% sobre o valor total",
      });
    }
    const imt = valor * TAXA_UNICA_75;
    return comTotais({
      imt,
      taxa: TAXA_UNICA_75,
      parcela: 0.0,
      isento: false,
      regime: "Taxa única de 7,5% sobre o valor total",
    });
  }

  // Escalões marginais.
  const parcelas = parcelasAAbater(escaloes);
  for (let i = 0; i < escaloes.length; i++) {
    const [lo, hi, taxa] = escaloes[i];
    // Cada escalão cobre o intervalo (lo, hi]; o primeiro inclui o 0.
    if ((lo < valor && valor <= hi) || (i === 0 && valor <= hi)) {
      const parcela = parcelas[i];
      const imt = valor * taxa - parcela;
      const regime = `Escalão marginal de ${(taxa * 100)
        .toFixed(0)
        .replace(".", ",")}%`;
      return comTotais({
        imt,
        taxa,
        parcela,
        isento: imt === 0.0,
        regime,
      });
    }
  }

  throw new Error("Valor fora dos intervalos previstos.");
}
