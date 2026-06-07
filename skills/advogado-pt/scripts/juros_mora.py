#!/usr/bin/env python3
"""Calculadora de juros de mora (Portugal).

Calcula juros de mora simples sobre um capital em dívida, entre uma data de
início e uma data de fim, aplicando a taxa comercial (transações comerciais,
DL 62/2013) ou a taxa civil (Portaria 291/2003).

Taxas embebidas (1.º semestre de 2026):
  - comercial = 10,15%/ano (BCE + 8 p.p.; Aviso da ETF para o período)
  - civil     = 4%/ano (Portaria 291/2003, estável há anos)

Fórmula (juros simples):
  juros = capital * taxa_anual * (dias / 365)
  total = capital + juros
Os dias são contados como dias corridos entre as duas datas.

AVISO: a taxa comercial muda semestralmente. Para períodos longos que
atravessam semestres, o cálculo correto deve ser feito por tramos (um tramo
por semestre, cada um com a sua taxa).

Exemplos de uso:
  python scripts/juros_mora.py --capital 5000 --data-inicio 2025-01-15
  python scripts/juros_mora.py --capital 1234.56 --data-inicio 2024-03-01 \
      --data-fim 2024-12-31 --tipo civil
  python scripts/juros_mora.py --capital 10000 --data-inicio 2026-01-01 \
      --tipo comercial
"""

import argparse
import datetime

# Taxas anuais embebidas (1.º semestre de 2026). Confirmar em
# references/valores-2026.md e no Aviso da ETF para o período.
TAXAS = {
    "comercial": 0.1015,  # 10,15%/ano — DL 62/2013, transações comerciais
    "civil": 0.04,        # 4%/ano — Portaria 291/2003
}


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    inteiro = f"{valor:,.2f}"
    # Troca separadores: ',' (milhares EN) -> '.', '.' (decimal EN) -> ','
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


def calcular_juros(capital, data_inicio, data_fim, tipo):
    """Calcula os juros de mora simples. Devolve (dias, taxa, juros, total)."""
    if tipo not in TAXAS:
        raise ValueError(f"Tipo desconhecido: {tipo}")
    if data_fim < data_inicio:
        raise ValueError("A data de fim é anterior à data de início.")
    dias = (data_fim - data_inicio).days
    taxa = TAXAS[tipo]
    juros = capital * taxa * (dias / 365)
    total = capital + juros
    return dias, taxa, juros, total


def main():
    parser = argparse.ArgumentParser(
        description="Calcula juros de mora (comerciais ou civis) em Portugal.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--capital", type=float, required=True,
        help="Capital em dívida, em euros (ex.: 5000)",
    )
    parser.add_argument(
        "--data-inicio", type=parse_data, required=True,
        help="Data de início da mora (YYYY-MM-DD)",
    )
    parser.add_argument(
        "--data-fim", type=parse_data, default=datetime.date.today(),
        help="Data de fim do cálculo (YYYY-MM-DD). Default: hoje.",
    )
    parser.add_argument(
        "--tipo", choices=["comercial", "civil"], default="comercial",
        help="Tipo de juros: comercial (DL 62/2013) ou civil "
             "(Portaria 291/2003). Default: comercial.",
    )
    args = parser.parse_args()

    if args.capital < 0:
        parser.error("O capital não pode ser negativo.")

    dias, taxa, juros, total = calcular_juros(
        args.capital, args.data_inicio, args.data_fim, args.tipo
    )

    print("=== Juros de Mora ===")
    print(f"Capital:        {formatar_euros(args.capital)}")
    print(f"Tipo de juros:  {args.tipo}")
    print(f"Período:        {args.data_inicio.isoformat()} a "
          f"{args.data_fim.isoformat()}")
    print(f"Dias decorridos: {dias} dias corridos")
    print(f"Taxa aplicada:  {taxa * 100:.2f}%/ano".replace(".", ","))
    print(f"Juros de mora:  {formatar_euros(juros)}")
    print(f"TOTAL (capital + juros): {formatar_euros(total)}")
    print()
    print("AVISO: Taxa comercial muda semestralmente — confirmar aviso da ETF "
          "para o período. Para períodos longos que atravessam semestres, "
          "calcular por tramos.")


if __name__ == "__main__":
    main()
