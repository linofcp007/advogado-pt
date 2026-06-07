#!/usr/bin/env python3
"""Calculadora de compensação por cessação de contrato de trabalho (Portugal).

Calcula a compensação devida ao trabalhador por cessação do contrato, segundo
o Art. 366.º do Código do Trabalho, com os valores em vigor desde 01/05/2023.

Dias de retribuição por cada ano completo de antiguidade, por modalidade:
  - sem-termo          = 14 dias
  - extincao-posto     = 12 dias (extinção do posto de trabalho / inadaptação)
  - coletivo           = 14 dias (despedimento coletivo)
  - termo              = 24 dias (caducidade de contrato a termo)

Fórmula:
  base = retribuicao_base + diuturnidades
  compensacao = base / 30 * dias_por_ano * anos
Aplica-se um mínimo de 3 meses de (RB + diuturnidades) nas modalidades
sem-termo, extincao-posto e coletivo (não se aplica a contratos a termo).

AVISO: valores desde 01/05/2023. Casos especiais (contratos pré-2013, frações
de ano contam proporcionalmente) podem alterar o resultado. Confirmar
Art. 366.º CT e references/valores-2026.md.

Exemplos de uso:
  python scripts/compensacao_despedimento.py --retribuicao-base 1200 --anos 5
  python scripts/compensacao_despedimento.py --retribuicao-base 920 \
      --diuturnidades 50 --anos 3.5 --modalidade extincao-posto
  python scripts/compensacao_despedimento.py --retribuicao-base 1500 \
      --anos 2 --modalidade termo
"""

import argparse

# Dias de retribuição por ano de antiguidade, por modalidade (desde 01/05/2023).
DIAS_POR_ANO = {
    "sem-termo": 14,
    "extincao-posto": 12,
    "coletivo": 14,
    "termo": 24,
}

# Modalidades sujeitas ao mínimo legal de 3 meses de (RB + diuturnidades).
COM_MINIMO = {"sem-termo", "extincao-posto", "coletivo"}


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    inteiro = f"{valor:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def calcular_compensacao(retribuicao_base, diuturnidades, anos, modalidade):
    """Calcula a compensação. Devolve (dias_ano, bruto, minimo_aplicado, base)."""
    if modalidade not in DIAS_POR_ANO:
        raise ValueError(f"Modalidade desconhecida: {modalidade}")
    base = retribuicao_base + diuturnidades
    dias_ano = DIAS_POR_ANO[modalidade]
    bruto = base / 30 * dias_ano * anos

    minimo_aplicado = False
    if modalidade in COM_MINIMO:
        minimo = base * 3  # 3 meses de RB + diuturnidades
        if bruto < minimo:
            bruto = minimo
            minimo_aplicado = True

    return dias_ano, bruto, minimo_aplicado, base


def main():
    parser = argparse.ArgumentParser(
        description="Calcula a compensação por cessação de contrato (Art. 366.º "
                    "CT).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--retribuicao-base", type=float, required=True,
        help="Retribuição base mensal, em euros (ex.: 1200)",
    )
    parser.add_argument(
        "--diuturnidades", type=float, default=0.0,
        help="Diuturnidades mensais, em euros (default: 0)",
    )
    parser.add_argument(
        "--anos", type=float, required=True,
        help="Antiguidade em anos (aceita decimais, ex.: 3.5)",
    )
    parser.add_argument(
        "--modalidade",
        choices=["sem-termo", "extincao-posto", "coletivo", "termo"],
        default="sem-termo",
        help="Modalidade de cessação. Default: sem-termo.",
    )
    args = parser.parse_args()

    if args.retribuicao_base < 0 or args.diuturnidades < 0 or args.anos < 0:
        parser.error("Os valores não podem ser negativos.")

    dias_ano, bruto, minimo_aplicado, base = calcular_compensacao(
        args.retribuicao_base, args.diuturnidades, args.anos, args.modalidade
    )

    print("=== Compensação por Cessação de Contrato ===")
    print(f"Modalidade:            {args.modalidade}")
    print(f"Retribuição base:      {formatar_euros(args.retribuicao_base)}")
    print(f"Diuturnidades:         {formatar_euros(args.diuturnidades)}")
    print(f"Base (RB + diut.):     {formatar_euros(base)}")
    print(f"Antiguidade:           {args.anos} anos")
    print(f"Dias/ano aplicados:    {dias_ano} dias")
    print(f"VALOR BRUTO DA COMPENSAÇÃO: {formatar_euros(bruto)}")
    if minimo_aplicado:
        print()
        print("Nota: foi aplicado o MÍNIMO legal de 3 meses de (RB + "
              "diuturnidades), por ser superior ao valor calculado.")
    print()
    print("AVISO: Valores desde 01/05/2023. Casos especiais (contratos "
          "pré-2013, frações de ano contam proporcionalmente) podem alterar "
          "o resultado. Confirmar Art. 366.º CT.")


if __name__ == "__main__":
    main()
