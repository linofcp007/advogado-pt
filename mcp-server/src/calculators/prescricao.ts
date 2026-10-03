/**
 * Calculadora de prazos de prescrição / caducidade (Portugal).
 *
 * Porta de `scripts/prescricao.py`. Calcula a data-limite a partir de uma data
 * de início e de um tipo de prazo, contando em anos ou meses CIVIS (não em
 * dias úteis). A contagem usa o calendário: somar N anos/meses leva ao mesmo
 * dia do mês de destino; se esse dia não existir (ex.: 29 de fevereiro -> ano
 * não bissexto, ou dia 31 num mês de 30 dias), usa-se o ÚLTIMO dia do mês de
 * destino.
 *
 * Todas as datas são manipuladas em UTC para evitar desvios de fuso.
 */

// [descricao, anos, meses, base_legal, presuntiva]. Usa-se anos OU meses.
// Ids estáveis (as tools e o CLI usam-nos); prazos e bases revistos na v1.2.1.
const PRAZOS: Record<string, [string, number, number, string, boolean]> = {
  "civil-geral": ["Prescrição ordinária (regra geral)", 20, 0, "CC, art. 309.º", false],
  "creditos-comerciais": [
    "Créditos comerciais entre empresas (ex.: faturas B2B) — prazo ordinário",
    20,
    0,
    "CC, art. 309.º",
    false,
  ],
  "servicos-profissionais": [
    "Serviços prestados no exercício de profissões liberais (prescrição presuntiva)",
    2,
    0,
    "CC, art. 317.º, al. c)",
    true,
  ],
  "vendas-a-consumidor": [
    "Vendas e fornecimentos de comerciantes/industriais a quem não é comerciante nem os destina ao seu comércio (prescrição presuntiva)",
    2,
    0,
    "CC, art. 317.º, al. b)",
    true,
  ],
  rendas: ["Rendas e alugueres devidos pelo locatário", 5, 0, "CC, art. 310.º, al. b)", false],
  juros: ["Juros convencionais ou legais", 5, 0, "CC, art. 310.º, al. d)", false],
  "prestacoes-periodicas": [
    "Prestações periodicamente renováveis (ex.: quotas de condomínio)",
    5,
    0,
    "CC, art. 310.º, al. g)",
    false,
  ],
  "telecom-energia-agua": [
    "Preço de serviços públicos essenciais (telecomunicações, energia, água)",
    0,
    6,
    "Lei 23/96, art. 10.º, n.º 1",
    false,
  ],
  "queixa-crime-semipublico": [
    "Direito de queixa por crime semipúblico (caducidade)",
    0,
    6,
    "CP, art. 115.º, n.º 1",
    false,
  ],
  "garantia-bens-consumo": ["Garantia legal de bens de consumo (bens móveis)", 3, 0, "DL 84/2021", false],
};

const AVISO_PRESUNTIVA =
  "Prescrição presuntiva (CC, arts. 312.º a 317.º): ao fim do prazo presume-se que a dívida foi paga; " +
  "o credor só afasta essa presunção com a confissão do devedor, expressa ou tácita (arts. 313.º e 314.º). " +
  "Se o devedor admitir que não pagou, a presunção cai.";

// Chaves válidas de prescrição (ordenadas, como `sorted(PRAZOS.keys())`).
export const PRESCRICAO_TIPOS: string[] = Object.keys(PRAZOS).sort();

/** Último dia do mês (1-12) de um dado ano, em calendário gregoriano. */
function ultimoDiaDoMes(ano: number, mes: number): number {
  // Date.UTC com dia 0 do mês seguinte = último dia deste mês.
  return new Date(Date.UTC(ano, mes, 0)).getUTCDate();
}

/**
 * Soma `meses` meses civis a uma data (UTC), ajustando o dia se necessário.
 *
 * Se o dia de origem não existir no mês de destino, usa o último dia do mês.
 */
export function addMeses(data: Date, meses: number): Date {
  const anoOrig = data.getUTCFullYear();
  const mesOrig = data.getUTCMonth() + 1; // 1-12
  const diaOrig = data.getUTCDate();

  const total = mesOrig - 1 + meses;
  const ano = anoOrig + Math.floor(total / 12);
  const mes = (((total % 12) + 12) % 12) + 1; // 1-12, robusto a negativos
  const ultimoDia = ultimoDiaDoMes(ano, mes);
  const dia = Math.min(diaOrig, ultimoDia);
  return new Date(Date.UTC(ano, mes - 1, dia));
}

/** Soma `anos` anos civis a uma data (delega em addMeses). */
export function addAnos(data: Date, anos: number): Date {
  return addMeses(data, anos * 12);
}

export interface ResultadoPrescricao {
  descricao: string;
  prazoTexto: string;
  base: string;
  limite: Date;
  /** Prescrição presuntiva (arts. 312.º a 317.º CC): presunção de pagamento. */
  presuntiva: boolean;
  /** Aviso a mostrar ao utilizador (vazio quando não há). */
  aviso: string;
}

export function calcularPrescricao(inicio: Date, tipo: string): ResultadoPrescricao {
  if (!(inicio instanceof Date) || Number.isNaN(inicio.getTime())) {
    throw new Error("Data de início inválida. Usa AAAA-MM-DD.");
  }
  if (!Object.prototype.hasOwnProperty.call(PRAZOS, tipo)) {
    throw new Error(`Tipo desconhecido: ${tipo}. Tipos: ${PRESCRICAO_TIPOS.join(", ")}.`);
  }
  const [descricao, anos, meses, base, presuntiva] = PRAZOS[tipo];

  let limite: Date;
  let prazoTexto: string;
  if (anos) {
    limite = addAnos(inicio, anos);
    prazoTexto = `${anos} ano(s)`;
  } else {
    limite = addMeses(inicio, meses);
    prazoTexto = `${meses} mese(s)`;
  }
  return { descricao, prazoTexto, base, limite, presuntiva, aviso: presuntiva ? AVISO_PRESUNTIVA : "" };
}
