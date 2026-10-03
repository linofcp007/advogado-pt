#!/usr/bin/env node
// Gera as instruções das integrações (Codex, Gemini CLI, Cursor, Windsurf, ChatGPT, o AGENTS.md e as regras de editor da raiz)
// a partir de uma fonte única: PERSONA_INTEGRACOES em `src/persona.ts` (lida do build em `dist/`).
// O texto é escrito entre os marcadores INICIO/FIM; o resto de cada ficheiro não é tocado.
//
//   node scripts/gerar-integracoes.mjs           -> atualiza os ficheiros
//   node scripts/gerar-integracoes.mjs --check   -> só verifica; sai com 1 se algum estiver desatualizado
//
// Sem dependências (só node: builtins). Requer o build (`npm run build`) para ler dist/persona.js.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(here, "..", "..");
const persona = resolve(here, "..", "dist", "persona.js");

const INICIO = "<!-- juridico-pt:persona:inicio — gerado por mcp-server/scripts/gerar-integracoes.mjs; não editar à mão -->";
const FIM = "<!-- juridico-pt:persona:fim -->";

const ALVOS = [
  "AGENTS.md",
  "integrations/codex/AGENTS.md",
  "integrations/gemini-cli/GEMINI.md",
  "integrations/cursor/rules/juridico-pt.mdc",
  "integrations/chatgpt/custom-gpt-instructions.md",
  "integrations/windsurf/.windsurfrules",
  ".cursor/rules/juridico-pt.mdc",
  ".windsurf/rules/juridico-pt.md",
];

if (!existsSync(persona)) {
  console.error("Falta o build do servidor (dist/persona.js). Corre: npm --prefix mcp-server run build");
  process.exit(2);
}
const { PERSONA_INTEGRACOES } = await import(pathToFileURL(persona).href);
if (typeof PERSONA_INTEGRACOES !== "string" || !PERSONA_INTEGRACOES.trim()) {
  console.error("PERSONA_INTEGRACOES em falta em src/persona.ts.");
  process.exit(2);
}

const check = process.argv.includes("--check");
const bloco = `${INICIO}\n\n${PERSONA_INTEGRACOES.trim()}\n\n${FIM}`;
const problemas = [];

for (const alvo of ALVOS) {
  const f = resolve(raiz, alvo);
  const original = readFileSync(f, "utf8");
  const nl = original.includes("\r\n") ? "\r\n" : "\n";
  const texto = original.replace(/\r\n/g, "\n");
  const i = texto.indexOf(INICIO);
  const j = texto.indexOf(FIM);
  if (i < 0 || j < i) {
    problemas.push(`${alvo}: sem os marcadores da persona`);
    continue;
  }
  const novo = texto.slice(0, i) + bloco + texto.slice(j + FIM.length);
  if (novo === texto) continue;
  if (check) problemas.push(`${alvo}: desatualizado (corre: node mcp-server/scripts/gerar-integracoes.mjs)`);
  else {
    writeFileSync(f, novo.replace(/\n/g, nl), "utf8");
    console.log(`atualizado: ${relative(raiz, f)}`);
  }
}

if (problemas.length) {
  console.error(problemas.join("\n"));
  process.exit(1);
}
console.log(check ? "Integrações em dia com src/persona.ts." : "Integrações geradas.");
