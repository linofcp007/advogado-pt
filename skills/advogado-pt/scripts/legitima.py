#!/usr/bin/env python3
"""Legítima e quota disponível (Código Civil, arts. 2156.º a 2162.º).

Valor da herança para cálculo da legítima (art. 2162.º): bens existentes à
data da morte + bens doados - dívidas da herança.

Fração da legítima:
  - cônjuge + filhos ........... 2/3 (art. 2159.º, n.º 1)
  - só filhos .................. 1/2 se 1 filho; 2/3 se 2 ou mais
                                 (art. 2159.º, n.º 2)
  - só cônjuge ................. 1/2 (art. 2158.º)
  - cônjuge + ascendentes ...... 2/3 (art. 2161.º, n.º 1)
  - só ascendentes ............. 1/2 se pais; 1/3 se 2.º grau e seguintes
                                 (art. 2161.º, n.º 2)
  - sem herdeiros legitimários . 0 (tudo é quota disponível)

Divisão da legítima (regras da sucessão legítima, art. 2157.º):
  - cônjuge + filhos: por cabeça, cônjuge nunca menos de 1/4 (art. 2139.º)
  - cônjuge + ascendentes: 2/3 cônjuge, 1/3 ascendentes (art. 2142.º)

Igual a mcp-server/src/calculators/legitima.ts.

Exemplos de uso:
  python scripts/legitima.py --bens 300000 --conjuge --filhos 2
  python scripts/legitima.py --bens 90000 --conjuge --ascendentes pais
  python scripts/legitima.py --bens 100000 --doacoes 20000 --dividas 30000
"""

import argparse
import sys

ASCENDENTES = ("nenhum", "pais", "outros")


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    inteiro = f"{valor:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def calcular_legitima(bens, conjuge, filhos, ascendentes="nenhum",
                      doacoes=0, dividas=0):
    """Devolve um dict com o valor da herança, legítima, QD e partes."""
    if bens < 0:
        raise ValueError("O valor dos bens tem de ser positivo.")
    if doacoes < 0:
        raise ValueError("O valor das doações não pode ser negativo.")
    if dividas < 0:
        raise ValueError("O valor das dívidas não pode ser negativo.")
    if not isinstance(filhos, int) or filhos < 0:
        raise ValueError("O número de filhos tem de ser um inteiro >= 0.")
    if ascendentes not in ASCENDENTES:
        raise ValueError(f"Ascendentes inválidos: {ascendentes} "
                         "(usa nenhum, pais ou outros).")

    avisos = []
    valor = bens + doacoes - dividas
    if valor < 0:
        avisos.append("As dívidas excedem bens + doações: valor da herança "
                      "considerado 0.")
        valor = 0

    fracao = 0.0
    fundamento = ("Sem herdeiros legitimários: toda a herança é quota "
                  "disponível.")
    partes = []
    if filhos > 0 and conjuge:
        fracao = 2 / 3
        fundamento = ("Cônjuge e filhos: legítima de 2/3 (art. 2159.º, n.º 1, "
                      "CC); divisão por cabeça com mínimo de 1/4 para o "
                      "cônjuge (art. 2139.º, n.º 1).")
        f_conj = max(1 / (filhos + 1), 1 / 4)
        f_filho = (1 - f_conj) / filhos
        partes.append(("cônjuge", f_conj))
        partes += [(f"filho {i}", f_filho) for i in range(1, filhos + 1)]
    elif filhos > 0:
        fracao = 1 / 2 if filhos == 1 else 2 / 3
        fundamento = (f"Só filhos ({filhos}): legítima de "
                      f"{'1/2' if filhos == 1 else '2/3'} (art. 2159.º, n.º 2, "
                      "CC); divisão em partes iguais.")
        partes += [(f"filho {i}", 1 / filhos) for i in range(1, filhos + 1)]
    elif conjuge and ascendentes != "nenhum":
        fracao = 2 / 3
        fundamento = ("Cônjuge e ascendentes: legítima de 2/3 (art. 2161.º, "
                      "n.º 1, CC); 2/3 para o cônjuge e 1/3 para os "
                      "ascendentes (art. 2142.º, n.º 1).")
        partes += [("cônjuge", 2 / 3), ("ascendentes", 1 / 3)]
    elif conjuge:
        fracao = 1 / 2
        fundamento = "Só cônjuge: legítima de 1/2 (art. 2158.º CC)."
        partes.append(("cônjuge", 1.0))
    elif ascendentes != "nenhum":
        fracao = 1 / 2 if ascendentes == "pais" else 1 / 3
        grau = "pais" if ascendentes == "pais" else "2.º grau e seguintes"
        fundamento = (f"Só ascendentes ({grau}): legítima de "
                      f"{'1/2' if ascendentes == 'pais' else '1/3'} "
                      "(art. 2161.º, n.º 2, CC).")
        partes.append(("ascendentes", 1.0))

    legitima = valor * fracao
    if filhos > 0:
        avisos.append("Se algum filho já faleceu, os seus descendentes "
                      "herdam por representação a parte dele (contar como 1 "
                      "estirpe).")
    avisos.append("Estimativa: não trata repúdio, indignidade, colação nem a "
                  "imputação das doações na legítima — confirmar com "
                  "advogado/notário.")
    return {
        "valor_heranca": valor,
        "fracao_legitima": fracao,
        "legitima": legitima,
        "quota_disponivel": valor - legitima,
        "quota_disponivel_pct": (1 - fracao) * 100,
        "partes": [{"herdeiro": h, "fracao_da_legitima": f,
                    "valor": legitima * f} for h, f in partes],
        "fundamento": fundamento,
        "avisos": avisos,
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Legítima e quota disponível (arts. 2156.º-2162.º CC).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--bens", type=float, required=True,
                        help="Valor dos bens à data da morte (€)")
    parser.add_argument("--doacoes", type=float, default=0,
                        help="Valor dos bens doados em vida (€)")
    parser.add_argument("--dividas", type=float, default=0,
                        help="Dívidas da herança (€)")
    parser.add_argument("--conjuge", action="store_true",
                        help="Há cônjuge sobrevivo")
    parser.add_argument("--filhos", type=int, default=0,
                        help="Número de filhos (estirpes)")
    parser.add_argument("--ascendentes", choices=list(ASCENDENTES),
                        default="nenhum",
                        help="Ascendentes vivos: nenhum, pais ou outros "
                             "(2.º grau e seguintes)")
    args = parser.parse_args()

    try:
        r = calcular_legitima(args.bens, args.conjuge, args.filhos,
                              args.ascendentes, args.doacoes, args.dividas)
    except ValueError as e:
        parser.error(str(e))

    print("=== Legítima e quota disponível ===")
    print(f"Valor da herança (art. 2162.º): "
          f"{formatar_euros(r['valor_heranca'])}")
    print(f"Legítima: {formatar_euros(r['legitima'])}")
    pct = f"{r['quota_disponivel_pct']:.2f}%".replace(".", ",")
    print(f"Quota disponível: {formatar_euros(r['quota_disponivel'])} ({pct})")
    for p in r["partes"]:
        print(f"  - {p['herdeiro']}: {formatar_euros(p['valor'])}")
    print(r["fundamento"])
    for a in r["avisos"]:
        print(f"Nota: {a}")
    print()
    print("AVISO: Estimativa de apoio. Não substitui advogado ou notário.")


if __name__ == "__main__":
    main()
