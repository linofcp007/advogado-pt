#!/usr/bin/env python3
"""IRC estimado de um período (2026 e seguintes).

- Taxa geral: 19% em 2026, 18% em 2027, 17% desde 2028 (Lei 64/2025, art. 3.º);
  PME/Small Mid Cap: 15% nos primeiros 50.000 EUR de matéria coletável (CIRC 87.º, n.º 2).
- Prejuízos: dedução até 65% do lucro tributável (CIRC 52.º, n.º 2).
- Derrama municipal: até 1,5% do lucro tributável; derrama estadual (CIRC 87.º-A):
  3% de 1,5 a 7,5 M EUR, 5% de 7,5 a 35 M EUR, 9% acima.
- Tributação autónoma (CIRC 88.º): viaturas 8/25/32% (PHEV/GNV 2,5/7,5/15%; elétricas
  10% só acima de 62.500 EUR), representação 10%, ajudas de custo 5%, não
  documentadas 50%; +10 p.p. com prejuízo fiscal (n.º 14), salvo exceções.

Igual a mcp-server/src/calculators/irc.ts.

Exemplos de uso:
  python scripts/irc.py --lucro 100000 --pme --derrama 0.015 --representacao 2000
  python scripts/irc.py --lucro 100000 --pme --prejuizos 80000
  python scripts/irc.py --lucro 30000 --pme --viatura 30000:combustao:5000
"""

import argparse
import sys
from decimal import ROUND_HALF_UP, Decimal

VIATURA_LIMITES = (37500, 45000)
VIATURA_ELETRICA_LIMITE = 62500
TAXAS_VIATURA = {
    "combustao": (8, 25, 32),
    "phev": (2.5, 7.5, 15),
    "gnv": (2.5, 7.5, 15),
}


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    # Meio para cima sobre a representação decimal mais curta (igual ao formatarEuros do TS).
    arredondado = Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    inteiro = f"{arredondado:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def _r2(x):
    return float(Decimal(repr(x)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def taxa_geral_irc(ano):
    """Taxa geral do ano (Lei 64/2025, art. 3.º)."""
    if int(ano) != ano or ano < 2026:
        raise ValueError(f"Ano não suportado: {ano} (2026 e seguintes).")
    return 19 if ano == 2026 else 18 if ano == 2027 else 17


def _nao_neg(nome, v):
    if v is None:
        return 0.0
    if v < 0:
        raise ValueError(f"{nome} tem de ser um valor >= 0.")
    return float(v)


def _taxa_viatura(v):
    custo = _nao_neg("custo_aquisicao", v.get("custo_aquisicao", 0))
    tipo = v.get("tipo", "combustao")
    if tipo == "eletrico":
        return 10 if custo > VIATURA_ELETRICA_LIMITE else 0
    if tipo not in TAXAS_VIATURA:
        raise ValueError(f"Tipo de viatura inválido: '{tipo}'.")
    t = TAXAS_VIATURA[tipo]
    return t[0] if custo < VIATURA_LIMITES[0] else t[1] if custo < VIATURA_LIMITES[1] else t[2]


def calcular_irc(lucro_tributavel, pme, derrama_municipal, prejuizos_dedutiveis=0,
                 despesas_representacao=0, viaturas=None, ajudas_custo=0,
                 despesas_nao_documentadas=0, isento_agravamento=False, ano=2026):
    """IRC, derramas e tributação autónoma. Devolve um dict."""
    if not 0 <= derrama_municipal <= 0.015:
        raise ValueError("A derrama municipal tem de ser uma taxa entre 0 e 0,015 (1,5%).")
    taxa = taxa_geral_irc(ano)
    lucro = float(lucro_tributavel)
    prej = _nao_neg("prejuizos_dedutiveis", prejuizos_dedutiveis)
    deducao = _r2(min(prej, lucro * 0.65)) if lucro > 0 else 0.0
    mc = _r2(max(0.0, lucro - deducao))
    if pme:
        irc = _r2(min(mc, 50000) * 0.15 + max(0.0, mc - 50000) * taxa / 100)
    else:
        irc = _r2(mc * taxa / 100)
    dm = _r2(lucro * derrama_municipal) if lucro > 0 else 0.0
    de = _r2(max(0.0, min(lucro, 7.5e6) - 1.5e6) * 0.03
             + max(0.0, min(lucro, 35e6) - 7.5e6) * 0.05
             + max(0.0, lucro - 35e6) * 0.09)
    agr = 10 if lucro < 0 and not isento_agravamento else 0

    def ta(base, t):
        return base * (t + agr) / 100 if t > 0 else 0.0

    trib = (ta(_nao_neg("despesas_representacao", despesas_representacao), 10)
            + ta(_nao_neg("ajudas_custo", ajudas_custo), 5)
            + ta(_nao_neg("despesas_nao_documentadas", despesas_nao_documentadas), 50))
    for v in viaturas or []:
        trib += ta(_nao_neg("encargos", v.get("encargos", 0)), _taxa_viatura(v))
    trib = _r2(trib)
    return {
        "materia_coletavel": mc,
        "deducao_prejuizos": deducao,
        "irc": irc,
        "derrama_municipal": dm,
        "derrama_estadual": de,
        "tributacao_autonoma": trib,
        "total": _r2(irc + dm + de + trib),
        "taxa_geral": taxa,
    }


def _viatura(texto):
    try:
        custo, tipo, encargos = texto.split(":")
        return {"custo_aquisicao": float(custo), "tipo": tipo, "encargos": float(encargos)}
    except ValueError:
        raise argparse.ArgumentTypeError(
            f"Viatura inválida: '{texto}' (custo:tipo:encargos, ex.: 30000:combustao:5000).")


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="IRC estimado (taxa PME, derramas, tributação autónoma).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--lucro", type=float, required=True, help="Lucro tributável (€); negativo = prejuízo")
    parser.add_argument("--pme", action="store_true", help="PME / Small Mid Cap (15%% nos 1.os 50.000 €)")
    parser.add_argument("--derrama", type=float, default=0.015, help="Taxa da derrama municipal (ex.: 0.015)")
    parser.add_argument("--prejuizos", type=float, default=0.0, help="Prejuízos fiscais dedutíveis (€)")
    parser.add_argument("--representacao", type=float, default=0.0, help="Despesas de representação (€)")
    parser.add_argument("--ajudas-custo", type=float, default=0.0, help="Ajudas de custo/km não faturados (€)")
    parser.add_argument("--nao-documentadas", type=float, default=0.0, help="Despesas não documentadas (€)")
    parser.add_argument("--viatura", type=_viatura, action="append", default=[],
                        help="custo:tipo:encargos (tipo: combustao|phev|gnv|eletrico); repetível")
    parser.add_argument("--isento-agravamento", action="store_true",
                        help="Sem +10 p.p. de TA apesar do prejuízo (início de atividade, etc.)")
    parser.add_argument("--ano", type=int, default=2026)
    args = parser.parse_args()
    try:
        r = calcular_irc(args.lucro, args.pme, args.derrama, args.prejuizos,
                         args.representacao, args.viatura, args.ajudas_custo,
                         args.nao_documentadas, args.isento_agravamento, args.ano)
    except ValueError as e:
        parser.error(str(e))
    print(f"=== IRC {args.ano} (taxa geral {r['taxa_geral']}%{' · PME 15% até 50.000 €' if args.pme else ''}) ===")
    if r["deducao_prejuizos"]:
        print(f"Dedução de prejuízos (máx. 65%): -{formatar_euros(r['deducao_prejuizos'])}")
    print(f"Matéria coletável: {formatar_euros(r['materia_coletavel'])}")
    print(f"IRC: {formatar_euros(r['irc'])}")
    print(f"Derrama municipal: {formatar_euros(r['derrama_municipal'])}")
    print(f"Derrama estadual: {formatar_euros(r['derrama_estadual'])}")
    print(f"Tributação autónoma: {formatar_euros(r['tributacao_autonoma'])}")
    print(f"TOTAL: {formatar_euros(r['total'])}")
    print()
    print("AVISO: Estimativa (sem benefícios fiscais, pagamentos por conta nem retenções). "
          "Não substitui contabilista certificado nem advogado.")


if __name__ == "__main__":
    main()
