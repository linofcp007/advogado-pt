<!-- Template/guião: requerimento de injunção. A injunção apresenta-se eletronicamente no Balcão
     Nacional de Injunções (BNI) via portal Citius (https://www.citius.mj.pt). Este guião organiza
     os dados a preencher no formulário e o texto da exposição dos factos. Base: DL 269/98.
     Indicada para dívidas (em regra até 15.000€ para transações sem prazo; sem limite nas
     transações comerciais ao abrigo do DL 62/2013). Custas: ver references/valores-2026.md. -->

# Requerimento de Injunção — Guião de Preenchimento

> Apresentar em https://www.citius.mj.pt (Balcão Nacional de Injunções). Após o pagamento da taxa de justiça, a secretaria notifica o requerido; se este **não se opuser em 15 dias**, é aposta fórmula executória → **título executivo** (segue para ação executiva).

## 1. Requerente (credor)
- Nome / firma: {{REMETENTE_NOME}}
- NIF/NIPC: {{REMETENTE_NIF}}
- Morada / sede: {{REMETENTE_MORADA}}
- IBAN para pagamento: {{IBAN}}

## 2. Requerido (devedor)
- Nome / firma: {{DESTINATARIO_NOME}}
- NIF/NIPC: {{DESTINATARIO_NIF}}
- Morada / sede: {{DESTINATARIO_MORADA}}

## 3. Tipo de transação
{{TIPO: "Transação comercial (DL 62/2013)" — entre empresas, sem limite de valor / "Outra" — em regra até 15.000€}}

## 4. Valores
| Rubrica | Valor |
|---|---|
| Capital em dívida | {{VALOR}} |
| Juros de mora vencidos (calcular com `scripts/juros_mora.py`) | {{JUROS}} |
| Outras quantias / cláusula penal | {{OUTROS}} |
| Taxa de justiça | {{TAXA}} (ver `references/valores-2026.md`) |
| **Total** | {{TOTAL}} |

## 5. Exposição dos factos (texto livre do requerimento)
No exercício da sua atividade, o requerente {{DESCRICAO: ex. prestou ao requerido os serviços de … / forneceu os bens …}}, titulados pela(s) fatura(s) n.º {{Nº_FATURA}}, no valor de {{VALOR}}, com vencimento em {{DATA_VENCIMENTO}}.
O requerido não procedeu ao pagamento, apesar de interpelado para o efeito por {{ex. carta registada de DATA}}, encontrando-se em mora desde {{DATA_VENCIMENTO}}.
São devidos juros de mora à taxa legal aplicável (ver `references/valores-2026.md`) desde a data de vencimento até integral pagamento.

## 6. Pedido
Requer-se a notificação do requerido para pagar ao requerente a quantia total de {{TOTAL}} (capital, juros e taxa de justiça), sob pena de, não havendo oposição, ser aposta fórmula executória.

## 7. Documentos a anexar
- [ ] Fatura(s)
- [ ] Contrato / nota de encomenda (se houver)
- [ ] Prova de interpelação (carta registada + AR)
- [ ] Comprovativo de comunicação de faturas / outros

<!-- Se o requerido se opuser, o processo é remetido ao tribunal e segue como ação (eventualmente com necessidade de advogado se o valor exceder a alçada — ver references/contencioso.md). -->
