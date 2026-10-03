<!-- Template: defesa escrita (impugnação administrativa) contra contraordenação, na fase
     administrativa, perante a autoridade que levantou o auto/instaura o processo. Base: Regime Geral
     das Contraordenações (RGCO — DL 433/82, de 27 out), em especial Arts. 50.º (direito de audição
     e defesa), 27.º e 27.º-A (prescrição do procedimento). Prazo de defesa: o indicado na própria
     notificação, que prevalece (laborais: 15 dias seguidos — Lei 107/2009, arts. 6.º e 17.º;
     trânsito: 15 dias úteis). Enviar por
     CORREIO REGISTADO (de preferência com aviso de receção) dentro do prazo. NÃO confundir com o
     recurso judicial de impugnação da decisão final (esse vai a juízo).
     COIMAS FISCAIS (AT): regime próprio do RGIT — defesa em 30 dias (art. 70.º) e recurso em
     30 dias (art. 80.º); ver playbooks/recebi-notificacao-at.md e adaptar a base legal.
     Âmbito: nacional -->

# DEFESA EM PROCESSO DE CONTRAORDENAÇÃO

**À {{AUTORIDADE_ADMINISTRATIVA}}**
**Processo de contraordenação n.º {{Nº_PROCESSO}}**

{{ARGUIDO_NOME}}, {{ARGUIDO_QUALIDADE: pessoa singular / pessoa coletiva}}, NIF/NIPC {{ARGUIDO_NIF}}, com morada/sede em {{ARGUIDO_MORADA}}, arguido(a) no processo de contraordenação acima identificado, notificado(a) em {{DATA_NOTIFICACAO}} do auto/da acusação, vem, ao abrigo do **Art. 50.º do RGCO (DL 433/82)** e no prazo legal, apresentar a sua **DEFESA ESCRITA**, nos termos e com os fundamentos seguintes.

## I — Dos factos imputados
Imputa-se ao arguido a prática de {{DESCRICAO_INFRACAO_IMPUTADA}}, alegadamente em {{DATA_FACTOS}}, em {{LOCAL_FACTOS}}, com fundamento na alegada violação do disposto em {{NORMA_IMPUTADA}}.

## II — Da contestação (impugnação dos factos e/ou da qualificação jurídica)
O arguido não se conforma com a imputação, pelos motivos seguintes:

1. {{IMPUGNACAO_FACTOS: ex. os factos não ocorreram como descrito / o arguido não praticou a conduta / a realidade é a seguinte...}}
2. {{IMPUGNACAO_QUALIFICACAO: ex. ainda que os factos se provassem, não preenchem o tipo contraordenacional, porquanto...}}

## III — Questões prévias e de fundo (a invocar conforme o caso)

<!-- Selecionar e desenvolver apenas os argumentos aplicáveis ao caso concreto; remover os restantes. -->

- **Nulidade/irregularidade da notificação ou do auto** — {{ex. a notificação não contém todos os elementos do Art. 50.º RGCO (descrição dos factos, normas, coima aplicável e prazo de defesa), o que compromete o exercício do direito de defesa.}}
- **Prescrição do procedimento** — {{ex. decorreu o prazo de prescrição do procedimento contraordenacional (Arts. 27.º e 27.º-A RGCO), atenta a data dos factos e a moldura da coima, pelo que o procedimento deve ser arquivado.}}
- **Falta de culpa / inexigibilidade** — {{ex. a conduta não é censurável a título de dolo nem de negligência; o arguido atuou sem culpa / em erro / em circunstâncias que afastam a responsabilidade.}}
- **Desproporcionalidade / atenuação da coima** — {{ex. a coima é desproporcionada face à gravidade, à situação económica do arguido e à ausência de benefício; requer-se, subsidiariamente, a aplicação do mínimo legal ou a admoestação (Art. 51.º RGCO).}}
- {{OUTROS_ARGUMENTOS}}

## IV — Da prova
Para prova do alegado, o arguido requer:
- a) **Prova testemunhal** — arrola as seguintes testemunhas, que se compromete a apresentar:
  1. {{TESTEMUNHA_1}}, residente em {{MORADA_TESTEMUNHA_1}};
  2. {{TESTEMUNHA_2}}, residente em {{MORADA_TESTEMUNHA_2}};
- b) **Prova documental** — junta os documentos n.os {{DOCUMENTOS}}, que se anexam;
- c) {{OUTROS_MEIOS_PROVA}}.

## V — Da audiência
O arguido {{OPCAO_AUDIENCIA: requer / prescinde de}} ser ouvido oralmente pela autoridade administrativa, sem prejuízo da presente defesa escrita.

## Pedido
Nestes termos, requer-se que a presente defesa seja admitida e, em consequência, que o processo seja **arquivado** por não estarem reunidos os pressupostos da responsabilidade contraordenacional ou, subsidiariamente, que a coima seja **reduzida ao mínimo legal** ou substituída por **admoestação**.

Junta: {{Nº_DOCUMENTOS}} documentos.

{{LOCAL}}, {{DATA}}

O(A) arguido(a) / mandatário(a),

_______________________________
{{ARGUIDO_NOME}}

<!-- Remeter por correio registado (idealmente com aviso de receção) dentro do prazo de defesa.
     Conservar comprovativo do registo como prova da tempestividade. -->

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Confirmar o prazo de defesa indicado na notificação (prevalece e varia consoante o regime: laboral, rodoviário, fiscal, RGPD) e contá-lo a partir da notificação com `calc_prazo`.
- [ ] Enviar por correio registado com AR (ou pelo meio eletrónico indicado na notificação) e guardar o comprovativo de registo como prova da tempestividade.
- [ ] Verificar a prescrição do procedimento (arts. 27.º e 27.º-A RGCO ou regime setorial) e se a notificação contém os elementos necessários à defesa (art. 50.º RGCO).
- [ ] Se atuar mandatário, juntar procuração; numerar os documentos e indicar as testemunhas com moradas completas.
- [ ] ⏰ Se a decisão final for desfavorável: impugnação judicial em 20 dias após o seu conhecimento, apresentada à autoridade que aplicou a coima (art. 59.º, n.º 3, RGCO); o prazo suspende-se aos sábados, domingos e feriados (art. 60.º RGCO).
- [ ] Ponderar o pagamento voluntário/pelo mínimo quando o regime setorial o permita (confirmar os efeitos sobre a defesa); montantes das coimas: confirmar no diploma setorial e em `references/valores-2026.md`.
