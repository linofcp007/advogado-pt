/**
 * Testes da v2.0 (juridico-pt), T-302 a T-340 (exceto T-309, T-313, T-316, T-326, T-336 a T-338).
 * Importa a versão COMPILADA (`../dist/`), que `npm test` gera antes. Os módulos novos são
 * importados dentro de cada teste, para que cada um falhe sozinho enquanto não existir.
 * Pastas temporárias para os dados; cliente MCP real sobre o bundle para a elicitation.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync, writeFileSync, existsSync, mkdtempSync, mkdirSync, readdirSync, cpSync, symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ElicitRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", "..");
const r = (...p) => resolve(repo, ...p);
const SKILL = (...p) => r("skills", "juridico-pt", ...p);
const ler = (p) => readFileSync(p, "utf8");
const DIST = r("mcp-server", "dist");
const mod = (f) => import(pathToFileURL(join(DIST, f)).href);
const hook = () => import(pathToFileURL(r("hooks", "juridico-hook.mjs")).href);
const tmp = (p) => mkdtempSync(join(tmpdir(), p));
const D = (s) => new Date(`${s}T00:00:00Z`);
const quase = (a, b, tol = 0.006) => assert.ok(Math.abs(a - b) < tol, `esperado ${b}, obtido ${a}`);
const PY = process.env.PYTHON || "python";
const FIX = JSON.parse(ler(r("mcp-server", "test", "fixtures", "paridade.json")));
const FACTOS = JSON.parse(ler(r("mcp-server", "test", "factos.json")));

function verificarFactos(prefixos) {
  const lista = FACTOS.filter((f) => prefixos.some((p) => f.id.startsWith(p)));
  assert.ok(lista.length > 0, `sem factos com o prefixo ${prefixos.join(", ")}`);
  const falhas = [];
  for (const f of lista) {
    if (!existsSync(r(f.ficheiro))) {
      falhas.push(`${f.id}: falta '${f.ficheiro}'`);
      continue;
    }
    const texto = ler(r(f.ficheiro));
    for (const s of f.contem || []) if (!new RegExp(s, "i").test(texto)) falhas.push(`${f.id}: '${f.ficheiro}' devia conter /${s}/`);
    for (const s of f.naoContem || []) if (new RegExp(s, "i").test(texto)) falhas.push(`${f.id}: '${f.ficheiro}' não pode conter /${s}/`);
  }
  assert.equal(falhas.length, 0, "factos por cumprir:\n" + falhas.join("\n"));
}

// Âmbito declarado e "Antes de enviar — verificar" com >= 3 itens (estilo da casa dos templates).
function templateNoEstilo(nome) {
  const f = SKILL("assets", "templates", `${nome}.md`);
  assert.ok(existsSync(f), `falta o template ${nome}`);
  const t = ler(f);
  assert.match(t, /Âmbito:\s*(nacional|ue|misto)/i, `${nome}: sem âmbito`);
  const i = t.search(/^## Antes de enviar — verificar/m);
  assert.ok(i >= 0, `${nome}: sem 'Antes de enviar — verificar'`);
  assert.ok((t.slice(i).match(/^- \[ \]/gm) || []).length >= 3, `${nome}: menos de 3 itens a verificar`);
  assert.match(ler(SKILL("assets", "templates", "README.md")), new RegExp(`${nome}\\.md`), `${nome}: não está no índice`);
}

function existeIndexado(caminho, indices) {
  assert.ok(existsSync(SKILL(...caminho.split("/"))), `falta ${caminho}`);
  const nome = caminho.split("/").pop();
  const onde = indices.map((i) => ler(SKILL(...i.split("/")))).join("\n");
  assert.ok(onde.includes(nome.replace(/\.md$/, "")), `${caminho} não está indexado em ${indices.join(", ")}`);
}

async function comCliente(fn, { elicitation = null, projeto = tmp("jpt-mcp-") } = {}) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [join(DIST, "index.js")],
    cwd: projeto,
    env: { ...process.env, CLAUDE_PROJECT_DIR: projeto, JURIDICO_PT_HOME: tmp("jpt-home-") },
    stderr: "pipe",
  });
  const client = new Client({ name: "v20-test", version: "1.0.0" }, elicitation ? { capabilities: { elicitation: {} } } : {});
  if (elicitation) client.setRequestHandler(ElicitRequestSchema, elicitation);
  await client.connect(transport);
  try {
    return await fn(client, projeto);
  } finally {
    await client.close();
  }
}
const textoDe = (res) => (res.content || []).map((c) => c.text || "").join("\n");

// ---------------- US-1 renomeação ----------------

test("T-302 apresenta-se como assistente jurídico, nunca como advogado; o aviso da OA mantém-se", () => {
  const ficheiros = [
    r("mcp-server", "src", "persona.ts"), SKILL("SKILL.md"), r("README.md"), r("AGENTS.md"), r("GEMINI.md"),
    ...readdirSync(r("commands")).map((f) => r("commands", f)),
    ...(existsSync(r("agents")) ? readdirSync(r("agents")).map((f) => r("agents", f)) : []),
  ];
  const PROIBIDO = /És o advogado|sou o (teu )?advogado|advogado (pessoal|empresarial) do utilizador|Advogado PT\b|persona de advogado/i;
  const falhas = ficheiros.filter((f) => PROIBIDO.test(ler(f))).map((f) => f.slice(repo.length + 1));
  assert.deepEqual(falhas, [], `apresentação como advogado em: ${falhas.join(", ")}`);
  for (const f of [r("mcp-server", "src", "persona.ts"), SKILL("SKILL.md")]) {
    assert.match(ler(f), /assistente jurídico/i, f);
    assert.match(ler(f), /Ordem dos Advogados|inscrito na OA/i, f);
  }
});

test("T-303 dados em .juridico-pt/; uma .advogado-pt/ presente é ignorada e fica intacta", async () => {
  const { guardarPerfil, lerPerfil } = await mod("perfil.js");
  const { registarPrazo, lerPrazos } = await mod("prazos-estado.js");
  const { exportarICS, gerarCalendario } = await mod("calendario.js");
  const projeto = tmp("jpt-dados-");
  mkdirSync(join(projeto, ".advogado-pt"));
  writeFileSync(join(projeto, ".advogado-pt", "perfil-empresa.md"), "forma_juridica: ENI\natualizado_em: 2026-09-01\n");
  writeFileSync(join(projeto, ".advogado-pt", "prazos.md"), "- [ ] 2026-11-01 — Antigo\n");
  assert.equal(lerPerfil({ projeto, home: tmp("jpt-h-") }), null, "leu o perfil de .advogado-pt/");
  assert.deepEqual(lerPrazos(projeto), [], "leu os prazos de .advogado-pt/");
  guardarPerfil({ forma_juridica: "Lda" }, "projeto", { projeto });
  registarPrazo({ data: "2026-11-20", descricao: "Novo" }, projeto);
  exportarICS(2026, gerarCalendario(2026, null), projeto);
  for (const f of ["perfil-empresa.md", "prazos.md", "calendario-2026.ics"]) {
    assert.ok(existsSync(join(projeto, ".juridico-pt", f)), `falta .juridico-pt/${f}`);
  }
  assert.equal(lerPerfil({ projeto, home: tmp("jpt-h-") }).campos.forma_juridica, "Lda");
  assert.equal(ler(join(projeto, ".advogado-pt", "prazos.md")), "- [ ] 2026-11-01 — Antigo\n");
  assert.deepEqual(readdirSync(join(projeto, ".advogado-pt")).sort(), ["perfil-empresa.md", "prazos.md"]);
});

test("T-304 CHANGELOG 2.0.0 com os passos de troca (no máximo 4 comandos) e a pasta a renomear", () => {
  const c = ler(r("CHANGELOG.md"));
  const i = c.indexOf("## [2.0.0]");
  assert.ok(i >= 0, "CHANGELOG sem ## [2.0.0]");
  const fim = c.indexOf("\n## [", i + 5);
  const sec = c.slice(i, fim < 0 ? undefined : fim);
  const m = /### Migração[\s\S]*?(?=\n### |$)/.exec(sec);
  assert.ok(m, "sem secção ### Migração");
  const comandos = m[0].split("\n").filter((l) => /^\s*(\/plugin|claude plugin)\b/.test(l));
  assert.ok(comandos.length >= 2 && comandos.length <= 4, `${comandos.length} comandos`);
  assert.match(m[0], /advogado-pt-marketplace/);
  assert.match(m[0], /juridico-pt/);
  assert.match(m[0], /\.advogado-pt\/[\s\S]{0,80}\.juridico-pt\//);
});

test("T-305 JURIDICO_PT_HOME define a pasta do perfil geral; ADVOGADO_PT_HOME é ignorada", () => {
  const novo = tmp("jpt-home-novo-");
  const antigo = tmp("jpt-home-antigo-");
  const prog =
    `const m = await import("${pathToFileURL(join(DIST, "perfil.js")).href}");` +
    `m.guardarPerfil({ forma_juridica: "Lda" }, "geral");`;
  const out = spawnSync(process.execPath, ["--input-type=module", "-e", prog], {
    env: { ...process.env, JURIDICO_PT_HOME: novo, ADVOGADO_PT_HOME: antigo },
    encoding: "utf8",
  });
  assert.equal(out.status, 0, out.stderr);
  assert.ok(existsSync(join(novo, ".juridico-pt", "perfil-empresa.md")));
  assert.deepEqual(readdirSync(antigo), []);
  const src = ler(r("mcp-server", "src", "dados.ts"));
  assert.doesNotMatch(src, /ADVOGADO_PT_HOME/);
});

// ---------------- US-2 faturação ----------------

test("T-306 referência faturacao, playbook, checklist e /faturacao, indexados e com fonte", () => {
  existeIndexado("references/faturacao.md", ["SKILL.md"]);
  existeIndexado("playbooks/faturacao-eletronica-2027.md", ["SKILL.md"]);
  existeIndexado("assets/checklists/checklist-faturacao.md", ["SKILL.md"]);
  assert.ok(existsSync(r("commands", "faturacao.md")), "falta /faturacao");
  verificarFactos(["v20-fatura-"]);
});

test("T-307 calendário 2026: data-limite das faturas em PDF sem assinatura qualificada, com base legal", async () => {
  const { gerarCalendario } = await mod("calendario.js");
  const com = gerarCalendario(2026, { forma_juridica: "Lda", regime_iva: "trimestral", emite_faturas: "sim" });
  const f = com.find((o) => /PDF/i.test(o.titulo));
  assert.ok(f, "sem a obrigação das faturas em PDF");
  assert.equal(f.data, "2026-12-31");
  assert.match(f.base, /28\/2019/);
  assert.equal(f.aConfirmar, false);
  const sem = gerarCalendario(2026, { forma_juridica: "Lda", regime_iva: "trimestral" });
  const g = sem.find((o) => /PDF/i.test(o.titulo));
  assert.ok(g && g.aConfirmar, "sem o campo emite_faturas devia ficar 'a confirmar'");
});

// ---------------- US-3 cobrança ----------------

test("T-308 juros em lote: por fatura (tramos), 40 € nas comerciais, totais por cliente e geral; fatura não vencida -> 0", async () => {
  const { calcularJurosLote } = await mod("calculators/index.js");
  const c = FIX.jurosLote;
  const res = calcularJurosLote(c.in.faturas, D(c.in.dataFim));
  assert.equal(res.faturas.length, 5);
  c.out.faturas.forEach((e, i) => {
    const o = res.faturas[i];
    assert.equal(o.fatura, e.fatura);
    quase(o.juros, e.juros);
    quase(o.indemnizacao40, e.indemnizacao40);
    assert.equal(o.vencida, e.vencida);
    if (e.vencida) assert.ok(o.tramos.length >= 1, `${e.fatura}: sem tramos`);
  });
  assert.match(res.faturas[2].nota || "", /ainda não vencida/i);
  c.out.porCliente.forEach((e, i) => {
    const o = res.porCliente[i];
    assert.equal(o.cliente, e.cliente);
    for (const k of ["capital", "juros", "indemnizacao", "total"]) quase(o[k], e[k]);
  });
  for (const k of ["capital", "juros", "indemnizacao", "total"]) quase(res.total[k], c.out.total[k]);
  const src = ler(r("mcp-server", "src", "tools.ts"));
  assert.match(src, /registerTool\(\s*"calc_juros_lote"/);
  const cli = spawnSync(process.execPath, [r("cli", "juridico-pt.mjs"), "calc", "lote", "--json", JSON.stringify(c.in.faturas), "--fim", c.in.dataFim], { encoding: "utf8", timeout: 10000 });
  assert.equal(cli.status, 0, cli.stderr);
  assert.match(cli.stdout, /9\.556,33/);
});

test("T-310 carta de cobrança com várias faturas; cliente-nao-paga com PEPEX e IVA de créditos incobráveis", () => {
  templateNoEstilo("carta-cobranca-varias-faturas");
  verificarFactos(["v20-cobranca-"]);
});

test("T-311 /cobrar usa o conector de faturação quando existe e propõe registar_prazo", () => {
  const c = ler(r("commands", "cobrar.md"));
  assert.match(c, /conector/i);
  assert.match(c, /registar_prazo/);
  assert.match(c, /calc_juros_lote/);
});

// ---------------- US-4 avaliações ----------------

test("T-312 evals/ com pelo menos 40 casos no formato do claude plugin eval, cada um com uma verificação determinística", () => {
  const dir = r("evals");
  assert.ok(existsSync(dir), "falta evals/");
  const casos = readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && !["results", "mocks"].includes(d.name));
  assert.ok(casos.length >= 40, `${casos.length} casos`);
  const falhas = [];
  for (const c of casos) {
    const prompt = join(dir, c.name, "prompt.md");
    if (!existsSync(prompt) || !/^---\r?\n[\s\S]*?\r?\n---\r?\n\s*\S/.test(ler(prompt))) {
      falhas.push(`${c.name}: prompt.md em falta ou sem frontmatter/corpo`);
      continue;
    }
    const g = join(dir, c.name, "graders");
    const tipos = existsSync(g) ? readdirSync(g).map((f) => (/^\s*type:\s*(\S+)/m.exec(ler(join(g, f))) || [])[1]) : [];
    if (!tipos.some((t) => ["regex", "tool_used", "tool_order", "file_exists"].includes(t))) {
      falhas.push(`${c.name}: sem verificação determinística`);
    }
  }
  assert.deepEqual(falhas, [], falhas.join("\n"));
  const etiquetas = casos.map((c) => /^tags:\s*\[([^\]]*)\]/m.exec(ler(join(dir, c.name, "prompt.md")))?.[1] || "").join(",");
  for (const t of ["golden", "adversarial", "regressao"]) assert.match(etiquetas, new RegExp(t), `sem casos '${t}'`);
});

// ---------------- US-5 atualidade ----------------

test("T-314 SessionStart avisa numa linha quando o conteúdo está fora de prazo", async () => {
  const { mensagemSessionStart } = await hook();
  const projeto = tmp("jpt-atual-");
  mkdirSync(join(projeto, ".juridico-pt"));
  writeFileSync(join(projeto, ".juridico-pt", "perfil-empresa.md"), "forma_juridica: Lda\natualizado_em: 2026-09-01\n");
  const ok = mensagemSessionStart({ projeto, home: tmp("jpt-h-"), hoje: D("2026-10-03") });
  assert.doesNotMatch(ok, /desatualizad[oa]s?\b.*plugin|atualiza o plugin/i);
  const velho = mensagemSessionStart({ projeto, home: tmp("jpt-h-"), hoje: D("2027-03-01") });
  assert.match(velho, /atualiza(r)? o plugin|plugin desatualizado|conteúdo desatualizado/i);
  const semestre = mensagemSessionStart({ projeto, home: tmp("jpt-h-"), hoje: D("2027-01-20") });
  assert.match(semestre, /taxa de juros|juros de mora/i);
});

test("T-315 verificar_atualidade lista valores, taxas semestrais e tabelas com a data e o estado", async () => {
  const { verificarAtualidade } = await mod("atualidade.js");
  const hoje = verificarAtualidade({ hoje: D("2026-10-03") });
  assert.ok(hoje.length >= 3);
  for (const i of hoje) for (const k of ["item", "fonte", "ultimaAtualizacao", "proximaRevisao", "desatualizado"]) assert.ok(k in i, `${i.item}: sem ${k}`);
  assert.ok(hoje.some((i) => /juros/i.test(i.item)));
  assert.ok(hoje.some((i) => /valores/i.test(i.item)));
  assert.ok(hoje.every((i) => i.desatualizado === false), "em 3/10/2026 nada devia estar desatualizado");
  const depois = verificarAtualidade({ hoje: D("2027-03-01") });
  assert.ok(depois.some((i) => i.desatualizado));
  assert.match(ler(r("mcp-server", "src", "tools.ts")), /registerTool\(\s*"verificar_atualidade"/);
});

// ---------------- US-6 subagentes ----------------

test("T-317 os subagentes marcam 'não verificada' quando não acedem à fonte", () => {
  for (const a of ["verificador-citacoes", "revisor-contratos"]) {
    const t = ler(r("agents", `${a}.md`));
    assert.match(t, /não verificad[ao]/i, a);
  }
  assert.match(ler(r("agents", "verificador-citacoes.md")), /sem acesso|não (conseguires|consegue) aceder|indisponível/i);
});

// ---------------- US-7 contabilista ----------------

function projetoContabilista() {
  const projeto = tmp("jpt-contab-");
  mkdirSync(join(projeto, ".juridico-pt"));
  cpSync(r("mcp-server", "test", "fixtures", "contabilista", "perfis"), join(projeto, ".juridico-pt", "perfis"), { recursive: true });
  cpSync(r("mcp-server", "test", "fixtures", "contabilista", "prazos.md"), join(projeto, ".juridico-pt", "prazos.md"));
  return projeto;
}

test("T-318 painel_clientes: 10 perfis, próximos 30 dias, por data e perfil; sem perfis explica; CLI painel", async () => {
  const { painelClientes } = await mod("painel.js");
  const projeto = projetoContabilista();
  const p = painelClientes({ projeto, home: tmp("jpt-h-"), hoje: D("2026-10-03"), dias: 30 });
  assert.equal(p.perfis.length, 10);
  const datas = p.itens.map((i) => i.data);
  assert.deepEqual(datas, [...datas].sort(), "não está ordenado por data");
  assert.ok(datas.every((d) => d >= "2026-10-03" && d <= "2026-11-02"), "fora dos 30 dias");
  for (const n of p.perfis) assert.ok(p.itens.some((i) => i.perfil === n), `sem itens do perfil ${n}`);
  assert.ok(p.itens.some((i) => i.tipo === "prazo" && i.perfil === "padaria-sol" && i.data === "2026-10-10"));
  assert.ok(!p.itens.some((i) => i.data === "2026-12-15"), "incluiu um prazo fora da janela");
  const vazio = painelClientes({ projeto: tmp("jpt-vazio-"), home: tmp("jpt-h-"), hoje: D("2026-10-03") });
  assert.match(vazio.aviso || "", /perfis|guardar_perfil_empresa/i);
  assert.match(ler(r("mcp-server", "src", "tools.ts")), /registerTool\(\s*"painel_clientes"/);
  const cli = spawnSync(process.execPath, [r("cli", "juridico-pt.mjs"), "painel", "--dias", "30", "--dir", projeto], { encoding: "utf8", timeout: 10000 });
  assert.equal(cli.status, 0, cli.stderr);
  assert.match(cli.stdout, /padaria-sol/);
});

test("T-319 prazo associado a um perfil e .ics por perfil", async () => {
  const { registarPrazo, lerPrazos } = await mod("prazos-estado.js");
  const { exportarICS, gerarCalendario } = await mod("calendario.js");
  const projeto = tmp("jpt-pp-");
  registarPrazo({ data: "2026-11-20", descricao: "Oposição", perfil: "cliente-a" }, projeto);
  assert.match(ler(join(projeto, ".juridico-pt", "prazos.md")), /— perfil: cliente-a/);
  assert.equal(lerPrazos(projeto)[0].perfil, "cliente-a");
  const f = exportarICS(2026, gerarCalendario(2026, { forma_juridica: "Lda" }), projeto, D("2026-10-03"), "cliente-a");
  assert.match(f, /calendario-2026-cliente-a\.ics$/);
  assert.ok(existsSync(f));
});

test("T-320 campos novos do perfil; calendário com IMI, IUC e período de tributação diferente do ano civil", async () => {
  const { CAMPOS_PERFIL } = await mod("perfil.js");
  for (const c of ["cae", "concelho", "fim_periodo_tributacao", "imoveis", "viaturas", "setor_nis2", "vendas_b2c", "trabalhadores_estrangeiros", "emite_faturas"]) {
    assert.ok(CAMPOS_PERFIL.includes(c), `falta o campo ${c}`);
  }
  const { gerarCalendario } = await mod("calendario.js");
  const cal = gerarCalendario(2026, { forma_juridica: "Lda", regime_iva: "trimestral", imoveis: "sim", viaturas: "sim", fim_periodo_tributacao: "06-30" });
  assert.ok(cal.some((o) => /\bIMI\b/.test(o.titulo)), "sem IMI");
  assert.ok(cal.some((o) => /\bIUC\b/.test(o.titulo)), "sem IUC");
  const m22 = cal.find((o) => o.id === "modelo22");
  assert.ok(m22, "sem Modelo 22");
  assert.equal(m22.data, "2026-11-30");
  const civil = gerarCalendario(2026, { forma_juridica: "Lda", regime_iva: "trimestral" });
  assert.ok(!civil.some((o) => /\bIMI\b|\bIUC\b/.test(o.titulo)), "IMI/IUC sem imóveis nem viaturas");
});

// ---------------- US-8 templates ----------------

test("T-321 os 5 templates do dia a dia existem, no estilo da casa, indexados", () => {
  for (const n of ["convocatoria-assembleia-geral", "ata-aprovacao-contas", "procuracao", "carta-caducidade-contrato-termo", "resposta-livro-reclamacoes"]) {
    templateNoEstilo(n);
  }
});

test("T-322 placeholders: {{MAIUSCULAS_SEM_ACENTO}} em todos os templates e o mesmo nome para o mesmo dado", () => {
  const dir = SKILL("assets", "templates");
  const falhas = [];
  const SINONIMOS = { LOCALIDADE: "LOCAL", CIDADE: "LOCAL", DATA_ATUAL: "DATA", DATA_HOJE: "DATA", NIB: "IBAN" };
  for (const f of readdirSync(dir).filter((n) => n.endsWith(".md") && n !== "README.md")) {
    const t = ler(join(dir, f));
    for (const m of t.matchAll(/\{\{([^{}]*?)(?::[^{}]*)?\}\}/g)) {
      const nome = m[1].trim();
      if (!/^[A-Z0-9_]+$/.test(nome)) falhas.push(`${f}: {{${m[1].slice(0, 40)}}}`);
      else if (SINONIMOS[nome]) falhas.push(`${f}: {{${nome}}} devia ser {{${SINONIMOS[nome]}}}`);
    }
  }
  assert.equal(falhas.length, 0, `${falhas.length} placeholders fora da convenção:\n${falhas.slice(0, 40).join("\n")}`);
});

// ---------------- US-9 NIS2, fundos e contratação pública ----------------

test("T-323 checklist-nis2 com base no DL 125/2025", () => {
  existeIndexado("assets/checklists/checklist-nis2.md", ["SKILL.md"]);
  verificarFactos(["v20-nis2-"]);
});

test("T-324 referência fundos-europeus e playbook recebi-pedido-devolucao-apoio, com fonte", () => {
  existeIndexado("references/fundos-europeus.md", ["SKILL.md"]);
  existeIndexado("playbooks/recebi-pedido-devolucao-apoio.md", ["SKILL.md"]);
  verificarFactos(["v20-fundos-"]);
});

test("T-325 procedimento CCP: abaixo, igual e acima de cada limiar (DL 177/2026)", async () => {
  const { calcularProcedimentoCCP } = await mod("calculators/index.js");
  for (const c of FIX.ccp) {
    const r0 = calcularProcedimentoCCP(c.in);
    const ids = r0.admissiveis.map((a) => a.procedimento);
    for (const p of c.out.admissiveis) assert.ok(ids.includes(p), `${JSON.stringify(c.in)}: falta ${p}`);
    for (const p of ["ajuste-direto", "consulta-previa"]) {
      if (!c.out.admissiveis.includes(p)) assert.ok(!ids.includes(p), `${JSON.stringify(c.in)}: ${p} não devia ser admissível`);
    }
    assert.ok(r0.admissiveis.every((a) => /177\/2026|CCP/.test(a.base)), "procedimento sem base legal");
  }
  assert.throws(() => calcularProcedimentoCCP({ valor: -1, tipo: "bens-servicos" }), /valor/i);
  assert.match(ler(r("mcp-server", "src", "tools.ts")), /registerTool\(\s*"calc_procedimento_ccp"/);
  const cli = spawnSync(process.execPath, [r("cli", "juridico-pt.mjs"), "calc", "ccp", "--valor", "100000", "--tipo", "bens-servicos"], { encoding: "utf8", timeout: 10000 });
  assert.equal(cli.status, 0, cli.stderr);
  assert.match(cli.stdout, /consulta prévia/i);
});

test("T-327 playbook vender-ao-estado e os 4 templates de contratação pública", () => {
  existeIndexado("playbooks/vender-ao-estado.md", ["SKILL.md"]);
  for (const n of ["pedido-esclarecimentos-ccp", "lista-erros-omissoes-ccp", "pronuncia-audiencia-previa-ccp", "impugnacao-administrativa-ccp"]) {
    templateNoEstilo(n);
  }
  verificarFactos(["v20-ccp-"]);
});

// ---------------- US-10 formatos ----------------

function verificarZipComPython(ficheiro) {
  const prog = [
    "import sys, zipfile, json, xml.dom.minidom as m",
    "z = zipfile.ZipFile(sys.argv[1])",
    "bad = z.testzip()",
    "nomes = z.namelist()",
    "xmls = {n: z.read(n).decode('utf-8') for n in nomes if n.endswith('.xml') or n.endswith('.rels')}",
    "for n, x in xmls.items(): m.parseString(x)",
    "print(json.dumps({'bad': bad, 'nomes': nomes, 'doc': xmls.get('word/document.xml', '')}))",
  ].join("\n");
  const out = spawnSync(PY, ["-c", prog, ficheiro], { encoding: "utf8" });
  assert.equal(out.status, 0, out.stderr);
  return JSON.parse(out.stdout);
}

test("T-328 .docx válido: ZIP com CRC certo, XML bem formado, títulos, listas, negrito, caracteres especiais e sem 'Antes de enviar'", async () => {
  const { gerarDocx } = await mod("docx.js");
  const md = [
    "# Carta de interpelação",
    "",
    "Exmo. Senhor, a fatura **FT 2026/101** & a nota <urgente> de \"Ação\" — São João.",
    "",
    "## Factos",
    "- primeiro ponto",
    "- segundo ponto",
    "1. passo um",
    "2. passo dois",
    "",
    "## Antes de enviar — verificar",
    "- [ ] não deve aparecer no documento",
  ].join("\n");
  const bytes = gerarDocx(md);
  const f = join(tmp("jpt-docx-"), "t.docx");
  writeFileSync(f, bytes);
  const z = verificarZipComPython(f);
  assert.equal(z.bad, null, "CRC inválido");
  for (const n of ["[Content_Types].xml", "_rels/.rels", "word/document.xml"]) assert.ok(z.nomes.includes(n), `falta ${n}`);
  assert.match(z.doc, /<w:b\/>|<w:b /);
  assert.match(z.doc, /Heading1|Titulo1|Ttulo1/);
  assert.match(z.doc, /&amp;/);
  assert.match(z.doc, /&lt;urgente&gt;/);
  assert.match(z.doc, /São João/);
  assert.match(z.doc, /primeiro ponto/);
  assert.doesNotMatch(z.doc, /Antes de enviar|não deve aparecer/);
  assert.match(ler(r("mcp-server", "src", "tools.ts")), /registerTool\(\s*"exportar_documento"/);
});

test("T-329 sem perfil: formulário (elicitation) com listas fechadas; sem suporte, perguntas em texto", async () => {
  let pedido = null;
  const comForm = await comCliente(async (client) => textoDe(await client.callTool({ name: "calendario_obrigacoes", arguments: { ano: 2026 } })), {
    elicitation: async (req) => {
      pedido = req.params;
      return { action: "accept", content: { forma_juridica: "Lda", regime_iva: "trimestral", trabalhadores: 5 } };
    },
  });
  assert.ok(pedido, "o servidor não pediu o formulário");
  const props = pedido.requestedSchema.properties;
  assert.ok(Array.isArray(props.forma_juridica?.enum) || Array.isArray(props.forma_juridica?.oneOf), "forma_juridica sem lista fechada");
  assert.ok(Array.isArray(props.regime_iva?.enum) || Array.isArray(props.regime_iva?.oneOf), "regime_iva sem lista fechada");
  assert.match(comForm, /IVA/);
  const semForm = await comCliente(async (client) => textoDe(await client.callTool({ name: "calendario_obrigacoes", arguments: { ano: 2026 } })));
  assert.match(semForm, /Sem perfil da empresa|perfil da empresa/i);
  assert.match(semForm, /forma_juridica/);
});

test("T-330 o .mcpb gerado tem manifesto válido e o servidor arranca a partir dele", async () => {
  const out = tmp("jpt-mcpb-");
  const b = spawnSync(process.execPath, [r("mcp-server", "scripts", "build-mcpb.mjs"), "--out", out], { encoding: "utf8", timeout: 60000 });
  assert.equal(b.status, 0, b.stderr || b.stdout);
  const f = readdirSync(out).find((n) => n.endsWith(".mcpb"));
  assert.ok(f, "sem .mcpb");
  const z = verificarZipComPython(join(out, f));
  assert.equal(z.bad, null);
  assert.ok(z.nomes.includes("manifest.json") && z.nomes.includes("server/index.js") && z.nomes.includes("package.json"));
  assert.ok(z.nomes.some((n) => n.startsWith("content/references/")), "sem o conteúdo jurídico");
  const ext = tmp("jpt-mcpb-x-");
  const x = spawnSync(PY, ["-c", "import sys, zipfile; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])", join(out, f), ext], { encoding: "utf8" });
  assert.equal(x.status, 0, x.stderr);
  const man = JSON.parse(ler(join(ext, "manifest.json")));
  assert.equal(man.manifest_version, "0.3");
  assert.equal(man.name, "juridico-pt");
  assert.equal(man.server.type, "node");
  assert.equal(man.server.entry_point, "server/index.js");
  assert.deepEqual(man.server.mcp_config.args, ["${__dirname}/server/index.js"]);
  const transport = new StdioClientTransport({ command: process.execPath, args: [join(ext, "server", "index.js")], cwd: tmp("jpt-mcpb-c-"), stderr: "pipe" });
  const client = new Client({ name: "mcpb", version: "1" });
  await client.connect(transport);
  try {
    const { tools } = await client.listTools();
    assert.ok(tools.some((t) => t.name === "calc_juros_mora"));
    const ref = await client.callTool({ name: "ler_referencia", arguments: { nome: "cobrancas" } });
    assert.match(textoDe(ref), /Injunção/);
  } finally {
    await client.close();
  }
});

// ---------------- US-11 privacidade e custo ----------------

test("T-331 repositório git sem a exclusão: aviso; com acrescentar_gitignore a linha entra uma só vez", async () => {
  const { guardarPerfil } = await mod("perfil.js");
  const projeto = tmp("jpt-git-");
  mkdirSync(join(projeto, ".git"));
  const a = guardarPerfil({ forma_juridica: "Lda" }, "projeto", { projeto });
  assert.match(a.avisoGitignore || "", /\.gitignore/);
  guardarPerfil({ setor: "comércio" }, "projeto", { projeto, acrescentarGitignore: true });
  guardarPerfil({ setor: "comércio" }, "projeto", { projeto, acrescentarGitignore: true });
  const gi = ler(join(projeto, ".gitignore"));
  assert.equal((gi.match(/^\.juridico-pt\/$/gm) || []).length, 1);
  const b = guardarPerfil({ setor: "serviços" }, "projeto", { projeto });
  assert.ok(!b.avisoGitignore, "voltou a avisar depois da exclusão");
});

test("T-332 apagar_perfil apaga o perfil e os prazos dele, repõe o perfil ativo e recusa nomes inválidos e links", async () => {
  const { guardarPerfil, ativarPerfil, apagarPerfil, listarPerfis } = await mod("perfil.js");
  const { registarPrazo, lerPrazos } = await mod("prazos-estado.js");
  const projeto = tmp("jpt-apagar-");
  guardarPerfil({ forma_juridica: "Lda" }, "projeto", { projeto, perfil: "cliente-a" });
  guardarPerfil({ forma_juridica: "ENI" }, "projeto", { projeto, perfil: "cliente-b" });
  ativarPerfil("cliente-a", "projeto", { projeto });
  registarPrazo({ data: "2026-11-20", descricao: "A", perfil: "cliente-a" }, projeto);
  registarPrazo({ data: "2026-11-21", descricao: "B", perfil: "cliente-b" }, projeto);
  const res = apagarPerfil("cliente-a", "projeto", { projeto });
  assert.ok(res.apagados.length >= 2, "devia listar o perfil e o prazo apagados");
  assert.ok(!existsSync(join(projeto, ".juridico-pt", "perfis", "cliente-a.md")));
  assert.deepEqual(lerPrazos(projeto).map((p) => p.perfil), ["cliente-b"]);
  assert.ok(!existsSync(join(projeto, ".juridico-pt", "perfil-ativo")), "o perfil ativo apagado devia ser reposto");
  assert.deepEqual(listarPerfis({ projeto, home: tmp("jpt-h-") }).map((p) => p.nome), ["cliente-b"]);
  assert.throws(() => apagarPerfil("../perfil-empresa", "projeto", { projeto }), /inválido/i);
  const outro = tmp("jpt-apagar-j-");
  const vitima = tmp("jpt-vitima-");
  writeFileSync(join(vitima, "cliente-x.md"), "VITIMA\n");
  mkdirSync(join(outro, ".juridico-pt"));
  symlinkSync(vitima, join(outro, ".juridico-pt", "perfis"), "junction");
  assert.throws(() => apagarPerfil("cliente-x", "projeto", { projeto: outro }), /liga[çc][ãa]o|link|junction/i);
  assert.equal(ler(join(vitima, "cliente-x.md")), "VITIMA\n");
  assert.match(ler(r("mcp-server", "src", "tools.ts")), /registerTool\(\s*"apagar_perfil"/);
});

test("T-333 (propriedade) num projeto sem .juridico-pt/, o SessionStart é uma linha com até 200 caracteres", async () => {
  const { mensagemSessionStart } = await hook();
  for (let i = 0; i < 10; i++) {
    const m = mensagemSessionStart({ projeto: tmp("jpt-vazio-"), home: tmp("jpt-h-"), hoje: D("2026-10-03") });
    assert.ok(m.length <= 200, `${m.length} caracteres`);
    assert.doesNotMatch(m, /[\r\n]/);
    assert.match(m, /juridico-pt|Jurídico PT/i);
  }
});

test("T-334 README e privacidade-plugin dizem que dados, onde, por quanto tempo e o papel do fornecedor do modelo", () => {
  existeIndexado("references/privacidade-plugin.md", ["SKILL.md"]);
  verificarFactos(["v20-priv-"]);
  const readme = ler(r("README.md"));
  assert.match(readme, /\.juridico-pt\//);
  assert.match(readme, /12 meses/);
  assert.match(readme, /fornecedor do modelo/i);
});

test("T-335 prazos cumpridos há mais de 12 meses saem na escrita seguinte; perfil antigo é assinalado e não apagado", async () => {
  const { registarPrazo } = await mod("prazos-estado.js");
  const { lerPerfil } = await mod("perfil.js");
  const projeto = tmp("jpt-conserv-");
  mkdirSync(join(projeto, ".juridico-pt"));
  const recente = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  writeFileSync(join(projeto, ".juridico-pt", "prazos.md"), `- [x] 2024-01-10 — Antigo cumprido\n- [x] ${recente} — Recente cumprido\n- [ ] 2024-02-01 — Antigo por cumprir\n`);
  registarPrazo({ data: "2026-12-01", descricao: "Novo" }, projeto);
  const t = ler(join(projeto, ".juridico-pt", "prazos.md"));
  assert.doesNotMatch(t, /Antigo cumprido/);
  assert.match(t, /Recente cumprido/);
  assert.match(t, /Antigo por cumprir/, "um prazo em aberto nunca sai");
  writeFileSync(join(projeto, ".juridico-pt", "perfil-empresa.md"), "forma_juridica: Lda\natualizado_em: 2024-01-01\n");
  const p = lerPerfil({ projeto, home: tmp("jpt-h-"), hoje: D("2026-10-03") });
  assert.equal(p.desatualizado, true);
  assert.ok(existsSync(join(projeto, ".juridico-pt", "perfil-empresa.md")));
});

test("T-339 SessionStart com perfil, prazos e verificação de atualidade em menos de 300 ms", async () => {
  const { mensagemSessionStart } = await hook();
  const projeto = projetoContabilista();
  writeFileSync(join(projeto, ".juridico-pt", "perfil-empresa.md"), "forma_juridica: Lda\natualizado_em: 2026-09-01\n");
  mensagemSessionStart({ projeto, home: tmp("jpt-h-"), hoje: D("2026-10-03") });
  const t0 = performance.now();
  mensagemSessionStart({ projeto, home: tmp("jpt-h-"), hoje: D("2027-03-01") });
  assert.ok(performance.now() - t0 < 300);
});

test("T-340 todos os itens dos quatro grupos existem, estão indexados e têm teste", () => {
  const tools = ler(r("mcp-server", "src", "tools.ts"));
  for (const t of ["calc_juros_lote", "calc_procedimento_ccp", "painel_clientes", "verificar_atualidade", "exportar_documento", "apagar_perfil"]) {
    assert.match(tools, new RegExp(`registerTool\\(\\s*"${t}"`), `tool ${t}`);
  }
  for (const c of ["faturacao", "painel", "exportar"]) assert.ok(existsSync(r("commands", `${c}.md`)), `command /${c}`);
  for (const a of ["verificador-citacoes", "revisor-contratos"]) assert.ok(existsSync(r("agents", `${a}.md`)), `agent ${a}`);
  const skill = ler(SKILL("SKILL.md"));
  for (const n of ["faturacao", "fundos-europeus", "privacidade-plugin", "faturacao-eletronica-2027", "recebi-pedido-devolucao-apoio", "vender-ao-estado", "checklist-nis2", "checklist-faturacao", "calc_juros_lote", "calc_procedimento_ccp", "painel_clientes", "exportar_documento"]) {
    assert.ok(skill.includes(n), `SKILL.md sem ${n}`);
  }
  assert.ok(existsSync(r("evals")), "sem evals/");
  assert.ok(existsSync(r("mcp-server", "scripts", "build-mcpb.mjs")), "sem build-mcpb.mjs");
});
