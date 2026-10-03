/**
 * Decisor de IVA para vendas e serviços com o estrangeiro (sujeito passivo estabelecido só em PT).
 * Devolve onde se tributa, quem liquida, o código e a menção da AT na fatura e as declarações.
 * Regras e códigos: references/iva-internacional.md (CIVA arts. 6.º, 6.º-A, 14.º, 53.º, 57.º;
 * RITI arts. 10.º, 14.º e 30.º; Lei 47/2020 — OSS; tabela de códigos de isenção da AT).
 *
 * Fora do decisor (devolve aviso): operações em cadeia/triangulares, regime da margem, IEC,
 * meios de transporte novos, regime transfronteiriço PME e a lista completa do art. 6.º, n.º 11.
 *
 * Igual a skills/juridico-pt/scripts/iva_operacao.py.
 */

export interface ParamsIVA {
  tipo: "bens" | "servicos";
  cliente: "empresa" | "consumidor";
  destino: "PT" | "UE" | "fora-UE";
  nifVIES?: boolean;
  /** Vendas à distância de bens + TBE a consumidores de outros EM (ano anterior ou em curso), sem IVA. */
  vendasDistanciaUE?: number;
  servico?: "geral" | "eletronico" | "imovel" | "evento" | "transporte-passageiros" | "restauracao" | "lista-art6-11";
  regime53?: boolean;
}

export interface DecisaoIVA {
  tributacao: string;
  liquida: string;
  codigo: string | null;
  mencaoFatura: string | null;
  declaracoes: string[];
  base: string;
  avisos: string[];
}

/** Limiar comum UE das vendas à distância e TBE a consumidores (art. 6.º-A CIVA). */
export const LIMIAR_COMUM_UE = 10000;

const DP = "Declaração periódica de IVA";
const RECAP = "Declaração recapitulativa (RITI, art. 30.º)";
const OSS = "Declaração OSS — regime da União (trimestral; Lei 47/2020)";

const MENCOES: Record<string, string> = {
  M05: "Isento artigo 14.º do CIVA",
  M10: "IVA - regime de isenção",
  M16: "Isento artigo 14.º do RITI",
  M40: "IVA - autoliquidação",
  M44: "IVA - Regras específicas - artigo 6.º",
};

function decisao(d: Omit<DecisaoIVA, "mencaoFatura" | "avisos"> & { avisos?: string[] }): DecisaoIVA {
  return { ...d, mencaoFatura: d.codigo ? MENCOES[d.codigo] : null, avisos: d.avisos ?? [] };
}

const PT_NORMAL = (base: string, avisos: string[] = []): DecisaoIVA =>
  decisao({
    tributacao: "Portugal (IVA português)",
    liquida: "O fornecedor (tu), à taxa portuguesa",
    codigo: null,
    declaracoes: [DP],
    base,
    avisos,
  });

export function decidirIVA(p: ParamsIVA): DecisaoIVA {
  if (p.tipo !== "bens" && p.tipo !== "servicos") throw new Error(`tipo inválido: '${p.tipo}' (bens ou servicos).`);
  if (p.cliente !== "empresa" && p.cliente !== "consumidor") throw new Error(`cliente inválido: '${p.cliente}' (empresa ou consumidor).`);
  if (!["PT", "UE", "fora-UE"].includes(p.destino)) throw new Error(`destino inválido: '${p.destino}' (PT, UE ou fora-UE).`);
  const vd = Number(p.vendasDistanciaUE ?? 0);
  if (!Number.isFinite(vd) || vd < 0) throw new Error("vendasDistanciaUE tem de ser ≥ 0.");
  const servico = p.servico ?? "geral";

  // Regime de isenção do art. 53.º: menção obrigatória em todas as faturas (art. 57.º, n.º 2).
  if (p.regime53) {
    const avisos = ["Isento sem direito à dedução; dispensado da declaração recapitulativa (Ofício-Circulado 25062/2025, ponto 28)."];
    if (p.tipo === "servicos" && p.cliente === "empresa" && p.destino !== "PT") {
      avisos.push("Serviço B2B localizado no país do cliente (art. 6.º, n.º 6, al. a)): o cliente autoliquida; acrescentar 'IVA - autoliquidação' à menção (a confirmar).");
    }
    if (p.cliente === "consumidor" && p.destino === "UE" && vd > LIMIAR_COMUM_UE) {
      avisos.push("Acima do limiar comum UE: confirmar com o contabilista o enquadramento (art. 53.º e OSS).");
    }
    return decisao({
      tributacao: "Isento em Portugal (regime de isenção do art. 53.º CIVA)",
      liquida: "Ninguém em Portugal",
      codigo: "M10",
      declaracoes: [],
      base: "CIVA, arts. 53.º e 57.º, n.º 2",
      avisos,
    });
  }

  if (p.destino === "PT") {
    return PT_NORMAL("CIVA, arts. 1.º e 6.º, n.º 1 (bens) / n.º 6 (serviços)", [
      "Setores com autoliquidação interna (construção civil, sucata, emissões...): art. 2.º, n.º 1, als. i) a n), CIVA.",
    ]);
  }

  // ---------------- Bens ----------------
  if (p.tipo === "bens") {
    if (p.destino === "fora-UE") {
      return decisao({
        tributacao: "Isento em Portugal — exportação (o país de destino cobra na importação)",
        liquida: "Ninguém em Portugal",
        codigo: "M05",
        declaracoes: [`${DP} (campo 8)`],
        base: "CIVA, art. 14.º, n.º 1, al. a), e art. 29.º, n.º 8",
        avisos: ["Guardar a prova aduaneira da saída (DAU/e-DA certificado)."],
      });
    }
    if (p.cliente === "empresa") {
      if (p.nifVIES) {
        return decisao({
          tributacao: "No Estado-Membro de chegada (aquisição intracomunitária do cliente)",
          liquida: "O cliente, no país dele",
          codigo: "M16",
          declaracoes: [`${DP} (campo 7 e Quadro 04)`, RECAP],
          base: "RITI, art. 14.º, n.º 1, al. a), e art. 30.º",
          avisos: [
            "Validar o NIF no VIES antes de faturar e guardar a prova do transporte (Reg. 282/2011, art. 45.º-A).",
            "Sem recapitulativa correta não há isenção (RITI, art. 14.º, n.º 2).",
          ],
        });
      }
      return PT_NORMAL("RITI, art. 14.º, n.º 1, al. a) e n.º 2 (sem NIF válido no VIES não há isenção)", [
        "Pede o NIF de IVA do cliente e valida-o no VIES: com ele (e prova do transporte) a venda fica isenta (M16).",
      ]);
    }
    // Consumidor da UE: vendas à distância.
    if (vd > LIMIAR_COMUM_UE) {
      return decisao({
        tributacao: "No Estado-Membro do consumidor (vendas à distância acima do limiar comum UE)",
        liquida: "O fornecedor (tu), com a taxa do Estado-Membro do consumidor, declarada no OSS",
        codigo: null,
        declaracoes: [OSS, `${DP} (operações não localizadas em PT)`],
        base: "CIVA, art. 6.º-A; RITI, art. 10.º, al. a); Lei 47/2020 (OSS)",
        avisos: ["A mudança dá-se na operação em que o limiar é ultrapassado (art. 6.º-A, n.º 3). Sem OSS: registo em cada Estado-Membro."],
      });
    }
    return PT_NORMAL("CIVA, art. 6.º-A (abaixo do limiar comum UE, sem opção)", [
      "Podes optar pela tributação no destino (fica pelo menos 2 anos — art. 6.º-A, n.º 4).",
    ]);
  }

  // ---------------- Serviços ----------------
  const excecao = ["imovel", "evento", "transporte-passageiros", "restauracao"].includes(servico);
  if (excecao) {
    return decisao({
      tributacao: "Onde está o imóvel / tem lugar o evento / é executado o serviço ou percurso (regra especial)",
      liquida: "Segundo a lei desse país (pode obrigar a registo lá; muitos países aplicam autoliquidação B2B)",
      codigo: "M44",
      declaracoes: [`${DP} (campo 8)`],
      base: "CIVA, art. 6.º, n.ºs 7 e 8",
      avisos: ["Transporte internacional de passageiros: isento (art. 14.º, n.º 1, al. r)), código M05."],
    });
  }
  if (p.cliente === "empresa") {
    if (p.destino === "UE") {
      return decisao({
        tributacao: "No Estado-Membro do cliente",
        liquida: "O cliente (autoliquidação / reverse charge)",
        codigo: "M40",
        declaracoes: [`${DP} (campo 7 e Quadro 04)`, RECAP],
        base: "CIVA, art. 6.º, n.º 6, al. a); RITI, art. 30.º",
        avisos: ["Validar o NIF no VIES: sem sujeito passivo, a regra é a do consumidor (IVA português)."],
      });
    }
    return decisao({
      tributacao: "Fora de Portugal (não tributado cá)",
      liquida: "Segundo as regras do país do cliente",
      codigo: "M40",
      declaracoes: [`${DP} (campo 8)`],
      base: "CIVA, art. 6.º, n.º 6, al. a), a contrário",
      avisos: ["M40 confirmado pela AT para clientes de países terceiros (informações vinculativas 16210/2020 e 27890/2025; art. 36.º, n.º 13, CIVA)."],
    });
  }
  // Consumidor.
  if (servico === "eletronico") {
    if (p.destino === "fora-UE") {
      return decisao({
        tributacao: "Fora de Portugal (TBE a consumidor de fora da UE)",
        liquida: "Segundo as regras do país do cliente (alguns exigem registo de prestadores digitais)",
        codigo: "M44",
        declaracoes: [`${DP} (campo 8)`],
        base: "CIVA, art. 6.º, n.º 9, al. h)",
        avisos: ["Salvo utilização efetiva em Portugal (art. 6.º, n.ºs 12, al. d), e 14)."],
      });
    }
    if (vd > LIMIAR_COMUM_UE) {
      return decisao({
        tributacao: "No Estado-Membro do consumidor (TBE acima do limiar comum UE)",
        liquida: "O fornecedor (tu), com a taxa do Estado-Membro do consumidor, declarada no OSS",
        codigo: null,
        declaracoes: [OSS, `${DP} (operações não localizadas em PT)`],
        base: "CIVA, art. 6.º-A e art. 6.º, n.º 9, al. h); Lei 47/2020 (OSS)",
        avisos: ["Guardar 2 elementos de prova do país do consumidor (morada, IP, banco/cartão, SIM)."],
      });
    }
    return PT_NORMAL("CIVA, art. 6.º-A (TBE abaixo do limiar comum UE)", [
      "Podes optar pela tributação no destino (fica pelo menos 2 anos — art. 6.º-A, n.º 4).",
    ]);
  }
  if (p.destino === "fora-UE" && servico === "lista-art6-11") {
    return decisao({
      tributacao: "Fora de Portugal (serviço da lista do art. 6.º, n.º 11, a consumidor de fora da UE)",
      liquida: "Ninguém em Portugal",
      codigo: "M44",
      declaracoes: [`${DP} (campo 8)`],
      base: "CIVA, art. 6.º, n.º 11",
    });
  }
  return PT_NORMAL("CIVA, art. 6.º, n.º 6, al. b)", p.destino === "fora-UE"
    ? ["Se o serviço for da lista do art. 6.º, n.º 11 (consultoria, publicidade, advogados, informática/dados, direitos de autor...), não é tributado em PT: usa servico='lista-art6-11' (M44)."]
    : []);
}
