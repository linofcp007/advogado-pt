<!-- Template: Reclamação de créditos em processo de insolvência, dirigida ao administrador da insolvência
     (art. 128.º CIRE), com variante para PER / PEAP dirigida ao administrador judicial provisório
     (arts. 17.º-D, n.º 2, e 222.º-D, n.º 2, CIRE). Serve a qualquer credor (fornecedor, prestador de
     serviços, senhorio, financiador) — empresa ou particular.
     Âmbito: nacional
     Base legal: CIRE (DL 53/2004) — arts. 9.º, 36.º, n.º 1, al. j), 37.º, n.os 7-8, 47.º, 48.º, 91.º, 99.º,
     104.º, 128.º, 129.º, 130.º, 141.º, 146.º; PER: arts. 17.º-D a 17.º-F; PEAP: arts. 222.º-D e 222.º-E;
     Código Comercial, art. 102.º, e DL 62/2013 (juros comerciais).
     Uso: ⏰ insolvência — prazo fixado na sentença (até 30 dias), que só começa a correr depois da dilação
     de 5 dias contada da publicação do anúncio no Citius; processo urgente, os prazos correm em férias
     judiciais. ⏰ PER/PEAP — 20 dias contados da publicação no Citius do despacho de nomeação do
     administrador judicial provisório. Com advogado: apresentar por via eletrónica (art. 128.º, n.º 2).
     Sem advogado: entregar no domicílio profissional do administrador da insolvência ou enviar por e-mail
     ou por carta registada (art. 128.º, n.º 3). Juntar TODOS os documentos de prova. Calcular os juros
     com a tool calc_juros_mora (ou scripts/juros_mora.py), usando como data final a data da declaração
     de insolvência. Playbook: playbooks/cliente-insolvente.md. -->

# RECLAMAÇÃO DE CRÉDITOS

**Exmo(a). Senhor(a) Administrador(a) da Insolvência**
**{{AI_NOME}}**
{{AI_DOMICILIO_PROFISSIONAL}}
{{AI_EMAIL}}

**Processo n.º:** {{N_PROCESSO}}
**Tribunal:** Tribunal Judicial da Comarca de {{COMARCA}} — Juízo de Comércio de {{LOCALIDADE_JUIZO}} — Juiz {{N_JUIZ}}
**Insolvente:** {{INSOLVENTE_NOME}}, NIPC/NIF {{INSOLVENTE_NIF}}, com sede/domicílio em {{INSOLVENTE_MORADA}}
**Sentença de declaração de insolvência:** proferida em {{DATA_SENTENCA}}, às {{HORA_SENTENCA: indicada na sentença — na falta de indicação, considera-se proferida ao meio-dia (art. 36.º, n.º 1, al. a), CIRE)}}; anúncio publicado no portal Citius em {{DATA_ANUNCIO_CITIUS}}

**Assunto:** Reclamação de créditos (art. 128.º do Código da Insolvência e da Recuperação de Empresas)

**{{CREDOR_NOME}}**, {{CREDOR_FORMA: ex. sociedade por quotas / sociedade anónima / empresário em nome individual / pessoa singular}}, NIPC/NIF {{CREDOR_NIF}}, com sede/domicílio em {{CREDOR_MORADA}}, endereço eletrónico {{CREDOR_EMAIL}}, neste ato representada por {{CREDOR_REPRESENTANTE}}, na qualidade de {{CREDOR_QUALIDADE: ex. gerente / administrador / mandatário (procuração junta)}},

vem, no prazo fixado na sentença de declaração de insolvência e nos termos do **art. 128.º do CIRE**, **reclamar a verificação dos créditos** que detém sobre a insolvente, o que faz nos termos e com os fundamentos seguintes:

## I — Proveniência dos créditos [art. 128.º, n.º 1, al. a)]

1. No exercício da sua atividade, a reclamante {{RELACAO_COMERCIAL: ex. forneceu à insolvente os bens / prestou à insolvente os serviços / cedeu o gozo do imóvel / concedeu o financiamento}} descritos nas faturas/documentos abaixo identificados, ao abrigo de {{TITULO: ex. contrato de fornecimento de DD/MM/AAAA / notas de encomenda n.os ... / acordo verbal comprovado por guias de remessa e correspondência}}.
2. A reclamante cumpriu integralmente as suas prestações, {{PROVA_CUMPRIMENTO: ex. tendo os bens sido entregues e recebidos sem reclamação, conforme guias de remessa assinadas / tendo os serviços sido aceites, conforme relatórios e e-mails juntos}}.
3. A insolvente não pagou, nas datas de vencimento nem até à data da declaração de insolvência, as quantias abaixo discriminadas.
4. {{TITULO_JUDICIAL: opcional — ex. O crédito encontra-se ainda reconhecido por requerimento de injunção com fórmula executória n.º ... / sentença proferida no processo n.º ..., que se junta, sem prejuízo de, nos termos do art. 128.º, n.º 5, do CIRE, ser aqui reclamado.}}

## II — Montante do capital e dos juros [art. 128.º, n.º 1, al. a)]

| Fatura / documento n.º | Data de emissão | Data de vencimento | Capital em dívida, IVA incluído (€) | Juros de mora vencidos até à data da declaração de insolvência (€) | Total (€) |
|---|---|---|---|---|---|
| {{FATURA_1}} | {{EMISSAO_1}} | {{VENCIMENTO_1}} | {{CAPITAL_1}} | {{JUROS_1}} | {{TOTAL_1}} |
| {{FATURA_2}} | {{EMISSAO_2}} | {{VENCIMENTO_2}} | {{CAPITAL_2}} | {{JUROS_2}} | {{TOTAL_2}} |
| {{FATURA_N}} | {{EMISSAO_N}} | {{VENCIMENTO_N}} | {{CAPITAL_N}} | {{JUROS_N}} | {{TOTAL_N}} |
| **Totais** | | | **{{TOTAL_CAPITAL}}** | **{{TOTAL_JUROS}}** | **{{TOTAL_GERAL}}** |

5. Os juros de mora foram contados, por cada fatura, desde a data do respetivo vencimento até à data da declaração de insolvência ({{DATA_SENTENCA}}), à taxa indicada na secção VI.
6. {{FATURAS_NAO_VENCIDAS: opcional — As faturas n.os ..., cujo vencimento era posterior à declaração de insolvência, consideram-se vencidas por efeito desta (art. 91.º, n.º 1, do CIRE), sem prejuízo da redução prevista no n.º 2 do mesmo artigo quanto às obrigações pelas quais não fossem devidos juros remuneratórios.}}
7. {{INDEMNIZACAO_CUSTOS_COBRANCA: opcional, só em transações comerciais entre empresas — Acresce a indemnização pelos custos de cobrança prevista no art. 7.º do DL 62/2013, de 10 de maio, no montante de {{VALOR}} (valor em references/valores-2026.md) [VERIFICAR se é devida por cada transação/fatura].}}
8. {{JUROS_POSTERIORES: opcional — Reclamam-se ainda os juros de mora que se vencerem desde a data da declaração de insolvência até efetivo pagamento, à taxa indicada na secção VI, os quais têm a natureza de créditos subordinados nos termos do art. 48.º, al. b), do CIRE.}}

**Montante global reclamado (capital + juros até à declaração de insolvência{{MAIS_INDEMNIZACAO: opcional — + indemnização por custos de cobrança}}): {{TOTAL_GERAL_EXTENSO: € ... (... euros)}}.**

## III — Condições [art. 128.º, n.º 1, al. b)]

9. {{CONDICOES: Os créditos reclamados não estão sujeitos a qualquer condição, suspensiva ou resolutiva. / OU: O crédito de € ... está sujeito à condição suspensiva de ... (descrever).}}

## IV — Natureza dos créditos [art. 128.º, n.º 1, al. c)]

10. Os créditos reclamados têm natureza **{{NATUREZA: comum / garantida / privilegiada / subordinada}}**.
11. {{GARANTIA_REAL: só se garantido — O crédito beneficia de {{TIPO: hipoteca / penhor / direito de retenção / consignação de rendimentos}} sobre {{BEM: identificação do bem}}, {{DADOS_REGISTO: ex. descrito na Conservatória do Registo Predial de ... sob o n.º ..., com a inscrição AP. ... de DD/MM/AAAA}}, até ao montante de € {{MONTANTE_GARANTIDO}}, garantia que aqui se comunica para os efeitos do art. 36.º, n.º 1, al. l), do CIRE.}}
12. {{PRIVILEGIO: só se privilegiado — O crédito goza do privilégio creditório {{geral/especial}} previsto em {{NORMA}} [VERIFICAR].}}

## V — Garantias pessoais [art. 128.º, n.º 1, al. d)]

13. {{GARANTIAS_PESSOAIS: Não existem garantias pessoais. / OU: O cumprimento das obrigações da insolvente encontra-se garantido por {{fiança / aval em livrança / garantia bancária}} prestada por {{GARANTE_NOME}}, NIF {{GARANTE_NIF}}, residente/com sede em {{GARANTE_MORADA}}, reservando a reclamante o direito de agir contra o(s) garante(s), nos termos gerais.}}

## VI — Taxa de juros moratórios aplicável [art. 128.º, n.º 1, al. e)]

14. É aplicável a {{TAXA_JUROS: taxa supletiva de juros moratórios das transações comerciais (art. 102.º, § 5.º, do Código Comercial e DL 62/2013), fixada semestralmente / taxa supletiva dos créditos de empresas comerciais (art. 102.º, § 3.º, do Código Comercial), fixada semestralmente / taxa de juro civil (Portaria 291/2003) / taxa contratual de ...% (cláusula ... do contrato)}}, nos termos constantes da memória de cálculo junta (Doc. {{N_DOC_CALCULO}}), com as taxas em vigor em cada período.

## VII — Identificação bancária [art. 128.º, n.º 1, al. f)]

15. Para efeitos de pagamento, a reclamante indica o IBAN **{{IBAN}}**, de que é titular{{BANCO: , no banco ...}}.

## VIII — Restituição / separação de bens {{opcional — só se houver reserva de propriedade ou bens de terceiro na posse da insolvente}}

16. {{RESERVA_PROPRIEDADE: Os bens descritos em {{IDENTIFICACAO_BENS}}, vendidos à insolvente com reserva de propriedade estipulada por escrito até ao momento da entrega (art. 104.º, n.º 4, do CIRE), conforme {{DOCUMENTO: contrato / condições gerais aceites por escrito}}, permanecem propriedade da reclamante, pelo que se requer a sua restituição/separação da massa insolvente, nos termos do art. 141.º, n.º 1, al. c), do CIRE, e se fixa a V. Exa. prazo razoável para declarar se opta pelo cumprimento do contrato (art. 102.º, n.º 2, e art. 104.º, n.º 3, do CIRE).}}

## IX — Compensação {{opcional}}

17. {{COMPENSACAO: A reclamante é devedora da insolvente da quantia de € ..., relativa a ..., verificando-se os pressupostos legais da compensação em data anterior à declaração de insolvência (art. 99.º, n.º 1, al. a), do CIRE). Pela presente declara compensar esse débito com o seu crédito, até à concorrência dos respetivos montantes, reclamando-se apenas o saldo [VERIFICAR requisitos do art. 99.º, n.os 1 e 4].}}

## X — Documentos

Juntam-se os seguintes documentos probatórios:

- Doc. 1 — {{DOC_1: faturas n.os ...}}
- Doc. 2 — {{DOC_2: notas de encomenda / guias de remessa / autos de aceitação / relatórios de serviço}}
- Doc. 3 — {{DOC_3: contrato e/ou condições gerais aceites}}
- Doc. 4 — {{DOC_4: extrato de conta-corrente do cliente}}
- Doc. 5 — {{DOC_5: interpelações para pagamento e respetivos avisos de receção}}
- Doc. 6 — {{DOC_6: memória de cálculo dos juros por fatura}}
- Doc. {{N}} — {{DOC_OPCIONAIS: reconhecimento de dívida / sentença ou injunção com fórmula executória / título da garantia (certidão de registo, livrança e pacto de preenchimento) / procuração}}

## Pedido

Nestes termos, requer a V. Exa. que se digne **reconhecer os créditos acima identificados**, no montante global de **{{TOTAL_GERAL}}**, com a natureza de crédito **{{NATUREZA}}**{{GARANTIA_RESUMO: , garantido por ... até ao montante de €...}}, e **incluí-los na lista de credores reconhecidos** a apresentar nos termos do art. 129.º do CIRE{{RESTITUICAO: , bem como reconhecer o direito à restituição/separação dos bens identificados na secção VIII}}.

Mais requer que todas as comunicações relativas ao presente processo lhe sejam dirigidas para {{ENDERECO_COMUNICACOES: e-mail / morada}}.

{{LOCAL}}, {{DATA}}

Pela reclamante,

Assinatura: _______________________________
{{CREDOR_REPRESENTANTE}}, na qualidade de {{CREDOR_QUALIDADE}}

---

## VARIANTE — PER / PEAP (reclamação dirigida ao administrador judicial provisório)

<!-- Usar no Processo Especial de Revitalização (empresas — art. 17.º-D, n.º 2, CIRE) ou no Processo Especial
     para Acordo de Pagamento (devedores que não sejam empresas — art. 222.º-D, n.º 2, CIRE).
     ⏰ 20 dias contados da publicação no portal Citius do despacho de nomeação do administrador judicial
     provisório. A lista provisória é publicada no Citius e pode ser impugnada em 5 dias úteis.
     Mesmo quem não reclama fica vinculado pelo plano de recuperação homologado (art. 17.º-F, n.º 11). -->

Substituir o cabeçalho e as referências legais do modelo acima pelo seguinte:

**Exmo(a). Senhor(a) Administrador(a) Judicial Provisório(a)**
**{{AJP_NOME}}**
{{AJP_DOMICILIO_PROFISSIONAL}}
{{AJP_EMAIL}}

**Processo {{TIPO_PROCESSO: Especial de Revitalização / Especial para Acordo de Pagamento}} n.º:** {{N_PROCESSO}} — {{TRIBUNAL_JUIZO}}
**{{Empresa / Devedor}}:** {{DEVEDOR_NOME}}, NIPC/NIF {{DEVEDOR_NIF}}
**Despacho de nomeação do administrador judicial provisório:** publicado no portal Citius em {{DATA_PUBLICACAO_DESPACHO}}

**Assunto:** Reclamação de créditos ({{BASE: art. 17.º-D, n.º 2 / art. 222.º-D, n.º 2}} do CIRE)

{{CREDOR_NOME}}, (...) vem, no prazo de 20 dias contados da publicação do despacho de nomeação de V. Exa. no portal Citius, e nos termos do **{{BASE}} do CIRE**, reclamar os seus créditos sobre {{DEVEDOR_NOME}}, indicando:

- a) a proveniência, data de vencimento, montante de capital e de juros — **secções I e II** do modelo, com os juros contados desde o vencimento até {{DATA_FINAL_JUROS: data da reclamação}} [VERIFICAR — no PER/PEAP não há vencimento antecipado nem a regra do art. 48.º, al. b)];
- b) as condições suspensivas ou resolutivas — **secção III**;
- c) a natureza comum, subordinada, privilegiada ou garantida e, sendo garantida, os bens ou direitos objeto da garantia e respetivos dados de identificação registral — **secção IV**;
- d) as garantias pessoais, com identificação dos garantes — **secção V**;
- e) a taxa de juros moratórios aplicável — **secção VI**.

{{PARTICIPACAO_NEGOCIACOES: opcional — Mais declara que pretende participar nas negociações em curso, declaração que comunica igualmente à {{empresa/devedor}} por carta registada (art. 17.º-D, n.º 9 / art. 222.º-D, n.º 7, do CIRE).}}

Requer a inclusão dos créditos reclamados na **lista provisória de créditos**, com a natureza indicada.

Juntam-se os documentos referidos na secção X.

{{LOCAL}}, {{DATA}}

Assinatura: _______________________________
{{CREDOR_REPRESENTANTE}}, na qualidade de {{CREDOR_QUALIDADE}}

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ **Insolvência:** prazo fixado na sentença (até 30 dias — art. 36.º, n.º 1, al. j), CIRE), contado só **depois da dilação de 5 dias** desde a publicação do anúncio no Citius (art. 37.º, n.os 7 e 8). Dias seguidos; processo urgente — corre em férias judiciais (art. 9.º, n.º 1, CIRE; art. 138.º, n.º 1, CPC); se terminar com os tribunais encerrados, passa para o 1.º dia útil seguinte (art. 138.º, n.º 2, CPC). Contar com `calc_prazo` (tipo `corridos`).
- [ ] ⏰ **PER/PEAP:** 20 dias desde a publicação no Citius do despacho de nomeação do administrador judicial provisório (arts. 17.º-D, n.º 2, e 222.º-D, n.º 2); depois, vigiar a lista provisória e impugná-la em **5 dias úteis** se estiver errada.
- [ ] **Meio de envio:** com advogado — por via eletrónica (art. 128.º, n.º 2); sem advogado — entrega em mão no domicílio profissional do administrador (pedir assinatura do comprovativo), **e-mail** ou **carta registada** (art. 128.º, n.º 3); o administrador tem 3 dias para enviar o comprovativo de receção. Guardar a prova de envio. No PER/PEAP a lei só diz "remetidas ao administrador judicial provisório" — usar e-mail com recibo ou carta registada com AR [VERIFICAR o meio indicado no anúncio].
- [ ] Reclamar **mesmo que** o crédito conste da contabilidade da insolvente ou já tenha sentença/injunção — a lei não dispensa (art. 128.º, n.º 5, CIRE).
- [ ] **Juros:** calculados por fatura, do vencimento até à **data (e hora) da declaração de insolvência**, com a taxa do semestre aplicável (`calc_juros_mora` / `scripts/juros_mora.py`; taxas em `references/valores-2026.md`). Os juros posteriores são **subordinados** (art. 48.º, al. b)) — reclamá-los à parte, como tal, se fizer sentido.
- [ ] **Natureza do crédito** bem qualificada (art. 47.º, n.º 4, e art. 48.º CIRE): é subordinado se o credor for "pessoa especialmente relacionada" com a devedora (art. 49.º — ex.: administrador de direito ou de facto, ou sociedade em relação de domínio ou de grupo, nos 2 anos anteriores ao início do processo; familiares destes) ou se o crédito for de suprimentos (art. 48.º, al. g)).
- [ ] **Reserva de propriedade:** só é oponível à massa se tiver sido **estipulada por escrito até à entrega** (art. 104.º, n.º 4) — juntar o documento e pedir a separação/restituição (art. 141.º, n.º 1, al. c)).
- [ ] **Garantes:** fiadores e avalistas identificados na secção V; a execução contra eles **prossegue** (art. 88.º, n.º 1) — tratar em paralelo com advogado.
- [ ] Documentos numerados e legíveis; procuração junta se assinar mandatário; IBAN correto (art. 128.º, n.º 1, al. f)).
- [ ] Calendarizar os passos seguintes: lista de créditos reconhecidos (15 dias após o fim do prazo de reclamação — art. 129.º, n.º 1) e **impugnação** dessa lista em **10 dias** (art. 130.º, n.º 1); assembleia de apreciação do relatório (data na sentença — art. 36.º, n.º 1, al. n)). Confirmar o texto em vigor do CIRE em dre.pt antes de enviar.
