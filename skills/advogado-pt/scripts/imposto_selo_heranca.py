#!/usr/bin/env python3
"""Calculadora de Imposto do Selo em heranças e doações (Portugal).

Calcula o Imposto do Selo (IS) devido na transmissão gratuita de bens — herança
ou doação —, segundo a Tabela Geral do Imposto do Selo (TGIS). Igual ao port TS
(mcp-server/src/calculators/selo.ts).

Regras:
  - Cônjuge / unido de facto, descendentes e ascendentes estão ISENTOS do IS
    de 10% sobre a transmissão (verba 1.2 TGIS; CIS, art. 6.º, al. e)).
  - Outros beneficiários pagam 10% sobre o valor dos bens.
  - Doação de imóvel (--doacao): acresce 0,8% sobre o VPT (verba 1.1 —
    "aquisição onerosa ou por doação"), mesmo para os isentos da verba 1.2.
    Na herança (sucessão por morte) a verba 1.1 não se aplica.

AVISO: confirmar a verba 1.2 da TGIS. O prazo de participação (Modelo 1 do
Imposto do Selo) é de 3 meses após o óbito.

Exemplos de uso:
  python scripts/imposto_selo_heranca.py --valor 50000 --herdeiro descendente
  python scripts/imposto_selo_heranca.py --valor 30000 --herdeiro outro
  python scripts/imposto_selo_heranca.py --valor 80000 --herdeiro descendente \
      --inclui-imovel --vpt-imovel 120000 --doacao
"""

import argparse
from decimal import ROUND_HALF_UP, Decimal

TAXA_TRANSMISSAO = 0.10  # 10% — verba 1.2 TGIS
TAXA_IMOVEL = 0.008      # 0,8% sobre o VPT do imóvel — só nas doações (verba 1.1)

# Herdeiros isentos do IS de 10% sobre a transmissão.
HERDEIROS_ISENTOS = {"conjuge", "descendente", "ascendente"}


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    # Meio para cima sobre a representação decimal mais curta (igual ao formatarEuros do TS).
    arredondado = Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    inteiro = f"{arredondado:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def calcular_is(valor, herdeiro, inclui_imovel, vpt_imovel, doacao=False):
    """Calcula o IS. Devolve (is_transmissao, isento, is_imovel, total)."""
    if valor < 0 or vpt_imovel < 0:
        raise ValueError("O valor dos bens e o VPT não podem ser negativos.")
    isento = herdeiro in HERDEIROS_ISENTOS
    is_transmissao = 0.0 if isento else valor * TAXA_TRANSMISSAO
    # Verba 1.1: só a aquisição onerosa ou por doação de imóveis; a herança não paga os 0,8%.
    is_imovel = vpt_imovel * TAXA_IMOVEL if (doacao and inclui_imovel) else 0.0
    total = is_transmissao + is_imovel
    return is_transmissao, isento, is_imovel, total


def main():
    parser = argparse.ArgumentParser(
        description="Calcula o Imposto do Selo em heranças e doações (TGIS, verbas 1.1 e 1.2).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--valor", type=float, required=True,
        help="Valor dos bens transmitidos, em euros (ex.: 50000)",
    )
    parser.add_argument(
        "--herdeiro",
        choices=["conjuge", "descendente", "ascendente", "outro"],
        default="outro",
        help="Grau do herdeiro. Default: outro.",
    )
    parser.add_argument(
        "--inclui-imovel", action="store_true",
        help="A transmissão inclui imóvel (0,8%% sobre o VPT só com --doacao).",
    )
    parser.add_argument(
        "--doacao", action="store_true",
        help="Doação (não herança): acresce 0,8%% sobre o VPT dos imóveis (verba 1.1).",
    )
    parser.add_argument(
        "--vpt-imovel", type=float, default=0.0,
        help="Valor Patrimonial Tributário do imóvel, em euros (default: 0)",
    )
    args = parser.parse_args()

    if args.valor < 0 or args.vpt_imovel < 0:
        parser.error("Os valores não podem ser negativos.")

    is_transmissao, isento, is_imovel, total = calcular_is(
        args.valor, args.herdeiro, args.inclui_imovel, args.vpt_imovel, args.doacao
    )

    print(f"=== Imposto do Selo — {'Doação' if args.doacao else 'Herança'} ===")
    print(f"Valor dos bens: {formatar_euros(args.valor)}")
    print(f"Herdeiro:       {args.herdeiro}")
    if isento:
        print("IS de transmissão (10%): ISENTO (cônjuge/unido de facto, "
              "descendente ou ascendente)")
    else:
        print(f"IS de transmissão (10%): {formatar_euros(is_transmissao)}")
    if args.inclui_imovel and args.doacao:
        print(f"IS sobre imóvel (0,8% s/ VPT {formatar_euros(args.vpt_imovel)}, verba 1.1):"
              f" {formatar_euros(is_imovel)}")
    elif args.inclui_imovel:
        print("IS sobre imóvel (0,8%): não se aplica na herança (verba 1.1 só abrange "
              "a aquisição onerosa ou por doação)")
    else:
        print("IS sobre imóvel (0,8%): não aplicável (sem imóvel)")
    print(f"TOTAL A PAGAR:  {formatar_euros(total)}")
    print()
    print("AVISO: Confirmar verba 1.2 da TGIS. Prazo de participação "
          "(Modelo 1 do IS): 3 meses após o óbito.")


if __name__ == "__main__":
    main()
