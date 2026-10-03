/**
 * Legítima e quota disponível (Código Civil, arts. 2156.º a 2162.º).
 *
 * Port de `scripts/legitima.py` — os dois têm de dar os mesmos resultados.
 *
 * Valor da herança para cálculo da legítima (art. 2162.º): bens existentes à data da
 * morte + bens doados − dívidas da herança.
 *
 * Fração da legítima:
 *   - cônjuge + filhos ............ 2/3 (art. 2159.º, n.º 1)
 *   - só filhos ................... 1/2 se 1 filho; 2/3 se 2 ou mais (art. 2159.º, n.º 2)
 *   - só cônjuge .................. 1/2 (art. 2158.º)
 *   - cônjuge + ascendentes ....... 2/3 (art. 2161.º, n.º 1)
 *   - só ascendentes .............. 1/2 se pais; 1/3 se ascendentes do 2.º grau e seguintes (art. 2161.º, n.º 2)
 *   - sem herdeiros legitimários .. 0 (tudo é quota disponível)
 *
 * Divisão da legítima entre os herdeiros (regras da sucessão legítima, art. 2157.º):
 *   - cônjuge + filhos: por cabeça, mas o cônjuge nunca menos de 1/4 (art. 2139.º, n.º 1)
 *   - cônjuge + ascendentes: 2/3 cônjuge, 1/3 ascendentes (art. 2142.º, n.º 1)
 *
 * Simplificações (avisadas no resultado): "filhos" conta estirpes — netos de um filho
 * pré-falecido herdam por representação a parte desse filho; não trata repúdio,
 * indignidade, colação nem a imputação das liberalidades.
 */

export type Ascendentes = "nenhum" | "pais" | "outros";

export interface ParamsLegitima {
  bens: number;
  doacoes?: number;
  dividas?: number;
  conjuge: boolean;
  filhos: number;
  ascendentes?: Ascendentes;
}

export interface ParteLegitima {
  herdeiro: string;
  fracaoDaLegitima: number;
  valor: number;
}

export interface ResultadoLegitima {
  valorHeranca: number;
  fracaoLegitima: number;
  legitima: number;
  quotaDisponivel: number;
  quotaDisponivelPct: number;
  partes: ParteLegitima[];
  fundamento: string;
  avisos: string[];
}

export function calcularLegitima(p: ParamsLegitima): ResultadoLegitima {
  const doacoes = p.doacoes ?? 0;
  const dividas = p.dividas ?? 0;
  const asc: Ascendentes = p.ascendentes ?? "nenhum";
  if (!(p.bens >= 0)) throw new Error("O valor dos bens tem de ser positivo.");
  if (!(doacoes >= 0)) throw new Error("O valor das doações não pode ser negativo.");
  if (!(dividas >= 0)) throw new Error("O valor das dívidas não pode ser negativo.");
  if (!Number.isInteger(p.filhos) || p.filhos < 0) {
    throw new Error("O número de filhos tem de ser um inteiro >= 0.");
  }
  if (!["nenhum", "pais", "outros"].includes(asc)) {
    throw new Error(`Ascendentes inválidos: ${asc} (usa nenhum, pais ou outros).`);
  }

  const avisos: string[] = [];
  let valorHeranca = p.bens + doacoes - dividas;
  if (valorHeranca < 0) {
    avisos.push("As dívidas excedem bens + doações: valor da herança considerado 0.");
    valorHeranca = 0;
  }

  let fracaoLegitima = 0;
  let fundamento = "Sem herdeiros legitimários: toda a herança é quota disponível.";
  const partes: Array<{ herdeiro: string; fracaoDaLegitima: number }> = [];

  if (p.filhos > 0 && p.conjuge) {
    fracaoLegitima = 2 / 3;
    fundamento = "Cônjuge e filhos: legítima de 2/3 (art. 2159.º, n.º 1, CC); divisão por cabeça com mínimo de 1/4 para o cônjuge (art. 2139.º, n.º 1).";
    const cab = 1 / (p.filhos + 1);
    const fConj = Math.max(cab, 1 / 4);
    const fFilho = (1 - fConj) / p.filhos;
    partes.push({ herdeiro: "cônjuge", fracaoDaLegitima: fConj });
    for (let i = 1; i <= p.filhos; i++) partes.push({ herdeiro: `filho ${i}`, fracaoDaLegitima: fFilho });
  } else if (p.filhos > 0) {
    fracaoLegitima = p.filhos === 1 ? 1 / 2 : 2 / 3;
    fundamento = `Só filhos (${p.filhos}): legítima de ${p.filhos === 1 ? "1/2" : "2/3"} (art. 2159.º, n.º 2, CC); divisão em partes iguais.`;
    for (let i = 1; i <= p.filhos; i++) partes.push({ herdeiro: `filho ${i}`, fracaoDaLegitima: 1 / p.filhos });
  } else if (p.conjuge && asc !== "nenhum") {
    fracaoLegitima = 2 / 3;
    fundamento = "Cônjuge e ascendentes: legítima de 2/3 (art. 2161.º, n.º 1, CC); 2/3 para o cônjuge e 1/3 para os ascendentes (art. 2142.º, n.º 1).";
    partes.push({ herdeiro: "cônjuge", fracaoDaLegitima: 2 / 3 });
    partes.push({ herdeiro: "ascendentes", fracaoDaLegitima: 1 / 3 });
  } else if (p.conjuge) {
    fracaoLegitima = 1 / 2;
    fundamento = "Só cônjuge: legítima de 1/2 (art. 2158.º CC).";
    partes.push({ herdeiro: "cônjuge", fracaoDaLegitima: 1 });
  } else if (asc !== "nenhum") {
    fracaoLegitima = asc === "pais" ? 1 / 2 : 1 / 3;
    fundamento = `Só ascendentes (${asc === "pais" ? "pais" : "2.º grau e seguintes"}): legítima de ${asc === "pais" ? "1/2" : "1/3"} (art. 2161.º, n.º 2, CC).`;
    partes.push({ herdeiro: "ascendentes", fracaoDaLegitima: 1 });
  }

  const legitima = valorHeranca * fracaoLegitima;
  const quotaDisponivel = valorHeranca - legitima;
  if (p.filhos > 0) {
    avisos.push(
      "Se algum filho já faleceu, os seus descendentes herdam por representação a parte dele (contar como 1 estirpe)."
    );
  }
  avisos.push(
    "Estimativa: não trata repúdio, indignidade, colação nem a imputação das doações na legítima — confirmar com advogado/notário."
  );

  return {
    valorHeranca,
    fracaoLegitima,
    legitima,
    quotaDisponivel,
    quotaDisponivelPct: (1 - fracaoLegitima) * 100,
    partes: partes.map((x) => ({ ...x, valor: legitima * x.fracaoDaLegitima })),
    fundamento,
    avisos,
  };
}
