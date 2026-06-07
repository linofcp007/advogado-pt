# RGPD e Proteção de Dados

> 🔗 Para IA, cookies/ePrivacy, NIS2 e regulação digital da UE, ver `references/digital-ue.md`. Para coimas e limiares atualizados, ver `references/valores-2026.md`.

## Legislação Base
- Regulamento (UE) 2016/679 (RGPD)
- Lei 58/2019: execução do RGPD em Portugal
- Lei 41/2004: proteção de dados em comunicações eletrónicas
- Lei 59/2019: tratamento de dados para prevenção criminal
- CNPD: Comissão Nacional de Proteção de Dados (autoridade de controlo)

## Obrigações do Utilizador como Responsável pelo Tratamento

### Princípios Fundamentais (Art. 5º RGPD)
- Licitude, lealdade e transparência
- Limitação das finalidades
- Minimização dos dados
- Exatidão
- Limitação da conservação
- Integridade e confidencialidade
- Responsabilidade (accountability)

### Bases de Licitude (Art. 6º RGPD)
- Consentimento (livre, específico, informado, inequívoco)
- Execução de contrato
- Obrigação legal
- Interesses vitais
- Interesse público
- Interesses legítimos (com balanceamento)

### Documentação Obrigatória
- Política de privacidade (website/app)
- Registo de atividades de tratamento (Art. 30º)
- Avaliação de impacto (DPIA) — quando tratamento de alto risco
- Contratos com subcontratantes (DPA — Art. 28º)

### Direitos dos Titulares
- Informação e acesso (Arts. 13-15º)
- Retificação (Art. 16º)
- Apagamento / "direito ao esquecimento" (Art. 17º)
- Limitação do tratamento (Art. 18º)
- Portabilidade (Art. 20º)
- Oposição (Art. 21º)
- Não sujeição a decisões automatizadas (Art. 22º)
- Prazo de resposta: 1 mês (prorrogável até 3 meses se complexo)

## Especificidades para Tecnologia/Software

### Cookies e Tracking
- Consentimento prévio para cookies não essenciais
- Banner de cookies com opções granulares
- Cookie policy separada ou integrada na política de privacidade
- Cookies estritamente necessários: não precisam de consentimento

### SaaS e Cloud
- DPA obrigatório com fornecedores cloud (AWS, Azure, Google, etc.)
- Transferências internacionais: Decisões de adequação, SCCs, ou BCRs
- Sub-subcontratantes: listar e notificar alterações
- Localização dos dados: preferência UE/EEE

### Desenvolvimento de Software
- Privacy by design e by default (Art. 25º RGPD)
- Pseudonimização e encriptação
- Logs de acesso e auditoria
- Ambientes de teste: não usar dados reais ou anonimizar

### IA e Decisões Automatizadas (interseção RGPD × AI Act)
- **Art. 22º RGPD**: o titular tem direito a não ser sujeito a decisão exclusivamente automatizada com efeitos significativos (ex.: scoring de crédito, seleção de candidatos), salvo exceções — com direito a intervenção humana, a expor o seu ponto de vista e a contestar.
- **Transparência**: informar sobre a existência de decisões automatizadas e a lógica subjacente (Arts. 13º-15º).
- **DPIA quase sempre exigível** quando se usa IA sobre dados pessoais em larga escala ou com perfilagem.
- **Treino de modelos com dados pessoais**: definir base de licitude (frequentemente interesse legítimo, com balanceamento e medidas de salvaguarda); minimização; cuidado com *scraping*.
- Articula com o **AI Act** (transparência, alto risco, literacia) — ver `references/digital-ue.md`.

## Transferências Internacionais (Clientes Fora da UE)
- Decisões de adequação da Comissão Europeia (verificar lista atualizada)
- Standard Contractual Clauses (SCCs): modelo da CE (Decisão 2021/914)
- Transfer Impact Assessment (TIA) quando SCCs
- EUA: EU-US Data Privacy Framework (verificar se ainda em vigor)

## Violações de Dados (Data Breach)
- Notificação à CNPD: 72 horas após conhecimento (Art. 33º)
- Notificação aos titulares: sem demora injustificada se risco elevado (Art. 34º)
- Documentar todas as violações internamente (mesmo as não notificadas)

## Coimas
- Até 20 milhões € ou 4% do volume de negócios global (infrações graves)
- Até 10 milhões € ou 2% do volume de negócios global (infrações menos graves)
- Lei 58/2019 prevê molduras reduzidas para PMEs em Portugal
- CNPD tem aplicado coimas crescentes — tendência de maior enforcement

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Política de privacidade para website (PT)
- Privacy Policy para SaaS (EN)
- Data Processing Agreement (DPA) bilíngue
- Registo de atividades de tratamento
- Template de resposta a exercício de direitos
- Procedimento interno de data breach
- Cookie policy
