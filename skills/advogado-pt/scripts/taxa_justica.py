#!/usr/bin/env python3
"""Taxa de justiça pelo valor da causa — RCP, art. 6.º e Tabela I (UC 2026: 102 EUR).

- Até 275.000 EUR: escalões da Tabela I (taxa inicial; coluna A, B = metade, C = 1,5x).
- Acima: +3 UC (A) por cada 25.000 EUR ou fração — o remanescente, pago a final
  (art. 6.º, n.º 7; o juiz pode dispensá-lo).
- Redução a 90% quando a via eletrónica não é obrigatória e a parte entrega
  todas as peças por essa via (art. 6.º, n.ºs 3 e 4) — só na taxa inicial.

Igual a mcp-server/src/calculators/taxa-justica.ts.

Exemplos de uso:
  python scripts/taxa_justica.py --valor 30000
  python scripts/taxa_justica.py --valor 300000 --tabela A
"""

import argparse
import math
import sys
from decimal import ROUND_HALF_UP, Decimal

UC_2026 = 102
LIMITES = [2000, 8000, 16000, 24000, 30000, 40000, 60000, 80000, 100000,
           150000, 200000, 250000, 275000]
UC_COLUNA_A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16]
FATOR = {"A": 1, "B": 0.5, "C": 1.5}


def formatar_euros(valor):
    """Formata um valor numérico como euros no formato PT: '1.234,56 €'."""
    inteiro = f"{valor:,.2f}"
    inteiro = inteiro.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{inteiro} €"


def _r2(x):
    return float(Decimal(repr(x)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def calcular_taxa_justica(valor_acao, tabela="A", reducao_eletronica=False, uc=UC_2026):
    """Taxa de justiça. Devolve um dict."""
    if valor_acao <= 0:
        raise ValueError("O valor da ação tem de ser > 0.")
    if tabela not in FATOR:
        raise ValueError(f"Coluna inválida: '{tabela}' (A, B ou C).")
    f = FATOR[tabela]
    idx = next((i for i, lim in enumerate(LIMITES) if valor_acao <= lim), len(LIMITES) - 1)
    inicial_uc = UC_COLUNA_A[idx] * f
    reman_uc = math.ceil((valor_acao - 275000) / 25000) * 3 * f if valor_acao > 275000 else 0
    inicial_eur = _r2(inicial_uc * uc * (0.9 if reducao_eletronica else 1))
    return {
        "uc_valor": uc,
        "taxa_inicial_uc": inicial_uc,
        "remanescente_uc": reman_uc,
        "total_uc": inicial_uc + reman_uc,
        "taxa_inicial_euros": inicial_eur,
        "total_euros": _r2(inicial_eur + reman_uc * uc),
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Taxa de justiça (RCP, Tabela I) pelo valor da causa.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--valor", type=float, required=True, help="Valor da ação (€)")
    parser.add_argument("--tabela", choices=["A", "B", "C"], default="A",
                        help="Coluna da Tabela I (A: regra; B: art. 6.º n.º 2/7.º/12.º; C: especial complexidade)")
    parser.add_argument("--reducao-eletronica", action="store_true",
                        help="Redução a 90%% (só se a via eletrónica não for obrigatória)")
    args = parser.parse_args()
    try:
        r = calcular_taxa_justica(args.valor, args.tabela, args.reducao_eletronica)
    except ValueError as e:
        parser.error(str(e))
    print("=== Taxa de justiça (RCP, Tabela I) ===")
    print(f"Valor da ação: {formatar_euros(args.valor)} · coluna {args.tabela} · UC {formatar_euros(r['uc_valor'])}")
    print(f"Taxa inicial: {r['taxa_inicial_uc']:g} UC = {formatar_euros(r['taxa_inicial_euros'])}")
    if r["remanescente_uc"]:
        print(f"Remanescente (a final): {r['remanescente_uc']:g} UC = "
              f"{formatar_euros(r['remanescente_uc'] * r['uc_valor'])}")
    print(f"TOTAL: {r['total_uc']:g} UC = {formatar_euros(r['total_euros'])}")
    print()
    print("AVISO: Recursos seguem a Tabela I-B; injunção e embargos têm tabelas próprias. "
          "Não substitui advogado inscrito na OA.")


if __name__ == "__main__":
    main()
