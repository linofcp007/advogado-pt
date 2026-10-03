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
  python scripts/juros_mora.py --data-fim 2026-10-01 --lote \\
      '[{"cliente": "A", "fatura": "FT 1", "capital": 1000, "vencimento": "2026-01-15"}]'
"""

import argparse
from decimal import ROUND_HALF_UP, Decimal
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
    # Meio para cima sobre a representação decimal mais curta (igual ao formatarEuros do TS).
    arredondado = Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    inteiro = f"{arredondado:,.2f}"
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


INDEMNIZACAO_COBRANCA = 40.0  # DL 62/2013, art. 7.º (valor em references/valores-2026.md)


def _r2(valor):
    """Arredonda ao cêntimo, meio para cima, sobre a representação decimal mais curta (= r2 do TS)."""
    return float(Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def calcular_juros_lote(faturas, data_fim):
    """Juros de VÁRIAS faturas (porta de calcularJurosLote em juros-lote.ts).

    faturas: lista de {"cliente", "fatura", "capital", "vencimento" (date ou
    "AAAA-MM-DD"), "tipo" (opcional, "comercial" por defeito)}.
    Devolve {"faturas": [...], "por_cliente": [...], "total": {...}}: juros
    arredondados ao cêntimo por fatura, 40 € por fatura comercial vencida,
    faturas ainda não vencidas só com o capital.
    """
    if not faturas:
        raise ValueError("Indica pelo menos uma fatura.")
    if len(faturas) > 500:
        raise ValueError("No máximo 500 faturas por cálculo.")
    resultados = []
    for i, f in enumerate(faturas):
        fatura = str(f.get("fatura") or "").strip() or f"fatura {i + 1}"
        cliente = str(f.get("cliente") or "").strip() or "(sem cliente)"
        tipo = f.get("tipo") or "comercial"
        capital = f.get("capital")
        if not isinstance(capital, (int, float)) or capital < 0:
            raise ValueError(f"{fatura}: o capital tem de ser um valor positivo.")
        venc = f.get("vencimento")
        if isinstance(venc, str):
            venc = datetime.date.fromisoformat(venc)
        base = {"cliente": cliente, "fatura": fatura, "capital": _r2(capital),
                "vencimento": venc.isoformat(), "tipo": tipo}
        if venc >= data_fim:
            resultados.append(dict(base, vencida=False, dias=0, juros=0.0,
                                   indemnizacao40=0.0, total=base["capital"], tramos=[],
                                   nota=f"Ainda não vencida a {data_fim.isoformat()} "
                                        f"(vence a {venc.isoformat()})."))
            continue
        r = calcular_juros(capital, venc, data_fim, tipo)
        juros = _r2(r["juros"])
        indemnizacao = INDEMNIZACAO_COBRANCA if tipo == "comercial" else 0.0
        resultados.append(dict(base, vencida=True, dias=r["dias"], juros=juros,
                               indemnizacao40=indemnizacao,
                               total=_r2(base["capital"] + juros + indemnizacao),
                               tramos=r["tramos"]))

    def somar(acc, f):
        acc["capital"] = _r2(acc["capital"] + f["capital"])
        acc["juros"] = _r2(acc["juros"] + f["juros"])
        acc["indemnizacao"] = _r2(acc["indemnizacao"] + f["indemnizacao40"])
        acc["total"] = _r2(acc["capital"] + acc["juros"] + acc["indemnizacao"])

    por_cliente = []
    total = {"capital": 0.0, "juros": 0.0, "indemnizacao": 0.0, "total": 0.0}
    for f in resultados:
        c = next((x for x in por_cliente if x["cliente"] == f["cliente"]), None)
        if c is None:
            c = {"cliente": f["cliente"], "faturas": 0, "capital": 0.0, "juros": 0.0,
                 "indemnizacao": 0.0, "total": 0.0}
            por_cliente.append(c)
        c["faturas"] += 1
        somar(c, f)
        somar(total, f)
    return {"data_fim": data_fim.isoformat(), "faturas": resultados,
            "por_cliente": por_cliente, "total": total}


def memoria_juros_lote(r):
    """Resumo por fatura, por cliente e total (igual ao memoriaJurosLote do TS)."""
    linhas = [f"Juros de mora em lote até {r['data_fim']} (tramos semestrais por fatura)", ""]
    for c in r["por_cliente"]:
        linhas.append(f"{c['cliente']} — {c['faturas']} fatura(s)")
        for f in (x for x in r["faturas"] if x["cliente"] == c["cliente"]):
            if f["vencida"]:
                extra = f"{f['dias']} dias, juros {formatar_euros(f['juros'])}"
                if f["indemnizacao40"]:
                    extra += f" + indemnização {formatar_euros(f['indemnizacao40'])}"
            else:
                extra = "não vencida"
            linhas.append(f"- {f['fatura']} ({f['tipo']}, vence {f['vencimento']}): capital "
                          f"{formatar_euros(f['capital'])}; {extra} -> {formatar_euros(f['total'])}")
        linhas.append(f"  Subtotal: capital {formatar_euros(c['capital'])} + juros "
                      f"{formatar_euros(c['juros'])} + indemnizações "
                      f"{formatar_euros(c['indemnizacao'])} = {formatar_euros(c['total'])}")
        linhas.append("")
    t = r["total"]
    linhas.append(f"TOTAL: capital {formatar_euros(t['capital'])} + juros {formatar_euros(t['juros'])}"
                  f" + indemnizações {formatar_euros(t['indemnizacao'])} = {formatar_euros(t['total'])}")
    linhas.append("")
    linhas.append(f"Indemnização de {formatar_euros(INDEMNIZACAO_COBRANCA)} por fatura comercial "
                  "vencida (DL 62/2013, art. 7.º), devida sem interpelação; nas faturas civis só há juros.")
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
        "--capital", type=float,
        help="Capital em dívida, em euros (ex.: 5000)",
    )
    parser.add_argument(
        "--data-inicio", type=parse_data,
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
    parser.add_argument(
        "--lote",
        help="Várias faturas em JSON: '[{\"cliente\": \"A\", \"fatura\": \"FT 1\", "
             "\"capital\": 1000, \"vencimento\": \"2026-01-15\"}]' (usa --data-fim)",
    )
    args = parser.parse_args()

    if args.lote:
        import json
        try:
            faturas = json.loads(args.lote)
            r = calcular_juros_lote(faturas, args.data_fim)
        except (ValueError, TypeError, AttributeError) as e:
            parser.error(f"--lote: {e}")
        print(memoria_juros_lote(r))
        print()
        print("AVISO: Estimativa de apoio. Confirmar os avisos da ETF para cada "
              "semestre. Não substitui aconselhamento de advogado inscrito na OA.")
        return
    if args.capital is None or args.data_inicio is None:
        parser.error("indica --capital e --data-inicio (ou --lote).")

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
