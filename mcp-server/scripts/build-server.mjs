#!/usr/bin/env node
// Empacota o servidor MCP num único `dist/index.js` self-contained (com as
// dependências @modelcontextprotocol/sdk e zod inline). É isto que permite ao
// plugin funcionar quando instalado via marketplace, onde NÃO há `node_modules`
// nem passo de `npm install`. O conteúdo jurídico continua a ser lido como
// ficheiros reais a partir de `../content` (ver scripts/bundle-content.mjs).
import { build } from "esbuild";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const comum = {
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  // Alguns pacotes (transitivos) podem chamar require() em runtime; em saída ESM
  // o `require` não existe por omissão, por isso recriamo-lo a partir do módulo.
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module';\nconst require = __createRequire(import.meta.url);",
  },
  logLevel: "info",
};

await build({ ...comum, entryPoints: [resolve(root, "src", "index.ts")], outfile: resolve(root, "dist", "index.js") });
console.log("OK: servidor MCP empacotado (self-contained) -> dist/index.js");

// O CLI usa as calculadoras, o calendário, os prazos, o painel, a exportação e a atualidade.
// Também versionado: a saída do tsc no resto de dist/ não chega a quem instala pelo marketplace.
await build({ ...comum, entryPoints: [resolve(root, "src", "cli-lib.ts")], outfile: resolve(root, "dist", "cli-lib.js") });
console.log("OK: módulos do CLI empacotados (self-contained) -> dist/cli-lib.js");
