/**
 * Testes de estrutura do plugin advogado-pt (JavaScript puro, runner node:test).
 *
 * Valida a coerência entre os slash commands, as tools registadas no servidor MCP,
 * o manifesto do plugin e o conteúdo da skill. Não depende da compilação (lê o .ts
 * fonte e os .md diretamente), pelo que corre tanto com:
 *   node --test mcp-server/test/plugin.test.mjs      (a partir da raiz do repo)
 *   node --test test/plugin.test.mjs                 (a partir de mcp-server/)
 *
 * Caminhos resolvidos a partir de mcp-server/test/: a raiz do repo é
 * resolve(here, "..", "..").
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", ".."); // raiz do repositório
const r = (...p) => resolve(repo, ...p);

// Lê todos os ficheiros commands/*.md da raiz do repo. Devolve [{ nome, texto }].
function lerCommands() {
  const dir = r("commands");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ nome: f, texto: readFileSync(resolve(dir, f), "utf8") }));
}

// Conjunto de tools registadas no servidor MCP (lido do fonte TypeScript).
function toolsRegistadas() {
  const src = readFileSync(r("mcp-server", "src", "tools.ts"), "utf8");
  const set = new Set();
  for (const m of src.matchAll(/registerTool\(\s*"([^"]+)"/g)) set.add(m[1]);
  return set;
}

test("cada tool referenciada num command existe no servidor MCP", () => {
  const registadas = toolsRegistadas();
  // Sanidade: o servidor regista um número plausível de tools.
  assert.ok(registadas.size >= 8, `esperava >=8 tools registadas, obtidas ${registadas.size}`);

  const TOOL_RE = /\b(calc_[a-z_]+|obter_[a-z]+|ler_referencia|listar_[a-z_]+|procurar_conteudo)\b/g;
  const problemas = [];
  for (const { nome, texto } of lerCommands()) {
    for (const m of texto.matchAll(TOOL_RE)) {
      const tool = m[1];
      // O prompt MCP `advogado_pt` não é uma tool — a regex acima não o captura,
      // mas mantemos a verificação explícita por robustez.
      if (tool === "advogado_pt") continue;
      if (!registadas.has(tool)) problemas.push(`${nome}: tool '${tool}' não registada`);
    }
  }
  assert.equal(problemas.length, 0, "tools referenciadas mas não registadas:\n" + problemas.join("\n"));
});

test("plugin.json aponta para caminhos existentes", () => {
  const manifest = JSON.parse(readFileSync(r(".claude-plugin", "plugin.json"), "utf8"));

  // skills e commands são caminhos relativos à raiz do plugin.
  for (const chave of ["skills", "commands"]) {
    const valor = manifest[chave];
    assert.ok(typeof valor === "string", `plugin.json: '${chave}' deve ser uma string`);
    assert.ok(existsSync(r(valor)), `plugin.json: '${chave}' -> '${valor}' não existe`);
  }

  // hooks/hooks.json está no caminho padrão e é carregado AUTOMATICAMENTE pelo
  // Claude Code; declará-lo em plugin.json provoca "Duplicate hooks file detected".
  // Logo: o ficheiro tem de existir, mas o manifesto NÃO o deve referenciar.
  assert.ok(existsSync(r("hooks", "hooks.json")), "hooks/hooks.json (caminho padrão) deve existir");
  assert.ok(
    manifest.hooks === undefined,
    "plugin.json: não deve declarar 'hooks' para o ficheiro padrão (é carregado automaticamente)"
  );

  // mcpServers aponta para o .mcp.json, que por sua vez referencia o servidor.
  const mcpRef = manifest.mcpServers;
  assert.ok(typeof mcpRef === "string", "plugin.json: 'mcpServers' deve ser uma string");
  assert.ok(existsSync(r(mcpRef)), `plugin.json: 'mcpServers' -> '${mcpRef}' não existe`);

  const mcp = JSON.parse(readFileSync(r(mcpRef), "utf8"));
  assert.ok(mcp.mcpServers && mcp.mcpServers["advogado-pt"], ".mcp.json deve definir o servidor 'advogado-pt'");
});

test("o conteúdo (referência/template/playbook/checklist) citado nos commands existe", () => {
  // verbo -> subdiretório da skill onde vive esse tipo de conteúdo
  const DIR = {
    ler_referencia: ["references"],
    obter_template: ["assets", "templates"],
    obter_playbook: ["playbooks"],
    obter_checklist: ["assets", "checklists"],
  };

  // Captura, para cada verbo, o nome do conteúdo associado na mesma linha.
  // Aceita as duas formas usadas nos commands:
  //   `ler_referencia` com `nome: herancas`
  //   `obter_template` com o template `contrato-arrendamento-habitacional`
  const PAR_RE = new RegExp(
    "(ler_referencia|obter_template|obter_playbook|obter_checklist)" +
      "`?[^\\n`]*?" +
      "(?:`nome:\\s*([a-z0-9-]+)`" +
      "|com\\s+o\\s+(?:template|playbook|checklist|refer\\u00eancia)\\s+`([a-z0-9-]+)`)",
    "g"
  );

  const pares = [];
  for (const { nome, texto } of lerCommands()) {
    for (const m of texto.matchAll(PAR_RE)) {
      const verbo = m[1];
      const conteudo = m[2] || m[3];
      if (conteudo) pares.push({ comando: nome, verbo, conteudo });
    }
  }

  // Sanidade: devemos ter encontrado vários pares verbo->conteúdo.
  assert.ok(pares.length >= 5, `esperava encontrar >=5 referências de conteúdo, obtidas ${pares.length}`);

  const faltam = [];
  for (const { comando, verbo, conteudo } of pares) {
    const caminho = r("skills", "advogado-pt", ...DIR[verbo], `${conteudo}.md`);
    if (!existsSync(caminho)) faltam.push(`${comando}: ${verbo} '${conteudo}' -> ${caminho} não existe`);
  }
  assert.equal(faltam.length, 0, "conteúdo citado mas inexistente:\n" + faltam.join("\n"));
});
