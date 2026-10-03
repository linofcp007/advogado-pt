#!/usr/bin/env python3
"""Decisor de IVA para vendas e serviços com o estrangeiro (sujeito passivo só em PT).

Devolve onde se tributa, quem liquida, o código e a menção da AT na fatura e as
declarações. Regras e códigos: references/iva-internacional.md (CIVA arts. 6.º,
6.º-A, 14.º, 53.º e 57.º; RITI arts. 10.º, 14.º e 30.º; Lei 47/2020 — OSS).

Igual a mcp-server/src/calculators/iva.ts.

Exemplos de uso:
  python scripts/iva_operacao.py --tipo servicos --cliente empresa --destino UE
  python scripts/iva_operacao.py --tipo bens --cliente empresa --destino UE --vies
  python scripts/iva_operacao.py --tipo bens --cliente consumidor --destino UE --vendas-distancia 15000
"""

import argparse
import sys

LIMIAR_COMUM_UE = 10000
DP = "Declaração periódica de IVA"
RECAP = "Declaração recapitulativa (RITI, art. 30.º)"
OSS = "Declaração OSS — regime da União (trimestral; Lei 47/2020)"
MENCOES = {
    "M05": "Isento artigo 14.º do CIVA",
    "M10": "IVA - regime de isenção",
    "M16": "Isento artigo 14.º do RITI",
    "M40": "IVA - autoliquidação",
    "M44": "IVA - Regras específicas - artigo 6.º",
}


def _d(tributacao, liquida, codigo, declaracoes, base, avisos=None):
    return {
        "tributacao": tributacao,
        "liquida": liquida,
        "codigo": codigo,
        "mencao_fatura": MENCOES.get(codigo) if codigo else None,
        "declaracoes": declaracoes,
        "base": base,
        "avisos": avisos or [],
    }


def _pt(base, avisos=None):
    return _d("Portugal (IVA português)", "O fornecedor (tu), à taxa portuguesa",
              None, [DP], base, avisos)


def decidir_iva(tipo, cliente, destino, nif_vies=False, vendas_distancia_ue=0,
                servico="geral", regime53=False):
    """Decide o tratamento de IVA de uma operação. Devolve um dict."""
    if tipo not in ("bens", "servicos"):
        raise ValueError(f"tipo inválido: '{tipo}' (bens ou servicos).")
    if cliente not in ("empresa", "consumidor"):
        raise ValueError(f"cliente inválido: '{cliente}' (empresa ou consumidor).")
    if destino not in ("PT", "UE", "fora-UE"):
        raise ValueError(f"destino inválido: '{destino}' (PT, UE ou fora-UE).")
    if vendas_distancia_ue < 0:
        raise ValueError("vendas_distancia_ue tem de ser >= 0.")
    vd = vendas_distancia_ue

    if regime53:
        avisos = ["Isento sem direito à dedução; dispensado da declaração recapitulativa "
                  "(Ofício-Circulado 25062/2025, ponto 28)."]
        if tipo == "servicos" and cliente == "empresa" and destino != "PT":
            avisos.append("Serviço B2B localizado no país do cliente: o cliente autoliquida; "
                          "acrescentar 'IVA - autoliquidação' à menção (a confirmar).")
        if cliente == "consumidor" and destino == "UE" and vd > LIMIAR_COMUM_UE:
            avisos.append("Acima do limiar comum UE: confirmar o enquadramento (art. 53.º e OSS).")
        return _d("Isento em Portugal (regime de isenção do art. 53.º CIVA)",
                  "Ninguém em Portugal", "M10", [], "CIVA, arts. 53.º e 57.º, n.º 2", avisos)

    if destino == "PT":
        return _pt("CIVA, arts. 1.º e 6.º, n.º 1 (bens) / n.º 6 (serviços)",
                   ["Setores com autoliquidação interna (construção civil, sucata...): "
                    "art. 2.º, n.º 1, als. i) a n), CIVA."])

    if tipo == "bens":
        if destino == "fora-UE":
            return _d("Isento em Portugal — exportação (o país de destino cobra na importação)",
                      "Ninguém em Portugal", "M05", [f"{DP} (campo 8)"],
                      "CIVA, art. 14.º, n.º 1, al. a), e art. 29.º, n.º 8",
                      ["Guardar a prova aduaneira da saída (DAU/e-DA certificado)."])
        if cliente == "empresa":
            if nif_vies:
                return _d("No Estado-Membro de chegada (aquisição intracomunitária do cliente)",
                          "O cliente, no país dele", "M16",
                          [f"{DP} (campo 7 e Quadro 04)", RECAP],
                          "RITI, art. 14.º, n.º 1, al. a), e art. 30.º",
                          ["Validar o NIF no VIES e guardar a prova do transporte "
                           "(Reg. 282/2011, art. 45.º-A)."])
            return _pt("RITI, art. 14.º, n.º 1, al. a), e n.º 2 (sem NIF válido no VIES não há isenção)",
                       ["Pede o NIF de IVA do cliente e valida-o no VIES (com prova do transporte: M16)."])
        if vd > LIMIAR_COMUM_UE:
            return _d("No Estado-Membro do consumidor (vendas à distância acima do limiar comum UE)",
                      "O fornecedor (tu), com a taxa do Estado-Membro do consumidor, declarada no OSS",
                      None, [OSS, f"{DP} (operações não localizadas em PT)"],
                      "CIVA, art. 6.º-A; RITI, art. 10.º, al. a); Lei 47/2020 (OSS)")
        return _pt("CIVA, art. 6.º-A (abaixo do limiar comum UE, sem opção)",
                   ["Podes optar pela tributação no destino (pelo menos 2 anos)."])

    if servico in ("imovel", "evento", "transporte-passageiros", "restauracao"):
        return _d("Onde está o imóvel / tem lugar o evento / é executado o serviço ou percurso",
                  "Segundo a lei desse país (pode obrigar a registo lá)", "M44",
                  [f"{DP} (campo 8)"], "CIVA, art. 6.º, n.ºs 7 e 8")
    if cliente == "empresa":
        if destino == "UE":
            return _d("No Estado-Membro do cliente", "O cliente (autoliquidação / reverse charge)",
                      "M40", [f"{DP} (campo 7 e Quadro 04)", RECAP],
                      "CIVA, art. 6.º, n.º 6, al. a); RITI, art. 30.º")
        return _d("Fora de Portugal (não tributado cá)", "Segundo as regras do país do cliente",
                  "M40", [f"{DP} (campo 8)"], "CIVA, art. 6.º, n.º 6, al. a), a contrário",
                  ["M40 confirmado pela AT para clientes de países terceiros "
                   "(informações vinculativas 16210/2020 e 27890/2025; art. 36.º, n.º 13, CIVA)."])
    if servico == "eletronico":
        if destino == "fora-UE":
            return _d("Fora de Portugal (TBE a consumidor de fora da UE)",
                      "Segundo as regras do país do cliente", "M44", [f"{DP} (campo 8)"],
                      "CIVA, art. 6.º, n.º 9, al. h)")
        if vd > LIMIAR_COMUM_UE:
            return _d("No Estado-Membro do consumidor (TBE acima do limiar comum UE)",
                      "O fornecedor (tu), com a taxa do Estado-Membro do consumidor, declarada no OSS",
                      None, [OSS, f"{DP} (operações não localizadas em PT)"],
                      "CIVA, art. 6.º-A e art. 6.º, n.º 9, al. h); Lei 47/2020 (OSS)")
        return _pt("CIVA, art. 6.º-A (TBE abaixo do limiar comum UE)")
    if destino == "fora-UE" and servico == "lista-art6-11":
        return _d("Fora de Portugal (serviço da lista do art. 6.º, n.º 11)", "Ninguém em Portugal",
                  "M44", [f"{DP} (campo 8)"], "CIVA, art. 6.º, n.º 11")
    return _pt("CIVA, art. 6.º, n.º 6, al. b)",
               ["Serviços da lista do art. 6.º, n.º 11 a consumidores de fora da UE não são "
                "tributados em PT (--servico lista-art6-11)."] if destino == "fora-UE" else None)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Decisor de IVA em operações com o estrangeiro.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--tipo", choices=["bens", "servicos"], required=True)
    parser.add_argument("--cliente", choices=["empresa", "consumidor"], required=True)
    parser.add_argument("--destino", choices=["PT", "UE", "fora-UE"], required=True)
    parser.add_argument("--vies", action="store_true", help="NIF do cliente válido no VIES")
    parser.add_argument("--vendas-distancia", type=float, default=0.0,
                        help="Vendas à distância + TBE a consumidores da UE (€/ano)")
    parser.add_argument("--servico", default="geral",
                        choices=["geral", "eletronico", "imovel", "evento",
                                 "transporte-passageiros", "restauracao", "lista-art6-11"])
    parser.add_argument("--regime53", action="store_true", help="Isento pelo art. 53.º CIVA")
    args = parser.parse_args()
    try:
        r = decidir_iva(args.tipo, args.cliente, args.destino, args.vies,
                        args.vendas_distancia, args.servico, args.regime53)
    except ValueError as e:
        parser.error(str(e))
    print("=== IVA da operação ===")
    print(f"Onde se tributa: {r['tributacao']}")
    print(f"Quem liquida: {r['liquida']}")
    if r["codigo"]:
        print(f"Menção na fatura: \"{r['mencao_fatura']}\" (código {r['codigo']})")
    print(f"Declarações: {'; '.join(r['declaracoes']) or '—'}")
    print(f"Base legal: {r['base']}")
    for a in r["avisos"]:
        print(f"- {a}")
    print()
    print("AVISO: Decisor para os casos típicos; triangulares, margem, IEC e regimes "
          "especiais ficam fora. Não substitui contabilista nem advogado.")


if __name__ == "__main__":
    main()
