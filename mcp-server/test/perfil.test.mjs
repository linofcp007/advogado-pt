/**
 * Testes do perfil da empresa (projeto -> geral), versão compilada `../dist/perfil.js`.
 * Usa diretórios temporários para o projeto e para o "home" do perfil geral.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { lerPerfil, guardarPerfil, textoPerguntasPerfil } from "../dist/perfil.js";

const HOJE = new Date(Date.UTC(2026, 9, 3));

function dirs() {
  return {
    projeto: mkdtempSync(join(tmpdir(), "adv-proj-")),
    home: mkdtempSync(join(tmpdir(), "adv-home-")),
  };
}

function escrever(base, texto) {
  mkdirSync(join(base, ".advogado-pt"), { recursive: true });
  writeFileSync(join(base, ".advogado-pt", "perfil-empresa.md"), texto, "utf8");
}

test("T-37 lerPerfil: projeto tem prioridade sobre o geral; sem projeto usa o geral", () => {
  const { projeto, home } = dirs();
  escrever(home, "# Perfil\nforma_juridica: ENI\natualizado_em: 2026-09-01\n");
  let p = lerPerfil({ projeto, home, hoje: HOJE });
  assert.equal(p.origem, "geral");
  assert.equal(p.campos.forma_juridica, "ENI");
  assert.equal(p.caminho, join(home, ".advogado-pt", "perfil-empresa.md"));

  escrever(projeto, "# Perfil\nforma_juridica: Lda\nsetor: Restauração\natualizado_em: 2026-09-01\n");
  p = lerPerfil({ projeto, home, hoje: HOJE });
  assert.equal(p.origem, "projeto");
  assert.equal(p.campos.forma_juridica, "Lda");
  assert.equal(p.campos.setor, "Restauração");
});

test("T-38 guardarPerfil: só no ficheiro fixo, funde campos, ignora desconhecidos, uma linha por campo", () => {
  const { projeto, home } = dirs();
  const p1 = guardarPerfil(
    { forma_juridica: "Lda", setor: "Restauração\natualizado_em: 1999-01-01", inventado: "x" },
    "projeto",
    { projeto, home, hoje: HOJE }
  );
  const caminho = join(projeto, ".advogado-pt", "perfil-empresa.md");
  assert.equal(p1.caminho, caminho);
  const txt = readFileSync(caminho, "utf8");
  assert.match(txt, /^forma_juridica: Lda$/m);
  assert.match(txt, /^setor: Restauração atualizado_em: 1999-01-01$/m, "quebra de linha normalizada");
  assert.doesNotMatch(txt, /inventado/);
  assert.match(txt, /^atualizado_em: 2026-10-03$/m);
  assert.equal((txt.match(/^atualizado_em:/gm) || []).length, 1);

  const p2 = guardarPerfil({ trabalhadores: "12" }, "projeto", { projeto, home, hoje: HOJE });
  assert.equal(p2.campos.forma_juridica, "Lda", "mantém campos anteriores");
  assert.equal(p2.campos.trabalhadores, "12");

  guardarPerfil({ forma_juridica: "ENI" }, "geral", { projeto, home, hoje: HOJE });
  assert.ok(existsSync(join(home, ".advogado-pt", "perfil-empresa.md")));

  assert.throws(
    () => guardarPerfil({ setor: "x" }, "projeto", { projeto: join(projeto, "nao-existe"), home, hoje: HOJE }),
    /n[ãa]o existe/i
  );
});

test("T-39 perfil com mais de 12 meses ou sem data -> desatualizado", () => {
  const { projeto, home } = dirs();
  escrever(projeto, "forma_juridica: Lda\natualizado_em: 2025-09-01\n");
  assert.equal(lerPerfil({ projeto, home, hoje: HOJE }).desatualizado, true);
  escrever(projeto, "forma_juridica: Lda\n");
  assert.equal(lerPerfil({ projeto, home, hoje: HOJE }).desatualizado, true);
  escrever(projeto, "forma_juridica: Lda\natualizado_em: 2026-05-01\n");
  assert.equal(lerPerfil({ projeto, home, hoje: HOJE }).desatualizado, false);
});

test("T-40 sem perfil (ou sem campos reconhecidos) -> null; perguntas listam campos e destinos", () => {
  const { projeto, home } = dirs();
  assert.equal(lerPerfil({ projeto, home, hoje: HOJE }), null);
  escrever(projeto, "isto não é um perfil\n\u0000\u0001\u0002");
  assert.equal(lerPerfil({ projeto, home, hoje: HOJE }), null);
  const q = textoPerguntasPerfil();
  assert.match(q, /forma jur[íi]dica/i);
  assert.match(q, /setor/i);
  assert.match(q, /trabalhadores/i);
  assert.match(q, /projeto/i);
  assert.match(q, /geral/i);
});
