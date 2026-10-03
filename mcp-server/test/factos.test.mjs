/**
 * T-130 — Perguntas de referência contra regressões jurídicas.
 *
 * `factos.json` guarda factos jurídicos verificados em fonte oficial: para cada um,
 * o ficheiro de conteúdo onde a resposta vive, o texto que TEM de lá estar e o texto
 * que NÃO pode voltar a aparecer (o erro que já foi corrigido). Uma edição futura que
 * reintroduza um erro faz falhar o teste com o id do facto.
 *
 *   node --test mcp-server/test/factos.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", "..");
const FICHEIRO = resolve(here, "factos.json");

test("T-130 factos jurídicos de referência (≥ 40) continuam verdadeiros no conteúdo", () => {
  assert.ok(existsSync(FICHEIRO), "mcp-server/test/factos.json não existe");
  const factos = JSON.parse(readFileSync(FICHEIRO, "utf8"));
  assert.ok(Array.isArray(factos) && factos.length >= 40, `esperava >= 40 factos, há ${factos.length ?? 0}`);
  const ids = new Set();
  const falhas = [];
  for (const f of factos) {
    if (!f.id || !f.pergunta || !f.ficheiro || !f.fonte) {
      falhas.push(`${f.id ?? "?"}: faltam campos (id, pergunta, ficheiro, fonte)`);
      continue;
    }
    if (ids.has(f.id)) falhas.push(`${f.id}: id repetido`);
    ids.add(f.id);
    const p = resolve(repo, f.ficheiro);
    if (!existsSync(p)) {
      falhas.push(`${f.id}: ficheiro ${f.ficheiro} não existe`);
      continue;
    }
    const texto = readFileSync(p, "utf8");
    for (const s of f.contem || []) {
      if (!new RegExp(s, "i").test(texto)) falhas.push(`${f.id}: '${f.ficheiro}' devia conter /${s}/`);
    }
    for (const s of f.naoContem || []) {
      if (new RegExp(s, "i").test(texto)) falhas.push(`${f.id}: '${f.ficheiro}' não pode conter /${s}/ (erro já corrigido)`);
    }
  }
  assert.equal(falhas.length, 0, "factos quebrados:\n" + falhas.join("\n"));
});
