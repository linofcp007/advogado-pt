# Playbook: Despedimento coletivo

> Quando usar: a empresa precisa de fazer cessar contratos de **vários trabalhadores** por encerramento de uma ou mais secções (ou estrutura equivalente) ou por redução de pessoal, por **motivos de mercado, estruturais ou tecnológicos** — e o número de trabalhadores abrangidos num período de **3 meses** atinge **2** (microempresa ou pequena empresa: menos de 50 trabalhadores) ou **5** (média ou grande empresa: 50 ou mais) — art. 359.º do Código do Trabalho (CT). A dimensão conta-se pela média de trabalhadores do ano civil anterior (art. 100.º CT): confirma no perfil (`.advogado-pt/perfil-empresa.md`, tool `obter_perfil_empresa`). Abaixo destes números, a via é a **extinção do posto de trabalho** (comparação no fim). Se a crise for temporária, vê antes `playbooks/lay-off.md`. Âmbito: nacional. Montantes (RMMG) em `references/valores-2026.md`.

## Passo 0 — Não percas prazos

- ⚠️ **AVISO FORTE**: o despedimento coletivo é **ilícito** se faltar a comunicação inicial ou a fase de negociação, se decidires antes do prazo ou se a compensação e os créditos não estiverem **à disposição do trabalhador até ao fim do aviso prévio** (art. 383.º CT), além dos fundamentos gerais (art. 381.º — ex. motivo improcedente). A ilicitude dá **reintegração** (ou indemnização de 15 a 45 dias por ano, mínimo 3 meses — art. 391.º) **mais salários intercalares** (art. 390.º). Valida o dossier antes de comunicar.
- ⏰ **No próprio dia** da comunicação de intenção, envia cópia à **DGERT** (serviço do ministério do trabalho que acompanha a contratação coletiva) — art. 360.º, n.º 5.
- ⏰ **5 dias úteis** — sem comissão de trabalhadores nem estruturas sindicais, os trabalhadores abrangidos podem, a contar da receção da comunicação, designar uma **comissão representativa** (máx. 3 membros até 5 trabalhadores abrangidos; 5 membros acima) — art. 360.º, n.º 3, al. b).
- ⏰ **5 dias** — a **fase de informações e negociação** começa nos 5 dias posteriores à comunicação (art. 361.º, n.º 1).
- ⏰ **15 dias** — sem acordo, a **decisão** só pode ser comunicada depois de decorridos **15 dias** sobre a comunicação de intenção (art. 363.º, n.º 1). Decidir antes torna o despedimento ilícito (art. 383.º, al. b)).
- ⏰ **Aviso prévio** da decisão, contado até à data da cessação (art. 363.º, n.º 1): **15 dias** (antiguidade < 1 ano), **30 dias** (1 a < 5 anos), **60 dias** (5 a < 10 anos), **75 dias** (≥ 10 anos). Casal (cônjuges ou unidos de facto) abrangido: escalão imediatamente superior (n.º 2). Aviso em falta: o contrato só cessa depois de decorrido o período em falta, pagando-o (n.º 4).
- ⏰ **Pagamento** da compensação e dos créditos vencidos e exigíveis **até ao termo do aviso prévio** (art. 363.º, n.º 5).
- ⏰ **Trabalhadora grávida, puérpera ou lactante ou trabalhador em licença parental**: depois da fase de negociação, remete cópia do processo à **CITE**, que tem **30 dias** para dar parecer; parecer desfavorável obriga a ação judicial em 30 dias (art. 63.º, n.os 1, 3, al. b), 4 e 6).
- ⏰ **Do lado do trabalhador**: providência cautelar de **suspensão** do despedimento em **5 dias úteis** a contar da receção da decisão (art. 386.º); **ação de impugnação** do despedimento coletivo em **6 meses** a contar da cessação do contrato (art. 388.º, n.º 2).
- ⏰ **12 meses** — depois do despedimento, não podes contratar **serviços externos** (outsourcing) para as necessidades asseguradas pelos trabalhadores despedidos (art. 338.º-A).
- Conta e regista os prazos com `calc_prazo` e `registar_prazo` (dias seguidos, salvo quando a lei diz "úteis").

## Fluxo de decisão

1. **É mesmo um despedimento coletivo?** Soma as cessações por iniciativa da empresa no período de 3 meses e confirma o fundamento: **motivos de mercado** (redução da atividade por diminuição previsível da procura ou impossibilidade de colocar os bens/serviços no mercado), **estruturais** (desequilíbrio económico-financeiro, mudança de atividade, reestruturação, substituição de produtos dominantes) ou **tecnológicos** (alteração de técnicas ou processos, automatização, informatização) — art. 359.º, n.º 2 → se atinges 2 (micro/pequena) ou 5 (média/grande): passo 2 · se não atinges: **extinção do posto de trabalho** (arts. 367.º a 372.º — ver comparação e `playbooks/quero-despedir.md`). Não fraciones artificialmente as saídas para fugir ao regime.

2. **Há alternativas que reduzam o número de despedimentos?** A lei obriga a discuti-las na negociação (art. 361.º, n.º 1): suspensão de contratos ou redução de horários (sem precisares do procedimento dos arts. 299.º e 300.º — n.º 2), reconversão ou reclassificação profissional e reforma antecipada ou pré-reforma (estas duas só com acordo do trabalhador — n.º 3). Considera também **acordos de revogação** negociados (`assets/templates/acordo-revogacao.md`), confirmando o impacto no acesso do trabalhador ao subsídio de desemprego (a confirmar caso a caso). Se a crise for temporária: `playbooks/lay-off.md`.

3. **Prepara o dossier** — é o que o tribunal vai escrutinar:
   - Fundamentação **económica, documentada** (contas, quebras de vendas, perda de clientes, plano de reestruturação) e o nexo entre os motivos e os postos a eliminar.
   - **Quadro de pessoal** discriminado por setores organizacionais.
   - **Critérios de seleção** objetivos, coerentes com os motivos e **não discriminatórios** (cuidado com idade, sexo, parentalidade, filiação sindical, doença).
   - Número de trabalhadores e categorias abrangidas; período em que os despedimentos vão ocorrer.
   - Método de cálculo de eventual compensação acima da legal.
   - Lista de trabalhadores **protegidos** (grávidas/puérperas/lactantes, licença parental, representantes dos trabalhadores) e de contratos a termo nas mesmas funções.

4. **Comunicação de intenção, por escrito** (art. 360.º):
   - **A quem**: comissão de trabalhadores → na falta, comissão intersindical ou comissões sindicais representativas dos trabalhadores a abranger → na falta destas, **a cada trabalhador** que possa ser abrangido, enviando depois os elementos à comissão representativa que designem (n.os 1, 3 e 4).
   - **Conteúdo obrigatório** (n.º 2): a) motivos; b) quadro de pessoal por setores; c) critérios de seleção; d) número de trabalhadores e categorias; e) período de execução; f) método de cálculo da compensação, se for além da legal ou do IRCT.
   - **Cópia à DGERT** na mesma data (n.º 5). Entrega contra recibo ou carta registada com AR.

5. **Fase de informações e negociação** (arts. 361.º e 362.º): reuniões com a estrutura representativa, **com participação da DGERT**, que vela pela regularidade do procedimento e pode advertir a empresa e fazer constar irregularidades da ata; os serviços do emprego e da SS podem indicar medidas de apoio. Cada parte pode fazer-se assistir por um perito. Faz **ata** de todas as reuniões (acordos, posições divergentes, propostas) — art. 361.º, n.º 5. Não impedir a participação da DGERT (contraordenação grave — art. 362.º, n.º 4).

6. **Decisão** (art. 363.º) — depois do acordo ou decorridos 15 dias sobre a comunicação de intenção:
   - Comunica **por escrito a cada trabalhador** abrangido: **motivo**, **data de cessação**, e **montante, forma, momento e lugar de pagamento** da compensação e dos créditos vencidos e exigíveis — com o aviso prévio do Passo 0.
   - Na **mesma data**, envia à **DGERT** a ata (ou a justificação da sua falta, as razões do desacordo e as posições finais) e a **relação** dos trabalhadores (nome, morada, datas de nascimento e admissão, situação perante a SS, profissão, categoria, retribuição, medida e data prevista); e à estrutura representativa cópia da relação (n.º 3).
   - Prepara o fecho de cada contrato: certificado de trabalho, declaração de situação de desemprego para a Segurança Social e comunicação da cessação à SS pelos meios e prazos em vigor (a confirmar).

7. **Durante o aviso prévio** — direitos do trabalhador:
   - **Crédito de horas** de **2 dias de trabalho por semana**, sem perda de retribuição, para procurar emprego; o trabalhador avisa com **3 dias** de antecedência, salvo motivo atendível (art. 364.º).
   - Pode **denunciar** o contrato com **3 dias úteis** de antecedência, **mantendo o direito à compensação** (art. 365.º).

8. **Compensação** (art. 366.º CT; Lei 13/2023; Lei 69/2013):
   - **14 dias** de retribuição base e diuturnidades (RB+D) por cada ano completo de antiguidade, para a antiguidade **desde 1/5/2023** (Lei 13/2023, art. 35.º, n.º 2); a antiguidade **anterior** segue o regime transitório do art. 5.º da Lei 69/2013, por períodos (30/20/18/12 dias consoante o período e o tipo de contrato).
   - Fração de ano: proporcional; valor diário = RB+D mensal ÷ 30 (art. 366.º, n.º 2, als. c) e d)).
   - **Tetos**: RB+D considerada até **20 × RMMG**; montante global até **12 × RB+D** ou, se aplicado o teto anterior, **240 × RMMG** (art. 366.º, n.º 2, als. a) e b)). RMMG em `references/valores-2026.md`.
   - **Não há mínimo de 3 meses**, salvo a garantia transitória para contratos sem termo anteriores a 1/11/2011 (Lei 69/2013, art. 5.º).
   - Contratos a termo e temporários abrangidos: compensação dos arts. 344.º, n.º 2, e 345.º, n.º 4 (24 dias), com os mesmos tetos (art. 366.º, n.º 6).
   - O empregador paga a totalidade da compensação (n.º 3). Receber a **totalidade** da compensação faz **presumir a aceitação** do despedimento; o trabalhador só a afasta devolvendo-a em simultâneo (n.os 4 e 5).
   - **Calcula** com a tool `calc_compensacao_despedimento` (modalidade `coletivo`) e os créditos finais (férias, subsídios proporcionais) com `calc_creditos_laborais`. Confirma que o resultado aplica o regime acima (14 dias desde 1/5/2023, tramos anteriores, tetos).

9. **Depois do despedimento**:
   - **Proibição de outsourcing** durante **12 meses** para as necessidades asseguradas pelos trabalhadores despedidos — contraordenação **muito grave** imputável ao beneficiário dos serviços (art. 338.º-A, aditado pela Lei 13/2023).
   - A lei não proíbe expressamente **readmitir** para as mesmas funções, mas contratar pouco depois para os postos eliminados contradiz o motivo invocado e é um forte indício de **improcedência do motivo** em tribunal (art. 381.º, al. b)) (a confirmar na jurisprudência do caso).
   - Guarda o dossier completo (comunicações, atas, pareceres, comprovativos de pagamento) pelo menos até ao fim do prazo de impugnação.

10. **Se o trabalhador impugnar**: a ilicitude só é declarada por tribunal (art. 388.º, n.º 1), em **ação especial de impugnação do despedimento coletivo** (Código de Processo do Trabalho, arts. 156.º e seguintes — a confirmar), no prazo de 6 meses; só podes invocar os factos e fundamentos da decisão comunicada (art. 387.º, n.º 3, por remissão do art. 388.º, n.º 3). Envolve advogado de imediato.

### Despedimento coletivo vs. extinção do posto de trabalho

| | Despedimento coletivo (arts. 359.º-366.º) | Extinção do posto de trabalho (arts. 367.º-372.º) |
|---|---|---|
| Quando | ≥ 2 (micro/pequena) ou ≥ 5 (média/grande) trabalhadores em 3 meses | Abaixo desses números — posto(s) concreto(s) |
| Motivos | Mercado, estruturais ou tecnológicos (art. 359.º, n.º 2) | Os mesmos (art. 367.º, n.º 2) |
| Requisitos adicionais | — | Motivos não culposos; impossibilidade prática de subsistência (sem posto compatível); sem contratos a termo para tarefas correspondentes; não ser aplicável o coletivo (art. 368.º, n.º 1) |
| Seleção | Critérios definidos pela empresa e comunicados | Ordem legal obrigatória entre postos idênticos: pior avaliação de desempenho, menores habilitações, maior onerosidade, menor experiência, menor antiguidade (art. 368.º, n.º 2) |
| Comunicação inicial | Estrutura representativa (ou cada trabalhador) + cópia à DGERT (art. 360.º) | Estrutura representativa, trabalhador e, se for representante sindical, a associação sindical (art. 369.º) |
| Negociação / consulta | Fase de informações e negociação com a DGERT (arts. 361.º-362.º) | Parecer em 15 dias; verificação pela ACT a pedido em 5 dias úteis, relatório em 7 dias (art. 370.º) |
| Decisão | Após acordo ou 15 dias (art. 363.º, n.º 1) | Decorridos 5 dias após o fim do prazo de parecer ou do relatório da ACT (art. 371.º, n.º 1) |
| Aviso prévio | 15 / 30 / 60 / 75 dias (art. 363.º) | 15 / 30 / 60 / 75 dias (art. 371.º, n.º 3) |
| Crédito de horas e denúncia | Sim (arts. 364.º-365.º) | Sim (art. 372.º) |
| Compensação | Art. 366.º | Art. 366.º, por remissão do art. 372.º |
| Impugnação | Ação especial — **6 meses** após a cessação (art. 388.º) | Formulário — **60 dias** após a receção da decisão ou a cessação (art. 387.º, n.º 2) |
| Outsourcing nos 12 meses seguintes | Proibido (art. 338.º-A) | Proibido (art. 338.º-A) |

## Documentos a usar

- `playbooks/quero-despedir.md` — escolher o fundamento de cessação (inclui a extinção do posto de trabalho)
- `playbooks/lay-off.md` — alternativa temporária à redução de pessoal
- `assets/templates/acordo-revogacao.md` — saídas negociadas por mútuo acordo
- `references/laboral.md` — cessação do contrato e compensações
- `references/valores-2026.md` — RMMG para os tetos da compensação
- Tool `calc_compensacao_despedimento` / `scripts/compensacao_despedimento.py` — compensação por trabalhador
- Tool `calc_creditos_laborais` / `scripts/creditos_laborais.py` — férias e subsídios vencidos e proporcionais
- Tools `calc_prazo` / `registar_prazo` — 5 dias, 15 dias, aviso prévio, 12 meses do art. 338.º-A
- Tool `obter_perfil_empresa` — dimensão da empresa e estruturas representativas

## Quando chamar advogado presencial

- **Sempre** antes de enviar a comunicação de intenção: o despedimento coletivo é um dos procedimentos com mais impugnações e o risco financeiro (reintegração, salários intercalares) é elevado.
- Há **comissão de trabalhadores ou sindicatos** ativos, IRCT com regras próprias ou uma negociação conflituosa.
- Entre os abrangidos há trabalhadores **protegidos** (grávidas, puérperas, lactantes, em licença parental, representantes dos trabalhadores) — parecer prévio da CITE e regras próprias.
- A empresa está em **PER ou insolvência**, vai transmitir o estabelecimento ou integra um grupo (critérios e responsabilidade solidária).
- Recebeste uma **providência cautelar** ou uma **ação de impugnação**.
