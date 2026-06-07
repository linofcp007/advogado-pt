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
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.slice(0, -3))
    .sort();
}

/** Lê o markdown de um item; devolve null se não existir. */
export function ler(cat: Categoria, nome: string): string | null {
  // normaliza: aceita com ou sem .md, e ignora caminhos
  const limpo = nome.replace(/\.md$/i, "").replace(/[\\/]/g, "");
  const caminho = join(dir(cat), `${limpo}.md`);
  if (!existsSync(caminho)) return null;
  return readFileSync(caminho, "utf8");
}

/** Lê o SKILL.md (persona/fluxo). */
export function lerSkill(): string {
  const caminho = join(CONTENT_DIR, "SKILL.md");
  return existsSync(caminho) ? readFileSync(caminho, "utf8") : "";
}

export interface ResultadoProcura {
  categoria: Categoria;
  nome: string;
  linhas: string[];
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
      out.push({ categoria: cat, nome, linhas });
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
