// Teste de fumo end-to-end: liga ao servidor via MCP (stdio) e exercita tools, resources e prompt.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const entry = resolve(here, "..", "dist", "index.js");

let failures = 0;
function check(label, cond, extra = "") {
  console.log(`${cond ? "OK  " : "FAIL"} ${label}${extra ? " — " + extra : ""}`);
  if (!cond) failures++;
}

const transport = new StdioClientTransport({ command: "node", args: [entry] });
const client = new Client({ name: "smoke", version: "1.0.0" });
await client.connect(transport);

const tools = await client.listTools();
check("listTools", tools.tools.length >= 16, `${tools.tools.length} tools`);

const imt = await client.callTool({ name: "calc_imt", arguments: { valor: 200000, tipo: "hpp" } });
const imtText = imt.content[0].text;
check("calc_imt 200000 => 3.542,04", imtText.includes("3.542,04"), imtText.split("\n").find((l) => l.startsWith("IMT:")) ?? "");

const juros = await client.callTool({
  name: "calc_juros_mora",
  arguments: { capital: 5000, data_inicio: "2025-01-01", data_fim: "2026-01-01", tipo: "comercial" },
});
check("calc_juros_mora 5000/365d => 507,50", juros.content[0].text.includes("507,50"));

const ref = await client.readResource({ uri: "advogado-pt://references/valores-2026" });
check("readResource valores-2026", (ref.contents[0].text ?? "").length > 500, `${(ref.contents[0].text ?? "").length} chars`);

const tmpl = await client.callTool({ name: "obter_template", arguments: { nome: "requerimento-injuncao" } });
check("obter_template requerimento-injuncao", tmpl.content[0].text.includes("Injunção"));

const prompts = await client.listPrompts();
check("listPrompts advogado_pt", prompts.prompts.some((p) => p.name === "advogado_pt"));

const prompt = await client.getPrompt({ name: "advogado_pt", arguments: { assunto: "cliente não pagou" } });
check("getPrompt persona", prompt.messages[0].content.text.includes("DIREITO PORTUGUÊS"));

await client.close();
console.log(failures === 0 ? "\nSMOKE OK (todos os checks passaram)" : `\nSMOKE FALHOU (${failures} checks)`);
process.exit(failures === 0 ? 0 : 1);
