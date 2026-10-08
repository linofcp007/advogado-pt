<!-- Template: Contrato-Promessa de Compra e Venda (CPCV) de imóvel. Base: Arts. 410.º e ss. CC.
     Pontos críticos: sinal (Art. 442.º CC), execução específica (Art. 830.º), condições suspensivas
     (ex.: aprovação de crédito), prazo da escritura. Para imóveis, exige forma escrita com
     reconhecimento de assinaturas e certificação da licença de utilização (Art. 410.º/3 CC).
     Âmbito: nacional -->

# CONTRATO-PROMESSA DE COMPRA E VENDA

**Primeiro Outorgante (Promitente-Vendedor):** {{VENDEDOR_NOME}}, NIF {{VENDEDOR_NIF}}, {{VENDEDOR_MORADA}}, estado civil {{VENDEDOR_ESTADO_CIVIL}}.

**Segundo Outorgante (Promitente-Comprador):** {{COMPRADOR_NOME}}, NIF {{COMPRADOR_NIF}}, {{COMPRADOR_MORADA}}, estado civil {{COMPRADOR_ESTADO_CIVIL}}.

## 1. Identificação do imóvel
Fração/prédio {{DESCRICAO_IMOVEL}}, sito em {{MORADA_IMOVEL}}, descrito na Conservatória do Registo Predial de {{CRP}} sob o n.º {{N_DESCRICAO}}, inscrito na matriz predial sob o artigo {{ARTIGO_MATRICIAL}}, com licença de utilização n.º {{N_LICENCA}} e certificado energético {{N_CE}}.

## 2. Promessa
O Primeiro Outorgante promete vender, livre de ónus e encargos, e o Segundo Outorgante promete comprar, o imóvel identificado, pelo preço de **{{PRECO}}** ({{PRECO_EXTENSO}}).

## 3. Sinal e pagamento (Art. 442.º CC)
A título de sinal e princípio de pagamento, o Promitente-Comprador entrega nesta data **{{VALOR_SINAL}}**, do que se dá quitação. O remanescente de {{VALOR_RESTANTE}} será pago no ato da escritura.
- Se o **Promitente-Comprador** desistir: perde o sinal entregue.
- Se o **Promitente-Vendedor** desistir: restitui o sinal em dobro.

## 4. Escritura
A escritura pública (ou documento particular autenticado) será celebrada até **{{DATA_ESCRITURA}}**, em local a indicar pelo {{QUEM_MARCA}} com antecedência mínima de {{DIAS_AVISO}} dias. Os impostos da compra (IMT e Imposto do Selo) e despesas notariais/registo são da responsabilidade do Promitente-Comprador, salvo acordo em contrário (ver `references/valores-2026.md`).

## 5. Condição suspensiva — financiamento <!-- se aplicável; senão remover -->
O presente contrato fica sujeito à condição de aprovação de crédito bancário ao Promitente-Comprador no valor de {{VALOR_CREDITO}}. Não sendo aprovado até {{DATA_LIMITE_CREDITO}}, comprovadamente, o contrato resolve-se e o sinal é restituído em singelo.

## 6. Execução específica (Art. 830.º CC)
Em caso de incumprimento, a parte não faltosa pode requerer a execução específica do presente contrato. Tratando-se de promessa de transmissão de edifício ou de fração autónoma, este direito não pode ser afastado pelas partes, ainda que haja sinal (Art. 830.º, n.º 3, e Art. 410.º, n.º 3, CC).
<!-- Eficácia real (Art. 413.º CC): só existe se a promessa constar de escritura pública ou de documento particular autenticado e for registada; num CPCV comum a promessa tem eficácia meramente obrigacional. Se a pretenderem, [VERIFICAR] a forma e o registo antes de a mencionar. -->

## 7. Entrega
A posse/entrega das chaves ocorre {{ESCOLHER: na escritura / em DATA}}.

## 8. Foro
Lei portuguesa; foro da comarca da situação do imóvel.

{{LOCAL}}, {{DATA}}

O Promitente-Vendedor: __________________   O Promitente-Comprador: __________________

<!-- Requisito de forma (Art. 410.º, n.º 3, CC): reconhecimento presencial das assinaturas e certificação, pela entidade que o faz, da existência da licença de utilização ou de construção. A omissão só pode ser invocada pelo promitente-vendedor se tiver sido culposamente causada pelo promitente-comprador. -->

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Preencher a data-limite da escritura, o pré-aviso de marcação e a data-limite da condição de crédito e calendarizá-las — a falta à escritura pode significar perda do sinal ou restituição em dobro (art. 442.º CC).
- [ ] Forma: documento escrito com reconhecimento presencial das assinaturas e certificação da existência de licença de utilização (art. 410.º, n.º 3, CC).
- [ ] Antes de assinar: certidão predial permanente (ónus, penhoras, hipotecas), caderneta predial, licença de utilização, certificado energético e declaração de encargos de condomínio (a confirmar o regime atual).
- [ ] Entregar as chaves antes da escritura (tradição) pode tornar o IMT exigível logo com a promessa (art. 2.º, n.º 2, al. a), CIMT), salvo habitação própria e permanente nas condições legais — calcular com `calc_imt` e taxas em `references/valores-2026.md`.
- [ ] Confirmar direitos de preferência (arrendatário, comproprietários, entidades públicas) antes de marcar a escritura (a confirmar caso a caso).
