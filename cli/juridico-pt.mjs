#!/usr/bin/env node
// CLI universal do juridico-pt:
//   juridico-pt mcp-config <host> [--npx]   -> imprime o bloco de config MCP pronto a colar
//   juridico-pt calc <calc> [args]          -> corre uma calculadora jurídica
//   juridico-pt prompt <nome> [--tipo …]    -> exporta um template/playbook como prompt para outras IAs
// Sem dependências externas (só node: builtins + as calculadoras compiladas do mcp-server).
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const serverPath = resolve(repo, "mcp-server", "dist", "index.js");
const calcPath = resolve(repo, "mcp-server", "dist", "calculators", "index.js");
const distPath = (f) => resolve(repo, "mcp-server", "dist", f);

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
      `[mcp_servers."juridico-pt"]\n` +
      `command = "${spec.command}"\n` +
      `args = [${spec.args.map((a) => `"${a.replace(/\\/g, "\\\\")}"`).join(", ")}]`
    );
  }
  const inner = { command: spec.command, args: spec.args };
  if (fmt === "json-servers") {
    return JSON.stringify({ servers: { "juridico-pt": { type: "stdio", ...inner } } }, null, 2);
  }
  return JSON.stringify({ mcpServers: { "juridico-pt": inner } }, null, 2);
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

// Argumentos estritos: um valor em falta, não numérico ou negativo termina com erro (exit 1)
// nomeando a flag — nunca se calcula com NaN nem se imprime "undefined".
const OBRIGATORIO = Symbol("obrigatorio");

function valorDe(args, flag) {
  const i = args.indexOf(flag);
  if (i < 0) return undefined;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`Falta o valor de ${flag}.`);
  return v;
}
function num(args, flag, def = OBRIGATORIO, { negativo = false } = {}) {
  const v = valorDe(args, flag);
  if (v === undefined) {
    if (def === OBRIGATORIO) throw new Error(`Falta o argumento obrigatório ${flag}.`);
    return def;
  }
  const n = Number(v.trim().replace(",", "."));
  if (v.trim() === "" || !Number.isFinite(n)) throw new Error(`Valor inválido em ${flag}: '${v}' (usa um número).`);
  if (n < 0 && !negativo) throw new Error(`Valor inválido em ${flag}: não pode ser negativo.`);
  return n;
}
function str(args, flag, def) {
  const v = valorDe(args, flag);
  if (v === undefined) {
    if (def === OBRIGATORIO) throw new Error(`Falta o argumento obrigatório ${flag}.`);
    return def;
  }
  return v;
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
  const data = (flag, def = OBRIGATORIO) => c.parseDataEstrita(str(rest, flag, def), flag);
  switch (which) {
    case "imt": {
      const r = c.calcularIMT(num(rest, "--valor"), str(rest, "--tipo", "hpp"), rest.includes("--jovem"));
      console.log(`IMT: ${fmt(r.imt)} | Selo: ${fmt(r.selo)} | Total: ${fmt(r.total)} (${r.regime})`);
      break;
    }
    case "juros": {
      const capital = num(rest, "--capital");
      const inicio = data("--inicio");
      const fim = data("--fim", c.hojeLisboa());
      const tipo = str(rest, "--tipo", "comercial");
      const r = c.calcularJuros(capital, inicio, fim, tipo);
      console.log(c.memoriaJuros(capital, r, tipo));
      break;
    }
    case "ccp": {
      const inicio = valorDe(rest, "--inicio") === undefined ? undefined : data("--inicio");
      const r = c.calcularProcedimentoCCP({ valor: num(rest, "--valor"), tipo: str(rest, "--tipo", "bens-servicos"), inicio });
      console.log(c.textoProcedimentoCCP(r));
      break;
    }
    case "lote": {
      let faturas;
      try {
        faturas = JSON.parse(str(rest, "--json", OBRIGATORIO));
      } catch {
        throw new Error("--json: lista de faturas em JSON inválida (ex.: '[{\"cliente\":\"A\",\"fatura\":\"FT 1\",\"capital\":1000,\"vencimento\":\"2026-01-15\"}]').");
      }
      if (!Array.isArray(faturas)) throw new Error("--json: tem de ser uma lista de faturas.");
      const r = c.calcularJurosLote(faturas, data("--fim", c.hojeLisboa()));
      console.log(c.memoriaJurosLote(r));
      break;
    }
    case "prazo": {
      const inicio = data("--inicio");
      const r = c.contarPrazo(inicio, num(rest, "--dias"), str(rest, "--tipo", "corridos"), {
        urgente: rest.includes("--urgente"),
      });
      if (r.transferido) console.log(`Termo legal: ${r.dataLegal.toISOString().slice(0, 10)}`);
      console.log(`Data-limite: ${r.dataLimite.toISOString().slice(0, 10)}`);
      console.log(r.nota);
      break;
    }
    case "prescricao": {
      const r = c.calcularPrescricao(data("--inicio"), str(rest, "--tipo", "creditos-comerciais"));
      console.log(`${r.descricao}: limite ${r.limite.toISOString().slice(0, 10)} (${r.prazoTexto}; ${r.base})`);
      if (r.aviso) console.log(r.aviso);
      break;
    }
    case "compensacao": {
      const temDatas = rest.includes("--admissao") || rest.includes("--cessacao");
      const mod = str(rest, "--modalidade", "sem-termo");
      if (temDatas) {
        const r = c.calcularCompensacaoPorDatas({
          retribuicaoBase: num(rest, "--retribuicao"),
          diuturnidades: num(rest, "--diuturnidades", 0),
          dataAdmissao: data("--admissao"),
          dataCessacao: data("--cessacao"),
          modalidade: mod === "termo" ? "termo" : "sem-termo",
        });
        console.log(
          r.periodos.map((p) => `- ${p.de} a ${p.ate}: ${p.dias} dias/ano = ${fmt(p.valor)}`).join("\n") +
            `\nCompensação: ${fmt(r.total)}${r.tetoAplicado ? " (teto aplicado)" : ""}${r.minimoAplicado ? " (mínimo de 3 meses — regime transitório)" : ""}`
        );
        break;
      }
      const r = c.calcularCompensacao(num(rest, "--retribuicao"), num(rest, "--diuturnidades", 0), num(rest, "--anos"), mod);
      console.log(`Compensação: ${fmt(r.bruto)} (${r.diasAno} dias/ano${r.tetoAplicado ? ", teto aplicado" : ""}) -> se a antiguidade começou antes de 1/5/2023, usa --admissao/--cessacao`);
      break;
    }
    case "custas": {
      const r = c.custasInjuncao(num(rest, "--valor"));
      console.log(`Custas injunção: ${fmt(r.taxa)} (${r.escalao})`);
      break;
    }
    case "selo": {
      const r = c.impostoSeloHeranca(
        num(rest, "--valor"),
        str(rest, "--herdeiro", "outro"),
        rest.includes("--imovel"),
        num(rest, "--vpt", 0),
        rest.includes("--doacao")
      );
      console.log(`Imposto do selo: ${fmt(r.total)} (transmissão: ${r.isento ? "isento" : fmt(r.isTransmissao)})`);
      break;
    }
    case "irs": {
      const r = c.calcularIRSSimplificado(num(rest, "--rendimento"), str(rest, "--tipo", "servicos-151"));
      console.log(`IRS rendimento tributável: ${fmt(r.tributavel)} (coeficiente ${r.coeficiente})`);
      break;
    }
    case "creditos": {
      const r = c.calcularCreditosCessacao({
        retribuicaoBase: num(rest, "--retribuicao"),
        diuturnidades: num(rest, "--diuturnidades", 0),
        dataAdmissao: data("--admissao"),
        dataCessacao: data("--cessacao"),
        feriasVencidasNaoGozadas: num(rest, "--ferias-vencidas", 0),
        subsidioFeriasVencidoEmFalta: rest.includes("--sf-em-falta"),
      });
      console.log(
        `Proporcionais (férias + SF + SN): ${fmt(3 * r.proporcionalFerias)} (${r.diasServicoAno}/${r.diasAno} dias)\n` +
          `Férias vencidas: ${fmt(r.feriasVencidas)} | SF vencido: ${fmt(r.subsidioFeriasVencido)}\n` +
          `TOTAL BRUTO: ${fmt(r.total)}` +
          (r.limite245n3 ? "\n-> Atenção: limite do art. 245.º, n.º 3, CT (contrato até 12 meses)." : "")
      );
      break;
    }
    case "legitima": {
      const r = c.calcularLegitima({
        bens: num(rest, "--bens"),
        doacoes: num(rest, "--doacoes", 0),
        dividas: num(rest, "--dividas", 0),
        conjuge: rest.includes("--conjuge"),
        filhos: num(rest, "--filhos", 0),
        ascendentes: str(rest, "--ascendentes", "nenhum"),
      });
      console.log(
        `Valor da herança (art. 2162.º CC): ${fmt(r.valorHeranca)}\n` +
          `Legítima: ${fmt(r.legitima)} | Quota disponível: ${fmt(r.quotaDisponivel)} (${r.quotaDisponivelPct.toFixed(2).replace(".", ",")}%)\n` +
          r.partes.map((p) => `  - ${p.herdeiro}: ${fmt(p.valor)}`).join("\n")
      );
      break;
    }
    case "salario": {
      const r = c.calcularSalarioLiquido({
        bruto: num(rest, "--bruto"),
        tabela: str(rest, "--tabela", "I"),
        dependentes: num(rest, "--dependentes", 0),
        subsidioRefeicaoDia: num(rest, "--refeicao", 0),
        diasRefeicao: rest.includes("--refeicao") ? num(rest, "--dias", 22) : 0,
        refeicaoCartao: rest.includes("--cartao"),
      });
      console.log(
        `Segurança Social (11%): -${fmt(r.segurancaSocial)}\n` +
          `Retenção de IRS (${String(r.taxaMarginal).replace(".", ",")}%): -${fmt(r.retencaoIRS)}\n` +
          (r.refeicaoTributavel ? `Refeição tributável: ${fmt(r.refeicaoTributavel)}\n` : "") +
          `LÍQUIDO: ${fmt(r.liquido)}`
      );
      break;
    }
    case "custo": {
      const r = c.calcularCustoTrabalhador({
        base: num(rest, "--base"),
        diuturnidades: num(rest, "--diuturnidades", 0),
        subsidioRefeicaoDia: num(rest, "--refeicao", 0),
        diasRefeicaoMes: num(rest, "--dias", 22),
        mesesRefeicao: num(rest, "--meses", 11),
        refeicaoCartao: rest.includes("--cartao"),
        taxaSeguroAT: num(rest, "--seguro", 0),
      });
      console.log(
        `Retribuições: ${fmt(r.retribuicaoAnual)} | TSU 23,75%: ${fmt(r.tsuAnual)} | Refeição: ${fmt(r.refeicaoAnual)} | Seguro AT: ${fmt(r.seguroAnual)}\n` +
          `TOTAL ANUAL: ${fmt(r.total)} (média mensal ${fmt(r.mensalMedio)})`
      );
      break;
    }
    case "irc": {
      const viaturas = [];
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--viatura" && rest[i + 1]) {
          const [custo, tipo, encargos] = rest[i + 1].split(":");
          const custoN = Number(custo);
          const encargosN = Number(encargos ?? 0);
          if (!Number.isFinite(custoN) || custoN < 0 || !tipo || !Number.isFinite(encargosN) || encargosN < 0) {
            throw new Error(`Valor inválido em --viatura: '${rest[i + 1]}' (usa custo:tipo:encargos).`);
          }
          viaturas.push({ custoAquisicao: custoN, tipo, encargos: encargosN });
        }
      }
      const r = c.calcularIRC({
        lucroTributavel: num(rest, "--lucro", OBRIGATORIO, { negativo: true }),
        pme: rest.includes("--pme"),
        derramaMunicipal: num(rest, "--derrama", 0.015),
        prejuizosDedutiveis: num(rest, "--prejuizos", 0),
        despesasRepresentacao: num(rest, "--representacao", 0),
        ajudasCusto: num(rest, "--ajudas-custo", 0),
        despesasNaoDocumentadas: num(rest, "--nao-documentadas", 0),
        viaturas,
        isentoAgravamento: rest.includes("--isento-agravamento"),
        ano: num(rest, "--ano", 2026),
      });
      console.log(
        `Matéria coletável: ${fmt(r.materiaColetavel)} | IRC (${r.taxaGeral}%${rest.includes("--pme") ? "; PME 15% até 50.000 €" : ""}): ${fmt(r.irc)}\n` +
          `Derrama municipal: ${fmt(r.derramaMunicipal)} | Derrama estadual: ${fmt(r.derramaEstadual)} | Tributação autónoma: ${fmt(r.tributacaoAutonoma)}\n` +
          `TOTAL: ${fmt(r.total)}`
      );
      break;
    }
    case "iva": {
      const r = c.decidirIVA({
        tipo: str(rest, "--tipo", "servicos"),
        cliente: str(rest, "--cliente", "empresa"),
        destino: str(rest, "--destino", "UE"),
        nifVIES: rest.includes("--vies"),
        vendasDistanciaUE: num(rest, "--vendas-distancia", 0),
        servico: str(rest, "--servico", "geral"),
        regime53: rest.includes("--regime53"),
      });
      console.log(
        `Onde se tributa: ${r.tributacao}\nQuem liquida: ${r.liquida}\n` +
          (r.codigo ? `Menção: "${r.mencaoFatura}" (${r.codigo})\n` : "") +
          `Declarações: ${r.declaracoes.join("; ") || "—"}\nBase: ${r.base}` +
          r.avisos.map((x) => `\n- ${x}`).join("")
      );
      break;
    }
    case "taxa-justica": {
      const r = c.calcularTaxaJustica(num(rest, "--valor"), {
        tabela: str(rest, "--tabela", "A"),
        reducaoEletronica: rest.includes("--reducao-eletronica"),
      });
      console.log(
        `${r.escalao} | taxa inicial ${r.taxaInicialUC} UC = ${fmt(r.taxaInicialEuros)}` +
          (r.remanescenteUC ? ` | remanescente ${r.remanescenteUC} UC (a final)` : "") +
          `\nTOTAL: ${r.totalUC} UC = ${fmt(r.totalEuros)} (UC ${fmt(r.ucValor)})`
      );
      break;
    }
    default:
      console.error("calc <imt|juros|prazo|prescricao|compensacao|custas|selo|irs|creditos|legitima|salario|custo|irc|iva|taxa-justica> [--flags]");
      process.exit(1);
  }
}

// --- calendario / prazos: usam os módulos compilados do mcp-server ----------
async function modulo(f) {
  const p = distPath(f);
  if (!existsSync(p)) {
    console.error("Servidor ainda não compilado. Corre: cd mcp-server && npm install && npm run build");
    process.exit(1);
  }
  return import(pathToFileURL(p).href);
}

async function calendarioCmd(args) {
  const ano = num(args, "--ano", new Date().getFullYear());
  const dir = resolve(str(args, "--dir", process.cwd()));
  const mes = args.includes("--mes") ? num(args, "--mes") : undefined;
  const { gerarCalendario, formatarCalendario, exportarICS } = await modulo("calendario.js");
  const { lerPerfil } = await modulo("perfil.js");
  const perfil = lerPerfil({ projeto: dir, perfil: str(args, "--perfil", undefined) });
  const cal = gerarCalendario(ano, perfil?.campos ?? null);
  console.log(
    `Calendário de obrigações ${ano}` +
      (perfil ? ` — perfil${perfil.nome ? ` '${perfil.nome}'` : ""} (${perfil.origem})` : " — sem perfil (obrigações a confirmar)") +
      ` · ${cal.length} prazos`
  );
  if (perfil?.aviso) console.log(`AVISO: ${perfil.aviso}`);
  console.log(formatarCalendario(cal, { mes }));
  if (args.includes("--ics")) {
    const caminho = exportarICS(ano, cal, dir);
    console.log(`\nExportado: ${caminho} (Google Calendar: Definições -> Importar e exportar -> Importar)`);
  }
  console.log("\nConfirmar no Portal das Finanças / Segurança Social Direta (prorrogações por despacho).");
}

async function prazosCmd(args) {
  const dir = resolve(str(args, "--dir", process.cwd()));
  const { lerPrazos, registarPrazo, concluirPrazo, prazosProximos } = await modulo("prazos-estado.js");
  const sub = args[0];
  if (sub === "add") {
    const p = registarPrazo({ data: str(args, "--data", ""), descricao: str(args, "--descricao", ""), origem: str(args, "--origem", undefined) }, dir);
    console.log(`Registado: ${p.data} — ${p.descricao}`);
    return;
  }
  if (sub === "done") {
    const ok = concluirPrazo(str(args, "--data", ""), str(args, "--descricao", ""), dir);
    console.log(ok ? "Marcado como cumprido." : "Prazo em aberto não encontrado.");
    process.exit(ok ? 0 : 1);
  }
  const { vencidos, proximos } = prazosProximos(lerPrazos(dir), new Date(), 36500);
  if (vencidos.length + proximos.length === 0) return console.log("Sem prazos em aberto.");
  for (const x of vencidos) console.log(`VENCIDO ${x.data} — ${x.descricao}`);
  for (const x of proximos) console.log(`${x.data} — ${x.descricao} (faltam ${x.faltam} dias)`);
}

// --- prompt: exporta conteúdo como prompt autocontido para outras IAs ---------
// Lê os .md da skill (fonte versionada) e a persona de mcp-server/src/persona.ts —
// não depende do build do MCP, por isso funciona logo após clonar/instalar.
const SKILL_DIR = resolve(repo, "skills", "juridico-pt");
const TIPOS_PROMPT = {
  template: { dir: ["assets", "templates"], rotulo: "TEMPLATE" },
  playbook: { dir: ["playbooks"], rotulo: "PLAYBOOK" },
  checklist: { dir: ["assets", "checklists"], rotulo: "CHECKLIST" },
  referencia: { dir: ["references"], rotulo: "REFERÊNCIA" },
};
const TAREFA_PROMPT = {
  template:
    "TAREFA: Redige o documento a partir do template abaixo. Pergunta-me os dados em falta para cada {{CAMPO}} " +
    "(um bloco de perguntas de cada vez). Marca [VERIFICAR] tudo o que não consigas confirmar. Entrega o documento " +
    "final limpo (sem os comentários <!-- -->) e, SEPARADO do documento, a lista \"Antes de enviar — verificar\".",
  playbook:
    "TAREFA: Segue o playbook abaixo como árvore de decisão. Faz-me as perguntas de cada passo, uma de cada vez, " +
    "destaca os prazos com ⏰ e no fim dá-me os próximos passos e os documentos a preparar.",
  checklist:
    "TAREFA: Percorre a checklist abaixo comigo, item a item. Para cada item diz-me se está cumprido, o que falta e " +
    "o risco de não o fazer. No fim, resume as prioridades.",
  referencia:
    "TAREFA: Usa a referência abaixo como base para responder às minhas perguntas sobre esta área. Cita os diplomas " +
    "e artigos que lá estão; se precisares de algo que não esteja, diz que é preciso confirmar em dre.pt.",
};

function lerPersona() {
  try {
    const src = readFileSync(resolve(repo, "mcp-server", "src", "persona.ts"), "utf8");
    const m = /PERSONA\s*=\s*`([\s\S]*?)`;/.exec(src);
    if (m) return m[1];
  } catch {
    /* segue para o fallback */
  }
  return (
    "És um assistente jurídico especializado em DIREITO PORTUGUÊS. RIGOR: nunca inventes artigos ou jurisprudência; " +
    "confirma valores do ano corrente; não substituis advogado inscrito na Ordem dos Advogados."
  );
}

function promptCmd(args) {
  const nome = (args.find((a) => !a.startsWith("--")) || "").replace(/\.md$/i, "");
  const tipo = str(args, "--tipo", "template");
  const def = TIPOS_PROMPT[tipo];
  if (!def) {
    console.error(`Tipo desconhecido: ${tipo}. Opções: ${Object.keys(TIPOS_PROMPT).join(", ")}.`);
    process.exit(1);
  }
  const dir = resolve(SKILL_DIR, ...def.dir);
  const disponiveis = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
        .map((f) => f.slice(0, -3))
        .sort()
    : [];
  if (!nome || /[\\/]|\.\./.test(nome) || !disponiveis.includes(nome)) {
    console.error(
      `${nome ? `'${nome}' não encontrado` : "Indica um nome"} (${tipo}). Disponíveis:\n- ${disponiveis.join("\n- ")}`
    );
    process.exit(1);
  }
  const conteudo = readFileSync(resolve(dir, `${nome}.md`), "utf8");
  console.log(
    [
      "=== juridico-pt -> prompt para colar noutra IA (ChatGPT, Gemini, Copilot, …) ===",
      "",
      lerPersona(),
      "",
      "PERFIL DA MINHA EMPRESA: pergunta-me primeiro a forma jurídica, o setor, o n.º de trabalhadores e o volume de negócios, se forem relevantes.",
      "",
      TAREFA_PROMPT[tipo],
      "",
      `--- ${def.rotulo}: ${nome} ---`,
      conteudo.trim(),
      `--- FIM DO ${def.rotulo} ---`,
    ].join("\n")
  );
}

function doctor() {
  const contentDir = resolve(repo, "mcp-server", "content");
  const major = Number(process.versions.node.split(".")[0]);
  const checks = [
    [`Node >= 18`, major >= 18, `Node ${process.versions.node}`],
    [`MCP compilado (dist/index.js)`, existsSync(serverPath), ""],
    [`Calculadoras compiladas`, existsSync(calcPath), ""],
    [`Conteúdo empacotado (content/)`, existsSync(contentDir), ""],
  ];
  let ok = true;
  for (const [label, pass, extra] of checks) {
    console.log(`${pass ? "OK  " : "FALTA"} ${label}${extra ? " — " + extra : ""}`);
    if (!pass) ok = false;
  }
  console.log(
    ok
      ? "\nTudo pronto. Liga um cliente com: node cli/juridico-pt.mjs mcp-config <host>"
      : "\nResolver: cd mcp-server && npm install && npm run build"
  );
  process.exit(ok ? 0 : 1);
}

const HELP = `juridico-pt — CLI

Uso:
  juridico-pt mcp-config <host>
      hosts: ${Object.keys(HOSTS).join(", ")}, all
      Imprime o bloco de configuração MCP (node + caminho local) para esse cliente.

  juridico-pt calc imt --valor 250000 [--tipo hpp|secundaria] [--jovem]
  juridico-pt calc juros --capital 5000 --inicio 2025-03-01 [--fim YYYY-MM-DD] [--tipo comercial|comercial-geral|civil]
      (memória de cálculo por tramos semestrais)
  juridico-pt calc lote --json '[{"cliente":"A","fatura":"FT 1","capital":1000,"vencimento":"2026-01-15"}]' [--fim YYYY-MM-DD]
      (várias faturas: juros por fatura, 40 € nas comerciais, totais por cliente e geral)
  juridico-pt calc ccp --valor 100000 [--tipo bens-servicos|empreitada] [--inicio AAAA-MM-DD]
      (procedimentos de contratação pública admissíveis pelo valor; limiares do DL 177/2026)
  juridico-pt calc prazo --inicio 2026-06-01 --dias 15 [--tipo judicial|corridos|uteis] [--urgente]
      (judicial: CPC 138.º com férias judiciais; corridos por defeito)
  juridico-pt calc prescricao --inicio 2025-01-15 --tipo creditos-comerciais
  juridico-pt calc compensacao --retribuicao 1500 --admissao 2015-05-01 --cessacao 2024-04-30 [--modalidade sem-termo|termo]
      (ou --anos N para a regra atual; regime transitório por períodos com as datas)
  juridico-pt calc custas --valor 8000
  juridico-pt calc selo --valor 100000 [--herdeiro conjuge|descendente|ascendente|outro] [--imovel --vpt N] [--doacao]
      (0,8% sobre o VPT só na doação de imóveis; na herança só a verba 1.2)
  juridico-pt calc irs --rendimento 60000 [--tipo mercadorias|servicos-151|servicos-outros|propriedade-intelectual]
  juridico-pt calc creditos --retribuicao 1500 --admissao 2020-03-01 --cessacao 2026-06-30 [--diuturnidades N] [--ferias-vencidas DIAS] [--sf-em-falta]
  juridico-pt calc legitima --bens 300000 [--doacoes N] [--dividas N] [--conjuge] [--filhos N] [--ascendentes nenhum|pais|outros]

  juridico-pt calendario --ano 2026 [--dir <projeto>] [--mes N] [--perfil nome] [--ics]
      Calendário de obrigações a partir do perfil da empresa; --ics grava .juridico-pt/calendario-<ano>.ics.
  juridico-pt prazos [add --data AAAA-MM-DD --descricao "…" [--origem "…"] | done --data … --descricao "…"] [--dir <projeto>]
      Prazos em curso do projeto (.juridico-pt/prazos.md).

  juridico-pt calc salario --bruto 1500 [--tabela I|II|III] [--dependentes N] [--refeicao 8 --dias 22] [--cartao]
  juridico-pt calc custo --base 1500 [--refeicao 6] [--seguro 0.01] [--diuturnidades N]
  juridico-pt calc irc --lucro 100000 [--pme] [--derrama 0.015] [--prejuizos N] [--representacao N] [--viatura custo:tipo:encargos]
  juridico-pt calc iva --tipo bens|servicos --cliente empresa|consumidor --destino PT|UE|fora-UE [--vies] [--vendas-distancia N] [--servico eletronico|…]
  juridico-pt calc taxa-justica --valor 30000 [--tabela A|B|C] [--reducao-eletronica]

  juridico-pt prompt <nome> [--tipo template|playbook|checklist|referencia]
      Imprime um prompt autocontido (persona + rigor + conteúdo) para colar noutra IA.

  juridico-pt doctor
      Verifica pré-requisitos (Node, build do MCP, conteúdo empacotado).

Orientação informativa — não substitui advogado inscrito na Ordem dos Advogados.`;

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === "mcp-config") return mcpConfig(args);
  if (cmd === "calc") return calc(args);
  if (cmd === "prompt") return promptCmd(args);
  if (cmd === "calendario") return calendarioCmd(args);
  if (cmd === "prazos") return prazosCmd(args);
  if (cmd === "doctor") return doctor();
  console.log(HELP);
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
