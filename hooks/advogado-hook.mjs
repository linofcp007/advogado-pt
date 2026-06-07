#!/usr/bin/env node
// Dispatcher de hooks do plugin advogado-pt. Sem dependências (só node: builtins) e FAIL-OPEN:
// qualquer erro -> exit 0 (nunca bloqueia o utilizador). Lê o payload JSON do Claude Code de stdin.
//
//   SessionStart  -> breve briefing de "advogado ativo".
//   PostToolUse   -> ao gravar um documento com aspeto jurídico (contrato/carta/cláusula),
//                    lembra das cláusulas essenciais e do disclaimer. Informativo, nunca bloqueia.
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

const SINAIS = /\b(contrato|cláusula|clausula|NDA|arrendamento|interpela|resolu[çc][aã]o do contrato|cessão|honor[aá]rios)\b/i;

function postToolUse(payload) {
  try {
    const ti = payload.tool_input || payload.toolInput || {};
    const alvo = `${ti.file_path || ti.path || ""}\n${ti.content || ti.new_string || ""}`;
    if (!SINAIS.test(alvo)) return; // só fala quando parece um documento jurídico
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

try {
  const payload = EVENT === "SessionStart" ? {} : lerStdin();
  if (EVENT === "SessionStart") sessionStart();
  else if (EVENT === "PostToolUse") postToolUse(payload);
} catch {
  /* fail-open */
}
process.exit(0);
