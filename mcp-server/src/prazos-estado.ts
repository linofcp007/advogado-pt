// Prazos em curso do projeto, guardados em <projeto>/.advogado-pt/prazos.md (editável à mão).
// Uma linha por prazo:  "- [ ] 2026-10-20 — Oposição à execução fiscal — art. 203.º CPPT"
//                        caixa · data-limite · descrição · origem (opcional)
// Concluído = "- [x]". O hook (hooks/advogado-hook.mjs) tem um leitor equivalente — manter alinhados.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { dirProjeto, escreverSeguro } from "./fs-seguro.js";

export interface PrazoRegistado {
  data: string;
  descricao: string;
  origem?: string;
  concluido: boolean;
}

const PASTA = ".advogado-pt";
const FICHEIRO = "prazos.md";
const SEP = " — ";
const LINHA_RE = /^\s*-\s*\[( |x|X)\]\s*(\d{4}-\d{2}-\d{2})\s*[—–]\s*(.+?)\s*$/;
const CABECALHO =
  "# Prazos em curso\n\n" +
  "<!-- advogado-pt: uma linha por prazo — \"- [ ] AAAA-MM-DD — descrição — origem\". " +
  "Marca [x] quando cumprido. O aviso aparece ao abrir a sessão (vencidos e próximos 7 dias). -->\n\n";

// Mesmo diretório que o hook lê: o indicado, senão CLAUDE_PROJECT_DIR, senão o cwd.
function dirBase(dir?: string): string {
  return dirProjeto(dir);
}

function caminho(dir?: string): string {
  return join(dirBase(dir), PASTA, FICHEIRO);
}

/** Valida "AAAA-MM-DD" como data real. */
function validarData(data: string): string {
  const s = String(data ?? "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3]) return s;
  }
  throw new Error(`Data inválida: '${data}' (usa AAAA-MM-DD).`);
}

/** Texto de uma linha só, sem o separador " — " (reservado para a origem). */
function limpar(texto: string): string {
  return String(texto ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+[—–]\s+/g, " - ")
    .trim();
}

function parseLinha(linha: string): PrazoRegistado | null {
  const m = LINHA_RE.exec(linha);
  if (!m) return null;
  const partes = m[3].split(/\s+[—–]\s+/);
  const descricao = partes[0].trim();
  if (!descricao) return null;
  const origem = partes.slice(1).join(SEP).trim();
  return { data: m[2], descricao, ...(origem ? { origem } : {}), concluido: m[1] !== " " };
}

function linhaDe(p: PrazoRegistado): string {
  return `- [${p.concluido ? "x" : " "}] ${p.data}${SEP}${p.descricao}${p.origem ? SEP + p.origem : ""}`;
}

/** Prazos do ficheiro (ordem do ficheiro); [] se não existir. */
export function lerPrazos(dir?: string): PrazoRegistado[] {
  const f = caminho(dir);
  if (!existsSync(f)) return [];
  const out: PrazoRegistado[] = [];
  for (const linha of readFileSync(f, "utf8").split(/\r?\n/)) {
    const p = parseLinha(linha);
    if (p) out.push(p);
  }
  return out;
}

/**
 * Grava os prazos preservando tudo o que não é linha de prazo (títulos, notas escritas à mão):
 * as linhas de prazo, ordenadas, ocupam o lugar da primeira que existia (ou vão para o fim).
 */
function gravar(prazos: PrazoRegistado[], dir?: string): void {
  const ordenados = [...prazos].sort(
    (a, b) => Number(a.concluido) - Number(b.concluido) || a.data.localeCompare(b.data)
  );
  const novas = ordenados.map(linhaDe);
  let atual: string | null = null;
  try {
    const f = caminho(dir);
    if (existsSync(f)) atual = readFileSync(f, "utf8");
  } catch {
    atual = null;
  }
  let texto: string;
  if (atual === null) {
    texto = CABECALHO + novas.join("\n") + "\n";
  } else {
    const saida: string[] = [];
    let inseridas = false;
    for (const linha of atual.split(/\r?\n/)) {
      if (parseLinha(linha)) {
        if (!inseridas) {
          saida.push(...novas);
          inseridas = true;
        }
        continue;
      }
      saida.push(linha);
    }
    while (saida.length && saida[saida.length - 1].trim() === "") saida.pop();
    if (!inseridas) saida.push("", ...novas);
    texto = saida.join("\n") + "\n";
  }
  // Escrita segura: recusa ligações (symlink/junction) e grava por temporário + renomeação.
  escreverSeguro(dirBase(dir), [PASTA, FICHEIRO], texto);
}

/** Regista um prazo (data AAAA-MM-DD obrigatória e válida). */
export function registarPrazo(
  p: { data: string; descricao: string; origem?: string },
  dir?: string
): PrazoRegistado {
  const data = validarData(p.data);
  const descricao = limpar(p.descricao);
  if (!descricao) throw new Error("Falta a descrição do prazo.");
  const origem = p.origem ? limpar(p.origem) : "";
  const novo: PrazoRegistado = { data, descricao, ...(origem ? { origem } : {}), concluido: false };
  const atuais = lerPrazos(dir);
  if (!atuais.some((x) => x.data === data && x.descricao === descricao && !x.concluido)) atuais.push(novo);
  gravar(atuais, dir);
  return novo;
}

/** Marca como cumprido o prazo com esta data e descrição; false se não existir em aberto. */
export function concluirPrazo(data: string, descricao: string, dir?: string): boolean {
  const d = validarData(data);
  const desc = limpar(descricao).toLowerCase();
  const atuais = lerPrazos(dir);
  const alvo = atuais.find((x) => !x.concluido && x.data === d && x.descricao.toLowerCase() === desc);
  if (!alvo) return false;
  alvo.concluido = true;
  gravar(atuais, dir);
  return true;
}

/** Data civil de hoje em Portugal continental (AAAA-MM-DD); recurso: UTC. */
export function hojeEmLisboa(hoje: Date): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(hoje);
  } catch {
    return hoje.toISOString().slice(0, 10);
  }
}

function diasEntre(deIso: string, ateIso: string): number {
  const a = Date.parse(`${deIso}T00:00:00Z`);
  const b = Date.parse(`${ateIso}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

/** Prazos em aberto já vencidos e os que terminam nos `dias` seguintes (por data). */
export function prazosProximos(
  prazos: PrazoRegistado[],
  hoje: Date,
  dias = 7
): { vencidos: PrazoRegistado[]; proximos: Array<PrazoRegistado & { faltam: number }> } {
  const h = hojeEmLisboa(hoje);
  const abertos = prazos.filter((p) => !p.concluido).sort((a, b) => a.data.localeCompare(b.data));
  const vencidos = abertos.filter((p) => p.data < h);
  const proximos = abertos
    .map((p) => ({ ...p, faltam: diasEntre(h, p.data) }))
    .filter((p) => p.faltam >= 0 && p.faltam <= dias);
  return { vencidos, proximos };
}
