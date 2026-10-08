# Playbook: Recebi um pedido de devolução de um apoio (PRR / Portugal 2030)

> Quando usar: chegou uma notificação que anuncia ou decide a **redução**, a **revogação** ou a **restituição** ("devolução") de um apoio de fundos europeus. Pode vir:
> - da autoridade de gestão de um programa do **Portugal 2030**, pelo serviço público de notificações eletrónicas, pelo Balcão dos Fundos ou por carta;
> - da **AD&C** (Agência para o Desenvolvimento e Coesão);
> - da estrutura de missão **Recuperar Portugal** (EMRP);
> - do **beneficiário intermediário** do PRR, o organismo que geriu o aviso a que concorreste.
>
> Serve para identificar em que fase está o procedimento, que prazo corre e como reagir. Âmbito: misto (fundos da UE com procedimento nacional). Fundo teórico: `references/fundos-europeus.md`.

## Passo 0 — Não percas prazos

- ⏰ **Primeiro, fixa a data em que a notificação se considera feita:**
  - **Serviço público de notificações eletrónicas** (morada única digital), o canal-regra do PT2030 (art. 8.º, n.os 1 e 2, do DL 20-A/2023): presume-se feita no **5.º dia posterior** ao registo da disponibilização (DL 93/2017, art. 8.º, n.º 3).
  - **Carta registada**: presume-se feita no **3.º dia útil** posterior ao registo (CPA, art. 113.º, n.º 1; DL 20-A/2023, art. 8.º, n.º 3).
  - **E-mail, Balcão dos Fundos ou plataforma do beneficiário intermediário (PRR)**: confirma a regra no aviso e no contrato. Por prudência, conta a partir do dia em que a recebeste (a confirmar caso a caso).
- ⏰ **Como se contam:**
  - **Procedimento administrativo**, que inclui a audiência prévia, a reclamação, o recurso e a restituição voluntária: **dias úteis**. Não conta o dia da notificação, suspende-se aos sábados, domingos e feriados, e se o último dia calhar em dia em que o serviço está fechado passa para o dia útil seguinte (CPA, art. 87.º; DL 20-A/2023, art. 9.º).
  - **Tribunal administrativo**: o prazo é em **meses**, contado pelo art. 279.º do Código Civil; se terminar em férias judiciais, passa para o 1.º dia útil seguinte (CPTA, art. 58.º, n.º 2).
  - **Na dúvida, usa a data mais cedo.** Conta com a calculadora (`tipo=uteis` para o procedimento; não inclui feriados municipais):
    ```
    calc_prazo  inicio=<AAAA-MM-DD da notificação>  dias=10  tipo=uteis
    python scripts/prazos.py --inicio <AAAA-MM-DD> --dias 30 --tipo uteis
    ```
- ⏰ **Mapa de prazos principais** (confirma sempre o prazo indicado na própria notificação, que pode ser maior):

  | Reação | Prazo | Conta a partir de | Base |
  |---|---|---|---|
  | **Audiência prévia** sobre o projeto de decisão (redução, revogação, restituição ou compensação) | o fixado, **nunca menos de 10 dias úteis** | notificação do projeto | CPA, arts. 121.º, 122.º, n.º 1, e 87.º; DL 20-A/2023, art. 33.º, n.º 1; DL 29-B/2021, art. 10.º-A, e OT 13/2023 |
  | Regularizar o que levou à suspensão de pagamentos (PT2030) | o fixado, até 60 dias úteis | notificação da autoridade de gestão | DL 20-A/2023, art. 29.º, n.º 2 |
  | Garantia idónea quando a suspensão se deve a impedimento ou averiguações (PT2030) | até 90 dias úteis | suspensão | DL 20-A/2023, art. 29.º, n.º 3 |
  | Reclamação para o autor da decisão | 15 dias úteis | notificação da decisão | CPA, art. 191.º, n.º 3 |
  | Recurso hierárquico (se houver superior hierárquico) | necessário: 30 dias úteis · facultativo: prazo da ação em tribunal | notificação da decisão | CPA, art. 193.º, n.º 2 |
  | **Restituição voluntária**, sem juros de mora | **30 dias úteis** (PT2030: prorrogável por até 45 dias) | notificação para pagamento | DL 20-A/2023, art. 34.º, n.os 4 e 5; DL 29-B/2021, art. 10.º-A, n.º 7 |
  | Pedido de pagamento em prestações (PT2030) | dentro dos 30 dias úteis | notificação para pagamento | DL 20-A/2023, art. 34.º, n.º 6 |
  | Pedido de pagamento em prestações (PRR) | antes da execução fiscal | notificação da ordem de restituição | OT 3/2021, ponto 5.3 |
  | **Ação administrativa de impugnação** | **3 meses**, suspensos durante a reclamação ou o recurso | notificação da decisão | CPTA, arts. 58.º, n.º 1, al. b), e 59.º, n.º 4 |
  | Oposição à execução fiscal | 30 dias | citação | CPPT, art. 203.º |

## Fluxo de decisão

1. **Lê a notificação e identifica quem a envia e o que é.** Quem notifica: autoridade de gestão, AD&C, EMRP, beneficiário intermediário ou IFAP (no FEAMPA)? Que programa e que operação? A notificação de uma decisão **tem de** trazer o texto integral, a fundamentação, o autor e a data (CPA, art. 114.º, n.º 2). Se falta a fundamentação ou o relatório que a sustenta, pede a **consulta do processo** e certidões (CPA, arts. 82.º a 85.º); a falta pode ser um vício da decisão (art. 153.º, n.º 2). Depois, segue o ramo:
   - **A)** Pedido de elementos ou esclarecimentos, ou relatório de verificação no local ou de auditoria → passo 2.
   - **B)** **Suspensão de pagamentos** → passo 3.
   - **C)** **Projeto de decisão** de redução, revogação, restituição ou compensação, com convite à **audiência prévia** ("audiência de interessados", "sentido provável da decisão") → passo 4.
   - **D)** **Decisão final** de redução, revogação ou restituição, ou "ordem de restituição" e notificação para pagamento → passos 5 e 6.
   - **E)** **Citação** em processo de execução fiscal → passo 7.
   - **F)** Referência a participação ao Ministério Público, à Procuradoria Europeia ou ao OLAF → passo 8.

2. **Pedido de elementos ou relatório de verificação (A).** É a fase em que mais correções se evitam.
   - Responde **no prazo fixado**, por escrito e com documentos. Se precisares de mais tempo, pede prorrogação fundamentada **antes** de o prazo acabar.
   - Contratação: junta o procedimento completo (consultas, propostas, critérios, relatório de escolha).
   - Publicitação: fotografias datadas, capturas do sítio na Internet, materiais com as insígnias.
   - Indicadores: contratos de trabalho, relatórios técnicos, faturação.
   - O silêncio leva a decidir só com os elementos disponíveis e pode levar à suspensão de pagamentos (DL 20-A/2023, arts. 25.º, n.º 5, e 29.º, n.º 1, al. c)).

3. **Suspensão de pagamentos (B)** (DL 20-A/2023, art. 29.º).
   - Lê o fundamento: dívida ao Fisco, à Segurança Social ou aos fundos; deficiências no processo; elementos em falta; mudança de conta ou de domicílio não comunicada.
   - ⏰ Regulariza no prazo fixado, até **60 dias úteis**: certidões de não dívida, comunicação da conta ou da morada, envio dos elementos. Depois desse prazo pode haver **redução ou revogação** (n.º 2).
   - Se a suspensão resulta de dívida aos fundos, só abrange o montante em dívida (n.º 5).
   - Se resulta de impedimento ou de averiguações, a revogação só se evita com garantia idónea em 90 dias (n.º 3) → advogado.

4. **Projeto de decisão — audiência prévia (C).** O projeto **ainda não é a decisão**: é a melhor oportunidade para a evitar ou reduzir. No PT2030, a redução ou a revogação só pode ser decidida depois da audiência de interessados (DL 20-A/2023, art. 33.º, n.º 1). No PRR, a OT 13/2023 prevê o mesmo antes da compensação ou da ordem de restituição.
   - ⏰ **Prazo**: o da notificação, **nunca menos de 10 dias úteis** (CPA, art. 122.º, n.º 1). Pedir prorrogação é possível, mas a decisão é da entidade (a confirmar): não contes com ela.
   - **Pede de imediato** a consulta do processo e cópia do relatório de verificação ou de auditoria, com a lista das despesas cortadas e o cálculo do montante (CPA, arts. 82.º e 83.º).
   - **Reúne a prova**:
     - aviso, decisão de aprovação e termo de aceitação ou contrato;
     - pedidos de alteração e respetivas respostas;
     - faturas, comprovativos de pagamento e extratos bancários;
     - procedimentos de contratação;
     - prova de publicitação;
     - prova dos indicadores;
     - correspondência com a autoridade de gestão ou o beneficiário intermediário;
     - prova de força maior ou de factos não imputáveis à empresa.
   - **Estrutura da pronúncia** (escrita, ou pede audiência oral — CPA, art. 122.º, n.º 1):
     1. identificação da operação e tempestividade da resposta;
     2. questões prévias: fundamentação insuficiente, factos ou despesas mal identificados, cálculo errado, eventual prescrição do procedimento (Reg. 2988/95, art. 3.º — a confirmar no caso);
     3. resposta **ponto por ponto** a cada irregularidade e a cada despesa;
     4. **proporcionalidade**: execução parcial leva a redução e não a revogação (DL 20-A/2023, art. 33.º, n.º 2, al. c)); a falta de publicitação tem a redução limitada a uma percentagem do apoio (al. d)); as correções da contratação pública são proporcionais à gravidade (al. e));
     5. pedido concreto: arquivamento, redução menor ou, subsidiariamente, compensação ou prestações;
     6. diligências que pedes, como inquirir quem acompanhou a operação ou visitar o local (CPA, art. 121.º, n.º 2).
   - Usa `assets/templates/direito-audicao-previa.md`, adaptando a base legal (CPA, arts. 121.º e 122.º, em vez da LGT) e a entidade destinatária.
   - **Concordas com parte?** Aceita só essa parte, contesta o resto e propõe a compensação ou o pagamento da parte aceite.
   - **Não respondeste?** A entidade decide com o que tem → passo 5.

5. **Decisão final (D) — escolhe a reação.** Confirma se a decisão respondeu aos teus argumentos; ignorá-los é falta de fundamentação.
   - **Concordas** → passo 6.
   - **Não concordas**:
     - **Reclamação** para o autor, ⏰ em **15 dias úteis** (CPA, art. 191.º, n.º 3), decidida em 30 dias (art. 192.º, n.º 2).
     - **Recurso hierárquico**, se o autor estiver sujeito a um superior (confirma quem é — a confirmar caso a caso). Se for facultativo, interpõe-no no prazo da ação em tribunal (art. 193.º, n.º 2).
     - Estas impugnações **suspendem o prazo de ir a tribunal** (CPA, art. 190.º, n.º 3; CPTA, art. 59.º, n.º 4), mas **não suspendem a decisão**: pede expressamente a suspensão da execução, que é decidida em 5 dias (CPA, art. 189.º, n.os 2 a 4).
     - **Ação administrativa** no tribunal administrativo, ⏰ em **3 meses** (CPTA, art. 58.º, n.º 1, al. b)), com advogado obrigatório (art. 11.º).
     - Para travar a cobrança enquanto o processo corre, há a **providência cautelar** de suspensão de eficácia (arts. 112.º e 128.º).
   - ⚠️ Contestar **não trava** os 30 dias úteis para pagar. Sem pagamento nem suspensão, correm juros de mora e segue-se a execução fiscal.
   - ⚠️ **Se pagares ou pedires prestações e quiseres impugnar**, declara por escrito que o fazes **com reserva** e sem aceitar a decisão. A aceitação "espontânea e sem reserva" impede a impugnação por mera anulabilidade (CPTA, art. 56.º; CPA, art. 186.º, n.º 2 — a confirmar como os tribunais tratam o pedido de prestações).

6. **Pagar, compensar ou pagar em prestações.**
   - **Compensação**: confirma se a entidade já descontou o valor em pagamentos pendentes desta ou de outra operação (DL 20-A/2023, art. 34.º, n.os 2 e 3; DL 29-B/2021, art. 10.º-A, n.º 2). Pede o extrato de conta-corrente.
   - **PT2030**:
     - ⏰ paga em **30 dias úteis** a contar da notificação da AD&C (ou do IFAP). Depois acrescem juros de mora à taxa das dívidas ao Estado (`references/valores-2026.md`);
     - pede a **prorrogação** (até 45 dias) se tiveres fundamento (art. 34.º, n.os 4 e 5);
     - ou pede **prestações dentro desse prazo**: até 36 mensais, com juros à taxa legal e garantia bancária, caução ou seguro-caução. A garantia é dispensada se a prestação for baixa (n.os 6 e 7; mínimos e limiar em `references/valores-2026.md`). Falhar uma prestação vence todas (n.º 8).
   - **PRR**:
     - ⏰ paga em **30 dias úteis** (art. 10.º-A, n.º 7);
     - ou pede ao beneficiário intermediário **prestações antes da execução fiscal**: até 36, com prestação mínima e juros. A última não pode passar da data de conclusão do investimento (OT 3/2021, ponto 5.3; OT 13/2023).
   - Guarda o comprovativo e pede uma declaração de regularização. Uma dívida aos fundos **suspende pagamentos** noutras operações (DL 20-A/2023, art. 29.º, n.º 1, al. a)).

7. **Citação em execução fiscal (E).** A dívida não foi paga no prazo e a certidão seguiu para a AT (DL 20-A/2023, art. 34.º, n.º 10; DL 29-B/2021, art. 10.º-A, n.os 8 a 11).
   - ⏰ Tens **30 dias** a contar da citação (CPPT, art. 203.º) para pagar, pedir prestações no processo (art. 196.º) ou deduzir **oposição**.
   - A oposição tem fundamentos limitados: a legalidade da decisão de restituição **não** se discute aí se havia meio próprio para a impugnar (art. 204.º, n.º 1, al. h)).
   - Os gerentes e administradores à data dos factos podem ser chamados por **reversão** (DL 20-A/2023, art. 34.º, n.º 11; DL 29-B/2021, art. 10.º-A, n.º 13).
   - Segue os passos 5, 6 e 8 de `playbooks/recebi-notificacao-at.md` e `references/contencioso-tributario.md`.

8. **Suspeita de fraude ou participação criminal (F).** A fraude na obtenção de subsídio e o desvio de subvenção são crimes (DL 28/84, arts. 36.º e 37.º — a confirmar).
   - Advogado penalista **no próprio dia**.
   - Não destruas nem alteres documentos.
   - Conta com a suspensão de pagamentos e com a exigência de garantia idónea para continuar a aceder a fundos (DL 20-A/2023, arts. 16.º, n.º 5, e 29.º, n.º 1, al. i)).

### Ramo — Ainda não recebeste nada, mas sabes que há um problema

- Atraso, indicador que não vais atingir, mudança de local ou de fornecedor, despesa duvidosa: **pede a alteração** à autoridade de gestão ou ao beneficiário intermediário **antes** de a verificação a encontrar. As alterações aos elementos da decisão estão sujeitas a nova decisão (DL 20-A/2023, art. 25.º, n.º 8), e as que não forem comunicadas são causa de revogação (art. 33.º, n.º 4, al. c)).
- Corrigir ou restituir por iniciativa própria reduz o risco e mostra boa-fé (a confirmar o procedimento com a entidade).

### Ramo — Empresa em PER, RERE ou insolvência

- Os créditos de restituição gozam de privilégios e de hipoteca legal e são equiparados aos créditos tributários (DL 20-A/2023, art. 34.º, n.os 14 e 15; DL 29-B/2021, art. 10.º-A, n.º 14). Ver `references/insolvencia.md` e advogado.

## Documentos a usar

- `assets/templates/direito-audicao-previa.md` — pronúncia sobre o projeto de decisão (adaptar à base legal do CPA e à entidade)
- `assets/templates/pedido-pagamento-prestacoes-at.md` — prestações quando a dívida **já está em execução fiscal** (CPPT, art. 196.º)
- `assets/templates/parecer-juridico.md` — organizar a análise antes de decidir entre pagar, reclamar ou ir a tribunal
- `references/fundos-europeus.md` — obrigações do beneficiário, causas de redução e revogação, recuperação no PRR e no PT2030 e garantias
- `references/contencioso-tributario.md` — execução fiscal, oposição, garantia e reversão
- `references/contratacao-publica.md` — quando o corte se deve à contratação
- `references/uniao-europeia.md` — auxílios de Estado e *de minimis* (recuperação por decisão da Comissão)
- `references/valores-2026.md` — taxa de juros de mora às dívidas ao Estado, UC e mínimos das prestações
- `calc_prazo` (tool MCP) ou `scripts/prazos.py` com `tipo=uteis` — contagem dos prazos do procedimento

## Quando chamar advogado ou contabilista certificado

- **Contabilista certificado**, ou o consultor que preparou a candidatura: reconstituir a despesa, os comprovativos de pagamento e os indicadores, e preparar os pedidos de pagamento e de alteração.
- **Advogado**:
  - ação no tribunal administrativo, com mandatário obrigatório (CPTA, art. 11.º), e providência cautelar;
  - revogação total ou valor relevante;
  - correções por contratação pública ou conflito de interesses;
  - impedimentos e garantias;
  - execução fiscal e reversão contra os gerentes.
- **Sempre** que faltem **menos de 5 dias úteis** para o fim da audiência prévia e a prova não esteja reunida: perder a audiência deixa a decisão assentar só na versão da entidade.
- **Imediatamente** se houver suspeita de crime (fraude na obtenção de subsídio) ou participação à Procuradoria Europeia ou ao Ministério Público.
