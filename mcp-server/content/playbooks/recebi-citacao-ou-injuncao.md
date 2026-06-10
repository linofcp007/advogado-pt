# Playbook: Recebi uma citação / injunção / notificação do tribunal

> Quando usar: recebeste um documento de um tribunal, de um agente de execução, de uma entidade administrativa ou uma notificação de injunção, e tens de reagir. Aplica-se a quem está do lado de quem **recebe** (réu/requerido/arguido).

## Passo 0 — Não percas prazos

- ⚠️ **AVISO FORTE: os prazos processuais são PERENTÓRIOS.** Se deixas passar o prazo, perdes o direito de te defender — é, em regra, **irreversível** e o efeito jurídico (condenação, título executivo, coima) consolida-se contra ti. **Não ignores, não deixes para depois.**
- ⏰ **A data que conta é a da receção/citação** indicada no documento. Anota-a imediatamente e conta o prazo a partir dela.
- ⏰ Prazos típicos a confirmar **no próprio documento**:
  - **Contestação de ação declarativa: 30 dias** (Art. 569.º CPC) — dias corridos, com regime processual próprio.
  - **Oposição a injunção: 15 dias** após a notificação.
  - **Defesa em contraordenação: 15 dias úteis** após a notificação.
  - **Recurso de decisão de contraordenação: 20 dias úteis** após a notificação da decisão administrativa.
- ⏰ Conta o prazo com o script (e confirma sempre no documento e, em caso de dúvida, com advogado):
  ```
  python scripts/prazos.py --inicio <AAAA-MM-DD da receção> --dias 15 --tipo uteis
  python scripts/prazos.py --inicio <AAAA-MM-DD da receção> --dias 30 --tipo corridos
  ```

## Fluxo de decisão

1. **Identifica o que recebeste** (lê o cabeçalho e o pé do documento):
   - **Citação de ação judicial** (tribunal, "petição inicial", "réu", "contestar") → prazo de **30 dias** · vai ao passo 2.
   - **Notificação de injunção** (Citius/balcão de injunções, "requerido", "deduzir oposição") → prazo de **15 dias** · vai ao passo 3.
   - **Notificação de contraordenação / coima** (ACT, ASAE, CNPD, ANSR, AT, câmara…) → prazo de **15 dias úteis** para defesa · vai ao passo 4 e a `references/multas.md`.
   - **Notificação de agente de execução / penhora** (já há título executivo contra ti) → ação executiva em curso; reação por embargos tem prazo curto · trata como urgente e vai ao passo 5.

2. **Citação de ação (30 dias)** — **Concordas com o pedido?** → se SIM e podes pagar: negocia/paga e comunica ao tribunal · se NÃO: **contesta no prazo** (impugna factos, deduz exceções, eventual reconvenção). Acima da alçada da 1.ª instância (5.000€) o **advogado é obrigatório** — ver `references/contencioso.md`. **Não contestar = confissão dos factos e condenação provável.**

3. **Injunção (15 dias)** — **A dívida existe e é devida?** → se NÃO (não deves, já pagaste, está prescrita, valor errado): **deduz oposição** no Citius dentro de 15 dias — a oposição faz o processo seguir para tribunal · se SIM (deves mesmo): negocia pagamento/acordo para evitar custas e execução, mas sabe que, **sem oposição, a injunção vira título executivo** e segue para penhora.

4. **Contraordenação (15 dias úteis)** — **Vais aceitar ou defender-te?** → se aceitar (infração clara, coima baixa): verifica se há **pagamento voluntário com redução** no prazo indicado · se defender: apresenta **defesa escrita** (`assets/templates/defesa-contraordenacao.md`) por correio registado dentro do prazo — argumentos comuns: nulidade da notificação, prescrição do procedimento, erro de identificação, falta de culpa, desproporcionalidade (ver `references/multas.md`). Decisão desfavorável → **recurso judicial em 20 dias úteis** (suspende a execução, em regra).

5. **Reúne a prova** (qualquer que seja a via): contrato, faturas, recibos, emails/cartas trocadas, comprovativos de pagamento, cronologia dos factos. O ónus da prova distribui-se (Art. 342.º CC): quem invoca um direito prova os factos constitutivos; quem se defende prova os factos extintivos/modificativos (pagamento, prescrição). Organiza o dossier **antes** de redigir a defesa.

6. **Decide se precisas de advogado constituído:**
   - Ação cível de valor **> alçada da 1.ª instância (5.000€)**, causas que admitam sempre recurso, e **todos os recursos** → advogado **obrigatório**.
   - Sem meios económicos? Pede **apoio judiciário** na Segurança Social (dispensa/redução de taxa e patrono nomeado).

## Documentos a usar

- `scripts/prazos.py` — contagem do prazo (dias úteis ou corridos) a partir da data de receção
- `assets/templates/defesa-contraordenacao.md` — defesa escrita genérica de contraordenação
- `references/contencioso.md` — ação declarativa, fases, alçadas, advogado obrigatório, apoio judiciário, prova
- `references/multas.md` — contraordenações: defesa, prazos, recurso, argumentos por entidade (ACT/ASAE/CNPD/ANSR/AT)
- `references/cobrancas.md` — lado da injunção/execução (para perceberes o que o credor está a fazer)

## Quando chamar advogado presencial

- **SEMPRE que houver um prazo judicial a correr e tiveres a mínima dúvida** — a perda do prazo é irreversível. Não esperes pelo último dia.
- Ação de valor **acima da alçada** (advogado obrigatório) ou qualquer **recurso**.
- Citação que não percebes, notificação que parece inválida, ou pedido de valor elevado.
- Penhora/execução já em curso contra ti (embargos têm prazos curtos).
- Contraordenação com **coima alta** ou **sanção acessória** (suspensão de licença, encerramento).
