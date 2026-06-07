#!/usr/bin/env node
// CLI universal do advogado-pt. Duas funções:
//   advogado-pt mcp-config <host> [--npx]   -> imprime o bloco de config MCP pronto a colar
//   advogado-pt calc <calc> [args]          -> corre uma calculadora jurídica
// Sem dependências externas (só node: builtins + as calculadoras compiladas do mcp-server).
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const serverPath = resolve(repo, "mcp-server", "dist", "index.js");
const calcPath = resolve(repo, "mcp-server", "dist", "calculators", "index.js");

const HOSTS = {
  "claude-desktop": "json-mcpServers",
  "claude-code": "json-mcpServers",
  cursor: "json-mcpServers",
  windsurf: "json-mcpServers",
  gemini: "json-mcpServers",
  generic: "json-mcpServers",
  vscode: "json-servers",
  codex: "toml",
};

function serverSpec() {
  return { command: "node", args: [serverPath] };
}

function renderConfig(host) {
  const fmt = HOSTS[host];
  const spec = serverSpec();
  if (fmt === "toml") {
    return (
      `[mcp_servers.advogado-pt]\n` +
      `command = "${spec.command}"\n` +
      `args = [${spec.args.map((a) => `"${a.replace(/\\/g, "\\\\")}"`).join(", ")}]`
    );
  }
  const inner = { command: spec.command, args: spec.args };
  if (fmt === "json-servers") {
    return JSON.stringify({ servers: { "advogado-pt": { type: "stdio", ...inner } } }, null, 2);
  }
  return JSON.stringify({ mcpServers: { "advogado-pt": inner } }, null, 2);
}

function mcpConfig(args) {
  const host = args.find((a) => !a.startsWith("--")) || "generic";
  if (host === "all") {
    for (const h of Object.keys(HOSTS)) {
      console.log(`# ${h}`);
      console.log(renderConfig(h));
      console.log("");
    }
    return;
  }
  if (!HOSTS[host]) {
    console.error(`Host desconhecido: ${host}. Opções: ${Object.keys(HOSTS).join(", ")}, all.`);
    process.exit(1);
  }
  if (!existsSync(serverPath)) {
    console.error(
      `Aviso: ${serverPath} não existe ainda. Corre primeiro:\n  cd mcp-server && npm install && npm run build\n`
    );
  }
  console.log(renderConfig(host));
}

function num(args, flag, def) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] !== undefined ? Number(args[i + 1]) : def;
}
function str(args, flag, def) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : def;
}

async function calc(args) {
  if (!existsSync(calcPath)) {
    console.error("Calculadoras ainda não compiladas. Corre: cd mcp-server && npm install && npm run build");
    process.exit(1);
  }
  const c = await import(pathToFileURL(calcPath).href);
  const which = args[0];
  const rest = args.slice(1);
  const fmt = c.formatarEuros;
  switch (which) {
    case "imt": {
      const r = c.calcularIMT(num(rest, "--valor", 0), str(rest, "--tipo", "hpp"), rest.includes("--jovem"));
      console.log(`IMT: ${fmt(r.imt)} | Selo: ${fmt(r.selo)} | Total: ${fmt(r.total)} (${r.regime})`);
      break;
    }
    case "juros": {
      const fim = str(rest, "--fim", "");
      const r = c.calcularJuros(
        num(rest, "--capital", 0),
        new Date(str(rest, "--inicio", "")),
        fim ? new Date(fim) : new Date(),
        str(rest, "--tipo", "comercial")
      );
      console.log(`Juros: ${fmt(r.juros)} | Total: ${fmt(r.total)} (${r.dias} dias)`);
      break;
    }
    case "prazo": {
      const r = c.contarPrazo(new Date(str(rest, "--inicio", "")), num(rest, "--dias", 0), str(rest, "--tipo", "uteis"));
      console.log(`Data-limite: ${r.dataLimite.toISOString().slice(0, 10)}`);
      break;
    }
    case "prescricao": {
      const r = c.calcularPrescricao(new Date(str(rest, "--inicio", "")), str(rest, "--tipo", "creditos-comerciais"));
      console.log(`${r.descricao}: limite ${r.limite.toISOString().slice(0, 10)} (${r.prazoTexto})`);
      break;
    }
    case "compensacao": {
      const r = c.calcularCompensacao(
        num(rest, "--retribuicao", 0),
        num(rest, "--diuturnidades", 0),
        num(rest, "--anos", 0),
        str(rest, "--modalidade", "sem-termo")
      );
      console.log(`Compensação: ${fmt(r.bruto)} (${r.diasAno} dias/ano${r.minimoAplicado ? ", mínimo aplicado" : ""})`);
      break;
    }
    default:
      console.error("calc <imt|juros|prazo|prescricao|compensacao> [--flags]");
      process.exit(1);
  }
}

const HELP = `advogado-pt — CLI

Uso:
  advogado-pt mcp-config <host>
      hosts: ${Object.keys(HOSTS).join(", ")}, all
      Imprime o bloco de configuração MCP (node + caminho local) para esse cliente.

  advogado-pt calc imt --valor 250000 [--tipo hpp|secundaria] [--jovem]
  advogado-pt calc juros --capital 5000 --inicio 2025-03-01 [--fim YYYY-MM-DD] [--tipo comercial|civil]
  advogado-pt calc prazo --inicio 2026-06-01 --dias 15 [--tipo uteis|corridos]
  advogado-pt calc prescricao --inicio 2025-01-15 --tipo creditos-comerciais
  advogado-pt calc compensacao --retribuicao 1500 --anos 4 [--modalidade sem-termo]

Orientação informativa — não substitui advogado inscrito na Ordem dos Advogados.`;

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === "mcp-config") return mcpConfig(args);
  if (cmd === "calc") return calc(args);
  console.log(HELP);
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
