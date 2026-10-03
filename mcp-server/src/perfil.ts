// Perfil da empresa do utilizador, guardado em ficheiro local e editável:
//   <projeto>/.advogado-pt/perfil-empresa.md   (prioridade — a empresa deste projeto)
//   ~/.advogado-pt/perfil-empresa.md           (perfil geral — a empresa por defeito)
// Formato: uma linha "campo: valor" por campo. Só os campos de CAMPOS_PERFIL contam.
// O hook (hooks/advogado-hook.mjs) tem um leitor equivalente — manter os dois alinhados.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

export const CAMPOS_PERFIL = [
  "forma_juridica",
  "denominacao",
  "setor",
  "trabalhadores",
  "volume_negocios",
  "regime_iva",
  "contabilidade",
  "clientes",
  "dados_pessoais",
  "linguas",
  "notas",
  "atualizado_em",
] as const;

const ROTULOS: Record<string, string> = {
  forma_juridica: "Forma jurídica (ENI, Unipessoal Lda, Lda, SA, associação, particular…)",
  denominacao: "Denominação / firma",
  setor: "Setor de atividade (e CAE principal, se souber)",
  trabalhadores: "Número de trabalhadores",
  volume_negocios: "Volume de negócios anual (escalão)",
  regime_iva: "Regime de IVA (normal mensal/trimestral, isenção art. 53.º…)",
  contabilidade: "Contabilidade (organizada / regime simplificado)",
  clientes: "Clientes (B2B/B2C; nacionais, UE, fora da UE)",
  dados_pessoais: "Dados pessoais tratados (clientes, trabalhadores, saúde…)",
  linguas: "Línguas de trabalho",
  notas: "Notas (licenças, setor regulado, sócios…)",
};

const PASTA = ".advogado-pt";
const FICHEIRO = "perfil-empresa.md";
const MS_12_MESES = 365 * 24 * 60 * 60 * 1000;

export interface Perfil {
  origem: "projeto" | "geral";
  caminho: string;
  campos: Record<string, string>;
  desatualizado: boolean;
}

export interface OpcoesPerfil {
  /** Diretório do projeto (default: CLAUDE_PROJECT_DIR ou cwd). */
  projeto?: string;
  /** Diretório "home" do perfil geral (default: ADVOGADO_PT_HOME ou homedir()). */
  home?: string;
  hoje?: Date;
}

function dirProjeto(o: OpcoesPerfil): string {
  return resolve(o.projeto ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
}

function dirHome(o: OpcoesPerfil): string {
  return resolve(o.home ?? process.env.ADVOGADO_PT_HOME ?? homedir());
}

function caminhoPerfil(base: string): string {
  return join(base, PASTA, FICHEIRO);
}

/** Lê os campos reconhecidos de um texto "campo: valor". */
export function parsePerfil(texto: string): Record<string, string> {
  const campos: Record<string, string> = {};
  for (const linha of texto.split(/\r?\n/)) {
    const m = /^\s*([a-z_]+)\s*:\s*(.*?)\s*$/.exec(linha);
    if (!m) continue;
    if ((CAMPOS_PERFIL as readonly string[]).includes(m[1]) && m[2] !== "") campos[m[1]] = m[2];
  }
  return campos;
}

function estaDesatualizado(campos: Record<string, string>, hoje: Date): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(campos.atualizado_em ?? "");
  if (!m) return true;
  const data = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return hoje.getTime() - data > MS_12_MESES;
}

function lerDe(caminho: string, origem: Perfil["origem"], hoje: Date): Perfil | null {
  try {
    if (!existsSync(caminho)) return null;
    const campos = parsePerfil(readFileSync(caminho, "utf8"));
    const reconhecidos = Object.keys(campos).filter((k) => k !== "atualizado_em");
    if (reconhecidos.length === 0) return null;
    return { origem, caminho, campos, desatualizado: estaDesatualizado(campos, hoje) };
  } catch {
    return null; // ilegível -> como se não existisse (fail-open)
  }
}

/** Perfil do projeto, ou o geral se o projeto não tiver; null se nenhum. */
export function lerPerfil(opts: OpcoesPerfil = {}): Perfil | null {
  const hoje = opts.hoje ?? new Date();
  return (
    lerDe(caminhoPerfil(dirProjeto(opts)), "projeto", hoje) ??
    lerDe(caminhoPerfil(dirHome(opts)), "geral", hoje)
  );
}

function umaLinha(v: string): string {
  return String(v).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function serializar(campos: Record<string, string>): string {
  const linhas = [
    "# Perfil da empresa — advogado-pt",
    "",
    "<!-- Gerido pelo advogado-pt. Podes editar à mão: uma linha `campo: valor` por campo.",
    "     Não guardes aqui dados pessoais de trabalhadores ou clientes. -->",
    "",
  ];
  for (const c of CAMPOS_PERFIL) if (campos[c]) linhas.push(`${c}: ${campos[c]}`);
  return linhas.join("\n") + "\n";
}

/** Grava (fundindo com o existente) o perfil no projeto ou no perfil geral. */
export function guardarPerfil(
  novos: Record<string, string>,
  destino: "projeto" | "geral",
  opts: OpcoesPerfil = {}
): Perfil {
  const base = destino === "projeto" ? dirProjeto(opts) : dirHome(opts);
  if (!existsSync(base) || !statSync(base).isDirectory()) {
    throw new Error(`O diretório '${base}' não existe.`);
  }
  const caminho = caminhoPerfil(base);
  let atuais: Record<string, string> = {};
  try {
    if (existsSync(caminho)) atuais = parsePerfil(readFileSync(caminho, "utf8"));
  } catch {
    atuais = {};
  }
  const campos: Record<string, string> = { ...atuais };
  for (const [k, v] of Object.entries(novos ?? {})) {
    if (k === "atualizado_em") continue;
    if (!(CAMPOS_PERFIL as readonly string[]).includes(k)) continue;
    const valor = umaLinha(v ?? "");
    if (valor) campos[k] = valor;
  }
  const hoje = opts.hoje ?? new Date();
  campos.atualizado_em = hoje.toISOString().slice(0, 10);
  mkdirSync(join(base, PASTA), { recursive: true });
  writeFileSync(caminho, serializar(campos), "utf8");
  return { origem: destino, caminho, campos, desatualizado: false };
}

/** Resumo de uma linha para o contexto ("forma_juridica: Lda · setor: …"). */
export function resumoPerfil(p: Perfil): string {
  return CAMPOS_PERFIL.filter((c) => c !== "atualizado_em" && p.campos[c])
    .map((c) => `${c}: ${p.campos[c]}`)
    .join(" · ");
}

/** O que perguntar quando não há perfil (só o que for relevante para a questão). */
export function textoPerguntasPerfil(): string {
  const itens = CAMPOS_PERFIL.filter((c) => c !== "atualizado_em").map(
    (c) => `- ${c} — ${ROTULOS[c]}`
  );
  return [
    "Sem perfil da empresa guardado. Pergunta APENAS os campos relevantes para a questão em curso:",
    ...itens,
    "",
    "Depois oferece guardar com `guardar_perfil_empresa`, à escolha do utilizador:",
    "- destino \"projeto\" -> <projeto>/.advogado-pt/perfil-empresa.md (esta empresa/pasta)",
    "- destino \"geral\" -> ~/.advogado-pt/perfil-empresa.md (empresa por defeito em todas as pastas)",
    "Nunca guardes dados de outra entidade (ex.: um cliente) como perfil do utilizador.",
  ].join("\n");
}
