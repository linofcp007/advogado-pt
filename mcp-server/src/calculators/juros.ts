/**
 * Juros de mora (Portugal), calculados por TRAMOS SEMESTRAIS.
 *
 * Port de `scripts/juros_mora.py` — os dois têm de dar os mesmos resultados.
 *
 * A taxa comercial muda em cada semestre (aviso da Entidade do Tesouro e Finanças),
 * por isso o período de mora é dividido em tramos (cortes a 1 de janeiro e 1 de julho)
 * e cada tramo usa a taxa do seu semestre:
 *
 *   juros = Σ capital × taxa_do_semestre × dias_do_tramo / 365
 *
 * Tipos:
 *   - "comercial"        art. 102.º §5 CCom / DL 62/2013 (transações comerciais) = BCE + 8 p.p.
 *   - "comercial-geral"  art. 102.º §3 CCom (outros créditos de empresas)        = BCE + 7 p.p.
 *   - "civil"            4% — Portaria 291/2003
 *
 * Os dias são dias corridos (em UTC). Semestres posteriores ao último aviso conhecido
 * usam a última taxa publicada e ficam marcados como `estimado`.
 */

import { formatarEuros } from "./format.js";

export type TipoJuros = "comercial" | "comercial-geral" | "civil";

export interface TaxaSemestral {
  ano: number;
  semestre: 1 | 2;
  /** Taxa do art. 102.º §3 CCom (decimal). A do DL 62/2013 é esta + 0,01. */
  geral: number;
  aviso: string;
}

// Tabela §3 — Home Page Jurídica (avisos citados) e, para 2023-2026, confirmada no ECO,
// APCMC e SFJ. Ao sair um aviso novo: acrescentar aqui, em scripts/juros_mora.py e em
// references/valores-2026.md.
const H = (ano: number, semestre: 1 | 2, geral: number, aviso: string): TaxaSemestral => ({
  ano,
  semestre,
  geral,
  aviso,
});

export const TAXAS_SEMESTRAIS: readonly TaxaSemestral[] = [
  H(2013, 2, 0.075, "Aviso n.º 10478/2013"),
  H(2014, 1, 0.0725, "Aviso n.º 1019/2014"),
  H(2014, 2, 0.0715, "Aviso n.º 8266/2014"),
  H(2015, 1, 0.0705, "Aviso n.º 563/2015"),
  H(2015, 2, 0.0705, "Aviso n.º 7758/2015"),
  H(2016, 1, 0.0705, "Aviso n.º 890/2016"),
  H(2016, 2, 0.07, "Aviso n.º 8671/2016"),
  H(2017, 1, 0.07, "Aviso n.º 2583/2017"),
  H(2017, 2, 0.07, "Aviso n.º 8544/2017"),
  H(2018, 1, 0.07, "Aviso n.º 1989/2018"),
  H(2018, 2, 0.07, "Aviso n.º 9939/2018"),
  H(2019, 1, 0.07, "Aviso n.º 2553/2019"),
  H(2019, 2, 0.07, "Aviso n.º 11571/2019"),
  H(2020, 1, 0.07, "Aviso n.º 1568/2020"),
  H(2020, 2, 0.07, "Aviso n.º 10974/2020"),
  H(2021, 1, 0.07, "Aviso n.º 2239/2021"),
  H(2021, 2, 0.07, "Aviso n.º 13486/2021"),
  H(2022, 1, 0.07, "Aviso n.º 1535/2022"),
  H(2022, 2, 0.07, "Aviso n.º 13997/2022"),
  H(2023, 1, 0.095, "Aviso n.º 1672/2023"),
  H(2023, 2, 0.11, "Aviso n.º 14922/2023"),
  H(2024, 1, 0.115, "Aviso n.º 1850/2024"),
  H(2024, 2, 0.1125, "Aviso n.º 14751/2024/2"),
  H(2025, 1, 0.1015, "Aviso n.º 1278/2025/2"),
  H(2025, 2, 0.0915, "Aviso n.º 16792/2025/2"),
  H(2026, 1, 0.0915, "Aviso n.º 822/2026/2"),
  H(2026, 2, 0.094, "Aviso n.º 16623/2026/2"),
];

const TAXA_CIVIL = 0.04;
const INICIO_TABELA = "2013-07-01";
const MS_POR_DIA = 24 * 60 * 60 * 1000;

export interface TramoJuros {
  inicio: string;
  fim: string;
  dias: number;
  taxa: number;
  juros: number;
  estimado: boolean;
  fonte: string;
}

export interface ResultadoJuros {
  dias: number;
  juros: number;
  total: number;
  tramos: TramoJuros[];
}

function iso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function utcDia(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Arredonda a 4 casas para evitar ruído de vírgula flutuante (ex.: 0.0915 + 0.01). */
function r4(x: number): number {
  return Math.round(x * 10000) / 10000;
}

/** Taxa anual (decimal) aplicável a um semestre, com a fonte e se é estimada. */
export function taxaDoSemestre(
  tipo: TipoJuros,
  ano: number,
  semestre: 1 | 2
): { taxa: number; estimado: boolean; fonte: string } {
  if (tipo === "civil") return { taxa: TAXA_CIVIL, estimado: false, fonte: "Portaria 291/2003" };
  if (tipo !== "comercial" && tipo !== "comercial-geral") {
    throw new Error(`Tipo de juros desconhecido: ${tipo}`);
  }
  const chave = ano * 10 + semestre;
  let linha = TAXAS_SEMESTRAIS.find((t) => t.ano * 10 + t.semestre === chave);
  let estimado = false;
  if (!linha) {
    const ultima = TAXAS_SEMESTRAIS[TAXAS_SEMESTRAIS.length - 1];
    if (chave < TAXAS_SEMESTRAIS[0].ano * 10 + TAXAS_SEMESTRAIS[0].semestre) {
      throw new Error(`Sem taxa comercial antes de ${INICIO_TABELA}.`);
    }
    linha = ultima;
    estimado = true;
  }
  const taxa = tipo === "comercial" ? r4(linha.geral + 0.01) : linha.geral;
  return { taxa, estimado, fonte: estimado ? `${linha.aviso} (última conhecida)` : linha.aviso };
}

export function calcularJuros(
  capital: number,
  dataInicio: Date,
  dataFim: Date,
  tipo: TipoJuros
): ResultadoJuros {
  if (tipo !== "comercial" && tipo !== "comercial-geral" && tipo !== "civil") {
    throw new Error(`Tipo de juros desconhecido: ${tipo}`);
  }
  if (!(capital >= 0)) throw new Error("O capital tem de ser um valor positivo.");
  const ini = utcDia(dataInicio);
  const fim = utcDia(dataFim);
  if (fim < ini) throw new Error("A data de fim é anterior à data de início.");
  if (tipo !== "civil" && ini < Date.parse(INICIO_TABELA)) {
    throw new Error(
      `A tabela de taxas comerciais começa em ${INICIO_TABELA} (DL 62/2013); para mora anterior, calcular à parte com os avisos da época.`
    );
  }

  const tramos: TramoJuros[] = [];
  let cursor = ini;
  while (cursor < fim) {
    const d = new Date(cursor);
    const ano = d.getUTCFullYear();
    const semestre: 1 | 2 = d.getUTCMonth() < 6 ? 1 : 2;
    const corte = semestre === 1 ? Date.UTC(ano, 6, 1) : Date.UTC(ano + 1, 0, 1);
    const ate = Math.min(corte, fim);
    const dias = Math.round((ate - cursor) / MS_POR_DIA);
    const { taxa, estimado, fonte } = taxaDoSemestre(tipo, ano, semestre);
    tramos.push({
      inicio: iso(cursor),
      fim: iso(ate),
      dias,
      taxa,
      juros: (capital * taxa * dias) / 365,
      estimado,
      fonte,
    });
    cursor = ate;
  }

  const dias = Math.round((fim - ini) / MS_POR_DIA);
  const juros = tramos.reduce((s, t) => s + t.juros, 0);
  return { dias, juros, total: capital + juros, tramos };
}

function pct(taxa: number): string {
  return (taxa * 100).toFixed(2).replace(".", ",") + "%";
}

const eur = formatarEuros;

/** Memória de cálculo pronta a anexar a uma carta ou requerimento. */
export function memoriaJuros(capital: number, r: ResultadoJuros, tipo: TipoJuros): string {
  const base =
    tipo === "comercial"
      ? "art. 102.º §5 CCom / DL 62/2013"
      : tipo === "comercial-geral"
        ? "art. 102.º §3 CCom"
        : "Portaria 291/2003";
  const linhas = [
    `Memória de cálculo — juros de mora (${tipo}; ${base})`,
    `Capital: ${eur(capital)}`,
    ...r.tramos.map(
      (t) =>
        `- ${t.inicio} a ${t.fim}: ${t.dias} dias × ${pct(t.taxa)}${t.estimado ? " (estimada)" : ""} = ${eur(t.juros)}  [${t.fonte}]`
    ),
    `Juros: ${eur(r.juros)} (${r.dias} dias)`,
    `TOTAL (capital + juros): ${eur(r.total)}`,
  ];
  if (r.tramos.some((t) => t.estimado)) {
    linhas.push("Nota: há tramos com taxa estimada (semestre ainda sem aviso) — recalcular quando sair o aviso.");
  }
  if (tipo === "comercial") {
    linhas.push(
      "Acresce a indemnização mínima de 40,00 € por custos de cobrança (art. 7.º do DL 62/2013), devida sem interpelação."
    );
  }
  return linhas.join("\n");
}
