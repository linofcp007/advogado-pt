// Escrita segura dos dados locais do plugin (`<projeto>/.advogado-pt/` e `~/.advogado-pt/`).
//
// - `dirProjeto` resolve sempre o mesmo diretório que o hook lê (CLAUDE_PROJECT_DIR, senão o cwd).
// - `escreverSeguro` verifica cada componente abaixo da base com `lstat` e recusa symlinks e
//   junctions (um repositório de terceiros podia apontar `.advogado-pt` para fora do projeto);
//   grava num ficheiro temporário exclusivo e renomeia-o por cima do destino.
import { lstatSync, mkdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { randomBytes } from "node:crypto";

/** Diretório do projeto: o indicado, senão CLAUDE_PROJECT_DIR, senão o cwd. */
export function dirProjeto(projeto?: string): string {
  return resolve(projeto ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
}

function codigo(e: unknown): string | undefined {
  return (e as NodeJS.ErrnoException)?.code;
}

/** Estado de um caminho sem seguir links: "nenhum", "dir", "ficheiro"; lança se for uma ligação. */
function estado(caminho: string, nome: string): "nenhum" | "dir" | "ficheiro" {
  let st;
  try {
    st = lstatSync(caminho);
  } catch (e) {
    if (codigo(e) === "ENOENT") return "nenhum";
    throw new Error(`Não foi possível verificar '${nome}'.`);
  }
  if (st.isSymbolicLink()) {
    throw new Error(
      `Escrita recusada: '${nome}' é uma ligação (symlink ou junction). ` +
        "Por segurança, o plugin não escreve através de ligações — substitui-a por uma pasta normal."
    );
  }
  return st.isDirectory() ? "dir" : "ficheiro";
}

/**
 * Grava `conteudo` em `base/partes[0]/…/partes[n]`, criando as pastas em falta.
 * Recusa partes vazias, `.`/`..` ou com separadores, e qualquer componente que seja uma ligação.
 * Devolve o caminho final.
 */
export function escreverSeguro(base: string, partes: string[], conteudo: string): string {
  if (partes.length === 0) throw new Error("Caminho de destino vazio.");
  for (const p of partes) {
    if (!p || p === "." || p === ".." || /[\\/]/.test(p) || p.includes("\0")) {
      throw new Error(`Nome inválido no caminho de destino: '${p}'.`);
    }
  }
  const raiz = resolve(base);
  if (estado(raiz, raiz) !== "dir") throw new Error(`O diretório '${raiz}' não existe.`);

  let atual = raiz;
  const relativo: string[] = [];
  for (const pasta of partes.slice(0, -1)) {
    atual = join(atual, pasta);
    relativo.push(pasta);
    const e = estado(atual, relativo.join("/"));
    if (e === "nenhum") mkdirSync(atual);
    else if (e !== "dir") throw new Error(`'${relativo.join("/")}' existe e não é uma pasta.`);
  }
  const final = join(atual, partes[partes.length - 1]);
  if (estado(final, partes.join("/")) === "dir") throw new Error(`'${partes.join("/")}' é uma pasta.`);

  const tmp = `${final}.${process.pid}.${randomBytes(4).toString("hex")}.tmp`;
  try {
    // "wx": criação exclusiva — nunca escreve num ficheiro (ou ligação) que já exista.
    writeFileSync(tmp, conteudo, { encoding: "utf8", flag: "wx" });
    renameSync(tmp, final);
  } catch (e) {
    try {
      unlinkSync(tmp);
    } catch {
      /* o temporário pode já não existir */
    }
    if (e instanceof Error && /^(Escrita recusada|Nome inválido)/.test(e.message)) throw e;
    throw new Error(`Não foi possível gravar '${partes.join("/")}' (${codigo(e) ?? "erro de escrita"}).`);
  }
  return final;
}
