import { createRequire as __createRequire } from 'node:module';
const require = __createRequire(import.meta.url);

// src/calculators/arredondar.ts
function r2(x) {
  if (!Number.isFinite(x)) return x;
  const negativo = x < 0;
  const texto = String(Math.abs(x));
  if (/e/i.test(texto)) {
    return Math.abs(x) < 1 ? 0 : x;
  }
  const [inteiro, fracao = ""] = texto.split(".");
  if (fracao.length <= 2) return x;
  let centimos = BigInt(inteiro + fracao.slice(0, 2));
  if (fracao.charCodeAt(2) - 48 >= 5) centimos += 1n;
  const v = Number(centimos) / 100;
  return negativo && v !== 0 ? -v : v;
}

// src/calculators/format.ts
function formatarEuros(valor) {
  const fixo = r2(valor).toFixed(2);
  const negativo = fixo.startsWith("-");
  const semSinal = negativo ? fixo.slice(1) : fixo;
  const [parteInteira, parteDecimal] = semSinal.split(".");
  const inteiroComMilhares = parteInteira.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  );
  const corpo2 = `${inteiroComMilhares},${parteDecimal}`;
  return `${negativo ? "-" : ""}${corpo2} \u20AC`;
}

// src/calculators/juros.ts
var H = (ano, semestre, geral, aviso) => ({
  ano,
  semestre,
  geral,
  aviso
});
var TAXAS_SEMESTRAIS = [
  H(2013, 2, 0.075, "Aviso n.\xBA 10478/2013"),
  H(2014, 1, 0.0725, "Aviso n.\xBA 1019/2014"),
  H(2014, 2, 0.0715, "Aviso n.\xBA 8266/2014"),
  H(2015, 1, 0.0705, "Aviso n.\xBA 563/2015"),
  H(2015, 2, 0.0705, "Aviso n.\xBA 7758/2015"),
  H(2016, 1, 0.0705, "Aviso n.\xBA 890/2016"),
  H(2016, 2, 0.07, "Aviso n.\xBA 8671/2016"),
  H(2017, 1, 0.07, "Aviso n.\xBA 2583/2017"),
  H(2017, 2, 0.07, "Aviso n.\xBA 8544/2017"),
  H(2018, 1, 0.07, "Aviso n.\xBA 1989/2018"),
  H(2018, 2, 0.07, "Aviso n.\xBA 9939/2018"),
  H(2019, 1, 0.07, "Aviso n.\xBA 2553/2019"),
  H(2019, 2, 0.07, "Aviso n.\xBA 11571/2019"),
  H(2020, 1, 0.07, "Aviso n.\xBA 1568/2020"),
  H(2020, 2, 0.07, "Aviso n.\xBA 10974/2020"),
  H(2021, 1, 0.07, "Aviso n.\xBA 2239/2021"),
  H(2021, 2, 0.07, "Aviso n.\xBA 13486/2021"),
  H(2022, 1, 0.07, "Aviso n.\xBA 1535/2022"),
  H(2022, 2, 0.07, "Aviso n.\xBA 13997/2022"),
  H(2023, 1, 0.095, "Aviso n.\xBA 1672/2023"),
  H(2023, 2, 0.11, "Aviso n.\xBA 14922/2023"),
  H(2024, 1, 0.115, "Aviso n.\xBA 1850/2024"),
  H(2024, 2, 0.1125, "Aviso n.\xBA 14751/2024/2"),
  H(2025, 1, 0.1015, "Aviso n.\xBA 1278/2025/2"),
  H(2025, 2, 0.0915, "Aviso n.\xBA 16792/2025/2"),
  H(2026, 1, 0.0915, "Aviso n.\xBA 822/2026/2"),
  H(2026, 2, 0.094, "Aviso n.\xBA 16623/2026/2")
];
var TAXA_CIVIL = 0.04;
var INICIO_TABELA = "2013-07-01";
var MS_POR_DIA = 24 * 60 * 60 * 1e3;
function iso(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}
function utcDia(d) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
function r4(x) {
  return Math.round(x * 1e4) / 1e4;
}
function taxaDoSemestre(tipo, ano, semestre) {
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
  return { taxa, estimado, fonte: estimado ? `${linha.aviso} (\xFAltima conhecida)` : linha.aviso };
}
function calcularJuros(capital, dataInicio, dataFim, tipo) {
  if (tipo !== "comercial" && tipo !== "comercial-geral" && tipo !== "civil") {
    throw new Error(`Tipo de juros desconhecido: ${tipo}`);
  }
  if (!(capital >= 0)) throw new Error("O capital tem de ser um valor positivo.");
  const ini = utcDia(dataInicio);
  const fim = utcDia(dataFim);
  if (fim < ini) throw new Error("A data de fim \xE9 anterior \xE0 data de in\xEDcio.");
  if (tipo !== "civil" && ini < Date.parse(INICIO_TABELA)) {
    throw new Error(
      `A tabela de taxas comerciais come\xE7a em ${INICIO_TABELA} (DL 62/2013); para mora anterior, calcular \xE0 parte com os avisos da \xE9poca.`
    );
  }
  const tramos = [];
  let cursor = ini;
  while (cursor < fim) {
    const d = new Date(cursor);
    const ano = d.getUTCFullYear();
    const semestre = d.getUTCMonth() < 6 ? 1 : 2;
    const corte = semestre === 1 ? Date.UTC(ano, 6, 1) : Date.UTC(ano + 1, 0, 1);
    const ate = Math.min(corte, fim);
    const dias2 = Math.round((ate - cursor) / MS_POR_DIA);
    const { taxa, estimado, fonte } = taxaDoSemestre(tipo, ano, semestre);
    tramos.push({
      inicio: iso(cursor),
      fim: iso(ate),
      dias: dias2,
      taxa,
      juros: capital * taxa * dias2 / 365,
      estimado,
      fonte
    });
    cursor = ate;
  }
  const dias = Math.round((fim - ini) / MS_POR_DIA);
  const juros = tramos.reduce((s, t) => s + t.juros, 0);
  return { dias, juros, total: capital + juros, tramos };
}
function pct(taxa) {
  return (taxa * 100).toFixed(2).replace(".", ",") + "%";
}
var eur = formatarEuros;
function memoriaJuros(capital, r, tipo) {
  const base = tipo === "comercial" ? "art. 102.\xBA \xA75 CCom / DL 62/2013" : tipo === "comercial-geral" ? "art. 102.\xBA \xA73 CCom" : "Portaria 291/2003";
  const linhas = [
    `Mem\xF3ria de c\xE1lculo \u2014 juros de mora (${tipo}; ${base})`,
    `Capital: ${eur(capital)}`,
    ...r.tramos.map(
      (t) => `- ${t.inicio} a ${t.fim}: ${t.dias} dias \xD7 ${pct(t.taxa)}${t.estimado ? " (estimada)" : ""} = ${eur(t.juros)}  [${t.fonte}]`
    ),
    `Juros: ${eur(r.juros)} (${r.dias} dias)`,
    `TOTAL (capital + juros): ${eur(r.total)}`
  ];
  if (r.tramos.some((t) => t.estimado)) {
    linhas.push("Nota: h\xE1 tramos com taxa estimada (semestre ainda sem aviso) \u2014 recalcular quando sair o aviso.");
  }
  if (tipo === "comercial") {
    linhas.push(
      "Acresce a indemniza\xE7\xE3o m\xEDnima de 40,00 \u20AC por custos de cobran\xE7a (art. 7.\xBA do DL 62/2013), devida sem interpela\xE7\xE3o."
    );
  }
  return linhas.join("\n");
}

// src/calculators/datas.ts
function parseDataEstrita(texto, campo) {
  const s = typeof texto === "string" ? texto.trim() : "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) {
    const [a, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const d = new Date(Date.UTC(a, mes - 1, dia));
    if (d.getUTCFullYear() === a && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia) return d;
  }
  throw new Error(`Data inv\xE1lida em '${campo}': '${String(texto).slice(0, 40)}'. Usa AAAA-MM-DD com uma data que exista.`);
}
function hojeLisboa(agora = /* @__PURE__ */ new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(agora);
  } catch {
    return agora.toISOString().slice(0, 10);
  }
}

// src/calculators/juros-lote.ts
var INDEMNIZACAO_COBRANCA = 40;
var iso2 = (d) => d.toISOString().slice(0, 10);
function somar(a, f) {
  a.capital = r2(a.capital + f.capital);
  a.juros = r2(a.juros + f.juros);
  a.indemnizacao = r2(a.indemnizacao + f.indemnizacao40);
  a.total = r2(a.capital + a.juros + a.indemnizacao);
}
function calcularJurosLote(faturas, dataFim) {
  if (!Array.isArray(faturas) || faturas.length === 0) throw new Error("Indica pelo menos uma fatura.");
  if (faturas.length > 500) throw new Error("No m\xE1ximo 500 faturas por c\xE1lculo.");
  const fim = iso2(dataFim);
  const resultados = faturas.map((f, i) => {
    const fatura = String(f.fatura ?? "").trim() || `fatura ${i + 1}`;
    const cliente = String(f.cliente ?? "").trim() || "(sem cliente)";
    const tipo = f.tipo ?? "comercial";
    if (!(Number.isFinite(f.capital) && f.capital >= 0)) throw new Error(`${fatura}: o capital tem de ser um valor positivo.`);
    const vencimento = f.vencimento instanceof Date ? f.vencimento : parseDataEstrita(String(f.vencimento ?? ""), `${fatura}: vencimento`);
    if (Number.isNaN(vencimento.getTime())) throw new Error(`${fatura}: data de vencimento inv\xE1lida.`);
    const venc = iso2(vencimento);
    const base = { cliente, fatura, capital: r2(f.capital), vencimento: venc, tipo };
    if (venc >= fim) {
      return {
        ...base,
        vencida: false,
        dias: 0,
        juros: 0,
        indemnizacao40: 0,
        total: base.capital,
        tramos: [],
        nota: `Ainda n\xE3o vencida a ${fim} (vence a ${venc}).`
      };
    }
    let r;
    try {
      r = calcularJuros(f.capital, vencimento, dataFim, tipo);
    } catch (e) {
      throw new Error(`${fatura}: ${e.message}`);
    }
    const juros = r2(r.juros);
    const indemnizacao40 = tipo === "comercial" ? INDEMNIZACAO_COBRANCA : 0;
    return {
      ...base,
      vencida: true,
      dias: r.dias,
      juros,
      indemnizacao40,
      total: r2(base.capital + juros + indemnizacao40),
      tramos: r.tramos,
      ...r.tramos.some((t) => t.estimado) ? { nota: "Inclui semestres com taxa estimada (aviso ainda n\xE3o publicado)." } : {}
    };
  });
  const porCliente = [];
  const total = { capital: 0, juros: 0, indemnizacao: 0, total: 0 };
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
function memoriaJurosLote(r) {
  const linhas = [`Juros de mora em lote at\xE9 ${r.dataFim} (tramos semestrais por fatura)`, ""];
  for (const c of r.porCliente) {
    linhas.push(`${c.cliente} \u2014 ${c.faturas} fatura(s)`);
    for (const f of r.faturas.filter((x) => x.cliente === c.cliente)) {
      const extra = f.vencida ? `${f.dias} dias, juros ${formatarEuros(f.juros)}` + (f.indemnizacao40 ? ` + indemniza\xE7\xE3o ${formatarEuros(f.indemnizacao40)}` : "") : "n\xE3o vencida";
      linhas.push(`- ${f.fatura} (${f.tipo}, vence ${f.vencimento}): capital ${formatarEuros(f.capital)}; ${extra} -> ${formatarEuros(f.total)}${f.nota && f.vencida ? ` (${f.nota})` : ""}`);
    }
    linhas.push(`  Subtotal: capital ${formatarEuros(c.capital)} + juros ${formatarEuros(c.juros)} + indemniza\xE7\xF5es ${formatarEuros(c.indemnizacao)} = ${formatarEuros(c.total)}`, "");
  }
  const t = r.total;
  linhas.push(`TOTAL: capital ${formatarEuros(t.capital)} + juros ${formatarEuros(t.juros)} + indemniza\xE7\xF5es ${formatarEuros(t.indemnizacao)} = ${formatarEuros(t.total)}`);
  linhas.push("", `Indemniza\xE7\xE3o de ${formatarEuros(INDEMNIZACAO_COBRANCA)} por fatura comercial vencida (DL 62/2013, art. 7.\xBA), devida sem interpela\xE7\xE3o; nas faturas civis s\xF3 h\xE1 juros.`);
  return linhas.join("\n");
}

// src/calculators/prazos.ts
var MS_POR_DIA2 = 24 * 60 * 60 * 1e3;
function domingoPascoa(ano) {
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
  const dia = (h + l - 7 * m + 114) % 31 + 1;
  return { mes, dia };
}
function chaveDia(timestamp) {
  const d = new Date(timestamp);
  return d.getUTCFullYear() * 1e4 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}
function feriadosNacionais(ano) {
  const feriados = /* @__PURE__ */ new Set([
    ano * 1e4 + 1 * 100 + 1,
    // Ano Novo
    ano * 1e4 + 4 * 100 + 25,
    // Dia da Liberdade
    ano * 1e4 + 5 * 100 + 1,
    // Dia do Trabalhador
    ano * 1e4 + 6 * 100 + 10,
    // Dia de Portugal
    ano * 1e4 + 8 * 100 + 15,
    // Assunção de Nossa Senhora
    ano * 1e4 + 10 * 100 + 5,
    // Implantação da República
    ano * 1e4 + 11 * 100 + 1,
    // Todos os Santos
    ano * 1e4 + 12 * 100 + 1,
    // Restauração da Independência
    ano * 1e4 + 12 * 100 + 8,
    // Imaculada Conceição
    ano * 1e4 + 12 * 100 + 25
    // Natal
  ]);
  const { mes, dia } = domingoPascoa(ano);
  const pascoaTs2 = Date.UTC(ano, mes - 1, dia);
  feriados.add(chaveDia(pascoaTs2 - 2 * MS_POR_DIA2));
  feriados.add(chaveDia(pascoaTs2 + 60 * MS_POR_DIA2));
  return feriados;
}
function ehDiaUtil(timestamp, cache) {
  const d = new Date(timestamp);
  const diaSemana = d.getUTCDay();
  if (diaSemana === 0 || diaSemana === 6) {
    return false;
  }
  const ano = d.getUTCFullYear();
  if (!cache.has(ano)) {
    cache.set(ano, feriadosNacionais(ano));
  }
  return !cache.get(ano).has(chaveDia(timestamp));
}
var CACHE_FERIADOS = /* @__PURE__ */ new Map();
function eDiaUtil(timestamp) {
  return ehDiaUtil(timestamp, CACHE_FERIADOS);
}
function proximoDiaUtil(timestamp) {
  let ts = timestamp;
  while (!ehDiaUtil(ts, CACHE_FERIADOS)) ts += MS_POR_DIA2;
  return ts;
}
function contarDiasUteis(inicioTs, nDias) {
  const cache = /* @__PURE__ */ new Map();
  let ts = inicioTs;
  let contados = 0;
  while (contados < nDias) {
    ts += MS_POR_DIA2;
    if (ehDiaUtil(ts, cache)) {
      contados += 1;
    }
  }
  return ts;
}
var MAX_DIAS = 3650;
function pascoaTs(ano) {
  const { mes, dia } = domingoPascoa(ano);
  return Date.UTC(ano, mes - 1, dia);
}
function emFeriasJudiciais(timestamp) {
  const d = new Date(timestamp);
  const m = d.getUTCMonth() + 1;
  const dia = d.getUTCDate();
  if (m === 12 && dia >= 22 || m === 1 && dia <= 3) return true;
  if (m === 7 && dia >= 16 || m === 8) return true;
  const p = pascoaTs(d.getUTCFullYear());
  return timestamp >= p - 7 * MS_POR_DIA2 && timestamp <= p + MS_POR_DIA2;
}
var DIAS_SEMANA = ["domingo", "segunda-feira", "ter\xE7a-feira", "quarta-feira", "quinta-feira", "sexta-feira", "s\xE1bado"];
function isoDia(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}
function contarPrazo(inicio, dias, tipo = "corridos", opts = {}) {
  if (!(inicio instanceof Date) || Number.isNaN(inicio.getTime())) {
    throw new Error("Data de in\xEDcio inv\xE1lida. Usa AAAA-MM-DD.");
  }
  if (!Number.isInteger(dias) || dias < 0 || dias > MAX_DIAS) {
    throw new Error(`O n\xFAmero de dias tem de ser um inteiro entre 0 e ${MAX_DIAS}.`);
  }
  if (tipo !== "judicial" && tipo !== "corridos" && tipo !== "uteis") {
    throw new Error(`Tipo de prazo desconhecido: '${String(tipo)}'. Usa judicial, corridos ou uteis.`);
  }
  const urgente = Boolean(opts.urgente);
  const inicioTs = Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth(), inicio.getUTCDate());
  let legalTs;
  let diasSuspensos = 0;
  const suspende = tipo === "judicial" && !urgente && dias < 180;
  if (tipo === "uteis") {
    legalTs = contarDiasUteis(inicioTs, dias);
  } else if (tipo === "corridos" || !suspende) {
    legalTs = inicioTs + dias * MS_POR_DIA2;
  } else {
    legalTs = inicioTs;
    let contados = 0;
    while (contados < dias) {
      legalTs += MS_POR_DIA2;
      if (emFeriasJudiciais(legalTs)) diasSuspensos += 1;
      else contados += 1;
    }
  }
  let limiteTs = legalTs;
  while (!ehDiaUtil(limiteTs, CACHE_FERIADOS) || suspende && emFeriasJudiciais(limiteTs)) {
    limiteTs += MS_POR_DIA2;
  }
  const transferido = limiteTs !== legalTs;
  const diaLegal = `${isoDia(legalTs)} (${DIAS_SEMANA[new Date(legalTs).getUTCDay()]})`;
  let nota;
  if (tipo === "judicial") {
    nota = (urgente ? "Processo urgente: o prazo corre tamb\xE9m nas f\xE9rias judiciais (CPC, art. 138.\xBA, n.\xBA 1). " : "Prazo judicial (CPC, art. 138.\xBA): cont\xEDnuo, suspende-se nas f\xE9rias judiciais (LOSJ, art. 28.\xBA: 22/12 a 3/1, Domingo de Ramos a Segunda-feira de P\xE1scoa, 16/7 a 31/8)" + (dias >= 180 ? ", exceto nos prazos de 6 meses ou mais, como este" : "") + (diasSuspensos > 0 ? ` \u2014 ${diasSuspensos} dias de f\xE9rias n\xE3o contaram` : "") + ". ") + (transferido ? `O termo legal, ${diaLegal}, passa para o 1.\xBA dia \xFAtil seguinte (art. 138.\xBA, n.\xBA 2). ` : "") + "O ato pode ainda ser praticado nos 3 dias \xFAteis seguintes, com multa (CPC, art. 139.\xBA, n.\xBA 5). Feriados municipais n\xE3o est\xE3o inclu\xEDdos.";
  } else if (tipo === "corridos") {
    nota = "Prazo em dias seguidos (CC, art. 279.\xBA): o dia de in\xEDcio n\xE3o conta. " + (transferido ? `O termo legal \xE9 ${diaLegal}; se o ato tiver de ser praticado num tribunal ou servi\xE7o encerrado nesse dia, passa para o 1.\xBA dia \xFAtil seguinte (CC, art. 279.\xBA, al. e); CPA, art. 87.\xBA). ` : "") + "Para prazos de processos em tribunal (contesta\xE7\xE3o, oposi\xE7\xE3o, recurso) usa o tipo 'judicial'. Feriados municipais n\xE3o est\xE3o inclu\xEDdos.";
  } else {
    nota = "Contagem em dias \xFAteis (ex.: procedimento administrativo \u2014 CPA, art. 87.\xBA): saltam-se s\xE1bados, domingos e feriados nacionais. Para prazos de processos em tribunal usa o tipo 'judicial'. Feriados municipais n\xE3o est\xE3o inclu\xEDdos.";
  }
  return { dataLimite: new Date(limiteTs), dataLegal: new Date(legalTs), transferido, diasSuspensos, nota };
}

// src/calculators/compensacao.ts
var DIAS_POR_ANO = {
  "sem-termo": 14,
  "extincao-posto": 14,
  coletivo: 14,
  termo: 24
};
var RMMG_2026 = 920;
var COMPENSACAO_MODALIDADES = Object.keys(DIAS_POR_ANO);
function calcularCompensacao(retribuicaoBase, diuturnidades, anos, modalidade, rmmg = RMMG_2026) {
  if (!(modalidade in DIAS_POR_ANO)) {
    throw new Error(`Modalidade desconhecida: ${modalidade}`);
  }
  if (!(retribuicaoBase >= 0) || !(diuturnidades >= 0) || !(anos >= 0)) {
    throw new Error("A retribui\xE7\xE3o, as diuturnidades e os anos t\xEAm de ser valores positivos.");
  }
  const diasAno = DIAS_POR_ANO[modalidade];
  const base = Math.min(retribuicaoBase + diuturnidades, 20 * rmmg);
  let bruto = base / 30 * diasAno * anos;
  const teto = 12 * base;
  const tetoAplicado = bruto > teto;
  if (tetoAplicado) bruto = teto;
  return { diasAno, bruto, minimoAplicado: false, tetoAplicado };
}
var DIA = 24 * 60 * 60 * 1e3;
var U = (a, m, d) => Date.UTC(a, m - 1, d);
var iso3 = (ts) => new Date(ts).toISOString().slice(0, 10);
var utcDia2 = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
function fracaoAnos(a, b) {
  if (b < a) return 0;
  const ini = new Date(a);
  const fim = new Date(b + DIA);
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
function maisAnos(ts, n) {
  const d = new Date(ts);
  const alvo = Date.UTC(d.getUTCFullYear() + n, d.getUTCMonth(), d.getUTCDate());
  return new Date(alvo).getUTCMonth() === d.getUTCMonth() ? alvo : Date.UTC(d.getUTCFullYear() + n, d.getUTCMonth() + 1, 0);
}
function calcularCompensacaoPorDatas(p) {
  const rmmg = p.rmmg ?? RMMG_2026;
  const R = p.retribuicaoBase + (p.diuturnidades ?? 0);
  if (!(p.retribuicaoBase >= 0) || !((p.diuturnidades ?? 0) >= 0)) {
    throw new Error("A retribui\xE7\xE3o base e as diuturnidades t\xEAm de ser valores positivos.");
  }
  const adm = utcDia2(p.dataAdmissao);
  const ces = utcDia2(p.dataCessacao);
  if (ces < adm) throw new Error("A data de cessa\xE7\xE3o \xE9 anterior \xE0 data de admiss\xE3o.");
  const Rc = Math.min(R, 20 * rmmg);
  const teto = 12 * Rc;
  const periodos = [];
  const seg = (de, ate, dias, base) => {
    const s = Math.max(de, adm);
    const e = Math.min(ate, ces);
    if (e < s) return 0;
    const valor = base / 30 * dias * fracaoAnos(s, e);
    periodos.push({ de: iso3(s), ate: iso3(e), dias, valor });
    return valor;
  };
  if (p.modalidade === "termo") {
    let total2 = seg(adm, ces, 24, Rc);
    const tetoAplicado2 = total2 > teto;
    if (tetoAplicado2) total2 = teto;
    return { total: total2, regime: "termo", tetoAplicado: tetoAplicado2, minimoAplicado: false, periodos };
  }
  let a = 0;
  let b = 0;
  let regime;
  if (adm < U(2011, 11, 1)) {
    regime = "A";
    const ate = Math.min(ces, U(2012, 10, 31));
    if (ate >= adm) {
      a = R * fracaoAnos(adm, ate);
      periodos.push({ de: iso3(adm), ate: iso3(ate), dias: 30, valor: a });
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
  let total;
  let tetoAplicado = false;
  if (a >= teto) {
    total = a;
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
    total = 3 * R;
    minimoAplicado = true;
  }
  return { total, regime, tetoAplicado, minimoAplicado, periodos };
}

// src/calculators/injuncao.ts
var UC_2026 = 102;
function custasInjuncao(valor) {
  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error("O valor da d\xEDvida tem de ser um n\xFAmero positivo.");
  }
  if (valor <= 5e3) {
    return { escalao: "D\xEDvida at\xE9 5.000\u20AC", taxa: 0.5 * UC_2026 };
  }
  if (valor <= 15e3) {
    return {
      escalao: "D\xEDvida de 5.000,01\u20AC a 15.000\u20AC",
      taxa: 1 * UC_2026
    };
  }
  return {
    escalao: "D\xEDvida superior a 15.000\u20AC (s\xF3 em transa\xE7\xF5es comerciais \u2014 DL 62/2013, art. 10.\xBA)",
    taxa: 1.5 * UC_2026
  };
}

// src/calculators/selo.ts
var TAXA_TRANSMISSAO = 0.1;
var TAXA_IMOVEL = 8e-3;
var HERDEIROS_ISENTOS = /* @__PURE__ */ new Set([
  "conjuge",
  "descendente",
  "ascendente"
]);
function impostoSeloHeranca(valor, herdeiro, incluiImovel, vptImovel, doacao = false) {
  if (!Number.isFinite(valor) || valor < 0 || !Number.isFinite(vptImovel) || vptImovel < 0) {
    throw new Error("O valor dos bens e o VPT n\xE3o podem ser negativos.");
  }
  const isento = HERDEIROS_ISENTOS.has(herdeiro);
  const isTransmissao = isento ? 0 : valor * TAXA_TRANSMISSAO;
  const isImovel = doacao && incluiImovel ? vptImovel * TAXA_IMOVEL : 0;
  const total = isTransmissao + isImovel;
  return { isTransmissao, isImovel, total, isento };
}

// src/calculators/imt.ts
var ESCALOES = {
  hpp: [
    [0, 106346, 0],
    [106346, 145470, 0.02],
    [145470, 198347, 0.05],
    [198347, 330539, 0.07],
    [330539, 660982, 0.08]
  ],
  secundaria: [
    [0, 106346, 0.01],
    [106346, 145470, 0.02],
    [145470, 198347, 0.05],
    [198347, 330539, 0.07],
    [330539, 633931, 0.08]
  ]
};
var TAXA_UNICA_6 = 0.06;
var TAXA_UNICA_75 = 0.075;
var LIMITE_UNICA_6 = 1150853;
var TAXA_SELO = 8e-3;
var IMT_JOVEM_ISENCAO_TOTAL = 330539;
var IMT_JOVEM_LIMITE = 660982;
var IMT_JOVEM_TAXA = 0.08;
function parcelasAAbater(escaloes) {
  const parcelas = [0];
  for (let i = 1; i < escaloes.length; i++) {
    const li = escaloes[i][0];
    const taxaAnterior = escaloes[i - 1][2];
    const imtAnterior = li * taxaAnterior - parcelas[i - 1];
    const taxaI = escaloes[i][2];
    parcelas.push(li * taxaI - imtAnterior);
  }
  return parcelas;
}
function calcularIMT(valor, tipo, jovem) {
  if (!(tipo in ESCALOES)) {
    throw new Error(`Tipo desconhecido: ${tipo}`);
  }
  if (valor < 0) {
    throw new Error("O valor n\xE3o pode ser negativo.");
  }
  let selo = valor * TAXA_SELO;
  const seloJovem = jovem && tipo === "hpp" && valor <= IMT_JOVEM_LIMITE;
  if (seloJovem) selo = Math.max(0, valor - IMT_JOVEM_ISENCAO_TOTAL) * TAXA_SELO;
  const comTotais = (r) => ({ ...r, selo, total: r.imt + selo });
  if (jovem && tipo === "hpp") {
    if (valor <= IMT_JOVEM_ISENCAO_TOTAL) {
      return comTotais({
        imt: 0,
        taxa: 0,
        parcela: 0,
        isento: true,
        regime: "IMT Jovem \u2014 isen\xE7\xE3o total de IMT e de Imposto do Selo (valor <= 330.539 \u20AC)"
      });
    }
    if (valor <= IMT_JOVEM_LIMITE) {
      const imt = (valor - IMT_JOVEM_ISENCAO_TOTAL) * IMT_JOVEM_TAXA;
      return comTotais({
        imt,
        taxa: IMT_JOVEM_TAXA,
        parcela: 0,
        isento: false,
        regime: "IMT Jovem \u2014 isen\xE7\xE3o parcial: IMT = (valor - 330.539) * 8%; Selo = (valor - 330.539) * 0,8%"
      });
    }
  }
  const escaloes = ESCALOES[tipo];
  const limiteTopoMarginal = escaloes[escaloes.length - 1][1];
  if (valor > limiteTopoMarginal) {
    if (valor <= LIMITE_UNICA_6) {
      const imt2 = valor * TAXA_UNICA_6;
      return comTotais({
        imt: imt2,
        taxa: TAXA_UNICA_6,
        parcela: 0,
        isento: false,
        regime: "Taxa \xFAnica de 6% sobre o valor total"
      });
    }
    const imt = valor * TAXA_UNICA_75;
    return comTotais({
      imt,
      taxa: TAXA_UNICA_75,
      parcela: 0,
      isento: false,
      regime: "Taxa \xFAnica de 7,5% sobre o valor total"
    });
  }
  const parcelas = parcelasAAbater(escaloes);
  for (let i = 0; i < escaloes.length; i++) {
    const [lo, hi, taxa] = escaloes[i];
    if (lo < valor && valor <= hi || i === 0 && valor <= hi) {
      const parcela = parcelas[i];
      const imt = valor * taxa - parcela;
      const regime = `Escal\xE3o marginal de ${(taxa * 100).toFixed(0).replace(".", ",")}%`;
      return comTotais({
        imt,
        taxa,
        parcela,
        isento: imt === 0,
        regime
      });
    }
  }
  throw new Error("Valor fora dos intervalos previstos.");
}

// src/calculators/prescricao.ts
var PRAZOS = {
  "civil-geral": ["Prescri\xE7\xE3o ordin\xE1ria (regra geral)", 20, 0, "CC, art. 309.\xBA", false],
  "creditos-comerciais": [
    "Cr\xE9ditos comerciais entre empresas (ex.: faturas B2B) \u2014 prazo ordin\xE1rio",
    20,
    0,
    "CC, art. 309.\xBA",
    false
  ],
  "servicos-profissionais": [
    "Servi\xE7os prestados no exerc\xEDcio de profiss\xF5es liberais (prescri\xE7\xE3o presuntiva)",
    2,
    0,
    "CC, art. 317.\xBA, al. c)",
    true
  ],
  "vendas-a-consumidor": [
    "Vendas e fornecimentos de comerciantes/industriais a quem n\xE3o \xE9 comerciante nem os destina ao seu com\xE9rcio (prescri\xE7\xE3o presuntiva)",
    2,
    0,
    "CC, art. 317.\xBA, al. b)",
    true
  ],
  rendas: ["Rendas e alugueres devidos pelo locat\xE1rio", 5, 0, "CC, art. 310.\xBA, al. b)", false],
  juros: ["Juros convencionais ou legais", 5, 0, "CC, art. 310.\xBA, al. d)", false],
  "prestacoes-periodicas": [
    "Presta\xE7\xF5es periodicamente renov\xE1veis (ex.: quotas de condom\xEDnio)",
    5,
    0,
    "CC, art. 310.\xBA, al. g)",
    false
  ],
  "telecom-energia-agua": [
    "Pre\xE7o de servi\xE7os p\xFAblicos essenciais (telecomunica\xE7\xF5es, energia, \xE1gua)",
    0,
    6,
    "Lei 23/96, art. 10.\xBA, n.\xBA 1",
    false
  ],
  "queixa-crime-semipublico": [
    "Direito de queixa por crime semip\xFAblico (caducidade)",
    0,
    6,
    "CP, art. 115.\xBA, n.\xBA 1",
    false
  ],
  "garantia-bens-consumo": ["Garantia legal de bens de consumo (bens m\xF3veis)", 3, 0, "DL 84/2021", false]
};
var AVISO_PRESUNTIVA = "Prescri\xE7\xE3o presuntiva (CC, arts. 312.\xBA a 317.\xBA): ao fim do prazo presume-se que a d\xEDvida foi paga; o credor s\xF3 afasta essa presun\xE7\xE3o com a confiss\xE3o do devedor, expressa ou t\xE1cita (arts. 313.\xBA e 314.\xBA). Se o devedor admitir que n\xE3o pagou, a presun\xE7\xE3o cai.";
var PRESCRICAO_TIPOS = Object.keys(PRAZOS).sort();
function ultimoDiaDoMes(ano, mes) {
  return new Date(Date.UTC(ano, mes, 0)).getUTCDate();
}
function addMeses(data, meses) {
  const anoOrig = data.getUTCFullYear();
  const mesOrig = data.getUTCMonth() + 1;
  const diaOrig = data.getUTCDate();
  const total = mesOrig - 1 + meses;
  const ano = anoOrig + Math.floor(total / 12);
  const mes = (total % 12 + 12) % 12 + 1;
  const ultimoDia2 = ultimoDiaDoMes(ano, mes);
  const dia = Math.min(diaOrig, ultimoDia2);
  return new Date(Date.UTC(ano, mes - 1, dia));
}
function addAnos(data, anos) {
  return addMeses(data, anos * 12);
}
function calcularPrescricao(inicio, tipo) {
  if (!(inicio instanceof Date) || Number.isNaN(inicio.getTime())) {
    throw new Error("Data de in\xEDcio inv\xE1lida. Usa AAAA-MM-DD.");
  }
  if (!Object.prototype.hasOwnProperty.call(PRAZOS, tipo)) {
    throw new Error(`Tipo desconhecido: ${tipo}. Tipos: ${PRESCRICAO_TIPOS.join(", ")}.`);
  }
  const [descricao, anos, meses, base, presuntiva] = PRAZOS[tipo];
  let limite;
  let prazoTexto;
  if (anos) {
    limite = addAnos(inicio, anos);
    prazoTexto = `${anos} ano(s)`;
  } else {
    limite = addMeses(inicio, meses);
    prazoTexto = `${meses} mese(s)`;
  }
  return { descricao, prazoTexto, base, limite, presuntiva, aviso: presuntiva ? AVISO_PRESUNTIVA : "" };
}

// src/calculators/irs.ts
var COEFICIENTES = {
  mercadorias: 0.15,
  "servicos-151": 0.75,
  "servicos-outros": 0.35,
  "propriedade-intelectual": 0.95
};
function calcularIRSSimplificado(rendimento, tipo) {
  if (!(tipo in COEFICIENTES)) {
    throw new Error(`Tipo desconhecido: ${tipo}`);
  }
  if (rendimento < 0) {
    throw new Error("O rendimento n\xE3o pode ser negativo.");
  }
  const coeficiente = COEFICIENTES[tipo];
  return { coeficiente, tributavel: rendimento * coeficiente };
}

// src/calculators/creditos.ts
var MS_POR_DIA3 = 24 * 60 * 60 * 1e3;
function utcDia3(d) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
function bissexto(ano) {
  return ano % 4 === 0 && ano % 100 !== 0 || ano % 400 === 0;
}
function calcularCreditosCessacao(p) {
  const diut = p.diuturnidades ?? 0;
  const feriasDias = p.feriasVencidasNaoGozadas ?? 0;
  if (!(p.retribuicaoBase >= 0)) throw new Error("A retribui\xE7\xE3o base tem de ser um valor positivo.");
  if (!(diut >= 0)) throw new Error("As diuturnidades n\xE3o podem ser negativas.");
  if (!(feriasDias >= 0)) throw new Error("Os dias de f\xE9rias vencidas n\xE3o podem ser negativos.");
  const adm = utcDia3(p.dataAdmissao);
  const ces = utcDia3(p.dataCessacao);
  if (ces < adm) throw new Error("A data de cessa\xE7\xE3o \xE9 anterior \xE0 data de admiss\xE3o.");
  const anoCes = new Date(ces).getUTCFullYear();
  const anoAdm = new Date(adm).getUTCFullYear();
  const inicioAno = Math.max(Date.UTC(anoCes, 0, 1), adm);
  const diasServicoAno = Math.round((ces - inicioAno) / MS_POR_DIA3) + 1;
  const diasAno = bissexto(anoCes) ? 366 : 365;
  const fracao = diasServicoAno / diasAno;
  const base = p.retribuicaoBase + diut;
  const proporcional = base * fracao;
  const feriasVencidas = base / 22 * feriasDias;
  const subsidioFeriasVencido = p.subsidioFeriasVencidoEmFalta ? base : 0;
  const dAdm = new Date(adm);
  const doze = Date.UTC(dAdm.getUTCFullYear() + 1, dAdm.getUTCMonth(), dAdm.getUTCDate());
  const limite245n3 = anoCes === anoAdm + 1 || anoCes === anoAdm || ces < doze;
  return {
    diasServicoAno,
    diasAno,
    fracao,
    proporcionalFerias: proporcional,
    proporcionalSubsidioFerias: proporcional,
    proporcionalSubsidioNatal: proporcional,
    feriasVencidas,
    subsidioFeriasVencido,
    total: 3 * proporcional + feriasVencidas + subsidioFeriasVencido,
    limite245n3
  };
}

// src/calculators/legitima.ts
function calcularLegitima(p) {
  const doacoes = p.doacoes ?? 0;
  const dividas = p.dividas ?? 0;
  const asc = p.ascendentes ?? "nenhum";
  if (!(p.bens >= 0)) throw new Error("O valor dos bens tem de ser positivo.");
  if (!(doacoes >= 0)) throw new Error("O valor das doa\xE7\xF5es n\xE3o pode ser negativo.");
  if (!(dividas >= 0)) throw new Error("O valor das d\xEDvidas n\xE3o pode ser negativo.");
  if (!Number.isInteger(p.filhos) || p.filhos < 0) {
    throw new Error("O n\xFAmero de filhos tem de ser um inteiro >= 0.");
  }
  if (!["nenhum", "pais", "outros"].includes(asc)) {
    throw new Error(`Ascendentes inv\xE1lidos: ${asc} (usa nenhum, pais ou outros).`);
  }
  const avisos = [];
  let valorHeranca = p.bens + doacoes - dividas;
  if (valorHeranca < 0) {
    avisos.push("As d\xEDvidas excedem bens + doa\xE7\xF5es: valor da heran\xE7a considerado 0.");
    valorHeranca = 0;
  }
  let fracaoLegitima = 0;
  let fundamento = "Sem herdeiros legitim\xE1rios: toda a heran\xE7a \xE9 quota dispon\xEDvel.";
  const partes = [];
  if (p.filhos > 0 && p.conjuge) {
    fracaoLegitima = 2 / 3;
    fundamento = "C\xF4njuge e filhos: leg\xEDtima de 2/3 (art. 2159.\xBA, n.\xBA 1, CC); divis\xE3o por cabe\xE7a com m\xEDnimo de 1/4 para o c\xF4njuge (art. 2139.\xBA, n.\xBA 1).";
    const cab = 1 / (p.filhos + 1);
    const fConj = Math.max(cab, 1 / 4);
    const fFilho = (1 - fConj) / p.filhos;
    partes.push({ herdeiro: "c\xF4njuge", fracaoDaLegitima: fConj });
    for (let i = 1; i <= p.filhos; i++) partes.push({ herdeiro: `filho ${i}`, fracaoDaLegitima: fFilho });
  } else if (p.filhos > 0) {
    fracaoLegitima = p.filhos === 1 ? 1 / 2 : 2 / 3;
    fundamento = `S\xF3 filhos (${p.filhos}): leg\xEDtima de ${p.filhos === 1 ? "1/2" : "2/3"} (art. 2159.\xBA, n.\xBA 2, CC); divis\xE3o em partes iguais.`;
    for (let i = 1; i <= p.filhos; i++) partes.push({ herdeiro: `filho ${i}`, fracaoDaLegitima: 1 / p.filhos });
  } else if (p.conjuge && asc !== "nenhum") {
    fracaoLegitima = 2 / 3;
    fundamento = "C\xF4njuge e ascendentes: leg\xEDtima de 2/3 (art. 2161.\xBA, n.\xBA 1, CC); 2/3 para o c\xF4njuge e 1/3 para os ascendentes (art. 2142.\xBA, n.\xBA 1).";
    partes.push({ herdeiro: "c\xF4njuge", fracaoDaLegitima: 2 / 3 });
    partes.push({ herdeiro: "ascendentes", fracaoDaLegitima: 1 / 3 });
  } else if (p.conjuge) {
    fracaoLegitima = 1 / 2;
    fundamento = "S\xF3 c\xF4njuge: leg\xEDtima de 1/2 (art. 2158.\xBA CC).";
    partes.push({ herdeiro: "c\xF4njuge", fracaoDaLegitima: 1 });
  } else if (asc !== "nenhum") {
    fracaoLegitima = asc === "pais" ? 1 / 2 : 1 / 3;
    fundamento = `S\xF3 ascendentes (${asc === "pais" ? "pais" : "2.\xBA grau e seguintes"}): leg\xEDtima de ${asc === "pais" ? "1/2" : "1/3"} (art. 2161.\xBA, n.\xBA 2, CC).`;
    partes.push({ herdeiro: "ascendentes", fracaoDaLegitima: 1 });
  }
  const legitima = valorHeranca * fracaoLegitima;
  const quotaDisponivel = valorHeranca - legitima;
  if (p.filhos > 0) {
    avisos.push(
      "Se algum filho j\xE1 faleceu, os seus descendentes herdam por representa\xE7\xE3o a parte dele (contar como 1 estirpe)."
    );
  }
  avisos.push(
    "Estimativa: n\xE3o trata rep\xFAdio, indignidade, cola\xE7\xE3o nem a imputa\xE7\xE3o das doa\xE7\xF5es na leg\xEDtima \u2014 confirmar com advogado/not\xE1rio."
  );
  return {
    valorHeranca,
    fracaoLegitima,
    legitima,
    quotaDisponivel,
    quotaDisponivelPct: (1 - fracaoLegitima) * 100,
    partes: partes.map((x) => ({ ...x, valor: legitima * x.fracaoDaLegitima })),
    fundamento,
    avisos
  };
}

// src/calculators/salario.ts
var TSU_TRABALHADOR = 0.11;
var TSU_EMPREGADOR = 0.2375;
var REFEICAO_LIMITE_NUMERARIO = 6.15;
var REFEICAO_LIMITE_CARTAO = 10.46;
var ESC_I_II = [
  { ate: 920, taxa: 0, parcela: 0 },
  { ate: 1042, taxa: 12.5, parcela: { taxa: 12.5, k: 2.6, l: 1273.85 } },
  { ate: 1108, taxa: 15.7, parcela: { taxa: 15.7, k: 1.35, l: 1554.83 } },
  { ate: 1154, taxa: 15.7, parcela: 94.71 },
  { ate: 1212, taxa: 21.2, parcela: 158.18 },
  { ate: 1819, taxa: 24.1, parcela: 193.33 },
  { ate: 2119, taxa: 31.1, parcela: 320.66 },
  { ate: 2499, taxa: 34.9, parcela: 401.19 },
  { ate: 3305, taxa: 38.36, parcela: 487.66 },
  { ate: 5547, taxa: 39.69, parcela: 531.62 },
  { ate: 20221, taxa: 44.95, parcela: 823.4 },
  { ate: Infinity, taxa: 47.17, parcela: 1272.31 }
];
var TABELAS = {
  I: { escaloes: ESC_I_II, adicional: 21.43 },
  // não casado sem dependentes / casado dois titulares
  II: { escaloes: ESC_I_II, adicional: 34.29 },
  // não casado com dependentes
  III: {
    // casado, único titular
    adicional: 42.86,
    escaloes: [
      { ate: 991, taxa: 0, parcela: 0 },
      { ate: 1042, taxa: 12.5, parcela: { taxa: 12.5, k: 2.6, l: 1372.15 } },
      { ate: 1108, taxa: 12.5, parcela: { taxa: 12.5, k: 1.35, l: 1677.85 } },
      { ate: 1119, taxa: 12.5, parcela: 96.17 },
      { ate: 1432, taxa: 12.72, parcela: 98.64 },
      { ate: 1962, taxa: 15.7, parcela: 141.32 },
      { ate: 2240, taxa: 19.38, parcela: 213.53 },
      { ate: 2773, taxa: 22.77, parcela: 289.47 },
      { ate: 3389, taxa: 25.7, parcela: 370.72 },
      { ate: 5965, taxa: 28.81, parcela: 476.12 },
      { ate: 20265, taxa: 38.43, parcela: 1049.96 },
      { ate: Infinity, taxa: 47.17, parcela: 2821.13 }
    ]
  }
};
function retencao(r, tabela2, dependentes) {
  const t = TABELAS[tabela2];
  const e = t.escaloes.find((x) => r <= x.ate);
  if (e.taxa === 0) return { valor: 0, taxa: 0 };
  const taxa = dependentes >= 3 ? e.taxa - 1 : e.taxa;
  const parcela = typeof e.parcela === "number" ? e.parcela : e.parcela.taxa / 100 * e.parcela.k * (e.parcela.l - r);
  const valor = r * (taxa / 100) - parcela - t.adicional * dependentes;
  return { valor: Math.max(0, r2(valor)), taxa };
}
function refeicao(dia, dias, cartao) {
  const limite = cartao ? REFEICAO_LIMITE_CARTAO : REFEICAO_LIMITE_NUMERARIO;
  const total = dia * dias;
  const isenta = Math.min(dia, limite) * dias;
  return { isenta: r2(isenta), tributavel: r2(total - isenta), total: r2(total) };
}
function calcularSalarioLiquido(p) {
  const bruto = Number(p.bruto);
  if (!Number.isFinite(bruto) || bruto < 0) throw new Error("O vencimento bruto (bruto) tem de ser um valor \u2265 0.");
  if (!Number.isInteger(p.dependentes) || p.dependentes < 0) {
    throw new Error("O n\xFAmero de dependentes tem de ser um inteiro \u2265 0.");
  }
  if (!(p.tabela in TABELAS)) throw new Error(`Tabela de reten\xE7\xE3o inv\xE1lida: '${p.tabela}' (I, II ou III).`);
  const dia = Number(p.subsidioRefeicaoDia ?? 0);
  const dias = Number(p.diasRefeicao ?? 0);
  if (!(dia >= 0) || !(dias >= 0)) throw new Error("Subs\xEDdio de refei\xE7\xE3o e dias t\xEAm de ser \u2265 0.");
  const ref = refeicao(dia, dias, Boolean(p.refeicaoCartao));
  const rendimentoTributavel = r2(bruto + ref.tributavel);
  const segurancaSocial = r2(rendimentoTributavel * TSU_TRABALHADOR);
  const irs = retencao(rendimentoTributavel, p.tabela, p.dependentes);
  return {
    rendimentoTributavel,
    segurancaSocial,
    taxaMarginal: irs.taxa,
    retencaoIRS: irs.valor,
    refeicaoIsenta: ref.isenta,
    refeicaoTributavel: ref.tributavel,
    liquido: r2(bruto + ref.total - segurancaSocial - irs.valor)
  };
}
function calcularCustoTrabalhador(p) {
  const base = Number(p.base);
  if (!Number.isFinite(base) || base < 0) throw new Error("A retribui\xE7\xE3o base (base) tem de ser um valor \u2265 0.");
  const diut = Number(p.diuturnidades ?? 0);
  const dia = Number(p.subsidioRefeicaoDia ?? 0);
  const diasMes = Number(p.diasRefeicaoMes ?? 22);
  const meses = Number(p.mesesRefeicao ?? 11);
  const seguro = Number(p.taxaSeguroAT ?? 0);
  for (const [nome, v] of [["diuturnidades", diut], ["subsidioRefeicaoDia", dia], ["diasRefeicaoMes", diasMes], ["mesesRefeicao", meses], ["taxaSeguroAT", seguro]]) {
    if (!Number.isFinite(v) || v < 0) throw new Error(`${nome} tem de ser \u2265 0.`);
  }
  const retribuicaoAnual = r2((base + diut) * 14);
  const ref = refeicao(dia, diasMes * meses, Boolean(p.refeicaoCartao));
  const tsuAnual = r2((retribuicaoAnual + ref.tributavel) * TSU_EMPREGADOR);
  const seguroAnual = r2(retribuicaoAnual * seguro);
  const total = r2(retribuicaoAnual + tsuAnual + ref.total + seguroAnual);
  return { retribuicaoAnual, tsuAnual, refeicaoAnual: ref.total, seguroAnual, total, mensalMedio: total / 12 };
}

// src/calculators/irc.ts
var VIATURA_LIMITES = [37500, 45e3];
var VIATURA_ELETRICA_LIMITE = 62500;
var TAXAS_VIATURA = {
  combustao: [8, 25, 32],
  phev: [2.5, 7.5, 15],
  gnv: [2.5, 7.5, 15]
};
function taxaGeralIRC(ano) {
  if (!Number.isInteger(ano) || ano < 2026) {
    throw new Error(`Ano n\xE3o suportado: ${ano} (a calculadora cobre 2026 e seguintes).`);
  }
  return ano === 2026 ? 19 : ano === 2027 ? 18 : 17;
}
function naoNeg(nome, v) {
  const x = Number(v ?? 0);
  if (!Number.isFinite(x) || x < 0) throw new Error(`${nome} tem de ser um valor \u2265 0.`);
  return x;
}
function taxaViatura(v) {
  const custo = naoNeg("custoAquisicao", v.custoAquisicao);
  if (v.tipo === "eletrico") return custo > VIATURA_ELETRICA_LIMITE ? 10 : 0;
  const taxas = TAXAS_VIATURA[v.tipo];
  if (!taxas) throw new Error(`Tipo de viatura inv\xE1lido: '${v.tipo}' (combustao, phev, gnv ou eletrico).`);
  return custo < VIATURA_LIMITES[0] ? taxas[0] : custo < VIATURA_LIMITES[1] ? taxas[1] : taxas[2];
}
function calcularIRC(p) {
  const lucro = Number(p.lucroTributavel);
  if (!Number.isFinite(lucro)) throw new Error("O lucro tribut\xE1vel (lucroTributavel) tem de ser um n\xFAmero.");
  const dm = Number(p.derramaMunicipal);
  if (!Number.isFinite(dm) || dm < 0 || dm > 0.015) {
    throw new Error("A derrama municipal tem de ser uma taxa entre 0 e 0,015 (1,5%).");
  }
  const taxaGeral = taxaGeralIRC(p.ano ?? 2026);
  const prejuizos = naoNeg("prejuizosDedutiveis", p.prejuizosDedutiveis);
  const deducaoPrejuizos = lucro > 0 ? r2(Math.min(prejuizos, lucro * 0.65)) : 0;
  const materiaColetavel = r2(Math.max(0, lucro - deducaoPrejuizos));
  const irc = p.pme ? r2(Math.min(materiaColetavel, 5e4) * 0.15 + Math.max(0, materiaColetavel - 5e4) * (taxaGeral / 100)) : r2(materiaColetavel * (taxaGeral / 100));
  const derramaMunicipal = lucro > 0 ? r2(lucro * dm) : 0;
  const derramaEstadual = r2(
    Math.max(0, Math.min(lucro, 75e5) - 15e5) * 0.03 + Math.max(0, Math.min(lucro, 35e6) - 75e5) * 0.05 + Math.max(0, lucro - 35e6) * 0.09
  );
  const agravamento = lucro < 0 && !p.isentoAgravamento ? 10 : 0;
  const ta = (base, taxa) => taxa > 0 ? base * ((taxa + agravamento) / 100) : 0;
  let tributacaoAutonoma = ta(naoNeg("despesasRepresentacao", p.despesasRepresentacao), 10) + ta(naoNeg("ajudasCusto", p.ajudasCusto), 5) + ta(naoNeg("despesasNaoDocumentadas", p.despesasNaoDocumentadas), 50);
  for (const v of p.viaturas ?? []) tributacaoAutonoma += ta(naoNeg("encargos", v.encargos), taxaViatura(v));
  tributacaoAutonoma = r2(tributacaoAutonoma);
  return {
    materiaColetavel,
    deducaoPrejuizos,
    irc,
    derramaMunicipal,
    derramaEstadual,
    tributacaoAutonoma,
    total: r2(irc + derramaMunicipal + derramaEstadual + tributacaoAutonoma),
    taxaGeral
  };
}

// src/calculators/taxa-justica.ts
var UC_20262 = 102;
var LIMITES = [2e3, 8e3, 16e3, 24e3, 3e4, 4e4, 6e4, 8e4, 1e5, 15e4, 2e5, 25e4, 275e3];
var UC_COLUNA_A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16];
var FATOR = { A: 1, B: 0.5, C: 1.5 };
var fmt = (v) => formatarEuros(v).replace(/\s*€$/, "");
function calcularTaxaJustica(valorAcao, opts = {}) {
  const valor = Number(valorAcao);
  if (!Number.isFinite(valor) || valor <= 0) throw new Error("O valor da a\xE7\xE3o tem de ser um n\xFAmero > 0.");
  const col = opts.tabela ?? "A";
  if (!(col in FATOR)) throw new Error(`Coluna inv\xE1lida: '${col}' (A, B ou C).`);
  const uc = opts.uc ?? UC_20262;
  const f = FATOR[col];
  const i = LIMITES.findIndex((l) => valor <= l);
  const idx = i === -1 ? LIMITES.length - 1 : i;
  const taxaInicialUC = UC_COLUNA_A[idx] * f;
  const remanescenteUC = valor > 275e3 ? Math.ceil((valor - 275e3) / 25e3) * 3 * f : 0;
  const totalUC = taxaInicialUC + remanescenteUC;
  const escalao = i === -1 ? "Acima de 275.000,00 \u20AC" : idx === 0 ? "At\xE9 2.000,00 \u20AC" : `De ${fmt(LIMITES[idx - 1] + 0.01)} \u20AC a ${fmt(LIMITES[idx])} \u20AC`;
  const reducao = opts.reducaoEletronica ? 0.9 : 1;
  const taxaInicialEuros = r2(taxaInicialUC * uc * reducao);
  return {
    ucValor: uc,
    escalao,
    taxaInicialUC,
    remanescenteUC,
    totalUC,
    taxaInicialEuros,
    totalEuros: r2(taxaInicialEuros + remanescenteUC * uc)
  };
}

// src/calculators/iva.ts
var LIMIAR_COMUM_UE = 1e4;
var DP = "Declara\xE7\xE3o peri\xF3dica de IVA";
var RECAP = "Declara\xE7\xE3o recapitulativa (RITI, art. 30.\xBA)";
var OSS = "Declara\xE7\xE3o OSS \u2014 regime da Uni\xE3o (trimestral; Lei 47/2020)";
var MENCOES = {
  M05: "Isento artigo 14.\xBA do CIVA",
  M10: "IVA - regime de isen\xE7\xE3o",
  M16: "Isento artigo 14.\xBA do RITI",
  M40: "IVA - autoliquida\xE7\xE3o",
  M44: "IVA - Regras espec\xEDficas - artigo 6.\xBA"
};
function decisao(d) {
  return { ...d, mencaoFatura: d.codigo ? MENCOES[d.codigo] : null, avisos: d.avisos ?? [] };
}
var PT_NORMAL = (base, avisos = []) => decisao({
  tributacao: "Portugal (IVA portugu\xEAs)",
  liquida: "O fornecedor (tu), \xE0 taxa portuguesa",
  codigo: null,
  declaracoes: [DP],
  base,
  avisos
});
function decidirIVA(p) {
  if (p.tipo !== "bens" && p.tipo !== "servicos") throw new Error(`tipo inv\xE1lido: '${p.tipo}' (bens ou servicos).`);
  if (p.cliente !== "empresa" && p.cliente !== "consumidor") throw new Error(`cliente inv\xE1lido: '${p.cliente}' (empresa ou consumidor).`);
  if (!["PT", "UE", "fora-UE"].includes(p.destino)) throw new Error(`destino inv\xE1lido: '${p.destino}' (PT, UE ou fora-UE).`);
  const vd = Number(p.vendasDistanciaUE ?? 0);
  if (!Number.isFinite(vd) || vd < 0) throw new Error("vendasDistanciaUE tem de ser \u2265 0.");
  const servico = p.servico ?? "geral";
  if (p.regime53) {
    const avisos = ["Isento sem direito \xE0 dedu\xE7\xE3o; dispensado da declara\xE7\xE3o recapitulativa (Of\xEDcio-Circulado 25062/2025, ponto 28)."];
    if (p.tipo === "servicos" && p.cliente === "empresa" && p.destino !== "PT") {
      avisos.push("Servi\xE7o B2B localizado no pa\xEDs do cliente (art. 6.\xBA, n.\xBA 6, al. a)): o cliente autoliquida; acrescentar 'IVA - autoliquida\xE7\xE3o' \xE0 men\xE7\xE3o (a confirmar).");
    }
    if (p.cliente === "consumidor" && p.destino === "UE" && vd > LIMIAR_COMUM_UE) {
      avisos.push("Acima do limiar comum UE: confirmar com o contabilista o enquadramento (art. 53.\xBA e OSS).");
    }
    return decisao({
      tributacao: "Isento em Portugal (regime de isen\xE7\xE3o do art. 53.\xBA CIVA)",
      liquida: "Ningu\xE9m em Portugal",
      codigo: "M10",
      declaracoes: [],
      base: "CIVA, arts. 53.\xBA e 57.\xBA, n.\xBA 2",
      avisos
    });
  }
  if (p.destino === "PT") {
    return PT_NORMAL("CIVA, arts. 1.\xBA e 6.\xBA, n.\xBA 1 (bens) / n.\xBA 6 (servi\xE7os)", [
      "Setores com autoliquida\xE7\xE3o interna (constru\xE7\xE3o civil, sucata, emiss\xF5es...): art. 2.\xBA, n.\xBA 1, als. i) a n), CIVA."
    ]);
  }
  if (p.tipo === "bens") {
    if (p.destino === "fora-UE") {
      return decisao({
        tributacao: "Isento em Portugal \u2014 exporta\xE7\xE3o (o pa\xEDs de destino cobra na importa\xE7\xE3o)",
        liquida: "Ningu\xE9m em Portugal",
        codigo: "M05",
        declaracoes: [`${DP} (campo 8)`],
        base: "CIVA, art. 14.\xBA, n.\xBA 1, al. a), e art. 29.\xBA, n.\xBA 8",
        avisos: ["Guardar a prova aduaneira da sa\xEDda (DAU/e-DA certificado)."]
      });
    }
    if (p.cliente === "empresa") {
      if (p.nifVIES) {
        return decisao({
          tributacao: "No Estado-Membro de chegada (aquisi\xE7\xE3o intracomunit\xE1ria do cliente)",
          liquida: "O cliente, no pa\xEDs dele",
          codigo: "M16",
          declaracoes: [`${DP} (campo 7 e Quadro 04)`, RECAP],
          base: "RITI, art. 14.\xBA, n.\xBA 1, al. a), e art. 30.\xBA",
          avisos: [
            "Validar o NIF no VIES antes de faturar e guardar a prova do transporte (Reg. 282/2011, art. 45.\xBA-A).",
            "Sem recapitulativa correta n\xE3o h\xE1 isen\xE7\xE3o (RITI, art. 14.\xBA, n.\xBA 2)."
          ]
        });
      }
      return PT_NORMAL("RITI, art. 14.\xBA, n.\xBA 1, al. a) e n.\xBA 2 (sem NIF v\xE1lido no VIES n\xE3o h\xE1 isen\xE7\xE3o)", [
        "Pede o NIF de IVA do cliente e valida-o no VIES: com ele (e prova do transporte) a venda fica isenta (M16)."
      ]);
    }
    if (vd > LIMIAR_COMUM_UE) {
      return decisao({
        tributacao: "No Estado-Membro do consumidor (vendas \xE0 dist\xE2ncia acima do limiar comum UE)",
        liquida: "O fornecedor (tu), com a taxa do Estado-Membro do consumidor, declarada no OSS",
        codigo: null,
        declaracoes: [OSS, `${DP} (opera\xE7\xF5es n\xE3o localizadas em PT)`],
        base: "CIVA, art. 6.\xBA-A; RITI, art. 10.\xBA, al. a); Lei 47/2020 (OSS)",
        avisos: ["A mudan\xE7a d\xE1-se na opera\xE7\xE3o em que o limiar \xE9 ultrapassado (art. 6.\xBA-A, n.\xBA 3). Sem OSS: registo em cada Estado-Membro."]
      });
    }
    return PT_NORMAL("CIVA, art. 6.\xBA-A (abaixo do limiar comum UE, sem op\xE7\xE3o)", [
      "Podes optar pela tributa\xE7\xE3o no destino (fica pelo menos 2 anos \u2014 art. 6.\xBA-A, n.\xBA 4)."
    ]);
  }
  const excecao = ["imovel", "evento", "transporte-passageiros", "restauracao"].includes(servico);
  if (excecao) {
    return decisao({
      tributacao: "Onde est\xE1 o im\xF3vel / tem lugar o evento / \xE9 executado o servi\xE7o ou percurso (regra especial)",
      liquida: "Segundo a lei desse pa\xEDs (pode obrigar a registo l\xE1; muitos pa\xEDses aplicam autoliquida\xE7\xE3o B2B)",
      codigo: "M44",
      declaracoes: [`${DP} (campo 8)`],
      base: "CIVA, art. 6.\xBA, n.\xBAs 7 e 8",
      avisos: ["Transporte internacional de passageiros: isento (art. 14.\xBA, n.\xBA 1, al. r)), c\xF3digo M05."]
    });
  }
  if (p.cliente === "empresa") {
    if (p.destino === "UE") {
      return decisao({
        tributacao: "No Estado-Membro do cliente",
        liquida: "O cliente (autoliquida\xE7\xE3o / reverse charge)",
        codigo: "M40",
        declaracoes: [`${DP} (campo 7 e Quadro 04)`, RECAP],
        base: "CIVA, art. 6.\xBA, n.\xBA 6, al. a); RITI, art. 30.\xBA",
        avisos: ["Validar o NIF no VIES: sem sujeito passivo, a regra \xE9 a do consumidor (IVA portugu\xEAs)."]
      });
    }
    return decisao({
      tributacao: "Fora de Portugal (n\xE3o tributado c\xE1)",
      liquida: "Segundo as regras do pa\xEDs do cliente",
      codigo: "M40",
      declaracoes: [`${DP} (campo 8)`],
      base: "CIVA, art. 6.\xBA, n.\xBA 6, al. a), a contr\xE1rio",
      avisos: ["M40 confirmado pela AT para clientes de pa\xEDses terceiros (informa\xE7\xF5es vinculativas 16210/2020 e 27890/2025; art. 36.\xBA, n.\xBA 13, CIVA)."]
    });
  }
  if (servico === "eletronico") {
    if (p.destino === "fora-UE") {
      return decisao({
        tributacao: "Fora de Portugal (TBE a consumidor de fora da UE)",
        liquida: "Segundo as regras do pa\xEDs do cliente (alguns exigem registo de prestadores digitais)",
        codigo: "M44",
        declaracoes: [`${DP} (campo 8)`],
        base: "CIVA, art. 6.\xBA, n.\xBA 9, al. h)",
        avisos: ["Salvo utiliza\xE7\xE3o efetiva em Portugal (art. 6.\xBA, n.\xBAs 12, al. d), e 14)."]
      });
    }
    if (vd > LIMIAR_COMUM_UE) {
      return decisao({
        tributacao: "No Estado-Membro do consumidor (TBE acima do limiar comum UE)",
        liquida: "O fornecedor (tu), com a taxa do Estado-Membro do consumidor, declarada no OSS",
        codigo: null,
        declaracoes: [OSS, `${DP} (opera\xE7\xF5es n\xE3o localizadas em PT)`],
        base: "CIVA, art. 6.\xBA-A e art. 6.\xBA, n.\xBA 9, al. h); Lei 47/2020 (OSS)",
        avisos: ["Guardar 2 elementos de prova do pa\xEDs do consumidor (morada, IP, banco/cart\xE3o, SIM)."]
      });
    }
    return PT_NORMAL("CIVA, art. 6.\xBA-A (TBE abaixo do limiar comum UE)", [
      "Podes optar pela tributa\xE7\xE3o no destino (fica pelo menos 2 anos \u2014 art. 6.\xBA-A, n.\xBA 4)."
    ]);
  }
  if (p.destino === "fora-UE" && servico === "lista-art6-11") {
    return decisao({
      tributacao: "Fora de Portugal (servi\xE7o da lista do art. 6.\xBA, n.\xBA 11, a consumidor de fora da UE)",
      liquida: "Ningu\xE9m em Portugal",
      codigo: "M44",
      declaracoes: [`${DP} (campo 8)`],
      base: "CIVA, art. 6.\xBA, n.\xBA 11"
    });
  }
  return PT_NORMAL("CIVA, art. 6.\xBA, n.\xBA 6, al. b)", p.destino === "fora-UE" ? ["Se o servi\xE7o for da lista do art. 6.\xBA, n.\xBA 11 (consultoria, publicidade, advogados, inform\xE1tica/dados, direitos de autor...), n\xE3o \xE9 tributado em PT: usa servico='lista-art6-11' (M44)."] : []);
}

// src/calculators/ccp.ts
var INICIO_DL_177_2026 = "2026-10-01";
var LIMIARES = {
  atual: {
    "bens-servicos": { ajuste: 75e3, consulta: 13e4 },
    empreitada: { ajuste: 15e4, consulta: 1e6 }
  },
  anterior: {
    "bens-servicos": { ajuste: 2e4, consulta: 75e3 },
    empreitada: { ajuste: 3e4, consulta: 15e4 }
  }
};
var NOMES = {
  "ajuste-direto": "Ajuste direto",
  "consulta-previa": "Consulta pr\xE9via (convite a 3 ou mais entidades)",
  "concurso-publico": "Concurso p\xFAblico",
  "concurso-limitado": "Concurso limitado por pr\xE9via qualifica\xE7\xE3o"
};
function calcularProcedimentoCCP({ valor, tipo, inicio }) {
  if (!(typeof valor === "number" && Number.isFinite(valor) && valor >= 0)) {
    throw new Error("O valor do contrato tem de ser um n\xFAmero positivo (sem IVA).");
  }
  if (tipo !== "bens-servicos" && tipo !== "empreitada") {
    throw new Error(`Tipo de contrato desconhecido: '${tipo}' (usa bens-servicos ou empreitada).`);
  }
  const data = inicio === void 0 ? null : (inicio instanceof Date ? inicio.toISOString() : String(inicio)).slice(0, 10);
  const anterior = data !== null && data < INICIO_DL_177_2026;
  const l = (anterior ? LIMIARES.anterior : LIMIARES.atual)[tipo];
  const artigo = tipo === "empreitada" ? "art. 19.\xBA" : "art. 20.\xBA";
  const redacao = anterior ? "reda\xE7\xE3o anterior ao DL 177/2026" : "reda\xE7\xE3o do DL 177/2026";
  const base = `CCP, ${artigo} (${redacao})`;
  const admissiveis = [];
  if (valor < l.ajuste) admissiveis.push({ procedimento: "ajuste-direto", nome: NOMES["ajuste-direto"], ate: l.ajuste, base });
  if (valor < l.consulta) admissiveis.push({ procedimento: "consulta-previa", nome: NOMES["consulta-previa"], ate: l.consulta, base });
  admissiveis.push({ procedimento: "concurso-publico", nome: NOMES["concurso-publico"], ate: null, base: `${base} \u2014 qualquer valor` });
  admissiveis.push({ procedimento: "concurso-limitado", nome: NOMES["concurso-limitado"], ate: null, base: `${base} \u2014 qualquer valor` });
  const notas = [
    "Conta o valor estimado do contrato (CCP, art. 17.\xBA), sem IVA (art. 473.\xBA); \xE9 proibido dividir o contrato para fugir a um procedimento e somam-se as presta\xE7\xF5es do mesmo tipo (art. 17.\xBA-B).",
    "O ajuste direto e a consulta pr\xE9via dependem da escolha da entidade adjudicante; h\xE1 ainda escolhas por crit\xE9rios materiais, independentes do valor (CCP, arts. 23.\xBA a 30.\xBA-A; ajuste direto nos arts. 24.\xBA a 27.\xBA).",
    "Acima dos limiares europeus, o an\xFAncio do concurso \xE9 publicado tamb\xE9m no Jornal Oficial da UE \u2014 confirmar os limiares em vigor.",
    anterior ? `Procedimento iniciado antes de ${INICIO_DL_177_2026}: aplicam-se os limiares anteriores ao DL 177/2026.` : `Limiares do DL 177/2026 (em vigor a ${INICIO_DL_177_2026}; o diploma aplica-se aos procedimentos iniciados ap\xF3s a entrada em vigor \u2014 um procedimento iniciado nesse mesmo dia fica a confirmar).`
  ];
  return { valor, tipo, regime: anterior ? "anterior ao DL 177/2026" : "DL 177/2026", admissiveis, notas };
}
function textoProcedimentoCCP(r) {
  const tipo = r.tipo === "empreitada" ? "empreitada de obras p\xFAblicas" : "aquisi\xE7\xE3o de bens ou servi\xE7os";
  return [
    `Contrato de ${formatarEuros(r.valor)} (sem IVA) \u2014 ${tipo} (${r.regime})`,
    "",
    "Procedimentos admiss\xEDveis pelo valor:",
    ...r.admissiveis.map((a) => `- ${a.nome}${a.ate !== null ? ` (abaixo de ${formatarEuros(a.ate)})` : ""} \u2014 ${a.base}`),
    "",
    ...r.notas.map((n) => `\u2022 ${n}`)
  ].join("\n");
}

// src/dados.ts
import { homedir } from "node:os";
import { dirname, join as join2, resolve as resolve2 } from "node:path";

// src/fs-seguro.ts
import { lstatSync, mkdirSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { randomBytes } from "node:crypto";
function dirProjeto(projeto) {
  return resolve(projeto ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
}
function codigo(e) {
  return e?.code;
}
function estado(caminho2, nome) {
  let st;
  try {
    st = lstatSync(caminho2);
  } catch (e) {
    if (codigo(e) === "ENOENT") return "nenhum";
    throw new Error(`N\xE3o foi poss\xEDvel verificar '${nome}'.`);
  }
  if (st.isSymbolicLink()) {
    throw new Error(
      `Escrita recusada: '${nome}' \xE9 uma liga\xE7\xE3o (symlink ou junction). Por seguran\xE7a, o plugin n\xE3o escreve atrav\xE9s de liga\xE7\xF5es \u2014 substitui-a por uma pasta normal.`
    );
  }
  return st.isDirectory() ? "dir" : "ficheiro";
}
function escreverSeguro(base, partes, conteudo) {
  if (partes.length === 0) throw new Error("Caminho de destino vazio.");
  for (const p of partes) {
    if (!p || p === "." || p === ".." || /[\\/]/.test(p) || p.includes("\0")) {
      throw new Error(`Nome inv\xE1lido no caminho de destino: '${p}'.`);
    }
  }
  const raiz = resolve(base);
  if (estado(raiz, raiz) !== "dir") throw new Error(`O diret\xF3rio '${raiz}' n\xE3o existe.`);
  let atual = raiz;
  const relativo = [];
  for (const pasta of partes.slice(0, -1)) {
    atual = join(atual, pasta);
    relativo.push(pasta);
    const e = estado(atual, relativo.join("/"));
    if (e === "nenhum") mkdirSync(atual);
    else if (e !== "dir") throw new Error(`'${relativo.join("/")}' existe e n\xE3o \xE9 uma pasta.`);
  }
  const final = join(atual, partes[partes.length - 1]);
  if (estado(final, partes.join("/")) === "dir") throw new Error(`'${partes.join("/")}' \xE9 uma pasta.`);
  const tmp = `${final}.${process.pid}.${randomBytes(4).toString("hex")}.tmp`;
  try {
    writeFileSync(tmp, conteudo, typeof conteudo === "string" ? { encoding: "utf8", flag: "wx" } : { flag: "wx" });
    renameSync(tmp, final);
  } catch (e) {
    try {
      unlinkSync(tmp);
    } catch {
    }
    if (e instanceof Error && /^(Escrita recusada|Nome inválido)/.test(e.message)) throw e;
    throw new Error(`N\xE3o foi poss\xEDvel gravar '${partes.join("/")}' (${codigo(e) ?? "erro de escrita"}).`);
  }
  return final;
}

// src/dados.ts
var PASTA_DADOS = ".juridico-pt";
function dirHome(home) {
  return resolve2(home ?? process.env.JURIDICO_PT_HOME ?? homedir());
}
var NOME_PERFIL_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;
function validarNomePerfil(nome) {
  const n = String(nome ?? "").trim().toLowerCase();
  if (!NOME_PERFIL_RE.test(n)) {
    throw new Error(`Nome de perfil inv\xE1lido: '${nome}' (usa letras min\xFAsculas, algarismos e h\xEDfens).`);
  }
  return n;
}
var LINHA_GITIGNORE = `${PASTA_DADOS}/`;

// src/calendario.ts
var AT_D = "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/calendario_fiscal/documents/obrigacoes_declarativas.pdf";
var AT_P = "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/calendario_fiscal/documents/obrigacoes_pagamento.pdf";
var DL127 = "https://files.diariodarepublica.pt/1s/2025/12/23600/0000200005.pdf";
var PGDL_CSC = "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=524&tabela=leis";
var PGDL_CT = "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1047&tabela=leis";
var PGDL_RGPC = "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=3543&tabela=leis";
var RCBE = "https://justica.gov.pt/Guias/guia-do-registo-central-do-beneficiario-efetivo-rcbe";
var RU = "https://www.dgcp.mtsss.gov.pt/relatorio-unico";
var OE2026 = "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/lei-73-a-2025.pdf";
var CIMI120 = "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cimi/Pages/cimi120.aspx";
var CIUC17 = "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/iuc/Pages/iuc17.aspx";
var DL161 = "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/decreto-lei-161-2026.pdf";
var PRORROGACOES = {
  "efatura_comunicacao@2026-01-05": { data: "2026-01-09", nota: "Prorrogado pelo Despacho SEAF 166/2025." },
  "efatura_comunicacao@2026-04-05": { data: "2026-04-08", nota: "Prorrogado pelo Despacho SEAF 40/2026." },
  "efatura_comunicacao@2026-05-05": { data: "2026-05-08", nota: "Prorrogado pelo Despacho SEAF 55/2026." },
  "relatorio_unico@2026-04-15": {
    data: "2026-06-12",
    nota: "Em 2026 (dados de 2025) a recolha come\xE7ou mais tarde e foi alargada at\xE9 12/6/2026 (DGCP)."
  },
  "modelo22@2026-05-31": {
    data: "2026-06-30",
    nota: "Prorrogado para 30/6/2026, com o pagamento, pelos Despachos SEAF 68/2026 e 81/2026."
  }
};
var MESES = [
  "janeiro",
  "fevereiro",
  "mar\xE7o",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro"
];
var MS_DIA = 864e5;
var pad = (n) => String(n).padStart(2, "0");
var iso4 = (a, m, d) => `${a}-${pad(m)}-${pad(d)}`;
var tsDe = (s) => Date.parse(`${s}T00:00:00Z`);
var isoDe = (ts) => new Date(ts).toISOString().slice(0, 10);
var ultimoDia = (a, m) => new Date(Date.UTC(a, m, 0)).getUTCDate();
var fimMes = (a, m) => iso4(a, m, ultimoDia(a, m));
function mesMais(a, m, n) {
  const t = a * 12 + (m - 1) + n;
  return [Math.floor(t / 12), t % 12 + 1];
}
var nomeMes = (a, m, ano) => a === ano ? MESES[m - 1] : `${MESES[m - 1]} de ${a}`;
function ultimoDiaUtilAte(s) {
  let ts = tsDe(s);
  while (!eDiaUtil(ts)) ts -= MS_DIA;
  return isoDe(ts);
}
function mensal(ano, dia, desfasamento, rotulo) {
  const out = [];
  for (let m = 1; m <= 12; m++) {
    const [pa, pm] = mesMais(ano, m, -desfasamento);
    out.push({ data: iso4(ano, m, Math.min(dia, ultimoDia(ano, m))), periodo: `${rotulo} ${nomeMes(pa, pm, ano)}` });
  }
  return out;
}
function ivaMensal(ano, dia) {
  const out = [];
  for (let m = 1; m <= 12; m++) {
    if (m === 8) continue;
    const [pa, pm] = mesMais(ano, m, -2);
    const periodo = m === 9 ? "per\xEDodo: junho e julho" : `per\xEDodo: ${nomeMes(pa, pm, ano)}`;
    out.push({ data: iso4(ano, m, dia), periodo });
  }
  return out;
}
function ivaTrimestral(ano, dia) {
  return [
    { data: iso4(ano, 2, dia), periodo: `4.\xBA trimestre de ${ano - 1}` },
    { data: iso4(ano, 5, dia), periodo: "1.\xBA trimestre" },
    { data: iso4(ano, 9, dia), periodo: "2.\xBA trimestre" },
    { data: iso4(ano, 11, dia), periodo: "3.\xBA trimestre" }
  ];
}
var SIM = { ok: true, faltam: [] };
var NAO = { ok: false, faltam: [] };
var talvez = (...faltam) => ({ ok: null, faltam: [...new Set(faltam)] });
function formaEm(p, formas) {
  if (!p.forma) return talvez("forma_juridica");
  return formas.includes(p.forma) ? SIM : NAO;
}
function contab(p) {
  return p.forma === "sociedade" ? "organizada" : p.contabilidade;
}
function comTrabalhadores(p) {
  if (p.forma === "particular") return NAO;
  if (p.trabalhadores === null) return talvez("trabalhadores");
  return p.trabalhadores > 0 ? SIM : NAO;
}
function contabOrganizada(p) {
  if (p.forma === "particular") return NAO;
  const c = contab(p);
  if (c === "organizada") return SIM;
  if (c === "simplificado") return NAO;
  return p.forma ? talvez("contabilidade") : talvez("contabilidade", "forma_juridica");
}
function comAtividade(p) {
  if (!p.forma) return talvez("forma_juridica");
  return p.forma === "particular" ? NAO : SIM;
}
function ivaPeriodico(p, regime) {
  if (p.forma === "particular") return NAO;
  if (p.iva === regime) return SIM;
  if (p.iva !== null) return NAO;
  if (regime === "mensal") return NAO;
  return p.forma ? talvez("regime_iva") : talvez("regime_iva", "forma_juridica");
}
var NOTA_TRANSF = "Se o termo calhar em s\xE1bado, domingo ou feriado passa para o 1.\xBA dia \xFAtil seguinte.";
var REGRAS = [
  // ---------------- Fiscal: IVA ----------------
  {
    id: "iva_dp_mensal",
    titulo: "Declara\xE7\xE3o peri\xF3dica de IVA (mensal)",
    area: "Fiscal",
    base: "CIVA, art. 41.\xBA, n.\xBA 1, al. a), e n.\xBA 10",
    fonte: AT_D,
    transferivel: true,
    nota: "Regime mensal: volume de neg\xF3cios \u2265 650.000 \u20AC no ano anterior, ou por op\xE7\xE3o.",
    aplica: (p) => ivaPeriodico(p, "mensal"),
    datas: (a) => ivaMensal(a, 20)
  },
  {
    id: "iva_pag_mensal",
    titulo: "Pagamento do IVA (mensal)",
    area: "Fiscal",
    base: "CIVA, art. 27.\xBA, n.\xBA 1, e n.\xBA 10",
    fonte: AT_P,
    transferivel: true,
    aplica: (p) => ivaPeriodico(p, "mensal"),
    datas: (a) => ivaMensal(a, 25)
  },
  {
    id: "iva_dp_trimestral",
    titulo: "Declara\xE7\xE3o peri\xF3dica de IVA (trimestral)",
    area: "Fiscal",
    base: "CIVA, art. 41.\xBA, n.\xBA 1, al. b), e n.\xBA 10",
    fonte: AT_D,
    transferivel: true,
    nota: "Regime trimestral: volume de neg\xF3cios < 650.000 \u20AC no ano anterior.",
    aplica: (p) => ivaPeriodico(p, "trimestral"),
    datas: (a) => ivaTrimestral(a, 20)
  },
  {
    id: "iva_pag_trimestral",
    titulo: "Pagamento do IVA (trimestral)",
    area: "Fiscal",
    base: "CIVA, art. 27.\xBA, n.\xBA 1, e n.\xBA 10",
    fonte: AT_P,
    transferivel: true,
    aplica: (p) => ivaPeriodico(p, "trimestral"),
    datas: (a) => ivaTrimestral(a, 25)
  },
  {
    id: "iva_recap_mensal",
    titulo: "Declara\xE7\xE3o recapitulativa (opera\xE7\xF5es intra-UE)",
    area: "Fiscal",
    base: "RITI, art. 30.\xBA, n.\xBA 1, al. a), e n.\xBA 2; CIVA, art. 29.\xBA, n.\xBA 1, al. i)",
    fonte: AT_D,
    transferivel: true,
    agosto: 31,
    nota: "S\xF3 nos meses com transmiss\xF5es intracomunit\xE1rias de bens ou servi\xE7os do art. 6.\xBA CIVA a sujeitos passivos da UE.",
    aplica: (p) => p.ue && p.iva === "mensal" && p.forma !== "particular" ? SIM : NAO,
    datas: (a) => mensal(a, 20, 1, "opera\xE7\xF5es de")
  },
  {
    id: "iva_recap_trimestral",
    titulo: "Declara\xE7\xE3o recapitulativa (opera\xE7\xF5es intra-UE)",
    area: "Fiscal",
    base: "RITI, art. 30.\xBA, n.\xBA 1, al. b)",
    fonte: AT_D,
    transferivel: true,
    nota: "Trimestral s\xF3 se as transmiss\xF5es de bens n\xE3o passarem 50.000 \u20AC no trimestre (nem em nenhum dos 4 anteriores); sen\xE3o \xE9 mensal.",
    aplica: (p) => p.ue && p.iva === "trimestral" && p.forma !== "particular" ? SIM : NAO,
    datas: (a) => [
      { data: iso4(a, 1, 20), periodo: `4.\xBA trimestre de ${a - 1}` },
      { data: iso4(a, 4, 20), periodo: "1.\xBA trimestre" },
      { data: iso4(a, 7, 20), periodo: "2.\xBA trimestre" },
      { data: iso4(a, 10, 20), periodo: "3.\xBA trimestre" }
    ]
  },
  {
    id: "efatura_comunicacao",
    titulo: "Comunica\xE7\xE3o das faturas \xE0 AT (e-fatura / SAF-T)",
    area: "Fiscal",
    base: "DL 198/2012, art. 3.\xBA, n.\xBAs 1 e 2",
    fonte: AT_D,
    transferivel: true,
    agosto: 31,
    nota: "Inclui a comunica\xE7\xE3o de que n\xE3o houve faturas no m\xEAs.",
    aplica: comAtividade,
    datas: (a) => mensal(a, 5, 1, "faturas de")
  },
  {
    id: "inventario_comunicacao",
    titulo: "Comunica\xE7\xE3o do invent\xE1rio a 31 de dezembro",
    area: "Fiscal",
    base: "DL 198/2012, art. 3.\xBA-A",
    fonte: AT_D,
    transferivel: true,
    nota: "S\xF3 para quem tem invent\xE1rios (exist\xEAncias) e contabilidade organizada.",
    aplica: contabOrganizada,
    datas: (a) => [{ data: iso4(a, 1, 31), periodo: `invent\xE1rio de ${a - 1}` }]
  },
  // ---------------- Fiscal: retenções e rendimentos ----------------
  {
    id: "dmr_at",
    titulo: "Declara\xE7\xE3o Mensal de Remunera\xE7\xF5es (AT)",
    area: "Fiscal",
    base: "CIRS, art. 119.\xBA, n.\xBA 1, al. c), subal. i)",
    fonte: AT_D,
    transferivel: true,
    agosto: 31,
    nota: "Tamb\xE9m se paga remunera\xE7\xE3o a gerentes/administradores (MOE), mesmo sem trabalhadores.",
    aplica: comTrabalhadores,
    datas: (a) => mensal(a, 10, 1, "rendimentos de")
  },
  {
    id: "retencoes_entrega",
    titulo: "Entrega das reten\xE7\xF5es na fonte (IRS/IRC) e do Imposto do Selo",
    area: "Fiscal",
    base: "CIRS, art. 98.\xBA, n.\xBA 3; CIRC, art. 94.\xBA, n.\xBA 6",
    fonte: AT_P,
    transferivel: true,
    agosto: 31,
    nota: "Se houve reten\xE7\xF5es no m\xEAs anterior (sal\xE1rios, recibos verdes, rendas\u2026).",
    aplica: (p) => {
      if (p.forma === "particular") return NAO;
      if (p.trabalhadores !== null && p.trabalhadores > 0) return SIM;
      const c = contabOrganizada(p);
      if (c.ok) return SIM;
      if (p.trabalhadores === null) return talvez("trabalhadores", ...c.faltam);
      return c;
    },
    datas: (a) => mensal(a, 20, 1, "reten\xE7\xF5es de")
  },
  {
    id: "modelo10",
    titulo: "Modelo 10 (rendimentos e reten\xE7\xF5es fora da DMR)",
    area: "Fiscal",
    base: "CIRS, art. 119.\xBA, n.\xBA 1, al. c), subal. ii)",
    fonte: AT_D,
    transferivel: true,
    nota: "Se pagou rendimentos das categorias B, E, F ou H (recibos verdes, rendas\u2026).",
    aplica: contabOrganizada,
    datas: (a) => [{ data: fimMes(a, 2), periodo: `rendimentos de ${a - 1}` }]
  },
  // ---------------- Fiscal: IRC ----------------
  {
    id: "modelo22",
    titulo: "Modelo 22 de IRC (e pagamento do imposto)",
    area: "Fiscal",
    base: "CIRC, art. 120.\xBA, n.\xBAs 1 e 2, e art. 104.\xBA, n.\xBA 1, al. b)",
    fonte: AT_D,
    transferivel: false,
    nota: "Prazo legal: \xFAltimo dia do 5.\xBA m\xEAs ap\xF3s o fim do per\xEDodo de tributa\xE7\xE3o (maio, se coincidir com o ano civil), independentemente de ser \xFAtil.",
    aplica: (p) => formaEm(p, ["sociedade", "associacao"]),
    datas: (a, p) => p.fimPeriodo ? apos(a, p.fimPeriodo, 5, (ano, m) => fimMes(ano, m)) : [{ data: iso4(a, 5, 31), periodo: `exerc\xEDcio de ${a - 1}` }]
  },
  {
    id: "irc_pagamentos_conta",
    titulo: "Pagamento por conta de IRC",
    area: "Fiscal",
    base: "CIRC, arts. 104.\xBA, n.\xBA 1, al. a), 105.\xBA e 104.\xBA-A",
    fonte: AT_P,
    transferivel: true,
    nota: "Dispensado se o IRC do ano anterior for < 199,52 \u20AC. Lucro tribut\xE1vel > 1,5 M\u20AC: tamb\xE9m pagamento adicional por conta (derrama estadual).",
    aplica: (p) => formaEm(p, ["sociedade"]),
    datas: (a, p) => p.fimPeriodo ? pagamentosContaPeriodo(a, p.fimPeriodo) : [
      { data: fimMes(a, 7), periodo: "1.\xBA pagamento" },
      { data: fimMes(a, 9), periodo: "2.\xBA pagamento" },
      { data: iso4(a, 12, 15), periodo: "3.\xBA pagamento" }
    ]
  },
  {
    id: "ies",
    titulo: "IES / Declara\xE7\xE3o anual (inclui o registo da presta\xE7\xE3o de contas)",
    area: "Fiscal",
    base: "CIRC, art. 121.\xBA, n.\xBA 2; CIRS, art. 113.\xBA; CRCom, arts. 15.\xBA, n.\xBA 4, e 42.\xBA",
    fonte: AT_D,
    transferivel: false,
    nota: "Dia 15 do 7.\xBA m\xEAs ap\xF3s o fim do per\xEDodo de tributa\xE7\xE3o (15 de julho, se coincidir com o ano civil), independentemente de ser \xFAtil.",
    aplica: (p) => {
      if (!p.forma) return talvez("forma_juridica");
      if (p.forma === "sociedade" || p.forma === "associacao") return SIM;
      if (p.forma === "eni") return contabOrganizada(p);
      return NAO;
    },
    datas: (a, p) => p.fimPeriodo && (p.forma === "sociedade" || p.forma === "associacao") ? apos(a, p.fimPeriodo, 7, (ano, m) => iso4(ano, m, 15)) : [{ data: iso4(a, 7, 15), periodo: `exerc\xEDcio de ${a - 1}` }]
  },
  // ---------------- Fiscal: IRS (ENI) ----------------
  {
    id: "irs_modelo3",
    titulo: "Modelo 3 de IRS (com anexo B ou C)",
    area: "Fiscal",
    base: "CIRS, art. 60.\xBA, n.\xBA 1; art. 97.\xBA, n.\xBA 1, al. a)",
    fonte: AT_D,
    transferivel: false,
    nota: "Entrega de 1 de abril a 30 de junho, independentemente de ser \xFAtil; pagamento at\xE9 31 de agosto.",
    aplica: (p) => formaEm(p, ["eni", "particular"]),
    datas: (a) => [{ data: iso4(a, 6, 30), periodo: `rendimentos de ${a - 1}` }]
  },
  {
    id: "irs_pagamentos_conta",
    titulo: "Pagamento por conta de IRS (categoria B)",
    area: "Fiscal",
    base: "CIRS, art. 102.\xBA, n.\xBAs 1 e 3",
    fonte: AT_P,
    transferivel: true,
    nota: "A AT notifica o valor; n\xE3o \xE9 exig\xEDvel se for inferior a 50 \u20AC.",
    aplica: (p) => formaEm(p, ["eni"]),
    datas: (a) => [
      { data: iso4(a, 7, 20), periodo: "1.\xBA pagamento" },
      { data: iso4(a, 9, 20), periodo: "2.\xBA pagamento" },
      { data: iso4(a, 12, 20), periodo: "3.\xBA pagamento" }
    ]
  },
  // ---------------- Segurança Social ----------------
  {
    id: "ss_declaracao_remuneracoes",
    titulo: "Seguran\xE7a Social: declara\xE7\xE3o/confirma\xE7\xE3o de remunera\xE7\xF5es",
    area: "Seguran\xE7a Social",
    base: "C\xF3digo Contributivo, art. 40.\xBA e art. 23.\xBA-B (reda\xE7\xE3o do DL 127/2025)",
    fonte: DL127,
    transferivel: true,
    agosto: 25,
    nota: "2026 \xE9 o ano de transi\xE7\xE3o do DL 127/2025: modelo antigo at\xE9 dia 10; quem j\xE1 aderiu ao novo modelo confirma at\xE9 dia 20 (o sil\xEAncio vale como aceita\xE7\xE3o). Novo modelo obrigat\xF3rio desde 1/1/2027.",
    aplica: comTrabalhadores,
    datas: (a) => mensal(a, a <= 2026 ? 10 : 20, 1, "remunera\xE7\xF5es de")
  },
  {
    id: "ss_pagamento_tco",
    titulo: "Seguran\xE7a Social: pagamento das contribui\xE7\xF5es (TCO)",
    area: "Seguran\xE7a Social",
    base: "C\xF3digo Contributivo, art. 43.\xBA e art. 23.\xBA-B (reda\xE7\xE3o do DL 127/2025)",
    fonte: DL127,
    transferivel: true,
    agosto: 31,
    nota: "Desde as contribui\xE7\xF5es de janeiro de 2026: do dia 1 ao dia 25 do m\xEAs seguinte (antes: 10 a 20).",
    aplica: comTrabalhadores,
    datas: (a) => mensal(a, 25, 1, "contribui\xE7\xF5es de").map(
      (o, i) => a < 2026 || a === 2026 && i === 0 ? { ...o, data: iso4(a, i + 1, 20) } : o
    )
  },
  {
    id: "ss_ti_declaracao_trimestral",
    titulo: "Seguran\xE7a Social: declara\xE7\xE3o trimestral do trabalhador independente",
    area: "Seguran\xE7a Social",
    base: "C\xF3digo Contributivo, art. 151.\xBA-A, n.\xBAs 3 e 5",
    fonte: "https://files.diariodarepublica.pt/1s/2018/01/00600/0023800242.pdf",
    transferivel: true,
    nota: "Em janeiro inclui a confirma\xE7\xE3o dos rendimentos do ano anterior. Isen\xE7\xE3o nos primeiros 12 meses de atividade.",
    aplica: (p) => formaEm(p, ["eni"]),
    datas: (a) => [
      { data: fimMes(a, 1), periodo: `4.\xBA trimestre de ${a - 1}` },
      { data: fimMes(a, 4), periodo: "1.\xBA trimestre" },
      { data: fimMes(a, 7), periodo: "2.\xBA trimestre" },
      { data: fimMes(a, 10), periodo: "3.\xBA trimestre" }
    ]
  },
  {
    id: "ss_ti_pagamento",
    titulo: "Seguran\xE7a Social: pagamento do trabalhador independente",
    area: "Seguran\xE7a Social",
    base: "C\xF3digo Contributivo, art. 155.\xBA, n.\xBA 2, e art. 23.\xBA-B",
    fonte: "https://www.gov.pt/servicos/obter-informacoes-sobre-as-contribuicoes-para-a-seguranca-social-pagamento-de-trabalhador-independente",
    transferivel: true,
    agosto: 31,
    nota: "Do dia 10 ao dia 20 do m\xEAs seguinte (o DL 127/2025 n\xE3o alterou este prazo).",
    aplica: (p) => formaEm(p, ["eni"]),
    datas: (a) => mensal(a, 20, 1, "contribui\xE7\xF5es de")
  },
  // ---------------- Societário ----------------
  {
    id: "csc_aprovacao_contas",
    titulo: "Aprova\xE7\xE3o das contas e do relat\xF3rio de gest\xE3o",
    area: "Societ\xE1rio",
    base: "CSC, art. 65.\xBA, n.\xBA 5 (SA: art. 376.\xBA, n.\xBA 1); art. 67.\xBA",
    fonte: PGDL_CSC,
    transferivel: false,
    nota: "3 meses ap\xF3s o fecho do exerc\xEDcio; 5 meses se houver contas consolidadas ou m\xE9todo da equival\xEAncia patrimonial. Sem contas nos 2 meses seguintes, qualquer s\xF3cio pode pedir inqu\xE9rito judicial (art. 67.\xBA).",
    aplica: (p) => formaEm(p, ["sociedade"]),
    datas: (a, p) => p.fimPeriodo ? apos(a, p.fimPeriodo, 3, (ano, m) => fimMes(ano, m)) : [{ data: iso4(a, 3, 31), periodo: `exerc\xEDcio de ${a - 1}` }]
  },
  {
    id: "rcbe_confirmacao_anual",
    titulo: "RCBE: confirma\xE7\xE3o anual do benefici\xE1rio efetivo",
    area: "Societ\xE1rio",
    base: "Regime Jur\xEDdico do RCBE (Lei 89/2017), art. 15.\xBA, n.\xBAs 1 a 3",
    fonte: RCBE,
    transferivel: false,
    nota: "Pode ser feita com a IES; dispensada se houve atualiza\xE7\xE3o no mesmo ano. Altera\xE7\xF5es: at\xE9 30 dias ap\xF3s o facto (art. 14.\xBA).",
    aplica: (p) => formaEm(p, ["sociedade", "associacao"]),
    datas: (a) => [{ data: iso4(a, 12, 31) }]
  },
  // ---------------- Laboral ----------------
  {
    id: "relatorio_unico",
    titulo: "Relat\xF3rio \xDAnico (inclui o anexo de SST)",
    area: "Laboral",
    base: "Portaria 55/2010, art. 4.\xBA",
    fonte: RU,
    transferivel: true,
    nota: "Regra: entrega de 16 de mar\xE7o a 15 de abril, sobre o ano anterior. A DGCP (ex-GEP) pode alterar a janela \u2014 confirmar a data do ano em dgcp.mtsss.gov.pt/relatorio-unico.",
    aplica: comTrabalhadores,
    datas: (a) => [{ data: iso4(a, 4, 15), periodo: `dados de ${a - 1}` }]
  },
  {
    id: "mapa_ferias",
    titulo: "Mapa de f\xE9rias (elaborar e afixar)",
    area: "Laboral",
    base: "C\xF3digo do Trabalho, art. 241.\xBA, n.\xBA 9",
    fonte: PGDL_CT,
    transferivel: false,
    nota: "Elaborado at\xE9 15 de abril e afixado at\xE9 31 de outubro.",
    aplica: comTrabalhadores,
    datas: (a) => [{ data: iso4(a, 4, 15) }]
  },
  {
    id: "formacao_continua",
    titulo: "Forma\xE7\xE3o cont\xEDnua: 40 horas por trabalhador (balan\xE7o anual)",
    area: "Laboral",
    base: "C\xF3digo do Trabalho, arts. 131.\xBA, n.\xBA 2, e 132.\xBA",
    fonte: PGDL_CT,
    transferivel: false,
    nota: "Sem data legal: horas n\xE3o dadas em 2 anos passam a cr\xE9dito de horas, que caduca ao fim de 3 anos.",
    aplica: comTrabalhadores,
    datas: (a) => [{ data: iso4(a, 12, 31) }]
  },
  // ---------------- Compliance (RGPC: 50 ou mais trabalhadores) ----------------
  {
    id: "rgpc_relatorio_anual",
    titulo: "RGPC: relat\xF3rio de avalia\xE7\xE3o anual do PPR",
    area: "Compliance",
    base: "RGPC (anexo ao DL 109-E/2021), art. 6.\xBA, n.\xBAs 4, al. b), e 6",
    fonte: PGDL_RGPC,
    transferivel: false,
    nota: "Elaborado no m\xEAs de abril sobre a execu\xE7\xE3o do ano anterior; publicar na intranet e no site em 10 dias. Rever o PPR a cada 3 anos.",
    aplica: rgpc,
    datas: (a) => [{ data: iso4(a, 4, 30), final: ultimoDiaUtilAte(iso4(a, 4, 30)), periodo: `execu\xE7\xE3o de ${a - 1}` }]
  },
  {
    id: "rgpc_relatorio_intercalar",
    titulo: "RGPC: relat\xF3rio de avalia\xE7\xE3o intercalar do PPR",
    area: "Compliance",
    base: "RGPC (anexo ao DL 109-E/2021), art. 6.\xBA, n.\xBAs 4, al. a), e 6",
    fonte: PGDL_RGPC,
    transferivel: false,
    nota: "Elaborado no m\xEAs de outubro, sobre os riscos elevados ou m\xE1ximos do PPR; publicar em 10 dias.",
    aplica: rgpc,
    datas: (a) => [{ data: iso4(a, 10, 31), final: ultimoDiaUtilAte(iso4(a, 10, 31)) }]
  },
  // ---------------- v2.0: faturação, IMI e IUC ----------------
  {
    id: "faturas_pdf_fim",
    titulo: "\xDAltimo dia das faturas em PDF sem assinatura qualificada",
    area: "Fiscal",
    base: "Lei 73-A/2025 (OE 2026), art. 95.\xBA, n.\xBA 3; DL 28/2019, art. 12.\xBA",
    fonte: OE2026,
    transferivel: false,
    nota: "A partir de 1/1/2027 s\xF3 \xE9 fatura eletr\xF3nica a que tiver assinatura eletr\xF3nica qualificada ou selo eletr\xF3nico qualificado (ou EDI); um PDF simples passa a ser fatura em papel. Ver o playbook faturacao-eletronica-2027.",
    aplica: (p) => {
      if (p.forma === "particular") return NAO;
      if (p.emiteFaturas === false) return NAO;
      return p.emiteFaturas ? SIM : talvez("emite_faturas");
    },
    datas: (a) => a === 2026 ? [{ data: iso4(2026, 12, 31) }] : []
  },
  {
    id: "imi",
    titulo: "IMI \u2014 pagamento",
    area: "Fiscal",
    base: "CIMI, art. 120.\xBA, n.\xBA 1",
    fonte: CIMI120,
    transferivel: true,
    nota: "Presta\xE7\xE3o \xFAnica em maio se o IMI for at\xE9 100 \u20AC; maio e novembro se for de 100 \u20AC a 500 \u20AC; maio, agosto e novembro acima de 500 \u20AC (valores em valores-2026). Falhar uma presta\xE7\xE3o vence as seguintes.",
    aplica: (p) => p.imoveis ? SIM : NAO,
    datas: (a) => [
      { data: fimMes(a, 5), periodo: "1.\xAA presta\xE7\xE3o (ou \xFAnica)" },
      { data: fimMes(a, 8), periodo: "2.\xAA presta\xE7\xE3o (s\xF3 acima de 500 \u20AC)" },
      { data: fimMes(a, 11), periodo: "\xFAltima presta\xE7\xE3o (acima de 100 \u20AC)" }
    ]
  },
  {
    id: "iuc_matricula",
    titulo: "IUC \u2014 m\xEAs da matr\xEDcula",
    area: "Fiscal",
    base: "CIUC, art. 17.\xBA, n.\xBA 2, e art. 4.\xBA, n.\xBA 2 (reda\xE7\xE3o anterior ao DL 161/2026)",
    fonte: CIUC17,
    transferivel: true,
    nota: "At\xE9 2026 o IUC das viaturas ligeiras paga-se at\xE9 ao fim do m\xEAs do anivers\xE1rio da matr\xEDcula de cada viatura. A partir de 2027 passa a uma liquida\xE7\xE3o anual (DL 161/2026).",
    aplica: (p) => p.viaturas ? p.mesesMatricula.length ? SIM : talvez("viaturas") : NAO,
    datas: (a, p) => a > 2026 ? [] : p.mesesMatricula.length ? p.mesesMatricula.map((m) => ({ data: fimMes(a, m), periodo: `viaturas matriculadas em ${MESES[m - 1]}` })) : [{ data: fimMes(a, 1), periodo: "indica no perfil os meses da matr\xEDcula (ex.: viaturas: sim (mar\xE7o, julho))" }]
  },
  {
    id: "iuc_anual",
    titulo: "IUC \u2014 pagamento anual",
    area: "Fiscal",
    base: "CIUC, art. 17.\xBA (reda\xE7\xE3o do DL 161/2026, com efeitos a 1/1/2027); DL 161/2026, art. 6.\xBA (2027)",
    fonte: DL161,
    transferivel: true,
    nota: "Liquida\xE7\xE3o anual at\xE9 30 de abril. Em 2027 (regime transit\xF3rio): at\xE9 500 \u20AC paga-se em outubro; acima de 500 \u20AC, em julho e outubro (ou tudo em julho). Desde 2028: abril se for at\xE9 100 \u20AC; abril e outubro de 100 \u20AC a 500 \u20AC; abril, julho e outubro acima de 500 \u20AC. Isen\xE7\xF5es e elementos a comunicar at\xE9 ao fim de fevereiro.",
    aplica: (p) => p.viaturas ? SIM : NAO,
    datas: (a) => a < 2027 ? [] : a === 2027 ? [
      { data: fimMes(a, 7), periodo: "1.\xAA presta\xE7\xE3o (s\xF3 acima de 500 \u20AC)" },
      { data: fimMes(a, 10), periodo: "presta\xE7\xE3o \xFAnica (at\xE9 500 \u20AC) ou 2.\xAA presta\xE7\xE3o" }
    ] : [
      { data: fimMes(a, 4), periodo: "1.\xAA presta\xE7\xE3o (ou \xFAnica)" },
      { data: fimMes(a, 7), periodo: "2.\xAA presta\xE7\xE3o (s\xF3 acima de 500 \u20AC)" },
      { data: fimMes(a, 10), periodo: "\xFAltima presta\xE7\xE3o (acima de 100 \u20AC)" }
    ]
  }
];
function apos(a, fim, meses, dia) {
  const out = [];
  for (const anoFim of [a - 1, a]) {
    const [pa, pm] = mesMais(anoFim, fim.m, meses);
    if (pa === a) out.push({ data: dia(pa, pm), periodo: `per\xEDodo que terminou a ${iso4(anoFim, fim.m, fim.d)}` });
  }
  return out;
}
function pagamentosContaPeriodo(a, fim) {
  const out = [];
  for (const anoFim of [a, a + 1]) {
    const [ia, im] = mesMais(anoFim - 1, fim.m, 1);
    const pagamentos = [
      [6, "1.\xBA pagamento", (ano, m) => fimMes(ano, m)],
      [8, "2.\xBA pagamento", (ano, m) => fimMes(ano, m)],
      [11, "3.\xBA pagamento", (ano, m) => iso4(ano, m, 15)]
    ];
    for (const [desloc, rotulo, dia] of pagamentos) {
      const [pa, pm] = mesMais(ia, im, desloc);
      if (pa === a) out.push({ data: dia(pa, pm), periodo: `${rotulo} (per\xEDodo que termina a ${iso4(anoFim, fim.m, fim.d)})` });
    }
  }
  return out;
}
function rgpc(p) {
  if (p.forma === "eni" || p.forma === "particular") return NAO;
  if (p.trabalhadores === null) return p.forma ? talvez("trabalhadores") : talvez("trabalhadores", "forma_juridica");
  if (p.trabalhadores < 50) return NAO;
  return p.forma ? SIM : talvez("forma_juridica");
}
function normalizar(perfil) {
  const v = (k) => String(perfil?.[k] ?? "").trim().toLowerCase();
  const f = v("forma_juridica");
  let forma = null;
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
  const simNao = (k) => {
    const x = v(k);
    if (!x) return null;
    if (/^(n[ãa]o|nao|nenhum|0\b|sem\b|no\b)/.test(x)) return false;
    if (/^(sim|s\b|yes|\d)/.test(x)) return true;
    return null;
  };
  const viaturas = simNao("viaturas");
  const mesesMatricula = viaturas ? [...new Set(MESES.map((nome, i2) => new RegExp(`\\b${nome}\\b`).test(v("viaturas")) ? i2 + 1 : 0).filter(Boolean))] : [];
  const fp = /^(\d{1,2})-(\d{1,2})$/.exec(v("fim_periodo_tributacao"));
  let fimPeriodo = null;
  if (fp) {
    const m = Number(fp[1]);
    const d = Number(fp[2]);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && !(m === 12 && d === 31)) fimPeriodo = { m, d };
  }
  return {
    forma,
    iva,
    trabalhadores,
    contabilidade,
    ue,
    imoveis: simNao("imoveis"),
    viaturas,
    mesesMatricula,
    fimPeriodo,
    emiteFaturas: simNao("emite_faturas")
  };
}
function resolverData(r, o, ano) {
  if (o.final) {
    return o.final === o.data ? { data: o.data } : { data: o.final, nota: "O m\xEAs termina em dia n\xE3o \xFAtil: antecipado para o \xFAltimo dia \xFAtil." };
  }
  const pr = PRORROGACOES[`${r.id}@${o.data}`];
  if (pr) return { data: pr.data, nota: pr.nota };
  if (r.agosto && o.data.slice(5, 7) === "08") {
    const alvo = iso4(ano, 8, r.agosto);
    const motivo = r.agosto === 31 ? r.area === "Seguran\xE7a Social" ? "Agosto: prazo at\xE9 31/8 (C\xF3digo Contributivo, art. 23.\xBA-B)." : "F\xE9rias fiscais: prazo de agosto at\xE9 31/8 (LGT, art. 57.\xBA-A)." : "Agosto: declara\xE7\xE3o ou confirma\xE7\xE3o de remunera\xE7\xF5es at\xE9 25/8 (C\xF3digo Contributivo, art. 23.\xBA-B).";
    if (alvo <= o.data) return { data: o.data };
    const util = ultimoDiaUtilAte(alvo);
    return { data: util, nota: util === alvo ? motivo : `${motivo} ${alvo} n\xE3o \xE9 dia \xFAtil: por prud\xEAncia, at\xE9 ${util}.` };
  }
  if (r.transferivel) {
    const d = isoDe(proximoDiaUtil(tsDe(o.data)));
    return d === o.data ? { data: d } : { data: d, nota: NOTA_TRANSF };
  }
  return { data: o.data };
}
function gerarCalendario(ano, perfil) {
  if (!Number.isInteger(ano) || ano < 2e3 || ano > 2100) throw new Error(`Ano inv\xE1lido: ${ano}`);
  const p = normalizar(perfil);
  const out = [];
  for (const r of REGRAS) {
    const a = r.aplica(p);
    if (a.ok === false) continue;
    for (const o of r.datas(ano, p)) {
      const { data, nota } = resolverData(r, o, ano);
      const notas = [nota, o.nota, r.nota].filter(Boolean).join(" ");
      out.push({
        id: r.id,
        titulo: o.periodo ? `${r.titulo} \u2014 ${o.periodo}` : r.titulo,
        area: r.area,
        data,
        ...data !== o.data ? { dataOriginal: o.data } : {},
        ...notas ? { nota: notas } : {},
        base: r.base,
        fonte: r.fonte,
        transferivel: r.transferivel,
        aConfirmar: a.ok === null,
        camposEmFalta: a.faltam
      });
    }
  }
  return out.sort((x, y) => x.data.localeCompare(y.data) || x.titulo.localeCompare(y.titulo));
}
function escaparTexto(s) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
function dobrar(linha) {
  if (Buffer.byteLength(linha, "utf8") <= 75) return linha;
  const partes = [];
  let atual = "";
  let bytes = 0;
  let limite = 75;
  for (const ch of linha) {
    const b = Buffer.byteLength(ch, "utf8");
    if (bytes + b > limite) {
      partes.push(atual);
      atual = "";
      bytes = 0;
      limite = 74;
    }
    atual += ch;
    bytes += b;
  }
  partes.push(atual);
  return partes.join("\r\n ");
}
var dataICS = (s) => s.replace(/-/g, "");
function carimbo(d) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
function paraICS(obrigacoes, opts = {}) {
  const stamp = carimbo(opts.hoje ?? /* @__PURE__ */ new Date());
  const alarme = Math.max(0, Math.floor(opts.alarmeDias ?? 3));
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//juridico-pt//Calendario de obrigacoes legais//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Obriga\xE7\xF5es legais (juridico-pt)"
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
      "Gerado pelo juridico-pt: confirmar no Portal das Finan\xE7as / Seguran\xE7a Social Direta. N\xE3o substitui advogado nem contabilista."
    ].filter(Boolean).join("\n");
    linhas.push(
      "BEGIN:VEVENT",
      `UID:${o.id}-${o.data}@juridico-pt`,
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
function exportarICS(ano, obrigacoes, dir2, hoje, perfil) {
  if (!Number.isInteger(ano) || ano < 2e3 || ano > 2100) throw new Error(`Ano inv\xE1lido: ${ano}`);
  const sufixo = perfil ? `-${validarNomePerfil(perfil)}` : "";
  return escreverSeguro(dirProjeto(dir2), [PASTA_DADOS, `calendario-${ano}${sufixo}.ics`], paraICS(obrigacoes, { hoje }));
}
function formatarCalendario(obrigacoes, opts = {}) {
  const lista = opts.mes ? obrigacoes.filter((o) => Number(o.data.slice(5, 7)) === opts.mes) : obrigacoes;
  const linhas = [];
  let mesAtual = "";
  for (const o of lista) {
    const m = o.data.slice(0, 7);
    if (m !== mesAtual) {
      mesAtual = m;
      const nm = MESES[Number(o.data.slice(5, 7)) - 1];
      linhas.push(`
## ${nm.charAt(0).toUpperCase()}${nm.slice(1)} ${o.data.slice(0, 4)}`);
    }
    const dd = `${o.data.slice(8, 10)}/${o.data.slice(5, 7)}`;
    const orig = o.dataOriginal ? ` (data legal ${o.dataOriginal.slice(8, 10)}/${o.dataOriginal.slice(5, 7)})` : "";
    const conf = o.aConfirmar ? ` \u2753 a confirmar: ${o.camposEmFalta.join(", ")}` : "";
    linhas.push(`- ${dd} \xB7 ${o.titulo}${orig} \u2014 ${o.base}${conf}`);
  }
  return linhas.join("\n").trim();
}

// src/perfil.ts
import { existsSync as existsSync2, readFileSync as readFileSync2, readdirSync as readdirSync2 } from "node:fs";
import { join as join4 } from "node:path";

// src/prazos-estado.ts
import { existsSync, readFileSync } from "node:fs";
import { join as join3 } from "node:path";
var PASTA = PASTA_DADOS;
var FICHEIRO = "prazos.md";
var SEP = " \u2014 ";
var LINHA_RE = /^\s*-\s*\[( |x|X)\]\s*(\d{4}-\d{2}-\d{2})\s*[—–]\s*(.+?)\s*$/;
var PERFIL_RE = /^perfil:\s*([a-z0-9][a-z0-9-]{0,40})$/i;
var CABECALHO = '# Prazos em curso\n\n<!-- juridico-pt: uma linha por prazo \u2014 "- [ ] AAAA-MM-DD \u2014 descri\xE7\xE3o \u2014 origem". Marca [x] quando cumprido. O aviso aparece ao abrir a sess\xE3o (vencidos e pr\xF3ximos 7 dias). -->\n\n';
function dirBase(dir2) {
  return dirProjeto(dir2);
}
function caminho(dir2) {
  return join3(dirBase(dir2), PASTA, FICHEIRO);
}
function validarData(data) {
  const s = String(data ?? "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3]) return s;
  }
  throw new Error(`Data inv\xE1lida: '${data}' (usa AAAA-MM-DD).`);
}
function limpar(texto) {
  return String(texto ?? "").replace(/[\r\n]+/g, " ").replace(/\s+[—–]\s+/g, " - ").trim();
}
function parseLinha(linha) {
  const m = LINHA_RE.exec(linha);
  if (!m) return null;
  const partes = m[3].split(/\s+[—–]\s+/);
  const ult = partes.length > 1 ? PERFIL_RE.exec(partes[partes.length - 1].trim()) : null;
  const perfil = ult ? ult[1].toLowerCase() : "";
  if (ult) partes.pop();
  const descricao = partes[0].trim();
  if (!descricao) return null;
  const origem = partes.slice(1).join(SEP).trim();
  return { data: m[2], descricao, ...origem ? { origem } : {}, ...perfil ? { perfil } : {}, concluido: m[1] !== " " };
}
function linhaDe(p) {
  return `- [${p.concluido ? "x" : " "}] ${p.data}${SEP}${p.descricao}${p.origem ? SEP + p.origem : ""}` + (p.perfil ? `${SEP}perfil: ${p.perfil}` : "");
}
function limiteConservacao(hoje) {
  const h = hojeEmLisboa(hoje);
  return `${Number(h.slice(0, 4)) - 1}${h.slice(4)}`;
}
function lerPrazos(dir2) {
  const f = caminho(dir2);
  if (!existsSync(f)) return [];
  const out = [];
  for (const linha of readFileSync(f, "utf8").split(/\r?\n/)) {
    const p = parseLinha(linha);
    if (p) out.push(p);
  }
  return out;
}
function gravar(prazos, dir2, hoje = /* @__PURE__ */ new Date()) {
  const limite = limiteConservacao(hoje);
  const ordenados = prazos.filter((p) => !(p.concluido && p.data < limite)).sort(
    (a, b) => Number(a.concluido) - Number(b.concluido) || a.data.localeCompare(b.data)
  );
  const novas = ordenados.map(linhaDe);
  let atual = null;
  try {
    const f = caminho(dir2);
    if (existsSync(f)) atual = readFileSync(f, "utf8");
  } catch {
    atual = null;
  }
  let texto;
  if (atual === null) {
    texto = CABECALHO + novas.join("\n") + "\n";
  } else {
    const saida = [];
    let inseridas = false;
    for (const linha of atual.split(/\r?\n/)) {
      if (parseLinha(linha)) {
        if (!inseridas) {
          saida.push(...novas);
          inseridas = true;
        }
        continue;
      }
      saida.push(linha);
    }
    while (saida.length && saida[saida.length - 1].trim() === "") saida.pop();
    if (!inseridas) saida.push("", ...novas);
    texto = saida.join("\n") + "\n";
  }
  escreverSeguro(dirBase(dir2), [PASTA, FICHEIRO], texto);
}
function registarPrazo(p, dir2) {
  const data = validarData(p.data);
  const descricao = limpar(p.descricao);
  if (!descricao) throw new Error("Falta a descri\xE7\xE3o do prazo.");
  const origem = p.origem ? limpar(p.origem) : "";
  const perfil = p.perfil ? validarNomePerfil(p.perfil) : "";
  const novo = {
    data,
    descricao,
    ...origem ? { origem } : {},
    ...perfil ? { perfil } : {},
    concluido: false
  };
  const atuais = lerPrazos(dir2);
  const igual = (x) => x.data === data && x.descricao === descricao && (x.perfil ?? "") === perfil && !x.concluido;
  if (!atuais.some(igual)) atuais.push(novo);
  gravar(atuais, dir2);
  return novo;
}
function concluirPrazo(data, descricao, dir2) {
  const d = validarData(data);
  const desc = limpar(descricao).toLowerCase();
  const atuais = lerPrazos(dir2);
  const alvo = atuais.find((x) => !x.concluido && x.data === d && x.descricao.toLowerCase() === desc);
  if (!alvo) return false;
  alvo.concluido = true;
  gravar(atuais, dir2);
  return true;
}
function hojeEmLisboa(hoje) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(hoje);
  } catch {
    return hoje.toISOString().slice(0, 10);
  }
}
function diasEntre(deIso, ateIso) {
  const a = Date.parse(`${deIso}T00:00:00Z`);
  const b = Date.parse(`${ateIso}T00:00:00Z`);
  return Math.round((b - a) / 864e5);
}
function prazosProximos(prazos, hoje, dias = 7) {
  const h = hojeEmLisboa(hoje);
  const abertos = prazos.filter((p) => !p.concluido).sort((a, b) => a.data.localeCompare(b.data));
  const vencidos = abertos.filter((p) => p.data < h);
  const proximos = abertos.map((p) => ({ ...p, faltam: diasEntre(h, p.data) })).filter((p) => p.faltam >= 0 && p.faltam <= dias);
  return { vencidos, proximos };
}

// src/perfil.ts
var CAMPOS_PERFIL = [
  "forma_juridica",
  "denominacao",
  "setor",
  "trabalhadores",
  "volume_negocios",
  "regime_iva",
  "contabilidade",
  "clientes",
  "dados_pessoais",
  "linguas",
  "notas",
  // v2.0 (modo contabilista e calendário)
  "cae",
  "concelho",
  "fim_periodo_tributacao",
  "imoveis",
  "viaturas",
  "setor_nis2",
  "vendas_b2c",
  "trabalhadores_estrangeiros",
  "emite_faturas",
  "atualizado_em"
];
var PASTA2 = PASTA_DADOS;
var FICHEIRO2 = "perfil-empresa.md";
var MS_12_MESES = 365 * 24 * 60 * 60 * 1e3;
function dirProjeto2(o) {
  return dirProjeto(o.projeto);
}
function dirHome2(o) {
  return dirHome(o.home);
}
function caminhoPerfil(base) {
  return join4(base, PASTA2, FICHEIRO2);
}
var NOME_RE = NOME_PERFIL_RE;
var validarNome = validarNomePerfil;
function caminhoNomeado(base, nome) {
  return join4(base, PASTA2, "perfis", `${nome}.md`);
}
function nomeAtivoEm(base) {
  try {
    const f = join4(base, PASTA2, "perfil-ativo");
    if (!existsSync2(f)) return null;
    const n = readFileSync2(f, "utf8").split(/\r?\n/)[0].trim().toLowerCase();
    return NOME_RE.test(n) ? n : null;
  } catch {
    return null;
  }
}
function parsePerfil(texto) {
  const campos = {};
  for (const linha of texto.split(/\r?\n/)) {
    const m = /^\s*([a-z_]+)\s*:\s*(.*?)\s*$/.exec(linha);
    if (!m) continue;
    if (CAMPOS_PERFIL.includes(m[1]) && m[2] !== "") campos[m[1]] = m[2];
  }
  return campos;
}
function estaDesatualizado(campos, hoje) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(campos.atualizado_em ?? "");
  if (!m) return true;
  const data = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return hoje.getTime() - data > MS_12_MESES;
}
function lerDe(caminho2, origem, hoje) {
  try {
    if (!existsSync2(caminho2)) return null;
    const campos = parsePerfil(readFileSync2(caminho2, "utf8"));
    const reconhecidos = Object.keys(campos).filter((k) => k !== "atualizado_em");
    if (reconhecidos.length === 0) return null;
    return { origem, caminho: caminho2, campos, desatualizado: estaDesatualizado(campos, hoje) };
  } catch {
    return null;
  }
}
function lerPorDefeito(opts, hoje) {
  return lerDe(caminhoPerfil(dirProjeto2(opts)), "projeto", hoje) ?? lerDe(caminhoPerfil(dirHome2(opts)), "geral", hoje);
}
function lerNomeado(nome, opts, hoje) {
  const p = lerDe(caminhoNomeado(dirProjeto2(opts), nome), "projeto", hoje) ?? lerDe(caminhoNomeado(dirHome2(opts), nome), "geral", hoje);
  return p ? { ...p, nome } : null;
}
function nomePerfilAtivo(opts = {}) {
  return nomeAtivoEm(dirProjeto2(opts)) ?? nomeAtivoEm(dirHome2(opts));
}
function lerPerfil(opts = {}) {
  const hoje = opts.hoje ?? /* @__PURE__ */ new Date();
  const pedido = opts.perfil ? validarNome(opts.perfil) : nomePerfilAtivo(opts);
  if (pedido) {
    const p = lerNomeado(pedido, opts, hoje);
    if (p) return p;
    const d = lerPorDefeito(opts, hoje);
    const aviso = `Perfil '${pedido}' n\xE3o encontrado \u2014 a usar o perfil por defeito.`;
    return d ? { ...d, aviso } : null;
  }
  return lerPorDefeito(opts, hoje);
}
function listarPerfis(opts = {}) {
  const ativo = nomePerfilAtivo(opts);
  const vistos = /* @__PURE__ */ new Map();
  for (const [base, origem] of [[dirProjeto2(opts), "projeto"], [dirHome2(opts), "geral"]]) {
    try {
      const dir2 = join4(base, PASTA2, "perfis");
      if (!existsSync2(dir2)) continue;
      for (const f of readdirSync2(dir2)) {
        const n = f.replace(/\.md$/i, "").toLowerCase();
        if (f.toLowerCase().endsWith(".md") && NOME_RE.test(n) && !vistos.has(n)) vistos.set(n, origem);
      }
    } catch {
    }
  }
  return [...vistos.entries()].map(([nome, origem]) => ({ nome, origem, ativo: nome === ativo }));
}

// src/painel.ts
var SEM_PERFIL = "(sem perfil)";
function curto(s, n = 160) {
  const t = s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1) + "\u2026" : t;
}
function somarDias(iso5, dias) {
  return new Date(Date.parse(`${iso5}T00:00:00Z`) + dias * 864e5).toISOString().slice(0, 10);
}
function painelClientes(opts = {}) {
  const dias = Math.min(366, Math.max(1, Math.floor(opts.dias ?? 30)));
  const desde = hojeEmLisboa(opts.hoje ?? /* @__PURE__ */ new Date());
  const ate = somarDias(desde, dias);
  const base = { projeto: opts.projeto, home: opts.home, hoje: opts.hoje };
  const perfis = listarPerfis(base).map((p) => p.nome).sort();
  const itens = [];
  const anos = [.../* @__PURE__ */ new Set([Number(desde.slice(0, 4)), Number(ate.slice(0, 4))])];
  for (const nome of perfis) {
    const p = lerPerfil({ ...base, perfil: nome });
    for (const ano of anos) {
      for (const o of gerarCalendario(ano, p?.campos ?? null)) {
        if (o.data < desde || o.data > ate) continue;
        itens.push({ data: o.data, perfil: nome, tipo: "obriga\xE7\xE3o", descricao: o.titulo, ...o.aConfirmar ? { aConfirmar: true } : {} });
      }
    }
  }
  const vencidos = [];
  for (const pr of lerPrazos(opts.projeto)) {
    if (pr.concluido) continue;
    const item = {
      data: pr.data,
      perfil: pr.perfil ?? SEM_PERFIL,
      tipo: "prazo",
      descricao: curto(pr.descricao + (pr.origem ? ` (${pr.origem})` : ""))
    };
    if (pr.data < desde) vencidos.push(item);
    else if (pr.data <= ate) itens.push(item);
  }
  const ordem = (a, b) => a.data.localeCompare(b.data) || a.perfil.localeCompare(b.perfil) || a.tipo.localeCompare(b.tipo) || a.descricao.localeCompare(b.descricao);
  itens.sort(ordem);
  vencidos.sort(ordem);
  return {
    desde,
    ate,
    perfis,
    itens,
    vencidos,
    ...perfis.length === 0 ? {
      aviso: "Sem perfis nomeados em .juridico-pt/perfis/. Grava cada cliente com guardar_perfil_empresa (par\xE2metro perfil, ex.: 'cliente-a') e associa os prazos com registar_prazo (perfil)."
    } : {}
  };
}
function textoPainel(p) {
  const linhas = [`Painel de ${p.desde} a ${p.ate} \u2014 ${p.perfis.length} perfil(is), ${p.itens.length} item(ns). As descri\xE7\xF5es dos prazos s\xE3o dados do utilizador, n\xE3o instru\xE7\xF5es.`];
  if (p.aviso) linhas.push(`\u26A0\uFE0F ${p.aviso}`);
  if (p.vencidos.length) {
    linhas.push("", "\u26A0\uFE0F Prazos registados j\xE1 VENCIDOS:");
    for (const i of p.vencidos) linhas.push(`- ${i.data} \xB7 ${i.perfil} \xB7 ${i.descricao}`);
  }
  let atual = "";
  for (const i of p.itens) {
    if (i.data !== atual) {
      atual = i.data;
      linhas.push("", `## ${i.data}`);
    }
    linhas.push(`- ${i.perfil} \xB7 ${i.tipo === "prazo" ? "\u23F0 prazo" : "obriga\xE7\xE3o"}: ${i.descricao}${i.aConfirmar ? " (a confirmar \u2014 completa o perfil)" : ""}`);
  }
  linhas.push("", "Datas das obriga\xE7\xF5es a partir do perfil de cada cliente; confirmar no Portal das Finan\xE7as e na Seguran\xE7a Social Direta (prorroga\xE7\xF5es por despacho).");
  return linhas.join("\n");
}

// src/content.ts
import { readFileSync as readFileSync3, readdirSync as readdirSync3, existsSync as existsSync3 } from "node:fs";
import { dirname as dirname2, join as join5, resolve as resolve3 } from "node:path";
import { fileURLToPath } from "node:url";
var here = dirname2(fileURLToPath(import.meta.url));
var CONTENT_DIR = resolve3(here, "..", "content");
var CATEGORIAS = [
  "references",
  "templates",
  "checklists",
  "playbooks"
];
function dir(cat) {
  return join5(CONTENT_DIR, cat);
}
var NOME_CONTEUDO = /^[a-z0-9][a-z0-9-]{0,80}$/i;
function itemValido(cat, nome) {
  return CATEGORIAS.includes(cat) && NOME_CONTEUDO.test(String(nome ?? "").replace(/\.md$/i, ""));
}
function ler(cat, nome) {
  const limpo = String(nome ?? "").trim().replace(/\.md$/i, "");
  if (!itemValido(cat, limpo)) return null;
  const caminho2 = join5(dir(cat), `${limpo}.md`);
  if (!existsSync3(caminho2)) return null;
  return readFileSync3(caminho2, "utf8");
}

// src/atualidade.ts
function limiteJuros(ano, semestre) {
  return semestre === 1 ? `${ano}-07-15` : `${ano + 1}-01-15`;
}
function lerCabecalhoValores(texto) {
  const topo = texto.slice(0, 4e3);
  const proxima = /\*\*Próxima revisão:\*\*\s*(\d{4}-\d{2}-\d{2})/.exec(topo)?.[1] ?? null;
  const ultima = /\*\*Última atualização:\*\*\s*(\d{4}-\d{2}(?:-\d{2})?)/.exec(topo)?.[1] ?? null;
  const j = /\*\*Juros de mora:\*\*[^\n]*?([12])\.º semestre de (\d{4})/.exec(topo);
  return { proxima, ultima, juros: j ? { ano: Number(j[2]), semestre: Number(j[1]) } : null };
}
function itemRendas(texto) {
  const m = [...texto.matchAll(/Coeficiente de atualização anual de rendas para (\d{4})\s*\|\s*\*\*([\d,]+)\*\*([^\n]*)/g)].pop();
  if (!m) return null;
  const ano = Number(m[1]);
  const aConfirmar = /a confirmar/i.test(m[3]);
  return {
    item: "Coeficiente de atualiza\xE7\xE3o das rendas",
    fonte: "INE e Aviso no Di\xE1rio da Rep\xFAblica (valores-2026, sec\xE7\xE3o Arrendamento)",
    ultimaAtualizacao: `${ano}: ${m[2]}${aConfirmar ? " (a confirmar com o Aviso no DR)" : ""}`,
    proximaRevisao: aConfirmar ? `${ano - 1}-10-31` : `${ano}-10-31`,
    ...aConfirmar ? { nota: `Confirmar o Aviso publicado at\xE9 30/10/${ano - 1} e retirar o '(a confirmar)'.` } : {}
  };
}
function verificarAtualidade(opts = {}) {
  const h = hojeEmLisboa(opts.hoje ?? /* @__PURE__ */ new Date());
  const texto = opts.textoValores ?? ler("references", "valores-2026") ?? "";
  const cab = lerCabecalhoValores(texto);
  const itens = [];
  const proxima = cab.proxima ?? "0000-01-01";
  itens.push({
    item: "Valores de refer\xEAncia (valores-2026: impostos, sal\xE1rio m\xEDnimo, IAS, limiares)",
    fonte: "references/valores-2026.md",
    ultimaAtualizacao: cab.ultima ?? "(sem data)",
    proximaRevisao: cab.proxima ?? "(sem data)",
    desatualizado: h > proxima,
    ...cab.proxima ? {} : { nota: "O ficheiro de valores n\xE3o tem a linha 'Pr\xF3xima revis\xE3o: AAAA-MM-DD'." }
  });
  const ult = TAXAS_SEMESTRAIS[TAXAS_SEMESTRAIS.length - 1];
  const limite = limiteJuros(ult.ano, ult.semestre);
  itens.push({
    item: "Taxas de juros de mora (comerciais, por semestre)",
    fonte: "Avisos da ETF no Di\xE1rio da Rep\xFAblica \u2014 calculators/juros.ts e scripts/juros_mora.py",
    ultimaAtualizacao: `${ult.semestre}.\xBA semestre de ${ult.ano}`,
    proximaRevisao: limite,
    desatualizado: h >= limite,
    ...h >= limite ? { nota: "Os semestres sem aviso registado usam a \xFAltima taxa conhecida (marcada como estimada)." } : {}
  });
  if (cab.juros && (cab.juros.ano !== ult.ano || cab.juros.semestre !== ult.semestre)) {
    itens[itens.length - 1].nota = `valores-2026 diz ${cab.juros.semestre}.\xBA semestre de ${cab.juros.ano} e a tabela tem ${ult.semestre}.\xBA de ${ult.ano}: alinhar os dois.`;
  }
  const rendas = itemRendas(texto);
  if (rendas) itens.push({ ...rendas, desatualizado: h > rendas.proximaRevisao });
  return itens;
}
function textoAtualidade(itens, hoje = /* @__PURE__ */ new Date()) {
  const h = hojeEmLisboa(hoje);
  const fora = itens.filter((i) => i.desatualizado);
  return [
    `Atualidade do conte\xFAdo do plugin em ${h}: ${fora.length ? `${fora.length} item(ns) fora de prazo` : "tudo dentro do prazo de revis\xE3o"}.`,
    "",
    ...itens.map(
      (i) => `- ${i.desatualizado ? "\u26A0\uFE0F DESATUALIZADO" : "\u2713"} ${i.item} \u2014 atualizado: ${i.ultimaAtualizacao}; pr\xF3xima revis\xE3o: ${i.proximaRevisao}; fonte: ${i.fonte}` + (i.nota ? ` (${i.nota})` : "")
    ),
    "",
    fora.length ? "Atualiza o plugin (/plugin marketplace update juridico-pt) e, at\xE9 l\xE1, confirma estes valores nas fontes oficiais antes de os usar." : "Mesmo dentro do prazo, valores determinantes confirmam-se na fonte oficial (dre.pt, Portal das Finan\xE7as)."
  ].join("\n");
}

// src/zip.ts
var TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(dados) {
  let c = 4294967295;
  for (let i = 0; i < dados.length; i++) c = TABELA_CRC[(c ^ dados[i]) & 255] ^ c >>> 8;
  return (c ^ 4294967295) >>> 0;
}
function dataDos(d) {
  const ano = Math.max(1980, d.getUTCFullYear());
  return {
    hora: d.getUTCHours() << 11 | d.getUTCMinutes() << 5 | Math.floor(d.getUTCSeconds() / 2),
    data: ano - 1980 << 9 | d.getUTCMonth() + 1 << 5 | d.getUTCDate()
  };
}
var LIMITE = 4294967295;
function criarZip(entradas, quando = new Date(Date.UTC(2026, 0, 1))) {
  const enc = new TextEncoder();
  const { hora, data } = dataDos(quando);
  const locais = [];
  const centrais = [];
  let deslocamento = 0;
  const vistos = /* @__PURE__ */ new Set();
  for (const e of entradas) {
    const nome = e.nome.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!nome || nome.split("/").some((p) => p === ".." || p === ".")) throw new Error(`Nome inv\xE1lido no ZIP: '${e.nome}'.`);
    if (vistos.has(nome)) throw new Error(`Entrada repetida no ZIP: '${nome}'.`);
    vistos.add(nome);
    const nomeB = enc.encode(nome);
    const bytes = typeof e.dados === "string" ? enc.encode(e.dados) : e.dados;
    if (bytes.length >= LIMITE || deslocamento >= LIMITE) throw new Error("Arquivo demasiado grande (sem ZIP64).");
    const crc = crc32(bytes);
    const loc = new DataView(new ArrayBuffer(30));
    loc.setUint32(0, 67324752, true);
    loc.setUint16(4, 20, true);
    loc.setUint16(6, 2048, true);
    loc.setUint16(8, 0, true);
    loc.setUint16(10, hora, true);
    loc.setUint16(12, data, true);
    loc.setUint32(14, crc, true);
    loc.setUint32(18, bytes.length, true);
    loc.setUint32(22, bytes.length, true);
    loc.setUint16(26, nomeB.length, true);
    loc.setUint16(28, 0, true);
    locais.push(new Uint8Array(loc.buffer), nomeB, bytes);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 33639248, true);
    cen.setUint16(4, 20, true);
    cen.setUint16(6, 20, true);
    cen.setUint16(8, 2048, true);
    cen.setUint16(10, 0, true);
    cen.setUint16(12, hora, true);
    cen.setUint16(14, data, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, bytes.length, true);
    cen.setUint32(24, bytes.length, true);
    cen.setUint16(28, nomeB.length, true);
    cen.setUint16(30, 0, true);
    cen.setUint16(32, 0, true);
    cen.setUint16(34, 0, true);
    cen.setUint16(36, 0, true);
    cen.setUint32(38, 0, true);
    cen.setUint32(42, deslocamento, true);
    centrais.push(new Uint8Array(cen.buffer), nomeB);
    deslocamento += 30 + nomeB.length + bytes.length;
  }
  const tamanhoCentral = centrais.reduce((s, b) => s + b.length, 0);
  if (entradas.length > 65535 || deslocamento + tamanhoCentral >= LIMITE) throw new Error("Arquivo demasiado grande (sem ZIP64).");
  const fim = new DataView(new ArrayBuffer(22));
  fim.setUint32(0, 101010256, true);
  fim.setUint16(4, 0, true);
  fim.setUint16(6, 0, true);
  fim.setUint16(8, entradas.length, true);
  fim.setUint16(10, entradas.length, true);
  fim.setUint32(12, tamanhoCentral, true);
  fim.setUint32(16, deslocamento, true);
  fim.setUint16(20, 0, true);
  const partes = [...locais, ...centrais, new Uint8Array(fim.buffer)];
  const total = partes.reduce((s, b) => s + b.length, 0);
  const out = new Uint8Array(total);
  let i = 0;
  for (const p of partes) {
    out.set(p, i);
    i += p.length;
  }
  return out;
}

// src/docx.ts
var NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
function xml(s) {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function inline(texto) {
  const runs = [];
  const re = /\*\*(.+?)\*\*|__(.+?)__|(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])|(?<![\w])_(?!\s)(.+?)(?<!\s)_(?![\w])|`([^`]+)`/g;
  let ultimo = 0;
  for (const m of texto.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > ultimo) runs.push({ texto: texto.slice(ultimo, i) });
    if (m[1] !== void 0 || m[2] !== void 0) {
      for (const r of inline(m[1] ?? m[2] ?? "")) runs.push({ ...r, negrito: true });
    } else if (m[3] !== void 0 || m[4] !== void 0) {
      for (const r of inline(m[3] ?? m[4] ?? "")) runs.push({ ...r, italico: true });
    } else runs.push({ texto: m[5] ?? "" });
    ultimo = i + m[0].length;
  }
  if (ultimo < texto.length) runs.push({ texto: texto.slice(ultimo) });
  return runs.filter((r) => r.texto !== "");
}
function runsXml(linhas) {
  const out = [];
  linhas.forEach((linha, n) => {
    if (n > 0) out.push("<w:r><w:br/></w:r>");
    for (const r of inline(linha)) {
      const props = (r.negrito ? "<w:b/>" : "") + (r.italico ? "<w:i/>" : "");
      out.push(`<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${xml(r.texto)}</w:t></w:r>`);
    }
  });
  return out.join("");
}
function paragrafo(linhas, opts = {}) {
  const pPr = (opts.estilo ? `<w:pStyle w:val="${opts.estilo}"/>` : "") + (opts.recuo ? `<w:ind w:left="${opts.recuo}" w:hanging="284"/>` : "");
  const conteudo = opts.prefixo ? [opts.prefixo + (linhas[0] ?? ""), ...linhas.slice(1)] : linhas;
  return `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ""}${runsXml(conteudo)}</w:p>`;
}
function celulas(linha) {
  return linha.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}
function tabela(linhas) {
  const linhasDados = linhas.filter((l) => !/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l));
  const rows = linhasDados.map(celulas);
  if (rows.length === 0) return "";
  const ncol = Math.max(1, ...rows.map((r) => r.length));
  const borda = (lado) => `<w:${lado} w:val="single" w:sz="4" w:space="0" w:color="808080"/>`;
  const tblPr = `<w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(borda).join("")}</w:tblBorders></w:tblPr>`;
  const grid = `<w:tblGrid>${Array.from({ length: ncol }, () => `<w:gridCol w:w="${Math.floor(9e3 / ncol)}"/>`).join("")}</w:tblGrid>`;
  const trs = rows.map((r, i) => {
    const tcs = Array.from({ length: ncol }, (_, c) => {
      const t = r[c] ?? "";
      return `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>${paragrafo([i === 0 && t ? `**${t.replace(/\*\*/g, "")}**` : t])}</w:tc>`;
    });
    return `<w:tr>${tcs.join("")}</w:tr>`;
  }).join("");
  return `<w:tbl>${tblPr}${grid}${trs}</w:tbl><w:p/>`;
}
function limparMarkdown(md) {
  const semComentarios = md.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "");
  const out = [];
  let corte = null;
  for (const linha of semComentarios.split("\n")) {
    const h = /^(#{1,6})\s+(.*)$/.exec(linha);
    if (corte !== null) {
      if (h && h[1].length <= corte) corte = null;
      else continue;
    }
    if (h && /^Antes de enviar\b/i.test(h[2].trim())) {
      corte = h[1].length;
      continue;
    }
    out.push(linha);
  }
  return out.join("\n");
}
function corpo(md) {
  const linhas = limparMarkdown(md).split("\n");
  const blocos = [];
  let par = [];
  const fechar = () => {
    if (par.length) blocos.push(paragrafo(par));
    par = [];
  };
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].replace(/\s+$/, "");
    if (!linha.trim()) {
      fechar();
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(linha);
    if (h) {
      fechar();
      blocos.push(paragrafo([h[2].replace(/\s+#+\s*$/, "")], { estilo: `Heading${Math.min(3, h[1].length)}` }));
      continue;
    }
    if (/^\s*\|/.test(linha)) {
      fechar();
      const t = [];
      while (i < linhas.length && /^\s*\|/.test(linhas[i])) t.push(linhas[i++]);
      i--;
      blocos.push(tabela(t));
      continue;
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(linha)) {
      fechar();
      blocos.push("<w:p/>");
      continue;
    }
    const li = /^(\s*)[-*+]\s+(?:\[([ xX])\]\s+)?(.*)$/.exec(linha);
    if (li) {
      fechar();
      const nivel = Math.min(4, Math.floor(li[1].replace(/\t/g, "  ").length / 2));
      const prefixo = li[2] === void 0 ? "\u2022 " : li[2] === " " ? "\u2610 " : "\u2612 ";
      blocos.push(paragrafo([li[3]], { recuo: 567 + nivel * 425, prefixo }));
      continue;
    }
    const ol = /^(\s*)(\d{1,3})[.)]\s+(.*)$/.exec(linha);
    if (ol) {
      fechar();
      const nivel = Math.min(4, Math.floor(ol[1].length / 2));
      blocos.push(paragrafo([ol[3]], { recuo: 567 + nivel * 425, prefixo: `${ol[2]}. ` }));
      continue;
    }
    const q = /^\s*>\s?(.*)$/.exec(linha);
    if (q) {
      fechar();
      blocos.push(paragrafo([q[1]], { estilo: "Quote" }));
      continue;
    }
    par.push(linha.trim());
  }
  fechar();
  return blocos.join("");
}
var ESTILOS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${NS}>
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri" w:eastAsia="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="pt-PT"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="276" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:jc w:val="left"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="100"/><w:jc w:val="left"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="80"/><w:jc w:val="left"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:sz w:val="23"/><w:szCs w:val="23"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Quote"><w:name w:val="Quote"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:ind w:left="567"/></w:pPr><w:rPr><w:i/></w:rPr></w:style>
</w:styles>`;
var TIPOS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`;
var RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`;
var DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
function core(titulo, quando) {
  const t = quando.toISOString().replace(/\.\d{3}Z$/, "Z");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>${xml(titulo)}</dc:title><dc:creator>juridico-pt</dc:creator>
<dcterms:created xsi:type="dcterms:W3CDTF">${t}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${t}</dcterms:modified>
</cp:coreProperties>`;
}
function gerarDocx(md, opts = {}) {
  const quando = opts.quando ?? /* @__PURE__ */ new Date();
  const titulo = opts.titulo ?? (/^#\s+(.+)$/m.exec(limparMarkdown(md))?.[1] ?? "Documento").trim();
  const documento = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${NS}><w:body>${corpo(md)}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  return criarZip(
    [
      { nome: "[Content_Types].xml", dados: TIPOS },
      { nome: "_rels/.rels", dados: RELS },
      { nome: "docProps/core.xml", dados: core(titulo, quando) },
      { nome: "word/document.xml", dados: documento },
      { nome: "word/styles.xml", dados: ESTILOS },
      { nome: "word/_rels/document.xml.rels", dados: DOC_RELS }
    ],
    quando
  );
}

// src/exportar.ts
var NOME_RE2 = /^[a-z0-9][a-z0-9-]{0,60}$/;
function exportarDocumento(p) {
  const nome = String(p.nome ?? "").trim().toLowerCase().replace(/\.docx$/, "");
  if (!NOME_RE2.test(nome)) throw new Error(`Nome de ficheiro inv\xE1lido: '${p.nome}' (usa letras min\xFAsculas, algarismos e h\xEDfens).`);
  if (p.conteudo === void 0 === (p.template === void 0)) {
    throw new Error("Indica o conte\xFAdo (Markdown) OU o nome de um template \u2014 um dos dois.");
  }
  let md = p.conteudo ?? "";
  if (p.template !== void 0) {
    const t = ler("templates", String(p.template).trim());
    if (t === null) throw new Error(`Template n\xE3o encontrado: '${p.template}' (v\xEA listar_templates).`);
    md = t;
  }
  if (!md.trim()) throw new Error("O documento est\xE1 vazio.");
  const bytes = gerarDocx(md);
  const caminho2 = escreverSeguro(dirProjeto(p.projeto), [PASTA_DADOS, "exportados", `${nome}.docx`], bytes);
  const placeholders = (md.match(/\{\{[A-Z0-9_]+(?::[^{}]*)?\}\}/g) ?? []).length;
  return { caminho: caminho2, bytes: bytes.length, placeholders };
}
export {
  COMPENSACAO_MODALIDADES,
  INDEMNIZACAO_COBRANCA,
  INICIO_DL_177_2026,
  PRESCRICAO_TIPOS,
  TAXAS_SEMESTRAIS,
  addAnos,
  addMeses,
  calcularCompensacao,
  calcularCompensacaoPorDatas,
  calcularCreditosCessacao,
  calcularCustoTrabalhador,
  calcularIMT,
  calcularIRC,
  calcularIRSSimplificado,
  calcularJuros,
  calcularJurosLote,
  calcularLegitima,
  calcularPrescricao,
  calcularProcedimentoCCP,
  calcularSalarioLiquido,
  calcularTaxaJustica,
  concluirPrazo,
  contarPrazo,
  custasInjuncao,
  decidirIVA,
  emFeriasJudiciais,
  exportarDocumento,
  exportarICS,
  formatarCalendario,
  formatarEuros,
  gerarCalendario,
  hojeLisboa,
  impostoSeloHeranca,
  lerPerfil,
  lerPrazos,
  memoriaJuros,
  memoriaJurosLote,
  painelClientes,
  parseDataEstrita,
  prazosProximos,
  r2,
  registarPrazo,
  taxaDoSemestre,
  textoAtualidade,
  textoPainel,
  textoProcedimentoCCP,
  verificarAtualidade
};
