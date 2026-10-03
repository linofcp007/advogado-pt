# Fiscalidade Empresarial

> **Âmbito:** misto
>
> 💶 **Valores, taxas e limiares:** consulta sempre `references/valores-2026.md` (ponto único de verdade). Os números abaixo são estruturais; os montantes concretos mudam anualmente.

## Legislação Base
- Código do IRS (CIRS): Lei 82-E/2014
- Código do IRC (CIRC): DL 442-B/88 e alterações
- Código do IVA (CIVA): DL 394-B/84 e alterações
- Código Contributivo SS: Lei 110/2009
- Lei Geral Tributária (LGT)
- CPPT: Código de Procedimento e de Processo Tributário

## Trabalhador Independente e ENI (Categoria B do IRS)

> Aplica-se a quem fatura em nome próprio (recibos verdes ou empresário em nome individual). Adapta ao perfil guardado em `.advogado-pt/perfil-empresa.md`, se existir.

### Regimes de Tributação
1. **Regime Simplificado** (rendimentos até ao limite do regime — ver `references/valores-2026.md`)
   - Coeficientes sobre o rendimento bruto (CIRS, art. 31.º, n.º 1) — calcula com `calc_irs_simplificado`:
     - Venda de mercadorias e produtos (e restauração/hotelaria): 0,15 (tributa 15%) — al. a)
     - Atividades profissionais da tabela do art. 151.º: 0,75 — al. b)
     - Restantes prestações de serviços: 0,35 — al. c)
     - Cessão ou utilização temporária de propriedade intelectual ou industrial (e outros rendimentos de capitais/prediais da Cat. B): 0,95 — al. d)
   - No coeficiente de 0,75 parte das despesas tem de ser justificada (CIRS, art. 31.º, n.º 2); considera-se automaticamente um montante igual à dedução específica da Cat. A (art. 25.º, n.º 1, al. a)) — valor do ano em `references/valores-2026.md`
   - Não precisa de contabilidade organizada

2. **Contabilidade Organizada** (obrigatória acima de 200.000€, opcional abaixo)
   - Tributa sobre lucro real (receitas - despesas dedutíveis)
   - Exige TOC (Técnico Oficial de Contas)
   - Permite deduzir todas as despesas documentadas e fiscalmente aceites
   - Recomendável quando despesas reais > 25% dos rendimentos (prestação de serviços)

### Obrigações Declarativas ENI
- Declaração periódica de IVA trimestral ou mensal, consoante o volume de negócios (CIVA, art. 41.º; limiar em `references/valores-2026.md`)
- Declaração anual de IRS (Modelo 3, Anexo B ou C)
- Declaração de início/alteração/cessação de atividade
- Comunicação de faturas à AT (SAF-T mensal)

### Segurança Social do trabalhador independente e do ENI
- **Rendimento relevante**: 70% do valor das prestações de serviços e 20% das vendas de bens/produção (Código Contributivo, art. 162.º)
- **Base de incidência mensal**: 1/3 do rendimento relevante do trimestre anterior, declarado trimestralmente (Código Contributivo, art. 163.º)
- **Taxa**: 21,4% para os trabalhadores independentes; **25,2%** para os empresários em nome individual e titulares de EIRL (Código Contributivo, art. 168.º)
- **Contribuição mínima**: 20 € por mês quando há rendimento relevante (Código Contributivo)
- Isenção nos primeiros 12 meses de atividade (e outras situações previstas no Código Contributivo) — confirmar o enquadramento no Portal da Segurança Social Direta

## Transição para Unipessoal Lda

### Quando Compensa
- Rendimentos elevados (regime simplificado começa a penalizar)
- Necessidade de limitar responsabilidade pessoal
- Planeamento fiscal: IRC reduzido (15% até 50.000€ em 2026) + taxa geral (19%) vs. IRS progressivo — ver `references/valores-2026.md`
- Possibilidade de reter lucros na empresa

### Processo de Constituição
- Empresa na Hora (IRN/conservatória) ou online (eportugal.gov.pt)
- Capital social mínimo: 1€ (mas recomendável mínimo funcional)
- Custo aproximado: ~300-400€ (ver `references/valores-2026.md`, Emolumentos)
- NIF da sociedade, registo na SS, início de atividade nas Finanças

### Regime Fiscal como Lda
- **IRC (2026)**: **15%** (PME, 1.os 50.000€ de matéria coletável) + **19%** acima — Lei 64/2025; taxa geral desce p/ 18% (2027) e 17% (2028). ⚠️ Valor anterior "17%/21%" está desatualizado — ver `valores-2026.md`.
- **Derrama municipal**: até 1,5% sobre lucro tributável (varia por município)
- **Tributação dos lucros distribuídos**: 28% de retenção na fonte (ou englobamento)
- **Remuneração de gerente**: tributada em IRS como Cat. A + TSU (23,75% empresa + 11% gerente)

### Planeamento na Transição
- Escolher momento fiscal adequado (início do ano civil, idealmente)
- Trespasse de atividade ou cessação ENI + início Lda
- Atenção a mais-valias na transferência de ativos
- Recuperação de créditos de IVA pendentes

## IVA — Regras Essenciais

### Taxas
- Normal: 23% (Continente) / 22% (Madeira) / 16% (Açores)
- Intermédia: 13% / 12% / 9% (Continente / Madeira / Açores)
- Reduzida: 6% / 5% / 4% (Continente / Madeira / Açores)
- Confirmar sempre em `references/valores-2026.md` (ponto único de verdade)

### Isenções Relevantes
- Regime de isenção Art. 53º CIVA: volume negócios < 15.000€/ano (verificar atualizações)
- Prestação de serviços B2B intracomunitários: reverse charge (Art. 6º CIVA)
- Exportações: isentas com direito a dedução

### SAF-T e Faturação
- Faturação certificada obrigatória (programa certificado pela AT)
- Comunicação mensal de faturas (SAF-T)
- Arquivo de documentos: 10 anos (obrigação fiscal) / 12 anos (SS)

## Benefícios Fiscais a Considerar
- RFAI: benefícios para investimento produtivo
- SIFIDE: crédito fiscal para I&D (relevante se desenvolve software)
- **ICE — Incentivo à Capitalização das Empresas** (EBF, art. 43.º-D): dedução ao lucro tributável de uma percentagem dos aumentos líquidos de capitais próprios (substituiu a antiga remuneração convencional do capital social)
- **IFICI — Incentivo Fiscal à Investigação Científica e Inovação** (EBF, art. 58.º-A): taxa especial de IRS para quem se torna residente e exerce atividades qualificadas (substituiu o RNH para novas inscrições, salvo regime transitório)
- Regime fiscal de ex-residentes (CIRS, art. 12.º-A), se aplicável

## Reclamações e Impugnações Fiscais
- **Reclamação graciosa**: 120 dias após notificação (Art. 70º CPPT)
- **Recurso hierárquico**: 30 dias após decisão da reclamação
- **Impugnação judicial**: 3 meses (Art. 102.º, n.º 1, CPPT) — ver `references/contencioso-tributario.md`
- **Revisão do ato tributário**: 4 anos (Art. 78º LGT)
- Sempre pedir fundamentação detalhada e verificar se houve erro da AT
