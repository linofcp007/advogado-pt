#!/usr/bin/env python3
"""Salário líquido mensal e custo anual do trabalhador (Continente, 2026).

Retenção na fonte de IRS: Despacho n.º 233-A/2026 (tabelas I, II e III de
trabalho dependente). Fórmula: R x taxa - parcela a abater - parcela adicional
x dependentes, nunca negativa; com 3 ou mais dependentes, -1 p.p. na taxa
(n.º 5, al. h)). Segurança Social: 11% (trabalhador) e 23,75% (empregador).
Subsídio de refeição isento até 6,15 EUR/dia (numerário) ou 10,46 EUR/dia
(cartão); o excesso é rendimento do trabalho (IRS e SS).

Igual a mcp-server/src/calculators/salario.ts.

Exemplos de uso:
  python scripts/salario_liquido.py salario --bruto 1500 --tabela I --dependentes 0
  python scripts/salario_liquido.py salario --bruto 1500 --refeicao 8 --dias 22
  python scripts/salario_liquido.py custo --base 1500 --refeicao 6 --seguro 0.01
"""

import argparse
import sys
from decimal import ROUND_HALF_UP, Decimal

TSU_TRABALHADOR = 0.11
TSU_EMPREGADOR = 0.2375
REFEICAO_LIMITE_NUMERARIO = 6.15
REFEICAO_LIMITE_CARTAO = 10.46
INF = float("inf")

# (até, taxa %, parcela) — parcela: número ou (taxa %, k, L) para "taxa x k x (L - R)".
_ESC_I_II = [
    (920, 0, 0),
    (1042, 12.5, (12.5, 2.6, 1273.85)),
    (1108, 15.7, (15.7, 1.35, 1554.83)),
    (1154, 15.7, 94.71),
    (1212, 21.2, 158.18),
    (1819, 24.1, 193.33),
    (2119, 31.1, 320.66),
    (2499, 34.9, 401.19),
    (3305, 38.36, 487.66),
    (5547, 39.69, 531.62),
    (20221, 44.95, 823.40),
    (INF, 47.17, 1272.31),
]
TABELAS = {
    "I": (_ESC_I_II, 21.43),
    "II": (_ESC_I_II, 34.29),
    "III": ([
        (991, 0, 0),
        (1042, 12.5, (12.5, 2.6, 1372.15)),
        (1108, 12.5, (12.5, 1.35, 1677.85)),
        (1119, 12.5, 96.17),
        (1432, 12.72, 98.64),
        (1962, 15.7, 141.32),
        (2240, 19.38, 213.53),
        (2773, 22.77, 289.47),
        (3389, 25.7, 370.72),
        (5965, 28.81, 476.12),
        (20265, 38.43, 1049.96),
        (INF, 47.17, 2821.13),
    ], 42.86),
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


def _retencao(r, tabela, dependentes):
    escaloes, adicional = TABELAS[tabela]
    ate, taxa, parcela = next(e for e in escaloes if r <= e[0])
    if taxa == 0:
        return 0.0, 0
    if dependentes >= 3:
        taxa -= 1  # n.º 5, al. h)
    if isinstance(parcela, tuple):
        t, k, limite = parcela
        parcela = t / 100 * k * (limite - r)
    valor = r * taxa / 100 - parcela - adicional * dependentes
    return max(0.0, _r2(valor)), taxa


def _refeicao(dia, dias, cartao):
    limite = REFEICAO_LIMITE_CARTAO if cartao else REFEICAO_LIMITE_NUMERARIO
    total = dia * dias
    isenta = min(dia, limite) * dias
    return _r2(isenta), _r2(total - isenta), _r2(total)


def calcular_salario_liquido(bruto, tabela, dependentes, subsidio_refeicao_dia=0,
                             dias_refeicao=0, refeicao_cartao=False):
    """Salário líquido mensal. Devolve um dict."""
    if bruto < 0:
        raise ValueError("O vencimento bruto tem de ser um valor >= 0.")
    if int(dependentes) != dependentes or dependentes < 0:
        raise ValueError("O número de dependentes tem de ser um inteiro >= 0.")
    if tabela not in TABELAS:
        raise ValueError(f"Tabela de retenção inválida: '{tabela}' (I, II ou III).")
    if subsidio_refeicao_dia < 0 or dias_refeicao < 0:
        raise ValueError("Subsídio de refeição e dias têm de ser >= 0.")
    isenta, tributavel, total_ref = _refeicao(subsidio_refeicao_dia, dias_refeicao,
                                              refeicao_cartao)
    rend = _r2(bruto + tributavel)
    ss = _r2(rend * TSU_TRABALHADOR)
    irs, taxa = _retencao(rend, tabela, int(dependentes))
    return {
        "rendimento_tributavel": rend,
        "seguranca_social": ss,
        "taxa_marginal": taxa,
        "retencao_irs": irs,
        "refeicao_isenta": isenta,
        "refeicao_tributavel": tributavel,
        "liquido": _r2(bruto + total_ref - ss - irs),
    }


def calcular_custo_trabalhador(base, diuturnidades=0, subsidio_refeicao_dia=0,
                               dias_refeicao_mes=22, meses_refeicao=11,
                               refeicao_cartao=False, taxa_seguro_at=0):
    """Custo anual para a empresa. Devolve um dict."""
    if base < 0:
        raise ValueError("A retribuição base tem de ser um valor >= 0.")
    for nome, v in (("diuturnidades", diuturnidades),
                    ("subsidio_refeicao_dia", subsidio_refeicao_dia),
                    ("dias_refeicao_mes", dias_refeicao_mes),
                    ("meses_refeicao", meses_refeicao),
                    ("taxa_seguro_at", taxa_seguro_at)):
        if v < 0:
            raise ValueError(f"{nome} tem de ser >= 0.")
    retribuicao = _r2((base + diuturnidades) * 14)
    _, tributavel, total_ref = _refeicao(subsidio_refeicao_dia,
                                         dias_refeicao_mes * meses_refeicao,
                                         refeicao_cartao)
    tsu = _r2((retribuicao + tributavel) * TSU_EMPREGADOR)
    seguro = _r2(retribuicao * taxa_seguro_at)
    total = _r2(retribuicao + tsu + total_ref + seguro)
    return {
        "retribuicao_anual": retribuicao,
        "tsu_anual": tsu,
        "refeicao_anual": total_ref,
        "seguro_anual": seguro,
        "total": total,
        "mensal_medio": total / 12,
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Salário líquido (retenção de IRS 2026) e custo do trabalhador.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("salario", help="Salário líquido mensal")
    s.add_argument("--bruto", type=float, required=True, help="Retribuição bruta mensal (€)")
    s.add_argument("--tabela", choices=["I", "II", "III"], default="I",
                   help="I: não casado sem dependentes / casado dois titulares; "
                        "II: não casado com dependentes; III: casado único titular")
    s.add_argument("--dependentes", type=int, default=0)
    s.add_argument("--refeicao", type=float, default=0.0, help="Subsídio de refeição/dia (€)")
    s.add_argument("--dias", type=float, default=22, help="Dias com subsídio de refeição")
    s.add_argument("--cartao", action="store_true", help="Subsídio pago em cartão/vale")
    c = sub.add_parser("custo", help="Custo anual para a empresa")
    c.add_argument("--base", type=float, required=True, help="Retribuição base mensal (€)")
    c.add_argument("--diuturnidades", type=float, default=0.0)
    c.add_argument("--refeicao", type=float, default=0.0, help="Subsídio de refeição/dia (€)")
    c.add_argument("--dias", type=float, default=22, help="Dias com refeição por mês")
    c.add_argument("--meses", type=float, default=11, help="Meses com refeição por ano")
    c.add_argument("--cartao", action="store_true")
    c.add_argument("--seguro", type=float, default=0.0, help="Taxa do seguro AT (ex.: 0.01)")
    args = parser.parse_args()

    try:
        if args.cmd == "salario":
            r = calcular_salario_liquido(args.bruto, args.tabela, args.dependentes,
                                         args.refeicao, args.dias if args.refeicao else 0,
                                         args.cartao)
            print("=== Salário líquido mensal (Continente, 2026) ===")
            print(f"Bruto: {formatar_euros(args.bruto)} · Tabela {args.tabela} · "
                  f"{args.dependentes} dependente(s)")
            if r["refeicao_tributavel"]:
                print(f"Refeição acima do limite (tributável): {formatar_euros(r['refeicao_tributavel'])}")
            print(f"Segurança Social (11%): -{formatar_euros(r['seguranca_social'])}")
            print(f"Retenção de IRS ({r['taxa_marginal']}%): -{formatar_euros(r['retencao_irs'])}")
            print(f"LÍQUIDO: {formatar_euros(r['liquido'])}")
        else:
            r = calcular_custo_trabalhador(args.base, args.diuturnidades, args.refeicao,
                                           args.dias, args.meses, args.cartao, args.seguro)
            print("=== Custo anual do trabalhador para a empresa (2026) ===")
            print(f"Retribuições (14 meses): {formatar_euros(r['retribuicao_anual'])}")
            print(f"TSU empregador (23,75%): {formatar_euros(r['tsu_anual'])}")
            print(f"Subsídio de refeição: {formatar_euros(r['refeicao_anual'])}")
            print(f"Seguro de acidentes de trabalho: {formatar_euros(r['seguro_anual'])}")
            print(f"TOTAL ANUAL: {formatar_euros(r['total'])} "
                  f"(média mensal {formatar_euros(r['mensal_medio'])})")
    except ValueError as e:
        parser.error(str(e))
    print()
    print("AVISO: Estimativa de apoio (tabelas do Continente; subsídios de férias e "
          "de Natal com retenção autónoma). Não substitui contabilista nem advogado.")


if __name__ == "__main__":
    main()
