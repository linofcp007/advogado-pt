<!-- Template: Contrato de cessão de quota de sociedade por quotas (Lda), total ou parcial, entre um sócio
     (cedente) e um sócio ou terceiro (cessionário), com intervenção da sociedade. Inclui declarações e
     garantias sobre a sociedade (passivo e contingências), regime de indemnização e obrigações pós-assinatura.
     Âmbito: nacional
     Base legal: CSC (DL 262/86) — arts. 221.º (divisão de quotas), 228.º-231.º (cessão e consentimento),
     242.º-A a 242.º-F (registo promovido pela sociedade), 258.º (renúncia de gerente); CRCom — arts. 3.º, n.º 1,
     al. c), 15.º, n.os 1 e 2, 29.º, n.º 5, 29.º-A e 53.º-A (registo por depósito); RJRCBE (anexo à Lei 89/2017) —
     art. 14.º; CIRS (mais-valias, categoria G); CIMT — art. 2.º, n.º 2, al. d).
     Uso:
     - FORMA: escrito (art. 228.º, n.º 1, CSC). Não é exigida escritura nem reconhecimento de assinaturas, mas o
       reconhecimento presencial é recomendável (prova; alguns bancos e conservatórias pedem-no).
     - CONSENTIMENTO DA SOCIEDADE: a cessão a terceiros só produz efeitos perante a sociedade depois de consentida
       por esta; não é necessário nas cessões entre cônjuges, entre ascendentes e descendentes ou entre sócios
       (art. 228.º, n.º 2), salvo se o pacto o exigir (art. 229.º, n.º 3) — e o pacto pode dispensá-lo (art. 229.º,
       n.º 2). Pedido por escrito, com indicação do cessionário e de TODAS as condições (art. 230.º, n.º 1);
       consentimento expresso por deliberação dos sócios (n.º 2). ⏰ Se a sociedade não deliberar em 60 dias a
       contar da receção do pedido, a cessão deixa de depender do consentimento (art. 230.º, n.º 4). A recusa tem
       de vir com proposta de amortização ou aquisição da quota, sob pena de a cessão ficar livre (art. 231.º —
       regra aplicável se a quota estiver há mais de 3 anos na titularidade do cedente, n.º 3).
     - Ler o PACTO SOCIAL: direitos de preferência dos sócios, proibições ou condições à cessão (art. 229.º),
       acordos parassociais (lock-up, preferência, tag/drag-along — `assets/templates/acordo-parassocial.md`).
     - EFICÁCIA E REGISTO: a cessão é eficaz perante a sociedade com a comunicação escrita ou o reconhecimento por
       esta (art. 228.º, n.º 3) e os factos relativos a quotas são ineficazes perante ela enquanto não for pedida a
       promoção do registo (art. 242.º-A). O registo é POR DEPÓSITO e é a SOCIEDADE quem o promove (art. 242.º-B
       CSC; CRCom, art. 29.º, n.º 5). ⏰ Pedido em 2 meses a contar da data do contrato (CRCom, art. 15.º, n.os 1 e
       2). Se a sociedade não o promover, qualquer interessado pode pedir à conservatória que a notifique para o
       fazer em 10 dias (CRCom, art. 29.º-A).
     - ⏰ RCBE: atualizar em 30 dias se mudarem os beneficiários efetivos (RJRCBE, art. 14.º).
     - FISCAL: mais-valia do cedente — `references/fiscal-pessoal.md` (pessoa singular) ou `references/fiscal.md`
       (cedente sociedade); IMT se a sociedade detiver imóveis e o cessionário passar a deter pelo menos 75% do
       capital, nas condições do art. 2.º, n.º 2, al. d), CIMT (tool `calc_imt`); Imposto do Selo [VERIFICAR]. -->

# CONTRATO DE CESSÃO DE QUOTA

Entre:

**Cedente:** {{CEDENTE_NOME}}, {{CEDENTE_ESTADO_CIVIL: estado civil e, se casado, nome do cônjuge e regime de bens}}, residente em {{CEDENTE_MORADA}}, titular do {{CEDENTE_DOCUMENTO}} n.º {{CEDENTE_N_DOCUMENTO}}, NIF {{CEDENTE_NIF}}{{CEDENTE_PESSOA_COLETIVA: opcional, em alternativa — {{FIRMA_CEDENTE}}, NIPC {{NIPC_CEDENTE}}, com sede em {{SEDE_CEDENTE}}, aqui representada por {{REPRESENTANTE_CEDENTE}}, com poderes para o ato}};

e

**Cessionário:** {{CESSIONARIO_NOME}}, {{CESSIONARIO_ESTADO_CIVIL}}, residente em {{CESSIONARIO_MORADA}}, titular do {{CESSIONARIO_DOCUMENTO}} n.º {{CESSIONARIO_N_DOCUMENTO}}, NIF {{CESSIONARIO_NIF}}{{CESSIONARIO_PESSOA_COLETIVA: opcional, em alternativa — firma, NIPC, sede e representante}};

e, como interveniente,

**Sociedade:** {{FIRMA}}, Lda., NIPC {{NIPC}}, com sede em {{SEDE}}, com o capital social de {{CAPITAL}} euros, matriculada na Conservatória do Registo Comercial sob o mesmo número, aqui representada por {{GERENTE_NOME}}, na qualidade de gerente, com poderes para o ato;

é celebrado o presente contrato de cessão de quota, que se rege pelas cláusulas seguintes.

## Cláusula 1.ª — Quota cedida

1. O Cedente é dono e legítimo titular de uma quota com o valor nominal de **{{VALOR_NOMINAL_QUOTA}} euros**, representativa de {{PERCENTAGEM_QUOTA}}% do capital social da Sociedade, registada a seu favor pela inscrição {{INSCRICAO_REGISTO}}, {{REALIZACAO: integralmente realizada | realizada em … euros, estando por realizar … euros}}.
2. Pelo presente contrato, o Cedente cede ao Cessionário {{OBJETO_CESSAO: a totalidade da referida quota | uma quota com o valor nominal de … euros, a destacar da referida quota por divisão (art. 221.º do CSC), ficando o Cedente com uma quota de … euros}}, livre de quaisquer ónus, encargos ou limitações, com todos os direitos e obrigações inerentes, incluindo o direito aos lucros {{LUCROS: ainda não distribuídos | do exercício em curso e seguintes}}.

## Cláusula 2.ª — Preço e pagamento

1. O preço da cessão é de **{{PRECO}} euros** ({{PRECO_EXTENSO}}).
2. O preço é pago:
   - a) {{PAGAMENTO_SINAL: … euros nesta data, por transferência bancária, de que o Cedente dá quitação}};
   - b) {{PAGAMENTO_RESTANTE: … euros até …, por transferência para o IBAN {{IBAN_CEDENTE}}}}.
3. {{GARANTIA_PRECO: opcional, se houver pagamento diferido — Em garantia do pagamento diferido, o Cessionário {{GARANTIA: constitui penhor sobre a quota cedida a favor do Cedente | entrega garantia bancária autónoma à primeira solicitação | entrega livrança subscrita e avalizada por …, com pacto de preenchimento}}.}}
4. A falta de pagamento de qualquer prestação na data do vencimento implica o vencimento imediato das restantes e constitui o Cessionário em mora, sendo devidos juros à taxa legal aplicável (ver `references/valores-2026.md`){{RESOLUCAO_PRECO: opcional — , podendo o Cedente resolver o contrato se a mora se prolongar por mais de … dias após interpelação escrita}}.

## Cláusula 3.ª — Consentimento da Sociedade e direitos de preferência

1. {{CONSENTIMENTO: escolher —
   (A) A Sociedade consentiu na presente cessão por deliberação dos sócios de {{DATA_DELIBERACAO}}, constante da ata n.º {{N_ATA}}, cuja cópia fica anexa;
   (B) A presente cessão não depende do consentimento da Sociedade por se tratar de cessão entre sócios / entre cônjuges / entre ascendentes e descendentes (art. 228.º, n.º 2, do CSC) e o contrato de sociedade não o exigir;
   (C) O contrato de sociedade dispensa o consentimento da Sociedade para a presente cessão (cláusula {{CLAUSULA_PACTO}}.ª).}}
2. {{PREFERENCIA: opcional — Os demais sócios, titulares de direito de preferência nos termos da cláusula {{CLAUSULA_PREFERENCIA}}.ª do contrato de sociedade, renunciaram ao seu exercício por declarações escritas datadas de {{DATA_RENUNCIA}}, que ficam anexas.}}
3. A Sociedade, pela sua intervenção, declara tomar conhecimento da presente cessão, que considera comunicada para os efeitos do n.º 3 do artigo 228.º do CSC, e reconhece o Cessionário como sócio a partir de {{DATA_EFEITOS}}.

## Cláusula 4.ª — Declarações e garantias do Cedente

O Cedente declara e garante ao Cessionário, com referência à data de assinatura e à data de efeitos, que:
- a) é o único titular da quota cedida, que se encontra livre de penhores, penhoras, usufrutos, promessas de alienação, direitos de terceiros ou litígios, e tem plena capacidade e legitimidade para a ceder;
- b) a quota está realizada nos termos da Cláusula 1.ª e não existem prestações suplementares, acessórias ou suprimentos exigíveis ao Cedente, salvo os indicados no Anexo I;
- c) a Sociedade está regularmente constituída, com o registo comercial, o RCBE e as obrigações declarativas em dia;
- d) as contas do exercício de {{ANO_CONTAS}} e o balancete reportado a {{DATA_BALANCETE}} (Anexo II) refletem, de forma verdadeira e apropriada, a situação patrimonial e financeira da Sociedade;
- e) **passivo**: a Sociedade não tem dívidas, responsabilidades ou garantias prestadas para além das constantes do Anexo II e das contraídas posteriormente no curso normal dos negócios;
- f) **contingências**: não existem, nem são do seu conhecimento, processos judiciais, arbitrais, administrativos, contraordenacionais ou inspeções pendentes ou ameaçados contra a Sociedade, nem dívidas à Autoridade Tributária e Aduaneira ou à Segurança Social, nem créditos laborais em atraso, salvo os indicados no Anexo III;
- g) a Sociedade cumpre a legislação aplicável à sua atividade, designadamente laboral, fiscal e de proteção de dados, e é titular das licenças necessárias, que se encontram válidas;
- h) a Sociedade não se encontra em situação de insolvência, nem é parte em processo de insolvência, de revitalização ou de reestruturação;
- i) {{OUTRAS_GARANTIAS: ex. titularidade da propriedade intelectual, contratos relevantes, ausência de cláusulas de mudança de controlo}}.

<!-- Se o Cessionário já for sócio/gerente e conhecer a Sociedade, as garantias podem limitar-se às alíneas a) e b).
     O Anexo III ("disclosure") limita as garantias: o que nele estiver revelado não pode ser reclamado. -->

## Cláusula 5.ª — Responsabilidade do Cedente

1. O Cedente indemniza o Cessionário {{BENEFICIARIO_INDEMNIZACAO: ou, à escolha deste, a Sociedade}} por qualquer dano resultante da inexatidão das declarações da Cláusula 4.ª e por todo o passivo ou contingência com causa anterior à data de efeitos que não conste dos Anexos II e III.
2. A responsabilidade do Cedente:
   - a) só é exigível se o Cessionário o notificar por escrito, com descrição fundamentada, no prazo de {{PRAZO_RECLAMACAO: ex. 18 meses}} a contar da data de efeitos, salvo quanto a matérias fiscais e de Segurança Social, em que o prazo acompanha o prazo de caducidade/prescrição aplicável acrescido de {{PRAZO_ADICIONAL: ex. 60}} dias;
   - b) {{LIMITES: opcional — está limitada a {{TETO: ex. 100% do preço}} e só é devida quando o dano, isolado ou agregado, exceder {{FRANQUIA}} euros;}}
   - c) não abrange os danos que resultem de factos revelados nos Anexos.
3. Sendo o Cessionário ou a Sociedade demandados por terceiro por facto pelo qual o Cedente seja responsável, dão-lhe conhecimento no prazo de {{PRAZO_NOTIFICACAO: ex. 10}} dias, podendo o Cedente acompanhar a defesa.
4. {{RETENCAO: opcional — Para garantia destas obrigações, o Cessionário retém … euros do preço, a libertar em … / em conta escrow.}}

## Cláusula 6.ª — Suprimentos e créditos do Cedente

{{SUPRIMENTOS: escolher —
(A) O Cedente declara não ser credor da Sociedade a qualquer título.
(B) O Cedente cede ao Cessionário, que aceita, os créditos de suprimentos sobre a Sociedade no montante de … euros, pelo preço de … euros, incluído/não incluído no preço da Cláusula 2.ª, tomando a Sociedade conhecimento da cessão.
(C) A Sociedade reembolsa ao Cedente os suprimentos no montante de … euros até …, sem prejuízo das restrições legais ao reembolso.}}

## Cláusula 7.ª — Gerência

{{GERENCIA: opcional — O Cedente renuncia, com efeitos a partir de {{DATA_EFEITOS_RENUNCIA}}, ao cargo de gerente da Sociedade, declarando a Sociedade aceitar a renúncia nesta data, e obrigando-se esta a promover o respetivo registo. A presente renúncia não implica exoneração de responsabilidade do Cedente enquanto gerente, que depende de deliberação dos sócios.}}

## Cláusula 8.ª — Não concorrência e não aliciamento

{{NAO_CONCORRENCIA: opcional — Durante {{PERIODO_NAO_CONCORRENCIA: ex. 2 anos}} a contar da data de efeitos, o Cedente não exerce, direta ou indiretamente, em {{AMBITO_TERRITORIAL}}, atividade concorrente com {{ATIVIDADE}}, nem alicia clientes ou trabalhadores da Sociedade. [VERIFICAR — limitar duração, território e atividade ao razoável.]}}

## Cláusula 9.ª — Obrigações posteriores à assinatura

1. A Sociedade obriga-se a promover o **registo por depósito** da cessão no prazo de **2 meses** a contar desta data, suportando o Cessionário os respetivos emolumentos, e a entregar-lhe comprovativo.
2. A Sociedade obriga-se a atualizar a declaração do **Registo Central do Beneficiário Efetivo** no prazo de **30 dias**, se a cessão alterar a informação declarada.
3. O Cedente entrega à Sociedade, nesta data, {{DOCUMENTOS_ENTREGA: ex. as chaves, credenciais, livros e documentos da Sociedade que estejam em seu poder}}.
4. Cada parte suporta os impostos de que seja sujeito passivo; o Cedente declara a mais-valia ou menos-valia apurada nos termos da lei fiscal.

## Cláusula 10.ª — Confidencialidade

As partes mantêm confidencial o conteúdo deste contrato e a informação sobre a Sociedade obtida no âmbito da negociação, salvo divulgação imposta por lei, a assessores vinculados a sigilo ou para efeitos de registo.

## Cláusula 11.ª — Lei aplicável e foro

O presente contrato rege-se pela lei portuguesa. Para os litígios dele emergentes é competente {{FORO: o tribunal da comarca de {{COMARCA}} | o tribunal arbitral constituído nos termos da Lei 63/2011, sob a égide do {{CENTRO_ARBITRAGEM}}}}.

Feito em {{NUMERO_EXEMPLARES}} exemplares, ficando um na posse de cada outorgante.

{{LOCAL}}, {{DATA}}

O Cedente: _______________________________

O Cessionário: _______________________________

Pela Sociedade: _______________________________ {{GERENTE_NOME}}, gerente

{{CONSENTIMENTO_CONJUGE: opcional — O cônjuge do Cedente, {{CONJUGE_NOME}}, NIF {{CONJUGE_NIF}}, declara prestar o seu consentimento à presente cessão: _______________________________}}

**Anexo I** — Prestações e suprimentos do Cedente (se existirem).
**Anexo II** — Contas do último exercício e balancete reportado a {{DATA_BALANCETE}}; mapa do passivo.
**Anexo III** — Contingências reveladas (processos, inspeções, dívidas, litígios).
{{ANEXO_DELIBERACAO: opcional — **Anexo IV** — Ata da deliberação de consentimento / renúncias à preferência.}}

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Consentimento: pedir por escrito, com o cessionário e todas as condições (art. 230.º, n.º 1, CSC); se a sociedade não deliberar em 60 dias a contar da receção, a cessão deixa de depender do consentimento (art. 230.º, n.º 4) — calendarizar com a tool `registar_prazo`. Verificar no pacto os direitos de preferência e eventuais restrições (art. 229.º) e no acordo parassocial (lock-up, tag/drag-along).
- [ ] ⏰ Registo por depósito promovido pela sociedade em 2 meses a contar do contrato (CRCom, art. 15.º, n.os 1 e 2; CSC, art. 242.º-B); se a sociedade não o fizer, pedido à conservatória nos termos do art. 29.º-A CRCom. Emolumentos: [VERIFICAR] (Regulamento Emolumentar dos Registos e Notariado — confirmar em justica.gov.pt).
- [ ] ⏰ RCBE: atualizar em 30 dias após a alteração (RJRCBE, art. 14.º); se o cedente renunciar à gerência, registar também a cessação de funções em 2 meses.
- [ ] Forma: documento escrito (art. 228.º, n.º 1, CSC); reconhecimento presencial das assinaturas recomendável; se o cedente for casado em comunhão, ponderar o consentimento do cônjuge [VERIFICAR — natureza comum da quota e arts. 1682.º CC e 8.º CSC].
- [ ] Fiscal: mais-valia do cedente (IRS categoria G ou IRC) — `references/fiscal-pessoal.md` / `references/fiscal.md`; IMT se a sociedade tiver imóveis e o cessionário ficar com 75% ou mais do capital, verificados os requisitos cumulativos do art. 2.º, n.º 2, al. d), CIMT (ativo maioritariamente imobiliário não afeto a atividade agrícola, industrial ou comercial) — (a confirmar) e tool `calc_imt`; Imposto do Selo na cessão de quotas [VERIFICAR — em regra a cessão não consta da TGIS; confirmar a verba 1.1 na hipótese de IMT].
- [ ] Declarações e garantias: anexar as contas, o balancete e o mapa de passivo; pedir certidões de não dívida (AT e Segurança Social), certidão permanente do registo comercial e pesquisa de processos — sobretudo se o cessionário for terceiro.
- [ ] Se a quota não estiver integralmente realizada, o cessionário passa a responder pelas entradas em falta [VERIFICAR — art. 206.º CSC]; refletir no preço ou exigir a realização antes da cessão.
