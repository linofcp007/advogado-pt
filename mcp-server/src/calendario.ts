// Calendário de obrigações legais de uma empresa a partir do perfil (perfil-empresa.md).
// Tabela declarativa de regras, cada uma com base legal e fonte. Determinístico: nada é
// pedido ao modelo. Datas de 2026 conferidas com o calendário fiscal oficial da AT
// (obrigações declarativas e de pagamento) e com os despachos SEAF de prorrogação.
//
// Transferência do termo (sábado, domingo, feriado nacional -> dia útil seguinte):
//   fiscal: CPPT 20.º, n.º 1 + CC 279.º, al. e) (a AT transfere também os sábados);
//   Segurança Social: CPA 87.º, al. f).
// Sem transferência: Modelo 22 (CIRC 120.º), IES (CIRC 121.º, n.º 2), Modelo 3 (CIRS 60.º, n.º 1),
//   todos "independentemente de esse dia ser útil", e as janelas mensais (RGPC).
// Agosto: férias fiscais (LGT 57.º-A) e contributivas (CRC 23.º-B) -> 31/8; declaração ou
//   confirmação de remunerações à SS -> 25/8. IVA de junho / 2.º trimestre -> setembro (CIVA 41.º e 27.º, n.º 10).
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { eDiaUtil, proximoDiaUtil } from "./calculators/prazos.js";

export type AreaObrigacao = "Fiscal" | "Segurança Social" | "Societário" | "Laboral" | "Compliance";

export interface Obrigacao {
  id: string;
  titulo: string;
  area: AreaObrigacao;
  /** Data-limite (AAAA-MM-DD), já transferida/prorrogada. */
  data: string;
  /** Data legal antes da transferência, prorrogação ou antecipação (só quando difere). */
  dataOriginal?: string;
  nota?: string;
  base: string;
  fonte: string;
  transferivel: boolean;
  /** O perfil não chega para saber se se aplica: confirmar `camposEmFalta`. */
  aConfirmar: boolean;
  camposEmFalta: string[];
}

type Forma = "sociedade" | "eni" | "associacao" | "particular";

interface PerfilNorm {
  forma: Forma | null;
  iva: "mensal" | "trimestral" | "isento" | null;
  trabalhadores: number | null;
  contabilidade: "organizada" | "simplificado" | null;
  ue: boolean;
}

interface Aplic {
  ok: boolean | null;
  faltam: string[];
}

interface Ocorrencia {
  /** Data legal (AAAA-MM-DD). */
  data: string;
  /** Texto do período a que respeita (vai para o título). */
  periodo?: string;
  /** Data final já decidida pela regra (ex.: último dia útil de uma janela mensal). */
  final?: string;
  nota?: string;
}

interface Regra {
  id: string;
  titulo: string;
  area: AreaObrigacao;
  base: string;
  fonte: string;
  transferivel: boolean;
  /** Prazos que terminem em agosto passam para este dia de agosto. */
  agosto?: 31 | 25;
  nota?: string;
  aplica: (p: PerfilNorm) => Aplic;
  datas: (ano: number) => Ocorrencia[];
}

// --- Fontes -----------------------------------------------------------------
const AT_D = "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/calendario_fiscal/documents/obrigacoes_declarativas.pdf";
const AT_P = "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/calendario_fiscal/documents/obrigacoes_pagamento.pdf";
const DL127 = "https://files.diariodarepublica.pt/1s/2025/12/23600/0000200005.pdf";
const PGDL_CSC = "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=524&tabela=leis";
const PGDL_CT = "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1047&tabela=leis";
const PGDL_RGPC = "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=3543&tabela=leis";
const RCBE = "https://justica.gov.pt/Guias/guia-do-registo-central-do-beneficiario-efetivo-rcbe";
const RU = "https://www.dgcp.mtsss.gov.pt/relatorio-unico";

// --- Prorrogações por despacho (ano a ano) ------------------------------------
const PRORROGACOES: Record<string, { data: string; nota: string }> = {
  "efatura_comunicacao@2026-01-05": { data: "2026-01-09", nota: "Prorrogado pelo Despacho SEAF 166/2025." },
  "efatura_comunicacao@2026-04-05": { data: "2026-04-08", nota: "Prorrogado pelo Despacho SEAF 40/2026." },
  "efatura_comunicacao@2026-05-05": { data: "2026-05-08", nota: "Prorrogado pelo Despacho SEAF 55/2026." },
  "relatorio_unico@2026-04-15": {
    data: "2026-06-12",
    nota: "Em 2026 (dados de 2025) a recolha começou mais tarde e foi alargada até 12/6/2026 (DGCP).",
  },
  "modelo22@2026-05-31": {
    data: "2026-06-30",
    nota: "Prorrogado para 30/6/2026, com o pagamento, pelos Despachos SEAF 68/2026 e 81/2026.",
  },
};

// --- Datas ----------------------------------------------------------------------
const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const MS_DIA = 86400000;

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (a: number, m: number, d: number) => `${a}-${pad(m)}-${pad(d)}`;
const tsDe = (s: string) => Date.parse(`${s}T00:00:00Z`);
const isoDe = (ts: number) => new Date(ts).toISOString().slice(0, 10);
const ultimoDia = (a: number, m: number) => new Date(Date.UTC(a, m, 0)).getUTCDate();
const fimMes = (a: number, m: number) => iso(a, m, ultimoDia(a, m));

/** Mês `m` do ano `a` deslocado `n` meses -> [ano, mês]. */
function mesMais(a: number, m: number, n: number): [number, number] {
  const t = a * 12 + (m - 1) + n;
  return [Math.floor(t / 12), (t % 12) + 1];
}
const nomeMes = (a: number, m: number, ano: number) => (a === ano ? MESES[m - 1] : `${MESES[m - 1]} de ${a}`);

function ultimoDiaUtilAte(s: string): string {
  let ts = tsDe(s);
  while (!eDiaUtil(ts)) ts -= MS_DIA;
  return isoDe(ts);
}

/** Uma ocorrência por mês, no dia `dia`, com o período `desfasamento` meses antes. */
function mensal(ano: number, dia: number, desfasamento: number, rotulo: string): Ocorrencia[] {
  const out: Ocorrencia[] = [];
  for (let m = 1; m <= 12; m++) {
    const [pa, pm] = mesMais(ano, m, -desfasamento);
    out.push({ data: iso(ano, m, Math.min(dia, ultimoDia(ano, m))), periodo: `${rotulo} ${nomeMes(pa, pm, ano)}` });
  }
  return out;
}

/** IVA: período mensal, prazo no dia `dia` do 2.º mês seguinte; junho passa para setembro. */
function ivaMensal(ano: number, dia: number): Ocorrencia[] {
  const out: Ocorrencia[] = [];
  for (let m = 1; m <= 12; m++) {
    if (m === 8) continue; // junho -> setembro (CIVA 41.º, n.º 10 / 27.º, n.º 10)
    const [pa, pm] = mesMais(ano, m, -2);
    const periodo = m === 9 ? "período: junho e julho" : `período: ${nomeMes(pa, pm, ano)}`;
    out.push({ data: iso(ano, m, dia), periodo });
  }
  return out;
}

/** IVA trimestral: prazo no dia `dia` do 2.º mês após o trimestre; o 2.º trimestre passa para setembro. */
function ivaTrimestral(ano: number, dia: number): Ocorrencia[] {
  return [
    { data: iso(ano, 2, dia), periodo: `4.º trimestre de ${ano - 1}` },
    { data: iso(ano, 5, dia), periodo: "1.º trimestre" },
    { data: iso(ano, 9, dia), periodo: "2.º trimestre" },
    { data: iso(ano, 11, dia), periodo: "3.º trimestre" },
  ];
}

// --- Aplicabilidade pelo perfil -----------------------------------------------------
const SIM: Aplic = { ok: true, faltam: [] };
const NAO: Aplic = { ok: false, faltam: [] };
const talvez = (...faltam: string[]): Aplic => ({ ok: null, faltam: [...new Set(faltam)] });

function formaEm(p: PerfilNorm, formas: Forma[]): Aplic {
  if (!p.forma) return talvez("forma_juridica");
  return formas.includes(p.forma) ? SIM : NAO;
}

function contab(p: PerfilNorm): PerfilNorm["contabilidade"] {
  return p.forma === "sociedade" ? "organizada" : p.contabilidade;
}

function comTrabalhadores(p: PerfilNorm): Aplic {
  if (p.forma === "particular") return NAO;
  if (p.trabalhadores === null) return talvez("trabalhadores");
  return p.trabalhadores > 0 ? SIM : NAO;
}

function contabOrganizada(p: PerfilNorm): Aplic {
  if (p.forma === "particular") return NAO;
  const c = contab(p);
  if (c === "organizada") return SIM;
  if (c === "simplificado") return NAO;
  return p.forma ? talvez("contabilidade") : talvez("contabilidade", "forma_juridica");
}

function comAtividade(p: PerfilNorm): Aplic {
  if (!p.forma) return talvez("forma_juridica");
  return p.forma === "particular" ? NAO : SIM;
}

function ivaPeriodico(p: PerfilNorm, regime: "mensal" | "trimestral"): Aplic {
  if (p.forma === "particular") return NAO;
  if (p.iva === regime) return SIM;
  if (p.iva !== null) return NAO;
  // Sem regime de IVA: mostra só o trimestral (o mais comum nas PME) para confirmar.
  if (regime === "mensal") return NAO;
  return p.forma ? talvez("regime_iva") : talvez("regime_iva", "forma_juridica");
}

// --- Regras ------------------------------------------------------------------------
const NOTA_TRANSF = "Se o termo calhar em sábado, domingo ou feriado passa para o 1.º dia útil seguinte.";

const REGRAS: Regra[] = [
  // ---------------- Fiscal: IVA ----------------
  {
    id: "iva_dp_mensal",
    titulo: "Declaração periódica de IVA (mensal)",
    area: "Fiscal",
    base: "CIVA, art. 41.º, n.º 1, al. a), e n.º 10",
    fonte: AT_D,
    transferivel: true,
    nota: "Regime mensal: volume de negócios ≥ 650.000 € no ano anterior, ou por opção.",
    aplica: (p) => ivaPeriodico(p, "mensal"),
    datas: (a) => ivaMensal(a, 20),
  },
  {
    id: "iva_pag_mensal",
    titulo: "Pagamento do IVA (mensal)",
    area: "Fiscal",
    base: "CIVA, art. 27.º, n.º 1, e n.º 10",
    fonte: AT_P,
    transferivel: true,
    aplica: (p) => ivaPeriodico(p, "mensal"),
    datas: (a) => ivaMensal(a, 25),
  },
  {
    id: "iva_dp_trimestral",
    titulo: "Declaração periódica de IVA (trimestral)",
    area: "Fiscal",
    base: "CIVA, art. 41.º, n.º 1, al. b), e n.º 10",
    fonte: AT_D,
    transferivel: true,
    nota: "Regime trimestral: volume de negócios < 650.000 € no ano anterior.",
    aplica: (p) => ivaPeriodico(p, "trimestral"),
    datas: (a) => ivaTrimestral(a, 20),
  },
  {
    id: "iva_pag_trimestral",
    titulo: "Pagamento do IVA (trimestral)",
    area: "Fiscal",
    base: "CIVA, art. 27.º, n.º 1, e n.º 10",
    fonte: AT_P,
    transferivel: true,
    aplica: (p) => ivaPeriodico(p, "trimestral"),
    datas: (a) => ivaTrimestral(a, 25),
  },
  {
    id: "iva_recap_mensal",
    titulo: "Declaração recapitulativa (operações intra-UE)",
    area: "Fiscal",
    base: "RITI, art. 30.º, n.º 1, al. a), e n.º 2; CIVA, art. 29.º, n.º 1, al. i)",
    fonte: AT_D,
    transferivel: true,
    agosto: 31,
    nota: "Só nos meses com transmissões intracomunitárias de bens ou serviços do art. 6.º CIVA a sujeitos passivos da UE.",
    aplica: (p) => (p.ue && p.iva === "mensal" && p.forma !== "particular" ? SIM : NAO),
    datas: (a) => mensal(a, 20, 1, "operações de"),
  },
  {
    id: "iva_recap_trimestral",
    titulo: "Declaração recapitulativa (operações intra-UE)",
    area: "Fiscal",
    base: "RITI, art. 30.º, n.º 1, al. b)",
    fonte: AT_D,
    transferivel: true,
    nota: "Trimestral só se as transmissões de bens não passarem 50.000 € no trimestre (nem em nenhum dos 4 anteriores); senão é mensal.",
    aplica: (p) => (p.ue && p.iva === "trimestral" && p.forma !== "particular" ? SIM : NAO),
    datas: (a) => [
      { data: iso(a, 1, 20), periodo: `4.º trimestre de ${a - 1}` },
      { data: iso(a, 4, 20), periodo: "1.º trimestre" },
      { data: iso(a, 7, 20), periodo: "2.º trimestre" },
      { data: iso(a, 10, 20), periodo: "3.º trimestre" },
    ],
  },
  {
    id: "efatura_comunicacao",
    titulo: "Comunicação das faturas à AT (e-fatura / SAF-T)",
    area: "Fiscal",
    base: "DL 198/2012, art. 3.º, n.ºs 1 e 2",
    fonte: AT_D,
    transferivel: true,
    agosto: 31,
    nota: "Inclui a comunicação de que não houve faturas no mês.",
    aplica: comAtividade,
    datas: (a) => mensal(a, 5, 1, "faturas de"),
  },
  {
    id: "inventario_comunicacao",
    titulo: "Comunicação do inventário a 31 de dezembro",
    area: "Fiscal",
    base: "DL 198/2012, art. 3.º-A",
    fonte: AT_D,
    transferivel: true,
    nota: "Só para quem tem inventários (existências) e contabilidade organizada.",
    aplica: contabOrganizada,
    datas: (a) => [{ data: iso(a, 1, 31), periodo: `inventário de ${a - 1}` }],
  },
  // ---------------- Fiscal: retenções e rendimentos ----------------
  {
    id: "dmr_at",
    titulo: "Declaração Mensal de Remunerações (AT)",
    area: "Fiscal",
    base: "CIRS, art. 119.º, n.º 1, al. c), subal. i)",
    fonte: AT_D,
    transferivel: true,
    agosto: 31,
    nota: "Também se paga remuneração a gerentes/administradores (MOE), mesmo sem trabalhadores.",
    aplica: comTrabalhadores,
    datas: (a) => mensal(a, 10, 1, "rendimentos de"),
  },
  {
    id: "retencoes_entrega",
    titulo: "Entrega das retenções na fonte (IRS/IRC) e do Imposto do Selo",
    area: "Fiscal",
    base: "CIRS, art. 98.º, n.º 3; CIRC, art. 94.º, n.º 6",
    fonte: AT_P,
    transferivel: true,
    agosto: 31,
    nota: "Se houve retenções no mês anterior (salários, recibos verdes, rendas…).",
    aplica: (p) => {
      if (p.forma === "particular") return NAO;
      if (p.trabalhadores !== null && p.trabalhadores > 0) return SIM;
      const c = contabOrganizada(p);
      if (c.ok) return SIM;
      if (p.trabalhadores === null) return talvez("trabalhadores", ...c.faltam);
      return c;
    },
    datas: (a) => mensal(a, 20, 1, "retenções de"),
  },
  {
    id: "modelo10",
    titulo: "Modelo 10 (rendimentos e retenções fora da DMR)",
    area: "Fiscal",
    base: "CIRS, art. 119.º, n.º 1, al. c), subal. ii)",
    fonte: AT_D,
    transferivel: true,
    nota: "Se pagou rendimentos das categorias B, E, F ou H (recibos verdes, rendas…).",
    aplica: contabOrganizada,
    datas: (a) => [{ data: fimMes(a, 2), periodo: `rendimentos de ${a - 1}` }],
  },
  // ---------------- Fiscal: IRC ----------------
  {
    id: "modelo22",
    titulo: "Modelo 22 de IRC (e pagamento do imposto)",
    area: "Fiscal",
    base: "CIRC, art. 120.º, n.ºs 1 e 2, e art. 104.º, n.º 1, al. b)",
    fonte: AT_D,
    transferivel: false,
    nota: "Prazo legal: último dia de maio, independentemente de ser útil. Período diferente do ano civil: último dia do 5.º mês após o fim.",
    aplica: (p) => formaEm(p, ["sociedade", "associacao"]),
    datas: (a) => [{ data: iso(a, 5, 31), periodo: `exercício de ${a - 1}` }],
  },
  {
    id: "irc_pagamentos_conta",
    titulo: "Pagamento por conta de IRC",
    area: "Fiscal",
    base: "CIRC, arts. 104.º, n.º 1, al. a), 105.º e 104.º-A",
    fonte: AT_P,
    transferivel: true,
    nota: "Dispensado se o IRC do ano anterior for < 199,52 €. Lucro tributável > 1,5 M€: também pagamento adicional por conta (derrama estadual).",
    aplica: (p) => formaEm(p, ["sociedade"]),
    datas: (a) => [
      { data: fimMes(a, 7), periodo: "1.º pagamento" },
      { data: fimMes(a, 9), periodo: "2.º pagamento" },
      { data: iso(a, 12, 15), periodo: "3.º pagamento" },
    ],
  },
  {
    id: "ies",
    titulo: "IES / Declaração anual (inclui o registo da prestação de contas)",
    area: "Fiscal",
    base: "CIRC, art. 121.º, n.º 2; CIRS, art. 113.º; CRCom, arts. 15.º, n.º 4, e 42.º",
    fonte: AT_D,
    transferivel: false,
    nota: "15 de julho, independentemente de ser útil. Período diferente do ano civil: dia 15 do 7.º mês após o fim.",
    aplica: (p) => {
      if (!p.forma) return talvez("forma_juridica");
      if (p.forma === "sociedade" || p.forma === "associacao") return SIM;
      if (p.forma === "eni") return contabOrganizada(p);
      return NAO;
    },
    datas: (a) => [{ data: iso(a, 7, 15), periodo: `exercício de ${a - 1}` }],
  },
  // ---------------- Fiscal: IRS (ENI) ----------------
  {
    id: "irs_modelo3",
    titulo: "Modelo 3 de IRS (com anexo B ou C)",
    area: "Fiscal",
    base: "CIRS, art. 60.º, n.º 1; art. 97.º, n.º 1, al. a)",
    fonte: AT_D,
    transferivel: false,
    nota: "Entrega de 1 de abril a 30 de junho, independentemente de ser útil; pagamento até 31 de agosto.",
    aplica: (p) => formaEm(p, ["eni", "particular"]),
    datas: (a) => [{ data: iso(a, 6, 30), periodo: `rendimentos de ${a - 1}` }],
  },
  {
    id: "irs_pagamentos_conta",
    titulo: "Pagamento por conta de IRS (categoria B)",
    area: "Fiscal",
    base: "CIRS, art. 102.º, n.ºs 1 e 3",
    fonte: AT_P,
    transferivel: true,
    nota: "A AT notifica o valor; não é exigível se for inferior a 50 €.",
    aplica: (p) => formaEm(p, ["eni"]),
    datas: (a) => [
      { data: iso(a, 7, 20), periodo: "1.º pagamento" },
      { data: iso(a, 9, 20), periodo: "2.º pagamento" },
      { data: iso(a, 12, 20), periodo: "3.º pagamento" },
    ],
  },
  // ---------------- Segurança Social ----------------
  {
    id: "ss_declaracao_remuneracoes",
    titulo: "Segurança Social: declaração/confirmação de remunerações",
    area: "Segurança Social",
    base: "Código Contributivo, art. 40.º e art. 23.º-B (redação do DL 127/2025)",
    fonte: DL127,
    transferivel: true,
    agosto: 25,
    nota: "2026 é o ano de transição do DL 127/2025: modelo antigo até dia 10; quem já aderiu ao novo modelo confirma até dia 20 (o silêncio vale como aceitação). Novo modelo obrigatório desde 1/1/2027.",
    aplica: comTrabalhadores,
    datas: (a) => mensal(a, a <= 2026 ? 10 : 20, 1, "remunerações de"),
  },
  {
    id: "ss_pagamento_tco",
    titulo: "Segurança Social: pagamento das contribuições (TCO)",
    area: "Segurança Social",
    base: "Código Contributivo, art. 43.º e art. 23.º-B (redação do DL 127/2025)",
    fonte: DL127,
    transferivel: true,
    agosto: 31,
    nota: "Desde as contribuições de janeiro de 2026: do dia 1 ao dia 25 do mês seguinte (antes: 10 a 20).",
    aplica: comTrabalhadores,
    datas: (a) =>
      mensal(a, 25, 1, "contribuições de").map((o, i) =>
        a < 2026 || (a === 2026 && i === 0) ? { ...o, data: iso(a, i + 1, 20) } : o
      ),
  },
  {
    id: "ss_ti_declaracao_trimestral",
    titulo: "Segurança Social: declaração trimestral do trabalhador independente",
    area: "Segurança Social",
    base: "Código Contributivo, art. 151.º-A, n.ºs 3 e 5",
    fonte: "https://files.diariodarepublica.pt/1s/2018/01/00600/0023800242.pdf",
    transferivel: true,
    nota: "Em janeiro inclui a confirmação dos rendimentos do ano anterior. Isenção nos primeiros 12 meses de atividade.",
    aplica: (p) => formaEm(p, ["eni"]),
    datas: (a) => [
      { data: fimMes(a, 1), periodo: `4.º trimestre de ${a - 1}` },
      { data: fimMes(a, 4), periodo: "1.º trimestre" },
      { data: fimMes(a, 7), periodo: "2.º trimestre" },
      { data: fimMes(a, 10), periodo: "3.º trimestre" },
    ],
  },
  {
    id: "ss_ti_pagamento",
    titulo: "Segurança Social: pagamento do trabalhador independente",
    area: "Segurança Social",
    base: "Código Contributivo, art. 155.º, n.º 2, e art. 23.º-B",
    fonte: "https://www.gov.pt/servicos/obter-informacoes-sobre-as-contribuicoes-para-a-seguranca-social-pagamento-de-trabalhador-independente",
    transferivel: true,
    agosto: 31,
    nota: "Do dia 10 ao dia 20 do mês seguinte (o DL 127/2025 não alterou este prazo).",
    aplica: (p) => formaEm(p, ["eni"]),
    datas: (a) => mensal(a, 20, 1, "contribuições de"),
  },
  // ---------------- Societário ----------------
  {
    id: "csc_aprovacao_contas",
    titulo: "Aprovação das contas e do relatório de gestão",
    area: "Societário",
    base: "CSC, art. 65.º, n.º 5 (SA: art. 376.º, n.º 1); art. 67.º",
    fonte: PGDL_CSC,
    transferivel: false,
    nota: "3 meses após o fecho do exercício; 5 meses (31/5) se houver contas consolidadas ou método da equivalência patrimonial. Sem contas nos 2 meses seguintes, qualquer sócio pode pedir inquérito judicial (art. 67.º).",
    aplica: (p) => formaEm(p, ["sociedade"]),
    datas: (a) => [{ data: iso(a, 3, 31), periodo: `exercício de ${a - 1}` }],
  },
  {
    id: "rcbe_confirmacao_anual",
    titulo: "RCBE: confirmação anual do beneficiário efetivo",
    area: "Societário",
    base: "Regime Jurídico do RCBE (Lei 89/2017), art. 15.º, n.ºs 1 a 3",
    fonte: RCBE,
    transferivel: false,
    nota: "Pode ser feita com a IES; dispensada se houve atualização no mesmo ano. Alterações: até 30 dias após o facto (art. 14.º).",
    aplica: (p) => formaEm(p, ["sociedade", "associacao"]),
    datas: (a) => [{ data: iso(a, 12, 31) }],
  },
  // ---------------- Laboral ----------------
  {
    id: "relatorio_unico",
    titulo: "Relatório Único (inclui o anexo de SST)",
    area: "Laboral",
    base: "Portaria 55/2010, art. 4.º",
    fonte: RU,
    transferivel: true,
    nota: "Regra: entrega de 16 de março a 15 de abril, sobre o ano anterior. A DGCP (ex-GEP) pode alterar a janela — confirmar a data do ano em dgcp.mtsss.gov.pt/relatorio-unico.",
    aplica: comTrabalhadores,
    datas: (a) => [{ data: iso(a, 4, 15), periodo: `dados de ${a - 1}` }],
  },
  {
    id: "mapa_ferias",
    titulo: "Mapa de férias (elaborar e afixar)",
    area: "Laboral",
    base: "Código do Trabalho, art. 241.º, n.º 9",
    fonte: PGDL_CT,
    transferivel: false,
    nota: "Elaborado até 15 de abril e afixado até 31 de outubro.",
    aplica: comTrabalhadores,
    datas: (a) => [{ data: iso(a, 4, 15) }],
  },
  {
    id: "formacao_continua",
    titulo: "Formação contínua: 40 horas por trabalhador (balanço anual)",
    area: "Laboral",
    base: "Código do Trabalho, arts. 131.º, n.º 2, e 132.º",
    fonte: PGDL_CT,
    transferivel: false,
    nota: "Sem data legal: horas não dadas em 2 anos passam a crédito de horas, que caduca ao fim de 3 anos.",
    aplica: comTrabalhadores,
    datas: (a) => [{ data: iso(a, 12, 31) }],
  },
  // ---------------- Compliance (RGPC: 50 ou mais trabalhadores) ----------------
  {
    id: "rgpc_relatorio_anual",
    titulo: "RGPC: relatório de avaliação anual do PPR",
    area: "Compliance",
    base: "RGPC (anexo ao DL 109-E/2021), art. 6.º, n.ºs 4, al. b), e 6",
    fonte: PGDL_RGPC,
    transferivel: false,
    nota: "Elaborado no mês de abril sobre a execução do ano anterior; publicar na intranet e no site em 10 dias. Rever o PPR a cada 3 anos.",
    aplica: rgpc,
    datas: (a) => [{ data: iso(a, 4, 30), final: ultimoDiaUtilAte(iso(a, 4, 30)), periodo: `execução de ${a - 1}` }],
  },
  {
    id: "rgpc_relatorio_intercalar",
    titulo: "RGPC: relatório de avaliação intercalar do PPR",
    area: "Compliance",
    base: "RGPC (anexo ao DL 109-E/2021), art. 6.º, n.ºs 4, al. a), e 6",
    fonte: PGDL_RGPC,
    transferivel: false,
    nota: "Elaborado no mês de outubro, sobre os riscos elevados ou máximos do PPR; publicar em 10 dias.",
    aplica: rgpc,
    datas: (a) => [{ data: iso(a, 10, 31), final: ultimoDiaUtilAte(iso(a, 10, 31)) }],
  },
];

function rgpc(p: PerfilNorm): Aplic {
  if (p.forma === "eni" || p.forma === "particular") return NAO; // só pessoas coletivas (RGPC, art. 2.º)
  if (p.trabalhadores === null) return p.forma ? talvez("trabalhadores") : talvez("trabalhadores", "forma_juridica");
  if (p.trabalhadores < 50) return NAO;
  return p.forma ? SIM : talvez("forma_juridica");
}

// --- Perfil -------------------------------------------------------------------------
function normalizar(perfil: Record<string, string> | null): PerfilNorm {
  const v = (k: string) => String(perfil?.[k] ?? "").trim().toLowerCase();
  const f = v("forma_juridica");
  let forma: Forma | null = null;
  if (f) {
    if (/particular|consumidor/.test(f)) forma = "particular";
    else if (/\beni\b|nome individual|independente|recibos verdes|freelanc/.test(f)) forma = "eni";
    else if (/associa|funda[çc][ãa]o|cooperativa|ipss/.test(f)) forma = "associacao";
    else if (/\blda\b|\bs\.?a\.?(?=\s|$|,)|sociedade|unipessoal|limitada|an[óo]nima/.test(f)) forma = "sociedade";
  }
  const i = v("regime_iva");
  const iva = !i ? null : /isen|53/.test(i) ? "isento" : /mensal/.test(i) ? "mensal" : /trimestr/.test(i) ? "trimestral" : null;
  const t = v("trabalhadores");
  const n = /(\d+)/.exec(t.replace(/\./g, ""));
  const trabalhadores = n ? parseInt(n[1], 10) : /nenhum|sem trab|^n[ãa]o/.test(t) ? 0 : null;
  const c = v("contabilidade");
  const contabilidade = /organizada/.test(c) ? "organizada" : /simplificad/.test(c) ? "simplificado" : null;
  const ue = /\bue\b|europ|intracomunit|estrangeir|internacion/.test(v("clientes"));
  return { forma, iva, trabalhadores, contabilidade, ue };
}

// --- Gerar ------------------------------------------------------------------------------
function resolverData(r: Regra, o: Ocorrencia, ano: number): { data: string; nota?: string } {
  if (o.final) {
    return o.final === o.data ? { data: o.data } : { data: o.final, nota: "O mês termina em dia não útil: antecipado para o último dia útil." };
  }
  const pr = PRORROGACOES[`${r.id}@${o.data}`];
  if (pr) return { data: pr.data, nota: pr.nota };
  if (r.agosto && o.data.slice(5, 7) === "08") {
    const alvo = iso(ano, 8, r.agosto);
    const motivo =
      r.agosto === 31
        ? r.area === "Segurança Social"
          ? "Agosto: prazo até 31/8 (Código Contributivo, art. 23.º-B)."
          : "Férias fiscais: prazo de agosto até 31/8 (LGT, art. 57.º-A)."
        : "Agosto: declaração ou confirmação de remunerações até 25/8 (Código Contributivo, art. 23.º-B).";
    if (alvo <= o.data) return { data: o.data };
    const util = ultimoDiaUtilAte(alvo);
    return { data: util, nota: util === alvo ? motivo : `${motivo} ${alvo} não é dia útil: por prudência, até ${util}.` };
  }
  if (r.transferivel) {
    const d = isoDe(proximoDiaUtil(tsDe(o.data)));
    return d === o.data ? { data: d } : { data: d, nota: NOTA_TRANSF };
  }
  return { data: o.data };
}

/**
 * Obrigações legais do ano `ano` (datas-limite que caem nesse ano) para o perfil dado.
 * Sem perfil (ou com campos em falta), as obrigações que dependem deles vêm com
 * `aConfirmar: true` e `camposEmFalta`. Pura e determinística.
 */
export function gerarCalendario(ano: number, perfil: Record<string, string> | null): Obrigacao[] {
  if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) throw new Error(`Ano inválido: ${ano}`);
  const p = normalizar(perfil);
  const out: Obrigacao[] = [];
  for (const r of REGRAS) {
    const a = r.aplica(p);
    if (a.ok === false) continue;
    for (const o of r.datas(ano)) {
      const { data, nota } = resolverData(r, o, ano);
      const notas = [nota, o.nota, r.nota].filter(Boolean).join(" ");
      out.push({
        id: r.id,
        titulo: o.periodo ? `${r.titulo} — ${o.periodo}` : r.titulo,
        area: r.area,
        data,
        ...(data !== o.data ? { dataOriginal: o.data } : {}),
        ...(notas ? { nota: notas } : {}),
        base: r.base,
        fonte: r.fonte,
        transferivel: r.transferivel,
        aConfirmar: a.ok === null,
        camposEmFalta: a.faltam,
      });
    }
  }
  return out.sort((x, y) => x.data.localeCompare(y.data) || x.titulo.localeCompare(y.titulo));
}

// --- iCalendar (RFC 5545) ---------------------------------------------------------------
function escaparTexto(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Dobra uma linha em pedaços de ≤ 75 octetos (continuações começam com espaço), sem partir caracteres. */
function dobrar(linha: string): string {
  if (Buffer.byteLength(linha, "utf8") <= 75) return linha;
  const partes: string[] = [];
  let atual = "";
  let bytes = 0;
  let limite = 75;
  for (const ch of linha) {
    const b = Buffer.byteLength(ch, "utf8");
    if (bytes + b > limite) {
      partes.push(atual);
      atual = "";
      bytes = 0;
      limite = 74; // + o espaço inicial = 75
    }
    atual += ch;
    bytes += b;
  }
  partes.push(atual);
  return partes.join("\r\n ");
}

const dataICS = (s: string) => s.replace(/-/g, "");

function carimbo(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Exporta as obrigações para iCalendar (eventos de dia inteiro, alarme 3 dias antes). */
export function paraICS(obrigacoes: Obrigacao[], opts: { hoje?: Date; alarmeDias?: number } = {}): string {
  const stamp = carimbo(opts.hoje ?? new Date());
  const alarme = Math.max(0, Math.floor(opts.alarmeDias ?? 3));
  const linhas: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//advogado-pt//Calendario de obrigacoes legais//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Obrigações legais (advogado-pt)",
  ];
  for (const o of obrigacoes) {
    const fim = isoDe(tsDe(o.data) + MS_DIA);
    const resumo = o.aConfirmar ? `${o.titulo} (a confirmar)` : o.titulo;
    const desc = [
      `Base legal: ${o.base}`,
      o.dataOriginal ? `Data legal: ${o.dataOriginal}` : "",
      o.nota ?? "",
      o.aConfirmar ? `A confirmar no perfil: ${o.camposEmFalta.join(", ")}` : "",
      `Fonte: ${o.fonte}`,
      "Gerado pelo advogado-pt: confirmar no Portal das Finanças / Segurança Social Direta. Não substitui advogado nem contabilista.",
    ]
      .filter(Boolean)
      .join("\n");
    linhas.push(
      "BEGIN:VEVENT",
      `UID:${o.id}-${o.data}@advogado-pt`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dataICS(o.data)}`,
      `DTEND;VALUE=DATE:${dataICS(fim)}`,
      `SUMMARY:${escaparTexto(resumo)}`,
      `DESCRIPTION:${escaparTexto(desc)}`,
      `CATEGORIES:${escaparTexto(o.area)}`,
      "TRANSP:TRANSPARENT"
    );
    if (alarme > 0) {
      linhas.push(
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `TRIGGER:-P${alarme}D`,
        `DESCRIPTION:${escaparTexto(`Prazo a ${alarme} dias: ${o.titulo}`)}`,
        "END:VALARM"
      );
    }
    linhas.push("END:VEVENT");
  }
  linhas.push("END:VCALENDAR");
  return linhas.map(dobrar).join("\r\n") + "\r\n";
}

/** Grava `<dir>/.advogado-pt/calendario-<ano>.ics` e devolve o caminho. */
export function exportarICS(ano: number, obrigacoes: Obrigacao[], dir?: string, hoje?: Date): string {
  if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) throw new Error(`Ano inválido: ${ano}`);
  const base = resolve(dir ?? process.cwd());
  if (!existsSync(base) || !statSync(base).isDirectory()) throw new Error(`O diretório '${base}' não existe.`);
  mkdirSync(join(base, ".advogado-pt"), { recursive: true });
  const caminho = join(base, ".advogado-pt", `calendario-${ano}.ics`);
  writeFileSync(caminho, paraICS(obrigacoes, { hoje }), "utf8");
  return caminho;
}

/** Texto legível do calendário, agrupado por mês (para a tool e o CLI). */
export function formatarCalendario(obrigacoes: Obrigacao[], opts: { mes?: number } = {}): string {
  const lista = opts.mes ? obrigacoes.filter((o) => Number(o.data.slice(5, 7)) === opts.mes) : obrigacoes;
  const linhas: string[] = [];
  let mesAtual = "";
  for (const o of lista) {
    const m = o.data.slice(0, 7);
    if (m !== mesAtual) {
      mesAtual = m;
      const nm = MESES[Number(o.data.slice(5, 7)) - 1];
      linhas.push(`\n## ${nm.charAt(0).toUpperCase()}${nm.slice(1)} ${o.data.slice(0, 4)}`);
    }
    const dd = `${o.data.slice(8, 10)}/${o.data.slice(5, 7)}`;
    const orig = o.dataOriginal ? ` (data legal ${o.dataOriginal.slice(8, 10)}/${o.dataOriginal.slice(5, 7)})` : "";
    const conf = o.aConfirmar ? ` ❓ a confirmar: ${o.camposEmFalta.join(", ")}` : "";
    linhas.push(`- ${dd} · ${o.titulo}${orig} — ${o.base}${conf}`);
  }
  return linhas.join("\n").trim();
}
