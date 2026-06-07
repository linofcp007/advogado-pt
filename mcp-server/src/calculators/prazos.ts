/**
 * Contador de prazos legais (Portugal).
 *
 * Porta de `scripts/prazos.py`. Conta um prazo a partir de uma data de início,
 * em dias úteis ou em dias corridos, e devolve a data-limite.
 *
 * Para dias úteis, saltam-se sábados, domingos e feriados nacionais de
 * Portugal:
 *   Fixos: 1 jan, 25 abr, 1 mai, 10 jun, 15 ago, 5 out, 1 nov, 1 dez,
 *          8 dez, 25 dez.
 *   Móveis (a partir da Páscoa, algoritmo de Meeus/Gauss):
 *          Sexta-Feira Santa (Páscoa - 2 dias) e Corpo de Deus (Páscoa + 60).
 *
 * A contagem de dias úteis começa no dia útil seguinte à data de início (o dia
 * de início não conta), seguindo a regra processual comum.
 *
 * Todas as datas são manipuladas em UTC para evitar desvios de fuso.
 */

const MS_POR_DIA = 24 * 60 * 60 * 1000;

const NOTA =
  "Regra geral processual: se o prazo terminar em dia não útil, " +
  "transfere-se para o 1.º dia útil seguinte (Art. 138.º CPC). " +
  "Feriados municipais não estão incluídos.";

/** Domingo de Páscoa para um ano (algoritmo de Meeus/Gauss). Devolve [mes, dia]. */
function domingoPascoa(ano: number): { mes: number; dia: number } {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return { mes, dia };
}

/** Chave numérica YYYYMMDD em UTC, usada como identificador de um dia. */
function chaveDia(timestamp: number): number {
  const d = new Date(timestamp);
  return (
    d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()
  );
}

/** Conjunto de feriados nacionais obrigatórios para um ano (chaves YYYYMMDD). */
function feriadosNacionais(ano: number): Set<number> {
  const feriados = new Set<number>([
    ano * 10000 + 1 * 100 + 1, // Ano Novo
    ano * 10000 + 4 * 100 + 25, // Dia da Liberdade
    ano * 10000 + 5 * 100 + 1, // Dia do Trabalhador
    ano * 10000 + 6 * 100 + 10, // Dia de Portugal
    ano * 10000 + 8 * 100 + 15, // Assunção de Nossa Senhora
    ano * 10000 + 10 * 100 + 5, // Implantação da República
    ano * 10000 + 11 * 100 + 1, // Todos os Santos
    ano * 10000 + 12 * 100 + 1, // Restauração da Independência
    ano * 10000 + 12 * 100 + 8, // Imaculada Conceição
    ano * 10000 + 12 * 100 + 25, // Natal
  ]);
  const { mes, dia } = domingoPascoa(ano);
  const pascoaTs = Date.UTC(ano, mes - 1, dia);
  feriados.add(chaveDia(pascoaTs - 2 * MS_POR_DIA)); // Sexta-Feira Santa
  feriados.add(chaveDia(pascoaTs + 60 * MS_POR_DIA)); // Corpo de Deus
  return feriados;
}

/** Indica se um dia (timestamp UTC) é dia útil. */
function ehDiaUtil(timestamp: number, cache: Map<number, Set<number>>): boolean {
  const d = new Date(timestamp);
  const diaSemana = d.getUTCDay(); // 0 = domingo, 6 = sábado
  if (diaSemana === 0 || diaSemana === 6) {
    return false;
  }
  const ano = d.getUTCFullYear();
  if (!cache.has(ano)) {
    cache.set(ano, feriadosNacionais(ano));
  }
  return !cache.get(ano)!.has(chaveDia(timestamp));
}

/** Conta `nDias` dias úteis a partir do dia seguinte ao de início. */
function contarDiasUteis(inicioTs: number, nDias: number): number {
  const cache = new Map<number, Set<number>>();
  let ts = inicioTs;
  let contados = 0;
  while (contados < nDias) {
    ts += MS_POR_DIA;
    if (ehDiaUtil(ts, cache)) {
      contados += 1;
    }
  }
  return ts;
}

export function contarPrazo(
  inicio: Date,
  dias: number,
  tipo: "uteis" | "corridos"
): { dataLimite: Date; nota: string } {
  if (dias < 0) {
    throw new Error("O número de dias não pode ser negativo.");
  }
  const inicioTs = Date.UTC(
    inicio.getUTCFullYear(),
    inicio.getUTCMonth(),
    inicio.getUTCDate()
  );

  let limiteTs: number;
  if (tipo === "corridos") {
    limiteTs = inicioTs + dias * MS_POR_DIA;
  } else {
    limiteTs = contarDiasUteis(inicioTs, dias);
  }

  return { dataLimite: new Date(limiteTs), nota: NOTA };
}
