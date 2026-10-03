// Registo das TOOLS do servidor MCP: 8 calculadoras jurídicas + ferramentas de conteúdo.
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  calcularJuros,
  memoriaJuros,
  contarPrazo,
  calcularCompensacao,
  custasInjuncao,
  impostoSeloHeranca,
  calcularIMT,
  calcularPrescricao,
  calcularIRSSimplificado,
  calcularCreditosCessacao,
  calcularLegitima,
  formatarEuros,
  PRESCRICAO_TIPOS,
  COMPENSACAO_MODALIDADES,
} from "./calculators/index.js";
import { listar, ler, procurar, listarComAmbito, formatarProcura, type Categoria } from "./content.js";
import { lerPerfil, guardarPerfil, resumoPerfil, textoPerguntasPerfil } from "./perfil.js";
import { completable } from "@modelcontextprotocol/sdk/server/completable.js";

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

/** "- nome — âmbito" por linha (âmbito: nacional / ue / misto, quando declarado). */
function listagem(cat: Categoria): string {
  return listarComAmbito(cat)
    .map((i) => `- ${i.nome}${i.ambito ? ` — ${i.ambito}` : ""}`)
    .join("\n");
}

export function registerTools(server: McpServer): void {
  // ---------------- Calculadoras ----------------

  server.registerTool(
    "calc_juros_mora",
    {
      title: "Calcular juros de mora",
      description:
        "Calcula juros de mora por TRAMOS SEMESTRAIS (cada semestre com a taxa do seu aviso, 2.º sem. 2013 a 2026) e devolve a memória de cálculo pronta a anexar. Tipos: comercial (transações comerciais, DL 62/2013 / art. 102.º §5 CCom), comercial-geral (art. 102.º §3 CCom) ou civil (4%). Usa quando o utilizador quer saber quanto deve de juros sobre uma fatura ou dívida em atraso ('quanto rende de juros', 'juros de mora', 'juros de atraso', 'mora'). EN: late-payment interest owed on an overdue invoice/debt, split by semester.",
      inputSchema: {
        capital: z.number().describe("Capital em dívida (€)"),
        data_inicio: z.string().describe("Data de início da mora (YYYY-MM-DD)"),
        data_fim: z
          .string()
          .optional()
          .describe("Data final (YYYY-MM-DD); por defeito, hoje"),
        tipo: z.enum(["comercial", "comercial-geral", "civil"]).default("comercial"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ capital, data_inicio, data_fim, tipo }) => {
      const fim = data_fim ? parseData(data_fim) : new Date();
      try {
        const r = calcularJuros(capital, parseData(data_inicio), fim, tipo);
        return texto(memoriaJuros(capital, r, tipo) + AVISO);
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
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
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
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

  server.registerTool(
    "calc_creditos_laborais",
    {
      title: "Calcular créditos laborais na cessação",
      description:
        "Calcula os créditos laborais devidos quando um contrato de trabalho termina: proporcionais de férias, subsídio de férias e subsídio de Natal do ano da cessação, férias vencidas e não gozadas e subsídio de férias em falta (estimativa bruta, CT arts. 245.º e 263.º). Usa quando há despedimento, demissão, fim de contrato a termo ou acordo de revogação e se quer saber 'quanto tenho de pagar/receber', 'acerto de contas', 'proporcionais', 'férias não gozadas'. Não inclui a compensação (calc_compensacao_despedimento). EN: final-pay entitlements on termination.",
      inputSchema: {
        retribuicao_base: z.number().describe("Retribuição base mensal (€)"),
        diuturnidades: z.number().optional().describe("Diuturnidades mensais (€)"),
        data_admissao: z.string().describe("Data de admissão (YYYY-MM-DD)"),
        data_cessacao: z.string().describe("Data de cessação (YYYY-MM-DD)"),
        ferias_vencidas_nao_gozadas: z
          .number()
          .optional()
          .describe("Dias úteis de férias vencidas e não gozadas"),
        subsidio_ferias_vencido_em_falta: z
          .boolean()
          .optional()
          .describe("O subsídio de férias das férias vencidas ainda não foi pago"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (a) => {
      try {
        const r = calcularCreditosCessacao({
          retribuicaoBase: a.retribuicao_base,
          diuturnidades: a.diuturnidades,
          dataAdmissao: parseData(a.data_admissao),
          dataCessacao: parseData(a.data_cessacao),
          feriasVencidasNaoGozadas: a.ferias_vencidas_nao_gozadas,
          subsidioFeriasVencidoEmFalta: a.subsidio_ferias_vencido_em_falta,
        });
        return texto(
          `Créditos laborais na cessação (estimativa bruta)\n` +
            `Dias de serviço no ano da cessação: ${r.diasServicoAno}/${r.diasAno}\n` +
            `Proporcional de férias: ${formatarEuros(r.proporcionalFerias)}\n` +
            `Proporcional de subsídio de férias: ${formatarEuros(r.proporcionalSubsidioFerias)}\n` +
            `Proporcional de subsídio de Natal: ${formatarEuros(r.proporcionalSubsidioNatal)}\n` +
            `Férias vencidas não gozadas: ${formatarEuros(r.feriasVencidas)}\n` +
            `Subsídio de férias vencido em falta: ${formatarEuros(r.subsidioFeriasVencido)}\n` +
            `TOTAL BRUTO: ${formatarEuros(r.total)}` +
            (r.limite245n3
              ? "\n⚠️ Contrato até 12 meses ou cessação no ano seguinte ao da admissão: aplica-se o limite do art. 245.º, n.º 3, CT — rever as férias à mão."
              : "") +
            "\n(Não inclui a retribuição do mês em curso, a compensação — calc_compensacao_despedimento —, formação não prestada nem descontos de IRS/SS.)" +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_legitima",
    {
      title: "Calcular legítima e quota disponível",
      description:
        "Calcula a legítima (parte da herança reservada aos herdeiros legitimários — cônjuge, filhos, ascendentes) e a quota disponível (o que se pode deixar livremente por testamento ou doação), com a divisão da legítima por herdeiro (CC arts. 2156.º-2162.º, 2139.º, 2142.º). Usa em heranças, testamentos, doações a filhos/terceiros ('quanto posso deixar a…', 'parte legítima', 'quota disponível', 'herdeiros forçosos'). EN: forced heirship share and freely disposable portion.",
      inputSchema: {
        bens: z.number().describe("Valor dos bens à data da morte (€)"),
        doacoes: z.number().optional().describe("Valor dos bens doados em vida (€)"),
        dividas: z.number().optional().describe("Dívidas da herança (€)"),
        conjuge: z.boolean().describe("Há cônjuge sobrevivo?"),
        filhos: z.number().int().describe("Número de filhos (estirpes)"),
        ascendentes: z.enum(["nenhum", "pais", "outros"]).default("nenhum"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (a) => {
      try {
        const r = calcularLegitima(a);
        return texto(
          `Legítima e quota disponível\n` +
            `Valor da herança (art. 2162.º CC): ${formatarEuros(r.valorHeranca)}\n` +
            `Legítima: ${formatarEuros(r.legitima)}\n` +
            `Quota disponível: ${formatarEuros(r.quotaDisponivel)} (${r.quotaDisponivelPct.toFixed(2).replace(".", ",")}%)\n` +
            (r.partes.length
              ? "Divisão da legítima:\n" +
                r.partes.map((p) => `  - ${p.herdeiro}: ${formatarEuros(p.valor)}`).join("\n") +
                "\n"
              : "") +
            r.fundamento +
            "\n" +
            r.avisos.map((x) => `Nota: ${x}`).join("\n") +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
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
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => texto("Áreas de referência (nome — âmbito):\n" + listagem("references"))
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
      inputSchema: {
        nome: completable(
          z.string().describe("Nome da área (ex.: 'laboral')"),
          (value) =>
            listar("references").filter((n) =>
              n.toLowerCase().startsWith((value || "").toLowerCase())
            )
        ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => texto("Templates (nome — âmbito):\n" + listagem("templates"))
  );

  server.registerTool(
    "obter_template",
    {
      title: "Obter template de documento",
      description:
        "Devolve um template de documento (ex.: requerimento-injuncao, nda-bilingue, contrato-promessa-compra-venda, carta, política de privacidade). Usa quando o utilizador pede para redigir/gerar/elaborar um documento ('preciso de um contrato', 'redige uma carta', 'minuta', 'modelo'). EN: draft a contract/letter/agreement.",
      inputSchema: {
        nome: completable(z.string(), (value) =>
          listar("templates").filter((n) =>
            n.toLowerCase().startsWith((value || "").toLowerCase())
          )
        ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => texto("Playbooks:\n- " + listar("playbooks").join("\n- "))
  );

  server.registerTool(
    "obter_playbook",
    {
      title: "Obter playbook",
      description:
        "Devolve um playbook (árvore de decisão) para um cenário (ex.: cliente-nao-paga, data-breach, comprar-imovel, citação, despedir). Usa quando o utilizador descreve uma situação e quer saber os passos a dar ('o que faço se…', 'tenho um problema com um cliente', 'recebi uma citação', 'como procedo'). EN: step-by-step playbook for a scenario.",
      inputSchema: {
        nome: completable(z.string(), (value) =>
          listar("playbooks").filter((n) =>
            n.toLowerCase().startsWith((value || "").toLowerCase())
          )
        ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => texto("Checklists:\n- " + listar("checklists").join("\n- "))
  );

  server.registerTool(
    "obter_checklist",
    {
      title: "Obter checklist",
      description:
        "Devolve uma checklist acionável (ex.: checklist-rgpd, checklist-due-diligence-imovel, constituição, revisão de contrato, pré-deploy). Usa quando o utilizador quer uma lista de verificação/passos a confirmar ('o que tenho de verificar', 'checklist', 'o que não posso esquecer'). EN: actionable checklist of items to verify.",
      inputSchema: {
        nome: completable(z.string(), (value) =>
          listar("checklists").filter((n) =>
            n.toLowerCase().startsWith((value || "").toLowerCase())
          )
        ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
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
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ query }) => {
      const res = procurar(query);
      if (res.length === 0) return texto(`Sem resultados para '${query}'.`);
      return texto(`Resultados para '${query}' (agrupados por tipo; âmbito entre parênteses):\n\n` + formatarProcura(res));
    }
  );

  // ---------------- Perfil da empresa ----------------

  server.registerTool(
    "obter_perfil_empresa",
    {
      title: "Obter perfil da empresa",
      description:
        "Lê o perfil da empresa do utilizador (forma jurídica, setor, trabalhadores, volume de negócios, IVA, clientes…) guardado em <projeto>/.advogado-pt/perfil-empresa.md ou, na falta, no perfil geral ~/.advogado-pt/perfil-empresa.md. Usa no início de qualquer questão empresarial para adaptar a resposta à empresa ('a minha empresa', 'somos uma Lda', 'temos trabalhadores'). Sem perfil, devolve as perguntas a fazer. EN: read the saved company profile.",
      inputSchema: {
        diretorio: z
          .string()
          .optional()
          .describe("Diretório do projeto (por defeito, o do cliente/cwd)"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ diretorio }) => {
      const p = lerPerfil({ projeto: diretorio });
      if (!p) return texto(textoPerguntasPerfil());
      return texto(
        `Perfil da empresa (${p.origem}) — ${p.caminho}\n` +
          resumoPerfil(p) +
          `\natualizado_em: ${p.campos.atualizado_em ?? "(sem data)"}` +
          (p.desatualizado
            ? "\n⚠️ Perfil com mais de 12 meses (ou sem data): confirma os dados com o utilizador antes de os usar."
            : "")
      );
    }
  );

  server.registerTool(
    "guardar_perfil_empresa",
    {
      title: "Guardar perfil da empresa",
      description:
        "Grava/atualiza o perfil da empresa do utilizador (funde com o existente e atualiza a data). destino 'projeto' -> <projeto>/.advogado-pt/perfil-empresa.md; destino 'geral' -> ~/.advogado-pt/perfil-empresa.md (empresa por defeito). Usa só depois de o utilizador aceitar guardar e só com dados da PRÓPRIA empresa — nunca de um cliente ou terceiro. Campos aceites: forma_juridica, denominacao, setor, trabalhadores, volume_negocios, regime_iva, contabilidade, clientes, dados_pessoais, linguas, notas. EN: save the company profile.",
      inputSchema: {
        campos: z
          .record(z.string())
          .describe("Campos a gravar, ex.: {forma_juridica: 'Lda', setor: 'Restauração', trabalhadores: '12'}"),
        destino: z.enum(["projeto", "geral"]).default("projeto"),
        diretorio: z
          .string()
          .optional()
          .describe("Diretório do projeto quando destino = projeto (por defeito, cwd)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    async ({ campos, destino, diretorio }) => {
      try {
        const p = guardarPerfil(campos, destino, { projeto: diretorio });
        return texto(`Perfil guardado (${p.origem}) em ${p.caminho}\n${resumoPerfil(p)}`);
      } catch (e) {
        return texto(`Não foi possível guardar o perfil: ${(e as Error).message}`);
      }
    }
  );

  void COMPENSACAO_MODALIDADES; // exportado para uso externo/documentação
}
