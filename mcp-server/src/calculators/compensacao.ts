/**
 * Calculadora de compensação por cessação de contrato de trabalho (Portugal).
 *
 * Porta de `scripts/compensacao_despedimento.py` — os dois dão os mesmos resultados.
 *
 * Regime em vigor (art. 366.º CT, redação da Lei 13/2023):
 *   - 14 dias de retribuição base + diuturnidades (RB+D) por ano de antiguidade — despedimento
 *     coletivo, extinção do posto (art. 372.º), inadaptação (art. 379.º) e demais remissões;
 *   - 24 dias na caducidade do contrato a termo (arts. 344.º/345.º);
 *   - frações de ano proporcionais; valor diário = RB+D / 30;
 *   - tetos: RB+D considerada ≤ 20 RMMG; total ≤ 12 × RB+D (ou 240 RMMG);
 *   - SEM mínimo de 3 meses (esse mínimo só existe no regime transitório abaixo).
 *
 * `calcularCompensacaoPorDatas` aplica o regime transitório por períodos de antiguidade
 * (Lei 69/2013, art. 5.º; Lei 13/2023, art. 35.º, n.º 2): os 14 dias só valem para a
 * antiguidade desde 1/5/2023. Validado contra o simulador oficial da ACT (9 casos).
 * Convenção de frações (a da ACT): anos + (meses + dias/30)/12, com o dia final incluído.
 */

type Modalidade = "sem-termo" | "extincao-posto" | "coletivo" | "termo";

const DIAS_POR_ANO: Record<Modalidade, number> = {
  "sem-termo": 14,
  "extincao-posto": 14,
  coletivo: 14,
  termo: 24,
};

export const RMMG_2026 = 920;

export const COMPENSACAO_MODALIDADES: string[] = Object.keys(DIAS_POR_ANO);

/** Regra atual, por anos de antiguidade (desde 1/5/2023), com os tetos do art. 366.º. */
export function calcularCompensacao(
  retribuicaoBase: number,
  diuturnidades: number,
  anos: number,
  modalidade: Modalidade,
  rmmg: number = RMMG_2026
): { diasAno: number; bruto: number; minimoAplicado: boolean; tetoAplicado: boolean } {
  if (!(modalidade in DIAS_POR_ANO)) {
    throw new Error(`Modalidade desconhecida: ${modalidade}`);
  }
  if (!(retribuicaoBase >= 0) || !(diuturnidades >= 0) || !(anos >= 0)) {
    throw new Error("A retribuição, as diuturnidades e os anos têm de ser valores positivos.");
  }
  const diasAno = DIAS_POR_ANO[modalidade];
  const base = Math.min(retribuicaoBase + diuturnidades, 20 * rmmg);
  let bruto = (base / 30) * diasAno * anos;
  const teto = 12 * base;
  const tetoAplicado = bruto > teto;
  if (tetoAplicado) bruto = teto;
  return { diasAno, bruto, minimoAplicado: false, tetoAplicado };
}

// --------------------------------------------------------------------------
// Regime transitório por períodos (sem termo) e caducidade do termo
// --------------------------------------------------------------------------

export interface ParamsCompensacaoDatas {
  retribuicaoBase: number;
  diuturnidades?: number;
  dataAdmissao: Date;
  dataCessacao: Date;
  modalidade: "sem-termo" | "termo";
  rmmg?: number;
}

export interface ResultadoCompensacaoDatas {
  total: number;
  regime: "A" | "B" | "C" | "termo";
  tetoAplicado: boolean;
  minimoAplicado: boolean;
  periodos: Array<{ de: string; ate: string; dias: number; valor: number }>;
}

const DIA = 24 * 60 * 60 * 1000;
const U = (a: number, m: number, d: number) => Date.UTC(a, m - 1, d);
const iso = (ts: number) => new Date(ts).toISOString().slice(0, 10);
const utcDia = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

/** Fração de anos entre a e b (inclusive), convenção da ACT: anos + (meses + dias/30)/12. */
function fracaoAnos(a: number, b: number): number {
  if (b < a) return 0;
  const ini = new Date(a);
  const fim = new Date(b + DIA); // dia final incluído
  let y = fim.getUTCFullYear() - ini.getUTCFullYear();
  let m = fim.getUTCMonth() - ini.getUTCMonth();
  let d = fim.getUTCDate() - ini.getUTCDate();
  if (d < 0) {
    m -= 1;
    const ultimoDoMesAnterior = new Date(Date.UTC(fim.getUTCFullYear(), fim.getUTCMonth(), 0));
    d += ultimoDoMesAnterior.getUTCDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return y + (m + d / 30) / 12;
}

/** Mesmo dia, n anos depois (29/02 -> 28/02 em ano não bissexto). */
function maisAnos(ts: number, n: number): number {
  const d = new Date(ts);
  const alvo = Date.UTC(d.getUTCFullYear() + n, d.getUTCMonth(), d.getUTCDate());
  return new Date(alvo).getUTCMonth() === d.getUTCMonth() ? alvo : Date.UTC(d.getUTCFullYear() + n, d.getUTCMonth() + 1, 0);
}

export function calcularCompensacaoPorDatas(p: ParamsCompensacaoDatas): ResultadoCompensacaoDatas {
  const rmmg = p.rmmg ?? RMMG_2026;
  const R = p.retribuicaoBase + (p.diuturnidades ?? 0);
  if (!(p.retribuicaoBase >= 0) || !((p.diuturnidades ?? 0) >= 0)) {
    throw new Error("A retribuição base e as diuturnidades têm de ser valores positivos.");
  }
  const adm = utcDia(p.dataAdmissao);
  const ces = utcDia(p.dataCessacao);
  if (ces < adm) throw new Error("A data de cessação é anterior à data de admissão.");
  const Rc = Math.min(R, 20 * rmmg);
  const teto = 12 * Rc;
  const periodos: ResultadoCompensacaoDatas["periodos"] = [];

  const seg = (de: number, ate: number, dias: number, base: number): number => {
    const s = Math.max(de, adm);
    const e = Math.min(ate, ces);
    if (e < s) return 0;
    const valor = (base / 30) * dias * fracaoAnos(s, e);
    periodos.push({ de: iso(s), ate: iso(e), dias, valor });
    return valor;
  };

  if (p.modalidade === "termo") {
    // Prática da ACT: 24 dias por toda a duração (caducidade a partir de 1/5/2023); sem mínimo.
    let total = seg(adm, ces, 24, Rc);
    const tetoAplicado = total > teto;
    if (tetoAplicado) total = teto;
    return { total, regime: "termo", tetoAplicado, minimoAplicado: false, periodos };
  }

  let a = 0;
  let b = 0;
  let regime: ResultadoCompensacaoDatas["regime"];
  if (adm < U(2011, 11, 1)) {
    regime = "A";
    // a) até 31/10/2012: 1 mês de R (sem teto) por ano
    const ate = Math.min(ces, U(2012, 10, 31));
    if (ate >= adm) {
      a = R * fracaoAnos(adm, ate);
      periodos.push({ de: iso(adm), ate: iso(ate), dias: 30, valor: a });
    }
    b = seg(U(2012, 11, 1), U(2013, 9, 30), 20, Rc);
  } else if (adm <= U(2013, 9, 30)) {
    regime = "B";
    b = seg(adm, U(2013, 9, 30), 20, Rc);
  } else {
    regime = "C";
  }

  let c = 0;
  if (regime === "A" || regime === "B") {
    const fimTresAnos = maisAnos(adm, 3) - DIA;
    let inicio12 = U(2013, 10, 1);
    if (fimTresAnos >= U(2013, 10, 1)) {
      c += seg(U(2013, 10, 1), fimTresAnos, 18, Rc);
      inicio12 = fimTresAnos + DIA;
    }
    c += seg(inicio12, U(2023, 4, 30), 12, Rc);
  } else {
    c += seg(adm, U(2023, 4, 30), 12, Rc);
  }
  c += seg(U(2023, 5, 1), ces, 14, Rc);

  let total: number;
  let tetoAplicado = false;
  if (a >= teto) {
    total = a; // a) acima do teto não é cortado (Lei 69/2013, art. 5.º, n.º 5, al. a))
  } else if (a + b >= teto) {
    total = teto;
    tetoAplicado = true;
  } else {
    total = a + b + c;
    if (total > teto) {
      total = teto;
      tetoAplicado = true;
    }
  }
  let minimoAplicado = false;
  if (regime === "A" && total < 3 * R) {
    total = 3 * R; // mínimo de 3 meses só no regime A (art. 5.º, n.º 2)
    minimoAplicado = true;
  }
  return { total, regime, tetoAplicado, minimoAplicado, periodos };
}
