# Playbook: Violação de dados pessoais (data breach)

> Quando usar: tomaste conhecimento de um incidente que pode ter exposto, perdido, alterado ou tornado inacessíveis dados pessoais (ex.: base de dados acedida, ransomware, email enviado em massa com destinatários visíveis, portátil perdido, credenciais comprometidas).

## Passo 0 — Não percas prazos

- ⏰ **72 HORAS para notificar a CNPD** (Art. 33.º RGPD), a contar do momento em que tomas **conhecimento** da violação — salvo se for improvável que resulte risco para os direitos e liberdades dos titulares. **O relógio já começou.** Se notificares depois das 72h, tens de justificar o atraso.
- ⏰ **Notificação aos titulares** (Art. 34.º): **sem demora injustificada** se houver **risco elevado**.
- ⏰ Se fores entidade abrangida por **NIS2**: *early warning* em **24h** e notificação em **72h** à autoridade (CNCS) — em paralelo com a CNPD. Ver `references/digital-ue.md`.
- ⏰ Se houve **crime** (acesso ilegítimo, ransomware, burla/BEC): a queixa-crime tem prazo de **6 meses** (crimes semi-públicos) — mas **preserva a prova digital JÁ** (não limpes sistemas antes de cópia forense). Ver `references/penal-cibercrime.md`.

## Fluxo de decisão

1. **Confirma que é mesmo uma violação de dados pessoais** (perda de confidencialidade, integridade ou disponibilidade de dados pessoais). → se for só um incidente técnico sem dados pessoais envolvidos: trata como incidente de segurança normal · se envolve dados pessoais: avança e **começa a documentar com hora** (deteção, ações, decisões).

2. **CONTÉM o incidente primeiro** (antes de notificar): isola sistemas afetados, revoga/altera credenciais, ativa 2FA, corta o vetor de ataque, repõe a partir de backups limpos. ⚠️ **Não destruas prova** — faz cópia forense antes de "limpar" se houver suspeita de crime.

3. **Avalia o risco para os titulares.** Pondera: natureza dos dados (sensíveis? financeiros? credenciais?), volume, número de pessoas afetadas, facilidade de identificação, possibilidade de dano (fraude, roubo de identidade, discriminação). → **Há risco para os direitos e liberdades?**
   - **Improvável que haja risco** → podes **não notificar a CNPD**, mas **documenta internamente** a violação e a fundamentação (passo 5).
   - **Há risco** → **notifica a CNPD em 72h** (passo 4).

4. **Notifica a CNPD (Art. 33.º)** com o conteúdo mínimo: natureza da violação, categorias e número aproximado de titulares e de registos, contacto do DPO/ponto de contacto, consequências prováveis, medidas tomadas/propostas. Se não tiveres toda a informação, notifica por **fases** dentro do prazo.

5. **O risco para os titulares é ELEVADO?** → se SIM: **notifica também os titulares** (Art. 34.º) em linguagem clara, com a natureza da violação, contacto, consequências prováveis e medidas/recomendações (ex.: mudar passwords) · se NÃO (mas há risco "normal"): basta a CNPD + documentação. Exceção: dispensa-se a comunicação aos titulares se os dados estavam **cifrados** de forma robusta, se foram tomadas medidas que afastam o risco elevado, ou se a comunicação individual exigir esforço desproporcionado (então comunicação pública).

6. **Documenta internamente TODAS as violações** (mesmo as não notificadas) — facto, efeitos e medidas corretivas (Art. 33.º n.º 5). É a prova do teu *accountability* perante a CNPD. Usa/atualiza o procedimento interno de data breach (ver `references/rgpd.md`, secção Templates).

7. **Aciona o seguro cyber.** → tens apólice cyber? → se SIM: **participa o sinistro dentro do prazo da apólice** (frequentemente 8 dias) — cobre tipicamente notificação, forense, resposta a incidente e, por vezes, responsabilidade a terceiros. Confirma exclusões (falta de MFA/backups, atos de guerra). Ver `references/seguros.md` e `assets/templates/carta-participacao-sinistro.md`.

8. **Revê obrigações de regulação digital UE.** → és **entidade essencial/importante NIS2** ou fornecedor TIC de quem o seja? → notifica também a autoridade NIS2 (24h/72h). Vendes **produtos digitais** (CRA)? → dever de comunicar vulnerabilidades exploradas. Ver `references/digital-ue.md`.

9. **Avalia se há crime.** Houve **acesso ilegítimo, ransomware, exfiltração, BEC**? → se SIM: apresenta **queixa-crime** (PJ-UNC3T / queixaselectronicas.mai.gov.pt), preserva prova e considera constituir-te assistente. Passo-a-passo (incl. resposta a BEC/transferência desviada) em `references/penal-cibercrime.md`.

## Documentos a usar

- `references/rgpd.md` — obrigações de violação de dados, Art. 33.º/34.º, procedimento interno, coimas
- `references/digital-ue.md` — NIS2 (24h/72h), CRA, autoridade CNCS
- `references/penal-cibercrime.md` — queixa-crime, BEC, preservação de prova, constituição de assistente
- `references/seguros.md` — seguro cyber: coberturas, exclusões, prazos de participação
- `assets/templates/carta-participacao-sinistro.md` — participação do sinistro à seguradora

## Quando chamar advogado presencial

- **Risco elevado para muitos titulares** ou dados sensíveis/financeiros — a redação das notificações à CNPD e aos titulares tem consequências jurídicas e reputacionais.
- Dúvida séria sobre **notificar ou não** (a margem de apreciação do risco é delicada e a coima por falha pode ser pesada).
- Incidente com **componente criminal** (ransomware, exfiltração, BEC) e prova a preservar.
- Sobreposição de obrigações **RGPD + NIS2 + CRA** ou cliente/fornecedor que invoca o contrato.
- Pedido de coima, inspeção ou processo da CNPD na sequência da violação.
