/**
 * Testes do detetor de documentos jurídicos do hook PostToolUse.
 *
 * O hook lembra as cláusulas essenciais quando o utilizador GRAVA um instrumento
 * jurídico. O risco é o inverso do habitual: num plugin de direito, o vocabulário
 * jurídico É o assunto — referências, playbooks e specs técnicas falam de
 * "contrato" e "cláusula" sem serem contratos. Precisão >> recall.
 *
 *   node --test mcp-server/test/hooks.test.mjs   (a partir da raiz do repo)
 *   node --test test/hooks.test.mjs              (a partir de mcp-server/)
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { detetarDocumentoJuridico } from "../../hooks/advogado-hook.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(here, "..", "..");
const TEMPLATES = resolve(raiz, "skills", "advogado-pt", "assets", "templates");

const dispara = (path, content) => detetarDocumentoJuridico({ path, content });

// --- Regressão DF-3: documentos técnicos que falam de direito -------------
// Excerto real de .specs/kernel-inventario/classification.md (devops-os), que
// disparava o hook por conter "contrato" no sentido de contrato de interface.

test("DF-3: spec técnica com 'contrato' de interface não dispara", () => {
  const spec = [
    "# Classificação — kernel-inventario",
    "",
    "**Spec.** Não é Vibe: o kernel é a fundação de que os sub-projetos A (standards),",
    "C (release) e D (router) vão depender, e a interface `Probe` é contrato público",
    "de um plugin publicado. Errar aqui custa caro.",
    "",
    "**A preocupação real — versionamento e estabilidade do contrato `Probe` — é",
    "tratada como secção obrigatória do design.**",
  ].join("\n");
  assert.equal(dispara(".specs/kernel-inventario/classification.md", spec), false);
});

test("DF-3: documento que DESCREVE os termos-gatilho não dispara (auto-referência)", () => {
  const meta = [
    "### DF-3 · `advogado-pt` · hook `PostToolUse` dispara em documentos técnicos",
    "",
    "*Correção sugerida:* exigir dois ou mais termos jurídicos de alta especificidade",
    "(foro, arbitragem, outorgante, cláusula), ou excluir caminhos como `.specs/`.",
  ].join("\n");
  assert.equal(dispara("devops-os/.specs/kernel-inventario/classification.md", meta), false);
});

test("ficheiro de código nunca dispara, mesmo cheio de termos jurídicos", () => {
  const ts = 'export const SINAIS = /contrato|cláusula|arrendamento|honorários/i;';
  assert.equal(dispara("mcp-server/src/tools.ts", ts), false);
  assert.equal(dispara("hooks/advogado-hook.mjs", ts), false);
  assert.equal(dispara("skills/advogado-pt/scripts/compensacao_despedimento.py", ts), false);
});

test("referência da casa (## Legislação Base) não dispara", () => {
  const ref = [
    "# Contratos",
    "",
    "## Legislação Base",
    "",
    "- Código Civil, arts. 405.º e ss. — liberdade contratual, cláusula penal.",
  ].join("\n");
  assert.equal(dispara("skills/advogado-pt/references/contratos.md", ref), false);
});

test("README/CHANGELOG/CLAUDE.md não disparam", () => {
  const md = "# Contrato\n\nEste plugin gera contratos e cartas de interpelação.";
  for (const f of ["README.md", "CHANGELOG.md", "CLAUDE.md", "docs/AGENTS.md"]) {
    assert.equal(dispara(f, md), false, `${f} não devia disparar`);
  }
});

// --- Verdadeiros positivos ------------------------------------------------

test("contrato com outorgantes e cláusulas numeradas dispara", () => {
  const doc = [
    "# CONTRATO DE PRESTAÇÃO DE SERVIÇOS",
    "",
    "**Primeiro Outorgante (Prestador):** Acme Lda, NIF 500000000.",
    "**Segundo Outorgante (Cliente):** Beta SA, NIF 500000001.",
    "",
    "## Cláusula 1.ª (Objeto)",
    "O presente contrato tem por objeto a prestação de serviços.",
  ].join("\n");
  assert.equal(dispara("propostas/contrato-acme.md", doc), true);
});

test("carta formal sem H1 dispara pelos marcadores (assunto + Exmo.)", () => {
  const carta = [
    "Acme Lda, NIF 500000000",
    "",
    "**ASSUNTO: Interpelação para pagamento — Fatura 2026/17**",
    "",
    "Exmo(a). Senhor(a),",
    "",
    "Vimos, por este meio, interpelar V. Exa. para o pagamento.",
  ].join("\n");
  assert.equal(dispara("clientes/beta/carta.md", carta), true);
});

test("todos os templates de instrumentos jurídicos disparam", () => {
  // intake-caso e parecer-juridico são fichas de trabalho interno, não instrumentos:
  // o lembrete (partes/preço/foro/carta registada) não se lhes aplica.
  const naoInstrumentos = new Set(["intake-caso.md", "parecer-juridico.md"]);
  const falhas = readdirSync(TEMPLATES)
    .filter((f) => f.endsWith(".md") && f !== "README.md" && !naoInstrumentos.has(f))
    .filter((f) => !dispara(`documentos/${f}`, readFileSync(resolve(TEMPLATES, f), "utf8")));
  assert.deepEqual(falhas, [], `templates não detetados: ${falhas.join(", ")}`);
});

// --- Contrato de robustez do hook ----------------------------------------

test("entradas degeneradas não rebentam (fail-open silencioso)", () => {
  for (const arg of [{}, { path: null, content: null }, { content: "contrato" }]) {
    assert.doesNotThrow(() => detetarDocumentoJuridico(arg));
  }
  // sem path (ex.: Edit sem file_path) não deve inferir instrumento a partir de ruído
  assert.equal(detetarDocumentoJuridico({ content: "isto fala de um contrato" }), false);
});

// --- Perfil da empresa no SessionStart ------------------------------------
import { mensagemSessionStart } from "../../hooks/advogado-hook.mjs";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const HOJE_HOOK = new Date(Date.UTC(2026, 9, 3));
function dirsHook() {
  return {
    projeto: mkdtempSync(join(tmpdir(), "adv-hook-proj-")),
    home: mkdtempSync(join(tmpdir(), "adv-hook-home-")),
  };
}
function perfilEm(base, conteudo) {
  mkdirSync(join(base, ".advogado-pt"), { recursive: true });
  writeFileSync(join(base, ".advogado-pt", "perfil-empresa.md"), conteudo);
}

test("T-41 SessionStart: com perfil mostra resumo e origem; sem perfil manda perguntar; desatualizado pede confirmação", () => {
  const a = dirsHook();
  perfilEm(a.projeto, "forma_juridica: Lda\nsetor: Restauração\ntrabalhadores: 12\natualizado_em: 2026-09-01\n");
  const m1 = mensagemSessionStart({ ...a, hoje: HOJE_HOOK });
  assert.match(m1, /Perfil da empresa \(projeto\)/);
  assert.match(m1, /Lda/);
  assert.match(m1, /Restaura/);
  assert.doesNotMatch(m1, /confirma/i);

  const b = dirsHook();
  perfilEm(b.home, "forma_juridica: ENI\natualizado_em: 2026-09-01\n");
  assert.match(mensagemSessionStart({ ...b, hoje: HOJE_HOOK }), /Perfil da empresa \(geral\)/);

  const c = dirsHook();
  const m3 = mensagemSessionStart({ ...c, hoje: HOJE_HOOK });
  assert.match(m3, /Sem perfil da empresa/);
  assert.match(m3, /guardar_perfil_empresa/);

  const d = dirsHook();
  perfilEm(d.projeto, "forma_juridica: Lda\natualizado_em: 2024-01-01\n");
  assert.match(mensagemSessionStart({ ...d, hoje: HOJE_HOOK }), /confirma/i);
});

test("T-42 SessionStart: perfil ilegível ou diretório inexistente -> sem erro, segue sem perfil", () => {
  const a = dirsHook();
  perfilEm(a.projeto, Buffer.from([0, 159, 146, 150, 255, 0, 1]));
  let m;
  assert.doesNotThrow(() => (m = mensagemSessionStart({ ...a, hoje: HOJE_HOOK })));
  assert.match(m, /Sem perfil da empresa/);
  assert.doesNotThrow(() =>
    mensagemSessionStart({ projeto: join(a.projeto, "nao", "existe"), home: join(a.home, "x"), hoje: HOJE_HOOK })
  );
});
