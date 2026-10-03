/**
 * Testes do leitor de conteúdo (âmbito, listagens e pesquisa agrupada).
 * Importa a versão COMPILADA em `../dist/content.js` (corre `npm test`).
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { listar, lerAmbito, listarComAmbito, formatarProcura } from "../dist/content.js";

test("T-30 lerAmbito lê a linha 'Âmbito:'; listarComAmbito devolve nome + âmbito; listar ignora o README", () => {
  assert.equal(lerAmbito("# Título\n\n> **Âmbito:** nacional\n"), "nacional");
  assert.equal(lerAmbito("<!-- Template: X\n     Âmbito: misto -->\n# X"), "misto");
  assert.equal(lerAmbito("# Título\nÂmbito: UE\n"), "ue");
  assert.equal(lerAmbito("# Sem âmbito declarado\n"), null);
  // Só conta nas primeiras 15 linhas.
  assert.equal(lerAmbito("x\n".repeat(20) + "Âmbito: nacional"), null);

  assert.ok(!listar("templates").includes("README"), "listar não deve incluir o README");
  const itens = listarComAmbito("templates");
  assert.ok(itens.length > 0);
  for (const i of itens) {
    assert.equal(typeof i.nome, "string");
    assert.ok(i.ambito === null || ["nacional", "ue", "misto"].includes(i.ambito));
  }
  assert.ok(!itens.some((i) => i.nome === "README"));
});

test("T-31 formatarProcura agrupa por tipo (Referências antes de Templates) e mostra o âmbito", () => {
  const txt = formatarProcura([
    { categoria: "templates", nome: "carta-x", linhas: ["linha a"], ambito: "nacional" },
    { categoria: "references", nome: "area-y", linhas: ["linha b"], ambito: null },
    { categoria: "checklists", nome: "check-z", linhas: ["linha c"], ambito: "misto" },
  ]);
  const iRef = txt.indexOf("## Referências");
  const iTpl = txt.indexOf("## Templates");
  const iChk = txt.indexOf("## Checklists");
  assert.ok(iRef >= 0 && iTpl > iRef, "Referências antes de Templates");
  assert.ok(iChk > iTpl, "Checklists depois de Templates");
  assert.ok(!txt.includes("## Playbooks"), "sem grupo vazio");
  assert.match(txt, /carta-x \(nacional\)/);
  assert.match(txt, /check-z \(misto\)/);
  assert.match(txt, /linha b/);
});
