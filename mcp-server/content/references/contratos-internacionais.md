# Contratos Internacionais (Clientes e Fornecedores)

> 💶 **Retenções na fonte, taxas e limiares fiscais (IVA, dupla tributação):** ver `references/fiscal.md` e `references/valores-2026.md`. Vertente de dados pessoais: `references/rgpd.md`. Cláusulas gerais e templates internos: `references/contratos.md`.

## Legislação e Instrumentos Base
- **Roma I** — Regulamento (CE) 593/2008: lei aplicável às **obrigações contratuais**
- **Roma II** — Regulamento (CE) 864/2007: lei aplicável às obrigações **extracontratuais** (ex.: responsabilidade civil)
- **Bruxelas I bis** — Regulamento (UE) 1215/2012: **competência judiciária** e reconhecimento/execução de decisões na UE
- **CISG** — Convenção de Viena 1980: compra e venda **internacional de mercadorias** (Portugal **não** é parte; só se aplica por escolha das partes ou por remissão da lei de um Estado contratante)
- **Convenção de Nova Iorque 1958**: reconhecimento e execução de **sentenças arbitrais** estrangeiras (Portugal é parte)

## Escolha da Lei Aplicável
- **Liberdade das partes** (Art. 3.º Roma I): podem escolher a lei que rege o contrato (ex.: lei portuguesa)
- Na ausência de escolha (Art. 4.º Roma I): regras supletivas — em prestação de serviços, lei da residência habitual do prestador
- **Limites**:
  - **Normas imperativas** (*overriding mandatory provisions*, Art. 9.º) e ordem pública do foro
  - **Consumidores** (Art. 6.º): o consumidor não pode ser privado da proteção da lei da sua residência habitual — relevante em B2C
- A escolha de lei e a escolha de foro são **cláusulas distintas** (uma não implica a outra)

## Foro vs. Arbitragem
- **Cláusula de eleição de foro** (Art. 25.º Bruxelas I bis): atribui competência exclusiva a um tribunal de um Estado-Membro; reconhecida em toda a UE
- **Cláusula compromissória (arbitragem)**: submete litígios a tribunal arbitral; rege-se pela Lei da Arbitragem Voluntária (Lei 63/2011) e, internacionalmente, pela Convenção de Nova Iorque
- Definir na cláusula: **sede**, **idioma**, **número de árbitros**, **regras** (ad hoc ou institucionais — ICC, CAC) e **lei aplicável ao mérito**
- **Vantagens da arbitragem internacional para tech**: neutralidade do foro, confidencialidade, árbitros especializados, e **execução facilitada em ~170 países** (Nova Iorque) — frequentemente superior à execução de sentenças judiciais fora da UE
- **Desvantagens**: custo inicial mais elevado e ausência (em regra) de recurso de mérito — pesar consoante o valor típico dos contratos

## Cláusulas Essenciais em Contratos Cross-Border
- **Lei aplicável** e **resolução de litígios** (foro ou arbitragem) — ver cláusula-tipo abaixo
- **Língua** do contrato e da versão prevalecente (se bilingue)
- **Moeda** de faturação e pagamento; câmbio e custos bancários
- **Incoterms** (se houver bens físicos — retalho): definem entrega, risco e custos (ex.: EXW, DAP, DDP)
- **Fiscalidade**: retenções na fonte sobre royalties/serviços, **convenções de dupla tributação** (CDT) e certificados de residência fiscal — ver `references/fiscal.md`
- **RGPD / transferências internacionais** de dados: SCC (cláusulas-tipo), avaliação de país terceiro — remeter a `references/rgpd.md`
- Limitação de responsabilidade, IP, confidencialidade (alinhar com `references/contratos.md`)

## B2B Intracomunitário
- **Reverse charge** de IVA na prestação de serviços B2B na UE (Art. 6.º CIVA / regra geral B2B): o IVA é autoliquidado pelo cliente — ver `references/fiscal.md`
- Exige **número VIES** válido do cliente (verificar em [ec.europa.eu/taxation_customs/vies](https://ec.europa.eu/taxation_customs/vies)) e menção da isenção/reverse charge na fatura
- Declaração recapitulativa (Mod. recapitulativa) das operações intracomunitárias

## Serviços Digitais a Clientes Fora da UE/EUA — considerações práticas
- Serviços B2B a cliente fora da UE: em regra **fora do campo do IVA português** (operação não localizada em PT), mas verificar regras de localização e eventual IVA/imposto local do país do cliente
- Atenção a **retenções na fonte** locais (alguns países retêm sobre pagamentos a prestadores estrangeiros) → invocar a CDT, se existir
- Pagamentos e sanções: triagem de **listas de sanções/embargos** antes de contratar
- Dados: confirmar base de transferência internacional (RGPD) caso trate dados de cidadãos UE

## Reconhecimento e Execução de Decisões
- **Dentro da UE** (Bruxelas I bis): a decisão de um Estado-Membro é reconhecida e executada **sem necessidade de exequatur** — execução quase automática
- **Fora da UE**: decisão judicial estrangeira exige **revisão e confirmação** de sentença estrangeira (Arts. 978.º e segs. CPC) no Tribunal da Relação
- **Sentenças arbitrais**: executadas ao abrigo da Convenção de Nova Iorque (motivos de recusa muito limitados) — por isso a arbitragem é preferível quando o devedor/ativos estão fora da UE

## Para o contexto do utilizador (software/consultoria a clientes internacionais)
- **Cláusula-tipo recomendada**: **lei portuguesa** + resolução de litígios por **arbitragem** (ex.: Centro de Arbitragem Comercial da Câmara de Comércio e Indústria Portuguesa, sede em Lisboa, idioma inglês) para clientes fora da UE; **eleição de foro nos tribunais de Lisboa** quando o cliente está na UE (execução simples via Bruxelas I bis)
- Faturação B2B UE com **reverse charge** e validação VIES; pedir **certificado de residência fiscal** ao cliente para aplicar CDT e evitar/reduzir retenções
- Manter versão **PT/EN** do contrato com cláusula de prevalência da versão inglesa em contratos internacionais

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Cláusula de lei aplicável e resolução de litígios (PT/EN) — variantes foro e arbitragem
- MSA internacional (Master Services Agreement) — esqueleto (partes, serviços/SOW, preço, IP, confidencialidade, responsabilidade, lei e litígios, dados)
- Cláusula fiscal cross-border (retenções, CDT, gross-up)
