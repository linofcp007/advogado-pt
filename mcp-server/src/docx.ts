// Markdown (subconjunto) -> .docx (OOXML), sem dependências: títulos (#, ##, ###), parágrafos com as
// quebras de linha do texto, listas (-, *, 1.), caixas [ ], citações (>), tabelas (| a | b |), negrito
// e itálico. O que estiver fora do subconjunto passa a texto simples; o ficheiro é sempre válido.
// Os comentários HTML (cabeçalhos dos templates) e a secção "Antes de enviar — verificar" não entram.
// Puro: devolve os bytes do ZIP (zip.ts).
import { criarZip } from "./zip.js";

const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';

/** Escapa texto para XML e retira caracteres de controlo inválidos em XML 1.0. */
function xml(s: string): string {
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface Run {
  texto: string;
  negrito?: boolean;
  italico?: boolean;
}

/** Negrito (**x** ou __x__), itálico (*x* ou _x_) e código (`x`, como texto). */
function inline(texto: string): Run[] {
  const runs: Run[] = [];
  const re = /\*\*(.+?)\*\*|__(.+?)__|(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])|(?<![\w])_(?!\s)(.+?)(?<!\s)_(?![\w])|`([^`]+)`/g;
  let ultimo = 0;
  for (const m of texto.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > ultimo) runs.push({ texto: texto.slice(ultimo, i) });
    if (m[1] !== undefined || m[2] !== undefined) {
      for (const r of inline(m[1] ?? m[2] ?? "")) runs.push({ ...r, negrito: true });
    } else if (m[3] !== undefined || m[4] !== undefined) {
      for (const r of inline(m[3] ?? m[4] ?? "")) runs.push({ ...r, italico: true });
    } else runs.push({ texto: m[5] ?? "" });
    ultimo = i + m[0].length;
  }
  if (ultimo < texto.length) runs.push({ texto: texto.slice(ultimo) });
  return runs.filter((r) => r.texto !== "");
}

function runsXml(linhas: string[]): string {
  const out: string[] = [];
  linhas.forEach((linha, n) => {
    if (n > 0) out.push("<w:r><w:br/></w:r>");
    for (const r of inline(linha)) {
      const props = (r.negrito ? "<w:b/>" : "") + (r.italico ? "<w:i/>" : "");
      out.push(`<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${xml(r.texto)}</w:t></w:r>`);
    }
  });
  return out.join("");
}

function paragrafo(linhas: string[], opts: { estilo?: string; recuo?: number; prefixo?: string } = {}): string {
  const pPr =
    (opts.estilo ? `<w:pStyle w:val="${opts.estilo}"/>` : "") +
    (opts.recuo ? `<w:ind w:left="${opts.recuo}" w:hanging="284"/>` : "");
  const conteudo = opts.prefixo ? [opts.prefixo + (linhas[0] ?? ""), ...linhas.slice(1)] : linhas;
  return `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ""}${runsXml(conteudo)}</w:p>`;
}

function celulas(linha: string): string[] {
  return linha.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function tabela(linhas: string[]): string {
  const linhasDados = linhas.filter((l) => !/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l));
  const rows = linhasDados.map(celulas);
  if (rows.length === 0) return "";
  const ncol = Math.max(1, ...rows.map((r) => r.length));
  const borda = (lado: string) => `<w:${lado} w:val="single" w:sz="4" w:space="0" w:color="808080"/>`;
  const tblPr =
    `<w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"]
      .map(borda)
      .join("")}</w:tblBorders></w:tblPr>`;
  const grid = `<w:tblGrid>${Array.from({ length: ncol }, () => `<w:gridCol w:w="${Math.floor(9000 / ncol)}"/>`).join("")}</w:tblGrid>`;
  const trs = rows
    .map((r, i) => {
      const tcs = Array.from({ length: ncol }, (_, c) => {
        const t = r[c] ?? "";
        return `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>${paragrafo([i === 0 && t ? `**${t.replace(/\*\*/g, "")}**` : t])}</w:tc>`;
      });
      return `<w:tr>${tcs.join("")}</w:tr>`;
    })
    .join("");
  return `<w:tbl>${tblPr}${grid}${trs}</w:tbl><w:p/>`;
}

/** Retira comentários HTML e a secção "Antes de enviar — verificar" (até ao próximo título do mesmo nível ou superior). */
export function limparMarkdown(md: string): string {
  const semComentarios = md.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "");
  const out: string[] = [];
  let corte: number | null = null;
  for (const linha of semComentarios.split("\n")) {
    const h = /^(#{1,6})\s+(.*)$/.exec(linha);
    if (corte !== null) {
      if (h && h[1].length <= corte) corte = null;
      else continue;
    }
    if (h && /^Antes de enviar\b/i.test(h[2].trim())) {
      corte = h[1].length;
      continue;
    }
    out.push(linha);
  }
  return out.join("\n");
}

function corpo(md: string): string {
  const linhas = limparMarkdown(md).split("\n");
  const blocos: string[] = [];
  let par: string[] = [];
  const fechar = () => {
    if (par.length) blocos.push(paragrafo(par));
    par = [];
  };
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].replace(/\s+$/, "");
    if (!linha.trim()) {
      fechar();
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(linha);
    if (h) {
      fechar();
      blocos.push(paragrafo([h[2].replace(/\s+#+\s*$/, "")], { estilo: `Heading${Math.min(3, h[1].length)}` }));
      continue;
    }
    if (/^\s*\|/.test(linha)) {
      fechar();
      const t: string[] = [];
      while (i < linhas.length && /^\s*\|/.test(linhas[i])) t.push(linhas[i++]);
      i--;
      blocos.push(tabela(t));
      continue;
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(linha)) {
      fechar();
      blocos.push("<w:p/>");
      continue;
    }
    const li = /^(\s*)[-*+]\s+(?:\[([ xX])\]\s+)?(.*)$/.exec(linha);
    if (li) {
      fechar();
      const nivel = Math.min(4, Math.floor(li[1].replace(/\t/g, "  ").length / 2));
      const prefixo = li[2] === undefined ? "• " : li[2] === " " ? "☐ " : "☒ ";
      blocos.push(paragrafo([li[3]], { recuo: 567 + nivel * 425, prefixo }));
      continue;
    }
    const ol = /^(\s*)(\d{1,3})[.)]\s+(.*)$/.exec(linha);
    if (ol) {
      fechar();
      const nivel = Math.min(4, Math.floor(ol[1].length / 2));
      blocos.push(paragrafo([ol[3]], { recuo: 567 + nivel * 425, prefixo: `${ol[2]}. ` }));
      continue;
    }
    const q = /^\s*>\s?(.*)$/.exec(linha);
    if (q) {
      fechar();
      blocos.push(paragrafo([q[1]], { estilo: "Quote" }));
      continue;
    }
    par.push(linha.trim());
  }
  fechar();
  return blocos.join("");
}

const ESTILOS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${NS}>
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri" w:eastAsia="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="pt-PT"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="276" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:jc w:val="left"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="100"/><w:jc w:val="left"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="80"/><w:jc w:val="left"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:sz w:val="23"/><w:szCs w:val="23"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Quote"><w:name w:val="Quote"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:ind w:left="567"/></w:pPr><w:rPr><w:i/></w:rPr></w:style>
</w:styles>`;

const TIPOS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`;

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

function core(titulo: string, quando: Date): string {
  const t = quando.toISOString().replace(/\.\d{3}Z$/, "Z");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>${xml(titulo)}</dc:title><dc:creator>juridico-pt</dc:creator>
<dcterms:created xsi:type="dcterms:W3CDTF">${t}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${t}</dcterms:modified>
</cp:coreProperties>`;
}

/** Converte Markdown num .docx (bytes). */
export function gerarDocx(md: string, opts: { titulo?: string; quando?: Date } = {}): Uint8Array {
  const quando = opts.quando ?? new Date();
  const titulo = opts.titulo ?? (/^#\s+(.+)$/m.exec(limparMarkdown(md))?.[1] ?? "Documento").trim();
  const documento =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document ${NS}><w:body>${corpo(md)}` +
    `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr>` +
    `</w:body></w:document>`;
  return criarZip(
    [
      { nome: "[Content_Types].xml", dados: TIPOS },
      { nome: "_rels/.rels", dados: RELS },
      { nome: "docProps/core.xml", dados: core(titulo, quando) },
      { nome: "word/document.xml", dados: documento },
      { nome: "word/styles.xml", dados: ESTILOS },
      { nome: "word/_rels/document.xml.rels", dados: DOC_RELS },
    ],
    quando
  );
}
