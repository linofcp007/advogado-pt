<!-- Template: Contrato de desenvolvimento de software por encomenda, com cessão dos direitos patrimoniais de autor
     sobre o código e a documentação / Software Development Agreement (bespoke software, IP assignment). PT/EN.
     Âmbito: misto
     Base legal: CC — arts. 405.º, 428.º, 800.º, 809.º, 810.º, 1154.º e 1207.º e ss. (prestação de serviço / empreitada —
     a qualificação do desenvolvimento de software é discutida [VERIFICAR]); DL 252/94 (programas de computador) — arts.
     1.º, 3.º, 5.º, 9.º e 11.º; CDADC (DL 63/85) — arts. 14.º, 40.º-44.º, 56.º; DL 446/85 (cláusulas contratuais gerais) —
     arts. 1.º, 5.º, 6.º e 18.º; DL 49/2018 (segredos comerciais); RGPD, art. 28.º; Lei 63/2011 (arbitragem voluntária);
     Reg. (CE) 593/2008 (Roma I) e Reg. (UE) 1215/2012 (Bruxelas I bis) em contratos internacionais.
     Uso:
     - TITULARIDADE POR DEFEITO: no programa criado por encomenda, os direitos pertencem ao destinatário (o Cliente),
       salvo estipulação em contrário ou se outra coisa resultar das finalidades do contrato (DL 252/94, art. 3.º, n.º 3).
       Para as outras obras (manuais, design gráfico, textos), a titularidade da obra por encomenda segue o convencionado
       e, na falta de convenção, presume-se do criador (CDADC, art. 14.º, n.os 1 e 2). A cláusula 5 torna tudo expresso e
       a cláusula 6 protege o background IP do Fornecedor.
     - FORMA DA CESSÃO: os negócios sobre programas de computador regem-se pelas regras gerais dos contratos, aplicando-se
       do CDADC só os arts. 40.º, 45.º a 51.º e 55.º (DL 252/94, art. 11.º) — a forma solene do art. 44.º CDADC não será,
       em princípio, exigida para o código [VERIFICAR — doutrina]. Para obras que não sejam programa nem material de
       conceção preliminar (DL 252/94, art. 1.º, n.º 3), vale o CDADC: transmissão total e definitiva por escritura pública,
       com identificação da obra e do preço (art. 44.º); transmissão parcial por documento escrito com reconhecimento
       notarial das assinaturas (art. 43.º, n.º 2) — ambas sob pena de nulidade. Por prudência: assinaturas reconhecidas,
       Anexo III a identificar as obras e preço da cessão individualizado (cl. 5.4).
     - DIREITOS MORAIS (paternidade, integridade) são inalienáveis e irrenunciáveis (CDADC, art. 56.º; DL 252/94, art. 9.º):
       o contrato só regula o seu exercício (cl. 5.5).
     - LIMITAÇÃO DE RESPONSABILIDADE: não pode cobrir dolo ou culpa grave (CC, arts. 800.º, n.º 2, e 809.º; DL 446/85,
       art. 18.º, al. c), se as cláusulas forem pré-formuladas e não negociadas).
     - Dados pessoais: anexar o DPA (`assets/templates/dpa-bilingue.md`); confidencialidade autónoma antes do contrato:
       `assets/templates/nda-bilingue.md`. Serviços contínuos sem desenvolvimento: `assets/templates/contrato-prestacao-servicos-ti.md`.
     - Template B2B. Se o Cliente for consumidor, aplicam-se regras imperativas sobre conteúdos e serviços digitais
       (DL 84/2021) [VERIFICAR]. -->

# CONTRATO DE DESENVOLVIMENTO DE SOFTWARE / SOFTWARE DEVELOPMENT AGREEMENT

**Entre / Between:**

**Fornecedor / Developer:** {{FORNECEDOR_NOME}}, {{FORNECEDOR_NIF_OU_REG}}, com sede em {{FORNECEDOR_MORADA}}, representada por {{FORNECEDOR_REPRESENTANTE}}, na qualidade de {{FORNECEDOR_QUALIDADE}} ("Fornecedor" / "Developer");

**Cliente / Client:** {{CLIENTE_NOME}}, {{CLIENTE_NIF_OU_REG}}, com sede em {{CLIENTE_MORADA}}, representada por {{CLIENTE_REPRESENTANTE}}, na qualidade de {{CLIENTE_QUALIDADE}} ("Cliente" / "Client").

## 1. Objeto / Purpose

1.1 O Fornecedor obriga-se a conceber, desenvolver e entregar ao Cliente o software {{NOME_SOFTWARE}} (o "Software"), incluindo código-fonte, código-objeto e documentação, de acordo com as especificações funcionais e técnicas do **Anexo I** (as "Especificações").
*The Developer shall design, develop and deliver to the Client the software {{SOFTWARE_NAME}} (the "Software"), including source code, object code and documentation, in accordance with the functional and technical specifications set out in **Schedule I** (the "Specifications").*

1.2 As Especificações só podem ser alteradas pelo procedimento da cláusula 3.5.
*The Specifications may only be changed through the change request procedure in clause 3.5.*

## 2. Definições / Definitions

- **Entregáveis / Deliverables:** o Software, cada versão ou incremento, o código-fonte, a documentação técnica e de utilizador e os demais materiais criados especificamente para o Cliente ao abrigo deste contrato. *The Software, each release or increment, the source code, technical and user documentation and any other materials created specifically for the Client under this agreement.*
- **Background IP:** ferramentas, bibliotecas, frameworks, componentes e know-how do Fornecedor existentes antes deste contrato ou desenvolvidos independentemente dele, identificados no **Anexo IV**. *The Developer's tools, libraries, frameworks, components and know-how existing before this agreement or developed independently of it, listed in **Schedule IV**.*
- **Componentes de terceiros / Third-party components:** software de terceiros, incluindo software livre ou de código aberto, listado no Anexo IV. *Third-party software, including free and open-source software, listed in Schedule IV.*
- **Defeito / Defect:** desconformidade reproduzível do Software com as Especificações. *A reproducible non-conformity of the Software with the Specifications.*

## 3. Metodologia, entregas e aceitação / Methodology, delivery and acceptance

3.1 O desenvolvimento segue {{METODOLOGIA: ex. metodologia ágil, em sprints de … semanas, com backlog priorizado pelo Cliente | modelo em fases fechadas}}. Marcos (*milestones*), prazos e testes de aceitação constam do **Anexo II**.
*Development follows {{METHODOLOGY}}. Milestones, deadlines and acceptance tests are set out in **Schedule II**.*

3.2 O Cliente fornece atempadamente os acessos, dados, decisões e validações necessários; os prazos do Fornecedor são prorrogados na medida dos atrasos imputáveis ao Cliente.
*The Client shall provide in good time the access, data, decisions and approvals required; the Developer's deadlines are extended to the extent of any delay attributable to the Client.*

3.3 Entregue cada marco, o Cliente executa os testes de aceitação no prazo de {{DIAS_TESTES}} dias e comunica por escrito os Defeitos encontrados, classificados por gravidade (bloqueante, grave, menor).
*Upon delivery of each milestone, the Client shall run the acceptance tests within {{TEST_DAYS}} days and notify any Defects in writing, classified by severity (blocking, major, minor).*

3.4 O marco considera-se aceite: (a) com a declaração escrita de aceitação; (b) se, findo o prazo de testes, o Cliente não tiver comunicado Defeitos bloqueantes; ou (c) com a utilização do Software em produção para fins comerciais. Defeitos não bloqueantes não impedem a aceitação e são corrigidos nos termos da cláusula 9.
*A milestone is deemed accepted: (a) upon written acceptance; (b) if no blocking Defect is notified by the end of the testing period; or (c) upon use of the Software in production for commercial purposes. Non-blocking Defects do not prevent acceptance and shall be fixed under clause 9.*

3.5 Qualquer alteração ao âmbito (*change request*) é pedida por escrito, orçamentada pelo Fornecedor (preço e impacto no prazo) e só vincula as Partes depois de aceite por escrito por ambas.
*Any change to the scope shall be requested in writing, quoted by the Developer (price and schedule impact) and shall only bind the Parties once accepted in writing by both.*

## 4. Preço e faturação / Price and invoicing

4.1 Preço: {{PRECO: preço fixo de … euros | tempo e materiais à taxa de … euros por hora/dia, com o limite máximo de … euros}}, acrescido de IVA à taxa legal, quando devido.
*Price: {{PRICE}}, plus VAT where applicable.*

4.2 Faturação: {{CALENDARIO_FATURACAO: ex. …% na assinatura, …% na aceitação do marco …, …% na aceitação final}}; pagamento no prazo de {{DIAS_PAGAMENTO}} dias a contar da data da fatura.
*Invoicing: {{INVOICING_SCHEDULE}}; payment within {{PAYMENT_DAYS}} days of the invoice date.*

4.3 Em caso de mora, vencem juros à taxa legal aplicável às transações comerciais, sem prejuízo da indemnização pelos custos de cobrança prevista na lei. Decorridos {{DIAS_SUSPENSAO}} dias de mora após interpelação escrita, o Fornecedor pode suspender os trabalhos até ao pagamento, prorrogando-se os prazos em conformidade.
*Late payment bears interest at the statutory rate for commercial transactions, without prejudice to the statutory compensation for recovery costs. If payment remains overdue {{SUSPENSION_DAYS}} days after written notice, the Developer may suspend the work until payment, with deadlines extended accordingly.*

## 5. Titularidade e cessão de direitos / Ownership and assignment of rights

5.1 Com o pagamento integral do preço {{MOMENTO_CESSAO: opcional — ou: de cada marco, quanto aos Entregáveis desse marco}}, o Fornecedor cede ao Cliente, em exclusivo e a título definitivo, sem limitação territorial e por todo o prazo de proteção legal, todos os direitos patrimoniais de autor sobre os Entregáveis, incluindo os direitos de reprodução, transformação, adaptação, tradução, distribuição, comunicação e colocação à disposição do público, exploração comercial, licenciamento e sublicenciamento, por qualquer forma ou meio, atual ou futuro.
*Upon full payment of the price {{ASSIGNMENT_TIMING}}, the Developer assigns to the Client, exclusively and definitively, worldwide and for the full term of legal protection, all economic copyright in the Deliverables, including the rights of reproduction, modification, adaptation, translation, distribution, communication and making available to the public, commercial exploitation, licensing and sublicensing, by any present or future means.*

5.2 As obras cedidas são as identificadas no **Anexo III** (repositório, versão ou *commit*, módulos e documentação), atualizado em cada aceitação.
*The assigned works are identified in **Schedule III** (repository, version or commit, modules and documentation), updated upon each acceptance.*

5.3 As Partes declaram que o Software é criado por encomenda do Cliente, que é o seu destinatário; a presente cláusula confirma e, na medida do necessário, opera a transmissão dos direitos.
*The Parties declare that the Software is commissioned by the Client, as its intended recipient; this clause confirms and, to the extent necessary, effects the transfer of the rights.*

5.4 A contrapartida da cessão está incluída no preço da cláusula 4, correspondendo-lhe o montante de {{VALOR_CESSAO}} euros.
*The consideration for the assignment is included in the price under clause 4, of which {{ASSIGNMENT_VALUE}} euros corresponds to the assignment.*

5.5 Os direitos morais dos criadores intelectuais mantêm-se nos termos da lei; o Fornecedor obtém dos seus colaboradores o compromisso de, na medida em que a lei o permita, não os exercer de forma a impedir a correção, modificação, evolução ou integração do Software pelo Cliente.
*The authors' moral rights remain as provided by law; the Developer shall obtain from its personnel an undertaking, to the extent permitted by law, not to exercise them so as to prevent the Client from correcting, modifying, evolving or integrating the Software.*

5.6 O Fornecedor garante que é titular, ou que dispõe dos direitos necessários, sobre os contributos dos seus trabalhadores, subcontratados e prestadores independentes, obtendo destes, por escrito, a cessão ou a autorização adequada antes de os incorporar nos Entregáveis.
*The Developer warrants that it owns, or holds the necessary rights in, the contributions of its employees, subcontractors and freelancers, and shall obtain from them a written assignment or adequate licence before incorporating them into the Deliverables.*

5.7 Até ao pagamento integral, o Cliente dispõe de uma licença não exclusiva para testar e avaliar os Entregáveis.
*Until full payment, the Client holds a non-exclusive licence to test and evaluate the Deliverables.*

{{OPCAO_LICENCA: opcional, em alternativa às cláusulas 5.1 a 5.4 — 5.1 O Fornecedor mantém a titularidade dos Entregáveis e concede ao Cliente uma licença {{exclusiva | não exclusiva}}, perpétua, irrevogável, {{mundial}}, para usar, reproduzir, modificar e {{sublicenciar}} o Software, com entrega do código-fonte nos termos da cláusula 8. / *The Developer retains ownership of the Deliverables and grants the Client a {{exclusive | non-exclusive}}, perpetual, irrevocable, {{worldwide}} licence to use, reproduce, modify and {{sublicense}} the Software, with delivery of the source code under clause 8.*}}

## 6. Background IP — licença / Background IP licence

6.1 O Fornecedor mantém a titularidade do Background IP. Na medida em que este esteja incorporado nos Entregáveis ou seja necessário para os utilizar, o Fornecedor concede ao Cliente uma licença não exclusiva, perpétua, irrevogável, mundial, incluída no preço e transmissível com o Software, para o usar, reproduzir, modificar e manter enquanto parte do Software {{SUBLICENCA: opcional — e para o sublicenciar a prestadores do Cliente para os mesmos fins}}.
*The Developer retains ownership of the Background IP. To the extent it is embedded in the Deliverables or required to use them, the Developer grants the Client a non-exclusive, perpetual, irrevocable, worldwide licence, included in the price and transferable with the Software, to use, reproduce, modify and maintain it as part of the Software {{SUBLICENCE}}.*

6.2 O Fornecedor pode reutilizar o know-how geral, técnicas e ferramentas genéricas, desde que não use Informação Confidencial do Cliente nem reproduza partes específicas dos Entregáveis.
*The Developer may reuse general know-how, techniques and generic tools, provided it does not use the Client's Confidential Information nor reproduce specific parts of the Deliverables.*

## 7. Software livre e componentes de terceiros / Open source and third-party components

7.1 O Fornecedor só incorpora componentes de terceiros listados no Anexo IV (nome, versão, licença e finalidade) ou previamente aprovados por escrito pelo Cliente.
*The Developer shall only incorporate third-party components listed in Schedule IV (name, version, licence and purpose) or approved in writing in advance by the Client.*

7.2 Sem aprovação escrita do Cliente, o Fornecedor não incorpora componentes sob licenças que obriguem a divulgar ou a licenciar o código do Cliente (*copyleft* forte, ex.: GPL, AGPL) {{LICENCAS_PERMITIDAS: opcional — licenças pré-aprovadas: MIT, BSD, Apache-2.0}}.
*Without the Client's written approval, the Developer shall not incorporate components under licences requiring disclosure or licensing of the Client's code (strong copyleft, e.g. GPL, AGPL) {{ALLOWED_LICENCES}}.*

7.3 Com cada versão, o Fornecedor entrega a lista atualizada dos componentes (*software bill of materials* — SBOM) e cumpre as obrigações de atribuição e aviso das respetivas licenças. Os componentes de terceiros regem-se pelas suas licenças e não são objeto da cessão da cláusula 5.
*With each release, the Developer shall deliver an updated software bill of materials (SBOM) and comply with the attribution and notice obligations of the relevant licences. Third-party components are governed by their own licences and are not assigned under clause 5.*

## 8. Código-fonte e depósito / Source code and escrow

8.1 O Fornecedor entrega o código-fonte completo, comentado e compilável, os scripts de *build* e de instalação e as instruções necessárias, em {{REPOSITORIO: ex. repositório Git do Cliente}}, em cada marco e na aceitação final.
*The Developer shall deliver the complete, commented and buildable source code, build and deployment scripts and the necessary instructions to {{REPOSITORY}} at each milestone and upon final acceptance.*

8.2 {{ESCROW: opcional — sobretudo se o Fornecedor mantiver a titularidade ou o Background IP for crítico: O código-fonte é depositado junto de {{AGENTE_ESCROW}} e atualizado em cada versão, sendo entregue ao Cliente em caso de insolvência ou cessação de atividade do Fornecedor ou de incumprimento grave das obrigações de manutenção, nos termos do acordo de depósito anexo. / *The source code shall be deposited with {{ESCROW_AGENT}}, updated with each release, and released to the Client upon the Developer's insolvency, cessation of business or material breach of its maintenance obligations, under the attached escrow agreement.*}}

## 9. Garantia e correção de Defeitos / Warranty and defect correction

9.1 Durante {{PRAZO_GARANTIA: ex. 6 meses}} a contar da aceitação final, o Fornecedor garante que o Software funciona em conformidade substancial com as Especificações e corrige gratuitamente os Defeitos que lhe sejam comunicados por escrito no prazo de {{DIAS_DENUNCIA}} dias após a sua descoberta, nos tempos de resposta do **Anexo V**.
*For {{WARRANTY_PERIOD}} from final acceptance, the Developer warrants that the Software substantially conforms to the Specifications and shall fix free of charge any Defect notified in writing within {{NOTICE_DAYS}} days of its discovery, within the response times in **Schedule V**.*

9.2 A garantia não abrange Defeitos causados por alterações não autorizadas, utilização contrária à documentação, ambientes não suportados ou componentes de terceiros fora do controlo do Fornecedor.
*The warranty does not cover Defects caused by unauthorised changes, use contrary to the documentation, unsupported environments or third-party components outside the Developer's control.*

9.3 O Fornecedor garante que os Entregáveis não violam direitos de terceiros e não contêm código malicioso conhecido. Perante reclamação de terceiro, o Fornecedor defende o Cliente e indemniza-o, podendo, à sua escolha, modificar, substituir ou licenciar o elemento em causa.
*The Developer warrants that the Deliverables do not infringe third-party rights and contain no known malicious code. If a third party brings a claim, the Developer shall defend and indemnify the Client and may, at its option, modify, replace or license the affected element.*

## 10. Manutenção e níveis de serviço (opcional) / Maintenance and SLA (optional)

{{MANUTENCAO: opcional — Findo o período de garantia, o Fornecedor presta manutenção corretiva, adaptativa e evolutiva nos termos do Anexo V (janelas de suporte, tempos de resposta e de resolução por gravidade, créditos de serviço), mediante o pagamento de … euros por mês, por períodos de 12 meses, renováveis salvo denúncia escrita com … dias de antecedência. / *After the warranty period, the Developer shall provide corrective, adaptive and evolutive maintenance under Schedule V (support hours, response and resolution times per severity, service credits), for … euros per month, for renewable 12-month periods unless terminated in writing with … days' notice.*}}

## 11. Confidencialidade / Confidentiality

11.1 Cada Parte mantém confidencial a informação técnica, comercial e financeira da outra a que tenha acesso, usando-a apenas para a execução do contrato, durante a sua vigência e por {{ANOS_CONFIDENCIALIDADE}} anos após o seu termo; os segredos comerciais permanecem protegidos enquanto mantiverem essa natureza. {{NDA: opcional — Aplica-se ainda o acordo de confidencialidade celebrado em {{DATA_NDA}}.}}
*Each Party shall keep confidential the other's technical, commercial and financial information to which it has access, using it solely to perform this agreement, during its term and for {{CONFIDENTIALITY_YEARS}} years thereafter; trade secrets remain protected for as long as they retain that nature.*

## 12. Proteção de dados / Data protection

12.1 Se o Fornecedor tratar dados pessoais por conta do Cliente, as Partes celebram o acordo de tratamento de dados do **Anexo VI**, nos termos do art. 28.º do RGPD. O Fornecedor não usa dados pessoais reais em ambientes de desenvolvimento ou de teste sem autorização escrita do Cliente.
*If the Developer processes personal data on the Client's behalf, the Parties shall enter into the data processing agreement in **Schedule VI** under Article 28 GDPR. The Developer shall not use real personal data in development or test environments without the Client's written authorisation.*

## 13. Limitação de responsabilidade / Limitation of liability

13.1 A responsabilidade total de cada Parte emergente deste contrato fica limitada a {{LIMITE: ex. 100% do preço total | o valor pago nos 12 meses anteriores ao facto}}, excluindo-se lucros cessantes e danos indiretos.
*Each Party's total liability under this agreement is capped at {{CAP}}, excluding loss of profits and indirect damages.*

13.2 As limitações da cláusula 13.1 não se aplicam em caso de dolo ou culpa grave, danos à vida ou à integridade física, violação da confidencialidade ou das obrigações de proteção de dados, nem às obrigações de indemnização da cláusula 9.3.
*The limitations in clause 13.1 do not apply to wilful misconduct or gross negligence, personal injury, breach of confidentiality or data protection obligations, nor to the indemnity under clause 9.3.*

## 14. Duração e cessação / Term and termination

14.1 O contrato vigora até ao termo do período de garantia {{OU: e, havendo manutenção, enquanto esta vigorar}}.
*This agreement remains in force until the end of the warranty period {{OR_MAINTENANCE}}.*

14.2 Qualquer Parte pode resolver o contrato por incumprimento grave não sanado no prazo de {{DIAS_SANACAO}} dias após interpelação escrita.
*Either Party may terminate this agreement for material breach not remedied within {{CURE_DAYS}} days of written notice.*

14.3 O Cliente pode desistir a todo o tempo, mediante pré-aviso escrito de {{DIAS_PRE_AVISO}} dias, pagando o trabalho realizado, as despesas incorridas e {{COMPENSACAO: ex. …% do valor dos marcos ainda não faturados}}.
*The Client may terminate for convenience at any time on {{NOTICE_DAYS}} days' written notice, paying for work performed, expenses incurred and {{COMPENSATION}}.*

14.4 Cessando o contrato, o Fornecedor entrega ao Cliente o código-fonte e os trabalhos em curso pagos, operando-se quanto a estes a cessão da cláusula 5.
*Upon termination, the Developer shall deliver the source code and paid work in progress to the Client, to which the assignment in clause 5 shall apply.*

## 15. Lei aplicável e litígios / Governing law and disputes

15.1 O presente contrato rege-se pela **lei portuguesa**.
*This agreement is governed by **Portuguese law**.*

15.2 As Partes procuram resolver qualquer litígio por negociação durante {{DIAS_NEGOCIACAO}} dias. Na falta de acordo, o litígio é submetido {{FORO: aos tribunais portugueses competentes | a arbitragem no {{CENTRO_ARBITRAGEM}}, nos termos do seu regulamento, por árbitro único, com sede em {{SEDE_ARBITRAGEM}}, em língua {{LINGUA}}}}.
*The Parties shall seek to settle any dispute through negotiation for {{NEGOTIATION_DAYS}} days. Failing agreement, the dispute shall be submitted to {{JURISDICTION_OR_ARBITRATION}}.*

## 16. Disposições finais / Final provisions

16.1 O contrato e os seus anexos constituem o acordo integral das Partes e só podem ser alterados por escrito assinado por ambas. Nenhuma Parte cede a sua posição contratual sem consentimento escrito da outra.
*This agreement and its schedules constitute the entire agreement between the Parties and may only be amended in writing signed by both. Neither Party may assign its contractual position without the other's written consent.*

16.2 Em caso de divergência entre as versões, prevalece a versão {{LINGUA_PREVALENTE: portuguesa | inglesa}}.
*In case of discrepancy between the language versions, the {{PREVAILING_LANGUAGE}} version prevails.*

16.3 Anexos / Schedules: I — Especificações / Specifications; II — Plano, marcos e testes de aceitação / Plan, milestones and acceptance tests; III — Identificação das obras cedidas / Assigned works; IV — Background IP e componentes de terceiros (SBOM) / Background IP and third-party components (SBOM); V — Garantia e níveis de serviço / Warranty and SLA; VI — Acordo de tratamento de dados / Data processing agreement.

{{LOCAL}}, {{DATA}}

O Fornecedor / The Developer: __________________   O Cliente / The Client: __________________

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] Forma e assinatura: representantes com poderes (certidão permanente/procuração); reconhecimento presencial das assinaturas recomendado para a cessão; se a cessão abranger, em transmissão total e definitiva, obras que não sejam programa (manuais, design, textos), o art. 44.º CDADC exige escritura pública [VERIFICAR se o documento particular autenticado é admitido como equivalente] — alternativa: licença exclusiva por escrito. Contraparte estrangeira: assinatura eletrónica qualificada (Reg. (UE) 910/2014).
- [ ] Anexos completos, sobretudo o III (identificação das obras + preço da cessão, cl. 5.4) e o IV (Background IP e licenças de software livre) — sem eles a cessão fica frágil.
- [ ] ⏰ Prazos do contrato: testes de aceitação (cl. 3.3), denúncia de Defeitos (cl. 9.1) e garantia. Se o contrato for qualificado como empreitada, valem supletivamente a denúncia em 30 dias após a descoberta (CC, art. 1220.º) e a caducidade de 1 ano, nunca depois de 2 anos sobre a entrega (art. 1224.º) — qualificação [VERIFICAR]; o dono da obra pode desistir indemnizando (art. 1229.º), o que a cl. 14.3 concretiza.
- [ ] Juros de mora comerciais e indemnização pelos custos de cobrança entre empresas (DL 62/2013): taxa do semestre em `references/valores-2026.md`.
- [ ] Cláusulas pré-formuladas e não negociadas (contrato de adesão): DL 446/85 — comunicar e explicar as cláusulas (arts. 5.º e 6.º) e não limitar a responsabilidade por dolo ou culpa grave (art. 18.º, al. c)).
- [ ] Foro: os litígios sobre contratos de transmissão ou licença de direitos de autor cabem ao Tribunal da Propriedade Intelectual (Lei 62/2013, art. 111.º, n.º 1, al. c)); para clientes estrangeiros, preferir arbitragem (Lei 63/2011) e confirmar Roma I/Bruxelas I bis — `references/contratos-internacionais.md`.
- [ ] Fiscal: IVA (autoliquidação em B2B intra-UE, prestação a clientes fora da UE) e eventual retenção na fonte no país do Cliente/convenção para evitar a dupla tributação — `references/fiscal.md` [VERIFICAR].
- [ ] RGPD: Anexo VI preenchido sempre que haja tratamento por conta do Cliente — `assets/templates/dpa-bilingue.md`.
- [ ] Regulação de produto: se o Software for colocado no mercado da UE como produto com elementos digitais (CRA) ou incluir sistemas de IA (AI Act), repartir as obrigações no contrato — `references/digital-ue.md`.
