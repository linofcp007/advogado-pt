// Registo das TOOLS do servidor MCP: 8 calculadoras jurídicas + ferramentas de conteúdo.
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  calcularJuros,
  contarPrazo,
  calcularCompensacao,
  custasInjuncao,
  impostoSeloHeranca,
  calcularIMT,
  calcularPrescricao,
  calcularIRSSimplificado,
  formatarEuros,
  PRESCRICAO_TIPOS,
  COMPENSACAO_MODALIDADES,
} from "./calculators/index.js";
import { listar, ler, procurar } from "./content.js";

const AVISO =
  "\n\n⚠️ Estimativa de apoio. Valores/taxas de 2026 — confirmar no ano corrente. Não substitui aconselhamento de advogado inscrito na OA.";

function texto(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

function parseData(s: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) throw new Error(`Data inválida: '${s}'. Usa YYYY-MM-DD.`);
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function registerTools(server: McpServer): void {
  // ---------------- Calculadoras ----------------

  server.registerTool(
    "calc_juros_mora",
    {
      title: "Calcular juros de mora",
      description:
        "Calcula juros de mora (comercial: 10,15% em 2026, DL 62/2013; ou civil: 4%) entre duas datas.",
      inputSchema: {
        capital: z.number().describe("Capital em dívida (€)"),
        data_inicio: z.string().describe("Data de início da mora (YYYY-MM-DD)"),
        data_fim: z
          .string()
          .optional()
          .describe("Data final (YYYY-MM-DD); por defeito, hoje"),
        tipo: z.enum(["comercial", "civil"]).default("comercial"),
      },
    },
    async ({ capital, data_inicio, data_fim, tipo }) => {
      const fim = data_fim ? parseData(data_fim) : new Date();
      const r = calcularJuros(capital, parseData(data_inicio), fim, tipo);
      return texto(
        `Juros de mora (${tipo})\n` +
          `Capital: ${formatarEuros(capital)}\n` +
          `Período: ${data_inicio} a ${data_fim ?? iso(fim)} (${r.dias} dias)\n` +
          `Taxa: ${(r.taxa * 100).toFixed(2).replace(".", ",")}%/ano\n` +
          `Juros: ${formatarEuros(r.juros)}\n` +
          `TOTAL: ${formatarEuros(r.total)}` +
          AVISO
      );
    }
  );

  server.registerTool(
    "calc_prazo",
    {
      title: "Contar prazo legal",
      description:
        "Conta um prazo em dias úteis (salta fins-de-semana e feriados nacionais de Portugal) ou dias corridos.",
      inputSchema: {
        inicio: z.string().describe("Data de início (YYYY-MM-DD)"),
        dias: z.number().int().describe("Número de dias do prazo"),
        tipo: z.enum(["uteis", "corridos"]).default("uteis"),
      },
    },
    async ({ inicio, dias, tipo }) => {
      const r = contarPrazo(parseData(inicio), dias, tipo);
      return texto(
        `Prazo de ${dias} dias ${tipo}\n` +
          `Início: ${inicio}\n` +
          `DATA-LIMITE: ${iso(r.dataLimite)}\n\n${r.nota}`
      );
    }
  );

  server.registerTool(
    "calc_compensacao_despedimento",
    {
      title: "Compensação por cessação de contrato",
      description:
        "Compensação por cessação (sem-termo/coletivo = 14 dias/ano; extinção-posto/inadaptação = 12; termo = 24), com mínimo de 3 meses.",
      inputSchema: {
        retribuicao_base: z.number().describe("Retribuição base mensal (€)"),
        diuturnidades: z.number().default(0),
        anos: z.number().describe("Antiguidade em anos (aceita decimais)"),
        modalidade: z
          .enum(["sem-termo", "extincao-posto", "coletivo", "termo"])
          .default("sem-termo"),
      },
    },
    async ({ retribuicao_base, diuturnidades, anos, modalidade }) => {
      const r = calcularCompensacao(retribuicao_base, diuturnidades, anos, modalidade);
      return texto(
        `Compensação (${modalidade})\n` +
          `Base (RB+diut.): ${formatarEuros(retribuicao_base + diuturnidades)}\n` +
          `Antiguidade: ${anos} anos · ${r.diasAno} dias/ano\n` +
          `VALOR BRUTO: ${formatarEuros(r.bruto)}` +
          (r.minimoAplicado ? "\n(Aplicado o mínimo legal de 3 meses.)" : "") +
          AVISO
      );
    }
  );

  server.registerTool(
    "calc_custas_injuncao",
    {
      title: "Taxa de justiça de injunção",
      description: "Estima a taxa de justiça de um requerimento de injunção (UC 2026 = 102€).",
      inputSchema: { valor: z.number().describe("Valor da dívida (€)") },
    },
    async ({ valor }) => {
      const r = custasInjuncao(valor);
      return texto(
        `Injunção — valor ${formatarEuros(valor)}\n` +
          `Escalão: ${r.escalao}\n` +
          `Taxa de justiça estimada: ${formatarEuros(r.taxa)}` +
          AVISO
      );
    }
  );

  server.registerTool(
    "calc_imposto_selo_heranca",
    {
      title: "Imposto do selo em herança",
      description:
        "Imposto do selo em transmissões gratuitas (10%; isento para cônjuge/descendente/ascendente) + 0,8% sobre VPT de imóveis.",
      inputSchema: {
        valor: z.number().describe("Valor dos bens (€)"),
        herdeiro: z
          .enum(["conjuge", "descendente", "ascendente", "outro"])
          .default("outro"),
        inclui_imovel: z.boolean().default(false),
        vpt_imovel: z.number().default(0),
      },
    },
    async ({ valor, herdeiro, inclui_imovel, vpt_imovel }) => {
      const r = impostoSeloHeranca(valor, herdeiro, inclui_imovel, vpt_imovel);
      return texto(
        `Imposto do selo — herança (herdeiro: ${herdeiro})\n` +
          `IS transmissão (10%): ${r.isento ? "ISENTO" : formatarEuros(r.isTransmissao)}\n` +
          (inclui_imovel ? `IS imóvel (0,8% VPT): ${formatarEuros(r.isImovel)}\n` : "") +
          `TOTAL: ${formatarEuros(r.total)}` +
          AVISO
      );
    }
  );

  server.registerTool(
    "calc_imt",
    {
      title: "Calcular IMT (compra de imóvel)",
      description:
        "Calcula o IMT 2026 (Continente) na aquisição de imóvel, incluindo IMT Jovem, mais o Imposto do Selo de 0,8%.",
      inputSchema: {
        valor: z.number().describe("Maior entre preço e VPT (€)"),
        tipo: z.enum(["hpp", "secundaria"]).default("hpp"),
        jovem: z.boolean().default(false).describe("Isenção IMT Jovem (≤35 anos, 1.ª HPP)"),
      },
    },
    async ({ valor, tipo, jovem }) => {
      const r = calcularIMT(valor, tipo, jovem);
      return texto(
        `IMT 2026 (${tipo}${jovem ? " + IMT Jovem" : ""})\n` +
          `Valor: ${formatarEuros(valor)}\n` +
          `Regime: ${r.regime}\n` +
          `IMT: ${formatarEuros(r.imt)}\n` +
          `Imposto do Selo (0,8%): ${formatarEuros(r.selo)}\n` +
          `TOTAL impostos: ${formatarEuros(r.total)}` +
          AVISO
      );
    }
  );

  server.registerTool(
    "calc_prescricao",
    {
      title: "Prazo de prescrição/caducidade",
      description: `Calcula a data-limite de prescrição/caducidade. Tipos: ${PRESCRICAO_TIPOS.join(", ")}.`,
      inputSchema: {
        inicio: z.string().describe("Data de início da contagem (YYYY-MM-DD)"),
        tipo: z.enum(PRESCRICAO_TIPOS as [string, ...string[]]),
      },
    },
    async ({ inicio, tipo }) => {
      const r = calcularPrescricao(parseData(inicio), tipo);
      return texto(
        `Prescrição/caducidade — ${r.descricao}\n` +
          `Base: ${r.base}\n` +
          `Prazo: ${r.prazoTexto}\n` +
          `Início: ${inicio}\n` +
          `DATA-LIMITE: ${iso(r.limite)}\n\n` +
          "Nota: a prescrição interrompe-se com citação/notificação judicial ou reconhecimento da dívida (Arts. 323.º/325.º CC)." +
          AVISO
      );
    }
  );

  server.registerTool(
    "calc_irs_simplificado",
    {
      title: "IRS — rendimento tributável (regime simplificado)",
      description:
        "Aplica o coeficiente do regime simplificado (Cat. B) ao rendimento bruto. Não calcula o imposto final (escalões mudam anualmente).",
      inputSchema: {
        rendimento: z.number().describe("Rendimento bruto anual (€)"),
        tipo: z.enum([
          "mercadorias",
          "servicos-151",
          "servicos-outros",
          "propriedade-intelectual",
        ]),
      },
    },
    async ({ rendimento, tipo }) => {
      const r = calcularIRSSimplificado(rendimento, tipo);
      return texto(
        `IRS simplificado (${tipo})\n` +
          `Rendimento bruto: ${formatarEuros(rendimento)}\n` +
          `Coeficiente: ${r.coeficiente}\n` +
          `RENDIMENTO TRIBUTÁVEL: ${formatarEuros(r.tributavel)}\n` +
          "(Acresce aos restantes rendimentos e é tributado pelos escalões progressivos de IRS.)" +
          AVISO
      );
    }
  );

  // ---------------- Conteúdo ----------------

  server.registerTool(
    "listar_areas_juridicas",
    {
      title: "Listar áreas jurídicas",
      description: "Lista todas as áreas de referência jurídica disponíveis.",
      inputSchema: {},
    },
    async () => texto("Áreas de referência:\n- " + listar("references").join("\n- "))
  );

  const obter = (cat: "references" | "templates" | "playbooks" | "checklists", rotulo: string) =>
    async ({ nome }: { nome: string }) => {
      const t = ler(cat, nome);
      if (t) return texto(t);
      return texto(
        `'${nome}' não encontrado. Disponíveis (${rotulo}):\n- ` + listar(cat).join("\n- ")
      );
    };

  server.registerTool(
    "ler_referencia",
    {
      title: "Ler referência jurídica",
      description:
        "Devolve o conteúdo de uma área de referência (ex.: cobrancas, laboral, rgpd, imobiliario, valores-2026).",
      inputSchema: { nome: z.string().describe("Nome da área (ex.: 'laboral')") },
    },
    obter("references", "referências")
  );

  server.registerTool(
    "listar_templates",
    {
      title: "Listar templates de documentos",
      description: "Lista os templates de documentos jurídicos disponíveis.",
      inputSchema: {},
    },
    async () => texto("Templates:\n- " + listar("templates").join("\n- "))
  );

  server.registerTool(
    "obter_template",
    {
      title: "Obter template de documento",
      description:
        "Devolve um template de documento (ex.: requerimento-injuncao, nda-bilingue, contrato-promessa-compra-venda).",
      inputSchema: { nome: z.string() },
    },
    obter("templates", "templates")
  );

  server.registerTool(
    "listar_playbooks",
    {
      title: "Listar playbooks",
      description: "Lista os playbooks (árvores de decisão) para cenários comuns.",
      inputSchema: {},
    },
    async () => texto("Playbooks:\n- " + listar("playbooks").join("\n- "))
  );

  server.registerTool(
    "obter_playbook",
    {
      title: "Obter playbook",
      description: "Devolve um playbook (ex.: cliente-nao-paga, data-breach, comprar-imovel).",
      inputSchema: { nome: z.string() },
    },
    obter("playbooks", "playbooks")
  );

  server.registerTool(
    "listar_checklists",
    {
      title: "Listar checklists",
      description: "Lista as checklists acionáveis.",
      inputSchema: {},
    },
    async () => texto("Checklists:\n- " + listar("checklists").join("\n- "))
  );

  server.registerTool(
    "obter_checklist",
    {
      title: "Obter checklist",
      description: "Devolve uma checklist (ex.: checklist-rgpd, checklist-due-diligence-imovel).",
      inputSchema: { nome: z.string() },
    },
    obter("checklists", "checklists")
  );

  server.registerTool(
    "procurar_conteudo",
    {
      title: "Procurar no conteúdo jurídico",
      description:
        "Procura um termo em todas as referências, templates, playbooks e checklists.",
      inputSchema: { query: z.string().describe("Termo a procurar") },
    },
    async ({ query }) => {
      const res = procurar(query);
      if (res.length === 0) return texto(`Sem resultados para '${query}'.`);
      const linhas = res.map(
        (r) => `• [${r.categoria}] ${r.nome}\n   ${r.linhas.join("\n   ")}`
      );
      return texto(`Resultados para '${query}':\n\n` + linhas.join("\n\n"));
    }
  );

  void COMPENSACAO_MODALIDADES; // exportado para uso externo/documentação
}
