#!/usr/bin/env node
// Dispatcher de hooks do plugin advogado-pt. Sem dependências (só node: builtins) e FAIL-OPEN:
// qualquer erro -> exit 0 (nunca bloqueia o utilizador). Lê o payload JSON do Claude Code de stdin.
//
//   SessionStart  -> breve briefing de "advogado ativo".
//   PostToolUse   -> ao gravar um documento com aspeto jurídico (contrato/carta/cláusula),
//                    lembra das cláusulas essenciais e do disclaimer. Informativo, nunca bloqueia.
import { readFileSync } from "node:fs";

const EVENT = process.argv[2] || "";

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
  emit(
    "⚖️ advogado-pt ativo — assessoria jurídica de Portugal. " +
      "Comandos: /advogado, /parecer, /cobrar, /contrato, /prazo, /defesa, /rgpd, /despedir, /comprar-imovel. " +
      "Calculadoras e referências via tools MCP. Os valores de 2026 estão em valores-2026; confirma sempre prazos a correr. " +
      "Orientação informativa — não substitui advogado inscrito na OA."
  );
}

const SINAIS = /\b(contrato|cláusula|clausula|NDA|arrendamento|interpela|resolu[çc][aã]o do contrato|cessão|honor[aá]rios)\b/i;

function postToolUse(payload) {
  try {
    const ti = payload.tool_input || payload.toolInput || {};
    const alvo = `${ti.file_path || ti.path || ""}\n${ti.content || ti.new_string || ""}`;
    if (!SINAIS.test(alvo)) return; // só fala quando parece um documento jurídico
    emit(
      "📝 Documento jurídico detetado. Lembra: identificar as partes, objeto, preço/prazos, " +
        "lei aplicável e foro (ou arbitragem), proteção de dados se aplicável, e — em comunicações — " +
        "enviar por registado com AR quando recomendável. Confere o template correspondente em assets/templates/."
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
