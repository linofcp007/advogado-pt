#!/usr/bin/env python3
"""Contador de prazos legais (Portugal).

Conta um prazo a partir de uma data de início, em dias úteis ou em dias
corridos, e devolve a data-limite.

Para dias úteis, salta sábados, domingos e feriados nacionais de Portugal:
  Fixos: 1 jan, 25 abr, 1 mai, 10 jun, 15 ago, 5 out, 1 nov, 1 dez,
         8 dez, 25 dez.
  Móveis (calculados a partir da Páscoa pelo algoritmo de Meeus):
         Sexta-Feira Santa (Páscoa - 2 dias) e Corpo de Deus (Páscoa + 60).
O Carnaval NÃO é feriado obrigatório, por isso não é contado.
Os feriados municipais NÃO estão incluídos.

A contagem de dias úteis começa no dia útil seguinte à data de início
(o dia de início não conta), seguindo a regra processual comum.

Exemplos de uso:
  python scripts/prazos.py --inicio 2026-03-02 --dias 10
  python scripts/prazos.py --inicio 2026-03-02 --dias 30 --tipo corridos
  python scripts/prazos.py --inicio 2026-01-05 --dias 15 --tipo uteis
"""

import argparse
import datetime


def formatar_data_pt(data):
    """Formata uma data como 'YYYY-MM-DD (dia-da-semana)' em português."""
    dias_semana = [
        "segunda-feira", "terca-feira", "quarta-feira", "quinta-feira",
        "sexta-feira", "sabado", "domingo",
    ]
    return f"{data.isoformat()} ({dias_semana[data.weekday()]})"


def domingo_pascoa(ano):
    """Calcula o domingo de Páscoa para um ano (algoritmo de Meeus/Gauss)."""
    a = ano % 19
    b = ano // 100
    c = ano % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    mes = (h + l - 7 * m + 114) // 31
    dia = ((h + l - 7 * m + 114) % 31) + 1
    return datetime.date(ano, mes, dia)


def feriados_nacionais(ano):
    """Devolve o conjunto de feriados nacionais obrigatórios para um ano."""
    feriados = {
        datetime.date(ano, 1, 1),    # Ano Novo
        datetime.date(ano, 4, 25),   # Dia da Liberdade
        datetime.date(ano, 5, 1),    # Dia do Trabalhador
        datetime.date(ano, 6, 10),   # Dia de Portugal
        datetime.date(ano, 8, 15),   # Assuncao de Nossa Senhora
        datetime.date(ano, 10, 5),   # Implantacao da Republica
        datetime.date(ano, 11, 1),   # Todos os Santos
        datetime.date(ano, 12, 1),   # Restauracao da Independencia
        datetime.date(ano, 12, 8),   # Imaculada Conceicao
        datetime.date(ano, 12, 25),  # Natal
    }
    pascoa = domingo_pascoa(ano)
    feriados.add(pascoa - datetime.timedelta(days=2))   # Sexta-Feira Santa
    feriados.add(pascoa + datetime.timedelta(days=60))  # Corpo de Deus
    return feriados


def eh_dia_util(data, cache_feriados):
    """Indica se uma data é dia útil (não é fim-de-semana nem feriado)."""
    if data.weekday() >= 5:  # 5 = sabado, 6 = domingo
        return False
    if data.year not in cache_feriados:
        cache_feriados[data.year] = feriados_nacionais(data.year)
    return data not in cache_feriados[data.year]


def contar_dias_uteis(inicio, n_dias):
    """Conta n_dias úteis a partir do dia seguinte ao de início."""
    cache = {}
    data = inicio
    contados = 0
    while contados < n_dias:
        data += datetime.timedelta(days=1)
        if eh_dia_util(data, cache):
            contados += 1
    return data


def main():
    parser = argparse.ArgumentParser(
        description="Conta prazos legais (dias úteis ou corridos) em Portugal.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--inicio", required=True,
        help="Data de início do prazo (YYYY-MM-DD)",
    )
    parser.add_argument(
        "--dias", type=int, required=True,
        help="Número de dias do prazo",
    )
    parser.add_argument(
        "--tipo", choices=["uteis", "corridos"], default="uteis",
        help="Tipo de contagem: uteis (default) ou corridos.",
    )
    args = parser.parse_args()

    try:
        inicio = datetime.date.fromisoformat(args.inicio)
    except ValueError:
        parser.error(f"Data inválida: '{args.inicio}'. Usa YYYY-MM-DD.")

    if args.dias < 0:
        parser.error("O número de dias não pode ser negativo.")

    if args.tipo == "corridos":
        limite = inicio + datetime.timedelta(days=args.dias)
    else:
        limite = contar_dias_uteis(inicio, args.dias)

    print("=== Contagem de Prazo ===")
    print(f"Data de início: {formatar_data_pt(inicio)}")
    print(f"Prazo:          {args.dias} dias {args.tipo}")
    print(f"DATA-LIMITE:    {formatar_data_pt(limite)}")
    print()
    print("Nota: Regra geral processual: se o prazo terminar em dia não útil, "
          "transfere-se para o 1.º dia útil seguinte (Art. 138.º CPC). "
          "Feriados municipais não estão incluídos.")


if __name__ == "__main__":
    main()
