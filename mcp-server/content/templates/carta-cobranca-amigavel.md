<!-- Template: lembrete amigável de pagamento. Tom cordial, assume esquecimento. Envio por email.
     Âmbito: nacional -->

**Assunto:** Lembrete — Fatura {{N_FATURA}}

Exmo(a). Senhor(a) {{DESTINATARIO_NOME}},

Espero que esteja tudo bem.

Venho apenas relembrar que a fatura **{{N_FATURA}}**, no valor de **{{VALOR}}**, emitida a {{DATA_FATURA}}, tinha vencimento a **{{DATA_VENCIMENTO}}** e, salvo erro nosso, encontra-se ainda por liquidar.

Caso o pagamento já tenha sido efetuado, agradeço que ignore esta mensagem e, se possível, me envie o comprovativo para atualizarmos os nossos registos.

Caso contrário, agradeço a regularização para o IBAN **{{IBAN}}**, indicando a referência {{N_FATURA}}. Anexo nova cópia da fatura para facilitar.

Fico ao dispor para qualquer esclarecimento.

Com os melhores cumprimentos,

{{REMETENTE_NOME}}
{{REMETENTE_CONTACTO}}

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Enviar nos primeiros dias após o vencimento (dia 1 a 7, segundo `references/cobrancas.md`) e anotar a data; sem pagamento, segue-se a `carta-cobranca-formal-registada.md`.
- [ ] Este lembrete NÃO interrompe a prescrição (só a citação/notificação judicial ou o reconhecimento da dívida — arts. 323.º e 325.º CC); verificar o prazo do crédito com `calc_prescricao`.
- [ ] Anexar a fatura e confirmar que o IBAN indicado coincide com o da fatura (prevenção de fraude por alteração de IBAN).
- [ ] Guardar prova do envio (email enviado, com data, e confirmação de leitura se possível) no dossier de cobrança.
- [ ] Manter o tom cordial: juros, custos de cobrança e ameaça de via judicial ficam para a carta formal (taxas em `references/valores-2026.md`).
