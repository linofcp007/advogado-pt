# Revisão pós-lançamento — juridico-pt 2.0.1

Revisão feita a 8/10/2026 sobre a 2.0.1, para fechar os pontos que o `eval-plan.md` deixou "por fazer" (rubrica, normas inventadas, revisão humana) e as verificações finais dos tracks +ai e +privacy. Correções resultantes: versão 2.0.2.

## 1. Avaliação automática (`claude plugin eval`)

- **Golden completo** (40 casos, 1 execução, só com o plugin, Claude Code 2.1.292): **39/40** casos passados, pontuação 0,9875. O que falhou, g01, disse "cerca de 532 €" sem o valor exato pedido pela verificação; repetido, passou. Custo 6,63 USD, 15 min.
- **Repetição com as respostas guardadas** (`--keep-temp`) de 15 casos — g01, g13, g15, g16, g20 e os 10 de conteúdo e rigor (g25–g34): **15/15** passados. Custo 3,02 USD. Ficaram de fora, por orçamento, g14, g17, g18 e g19 (passaram na execução completa).
- **Custo total**: 9,65 USD (teto aprovado: 10 USD).

## 2. Rubrica de qualidade (15 respostas)

Critérios do `eval-plan.md`: cita normas sem inventar; diz "(a confirmar)" quando não tem certeza; recomenda advogado quando há prazo judicial ou risco elevado; responde na língua do utilizador. Classificação feita nesta sessão, com cada norma verificada (ver 3), e não pelo juiz automático.

| Caso | Classificação | Observação |
|---|---|---|
| g01 juros | Bom | Generaliza o limite de 15.000 € da injunção, que não se aplica entre empresas |
| g13 cliente não paga | Excelente | — |
| g15 despedir | Excelente | — |
| g16 fuga de dados | Bom | Prazo de queixa sem o início da contagem e sem a exceção do crime público |
| g20 RGPC | Excelente | — |
| g25 presuntiva | Excelente | — |
| g26 arrendamento | Excelente | — |
| g27 execução específica | Excelente | — |
| g28 quitação | Excelente | Respondeu de memória e avisou; tema em falta na referência |
| g29 CISG | Excelente | — |
| g30 ViaCTT | Bom | Regra certa, mas hesitou com a redação revogada |
| g31 coima laboral | Bom | Regra do depósito revogada em 2023 (vinha da referência) |
| g32 injunção B2B | Excelente | — |
| g33 IRS royalties | Excelente | — |
| g34 SS do ENI | Excelente | — |

**Resultado: 15/15 bom-ou-excelente (100%; limiar ≥ 85%)** — 11 excelentes, 4 bons. Todas em português, todas com o aviso de que não substituem advogado e a recomendação de advogado nos casos com prazo judicial ou risco elevado.

## 3. Normas citadas — verificação na fonte

Cada norma das 15 respostas foi comparada com as referências do plugin; as que não estavam lá, ou levantavam dúvida, foram lidas no texto oficial do Diário da República (versões consolidadas, 8/10/2026).

- **Normas inventadas: 0 em 15 respostas (0%; limiar ≤ 5%).**
- Confirmadas no DR: CPPT art. 39.º/10 (15.º dia, Lei 119/2019) e art. 38.º-A/4 (5.º dia no Portal); CC art. 1110.º-A (Lei 13/2019); RGPC (DL 109-E/2021) arts. 20.º, 21.º/4, 22.º e 27.º/2; Lei 109/2009 art. 6.º/5 e /7 (Lei 79/2021); CP art. 115.º/1; Lei 107/2009 arts. 6.º, 17.º, 33.º e 35.º (republicada pela Lei 13/2023); CT arts. 337.º/3, 349.º/5 e 350.º/1, 3 e 4.
- **Regra desatualizada: 1** — g31, efeito suspensivo da impugnação de coima laboral com depósito (Lei 107/2009, art. 35.º, n.ºs 2 e 3, revogados pela Lei 13/2023 desde 1/5/2023). Vinha de `references/multas.md`. Jurisprudência relevante: Ac. TC 515/2025 (fiscalização concreta).
- **Imprecisões: 2** — g16 (prazo de queixa) e g01 (limite da injunção).

## 4. Correções na 2.0.2

| Ficheiro | Correção |
|---|---|
| `references/multas.md` | Efeito meramente devolutivo da impugnação laboral sem a via do depósito (Lei 13/2023) e Ac. TC 515/2025; resposta à notificação só escrita (art. 17.º) |
| `references/laboral.md` | Nova secção "Revogação por acordo e quitação": arts. 349.º, 349.º/5, 337.º/3, 350.º e 337.º/1 |
| `playbooks/data-breach.md` e `references/penal-cibercrime.md` | Queixa conta do conhecimento dos autores; acesso ilegítimo semipúblico (art. 6.º/7) e público nas formas agravadas (n.º 5) |
| `references/contencioso-tributario.md` | A redação anterior do art. 39.º/10 (5.º dia, DL 93/2017) só vale para notificações anteriores a 1/10/2019 |

Cada correção ficou protegida por um facto de referência novo em `mcp-server/test/factos.json` (ids `v202-`), que falhava antes da correção.

## 5. Verificações finais dos tracks

- **+privacy — de ponta a ponta** (servidor MCP real, projeto git e home isolados): guardar 2 perfis, prazos por perfil, acesso, portabilidade (texto legível), exportação `.docx`, `apagar_perfil` (só o perfil e os prazos dele), aviso e `acrescentar_gitignore` (linha uma só vez), nada escrito fora de `.juridico-pt/` nem no perfil geral — **13/13**.
- **+privacy — documentos**: AIPD decidida e registada no `design.md` ("[PRIVACY] AIPD"); política em `references/privacidade-plugin.md` e no README; conservação automática de 12 meses (T-335). Registo de atividades (art. 30.º): não aplicável ao plugin, que não trata dados — o responsável é o utilizador (design, "Fundamento de Licitude").
- **+ai — custo fixo por sessão** (estimativa de 3,3 a 4 caracteres por token): descrição da skill 974 car. ≈ 245–295 tokens (alvo ≤ 300) ✓; instruções do servidor MCP 1.983 car. ≈ 500–600 tokens (alvo ≤ 550, dentro dos 20%) ≈; início de sessão sem dados 191 car. ≈ 47–57 tokens (alvo ≤ 60) ✓; maior descrição de command 138 car. (alvo ≤ 150) ✓.
- **+ai — adversarial**: 8/8 a 100% na 2.0.0 (ver `eval-plan.md`); não repetido na 2.0.1, que não mudou instruções nem persona.

## 6. Revisão humana — 10 respostas (para o Carlos)

Amostra das áreas mais usadas, incluindo as 4 respostas com reservas. Cada uma tem a nota da revisão automática; marca OK ou Não OK. As respostas são da 2.0.1 (antes das correções da 2.0.2).

### g01-juros-fatura

**Pergunta:** Um cliente (empresa) deve-me uma fatura de 5.000 € vencida a 1/1/2025. Quanto são os juros de mora comerciais até 1/1/2026?

**Nota da revisão automática:** Valores certos (juros 532,29 €; 5.572,29 € com capital e 40 €; Avisos 1278/2025 e 16792/2025). Imprecisão: diz que a injunção é "para dívidas até 15.000 €" — entre empresas não há limite (DL 62/2013, art. 10.º). Na 1.ª execução falhou a verificação automática por dizer só "cerca de 532 €".

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

Os juros de mora comerciais **até 1/1/2026 são cerca de 532 €**. Somando o capital e a indemnização de 40 €, pode exigir **5.572,29 €**. Este é um crédito entre empresas, por isso aplica-se a taxa comercial (art. 102.º §5 do Código Comercial e DL 62/2013).

| Período | Dias | Taxa | Juros |
|---|---|---|---|
| 01/01/2025 – 01/07/2025 | 181 | 11,15 % (Aviso n.º 1278/2025) | 276,46 € |
| 01/07/2025 – 01/01/2026 | 184 | 10,15 % (Aviso n.º 16792/2025) | 255,84 € |
| **Total juros** | 365 | | **532,29 €** |

- **Capital + juros:** 5.532,29 €
- **Indemnização fixa por custos de cobrança:** acrescem **40 €** (art. 7.º do DL 62/2013). É devida automaticamente, sem ter de interpelar o cliente.
- **Total a reclamar:** **5.572,29 €**

**Data de início:** em rigor, a mora começa no dia seguinte ao vencimento, 2/1/2025. Contando a partir daí, os juros ficam em cerca de **530,76 €**, ou seja, 1,53 € a menos. Na carta ou na injunção use 2/1/2025, que é a data mais fácil de defender.

**Os juros não param em 1/1/2026.** Continuam a correr até ao pagamento, à taxa de 10,15 % no 1.º semestre de 2026. Isto dá cerca de 1,39 € por dia.

Se quiser, posso preparar a carta de interpelação ou fazer as contas da injunção. A injunção é o processo próprio para cobrar dívidas até 15.000 €. Posso também confirmar o prazo de prescrição.

*Isto é uma estimativa e não substitui um advogado inscrito na Ordem dos Advogados.*

</details>

### g13-cliente-nao-paga

**Pergunta:** Um cliente não me paga uma fatura de 3.000 € vencida há 4 meses. O que faço?

**Nota da revisão automática:** Certo: taxa de justiça de 51 €, oposição em 15 dias, IVA entre o 12.º e o 18.º mês, prescrição presuntiva de 2 anos (CC 317.º), a carta não interrompe a prescrição.

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

Com 4 meses de atraso e uma dívida que ninguém contesta, a cobrança está bem encaminhada e ainda tem muito tempo. Os números abaixo pressupõem que o seu cliente é uma empresa e que a fatura venceu por volta de 8/6/2026. Sem a data exata, os valores são aproximados.

#### Quanto pode exigir hoje (8/10/2026)

| Parcela | Valor |
|---|---|
| Fatura (capital) | 3.000,00 € |
| Juros de mora comerciais (121 dias, 10,15 % e depois 10,40 %) | 102,98 € |
| Indemnização fixa por custos de cobrança (DL 62/2013, art. 7.º) | 40,00 € |
| **Total** | **≈ 3.142,98 €** |

Os juros continuam a contar todos os dias até ao pagamento. Se o cliente for um particular, aplica-se a taxa civil de 4 % e não há os 40 €.

#### Passos a seguir

1. **Lembrete amigável**, se ainda não o enviou: um email ou carta cordial com cópia da fatura e o seu IBAN.
2. **Carta formal registada com aviso de receção**, se o lembrete ficar sem resposta em 8 a 15 dias. É o aviso final: dá um prazo de 8 a 15 dias, indica o valor com juros e os 40 € e avisa que, sem pagamento, avança para tribunal. A carta registada serve de prova.
3. **Acordo de pagamento**, se o cliente quiser pagar mas não puder de uma vez: pagamento em prestações, mais um **reconhecimento de dívida** assinado. Esse documento também reinicia a contagem do prazo de prescrição.
4. **Injunção** no Balcão Nacional de Injunções, se continuar sem resposta. É um pedido feito online e a taxa de justiça para 3.000 € é de cerca de **51 €**. Se o devedor não se opuser em 15 dias, fica com um título executivo e pode pedir a penhora de contas e bens.
5. **Recuperar o IVA**: se a fatura nunca for paga, pode pedir à AT para deduzir o IVA que já entregou. O pedido faz-se entre o 12.º e o 18.º mês de atraso, ou seja, aproximadamente entre junho e dezembro de 2027. Trate disto com o seu contabilista certificado.

#### ⏰ Prazos de prescrição
- **Fatura entre empresas:** 20 anos, por isso não há pressa.
- **Serviço de profissão liberal ou venda a um particular:** apenas **2 anos (até cerca de 8/6/2028)**. Este prazo é presuntivo: passado esse tempo, presume-se que o cliente pagou.
- Cartas e emails **não interrompem** a prescrição. Só a interrompem a injunção ou um reconhecimento de dívida assinado pelo cliente.

#### Para avançar, preciso de saber
1. O cliente é **empresa ou particular**? E presta um serviço de profissão liberal?
2. Qual é a **data de vencimento** exata e o número da fatura?
3. Já enviou algum lembrete? O cliente **contesta o serviço**? Se contestar, a injunção não é a via certa e convém consultar um advogado.
4. Os seus dados e os do cliente (nome, NIF, morada).

Com estas respostas preparo-lhe a carta adequada, já com os valores calculados, e posso exportá-la para Word. Também posso registar o prazo dado ao cliente na carta, para receber um aviso quando ele terminar. Se quiser, guardo o perfil da sua empresa para não ter de repetir estes dados.

*Sou um assistente jurídico, não um advogado. Para uma ação contestada ou de valor elevado, consulte um advogado inscrito na Ordem dos Advogados.*

</details>

### g15-quero-despedir

**Pergunta:** Quero despedir um trabalhador que falta muito sem justificação. Como faço?

**Nota da revisão automática:** Artigos do CT todos certos: 351.º/2 g), 403.º, 329.º (60 dias), 355.º (10 dias úteis), 357.º (30 dias), 387.º (60 dias), 63.º (CITE).

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

#### Despedir um trabalhador por faltas injustificadas

Faltar muito sem justificação é um dos motivos mais claros para despedimento com **justa causa**. Mas só é válido se fizer primeiro um **processo disciplinar**. Se despedir sem esse processo, ou com erros, o despedimento é ilícito. Nesse caso pode ter de readmitir o trabalhador e pagar-lhe os salários desde o despedimento e uma indemnização.

#### 1. Confirme que tem fundamento

O Código do Trabalho (art. 351.º, n.º 2, al. g)) considera justa causa as faltas injustificadas que:
- **num mesmo ano civil cheguem a 5 dias seguidos ou 10 dias interpolados**, mesmo que não tenham causado prejuízo à empresa; **ou**
- causem **prejuízos ou riscos graves** à empresa, seja qual for o número.

Se o trabalhador deixou de aparecer e não diz nada há **10 dias úteis seguidos ou mais**, pode tratar-se de **abandono do trabalho** (art. 403.º). Esse caso tem um procedimento próprio: comunicação por carta registada com aviso de receção.

#### 2. Reúna a prova antes de avançar

- Registos de assiduidade (picagens, mapas de presença) com as datas exatas das faltas.
- Comunicações em que pediu justificação e as respostas que recebeu ou não recebeu.
- Os salários desses dias podem ser descontados (art. 256.º).

#### 3. O processo disciplinar, por esta ordem

1. **Nota de culpa**, entregue por escrito ao trabalhador. Deve descrever cada falta com a data e dizer que pretende despedi-lo.
   ⏰ Tem de a entregar **no prazo de 60 dias** a contar do momento em que soube da infração (art. 329.º). Se se atrasar, perde o direito de despedir com esse fundamento.
2. **Resposta do trabalhador.** ⏰ Tem **10 dias úteis** para responder e pedir diligências, por exemplo ouvir testemunhas (art. 355.º). Só pode decidir depois de passar esse prazo.
3. **Instrução.** Faça as diligências que o trabalhador pediu e que sejam pertinentes. Nas microempresas (menos de 10 trabalhadores) o procedimento é mais simples (art. 358.º).
4. **Decisão fundamentada e por escrito.** ⏰ Tem de ser tomada **no prazo de 30 dias** após a instrução, senão perde o direito de aplicar a sanção (art. 357.º).

⏰ Depois de receber a decisão, o trabalhador tem **60 dias** para contestar o despedimento em tribunal (art. 387.º). Guarde o processo completo.

⚠️ Se for uma **trabalhadora grávida, puérpera ou lactante**, ou um trabalhador em licença parental, tem de pedir **parecer prévio à CITE** antes de decidir (art. 63.º).

#### 4. Quanto vai custar

- **Compensação:** nenhuma, porque o despedimento é por justa causa.
- **Acerto final:** é sempre devido. Inclui as férias vencidas e não gozadas, os proporcionais de férias e dos subsídios de férias e de Natal, e a formação que não foi dada.
- **Documentos a entregar:** certificado de trabalho e declaração de situação de desemprego para a Segurança Social.

#### Para avançar, preciso de saber

1. Quantas faltas há e em que datas? Desde quando sabe delas?
2. O trabalhador ainda está no período experimental? Se estiver, pode denunciar o contrato sem processo disciplinar.
3. Quantos trabalhadores tem a empresa?
4. Qual é a data de admissão e o salário base? Servem para calcular o acerto final.
5. É uma situação de proteção na parentalidade ou um representante sindical?

Com estes dados preparo a **nota de culpa** a partir do modelo e calculo o acerto de contas. Se quiser, também guardo o perfil da empresa para as próximas questões.

Sou um assistente jurídico e não substituo um advogado. Como um erro no processo disciplinar torna o despedimento ilícito, vale a pena um advogado rever a nota de culpa e a decisão antes de as entregar.

</details>

### g16-fuga-dados

**Pergunta:** Tivemos ontem uma fuga de dados de clientes da nossa loja online. O que tenho de fazer?

**Nota da revisão automática:** RGPD 33.º, 34.º e 33.º/5 certos; as 72 h terminam no sábado 10/10. Imprecisão: os 6 meses de queixa sem dizer que contam do conhecimento dos autores nem que as formas agravadas são crime público (Lei 109/2009, art. 6.º/5 e 7) — esclarecido no conteúdo na 2.0.2.

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

#### Tem cerca de 48 horas para notificar a CNPD

O RGPD (art. 33.º) dá-lhe **72 horas** para notificar a CNPD. As horas contam a partir do momento em que a empresa **soube** da fuga, não de quando ela aconteceu. São horas seguidas, e fins de semana e feriados também contam.

- Se souberam ontem, 7/10, o prazo acaba **no sábado, 10/10, à mesma hora** a que souberam.
- Se não tiverem ainda todos os dados, **notifiquem na mesma dentro do prazo** e completem depois. O RGPD permite notificar por fases.
- Se notificarem depois das 72h, têm de justificar o atraso.

#### O que fazer, por ordem

**1. Hoje: travar a fuga e guardar provas**
- Isolem os sistemas afetados. Mudem palavras-passe e chaves de acesso (API, painel da loja, base de dados). Ativem a autenticação em dois passos e fechem a falha por onde entraram.
- ⚠️ **Antes de limpar ou reinstalar o que quer que seja, façam uma cópia forense.** Se houve ataque, essa é a prova para a queixa-crime.
- Comecem já um **registo com horas**: quando detetaram a fuga, o que fizeram e quem decidiu o quê.

**2. Avaliar o risco para os clientes**
Que dados saíram? Nomes e emails? Moradas e telefones? Palavras-passe (e se estavam cifradas)? Dados de pagamento? Quantos clientes são afetados?
- Numa loja online, com contactos e possivelmente credenciais ou dados de pagamento, **quase sempre há risco**, portanto têm de notificar a CNPD.

**3. Notificar a CNPD dentro das 72h**
O formulário está no site da CNPD. Tem de dizer:
- o que aconteceu;
- que tipo de dados saíram e o número aproximado de clientes e de registos;
- o contacto do encarregado de proteção de dados (DPO) ou de outra pessoa de contacto;
- as consequências prováveis;
- as medidas que já tomaram e as que vão tomar.

**4. Avisar os clientes (art. 34.º), se o risco for elevado**
Isto aplica-se, por exemplo, se saíram palavras-passe, dados de pagamento ou dados que facilitam burlas por email falso (phishing).
- Têm de os avisar **sem demora injustificada**, em linguagem clara.
- A mensagem deve explicar o que aconteceu e o que devem fazer: mudar a palavra-passe e desconfiar de emails ou SMS que digam ser da loja.
- Ficam dispensados se os dados estavam bem cifrados.

**5. Registar a fuga internamente**
Este registo é obrigatório mesmo que concluam que não precisam de notificar (art. 33.º, n.º 5). É o que mostra à CNPD que cumpriram as regras.

**6. Acionar o seguro de ciberrisco, se tiverem**
Muitas apólices exigem a participação em poucos dias, muitas vezes 8.

**7. Apresentar queixa-crime, se foi um ataque**
Quem atacar ou entrar sem autorização comete crime. A queixa pode ser feita na Polícia Judiciária (unidade de cibercrime, UNC3T) ou em queixaselectronicas.mai.gov.pt.
- ⏰ O prazo é de **6 meses**, mas guardem as provas já.

**8. Verificar se a lei NIS2 se aplica (DL 125/2025)**
Se a empresa estiver abrangida, tem de notificar também o Centro Nacional de Cibersegurança (CNCS) **em 24h**. Numa loja online pequena isto é pouco provável, mas confirmem.

#### Para afinar a resposta, preciso de saber
1. **Quando** é que souberam exatamente da fuga (dia e hora)?
2. **Que dados** saíram e **quantos clientes** são afetados?
3. Foi um ataque (pirataria, ransomware) ou um erro interno?
4. Que tipo de empresa é (Lda, Unipessoal, ENI…) e quantos trabalhadores tem? Têm DPO?
5. Têm seguro de ciberrisco?

Com estas respostas posso redigir a notificação à CNPD e o email aos clientes. Também posso registar o prazo das 72h para receberem um aviso quando abrirem a sessão.

⚖️ **Recomendo que chamem já um advogado**, sobretudo se saíram dados de pagamento ou palavras-passe, se são muitos clientes ou se foi um ataque. O texto das notificações tem consequências jurídicas e na reputação da loja. Sou um assistente jurídico e não substituo um advogado inscrito na Ordem dos Advogados.

</details>

### g20-rgpc-50

**Pergunta:** A minha empresa vai passar a ter 55 trabalhadores. Que obrigações de compliance passo a ter?

**Nota da revisão automática:** Confirmado no DR: RGPC art. 20.º (2.000 € a 44.891,81 €), 21.º/4 e 22.º (responsabilidade dos gerentes), 27.º/2 (15 dias úteis de defesa perante o MENAC).

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

#### O que muda quando a empresa passa a ter 55 trabalhadores

Ao passar de 50 trabalhadores, a empresa entra no escalão de **média empresa**. É o salto de compliance mais pesado: tem de montar um **programa anticorrupção completo (RGPC)** e um **canal de denúncias**. Parto do princípio de que a empresa é uma sociedade (pessoa coletiva) sem setor regulado. Confirme isso nas perguntas do fim.

#### ⚠️ Antes de mais: a partir de quando conta
Nem o RGPC nem a Lei 93/2021 dizem como se contam os trabalhadores. A referência habitual é o **art. 100.º do Código do Trabalho**, que usa a **média do ano civil anterior**. Com essa leitura, se só chegar aos 55 agora, a obrigação pode começar apenas em 2027. Este ponto está por confirmar, porque a Plataforma do MENAC vai buscar os dados à Segurança Social. **Recomendo que comece a preparar-se já**, porque montar o programa demora meses.

#### 1. O que já devia ter (confirme que está em dia)
- Seguro de acidentes de trabalho, admissões comunicadas à Segurança Social, registo dos tempos de trabalho e 40 horas de formação por trabalhador e por ano.
- **Segurança e saúde no trabalho** com serviço externo ou comum. Acima de 9 trabalhadores, o empregador já não pode tratar disto sozinho. Inclui medicina do trabalho.
- **Código de boa conduta contra o assédio**, obrigatório desde os 7 trabalhadores (CT art. 127.º, n.º 1, al. k)). Sempre que haja suspeita de assédio, tem de abrir procedimento disciplinar.
- Política remuneratória transparente, com critérios objetivos iguais para homens e mulheres (Lei 60/2018, art. 4.º).
- RGPD: informar os trabalhadores sobre o tratamento dos seus dados, ter o registo de atividades de tratamento e contratos de subcontratação (DPA) com quem processa salários e com o software de RH.
- Relatório Único e RCBE (confirmação anual até **31/12** ⏰).

#### 2. Novo: programa anticorrupção (RGPC, DL 109-E/2021)
- **Responsável pelo cumprimento normativo**: alguém da direção, independente e com meios para o trabalho.
- **Plano de Prevenção de Riscos de Corrupção (PPR)** com a matriz de riscos (probabilidade × impacto), as medidas a tomar e um responsável.
- **Código de conduta** com as sanções disciplinares e criminais. É um documento diferente do código contra o assédio, mas os dois podem ficar no mesmo texto.
- **Formação** de todos os dirigentes e trabalhadores. Estas horas contam para as 40 horas anuais.
- **Controlo interno** e **avaliação prévia de fornecedores, clientes e intermediários**, incluindo quem são os beneficiários efetivos.
- **Registo na Plataforma RGPC do MENAC** e envio dos documentos por lá.
- ⏰ Publicar o PPR, o código e os relatórios na intranet e no site **até 10 dias** depois de cada aprovação ou revisão.
- ⏰ Relatório **intercalar em outubro** (só se houver riscos elevados ou máximos) e relatório **anual em abril** do ano seguinte. Rever o PPR e o código **de 3 em 3 anos**.

#### 3. Novo: canal de denúncias (Lei 93/2021)
- Tem de aceitar denúncias **anónimas e identificadas**, por escrito e/ou verbalmente, com **reunião presencial** se o denunciante a pedir.
- Precisa de um gestor independente, com substituto. Com 50 a 249 trabalhadores pode **partilhar recursos com outras entidades ou entregar a receção a uma entidade externa** (com contrato e DPA).
- ⏰ Prazos de resposta ao denunciante: aviso de receção em **7 dias**, medidas em **3 meses** e resultado **15 dias** depois de concluída a análise, se o denunciante o pedir. As denúncias guardam-se **5 anos**.
- Durante **2 anos** depois de uma denúncia, presume-se que qualquer sanção ao denunciante é retaliação. As cláusulas de NDAs ou de acordos de saída que impeçam denúncias são nulas.

#### 4. Outras mudanças aos 50 trabalhadores
- **Igualdade salarial**: a ACT pode notificar a empresa para apresentar um plano de avaliação das diferenças salariais em **120 dias**, a executar durante 12 meses. Também está a caminho a transposição da Diretiva 2023/970, que obrigará a indicar faixas salariais aos candidatos e proibirá perguntar o salário anterior. Está por confirmar se já está em vigor.
- **Despedimento coletivo**: passa a aplicar-se quando abrange 5 ou mais trabalhadores (até agora bastavam 2).
- **NIS2 (cibersegurança)**: só se aplica se o setor constar dos anexos do DL 125/2025, como energia, transportes, saúde, digital ou indústria transformadora.
- **Próximo limiar, aos 75 trabalhadores**: quota de 1 % de trabalhadores com deficiência.

#### Coimas
| Falha | Pessoa coletiva |
|---|---|
| Não ter PPR ou código de conduta | 2.000 € a 44.891,81 € |
| Não fazer os relatórios, não rever ou não publicar | 1.000 € a 25.000 € |
| Não ter canal de denúncias ou ter um canal sem anonimato | 1.000 € a 125.000 € |
| Retaliar contra o denunciante ou violar a confidencialidade | 10.000 € a 250.000 € |
| Não ter código contra o assédio | contraordenação grave: 612 € a 9.690 € |

**Os gerentes e administradores respondem pessoalmente** pelas coimas do RGPC (arts. 21.º e 22.º).

#### Quando chamar um advogado
Chame um advogado inscrito na Ordem se receber uma denúncia de corrupção ou de crime, se o MENAC abrir um processo (⏰ **15 dias úteis** para se defender) ou se houver suspeita de retaliação contra um denunciante. Para montar o programa, um consultor ou advogado de compliance ajuda, mas a base pode partir dos templates.

#### Próximos passos
Posso preparar os rascunhos a partir dos templates:
1. **Plano de Prevenção de Riscos de Corrupção**
2. **Regulamento do canal de denúncias**
3. **Código de conduta do RGPC** e revisão do **código contra o assédio**
4. **Calendário anual** (.ics) com abril, outubro e a revisão de 3 em 3 anos

Para afinar a resposta, preciso de saber:
- **Forma jurídica** (Lda, SA…)?
- **Setor de atividade**, em especial se é financeiro, imobiliário ou contabilidade, ou se vende ao Estado?
- **Quantos trabalhadores teve em média em 2025?**
- Já tem algum destes documentos?

Quer que guarde estes dados num perfil da empresa, para não ter de os repetir? Fica num ficheiro local, nesta pasta ou como perfil geral.

*Sou um assistente jurídico, não um advogado. Confirme a redação em vigor em dre.pt.*

</details>

### g26-arrendamento-5-anos

**Pergunta:** Como senhorio, posso denunciar um contrato de arrendamento de duração indeterminada sem dar motivo?

**Nota da revisão automática:** CC 1101.º c) (5 anos), 1104.º (confirmação entre 15 e 12 meses antes) e NRAU 9.º certos; o art. 1110.º-A existe (Lei 13/2019) — confirmado no DR.

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

Sim, pode, mas só com um pré-aviso muito longo e com regras de forma.

#### Regra geral (Código Civil, art. 1101.º, al. c))

Num arrendamento habitacional de duração indeterminada, o senhorio pode denunciar o contrato **sem invocar motivo**. A comunicação ao inquilino tem de ser feita com **⏰ antecedência mínima de 5 anos** em relação à data em que quer que o contrato termine. O prazo de 5 anos vem da Lei n.º 13/2019; antes era de 2 anos.

#### Confirmação obrigatória (CC, art. 1104.º)

⏰ A denúncia sem motivo tem de ser **confirmada** com uma segunda comunicação, enviada **entre 15 meses e 1 ano antes** da data de saída. Se faltar esta confirmação, a denúncia não produz efeitos. Por isso, precisa de duas cartas:
1. A denúncia, pelo menos 5 anos antes.
2. A confirmação, entre 15 e 12 meses antes do fim.

As duas devem ser enviadas por **carta registada com aviso de receção** (NRAU, art. 9.º).

#### Alternativas com motivo (prazos mais curtos)

- **Habitação própria ou de um filho** (CC, art. 1101.º, al. a), e art. 1102.º): pré-aviso de 6 meses e há requisitos, por exemplo ser proprietário há pelo menos 2 anos e o próprio ou o filho não ter casa na mesma zona.
- **Demolição ou obras profundas** (CC, art. 1101.º, al. b), e art. 1103.º): exige procedimento próprio e, em regra, indemnização ou realojamento do inquilino.

#### ⚠️ Antes de avançar, confirme

- **A data do contrato.** Contratos antigos, sobretudo anteriores a 1990, regem-se por normas de transição do NRAU (arts. 26.º e 28.º). Nesses casos a denúncia sem motivo pode **não ser possível**.
- **A idade e a situação do inquilino.** Inquilinos com 65 anos ou mais, ou com incapacidade de 60% ou mais, podem ter proteção reforçada, sobretudo se vivem na casa há muito tempo. Confirme o regime em vigor no dre.pt.
- **Se é habitação ou comércio.** Num arrendamento não habitacional o regime é diferente (CC, arts. 1110.º e 1110.º-A).

Se me disser **a data do contrato, se é habitação e a idade aproximada do inquilino**, digo-lhe qual é o caminho mais rápido e posso preparar as minutas das duas cartas. Sou um assistente jurídico e não substituo um advogado. Se o inquilino contestar, vale a pena consultar um advogado inscrito na Ordem dos Advogados.

</details>

### g28-quitacao-revogacao

**Pergunta:** Posso pôr no acordo de revogação que o trabalhador dá quitação total de todos os créditos?

**Nota da revisão automática:** CT 337.º/3 (Lei 13/2023, desde 1/5/2023), 349.º/5 e 350.º confirmados no DR. Respondeu de memória (e avisou) porque a referência laboral não tinha o tema — acrescentado na 2.0.2.

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

Pode escrevê-la, mas desde 1 de maio de 2023 essa cláusula, sozinha, não impede o trabalhador de reclamar créditos mais tarde. O que realmente protege a empresa é outra coisa.

#### O que mudou

A Agenda do Trabalho Digno (Lei n.º 13/2023) acrescentou o **n.º 3 ao art. 337.º do Código do Trabalho**. Os créditos do trabalhador que resultam do contrato, da sua violação ou da sua cessação **não podem ser extintos por remissão abdicativa, salvo através de transação judicial**.

Antes, os tribunais aceitavam muitas vezes uma declaração do tipo "nada mais tem a receber" assinada no momento da cessação. Hoje, uma "quitação total e plena" num acordo extrajudicial **não faz o trabalhador perder** créditos que ainda lhe sejam devidos.

#### O que continua a proteger a empresa

**1. Compensação pecuniária global (art. 349.º, n.º 5 CT)**
Se o acordo fixar uma compensação pecuniária de natureza global, a lei presume que ela inclui todos os créditos vencidos à data da cessação ou exigíveis por causa dela. É uma presunção ilidível: o trabalhador pode provar o contrário. Mesmo assim, obriga-o a fazer essa prova.

**2. Discriminar o que se paga**
Na prática, é isto que mais protege. Liste no acordo cada verba:
- retribuição do mês da cessação;
- férias vencidas e não gozadas, com o respetivo subsídio;
- proporcionais de férias, subsídio de férias e subsídio de Natal;
- horas de formação não ministradas (art. 134.º CT);
- outros valores, como trabalho suplementar e comissões;
- **mais** um valor separado a título de compensação pecuniária global.

Se as contas estiverem certas e documentadas, sobra pouco para reclamar.

**3. Transação judicial**
Se a empresa quer mesmo uma quitação definitiva (por exemplo, por haver um litígio latente), a única via segura é uma **transação homologada em tribunal**.

#### Outros pontos a ter em conta

- ⏰ **Direito de arrependimento (art. 350.º CT):** o trabalhador pode fazer cessar o acordo até ao **7.º dia seguinte** à data em que foi celebrado, devolvendo o que recebeu. Não tem esse direito se as assinaturas forem objeto de reconhecimento notarial presencial.
- ⏰ **Prescrição (art. 337.º, n.º 1 CT):** os créditos do trabalhador prescrevem **1 ano** a contar do dia seguinte à cessação. A cláusula de quitação não encurta este prazo.
- **Subsídio de desemprego:** a revogação por mútuo acordo só dá acesso ao subsídio se se enquadrar nas quotas e motivos do DL 220/2006 (por exemplo, reestruturação). Convém deixar isto claro, porque é muitas vezes o ponto que leva o trabalhador a contestar o acordo.

#### Redação sugerida

> "A título de compensação pecuniária de natureza global, a Empregadora paga ao Trabalhador a quantia de € ___, na qual se incluem todos os créditos vencidos à data da cessação ou exigíveis em virtude desta, nos termos do n.º 5 do art. 349.º do Código do Trabalho, sem prejuízo das quantias discriminadas na cláusula ___."

Evite expressões como "renuncia a todos e quaisquer direitos". Não produzem efeito e dão má imagem do acordo se ele for parar a tribunal.

---

Citei estes artigos de memória, porque a base de conhecimento do plugin não trata esta questão. Antes de assinar, confirme o texto atual dos arts. 337.º, 349.º e 350.º CT no dre.pt. Se o valor ou o risco de litígio for relevante, fale com um advogado inscrito na Ordem dos Advogados, sobretudo se estiver a pensar na via da transação judicial.

Posso calcular os créditos finais (com `calc_creditos_laborais`) ou dar-lhe a minuta completa do acordo de revogação. Para isso preciso da data de admissão, da data de cessação, da retribuição base, das diuturnidades e das férias já gozadas.

</details>

### g30-viactt

**Pergunta:** Recebi uma notificação da AT na caixa postal eletrónica ViaCTT, disponibilizada a 1/10/2026. Quando se considera feita?

**Nota da revisão automática:** Regra certa — 15.º dia (CPPT 39.º/10, red. Lei 119/2019, confirmado no DR) — mas hesitou com a redação antiga (5.º dia, DL 93/2017) e mandou contar do 5.º dia por cautela. Nota acrescentada à referência na 2.0.2.

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

Pela regra do art. 39.º, n.º 10, do CPPT, a notificação considera-se feita a **sexta-feira, 16/10/2026**. Há, no entanto, uma dúvida sobre a versão em vigor desta norma (explico abaixo), por isso conte os prazos a partir de 6/10/2026 até a confirmar.

#### A regra

Uma notificação na caixa postal eletrónica (ViaCTT) considera-se feita no **15.º dia depois de ficar disponível**, mesmo que ninguém a abra.

| | Data |
|---|---|
| Disponibilizada | qui, 01/10/2026 |
| 1.º dia da contagem | sex, 02/10/2026 |
| **Notificação feita (15.º dia)** | **sex, 16/10/2026** |
| Início dos prazos de reação | sáb, 17/10/2026 |

O feriado de 5/10 não altera a data, porque a contagem é em dias seguidos e o dia 16 é útil.

#### A dúvida

Lembro-me de uma versão do art. 39.º, n.º 10 que fixava o **5.º dia** depois da disponibilização, e não o 15.º. Não consigo confirmar qual é a redação atual. Se for o 5.º dia, a notificação ficou feita a **terça-feira, 06/10/2026**, ou seja, já passou.

⏰ **Até confirmar, conte os prazos a partir de 06/10/2026.** Se a regra certa for a dos 15 dias, ganha tempo de margem e não perde nada. Pode confirmar a redação em vigor no [dre.pt](https://dre.pt) (CPPT, art. 39.º).

Se abriu a mensagem antes de 16/10, use também essa data como referência e fique com o prazo que terminar mais cedo.

#### O prazo depende do tipo de notificação

| Tipo de notificação | Prazo |
|---|---|
| Audição prévia | em regra 15 dias |
| Recurso hierárquico | 30 dias |
| Citação em execução fiscal (oposição ou pagamento) | 30 dias |
| Coima (RGIT): defesa ou pagamento antecipado | 30 dias |
| Liquidação: reclamação graciosa | 120 dias |
| Liquidação: impugnação judicial | 3 meses |
| Penhora: reclamação | 10 dias |

O prazo exato tem de vir indicado na própria notificação (art. 36.º, n.º 2, CPPT).

Diga-me que tipo de notificação recebeu (liquidação, audição prévia, citação, coima…) e eu calculo a data-limite e registo o prazo com aviso. Se for uma citação, uma penhora ou um valor elevado, convém falar já com um advogado ou contabilista certificado.

*Sou um assistente jurídico e não substituo um advogado inscrito na Ordem dos Advogados.*

</details>

### g31-coima-laboral

**Pergunta:** Recebi uma notificação da ACT para apresentar defesa numa contraordenação laboral. Quantos dias tenho e são úteis?

**Nota da revisão automática:** Certo: 15 dias contínuos sem suspensão nas férias judiciais (Lei 107/2009, arts. 6.º/2 e 17.º) e 20 dias para impugnar (art. 33.º). Desatualizado: "efeito suspensivo com depósito da coima" — os n.ºs 2 e 3 do art. 35.º foram revogados pela Lei 13/2023. Vinha da referência multas.md — corrigido na 2.0.2.

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

⏰ **Tem 15 dias seguidos, não úteis.**

- **Base legal:** Lei n.º 107/2009, art. 17.º (prazo de 15 dias para a defesa) e art. 6.º (contagem dos prazos).
- **Como contam:** o art. 6.º remete para as regras do processo penal. Os 15 dias contam-se de forma contínua, ou seja, os sábados, domingos e feriados também contam. O prazo também não para durante as férias judiciais.
- **Último dia num fim de semana ou feriado:** se o prazo terminar num dia não útil, passa para o primeiro dia útil seguinte.
- **Início:** o dia em que recebeu a notificação não conta. Se a carta foi registada, confirme na notificação a data em que ela se considera feita, porque pode haver uma presunção de alguns dias após o envio.
- **A notificação prevalece:** se indicar um prazo diferente, siga o que lá está e confirme-o.

**Algumas coisas a ter em conta:**
- Na defesa escrita pode juntar documentos e indicar testemunhas.
- Se a infração for clara e a coima baixa, veja se a notificação permite o **pagamento voluntário** pelo valor mínimo. Normalmente tem de ser feito dentro do mesmo prazo.
- Se a ACT decidir contra si, tem **20 dias** para impugnar a decisão em tribunal (art. 33.º). Nas coimas laborais, a impugnação **não suspende** o pagamento, a menos que deposite o valor da coima e das custas (art. 35.º).

Se me disser **em que data recebeu a notificação**, calculo a data-limite exata e registo o prazo com aviso. Também posso preparar uma minuta da defesa (`/defesa`).

Sou um assistente jurídico e isto não substitui um advogado inscrito na Ordem dos Advogados. Se a coima for elevada ou houver reincidência, vale a pena consultar um advogado antes de o prazo acabar.

</details>

### g32-injuncao-b2b

**Pergunta:** Uma empresa deve-me 40.000 € de faturas. Posso usar a injunção?

**Nota da revisão automática:** Certo: DL 62/2013, art. 10.º (sem limite entre empresas), taxa de justiça de 153 €, advogado obrigatório havendo oposição, 40 € por fatura.

- [ ] OK  - [ ] Não OK — comentário: 

<details><summary>Resposta completa (2.0.1)</summary>

Sim, **se a dívida resultar de uma transação comercial entre empresas** (vendeu bens ou prestou serviços a outra empresa, para a atividade dela).

#### Porque pode usar a injunção
- Em regra, a injunção só serve para dívidas **até 15.000 €** (DL 269/98).
- **Entre empresas, não há limite de valor** (DL 62/2013, art. 10.º). Os 40.000 € podem por isso ser cobrados por injunção.
- O pedido é feito online, no **Balcão Nacional de Injunções**.
- **Taxa de justiça estimada: 153 €** (valores de 2026).

#### Condições para resultar
1. **A dívida não pode estar em disputa.** O valor tem de estar definido, as faturas vencidas e o cliente não pode estar a contestar o serviço. Se ele alega defeitos, a injunção não é a via adequada.
2. **Se o devedor não se opuser em 15 dias**, a injunção passa a valer como **título executivo**. Com ele pode pedir a penhora de contas e bens (ação executiva).
3. **Se o devedor se opuser**, o processo passa a correr em tribunal como ação comum. Com este valor, a partir daí **é obrigatório ter advogado**.
4. **Se a empresa estiver em insolvência ou em PER** (processo de recuperação), não avance com a injunção. Tem de **reclamar os créditos** no processo, dentro do prazo fixado.

#### Pode pedir mais do que os 40.000 €
- **Juros de mora comerciais** (taxa do BCE + 8 pontos percentuais), contados desde o vencimento de cada fatura.
- **40 € por cada fatura vencida**, como indemnização pelos custos de cobrança (DL 62/2013, art. 7.º).

#### Antes de avançar
- ⏰ Se ainda não o fez, envie uma **carta registada com aviso de receção** a dar um prazo final de 8 a 15 dias. A carta serve de prova e reforça o pedido.
- ⏰ Entre empresas, as faturas só prescrevem ao fim de 20 anos, por isso aqui não há pressa. Se o cliente for um particular ou se se tratar de serviços de profissão liberal, o prazo é de **apenas 2 anos**.

---

Para continuar, preciso de saber:
1. **O devedor é uma empresa** e as faturas são de bens ou serviços para a atividade dela?
2. **Quantas faturas são, de que valor cada uma e com que datas de vencimento?** Com isto calculo os juros e os 40 € por fatura, e preparo a carta final.
3. O cliente **contestou** alguma fatura ou simplesmente não paga?

*Sou um assistente jurídico e não substituo um advogado inscrito na Ordem dos Advogados. Se houver oposição, vai precisar de um.*

</details>
