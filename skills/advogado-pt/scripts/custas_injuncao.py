#!/usr/bin/env python3
"""Estimador de taxa de justiça de injunção (Portugal).

Estima a taxa de justiça a pagar num procedimento de injunção, em função do
valor da dívida, com base numa tabela aproximada para 2026 (UC = 102€).

Tabela aproximada (2026):
  dívida <= 5.000€            -> 0,5 UC  =  51€
  dívida 5.000,01 a 15.000€   -> 1,0 UC  = 102€
  dívida > 15.000€            -> 1,5 UC  = 153€

Nota: a injunção do DL 269/98 serve para dívidas até 15.000€; nas transações
comerciais (entre empresas) não há limite de valor (DL 62/2013, art. 10.º).

AVISO: estimativa. Confirmar sempre no simulador oficial.

Exemplos de uso:
  python scripts/custas_injuncao.py --valor 3500
  python scripts/custas_injuncao.py --valor 8000
  python scripts/custas_injuncao.py --valor 20000
"""

import argparse
from decimal import ROUND_HALF_UP, Decimal

UC_2026 = 102.0  # Unidade de Conta para 2026, em euros.


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    # Meio para cima sobre a representação decimal mais curta (igual ao formatarEuros do TS).
    arredondado = Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    inteiro = f"{arredondado:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def estimar_taxa(valor):
    """Estima a taxa de injunção. Devolve (escalao, fracao_uc, taxa)."""
    if isinstance(valor, bool) or not isinstance(valor, (int, float)) or not valor > 0:
        raise ValueError("O valor da dívida tem de ser um número positivo.")
    if valor <= 5000:
        return "Dívida até 5.000€", 0.5, 0.5 * UC_2026
    elif valor <= 15000:
        return "Dívida de 5.000,01€ a 15.000€", 1.0, 1.0 * UC_2026
    else:
        return ("Dívida superior a 15.000€ (só em transações comerciais — DL 62/2013, art. 10.º)",
                1.5, 1.5 * UC_2026)


def main():
    parser = argparse.ArgumentParser(
        description="Estima a taxa de justiça de uma injunção em Portugal.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--valor", type=float, required=True,
        help="Valor da dívida, em euros (ex.: 3500)",
    )
    args = parser.parse_args()

    try:
        escalao, fracao_uc, taxa = estimar_taxa(args.valor)
    except ValueError as e:
        parser.error(str(e))

    print("=== Estimativa de Taxa de Justiça — Injunção ===")
    print(f"Valor da dívida: {formatar_euros(args.valor)}")
    print(f"Escalão:         {escalao}")
    print(f"Fração de UC:    {fracao_uc} UC".replace(".", ","))
    print(f"TAXA ESTIMADA:   {formatar_euros(taxa)}")
    print()
    print("AVISO: Estimativa. Confirmar no simulador oficial: "
          "justica.gov.pt/servicos/simulador-taxas-de-justica. UC 2026 = 102€.")


if __name__ == "__main__":
    main()
