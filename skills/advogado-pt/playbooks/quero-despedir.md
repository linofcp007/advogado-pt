# Playbook: Quero cessar o contrato de um trabalhador

> Quando usar: pretendes terminar o contrato de um trabalhador e precisas de escolher o fundamento certo, cumprir as formalidades e calcular a compensação devida.

## Passo 0 — Não percas prazos

- ⚠️ **AVISO FORTE: o despedimento ilícito gera reintegração do trabalhador + indemnização** (salários intercalares + indemnização por antiguidade). Um erro de fundamento, de forma ou de prazo pode custar muito mais do que uma cessação bem feita. **Valida antes de avançar.**
- ⏰ **Justa causa / processo disciplinar**: o procedimento disciplinar tem de **começar nos 60 dias** seguintes ao conhecimento da infração pelo empregador (ou pelo superior com competência disciplinar), e o poder disciplinar **prescreve 1 ano** após a prática do facto (CT, art. 329.º, n.os 1 e 2). Não deixes arrastar.
- ⏰ **Resposta à nota de culpa**: o trabalhador tem **10 dias úteis** para responder e requerer diligências (CT, art. 355.º) — tens de aguardar este prazo antes de decidir.
- ⏰ **Decisão**: concluídas as diligências, tens **30 dias** para proferir a decisão de despedimento, sob pena de caducidade do direito de aplicar a sanção (CT, art. 357.º, n.º 1).
- ⏰ **Do lado do trabalhador**: pode opor-se ao despedimento em tribunal no prazo de **60 dias** a contar da comunicação (CT, art. 387.º, n.º 2) — conserva todo o processo.
- ⏰ **Trabalhadora grávida, puérpera ou lactante, ou trabalhador em licença parental**: o despedimento exige **parecer prévio da CITE** antes da decisão (CT, art. 63.º); se o parecer for desfavorável, só o tribunal pode reconhecer o motivo justificativo.
- ⏰ **Período experimental**: durante o período experimental podes **denunciar sem invocar justa causa** (com aviso prévio se já decorreram certos períodos). Confirma se ainda estás dentro dele — muda tudo. Períodos em `references/laboral.md`.

## Fluxo de decisão

1. **Estás dentro do período experimental?** (90/180/240 dias sem termo; 15/30 dias a termo) → se SIM: podes **denunciar livremente**, sem fundamento, respeitando o aviso prévio aplicável (7 ou 30 dias, se o período experimental já durou mais de 60 ou de 120 dias — CT, art. 114.º). É a via mais simples — não precisas de processo disciplinar · se NÃO: passo 2.

2. **Qual é o fundamento real da cessação?**
   - **Facto imputável ao trabalhador** (comportamento grave: faltas injustificadas, insubordinação, violação de deveres) → **justa causa** · passo 3.
   - **Razões da empresa** (o posto deixou de fazer sentido, reestruturação) → **extinção do posto de trabalho** · passo 4.
   - **As duas partes querem terminar** de forma negociada → **mútuo acordo (revogação)** · passo 5.
   - **Inadaptação** após formação/alterações no posto → procedimento próprio (próximo da extinção do posto; ver `references/laboral.md`).

3. **Justa causa → processo disciplinar OBRIGATÓRIO.** Tens prova suficiente do facto? → se NÃO: reúne prova antes (testemunhos, registos, comunicações) · se SIM:
   - Elabora e entrega a **nota de culpa** ao trabalhador (`assets/templates/nota-de-culpa.md`) — descrição circunstanciada dos factos e da intenção de despedir.
   - Aguarda a **resposta** (10 dias úteis) e realiza as diligências requeridas que sejam pertinentes.
   - Profere **decisão fundamentada** por escrito no prazo de **30 dias** após as diligências (CT, art. 357.º) e comunica-a ao trabalhador. Se houver comissão de trabalhadores/sindicato, há comunicações próprias; se o trabalhador estiver protegido (parentalidade), pede antes o parecer da CITE (CT, art. 63.º).
   - ⚠️ Vícios neste processo = despedimento ilícito. Sequência mínima: **nota de culpa → resposta → instrução → decisão**.

4. **Extinção do posto de trabalho** → critérios legais rigorosos (o posto tem de desaparecer efetivamente; não pode haver outro idêntico; critérios objetivos e não discriminatórios para escolher quem sai). Há comunicações e prazos próprios. **Compensação: 14 dias/ano** (Arts. 372.º e 366.º CT). Confirma a viabilidade em `references/laboral.md` — é frequentemente impugnada.

5. **Mútuo acordo (revogação)** → a via mais segura e sem litígio. Negoceia a compensação e formaliza o **acordo de revogação** (`assets/templates/acordo-revogacao.md`), por escrito, com indicação do montante e da data de cessação. O trabalhador tem **direito de retratação de 7 dias** (se a assinatura não for presencial com reconhecimento) — tê-lo em conta.

6. **Calcula a compensação devida** (qualquer via com indemnização):
   ```
   python scripts/compensacao_despedimento.py --retribuicao-base <valor> --diuturnidades <valor> --admissao AAAA-MM-DD --cessacao AAAA-MM-DD --modalidade <sem-termo|extincao-posto|coletivo|termo>
   ```
   - **Sem termo / coletivo: 14 dias** de retribuição base + diuturnidades por ano completo.
   - **Extinção do posto / inadaptação: 14 dias/ano** (remetem para o Art. 366.º).
   - **Caducidade de contrato a termo: 24 dias/ano**.
   - **Sem mínimo de 3 meses** (só no regime transitório dos contratos anteriores a 1/11/2011); tetos de 20 RMMG na retribuição e 12 meses (ou 240 RMMG) no total.
   - Antiguidade anterior a 1/5/2023 tem **regras transitórias por períodos** (30/20/18/12 dias) — o script calcula por períodos quando lhe dás as datas. Valores em `references/valores-2026.md`.

7. **Cumpre as formalidades finais**: documento de cessação, certificado de trabalho, acerto de contas (férias e subsídios vencidos e proporcionais, formação não dada), comunicação à Segurança Social e situação de desemprego. Paga a compensação no prazo.

## Documentos a usar

- `assets/templates/nota-de-culpa.md` — abertura do processo disciplinar (justa causa)
- `assets/templates/acordo-revogacao.md` — cessação por mútuo acordo
- `scripts/compensacao_despedimento.py` — cálculo da compensação por modalidade e antiguidade
- `references/laboral.md` — cessação do contrato, fundamentos, processo disciplinar, compensações, períodos experimentais
- `references/valores-2026.md` — dias de compensação, salário mínimo e taxas atualizadas

## Quando chamar advogado presencial

- **Despedimento por justa causa** — qualquer falha no processo disciplinar torna-o ilícito; vale a pena validar a nota de culpa e a decisão.
- **Extinção do posto de trabalho** ou **despedimento coletivo** — critérios e procedimento complexos, alto risco de impugnação.
- Trabalhador **protegido** (grávida, parental, representante sindical) ou com indícios de discriminação.
- Quando o montante da compensação ou os salários intercalares em risco forem elevados.
- Dúvidas sobre **requalificação** de prestadores de serviços ("falsos recibos verdes") antes de cessar — ver `references/laboral.md`.
