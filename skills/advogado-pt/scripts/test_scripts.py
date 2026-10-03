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

from juros_mora import calcular_juros, memoria_juros
from creditos_laborais import calcular_creditos
from legitima import calcular_legitima
from imt import calcular_imt
from compensacao_despedimento import calcular_compensacao, calcular_compensacao_por_datas
from salario_liquido import calcular_salario_liquido, calcular_custo_trabalhador
from irc import calcular_irc
from taxa_justica import calcular_taxa_justica
from iva_operacao import decidir_iva
from prescricao import calcular_prazo, add_anos, add_meses
from irs_simplificado import calcular_rendimento_tributavel


class TestJurosMora(unittest.TestCase):
    """T18 — juros por tramos semestrais (mesmos casos que T-01..T-08 em TS)."""

    def test_T18_dois_semestres(self):
        r = calcular_juros(5000, datetime.date(2025, 1, 1),
                           datetime.date(2026, 1, 1), "comercial")
        self.assertAlmostEqual(r["juros"], 532.29, places=2)
        self.assertEqual(r["dias"], 365)
        self.assertEqual([(t["inicio"], t["fim"], t["dias"], t["taxa"])
                          for t in r["tramos"]],
                         [("2025-01-01", "2025-07-01", 181, 0.1115),
                          ("2025-07-01", "2026-01-01", 184, 0.1015)])

    def test_T18_mesmo_semestre_2026(self):
        r = calcular_juros(10000, datetime.date(2026, 7, 1),
                           datetime.date(2026, 10, 1), "comercial")
        self.assertAlmostEqual(r["juros"], 262.14, places=2)
        self.assertAlmostEqual(r["tramos"][0]["taxa"], 0.104)
        self.assertIn("16623/2026", r["tramos"][0]["fonte"])

    def test_T18_comercial_geral_varios_anos(self):
        r = calcular_juros(1000, datetime.date(2022, 3, 15),
                           datetime.date(2024, 3, 15), "comercial-geral")
        self.assertAlmostEqual(r["juros"], 181.88, places=2)
        self.assertEqual([(t["dias"], t["taxa"]) for t in r["tramos"]],
                         [(108, 0.07), (184, 0.07), (181, 0.095),
                          (184, 0.11), (74, 0.115)])

    def test_T18_civil(self):
        r = calcular_juros(1000, datetime.date(2025, 1, 1),
                           datetime.date(2026, 1, 1), "civil")
        self.assertAlmostEqual(r["juros"], 40.0, places=2)

    def test_T18_semestre_futuro_estimado(self):
        r = calcular_juros(2000, datetime.date(2026, 12, 1),
                           datetime.date(2027, 3, 1), "comercial")
        self.assertAlmostEqual(r["juros"], 51.29, places=2)
        self.assertEqual([t["estimado"] for t in r["tramos"]], [False, True])

    def test_T18_erros(self):
        with self.assertRaisesRegex(ValueError, "2013-07-01"):
            calcular_juros(1000, datetime.date(2012, 1, 1),
                           datetime.date(2014, 1, 1), "comercial")
        with self.assertRaisesRegex(ValueError, "anterior"):
            calcular_juros(1000, datetime.date(2026, 5, 1),
                           datetime.date(2026, 4, 1), "comercial")

    def test_T18_memoria(self):
        r = calcular_juros(5000, datetime.date(2025, 1, 1),
                           datetime.date(2026, 1, 1), "comercial")
        m = memoria_juros(5000, r, "comercial")
        for s in ("2025-01-01 a 2025-07-01", "181 dias", "11,15%",
                  "10,15%", "532,29", "40,00 €", "DL 62/2013"):
            self.assertIn(s, m)
        rc = calcular_juros(1000, datetime.date(2025, 1, 1),
                            datetime.date(2026, 1, 1), "civil")
        # Os juros civis deste caso são 40,00 €; o que não pode aparecer é a
        # nota da indemnização por custos de cobrança (só no comercial).
        self.assertNotIn("custos de cobrança", memoria_juros(1000, rc, "civil"))


class TestCreditosLaborais(unittest.TestCase):
    """T19 — mesmos casos que T-09..T-12 em TS."""

    def test_T19_referencia(self):
        r = calcular_creditos(1500, datetime.date(2020, 3, 1),
                              datetime.date(2026, 6, 30),
                              ferias_vencidas_nao_gozadas=5,
                              subsidio_ferias_vencido_em_falta=True)
        self.assertEqual(r["dias_servico_ano"], 181)
        self.assertAlmostEqual(r["proporcional_ferias"], 743.84, places=2)
        self.assertAlmostEqual(r["ferias_vencidas"], 340.91, places=2)
        self.assertAlmostEqual(r["total"], 4072.42, places=2)
        self.assertFalse(r["limite_245_n3"])

    def test_T19_limite_245_n3_e_bissexto(self):
        r = calcular_creditos(1000, datetime.date(2025, 9, 1),
                              datetime.date(2026, 3, 31))
        self.assertTrue(r["limite_245_n3"])
        self.assertAlmostEqual(r["total"], 739.73, places=2)
        b = calcular_creditos(1200, datetime.date(2028, 2, 1),
                              datetime.date(2028, 8, 31), diuturnidades=50)
        self.assertEqual(b["dias_ano"], 366)
        self.assertAlmostEqual(b["total"], 2182.38, places=2)

    def test_T19_erros(self):
        with self.assertRaisesRegex(ValueError, "(?i)retribui"):
            calcular_creditos(-1, datetime.date(2020, 1, 1),
                              datetime.date(2026, 1, 1))
        with self.assertRaisesRegex(ValueError, "(?i)cessa"):
            calcular_creditos(1000, datetime.date(2026, 5, 1),
                              datetime.date(2026, 4, 1))


class TestLegitima(unittest.TestCase):
    """T20 — mesmos casos que T-13..T-17 em TS."""

    def test_T20_conjuge_dois_filhos(self):
        r = calcular_legitima(300000, conjuge=True, filhos=2)
        self.assertAlmostEqual(r["legitima"], 200000, places=2)
        self.assertAlmostEqual(r["quota_disponivel"], 100000, places=2)
        for p in r["partes"]:
            self.assertAlmostEqual(p["valor"], 66666.67, places=2)

    def test_T20_conjuge_cinco_filhos(self):
        r = calcular_legitima(120000, conjuge=True, filhos=5)
        conj = [p for p in r["partes"] if "njuge" in p["herdeiro"]][0]
        self.assertAlmostEqual(conj["valor"], 20000, places=2)

    def test_T20_combinacoes(self):
        self.assertAlmostEqual(
            calcular_legitima(100000, False, 1)["legitima"], 50000, places=2)
        self.assertAlmostEqual(
            calcular_legitima(90000, False, 2)["legitima"], 60000, places=2)
        so = calcular_legitima(100000, True, 0, doacoes=20000, dividas=30000)
        self.assertAlmostEqual(so["valor_heranca"], 90000, places=2)
        self.assertAlmostEqual(so["legitima"], 45000, places=2)
        cp = calcular_legitima(90000, True, 0, ascendentes="pais")
        self.assertAlmostEqual(cp["legitima"], 60000, places=2)
        self.assertAlmostEqual(
            calcular_legitima(90000, False, 0, ascendentes="outros")["legitima"],
            30000, places=2)

    def test_T20_sem_herdeiros_e_erros(self):
        r = calcular_legitima(50000, False, 0)
        self.assertAlmostEqual(r["legitima"], 0, places=2)
        self.assertAlmostEqual(r["quota_disponivel_pct"], 100, places=2)
        with self.assertRaisesRegex(ValueError, "(?i)bens"):
            calcular_legitima(-1, True, 1)
        with self.assertRaisesRegex(ValueError, "(?i)filhos"):
            calcular_legitima(1000, True, -2)


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
    def test_sem_termo_sem_minimo(self):
        # 1500 / 30 * 14 * 4 = 2800 — o art. 366.º em vigor não tem mínimo
        # (corrigido na v1.2).
        dias_ano, bruto, minimo, base = calcular_compensacao(
            1500, 0, 4, "sem-termo")
        self.assertEqual(dias_ano, 14)
        self.assertFalse(minimo)
        self.assertAlmostEqual(bruto, 2800.0, places=2)


class TestCompensacaoPorDatas(unittest.TestCase):
    """T136 — mesmos casos do simulador da ACT que T-135 (TS)."""

    def c(self, rb, adm, ces):
        return calcular_compensacao_por_datas(
            rb, datetime.date.fromisoformat(adm),
            datetime.date.fromisoformat(ces), "sem-termo", rmmg=920)

    def test_T136_casos_act(self):
        for rb, adm, ces, esperado in [
                (1500, "2015-05-01", "2024-04-30", 5500.00),
                (1500, "2010-01-01", "2025-12-31", 12783.33),
                (1500, "2011-10-31", "2013-01-31", 4500.00),
                (1500, "2025-01-01", "2025-03-31", 175.00),
                (2000, "2000-12-01", "2025-12-31", 24000.00),
                (2000, "1995-01-01", "2025-12-31", 35666.67),
                (25000, "2014-01-01", "2025-12-31", 91591.11),
                (25000, "2005-11-01", "2025-12-31", 220800.00),
                (1500, "2025-01-01", "2025-03-15", 145.83)]:
            self.assertAlmostEqual(self.c(rb, adm, ces)["total"], esperado,
                                   places=2, msg=f"{adm}..{ces}")

    def test_T136_extincao_posto_14_dias(self):
        dias_ano, bruto, _, _ = calcular_compensacao(
            1500, 0, 4, "extincao-posto")
        self.assertEqual(dias_ano, 14)
        self.assertAlmostEqual(bruto, 2800.0, places=2)


class TestSalario(unittest.TestCase):
    """T131 — salário líquido e custo do trabalhador (mesmos casos que TS)."""

    def test_T131_salario(self):
        a = calcular_salario_liquido(1500, "I", 0)
        self.assertAlmostEqual(a["retencao_irs"], 168.17, places=2)
        self.assertAlmostEqual(a["seguranca_social"], 165.00, places=2)
        self.assertAlmostEqual(a["liquido"], 1166.83, places=2)
        self.assertAlmostEqual(
            calcular_salario_liquido(1000, "I", 0)["retencao_irs"], 36.00, places=2)
        self.assertAlmostEqual(
            calcular_salario_liquido(900, "I", 0)["retencao_irs"], 0, places=2)
        self.assertAlmostEqual(
            calcular_salario_liquido(2000, "III", 2)["retencao_irs"], 88.35, places=2)
        self.assertAlmostEqual(
            calcular_salario_liquido(2000, "II", 3)["retencao_irs"], 178.47, places=2)
        n = calcular_salario_liquido(1500, "I", 0, subsidio_refeicao_dia=8,
                                     dias_refeicao=22)
        self.assertAlmostEqual(n["liquido"], 1328.54, places=2)

    def test_T131_custo(self):
        c = calcular_custo_trabalhador(1500, subsidio_refeicao_dia=6,
                                       taxa_seguro_at=0.01)
        self.assertAlmostEqual(c["total"], 27649.50, places=2)
        self.assertAlmostEqual(c["mensal_medio"], 2304.125, places=2)


class TestIRCIVATaxa(unittest.TestCase):
    """T132 — IRC, taxa de justiça e decisor de IVA (mesmos casos que TS)."""

    def test_T132_irc(self):
        p = calcular_irc(100000, True, 0.015, despesas_representacao=2000,
                         viaturas=[{"custo_aquisicao": 30000,
                                    "tipo": "combustao", "encargos": 5000}])
        self.assertAlmostEqual(p["total"], 19100, places=2)
        self.assertAlmostEqual(
            calcular_irc(2000000, False, 0.015)["total"], 425000, places=2)
        self.assertAlmostEqual(
            calcular_irc(40e6, False, 0)["derrama_estadual"], 2005000, places=2)
        q = calcular_irc(100000, True, 0.015, prejuizos_dedutiveis=80000)
        self.assertAlmostEqual(q["irc"], 5250, places=2)
        z = calcular_irc(-50000, True, 0.015, despesas_representacao=1000)
        self.assertAlmostEqual(z["tributacao_autonoma"], 200, places=2)

    def test_T132_taxa_justica(self):
        self.assertAlmostEqual(calcular_taxa_justica(1500)["total_euros"], 102, places=2)
        self.assertAlmostEqual(calcular_taxa_justica(30000)["total_euros"], 510, places=2)
        self.assertEqual(calcular_taxa_justica(300000)["total_uc"], 19)
        self.assertEqual(calcular_taxa_justica(310000)["total_uc"], 22)

    def test_T132_iva(self):
        self.assertEqual(decidir_iva("servicos", "empresa", "UE")["codigo"], "M40")
        self.assertEqual(
            decidir_iva("bens", "empresa", "UE", nif_vies=True)["codigo"], "M16")
        self.assertIsNone(
            decidir_iva("bens", "empresa", "UE", nif_vies=False)["codigo"])
        self.assertEqual(decidir_iva("bens", "empresa", "fora-UE")["codigo"], "M05")
        self.assertIn("OSS", " ".join(decidir_iva(
            "bens", "consumidor", "UE", vendas_distancia_ue=15000)["declaracoes"]))


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
