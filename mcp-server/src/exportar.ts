// Exportação de um documento (Markdown ou template) para `.juridico-pt/exportados/<nome>.docx`.
// Escrita via fs-seguro (sem seguir ligações, temporário + renomeação), dentro do projeto.
import { PASTA_DADOS } from "./dados.js";
import { ler } from "./content.js";
import { gerarDocx } from "./docx.js";
import { dirProjeto, escreverSeguro } from "./fs-seguro.js";

const NOME_RE = /^[a-z0-9][a-z0-9-]{0,60}$/;

export interface PedidoExportacao {
  /** Texto em Markdown (o documento já preenchido). */
  conteudo?: string;
  /** Ou o nome de um template (assets/templates/<nome>.md), exportado tal como está. */
  template?: string;
  /** Nome do ficheiro, sem extensão: minúsculas, algarismos e hífens. */
  nome: string;
  projeto?: string;
}

export function exportarDocumento(p: PedidoExportacao): { caminho: string; bytes: number; placeholders: number } {
  const nome = String(p.nome ?? "").trim().toLowerCase().replace(/\.docx$/, "");
  if (!NOME_RE.test(nome)) throw new Error(`Nome de ficheiro inválido: '${p.nome}' (usa letras minúsculas, algarismos e hífens).`);
  if ((p.conteudo === undefined) === (p.template === undefined)) {
    throw new Error("Indica o conteúdo (Markdown) OU o nome de um template — um dos dois.");
  }
  let md = p.conteudo ?? "";
  if (p.template !== undefined) {
    const t = ler("templates", String(p.template).trim());
    if (t === null) throw new Error(`Template não encontrado: '${p.template}' (vê listar_templates).`);
    md = t;
  }
  if (!md.trim()) throw new Error("O documento está vazio.");
  const bytes = gerarDocx(md);
  const caminho = escreverSeguro(dirProjeto(p.projeto), [PASTA_DADOS, "exportados", `${nome}.docx`], bytes);
  const placeholders = (md.match(/\{\{[A-Z0-9_]+(?::[^{}]*)?\}\}/g) ?? []).length;
  return { caminho, bytes: bytes.length, placeholders };
}
