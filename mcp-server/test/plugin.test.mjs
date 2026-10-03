/**
 * Testes de estrutura do plugin advogado-pt (JavaScript puro, runner node:test).
 *
 * Valida a coerência entre os slash commands, as tools registadas no servidor MCP,
 * o manifesto do plugin e o conteúdo da skill. Lê o .ts fonte e os .md diretamente
 * (só o T-234 usa o bundle `mcp-server/dist/index.js`), pelo que corre tanto com:
 *   node --test mcp-server/test/plugin.test.mjs      (a partir da raiz do repo)
 *   node --test test/plugin.test.mjs                 (a partir de mcp-server/)
 *
 * Caminhos resolvidos a partir de mcp-server/test/: a raiz do repo é
 * resolve(here, "..", "..").
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

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

// ===========================================================================
// v1.1 — método dos templates, cobertura empresarial, perfil e release
// ===========================================================================

const SKILL = (...p) => r("skills", "advogado-pt", ...p);
const lerMd = (p) => readFileSync(p, "utf8");
const mds = (dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => ({ nome: f.slice(0, -3), caminho: resolve(dir, f) }));

const NOVAS_REFERENCIAS = ["contencioso-tributario", "bancario", "concorrencia", "uniao-europeia"];
const NOVOS_TEMPLATES = [
  "reclamacao-graciosa", "direito-audicao-previa", "pedido-pagamento-prestacoes-at",
  "pedido-informacao-vinculativa", "pacto-social-unipessoal-lda", "decisao-socio-unico",
  "contrato-desenvolvimento-software", "carta-cessacao-violacao-pi", "notificacao-remocao-conteudo",
  "reclamacao-creditos-insolvencia", "pacto-nao-concorrencia", "politica-prevencao-assedio",
  "formulario-livre-resolucao", "reclamacao-banco-operacao-nao-autorizada",
  "registo-atividades-tratamento", "resposta-pedido-titular-dados", "queixa-comissao-europeia",
];
const NOVOS_PLAYBOOKS = ["recebi-notificacao-at", "cliente-insolvente"];
const NOVAS_CHECKLISTS = ["checklist-registo-marca", "checklist-loja-online", "checklist-concorrencia"];

test("T-21 todos os templates acabam com '## Antes de enviar — verificar' e >= 3 itens", () => {
  const falhas = [];
  for (const { nome, caminho } of mds(SKILL("assets", "templates"))) {
    const t = lerMd(caminho);
    const i = t.indexOf("## Antes de enviar — verificar");
    if (i < 0) { falhas.push(`${nome}: sem secção`); continue; }
    const itens = (t.slice(i).match(/^- \[ \] .+/gm) || []).length;
    if (itens < 3) falhas.push(`${nome}: só ${itens} itens`);
  }
  assert.equal(falhas.length, 0, "templates sem verificação final:\n" + falhas.join("\n"));
});

test("T-22 todos os templates e referências declaram o âmbito (nacional, ue ou misto)", () => {
  const RE = /Âmbito:\**\s*(nacional|ue|misto)\b/i;
  const falhas = [];
  for (const dir of [SKILL("assets", "templates"), SKILL("references")]) {
    for (const { nome, caminho } of mds(dir)) {
      const topo = lerMd(caminho).split("\n").slice(0, 15).join("\n");
      if (!RE.test(topo)) falhas.push(nome);
    }
  }
  assert.equal(falhas.length, 0, "sem 'Âmbito:' nas primeiras 15 linhas:\n" + falhas.join("\n"));
});

test("T-23 a carta de cobrança formal não diz que interrompe a prescrição", () => {
  const t = lerMd(SKILL("assets", "templates", "carta-cobranca-formal-registada.md"));
  assert.doesNotMatch(t, /comunica[çc][ãa]o interrompe eventuais prazos de prescri[çc][ãa]o/i);
  assert.match(t, /n[ãa]o interrompe/i);
  assert.match(t, /323\.º/);
  assert.match(t, /325\.º/);
});

test("T-24 valores-2026 tem as taxas do 2.º semestre de 2026", () => {
  const t = lerMd(SKILL("references", "valores-2026.md"));
  assert.match(t, /16623\/2026/);
  assert.match(t, /10,40\s?%/);
  assert.match(t, /9,40\s?%/);
  assert.match(t, /Última atualização:\*\*\s*2026-10/);
});

test("T-25 conteúdos novos existem e estão nos índices", () => {
  const faltas = [];
  const tplIdx = lerMd(SKILL("assets", "templates", "README.md"));
  const chkIdx = lerMd(SKILL("assets", "checklists", "README.md"));
  const pbIdx = lerMd(SKILL("playbooks", "README.md"));
  const skill = lerMd(SKILL("SKILL.md"));
  const readme = lerMd(r("README.md"));
  for (const n of NOVAS_REFERENCIAS) {
    if (!existsSync(SKILL("references", `${n}.md`))) faltas.push(`referência ${n} não existe`);
    if (!skill.includes(`references/${n}.md`)) faltas.push(`SKILL.md não liga references/${n}.md`);
    if (!readme.includes(n)) faltas.push(`README.md não menciona ${n}`);
  }
  for (const n of NOVOS_TEMPLATES) {
    if (!existsSync(SKILL("assets", "templates", `${n}.md`))) faltas.push(`template ${n} não existe`);
    if (!tplIdx.includes(`${n}.md`)) faltas.push(`índice de templates sem ${n}`);
  }
  for (const n of NOVOS_PLAYBOOKS) {
    if (!existsSync(SKILL("playbooks", `${n}.md`))) faltas.push(`playbook ${n} não existe`);
    if (!pbIdx.includes(`${n}.md`)) faltas.push(`índice de playbooks sem ${n}`);
  }
  for (const n of NOVAS_CHECKLISTS) {
    if (!existsSync(SKILL("assets", "checklists", `${n}.md`))) faltas.push(`checklist ${n} não existe`);
    if (!chkIdx.includes(`${n}.md`)) faltas.push(`índice de checklists sem ${n}`);
  }
  assert.equal(faltas.length, 0, faltas.join("\n"));
});

const PERSONAS = [
  ["mcp-server", "src", "persona.ts"],
  ["skills", "advogado-pt", "SKILL.md"],
  ["AGENTS.md"],
  ["GEMINI.md"],
  ["integrations", "chatgpt", "custom-gpt-instructions.md"],
  ["integrations", "codex", "AGENTS.md"],
  ["integrations", "cursor", "rules", "advogado-pt.mdc"],
  ["integrations", "gemini-cli", "GEMINI.md"],
  ["integrations", "windsurf", ".windsurfrules"],
];

test("T-26 nenhuma persona fixa o perfil ENI; todas remetem para o perfil da empresa guardado", () => {
  const falhas = [];
  for (const partes of PERSONAS) {
    const t = lerMd(r(...partes));
    const nome = partes.join("/");
    if (/Empres[áa]rio em Nome Individual \(ENI\), com poss[íi]vel transi[çc][ãa]o/i.test(t)) falhas.push(`${nome}: perfil ENI fixo`);
    if (/utilizador ENI em tech/i.test(t)) falhas.push(`${nome}: perfil ENI fixo`);
    if (/Atualmente é Empres[áa]rio em Nome Individual/i.test(t)) falhas.push(`${nome}: perfil ENI fixo`);
    if (!t.includes("perfil-empresa")) falhas.push(`${nome}: não menciona o perfil-empresa`);
  }
  assert.equal(falhas.length, 0, falhas.join("\n"));
});

test("T-27 commands fisco, insolvencia e perfil existem e nomeiam o conteúdo/tool real", () => {
  const casos = {
    fisco: /recebi-notificacao-at/,
    insolvencia: /cliente-insolvente/,
    perfil: /obter_perfil_empresa[\s\S]*guardar_perfil_empresa|guardar_perfil_empresa[\s\S]*obter_perfil_empresa/,
  };
  for (const [nome, re] of Object.entries(casos)) {
    const p = r("commands", `${nome}.md`);
    assert.ok(existsSync(p), `commands/${nome}.md não existe`);
    const t = lerMd(p);
    assert.match(t, /^description:/m, `${nome}: sem description`);
    assert.match(t, /^argument-hint:/m, `${nome}: sem argument-hint`);
    assert.match(t, re, `${nome}: não nomeia o conteúdo/tool`);
  }
});

test("T-28 convenção {{CAMPO}} vs [VERIFICAR] e 'Antes de enviar' documentadas", () => {
  for (const p of [SKILL("assets", "templates", "README.md"), SKILL("SKILL.md")]) {
    const t = lerMd(p);
    assert.ok(t.includes("[VERIFICAR]"), `${p}: sem [VERIFICAR]`);
    assert.ok(t.includes("Antes de enviar"), `${p}: sem 'Antes de enviar'`);
  }
});

test("T-29 conteúdos novos: estilo da casa e marcas de confirmação", () => {
  const falhas = [];
  for (const n of NOVAS_REFERENCIAS) {
    const p = SKILL("references", `${n}.md`);
    if (!existsSync(p)) { falhas.push(`${n}: não existe`); continue; }
    const t = lerMd(p);
    if (!/^## Legisla[çc][ãa]o Base/m.test(t)) falhas.push(`${n}: sem '## Legislação Base'`);
    if (!/^## Para o contexto do utilizador/m.test(t)) falhas.push(`${n}: sem '## Para o contexto do utilizador'`);
  }
  const todos = [
    ...NOVAS_REFERENCIAS.map((n) => SKILL("references", `${n}.md`)),
    ...NOVOS_TEMPLATES.map((n) => SKILL("assets", "templates", `${n}.md`)),
    ...NOVOS_PLAYBOOKS.map((n) => SKILL("playbooks", `${n}.md`)),
    ...NOVAS_CHECKLISTS.map((n) => SKILL("assets", "checklists", `${n}.md`)),
  ];
  for (const p of todos) {
    if (!existsSync(p)) { falhas.push(`${p}: não existe`); continue; }
    if (!/\(a confirmar\)|\[VERIFICAR\]|dre\.pt|valores-2026/.test(lerMd(p))) falhas.push(`${p}: sem marca de confirmação`);
  }
  assert.equal(falhas.length, 0, falhas.join("\n"));
});

test("T-34 README tem um exemplo trabalhado (caso -> tools -> documento)", () => {
  const t = lerMd(r("README.md"));
  const m = /^#{2,3} .*Exemplo trabalhado.*$/m.exec(t);
  assert.ok(m, "README sem secção 'Exemplo trabalhado'");
  const secao = t.slice(m.index, m.index + 4000);
  assert.match(secao, /calc_juros_mora/);
  assert.match(secao, /carta-cobranca-formal-registada/);
});

test("T-35 o servidor regista as 4 tools novas", () => {
  const reg = toolsRegistadas();
  for (const n of ["calc_creditos_laborais", "calc_legitima", "obter_perfil_empresa", "guardar_perfil_empresa"]) {
    assert.ok(reg.has(n), `tool ${n} não registada`);
  }
});

test("T-43 SKILL.md: secção 'Perfil da Empresa' com projeto -> geral, 12 meses e sem dados de outra entidade", () => {
  const t = lerMd(SKILL("SKILL.md"));
  const m = /^## Perfil da Empresa/m.exec(t);
  assert.ok(m, "SKILL.md sem '## Perfil da Empresa'");
  const fim = t.indexOf("\n## ", m.index + 5);
  const secao = t.slice(m.index, fim < 0 ? undefined : fim);
  assert.match(secao, /\.advogado-pt\/perfil-empresa\.md/);
  assert.match(secao, /~\/\.advogado-pt/);
  assert.match(secao, /12 meses/);
  assert.match(secao, /outra entidade/i);
});

test("T-44 sem dependências novas", () => {
  const mcp = JSON.parse(lerMd(r("mcp-server", "package.json")));
  assert.deepEqual(Object.keys(mcp.dependencies).sort(), ["@modelcontextprotocol/sdk", "zod"]);
  assert.deepEqual(Object.keys(mcp.devDependencies).sort(), ["@types/node", "esbuild", "typescript"]);
  const raiz = JSON.parse(lerMd(r("package.json")));
  assert.deepEqual(raiz.dependencies || {}, {});
});

// v1.2: valida a coerência com a versão corrente (a de plugin.json), não um número fixo.
test("T-45 versão coerente em todos os manifestos + CHANGELOG", () => {
  const V = JSON.parse(lerMd(r(".claude-plugin", "plugin.json"))).version;
  assert.match(V, /^\d+\.\d+\.\d+$/);
  assert.equal(JSON.parse(lerMd(r(".claude-plugin", "plugin.json"))).version, V);
  const mk = JSON.parse(lerMd(r(".claude-plugin", "marketplace.json")));
  assert.equal(mk.metadata.version, V);
  assert.equal(mk.plugins[0].version, V);
  assert.equal(JSON.parse(lerMd(r("package.json"))).version, V);
  assert.equal(JSON.parse(lerMd(r("mcp-server", "package.json"))).version, V);
  assert.ok(lerMd(r("mcp-server", "src", "index.ts")).includes(`version: "${V}"`), "index.ts sem a versão corrente");
  assert.ok(lerMd(r("CHANGELOG.md")).includes(`## [${V}]`), "CHANGELOG sem a versão corrente");
});

test("T-46 o bundle mcp-server/content tem os conteúdos novos", () => {
  const C = (...p) => r("mcp-server", "content", ...p);
  const faltas = [];
  for (const n of NOVAS_REFERENCIAS) if (!existsSync(C("references", `${n}.md`))) faltas.push(`references/${n}`);
  for (const n of NOVOS_TEMPLATES) if (!existsSync(C("templates", `${n}.md`))) faltas.push(`templates/${n}`);
  for (const n of NOVOS_PLAYBOOKS) if (!existsSync(C("playbooks", `${n}.md`))) faltas.push(`playbooks/${n}`);
  for (const n of NOVAS_CHECKLISTS) if (!existsSync(C("checklists", `${n}.md`))) faltas.push(`checklists/${n}`);
  assert.equal(faltas.length, 0, "em falta no bundle:\n" + faltas.join("\n"));
});

// ---------------- v1.2.1 (distribuição e coerência) ----------------

const PY = process.env.PYTHON || "python";
const tmpDir = (p) => mkdtempSync(join(tmpdir(), p));

// Lê `name` e `description` do frontmatter YAML (aceita os escalares `>` e `|`).
function frontmatter(texto) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(texto);
  assert.ok(m, "SKILL.md sem frontmatter");
  const linhas = m[1].split(/\r?\n/);
  const campos = {};
  for (let i = 0; i < linhas.length; i++) {
    const c = /^([a-z_-]+):\s*(.*)$/.exec(linhas[i]);
    if (!c) continue;
    let valor = c[2].trim();
    if ([">", "|", ">-", "|-"].includes(valor)) {
      const partes = [];
      while (i + 1 < linhas.length && /^\s+\S/.test(linhas[i + 1])) partes.push(linhas[++i].trim());
      valor = partes.join(valor.startsWith(">") ? " " : "\n");
    }
    campos[c[1]] = valor.replace(/^["']|["']$/g, "");
  }
  return campos;
}

test("T-233 SKILL.md: name no padrão e description com até 1024 caracteres, sem < nem >; build.py valida", () => {
  const fm = frontmatter(lerMd(SKILL("SKILL.md")));
  assert.match(fm.name, /^[a-z0-9-]{1,64}$/);
  assert.ok(fm.description.length <= 1024, `description com ${fm.description.length} caracteres`);
  assert.doesNotMatch(fm.description, /[<>]/);
  const validar = (desc) =>
    spawnSync(PY, ["-c", "import sys, build; build.validar_skill_md(sys.stdin.read())"], {
      cwd: repo,
      input: `---\nname: advogado-pt\ndescription: ${desc}\n---\n# X\n`,
      encoding: "utf8",
    });
  assert.equal(validar("Assessoria jurídica de Portugal.").status, 0, "build.validar_skill_md recusou uma description válida");
  const longa = validar("x".repeat(1100));
  assert.notEqual(longa.status, 0, "build.validar_skill_md aceitou uma description com 1100 caracteres");
  assert.match(longa.stderr + longa.stdout, /1024/);
});

test("T-234 instruções do servidor com até 2000 caracteres e todas as tools; persona completa no prompt advogado_pt", async () => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [r("mcp-server", "dist", "index.js")],
    cwd: tmpDir("adv-instr-"),
    stderr: "pipe",
  });
  const client = new Client({ name: "t234", version: "1.0.0" });
  await client.connect(transport);
  try {
    const instr = client.getInstructions() || "";
    assert.ok(instr.length > 0 && instr.length <= 2000, `instruções com ${instr.length} caracteres`);
    const { tools } = await client.listTools();
    const faltam = tools.map((t) => t.name).filter((n) => !instr.includes(n));
    assert.deepEqual(faltam, [], `tools sem menção nas instruções: ${faltam.join(", ")}`);
    const p = await client.getPrompt({ name: "advogado_pt" });
    const texto = p.messages.map((m) => m.content?.text || "").join("\n");
    assert.match(texto, /RIGOR/);
    assert.match(texto, /SIN[ÓO]NIMOS/);
    assert.ok(texto.length > instr.length, "o prompt advogado_pt devia ter a persona completa");
  } finally {
    await client.close();
  }
});

const NATIVOS = [
  "add-dir", "agents", "bug", "clear", "compact", "config", "context", "cost", "doctor", "export", "help",
  "hooks", "ide", "init", "login", "logout", "mcp", "memory", "model", "permissions", "plugin", "pr-comments",
  "release-notes", "resume", "review", "rewind", "security-review", "status", "statusline", "terminal-setup",
  "todos", "upgrade", "usage", "vim",
];

test("T-235 nenhum command com nome de comando nativo; /diagnostico no hook e no README", () => {
  const nomes = lerCommands().map((c) => c.nome.replace(/\.md$/, ""));
  const colisoes = nomes.filter((n) => NATIVOS.includes(n));
  assert.deepEqual(colisoes, [], `commands que colidem com comandos nativos: ${colisoes.join(", ")}`);
  assert.ok(nomes.includes("diagnostico"), "falta commands/diagnostico.md");
  const hook = lerMd(r("hooks", "advogado-hook.mjs"));
  assert.match(hook, /\/diagnostico\b/);
  assert.doesNotMatch(hook, /\/doctor\b/);
  const readme = lerMd(r("README.md"));
  assert.match(readme, /`\/diagnostico`/);
  assert.doesNotMatch(readme, /`\/doctor`/);
});

test("T-236 commands citam ficheiros do plugin com ${CLAUDE_PLUGIN_ROOT} e não mandam compilar", () => {
  const falhas = [];
  for (const { nome, texto } of lerCommands()) {
    for (const m of texto.matchAll(/(\S*?)((?:scripts|cli|mcp-server|hooks|skills)\/[\w./-]+?\.(?:py|mjs|js|md))\b/g)) {
      if (!m[1].endsWith("${CLAUDE_PLUGIN_ROOT}/")) falhas.push(`${nome}: '${m[2]}' sem \${CLAUDE_PLUGIN_ROOT}`);
    }
    if (/npm (run build|install)/.test(texto)) falhas.push(`${nome}: manda compilar ou instalar`);
  }
  assert.deepEqual(falhas, [], falhas.join("\n"));
});

test("T-237 o .skill gerado tem a pasta advogado-pt na raiz", () => {
  const out = tmpDir("adv-skill-");
  const b = spawnSync(PY, [r("build.py"), "--out", out], { cwd: repo, encoding: "utf8" });
  assert.equal(b.status, 0, b.stderr || b.stdout);
  const z = spawnSync(
    PY,
    ["-c", "import sys, zipfile; print(chr(10).join(zipfile.ZipFile(sys.argv[1]).namelist()))", join(out, "advogado-pt.skill")],
    { encoding: "utf8" }
  );
  assert.equal(z.status, 0, z.stderr);
  const nomes = z.stdout.split(/\r?\n/).filter(Boolean);
  assert.ok(nomes.includes("advogado-pt/SKILL.md"), "o .skill não tem advogado-pt/SKILL.md");
  assert.deepEqual(nomes.filter((n) => !n.startsWith("advogado-pt/")), []);
});

test("T-239 não existe bin/ na raiz; o hook analisa os edits do MultiEdit", () => {
  assert.ok(!existsSync(r("bin")), "existe um diretório bin/ na raiz (o Claude Desktop recusa o plugin)");
  const ficheiro = join(tmpDir("adv-multi-"), "contrato-cliente.md");
  writeFileSync(
    ficheiro,
    "# CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nPRIMEIRA OUTORGANTE: ...\n\n## Cláusula 1.ª (Objeto)\nO presente contrato ...\n"
  );
  const payload = {
    tool_name: "MultiEdit",
    tool_input: {
      file_path: ficheiro,
      edits: [{ old_string: "## Cláusula 1.ª", new_string: "## Cláusula 1.ª (Objeto)" }],
    },
  };
  const out = spawnSync(process.execPath, [r("hooks", "advogado-hook.mjs"), "PostToolUse"], {
    input: JSON.stringify(payload),
    encoding: "utf8",
  });
  assert.equal(out.status, 0);
  assert.match(out.stdout, /Documento jur[íi]dico detetado/);
});

test("T-244 nenhuma referência, checklist ou playbook com perfil fixo do utilizador", () => {
  const FIXO = /Como ENI \(situa[çc][ãa]o atual\)|Regime Atual — ENI|Unipessoal Lda \(futuro\)/;
  const falhas = [];
  for (const sub of [["references"], ["assets", "checklists"], ["playbooks"]]) {
    const dir = SKILL(...sub);
    for (const f of readdirSync(dir).filter((n) => n.endsWith(".md"))) {
      if (FIXO.test(lerMd(resolve(dir, f)))) falhas.push(`${sub.join("/")}/${f}`);
    }
  }
  assert.deepEqual(falhas, [], `perfil fixo em: ${falhas.join(", ")}`);
});

test("T-249 versão 1.2.1 nos 6 sítios e no package-lock; CHANGELOG com ## [1.2.1]", () => {
  const V = "1.2.1";
  assert.equal(JSON.parse(lerMd(r(".claude-plugin", "plugin.json"))).version, V);
  const mk = JSON.parse(lerMd(r(".claude-plugin", "marketplace.json")));
  assert.equal(mk.metadata.version, V);
  assert.equal(mk.plugins[0].version, V);
  assert.equal(JSON.parse(lerMd(r("package.json"))).version, V);
  assert.equal(JSON.parse(lerMd(r("mcp-server", "package.json"))).version, V);
  assert.ok(lerMd(r("mcp-server", "src", "index.ts")).includes(`version: "${V}"`));
  const lock = JSON.parse(lerMd(r("mcp-server", "package-lock.json")));
  assert.equal(lock.version, V);
  assert.equal(lock.packages[""].version, V);
  assert.ok(lerMd(r("CHANGELOG.md")).includes(`## [${V}]`));
});
