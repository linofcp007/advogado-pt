// Pasta de dados locais do plugin: `<projeto>/.juridico-pt/` (esta empresa/pasta) e
// `<home>/.juridico-pt/` (perfil geral), com <home> = JURIDICO_PT_HOME ou a pasta do utilizador.
// Não lê nem migra `.advogado-pt/` (D-1: a renomeação da 2.0 é direta). Escrita via `fs-seguro`.
// O hook (hooks/juridico-hook.mjs) resolve as mesmas pastas — manter os dois alinhados.
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { dirProjeto, escreverSeguro } from "./fs-seguro.js";

/** Nome da pasta de dados, no projeto e no perfil geral. */
export const PASTA_DADOS = ".juridico-pt";

/** Diretório "home" do perfil geral: o indicado, senão JURIDICO_PT_HOME, senão a pasta do utilizador. */
export function dirHome(home?: string): string {
  return resolve(home ?? process.env.JURIDICO_PT_HOME ?? homedir());
}

/** `<projeto>/.juridico-pt` (projeto: o indicado, senão CLAUDE_PROJECT_DIR, senão o cwd). */
export function pastaProjeto(projeto?: string): string {
  return join(dirProjeto(projeto), PASTA_DADOS);
}

/** Nome de perfil: minúsculas, algarismos e hífens (é também o nome do ficheiro). */
export const NOME_PERFIL_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;

export function validarNomePerfil(nome: string): string {
  const n = String(nome ?? "").trim().toLowerCase();
  if (!NOME_PERFIL_RE.test(n)) {
    throw new Error(`Nome de perfil inválido: '${nome}' (usa letras minúsculas, algarismos e hífens).`);
  }
  return n;
}

/** `<home>/.juridico-pt` do perfil geral. */
export function pastaGeral(home?: string): string {
  return join(dirHome(home), PASTA_DADOS);
}

// --- Privacidade (US-11.AC-1): a pasta de dados num repositório git ---

const LINHA_GITIGNORE = `${PASTA_DADOS}/`;

// O .gitignore exclui a pasta de dados? Aceita .juridico-pt, /.juridico-pt/, .juridico-pt/* e a forma com **/ antes.
function gitignoreExclui(texto: string): boolean {
  return texto.split(/\r?\n/).some((l) => /^(\*\*\/|\/)?\.juridico-pt(\/\*{0,2})?\s*$/.test(l.trim()));
}

/** Raiz do repositório git que contém `base` (pasta ou ficheiro `.git`), ou null. */
function raizGit(base: string): string | null {
  let d = resolve(base);
  for (let i = 0; i < 40; i++) {
    if (existsSync(join(d, ".git"))) return d;
    const pai = dirname(d);
    if (pai === d) return null;
    d = pai;
  }
  return null;
}

function lerSeExistir(f: string): string {
  try {
    return existsSync(f) ? readFileSync(f, "utf8") : "";
  } catch {
    return "";
  }
}

/**
 * Num repositório git cujo .gitignore (do projeto ou da raiz do repositório) não exclui `.juridico-pt/`,
 * devolve o aviso a mostrar; com `acrescentar`, junta a linha ao .gitignore do projeto (uma só vez).
 * Nunca lança: o aviso não pode impedir a gravação dos dados.
 */
export function avisoGitignore(base: string, acrescentar = false): string | undefined {
  try {
    const raiz = raizGit(base);
    if (!raiz) return undefined;
    const proprio = join(resolve(base), ".gitignore");
    if (gitignoreExclui(lerSeExistir(proprio)) || gitignoreExclui(lerSeExistir(join(raiz, ".gitignore")))) return undefined;
    if (acrescentar) {
      try {
        const atual = lerSeExistir(proprio);
        const sep = atual === "" || atual.endsWith("\n") ? "" : "\n";
        escreverSeguro(base, [".gitignore"], `${atual}${sep}${LINHA_GITIGNORE}\n`);
        return undefined;
      } catch {
        return `Não foi possível acrescentar ${LINHA_GITIGNORE} ao .gitignore (é uma ligação ou não se pode escrever): acrescenta-a à mão — os dados do plugin podem ser publicados por engano.`;
      }
    }
  } catch {
    return undefined;
  }
  return (
    `Este projeto está num repositório git e o .gitignore não exclui ${LINHA_GITIGNORE}: o perfil da empresa, os prazos e os documentos ` +
    `podem ser publicados por engano. Acrescenta a linha \`${LINHA_GITIGNORE}\` ao .gitignore (ou grava o perfil com acrescentar_gitignore).`
  );
}
