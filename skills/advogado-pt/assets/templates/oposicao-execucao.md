<!-- Template: petição de embargos de executado (oposição à execução) na execução comum para pagamento de quantia
     certa (tribunal judicial / agente de execução), com oposição à penhora cumulada opcional. NÃO serve para a
     execução fiscal (AT, Segurança Social): ver a nota no fim e `playbooks/recebi-notificacao-at.md`.
     Âmbito: nacional
     Base legal: CPC, arts. 58.º (patrocínio na execução), 138.º (contagem dos prazos), 245.º (dilação), 550.º
     (forma ordinária ou sumária), 552.º, n.º 6 (prova no fim da petição), 703.º (títulos executivos), 726.º, n.º 6
     (citação para pagar ou opor-se em 20 dias), 728.º (prazo dos embargos), 729.º (fundamentos — sentença), 730.º
     (decisão arbitral), 731.º (outros títulos), 732.º (termos), 733.º (suspensão), 736.º a 739.º
     (impenhorabilidades), 784.º e 785.º (oposição à penhora), 856.º (processo sumário), 857.º (injunção com fórmula
     executória), 858.º (sanções do exequente). DL 269/98, regime anexo, art. 14.º-A (preclusão na injunção). RCP,
     art. 7.º, n.º 4, e Tabela II (taxa de justiça). CC, arts. 303.º (prescrição), 342.º (ónus da prova), 428.º
     (exceção de não cumprimento) e 847.º a 848.º (compensação). Execução fiscal: CPPT, arts. 203.º e 204.º.
     Uso: ⏰ 20 dias a contar da citação (art. 728.º, n.º 1, CPC); oposição à penhora ⏰ 10 dias a contar da
     notificação da penhora (art. 785.º, n.º 1) ou, no processo sumário, nos mesmos 20 dias e cumulada com os
     embargos (art. 856.º, n.os 1 e 3). Peça autuada por apenso à execução (art. 732.º, n.º 1), entregue pelo
     advogado no Citius com o comprovativo da taxa de justiça. Escolher os fundamentos que cabem no título
     executivo (quadro abaixo), apagar os restantes e renumerar. -->

# EMBARGOS DE EXECUTADO

**Exmo(a). Senhor(a) Juiz(a) de Direito do {{JUIZO: Juízo de Execução de …}} do Tribunal Judicial da Comarca de {{COMARCA}}**

**Processo executivo n.º {{Nº_PROCESSO_EXECUCAO}}** — embargos a autuar por apenso (art. 732.º, n.º 1, do CPC)
Exequente: {{EXEQUENTE_NOME}}
Executado: {{EXECUTADO_NOME}}
Agente de execução: {{AGENTE_EXECUCAO: opcional}}

{{EXECUTADO_NOME}}, {{EXECUTADO_TIPO: sociedade por quotas / sociedade anónima / empresário em nome individual / pessoa singular}}, NIF/NIPC {{EXECUTADO_NIF}}, com {{sede / domicílio}} em {{EXECUTADO_MORADA}}, executado(a) nos autos de execução {{ordinária / sumária}} para pagamento de quantia certa que lhe move {{EXEQUENTE_NOME}}, NIF/NIPC {{EXEQUENTE_NIF}}, com {{sede / domicílio}} em {{EXEQUENTE_MORADA}}, citado(a) em {{DATA_CITACAO}}, vem, ao abrigo dos **arts. 728.º e seguintes do Código de Processo Civil** {{OPOSICAO_PENHORA: opcional — e dos arts. 784.º e 785.º / 856.º do mesmo Código}}, deduzir

**EMBARGOS DE EXECUTADO** {{OPOSICAO_PENHORA_TITULO: opcional — **E OPOSIÇÃO À PENHORA**}}

contra o(a) exequente, nos termos e com os fundamentos seguintes.

## I — Da tempestividade e do título executivo

1. O(A) executado(a) foi citado(a) em {{DATA_CITACAO}} {{e notificado(a) da penhora em {{DATA_NOTIFICACAO_PENHORA}}}}, pelo que os presentes embargos são tempestivos (art. 728.º, n.º 1, do CPC) {{FACTO_SUPERVENIENTE: opcional — ou: a matéria da oposição é superveniente, tendo o facto ocorrido / chegado ao conhecimento do executado em {{DATA_FACTO_SUPERVENIENTE}} (art. 728.º, n.º 2)}}.
2. A execução funda-se em {{TITULO_EXECUTIVO: sentença proferida no processo n.º … / decisão arbitral / requerimento de injunção n.º … com fórmula executória aposta em {{DATA}} / livrança / letra / cheque n.º … / escritura ou documento autenticado de {{DATA}} / outro documento com força executiva por lei especial}} (art. 703.º do CPC), no valor de {{VALOR_EXECUCAO}}.
3. Os fundamentos de oposição admissíveis são, por isso, os do {{FUNDAMENTOS_ADMISSIVEIS: art. 729.º / art. 730.º / art. 857.º / art. 731.º}} do CPC.

<!-- Que fundamentos posso invocar? Depende do título (indeferimento liminar se não couberem — art. 732.º, n.º 1, al. b)):

| Título executivo | Fundamentos admissíveis | Norma |
|---|---|---|
| Sentença | Só os taxativos das als. a) a i): inexistência/inexequibilidade do título, falta de pressupostos, obrigação incerta, inexigível ou ilíquida, caso julgado anterior, facto extintivo ou modificativo POSTERIOR ao encerramento da discussão e provado por documento (prescrição por qualquer meio), compensação | art. 729.º |
| Decisão arbitral | Os do art. 729.º + os fundamentos de anulação da decisão arbitral | art. 730.º |
| Injunção com fórmula executória | Os do art. 729.º (adaptados) + as defesas NÃO precludidas pelo art. 14.º-A do DL 269/98; com justo impedimento declarado em tempo à secretaria de injunção, os do art. 731.º; e sempre as questões de conhecimento oficioso e as exceções dilatórias evidentes | art. 857.º |
| Outros títulos (documento autenticado, livrança, letra, cheque, …) | Os do art. 729.º aplicáveis + QUALQUER defesa que se pudesse invocar numa ação declarativa | art. 731.º |
-->

## II — Da inexistência ou inexequibilidade do título e da falta de pressupostos _(opcional)_

4. {{INEXEQUIBILIDADE: ex. O documento dado à execução não é título executivo: trata-se de documento particular com assinatura reconhecida / de uma fatura, que deixaram de ter força executiva com o CPC de 2013 (art. 703.º, n.º 1) [VERIFICAR a data do documento e o regime transitório] / a livrança foi preenchida em violação do pacto de preenchimento [VERIFICAR — só nas relações imediatas] / o título cambiário está prescrito [VERIFICAR o prazo da LULL] — art. 729.º, al. a), do CPC.}}
5. {{INEXIGIBILIDADE: ex. A obrigação exequenda é inexigível, porque {{ainda não se venceu / está sujeita a condição não verificada / depende de contraprestação do exequente que não foi realizada}}, ou ilíquida, não tendo sido liquidada na fase introdutória — art. 729.º, al. e), do CPC.}}
6. {{PRESSUPOSTOS: ex. ilegitimidade do executado, que não é o devedor que consta do título / incompetência do tribunal — art. 729.º, al. c), do CPC.}}

## III — Dos factos extintivos ou modificativos da obrigação

<!-- O ónus da prova dos factos extintivos e modificativos é do executado (art. 342.º, n.º 2, CC). Contra SENTENÇA:
     só factos posteriores ao encerramento da discussão no processo de declaração e provados por documento; a
     prescrição prova-se por qualquer meio (art. 729.º, al. g)). -->

**A) Pagamento**

7. A quantia exequenda {{foi integralmente paga / foi paga na parte de {{VALOR_PAGO}}}} em {{DATA_PAGAMENTO}}, por {{MEIO_PAGAMENTO}}, como resulta do {{Doc. 1 — comprovativo de transferência / recibo / declaração de quitação}}.

**B) Prescrição**

8. O direito do exequente prescreveu: {{FUNDAMENTO_PRESCRICAO: ex. vencida a obrigação em {{DATA_VENCIMENTO}}, decorreu o prazo de {{PRAZO}} previsto no {{NORMA}} sem qualquer causa de interrupção ou suspensão}}. O(A) executado(a) invoca-a expressamente (art. 303.º do CC).

**C) Defesa sobre a relação subjacente** _(só títulos do art. 731.º — ex. documento autenticado, títulos de crédito nas relações imediatas)_

9. {{DEFESA_RELACAO_SUBJACENTE: ex. O exequente não cumpriu / cumpriu defeituosamente a prestação a que se obrigou — {{descrição}} —, pelo que o(a) executado(a) pode recusar o pagamento enquanto aquele não cumprir (exceção de não cumprimento — art. 428.º do CC) / O preço acordado foi de {{VALOR}} e não de {{VALOR}} / A assinatura aposta no documento não é do(a) executado(a), o que se demonstra pelo Doc. … (princípio de prova).}}

**D) Compensação**

10. O(A) executado(a) é titular de um crédito sobre o exequente, de {{VALOR_CONTRACREDITO}}, proveniente de {{ORIGEM_CONTRACREDITO}} (Doc. …), cuja compensação declarou {{em {{DATA_DECLARACAO}} (Doc. …) / pela presente}} (arts. 847.º e 848.º do CC; art. 729.º, al. h), do CPC).

## IV — Da suspensão da execução _(art. 733.º do CPC)_

<!-- O recebimento dos embargos NÃO suspende a execução por si só. Escolher a alínea aplicável. -->

11. Recebidos os embargos, requer-se a suspensão da execução, porquanto _(manter UMA opção)_:
    - **Opção A** — o(a) executado(a) presta caução, mediante {{MODALIDADE_CAUCAO: garantia bancária / depósito / seguro-caução / hipoteca sobre …}}, no valor de {{VALOR_CAUCAO}} (art. 733.º, n.º 1, al. a));
    - **Opção B** — a execução funda-se em documento particular cuja assinatura o(a) executado(a) impugnou, juntando documento que constitui princípio de prova, justificando-se a suspensão sem caução (art. 733.º, n.º 1, al. b));
    - **Opção C** — foi impugnada a exigibilidade ou a liquidação da obrigação exequenda, justificando-se a suspensão sem caução (art. 733.º, n.º 1, al. c)).
12. {{CASA_HABITACAO: opcional — O bem penhorado é a casa de habitação efetiva do(a) executado(a), cuja venda lhe causaria prejuízo grave e dificilmente reparável, pelo que se requer que a venda aguarde a decisão da 1.ª instância sobre os embargos (art. 733.º, n.º 5, do CPC).}}

## V — Da oposição à penhora _(opcional — arts. 784.º e 785.º do CPC; no processo sumário, art. 856.º)_

13. Por {{auto de penhora de {{DATA_PENHORA}} / notificação de {{DATA}}}}, foram penhorados {{BENS_PENHORADOS: ex. o saldo da conta bancária n.º … / 1/3 do vencimento / o veículo … / os equipamentos …}}.
14. A penhora é ilegal, porque _(manter as opções aplicáveis)_:
    - **Opção A** — incide sobre bens impenhoráveis ou excede a parte penhorável: {{BENS_IMPENHORAVEIS: ex. instrumentos de trabalho indispensáveis à atividade (art. 737.º, n.º 2) / mais de 1/3 do vencimento líquido / saldo bancário que devia ficar livre (art. 738.º, n.os 1, 3 e 5; limites em função do salário mínimo — ver `references/valores-2026.md`)}} (art. 784.º, n.º 1, al. a));
    - **Opção B** — atingiu de imediato bens que só subsidiariamente respondem pela dívida: {{BENS_SUBSIDIARIOS}} (art. 784.º, n.º 1, al. b));
    - **Opção C** — incide sobre bens que, segundo o direito substantivo, não respondem pela dívida exequenda: {{BENS_NAO_RESPONDEM}} (art. 784.º, n.º 1, al. c)).
15. {{SUBSTITUICAO_PENHORA: opcional — Requer-se a substituição da penhora por caução idónea, no valor de {{VALOR}}, que garante igualmente os fins da execução (art. 856.º, n.º 5, do CPC — processo sumário).}}

## VI — Do pedido

Nestes termos, requer-se a V. Exa. que:

- a) Sejam recebidos os presentes embargos {{e a oposição à penhora}};
- b) Seja suspensa a execução {{mediante a caução oferecida / sem prestação de caução}} (art. 733.º, n.º 1, do CPC);
- c) Sejam os embargos julgados procedentes, por provados, extinguindo-se a execução {{no todo / na parte de {{VALOR_PARCIAL}}}} (art. 732.º, n.º 4, do CPC);
- d) {{LEVANTAMENTO_PENHORA: opcional — Seja julgada procedente a oposição à penhora, ordenando-se o levantamento da penhora sobre {{BENS}} e o cancelamento dos respetivos registos (art. 785.º, n.º 6, do CPC);}}
- e) {{SANCOES_EXEQUENTE: opcional — Seja o exequente condenado na multa e na indemnização previstas no art. 858.º do CPC (processo sumário — a confirmar a aplicação ao caso);}}
- f) Seja o exequente condenado nas custas.

**Valor:** {{VALOR_EMBARGOS: o da execução ou da parte embargada [VERIFICAR]}}.

## VII — Da prova _(art. 552.º, n.º 6, do CPC, aplicável por força do art. 732.º, n.º 2 — a confirmar)_

**Prova documental:** os {{Nº_DOCUMENTOS}} documentos juntos.

**Prova testemunhal:**
1. {{TESTEMUNHA_1: nome, profissão e morada / local de trabalho}}
2. {{TESTEMUNHA_2}}

**Outros meios de prova:** {{OUTRA_PROVA: opcional — prova pericial à assinatura / depoimento de parte do legal representante do exequente / notificação do exequente para juntar …}}

**Junta:** procuração forense, comprovativo do pagamento da taxa de justiça {{ou do pedido / concessão de apoio judiciário}} e {{Nº_DOCUMENTOS}} documentos.

{{LOCAL}}, {{DATA}}

O(A) Advogado(a),

_______________________________
{{ADVOGADO_NOME}}, cédula profissional n.º {{Nº_CEDULA}}, com domicílio profissional em {{DOMICILIO_PROFISSIONAL}}

<!-- EXECUÇÃO FISCAL (AT / Segurança Social) — este template NÃO se aplica:
     - Prazo: ⏰ 30 dias a contar da citação pessoal ou, não a tendo havido, da primeira penhora (art. 203.º, n.º 1,
       al. a), CPPT); para factos supervenientes, a contar da sua ocorrência ou conhecimento (al. b)).
     - Fundamentos taxativos do art. 204.º CPPT (ex. prescrição da dívida tributária, falta de notificação da
       liquidação no prazo de caducidade, pagamento, ilegitimidade — incluindo do gerente revertido); não serve para
       discutir a legalidade da liquidação quando havia reclamação ou impugnação disponível.
     - A petição entrega-se no órgão da execução fiscal (serviço de finanças / secção de processo da SS) onde corre a
       execução (art. 207.º CPPT — a confirmar); mandatário obrigatório nos tribunais tributários (art. 6.º CPPT).
     - A oposição não suspende a execução sem garantia ou dispensa de garantia.
     Ver `playbooks/recebi-notificacao-at.md`, `references/contencioso-tributario.md` e, para pagar em prestações,
     `assets/templates/pedido-pagamento-prestacoes-at.md`. -->

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ **Embargos: 20 dias a contar da citação** (art. 728.º, n.º 1, CPC): prazo contínuo, suspenso nas férias judiciais (art. 138.º CPC); confirmar se acresce dilação (art. 245.º CPC — ex. citação em pessoa diversa ou fora da comarca — a confirmar no caso). Não se aplica a regra do prazo mais longo entre vários executados (art. 728.º, n.º 3). Matéria superveniente: o prazo conta do facto ou do seu conhecimento (n.º 2). Calcular com `calc_prazo` e registar com `registar_prazo`.
- [ ] ⏰ **Oposição à penhora: 10 dias a contar da notificação da penhora** (art. 785.º, n.º 1, CPC). No **processo sumário** — execuções de sentença, de injunção com fórmula executória, de títulos com hipoteca ou penhor e de títulos de valor até ao dobro da alçada da 1.ª instância (art. 550.º, n.º 2) —, a penhora precede a citação e embargos e oposição à penhora deduzem-se em conjunto nos mesmos 20 dias (art. 856.º, n.os 1 e 3).
- [ ] Confirmar o **título executivo** e que cada fundamento cabe no art. 729.º, 730.º, 731.º ou 857.º (quadro no início): fora de prazo, fora desses fundamentos ou manifestamente improcedentes, os embargos são indeferidos liminarmente (art. 732.º, n.º 1). Execução de injunção: só as defesas não precludidas pelo art. 14.º-A do DL 269/98 (art. 857.º, n.º 1).
- [ ] A execução **não se suspende automaticamente**: só com caução ou nas situações das als. b) a d) do art. 733.º, n.º 1; a oposição à penhora só suspende quanto aos bens visados e mediante caução (art. 785.º, n.º 3). Enquanto a execução prosseguir, nenhum credor é pago sem prestar caução (arts. 733.º, n.º 4, e 785.º, n.º 5).
- [ ] **Patrocínio**: os embargos seguem os termos do processo declarativo, pelo que é obrigatório advogado se a execução exceder a alçada da 1.ª instância, e sempre acima da alçada da Relação (art. 58.º, n.º 1, CPC; alçada da 1.ª instância em `references/valores-2026.md`; alçada da Relação também em `references/valores-2026.md`). Entrega pelo advogado no Citius, por apenso à execução.
- [ ] **Taxa de justiça**: Tabela II do RCP (art. 7.º, n.º 4), linha "oposição à execução por embargos, oposição à penhora ou embargos de terceiro", com dois escalões em função do valor (montantes em UC em `references/valores-2026.md`); embargos e oposição à penhora podem dar origem a duas taxas (a confirmar). O `calc_taxa_justica` calcula a Tabela I-A, não esta linha. Juntar o comprovativo com a petição; sem meios, pedir apoio judiciário na Segurança Social.
- [ ] Prova toda no fim da petição (rol de testemunhas, documentos, perícia) — os embargos seguem o processo comum declarativo depois da contestação do exequente em 20 dias (art. 732.º, n.º 2). Contra sentença, os factos extintivos posteriores provam-se **por documento** (art. 729.º, al. g)).
- [ ] É **execução fiscal** (AT/SS)? Não usar este template: ⏰ 30 dias (art. 203.º CPPT), fundamentos do art. 204.º — ver a nota no fim e `playbooks/recebi-notificacao-at.md`.
- [ ] Empresa: procuração assinada por quem obriga a sociedade (perfil em `.advogado-pt/perfil-empresa.md`); se a penhora atingir contas ou créditos de clientes, avaliar já o impacto na tesouraria e a substituição por caução. Retirar os comentários `<!-- -->`, as opções não usadas e todos os `{{...}}`; renumerar os artigos.
