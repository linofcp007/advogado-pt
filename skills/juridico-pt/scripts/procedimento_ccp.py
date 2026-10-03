#!/usr/bin/env python3
"""Procedimento de contratação pública admissível pelo valor (CCP, arts. 19.º e 20.º).

Limiares do DL 177/2026 (procedimentos iniciados a partir de 1/10/2026); para os
iniciados até 30/9/2026 valem os anteriores. Valor do contrato INFERIOR a, sem IVA.
Igual a mcp-server/src/calculators/ccp.ts; os valores estão em
references/valores-2026.md (secção Contratação Pública).

Exemplos de uso:
  python scripts/procedimento_ccp.py --valor 100000
  python scripts/procedimento_ccp.py --valor 400000 --tipo empreitada
  python scripts/procedimento_ccp.py --valor 50000 --inicio 2026-09-15
"""

import argparse
from decimal import ROUND_HALF_UP, Decimal
import datetime
import sys

INICIO_DL_177_2026 = datetime.date(2026, 10, 1)

LIMIARES = {
    "atual": {
        "bens-servicos": {"ajuste": 75_000, "consulta": 130_000},
        "empreitada": {"ajuste": 150_000, "consulta": 1_000_000},
    },
    "anterior": {
        "bens-servicos": {"ajuste": 20_000, "consulta": 75_000},
        "empreitada": {"ajuste": 30_000, "consulta": 150_000},
    },
}

NOMES = {
    "ajuste-direto": "Ajuste direto",
    "consulta-previa": "Consulta prévia (convite a 3 ou mais entidades)",
    "concurso-publico": "Concurso público",
    "concurso-limitado": "Concurso limitado por prévia qualificação",
}


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    arredondado = Decimal(repr(float(valor))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    inteiro = f"{arredondado:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def calcular_procedimento_ccp(valor, tipo, inicio=None):
    """Devolve {"valor", "tipo", "regime", "admissiveis": [{"procedimento", "nome", "ate", "base"}]}."""
    if not isinstance(valor, (int, float)) or isinstance(valor, bool) or valor < 0:
        raise ValueError("O valor do contrato tem de ser um número positivo (sem IVA).")
    if tipo not in ("bens-servicos", "empreitada"):
        raise ValueError(f"Tipo de contrato desconhecido: '{tipo}' (usa bens-servicos ou empreitada).")
    anterior = inicio is not None and inicio < INICIO_DL_177_2026
    lim = LIMIARES["anterior" if anterior else "atual"][tipo]
    artigo = "art. 19.º" if tipo == "empreitada" else "art. 20.º"
    redacao = "redação anterior ao DL 177/2026" if anterior else "redação do DL 177/2026"
    base = f"CCP, {artigo} ({redacao})"
    admissiveis = []
    if valor < lim["ajuste"]:
        admissiveis.append({"procedimento": "ajuste-direto", "nome": NOMES["ajuste-direto"],
                            "ate": lim["ajuste"], "base": base})
    if valor < lim["consulta"]:
        admissiveis.append({"procedimento": "consulta-previa", "nome": NOMES["consulta-previa"],
                            "ate": lim["consulta"], "base": base})
    for p in ("concurso-publico", "concurso-limitado"):
        admissiveis.append({"procedimento": p, "nome": NOMES[p], "ate": None,
                            "base": f"{base} — qualquer valor"})
    return {"valor": valor, "tipo": tipo,
            "regime": "anterior ao DL 177/2026" if anterior else "DL 177/2026",
            "admissiveis": admissiveis}


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Procedimentos de contratação pública admissíveis pelo valor do contrato (CCP).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--valor", type=float, required=True, help="Valor do contrato, sem IVA (€)")
    parser.add_argument("--tipo", choices=["bens-servicos", "empreitada"], default="bens-servicos")
    parser.add_argument("--inicio", type=datetime.date.fromisoformat, default=None,
                        help="Data de início do procedimento (AAAA-MM-DD); omitido = regime atual")
    args = parser.parse_args()
    try:
        r = calcular_procedimento_ccp(args.valor, args.tipo, args.inicio)
    except ValueError as e:
        parser.error(str(e))
    tipo = "empreitada de obras públicas" if r["tipo"] == "empreitada" else "aquisição de bens ou serviços"
    print(f"Contrato de {formatar_euros(r['valor'])} (sem IVA) — {tipo} ({r['regime']})")
    print()
    print("Procedimentos admissíveis pelo valor:")
    for a in r["admissiveis"]:
        ate = f" (abaixo de {formatar_euros(a['ate'])})" if a["ate"] is not None else ""
        print(f"- {a['nome']}{ate} — {a['base']}")
    print()
    print("AVISO: Estimativa de apoio — confirmar no texto do CCP publicado no Diário da República. "
          "Não substitui aconselhamento de advogado inscrito na OA.")


if __name__ == "__main__":
    main()
