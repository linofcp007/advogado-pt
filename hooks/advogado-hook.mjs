#!/usr/bin/env node
// Dispatcher de hooks do plugin advogado-pt. Sem dependências (só node: builtins) e FAIL-OPEN:
// qualquer erro -> exit 0 (nunca bloqueia o utilizador). Lê o payload JSON do Claude Code de stdin.
//
//   SessionStart  -> breve briefing de "advogado ativo" + perfil da empresa guardado
//                    (projeto -> geral) ou instrução para o perguntar.
//   PostToolUse   -> ao gravar um INSTRUMENTO jurídico (detetado pela estrutura, não pelo
//                    léxico — ver detetarDocumentoJuridico), lembra as cláusulas essenciais
//                    e o disclaimer. Informativo, nunca bloqueia.
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const EVENT = process.argv[2] || "";
const HERE = dirname(fileURLToPath(import.meta.url));
const MCP_DIST = resolve(HERE, "..", "mcp-server", "dist", "index.js");

function emit(additionalContext) {
  if (!additionalContext) return;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: EVENT, additionalContext },
    }) + "\n"
  );
}

function lerStdin() {
  // Lê o payload de stdin de forma síncrona; se não houver, devolve {}.
  try {
    const raw = readFileSync(0, "utf8");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// --- Perfil da empresa -----------------------------------------------------
// <projeto>/.advogado-pt/perfil-empresa.md tem prioridade; senão ~/.advogado-pt/perfil-empresa.md.
// Leitor mínimo, alinhado com mcp-server/src/perfil.ts (o hook não importa o servidor).
const CAMPOS_PERFIL = [
  "forma_juridica", "denominacao", "setor", "trabalhadores", "volume_negocios", "regime_iva",
  "contabilidade", "clientes", "dados_pessoais", "linguas", "notas", "atualizado_em",
];
const MS_12_MESES = 365 * 24 * 60 * 60 * 1000;

function lerPerfilEm(base, origem, hoje) {
  try {
    const caminho = join(base, ".advogado-pt", "perfil-empresa.md");
    if (!existsSync(caminho)) return null;
    const campos = {};
    for (const linha of readFileSync(caminho, "utf8").split(/\r?\n/)) {
      const m = /^\s*([a-z_]+)\s*:\s*(.*?)\s*$/.exec(linha);
      if (m && CAMPOS_PERFIL.includes(m[1]) && m[2] !== "") campos[m[1]] = m[2];
    }
    const uteis = CAMPOS_PERFIL.filter((c) => c !== "atualizado_em" && campos[c]);
    if (uteis.length === 0) return null;
    const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(campos.atualizado_em || "");
    const desatualizado = !d || hoje.getTime() - Date.UTC(+d[1], +d[2] - 1, +d[3]) > MS_12_MESES;
    const resumo = uteis.map((c) => `${c}: ${campos[c]}`).join(" · ");
    return { origem, resumo, desatualizado };
  } catch {
    return null; // fail-open
  }
}

/** Mensagem do SessionStart (exportada para testes). Nunca lança. */
export function mensagemSessionStart(opts = {}) {
  let msg =
    "⚖️ advogado-pt ativo — assessoria jurídica de Portugal · active — legal assistant for Portugal. " +
    "Comandos / commands: /advogado /parecer /cobrar /contrato /prazo /defesa /rgpd /despedir /fisco /insolvencia /perfil /doctor. " +
    "Valores 2026 em valores-2026; confirma prazos a correr · check running deadlines. " +
    "Orientação informativa, não substitui advogado da OA · informational guidance, not a substitute for a registered lawyer.";
  try {
    const hoje = opts.hoje || new Date();
    const projeto = opts.projeto || process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const home = opts.home || process.env.ADVOGADO_PT_HOME || homedir();
    const p = lerPerfilEm(projeto, "projeto", hoje) || lerPerfilEm(home, "geral", hoje);
    if (p) {
      msg += ` 🏢 Perfil da empresa (${p.origem}): ${p.resumo}. Adapta as respostas a este perfil.`;
      if (p.desatualizado) {
        msg += " ⚠️ Perfil com mais de 12 meses (ou sem data): confirma os dados com o utilizador antes de os usar.";
      }
    } else {
      msg +=
        " 🏢 Sem perfil da empresa guardado: na 1.ª questão empresarial pergunta só o necessário " +
        "(forma jurídica, setor, n.º de trabalhadores, volume de negócios…) e oferece guardar com " +
        "guardar_perfil_empresa (destino projeto ou geral).";
    }
  } catch {
    /* fail-open: segue sem perfil */
  }
  return msg;
}

function sessionStart() {
  let msg = mensagemSessionStart();
  if (!existsSync(MCP_DIST)) {
    msg +=
      " ⚠️ Servidor MCP por construir: corre `npm run setup` na raiz do plugin · " +
      "MCP server not built: run `npm run setup` at the plugin root.";
  }
  emit(msg);
}

// --- Deteção de documento jurídico ---------------------------------------
// Num plugin de direito o vocabulário jurídico É o assunto: referências,
// playbooks e specs técnicas falam de "contrato" e "cláusula" sem serem
// contratos ("contrato de interface", "cláusula WHERE"). Procurar palavras
// dispara em quase todo o ficheiro .md do domínio. Por isso classificamos pela
// ESTRUTURA de um instrumento — título, partes, cláusulas numeradas, fecho de
// carta — e não pelo léxico. Precisão >> recall: um falso positivo é ruído em
// cada gravação; um falso negativo é só um lembrete que não aparece.

const ORD = "primeir|segund|terceir|quart|quint|sext|s[ée]tim|oitav|non|d[ée]cim";
const TIPO_DOC =
  "contratos?|acordos?|cartas?|declara[çc][ãa]o|procura[çc][ãa]o|requerimentos?|nota de culpa|" +
  "notifica[çc][ãa]o|aditamento|reconhecimento de d[íi]vida|pactos?|livran[çc]a|nda|" +
  "pol[íi]tica de (privacidade|cookies)|termos e condi[çc][õo]es|defesa em processo|" +
  "minuta|den[úu]ncia|resolu[çc][ãa]o|revoga[çc][ãa]o|adenda|termo de|" +
  // v1.1 — atos dirigidos a entidades (AT, AI, CNPD, Comissão…), sempre com o complemento
  // que os distingue de texto técnico ("# Pedido de feature" não dispara).
  "reclama[çc][ãa]o (graciosa|de cr[ée]ditos|ao banco|por opera[çc])|" +
  "pedido de (informa[çc][ãa]o vinculativa|pagamento em presta[çc][õo]es|reembolso)|" +
  "exerc[íi]cio do direito de|c[óo]digo de boa conduta|pol[íi]tica de preven[çc][ãa]o|" +
  // "ATA N.º 3" — \b depois de "N" (seguido de "."); "# Ata nova" não dispara.
  "decis[ãa]o d[oa] s[óo]ci[oa] [úu]nic[oa]|ata (n|da assembleia|de reuni[ãa]o)|" +
  "formul[áa]rio de livre resolu[çc][ãa]o|registo das atividades de tratamento|" +
  "resposta a pedido de exerc[íi]cio|queixa (à comiss[ãa]o|contra|-crime)";

// Só prosa: um .ts/.py/.json nunca é um instrumento, por muito que o cite.
const EXT_PROSA = /\.(md|markdown|txt|rtf)$/i;
const CAMINHO_TECNICO = /(^|[\\/])(\.specs|\.claude|node_modules|\.git|dist|build|src|tests?|scripts|examples?)[\\/]/i;
const NOME_TECNICO = /(^|[\\/])(README|CHANGELOG|CLAUDE|AGENTS|CONTRIBUTING|LICEN[CS]E|TODO)(\.\w+)?$/i;
// Marcas do estilo da casa numa *referência* jurídica — fala de direito, não é um ato.
const VETO_REFERENCIA = /^\s{0,3}#{1,3}\s*(legisla[çc][ãa]o base|para o contexto do utilizador)/im;

// Gate primário: H1 que ABRE com um tipo de documento ("# CONTRATO DE …").
const TITULO = new RegExp(`^\\s{0,3}#\\s*\\**\\s*((minuta|modelo) de\\s+)?(${TIPO_DOC})\\b`, "im");

// Sem título, exigem-se >= 2 marcadores estruturais independentes.
const MARCADORES = [
  new RegExp(`\\b(${ORD})[oa]s?\\s+outorgante`, "i"), // bloco de partes
  new RegExp(`^\\s{0,3}#{0,4}\\s*\\**\\s*cl[áa]usula\\s+(\\d+|${ORD}[ao])`, "im"), // cláusula numerada
  /^\s{0,3}\**\s*assunto\s*:/im, // carta formal
  /\bexmo?s?\.?\s*\(?a?\)?\.?\s*(senhor|sr)/i,
  /\bcom os melhores cumprimentos\b/i, // fecho de carta
  /\b[oa] presente (contrato|acordo|declara[çc][ãa]o|procura[çc][ãa]o|documento)\b/i,
  /\b(foro|tribunal) d[ao] comarca\b/i, // cláusula de foro
];

/** Verdadeiro só quando o ficheiro gravado É um instrumento jurídico. */
export function detetarDocumentoJuridico({ path, content } = {}) {
  const texto = typeof content === "string" ? content : "";
  const caminho = typeof path === "string" ? path : "";
  if (!caminho || !EXT_PROSA.test(caminho)) return false;
  if (CAMINHO_TECNICO.test(caminho) || NOME_TECNICO.test(caminho)) return false;
  if (VETO_REFERENCIA.test(texto)) return false;
  if (TITULO.test(texto)) return true;
  return MARCADORES.filter((re) => re.test(texto)).length >= 2;
}

function postToolUse(payload) {
  try {
    const ti = payload.tool_input || payload.toolInput || {};
    const path = ti.file_path || ti.path || "";
    const content = ti.content || ti.new_string || "";
    if (!detetarDocumentoJuridico({ path, content })) return;
    emit(
      "📝 Documento jurídico detetado · legal document detected. " +
        "Verifica/check: partes (parties), objeto (subject), preço/prazos (price/deadlines), " +
        "lei aplicável e foro/arbitragem (governing law & jurisdiction), proteção de dados (data protection), " +
        "envio por registado com AR quando aplicável. Vê o template em assets/templates/ · see the matching template."
    );
  } catch {
    /* fail-open */
  }
}

// Só age quando é EXECUTADO como hook; importado (testes) apenas exporta.
function executadoDiretamente() {
  try {
    return !!process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (executadoDiretamente()) {
  try {
    const payload = EVENT === "SessionStart" ? {} : lerStdin();
    if (EVENT === "SessionStart") sessionStart();
    else if (EVENT === "PostToolUse") postToolUse(payload);
  } catch {
    /* fail-open */
  }
  process.exit(0);
}
