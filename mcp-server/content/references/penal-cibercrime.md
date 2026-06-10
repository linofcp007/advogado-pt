# Direito Penal Económico e Cibercrime

> 💶 **Valores (taxa de justiça, custas do PIC, montantes de coimas RGPD):** ver `references/valores-2026.md`. Vertente contraordenacional da proteção de dados em `references/rgpd.md`; seguro cyber em `references/seguros.md`.

## Legislação Base
- Código Penal (CP): burla (Art. 217.º); burla qualificada (Art. 218.º); burla informática e nas comunicações (Art. 221.º); abuso de confiança (Art. 205.º); falsificação de documento (Art. 256.º)
- Lei do Cibercrime — Lei 109/2009: acesso ilegítimo (Art. 6.º); interceção ilegítima (Art. 7.º); dano informático (Art. 4.º); sabotagem informática (Art. 5.º); falsidade informática (Art. 3.º)
- Código de Processo Penal (CPP): queixa, denúncia, assistente, pedido de indemnização civil (Arts. 71.º e segs.)
- Lei 83/2017: branqueamento de capitais e financiamento do terrorismo — deveres de prevenção
- RGIT: abuso de confiança fiscal (Art. 105.º) e contra a Segurança Social (Art. 107.º) — não entrega de retenções/IVA
- RGPD / Lei 58/2019: vertente contraordenacional (ver `references/rgpd.md`)

## Natureza dos crimes e prazo de queixa
- **Crimes semi-públicos** (a maioria das burlas e crimes informáticos simples): dependem de **queixa** do ofendido — prazo de **6 meses** a contar do conhecimento do facto e do autor (Art. 115.º CP)
- **Crimes públicos**: o Ministério Público (MP) age oficiosamente, basta a denúncia
- A queixa pode ser apresentada por escrito ou verbalmente em qualquer órgão de polícia criminal, no MP ou online

---

## (A) Perspetiva do utilizador como VÍTIMA

### Cibercrimes típicos num negócio tech
- **Phishing / burla informática**: faturas falsas, IBAN adulterado, **BEC** (*business email compromise*) — email do "fornecedor" ou "gerente" a pedir transferência
- **Ransomware**: cifragem de sistemas com pedido de resgate (dano + sabotagem informática + extorsão)
- **Acesso ilegítimo / roubo de credenciais e dados**: invasão de contas, exfiltração de bases de dados
- **Interceção ilegítima**: captura de comunicações (man-in-the-middle)

### O que fazer (vítima)
- **Queixa-crime / denúncia**: na PJ, GNR/PSP, MP, ou online em **queixaselectronicas.mai.gov.pt**
- Cibercrime: reportar à **PJ — Unidade Nacional de Combate ao Cibercrime e à Criminalidade Tecnológica (UNC3T)**
- **Constituição de assistente** (Art. 68.º CPP): permite intervir ativamente no processo, requerer diligências e recorrer (obrigatório nos crimes particulares; útil nos semi-públicos)
- **Pedido de indemnização civil (PIC)**: regra geral deduz-se **no próprio processo penal** (princípio da adesão — Arts. 71.º e segs. CPP), evitando ação cível autónoma
- **Preservação de prova digital**: guardar logs, emails originais (com cabeçalhos), prints com data/hora, IBAN e referências de transferência; **não** apagar nem "limpar" sistemas afetados antes de cópia forense

### Resposta a BEC / transferência desviada — passo-a-passo
1. **Contactar o banco IMEDIATAMENTE** e pedir *recall*/sustação da transferência (as primeiras horas são decisivas)
2. Reportar ao banco do beneficiário (via banco ordenante) e à PJ
3. Isolar a conta de email comprometida; mudar passwords; ativar 2FA
4. Preservar prova (emails, cabeçalhos, comprovativo de transferência)
5. Apresentar **queixa-crime** (burla informática, Art. 221.º CP)
6. Verificar cobertura do **seguro cyber** e prazos de participação (ver `references/seguros.md`)
7. Se houve dados pessoais comprometidos → avaliar **data breach** e notificação à CNPD em 72h (ver `references/rgpd.md`)

---

## (B) Exposição do próprio utilizador (a evitar)
- **Burla / burla informática**: induzir alguém em erro para obter enriquecimento — distinguir de mero incumprimento contratual
- **Abuso de confiança fiscal e à SS** (Arts. 105.º e 107.º RGIT): **não entrega** ao Estado de IVA liquidado ou de retenções (IRS/SS) efetivamente deduzidas — é crime, não simples dívida; existem patamares e prazos de regularização
- **Insolvência dolosa / culposa**: dissipação de bens em pré-insolvência (cross-ref `references/insolvencia.md`)
- **Branqueamento** (Lei 83/2017): movimentar fundos de origem ilícita; deveres de identificação/comunicação
- **Distinção essencial**: o **incumprimento civil** (não pagar uma fatura por dificuldade) **não é crime**; só há crime quando há dolo de enganar, apropriação ou não entrega de valores do Estado

## Para o contexto do utilizador (ENI / Unipessoal Lda)
- Implementar verificação de IBAN por **duplo canal** (confirmação telefónica com contacto previamente conhecido) antes de transferências; é a defesa mais eficaz contra BEC
- Reter retenções e IVA em conta separada e **entregar no prazo** — protege contra responsabilidade criminal pessoal do gerente (RGIT)
- Articular incidente de segurança com **seguro cyber** (`references/seguros.md`) e **obrigações RGPD** (`references/rgpd.md`) em simultâneo com a queixa
- Para prazos processuais penais e constituição de assistente, recomenda-se **advogado** (ver `SKILL.md`)

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Queixa-crime (modelo: identificação do queixoso, factos, qualificação jurídica, prova, pedido)
- Denúncia de cibercrime (guião para queixaselectronicas.mai.gov.pt / PJ-UNC3T)
- Pedido de indemnização civil em processo penal (guião de dedução por adesão)
- Requerimento de constituição de assistente
