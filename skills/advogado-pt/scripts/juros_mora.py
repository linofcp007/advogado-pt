#!/usr/bin/env python3
"""Calculadora de juros de mora (Portugal), por TRAMOS SEMESTRAIS.

A taxa comercial muda em cada semestre (aviso da Entidade do Tesouro e
Finanças). O período de mora é dividido em tramos (cortes a 1 de janeiro e
1 de julho) e cada tramo usa a taxa do seu semestre:

  juros = soma(capital * taxa_do_semestre * dias_do_tramo / 365)

Tipos:
  - comercial        art. 102.º §5 CCom / DL 62/2013 (transações comerciais)
                     = BCE + 8 p.p.
  - comercial-geral  art. 102.º §3 CCom (outros créditos de empresas)
                     = BCE + 7 p.p.
  - civil            4%/ano — Portaria 291/2003

Tabela de taxas: 2.º semestre de 2013 a 2.º semestre de 2026 (igual à de
mcp-server/src/calculators/juros.ts). Semestres sem aviso ainda publicado usam
a última taxa conhecida e ficam marcados como "estimada".

Exemplos de uso:
  python scripts/juros_mora.py --capital 5000 --data-inicio 2025-01-15
  python scripts/juros_mora.py --capital 1234.56 --data-inicio 2024-03-01 \\
      --data-fim 2024-12-31 --tipo civil
  python scripts/juros_mora.py --capital 10000 --data-inicio 2022-01-01 \\
      --tipo comercial-geral
"""

import argparse
import datetime
import sys

# Taxas do art. 102.º §3 CCom por semestre (a do DL 62/2013 é esta + 0,01).
# Fonte: Home Page Jurídica (avisos citados); 2023-2026 confirmadas no ECO,
# APCMC e SFJ. Ao sair um aviso novo: acrescentar aqui, no juros.ts e em
# references/valores-2026.md.
TAXAS_SEMESTRAIS = [
    (2013, 2, 0.075, "Aviso n.º 10478/2013"),
    (2014, 1, 0.0725, "Aviso n.º 1019/2014"),
    (2014, 2, 0.0715, "Aviso n.º 8266/2014"),
    (2015, 1, 0.0705, "Aviso n.º 563/2015"),
    (2015, 2, 0.0705, "Aviso n.º 7758/2015"),
    (2016, 1, 0.0705, "Aviso n.º 890/2016"),
    (2016, 2, 0.07, "Aviso n.º 8671/2016"),
    (2017, 1, 0.07, "Aviso n.º 2583/2017"),
    (2017, 2, 0.07, "Aviso n.º 8544/2017"),
    (2018, 1, 0.07, "Aviso n.º 1989/2018"),
    (2018, 2, 0.07, "Aviso n.º 9939/2018"),
    (2019, 1, 0.07, "Aviso n.º 2553/2019"),
    (2019, 2, 0.07, "Aviso n.º 11571/2019"),
    (2020, 1, 0.07, "Aviso n.º 1568/2020"),
    (2020, 2, 0.07, "Aviso n.º 10974/2020"),
    (2021, 1, 0.07, "Aviso n.º 2239/2021"),
    (2021, 2, 0.07, "Aviso n.º 13486/2021"),
    (2022, 1, 0.07, "Aviso n.º 1535/2022"),
    (2022, 2, 0.07, "Aviso n.º 13997/2022"),
    (2023, 1, 0.095, "Aviso n.º 1672/2023"),
    (2023, 2, 0.11, "Aviso n.º 14922/2023"),
    (2024, 1, 0.115, "Aviso n.º 1850/2024"),
    (2024, 2, 0.1125, "Aviso n.º 14751/2024/2"),
    (2025, 1, 0.1015, "Aviso n.º 1278/2025/2"),
    (2025, 2, 0.0915, "Aviso n.º 16792/2025/2"),
    (2026, 1, 0.0915, "Aviso n.º 822/2026/2"),
    (2026, 2, 0.094, "Aviso n.º 16623/2026/2"),
]

TAXA_CIVIL = 0.04
INICIO_TABELA = datetime.date(2013, 7, 1)
TIPOS = ("comercial", "comercial-geral", "civil")


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


def taxa_do_semestre(tipo, ano, semestre):
    """Devolve (taxa, estimado, fonte) para um semestre."""
    if tipo == "civil":
        return TAXA_CIVIL, False, "Portaria 291/2003"
    if tipo not in TIPOS:
        raise ValueError(f"Tipo de juros desconhecido: {tipo}")
    linha = next((t for t in TAXAS_SEMESTRAIS
                  if (t[0], t[1]) == (ano, semestre)), None)
    estimado = False
    if linha is None:
        if (ano, semestre) < TAXAS_SEMESTRAIS[0][:2]:
            raise ValueError(
                f"Sem taxa comercial antes de {INICIO_TABELA.isoformat()}.")
        linha = TAXAS_SEMESTRAIS[-1]
        estimado = True
    geral, aviso = linha[2], linha[3]
    taxa = round(geral + 0.01, 4) if tipo == "comercial" else geral
    fonte = f"{aviso} (última conhecida)" if estimado else aviso
    return taxa, estimado, fonte


def calcular_juros(capital, data_inicio, data_fim, tipo):
    """Calcula os juros por tramos semestrais.

    Devolve {"dias", "juros", "total", "tramos": [{"inicio", "fim", "dias",
    "taxa", "juros", "estimado", "fonte"}]} com datas em ISO (YYYY-MM-DD).
    """
    if tipo not in TIPOS:
        raise ValueError(f"Tipo de juros desconhecido: {tipo}")
    if capital < 0:
        raise ValueError("O capital tem de ser um valor positivo.")
    if data_fim < data_inicio:
        raise ValueError("A data de fim é anterior à data de início.")
    if tipo != "civil" and data_inicio < INICIO_TABELA:
        raise ValueError(
            f"A tabela de taxas comerciais começa em {INICIO_TABELA.isoformat()}"
            " (DL 62/2013); para mora anterior, calcular à parte com os avisos"
            " da época.")

    tramos = []
    cursor = data_inicio
    while cursor < data_fim:
        semestre = 1 if cursor.month < 7 else 2
        corte = (datetime.date(cursor.year, 7, 1) if semestre == 1
                 else datetime.date(cursor.year + 1, 1, 1))
        ate = min(corte, data_fim)
        dias = (ate - cursor).days
        taxa, estimado, fonte = taxa_do_semestre(tipo, cursor.year, semestre)
        tramos.append({
            "inicio": cursor.isoformat(),
            "fim": ate.isoformat(),
            "dias": dias,
            "taxa": taxa,
            "juros": capital * taxa * dias / 365,
            "estimado": estimado,
            "fonte": fonte,
        })
        cursor = ate

    juros = sum(t["juros"] for t in tramos)
    return {
        "dias": (data_fim - data_inicio).days,
        "juros": juros,
        "total": capital + juros,
        "tramos": tramos,
    }


def _pct(taxa):
    return f"{taxa * 100:.2f}%".replace(".", ",")


def memoria_juros(capital, resultado, tipo):
    """Memória de cálculo pronta a anexar a uma carta ou requerimento."""
    base = {
        "comercial": "art. 102.º §5 CCom / DL 62/2013",
        "comercial-geral": "art. 102.º §3 CCom",
        "civil": "Portaria 291/2003",
    }[tipo]
    linhas = [
        f"Memória de cálculo — juros de mora ({tipo}; {base})",
        f"Capital: {formatar_euros(capital)}",
    ]
    for t in resultado["tramos"]:
        est = " (estimada)" if t["estimado"] else ""
        linhas.append(
            f"- {t['inicio']} a {t['fim']}: {t['dias']} dias × "
            f"{_pct(t['taxa'])}{est} = {formatar_euros(t['juros'])}  "
            f"[{t['fonte']}]")
    linhas.append(f"Juros: {formatar_euros(resultado['juros'])} "
                  f"({resultado['dias']} dias)")
    linhas.append(
        f"TOTAL (capital + juros): {formatar_euros(resultado['total'])}")
    if any(t["estimado"] for t in resultado["tramos"]):
        linhas.append("Nota: há tramos com taxa estimada (semestre ainda sem "
                      "aviso) — recalcular quando sair o aviso.")
    if tipo == "comercial":
        linhas.append("Acresce a indemnização mínima de 40,00 € por custos de "
                      "cobrança (art. 7.º do DL 62/2013), devida sem "
                      "interpelação.")
    return "\n".join(linhas)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Calcula juros de mora (comerciais ou civis) em Portugal, "
                    "por tramos semestrais.",
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
        "--tipo", choices=list(TIPOS), default="comercial",
        help="comercial (DL 62/2013), comercial-geral (art. 102.º §3 CCom) "
             "ou civil (Portaria 291/2003). Default: comercial.",
    )
    args = parser.parse_args()

    try:
        r = calcular_juros(args.capital, args.data_inicio, args.data_fim,
                           args.tipo)
    except ValueError as e:
        parser.error(str(e))

    print(memoria_juros(args.capital, r, args.tipo))
    print()
    print("AVISO: Estimativa de apoio. Confirmar os avisos da ETF para cada "
          "semestre. Não substitui aconselhamento de advogado inscrito na OA.")


if __name__ == "__main__":
    main()
