/**
 * Contador de prazos legais (Portugal).
 *
 * Porta de `scripts/prazos.py`. Conta um prazo a partir de uma data de início —
 * judicial (CPC, art. 138.º, com férias judiciais), em dias corridos ou em dias úteis —
 * e devolve a data-limite e o termo legal.
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
export function feriadosNacionais(ano: number): Set<number> {
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

const CACHE_FERIADOS = new Map<number, Set<number>>();

/** Dia útil (sem sábado, domingo nem feriado nacional) — timestamp UTC. Exportado para o calendário. */
export function eDiaUtil(timestamp: number): boolean {
  return ehDiaUtil(timestamp, CACHE_FERIADOS);
}

/** Primeiro dia útil igual ou posterior ao timestamp UTC dado. */
export function proximoDiaUtil(timestamp: number): number {
  let ts = timestamp;
  while (!ehDiaUtil(ts, CACHE_FERIADOS)) ts += MS_POR_DIA;
  return ts;
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

export type TipoPrazo = "judicial" | "corridos" | "uteis";

/** Limite de segurança: prazos acima de ~10 anos não são prazos de dias. */
const MAX_DIAS = 3650;

/** Domingo de Páscoa (timestamp UTC). */
function pascoaTs(ano: number): number {
  const { mes, dia } = domingoPascoa(ano);
  return Date.UTC(ano, mes - 1, dia);
}

/**
 * Férias judiciais (LOSJ — Lei 62/2013, art. 28.º): 22/12 a 3/1, Domingo de Ramos a
 * Segunda-feira de Páscoa, e 16/7 a 31/8.
 */
export function emFeriasJudiciais(timestamp: number): boolean {
  const d = new Date(timestamp);
  const m = d.getUTCMonth() + 1;
  const dia = d.getUTCDate();
  if ((m === 12 && dia >= 22) || (m === 1 && dia <= 3)) return true;
  if ((m === 7 && dia >= 16) || m === 8) return true;
  const p = pascoaTs(d.getUTCFullYear());
  return timestamp >= p - 7 * MS_POR_DIA && timestamp <= p + MS_POR_DIA;
}

const DIAS_SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

function isoDia(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export interface ResultadoPrazo {
  /** Último dia para praticar o ato (com a transferência do termo, quando há). */
  dataLimite: Date;
  /** Termo legal antes da transferência (igual a `dataLimite` quando não há transferência). */
  dataLegal: Date;
  /** Verdadeiro quando o termo legal caiu em dia não útil (ou em férias) e passou para a frente. */
  transferido: boolean;
  /** Dias de férias judiciais saltados na contagem (só no tipo judicial não urgente). */
  diasSuspensos: number;
  nota: string;
}

/**
 * Conta um prazo a partir de `inicio` (o dia de início não conta — CC, art. 279.º, al. b)).
 *
 * - `judicial` (CPC, art. 138.º): contínuo, suspende-se nas férias judiciais (salvo processo
 *   urgente ou prazo de 6 meses ou mais); termo em dia não útil -> 1.º dia útil seguinte
 *   (fora das férias, se o processo não for urgente).
 * - `corridos`: dias seguidos; termo em sábado, domingo ou feriado -> 1.º dia útil seguinte,
 *   com a data legal à parte (CC, art. 279.º, al. e); CPA, art. 87.º).
 * - `uteis`: só contam os dias úteis (ex.: CPA, art. 87.º).
 */
export function contarPrazo(
  inicio: Date,
  dias: number,
  tipo: TipoPrazo = "corridos",
  opts: { urgente?: boolean } = {}
): ResultadoPrazo {
  if (!(inicio instanceof Date) || Number.isNaN(inicio.getTime())) {
    throw new Error("Data de início inválida. Usa AAAA-MM-DD.");
  }
  if (!Number.isInteger(dias) || dias < 0 || dias > MAX_DIAS) {
    throw new Error(`O número de dias tem de ser um inteiro entre 0 e ${MAX_DIAS}.`);
  }
  if (tipo !== "judicial" && tipo !== "corridos" && tipo !== "uteis") {
    throw new Error(`Tipo de prazo desconhecido: '${String(tipo)}'. Usa judicial, corridos ou uteis.`);
  }
  const urgente = Boolean(opts.urgente);
  const inicioTs = Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth(), inicio.getUTCDate());

  let legalTs: number;
  let diasSuspensos = 0;
  // Prazos de 6 meses ou mais não se suspendem nas férias (CPC, art. 138.º, n.º 1).
  const suspende = tipo === "judicial" && !urgente && dias < 180;
  if (tipo === "uteis") {
    legalTs = contarDiasUteis(inicioTs, dias);
  } else if (tipo === "corridos" || !suspende) {
    legalTs = inicioTs + dias * MS_POR_DIA;
  } else {
    legalTs = inicioTs;
    let contados = 0;
    while (contados < dias) {
      legalTs += MS_POR_DIA;
      if (emFeriasJudiciais(legalTs)) diasSuspensos += 1;
      else contados += 1;
    }
  }

  let limiteTs = legalTs;
  while (!ehDiaUtil(limiteTs, CACHE_FERIADOS) || (suspende && emFeriasJudiciais(limiteTs))) {
    limiteTs += MS_POR_DIA;
  }
  const transferido = limiteTs !== legalTs;
  const diaLegal = `${isoDia(legalTs)} (${DIAS_SEMANA[new Date(legalTs).getUTCDay()]})`;

  let nota: string;
  if (tipo === "judicial") {
    nota =
      (urgente
        ? "Processo urgente: o prazo corre também nas férias judiciais (CPC, art. 138.º, n.º 1). "
        : "Prazo judicial (CPC, art. 138.º): contínuo, suspende-se nas férias judiciais " +
          "(LOSJ, art. 28.º: 22/12 a 3/1, Domingo de Ramos a Segunda-feira de Páscoa, 16/7 a 31/8)" +
          (dias >= 180 ? ", exceto nos prazos de 6 meses ou mais, como este" : "") +
          (diasSuspensos > 0 ? ` — ${diasSuspensos} dias de férias não contaram` : "") +
          ". ") +
      (transferido
        ? `O termo legal, ${diaLegal}, passa para o 1.º dia útil seguinte (art. 138.º, n.º 2). `
        : "") +
      "O ato pode ainda ser praticado nos 3 dias úteis seguintes, com multa (CPC, art. 139.º, n.º 5). " +
      "Feriados municipais não estão incluídos.";
  } else if (tipo === "corridos") {
    nota =
      "Prazo em dias seguidos (CC, art. 279.º): o dia de início não conta. " +
      (transferido
        ? `O termo legal é ${diaLegal}; se o ato tiver de ser praticado num tribunal ou serviço encerrado nesse dia, ` +
          "passa para o 1.º dia útil seguinte (CC, art. 279.º, al. e); CPA, art. 87.º). "
        : "") +
      "Para prazos de processos em tribunal (contestação, oposição, recurso) usa o tipo 'judicial'. " +
      "Feriados municipais não estão incluídos.";
  } else {
    nota =
      "Contagem em dias úteis (ex.: procedimento administrativo — CPA, art. 87.º): saltam-se sábados, " +
      "domingos e feriados nacionais. Para prazos de processos em tribunal usa o tipo 'judicial'. " +
      "Feriados municipais não estão incluídos.";
  }

  return { dataLimite: new Date(limiteTs), dataLegal: new Date(legalTs), transferido, diasSuspensos, nota };
}
