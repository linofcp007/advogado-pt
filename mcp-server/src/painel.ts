// Painel do contabilista: num só pedido, as obrigações legais e os prazos registados dos próximos N dias
// de todos os perfis nomeados (`.juridico-pt/perfis/<nome>.md`), por data e por perfil.
import { gerarCalendario } from "./calendario.js";
import { listarPerfis, lerPerfil } from "./perfil.js";
import { hojeEmLisboa, lerPrazos } from "./prazos-estado.js";

export interface ItemPainel {
  data: string;
  perfil: string;
  tipo: "obrigação" | "prazo";
  descricao: string;
  aConfirmar?: boolean;
}

export interface Painel {
  desde: string;
  ate: string;
  perfis: string[];
  itens: ItemPainel[];
  /** Prazos registados em aberto e já vencidos (fora da janela, mas a tratar já). */
  vencidos: ItemPainel[];
  aviso?: string;
}

const SEM_PERFIL = "(sem perfil)";

function somarDias(iso: string, dias: number): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + dias * 86400000).toISOString().slice(0, 10);
}

export function painelClientes(opts: { projeto?: string; home?: string; hoje?: Date; dias?: number } = {}): Painel {
  const dias = Math.min(366, Math.max(1, Math.floor(opts.dias ?? 30)));
  const desde = hojeEmLisboa(opts.hoje ?? new Date());
  const ate = somarDias(desde, dias);
  const base = { projeto: opts.projeto, home: opts.home, hoje: opts.hoje };
  const perfis = listarPerfis(base).map((p) => p.nome).sort();
  const itens: ItemPainel[] = [];
  const anos = [...new Set([Number(desde.slice(0, 4)), Number(ate.slice(0, 4))])];

  for (const nome of perfis) {
    const p = lerPerfil({ ...base, perfil: nome });
    for (const ano of anos) {
      for (const o of gerarCalendario(ano, p?.campos ?? null)) {
        if (o.data < desde || o.data > ate) continue;
        itens.push({ data: o.data, perfil: nome, tipo: "obrigação", descricao: o.titulo, ...(o.aConfirmar ? { aConfirmar: true } : {}) });
      }
    }
  }

  const vencidos: ItemPainel[] = [];
  for (const pr of lerPrazos(opts.projeto)) {
    if (pr.concluido) continue;
    const item: ItemPainel = {
      data: pr.data,
      perfil: pr.perfil ?? SEM_PERFIL,
      tipo: "prazo",
      descricao: pr.descricao + (pr.origem ? ` (${pr.origem})` : ""),
    };
    if (pr.data < desde) vencidos.push(item);
    else if (pr.data <= ate) itens.push(item);
  }

  const ordem = (a: ItemPainel, b: ItemPainel) =>
    a.data.localeCompare(b.data) || a.perfil.localeCompare(b.perfil) || a.tipo.localeCompare(b.tipo) || a.descricao.localeCompare(b.descricao);
  itens.sort(ordem);
  vencidos.sort(ordem);
  return {
    desde,
    ate,
    perfis,
    itens,
    vencidos,
    ...(perfis.length === 0
      ? {
          aviso:
            "Sem perfis nomeados em .juridico-pt/perfis/. Grava cada cliente com guardar_perfil_empresa (parâmetro perfil, ex.: 'cliente-a') e associa os prazos com registar_prazo (perfil).",
        }
      : {}),
  };
}

/** Texto para a tool, o CLI e o command /painel: agrupado por data. */
export function textoPainel(p: Painel): string {
  const linhas = [`Painel de ${p.desde} a ${p.ate} — ${p.perfis.length} perfil(is), ${p.itens.length} item(ns).`];
  if (p.aviso) linhas.push(`⚠️ ${p.aviso}`);
  if (p.vencidos.length) {
    linhas.push("", "⚠️ Prazos registados já VENCIDOS:");
    for (const i of p.vencidos) linhas.push(`- ${i.data} · ${i.perfil} · ${i.descricao}`);
  }
  let atual = "";
  for (const i of p.itens) {
    if (i.data !== atual) {
      atual = i.data;
      linhas.push("", `## ${i.data}`);
    }
    linhas.push(`- ${i.perfil} · ${i.tipo === "prazo" ? "⏰ prazo" : "obrigação"}: ${i.descricao}${i.aConfirmar ? " (a confirmar — completa o perfil)" : ""}`);
  }
  linhas.push("", "Datas das obrigações a partir do perfil de cada cliente; confirmar no Portal das Finanças e na Segurança Social Direta (prorrogações por despacho).");
  return linhas.join("\n");
}
