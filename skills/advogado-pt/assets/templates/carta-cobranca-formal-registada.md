<!-- Template: interpelação final pré-judicial. Enviar por CARTA REGISTADA COM AVISO DE RECEÇÃO.
     Cria mora e prepara prova para injunção/ação. Calcular juros com scripts/juros_mora.py.
     Âmbito: nacional -->

{{REMETENTE_NOME}}
{{REMETENTE_MORADA}}
NIF: {{REMETENTE_NIF}}

{{DESTINATARIO_NOME}}
{{DESTINATARIO_MORADA}}
NIF: {{DESTINATARIO_NIF}}

{{LOCAL}}, {{DATA}}

**ASSUNTO: Interpelação para pagamento — Fatura {{Nº_FATURA}}**
**(Carta registada com aviso de receção)**

Exmo(a). Senhor(a),

Apesar dos contactos anteriores, mantém-se por liquidar a quantia de **{{VALOR}}**, titulada pela fatura n.º **{{Nº_FATURA}}**, vencida a **{{DATA_VENCIMENTO}}**, referente a {{DESCRICAO_SERVICOS_BENS}}.

Encontrando-se V. Exa. em mora desde a data de vencimento, são devidos juros de mora à taxa legal aplicável, contados desde essa data até efetivo e integral pagamento.

{{INDEMNIZACAO_COBRANCA: opcional, só entre empresas (transação comercial) — Acresce ainda o montante de 40,00 € a título de indemnização pelos custos de cobrança, devido sem necessidade de interpelação, nos termos do Art. 7.º do Decreto-Lei n.º 62/2013, de 10 de maio.}}

Pela presente, fica V. Exa. **interpelado(a) para proceder ao pagamento da quantia em dívida, acrescida dos juros vencidos, no prazo de {{PRAZO_DIAS}} dias** a contar da receção desta carta, para o IBAN **{{IBAN}}**.

Findo este prazo sem que o pagamento se mostre efetuado, e sem necessidade de nova interpelação, reservo-me o direito de recorrer aos meios judiciais ao meu dispor — designadamente procedimento de injunção e/ou ação executiva — com as consequentes custas e encargos a correr por conta de V. Exa.

<!-- PRESCRIÇÃO: esta carta NÃO interrompe a prescrição — a interrupção exige citação ou notificação
     judicial (Art. 323.º CC; inclui a notificação no procedimento de injunção) ou o reconhecimento
     da dívida pelo devedor (Art. 325.º CC). Não escrever o contrário na carta. Se o prazo estiver
     perto do fim, avançar já com a injunção ou obter um reconhecimento de dívida
     (assets/templates/reconhecimento-divida.md). -->
Fica ainda V. Exa. informado(a) de que, caso pretenda regularizar a dívida de forma faseada, poderá propor por escrito, no mesmo prazo, um plano de pagamento com reconhecimento da dívida.

Aguardo a regularização no prazo indicado.

Com os melhores cumprimentos,

_______________________________
{{REMETENTE_NOME}}

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Esta carta NÃO interrompe a prescrição (arts. 323.º e 325.º CC): se o prazo estiver perto do fim, avançar já com a injunção (`requerimento-injuncao.md`) ou obter um reconhecimento de dívida (`reconhecimento-divida.md`) — verificar com `calc_prescricao`.
- [ ] ⏰ Fixar em `{{PRAZO_DIAS}}` um prazo razoável (8 a 15 dias, segundo `references/cobrancas.md`), contado da receção da carta.
- [ ] Os 40 € de indemnização por custos de cobrança (art. 7.º DL 62/2013) só se aplicam entre empresas (transação comercial) — retirar o parágrafo se o devedor for consumidor.
- [ ] Calcular os juros por tramos semestrais com `calc_juros_mora` / `scripts/juros_mora.py` (taxa comercial ou civil em `references/valores-2026.md`) e indicar o valor vencido até à data da carta.
- [ ] Enviar por carta registada com aviso de receção e guardar o talão de registo, o AR e uma cópia da carta (prova da interpelação para a injunção ou ação).
