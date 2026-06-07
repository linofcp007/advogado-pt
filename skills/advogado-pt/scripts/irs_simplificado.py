#!/usr/bin/env python3
"""Rendimento tributável no regime simplificado de IRS (Categoria B / ENI).

No regime simplificado, o rendimento tributável da Categoria B obtém-se
aplicando um COEFICIENTE ao rendimento bruto anual, consoante o tipo de
atividade. Este script calcula apenas o rendimento tributável (a base que
acresce aos restantes rendimentos do agregado), NÃO o imposto final.

  rendimento_tributavel = rendimento_bruto * coeficiente

Coeficientes (Art. 31.º CIRS):
  - mercadorias            = 0,15  (venda de mercadorias e produtos)
  - servicos-151           = 0,75  (serviços do Art. 151.º — tabela de
                                     atividades profissionais)
  - servicos-outros        = 0,35  (restantes prestações de serviços)
  - propriedade-intelectual = 0,50 (rendimentos de propriedade intelectual /
                                     industrial)

Exemplos de uso:
  python scripts/irs_simplificado.py --rendimento 30000 --tipo servicos-151
  python scripts/irs_simplificado.py --rendimento 50000 --tipo mercadorias
  python scripts/irs_simplificado.py --rendimento 20000 --tipo servicos-outros
"""

import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):
    pass

import argparse

# Coeficientes do regime simplificado (Art. 31.º CIRS).
COEFICIENTES = {
    "mercadorias": 0.15,
    "servicos-151": 0.75,
    "servicos-outros": 0.35,
    "propriedade-intelectual": 0.50,
}


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    inteiro = f"{valor:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def calcular_rendimento_tributavel(rendimento, tipo):
    """Devolve (coeficiente, rendimento_tributavel)."""
    if tipo not in COEFICIENTES:
        raise ValueError(f"Tipo desconhecido: {tipo}")
    if rendimento < 0:
        raise ValueError("O rendimento não pode ser negativo.")
    coeficiente = COEFICIENTES[tipo]
    return coeficiente, rendimento * coeficiente


def main():
    parser = argparse.ArgumentParser(
        description="Calcula o rendimento tributável no regime simplificado "
                    "de IRS (Cat. B / ENI).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--rendimento", type=float, required=True,
        help="Rendimento bruto anual da Categoria B, em euros.",
    )
    parser.add_argument(
        "--tipo",
        choices=["mercadorias", "servicos-151", "servicos-outros",
                 "propriedade-intelectual"],
        required=True,
        help="Tipo de atividade (determina o coeficiente).",
    )
    args = parser.parse_args()

    if args.rendimento < 0:
        parser.error("O rendimento não pode ser negativo.")

    coeficiente, tributavel = calcular_rendimento_tributavel(
        args.rendimento, args.tipo)

    print("=== IRS — Regime Simplificado (Categoria B / ENI) ===")
    print(f"Tipo de atividade:     {args.tipo}")
    print(f"Rendimento bruto anual: {formatar_euros(args.rendimento)}")
    print(f"Coeficiente aplicado:  {coeficiente:.2f}".replace(".", ","))
    print(f"RENDIMENTO TRIBUTÁVEL:  {formatar_euros(tributavel)}")
    print()
    print("Nota: Este valor (rendimento tributável) ACRESCE aos restantes "
          "rendimentos do agregado e é depois tributado pelos ESCALÕES "
          "PROGRESSIVOS de IRS — que não são calculados aqui por mudarem "
          "anualmente.")
    print()
    print("AVISO: Não calcula o imposto final (depende dos escalões "
          "progressivos e do agregado). Limiar do regime simplificado: "
          "200.000 €/ano — ver `references/valores-2026.md`. Acima, "
          "contabilidade organizada.")


if __name__ == "__main__":
    main()
