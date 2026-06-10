# Direito Laboral

> 💶 **Valores (salário mínimo, dias de compensação, taxas SS):** ponto único de verdade em `references/valores-2026.md`. Para cálculos, usa `scripts/compensacao_despedimento.py`.

## Legislação Base
- Código do Trabalho (CT): Lei 7/2009 e alterações
- Código Contributivo da Segurança Social: Lei 110/2009
- Lei 102/2009: regime de segurança e saúde no trabalho
- Lei 105/2009: regulamentação do CT

## Especificidades para ENI e Futura Unipessoal Lda

### Como ENI (situação atual)
- Pode contratar trabalhadores normalmente
- Responsabilidade pessoal e ilimitada pelas obrigações laborais
- Contribuições SS: taxa contributiva de 23,75% (entidade empregadora) + 11% (trabalhador)
- Seguro de acidentes de trabalho obrigatório
- Comunicação de admissão à SS antes do início da atividade

### Como Unipessoal Lda (futuro)
- Responsabilidade limitada ao património da sociedade
- Mesmas obrigações laborais do CT
- Obrigação de relatório único anual
- Considerar: gerente pode acumular funções, mas atenção à qualificação do vínculo

## Contratação

### Tipos de Contrato
- **Sem termo** (regra geral): não exige forma escrita mas é recomendável
- **A termo certo**: máx. 2 anos, renovável até 3x, motivo justificativo obrigatório (Art. 140º CT)
- **A termo incerto**: para substituição ou tarefa definida
- **Tempo parcial**: por escrito, com indicação do período normal de trabalho
- **Teletrabalho**: acordo escrito obrigatório (Arts. 165º-171º CT, Lei 83/2021)

### Período Experimental
- Sem termo: 90 dias (regra), 180 dias (cargos complexos), 240 dias (direção/quadros superiores)
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
- **Despedimento sem termo / coletivo**: **14 dias** de retribuição base + diuturnidades por cada ano completo
- **Extinção do posto de trabalho / inadaptação**: **12 dias** por ano (Art. 366.º CT)
- **Caducidade de contrato a termo** (certo/incerto): **24 dias** por ano
- Contratos mais antigos: regras transitórias por períodos (podem ser 18, 20 ou 30 dias/ano consoante o período) — calcular por tramos
- Mínimo: 3 meses de retribuição base + diuturnidades
- ⚠️ Valores e cálculo em `references/valores-2026.md` e `scripts/compensacao_despedimento.py` (versão anterior desta secção indicava "12 dias" genérico — desatualizado)

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
- Comunicação de admissão à SS (24h antes do início)
- Medicina no trabalho (exame de admissão, periódicos, ocasionais)
- Formação profissional: 40h/ano por trabalhador
- Relatório Único (entrega anual, habitualmente até março/abril)

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Contrato de trabalho sem termo
- Contrato de trabalho a termo certo
- Acordo de teletrabalho
- Nota de culpa (processo disciplinar)
- Carta de despedimento com justa causa
- Acordo de revogação (cessação por mútuo acordo)
- Carta de denúncia pelo trabalhador
