/**
 * Testes da v1.2 (advogado-pt v1.2 operacional) — T-101 a T-135.
 * Importa a versão COMPILADA (`../dist/`); `npm test` compila antes.
 * Valores de referência calculados à mão a partir das fontes oficiais (ver
 * .specs/advogado-pt-v1-2-operacional/test-plan.md).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import {
  calcularSalarioLiquido,
  calcularCustoTrabalhador,
  calcularIRC,
  calcularTaxaJustica,
  decidirIVA,
  calcularCompensacao,
  calcularCompensacaoPorDatas,
} from "../dist/calculators/index.js";
import { gerarCalendario, paraICS } from "../dist/calendario.js";
import { lerPrazos, registarPrazo, concluirPrazo, prazosProximos } from "../dist/prazos-estado.js";
import { lerPerfil, guardarPerfil, listarPerfis, ativarPerfil } from "../dist/perfil.js";
import { mensagemSessionStart } from "../../hooks/advogado-hook.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", "..");
const r = (...p) => resolve(repo, ...p);
const SKILL = (...p) => r("skills", "advogado-pt", ...p);
const lerMd = (p) => readFileSync(p, "utf8");
const CLI = r("cli", "advogado-pt.mjs");
const quase = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) < tol, `esperado ${b}, obtido ${a}`);
const D = (s) => new Date(`${s}T00:00:00Z`);
const HOJE = D("2026-10-03");
const tmp = (p) => mkdtempSync(join(tmpdir(), p));

const LDA = { forma_juridica: "Lda", regime_iva: "trimestral", trabalhadores: "12", contabilidade: "organizada" };
const FERIADOS_2026 = new Set([
  "2026-01-01", "2026-04-03", "2026-04-05", "2026-04-25", "2026-05-01", "2026-06-04", "2026-06-10",
  "2026-08-15", "2026-10-05", "2026-11-01", "2026-12-01", "2026-12-08", "2026-12-25",
]);
const diaUtil = (iso) => {
  const d = D(iso).getUTCDay();
  return d !== 0 && d !== 6 && !FERIADOS_2026.has(iso);
};

function indexados(nomes, readmeRel) {
  const idx = lerMd(SKILL(...readmeRel));
  return nomes.filter((n) => !idx.includes(`${n}.md`));
}
function existem(lista) {
  return lista.filter(([dir, n]) => !existsSync(SKILL(...dir, `${n}.md`))).map(([, n]) => n);
}

// ---------------- US-1 ----------------

test("T-101 marcas [VERIFICAR — valores-2026] resolvidas (≤ 3, cada uma com fonte) e valores registados", () => {
  const restos = [];
  const walk = (dir) => {
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name.endsWith(".md")) {
        lerMd(p).split("\n").forEach((l, i) => {
          if (l.includes("[VERIFICAR — valores-2026]")) restos.push(`${p}:${i + 1}: ${l.trim()}`);
        });
      }
    }
  };
  walk(SKILL());
  assert.ok(restos.length <= 3, `marcas restantes (${restos.length}):\n${restos.join("\n")}`);
  for (const l of restos) assert.match(l, /confirmar em|fonte:|https?:\/\//i, `marca sem fonte: ${l}`);
  const v = lerMd(SKILL("references", "valores-2026.md"));
  for (const s of ["151,98", "7.500 €", "0,5%", "7,221%", "25,50 €", "60.000 €", "1,00 €"]) {
    assert.ok(v.includes(s), `valores-2026.md sem '${s}'`);
  }
});

test("T-102 doutrina: posição recomendada, fonte e grau de certeza nos 4 pontos", () => {
  const casos = [
    [SKILL("assets", "templates", "contrato-desenvolvimento-software.md"), /252\/94/],
    [SKILL("assets", "templates", "decisao-socio-unico.md"), /297\.º/],
    [SKILL("assets", "checklists", "checklist-loja-online.md"), /2023\/2673/],
    [SKILL("assets", "templates", "pacto-nao-concorrencia.md"), /determin[áa]vel/],
  ];
  for (const [p, re] of casos) {
    const t = lerMd(p);
    assert.match(t, /Posição recomendada/i, `${p}: sem 'Posição recomendada'`);
    assert.match(t, /Grau de certeza/i, `${p}: sem 'Grau de certeza'`);
    assert.match(t, re, `${p}: sem a referência esperada`);
  }
});

test("T-135 compensação = simulador oficial da ACT (regime transitório, tetos, sem mínimo de 3 meses)", () => {
  const c = (rb, adm, ces) => calcularCompensacaoPorDatas({ retribuicaoBase: rb, dataAdmissao: D(adm), dataCessacao: D(ces), modalidade: "sem-termo", rmmg: 920 });
  quase(c(1500, "2015-05-01", "2024-04-30").total, 5500);
  quase(c(1500, "2010-01-01", "2025-12-31").total, 12783.33);
  const m = c(1500, "2011-10-31", "2013-01-31");
  quase(m.total, 4500);
  assert.equal(m.minimoAplicado, true);
  const s = c(1500, "2025-01-01", "2025-03-31");
  quase(s.total, 175);
  assert.equal(s.minimoAplicado, false);
  const t = c(2000, "2000-12-01", "2025-12-31");
  quase(t.total, 24000);
  assert.equal(t.tetoAplicado, true);
  quase(c(2000, "1995-01-01", "2025-12-31").total, 35666.67);
  quase(c(25000, "2014-01-01", "2025-12-31").total, 91591.11);
  quase(c(25000, "2005-11-01", "2025-12-31").total, 220800);
  quase(c(1500, "2025-01-01", "2025-03-15").total, 145.83);
  const a = calcularCompensacao(1500, 0, 4, "sem-termo");
  quase(a.bruto, 2800);
  assert.equal(a.minimoAplicado, false);
  assert.equal(calcularCompensacao(1500, 0, 4, "extincao-posto").diasAno, 14);
});

// ---------------- US-2 / US-4 calendário ----------------

test("T-103 calendário 2026 de uma Lda (IVA trimestral, 12 trabalhadores): ≥ 15 obrigações com base legal", () => {
  const cal = gerarCalendario(2026, LDA);
  assert.ok(cal.length >= 15, `só ${cal.length} obrigações`);
  for (const o of cal) assert.ok(o.base && o.base.length > 3, `${o.id} sem base legal`);
  const ids = new Set(cal.map((o) => o.id));
  for (const id of ["iva_dp_trimestral", "dmr_at", "modelo22", "ies", "csc_aprovacao_contas", "relatorio_unico", "mapa_ferias", "rcbe_confirmacao_anual", "ss_pagamento_tco"]) {
    assert.ok(ids.has(id), `falta ${id}`);
  }
});

test("T-104 transferência de datas, férias fiscais, IVA de junho e Modelo 22 sem transferência", () => {
  const cal = gerarCalendario(2026, { ...LDA, regime_iva: "mensal" });
  const dmrJan = cal.find((o) => o.id === "dmr_at" && o.data.startsWith("2026-01"));
  assert.equal(dmrJan.data, "2026-01-12");
  assert.equal(dmrJan.dataOriginal, "2026-01-10");
  const ivaSet = cal.filter((o) => o.id === "iva_dp_mensal" && o.data.startsWith("2026-09"));
  assert.ok(ivaSet.some((o) => o.data === "2026-09-21"), "IVA de junho/julho em 21/9");
  assert.ok(!cal.some((o) => o.id === "iva_dp_mensal" && o.data.startsWith("2026-08")), "sem IVA mensal em agosto");
  assert.ok(cal.some((o) => o.id === "efatura_comunicacao" && o.data === "2026-08-31"), "e-fatura de agosto em 31/8");
  const m22 = cal.find((o) => o.id === "modelo22");
  assert.equal(m22.data, "2026-06-30");
  assert.equal(m22.dataOriginal, "2026-05-31");
  assert.match(m22.nota || "", /81\/2026/);
  assert.equal(cal.find((o) => o.id === "ies").data, "2026-07-15");
  for (const o of cal.filter((x) => x.transferivel)) assert.ok(diaUtil(o.data), `${o.id} em dia não útil: ${o.data}`);
});

test("T-105 ENI isento (art. 53.º) sem trabalhadores: sem IVA periódico nem DMR; com Modelo 3", () => {
  const cal = gerarCalendario(2026, { forma_juridica: "ENI", regime_iva: "isento art. 53", trabalhadores: "0", contabilidade: "simplificado" });
  const ids = new Set(cal.map((o) => o.id));
  assert.ok(!ids.has("iva_dp_trimestral") && !ids.has("iva_dp_mensal"), "não deve ter declaração periódica de IVA");
  assert.ok(!ids.has("dmr_at"), "não deve ter DMR");
  assert.ok(ids.has("irs_modelo3"), "deve ter Modelo 3");
  assert.ok(!ids.has("modelo22"), "ENI não entrega Modelo 22");
});

test("T-106 sem perfil: obrigações marcadas a confirmar com os campos em falta", () => {
  const cal = gerarCalendario(2026, null);
  assert.ok(cal.length > 0);
  const ac = cal.filter((o) => o.aConfirmar);
  assert.ok(ac.length > 0);
  assert.ok(ac.some((o) => o.camposEmFalta.includes("forma_juridica")));
});

test("T-107 iCalendar válido (RFC 5545)", () => {
  const cal = gerarCalendario(2026, LDA);
  const ics = paraICS(cal, { hoje: HOJE });
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
  assert.ok(ics.trimEnd().endsWith("END:VCALENDAR"));
  assert.match(ics, /\r\nVERSION:2\.0\r\n/);
  assert.match(ics, /\r\nPRODID:/);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, cal.length);
  for (const l of ics.split("\r\n")) assert.ok(Buffer.byteLength(l, "utf8") <= 75, `linha > 75 octetos: ${l}`);
  assert.ok(!/[^\r]\n/.test(ics), "só CRLF");
  const uid = ics.match(/UID:[^\r]+/)[0];
  assert.equal(paraICS(cal, { hoje: HOJE }).match(/UID:[^\r]+/)[0], uid, "UID estável");
  const desc = paraICS([{ ...cal[0], titulo: "A, B; C" }], { hoje: HOJE });
  assert.match(desc, /SUMMARY:[^\r]*A\\, B\\; C/);
});

test("T-108 tool calendario_obrigacoes + CLI calendario (texto e .ics)", () => {
  const src = lerMd(r("mcp-server", "src", "tools.ts"));
  assert.match(src, /registerTool\(\s*"calendario_obrigacoes"/);
  const dir = tmp("adv-cal-");
  mkdirSync(join(dir, ".advogado-pt"));
  writeFileSync(join(dir, ".advogado-pt", "perfil-empresa.md"), "forma_juridica: Lda\nregime_iva: trimestral\ntrabalhadores: 12\ncontabilidade: organizada\natualizado_em: 2026-09-01\n");
  const out = spawnSync(process.execPath, [CLI, "calendario", "--ano", "2026", "--dir", dir], { encoding: "utf8" });
  assert.equal(out.status, 0, out.stderr);
  assert.match(out.stdout, /Modelo 22/);
  const ics = spawnSync(process.execPath, [CLI, "calendario", "--ano", "2026", "--dir", dir, "--ics"], { encoding: "utf8" });
  assert.equal(ics.status, 0, ics.stderr);
  assert.ok(existsSync(join(dir, ".advogado-pt", "calendario-2026.ics")));
});

test("T-113 RGPC no calendário só a partir de 50 trabalhadores", () => {
  const com = gerarCalendario(2026, { ...LDA, trabalhadores: "60" });
  const sem = gerarCalendario(2026, LDA);
  assert.ok(com.some((o) => o.id.startsWith("rgpc_")), "60 trabalhadores: deve ter RGPC");
  assert.ok(!sem.some((o) => o.id.startsWith("rgpc_")), "12 trabalhadores: não deve ter RGPC");
});

// ---------------- US-3 prazos ----------------

test("T-109 registar, listar e concluir prazos em .advogado-pt/prazos.md", () => {
  const dir = tmp("adv-prz-");
  registarPrazo({ data: "2026-10-20", descricao: "Oposição à execução fiscal", origem: "art. 203.º CPPT" }, dir);
  registarPrazo({ data: "2026-10-06", descricao: "Resposta à audição prévia" }, dir);
  const p = lerPrazos(dir);
  assert.equal(p.length, 2);
  assert.ok(existsSync(join(dir, ".advogado-pt", "prazos.md")));
  assert.equal(concluirPrazo("2026-10-06", "Resposta à audição prévia", dir), true);
  assert.equal(lerPrazos(dir).filter((x) => x.concluido).length, 1);
  assert.throws(() => registarPrazo({ data: "20/10/2026", descricao: "x" }, dir), /data/i);
});

test("T-110 prazos próximos e vencidos", () => {
  const prazos = [
    { data: "2026-10-01", descricao: "vencido", concluido: false },
    { data: "2026-10-06", descricao: "a 3 dias", concluido: false },
    { data: "2026-10-20", descricao: "longe", concluido: false },
    { data: "2026-10-04", descricao: "feito", concluido: true },
  ];
  const r1 = prazosProximos(prazos, HOJE, 7);
  assert.deepEqual(r1.vencidos.map((x) => x.descricao), ["vencido"]);
  assert.deepEqual(r1.proximos.map((x) => [x.descricao, x.faltam]), [["a 3 dias", 3]]);
});

test("T-111 hook avisa prazos; ficheiro ilegível não rebenta", () => {
  const projeto = tmp("adv-hpz-");
  const home = tmp("adv-hhm-");
  mkdirSync(join(projeto, ".advogado-pt"));
  writeFileSync(join(projeto, ".advogado-pt", "prazos.md"), "- [ ] 2026-10-01 — Recurso de coima\n- [ ] 2026-10-06 — Audição prévia AT\n");
  const m = mensagemSessionStart({ projeto, home, hoje: HOJE });
  assert.match(m, /vencid/i);
  assert.match(m, /faltam 3 dias/i);
  const lixo = tmp("adv-hlx-");
  mkdirSync(join(lixo, ".advogado-pt"));
  writeFileSync(join(lixo, ".advogado-pt", "prazos.md"), Buffer.from([0, 255, 1, 2]));
  assert.doesNotThrow(() => mensagemSessionStart({ projeto: lixo, home, hoje: HOJE }));
});

// ---------------- US-5 empregador ----------------

test("T-115 salário líquido 2026 (Despacho 233-A/2026)", () => {
  const s = (bruto, tabela, dependentes, extra = {}) => calcularSalarioLiquido({ bruto, tabela, dependentes, ...extra });
  const a = s(1500, "I", 0);
  quase(a.retencaoIRS, 168.17);
  quase(a.segurancaSocial, 165);
  quase(a.liquido, 1166.83);
  quase(s(1000, "I", 0).retencaoIRS, 36.0);
  quase(s(900, "I", 0).retencaoIRS, 0);
  quase(s(2000, "III", 2).retencaoIRS, 88.35);
  quase(s(2000, "II", 3).retencaoIRS, 178.47);
  const n = s(1500, "I", 0, { subsidioRefeicaoDia: 8, diasRefeicao: 22 });
  quase(n.refeicaoTributavel, 40.7);
  quase(n.liquido, 1328.54);
  const c = s(1500, "I", 0, { subsidioRefeicaoDia: 10, diasRefeicao: 22, refeicaoCartao: true });
  quase(c.refeicaoTributavel, 0);
  quase(c.liquido, 1386.83);
});

test("T-116 custo do trabalhador para a empresa", () => {
  const c = calcularCustoTrabalhador({ base: 1500, subsidioRefeicaoDia: 6, diasRefeicaoMes: 22, mesesRefeicao: 11, taxaSeguroAT: 0.01 });
  quase(c.retribuicaoAnual, 21000);
  quase(c.tsuAnual, 4987.5);
  quase(c.refeicaoAnual, 1452);
  quase(c.seguroAnual, 210);
  quase(c.total, 27649.5);
  quase(c.mensalMedio, 2304.13);
  const e = calcularCustoTrabalhador({ base: 1500, subsidioRefeicaoDia: 8, diasRefeicaoMes: 22, mesesRefeicao: 11, taxaSeguroAT: 0.01 });
  quase(e.tsuAnual, 5093.83);
  quase(e.total, 28239.83);
});

test("T-117 erros do salário e do custo nomeiam o campo", () => {
  assert.throws(() => calcularSalarioLiquido({ bruto: -1, tabela: "I", dependentes: 0 }), /bruto|vencimento/i);
  assert.throws(() => calcularSalarioLiquido({ bruto: 1000, tabela: "I", dependentes: -1 }), /dependentes/i);
  assert.throws(() => calcularSalarioLiquido({ bruto: 1000, tabela: "IX", dependentes: 0 }), /tabela/i);
  assert.throws(() => calcularCustoTrabalhador({ base: -5 }), /base/i);
});

// ---------------- US-6 fisco ----------------

test("T-118 IRC 2026: PME, não PME e derrama estadual", () => {
  const p = calcularIRC({ lucroTributavel: 100000, pme: true, derramaMunicipal: 0.015, despesasRepresentacao: 2000, viaturas: [{ custoAquisicao: 30000, tipo: "combustao", encargos: 5000 }] });
  quase(p.irc, 17000);
  quase(p.derramaMunicipal, 1500);
  quase(p.derramaEstadual, 0);
  quase(p.tributacaoAutonoma, 600);
  quase(p.total, 19100);
  const n = calcularIRC({ lucroTributavel: 2000000, pme: false, derramaMunicipal: 0.015 });
  quase(n.total, 425000);
  quase(calcularIRC({ lucroTributavel: 40e6, pme: false, derramaMunicipal: 0 }).derramaEstadual, 2005000);
  const ev = calcularIRC({ lucroTributavel: 10000, pme: true, derramaMunicipal: 0, viaturas: [{ custoAquisicao: 50000, tipo: "eletrico", encargos: 4000 }, { custoAquisicao: 30000, tipo: "phev", encargos: 5000 }] });
  quase(ev.tributacaoAutonoma, 125);
});

test("T-119 IRC com prejuízos (65%) e com prejuízo do ano (agravamento da TA)", () => {
  const p = calcularIRC({ lucroTributavel: 100000, prejuizosDedutiveis: 80000, pme: true, derramaMunicipal: 0.015 });
  quase(p.deducaoPrejuizos, 65000);
  quase(p.materiaColetavel, 35000);
  quase(p.irc, 5250);
  const q = calcularIRC({ lucroTributavel: -50000, pme: true, derramaMunicipal: 0.015, despesasRepresentacao: 1000 });
  quase(q.irc, 0);
  quase(q.derramaMunicipal, 0);
  quase(q.tributacaoAutonoma, 200);
  quase(calcularIRC({ lucroTributavel: -50000, pme: true, derramaMunicipal: 0.015, despesasRepresentacao: 1000, isentoAgravamento: true }).tributacaoAutonoma, 100);
});

test("T-120 decisor de IVA em operações internacionais", () => {
  const s = decidirIVA({ tipo: "servicos", cliente: "empresa", destino: "UE" });
  assert.equal(s.codigo, "M40");
  assert.equal(s.mencaoFatura, "IVA - autoliquidação");
  assert.ok(s.declaracoes.some((d) => /recapitulativa/i.test(d)));
  const b = decidirIVA({ tipo: "bens", cliente: "empresa", destino: "UE", nifVIES: true });
  assert.equal(b.codigo, "M16");
  assert.equal(b.mencaoFatura, "Isento artigo 14.º do RITI");
  const sv = decidirIVA({ tipo: "bens", cliente: "empresa", destino: "UE", nifVIES: false });
  assert.match(sv.liquida, /fornecedor/i);
  assert.equal(sv.codigo, null);
  const oss = decidirIVA({ tipo: "bens", cliente: "consumidor", destino: "UE", vendasDistanciaUE: 15000 });
  assert.match(oss.tributacao, /Estado-Membro/i);
  assert.ok(oss.declaracoes.some((d) => /OSS/.test(d)));
  const pt = decidirIVA({ tipo: "bens", cliente: "consumidor", destino: "UE", vendasDistanciaUE: 5000 });
  assert.match(pt.tributacao, /Portugal/i);
  assert.equal(decidirIVA({ tipo: "bens", cliente: "empresa", destino: "fora-UE" }).codigo, "M05");
  assert.equal(decidirIVA({ tipo: "bens", cliente: "empresa", destino: "UE", nifVIES: true, regime53: true }).codigo, "M10");
});

// ---------------- US-8 taxa de justiça ----------------

test("T-124 taxa de justiça (RCP, Tabela I-A; UC 102 €)", () => {
  const t = (v, o) => calcularTaxaJustica(v, o);
  assert.equal(t(1500).totalUC, 1);
  quase(t(1500).totalEuros, 102);
  quase(t(30000).totalEuros, 510);
  const g = t(300000);
  assert.equal(g.taxaInicialUC, 16);
  assert.equal(g.remanescenteUC, 3);
  assert.equal(g.totalUC, 19);
  quase(g.totalEuros, 1938);
  assert.equal(t(310000).totalUC, 22);
  quase(t(30000, { reducaoEletronica: true }).taxaInicialEuros, 459);
});

// ---------------- US-11 perfis ----------------

test("T-127 perfis nomeados: gravar, listar, ativar e ler o ativo", () => {
  const projeto = tmp("adv-pf-");
  const home = tmp("adv-pfh-");
  guardarPerfil({ forma_juridica: "Lda", setor: "Restauração" }, "projeto", { projeto, home, hoje: HOJE, perfil: "cliente-a" });
  guardarPerfil({ forma_juridica: "ENI", setor: "Consultoria" }, "projeto", { projeto, home, hoje: HOJE, perfil: "cliente-b" });
  assert.ok(existsSync(join(projeto, ".advogado-pt", "perfis", "cliente-a.md")));
  ativarPerfil("cliente-b", "projeto", { projeto, home });
  const lst = listarPerfis({ projeto, home });
  assert.deepEqual(lst.map((p) => [p.nome, p.ativo]).sort(), [["cliente-a", false], ["cliente-b", true]]);
  assert.equal(lerPerfil({ projeto, home, hoje: HOJE }).campos.setor, "Consultoria");
  assert.equal(lerPerfil({ projeto, home, hoje: HOJE, perfil: "cliente-a" }).campos.setor, "Restauração");
  assert.throws(() => ativarPerfil("../fora", "projeto", { projeto, home }), /nome/i);
});

test("T-128 perfil ativo inexistente -> perfil por defeito e aviso", () => {
  const projeto = tmp("adv-pf2-");
  const home = tmp("adv-pf2h-");
  mkdirSync(join(projeto, ".advogado-pt"));
  writeFileSync(join(projeto, ".advogado-pt", "perfil-empresa.md"), "forma_juridica: SA\natualizado_em: 2026-09-01\n");
  writeFileSync(join(projeto, ".advogado-pt", "perfil-ativo"), "nao-existe\n");
  const p = lerPerfil({ projeto, home, hoje: HOJE });
  assert.equal(p.campos.forma_juridica, "SA");
  assert.match(p.aviso || "", /nao-existe/);
});

test("T-129 hook mostra o perfil ativo", () => {
  const projeto = tmp("adv-pf3-");
  const home = tmp("adv-pf3h-");
  guardarPerfil({ forma_juridica: "Lda", setor: "Construção" }, "projeto", { projeto, home, hoje: HOJE, perfil: "obra-x" });
  ativarPerfil("obra-x", "projeto", { projeto, home });
  const m = mensagemSessionStart({ projeto, home, hoje: HOJE });
  assert.match(m, /obra-x/);
  assert.match(m, /Constru/);
});

// ---------------- Conteúdo (US-4..US-10) ----------------

const NOVO = {
  refs: ["compliance", "iva-internacional", "licenciamento-setorial"],
  tpls: [
    "plano-prevencao-riscos-corrupcao", "regulamento-canal-denuncias", "regulamento-interno", "politica-registo-tempos-trabalho",
    "contrato-agencia", "contrato-distribuicao", "contrato-franquia", "contrato-saas-b2b", "acordo-parassocial",
    "contrato-cessao-quotas", "contrato-arrendamento-nao-habitacional", "contrato-trespasse", "oposicao-injuncao",
    "oposicao-execucao", "politica-uso-ia", "politica-videovigilancia", "politica-monitorizacao-trabalhadores",
  ],
  chks: ["checklist-compliance-dimensao", "checklist-seguranca-saude-trabalho"],
  pbs: ["lay-off", "despedimento-coletivo", "faturar-cliente-estrangeiro", "dissolucao-liquidacao"],
};

function conteudoOk(refs, tpls, chks, pbs) {
  const faltas = [
    ...existem(refs.map((n) => [["references"], n])),
    ...existem(tpls.map((n) => [["assets", "templates"], n])),
    ...existem(chks.map((n) => [["assets", "checklists"], n])),
    ...existem(pbs.map((n) => [["playbooks"], n])),
  ].map((n) => `não existe: ${n}`);
  faltas.push(...indexados(tpls, ["assets", "templates", "README.md"]).map((n) => `sem índice: ${n}`));
  faltas.push(...indexados(chks, ["assets", "checklists", "README.md"]).map((n) => `sem índice: ${n}`));
  faltas.push(...indexados(pbs, ["playbooks", "README.md"]).map((n) => `sem índice: ${n}`));
  const skill = lerMd(SKILL("SKILL.md"));
  for (const n of refs) if (!skill.includes(`references/${n}.md`)) faltas.push(`SKILL.md sem references/${n}.md`);
  assert.equal(faltas.length, 0, faltas.join("\n"));
}

test("T-112 compliance: referência, PPR, canal de denúncias e checklist", () => {
  conteudoOk(["compliance"], ["plano-prevencao-riscos-corrupcao", "regulamento-canal-denuncias"], ["checklist-compliance-dimensao"], []);
});
test("T-114 empregador: regulamento interno, registo de tempos, SST, lay-off e despedimento coletivo", () => {
  conteudoOk([], ["regulamento-interno", "politica-registo-tempos-trabalho"], ["checklist-seguranca-saude-trabalho"], ["lay-off", "despedimento-coletivo"]);
});
test("T-121 IVA internacional: referência e playbook", () => {
  conteudoOk(["iva-internacional"], [], [], ["faturar-cliente-estrangeiro"]);
});
test("T-122 contratos e societário: 8 templates e playbook de dissolução", () => {
  conteudoOk([], ["contrato-agencia", "contrato-distribuicao", "contrato-franquia", "contrato-saas-b2b", "acordo-parassocial", "contrato-cessao-quotas", "contrato-arrendamento-nao-habitacional", "contrato-trespasse"], [], ["dissolucao-liquidacao"]);
  assert.match(lerMd(SKILL("assets", "templates", "contrato-agencia.md")), /indemniza[çc][ãa]o de clientela/i);
});
test("T-123 tribunais: oposição à injunção e à execução", () => {
  conteudoOk([], ["oposicao-injuncao", "oposicao-execucao"], [], []);
});
test("T-125 licenciamento setorial com as 5 secções", () => {
  conteudoOk(["licenciamento-setorial"], [], [], []);
  const t = lerMd(SKILL("references", "licenciamento-setorial.md"));
  for (const s of ["## Alojamento local", "## Restauração e bebidas", "## Construção", "## Transportes", "## Mediação imobiliária"]) {
    assert.ok(t.includes(s), `falta a secção '${s}'`);
  }
});
test("T-126 IA, videovigilância e monitorização", () => {
  conteudoOk([], ["politica-uso-ia", "politica-videovigilancia", "politica-monitorizacao-trabalhadores"], [], []);
  assert.match(lerMd(SKILL("assets", "templates", "politica-uso-ia.md")), /art(igo)?\.? 4\.º/i);
});

test("T-133 todos os itens pedidos indexados; commands novos nomeiam tools reais", () => {
  conteudoOk(NOVO.refs, NOVO.tpls, NOVO.chks, NOVO.pbs);
  const casos = {
    calendario: /calendario_obrigacoes/,
    prazos: /registar_prazo[\s\S]*listar_prazos|listar_prazos[\s\S]*registar_prazo/,
    irc: /calc_irc/,
    salario: /calc_salario_liquido[\s\S]*calc_custo_trabalhador|calc_custo_trabalhador[\s\S]*calc_salario_liquido/,
    compliance: /compliance/,
  };
  for (const [nome, re] of Object.entries(casos)) {
    const p = r("commands", `${nome}.md`);
    assert.ok(existsSync(p), `commands/${nome}.md não existe`);
    assert.match(lerMd(p), re, `${nome}: não nomeia a tool/conteúdo`);
  }
  const src = lerMd(r("mcp-server", "src", "tools.ts"));
  for (const t of ["calendario_obrigacoes", "registar_prazo", "listar_prazos", "concluir_prazo", "listar_perfis", "ativar_perfil", "calc_salario_liquido", "calc_custo_trabalhador", "calc_irc", "calc_iva_operacao", "calc_taxa_justica"]) {
    assert.match(src, new RegExp(`registerTool\\(\\s*"${t}"`), `tool ${t} não registada`);
  }
});

// v1.2.1: a versão corrente é verificada pelo T-45 (coerência) e pelo T-249; aqui fica só o
// registo da 1.2.0 no CHANGELOG e uma versão >= 1.2.0 nos manifestos.
test("T-134 versão 1.2.0 registada no CHANGELOG e manifestos em 1.2.0 ou posterior", () => {
  const maior = (v) => v.split(".").map(Number).reduce((acc, n) => acc * 1000 + n, 0) >= 1002000;
  assert.ok(maior(JSON.parse(lerMd(r(".claude-plugin", "plugin.json"))).version));
  const mk = JSON.parse(lerMd(r(".claude-plugin", "marketplace.json")));
  assert.ok(maior(mk.metadata.version) && maior(mk.plugins[0].version));
  assert.ok(maior(JSON.parse(lerMd(r("package.json"))).version));
  assert.ok(maior(JSON.parse(lerMd(r("mcp-server", "package.json"))).version));
  assert.match(lerMd(r("CHANGELOG.md")), /^## \[1\.2\.0\]/m);
});
