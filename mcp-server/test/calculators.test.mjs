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

// === Juros de mora ===
test("juros comercial 5000 / 365 dias", () => {
  const inicio = dataUTC(2025, 1, 1);
  const fim = dataUTC(2026, 1, 1); // 365 dias (2025 não é bissexto)
  const { dias, taxa, juros, total } = calcularJuros(
    5000,
    inicio,
    fim,
    "comercial"
  );
  assert.equal(dias, 365);
  quase(taxa, 0.1015);
  quase(juros, 507.5);
  quase(total, 5507.5);
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
test("compensação sem-termo 1500 / 4 anos -> mínimo 4500", () => {
  // 1500 * 14/30 * 4 = 2800 < mínimo 3 meses (4500) -> aplica 4500.
  const { diasAno, bruto, minimoAplicado } = calcularCompensacao(
    1500,
    0,
    4,
    "sem-termo"
  );
  assert.equal(diasAno, 14);
  assert.ok(minimoAplicado);
  quase(bruto, 4500.0);
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
