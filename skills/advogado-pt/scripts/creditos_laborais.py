#!/usr/bin/env python3
"""Créditos laborais na cessação do contrato de trabalho (estimativa bruta).

Base mensal = retribuição base + diuturnidades.

- Proporcionais do ano da cessação (arts. 245.º, n.º 1, al. b), e 263.º,
  n.º 2, al. b), do Código do Trabalho): férias, subsídio de férias e
  subsídio de Natal = base * fração, sendo
  fração = dias de serviço no ano da cessação / dias do ano (365 ou 366),
  contados desde 1 de janeiro (ou desde a admissão, se no mesmo ano) até à
  cessação, inclusive.
- Férias vencidas e não gozadas: base / 22 * dias úteis por gozar.
- Subsídio de férias vencido em falta (se indicado): 1 * base.
- Art. 245.º, n.º 3, CT: se a cessação ocorre no ano civil seguinte ao da
  admissão ou o contrato durou até 12 meses, o total de férias não pode
  exceder o proporcional à duração do contrato -> assinalado para revisão.

Não inclui: retribuição do mês em curso, compensação por despedimento
(scripts/compensacao_despedimento.py), formação não prestada, nem descontos
de IRS/Segurança Social.

Exemplos de uso:
  python scripts/creditos_laborais.py --retribuicao 1500 \\
      --admissao 2020-03-01 --cessacao 2026-06-30 --ferias-vencidas 5 \\
      --sf-em-falta
  python scripts/creditos_laborais.py --retribuicao 1200 --diuturnidades 50 \\
      --admissao 2028-02-01 --cessacao 2028-08-31
"""

import argparse
from decimal import ROUND_HALF_UP, Decimal
import calendar
import datetime
import sys


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    # Meio para cima sobre a representação decimal mais curta (igual ao formatarEuros do TS).
    arredondado = Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    inteiro = f"{arredondado:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def parse_data(texto):
    """Converte uma string YYYY-MM-DD num datetime.date."""
    try:
        return datetime.date.fromisoformat(texto)
    except ValueError:
        raise argparse.ArgumentTypeError(
            f"Data inválida: '{texto}'. Usa o formato YYYY-MM-DD."
        )


def _mais_um_ano(d):
    """Mesmo dia do ano seguinte (29/02 -> 28/02 se o ano não for bissexto)."""
    try:
        return d.replace(year=d.year + 1)
    except ValueError:
        return d.replace(year=d.year + 1, day=28)


def calcular_creditos(retribuicao_base, data_admissao, data_cessacao,
                      diuturnidades=0, ferias_vencidas_nao_gozadas=0,
                      subsidio_ferias_vencido_em_falta=False):
    """Devolve um dict com a discriminação e o total bruto."""
    if retribuicao_base < 0:
        raise ValueError("A retribuição base tem de ser um valor positivo.")
    if diuturnidades < 0:
        raise ValueError("As diuturnidades não podem ser negativas.")
    if ferias_vencidas_nao_gozadas < 0:
        raise ValueError("Os dias de férias vencidas não podem ser negativos.")
    if data_cessacao < data_admissao:
        raise ValueError("A data de cessação é anterior à data de admissão.")

    inicio_ano = max(datetime.date(data_cessacao.year, 1, 1), data_admissao)
    dias_servico = (data_cessacao - inicio_ano).days + 1
    dias_ano = 366 if calendar.isleap(data_cessacao.year) else 365
    fracao = dias_servico / dias_ano

    base = retribuicao_base + diuturnidades
    proporcional = base * fracao
    ferias_vencidas = base / 22 * ferias_vencidas_nao_gozadas
    sf_vencido = base if subsidio_ferias_vencido_em_falta else 0

    limite = (data_cessacao.year in (data_admissao.year,
                                     data_admissao.year + 1)
              or data_cessacao < _mais_um_ano(data_admissao))

    return {
        "dias_servico_ano": dias_servico,
        "dias_ano": dias_ano,
        "fracao": fracao,
        "proporcional_ferias": proporcional,
        "proporcional_subsidio_ferias": proporcional,
        "proporcional_subsidio_natal": proporcional,
        "ferias_vencidas": ferias_vencidas,
        "subsidio_ferias_vencido": sf_vencido,
        "total": 3 * proporcional + ferias_vencidas + sf_vencido,
        "limite_245_n3": limite,
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Créditos laborais na cessação (proporcionais de férias, "
                    "subsídio de férias e de Natal; férias vencidas).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--retribuicao", type=float, required=True,
                        help="Retribuição base mensal (€)")
    parser.add_argument("--diuturnidades", type=float, default=0,
                        help="Diuturnidades mensais (€)")
    parser.add_argument("--admissao", type=parse_data, required=True,
                        help="Data de admissão (YYYY-MM-DD)")
    parser.add_argument("--cessacao", type=parse_data, required=True,
                        help="Data de cessação (YYYY-MM-DD)")
    parser.add_argument("--ferias-vencidas", type=float, default=0,
                        help="Dias úteis de férias vencidas e não gozadas")
    parser.add_argument("--sf-em-falta", action="store_true",
                        help="O subsídio de férias das férias vencidas não "
                             "foi pago")
    args = parser.parse_args()

    try:
        r = calcular_creditos(args.retribuicao, args.admissao, args.cessacao,
                              args.diuturnidades, args.ferias_vencidas,
                              args.sf_em_falta)
    except ValueError as e:
        parser.error(str(e))

    print("=== Créditos laborais na cessação ===")
    print(f"Dias de serviço no ano: {r['dias_servico_ano']}/{r['dias_ano']}")
    print(f"Proporcional de férias:            "
          f"{formatar_euros(r['proporcional_ferias'])}")
    print(f"Proporcional de subsídio de férias: "
          f"{formatar_euros(r['proporcional_subsidio_ferias'])}")
    print(f"Proporcional de subsídio de Natal:  "
          f"{formatar_euros(r['proporcional_subsidio_natal'])}")
    print(f"Férias vencidas não gozadas:        "
          f"{formatar_euros(r['ferias_vencidas'])}")
    print(f"Subsídio de férias vencido:         "
          f"{formatar_euros(r['subsidio_ferias_vencido'])}")
    print(f"TOTAL BRUTO: {formatar_euros(r['total'])}")
    if r["limite_245_n3"]:
        print("ATENÇÃO: contrato até 12 meses ou cessação no ano seguinte ao "
              "da admissão -> limite do art. 245.º, n.º 3, CT; rever as "
              "férias à mão.")
    print()
    print("AVISO: Estimativa bruta de apoio (antes de IRS/SS). Não inclui a "
          "retribuição do mês nem a compensação. Não substitui advogado.")


if __name__ == "__main__":
    main()
