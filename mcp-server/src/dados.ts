// Pasta de dados locais do plugin: `<projeto>/.juridico-pt/` (esta empresa/pasta) e
// `<home>/.juridico-pt/` (perfil geral), com <home> = JURIDICO_PT_HOME ou a pasta do utilizador.
// Não lê nem migra `.advogado-pt/` (D-1: a renomeação da 2.0 é direta). Escrita via `fs-seguro`.
// O hook (hooks/juridico-hook.mjs) resolve as mesmas pastas — manter os dois alinhados.
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { dirProjeto } from "./fs-seguro.js";

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
