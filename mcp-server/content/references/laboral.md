# Direito Laboral

> **Âmbito:** nacional
>
> 💶 **Valores (salário mínimo, dias de compensação, taxas SS):** ponto único de verdade em `references/valores-2026.md`. Para cálculos, usa `scripts/compensacao_despedimento.py`.

## Legislação Base
- Código do Trabalho (CT): Lei 7/2009 e alterações
- Código Contributivo da Segurança Social: Lei 110/2009
- Lei 102/2009: regime de segurança e saúde no trabalho
- Lei 105/2009: regulamentação do CT

## Especificidades por forma jurídica do empregador

> Adapta ao perfil da empresa guardado (`.juridico-pt/perfil-empresa.md`); se não houver, pergunta a forma jurídica.

### Empresário em nome individual (ENI)
- Pode contratar trabalhadores normalmente
- Responsabilidade pessoal e ilimitada pelas obrigações laborais
- Contribuições SS: taxa contributiva de 23,75% (entidade empregadora) + 11% (trabalhador)
- Seguro de acidentes de trabalho obrigatório
- Comunicação de admissão à SS antes do início da atividade

### Sociedade (Unipessoal Lda, Lda, SA)
- Responsabilidade limitada ao património da sociedade
- Mesmas obrigações laborais do CT
- Relatório Único anual — obrigatório para qualquer empregador com trabalhadores
- Gerente ou administrador: pode acumular funções com um contrato de trabalho, mas atenção à qualificação do vínculo e ao regime dos membros de órgãos estatutários na Segurança Social (`references/valores-2026.md`)

## Contratação

### Tipos de Contrato
- **Sem termo** (regra geral): não exige forma escrita mas é recomendável
- **A termo certo**: máx. 2 anos, renovável até 3x, motivo justificativo obrigatório (Art. 140º CT); a duração total das renovações não pode exceder a do período inicial (CT, art. 149.º, n.º 4)
- **A termo incerto**: para substituição ou tarefa definida; duração máxima de 4 anos (CT, art. 148.º)
- **Tempo parcial**: por escrito, com indicação do período normal de trabalho
- **Teletrabalho**: acordo escrito obrigatório (Arts. 165º-171º CT, Lei 83/2021)

### Período Experimental
- Sem termo: 90 dias (regra), 180 dias (cargos complexos e trabalhador à procura do primeiro emprego ou desempregado de longa duração — CT, art. 112.º, n.º 1, al. b)), 240 dias (direção/quadros superiores)
- A termo ≥ 6 meses: 30 dias
- A termo < 6 meses: 15 dias

## Trabalho Remoto / Teletrabalho
- Lei 83/2021 alterou significativamente o regime
- Acordo escrito obrigatório entre as partes
- Empregador comparticipa despesas adicionais (energia, internet)
- Trabalhador tem direito a desligar (Art. 199º-A CT)
- Visitas ao domicílio: apenas com aviso prévio de 24h e acordo do trabalhador

## Cessação do Contrato de Trabalho

### Despedimento por Iniciativa do Empregador
- **Por facto imputável ao trabalhador** (justa causa): processo disciplinar obrigatório (nota de culpa → resposta → decisão)
- **Despedimento coletivo**: procedimento complexo, comunicação ao ministério
- **Extinção do posto de trabalho**: critérios legais rigorosos
- **Inadaptação**: após formação e período de adaptação

### Compensações (desde 01/05/2023 — Lei 13/2023)
- **Despedimento coletivo, extinção do posto de trabalho e inadaptação**: **14 dias** de retribuição base + diuturnidades por ano de antiguidade, com frações proporcionais (Art. 366.º CT, aplicável por remissão dos Arts. 372.º e 379.º)
- **Caducidade de contrato a termo** (certo/incerto): **24 dias** por ano (Arts. 344.º e 345.º CT)
- **Tetos**: retribuição considerada até 20 RMMG; total até 12 × (RB + diuturnidades) ou 240 RMMG (Art. 366.º, n.º 2)
- **Sem mínimo de 3 meses** no regime atual — esse mínimo só existe no regime transitório dos contratos anteriores a 1/11/2011 (Lei 69/2013, art. 5.º)
- **Antiguidade anterior a 1/5/2023**: regime transitório por períodos (30, 20, 18 e 12 dias/ano consoante o período — Lei 69/2013, art. 5.º; Lei 13/2023, art. 35.º) — calcular com `calc_compensacao_despedimento` com as datas de admissão e cessação (validado contra o simulador da ACT)
- ⚠️ Valores em `references/valores-2026.md`; cálculo em `scripts/compensacao_despedimento.py`

### Revogação por acordo e quitação
- **Forma**: acordo escrito, assinado por ambas as partes, em duplicado, com a data de celebração e a de início dos efeitos (Art. 349.º CT) — template `acordo-revogacao`
- **Compensação pecuniária global**: se o acordo a fixar, presume-se que inclui os créditos vencidos à data da cessação ou exigíveis em virtude desta (Art. 349.º, n.º 5 CT); a presunção pode ser afastada pelo trabalhador com prova em contrário — discriminar no acordo as verbas pagas (retribuições, férias e subsídios, proporcionais, formação não ministrada)
- **Sem quitação por renúncia**: desde 1/5/2023, os créditos do trabalhador emergentes do contrato, da sua violação ou cessação não podem ser extintos por **remissão abdicativa**, salvo através de **transação judicial** (Art. 337.º, n.º 3 CT, Lei 13/2023) — uma "quitação total" num acordo extrajudicial não extingue créditos que ainda sejam devidos
- ⏰ **Arrependimento**: o trabalhador pode fazer cessar o acordo por comunicação escrita até ao **7.º dia** seguinte à celebração, devolvendo a totalidade das compensações recebidas (Art. 350.º, n.ºs 1 e 3 CT), salvo se o acordo estiver datado e as assinaturas tiverem reconhecimento notarial presencial (n.º 4)
- ⏰ **Prescrição**: os créditos de qualquer das partes prescrevem **1 ano** a contar do dia seguinte à cessação do contrato (Art. 337.º, n.º 1 CT)

### Aviso Prévio (denúncia pelo trabalhador)
- Contrato sem termo: 30 dias (até 2 anos de antiguidade), 60 dias (mais de 2 anos)
- Contrato a termo: 15 dias (até 6 meses), 30 dias (6+ meses)

## Subcontratação e Prestação de Serviços
- Atenção aos "falsos recibos verdes" — risco de requalificação do vínculo
- Indícios de laboralidade (Art. 12º CT): local fixo, horário, instrumentos do empregador, exclusividade, integração na estrutura
- Presunção de contrato de trabalho se verificados alguns destes indícios
- ACT pode intervir oficiosamente

## Obrigações Essenciais do Empregador
- Seguro de acidentes de trabalho (obrigatório desde o 1º dia)
- Comunicação de admissão à SS **até ao início da execução do contrato** (art. 29.º, n.º 2, al. a), Código Contributivo, na redação do DL 127/2025, em vigor desde 1/1/2026); só excecionalmente nas 24 horas seguintes ao início (al. b)). Contribuições pagas entre o dia 1 e o dia 25 do mês seguinte (art. 43.º)
- Medicina no trabalho (exame de admissão, periódicos, ocasionais)
- Formação profissional: 40h/ano por trabalhador
- Relatório Único: entrega de 16/3 a 15/4 do ano seguinte (Portaria 55/2010, art. 4.º, n.º 1); em 2026 a DGCP (ex-GEP) alargou-a até 12/6 — confirmar a janela de cada ano em dgcp.mtsss.gov.pt

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Contrato de trabalho sem termo — `assets/templates/contrato-trabalho-sem-termo.md`
- Contrato de trabalho a termo certo — `assets/templates/contrato-trabalho-termo-certo.md`
- Acordo de teletrabalho — `assets/templates/acordo-teletrabalho.md`
- Nota de culpa (processo disciplinar) — `assets/templates/nota-de-culpa.md`
- Carta de despedimento com justa causa — `assets/templates/carta-despedimento-justa-causa.md`
- Acordo de revogação (cessação por mútuo acordo) — `assets/templates/acordo-revogacao.md`
- Carta de denúncia pelo trabalhador (a pedido)
