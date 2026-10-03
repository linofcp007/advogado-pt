// Juros de mora de VÁRIAS faturas de uma vez (cobrança a um ou mais clientes).
// Cada fatura usa o motor por tramos semestrais (calcularJuros) desde o vencimento até à data final;
// juros arredondados ao cêntimo por fatura; nas transações comerciais acresce a indemnização de
// 40 € por fatura vencida (DL 62/2013, art. 7.º — valor em valores-2026). Porta Python:
// skills/juridico-pt/scripts/juros_mora.py (calcular_juros_lote) — mesmos casos em paridade.json.
import { calcularJuros, type TipoJuros, type TramoJuros } from "./juros.js";
import { r2 } from "./arredondar.js";
import { parseDataEstrita } from "./datas.js";
import { formatarEuros } from "./format.js";

/** Indemnização por custos de cobrança, por fatura comercial vencida (DL 62/2013, art. 7.º). */
export const INDEMNIZACAO_COBRANCA = 40;

export interface FaturaLote {
  cliente: string;
  fatura: string;
  capital: number;
  /** Data de vencimento (Date ou "AAAA-MM-DD"); a mora corre a partir daí. */
  vencimento: Date | string;
  tipo?: TipoJuros;
}

export interface ResultadoFaturaLote {
  cliente: string;
  fatura: string;
  capital: number;
  vencimento: string;
  tipo: TipoJuros;
  vencida: boolean;
  dias: number;
  juros: number;
  indemnizacao40: number;
  total: number;
  tramos: TramoJuros[];
  nota?: string;
}

export interface TotaisLote {
  capital: number;
  juros: number;
  indemnizacao: number;
  total: number;
}

export interface ResultadoLote {
  dataFim: string;
  faturas: ResultadoFaturaLote[];
  porCliente: (TotaisLote & { cliente: string; faturas: number })[];
  total: TotaisLote;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

function somar(a: TotaisLote, f: ResultadoFaturaLote): void {
  a.capital = r2(a.capital + f.capital);
  a.juros = r2(a.juros + f.juros);
  a.indemnizacao = r2(a.indemnizacao + f.indemnizacao40);
  a.total = r2(a.capital + a.juros + a.indemnizacao);
}

export function calcularJurosLote(faturas: FaturaLote[], dataFim: Date): ResultadoLote {
  if (!Array.isArray(faturas) || faturas.length === 0) throw new Error("Indica pelo menos uma fatura.");
  if (faturas.length > 500) throw new Error("No máximo 500 faturas por cálculo.");
  const fim = iso(dataFim);
  const resultados = faturas.map((f, i): ResultadoFaturaLote => {
    const fatura = String(f.fatura ?? "").trim() || `fatura ${i + 1}`;
    const cliente = String(f.cliente ?? "").trim() || "(sem cliente)";
    const tipo: TipoJuros = f.tipo ?? "comercial";
    if (!(Number.isFinite(f.capital) && f.capital >= 0)) throw new Error(`${fatura}: o capital tem de ser um valor positivo.`);
    const vencimento = f.vencimento instanceof Date ? f.vencimento : parseDataEstrita(String(f.vencimento ?? ""), `${fatura}: vencimento`);
    if (Number.isNaN(vencimento.getTime())) throw new Error(`${fatura}: data de vencimento inválida.`);
    const venc = iso(vencimento);
    const base = { cliente, fatura, capital: r2(f.capital), vencimento: venc, tipo };
    if (venc >= fim) {
      return {
        ...base, vencida: false, dias: 0, juros: 0, indemnizacao40: 0, total: base.capital, tramos: [],
        nota: `Ainda não vencida a ${fim} (vence a ${venc}).`,
      };
    }
    const r = calcularJuros(f.capital, vencimento, dataFim, tipo);
    const juros = r2(r.juros);
    const indemnizacao40 = tipo === "comercial" ? INDEMNIZACAO_COBRANCA : 0;
    return {
      ...base, vencida: true, dias: r.dias, juros, indemnizacao40,
      total: r2(base.capital + juros + indemnizacao40), tramos: r.tramos,
      ...(r.tramos.some((t) => t.estimado) ? { nota: "Inclui semestres com taxa estimada (aviso ainda não publicado)." } : {}),
    };
  });

  const porCliente: ResultadoLote["porCliente"] = [];
  const total: TotaisLote = { capital: 0, juros: 0, indemnizacao: 0, total: 0 };
  for (const f of resultados) {
    let c = porCliente.find((x) => x.cliente === f.cliente);
    if (!c) {
      c = { cliente: f.cliente, faturas: 0, capital: 0, juros: 0, indemnizacao: 0, total: 0 };
      porCliente.push(c);
    }
    c.faturas += 1;
    somar(c, f);
    somar(total, f);
  }
  return { dataFim: fim, faturas: resultados, porCliente, total };
}

/** Resumo pronto a anexar à carta (carta-cobranca-varias-faturas): por fatura, por cliente e total. */
export function memoriaJurosLote(r: ResultadoLote): string {
  const linhas = [`Juros de mora em lote até ${r.dataFim} (tramos semestrais por fatura)`, ""];
  for (const c of r.porCliente) {
    linhas.push(`${c.cliente} — ${c.faturas} fatura(s)`);
    for (const f of r.faturas.filter((x) => x.cliente === c.cliente)) {
      const extra = f.vencida
        ? `${f.dias} dias, juros ${formatarEuros(f.juros)}` + (f.indemnizacao40 ? ` + indemnização ${formatarEuros(f.indemnizacao40)}` : "")
        : "não vencida";
      linhas.push(`- ${f.fatura} (${f.tipo}, vence ${f.vencimento}): capital ${formatarEuros(f.capital)}; ${extra} -> ${formatarEuros(f.total)}${f.nota && f.vencida ? ` (${f.nota})` : ""}`);
    }
    linhas.push(`  Subtotal: capital ${formatarEuros(c.capital)} + juros ${formatarEuros(c.juros)} + indemnizações ${formatarEuros(c.indemnizacao)} = ${formatarEuros(c.total)}`, "");
  }
  const t = r.total;
  linhas.push(`TOTAL: capital ${formatarEuros(t.capital)} + juros ${formatarEuros(t.juros)} + indemnizações ${formatarEuros(t.indemnizacao)} = ${formatarEuros(t.total)}`);
  linhas.push("", `Indemnização de ${formatarEuros(INDEMNIZACAO_COBRANCA)} por fatura comercial vencida (DL 62/2013, art. 7.º), devida sem interpelação; nas faturas civis só há juros.`);
  return linhas.join("\n");
}
