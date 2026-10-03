# Playbook: Preciso de reduzir ou suspender a atividade (lay-off)

> Quando usar: a empresa (ENI, Lda, SA, de qualquer setor) atravessa uma crise — quebra de encomendas, perda de um cliente importante, reestruturação, avaria ou obra que para a produção, catástrofe — e precisas de **reduzir horários ou suspender contratos temporariamente** para manter os postos de trabalho. É o regime de "redução ou suspensão em situação de crise empresarial" dos **arts. 298.º a 308.º do Código do Trabalho** (CT). Se a crise é definitiva e precisas de cortar postos, vê `playbooks/despedimento-coletivo.md`. Âmbito: nacional. Montantes (RMMG, IAS) em `references/valores-2026.md`; dimensão e estruturas representativas no perfil (`.advogado-pt/perfil-empresa.md`, tool `obter_perfil_empresa`).

## Passo 0 — Não percas prazos

- ⚠️ **AVISO**: lay-off sem fundamento real, sem as comunicações ou com despedimentos durante a medida obriga a **devolver os apoios** da Segurança Social (art. 303.º, n.º 3, CT), dá contraordenações e permite à ACT **pôr termo à medida** (art. 307.º, n.º 2). Documenta tudo.
- ⏰ **5 dias** — sem comissão de trabalhadores nem estruturas sindicais, os trabalhadores a abranger podem, nos 5 dias seguintes à receção da comunicação de intenção, designar uma **comissão representativa** (3 membros até 20 trabalhadores abrangidos; 5 acima) — art. 299.º, n.º 3.
- ⏰ **5 dias** — a **fase de informações e negociação** começa nos 5 dias posteriores à comunicação/envio da informação (art. 300.º, n.º 1).
- ⏰ **5 dias** — sem acordo, só podes **comunicar a decisão** a cada trabalhador decorridos 5 dias sobre o envio da informação (ou da comunicação individual) — art. 300.º, n.º 3. Na **mesma data** envias a ata e a relação dos trabalhadores à estrutura representativa e à Segurança Social (n.º 4).
- ⏰ **Início** — a medida só começa decorridos **5 dias** sobre a comunicação da decisão, ou de imediato havendo acordo (com a estrutura, a comissão ou a maioria dos abrangidos) ou impedimento imediato que os trabalhadores conheçam (art. 301.º, n.º 2).
- ⏰ **Duração máxima** — **6 meses**, ou **1 ano** em caso de catástrofe ou ocorrência que tenha afetado gravemente a atividade; **prorrogável** por até **6 meses**, com comunicação escrita e fundamentada (art. 301.º, n.os 1 e 3).
- ⏰ **Proibição de despedir** os abrangidos durante a medida e nos **30 dias** seguintes (medida até 6 meses) ou **60 dias** (medida superior a 6 meses) — art. 303.º, n.º 2.
- ⏰ **Novo lay-off** — só depois de decorrido um período equivalente a **metade** do anterior, salvo acordo (art. 298.º-A).
- Conta e regista os prazos com `calc_prazo` e `registar_prazo` (estes prazos do CT contam-se em dias seguidos — confirma caso a caso).

## Fluxo de decisão

1. **Há fundamento legal?** O lay-off exige **motivos de mercado, estruturais ou tecnológicos, catástrofes ou outras ocorrências** que tenham afetado gravemente a atividade normal, e que a medida seja **indispensável** para assegurar a viabilidade da empresa e a manutenção dos postos de trabalho (art. 298.º, n.º 1) → se SIM: passo 2 · se a quebra é curta, sazonal ou previsível: considera primeiro as alternativas (passo 10) · se a crise é definitiva e já sabes que vais cortar postos: `playbooks/despedimento-coletivo.md` (a negociação do despedimento coletivo pode incluir suspensões e reduções — art. 361.º, n.º 2).

2. **A situação contributiva está regularizada** perante as Finanças e a Segurança Social? É condição de acesso (art. 298.º, n.º 4), salvo empresa declarada em situação económica difícil ou em processo de recuperação (n.º 3) → se NÃO: regulariza ou pede plano prestacional antes de avançar (ver `playbooks/recebi-notificacao-at.md` e `assets/templates/pedido-pagamento-prestacoes-at.md`).

3. **Desenha a medida** (o que vais comunicar):
   - **Redução** (um ou mais períodos normais de trabalho, diários ou semanais, eventualmente por grupos em rotação, ou diminuição do número de horas — art. 298.º, n.º 2) **ou suspensão** dos contratos.
   - Trabalhadores abrangidos, por secção, com **critérios de seleção** objetivos e não discriminatórios.
   - Duração (passo 0) e áreas de **formação profissional**, se houver.
   - Reúne a prova da crise (contas, quebra de faturação/encomendas, cancelamentos, relatórios técnicos) — tem de ficar **disponível para consulta** (art. 299.º, n.º 2).

4. **Comunicação de intenção, por escrito** (art. 299.º):
   - **A quem**: comissão de trabalhadores → na falta, comissão intersindical ou comissões sindicais representativas dos trabalhadores a abranger → na falta destas, **a cada trabalhador** a abranger (n.º 3), enviando depois a informação à comissão representativa que designem (n.º 4).
   - **Conteúdo obrigatório** (n.º 1): a) fundamentos económicos, financeiros ou técnicos; b) quadro de pessoal discriminado por secções; c) critérios de seleção; d) número e categorias dos trabalhadores a abranger; e) prazo de aplicação; f) áreas de formação, se for o caso.
   - Entrega contra recibo ou por carta registada com AR; guarda cópias.

5. **Fase de informações e negociação** (art. 300.º, n.os 1 e 2): reuniões com a estrutura representativa para um acordo sobre a modalidade, âmbito e duração. Faz **ata** com o acordado e as posições divergentes. Sem ata, envia um documento que justifique a falta e descreva o acordo ou as razões do desacordo (n.º 5).

6. **Decisão e comunicações** (art. 300.º, n.os 3 a 5):
   - Comunica **por escrito a cada trabalhador** a medida decidida, com o **fundamento** e as **datas de início e termo**.
   - Na mesma data, remete à estrutura representativa e à **Segurança Social** a ata e a **relação nominal** (nome, morada, datas de nascimento e admissão, situação perante a SS, profissão, categoria, retribuição, medida individual e datas).
   - Pede o **apoio financeiro** à Segurança Social pelo meio e formulário em vigor (Segurança Social Direta; procedimento regulado por portaria — art. 300.º, n.º 6) [VERIFICAR — formulário, documentos exigidos e prazos no Guia Prático "Regime de Layoff" em seg-social.pt].
   - Se houver formação: elabora o **plano de formação**, ouvidos os trabalhadores e com parecer da estrutura representativa em prazo não inferior a 5 dias (art. 302.º); o plano é aprovado pelo IEFP para efeitos do apoio do art. 305.º, n.º 5.

7. **Quanto recebe o trabalhador e quem paga** (arts. 305.º e 306.º):
   - Garantia mínima mensal: **2/3 da retribuição normal ilíquida** ou a **RMMG** correspondente ao seu período normal de trabalho, o que for **mais elevado** (art. 305.º, n.º 1, al. a)).
   - Na **redução**, a retribuição é proporcional às horas trabalhadas (n.º 2). A **compensação retributiva** é o necessário para, somada à retribuição do trabalho prestado (na empresa ou fora dela), assegurar aquele mínimo, **até ao triplo da RMMG** (n.º 3) — confirma no Guia Prático da SS como o limite é aplicado no cálculo (a confirmar). RMMG em `references/valores-2026.md`.
   - A compensação retributiva é paga **pelo empregador ao trabalhador**: **30%** a cargo do empregador e **70%** a cargo da Segurança Social, que entrega a sua parte à empresa (n.os 4 e 6).
   - Com **formação** aprovada: acresce um valor de **30% do IAS**, pago pelo IEFP, metade para o empregador e metade para o trabalhador (n.º 5). IAS em `references/valores-2026.md`.
   - **Férias** e **subsídio de férias**: não são afetados — o subsídio de férias é pago por inteiro pelo empregador; **subsídio de Natal** por inteiro, pago pela SS em montante igual a metade da compensação retributiva e pelo empregador no restante (art. 306.º).
   - Doença durante a suspensão: o trabalhador mantém a compensação retributiva, não recebe subsídio de doença (art. 305.º, n.º 7).
   - Contribuições: o trabalhador desconta sobre a retribuição e a compensação (art. 304.º, n.º 1, al. a)); o empregador paga as contribuições sobre a retribuição auferida (art. 303.º, n.º 1, al. b)) — confirma no Guia Prático da SS a base de incidência da compensação retributiva para a parte do empregador (a confirmar).
   - Para estimar o custo mensal por trabalhador antes e durante a medida, usa `calc_custo_trabalhador`.

8. **Durante a medida — deveres do empregador** (art. 303.º, n.º 1): pagar **pontualmente** a compensação e as contribuições; **não distribuir lucros**, sob qualquer forma (incluindo levantamentos por conta); **não aumentar** a remuneração dos membros dos corpos sociais enquanto a SS comparticipar; **não admitir nem renovar** contratos para postos que possam ser ocupados por trabalhadores em lay-off; **não despedir** os abrangidos (exceto cessação de comissão de serviço, caducidade de contrato a termo ou despedimento com justa causa) durante a medida e nos 30/60 dias seguintes (n.º 2). Informa **trimestralmente** a estrutura representativa (ou os trabalhadores) da evolução das razões da medida (art. 307.º, n.º 1). Os delegados sindicais e membros de estruturas representativas mantêm o exercício das funções (art. 308.º).
   - Deveres do trabalhador (art. 304.º): frequentar a formação; se exercer **outra atividade remunerada**, comunicá-lo em **5 dias** (pode reduzir a compensação). O incumprimento faz perder a compensação e é infração disciplinar grave (n.º 2).

9. **A medida vai terminar** → se a crise passou: retoma normal, controla o período de proibição de despedimento (30/60 dias) e o intervalo mínimo antes de um novo lay-off (art. 298.º-A) · se precisas de mais tempo: **prorrogação** até 6 meses com comunicação escrita fundamentada (art. 301.º, n.os 3 e 4) · se a empresa não é viável: avalia despedimento coletivo (`playbooks/despedimento-coletivo.md`) ou insolvência/PER (`references/insolvencia.md`), respeitando a proibição de despedir os abrangidos no período do art. 303.º, n.º 2.

10. **Alternativas ao lay-off** (ou complementos):
    - **Gestão do tempo de trabalho**: adaptabilidade e banco de horas previstos no IRCT ou em regime grupal (arts. 204.º a 208.º-B CT — confirmar o regime aplicável); encerramento para férias (art. 242.º).
    - **Encerramento ou diminuição temporária** de atividade que não seja crise empresarial: o trabalhador mantém **75%** da retribuição (caso fortuito ou força maior) ou a **totalidade** (facto imputável ao empregador) — art. 309.º.
    - **Acordos individuais**: redução de horário por acordo, teletrabalho (`assets/templates/acordo-teletrabalho.md`), licenças sem retribuição a pedido do trabalhador.
    - **Regimes extraordinários** criados para situações específicas — ex. o lay-off simplificado do DL 31-C/2026, de 5 de fevereiro, para zonas afetadas pela tempestade "Kristin" (a confirmar vigência, âmbito geográfico e prazos). Confirma também apoios do IEFP à manutenção do emprego em vigor.

## Documentos a usar

- `references/laboral.md` — enquadramento do contrato de trabalho e da cessação
- `assets/templates/acordo-teletrabalho.md` — alternativa por acordo individual
- `assets/templates/pedido-pagamento-prestacoes-at.md` — regularizar dívidas fiscais antes do lay-off
- `playbooks/despedimento-coletivo.md` — se a redução de pessoal for inevitável
- `playbooks/recebi-notificacao-at.md` — dívidas e notificações das Finanças
- `references/insolvencia.md` — PER e insolvência, se a empresa não for viável
- `references/valores-2026.md` — RMMG e IAS do ano
- Tools `calc_prazo` / `registar_prazo` — prazos de 5 dias, início, termo, 30/60 dias e intervalo do art. 298.º-A
- Tool `calc_custo_trabalhador` — custo mensal do trabalhador para comparar cenários
- Tool `obter_perfil_empresa` — dimensão, IRCT e estruturas representativas

## Quando chamar advogado presencial

- Há **comissão de trabalhadores ou sindicatos** ativos e a negociação é tensa, ou o IRCT tem regras próprias.
- A empresa tem **dívidas à SS ou às Finanças** e precisas de enquadrar a exceção do art. 298.º, n.os 3 e 4 (situação económica difícil, PER).
- Pretendes **despedir** durante ou logo após o lay-off, ou combinar lay-off com despedimento coletivo.
- A medida abrange trabalhadores **protegidos** (grávidas, em licença parental, representantes dos trabalhadores) ou há indícios de seleção discriminatória.
- A SS ou a ACT questionam o fundamento ou exigem a **devolução de apoios**.
