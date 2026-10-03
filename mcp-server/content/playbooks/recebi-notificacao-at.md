# Playbook: Recebi uma notificação das Finanças (AT)

> Quando usar: chegou uma carta da Autoridade Tributária e Aduaneira (AT), uma mensagem na caixa postal eletrónica (ViaCTT) ou um aviso na área reservada do Portal das Finanças — dirigida à empresa (ENI, Unipessoal Lda, Lda, SA, de qualquer setor) ou a ti, como particular ou como gerente/administrador. Serve para identificar o tipo de notificação, o prazo que está a correr e a reação certa. Âmbito: nacional. Fundo teórico dos meios de defesa: `references/contencioso-tributario.md`.

## Passo 0 — Não percas prazos

- ⏰ **Primeiro, fixa a data em que a notificação se considera feita** (art. 39.º CPPT) — é daí que contam os prazos:
  - **Carta registada** (sem aviso de receção): presume-se feita no **3.º dia posterior ao registo** (ou no 1.º dia útil seguinte, se esse não for útil) — art. 39.º, n.º 1.
  - **Carta registada com aviso de receção**: na **data da assinatura** do aviso, mesmo que assinado por outra pessoa no domicílio — art. 39.º, n.º 3. Recusar ou não levantar a carta não trava o prazo (art. 39.º, n.os 5 e 6).
  - **Domicílio fiscal eletrónico** (caixa postal eletrónica / ViaCTT, ou serviço público de notificações eletrónicas da morada única digital): considera-se feita no **15.º dia posterior à disponibilização**, começando a contagem no 1.º dia útil seguinte — art. 39.º, n.º 10. Por prudência, se a abrires antes, conta também a partir da abertura e usa a data-limite mais cedo (a confirmar caso a caso).
  - Sociedades (IRC) e sujeitos passivos de IVA no regime normal são **obrigados** a ter caixa postal eletrónica (art. 19.º, n.º 12, LGT): os prazos correm **mesmo que ninguém a abra**. Confirma no perfil `.advogado-pt/perfil-empresa.md` quem a consulta e com que frequência.
- ⏰ **Como se contam:**
  - Procedimento tributário e impugnação judicial: **dias seguidos** (art. 279.º CC); se o último dia calhar em dia em que os serviços ou tribunais estejam encerrados, passa para o **1.º dia útil seguinte** (art. 20.º, n.º 1, CPPT; art. 57.º, n.º 3, LGT). Prazos em **meses** terminam no dia correspondente do último mês (art. 279.º, al. c), CC).
  - Atos dentro de processo judicial (ex.: oposição à execução, reclamação de atos do órgão de execução fiscal): regras do Código de Processo Civil (art. 20.º, n.º 2, CPPT) — a suspensão em férias judiciais deve ser confirmada caso a caso com advogado (a confirmar). Contraordenações fiscais: RGIT, com o regime geral das contraordenações como direito subsidiário (art. 3.º, al. b), RGIT) — regra de contagem a confirmar.
  - **Na dúvida, conta em dias seguidos e sem suspensões** — dá-te sempre a data mais cedo.
  - Conta com a calculadora: `tipo=corridos` para o procedimento tributário (já passa o termo para o dia útil seguinte e mostra o termo legal); `tipo=judicial` só para atos dentro de processo judicial, se confirmares que se suspendem nas férias judiciais. Os prazos em **meses** (ex.: impugnação judicial, 3 meses) contam-se à mão, até ao dia correspondente do último mês:
    ```
    calc_prazo  inicio=<AAAA-MM-DD da notificação>  dias=120  tipo=corridos
    python scripts/prazos.py --inicio <AAAA-MM-DD> --dias 30 --tipo corridos
    ```
- ⏰ **Mapa de prazos principais** (confirma sempre o prazo indicado na própria notificação, que tem de o mencionar — art. 36.º, n.º 2, CPPT):

  | Reação | Prazo | Conta a partir de | Base |
  |---|---|---|---|
  | Audição prévia (projeto de decisão) | o fixado: regra 15 dias (até 25) | notificação do projeto | art. 60.º, n.º 6, LGT |
  | Audição sobre projeto de relatório de inspeção | 15 a 25 dias (30 com cláusula antiabuso) | notificação do projeto | art. 60.º, n.º 2, RCPITA |
  | Revisão da matéria tributável (métodos indiretos) | 30 dias | notificação da decisão | art. 91.º, n.º 1, LGT |
  | Reclamação graciosa | 120 dias | termo do pagamento voluntário / notificação | art. 70.º, n.º 1, CPPT |
  | Reclamação de autoliquidação (necessária) | 2 anos | entrega da declaração | art. 131.º, n.º 1, CPPT |
  | Recurso hierárquico | 30 dias | notificação da decisão | arts. 66.º, n.º 2, e 76.º, n.º 1, CPPT |
  | Impugnação judicial | 3 meses | factos do art. 102.º, n.º 1 | art. 102.º CPPT |
  | Arbitragem tributária (CAAD) | 90 dias | factos do art. 102.º, n.º 1 | art. 10.º, n.º 1, al. a), RJAT |
  | Oposição à execução fiscal | 30 dias | citação (ou 1.ª penhora) | art. 203.º CPPT |
  | Garantia ou pedido de dispensa (para suspender a execução) | 15 dias | apresentação do meio de reação | arts. 169.º, n.º 8, e 170.º, n.º 1, CPPT |
  | Pagamento em prestações (execução) | até à marcação da venda | — | art. 196.º, n.º 1, CPPT |
  | Reclamação de ato do órgão de execução (ex.: penhora) | 10 dias | notificação do ato | art. 277.º, n.º 1, CPPT |
  | Embargos de terceiro | 30 dias | ato ofensivo ou seu conhecimento | art. 237.º, n.º 3, CPPT |
  | Defesa / pagamento antecipado de coima (RGIT) | 30 dias | notificação | arts. 70.º e 75.º RGIT |
  | Recurso judicial da decisão de coima | 30 dias | notificação da decisão | art. 80.º RGIT |

## Fluxo de decisão

1. **Lê a notificação e identifica o tipo** (assunto, entidade, quadro "meios de defesa e prazo"). A notificação **tem de** indicar a decisão, os fundamentos, os meios de defesa e o prazo (art. 36.º, n.º 2, CPPT). Falta algum destes elementos? → podes pedir, em 30 dias (ou no prazo do meio de reação, se for menor), a notificação dos requisitos omitidos ou certidão; o prazo de reação só conta a partir daí (art. 37.º, n.os 1 e 2, CPPT). Depois, segue o ramo:
   - **A)** Pedido de esclarecimentos, divergências, notificação para entregar declaração ou documentos → passo 2.
   - **B)** Projeto de decisão para **audição prévia** (projeto de liquidação, de indeferimento, de reversão) ou **projeto de relatório de inspeção** → passo 3.
   - **C)** **Liquidação** (adicional), nota de cobrança ou demonstração de liquidação com valor a pagar → passo 4.
   - **D)** **Citação** em processo de execução fiscal (PEF) → passo 5.
   - **E)** Notificação de **penhora** (conta bancária, créditos de clientes, salário, imóvel, veículo) → passo 6.
   - **F)** Notificação de **processo de contraordenação / coima** → passo 7.
   - **G)** Projeto de reversão ou **citação como responsável subsidiário** (gerente/administrador) → passo 8.

2. **Esclarecimentos / divergências (A)** — **O erro é teu** (declaração mal preenchida, fatura não comunicada, retenção não declarada)? → se SIM: corrige já com o contabilista certificado (declaração de substituição). Regularizar **antes** de auto de notícia ou inspeção permite pedir coima reduzida (art. 30.º, n.º 1, al. a), RGIT) ou até a dispensa de coima se não houver prejuízo para a receita (art. 29.º RGIT) · se NÃO: responde **no prazo indicado**, por escrito e com documentos (e-balcão ou área de divergências do Portal das Finanças). Há dever de colaboração (art. 59.º LGT): o silêncio costuma acabar em liquidação oficiosa ou coima.

3. **Audição prévia / projeto de relatório de inspeção (B)** — o projeto **ainda não é a decisão**: é a melhor oportunidade para evitar a liquidação.
   - Responde **ponto por ponto**, com toda a prova, por escrito (ou pede audição oral): `assets/templates/direito-audicao-previa.md`. ⏰ Regra 15 dias, alargáveis pela AT até 25 (art. 60.º, n.º 6, LGT); inspeção 15 a 25 dias (art. 60.º, n.º 2, RCPITA). A AT tem de considerar os elementos novos (art. 60.º, n.º 7, LGT).
   - **Concordas com algumas correções?** Podes pedir a **regularização** no prazo da audição (art. 58.º RCPITA), com coima reduzida (art. 30.º, n.º 1, al. b), RGIT) — mas aceitar o documento de regularização impede discutir depois essas correções (art. 58.º-A, n.º 8, RCPITA). Decide com o contabilista certificado.
   - **Métodos indiretos?** O meio próprio contra a matéria tributável fixada é o **pedido de revisão** em 30 dias (art. 91.º, n.º 1, LGT), com efeito suspensivo da liquidação (n.º 2) → advogado/contabilista certificado.
   - Não respondeste ou a AT manteve o projeto → vem a decisão/liquidação → passo 4.

4. **Liquidação / nota de cobrança (C)** — confirma período, valores, data-limite de pagamento, fundamentação (art. 77.º LGT), **caducidade** (regra: 4 anos — art. 45.º LGT) e se houve audição quando era devida (art. 60.º LGT).
   - **Está certa?** → paga até à data-limite (evitas juros de mora e execução). Não consegues pagar de uma vez? Para IRS, IRC, IUC e certas liquidações oficiosas de IVA e IMT há **prestações antes da execução**, pedidas no Portal das Finanças até cerca de 15 dias após a data-limite de pagamento (regime do DL 125/2021 — prazo, mínimos e dispensa de garantia a confirmar no Portal e em `references/valores-2026.md`). Depois de instaurada a execução → passo 5.
   - **Está errada?** → escolhe a via (comparação de custos, prova e tempo em `references/contencioso-tributario.md`):
     - **Reclamação graciosa** — ⏰ 120 dias, gratuita, prova documental, decisão em 4 meses (sem decisão presume-se o indeferimento — art. 57.º, n.os 1 e 5, LGT): `assets/templates/reclamacao-graciosa.md`. Do indeferimento: recurso hierárquico (30 dias) ou impugnação judicial (3 meses).
     - **Impugnação judicial** — ⏰ 3 meses, tribunal tributário, todos os meios de prova; constituição de advogado obrigatória (art. 6.º, n.º 1, CPPT, que remete para a lei processual administrativa — exceções a confirmar).
     - **Arbitragem tributária (CAAD)** — ⏰ 90 dias, em regra mais rápida, com taxa de arbitragem; só para os atos e valores a que a AT se vinculou (Portaria 112-A/2011 — exceções e limite de valor a confirmar; limiares em (ver `references/valores-2026.md`)).
     - **Erro teu na autoliquidação** → reclamação graciosa necessária em ⏰ 2 anos (art. 131.º CPPT).
     - **Prazos já perdidos?** → pedido de **revisão do ato** (art. 78.º LGT): no prazo da reclamação administrativa com qualquer ilegalidade, ou até 4 anos com erro imputável aos serviços.
   - **Pagar e reclamar ao mesmo tempo** é possível: evitas a execução e, se ganhares, recebes o imposto com **juros indemnizatórios** (arts. 43.º e 100.º LGT).
   - **Não pagar e reclamar**: a reclamação **não suspende** a cobrança; terminado o prazo de pagamento, segue-se a execução → presta **garantia** ou pede **dispensa** em ⏰ 15 dias após apresentares o meio de reação (arts. 169.º, n.º 8, e 170.º, n.º 1, CPPT; art. 52.º, n.º 4, LGT). Para dívidas de pequeno valor há suspensão automática temporária (art. 169.º, n.º 3, CPPT — limiares em ver `references/valores-2026.md`).

5. **Citação em execução fiscal (D)** — a dívida não foi paga no prazo voluntário e a AT abriu um PEF. Tens ⏰ **30 dias** a contar da citação para escolher (podes combinar):
   - **Pagar** a quantia da citação, com juros de mora e custas.
   - **Pagar em prestações** — até à marcação da venda (art. 196.º, n.º 1, CPPT): até 36 prestações; mais em casos excecionais (art. 196.º, n.os 5 a 7). Confirma primeiro se a AT já criou um **plano oficioso** para dívidas de pequeno valor (art. 198.º-A). Requerimento: `assets/templates/pedido-pagamento-prestacoes-at.md`.
   - **Dação em pagamento** — até ao fim do prazo de oposição (art. 189.º, n.º 3, CPPT).
   - **Oposição à execução** — ⏰ 30 dias (art. 203.º CPPT), só com os fundamentos do art. 204.º (ex.: prescrição — regra de 8 anos, art. 48.º LGT; falta de notificação da liquidação no prazo de caducidade; pagamento; duplicação de coleta; ilegitimidade). Não serve para discutir a legalidade da liquidação quando havia reclamação/impugnação disponível (art. 204.º, n.º 1, al. h)). Vai a tribunal → advogado.
   - Ainda estás no prazo de reclamar/impugnar a liquidação (passo 4)? Faz isso e suspende a execução com **garantia** ou **dispensa de garantia** (art. 52.º, n.º 4, LGT): prejuízo irreparável **ou** manifesta falta de meios económicos revelada pela insuficiência de bens penhoráveis, sem fortes indícios de atuação dolosa; pedido fundamentado e com prova ao órgão da execução fiscal (art. 170.º CPPT).

6. **Penhora (E)** — a execução avançou sobre bens.
   - Penhora **ilegal ou excessiva** (bem impenhorável, extensão desproporcionada, bem que só responde subsidiariamente, garantia indevida) → **reclamação para o tribunal tributário**, entregue no serviço de finanças, ⏰ 10 dias (arts. 276.º e 277.º, n.º 1, CPPT); com prejuízo irreparável sobe logo e é urgente (art. 278.º, n.os 3 e 6).
   - Penhoraram um bem **de outra pessoa** (ex.: bem pessoal do sócio por dívida da sociedade, bem do cônjuge) → **embargos de terceiro**, ⏰ 30 dias (art. 237.º CPPT).
   - Para levantar a penhora: pagar, ou obter plano prestacional com garantia/dispensa (passo 5).
   - Conta bancária da empresa penhorada = risco imediato para salários e fornecedores → advogado no próprio dia.

7. **Contraordenação fiscal / coima (F)** — aplica-se o **RGIT**, não só o regime geral. Na notificação para defesa tens ⏰ **30 dias** (art. 70.º, n.º 1, RGIT) para escolher:
   - **Pagamento antecipado**: coima reduzida ao **mínimo legal** e custas a metade (art. 75.º RGIT), com regularização da situação tributária.
   - **Dispensa de coima**: se a infração não causou prejuízo efetivo à receita e a falta está regularizada, pedida no prazo de defesa (art. 29.º, n.os 2 a 4, RGIT).
   - **Atenuação especial**: reconhecer a responsabilidade e regularizar no prazo de defesa (art. 32.º RGIT).
   - **Defesa escrita**: `assets/templates/defesa-contraordenacao.md` — o modelo é genérico (RGCO); adapta a base legal (art. 70.º RGIT), o prazo (30 dias) e a entidade (dirigente do serviço tributário).
   - Até à decisão: **pagamento voluntário** a 75% do montante fixado, nunca abaixo do mínimo (art. 78.º RGIT).
   - Decisão de aplicação de coima → **recurso judicial** ⏰ 30 dias, entregue no serviço de finanças onde corre o processo (art. 80.º RGIT).
   - Falta de entrega de IVA ou de retenções na fonte acima de certo valor pode ser **crime** (abuso de confiança fiscal — art. 105.º RGIT; limiar em (ver `references/valores-2026.md`)) → advogado penalista. Se recebeste uma notificação para pagar a prestação declarada, com juros e coima, ⏰ em **30 dias** (art. 105.º, n.º 4, al. b), RGIT), é a última oportunidade: pagar nesse prazo afasta a punição. Gerentes e, em certas condições, contabilistas certificados podem responder subsidiariamente pelas coimas da empresa (art. 8.º RGIT). Mais contexto em `references/multas.md`.

8. **Reversão contra gerente / administrador (G)** — responsabilidade **subsidiária** pelas dívidas fiscais da sociedade (art. 24.º LGT), incluindo gerentes **de facto**:
   - **Al. a)** — dívidas cujo facto tributário ocorreu durante o teu mandato (ou cujo prazo de pagamento terminou depois dele): a AT tem de provar que foi **por tua culpa** que o património da sociedade ficou insuficiente.
   - **Al. b)** — dívidas cujo prazo de pagamento terminou durante o teu mandato: **presume-se** a culpa — tens de provar que a falta de pagamento não te é imputável.
   - A reversão exige **fundada insuficiência** dos bens da sociedade (benefício da excussão) e **audição prévia** (art. 23.º, n.os 2 e 4, LGT) → responde ao projeto com `assets/templates/direito-audicao-previa.md` (gerência só nominal, renúncia anterior, ausência de culpa, bens suficientes na sociedade).
   - **Citado como revertido**: ⏰ 30 dias para oposição (ilegitimidade — art. 204.º, n.º 1, al. b), CPPT); podes também reclamar ou impugnar a própria liquidação (art. 22.º, n.º 5, LGT; impugnação em 3 meses a contar da citação — art. 102.º, n.º 1, al. c), CPPT). Se pagares no prazo de oposição, ficas isento de juros de mora e custas (art. 23.º, n.º 5, LGT).
   - ENI: não há reversão — o empresário responde com o património pessoal desde o início. Lda/SA: confirma no perfil `.advogado-pt/perfil-empresa.md` quem é gerente e desde quando.

### Ramo — Empresa em PER, RERE ou insolvência

- Em plano de recuperação (insolvência, PER) ou acordo RERE, as dívidas fiscais podem ir até **150 prestações** (art. 196.º, n.os 6 e 7, CPPT), sem garantias adicionais (art. 199.º, n.º 13) — e o regime abrange, a título excecional, retenções na fonte e impostos repercutidos (art. 196.º, n.º 3, al. a)). Ver `references/insolvencia.md` e advogado.

### Ramo — Prevenir em vez de reagir

- Antes de uma operação com dúvida fiscal relevante (reestruturação, operação internacional, benefício fiscal), pede uma **informação vinculativa** (art. 68.º LGT): `assets/templates/pedido-informacao-vinculativa.md`.

## Documentos a usar

- `assets/templates/reclamacao-graciosa.md` — anular uma liquidação junto da própria AT (120 dias)
- `assets/templates/direito-audicao-previa.md` — responder a projeto de decisão, de relatório de inspeção ou de reversão
- `assets/templates/pedido-pagamento-prestacoes-at.md` — prestações em execução fiscal, com garantia ou dispensa
- `assets/templates/pedido-informacao-vinculativa.md` — confirmar o enquadramento fiscal antes de agir
- `assets/templates/defesa-contraordenacao.md` — defesa em contraordenação (adaptar ao RGIT)
- `references/contencioso-tributario.md` — meios de defesa, comparação reclamação / impugnação / CAAD, garantias, execução fiscal
- `references/fiscal.md` — impostos da empresa (IRC, IVA, IRS categoria B, Segurança Social)
- `references/multas.md` — contraordenações em geral
- `references/valores-2026.md` — limiares, UC e montantes do ano
- `calc_prazo` (tool MCP) ou `scripts/prazos.py` — contagem dos prazos a partir da data da notificação

## Quando chamar advogado ou contabilista certificado

- **Contabilista certificado**: divergências e declarações de substituição, regularização durante a inspeção, prestações simples, leitura do projeto de relatório.
- **Advogado**: impugnação judicial e oposição (mandatário obrigatório nos tribunais tributários — art. 6.º, n.º 1, CPPT), arbitragem no CAAD, reclamação de penhora, embargos de terceiro, reversão contra gerentes, métodos indiretos, cláusula geral antiabuso, recurso judicial de coima.
- **Sempre** que o valor seja relevante para a tesouraria da empresa e faltem menos de 10 dias para o fim do prazo — perder o prazo consolida a dívida.
- **Imediatamente** em suspeita de crime fiscal (abuso de confiança, fraude fiscal) ou penhora de contas da empresa.
