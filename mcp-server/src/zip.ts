// ZIP mínimo, sem dependências: entradas "stored" (sem compressão) com CRC-32, diretório central
// e fim de diretório (sem ZIP64 nem assinatura). Usado pelo .docx (docx.ts) e pelo pacote .mcpb
// (scripts/build-mcpb.mjs). Puro: devolve os bytes em memória.

export interface EntradaZip {
  /** Caminho dentro do arquivo, com "/" (ex.: "word/document.xml"). */
  nome: string;
  dados: Uint8Array | string;
}

const TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(dados: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < dados.length; i++) c = TABELA_CRC[(c ^ dados[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Data e hora no formato MS-DOS (hora local do arquivo; usamos UTC para ser determinístico). */
function dataDos(d: Date): { hora: number; data: number } {
  const ano = Math.max(1980, d.getUTCFullYear());
  return {
    hora: (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5) | Math.floor(d.getUTCSeconds() / 2),
    data: ((ano - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate(),
  };
}

const LIMITE = 0xffffffff;

/** Cria um ZIP (método 0, "stored") com as entradas pela ordem dada. */
export function criarZip(entradas: EntradaZip[], quando: Date = new Date(Date.UTC(2026, 0, 1))): Uint8Array {
  const enc = new TextEncoder();
  const { hora, data } = dataDos(quando);
  const locais: Uint8Array[] = [];
  const centrais: Uint8Array[] = [];
  let deslocamento = 0;
  const vistos = new Set<string>();

  for (const e of entradas) {
    const nome = e.nome.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!nome || nome.split("/").some((p) => p === ".." || p === ".")) throw new Error(`Nome inválido no ZIP: '${e.nome}'.`);
    if (vistos.has(nome)) throw new Error(`Entrada repetida no ZIP: '${nome}'.`);
    vistos.add(nome);
    const nomeB = enc.encode(nome);
    const bytes = typeof e.dados === "string" ? enc.encode(e.dados) : e.dados;
    if (bytes.length >= LIMITE || deslocamento >= LIMITE) throw new Error("Arquivo demasiado grande (sem ZIP64).");
    const crc = crc32(bytes);

    // Cabeçalho local (30 bytes + nome). Bit 11 = nomes em UTF-8.
    const loc = new DataView(new ArrayBuffer(30));
    loc.setUint32(0, 0x04034b50, true);
    loc.setUint16(4, 20, true); // versão necessária: 2.0
    loc.setUint16(6, 0x0800, true);
    loc.setUint16(8, 0, true); // método: stored
    loc.setUint16(10, hora, true);
    loc.setUint16(12, data, true);
    loc.setUint32(14, crc, true);
    loc.setUint32(18, bytes.length, true);
    loc.setUint32(22, bytes.length, true);
    loc.setUint16(26, nomeB.length, true);
    loc.setUint16(28, 0, true);
    locais.push(new Uint8Array(loc.buffer), nomeB, bytes);

    // Entrada do diretório central (46 bytes + nome).
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true);
    cen.setUint16(4, 20, true); // versão que criou
    cen.setUint16(6, 20, true); // versão necessária
    cen.setUint16(8, 0x0800, true);
    cen.setUint16(10, 0, true);
    cen.setUint16(12, hora, true);
    cen.setUint16(14, data, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, bytes.length, true);
    cen.setUint32(24, bytes.length, true);
    cen.setUint16(28, nomeB.length, true);
    cen.setUint16(30, 0, true); // extra
    cen.setUint16(32, 0, true); // comentário
    cen.setUint16(34, 0, true); // disco
    cen.setUint16(36, 0, true); // atributos internos
    cen.setUint32(38, 0, true); // atributos externos
    cen.setUint32(42, deslocamento, true);
    centrais.push(new Uint8Array(cen.buffer), nomeB);

    deslocamento += 30 + nomeB.length + bytes.length;
  }

  const tamanhoCentral = centrais.reduce((s, b) => s + b.length, 0);
  if (entradas.length > 0xffff || deslocamento + tamanhoCentral >= LIMITE) throw new Error("Arquivo demasiado grande (sem ZIP64).");
  const fim = new DataView(new ArrayBuffer(22));
  fim.setUint32(0, 0x06054b50, true);
  fim.setUint16(4, 0, true);
  fim.setUint16(6, 0, true);
  fim.setUint16(8, entradas.length, true);
  fim.setUint16(10, entradas.length, true);
  fim.setUint32(12, tamanhoCentral, true);
  fim.setUint32(16, deslocamento, true);
  fim.setUint16(20, 0, true);

  const partes = [...locais, ...centrais, new Uint8Array(fim.buffer)];
  const total = partes.reduce((s, b) => s + b.length, 0);
  const out = new Uint8Array(total);
  let i = 0;
  for (const p of partes) {
    out.set(p, i);
    i += p.length;
  }
  return out;
}
