<!-- Template: interpelação para pagamento de VÁRIAS faturas vencidas do mesmo cliente (conta corrente),
     com os juros de mora calculados fatura a fatura e, nas transações comerciais, a indemnização de
     40 € por fatura. Enviar por CARTA REGISTADA COM AVISO DE RECEÇÃO (pode seguir também por email).
     Âmbito: nacional
     Base legal: CC, arts. 804.º a 806.º (mora; nas obrigações pecuniárias a indemnização são os juros) e
     arts. 783.º a 785.º (imputação de pagamentos parciais); DL 62/2013 — art. 2.º, n.º 2, al. a) (não se
     aplica a contratos com consumidores), art. 3.º, als. b) e h) (transação comercial; o "montante devido"
     inclui as taxas e encargos que constam da fatura — o IVA), art. 4.º, n.os 2 e 3 (juros sem interpelação
     a contar do dia seguinte ao vencimento; sem prazo no contrato, 30 dias após a receção da fatura),
     art. 7.º (mínimo de 40 € por custos de cobrança, sem interpelação) e art. 10.º (injunção seja qual for
     o valor); TJUE, acórdão de 20/10/2022, proc. C-585/20 (BFF Finance Iberia): os 40 € são devidos por
     CADA transação comercial não paga comprovada numa fatura, mesmo quando várias faturas são reclamadas
     de uma só vez; Lei 32/2014 (PEPEX), arts. 3.º, 12.º e 15.º.
     COMO PREENCHER: os juros, a indemnização e os totais vêm SEMPRE da tool `calc_juros_lote` (ou de
     `python scripts/juros_mora.py --data-fim AAAA-MM-DD --lote '[...]'`): uma linha por fatura, juros por
     tramos semestrais desde o vencimento até à data da carta, 40 € por fatura comercial vencida e totais
     por cliente. Copiar os valores da tool para a tabela — não calcular à mão. Taxas em
     references/valores-2026.md. Devedor consumidor: usar o tipo "civil" na tool e apagar a coluna e o
     parágrafo da indemnização. -->

{{REMETENTE_NOME}}
{{REMETENTE_MORADA}}
NIF: {{REMETENTE_NIF}}

{{DESTINATARIO_NOME}}
{{DESTINATARIO_MORADA}}
NIF: {{DESTINATARIO_NIF}}

{{LOCAL}}, {{DATA}}

**ASSUNTO: Interpelação para pagamento — faturas vencidas e não pagas**
**(Carta registada com aviso de receção)**

Exmo(a). Senhor(a),

{{CONTACTOS_ANTERIORES: opcional — Na sequência dos nossos contactos de … , que ficaram sem resposta / sem o pagamento prometido,}} verificamos que se encontram por liquidar as faturas abaixo identificadas, emitidas por {{DESCRICAO_SERVICOS_BENS}}, todas já vencidas.

Encontrando-se V. Exa. em mora desde a data de vencimento de cada uma delas, são devidos juros de mora à taxa legal aplicável, contados fatura a fatura desde o dia seguinte ao respetivo vencimento até efetivo e integral pagamento (arts. 804.º a 806.º do Código Civil{{BASE_COMERCIAL: opcional, só entre empresas — e art. 4.º do Decreto-Lei n.º 62/2013, de 10 de maio}}).

{{INDEMNIZACAO_COBRANCA: opcional, só entre empresas (transação comercial) — Acresce, por cada fatura vencida, o montante de 40,00 € a título de indemnização pelos custos de cobrança, devido sem necessidade de interpelação, nos termos do art. 7.º do Decreto-Lei n.º 62/2013, de 10 de maio.}}

À data desta carta, a dívida é a seguinte:

| Fatura n.º | Data de emissão | Vencimento | Capital em dívida | Juros de mora até {{DATA}} | Indemnização (custos de cobrança) | Total |
|---|---|---|---|---|---|---|
| {{FATURA_1}} | {{EMISSAO_1}} | {{VENCIMENTO_1}} | {{CAPITAL_1}} | {{JUROS_1}} | {{INDEMNIZACAO_1}} | {{TOTAL_1}} |
| {{FATURA_2}} | {{EMISSAO_2}} | {{VENCIMENTO_2}} | {{CAPITAL_2}} | {{JUROS_2}} | {{INDEMNIZACAO_2}} | {{TOTAL_2}} |
| {{FATURA_N}} | {{EMISSAO_N}} | {{VENCIMENTO_N}} | {{CAPITAL_N}} | {{JUROS_N}} | {{INDEMNIZACAO_N}} | {{TOTAL_N}} |
| **Totais** | | | **{{TOTAL_CAPITAL}}** | **{{TOTAL_JUROS}}** | **{{TOTAL_INDEMNIZACAO}}** | **{{TOTAL_GERAL}}** |

Os juros continuam a vencer-se, dia a dia, sobre o capital de cada fatura até ao pagamento integral.

Pela presente, fica V. Exa. **interpelado(a) para proceder ao pagamento da quantia total de {{TOTAL_GERAL}}, no prazo de {{PRAZO_DIAS}} dias** a contar da receção desta carta, por transferência para o IBAN **{{IBAN}}**, indicando como referência os números das faturas pagas.

Caso efetue apenas um pagamento parcial, solicitamos que identifique as faturas a que respeita. Na falta dessa indicação, o pagamento será imputado nos termos dos arts. 784.º e 785.º do Código Civil — em cada fatura, primeiro na indemnização, depois nos juros e só por fim no capital.

Findo este prazo sem que o pagamento se mostre efetuado, e sem necessidade de nova interpelação, reservo-me o direito de recorrer aos meios ao meu dispor para a cobrança coerciva — designadamente o procedimento de injunção{{INJUNCAO_COMERCIAL: opcional, só entre empresas — , admissível nas transações comerciais seja qual for o valor da dívida (art. 10.º do Decreto-Lei n.º 62/2013)}} ou a ação declarativa e, obtido título executivo, a ação executiva ou o procedimento extrajudicial pré-executivo (PEPEX — Lei n.º 32/2014, de 30 de maio), que pode conduzir à inclusão do devedor na lista pública de devedores —, com as custas e encargos daí resultantes a correr por conta de V. Exa.

<!-- PRESCRIÇÃO: esta carta NÃO interrompe a prescrição — só a citação ou notificação judicial (art. 323.º CC;
     inclui a notificação na injunção) ou o reconhecimento da dívida pelo devedor (art. 325.º CC). Com
     várias faturas, cada uma tem o seu prazo: verificar a mais antiga primeiro. Se alguma estiver perto
     do fim, avançar já com a injunção ou obter um reconhecimento de dívida
     (assets/templates/reconhecimento-divida.md). Não escrever o contrário na carta. -->
Caso pretenda regularizar a dívida de forma faseada, poderá apresentar por escrito, no mesmo prazo, uma proposta de plano de pagamento acompanhada do reconhecimento da dívida.

Caso alguma das faturas indicadas já se encontre paga, agradeço o envio do respetivo comprovativo, para retificação do extrato.

Com os melhores cumprimentos,

_______________________________
{{REMETENTE_NOME}}

Anexos: cópia das faturas n.os {{FATURA_1}} a {{FATURA_N}}; extrato de conta corrente.

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Prescrição fatura a fatura com `calc_prescricao` — começar pela mais antiga. Esta carta não a interrompe (arts. 323.º e 325.º CC): se alguma fatura estiver perto do limite, avançar já com a injunção (`requerimento-injuncao.md`) ou obter um reconhecimento de dívida (`reconhecimento-divida.md`).
- [ ] Juros, indemnização e totais copiados da tool `calc_juros_lote` (data final = `{{DATA}}` da carta), com o tipo certo por fatura: "comercial" entre empresas, "civil" com consumidores. Não somar à mão nem arredondar de outra forma.
- [ ] Os 40 € são por fatura vencida e só entre empresas ou com entidades públicas (DL 62/2013, arts. 2.º, n.º 2, al. a), e 7.º; TJUE C-585/20). Devedor consumidor → retirar a coluna, o parágrafo da indemnização e as referências ao DL 62/2013.
- [ ] Faturas ainda não vencidas ou contestadas pelo cliente ficam FORA da tabela: a injunção serve para créditos certos, líquidos e exigíveis; um diferendo sobre a qualidade trata-se à parte (`playbooks/cliente-nao-paga.md`, passo 1).
- [ ] ⏰ Fixar em `{{PRAZO_DIAS}}` um prazo razoável (8 a 15 dias, segundo `references/cobrancas.md`), contado da receção; registar o prazo de seguimento com `registar_prazo`.
- [ ] Confirmar que o IBAN coincide com o das faturas (fraude por alteração de IBAN) e anexar cópia de todas as faturas.
- [ ] Enviar por carta registada com AR e guardar o talão, o AR e cópia da carta e dos anexos (prova da interpelação para a injunção ou a ação).
- [ ] Remover os comentários `<!-- -->`, os parágrafos opcionais que não se aplicam e as linhas de exemplo da tabela que sobrem.
