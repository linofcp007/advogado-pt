// Atualidade do conteúdo: que valores, taxas e tabelas do plugin já passaram da data de revisão.
// Lê o topo de references/valores-2026.md ("Próxima revisão" e "Juros de mora: taxas oficiais até ao
// N.º semestre de AAAA") e a tabela de taxas semestrais. O hook (hooks/juridico-hook.mjs) faz a mesma
// leitura do ficheiro de valores para o aviso no início da sessão — manter os dois alinhados.
import { ler } from "./content.js";
import { TAXAS_SEMESTRAIS } from "./calculators/juros.js";
import { hojeEmLisboa } from "./prazos-estado.js";

export interface ItemAtualidade {
  item: string;
  fonte: string;
  ultimaAtualizacao: string;
  proximaRevisao: string;
  desatualizado: boolean;
  nota?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Data (AAAA-MM-DD) a partir da qual falta a taxa do semestre seguinte ao último registado. */
export function limiteJuros(ano: number, semestre: 1 | 2): string {
  // O aviso da ETF sai no início de janeiro/julho; dá-se até ao dia 15 para o registar.
  return semestre === 1 ? `${ano}-07-15` : `${ano + 1}-01-15`;
}

/** Lê "Próxima revisão: AAAA-MM-DD", "Última atualização" e o último semestre de juros do topo do texto. */
export function lerCabecalhoValores(texto: string): { proxima: string | null; ultima: string | null; juros: { ano: number; semestre: 1 | 2 } | null } {
  const topo = texto.slice(0, 4000);
  const proxima = /\*\*Próxima revisão:\*\*\s*(\d{4}-\d{2}-\d{2})/.exec(topo)?.[1] ?? null;
  const ultima = /\*\*Última atualização:\*\*\s*(\d{4}-\d{2}(?:-\d{2})?)/.exec(topo)?.[1] ?? null;
  const j = /\*\*Juros de mora:\*\*[^\n]*?([12])\.º semestre de (\d{4})/.exec(topo);
  return { proxima, ultima, juros: j ? { ano: Number(j[2]), semestre: Number(j[1]) as 1 | 2 } : null };
}

/**
 * Coeficiente de atualização das rendas, lido da tabela do ficheiro de valores: a linha mais recente
 * "Coeficiente de atualização anual de rendas para AAAA | **x,xxxx** …". Enquanto tiver "(a confirmar)",
 * a revisão é a 31/10 do ano anterior (o Aviso sai no DR até 30/10); confirmado, a próxima é a 31/10 desse ano.
 */
export function itemRendas(texto: string): Omit<ItemAtualidade, "desatualizado"> | null {
  const m = [...texto.matchAll(/Coeficiente de atualização anual de rendas para (\d{4})\s*\|\s*\*\*([\d,]+)\*\*([^\n]*)/g)].pop();
  if (!m) return null;
  const ano = Number(m[1]);
  const aConfirmar = /a confirmar/i.test(m[3]);
  return {
    item: "Coeficiente de atualização das rendas",
    fonte: "INE e Aviso no Diário da República (valores-2026, secção Arrendamento)",
    ultimaAtualizacao: `${ano}: ${m[2]}${aConfirmar ? " (a confirmar com o Aviso no DR)" : ""}`,
    proximaRevisao: aConfirmar ? `${ano - 1}-10-31` : `${ano}-10-31`,
    ...(aConfirmar ? { nota: `Confirmar o Aviso publicado até 30/10/${ano - 1} e retirar o '(a confirmar)'.` } : {}),
  };
}

/** Lista os valores, as taxas e as tabelas com a data e o estado (desatualizado = passou a revisão). */
export function verificarAtualidade(opts: { hoje?: Date; textoValores?: string } = {}): ItemAtualidade[] {
  const h = hojeEmLisboa(opts.hoje ?? new Date());
  const texto = opts.textoValores ?? ler("references", "valores-2026") ?? "";
  const cab = lerCabecalhoValores(texto);
  const itens: ItemAtualidade[] = [];

  const proxima = cab.proxima ?? "0000-01-01";
  itens.push({
    item: "Valores de referência (valores-2026: impostos, salário mínimo, IAS, limiares)",
    fonte: "references/valores-2026.md",
    ultimaAtualizacao: cab.ultima ?? "(sem data)",
    proximaRevisao: cab.proxima ?? "(sem data)",
    desatualizado: h > proxima,
    ...(cab.proxima ? {} : { nota: "O ficheiro de valores não tem a linha 'Próxima revisão: AAAA-MM-DD'." }),
  });

  const ult = TAXAS_SEMESTRAIS[TAXAS_SEMESTRAIS.length - 1];
  const limite = limiteJuros(ult.ano, ult.semestre);
  itens.push({
    item: "Taxas de juros de mora (comerciais, por semestre)",
    fonte: "Avisos da ETF no Diário da República — calculators/juros.ts e scripts/juros_mora.py",
    ultimaAtualizacao: `${ult.semestre}.º semestre de ${ult.ano}`,
    proximaRevisao: limite,
    desatualizado: h >= limite,
    ...(h >= limite ? { nota: "Os semestres sem aviso registado usam a última taxa conhecida (marcada como estimada)." } : {}),
  });
  if (cab.juros && (cab.juros.ano !== ult.ano || cab.juros.semestre !== ult.semestre)) {
    itens[itens.length - 1].nota =
      `valores-2026 diz ${cab.juros.semestre}.º semestre de ${cab.juros.ano} e a tabela tem ${ult.semestre}.º de ${ult.ano}: alinhar os dois.`;
  }

  const rendas = itemRendas(texto);
  if (rendas) itens.push({ ...rendas, desatualizado: h > rendas.proximaRevisao });
  return itens;
}

/** Texto para a tool e o CLI. */
export function textoAtualidade(itens: ItemAtualidade[], hoje: Date = new Date()): string {
  const h = hojeEmLisboa(hoje);
  const fora = itens.filter((i) => i.desatualizado);
  return [
    `Atualidade do conteúdo do plugin em ${h}: ${fora.length ? `${fora.length} item(ns) fora de prazo` : "tudo dentro do prazo de revisão"}.`,
    "",
    ...itens.map(
      (i) =>
        `- ${i.desatualizado ? "⚠️ DESATUALIZADO" : "✓"} ${i.item} — atualizado: ${i.ultimaAtualizacao}; próxima revisão: ${i.proximaRevisao}; fonte: ${i.fonte}` +
        (i.nota ? ` (${i.nota})` : "")
    ),
    "",
    fora.length
      ? "Atualiza o plugin (/plugin marketplace update juridico-pt) e, até lá, confirma estes valores nas fontes oficiais antes de os usar."
      : "Mesmo dentro do prazo, valores determinantes confirmam-se na fonte oficial (dre.pt, Portal das Finanças).",
  ].join("\n");
}
