#!/usr/bin/env python3
"""Calculadora de prazos de prescrição / caducidade (Portugal).

Calcula a data-limite a partir de uma data de início e de um tipo de prazo,
contando em anos ou meses CIVIS (não em dias úteis). A contagem usa o
calendário: somar N anos/meses leva ao mesmo dia do mês de destino; se esse
dia não existir (ex.: 29 de fevereiro -> ano não bissexto, ou dia 31 num mês
de 30 dias), usa-se o ÚLTIMO dia do mês de destino.

Tipos e prazos:
  - civil-geral            = 20 anos  (Art. 309.º CC)
  - servicos-profissionais = 5 anos   (Art. 310.º CC)
  - creditos-comerciais    = 5 anos   (Art. 310.º al. e) CC)
  - juros                  = 5 anos   (Art. 310.º al. d) CC)
  - rendas                 = 5 anos   (Art. 310.º al. a) CC)
  - telecom-energia-agua   = 6 meses  (legislação setorial)
  - queixa-crime-semipublico = 6 meses (Art. 115.º CP)
  - garantia-bens-consumo  = 3 anos   (DL 84/2021)

Exemplos de uso:
  python scripts/prescricao.py --inicio 2025-01-01 --tipo servicos-profissionais
  python scripts/prescricao.py --inicio 2024-02-29 --tipo civil-geral
  python scripts/prescricao.py --inicio 2026-03-15 --tipo telecom-energia-agua
"""

import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):
    pass

import argparse
import calendar
import datetime

# (descrição, prazo_em_anos, prazo_em_meses, base_legal). Usa-se anos OU meses.
PRAZOS = {
    "civil-geral": ("Prescrição civil geral", 20, 0, "Art. 309.º CC"),
    "servicos-profissionais": (
        "Serviços profissionais", 5, 0, "Art. 310.º CC"),
    "creditos-comerciais": (
        "Créditos comerciais", 5, 0, "Art. 310.º al. e) CC"),
    "juros": ("Juros", 5, 0, "Art. 310.º al. d) CC"),
    "rendas": ("Rendas", 5, 0, "Art. 310.º al. a) CC"),
    "telecom-energia-agua": (
        "Telecomunicações / energia / água", 0, 6, "legislação setorial"),
    "queixa-crime-semipublico": (
        "Queixa-crime (crime semipúblico)", 0, 6, "Art. 115.º CP"),
    "garantia-bens-consumo": (
        "Garantia de bens de consumo", 3, 0, "DL 84/2021"),
}


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    inteiro = f"{valor:,.2f}"
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


def add_meses(data, meses):
    """Soma `meses` meses civis a uma data, ajustando o dia se necessário.

    Se o dia de origem não existir no mês de destino (ex.: 31 -> mês de 30
    dias, ou 29 fev -> ano não bissexto), usa o último dia do mês de destino.
    """
    total = data.month - 1 + meses
    ano = data.year + total // 12
    mes = total % 12 + 1
    ultimo_dia = calendar.monthrange(ano, mes)[1]
    dia = min(data.day, ultimo_dia)
    return datetime.date(ano, mes, dia)


def add_anos(data, anos):
    """Soma `anos` anos civis a uma data (delega em add_meses)."""
    return add_meses(data, anos * 12)


def calcular_prazo(inicio, tipo):
    """Calcula a data-limite. Devolve (descricao, texto_prazo, base, limite)."""
    if tipo not in PRAZOS:
        raise ValueError(f"Tipo desconhecido: {tipo}")
    descricao, anos, meses, base = PRAZOS[tipo]
    if anos:
        limite = add_anos(inicio, anos)
        texto_prazo = f"{anos} ano(s)"
    else:
        limite = add_meses(inicio, meses)
        texto_prazo = f"{meses} mese(s)"
    return descricao, texto_prazo, base, limite


def main():
    parser = argparse.ArgumentParser(
        description="Calcula prazos de prescrição / caducidade em Portugal.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--inicio", type=parse_data, required=True,
        help="Data de início da contagem do prazo (YYYY-MM-DD).",
    )
    parser.add_argument(
        "--tipo", choices=sorted(PRAZOS.keys()), required=True,
        help="Tipo de prazo a calcular.",
    )
    args = parser.parse_args()

    descricao, texto_prazo, base, limite = calcular_prazo(args.inicio, args.tipo)

    print("=== Prazo de Prescrição / Caducidade ===")
    print(f"Tipo:           {args.tipo} ({descricao})")
    print(f"Base legal:     {base}")
    print(f"Prazo:          {texto_prazo}")
    print(f"Data de início: {args.inicio.isoformat()}")
    print(f"DATA-LIMITE:    {limite.isoformat()}")
    print()
    print("Nota: A prescrição interrompe-se com citação/notificação judicial "
          "ou reconhecimento da dívida (Arts. 323.º/325.º CC), reiniciando a "
          "contagem. Caducidade não se interrompe em regra.")
    print()
    print("AVISO: Estimativa. Confirmar o regime concreto; existem causas de "
          "suspensão/interrupção.")


if __name__ == "__main__":
    main()
