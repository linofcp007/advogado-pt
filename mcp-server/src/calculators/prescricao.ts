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

// [descricao, anos, meses, base_legal]. Usa-se anos OU meses.
const PRAZOS: Record<string, [string, number, number, string]> = {
  "civil-geral": ["Prescrição civil geral", 20, 0, "Art. 309.º CC"],
  "servicos-profissionais": [
    "Serviços profissionais",
    5,
    0,
    "Art. 310.º CC",
  ],
  "creditos-comerciais": [
    "Créditos comerciais",
    5,
    0,
    "Art. 310.º al. e) CC",
  ],
  juros: ["Juros", 5, 0, "Art. 310.º al. d) CC"],
  rendas: ["Rendas", 5, 0, "Art. 310.º al. a) CC"],
  "telecom-energia-agua": [
    "Telecomunicações / energia / água",
    0,
    6,
    "legislação setorial",
  ],
  "queixa-crime-semipublico": [
    "Queixa-crime (crime semipúblico)",
    0,
    6,
    "Art. 115.º CP",
  ],
  "garantia-bens-consumo": ["Garantia de bens de consumo", 3, 0, "DL 84/2021"],
};

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

export function calcularPrescricao(
  inicio: Date,
  tipo: string
): { descricao: string; prazoTexto: string; base: string; limite: Date } {
  if (!(tipo in PRAZOS)) {
    throw new Error(`Tipo desconhecido: ${tipo}`);
  }
  const [descricao, anos, meses, base] = PRAZOS[tipo];

  let limite: Date;
  let prazoTexto: string;
  if (anos) {
    limite = addAnos(inicio, anos);
    prazoTexto = `${anos} ano(s)`;
  } else {
    limite = addMeses(inicio, meses);
    prazoTexto = `${meses} mese(s)`;
  }
  return { descricao, prazoTexto, base, limite };
}
