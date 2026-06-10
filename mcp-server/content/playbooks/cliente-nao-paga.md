# Playbook: Cliente não paga (fatura por cobrar)

> Quando usar: emitiste uma fatura, o prazo de vencimento passou e o cliente não pagou. Serve para serviços/dívidas comerciais entre empresas e a profissionais.

## Passo 0 — Não percas prazos

- ⏰ **Prescrição: 5 anos** para prestação de serviços, créditos comerciais entre empresas, rendas e juros (Art. 310.º CC). Telecom/energia/água: **6 meses**. Regra geral residual: 20 anos (Art. 309.º CC). Detalhe em `references/cobrancas.md`.
- ⏰ A prescrição **interrompe-se** (recomeça do zero) com: citação/notificação judicial avulsa **ou** reconhecimento da dívida pelo devedor por escrito. Se a prescrição estiver perto, força um destes atos JÁ (de preferência o reconhecimento de dívida — ver Documentos).
- ⏰ Os **juros de mora** correm desde o vencimento — começa a contá-los agora, não quando fores a tribunal.

## Fluxo de decisão

1. **A dívida é certa, líquida e exigível?** (valor definido, sem disputa real sobre a qualidade do serviço, prazo vencido) → se SIM: avança · se NÃO (cliente contesta o serviço): trata primeiro o diferendo — vê `references/contencioso.md` (negociação/mediação) e evita injunção, que não serve para créditos contestados.

2. **A prescrição está a aproximar-se dos 5 anos (ou 6 meses)?** → se SIM: salta a fase amigável e vai já para um ato interruptivo (reconhecimento de dívida assinado **ou** injunção/citação) · se NÃO: começa pela cobrança amigável (passo 3).

3. **Já enviaste um lembrete amigável?** → se NÃO: envia o **1.º lembrete cordial** (`assets/templates/carta-cobranca-amigavel.md`), assumindo esquecimento, com cópia da fatura e IBAN · se SIM mas sem resposta em ~8-15 dias: passa ao passo 4.

4. **Houve resposta ao lembrete?** → se NÃO: envia **carta formal registada com AR** (`assets/templates/carta-cobranca-formal-registada.md`) — interpelação final, menção a juros de mora, prazo de 8-15 dias e advertência de ação judicial. A carta registada serve de prova e marca a mora de forma inequívoca.

5. **Calcula os juros de mora** antes de qualquer carta formal ou requerimento, para incluir o valor atualizado:
   ```
   python scripts/juros_mora.py --capital <valor> --data-inicio <vencimento> --tipo comercial
   ```
   - Entre empresas: taxa comercial (BCE + 8 p.p., DL 62/2013). Com consumidor: taxa civil. O script escolhe via `--tipo` (`comercial`|`civil`).

6. **O cliente mostra boa-fé / quer pagar mas não consegue de uma vez?** → se SIM: propõe **acordo de pagamento faseado** (`assets/templates/acordo-pagamento-faseado.md`) com cronograma e cláusula de vencimento antecipado, e/ou faz assinar um **reconhecimento de dívida** (`assets/templates/reconhecimento-divida.md`) — que, além de título, **interrompe a prescrição** · se NÃO (silêncio ou recusa): passo 7.

7. **Qual o valor da dívida?**
   - **≤ 15.000€** → **Injunção** (DL 269/98): requerimento eletrónico no Citius (balcaoj). Rápido e barato. Estima a taxa de justiça:
     ```
     python scripts/custas_injuncao.py --valor <valor>
     ```
     Se o devedor **não se opuser em 15 dias**, é-lhe aposta fórmula executória → **título executivo**.
   - **> 15.000€** ou dívida contestada → **Ação declarativa** no tribunal cível (advogado obrigatório acima da alçada da 1.ª instância — ver `references/contencioso.md`). Alternativa até 15.000€ e litígio simples: **Julgado de Paz**.

8. **O devedor opôs-se à injunção?** → se SIM: a injunção segue para os termos de ação (distribuída como processo declarativo) · se NÃO: obtiveste título executivo → passo 9.

9. **Tens título executivo** (injunção com fórmula executória, sentença, documento com reconhecimento de assinatura, fatura assinada)? → **Ação executiva**: penhora de contas, bens e salários (ver `references/cobrancas.md`).

### Ramo — Cliente insolvente ou em PER

- **O cliente foi declarado insolvente ou entrou em PER/PEAP?** → se SIM: **não** prossigas com injunção/execução normal. **Reclama os créditos** ao administrador da insolvência no prazo fixado na sentença (até 30 dias) — guia em `references/insolvencia.md`. Como fornecedor sem garantia és credor comum (recuperação parcial). Vigia publicações de insolvência/PER no Citius.
- Tratamento fiscal de créditos incobráveis (imparidades, regularização de IVA Art. 78.º-A CIVA): ver `references/cobrancas.md`.

## Documentos a usar

- `assets/templates/carta-cobranca-amigavel.md` — 1.º lembrete cordial
- `assets/templates/carta-cobranca-formal-registada.md` — interpelação final com AR
- `assets/templates/acordo-pagamento-faseado.md` — plano de pagamentos com vencimento antecipado
- `assets/templates/reconhecimento-divida.md` — título de dívida (interrompe a prescrição)
- `scripts/juros_mora.py` — cálculo dos juros de mora (comercial/civil)
- `scripts/custas_injuncao.py` — estimativa da taxa de justiça da injunção
- `references/cobrancas.md` — estratégia escalonada, prescrição, injunção, execução
- `references/insolvencia.md` — reclamação de créditos se o cliente for insolvente
- `references/contencioso.md` — Julgado de Paz, ação declarativa, alçadas

## Quando chamar advogado presencial

- Valor **> 15.000€** ou acima da alçada (advogado obrigatório) e em qualquer recurso.
- Dívida **contestada** (o cliente alega defeito do serviço) — vira litígio, não simples cobrança.
- Há **prazo de prescrição a expirar** e precisas de um ato interruptivo formal sem falhas.
- Cliente **insolvente/PER** com créditos relevantes a reclamar e garantias a graduar.
- Suspeita de **dolo/fraude** (faturas/IBAN adulterados, intenção de não pagar) → também `references/penal-cibercrime.md`.
