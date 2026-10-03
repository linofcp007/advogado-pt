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

5. **Calcula os juros de mora** antes de qualquer carta formal ou requerimento, para incluir o valor atualizado:
   ```
   python scripts/juros_mora.py --capital <valor> --data-inicio <vencimento> --tipo comercial
   ```
   - Entre empresas: taxa comercial (BCE + 8 p.p., DL 62/2013). Com consumidor: taxa civil. O script escolhe via `--tipo` (`comercial`|`civil`). Tool MCP: `calc_juros_mora`.
   - Entre empresas tens ainda direito a uma **indemnização mínima de 40 €** pelos custos de cobrança, sem precisar de interpelação, e aos custos razoáveis que a excedam (DL 62/2013, art. 7.º).

6. **O cliente mostra boa-fé / quer pagar mas não consegue de uma vez?** → se SIM: propõe **acordo de pagamento faseado** (`assets/templates/acordo-pagamento-faseado.md`) com cronograma e cláusula de vencimento antecipado, e/ou faz assinar um **reconhecimento de dívida** (`assets/templates/reconhecimento-divida.md`) — que **interrompe a prescrição** e, se **autenticado** por notário, advogado ou solicitador, é também título executivo · se NÃO (silêncio ou recusa): passo 7.

7. **Que via usar?**
   - **Dívida entre empresas (transação comercial)** → **Injunção, independentemente do valor** (DL 62/2013, art. 10.º): requerimento eletrónico no Balcão Nacional de Injunções. Se houver oposição e o valor for elevado, segue como ação comum no tribunal.
   - **Outras dívidas** → **Injunção** até 15.000 € (DL 269/98); acima disso, **ação declarativa** no tribunal cível (advogado obrigatório acima da alçada da 1.ª instância — ver `references/contencioso.md`). Litígio simples até 15.000 €: também **Julgado de Paz**.
   - Estima a taxa de justiça da injunção (tool `calc_custas_injuncao`):
     ```
     python scripts/custas_injuncao.py --valor <valor>
     ```
   - Se o devedor **não se opuser em 15 dias**, é aposta fórmula executória → **título executivo**.
   - Dívida contestada (o cliente alega defeito) → a injunção não é a via certa: ação declarativa ou meio alternativo (ver passo 1).

8. **O devedor opôs-se à injunção?** → se SIM: a injunção segue para os termos de ação (distribuída como processo declarativo) · se NÃO: obtiveste título executivo → passo 9.

9. **Tens título executivo** (injunção com fórmula executória, sentença, documento de reconhecimento de dívida **autenticado** por notário, advogado ou solicitador — art. 703.º, n.º 1, al. b), CPC; uma fatura ou um documento só com assinatura, mesmo reconhecida, já não basta)? → **Ação executiva**: penhora de contas, bens e salários (ver `references/cobrancas.md`).

### Ramo — Cliente insolvente ou em PER

- **O cliente foi declarado insolvente ou entrou em PER/PEAP?** → se SIM: **não** prossigas com injunção/execução normal. **Reclama os créditos** ao administrador da insolvência no prazo fixado na sentença (até 30 dias) — guia em `references/insolvencia.md`. Como fornecedor sem garantia és credor comum (recuperação parcial). Vigia publicações de insolvência/PER no Citius.
- Tratamento fiscal de créditos incobráveis (imparidades, regularização de IVA Art. 78.º-A CIVA): ver `references/cobrancas.md`.

## Documentos a usar

- `assets/templates/carta-cobranca-amigavel.md` — 1.º lembrete cordial
- `assets/templates/carta-cobranca-formal-registada.md` — interpelação final com AR
- `assets/templates/acordo-pagamento-faseado.md` — plano de pagamentos com vencimento antecipado
- `assets/templates/reconhecimento-divida.md` — título de dívida (interrompe a prescrição)
- `calc_prescricao` / `scripts/prescricao.py` — data-limite da prescrição (com o aviso das presuntivas)
- `calc_juros_mora` / `scripts/juros_mora.py` — cálculo dos juros de mora (comercial/civil)
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
