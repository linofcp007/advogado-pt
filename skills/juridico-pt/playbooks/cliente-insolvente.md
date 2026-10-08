# Playbook: Um cliente meu entrou em insolvência / PER

> Quando usar: um cliente (ou outro devedor) que te deve dinheiro foi declarado insolvente, pediu um PER/PEAP ou propôs um acordo de reestruturação (RERE). Perspetiva do **CREDOR** — serve a qualquer empresa (ENI, Lda, SA) e a particulares. O tratamento fiscal (IVA/IRC) depende do teu perfil: confirma em `.juridico-pt/perfil-empresa.md` se és sujeito passivo de IVA, se estás em IRC ou IRS e se tens contabilidade organizada.
> **Âmbito:** nacional (CIRE — DL 53/2004, texto consolidado; confirmar a versão em vigor em dre.pt). Processo aberto noutro Estado-Membro da UE → Regulamento (UE) 2015/848 (formulário-tipo de reclamação).

## Passo 0 — Não percas prazos

- ⏰ **Insolvência declarada — reclamação de créditos:** no prazo **fixado na sentença**, que é **até 30 dias** (art. 36.º, n.º 1, al. j), CIRE). Só começa a correr **depois da dilação de 5 dias** contada da publicação do anúncio no Citius (art. 37.º, n.os 7 e 8). Reclamação ao **administrador da insolvência** (AI), nos termos do art. 128.º.
- ⏰ **Os prazos são seguidos e correm em férias judiciais:** o processo de insolvência (e o PER/PEAP) é **urgente** (art. 9.º, n.º 1, e arts. 17.º-A, n.º 3, e 222.º-A, n.º 3, CIRE; art. 138.º, n.º 1, CPC). Se o prazo terminar com os tribunais encerrados, passa para o 1.º dia útil seguinte (art. 138.º, n.º 2, CPC). Conta com `calc_prazo` (tipo `corridos`) ou `python scripts/prazos.py --inicio <data> --dias <n> --tipo corridos`.
- ⏰ **PER (empresas) / PEAP (não empresas):** **20 dias** contados da publicação no Citius do despacho de nomeação do **administrador judicial provisório** (AJP) (arts. 17.º-D, n.º 2, e 222.º-D, n.º 2). O AJP faz a lista provisória em 5 dias; **impugnação em 5 dias úteis** (arts. 17.º-D, n.º 4, e 222.º-D, n.º 3).
- ⏰ **Impugnação da lista de credores reconhecidos (insolvência):** o AI apresenta a lista nos **15 dias** seguintes ao fim do prazo de reclamações (art. 129.º, n.º 1); tens **10 dias** a seguir para impugnar (art. 130.º, n.º 1). Se foste avisado por carta registada, os 10 dias contam-se a partir do 3.º dia útil após a expedição (art. 130.º, n.º 2).
- ⏰ **Perdeste o prazo? Verificação ulterior:** ação contra a massa, os credores e o devedor, só nos **6 meses** seguintes ao trânsito em julgado da sentença de declaração de insolvência (ou 3 meses após a constituição do crédito, se terminar depois) — art. 146.º, n.º 2, al. b). **Não** a podes usar se o AI te avisou nos termos do art. 129.º (salvo créditos de constituição posterior — al. a)). A separação/restituição de bens pode pedir-se a todo o tempo.
- ⏰ **Qualificação da insolvência como culposa:** qualquer interessado pode alegar, por escrito, no prazo perentório de **15 dias** após a assembleia de apreciação do relatório (ou após a junção do relatório, se a assembleia for dispensada) — art. 188.º, n.º 1.
- ⏰ **O AI resolveu um pagamento que recebeste?** A impugnação da resolução caduca em **3 meses** (art. 125.º).
- ⏰ **IVA:** pedido de autorização prévia para créditos de cobrança duvidosa em **6 meses** (art. 78.º-B, n.º 1, CIVA); créditos incobráveis — dedução sem autorização prévia no prazo de **2 anos** a contar do 1.º dia do ano civil seguinte (art. 78.º-B, n.º 3).

## Fluxo de decisão

1. **Que processo é, e em que fase está?** Consulta a publicidade no portal **Citius** (anúncios de insolvência, PER e PEAP) e, para o RERE, a Conservatória do Registo Comercial.
   - **Insolvência já declarada** (há sentença) → passo 2.
   - **PER** (empresa em situação económica difícil ou insolvência iminente) ou **PEAP** (devedor que não é empresa) → **Ramo PER/PEAP** abaixo.
   - **RERE** (negociação extrajudicial, depositada na Conservatória) → **Ramo RERE** abaixo.
   - **Só há um pedido de insolvência pendente** (ainda sem sentença) → a suspensão das execuções só resulta da sentença (art. 88.º), sem prejuízo de medidas cautelares decretadas pelo juiz entretanto (art. 31.º); prepara já a reclamação, **corta o crédito** (pronto pagamento ou garantia antes de novos fornecimentos) e segue `playbooks/cliente-nao-paga.md`.

2. **Para as cobranças individuais.** Com a declaração de insolvência, as diligências executivas contra os bens da massa ficam **suspensas** e não se pode instaurar nova execução contra o insolvente (art. 88.º, n.º 1); os credores só exercem os seus direitos **dentro do processo** (art. 90.º). Injunção ou ação declarativa pendente → fala com o advogado sobre o destino dessa ação (a confirmar caso a caso). Se houver **outros executados** (fiadores, avalistas), a execução **prossegue contra eles** (art. 88.º, n.º 1).

3. **Reclama os créditos — SEMPRE.** Mesmo que o crédito conste da contabilidade do devedor, já tenhas sentença ou injunção com fórmula executória, ou o AI te tenha contactado: a lei não dispensa a reclamação (art. 128.º, n.º 5). Usa `assets/templates/reclamacao-creditos-insolvencia.md`, com **todos os documentos de prova** e as menções obrigatórias do art. 128.º, n.º 1 (proveniência, vencimento, capital e juros, condições, natureza, garantias pessoais, taxa de juros moratórios e IBAN).
   - Sem advogado: entrega em mão no domicílio profissional do AI, **e-mail** ou **carta registada**; o AI tem 3 dias para te enviar o comprovativo (art. 128.º, n.º 3). Com advogado: por via eletrónica (art. 128.º, n.º 2).

4. **Calcula o crédito.**
   - **Capital**: faturas em dívida, com IVA incluído. As obrigações ainda não vencidas **vencem-se com a declaração** (art. 91.º, n.º 1), com redução se não venciam juros (art. 91.º, n.º 2).
   - **Juros de mora**: por fatura, desde o vencimento **até à data da declaração de insolvência** — `calc_juros_mora` com `data_fim` = data da sentença (ou `python scripts/juros_mora.py --capital <valor> --data-inicio <vencimento> --data-fim <data da sentença> --tipo comercial`). Taxas em `references/valores-2026.md`.
   - **Juros posteriores à declaração** são **créditos subordinados** (art. 48.º, al. b)) — recebem-se por último, se sobrar.
   - Entre empresas, acresce a **indemnização pelos custos de cobrança** (art. 7.º DL 62/2013 — valor em `references/valores-2026.md`).

5. **Qual a natureza do teu crédito?** (art. 47.º, n.º 4, e art. 48.º)
   - **Garantido** — hipoteca, penhor, direito de retenção, consignação de rendimentos, privilégios especiais: pago pelo produto do bem, até ao valor deste. **Comunica a garantia ao AI de imediato** (art. 36.º, n.º 1, al. l)).
   - **Privilegiado** — privilégios creditórios gerais (ex.: certos créditos laborais, do Estado e da Segurança Social).
   - **Comum** — a regra para fornecedores e prestadores de serviços sem garantia: rateio proporcional, recuperação normalmente parcial.
   - **Subordinado** — pessoas especialmente relacionadas com o devedor (art. 49.º), suprimentos, juros posteriores à declaração, subordinação convencionada (art. 48.º).

6. **Tens garantias ou reserva de propriedade?**
   - **Reserva de propriedade** sobre bens vendidos e ainda na posse do insolvente → só é oponível à massa se tiver sido **estipulada por escrito até à entrega** (art. 104.º, n.º 4). Se sim: pede a **separação/restituição** dos bens (art. 141.º, n.º 1, al. c)) e fixa ao AI um prazo razoável para optar pelo cumprimento (art. 102.º, n.º 2) — prazo que não pode esgotar-se antes de 5 dias após a assembleia de apreciação do relatório, salvo bens que se desvalorizem consideravelmente (art. 104.º, n.º 3).
   - **Fiança, aval em livrança, garantia bancária** → aciona os garantes **fora do processo**, em paralelo (ver `references/garantias.md`). No plano de insolvência, os teus direitos contra garantes e codevedores **mantêm-se** (art. 217.º, n.º 4); no PER a questão é discutida (a confirmar); no RERE, salvo estipulação em contrário, a redução aproveita aos garantes (art. 19.º, n.º 7, Lei 8/2018) — lê antes de assinar.
   - **Seguro de crédito** → participa o sinistro no prazo da apólice (adapta `assets/templates/carta-participacao-sinistro.md`).

7. **Também deves dinheiro ao insolvente? → Compensação.** Só podes compensar se os pressupostos da compensação já se verificavam **antes da declaração de insolvência**, ou se o teu crédito reuniu os requisitos do art. 847.º CC antes do contracrédito da massa (art. 99.º, n.º 1). **Não** há compensação se a tua dívida à massa nasceu depois da declaração, se compraste o crédito depois dela, ou com créditos subordinados (art. 99.º, n.º 4). Declara-a por escrito ao AI (secção IX do template) e reclama só o saldo.

8. **Há contratos em curso com o insolvente** (fornecimento continuado, prestação de serviços, locação)? → O cumprimento fica **suspenso** até o AI optar por cumprir ou recusar (art. 102.º, n.º 1). **Fixa-lhe por escrito um prazo razoável** — sem resposta, considera-se recusa (art. 102.º, n.º 2). Se recusar, o teu crédito é sobre a insolvência (art. 102.º, n.º 3). Se o AI optar por cumprir, o que forneceres depois da declaração é **dívida da massa**, paga antes dos credores da insolvência (art. 51.º, n.º 1, al. f)). Não forneças a crédito sem essa confirmação escrita.

9. **Recebeste pagamentos do cliente nos meses anteriores? → Risco de resolução em benefício da massa.**
   - **Regra geral:** atos prejudiciais à massa praticados nos **2 anos anteriores ao início do processo** podem ser resolvidos, desde que haja **má-fé** do terceiro (conhecimento da insolvência, da insolvência iminente com caráter prejudicial do ato, ou do início do processo) — presumida se participou pessoa especialmente relacionada (art. 120.º, n.os 1, 4 e 5).
   - **Resolução incondicional** (sem prova de má-fé — art. 121.º, n.º 1): pagamentos de obrigações **ainda não vencidas** feitos nos **6 meses** anteriores (al. f)); pagamentos nos **6 meses** anteriores **em termos não usuais** no comércio e que não podias exigir (al. g)); garantias reais constituídas nos **6 meses** anteriores para dívidas preexistentes (al. c)) ou, em simultâneo com a dívida, nos **60 dias** anteriores (al. e)).
   - O AI resolve por **carta registada com AR**, nos 6 meses após conhecer o ato e nunca depois de 2 anos sobre a declaração (art. 123.º, n.º 1). Se discordas, ⏰ **ação de impugnação em 3 meses** (art. 125.º) — chama advogado.
   - Não são resolúveis os negócios de financiamento celebrados em PER, PEAP ou RERE (art. 120.º, n.º 6).
   - Prevenção: guarda prova de que os pagamentos seguiram os **termos contratuais habituais** e de que não conhecias a insolvência.

10. **Participa na assembleia e vota.**
    - A **assembleia de apreciação do relatório** é marcada na sentença para 45 a 60 dias depois (art. 36.º, n.º 1, al. n)). Para votar, o crédito tem de estar reclamado (art. 73.º, n.º 1).
    - **Plano de insolvência**: aprovado com quórum de 1/3 dos créditos com direito de voto e mais de 50% dos votos emitidos, incluindo mais de metade dos votos de créditos não subordinados (art. 212.º, n.º 1). O juiz pode mandar votar por escrito, em prazo não superior a 10 dias (art. 211.º).
    - Compara sempre com o **cenário de liquidação**: se o plano te deixa pior, podes pedir a não homologação (arts. 215.º e 216.º — a confirmar os fundamentos no caso concreto).

11. **Trata da fiscalidade do crédito perdido** (só se fores sujeito passivo de IVA que liquidou o imposto e/ou estiveres em IRC ou em IRS com contabilidade organizada — confirma no perfil da empresa e com o contabilista; detalhe em `references/fiscal.md` e `references/cobrancas.md`).
    - **IVA — cobrança duvidosa** (art. 78.º-A, n.º 2, al. a), CIVA): mora há mais de 12 meses, provas objetivas de imparidade e diligências de cobrança → **pedido de autorização prévia** em 6 meses (art. 78.º-B, n.º 1).
    - **IVA — créditos incobráveis** (art. 78.º-A, n.º 4, CIVA): **não basta a declaração de insolvência**. Só quando a insolvência for de caráter limitado, o processo encerrar por insuficiência de bens ou, após o rateio final, resultar o não pagamento definitivo (al. b)); quando for homologado plano de insolvência ou de recuperação (PER) que preveja o não pagamento definitivo (al. c)); ou com acordo RERE depositado nesses termos (al. e)). Dedução sem autorização prévia, em 2 anos (art. 78.º-B, n.º 3), com **comunicação ao adquirente** (art. 78.º-B, n.º 9) e **certificação** por ROC ou contabilista certificado independente (art. 78.º-D).
    - Exclusões: créditos cobertos por seguro ou garantia real, sobre entidades em relações especiais, ou sobre cliente que já constava da lista pública de execuções extintas ou já tinha sido declarado insolvente quando lhe vendeste (art. 78.º-A, n.º 6).
    - **IRC — imparidade:** com processo de insolvência ou PER pendente, o crédito é de cobrança duvidosa para efeitos fiscais (art. 28.º-B, n.º 1, al. a), CIRC), com as exclusões do n.º 3 (ex.: créditos com garantia real ou seguro, sobre o Estado, sobre sócios/participadas acima de 10%).
    - **IRC — crédito incobrável como gasto** (art. 41.º, n.º 1, CIRC): nas mesmas situações processuais do IVA (insolvência limitada/encerrada por insuficiência ou rateio final; plano homologado; RERE).
    - Se mais tarde recuperares parte do crédito, **entrega o IVA** correspondente (art. 78.º-C, n.º 3, CIVA).

12. **Houve "esvaziamento" do devedor? → Qualificação da insolvência e responsabilidade dos gerentes.**
    - A insolvência é **culposa** se foi criada ou agravada por dolo ou culpa grave do devedor ou dos administradores (de direito ou de facto) nos **3 anos** anteriores ao início do processo (art. 186.º, n.º 1). É **sempre culposa** em casos como dissipação ou ocultação de património, negócios ruinosos em proveito próprio, contabilidade fictícia ou dupla (art. 186.º, n.º 2); presume-se culpa grave se não pediram a insolvência a tempo ou não depositaram as contas (art. 186.º, n.º 3).
    - Se tens factos (transferência da atividade para uma "nova" empresa, venda de bens ao desbarato a familiares, pagamentos a sócios), **alega-os em 15 dias** após a assembleia (art. 188.º, n.º 1).
    - Consequências para os afetados (art. 189.º, n.º 2): inibição de 2 a 10 anos, perda dos seus créditos e **condenação a indemnizar os credores** até ao montante dos créditos não satisfeitos, solidariamente (al. e)).
    - Outras vias contra gerentes (responsabilidade perante credores sociais, crimes de insolvência dolosa/negligente) → ver `references/societario.md` e advogado (a confirmar o enquadramento).

13. **Acompanha até ao fim.** Vigia a lista de créditos reconhecidos, a sentença de verificação e graduação (art. 140.º) e os rateios. Atualiza o crédito na contabilidade à medida que recebes.

### Ramo — PER / PEAP

- **Reclama na mesma** ao AJP, em **20 dias** (arts. 17.º-D, n.º 2, e 222.º-D, n.º 2) — variante PER/PEAP do template. O plano homologado **vincula também quem não reclamou nem negociou** (art. 17.º-F, n.º 11).
- **Standstill:** no PER, ficam impedidas/suspensas as ações executivas contra a empresa por um máximo de **4 meses**, prorrogável por **1 mês** (art. 17.º-E, n.os 1 e 2), e suspendem-se os prazos de prescrição e caducidade oponíveis pela empresa (art. 17.º-E, n.º 9, al. c)). No PEAP, a suspensão dura enquanto perdurarem as negociações (art. 222.º-E, n.º 1).
- **Contratos essenciais:** durante a suspensão **não podes recusar cumprir, resolver ou alterar** contratos executórios essenciais só por causa de dívidas anteriores (art. 17.º-E, n.os 10 e 11); as cláusulas que fazem do PER causa de resolução são nulas (n.º 13). O que forneceres nesse período e não for pago é dívida da massa se a insolvência for declarada nos 2 anos seguintes (n.º 12). Podes exigir o pagamento pontual dos novos fornecimentos.
- **Negociações:** 2 meses, prorrogáveis por 1 (art. 17.º-D, n.º 7). Para participar, declara-o à empresa por carta registada (art. 17.º-D, n.º 9).
- **Plano:** depois do depósito, 5 dias para alegares o que entenderes; votação por escrito em 10 dias (art. 17.º-F, n.os 2, 3 e 6); maiorias no art. 17.º-F, n.º 5. Avalia sempre se ficas melhor do que numa liquidação (art. 17.º-F, n.º 7, al. e)).
- **Se o PER falhar** e a insolvência for declarada nesse processo (art. 17.º-G, n.º 7), os credores da lista definitiva **não precisam de reclamar de novo** os créditos lá relacionados (art. 17.º-G, n.º 9). Se a insolvência correr noutro processo, ou o teu crédito não constar da lista, reclama.

### Ramo — RERE (Lei 8/2018)

- É **voluntário e extrajudicial**: os teus créditos e garantias só são afetados se fores **parte** no acordo de reestruturação (art. 19.º, n.º 5), e as ações de credores que não o subscreveram não se extinguem (art. 11.º, n.º 3).
- Ao aderires ao protocolo de negociação, não te podes desvincular dos compromissos assumidos antes do fim do prazo máximo das negociações (art. 10.º, n.º 1), e a adesão tem de ser integral (art. 7.º, n.º 6). Pondera: o que recuperas no acordo vs. a via judicial; efeito sobre garantes (art. 19.º, n.º 7).
- Um acordo RERE depositado com não pagamento definitivo permite regularizar o IVA (art. 78.º-A, n.º 4, al. e), CIVA) e deduzir o gasto em IRC (art. 41.º, n.º 1, al. g), CIRC).

## Documentos a usar

- `assets/templates/reclamacao-creditos-insolvencia.md` — reclamação ao AI (insolvência) e variante ao AJP (PER/PEAP)
- `references/insolvencia.md` — graduação de créditos, PER, PEAP, RERE, qualificação
- `references/cobrancas.md` — cobrança escalonada, prescrição, tratamento fiscal de incobráveis
- `references/garantias.md` — fiança, aval, livrança, reserva de propriedade
- `references/fiscal.md` — IVA e IRC (regularizações, imparidades)
- `references/societario.md` — responsabilidade de gerentes
- `playbooks/cliente-nao-paga.md` — enquanto não há insolvência declarada
- `assets/templates/carta-participacao-sinistro.md` — participação ao seguro de crédito (adaptar)
- `assets/templates/livranca-pacto-preenchimento.md` — garantia a exigir a clientes de risco (prevenção)
- Tool `calc_juros_mora` / `scripts/juros_mora.py` — juros por fatura até à data da declaração de insolvência
- Tool `calc_prazo` / `scripts/prazos.py` — prazos de reclamação, impugnação e verificação ulterior (tipo `corridos`)

## Quando chamar advogado presencial

- Crédito **relevante** em risco, ou queres **impugnar** a lista de credores, a resolução de pagamentos ou a graduação — são incidentes judiciais.
- O AI **resolveu** pagamentos que recebeste (prazo de 3 meses para impugnar).
- Tens **garantias reais**, reserva de propriedade ou bens a separar da massa — a graduação e a restituição discutem-se com prova.
- Suspeitas de **insolvência culposa** ou de crime (esvaziamento, empresa "fénix") — alegações em 15 dias e eventual queixa-crime.
- Perdeste o prazo de reclamação e precisas da **verificação ulterior** (ação judicial, prazo de 6 meses).
- O plano de insolvência ou de recuperação te deixa **pior do que a liquidação** e queres pedir a não homologação.
