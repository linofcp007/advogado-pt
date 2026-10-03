// Registo das TOOLS do servidor MCP: calculadoras jurídicas, conteúdo, perfil, calendário e prazos.
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  calcularJuros,
  memoriaJuros,
  calcularJurosLote,
  memoriaJurosLote,
  contarPrazo,
  calcularCompensacao,
  calcularCompensacaoPorDatas,
  custasInjuncao,
  impostoSeloHeranca,
  calcularIMT,
  calcularPrescricao,
  calcularIRSSimplificado,
  calcularCreditosCessacao,
  calcularLegitima,
  calcularSalarioLiquido,
  calcularCustoTrabalhador,
  calcularIRC,
  calcularTaxaJustica,
  decidirIVA,
  calcularProcedimentoCCP,
  textoProcedimentoCCP,
  formatarEuros,
  parseDataEstrita,
  hojeLisboa,
  PRESCRICAO_TIPOS,
  COMPENSACAO_MODALIDADES,
} from "./calculators/index.js";
import { listar, ler, procurar, listarComAmbito, formatarProcura, type Categoria } from "./content.js";
import {
  lerPerfil, guardarPerfil, resumoPerfil, textoPerguntasPerfil, listarPerfis, ativarPerfil, apagarPerfil,
} from "./perfil.js";
import { completable } from "@modelcontextprotocol/sdk/server/completable.js";
import { gerarCalendario, exportarICS, formatarCalendario } from "./calendario.js";
import { lerPrazos, registarPrazo, concluirPrazo, prazosProximos } from "./prazos-estado.js";
import { exportarDocumento } from "./exportar.js";
import { pedirPerfil, CAMPOS_FORMULARIO } from "./elicitacao.js";

const AVISO =
  "\n\n⚠️ Estimativa de apoio. Valores/taxas de 2026 — confirmar no ano corrente. Não substitui aconselhamento de advogado inscrito na OA.";

function texto(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

/** Mensagem de erro para o utilizador: só o texto, sem stack trace nem caminhos do sistema. */
function mensagemErro(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e);
  return m
    .replace(/[A-Za-z]:\\[^\s'"]+/g, "(caminho)")
    .replace(/(^|[\s'"(])\/(?:[\w.-]+\/)+[\w.-]*/g, "$1(caminho)")
    .split("\n")[0]
    .slice(0, 300);
}

// Montantes que podem ser negativos (prejuízo fiscal); os restantes números têm de ser >= 0.
const PODEM_SER_NEGATIVOS = new Set(["lucro_tributavel"]);

function numeroNegativo(args: unknown, prefixo = ""): string | null {
  if (!args || typeof args !== "object") return null;
  for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
    if (typeof v === "number" && v < 0 && !PODEM_SER_NEGATIVOS.has(k)) return prefixo + k;
    if (v && typeof v === "object") {
      const r = numeroNegativo(v, `${prefixo}${k}.`);
      if (r) return r;
    }
  }
  return null;
}

/**
 * Todas as tools passam por aqui: montantes negativos são recusados nomeando o campo e
 * qualquer exceção vira uma resposta de texto (sem stack trace) — nunca falha o pedido.
 */
function comErrosTratados(server: McpServer): McpServer {
  const original = server.registerTool.bind(server) as (...args: unknown[]) => unknown;
  const envolvido = Object.create(server) as McpServer;
  (envolvido as unknown as { registerTool: unknown }).registerTool = (
    nome: string,
    config: unknown,
    handler: (...a: unknown[]) => unknown
  ) =>
    original(nome, config, async (...a: unknown[]) => {
      try {
        const negativo = numeroNegativo(a[0]);
        if (negativo) return texto(`Valor inválido em '${negativo}': não pode ser negativo.`);
        return await handler(...a);
      } catch (e) {
        return texto(`Não foi possível concluir: ${mensagemErro(e)}`);
      }
    });
  return envolvido;
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

export function registerTools(servidor: McpServer): void {
  const server = comErrosTratados(servidor);
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
      try {
        // Sem data de fim: hoje em Lisboa (não a data UTC do servidor).
        const fim = parseDataEstrita(data_fim ?? hojeLisboa(), "data_fim");
        const r = calcularJuros(capital, parseDataEstrita(data_inicio, "data_inicio"), fim, tipo);
        return texto(memoriaJuros(capital, r, tipo) + AVISO);
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_juros_lote",
    {
      title: "Juros de mora de várias faturas",
      description:
        "Calcula de uma vez os juros de mora de VÁRIAS faturas (de um ou mais clientes), cada uma por tramos semestrais desde o vencimento, com a indemnização de 40 € por fatura comercial vencida (DL 62/2013, art. 7.º) e os totais por cliente e geral; faturas ainda não vencidas contam só o capital. Usa quando o cliente deve várias faturas ('tenho 5 faturas em atraso', 'quanto me deve ao todo', extrato de conta corrente) e antes da carta 'carta-cobranca-varias-faturas'. EN: late-payment interest on several overdue invoices at once.",
      inputSchema: {
        faturas: z
          .array(
            z.object({
              cliente: z.string().describe("Nome do cliente (devedor)"),
              fatura: z.string().describe("Número da fatura"),
              capital: z.number().describe("Valor em dívida (€)"),
              vencimento: z.string().describe("Data de vencimento (AAAA-MM-DD)"),
              tipo: z.enum(["comercial", "comercial-geral", "civil"]).default("comercial"),
            })
          )
          .min(1)
          .max(500)
          .describe("Faturas em dívida"),
        data_fim: z.string().optional().describe("Data final (AAAA-MM-DD); por defeito, hoje"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ faturas, data_fim }) => {
      const fim = parseDataEstrita(data_fim ?? hojeLisboa(), "data_fim");
      const lista = faturas.map((f, i) => ({ ...f, vencimento: parseDataEstrita(f.vencimento, `faturas[${i}].vencimento`) }));
      return texto(memoriaJurosLote(calcularJurosLote(lista, fim)) + AVISO);
    }
  );

  server.registerTool(
    "calc_procedimento_ccp",
    {
      title: "Procedimento de contratação pública pelo valor",
      description:
        "Diz que procedimentos do Código dos Contratos Públicos se podem usar pelo valor do contrato (ajuste direto, consulta prévia, concurso público ou limitado), com os limiares do DL 177/2026 (procedimentos iniciados a partir de 1/10/2026; com 'inicio' anterior, os limiares antigos). Usa quando o utilizador quer vender ao Estado, responder a um convite ou perceber se um ajuste direto é legal ('posso ser contratado por ajuste direto?', 'que procedimento para 100 mil euros'). EN: which public procurement procedure applies for a contract value.",
      inputSchema: {
        valor: z.number().describe("Valor do contrato, sem IVA (€)"),
        tipo: z.enum(["bens-servicos", "empreitada"]).describe("bens-servicos (aquisição de bens ou serviços) | empreitada (obras públicas)"),
        inicio: z.string().optional().describe("Data de início do procedimento (AAAA-MM-DD); omitido = regime atual"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ valor, tipo, inicio }) => {
      const data = inicio === undefined ? undefined : parseDataEstrita(inicio, "inicio");
      return texto(textoProcedimentoCCP(calcularProcedimentoCCP({ valor, tipo, inicio: data })) + AVISO);
    }
  );

  server.registerTool(
    "calc_prazo",
    {
      title: "Contar prazo legal",
      description:
        "Conta um prazo legal e devolve a data-limite e o termo legal. Tipos: 'judicial' para prazos de processos em tribunal (contestação, oposição à execução, recurso, resposta — CPC, art. 138.º: contínuo, suspende-se nas férias judiciais, termo em dia não útil passa para o dia útil seguinte; 'urgente' para processos urgentes); 'corridos' (por defeito) para prazos civis e contratuais em dias seguidos (CC, art. 279.º); 'uteis' para prazos em dias úteis (ex.: CPA, art. 87.º). Usa quando há um prazo a contar a partir de uma data ('até quando tenho para', 'contestação', 'oposição', 'defesa', 'recurso', 'prazo para responder'). EN: count a legal deadline (court, calendar or business days).",
      inputSchema: {
        inicio: z.string().describe("Data de início (AAAA-MM-DD) — o dia em que se considera feita a citação/notificação; não conta"),
        dias: z.number().int().describe("Número de dias do prazo (0 a 3650)"),
        tipo: z
          .enum(["judicial", "corridos", "uteis"])
          .default("corridos")
          .describe("judicial (CPC 138.º, férias judiciais) | corridos (CC 279.º) | uteis (ex.: CPA 87.º)"),
        urgente: z.boolean().default(false).describe("Processo urgente: o prazo judicial corre nas férias"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ inicio, dias, tipo, urgente }) => {
      try {
        const r = contarPrazo(parseDataEstrita(inicio, "inicio"), dias, tipo, { urgente });
        const termoLegal = r.transferido ? `Termo legal: ${iso(r.dataLegal)}\n` : "";
        return texto(
          `Prazo de ${dias} dias (${tipo}${tipo === "judicial" && urgente ? ", processo urgente" : ""})\n` +
            `Início: ${inicio}\n` +
            termoLegal +
            `⏰ DATA-LIMITE: ${iso(r.dataLimite)}\n\n${r.nota}` +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível contar o prazo: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_compensacao_despedimento",
    {
      title: "Compensação por cessação de contrato",
      description:
        "Calcula a compensação por cessação do contrato de trabalho (art. 366.º CT): 14 dias de RB+diuturnidades por ano (despedimento coletivo, extinção do posto, inadaptação), 24 na caducidade do termo, com os tetos legais e SEM mínimo de 3 meses. Com data_admissao e data_cessacao aplica o regime transitório por períodos (antiguidade anterior a 1/5/2023 — Lei 69/2013 e Lei 13/2023), validado contra o simulador da ACT. Usa quando se fala em despedir/ser despedido ou no valor a receber/pagar ('quanto recebo se for despedido', 'indemnização', 'compensação', 'fim de contrato'). EN: severance pay on dismissal or contract termination.",
      inputSchema: {
        retribuicao_base: z.number().describe("Retribuição base mensal (€)"),
        diuturnidades: z.number().default(0),
        anos: z.number().optional().describe("Antiguidade em anos (sem datas: só regra atual)"),
        data_admissao: z.string().optional().describe("Data de admissão (YYYY-MM-DD) — recomendado"),
        data_cessacao: z.string().optional().describe("Data de cessação (YYYY-MM-DD)"),
        modalidade: z
          .enum(["sem-termo", "extincao-posto", "coletivo", "termo"])
          .default("sem-termo"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ retribuicao_base, diuturnidades, anos, data_admissao, data_cessacao, modalidade }) => {
      try {
        if (data_admissao && data_cessacao) {
          const r = calcularCompensacaoPorDatas({
            retribuicaoBase: retribuicao_base,
            diuturnidades,
            dataAdmissao: parseDataEstrita(data_admissao, "data_admissao"),
            dataCessacao: parseDataEstrita(data_cessacao, "data_cessacao"),
            modalidade: modalidade === "termo" ? "termo" : "sem-termo",
          });
          return texto(
            `Compensação (${modalidade}) — ${data_admissao} a ${data_cessacao}\n` +
              r.periodos
                .map((x) => `- ${x.de} a ${x.ate}: ${x.dias} dias/ano = ${formatarEuros(x.valor)}`)
                .join("\n") +
              `\nVALOR BRUTO: ${formatarEuros(r.total)}` +
              (r.tetoAplicado ? "\n(Aplicado o teto do art. 366.º, n.º 2, CT.)" : "") +
              (r.minimoAplicado ? "\n(Aplicado o mínimo de 3 meses do regime transitório — contrato anterior a 1/11/2011.)" : "") +
              (modalidade === "termo"
                ? "\nNota: 24 dias por toda a duração (prática da ACT); para contratos a termo anteriores a 1/5/2023 não há norma transitória expressa."
                : "") +
              AVISO
          );
        }
        if (anos === undefined) {
          return texto("Indica data_admissao e data_cessacao (recomendado) ou anos.");
        }
        const r = calcularCompensacao(retribuicao_base, diuturnidades, anos, modalidade);
        return texto(
          `Compensação (${modalidade}) — regra atual (antiguidade desde 1/5/2023)\n` +
            `Base (RB+diut.): ${formatarEuros(retribuicao_base + diuturnidades)}\n` +
            `Antiguidade: ${anos} anos · ${r.diasAno} dias/ano\n` +
            `VALOR BRUTO: ${formatarEuros(r.bruto)}` +
            (r.tetoAplicado ? "\n(Aplicado o teto do art. 366.º, n.º 2, CT.)" : "") +
            "\nAtenção: se a antiguidade começou antes de 1/5/2023, usa data_admissao/data_cessacao (regime transitório)." +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_custas_injuncao",
    {
      title: "Taxa de justiça de injunção",
      description:
        "Estima a taxa de justiça de um requerimento de injunção (UC 2026 = 102€). A injunção serve para dívidas até 15.000€ e, entre empresas (transações comerciais), para qualquer valor (DL 62/2013, art. 10.º). Usa quando o utilizador vai avançar com a cobrança judicial de uma dívida e quer saber o custo ('quanto custa uma injunção', 'taxa de justiça', 'custas', 'cobrar judicialmente'). EN: court fee for a payment-order (injunção).",
      inputSchema: { valor: z.number().describe("Valor da dívida (€)") },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ valor }) => {
      try {
        const r = custasInjuncao(valor);
        return texto(
          `Injunção — valor ${formatarEuros(valor)}\n` +
            `Escalão: ${r.escalao}\n` +
            `Taxa de justiça estimada: ${formatarEuros(r.taxa)}` +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_imposto_selo_heranca",
    {
      title: "Imposto do selo em herança",
      description:
        "Calcula o imposto do selo numa herança ou doação (verba 1.2: 10%; isentos cônjuge/unido de facto, descendentes e ascendentes). Na DOAÇÃO de imóveis acresce 0,8% sobre o VPT (verba 1.1), mesmo para os isentos; na herança não. Usa em partilhas e heranças quando se quer saber o imposto a pagar ('quanto pago de imposto na herança', 'partilha', 'doação', 'herdar'). EN: stamp duty on an inheritance or gift.",
      inputSchema: {
        valor: z.number().describe("Valor dos bens (€)"),
        herdeiro: z
          .enum(["conjuge", "descendente", "ascendente", "outro"])
          .default("outro"),
        inclui_imovel: z.boolean().default(false),
        vpt_imovel: z.number().default(0),
        doacao: z.boolean().default(false).describe("true para doação (acresce 0,8% sobre o VPT dos imóveis); false para herança"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ valor, herdeiro, inclui_imovel, vpt_imovel, doacao }) => {
      const r = impostoSeloHeranca(valor, herdeiro, inclui_imovel, vpt_imovel, doacao);
      return texto(
        `Imposto do selo — ${doacao ? "doação" : "herança"} (beneficiário: ${herdeiro})\n` +
          `IS transmissão (10%, verba 1.2): ${r.isento ? "ISENTO" : formatarEuros(r.isTransmissao)}\n` +
          (inclui_imovel
            ? doacao
              ? `IS imóvel (0,8% VPT, verba 1.1): ${formatarEuros(r.isImovel)}\n`
              : "IS imóvel: não se aplica na herança (a verba 1.1 só abrange a aquisição onerosa ou por doação)\n"
            : "") +
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
        "Calcula o IMT 2026 (Continente, imposto na compra de imóvel) incl. IMT Jovem, mais o Imposto do Selo de 0,8% (no IMT Jovem o Selo também é isento até 330.539 € e, acima, só incide sobre o excedente — CIS, art. 7.º-A). Usa quando o utilizador vai comprar casa/imóvel e quer saber os impostos da aquisição ('quanto pago de IMT', 'impostos na compra de casa', 'comprar imóvel'). EN: property transfer tax (IMT) on a home purchase.",
      inputSchema: {
        valor: z.number().describe("Maior entre preço e VPT (€)"),
        tipo: z.enum(["hpp", "secundaria"]).default("hpp"),
        jovem: z.boolean().default(false).describe("Isenção IMT Jovem (≤35 anos, 1.ª HPP)"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ valor, tipo, jovem }) => {
      try {
        const r = calcularIMT(valor, tipo, jovem);
        const seloTxt = jovem && tipo === "hpp" ? "Imposto do Selo (IMT Jovem — CIS, art. 7.º-A)" : "Imposto do Selo (0,8%)";
        return texto(
          `IMT 2026 (${tipo}${jovem ? " + IMT Jovem" : ""})\n` +
            `Valor: ${formatarEuros(valor)}\n` +
            `Regime: ${r.regime}\n` +
            `IMT: ${formatarEuros(r.imt)}\n` +
            `${seloTxt}: ${formatarEuros(r.selo)}\n` +
            `TOTAL impostos: ${formatarEuros(r.total)}` +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_prescricao",
    {
      title: "Prazo de prescrição/caducidade",
      description: `Calcula a data-limite de prescrição/caducidade de um direito ou dívida. Usa quando o utilizador pergunta 'ainda posso cobrar/reclamar?', 'já prescreveu?', 'há quanto tempo é a dívida', 'caducou?' ou se um prazo legal já expirou. Faturas entre empresas: 'creditos-comerciais' (20 anos, art. 309.º CC); serviços de profissões liberais e vendas a quem não é comerciante: 2 anos presuntivos (art. 317.º CC); rendas, juros e prestações periódicas: 5 anos (art. 310.º CC). Tipos: ${PRESCRICAO_TIPOS.join(", ")}. EN: limitation/time-bar deadline (is the claim still enforceable?).`,
      inputSchema: {
        inicio: z.string().describe("Data de início da contagem (YYYY-MM-DD)"),
        tipo: z.enum(PRESCRICAO_TIPOS as [string, ...string[]]),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ inicio, tipo }) => {
      try {
        const r = calcularPrescricao(parseDataEstrita(inicio, "inicio"), tipo);
        return texto(
          `Prescrição/caducidade — ${r.descricao}\n` +
            `Base: ${r.base}\n` +
            `Prazo: ${r.prazoTexto}${r.presuntiva ? " (presuntiva)" : ""}\n` +
            `Início: ${inicio}\n` +
            `⏰ DATA-LIMITE: ${iso(r.limite)}\n\n` +
            (r.aviso ? `${r.aviso}\n\n` : "") +
            "Nota: a prescrição interrompe-se com a citação ou notificação judicial (ex.: injunção) ou com o reconhecimento da dívida (arts. 323.º e 325.º CC); uma carta ou email de cobrança não a interrompe." +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_irs_simplificado",
    {
      title: "IRS — rendimento tributável (regime simplificado)",
      description:
        "Calcula o rendimento tributável no regime simplificado (Cat. B/ENI), aplicando o coeficiente ao rendimento bruto (não calcula o imposto final, pois os escalões mudam anualmente). Usa para estimativas de IRS de trabalhador independente/recibos verdes ('quanto pago de IRS como independente', 'regime simplificado', 'recibos verdes', 'ENI'). Coeficientes (CIRS, art. 31.º): mercadorias 0,15; atividades da tabela do art. 151.º 0,75; restantes serviços 0,35; propriedade intelectual 0,95. EN: simplified-regime taxable income for the self-employed.",
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
      try {
        const r = calcularIRSSimplificado(rendimento, tipo);
        return texto(
          `IRS simplificado (${tipo})\n` +
            `Rendimento bruto: ${formatarEuros(rendimento)}\n` +
            `Coeficiente: ${String(r.coeficiente).replace(".", ",")} (CIRS, art. 31.º, n.º 1)\n` +
            `RENDIMENTO TRIBUTÁVEL: ${formatarEuros(r.tributavel)}\n` +
            "(Acresce aos restantes rendimentos e é tributado pelos escalões progressivos de IRS.)" +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
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
          dataAdmissao: parseDataEstrita(a.data_admissao, "data_admissao"),
          dataCessacao: parseDataEstrita(a.data_cessacao, "data_cessacao"),
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
    "exportar_documento",
    {
      title: "Exportar documento para Word (.docx)",
      description:
        "Grava um documento em .docx (Word/LibreOffice) em .juridico-pt/exportados/<nome>.docx: o texto em Markdown já preenchido (conteudo) ou um template tal como está (template). Mantém títulos, listas, tabelas e negrito; tira os comentários e a secção 'Antes de enviar — verificar'. Usa quando o utilizador quer a carta, o contrato ou a minuta em Word ('exporta para Word', 'quero o .docx', 'manda em formato editável'). EN: export a document to .docx.",
      inputSchema: {
        conteudo: z.string().optional().describe("Documento em Markdown, já preenchido"),
        template: z.string().optional().describe("Ou: nome de um template (ex.: 'carta-cobranca-amigavel')"),
        nome: z.string().describe("Nome do ficheiro, sem extensão (ex.: 'carta-cliente-x')"),
        diretorio: z.string().optional().describe("Diretório do projeto (por defeito, cwd)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    async ({ conteudo, template, nome, diretorio }) => {
      const r = exportarDocumento({ conteudo, template, nome, projeto: diretorio });
      return texto(
        `Documento exportado: ${r.caminho} (${Math.ceil(r.bytes / 1024)} KB).` +
          (r.placeholders ? `\n⚠️ Ainda tem ${r.placeholders} campo(s) {{...}} por preencher.` : "") +
          "\nAbre no Word ou no LibreOffice e revê antes de enviar (a lista 'Antes de enviar — verificar' não vai no ficheiro)."
      );
    }
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
        "Lê o perfil da empresa do utilizador (forma jurídica, setor, trabalhadores, volume de negócios, IVA, clientes…) guardado em <projeto>/.juridico-pt/perfil-empresa.md ou, na falta, no perfil geral ~/.juridico-pt/perfil-empresa.md. Usa no início de qualquer questão empresarial para adaptar a resposta à empresa ('a minha empresa', 'somos uma Lda', 'temos trabalhadores'). Sem perfil, devolve as perguntas a fazer. EN: read the saved company profile.",
      inputSchema: {
        diretorio: z
          .string()
          .optional()
          .describe("Diretório do projeto (por defeito, o do cliente/cwd)"),
        perfil: z
          .string()
          .optional()
          .describe("Nome de um perfil nomeado (ex.: cliente de um contabilista); omitido = perfil ativo ou o por defeito"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ diretorio, perfil }) => {
      let p;
      try {
        p = lerPerfil({ projeto: diretorio, perfil });
      } catch (e) {
        return texto(`Não foi possível ler o perfil: ${(e as Error).message}`);
      }
      if (!p) return texto(textoPerguntasPerfil());
      return texto(
        (p.aviso ? `⚠️ ${p.aviso}\n` : "") +
        `Perfil da empresa${p.nome ? ` '${p.nome}'` : ""} (${p.origem}) — ${p.caminho}\n` +
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
        "Grava/atualiza o perfil da empresa do utilizador (funde com o existente e atualiza a data). destino 'projeto' -> <projeto>/.juridico-pt/perfil-empresa.md; destino 'geral' -> ~/.juridico-pt/perfil-empresa.md (empresa por defeito). Usa só depois de o utilizador aceitar guardar e só com dados da PRÓPRIA empresa — nunca de um cliente ou terceiro. Campos aceites: forma_juridica, denominacao, setor, trabalhadores, volume_negocios, regime_iva, contabilidade, clientes, dados_pessoais, linguas, notas. EN: save the company profile.",
      inputSchema: {
        campos: z
          .record(z.string())
          .describe("Campos a gravar, ex.: {forma_juridica: 'Lda', setor: 'Restauração', trabalhadores: '12'}"),
        destino: z.enum(["projeto", "geral"]).default("projeto"),
        diretorio: z
          .string()
          .optional()
          .describe("Diretório do projeto quando destino = projeto (por defeito, cwd)"),
        perfil: z
          .string()
          .optional()
          .describe("Nome do perfil (ex.: 'cliente-a'); omitido = perfil por defeito perfil-empresa.md"),
        acrescentar_gitignore: z
          .boolean()
          .default(false)
          .describe("Num repositório git, acrescentar '.juridico-pt/' ao .gitignore (só com o acordo do utilizador)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    async ({ campos, destino, diretorio, perfil, acrescentar_gitignore }) => {
      try {
        const p = guardarPerfil(campos, destino, { projeto: diretorio, perfil, acrescentarGitignore: acrescentar_gitignore });
        return texto(
          `Perfil guardado (${p.origem}) em ${p.caminho}\n${resumoPerfil(p)}` +
            (p.avisoGitignore ? `\n\n⚠️ ${p.avisoGitignore}` : "")
        );
      } catch (e) {
        return texto(`Não foi possível guardar o perfil: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "apagar_perfil",
    {
      title: "Apagar perfil da empresa e os dados dele",
      description:
        "Apaga um perfil guardado e o que lhe pertence: o ficheiro do perfil, os prazos desse perfil em .juridico-pt/prazos.md, os calendários .ics do perfil e a marca de perfil ativo (direito ao apagamento). nome 'perfil-empresa' apaga o perfil por defeito. Usa só quando o utilizador pedir para apagar ('apaga os dados do cliente X', 'esquece a minha empresa') e confirma antes — não se desfaz. EN: delete a saved profile and its data.",
      inputSchema: {
        nome: z.string().describe("Nome do perfil (ex.: 'cliente-a'; 'perfil-empresa' = o perfil por defeito)"),
        destino: z.enum(["projeto", "geral"]).default("projeto"),
        diretorio: z.string().optional().describe("Diretório do projeto (por defeito, cwd)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ nome, destino, diretorio }) => {
      const { apagados } = apagarPerfil(nome, destino, { projeto: diretorio });
      if (apagados.length === 0) return texto(`Não encontrei dados do perfil '${nome}' (${destino}). Nada foi apagado.`);
      return texto(`Apagado (${destino}):\n${apagados.map((a) => `- ${a}`).join("\n")}`);
    }
  );

  server.registerTool(
    "listar_perfis",
    {
      title: "Listar perfis de empresa",
      description:
        "Lista os perfis de empresa nomeados guardados (no projeto e no perfil geral) e indica o ativo. Usa quando o utilizador gere várias empresas (contabilista, consultor, grupo) e quer ver ou escolher a empresa em causa ('que clientes tenho', 'muda para a empresa X'). EN: list saved company profiles.",
      inputSchema: {
        diretorio: z.string().optional().describe("Diretório do projeto (por defeito, cwd)"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ diretorio }) => {
      const lst = listarPerfis({ projeto: diretorio });
      if (lst.length === 0) {
        return texto("Sem perfis nomeados. Grava um com guardar_perfil_empresa e o parâmetro perfil (ex.: 'cliente-a').");
      }
      return texto(
        "Perfis de empresa:\n" +
          lst.map((x) => `- ${x.nome} (${x.origem})${x.ativo ? " ← ativo" : ""}`).join("\n")
      );
    }
  );

  server.registerTool(
    "ativar_perfil",
    {
      title: "Ativar perfil de empresa",
      description:
        "Define o perfil de empresa ativo (usado nas respostas, no hook de início de sessão e no calendário de obrigações). destino 'projeto' (só esta pasta) ou 'geral' (todas as pastas sem perfil ativo próprio). EN: set the active company profile.",
      inputSchema: {
        nome: z.string().describe("Nome do perfil (ex.: 'cliente-a')"),
        destino: z.enum(["projeto", "geral"]).default("projeto"),
        diretorio: z.string().optional().describe("Diretório do projeto (por defeito, cwd)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    async ({ nome, destino, diretorio }) => {
      try {
        ativarPerfil(nome, destino, { projeto: diretorio });
        const p = lerPerfil({ projeto: diretorio });
        return texto(`Perfil ativo: ${nome} (${destino}).` + (p?.aviso ? `\n⚠️ ${p.aviso}` : ""));
      } catch (e) {
        return texto(`Não foi possível ativar: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calendario_obrigacoes",
    {
      title: "Calendário de obrigações legais da empresa",
      description:
        "Gera o calendário anual de obrigações legais a partir do perfil da empresa: IVA (mensal/trimestral, recapitulativa), e-fatura, DMR, retenções, Modelo 10, Modelo 22, pagamentos por conta, IES, Modelo 3 (ENI), Segurança Social, aprovação de contas, RCBE, Relatório Único, mapa de férias, formação e RGPC (50+ trabalhadores). Cada data tem base legal e fonte; feriados, fins de semana, férias fiscais e prorrogações por despacho já aplicados. Com exportar=true grava um .ics para importar no Google Calendar / Outlook. Usa para 'que obrigações tenho', 'prazos fiscais do ano', 'quando entrego o IVA', 'agenda fiscal', 'calendário para o Google Calendar'. EN: yearly compliance calendar (tax, social security, corporate, labour) with .ics export.",
      inputSchema: {
        ano: z.number().int().min(2000).max(2100).describe("Ano civil (ex.: 2026)"),
        mes: z.number().int().min(1).max(12).optional().describe("Só este mês (1-12)"),
        exportar: z.boolean().default(false).describe("Gravar .juridico-pt/calendario-<ano>[-<perfil>].ics"),
        diretorio: z.string().optional().describe("Diretório do projeto (perfil e exportação; por defeito, cwd)"),
        perfil: z.string().optional().describe("Perfil nomeado a usar (por defeito, o ativo)"),
        por_perfil: z
          .boolean()
          .default(false)
          .describe("Modo contabilista: gerar e exportar um .ics por cada perfil nomeado (calendario-<ano>-<perfil>.ics)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    async ({ ano, mes, exportar, diretorio, perfil, por_perfil }) => {
      try {
        if (por_perfil) {
          const perfis = listarPerfis({ projeto: diretorio });
          if (perfis.length === 0) {
            return texto("Sem perfis nomeados (.juridico-pt/perfis/). Grava-os com guardar_perfil_empresa e o parâmetro perfil.");
          }
          const linhas = perfis.map(({ nome }) => {
            const pn = lerPerfil({ projeto: diretorio, perfil: nome });
            const cal = gerarCalendario(ano, pn?.campos ?? null);
            const f = exportarICS(ano, cal, diretorio, undefined, nome);
            const nAc = cal.filter((o) => o.aConfirmar).length;
            return `- ${nome}: ${cal.length} prazos${nAc ? ` (${nAc} a confirmar)` : ""} -> ${f}`;
          });
          return texto(
            `Calendários ${ano} por perfil (${perfis.length}):\n${linhas.join("\n")}\n\n` +
              "Importa cada .ics num calendário próprio (Google Calendar: Definições → Importar e exportar → Importar)." +
              AVISO
          );
        }
        const p = lerPerfil({ projeto: diretorio, perfil });
        // Sem perfil: formulário (elicitation) se o cliente o suportar; senão, perguntas em texto.
        const form = p ? null : await pedirPerfil(servidor, `o calendário de obrigações de ${ano}`);
        let notaForm = "";
        if (form?.guardar) {
          const g = guardarPerfil(form.campos, "projeto", { projeto: diretorio });
          notaForm = `Perfil guardado em ${g.caminho}.${g.avisoGitignore ? ` ⚠️ ${g.avisoGitignore}` : ""}\n`;
        }
        const campos = p?.campos ?? form?.campos ?? null;
        const cal = gerarCalendario(ano, campos);
        const nAc = cal.filter((o) => o.aConfirmar).length;
        const origem = p
          ? ` — perfil${p.nome ? ` '${p.nome}'` : ""} (${p.origem})`
          : form
            ? ` — dados do formulário (${Object.entries(form.campos).map(([k, v]) => `${k}: ${v}`).join(" · ")})`
            : " — SEM perfil da empresa";
        let out =
          `Calendário de obrigações ${ano}${origem} · ${cal.length} prazos${nAc ? ` (${nAc} a confirmar)` : ""}\n` +
          (p?.aviso ? `⚠️ ${p.aviso}\n` : "") +
          notaForm +
          (!campos
            ? `Sem perfil da empresa, as obrigações vêm marcadas ❓. Pergunta ao utilizador: ${CAMPOS_FORMULARIO.join(", ")} ` +
              "(e só o mais que for relevante) e oferece guardar com guardar_perfil_empresa para um calendário à medida.\n"
            : "") +
          formatarCalendario(cal, { mes });
        if (exportar) {
          const caminho = exportarICS(ano, cal, diretorio, undefined, p?.nome);
          out +=
            `\n\n📅 Exportado: ${caminho}\nGoogle Calendar: Definições → Importar e exportar → Importar (escolhe um calendário próprio, ex.: "Obrigações"). Outlook/Apple: abrir o ficheiro .ics.`;
        } else {
          out += "\n\nPara importar no Google Calendar/Outlook: chama de novo com exportar=true (gera um .ics).";
        }
        out +=
          "\n\nDatas conferidas com o calendário fiscal da AT; prorrogações posteriores por despacho podem alterar prazos — confirmar no Portal das Finanças e na Segurança Social Direta." +
          AVISO;
        return texto(out);
      } catch (e) {
        return texto(`Não foi possível gerar o calendário: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "registar_prazo",
    {
      title: "Registar prazo em curso",
      description:
        "Guarda um prazo a correr (data-limite, descrição, origem) em .juridico-pt/prazos.md do projeto; o hook avisa ao abrir cada sessão quando estiver vencido ou a 7 dias ou menos. Usa sempre que surgir um prazo perentório (notificação da AT, citação, audição prévia, recurso, resposta a carta) — de preferência depois de o calcular com calc_prazo. EN: save a running deadline with start-of-session reminders.",
      inputSchema: {
        data: z.string().describe("Data-limite AAAA-MM-DD"),
        descricao: z.string().describe("O que tem de ser feito (ex.: 'Oposição à execução fiscal')"),
        origem: z.string().optional().describe("Norma ou ato de origem (ex.: 'art. 203.º CPPT, citação de 20/9')"),
        perfil: z.string().optional().describe("Perfil (empresa/cliente) a que o prazo pertence — modo contabilista"),
        diretorio: z.string().optional().describe("Diretório do projeto (por defeito, cwd)"),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    async ({ data, descricao, origem, perfil, diretorio }) => {
      try {
        const p = registarPrazo({ data, descricao, origem, perfil }, diretorio);
        const { proximos, vencidos } = prazosProximos([p], new Date(), 7);
        const alerta = vencidos.length
          ? " ⚠️ Esta data já passou."
          : proximos.length
            ? ` ⏰ Faltam ${proximos[0].faltam} dia(s).`
            : "";
        return texto(`Prazo registado: ${p.data} — ${p.descricao}${p.origem ? ` (${p.origem})` : ""}${p.perfil ? ` [perfil ${p.perfil}]` : ""}.${alerta}\nFicheiro: .juridico-pt/prazos.md (aviso automático ao abrir a sessão).`);
      } catch (e) {
        return texto(`Não foi possível registar: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "listar_prazos",
    {
      title: "Listar prazos em curso",
      description:
        "Lista os prazos registados no projeto (.juridico-pt/prazos.md), com os vencidos e os dias em falta. Usa para 'que prazos tenho', 'o que está a correr', 'prazos pendentes'. EN: list running deadlines.",
      inputSchema: {
        diretorio: z.string().optional().describe("Diretório do projeto (por defeito, cwd)"),
        incluir_concluidos: z.boolean().default(false),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ diretorio, incluir_concluidos }) => {
      try {
        const todos = lerPrazos(diretorio);
        if (todos.length === 0) return texto("Sem prazos registados neste projeto (usa registar_prazo).");
        const { vencidos, proximos } = prazosProximos(todos, new Date(), 36500);
        const linhas = [
          ...vencidos.map((x) => `- ⚠️ VENCIDO ${x.data} — ${x.descricao}${x.origem ? ` (${x.origem})` : ""}${x.perfil ? ` [${x.perfil}]` : ""}`),
          ...proximos.map((x) => `- ${x.faltam <= 7 ? "⏰ " : ""}${x.data} — ${x.descricao}${x.origem ? ` (${x.origem})` : ""}${x.perfil ? ` [${x.perfil}]` : ""} · ${x.faltam === 0 ? "termina hoje" : `faltam ${x.faltam} dias`}`),
        ];
        if (incluir_concluidos) {
          linhas.push(...todos.filter((x) => x.concluido).map((x) => `- ✔ ${x.data} — ${x.descricao} (cumprido)`));
        }
        return texto(`Prazos em curso:\n${linhas.join("\n") || "(nenhum em aberto)"}\nConfirma sempre a contagem com calc_prazo (dias úteis, férias judiciais, dilação).`);
      } catch (e) {
        return texto(`Não foi possível ler os prazos: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "concluir_prazo",
    {
      title: "Marcar prazo como cumprido",
      description:
        "Marca como cumprido um prazo registado (data + descrição exatas, como em listar_prazos). EN: mark a deadline as done.",
      inputSchema: {
        data: z.string().describe("Data-limite AAAA-MM-DD"),
        descricao: z.string(),
        diretorio: z.string().optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    async ({ data, descricao, diretorio }) => {
      try {
        return texto(
          concluirPrazo(data, descricao, diretorio)
            ? `Cumprido: ${data} — ${descricao}.`
            : `Não encontrei um prazo em aberto com a data ${data} e a descrição '${descricao}' (vê listar_prazos).`
        );
      } catch (e) {
        return texto(`Não foi possível concluir: ${(e as Error).message}`);
      }
    }
  );

  const pct = (x: number) => `${String(Math.round(x * 100) / 100).replace(".", ",")}%`;

  server.registerTool(
    "calc_salario_liquido",
    {
      title: "Salário líquido (2026)",
      description:
        "Calcula o salário líquido mensal de um trabalhador por conta de outrem no Continente em 2026: retenção na fonte de IRS pelas tabelas do Despacho 233-A/2026 (I: não casado sem dependentes ou casado dois titulares; II: não casado com dependentes; III: casado único titular), Segurança Social 11% e subsídio de refeição (isento até 6,15 €/dia em dinheiro ou 10,46 €/dia em cartão; o excesso é tributado). Usa para 'quanto recebo líquido', 'salário líquido de X', 'quanto desconta', 'proposta salarial'. EN: Portuguese net salary 2026.",
      inputSchema: {
        bruto: z.number().describe("Retribuição bruta mensal (€)"),
        tabela: z.enum(["I", "II", "III"]).default("I"),
        dependentes: z.number().int().min(0).default(0),
        subsidio_refeicao_dia: z.number().default(0).describe("Subsídio de refeição por dia (€)"),
        dias_refeicao: z.number().default(22),
        refeicao_cartao: z.boolean().default(false),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ bruto, tabela, dependentes, subsidio_refeicao_dia, dias_refeicao, refeicao_cartao }) => {
      try {
        const r = calcularSalarioLiquido({
          bruto,
          tabela,
          dependentes,
          subsidioRefeicaoDia: subsidio_refeicao_dia,
          diasRefeicao: subsidio_refeicao_dia ? dias_refeicao : 0,
          refeicaoCartao: refeicao_cartao,
        });
        return texto(
          `Salário líquido (Continente, 2026) — bruto ${formatarEuros(bruto)}, tabela ${tabela}, ${dependentes} dependente(s)\n` +
            (subsidio_refeicao_dia
              ? `Subsídio de refeição: ${formatarEuros(r.refeicaoIsenta + r.refeicaoTributavel)} (isento ${formatarEuros(r.refeicaoIsenta)}; tributável ${formatarEuros(r.refeicaoTributavel)})\n`
              : "") +
            `Segurança Social (11%): −${formatarEuros(r.segurancaSocial)}\n` +
            `Retenção de IRS (taxa ${pct(r.taxaMarginal)}${dependentes >= 3 ? ", −1 p.p. por 3+ dependentes" : ""}): −${formatarEuros(r.retencaoIRS)}\n` +
            `LÍQUIDO: ${formatarEuros(r.liquido)}\n` +
            "Subsídios de férias e de Natal têm retenção autónoma (art. 99.º-C CIRS). Açores e Madeira têm tabelas próprias." +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_custo_trabalhador",
    {
      title: "Custo total de um trabalhador para a empresa",
      description:
        "Calcula o custo anual e mensal médio de um trabalhador para o empregador: 14 retribuições, TSU 23,75% (incluindo sobre o subsídio de refeição acima do limite isento), subsídio de refeição e seguro de acidentes de trabalho. Usa para 'quanto me custa contratar', 'custo de um trabalhador', 'orçamento de contratação'. EN: total employer cost of an employee in Portugal.",
      inputSchema: {
        base: z.number().describe("Retribuição base mensal (€)"),
        diuturnidades: z.number().default(0),
        subsidio_refeicao_dia: z.number().default(0),
        dias_refeicao_mes: z.number().default(22),
        meses_refeicao: z.number().default(11),
        refeicao_cartao: z.boolean().default(false),
        taxa_seguro_at: z.number().default(0).describe("Taxa do seguro de acidentes de trabalho (ex.: 0,01 = 1%)"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (a) => {
      try {
        const r = calcularCustoTrabalhador({
          base: a.base,
          diuturnidades: a.diuturnidades,
          subsidioRefeicaoDia: a.subsidio_refeicao_dia,
          diasRefeicaoMes: a.dias_refeicao_mes,
          mesesRefeicao: a.meses_refeicao,
          refeicaoCartao: a.refeicao_cartao,
          taxaSeguroAT: a.taxa_seguro_at,
        });
        return texto(
          `Custo anual do trabalhador (2026) — base ${formatarEuros(a.base)}\n` +
            `Retribuições (14 meses): ${formatarEuros(r.retribuicaoAnual)}\n` +
            `TSU do empregador (23,75%): ${formatarEuros(r.tsuAnual)}\n` +
            `Subsídio de refeição: ${formatarEuros(r.refeicaoAnual)}\n` +
            `Seguro de acidentes de trabalho: ${formatarEuros(r.seguroAnual)}\n` +
            `TOTAL ANUAL: ${formatarEuros(r.total)} · média mensal ${formatarEuros(r.mensalMedio)}\n` +
            "Não inclui: medicina no trabalho, formação (40 h/ano), FGCT (suspenso), seguros de saúde ou prémios." +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_irc",
    {
      title: "IRC estimado (2026)",
      description:
        "Estima o IRC de uma sociedade: taxa geral (19% em 2026, 18% em 2027, 17% desde 2028) ou PME/Small Mid Cap (15% nos primeiros 50.000 €), dedução de prejuízos (até 65%), derrama municipal (até 1,5%), derrama estadual (3/5/9%) e tributações autónomas (viaturas, representação, ajudas de custo, despesas não documentadas; +10 p.p. com prejuízo). Usa para 'quanto pago de IRC', 'imposto da empresa', 'tributação autónoma da viatura', 'vale a pena carro elétrico'. EN: Portuguese corporate income tax estimate.",
      inputSchema: {
        lucro_tributavel: z.number().describe("Lucro tributável (€); negativo = prejuízo fiscal"),
        pme: z.boolean().describe("PME ou Small Mid Cap (certificação IAPMEI)"),
        derrama_municipal: z.number().default(0.015).describe("Taxa da derrama do município (0 a 0,015)"),
        prejuizos_dedutiveis: z.number().default(0),
        despesas_representacao: z.number().default(0),
        ajudas_custo: z.number().default(0),
        despesas_nao_documentadas: z.number().default(0),
        viaturas: z
          .array(
            z.object({
              custo_aquisicao: z.number(),
              tipo: z.enum(["combustao", "phev", "gnv", "eletrico"]),
              encargos: z.number().describe("Encargos anuais (depreciações, combustível, seguros, manutenção, rendas)"),
            })
          )
          .default([]),
        isento_agravamento: z.boolean().default(false).describe("Sem +10 p.p. apesar do prejuízo (início de atividade e 2 anos seguintes; em 2026, lucro num dos 3 anos anteriores com declarações cumpridas)"),
        ano: z.number().int().default(2026),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (a) => {
      try {
        const r = calcularIRC({
          lucroTributavel: a.lucro_tributavel,
          pme: a.pme,
          derramaMunicipal: a.derrama_municipal,
          prejuizosDedutiveis: a.prejuizos_dedutiveis,
          despesasRepresentacao: a.despesas_representacao,
          ajudasCusto: a.ajudas_custo,
          despesasNaoDocumentadas: a.despesas_nao_documentadas,
          viaturas: a.viaturas.map((v) => ({ custoAquisicao: v.custo_aquisicao, tipo: v.tipo, encargos: v.encargos })),
          isentoAgravamento: a.isento_agravamento,
          ano: a.ano,
        });
        return texto(
          `IRC ${a.ano} — taxa geral ${r.taxaGeral}%${a.pme ? " (PME: 15% nos primeiros 50.000 €)" : ""}\n` +
            (r.deducaoPrejuizos ? `Dedução de prejuízos (máx. 65%): −${formatarEuros(r.deducaoPrejuizos)}\n` : "") +
            `Matéria coletável: ${formatarEuros(r.materiaColetavel)}\n` +
            `IRC: ${formatarEuros(r.irc)}\n` +
            `Derrama municipal: ${formatarEuros(r.derramaMunicipal)}\n` +
            `Derrama estadual: ${formatarEuros(r.derramaEstadual)}\n` +
            `Tributação autónoma: ${formatarEuros(r.tributacaoAutonoma)}${a.lucro_tributavel < 0 && !a.isento_agravamento ? " (agravada em 10 p.p. pelo prejuízo)" : ""}\n` +
            `TOTAL: ${formatarEuros(r.total)}\n` +
            "Base: CIRC arts. 52.º, 87.º, 87.º-A e 88.º; Lei 64/2025. Não inclui benefícios fiscais (ex.: SIFIDE, DLRR/ICE), pagamentos por conta nem retenções." +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_iva_operacao",
    {
      title: "IVA em operações com o estrangeiro",
      description:
        "Decide o IVA de uma venda ou serviço a cliente estrangeiro: onde se tributa, quem liquida, a menção e o código da AT na fatura (M05, M10, M16, M40, M44) e as declarações (periódica, recapitulativa, OSS). Cobre bens a empresas da UE (VIES), vendas à distância e limiar de 10.000 €, exportações, serviços B2B/B2C, serviços eletrónicos e as exceções do art. 6.º. Usa para 'como faturo a um cliente estrangeiro', 'leva IVA?', 'autoliquidação', 'reverse charge', 'OSS'. EN: VAT treatment of cross-border sales from Portugal.",
      inputSchema: {
        tipo: z.enum(["bens", "servicos"]),
        cliente: z.enum(["empresa", "consumidor"]),
        destino: z.enum(["PT", "UE", "fora-UE"]),
        nif_vies: z.boolean().default(false).describe("NIF de IVA do cliente válido no VIES"),
        vendas_distancia_ue: z.number().default(0).describe("Vendas à distância + serviços eletrónicos a consumidores da UE (ano anterior ou em curso, €)"),
        servico: z
          .enum(["geral", "eletronico", "imovel", "evento", "transporte-passageiros", "restauracao", "lista-art6-11"])
          .default("geral"),
        regime53: z.boolean().default(false).describe("Prestador isento pelo art. 53.º CIVA"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (a) => {
      try {
        const r = decidirIVA({
          tipo: a.tipo,
          cliente: a.cliente,
          destino: a.destino,
          nifVIES: a.nif_vies,
          vendasDistanciaUE: a.vendas_distancia_ue,
          servico: a.servico,
          regime53: a.regime53,
        });
        return texto(
          `IVA da operação — ${a.tipo}, ${a.cliente}, ${a.destino}\n` +
            `Onde se tributa: ${r.tributacao}\n` +
            `Quem liquida: ${r.liquida}\n` +
            (r.codigo ? `Menção na fatura: "${r.mencaoFatura}" (código ${r.codigo})\n` : "") +
            `Declarações: ${r.declaracoes.join("; ") || "—"}\n` +
            `Base legal: ${r.base}\n` +
            r.avisos.map((x) => `- ${x}\n`).join("") +
            "Fora do decisor: operações triangulares, regime da margem, IEC e regime transfronteiriço PME (ver ler_referencia iva-internacional)." +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível decidir: ${(e as Error).message}`);
      }
    }
  );

  server.registerTool(
    "calc_taxa_justica",
    {
      title: "Taxa de justiça (RCP)",
      description:
        "Calcula a taxa de justiça de uma ação pelo valor da causa (Regulamento das Custas Processuais, Tabela I, colunas A/B/C; UC 2026 = 102 €), com o remanescente acima de 275.000 € e a redução de 10% pela entrega eletrónica quando esta não é obrigatória. Usa para 'quanto custa pôr uma ação', 'custas do processo', 'taxa de justiça'. EN: Portuguese court fee.",
      inputSchema: {
        valor_acao: z.number().describe("Valor da causa (€)"),
        tabela: z.enum(["A", "B", "C"]).default("A").describe("A: regra; B: casos do art. 6.º n.º 2 / 7.º / 12.º; C: especial complexidade"),
        reducao_eletronica: z.boolean().default(false),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ valor_acao, tabela, reducao_eletronica }) => {
      try {
        const r = calcularTaxaJustica(valor_acao, { tabela, reducaoEletronica: reducao_eletronica });
        return texto(
          `Taxa de justiça — valor ${formatarEuros(valor_acao)} (${r.escalao}), coluna ${tabela}, UC ${formatarEuros(r.ucValor)}\n` +
            `Taxa inicial: ${String(r.taxaInicialUC).replace(".", ",")} UC = ${formatarEuros(r.taxaInicialEuros)}${reducao_eletronica ? " (com redução a 90%)" : ""}\n` +
            (r.remanescenteUC ? `Remanescente (pago a final; o juiz pode dispensar — art. 6.º, n.º 7, RCP): ${String(r.remanescenteUC).replace(".", ",")} UC = ${formatarEuros(r.remanescenteUC * r.ucValor)}\n` : "") +
            `TOTAL: ${String(r.totalUC).replace(".", ",")} UC = ${formatarEuros(r.totalEuros)}\n` +
            "Cada parte paga a sua taxa (autor e réu). Recursos: Tabela I-B; injunção e embargos/oposição à execução: tabelas próprias (ver calc_custas_injuncao e a Tabela II). Com advogado a via eletrónica é obrigatória — a redução do art. 6.º, n.º 3, normalmente não se aplica." +
            AVISO
        );
      } catch (e) {
        return texto(`Não foi possível calcular: ${(e as Error).message}`);
      }
    }
  );

  void COMPENSACAO_MODALIDADES; // exportado para uso externo/documentação
}
