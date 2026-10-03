// Carregador do conteúdo jurídico empacotado (referências, templates, checklists,
// playbooks, SKILL.md). O conteúdo é copiado para `content/` por scripts/bundle-content.mjs
// e incluído no pacote npm, tornando o servidor autossuficiente.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// dist/content.js -> ../content
export const CONTENT_DIR = resolve(here, "..", "content");

export type Categoria = "references" | "templates" | "checklists" | "playbooks";

export const CATEGORIAS: Categoria[] = [
  "references",
  "templates",
  "checklists",
  "playbooks",
];

const LABEL: Record<Categoria, string> = {
  references: "Referência",
  templates: "Template",
  checklists: "Checklist",
  playbooks: "Playbook",
};

function dir(cat: Categoria): string {
  return join(CONTENT_DIR, cat);
}

/** Lista os nomes (sem extensão .md) de uma categoria, ordenados, excluindo READMEs de índice. */
export function listar(cat: Categoria): string[] {
  const d = dir(cat);
  if (!existsSync(d)) return [];
  return readdirSync(d)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => f.slice(0, -3))
    .sort();
}

// Nomes de conteúdo: só letras, algarismos e hífens (sem pontos nem separadores — nada sai de content/).
const NOME_CONTEUDO = /^[a-z0-9][a-z0-9-]{0,80}$/i;

/** Indica se `cat`/`nome` são uma categoria conhecida e um nome válido (lista fechada). */
export function itemValido(cat: string, nome: string): cat is Categoria {
  return (CATEGORIAS as string[]).includes(cat) && NOME_CONTEUDO.test(String(nome ?? "").replace(/\.md$/i, ""));
}

/** Lê o markdown de um item; devolve null se a categoria, o nome ou o ficheiro não existirem. */
export function ler(cat: Categoria, nome: string): string | null {
  // Aceita com ou sem .md; recusa categorias desconhecidas e nomes com "..", "/" ou "\".
  const limpo = String(nome ?? "").trim().replace(/\.md$/i, "");
  if (!itemValido(cat, limpo)) return null;
  const caminho = join(dir(cat), `${limpo}.md`);
  if (!existsSync(caminho)) return null;
  return readFileSync(caminho, "utf8");
}

/** Lê o SKILL.md (persona/fluxo). */
export function lerSkill(): string {
  const caminho = join(CONTENT_DIR, "SKILL.md");
  return existsSync(caminho) ? readFileSync(caminho, "utf8") : "";
}

export type Ambito = "nacional" | "ue" | "misto";

export interface ResultadoProcura {
  categoria: Categoria;
  nome: string;
  linhas: string[];
  ambito?: Ambito | null;
}

/** Procura case-insensitive por todo o conteúdo; devolve até `maxFicheiros` ficheiros com trechos. */
export function procurar(query: string, maxFicheiros = 12): ResultadoProcura[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const out: ResultadoProcura[] = [];
  for (const cat of CATEGORIAS) {
    for (const nome of listar(cat)) {
      const texto = ler(cat, nome);
      if (!texto) continue;
      if (!texto.toLowerCase().includes(q)) continue;
      const linhas = texto
        .split("\n")
        .filter((l) => l.toLowerCase().includes(q))
        .slice(0, 3)
        .map((l) => l.trim());
      out.push({ categoria: cat, nome, linhas, ambito: lerAmbito(texto) });
      if (out.length >= maxFicheiros) return out;
    }
  }
  return out;
}

/** Lista todos os itens de conteúdo (para resources). */
export function listarTudo(): Array<{ categoria: Categoria; nome: string; label: string }> {
  const out: Array<{ categoria: Categoria; nome: string; label: string }> = [];
  for (const cat of CATEGORIAS) {
    for (const nome of listar(cat)) {
      out.push({ categoria: cat, nome, label: LABEL[cat] });
    }
  }
  return out;
}

// --- Âmbito (nacional / ue / misto) e pesquisa agrupada ---

const RE_AMBITO = /Âmbito:\**\s*(nacional|ue|misto)\b/i;
const NL = "\n";

/** Lê o âmbito declarado numa linha `Âmbito:` nas primeiras 15 linhas; null se não houver. */
export function lerAmbito(texto: string): Ambito | null {
  const topo = texto.split(NL).slice(0, 15).join(NL);
  const m = RE_AMBITO.exec(topo);
  return m ? (m[1].toLowerCase() as Ambito) : null;
}

/** Lista os itens de uma categoria com o respetivo âmbito. */
export function listarComAmbito(cat: Categoria): Array<{ nome: string; ambito: Ambito | null }> {
  return listar(cat).map((nome) => ({ nome, ambito: lerAmbito(ler(cat, nome) ?? "") }));
}

const TITULO_GRUPO: Record<Categoria, string> = {
  references: "Referências",
  templates: "Templates",
  playbooks: "Playbooks",
  checklists: "Checklists",
};
const ORDEM_GRUPOS: Categoria[] = ["references", "templates", "playbooks", "checklists"];

/** Formata resultados de `procurar` agrupados por tipo, com o âmbito de cada item. */
export function formatarProcura(res: ResultadoProcura[]): string {
  const blocos: string[] = [];
  for (const cat of ORDEM_GRUPOS) {
    const itens = res.filter((r) => r.categoria === cat);
    if (itens.length === 0) continue;
    const linhas = itens.map(
      (r) => `• ${r.nome}${r.ambito ? ` (${r.ambito})` : ""}${NL}   ${r.linhas.join(NL + "   ")}`
    );
    blocos.push(`## ${TITULO_GRUPO[cat]}${NL}${linhas.join(NL)}`);
  }
  return blocos.join(NL + NL);
}
