#!/usr/bin/env python3
"""Contador de prazos legais (Portugal).

Conta um prazo a partir de uma data de início e devolve a data-limite e o termo
legal. Três tipos (os mesmos do port TypeScript, `calculators/prazos.ts`):
  judicial  — prazos de processos em tribunal (CPC, art. 138.º): contínuo,
              suspende-se nas férias judiciais (LOSJ, art. 28.º: 22/12 a 3/1,
              Domingo de Ramos a Segunda-feira de Páscoa, 16/7 a 31/8), salvo
              processos urgentes ou prazos de 6 meses ou mais; termo em dia não
              útil passa para o 1.º dia útil seguinte.
  corridos  — dias seguidos (CC, art. 279.º), por defeito; termo em dia não útil
              passa para o 1.º dia útil seguinte, com a data legal à parte.
  uteis     — só contam os dias úteis (ex.: CPA, art. 87.º).

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
  python scripts/prazos.py --inicio 2026-10-01 --dias 30 --tipo judicial
  python scripts/prazos.py --inicio 2026-08-10 --dias 15 --tipo judicial --urgente
  python scripts/prazos.py --inicio 2026-03-02 --dias 30
  python scripts/prazos.py --inicio 2026-01-05 --dias 15 --tipo uteis
"""

import argparse
import datetime


def formatar_data_pt(data):
    """Formata uma data como 'YYYY-MM-DD (dia-da-semana)' em português."""
    dias_semana = [
        "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira",
        "sexta-feira", "sábado", "domingo",
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


MAX_DIAS = 3650
TIPOS = ("judicial", "corridos", "uteis")


def em_ferias_judiciais(data):
    """Férias judiciais (LOSJ — Lei 62/2013, art. 28.º)."""
    if (data.month == 12 and data.day >= 22) or (data.month == 1 and data.day <= 3):
        return True
    if (data.month == 7 and data.day >= 16) or data.month == 8:
        return True
    pascoa = domingo_pascoa(data.year)
    return pascoa - datetime.timedelta(days=7) <= data <= pascoa + datetime.timedelta(days=1)


def contar_prazo(inicio, dias, tipo="corridos", urgente=False):
    """Conta um prazo (o dia de início não conta — CC, art. 279.º, al. b)).

    Devolve um dict: data_limite, data_legal, transferido, dias_suspensos, nota.
    """
    if not isinstance(inicio, datetime.date):
        raise ValueError("Data de início inválida. Usa AAAA-MM-DD.")
    if isinstance(dias, bool) or not isinstance(dias, int) or dias < 0 or dias > MAX_DIAS:
        raise ValueError(f"O número de dias tem de ser um inteiro entre 0 e {MAX_DIAS}.")
    if tipo not in TIPOS:
        raise ValueError(f"Tipo de prazo desconhecido: '{tipo}'. Usa judicial, corridos ou uteis.")
    um_dia = datetime.timedelta(days=1)
    cache = {}
    # Prazos de 6 meses ou mais não se suspendem nas férias (CPC, art. 138.º, n.º 1).
    suspende = tipo == "judicial" and not urgente and dias < 180
    suspensos = 0
    if tipo == "uteis":
        legal = contar_dias_uteis(inicio, dias)
    elif not suspende:
        legal = inicio + datetime.timedelta(days=dias)
    else:
        legal = inicio
        contados = 0
        while contados < dias:
            legal += um_dia
            if em_ferias_judiciais(legal):
                suspensos += 1
            else:
                contados += 1
    limite = legal
    while not eh_dia_util(limite, cache) or (suspende and em_ferias_judiciais(limite)):
        limite += um_dia
    transferido = limite != legal
    dia_legal = formatar_data_pt(legal)

    if tipo == "judicial":
        if urgente:
            nota = ("Processo urgente: o prazo corre também nas férias judiciais "
                    "(CPC, art. 138.º, n.º 1). ")
        else:
            nota = ("Prazo judicial (CPC, art. 138.º): contínuo, suspende-se nas férias judiciais "
                    "(LOSJ, art. 28.º: 22/12 a 3/1, Domingo de Ramos a Segunda-feira de Páscoa, "
                    "16/7 a 31/8)"
                    + (", exceto nos prazos de 6 meses ou mais, como este" if dias >= 180 else "")
                    + (f" — {suspensos} dias de férias não contaram" if suspensos else "")
                    + ". ")
        if transferido:
            nota += (f"O termo legal, {dia_legal}, passa para o 1.º dia útil seguinte "
                     "(art. 138.º, n.º 2). ")
        nota += ("O ato pode ainda ser praticado nos 3 dias úteis seguintes, com multa "
                 "(CPC, art. 139.º, n.º 5). Feriados municipais não estão incluídos.")
    elif tipo == "corridos":
        nota = "Prazo em dias seguidos (CC, art. 279.º): o dia de início não conta. "
        if transferido:
            nota += (f"O termo legal é {dia_legal}; se o ato tiver de ser praticado num tribunal "
                     "ou serviço encerrado nesse dia, passa para o 1.º dia útil seguinte "
                     "(CC, art. 279.º, al. e); CPA, art. 87.º). ")
        nota += ("Para prazos de processos em tribunal (contestação, oposição, recurso) usa o "
                 "tipo 'judicial'. Feriados municipais não estão incluídos.")
    else:
        nota = ("Contagem em dias úteis (ex.: procedimento administrativo — CPA, art. 87.º): "
                "saltam-se sábados, domingos e feriados nacionais. Para prazos de processos em "
                "tribunal usa o tipo 'judicial'. Feriados municipais não estão incluídos.")
    return {"data_limite": limite, "data_legal": legal, "transferido": transferido,
            "dias_suspensos": suspensos, "nota": nota}


def main():
    parser = argparse.ArgumentParser(
        description="Conta prazos legais em Portugal (judicial, corridos ou úteis).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--inicio", required=True,
        help="Data de início do prazo (AAAA-MM-DD); o dia de início não conta",
    )
    parser.add_argument(
        "--dias", type=int, required=True,
        help="Número de dias do prazo",
    )
    parser.add_argument(
        "--tipo", choices=list(TIPOS), default="corridos",
        help="judicial (CPC 138.º, férias judiciais), corridos (default) ou uteis.",
    )
    parser.add_argument(
        "--urgente", action="store_true",
        help="Processo urgente: o prazo judicial corre nas férias.",
    )
    args = parser.parse_args()

    try:
        inicio = datetime.date.fromisoformat(args.inicio)
    except ValueError:
        parser.error(f"Data inválida em --inicio: '{args.inicio}'. Usa AAAA-MM-DD.")

    try:
        r = contar_prazo(inicio, args.dias, args.tipo, urgente=args.urgente)
    except ValueError as e:
        parser.error(str(e))

    sufixo = ", urgente" if args.urgente else ""
    print("=== Contagem de Prazo ===")
    print(f"Data de início: {formatar_data_pt(inicio)}")
    print(f"Prazo:          {args.dias} dias ({args.tipo}{sufixo})")
    if r["transferido"]:
        print(f"Termo legal:    {formatar_data_pt(r['data_legal'])}")
    print(f"DATA-LIMITE:    {formatar_data_pt(r['data_limite'])}")
    print()
    print(f"Nota: {r['nota']}")


if __name__ == "__main__":
    main()
