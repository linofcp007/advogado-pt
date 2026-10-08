# Playbook: Cliente não paga (fatura por cobrar)

> Quando usar: emitiste uma fatura, o prazo de vencimento passou e o cliente não pagou. Serve para serviços/dívidas comerciais entre empresas e a profissionais.

## Passo 0 — Não percas prazos

- ⏰ **Prescrição** (usa `calc_prescricao` ou `scripts/prescricao.py`; detalhe em `references/cobrancas.md`):
  - **Faturas entre empresas** (venda ou serviço para a atividade do cliente): **20 anos** — prazo ordinário (CC, art. 309.º; tipo `creditos-comerciais`).
  - **Serviços de profissões liberais** e **vendas/serviços a quem não é comerciante** (ex.: particulares): **2 anos, prescrição presuntiva** (CC, art. 317.º, als. b) e c)) — presume-se que o cliente pagou; a presunção só cai se o devedor confessar que não pagou (arts. 313.º e 314.º). Não deixes passar os 2 anos.
  - **Rendas, juros e prestações periódicas**: 5 anos (CC, art. 310.º). **Telecomunicações, energia, água**: 6 meses (Lei 23/96, art. 10.º).
- ⏰ A prescrição **interrompe-se** (recomeça do zero) com a **citação ou notificação judicial** — a injunção conta — **ou** com o **reconhecimento da dívida** pelo devedor (CC, arts. 323.º e 325.º). Uma carta ou email de cobrança **não** interrompe. Se pedires a injunção **pelo menos 5 dias antes** do fim do prazo, a prescrição considera-se interrompida ao 5.º dia mesmo que a notificação demore (CC, art. 323.º, n.º 2). Se a prescrição estiver perto, força um destes atos JÁ.
- ⏰ Os **juros de mora** correm desde o vencimento — começa a contá-los agora, não quando fores a tribunal.

## Fluxo de decisão

1. **A dívida é certa, líquida e exigível?** (valor definido, sem disputa real sobre a qualidade do serviço, prazo vencido) → se SIM: avança · se NÃO (cliente contesta o serviço): trata primeiro o diferendo — vê `references/contencioso.md` (negociação/mediação) e evita injunção, que não serve para créditos contestados.

2. **A prescrição está a aproximar-se do fim (2 anos nas presuntivas, 6 meses nos serviços essenciais)?** → se SIM: salta a fase amigável e vai já para um ato interruptivo (reconhecimento de dívida assinado **ou** injunção, pedida com pelo menos 5 dias de margem) · se NÃO: começa pela cobrança amigável (passo 3).

3. **Já enviaste um lembrete amigável?** → se NÃO: envia o **1.º lembrete cordial** (`assets/templates/carta-cobranca-amigavel.md`), assumindo esquecimento, com cópia da fatura e IBAN · se SIM mas sem resposta em ~8-15 dias: passa ao passo 4.

4. **Houve resposta ao lembrete?** → se NÃO: envia **carta formal registada com AR** (`assets/templates/carta-cobranca-formal-registada.md`) — interpelação final, menção a juros de mora, prazo de 8-15 dias e advertência de ação judicial. A carta registada serve de prova e marca a mora de forma inequívoca.
   - **O cliente deve várias faturas?** → uma só carta com a tabela fatura a fatura: `assets/templates/carta-cobranca-varias-faturas.md` (juros e totais da tool `calc_juros_lote` — passo 5).

5. **Calcula os juros de mora** antes de qualquer carta formal ou requerimento, para incluir o valor atualizado:
   ```
   python scripts/juros_mora.py --capital <valor> --data-inicio <vencimento> --tipo comercial
   ```
   - Entre empresas: taxa comercial (BCE + 8 p.p., DL 62/2013). Com consumidor: taxa civil. O script escolhe via `--tipo` (`comercial`|`civil`). Tool MCP: `calc_juros_mora`.
   - Entre empresas tens ainda direito a uma **indemnização mínima de 40 €** pelos custos de cobrança, sem precisar de interpelação, e aos custos razoáveis que a excedam (DL 62/2013, art. 7.º).
   - **Várias faturas** (do mesmo cliente ou de vários): calcula tudo de uma vez com a tool **`calc_juros_lote`** (ou `python scripts/juros_mora.py --data-fim <data> --lote '<lista JSON>'`) — juros por tramos semestrais fatura a fatura, **40 € por cada fatura comercial vencida** e totais por cliente; as faturas ainda não vencidas contam só o capital. Os 40 € são devidos por fatura, mesmo quando as reclamas todas juntas (TJUE, acórdão de 20/10/2022, proc. C-585/20). Leva o resultado para a carta `assets/templates/carta-cobranca-varias-faturas.md`.

6. **O cliente mostra boa-fé / quer pagar mas não consegue de uma vez?** → se SIM: propõe **acordo de pagamento faseado** (`assets/templates/acordo-pagamento-faseado.md`) com cronograma e cláusula de vencimento antecipado, e/ou faz assinar um **reconhecimento de dívida** (`assets/templates/reconhecimento-divida.md`) — que **interrompe a prescrição** e, se **autenticado** por notário, advogado ou solicitador, é também título executivo · se NÃO (silêncio ou recusa): passo 7.

7. **Que via usar?**
   - **Dívida entre empresas (transação comercial)** → **Injunção, independentemente do valor** (DL 62/2013, art. 10.º): requerimento eletrónico no Balcão Nacional de Injunções. Se houver oposição e o valor for elevado, segue como ação comum no tribunal.
   - **Dívidas que não são transações comerciais** (ex.: a consumidores ou entre particulares) → **Injunção** até 15.000 € (DL 269/98); acima disso, **ação declarativa** no tribunal cível (advogado obrigatório acima da alçada da 1.ª instância — ver `references/contencioso.md`). Litígio simples até 15.000 €: também **Julgado de Paz**.
   - Estima a taxa de justiça da injunção (tool `calc_custas_injuncao`):
     ```
     python scripts/custas_injuncao.py --valor <valor>
     ```
   - Se o devedor **não se opuser em 15 dias**, é aposta fórmula executória → **título executivo**.
   - Dívida contestada (o cliente alega defeito) → a injunção não é a via certa: ação declarativa ou meio alternativo (ver passo 1).

8. **O devedor opôs-se à injunção?** → se SIM: a injunção segue para os termos de ação (distribuída como processo declarativo) · se NÃO: obtiveste título executivo → passo 9.

9. **Tens título executivo** (injunção com fórmula executória, sentença, documento de reconhecimento de dívida **autenticado** por notário, advogado ou solicitador — art. 703.º, n.º 1, al. b), CPC; uma fatura ou um documento só com assinatura, mesmo reconhecida, já não basta)? → **Ação executiva**: penhora de contas, bens e salários (ver `references/cobrancas.md`).
   - **Não sabes se o devedor tem bens?** → antes de executar, considera o **PEPEX** (ramo seguinte): mostra se há bens penhoráveis sem abrir já uma execução e, se não houver nada, pode dar-te a certidão de incobrabilidade para recuperar o IVA.

### Ramo — PEPEX: ver se o devedor tem bens antes de executar

- **O que é**: o **procedimento extrajudicial pré-executivo (PEPEX)**, criado pela **Lei n.º 32/2014, de 30 de maio** (em vigor desde 1/9/2014 — art. 34.º). É **facultativo** e serve, entre outras finalidades, para **identificar bens penhoráveis** do devedor através das bases de dados que o agente de execução consulta numa execução (art. 2.º).
- **Quem pode usar** (art. 3.º): o credor com **título executivo** que permita a **forma sumária** da execução para pagamento de quantia certa (CPC, art. 550.º, n.º 2: sentença, **injunção com fórmula executória**, título extrajudicial garantido por hipoteca ou penhor, ou título extrajudicial de valor até ao dobro da alçada da 1.ª instância — alçada em `references/valores-2026.md`), com dívida **certa, exigível e líquida** e **NIF português** do credor e do devedor. **Uma fatura não chega**: primeiro a injunção (passo 7).
- **Como**: requerimento na plataforma **www.pepex.mj.pt** (Lei 32/2014, art. 4.º; Portaria n.º 349/2015, de 13 de outubro, art. 2.º, n.º 4), com cópia do título em PDF (art. 5.º). ⏰ Pagar em **5 dias úteis** após receber a referência, senão o pedido fica sem efeito (art. 6.º). O pedido é distribuído automaticamente a um agente de execução (art. 7.º), que consulta as bases de dados e faz um **relatório** em 5 dias úteis (arts. 8.º a 10.º).
- **Depois do relatório** — ⏰ **30 dias** para escolher, senão o procedimento extingue-se (art. 11.º): (a) há bens → **converter em execução**, sem repetir as consultas nem pagar de novo a fase inicial (art. 18.º); (b) não há bens → **notificar o devedor** para, em 30 dias, pagar, fazer acordo de pagamento, indicar bens ou opor-se (art. 12.º). Se nada fizer, o devedor entra na **lista pública de devedores** (art. 15.º). A oposição segue o regime da oposição à execução e, enquanto não for julgada, não podes executar com o mesmo título (art. 16.º).
- **Certidão de incobrabilidade**: com o devedor na lista pública, pedes ao agente de execução uma **certidão eletrónica de incobrabilidade**; a dívida passa a ser **incobrável para fins fiscais** e é comunicada à AT, para efeitos dos arts. 78.º, n.º 7, e 78.º-A, n.º 4, do CIVA e do art. 41.º do CIRC (Lei 32/2014, art. 25.º) → ramo do IVA abaixo.
- ⏰ A Lei 32/2014 **não** prevê que o PEPEX interrompa a prescrição (a confirmar): se o prazo estiver perto do fim, não contes com ele — avança com a execução ou com outro ato interruptivo.
- Custos (honorários do agente de execução por fase): calculados pela plataforma — confirma antes de submeter (a confirmar).

### Ramo — Recuperar o IVA das faturas que não vão ser pagas (CIVA, arts. 78.º-A a 78.º-D)

> Entregaste ao Estado o IVA de faturas que o cliente não pagou. A lei deixa-te deduzi-lo a teu favor nos casos abaixo. Regime dos arts. 78.º-A a 78.º-D do CIVA, aplicável aos créditos vencidos desde 1/1/2013 (Lei 66-B/2012, art. 198.º, n.º 7); para créditos mais antigos, art. 78.º, n.os 7 e seguintes. Decide com o contabilista certificado.

- **Cobrança duvidosa — mora há mais de 12 meses** (art. 78.º-A, n.º 2, al. a)): crédito em mora há mais de 12 meses desde o vencimento, com **provas objetivas de imparidade** e de **diligências de cobrança** (cartas, injunção, execução), evidenciado como tal na contabilidade (n.º 1).
  - ⏰ Só com **pedido de autorização prévia** à AT, por via eletrónica, nos **6 meses** seguintes à data em que o crédito passa a ser de cobrança duvidosa — na prática, entre o 12.º e o 18.º mês de mora (art. 78.º-B, n.º 1; modelo da Portaria n.º 303/2020, de 28 de dezembro).
  - A AT tem **4 meses**; sem resposta, o pedido considera-se **indeferido** (art. 78.º-B, n.º 2), salvo para créditos abaixo do limiar por fatura do art. 78.º-B, n.º 4, em que se considera **deferido** (limiar: `references/valores-2026.md` [VERIFICAR]). Deferido → deduzes na declaração periódica até ao fim do período seguinte (art. 78.º-B, n.º 8).
  - **Comunicação ao devedor**: é a AT que notifica o cliente (se for sujeito passivo) para corrigir a dedução que fez (arts. 78.º-B, n.º 5, e 78.º-C, n.º 1); o cliente pode provar que já pagou ou que não está em mora, e o pedido é indeferido (art. 78.º-B, n.os 6 e 7).
- **Cobrança duvidosa — pequenos créditos a particulares** (art. 78.º-A, n.º 2, al. b)): mora há mais de 6 meses, valor até ao limiar da al. b) (`references/valores-2026.md` [VERIFICAR]) e devedor particular ou sujeito passivo que só faz operações isentas sem direito à dedução → dedução **sem** autorização prévia (art. 78.º-B, n.º 3).
- **Crédito incobrável** (art. 78.º-A, n.º 4), se o facto ocorrer antes dos prazos acima: execução, após o registo do art. 717.º, n.º 2, al. b), do CPC; insolvência de caráter limitado, encerrada por insuficiência de bens ou com rateio final sem pagamento; plano de insolvência ou de PER homologado que preveja o não pagamento; acordo RERE depositado — e a **certidão de incobrabilidade do PEPEX** (Lei 32/2014, art. 25.º, n.º 2).
  - Dedução **sem** autorização prévia, ⏰ no prazo de **2 anos** a contar do 1.º dia do ano civil seguinte (art. 78.º-B, n.º 3) [VERIFICAR com o contabilista o ano de referência].
  - **Comunicação ao devedor**: se o cliente for sujeito passivo, comunica-lhe a anulação do IVA, identificando as faturas, o montante do crédito e do imposto, o processo ou acordo e o período em que regularizas (art. 78.º-B, n.º 9).
- **Certificação** (art. 78.º-D): faturas, diligências de cobrança e insucesso documentados e **certificados por ROC** — ou por **contabilista certificado independente** (não pode ser o da empresa — Portaria 303/2020, art. 3.º) quando o IVA a regularizar não exceder o limiar por pedido da al. a) do n.º 1 (`references/valores-2026.md` [VERIFICAR]) —, até à entrega do pedido ou até ao prazo da declaração periódica.
- **Não dá** (art. 78.º-A, n.os 6 a 8): créditos com seguro ou garantia real; sobre entidades com relações especiais (art. 63.º, n.º 4, CIRC); sobre o Estado, regiões autónomas ou autarquias; sobre clientes que, quando faturaste, já constavam da lista pública de execuções extintas sem bens ou já tinham sido declarados insolventes. Se **cederes (venderes) o crédito**, perdes o direito.
- **Se o cliente pagar depois**: entregas o IVA correspondente na declaração do período em que recebes (art. 78.º-C, n.º 3).
- **IRC**: em paralelo, perdas por imparidade em créditos de cobrança duvidosa (CIRC, arts. 28.º-A e 28.º-B — percentagens crescentes com a antiguidade da mora) e créditos incobráveis como gasto (CIRC, art. 41.º) — ver `references/cobrancas.md`. ENI com contabilidade organizada: confirmar com o contabilista a aplicação destas regras em IRS (a confirmar).

### Ramo — Cliente insolvente ou em PER

- **O cliente foi declarado insolvente ou entrou em PER/PEAP?** → se SIM: **não** prossigas com injunção/execução normal. **Reclama os créditos** ao administrador da insolvência no prazo fixado na sentença (até 30 dias) — guia em `references/insolvencia.md`. Como fornecedor sem garantia és credor comum (recuperação parcial). Vigia publicações de insolvência/PER no Citius.
- Tratamento fiscal de créditos incobráveis (imparidades, regularização de IVA Art. 78.º-A CIVA): ver `references/cobrancas.md` e o ramo do IVA acima (na insolvência, o crédito torna-se incobrável com os factos do art. 78.º-A, n.º 4, CIVA).

## Documentos a usar

- `assets/templates/carta-cobranca-amigavel.md` — 1.º lembrete cordial
- `assets/templates/carta-cobranca-formal-registada.md` — interpelação final com AR
- `assets/templates/carta-cobranca-varias-faturas.md` — interpelação com várias faturas (tabela por fatura, juros e 40 € por fatura)
- `assets/templates/acordo-pagamento-faseado.md` — plano de pagamentos com vencimento antecipado
- `assets/templates/reconhecimento-divida.md` — título de dívida (interrompe a prescrição)
- `calc_prescricao` / `scripts/prescricao.py` — data-limite da prescrição (com o aviso das presuntivas)
- `calc_juros_mora` / `scripts/juros_mora.py` — cálculo dos juros de mora (comercial/civil)
- `calc_juros_lote` / `scripts/juros_mora.py --lote` — juros de várias faturas de uma vez, com 40 € por fatura comercial e totais por cliente
- www.pepex.mj.pt — PEPEX (Lei 32/2014): bens penhoráveis e certidão de incobrabilidade
- `calc_custas_injuncao` / `scripts/custas_injuncao.py` — estimativa da taxa de justiça da injunção
- `references/cobrancas.md` — estratégia escalonada, prescrição, injunção, execução
- `references/insolvencia.md` — reclamação de créditos se o cliente for insolvente
- `references/contencioso.md` — Julgado de Paz, ação declarativa, alçadas

## Quando chamar advogado presencial

- Ação de valor acima da alçada da 1.ª instância (advogado obrigatório) e qualquer recurso.
- Dívida **contestada** (o cliente alega defeito do serviço) — vira litígio, não simples cobrança.
- Há **prazo de prescrição a expirar** e precisas de um ato interruptivo formal sem falhas.
- Cliente **insolvente/PER** com créditos relevantes a reclamar e garantias a graduar.
- Suspeita de **dolo/fraude** (faturas/IBAN adulterados, intenção de não pagar) → também `references/penal-cibercrime.md`.
