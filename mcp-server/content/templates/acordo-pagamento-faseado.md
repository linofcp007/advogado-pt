<!-- Template: acordo de pagamento faseado quando o devedor mostra boa-fé.
     Combinar com reconhecimento-divida.md para criar título executivo.
     Âmbito: nacional -->

# ACORDO DE PAGAMENTO FASEADO

Entre:

**{{REMETENTE_NOME}}** (Credor), NIF {{REMETENTE_NIF}}, e
**{{DESTINATARIO_NOME}}** (Devedor), NIF {{DESTINATARIO_NIF}},

é celebrado o presente acordo relativo à dívida de **{{VALOR}}** emergente de {{DESCRICAO_DIVIDA}}.

## 1. Montante e plano
O Devedor reconhece a dívida e compromete-se a pagá-la em {{Nº_PRESTACOES}} prestações mensais:

| Prestação | Data-limite | Valor |
|---|---|---|
| 1 | {{DATA_1}} | {{VALOR_PRESTACAO}} |
| ... | ... | ... |

## 2. Forma de pagamento
Transferência para o IBAN {{IBAN}}, com envio de comprovativo.

## 3. Juros
{{OPCAO_JUROS: "As partes acordam não acrescer juros se o plano for integralmente cumprido." OU "Acresce juros de mora à taxa legal sobre o capital em dívida."}}

## 4. Incumprimento — vencimento antecipado
A falta de pagamento de uma prestação por mais de {{DIAS_TOLERANCIA}} dias torna imediatamente exigível a totalidade do remanescente, acrescida de juros de mora à taxa legal desde a data do incumprimento.

## 5. Quitação
O pagamento integral nos termos acima extingue a dívida, dando o Credor plena quitação.

{{LOCAL}}, {{DATA}}

O Credor: _______________________  O Devedor: _______________________

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Preencher datas-limite certas para cada prestação e o prazo de tolerância (`{{DIAS_TOLERANCIA}}`); se a dívida estiver perto de prescrever, assinar já — o reconhecimento da dívida pelo devedor interrompe a prescrição (art. 325.º CC) e começa a correr novo prazo.
- [ ] Este acordo, por si só, não é título executivo: para executar sem ação declarativa, usar também o `reconhecimento-divida.md` em documento **autenticado** (termo de autenticação por notário, advogado ou solicitador — art. 703.º, n.º 1, al. b), CPC).
- [ ] Escolher uma só opção na cláusula 3 (com ou sem juros); havendo juros, a taxa é a civil se o devedor for consumidor e a comercial se for transação entre empresas — taxas em `references/valores-2026.md`.
- [ ] Assinar em duplicado (um exemplar por parte); se o devedor for sociedade, confirmar na certidão permanente que quem assina a obriga.
- [ ] Se falhar uma prestação, comunicar por carta registada com AR o vencimento antecipado e o remanescente em dívida antes de avançar para injunção ou execução.
