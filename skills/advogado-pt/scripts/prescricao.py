#!/usr/bin/env python3
"""Calculadora de prazos de prescrição / caducidade (Portugal).

Calcula a data-limite a partir de uma data de início e de um tipo de prazo,
contando em anos ou meses CIVIS (não em dias úteis). A contagem usa o
calendário: somar N anos/meses leva ao mesmo dia do mês de destino; se esse
dia não existir (ex.: 29 de fevereiro -> ano não bissexto, ou dia 31 num mês
de 30 dias), usa-se o ÚLTIMO dia do mês de destino.

Tipos e prazos (os mesmos do port TypeScript, `calculators/prescricao.ts`):
  - civil-geral              = 20 anos (CC, art. 309.º)
  - creditos-comerciais      = 20 anos (CC, art. 309.º) — faturas entre empresas
  - servicos-profissionais   = 2 anos, presuntiva (CC, art. 317.º, al. c))
  - vendas-a-consumidor      = 2 anos, presuntiva (CC, art. 317.º, al. b))
  - rendas                   = 5 anos (CC, art. 310.º, al. b))
  - juros                    = 5 anos (CC, art. 310.º, al. d))
  - prestacoes-periodicas    = 5 anos (CC, art. 310.º, al. g))
  - telecom-energia-agua     = 6 meses (Lei 23/96, art. 10.º, n.º 1)
  - queixa-crime-semipublico = 6 meses (CP, art. 115.º, n.º 1) — caducidade
  - garantia-bens-consumo    = 3 anos (DL 84/2021)

As prescrições presuntivas (arts. 312.º a 317.º CC) assentam numa presunção de
pagamento, que o credor só afasta com a confissão do devedor (arts. 313.º e 314.º).

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
from decimal import ROUND_HALF_UP, Decimal
import calendar
import datetime

# (descrição, anos, meses, base_legal, presuntiva). Usa-se anos OU meses.
# Ids estáveis (o CLI e o MCP usam-nos); prazos e bases revistos na v1.2.1.
PRAZOS = {
    "civil-geral": ("Prescrição ordinária (regra geral)", 20, 0, "CC, art. 309.º", False),
    "creditos-comerciais": (
        "Créditos comerciais entre empresas (ex.: faturas B2B) — prazo ordinário",
        20, 0, "CC, art. 309.º", False),
    "servicos-profissionais": (
        "Serviços prestados no exercício de profissões liberais (prescrição presuntiva)",
        2, 0, "CC, art. 317.º, al. c)", True),
    "vendas-a-consumidor": (
        "Vendas e fornecimentos de comerciantes/industriais a quem não é comerciante "
        "nem os destina ao seu comércio (prescrição presuntiva)",
        2, 0, "CC, art. 317.º, al. b)", True),
    "rendas": ("Rendas e alugueres devidos pelo locatário", 5, 0, "CC, art. 310.º, al. b)", False),
    "juros": ("Juros convencionais ou legais", 5, 0, "CC, art. 310.º, al. d)", False),
    "prestacoes-periodicas": (
        "Prestações periodicamente renováveis (ex.: quotas de condomínio)",
        5, 0, "CC, art. 310.º, al. g)", False),
    "telecom-energia-agua": (
        "Preço de serviços públicos essenciais (telecomunicações, energia, água)",
        0, 6, "Lei 23/96, art. 10.º, n.º 1", False),
    "queixa-crime-semipublico": (
        "Direito de queixa por crime semipúblico (caducidade)",
        0, 6, "CP, art. 115.º, n.º 1", False),
    "garantia-bens-consumo": (
        "Garantia legal de bens de consumo (bens móveis)", 3, 0, "DL 84/2021", False),
}

AVISO_PRESUNTIVA = (
    "Prescrição presuntiva (CC, arts. 312.º a 317.º): ao fim do prazo presume-se que a dívida "
    "foi paga; o credor só afasta essa presunção com a confissão do devedor, expressa ou tácita "
    "(arts. 313.º e 314.º). Se o devedor admitir que não pagou, a presunção cai."
)


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    # Meio para cima sobre a representação decimal mais curta (igual ao formatarEuros do TS).
    arredondado = Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    inteiro = f"{arredondado:,.2f}"
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


def calcular_prescricao(inicio, tipo):
    """Calcula a data-limite. Devolve um dict: descricao, prazo_texto, base,
    limite, presuntiva, aviso (o mesmo resultado do port TypeScript)."""
    if not isinstance(inicio, datetime.date):
        raise ValueError("Data de início inválida. Usa AAAA-MM-DD.")
    if tipo not in PRAZOS:
        raise ValueError(f"Tipo desconhecido: {tipo}. Tipos: {', '.join(sorted(PRAZOS))}.")
    descricao, anos, meses, base, presuntiva = PRAZOS[tipo]
    if anos:
        limite = add_anos(inicio, anos)
        texto_prazo = f"{anos} ano(s)"
    else:
        limite = add_meses(inicio, meses)
        texto_prazo = f"{meses} mese(s)"
    return {"descricao": descricao, "prazo_texto": texto_prazo, "base": base,
            "limite": limite, "presuntiva": presuntiva,
            "aviso": AVISO_PRESUNTIVA if presuntiva else ""}


def calcular_prazo(inicio, tipo):
    """Compatibilidade: devolve (descricao, texto_prazo, base, limite)."""
    r = calcular_prescricao(inicio, tipo)
    return r["descricao"], r["prazo_texto"], r["base"], r["limite"]


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

    r = calcular_prescricao(args.inicio, args.tipo)

    print("=== Prazo de Prescrição / Caducidade ===")
    print(f"Tipo:           {args.tipo} ({r['descricao']})")
    print(f"Base legal:     {r['base']}")
    print(f"Prazo:          {r['prazo_texto']}{' (presuntiva)' if r['presuntiva'] else ''}")
    print(f"Data de início: {args.inicio.isoformat()}")
    print(f"DATA-LIMITE:    {r['limite'].isoformat()}")
    print()
    if r["aviso"]:
        print(r["aviso"])
        print()
    print("Nota: A prescrição interrompe-se com a citação ou notificação judicial "
          "(ex.: injunção) ou com o reconhecimento da dívida (arts. 323.º e 325.º CC), "
          "reiniciando a contagem; uma carta ou email de cobrança não a interrompe. "
          "A caducidade não se interrompe, em regra.")
    print()
    print("AVISO: Estimativa. Confirmar o regime concreto; existem causas de "
          "suspensão/interrupção.")


if __name__ == "__main__":
    main()
