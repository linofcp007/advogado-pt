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
        "Calcula juros de mora (comercial: 10,15% em 2026, DL 62/2013; ou civil: 4%) entre duas datas. Usa quando o utilizador quer saber quanto deve de juros sobre uma fatura ou dívida em atraso ('quanto rende de juros', 'juros de mora', 'juros de atraso', 'mora'). EN: how much interest is owed on an overdue invoice/debt.",
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
        "Conta um prazo legal em dias úteis (salta fins-de-semana e feriados nacionais de Portugal) ou dias corridos, devolvendo a data-limite. Usa quando há um prazo a contar a partir de uma data ('até quando tenho para', 'contestação', 'oposição', 'defesa', 'recurso', 'prazo para responder'). EN: count a legal deadline in business/calendar days.",
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
        "Calcula a compensação por cessação do contrato de trabalho (sem-termo/coletivo = 14 dias/ano; extinção-posto/inadaptação = 12; termo = 24), com mínimo de 3 meses. Usa quando se fala em despedir/ser despedido ou no valor a receber/pagar ('quanto recebo se for despedido', 'indemnização', 'compensação', 'fim de contrato', 'rescisão'). EN: severance/redundancy pay on dismissal or contract termination.",
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
      description:
        "Estima a taxa de justiça de um requerimento de injunção (UC 2026 = 102€). Usa quando o utilizador vai avançar com a cobrança judicial de uma dívida e quer saber o custo ('quanto custa uma injunção', 'taxa de justiça', 'custas', 'cobrar judicialmente'). EN: court fee for a payment-order (injunção).",
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
        "Calcula o imposto do selo numa herança/transmissão gratuita (10%; isento para cônjuge/descendente/ascendente) + 0,8% sobre VPT de imóveis. Usa em partilhas e heranças quando se quer saber o imposto a pagar ('quanto pago de imposto na herança', 'partilha', 'doação', 'herdar'). EN: stamp duty on an inheritance or gift.",
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
        "Calcula o IMT 2026 (Continente, imposto na compra de imóvel) incl. IMT Jovem, mais o Imposto do Selo de 0,8%. Usa quando o utilizador vai comprar casa/imóvel e quer saber os impostos da aquisição ('quanto pago de IMT', 'impostos na compra de casa', 'comprar imóvel'). EN: property transfer tax (IMT) on a home purchase.",
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
      description: `Calcula a data-limite de prescrição/caducidade de um direito ou dívida. Usa quando o utilizador pergunta 'ainda posso cobrar/reclamar?', 'já prescreveu?', 'há quanto tempo é a dívida', 'caducou?' ou se um prazo legal já expirou. Tipos: ${PRESCRICAO_TIPOS.join(", ")}. EN: limitation/time-bar deadline (is the claim still enforceable?).`,
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
        "Calcula o rendimento tributável no regime simplificado (Cat. B/ENI), aplicando o coeficiente ao rendimento bruto (não calcula o imposto final, pois os escalões mudam anualmente). Usa para estimativas de IRS de trabalhador independente/recibos verdes ('quanto pago de IRS como independente', 'regime simplificado', 'recibos verdes', 'ENI'). EN: simplified-regime taxable income for the self-employed.",
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
      description:
        "Lista todas as áreas de referência jurídica disponíveis (laboral, fiscal, rgpd, arrendamento, contratos, …). Usa para descobrir que áreas existem antes de ler uma referência. EN: list available legal reference areas.",
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
        "Devolve a referência jurídica de uma área (ex.: cobrancas, laboral, rgpd, imobiliario, valores-2026). Usa para perguntas de fundo sobre a lei ('o que diz a lei sobre…', 'quais são os meus direitos', 'enquadramento legal'). EN: pull the legal reference/background for an area.",
      inputSchema: { nome: z.string().describe("Nome da área (ex.: 'laboral')") },
    },
    obter("references", "referências")
  );

  server.registerTool(
    "listar_templates",
    {
      title: "Listar templates de documentos",
      description:
        "Lista os templates de documentos jurídicos disponíveis (contratos, NDA, cartas, injunção, política de privacidade, …). Usa para descobrir que documentos podem ser gerados. EN: list available document templates.",
      inputSchema: {},
    },
    async () => texto("Templates:\n- " + listar("templates").join("\n- "))
  );

  server.registerTool(
    "obter_template",
    {
      title: "Obter template de documento",
      description:
        "Devolve um template de documento (ex.: requerimento-injuncao, nda-bilingue, contrato-promessa-compra-venda, carta, política de privacidade). Usa quando o utilizador pede para redigir/gerar/elaborar um documento ('preciso de um contrato', 'redige uma carta', 'minuta', 'modelo'). EN: draft a contract/letter/agreement.",
      inputSchema: { nome: z.string() },
    },
    obter("templates", "templates")
  );

  server.registerTool(
    "listar_playbooks",
    {
      title: "Listar playbooks",
      description:
        "Lista os playbooks (árvores de decisão) para cenários comuns (cliente não paga, citação, despedir, data breach, comprar imóvel, …). Usa para descobrir que guias passo-a-passo existem. EN: list available step-by-step playbooks.",
      inputSchema: {},
    },
    async () => texto("Playbooks:\n- " + listar("playbooks").join("\n- "))
  );

  server.registerTool(
    "obter_playbook",
    {
      title: "Obter playbook",
      description:
        "Devolve um playbook (árvore de decisão) para um cenário (ex.: cliente-nao-paga, data-breach, comprar-imovel, citação, despedir). Usa quando o utilizador descreve uma situação e quer saber os passos a dar ('o que faço se…', 'tenho um problema com um cliente', 'recebi uma citação', 'como procedo'). EN: step-by-step playbook for a scenario.",
      inputSchema: { nome: z.string() },
    },
    obter("playbooks", "playbooks")
  );

  server.registerTool(
    "listar_checklists",
    {
      title: "Listar checklists",
      description:
        "Lista as checklists acionáveis disponíveis (RGPD, due diligence, constituição de sociedade, revisão de contrato, pré-deploy, …). Usa para descobrir que checklists existem. EN: list available actionable checklists.",
      inputSchema: {},
    },
    async () => texto("Checklists:\n- " + listar("checklists").join("\n- "))
  );

  server.registerTool(
    "obter_checklist",
    {
      title: "Obter checklist",
      description:
        "Devolve uma checklist acionável (ex.: checklist-rgpd, checklist-due-diligence-imovel, constituição, revisão de contrato, pré-deploy). Usa quando o utilizador quer uma lista de verificação/passos a confirmar ('o que tenho de verificar', 'checklist', 'o que não posso esquecer'). EN: actionable checklist of items to verify.",
      inputSchema: { nome: z.string() },
    },
    obter("checklists", "checklists")
  );

  server.registerTool(
    "procurar_conteudo",
    {
      title: "Procurar no conteúdo jurídico",
      description:
        "Procura um termo em todo o conteúdo jurídico (referências, templates, playbooks e checklists). Usa quando não sabes em que área/categoria está o assunto e precisas de localizar onde é tratado ('onde se fala de…', 'procura por', 'pesquisa'). EN: full-text search across all legal content.",
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
