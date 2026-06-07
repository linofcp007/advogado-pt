#!/usr/bin/env python3
"""Calculadora de IMT 2026 — Continente (Imposto Municipal sobre Transmissões).

Calcula o IMT devido na aquisição onerosa de imóvel urbano para habitação,
com as tabelas de 2026 (Continente), aplicando o método português:

  IMT = valor * taxa_marginal_do_escalão - parcela_a_abater

A "parcela a abater" NÃO é hardcoded: é derivada por CONTINUIDADE. No limite
inferior de cada escalão, o IMT calculado pelo escalão atual tem de coincidir
com o IMT calculado pelo escalão anterior; dessa condição extrai-se a parcela
a abater de cada escalão (o primeiro escalão tem parcela 0).

Acima dos escalões marginais aplicam-se TAXAS ÚNICAS sobre o valor total
(sem parcela a abater):
  - HPP:        660.982 .. 1.150.853 -> 6%;   > 1.150.853 -> 7,5%
  - Secundária: 633.931 .. 1.150.853 -> 6%;   > 1.150.853 -> 7,5%

IMT Jovem (--jovem, só para habitação própria e permanente):
  - valor <= 330.539           -> isenção total (IMT 0)
  - 330.539 < valor <= 660.982 -> IMT = (valor - 330.539) * 0,08
  - valor > 660.982            -> sem isenção (IMT normal de HPP)

Além do IMT, mostra também o Imposto do Selo (0,8% sobre o valor) e o TOTAL
de impostos na aquisição.

Exemplos de uso:
  python scripts/imt.py --valor 200000
  python scripts/imt.py --valor 250000 --tipo secundaria
  python scripts/imt.py --valor 300000 --tipo hpp --jovem
  python scripts/imt.py --valor 700000 --tipo hpp
"""

import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):
    pass

import argparse

# Escalões marginais de 2026 (Continente): (limite_inferior, limite_superior, taxa).
# A parcela a abater de cada escalão é derivada por continuidade no código.
ESCALOES = {
    "hpp": [
        (0, 106346, 0.00),
        (106346, 145470, 0.02),
        (145470, 198347, 0.05),
        (198347, 330539, 0.07),
        (330539, 660982, 0.08),
    ],
    "secundaria": [
        (0, 106346, 0.01),
        (106346, 145470, 0.02),
        (145470, 198347, 0.05),
        (198347, 330539, 0.07),
        (330539, 633931, 0.08),
    ],
}

# Taxas únicas (acima do último escalão marginal): (limite_superior, taxa).
# O limite inferior de cada faixa única é o limite superior do último escalão
# marginal do respetivo tipo. A faixa final (7,5%) não tem limite superior.
TAXA_UNICA_6 = 0.06
TAXA_UNICA_75 = 0.075
LIMITE_UNICA_6 = 1150853  # acima deste valor, 7,5% único (ambos os tipos)

# Imposto do Selo na aquisição: 0,8% sobre o valor.
TAXA_SELO = 0.008

# Parâmetros do IMT Jovem (HPP).
IMT_JOVEM_ISENCAO_TOTAL = 330539
IMT_JOVEM_LIMITE = 660982
IMT_JOVEM_TAXA = 0.08


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    inteiro = f"{valor:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def parcelas_a_abater(escaloes):
    """Deriva a parcela a abater de cada escalão marginal por continuidade.

    No limite inferior `li` do escalão i (i > 0), o IMT pelo escalão anterior
    é `li * taxa_(i-1) - parcela_(i-1)`. Para o escalão atual dar o mesmo IMT
    nesse ponto: `li * taxa_i - parcela_i = imt_anterior`, logo
    `parcela_i = li * taxa_i - imt_anterior`. O primeiro escalão tem parcela 0.
    """
    parcelas = [0.0]
    for i in range(1, len(escaloes)):
        li = escaloes[i][0]
        taxa_anterior = escaloes[i - 1][2]
        imt_anterior = li * taxa_anterior - parcelas[i - 1]
        taxa_i = escaloes[i][2]
        parcelas.append(li * taxa_i - imt_anterior)
    return parcelas


def calcular_imt(valor, tipo="hpp", jovem=False):
    """Calcula o IMT 2026 (Continente).

    Devolve um dicionário com: imt, taxa, parcela, regime (descrição da regra
    aplicada), e isento (bool).
    """
    if tipo not in ESCALOES:
        raise ValueError(f"Tipo desconhecido: {tipo}")
    if valor < 0:
        raise ValueError("O valor não pode ser negativo.")

    # IMT Jovem só se aplica a habitação própria e permanente.
    if jovem and tipo == "hpp":
        if valor <= IMT_JOVEM_ISENCAO_TOTAL:
            return {
                "imt": 0.0, "taxa": 0.0, "parcela": 0.0, "isento": True,
                "regime": "IMT Jovem — isenção total (valor <= 330.539 €)",
            }
        if valor <= IMT_JOVEM_LIMITE:
            imt = (valor - IMT_JOVEM_ISENCAO_TOTAL) * IMT_JOVEM_TAXA
            return {
                "imt": imt, "taxa": IMT_JOVEM_TAXA, "parcela": 0.0,
                "isento": False,
                "regime": "IMT Jovem — isenção parcial: (valor - 330.539) * 8%",
            }
        # valor > 660.982: sem isenção; segue o regime normal de HPP.

    escaloes = ESCALOES[tipo]
    limite_topo_marginal = escaloes[-1][1]

    # Taxas únicas acima do último escalão marginal.
    if valor > limite_topo_marginal:
        if valor <= LIMITE_UNICA_6:
            imt = valor * TAXA_UNICA_6
            return {
                "imt": imt, "taxa": TAXA_UNICA_6, "parcela": 0.0,
                "isento": False,
                "regime": "Taxa única de 6% sobre o valor total",
            }
        imt = valor * TAXA_UNICA_75
        return {
            "imt": imt, "taxa": TAXA_UNICA_75, "parcela": 0.0,
            "isento": False,
            "regime": "Taxa única de 7,5% sobre o valor total",
        }

    # Escalões marginais.
    parcelas = parcelas_a_abater(escaloes)
    for i, (lo, hi, taxa) in enumerate(escaloes):
        # Cada escalão cobre o intervalo (lo, hi]; o primeiro inclui o 0.
        if (lo < valor <= hi) or (i == 0 and valor <= hi):
            parcela = parcelas[i]
            imt = valor * taxa - parcela
            return {
                "imt": imt, "taxa": taxa, "parcela": parcela,
                "isento": (imt == 0.0),
                "regime": f"Escalão marginal de {taxa * 100:.0f}%".replace(
                    ".", ","),
            }

    raise ValueError("Valor fora dos intervalos previstos.")


def main():
    parser = argparse.ArgumentParser(
        description="Calcula o IMT 2026 (Continente) na aquisição de imóvel.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--valor", type=float, required=True,
        help="Valor sobre o qual incide o IMT: o MAIOR entre preço e VPT.",
    )
    parser.add_argument(
        "--tipo", choices=["hpp", "secundaria"], default="hpp",
        help="hpp = habitação própria e permanente; secundaria = outra "
             "habitação. Default: hpp.",
    )
    parser.add_argument(
        "--jovem", action="store_true",
        help="Aplica a isenção IMT Jovem (só faz sentido com --tipo hpp).",
    )
    args = parser.parse_args()

    if args.valor < 0:
        parser.error("O valor não pode ser negativo.")
    if args.jovem and args.tipo != "hpp":
        parser.error("A isenção IMT Jovem só se aplica a --tipo hpp.")

    r = calcular_imt(args.valor, args.tipo, args.jovem)
    selo = args.valor * TAXA_SELO
    total = r["imt"] + selo

    print("=== IMT 2026 (Continente) ===")
    print(f"Tipo:                  {args.tipo}"
          + (" + IMT Jovem" if args.jovem and args.tipo == "hpp" else ""))
    print(f"Valor tributável:      {formatar_euros(args.valor)}")
    print(f"Regime aplicado:       {r['regime']}")
    if r["taxa"] > 0:
        print(f"Taxa aplicada:         {r['taxa'] * 100:.2f}%".replace(
            ".", ","))
    else:
        print("Taxa aplicada:         0,00%")
    print(f"Parcela a abater:      {formatar_euros(r['parcela'])}")
    print(f"IMT a pagar:           {formatar_euros(r['imt'])}")
    print(f"Imposto do Selo (0,8%): {formatar_euros(selo)}")
    print(f"TOTAL de impostos na aquisição: {formatar_euros(total)}")
    if r["isento"]:
        print()
        print("Nota: o IMT resultante é 0 € (isenção / escalão a 0%). O "
              "Imposto do Selo de 0,8% continua a ser devido.")
    print()
    print("AVISO: Tabela de 2026 (Ofício Circulado 40129/2026). Açores/Madeira "
          "têm tabelas próprias. Confirmar em `references/valores-2026.md` e no "
          "simulador do Portal das Finanças.")


if __name__ == "__main__":
    main()
