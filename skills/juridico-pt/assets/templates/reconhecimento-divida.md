<!-- Template: documento de reconhecimento de dívida. Interrompe a prescrição (Art. 325.º CC).
     Só é TÍTULO EXECUTIVO se for exarado ou AUTENTICADO por notário, advogado ou solicitador
     (termo de autenticação — Art. 703.º, n.º 1, al. b), CPC); o simples reconhecimento da
     assinatura não basta desde o CPC de 2013. Autenticado -> permite ação executiva direta.
     Âmbito: nacional -->

# RECONHECIMENTO DE DÍVIDA E ACORDO DE PAGAMENTO

**Primeiro outorgante (Credor):** {{REMETENTE_NOME}}, NIF {{REMETENTE_NIF}}, com morada em {{REMETENTE_MORADA}}.

**Segundo outorgante (Devedor):** {{DESTINATARIO_NOME}}, NIF {{DESTINATARIO_NIF}}, com morada em {{DESTINATARIO_MORADA}}.

## Cláusula 1.ª (Reconhecimento)
O Segundo Outorgante reconhece dever ao Primeiro Outorgante a quantia de **{{VALOR}}** ({{VALOR_EXTENSO}}), referente a {{DESCRICAO_DIVIDA}}, dívida que declara certa, líquida e exigível.

## Cláusula 2.ª (Pagamento)
O Devedor obriga-se a pagar a quantia referida {{MODO_PAGAMENTO: ex. de uma só vez até DATA / em N prestações conforme Cláusula 3.ª}}, por transferência para o IBAN {{IBAN}}.

## Cláusula 3.ª (Plano de prestações) <!-- usar se aplicável; senão remover -->
O pagamento será efetuado em {{Nº_PRESTACOES}} prestações mensais de {{VALOR_PRESTACAO}}, vencendo-se a primeira a {{DATA_1A_PRESTACAO}} e as seguintes em igual dia dos meses subsequentes.

## Cláusula 4.ª (Vencimento antecipado)
A falta de pagamento de qualquer prestação na data devida implica o **vencimento imediato de toda a dívida remanescente**, ficando o Credor habilitado a exigir a totalidade em falta, acrescida de juros de mora à taxa legal.

## Cláusula 5.ª (Efeitos do reconhecimento)
O presente documento constitui reconhecimento de dívida para todos os efeitos legais, designadamente para interrupção da prescrição (Art. 325.º do Código Civil). {{AUTENTICACAO: recomendado — Sendo autenticado por termo lavrado por notário, advogado ou solicitador, constitui título executivo nos termos do Art. 703.º, n.º 1, al. b), do Código de Processo Civil.}}

{{LOCAL}}, {{DATA}}

O Credor: _______________________  O Devedor: _______________________

<!-- Recomendar reconhecimento presencial de assinaturas (notário, advogado, solicitador, CC). -->

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ O reconhecimento interrompe a prescrição (art. 325.º CC) e faz começar a correr novo prazo — se o prazo estiver perto do fim, assinar com urgência (verificar com `calc_prescricao`).
- [ ] Título executivo: o art. 703.º, n.º 1, al. b), CPC exige documento exarado ou **autenticado** por notário ou profissional competente (advogado, solicitador) — o simples reconhecimento de assinatura não basta; lavrar o termo de autenticação se quiseres executar diretamente.
- [ ] Identificar a dívida com precisão (faturas, datas, capital e juros já vencidos): para executar, a obrigação tem de ser certa, líquida e exigível.
- [ ] Se o devedor for sociedade, assina quem a obriga (certidão permanente); se falhar uma prestação, comunicar por carta registada com AR o vencimento antecipado (art. 781.º CC — a confirmar se é necessária interpelação).
- [ ] Juros: taxa civil (consumidor) ou comercial (transação entre empresas) em `references/valores-2026.md`; calcular com `calc_juros_mora`.
