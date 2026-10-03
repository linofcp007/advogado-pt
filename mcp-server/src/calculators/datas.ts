// Datas estritas (AAAA-MM-DD com verificação de calendário) e "hoje" em Lisboa.
// Partilhado pelas tools MCP e pelo CLI: uma data que não existe (2026-02-30) ou noutro
// formato é recusada nomeando o campo, em vez de ser normalizada pelo `Date`.

/** Converte "AAAA-MM-DD" numa data UTC à meia-noite; lança nomeando `campo` se for inválida. */
export function parseDataEstrita(texto: string, campo: string): Date {
  const s = typeof texto === "string" ? texto.trim() : "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) {
    const [a, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const d = new Date(Date.UTC(a, mes - 1, dia));
    if (d.getUTCFullYear() === a && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia) return d;
  }
  throw new Error(`Data inválida em '${campo}': '${String(texto).slice(0, 40)}'. Usa AAAA-MM-DD com uma data que exista.`);
}

/** Data civil de hoje em Portugal continental (AAAA-MM-DD); recurso: UTC. */
export function hojeLisboa(agora: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(agora);
  } catch {
    return agora.toISOString().slice(0, 10);
  }
}
