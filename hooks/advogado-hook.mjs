#!/usr/bin/env node
// Dispatcher de hooks do plugin advogado-pt. Sem dependências (só node: builtins) e FAIL-OPEN:
// qualquer erro -> exit 0 (nunca bloqueia o utilizador). Lê o payload JSON do Claude Code de stdin.
//
//   SessionStart  -> breve briefing de "advogado ativo".
//   PostToolUse   -> ao gravar um INSTRUMENTO jurídico (detetado pela estrutura, não pelo
//                    léxico — ver detetarDocumentoJuridico), lembra as cláusulas essenciais
//                    e o disclaimer. Informativo, nunca bloqueia.
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
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

function sessionStart() {
  let msg =
    "⚖️ advogado-pt ativo — assessoria jurídica de Portugal · active — legal assistant for Portugal. " +
    "Comandos / commands: /advogado /parecer /cobrar /contrato /prazo /defesa /rgpd /despedir /comprar-imovel /doctor. " +
    "Valores 2026 em valores-2026; confirma prazos a correr · check running deadlines. " +
    "Orientação informativa, não substitui advogado da OA · informational guidance, not a substitute for a registered lawyer.";
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
  "minuta|den[úu]ncia|resolu[çc][ãa]o|revoga[çc][ãa]o|adenda|termo de";

// Só prosa: um .ts/.py/.json nunca é um instrumento, por muito que o cite.
const EXT_PROSA = /\.(md|markdown|txt|rtf)$/i;
const CAMINHO_TECNICO = /(^|[\\/])(\.specs|\.claude|node_modules|\.git|dist|build|src|tests?|scripts|examples?)[\\/]/i;
const NOME_TECNICO = /(^|[\\/])(README|CHANGELOG|CLAUDE|AGENTS|CONTRIBUTING|LICEN[CS]E|TODO)(\.\w+)?$/i;
// Marcas do estilo da casa numa *referência* jurídica — fala de direito, não é um ato.
const VETO_REFERENCIA = /^\s{0,3}#{1,3}\s*(legisla[çc][ãa]o base|para o contexto do utilizador)/im;

// Gate primário: H1 que ABRE com um tipo de documento ("# CONTRATO DE …").
const TITULO = new RegExp(`^\\s{0,3}#\\s*\\**\\s*(minuta de\\s+)?(${TIPO_DOC})\\b`, "im");

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
