#!/usr/bin/env node
// Gera o pacote .mcpb do servidor MCP (instalação no Claude Desktop sem Node.js nem npm do lado do
// utilizador): um ZIP com manifest.json (manifest_version 0.3), package.json ("type": "module"),
// server/index.js (o bundle self-contained) e content/ (o conteúdo jurídico, que o servidor lê a
// partir de ../content). Entradas "stored" (sem compressão) e sem assinatura — ver decisions.md (D-2).
// Usa o escritor de ZIP próprio (dist/zip.js, do `npm run build`); sem dependências.
//
//   node scripts/build-mcpb.mjs                 -> <repo>/dist/juridico-pt-<versão>.mcpb
//   node scripts/build-mcpb.mjs --out <pasta>
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const mcp = resolve(here, "..");
const repo = resolve(mcp, "..");
const i = process.argv.indexOf("--out");
const out = resolve(i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : join(repo, "dist"));

const bundle = join(mcp, "dist", "index.js");
const zipJs = join(mcp, "dist", "zip.js");
const content = join(mcp, "content");
for (const [f, o] of [[bundle, "bundle do servidor"], [zipJs, "dist/zip.js"], [content, "content/"]]) {
  if (!existsSync(f)) {
    console.error(`Falta ${o} (${relative(repo, f)}). Corre primeiro: npm --prefix mcp-server run build`);
    process.exit(2);
  }
}
const { criarZip } = await import(pathToFileURL(zipJs).href);
const pkg = JSON.parse(readFileSync(join(mcp, "package.json"), "utf8"));
const plugin = JSON.parse(readFileSync(join(repo, ".claude-plugin", "plugin.json"), "utf8"));

const manifest = {
  manifest_version: "0.3",
  name: "juridico-pt",
  display_name: "Jurídico PT",
  version: pkg.version,
  description: "Assistente jurídico de direito português (PT/EN): referências, templates, playbooks e calculadoras. Não substitui advogado inscrito na OA.",
  long_description:
    "Servidor MCP local com o conteúdo jurídico do Jurídico PT: referências por área, templates de documentos com verificação final, playbooks, checklists e calculadoras (juros de mora por semestre e em lote, prazos, prescrição, IMT, IRS, IRC, IVA, compensações, custas, procedimento de contratação pública), calendário de obrigações e prazos em curso com perfil da empresa. Os dados ficam no computador (pasta .juridico-pt/). Orientação informativa — não substitui advogado inscrito na Ordem dos Advogados.",
  author: { name: plugin.author?.name ?? "Carlos Pereira", url: plugin.homepage },
  repository: { type: "git", url: plugin.repository },
  homepage: plugin.homepage,
  license: plugin.license ?? "MIT",
  keywords: ["direito", "portugal", "legal", "juros", "contratos", "rgpd", "fiscal"],
  server: {
    type: "node",
    entry_point: "server/index.js",
    mcp_config: { command: "node", args: ["${__dirname}/server/index.js"] },
  },
  tools_generated: true,
  prompts_generated: true,
  compatibility: { platforms: ["darwin", "win32", "linux"], runtimes: { node: ">=18.0.0" } },
};

function ficheiros(dir) {
  const lista = [];
  for (const nome of readdirSync(dir).sort()) {
    const f = join(dir, nome);
    if (statSync(f).isDirectory()) lista.push(...ficheiros(f));
    else lista.push(f);
  }
  return lista;
}

const entradas = [
  { nome: "manifest.json", dados: JSON.stringify(manifest, null, 2) + "\n" },
  { nome: "package.json", dados: JSON.stringify({ name: "juridico-pt-mcpb", version: pkg.version, private: true, type: "module" }, null, 2) + "\n" },
  { nome: "server/index.js", dados: readFileSync(bundle) },
  ...ficheiros(content).map((f) => ({ nome: `content/${relative(content, f).split("\\").join("/")}`, dados: readFileSync(f) })),
];
if (existsSync(join(repo, "LICENSE"))) entradas.push({ nome: "LICENSE", dados: readFileSync(join(repo, "LICENSE")) });

const naoAscii = entradas.filter((e) => /[^\x20-\x7e]/.test(e.nome));
if (naoAscii.length) {
  console.error(`Nomes não ASCII no pacote: ${naoAscii.map((e) => e.nome).join(", ")}`);
  process.exit(1);
}

mkdirSync(out, { recursive: true });
const destino = join(out, `juridico-pt-${pkg.version}.mcpb`);
const bytes = criarZip(entradas, new Date());
writeFileSync(destino, bytes);
console.log(`OK: ${relative(process.cwd(), destino) || destino} (${entradas.length} ficheiros, ${(bytes.length / 1024).toFixed(0)} KB)`);
console.log("Claude Desktop: Definições -> Extensões -> Instalar extensão… e escolhe o ficheiro .mcpb.");
