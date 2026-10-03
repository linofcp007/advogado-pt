// Perfil da empresa do utilizador, guardado em ficheiro local e editável:
//   <projeto>/.juridico-pt/perfil-empresa.md   (prioridade — a empresa deste projeto)
//   ~/.juridico-pt/perfil-empresa.md           (perfil geral — a empresa por defeito; JURIDICO_PT_HOME)
// Formato: uma linha "campo: valor" por campo. Só os campos de CAMPOS_PERFIL contam.
// O hook (hooks/juridico-hook.mjs) tem um leitor equivalente — manter os dois alinhados.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PASTA_DADOS, NOME_PERFIL_RE, avisoGitignore, dirHome as dirHomeBase, validarNomePerfil } from "./dados.js";
import { apagarSeguro, dirProjeto as dirProjetoBase, escreverSeguro, listarSeguro } from "./fs-seguro.js";
import { removerPrazosDoPerfil } from "./prazos-estado.js";

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
  // v2.0 (modo contabilista e calendário)
  "cae",
  "concelho",
  "fim_periodo_tributacao",
  "imoveis",
  "viaturas",
  "setor_nis2",
  "vendas_b2c",
  "trabalhadores_estrangeiros",
  "emite_faturas",
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
  cae: "CAE principal",
  concelho: "Concelho da sede (derrama, IMI)",
  fim_periodo_tributacao: "Fim do período de tributação, se não for 31/12 (MM-DD, ex.: 06-30)",
  imoveis: "Tem imóveis (sim/não) — IMI",
  viaturas: "Tem viaturas (sim/não; meses da matrícula, ex.: sim (março, julho)) — IUC",
  setor_nis2: "Setor dos anexos da NIS2, se aplicável (DL 125/2025)",
  vendas_b2c: "Vende a consumidores (sim/não; online, loja física)",
  trabalhadores_estrangeiros: "Tem trabalhadores estrangeiros (sim/não)",
  emite_faturas: "Emite faturas (sim/não; programa certificado ou Portal das Finanças)",
};

const PASTA = PASTA_DADOS;
const FICHEIRO = "perfil-empresa.md";
const MS_12_MESES = 365 * 24 * 60 * 60 * 1000;

export interface Perfil {
  origem: "projeto" | "geral";
  caminho: string;
  campos: Record<string, string>;
  desatualizado: boolean;
  /** Nome do perfil nomeado (`perfis/<nome>.md`); ausente = perfil por defeito. */
  nome?: string;
  /** Aviso a mostrar (ex.: perfil ativo inexistente). */
  aviso?: string;
  /** Projeto num repositório git cujo .gitignore não exclui `.juridico-pt/`. */
  avisoGitignore?: string;
}

export interface OpcoesPerfil {
  /** Perfil nomeado (`.juridico-pt/perfis/<nome>.md`); omitido = perfil ativo ou o por defeito. */
  perfil?: string;
  /** Diretório do projeto (default: CLAUDE_PROJECT_DIR ou cwd). */
  projeto?: string;
  /** Diretório "home" do perfil geral (default: JURIDICO_PT_HOME ou homedir()). */
  home?: string;
  hoje?: Date;
  /** Num repositório git, acrescentar `.juridico-pt/` ao .gitignore (uma só vez). */
  acrescentarGitignore?: boolean;
}

function dirProjeto(o: OpcoesPerfil): string {
  return dirProjetoBase(o.projeto);
}

function dirHome(o: OpcoesPerfil): string {
  return dirHomeBase(o.home);
}

function caminhoPerfil(base: string): string {
  return join(base, PASTA, FICHEIRO);
}

const NOME_RE = NOME_PERFIL_RE;
const validarNome = validarNomePerfil;

function caminhoNomeado(base: string, nome: string): string {
  return join(base, PASTA, "perfis", `${nome}.md`);
}

/** Nome guardado em `<base>/.juridico-pt/perfil-ativo`, se válido. */
function nomeAtivoEm(base: string): string | null {
  try {
    const f = join(base, PASTA, "perfil-ativo");
    if (!existsSync(f)) return null;
    const n = readFileSync(f, "utf8").split(/\r?\n/)[0].trim().toLowerCase();
    return NOME_RE.test(n) ? n : null;
  } catch {
    return null;
  }
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

function lerPorDefeito(opts: OpcoesPerfil, hoje: Date): Perfil | null {
  return (
    lerDe(caminhoPerfil(dirProjeto(opts)), "projeto", hoje) ??
    lerDe(caminhoPerfil(dirHome(opts)), "geral", hoje)
  );
}

function lerNomeado(nome: string, opts: OpcoesPerfil, hoje: Date): Perfil | null {
  const p =
    lerDe(caminhoNomeado(dirProjeto(opts), nome), "projeto", hoje) ??
    lerDe(caminhoNomeado(dirHome(opts), nome), "geral", hoje);
  return p ? { ...p, nome } : null;
}

/** Nome do perfil ativo (projeto tem prioridade sobre o geral), se houver. */
export function nomePerfilAtivo(opts: OpcoesPerfil = {}): string | null {
  return nomeAtivoEm(dirProjeto(opts)) ?? nomeAtivoEm(dirHome(opts));
}

/**
 * Perfil a usar: o nomeado pedido em `opts.perfil`; senão o perfil ativo
 * (`.juridico-pt/perfil-ativo`); senão o por defeito (`perfil-empresa.md`, projeto -> geral).
 * Se o nomeado/ativo não existir, devolve o por defeito com `aviso`. null se nenhum.
 */
export function lerPerfil(opts: OpcoesPerfil = {}): Perfil | null {
  const hoje = opts.hoje ?? new Date();
  const pedido = opts.perfil ? validarNome(opts.perfil) : nomePerfilAtivo(opts);
  if (pedido) {
    const p = lerNomeado(pedido, opts, hoje);
    if (p) return p;
    const d = lerPorDefeito(opts, hoje);
    const aviso = `Perfil '${pedido}' não encontrado — a usar o perfil por defeito.`;
    return d ? { ...d, aviso } : null;
  }
  return lerPorDefeito(opts, hoje);
}

function umaLinha(v: string): string {
  return String(v).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function serializar(campos: Record<string, string>): string {
  const linhas = [
    "# Perfil da empresa — juridico-pt",
    "",
    "<!-- Gerido pelo juridico-pt. Podes editar à mão: uma linha `campo: valor` por campo.",
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
  const nome = opts.perfil ? validarNome(opts.perfil) : undefined;
  const caminho = nome ? caminhoNomeado(base, nome) : caminhoPerfil(base);
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
  // Escrita segura: recusa ligações (symlink/junction) e grava por temporário + renomeação.
  escreverSeguro(base, nome ? [PASTA, "perfis", `${nome}.md`] : [PASTA, FICHEIRO], serializar(campos));
  const aviso = destino === "projeto" ? avisoGitignore(base, opts.acrescentarGitignore === true) : undefined;
  return {
    origem: destino, caminho, campos, desatualizado: false,
    ...(nome ? { nome } : {}),
    ...(aviso ? { avisoGitignore: aviso } : {}),
  };
}

// --- v2.0: privacidade (US-11) ---

/**
 * Apaga um perfil e o que lhe pertence (direito ao apagamento, RGPD art. 17.º): o ficheiro do perfil,
 * os prazos com esse perfil, os calendários `.ics` do perfil e a marca de perfil ativo, se for ele.
 * `nome` "perfil-empresa" apaga o perfil por defeito. Recusa nomes inválidos e ligações.
 */
export function apagarPerfil(
  nome: string,
  destino: "projeto" | "geral" = "projeto",
  opts: OpcoesPerfil = {}
): { apagados: string[] } {
  const n = validarNome(nome);
  const base = destino === "projeto" ? dirProjeto(opts) : dirHome(opts);
  const apagados: string[] = [];
  const ficheiro = n === "perfil-empresa" ? [PASTA, FICHEIRO] : [PASTA, "perfis", `${n}.md`];
  const f = apagarSeguro(base, ficheiro);
  if (f) apagados.push(f);
  if (destino === "projeto" && n !== "perfil-empresa") {
    const k = removerPrazosDoPerfil(n, base);
    if (k > 0) apagados.push(`${k} prazo(s) do perfil '${n}' em ${PASTA}/prazos.md`);
  }
  const ics = n === "perfil-empresa" ? /^calendario-\d{4}\.ics$/ : new RegExp(`^calendario-\\d{4}-${n}\\.ics$`);
  for (const nomeF of listarSeguro(base, [PASTA]).filter((x) => ics.test(x))) {
    const c = apagarSeguro(base, [PASTA, nomeF]);
    if (c) apagados.push(c);
  }
  if (nomeAtivoEm(base) === n) {
    const c = apagarSeguro(base, [PASTA, "perfil-ativo"]);
    if (c) apagados.push(`${c} (perfil ativo reposto)`);
  }
  return { apagados };
}

/** Resumo de uma linha para o contexto ("forma_juridica: Lda · setor: …"). */
export function resumoPerfil(p: Perfil): string {
  // Mesmos limites que o hook (200 por campo, 1500 no total): o perfil pode vir de um repositório de terceiros.
  const limpo = (v: string) => v.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
  const r = CAMPOS_PERFIL.filter((c) => c !== "atualizado_em" && p.campos[c])
    .map((c) => {
      const v = limpo(p.campos[c]);
      return `${c}: ${v.length > 200 ? v.slice(0, 199) + "…" : v}`;
    })
    .join(" · ");
  return r.length > 1500 ? r.slice(0, 1499) + "…" : r;
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
    "- destino \"projeto\" -> <projeto>/.juridico-pt/perfil-empresa.md (esta empresa/pasta)",
    "- destino \"geral\" -> ~/.juridico-pt/perfil-empresa.md (empresa por defeito em todas as pastas)",
    "Nunca guardes dados de outra entidade (ex.: um cliente) como perfil do utilizador.",
  ].join("\n");
}

// --- v1.2: vários perfis (contabilistas / consultores com muitos clientes) ---

/** Perfis nomeados existentes (projeto e geral), com o ativo assinalado. */
export function listarPerfis(opts: OpcoesPerfil = {}): Array<{ nome: string; origem: "projeto" | "geral"; ativo: boolean }> {
  const ativo = nomePerfilAtivo(opts);
  const vistos = new Map<string, "projeto" | "geral">();
  for (const [base, origem] of [[dirProjeto(opts), "projeto"], [dirHome(opts), "geral"]] as const) {
    try {
      const dir = join(base, PASTA, "perfis");
      if (!existsSync(dir)) continue;
      for (const f of readdirSync(dir)) {
        const n = f.replace(/\.md$/i, "").toLowerCase();
        if (f.toLowerCase().endsWith(".md") && NOME_RE.test(n) && !vistos.has(n)) vistos.set(n, origem);
      }
    } catch {
      /* ilegível: ignora */
    }
  }
  return [...vistos.entries()].map(([nome, origem]) => ({ nome, origem, ativo: nome === ativo }));
}

/** Define o perfil ativo (escreve `.juridico-pt/perfil-ativo` no projeto ou no geral). */
export function ativarPerfil(nome: string, destino: "projeto" | "geral", opts: OpcoesPerfil = {}): void {
  const n = validarNome(nome);
  const base = destino === "projeto" ? dirProjeto(opts) : dirHome(opts);
  escreverSeguro(base, [PASTA, "perfil-ativo"], n + "\n");
}
