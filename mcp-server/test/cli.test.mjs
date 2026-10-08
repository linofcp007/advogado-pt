/**
 * Testes do CLI universal (`cli/juridico-pt.mjs`), via spawnSync.
 * `prompt` não depende do build; `calc` e os restantes comandos usam o bundle versionado
 * `mcp-server/dist/cli-lib.js` (`npm test` regenera-o antes).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
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

// Uma instalação pelo marketplace (git clone) só recebe os ficheiros que o git distribui:
// nem node_modules nem a saída do tsc em mcp-server/dist/. O CLI tem de funcionar só com isso.
test("CLI só com os ficheiros distribuídos pelo git (instalação pelo marketplace): doctor, calc, calendario, prazos, painel, exportar, atualidade", () => {
  const raiz = resolve(here, "..", "..");
  const ls = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "--", "cli", "mcp-server", "skills"], {
    cwd: raiz,
    encoding: "utf8",
  });
  assert.equal(ls.status, 0, ls.stderr);
  const copia = mkdtempSync(join(tmpdir(), "jpt-instalado-"));
  const projeto = mkdtempSync(join(tmpdir(), "jpt-projeto-"));
  try {
    for (const f of ls.stdout.split("\n").filter(Boolean)) {
      if (existsSync(join(raiz, f))) cpSync(join(raiz, f), join(copia, f));
    }
    assert.ok(!existsSync(join(copia, "mcp-server", "dist", "calculators")), "a cópia não deve ter a saída do tsc");
    const corre = (...args) => {
      const r = spawnSync(process.execPath, [join(copia, "cli", "juridico-pt.mjs"), ...args], { encoding: "utf8", cwd: projeto });
      return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
    };

    const d = corre("doctor");
    assert.equal(d.code, 0, d.out);
    assert.doesNotMatch(d.out, /FALTA/);

    const j = corre("calc", "juros", "--capital", "5000", "--inicio", "2025-01-01", "--fim", "2026-01-01");
    assert.equal(j.code, 0, j.out);
    assert.match(j.out, /532,29/);

    const c = corre("calendario", "--ano", "2026", "--dir", projeto);
    assert.equal(c.code, 0, c.out);

    const pa = corre("prazos", "add", "--data", "2026-12-31", "--descricao", "Teste de instalação", "--dir", projeto);
    assert.equal(pa.code, 0, pa.out);
    const pl = corre("prazos", "--dir", projeto);
    assert.equal(pl.code, 0, pl.out);
    assert.match(pl.out, /Teste de instalação/);

    const pn = corre("painel", "--dias", "30", "--dir", projeto);
    assert.equal(pn.code, 0, pn.out);

    const e = corre("exportar", "--nome", "procuracao-teste", "--template", "procuracao", "--dir", projeto);
    assert.equal(e.code, 0, e.out);
    assert.ok(existsSync(join(projeto, ".juridico-pt", "exportados", "procuracao-teste.docx")), e.out);

    const a = corre("atualidade");
    assert.equal(a.code, 0, a.out);
    assert.match(a.out, /valores-2026/);
  } finally {
    rmSync(copia, { recursive: true, force: true });
    rmSync(projeto, { recursive: true, force: true });
  }
});
