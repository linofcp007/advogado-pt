#!/usr/bin/env python3
"""Testes de regressão das calculadoras jurídicas (advogado-pt).

Só usa a biblioteca-padrão (`unittest`). Importa as funções puras de cálculo
de cada script e verifica valores de referência conhecidos. Correr SEMPRE
antes de editar taxas, coeficientes ou tabelas:

  python scripts/test_scripts.py

Os scripts mantêm o seu `if __name__ == "__main__": main()`, pelo que importar
não executa nada.
"""

import datetime
import os
import sys
import unittest

# Garante que o diretório dos scripts está no sys.path, qualquer que seja o
# diretório de trabalho a partir do qual se corra o ficheiro.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from juros_mora import calcular_juros
from imt import calcular_imt
from compensacao_despedimento import calcular_compensacao
from prescricao import calcular_prazo, add_anos, add_meses
from irs_simplificado import calcular_rendimento_tributavel


class TestJurosMora(unittest.TestCase):
    def test_comercial_5000_365_dias(self):
        inicio = datetime.date(2025, 1, 1)
        fim = datetime.date(2026, 1, 1)  # 365 dias (2025 não é bissexto)
        dias, taxa, juros, total = calcular_juros(
            5000, inicio, fim, "comercial")
        self.assertEqual(dias, 365)
        self.assertAlmostEqual(taxa, 0.1015)
        self.assertAlmostEqual(juros, 507.50, places=2)
        self.assertAlmostEqual(total, 5507.50, places=2)


class TestIMT(unittest.TestCase):
    def test_hpp_200000(self):
        # Continuidade: escalão 7%, parcela a abater 10.457,96 ->
        # 200000*0,07 - 10457,96 = 3542,04.
        r = calcular_imt(200000, "hpp")
        self.assertAlmostEqual(r["taxa"], 0.07)
        self.assertAlmostEqual(r["parcela"], 10457.96, places=2)
        self.assertAlmostEqual(r["imt"], 3542.04, places=2)

    def test_hpp_150000(self):
        # Escalão 5%, parcela 6.491,02 -> IMT 1.008,98.
        r = calcular_imt(150000, "hpp")
        self.assertAlmostEqual(r["taxa"], 0.05)
        self.assertAlmostEqual(r["parcela"], 6491.02, places=2)
        self.assertAlmostEqual(r["imt"], 1008.98, places=2)

    def test_hpp_100000_isento(self):
        r = calcular_imt(100000, "hpp")
        self.assertAlmostEqual(r["imt"], 0.0, places=2)
        self.assertTrue(r["isento"])

    def test_jovem_300000_isento(self):
        r = calcular_imt(300000, "hpp", jovem=True)
        self.assertAlmostEqual(r["imt"], 0.0, places=2)
        self.assertTrue(r["isento"])

    def test_jovem_400000_parcial(self):
        # (400000 - 330539) * 0,08 = 5.556,88.
        r = calcular_imt(400000, "hpp", jovem=True)
        self.assertAlmostEqual(r["imt"], (400000 - 330539) * 0.08, places=2)
        self.assertAlmostEqual(r["imt"], 5556.88, places=2)

    def test_taxa_unica_6(self):
        # HPP acima de 660.982 até 1.150.853 -> 6% único.
        r = calcular_imt(700000, "hpp")
        self.assertAlmostEqual(r["taxa"], 0.06)
        self.assertAlmostEqual(r["imt"], 700000 * 0.06, places=2)
        self.assertAlmostEqual(r["parcela"], 0.0)

    def test_taxa_unica_75(self):
        r = calcular_imt(1200000, "hpp")
        self.assertAlmostEqual(r["taxa"], 0.075)
        self.assertAlmostEqual(r["imt"], 1200000 * 0.075, places=2)

    def test_secundaria_primeiro_escalao(self):
        # Na secundária o 1.º escalão é 1% (vs 0% na HPP).
        r = calcular_imt(100000, "secundaria")
        self.assertAlmostEqual(r["taxa"], 0.01)
        self.assertAlmostEqual(r["imt"], 1000.0, places=2)

    def test_secundaria_continuidade(self):
        # Valor dentro do escalão 5% (145470, 198347]: a continuidade aplica-se.
        r = calcular_imt(160000, "secundaria")
        self.assertAlmostEqual(r["taxa"], 0.05)


class TestCompensacao(unittest.TestCase):
    def test_sem_termo_minimo(self):
        # 1500 * 14/30 * 4 = 2800 < mínimo 3 meses (4500) -> aplica 4500.
        dias_ano, bruto, minimo, base = calcular_compensacao(
            1500, 0, 4, "sem-termo")
        self.assertEqual(dias_ano, 14)
        self.assertTrue(minimo)
        self.assertAlmostEqual(bruto, 4500.0, places=2)


class TestPrescricao(unittest.TestCase):
    def test_servicos_profissionais(self):
        descricao, prazo, base, limite = calcular_prazo(
            datetime.date(2025, 1, 1), "servicos-profissionais")
        self.assertEqual(limite, datetime.date(2030, 1, 1))

    def test_civil_geral_20_anos(self):
        _, _, _, limite = calcular_prazo(
            datetime.date(2025, 1, 1), "civil-geral")
        self.assertEqual(limite, datetime.date(2045, 1, 1))

    def test_seis_meses(self):
        _, _, _, limite = calcular_prazo(
            datetime.date(2026, 3, 15), "telecom-energia-agua")
        self.assertEqual(limite, datetime.date(2026, 9, 15))

    def test_29_fevereiro_ajuste(self):
        # 29/02/2024 + 1 ano -> 2025 não bissexto -> 28/02/2025.
        self.assertEqual(add_anos(datetime.date(2024, 2, 29), 1),
                         datetime.date(2025, 2, 28))

    def test_add_meses_ajuste_dia(self):
        # 31/01 + 1 mês -> fevereiro não tem 31 -> 28/02 (2026 não bissexto).
        self.assertEqual(add_meses(datetime.date(2026, 1, 31), 1),
                         datetime.date(2026, 2, 28))


class TestIRSSimplificado(unittest.TestCase):
    def test_servicos_151(self):
        coef, trib = calcular_rendimento_tributavel(30000, "servicos-151")
        self.assertAlmostEqual(coef, 0.75)
        self.assertAlmostEqual(trib, 22500.0, places=2)

    def test_mercadorias(self):
        coef, trib = calcular_rendimento_tributavel(50000, "mercadorias")
        self.assertAlmostEqual(coef, 0.15)
        self.assertAlmostEqual(trib, 7500.0, places=2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
