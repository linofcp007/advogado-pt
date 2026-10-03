/**
 * Testes do CLI universal (`cli/juridico-pt.mjs`), via spawnSync.
 * `prompt` não depende do build; `calc` usa as calculadoras compiladas (`npm test` compila antes).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(here, "..", "..", "cli", "juridico-pt.mjs");

function cli(...args) {
  const r = spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8" });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}

test("T-32 cli prompt nda-bilingue -> persona, rigor e template", () => {
  const r = cli("prompt", "nda-bilingue");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /RIGOR/);
  assert.match(r.out, /ACORDO DE CONFIDENCIALIDADE/);
  assert.match(r.out, /Antes de enviar/);
});

test("T-33 cli prompt com nome inexistente -> exit 1 e lista de disponíveis", () => {
  const r = cli("prompt", "nao-existe");
  assert.equal(r.code, 1);
  assert.match(r.out, /nda-bilingue/);
});

test("T-36 cli calc creditos / legitima / juros imprimem os totais e os tramos", () => {
  const c = cli(
    "calc", "creditos", "--retribuicao", "1500", "--admissao", "2020-03-01",
    "--cessacao", "2026-06-30", "--ferias-vencidas", "5", "--sf-em-falta"
  );
  assert.equal(c.code, 0, c.out);
  assert.match(c.out, /4\.072,42/);

  const l = cli("calc", "legitima", "--bens", "300000", "--conjuge", "--filhos", "2");
  assert.equal(l.code, 0, l.out);
  assert.match(l.out, /200\.000,00/);

  const j = cli("calc", "juros", "--capital", "5000", "--inicio", "2025-01-01", "--fim", "2026-01-01");
  assert.equal(j.code, 0, j.out);
  assert.match(j.out, /532,29/);
  assert.match(j.out, /11,15%/);
});
