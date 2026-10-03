#!/usr/bin/env python3
"""Calculadora de compensação por cessação de contrato de trabalho (Portugal).

Regime em vigor (art. 366.º do Código do Trabalho, redação da Lei 13/2023):
  - 14 dias de retribuição base + diuturnidades (RB+D) por ano de antiguidade
    (despedimento coletivo, extinção do posto — art. 372.º, inadaptação —
    art. 379.º, e demais remissões para o art. 366.º);
  - 24 dias na caducidade do contrato a termo (arts. 344.º/345.º);
  - frações de ano proporcionais; valor diário = RB+D / 30;
  - tetos: RB+D considerada até 20 RMMG; total até 12 x RB+D (ou 240 RMMG);
  - SEM mínimo de 3 meses (só existe no regime transitório abaixo).

`calcular_compensacao_por_datas` aplica o regime transitório por períodos
(Lei 69/2013, art. 5.º; Lei 13/2023, art. 35.º, n.º 2): os 14 dias só valem
para a antiguidade desde 1/5/2023. Validado contra o simulador oficial da ACT.
Frações (convenção da ACT): anos + (meses + dias/30)/12, dia final incluído.

Igual a mcp-server/src/calculators/compensacao.ts.

Exemplos de uso:
  python scripts/compensacao_despedimento.py --retribuicao-base 1500 \\
      --admissao 2015-05-01 --cessacao 2024-04-30
  python scripts/compensacao_despedimento.py --retribuicao-base 1200 --anos 5
  python scripts/compensacao_despedimento.py --retribuicao-base 1500 \\
      --admissao 2024-01-01 --cessacao 2026-06-30 --modalidade termo
"""

import argparse
from decimal import ROUND_HALF_UP, Decimal
import calendar
import datetime
import sys

DIAS_POR_ANO = {
    "sem-termo": 14,
    "extincao-posto": 14,
    "coletivo": 14,
    "termo": 24,
}

RMMG_2026 = 920
D = datetime.date


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    # Meio para cima sobre a representação decimal mais curta (igual ao formatarEuros do TS).
    arredondado = Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    inteiro = f"{arredondado:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def calcular_compensacao(retribuicao_base, diuturnidades, anos, modalidade,
                         rmmg=RMMG_2026):
    """Regra atual por anos. Devolve (dias_ano, bruto, minimo_aplicado, base)."""
    if modalidade not in DIAS_POR_ANO:
        raise ValueError(f"Modalidade desconhecida: {modalidade}")
    if retribuicao_base < 0 or diuturnidades < 0 or anos < 0:
        raise ValueError("A retribuição, as diuturnidades e os anos têm de ser "
                         "valores positivos.")
    base = min(retribuicao_base + diuturnidades, 20 * rmmg)
    dias_ano = DIAS_POR_ANO[modalidade]
    bruto = min(base / 30 * dias_ano * anos, 12 * base)
    return dias_ano, bruto, False, base


def _fracao_anos(a, b):
    """Fração de anos de a a b (inclusive), convenção da ACT."""
    if b < a:
        return 0.0
    fim = b + datetime.timedelta(days=1)
    y = fim.year - a.year
    m = fim.month - a.month
    d = fim.day - a.day
    if d < 0:
        m -= 1
        d += (fim.replace(day=1) - datetime.timedelta(days=1)).day
    if m < 0:
        y -= 1
        m += 12
    return y + (m + d / 30) / 12


def _mais_anos(data, n):
    try:
        return data.replace(year=data.year + n)
    except ValueError:  # 29/02
        ano = data.year + n
        return D(ano, data.month, calendar.monthrange(ano, data.month)[1])


def calcular_compensacao_por_datas(retribuicao_base, data_admissao,
                                   data_cessacao, modalidade="sem-termo",
                                   diuturnidades=0, rmmg=RMMG_2026):
    """Compensação por períodos de antiguidade. Devolve um dict."""
    if retribuicao_base < 0 or diuturnidades < 0:
        raise ValueError("A retribuição base e as diuturnidades têm de ser "
                         "valores positivos.")
    if data_cessacao < data_admissao:
        raise ValueError("A data de cessação é anterior à data de admissão.")
    adm, ces = data_admissao, data_cessacao
    r = retribuicao_base + diuturnidades
    rc = min(r, 20 * rmmg)
    teto = 12 * rc
    periodos = []

    def seg(de, ate, dias, base):
        s, e = max(de, adm), min(ate, ces)
        if e < s:
            return 0.0
        valor = base / 30 * dias * _fracao_anos(s, e)
        periodos.append({"de": s.isoformat(), "ate": e.isoformat(),
                         "dias": dias, "valor": valor})
        return valor

    if modalidade == "termo":
        total = seg(adm, ces, 24, rc)
        teto_aplicado = total > teto
        return {"total": min(total, teto), "regime": "termo",
                "teto_aplicado": teto_aplicado, "minimo_aplicado": False,
                "periodos": periodos}

    a = b = 0.0
    if adm < D(2011, 11, 1):
        regime = "A"
        ate = min(ces, D(2012, 10, 31))
        if ate >= adm:
            a = r * _fracao_anos(adm, ate)
            periodos.append({"de": adm.isoformat(), "ate": ate.isoformat(),
                             "dias": 30, "valor": a})
        b = seg(D(2012, 11, 1), D(2013, 9, 30), 20, rc)
    elif adm <= D(2013, 9, 30):
        regime = "B"
        b = seg(adm, D(2013, 9, 30), 20, rc)
    else:
        regime = "C"

    c = 0.0
    if regime in ("A", "B"):
        fim_tres = _mais_anos(adm, 3) - datetime.timedelta(days=1)
        inicio12 = D(2013, 10, 1)
        if fim_tres >= D(2013, 10, 1):
            c += seg(D(2013, 10, 1), fim_tres, 18, rc)
            inicio12 = fim_tres + datetime.timedelta(days=1)
        c += seg(inicio12, D(2023, 4, 30), 12, rc)
    else:
        c += seg(adm, D(2023, 4, 30), 12, rc)
    c += seg(D(2023, 5, 1), ces, 14, rc)

    teto_aplicado = False
    if a >= teto:
        total = a
    elif a + b >= teto:
        total, teto_aplicado = teto, True
    else:
        total = a + b + c
        if total > teto:
            total, teto_aplicado = teto, True
    minimo_aplicado = False
    if regime == "A" and total < 3 * r:
        total, minimo_aplicado = 3 * r, True
    return {"total": total, "regime": regime, "teto_aplicado": teto_aplicado,
            "minimo_aplicado": minimo_aplicado, "periodos": periodos}


def _data(texto):
    try:
        return datetime.date.fromisoformat(texto)
    except ValueError:
        raise argparse.ArgumentTypeError(f"Data inválida: '{texto}' (YYYY-MM-DD).")


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Compensação por cessação de contrato (art. 366.º CT), "
                    "com regime transitório por períodos.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--retribuicao-base", type=float, required=True,
                        help="Retribuição base mensal (€)")
    parser.add_argument("--diuturnidades", type=float, default=0.0,
                        help="Diuturnidades mensais (€)")
    parser.add_argument("--anos", type=float,
                        help="Antiguidade em anos (só a regra atual)")
    parser.add_argument("--admissao", type=_data, help="Data de admissão")
    parser.add_argument("--cessacao", type=_data, help="Data de cessação")
    parser.add_argument("--modalidade",
                        choices=["sem-termo", "extincao-posto", "coletivo",
                                 "termo"],
                        default="sem-termo")
    args = parser.parse_args()

    try:
        if args.admissao and args.cessacao:
            mod = "termo" if args.modalidade == "termo" else "sem-termo"
            r = calcular_compensacao_por_datas(
                args.retribuicao_base, args.admissao, args.cessacao, mod,
                args.diuturnidades)
            print("=== Compensação por Cessação de Contrato (por períodos) ===")
            for p in r["periodos"]:
                print(f"- {p['de']} a {p['ate']}: {p['dias']} dias/ano = "
                      f"{formatar_euros(p['valor'])}")
            print(f"VALOR BRUTO: {formatar_euros(r['total'])}")
            if r["teto_aplicado"]:
                print("(Aplicado o teto do art. 366.º, n.º 2, CT.)")
            if r["minimo_aplicado"]:
                print("(Mínimo de 3 meses do regime transitório.)")
        elif args.anos is not None:
            dias_ano, bruto, _, base = calcular_compensacao(
                args.retribuicao_base, args.diuturnidades, args.anos,
                args.modalidade)
            print("=== Compensação por Cessação de Contrato (regra atual) ===")
            print(f"Base (RB + diut., até 20 RMMG): {formatar_euros(base)}")
            print(f"Dias/ano: {dias_ano} · Antiguidade: {args.anos} anos")
            print(f"VALOR BRUTO: {formatar_euros(bruto)}")
            print("Atenção: antiguidade anterior a 1/5/2023 -> usar "
                  "--admissao/--cessacao (regime transitório).")
        else:
            parser.error("Indica --admissao e --cessacao (ou --anos).")
    except ValueError as e:
        parser.error(str(e))
    print()
    print("AVISO: Estimativa de apoio (valores brutos). Não substitui "
          "advogado inscrito na OA.")


if __name__ == "__main__":
    main()
