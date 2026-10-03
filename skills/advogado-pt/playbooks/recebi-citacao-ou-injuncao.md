# Playbook: Recebi uma citação / injunção / notificação do tribunal

> Quando usar: recebeste um documento de um tribunal, de um agente de execução, de uma entidade administrativa ou uma notificação de injunção, e tens de reagir. Aplica-se a quem está do lado de quem **recebe** (réu/requerido/arguido).

## Passo 0 — Não percas prazos

- ⚠️ **AVISO FORTE: os prazos processuais são PERENTÓRIOS.** Se deixas passar o prazo, perdes o direito de te defender — é, em regra, **irreversível** e o efeito jurídico (condenação, título executivo, coima) consolida-se contra ti. **Não ignores, não deixes para depois.**
- ⏰ **A data que conta é a da receção/citação** indicada no documento. Anota-a imediatamente e conta o prazo a partir dela.
- ⏰ Prazos típicos a confirmar **no próprio documento**:
  - **Contestação de ação declarativa: 30 dias** (CPC, art. 569.º) — prazo **judicial**: contínuo, **suspende-se nas férias judiciais** (CPC, art. 138.º; LOSJ, art. 28.º: 22/12 a 3/1, Domingo de Ramos a Segunda-feira de Páscoa, 16/7 a 31/8), e o termo em dia não útil passa para o dia útil seguinte. Pode acrescer uma **dilação** (ex.: citação feita a terceiro ou fora da comarca — CPC, art. 245.º).
  - **Oposição a injunção: 15 dias** após a notificação (regime anexo ao DL 269/98) — conta-se como os prazos judiciais (contínuo, suspenso nas férias judiciais).
  - **Embargos de executado: 20 dias** após a citação para a execução (CPC, art. 728.º, n.º 1); **oposição à penhora: 10 dias** após a notificação da penhora (CPC, art. 785.º, n.º 1).
  - **Defesa em contraordenação:** o prazo indicado na notificação — laborais (ACT): 15 dias, contados de forma contínua (Lei 107/2009, arts. 6.º e 17.º); trânsito: 15 dias úteis (Código da Estrada).
  - **Recurso (impugnação judicial) da decisão de contraordenação: 20 dias** — regime geral: não contam sábados, domingos e feriados (RGCO, arts. 59.º, n.º 3, e 60.º); laborais: Lei 107/2009, art. 33.º.
- ⏰ Conta o prazo com a tool `calc_prazo` ou com o script (e confirma sempre no documento e, em caso de dúvida, com advogado):
  ```
  python scripts/prazos.py --inicio <AAAA-MM-DD da citação> --dias 30 --tipo judicial
  python scripts/prazos.py --inicio <AAAA-MM-DD da notificação> --dias 15 --tipo judicial
  python scripts/prazos.py --inicio <AAAA-MM-DD> --dias 15 --tipo judicial --urgente   # processos urgentes
  ```
- ⏰ **Passou o último dia?** O ato ainda pode ser praticado nos **3 dias úteis seguintes**, pagando multa (CPC, art. 139.º, n.º 5) — é uma margem de recurso, não um prazo para planear.

## Fluxo de decisão

1. **Identifica o que recebeste** (lê o cabeçalho e o pé do documento):
   - **Citação de ação judicial** (tribunal, "petição inicial", "réu", "contestar") → prazo de **30 dias** · vai ao passo 2.
   - **Notificação de injunção** (Citius/balcão de injunções, "requerido", "deduzir oposição") → prazo de **15 dias** · vai ao passo 3.
   - **Notificação de contraordenação / coima** (ACT, ASAE, CNPD, ANSR, câmara…) → prazo de defesa **indicado na notificação** (laboral: 15 dias contínuos; trânsito: 15 dias úteis) · vai ao passo 4 e a `references/multas.md`. Se for da **AT** (coima fiscal: 30 dias — art. 70.º RGIT) ou outra notificação das Finanças → `playbooks/recebi-notificacao-at.md`.
   - **Citação para a execução / notificação de penhora** (já há título executivo contra ti) → ação executiva em curso: **embargos de executado em 20 dias** (CPC, art. 728.º) e **oposição à penhora em 10 dias** (CPC, art. 785.º) · trata como urgente e vai ao passo 5.

2. **Citação de ação (30 dias)** — **Concordas com o pedido?** → se SIM e podes pagar: negocia/paga e comunica ao tribunal · se NÃO: **contesta no prazo** (impugna factos, deduz exceções, eventual reconvenção). Acima da alçada da 1.ª instância (5.000€) o **advogado é obrigatório** — ver `references/contencioso.md`. **Não contestar = confissão dos factos e condenação provável.**

3. **Injunção (15 dias)** — **A dívida existe e é devida?** → se NÃO (não deves, já pagaste, está prescrita, valor errado): **deduz oposição** no Citius dentro de 15 dias — a oposição faz o processo seguir para tribunal · se SIM (deves mesmo): negocia pagamento/acordo para evitar custas e execução, mas sabe que, **sem oposição, a injunção vira título executivo** e segue para penhora.

4. **Contraordenação (prazo da notificação)** — **Vais aceitar ou defender-te?** → se aceitar (infração clara, coima baixa): verifica se há **pagamento voluntário com redução** no prazo indicado · se defender: apresenta **defesa escrita** (`assets/templates/defesa-contraordenacao.md`) por correio registado dentro do prazo — argumentos comuns: nulidade da notificação, prescrição do procedimento, erro de identificação, falta de culpa, desproporcionalidade (ver `references/multas.md`). Decisão desfavorável → **recurso judicial em 20 dias** (art. 59.º, n.º 3, RGCO; não contam sábados, domingos e feriados — art. 60.º; coimas fiscais: 30 dias — art. 80.º RGIT). Nas coimas **laborais** a impugnação tem, em regra, efeito **meramente devolutivo** — não suspende o pagamento (Lei 107/2009, art. 35.º; ver `references/multas.md`).

5. **Reúne a prova** (qualquer que seja a via): contrato, faturas, recibos, emails/cartas trocadas, comprovativos de pagamento, cronologia dos factos. O ónus da prova distribui-se (Art. 342.º CC): quem invoca um direito prova os factos constitutivos; quem se defende prova os factos extintivos/modificativos (pagamento, prescrição). Organiza o dossier **antes** de redigir a defesa.

6. **Decide se precisas de advogado constituído:**
   - Ação cível de valor **> alçada da 1.ª instância (5.000€)**, causas que admitam sempre recurso, e **todos os recursos** → advogado **obrigatório**.
   - Sem meios económicos? Pede **apoio judiciário** na Segurança Social (dispensa/redução de taxa e patrono nomeado).

## Documentos a usar

- `calc_prazo` (tool MCP) ou `scripts/prazos.py` — contagem do prazo a partir da data da citação/notificação (`--tipo judicial` para contestação, oposição, embargos e recursos)
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
