/**
 * Testes de regressão das calculadoras jurídicas (versão TypeScript compilada).
 *
 * Réplica de `scripts/test_scripts.py`, em JavaScript puro, usando o runner
 * nativo `node:test`. Importa da versão COMPILADA em `../dist/calculators/`.
 *
 * Correr:  node --test test/
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  calcularJuros,
  calcularIMT,
  calcularCompensacao,
  calcularPrescricao,
  addAnos,
  addMeses,
  calcularIRSSimplificado,
  memoriaJuros,
  calcularCreditosCessacao,
  calcularLegitima,
} from "../dist/calculators/index.js";

// Compara floats com tolerância (equivalente a assertAlmostEqual places=2).
function quase(a, b) {
  assert.ok(Math.abs(a - b) < 0.01, `esperado ${b}, obtido ${a}`);
}

// Cria uma data em UTC a partir de ano/mês(1-12)/dia.
function dataUTC(ano, mes, dia) {
  return new Date(Date.UTC(ano, mes - 1, dia));
}

// Devolve a representação "YYYY-MM-DD" de uma data, em UTC.
function isoUTC(data) {
  const a = data.getUTCFullYear();
  const m = String(data.getUTCMonth() + 1).padStart(2, "0");
  const d = String(data.getUTCDate()).padStart(2, "0");
  return `${a}-${m}-${d}`;
}

// === Juros de mora (por tramos semestrais) ===
// Valores calculados à mão: juros = capital × taxa × dias/365 por tramo.
// Taxas: Aviso n.º 1278/2025/2 (1.º sem. 2025), 16792/2025/2 (2.º sem. 2025),
// 822/2026/2 (1.º sem. 2026), 16623/2026/2 (2.º sem. 2026).

test("T-01 juros comercial 5000 de 2025-01-01 a 2026-01-01: 2 tramos -> 532,29", () => {
  const r = calcularJuros(5000, dataUTC(2025, 1, 1), dataUTC(2026, 1, 1), "comercial");
  quase(r.juros, 532.29);
  quase(r.total, 5532.29);
  assert.equal(r.dias, 365);
  assert.equal(r.tramos.length, 2);
  assert.deepEqual(
    r.tramos.map((t) => [t.inicio, t.fim, t.dias, t.taxa]),
    [
      ["2025-01-01", "2025-07-01", 181, 0.1115],
      ["2025-07-01", "2026-01-01", 184, 0.1015],
    ]
  );
  quase(r.tramos[0].juros, 276.46);
  quase(r.tramos[1].juros, 255.84);
});

test("T-02 juros comercial 10000 de 2026-07-01 a 2026-10-01: 92 dias a 10,40% -> 262,14", () => {
  const r = calcularJuros(10000, dataUTC(2026, 7, 1), dataUTC(2026, 10, 1), "comercial");
  quase(r.juros, 262.14);
  assert.equal(r.tramos.length, 1);
  assert.equal(r.tramos[0].dias, 92);
  quase(r.tramos[0].taxa, 0.104);
  assert.equal(r.tramos[0].estimado, false);
  assert.match(r.tramos[0].fonte, /16623\/2026/);
});

test("T-03 juros comercial-geral 1000 de 2022-03-15 a 2024-03-15: 5 tramos -> 181,88", () => {
  const r = calcularJuros(1000, dataUTC(2022, 3, 15), dataUTC(2024, 3, 15), "comercial-geral");
  quase(r.juros, 181.88);
  assert.equal(r.dias, 731);
  assert.deepEqual(
    r.tramos.map((t) => [t.dias, t.taxa]),
    [
      [108, 0.07],
      [184, 0.07],
      [181, 0.095],
      [184, 0.11],
      [74, 0.115],
    ]
  );
});

test("T-04 juros civil 1000 num ano: 4% em todos os tramos -> 40,00", () => {
  const r = calcularJuros(1000, dataUTC(2025, 1, 1), dataUTC(2026, 1, 1), "civil");
  assert.ok(Array.isArray(r.tramos), "o resultado deve trazer os tramos");
  quase(r.juros, 40.0);
  assert.ok(r.tramos.every((t) => t.taxa === 0.04));
});

test("T-05 juros comercial 2000 de 2026-12-01 a 2027-03-01: tramo de 2027 estimado -> 51,29", () => {
  const r = calcularJuros(2000, dataUTC(2026, 12, 1), dataUTC(2027, 3, 1), "comercial");
  quase(r.juros, 51.29);
  assert.equal(r.tramos.length, 2);
  assert.equal(r.tramos[0].estimado, false);
  assert.equal(r.tramos[1].estimado, true);
  quase(r.tramos[1].taxa, 0.104);
});

test("T-06 juros: erro antes de 2013-07-01 e com fim anterior ao início", () => {
  assert.throws(
    () => calcularJuros(1000, dataUTC(2012, 1, 1), dataUTC(2014, 1, 1), "comercial"),
    /2013-07-01/
  );
  assert.throws(
    () => calcularJuros(1000, dataUTC(2026, 5, 1), dataUTC(2026, 4, 1), "comercial"),
    /anterior/
  );
});

test("T-07 juros (property): tramos contíguos, sem dias negativos, soma = total", () => {
  // Gerador congruencial com semente fixa — determinístico, sem dependências.
  let seed = 20261003;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const base = Date.UTC(2013, 6, 1);
  const pares = [];
  for (let i = 0; i < 200; i++) {
    const a = base + Math.floor(rnd() * 5000) * 86400000;
    const b = a + Math.floor(rnd() * 2000) * 86400000;
    pares.push([new Date(a), new Date(b)]);
  }
  // Fronteiras de semestre e mora de 0 dias.
  pares.push([dataUTC(2025, 1, 1), dataUTC(2025, 7, 1)]);
  pares.push([dataUTC(2025, 6, 30), dataUTC(2025, 7, 2)]);
  pares.push([dataUTC(2025, 12, 31), dataUTC(2026, 1, 1)]);
  pares.push([dataUTC(2026, 3, 3), dataUTC(2026, 3, 3)]);
  for (const [ini, fim] of pares) {
    for (const tipo of ["comercial", "comercial-geral", "civil"]) {
      const r = calcularJuros(1000, ini, fim, tipo);
      assert.ok(Array.isArray(r.tramos), "o resultado deve trazer os tramos");
      const soma = r.tramos.reduce((s, t) => s + t.dias, 0);
      assert.equal(soma, r.dias, `soma dos tramos ${isoUTC(ini)}..${isoUTC(fim)}`);
      assert.ok(r.tramos.every((t) => t.dias > 0), "nenhum tramo com 0 ou menos dias");
      for (let k = 1; k < r.tramos.length; k++) {
        assert.equal(r.tramos[k].inicio, r.tramos[k - 1].fim, "tramos contíguos");
      }
      if (r.dias === 0) quase(r.juros, 0);
    }
  }
});

test("T-08 memoriaJuros: uma linha por tramo, total e nota dos 40 € só no comercial", () => {
  const r = calcularJuros(5000, dataUTC(2025, 1, 1), dataUTC(2026, 1, 1), "comercial");
  const m = memoriaJuros(5000, r, "comercial");
  assert.match(m, /2025-01-01 a 2025-07-01/);
  assert.match(m, /181 dias/);
  assert.match(m, /11,15%/);
  assert.match(m, /2025-07-01 a 2026-01-01/);
  assert.match(m, /10,15%/);
  assert.match(m, /532,29/);
  assert.match(m, /40,00 €/);
  assert.match(m, /DL 62\/2013/);
  const rc = calcularJuros(1000, dataUTC(2025, 1, 1), dataUTC(2026, 1, 1), "civil");
  const mc = memoriaJuros(1000, rc, "civil");
  // (os juros civis deste caso são 40,00 € — o que não pode aparecer é a nota da indemnização)
  assert.doesNotMatch(mc, /custos de cobran[çc]a/);
});

// === IMT ===
test("IMT hpp 200000", () => {
  // Escalão 7%, parcela 10.457,96 -> 200000*0,07 - 10457,96 = 3542,04.
  const r = calcularIMT(200000, "hpp", false);
  quase(r.taxa, 0.07);
  quase(r.parcela, 10457.96);
  quase(r.imt, 3542.04);
});

test("IMT hpp 150000", () => {
  // Escalão 5%, parcela 6.491,02 -> IMT 1.008,98.
  const r = calcularIMT(150000, "hpp", false);
  quase(r.taxa, 0.05);
  quase(r.parcela, 6491.02);
  quase(r.imt, 1008.98);
});

test("IMT hpp 100000 isento", () => {
  const r = calcularIMT(100000, "hpp", false);
  quase(r.imt, 0.0);
  assert.ok(r.isento);
});

test("IMT jovem 300000 isento", () => {
  const r = calcularIMT(300000, "hpp", true);
  quase(r.imt, 0.0);
  assert.ok(r.isento);
});

test("IMT jovem 400000 parcial", () => {
  // (400000 - 330539) * 0,08 = 5.556,88.
  const r = calcularIMT(400000, "hpp", true);
  quase(r.imt, (400000 - 330539) * 0.08);
  quase(r.imt, 5556.88);
});

test("IMT taxa única 6% (hpp 700000)", () => {
  // HPP acima de 660.982 até 1.150.853 -> 6% único.
  const r = calcularIMT(700000, "hpp", false);
  quase(r.taxa, 0.06);
  quase(r.imt, 700000 * 0.06);
  quase(r.parcela, 0.0);
});

test("IMT taxa única 7,5% (hpp 1200000)", () => {
  const r = calcularIMT(1200000, "hpp", false);
  quase(r.taxa, 0.075);
  quase(r.imt, 1200000 * 0.075);
});

test("IMT secundária 100000 (primeiro escalão 1%)", () => {
  // Na secundária o 1.º escalão é 1% (vs 0% na HPP).
  const r = calcularIMT(100000, "secundaria", false);
  quase(r.taxa, 0.01);
  quase(r.imt, 1000.0);
});

test("IMT secundária 160000 (continuidade escalão 5%)", () => {
  const r = calcularIMT(160000, "secundaria", false);
  quase(r.taxa, 0.05);
});

// === Compensação ===
test("compensação sem-termo 1500 / 4 anos -> 2800 (sem mínimo de 3 meses)", () => {
  // 1500 / 30 * 14 * 4 = 2800. O art. 366.º em vigor não tem mínimo (corrigido na v1.2;
  // o mínimo de 3 meses só existe no regime transitório de contratos anteriores a 1/11/2011).
  const { diasAno, bruto, minimoAplicado } = calcularCompensacao(
    1500,
    0,
    4,
    "sem-termo"
  );
  assert.equal(diasAno, 14);
  assert.ok(!minimoAplicado);
  quase(bruto, 2800.0);
});

// === Prescrição ===
test("prescrição servicos-profissionais 2025-01-01 -> 2030-01-01", () => {
  const { limite } = calcularPrescricao(
    dataUTC(2025, 1, 1),
    "servicos-profissionais"
  );
  assert.equal(isoUTC(limite), "2030-01-01");
});

test("prescrição civil-geral 2025-01-01 -> 2045-01-01", () => {
  const { limite } = calcularPrescricao(dataUTC(2025, 1, 1), "civil-geral");
  assert.equal(isoUTC(limite), "2045-01-01");
});

test("prescrição telecom 2026-03-15 +6m -> 2026-09-15", () => {
  const { limite } = calcularPrescricao(
    dataUTC(2026, 3, 15),
    "telecom-energia-agua"
  );
  assert.equal(isoUTC(limite), "2026-09-15");
});

test("addAnos 29/02/2024 +1 ano -> 2025-02-28", () => {
  // 29/02/2024 + 1 ano -> 2025 não bissexto -> 28/02/2025.
  assert.equal(isoUTC(addAnos(dataUTC(2024, 2, 29), 1)), "2025-02-28");
});

test("addMeses 31/01/2026 +1 mês -> 2026-02-28", () => {
  // 31/01 + 1 mês -> fevereiro não tem 31 -> 28/02 (2026 não bissexto).
  assert.equal(isoUTC(addMeses(dataUTC(2026, 1, 31), 1)), "2026-02-28");
});

// === IRS simplificado ===
test("IRS servicos-151 30000 -> 0,75 / 22500", () => {
  const { coeficiente, tributavel } = calcularIRSSimplificado(
    30000,
    "servicos-151"
  );
  quase(coeficiente, 0.75);
  quase(tributavel, 22500.0);
});

test("IRS mercadorias 50000 -> 0,15 / 7500", () => {
  const { coeficiente, tributavel } = calcularIRSSimplificado(
    50000,
    "mercadorias"
  );
  quase(coeficiente, 0.15);
  quase(tributavel, 7500.0);
});

// === Créditos laborais na cessação ===
// Fração = dias de serviço no ano da cessação / dias do ano; base = retribuição + diuturnidades.

test("T-09 créditos: 1500 €, 2020-03-01 -> 2026-06-30, 5 dias de férias vencidas, SF em falta -> 4.072,42", () => {
  const r = calcularCreditosCessacao({
    retribuicaoBase: 1500,
    dataAdmissao: dataUTC(2020, 3, 1),
    dataCessacao: dataUTC(2026, 6, 30),
    feriasVencidasNaoGozadas: 5,
    subsidioFeriasVencidoEmFalta: true,
  });
  assert.equal(r.diasServicoAno, 181);
  assert.equal(r.diasAno, 365);
  quase(r.proporcionalFerias, 743.84);
  quase(r.proporcionalSubsidioFerias, 743.84);
  quase(r.proporcionalSubsidioNatal, 743.84);
  quase(r.feriasVencidas, 340.91);
  quase(r.subsidioFeriasVencido, 1500);
  quase(r.total, 4072.42);
  assert.equal(r.limite245n3, false);
});

test("T-10 créditos: cessação no ano seguinte à admissão -> art. 245.º/3; ano da admissão conta desde a admissão", () => {
  const r = calcularCreditosCessacao({
    retribuicaoBase: 1000,
    dataAdmissao: dataUTC(2025, 9, 1),
    dataCessacao: dataUTC(2026, 3, 31),
  });
  assert.equal(r.limite245n3, true);
  assert.equal(r.diasServicoAno, 90);
  quase(r.total, 739.73);
  const mesmoAno = calcularCreditosCessacao({
    retribuicaoBase: 1000,
    dataAdmissao: dataUTC(2026, 3, 1),
    dataCessacao: dataUTC(2026, 3, 31),
  });
  assert.equal(mesmoAno.diasServicoAno, 31);
  assert.equal(mesmoAno.limite245n3, true);
});

test("T-11 créditos em ano bissexto: 1200 + 50 diut., 2028-02-01 -> 2028-08-31 -> 213/366, 2.182,38", () => {
  const r = calcularCreditosCessacao({
    retribuicaoBase: 1200,
    diuturnidades: 50,
    dataAdmissao: dataUTC(2028, 2, 1),
    dataCessacao: dataUTC(2028, 8, 31),
  });
  assert.equal(r.diasAno, 366);
  assert.equal(r.diasServicoAno, 213);
  quase(r.total, 2182.38);
});

test("T-12 créditos: erro com retribuição negativa e cessação anterior à admissão", () => {
  assert.throws(
    () => calcularCreditosCessacao({ retribuicaoBase: -1, dataAdmissao: dataUTC(2020, 1, 1), dataCessacao: dataUTC(2026, 1, 1) }),
    /retribui/i
  );
  assert.throws(
    () => calcularCreditosCessacao({ retribuicaoBase: 1000, dataAdmissao: dataUTC(2026, 5, 1), dataCessacao: dataUTC(2026, 4, 1) }),
    /cessa/i
  );
});

// === Legítima (arts. 2156.º–2162.º CC) ===

test("T-13 legítima: 300.000, cônjuge + 2 filhos -> 2/3 = 200.000; QD 100.000; 66.666,67 cada", () => {
  const r = calcularLegitima({ bens: 300000, conjuge: true, filhos: 2 });
  quase(r.valorHeranca, 300000);
  quase(r.fracaoLegitima, 2 / 3);
  quase(r.legitima, 200000);
  quase(r.quotaDisponivel, 100000);
  assert.equal(r.partes.length, 3);
  for (const p of r.partes) quase(p.valor, 66666.67);
  assert.match(r.fundamento, /2159/);
});

test("T-14 legítima: cônjuge + 5 filhos -> cônjuge 1/4 da legítima", () => {
  const r = calcularLegitima({ bens: 120000, conjuge: true, filhos: 5 });
  quase(r.legitima, 80000);
  const conj = r.partes.find((p) => /c[ôo]njuge/i.test(p.herdeiro));
  quase(conj.valor, 20000);
  const filhos = r.partes.filter((p) => /filho/i.test(p.herdeiro));
  assert.equal(filhos.length, 5);
  for (const f of filhos) quase(f.valor, 12000);
});

test("T-15 legítima: frações por combinação de herdeiros e VTH = bens + doações - dívidas", () => {
  quase(calcularLegitima({ bens: 100000, conjuge: false, filhos: 1 }).legitima, 50000);
  quase(calcularLegitima({ bens: 90000, conjuge: false, filhos: 2 }).legitima, 60000);
  const so = calcularLegitima({ bens: 100000, doacoes: 20000, dividas: 30000, conjuge: true, filhos: 0 });
  quase(so.valorHeranca, 90000);
  quase(so.legitima, 45000);
  const cp = calcularLegitima({ bens: 90000, conjuge: true, filhos: 0, ascendentes: "pais" });
  quase(cp.legitima, 60000);
  quase(cp.partes.find((p) => /c[ôo]njuge/i.test(p.herdeiro)).valor, 40000);
  quase(cp.partes.find((p) => /ascendentes/i.test(p.herdeiro)).valor, 20000);
  quase(calcularLegitima({ bens: 90000, conjuge: false, filhos: 0, ascendentes: "pais" }).legitima, 45000);
  quase(calcularLegitima({ bens: 90000, conjuge: false, filhos: 0, ascendentes: "outros" }).legitima, 30000);
});

test("T-16 legítima sem herdeiros legitimários -> 0 e QD 100%", () => {
  const r = calcularLegitima({ bens: 50000, conjuge: false, filhos: 0, ascendentes: "nenhum" });
  quase(r.legitima, 0);
  quase(r.quotaDisponivel, 50000);
  quase(r.quotaDisponivelPct, 100);
  assert.equal(r.partes.length, 0);
});

test("T-17 legítima: erro com bens ou filhos negativos", () => {
  assert.throws(() => calcularLegitima({ bens: -1, conjuge: true, filhos: 1 }), /bens/i);
  assert.throws(() => calcularLegitima({ bens: 1000, conjuge: true, filhos: -2 }), /filhos/i);
});
