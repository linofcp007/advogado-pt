# Cobranças e Recuperação de Dívidas

> **Âmbito:** nacional

## Legislação Base
- Código Civil: Arts. 762º-812º (cumprimento de obrigações), 798º-812º (responsabilidade contratual)
- Código de Processo Civil (CPC): injunção, ação executiva
- DL 269/98: procedimento de injunção
- Portaria 220-A/2008: regulamenta injunção eletrónica (Citius)
- DL 62/2013, de 10 de maio: atrasos de pagamento nas transações comerciais — juros sem interpelação (art. 4.º), 40 € por custos de cobrança (art. 7.º), injunção seja qual for o valor (art. 10.º)
- Lei 32/2014, de 30 de maio: procedimento extrajudicial pré-executivo (PEPEX); Portaria 349/2015, de 13 de outubro (plataforma www.pepex.mj.pt)
- Código do IVA, arts. 78.º-A a 78.º-D: IVA de créditos de cobrança duvidosa e incobráveis; Portaria 303/2020, de 28 de dezembro (pedido de autorização prévia)
- Código do IRC, arts. 28.º-A, 28.º-B e 41.º: imparidades em créditos e créditos incobráveis

## Prazos de Prescrição (Atenção!)
- Regra geral: 20 anos (Art. 309º CC)
- Serviços de profissões liberais (advogados, contabilistas, consultores…): prescrição **presuntiva de 2 anos** (Art. 317.º, al. c), CC) — presume-se o pagamento; o credor só a afasta com confissão do devedor (Arts. 312.º a 314.º CC). Não é o prazo de 5 anos do Art. 310.º
- Créditos comerciais: regra geral 20 anos (Art. 309º CC); o prazo de 5 anos do Art. 310º aplica-se a prestações periodicamente renováveis (al. g)), rendas (al. a)) e juros (al. d)) — qualificar a natureza do crédito concreto
- Rendas e alugueres: 5 anos (Art. 310º al. a) CC)
- Juros: 5 anos (Art. 310º al. d) CC)
- Telecomunicações, energia, água: 6 meses (legislação setorial)

A prescrição interrompe-se com: citação judicial, notificação judicial avulsa, reconhecimento da dívida pelo devedor.

## Estratégia de Cobrança Escalonada

### Fase 1: Cobrança Amigável (Dias 1-30)
1. **Lembrete por email** (dia 1-7 após vencimento)
   - Tom cordial, assume esquecimento
   - Anexa cópia da fatura
   
2. **Segundo contacto** (dia 8-15)
   - Email + telefonema
   - Pede confirmação de receção e data prevista de pagamento
   
3. **Carta formal** (dia 15-30)
   - Tom firme mas profissional
   - Referência à fatura, valor, data de vencimento
   - Menção a juros de mora
   - Prazo de 8 dias para pagamento

### Fase 2: Cobrança Pré-Judicial (Dias 30-60)
4. **Carta registada com AR** 
   - Interpelação formal para pagamento
   - Advertência de ação judicial
   - Cálculo de juros de mora (taxa legal ou contratual)
   - Prazo final de 15 dias

5. **Proposta de acordo de pagamento** (se devedor mostrar boa-fé)
   - Pagamento faseado com cronograma
   - Reconhecimento de dívida por escrito
   - Cláusula de vencimento antecipado se falhar prestação

### Fase 3: Via Judicial
6. **Injunção** — até 15.000€ (DL 269/98) e, nas **transações comerciais entre empresas, independentemente do valor** (DL 62/2013, art. 10.º)
   - Procedimento rápido e económico; com oposição e valor elevado segue como ação comum no tribunal
   - Requerimento eletrónico via Citius (balcoj.mj.pt)
   - Custas reduzidas (taxa de justiça em frações de UC, ~51€ a 153€ consoante o valor — ver `references/valores-2026.md`)
   - Se o devedor não se opuser em 15 dias → título executivo
   
7. **Ação declarativa** (para valores elevados ou quando há contestação)
   - Tribunal cível competente
   - Requer advogado constituído se valor > 5.000€
   
8. **Ação executiva** (quando já tem título executivo)
   - Títulos (art. 703.º CPC): sentença, injunção com fórmula executória, documento exarado ou **autenticado** por notário, advogado ou solicitador que importe constituição ou reconhecimento de obrigação, títulos de crédito (livrança, letra, cheque). Desde o CPC de 2013, o documento particular só com assinatura reconhecida e a fatura assinada **não** são títulos executivos
   - Penhora de bens, contas bancárias, salários

9. **PEPEX — procedimento extrajudicial pré-executivo** (Lei 32/2014, de 30 de maio; em vigor desde 1/9/2014)
   - Facultativo; serve para **identificar bens penhoráveis** do devedor antes de executar, pelas mesmas bases de dados da execução (art. 2.º)
   - Requisitos (art. 3.º): título executivo que admita a **forma sumária** da execução (CPC, art. 550.º, n.º 2 — ex.: injunção com fórmula executória ou sentença), dívida certa, exigível e líquida, NIF português do credor e do devedor. Uma fatura não basta
   - Requerimento em www.pepex.mj.pt (art. 4.º; Portaria 349/2015, art. 2.º, n.º 4); pagamento em 5 dias úteis (art. 6.º); o agente de execução, designado automaticamente, consulta as bases de dados e faz relatório em 5 dias úteis (arts. 7.º a 10.º)
   - Com o relatório, 30 dias para escolher (art. 11.º): converter em execução sem repetir consultas (art. 18.º) ou, sem bens, notificar o devedor para em 30 dias pagar, acordar, indicar bens ou opor-se (art. 12.º); sem resposta, entra na **lista pública de devedores** (art. 15.º)
   - **Certidão de incobrabilidade** (art. 25.º): após a inclusão na lista pública; a dívida é considerada incobrável para fins fiscais e comunicada à AT (CIVA arts. 78.º, n.º 7, e 78.º-A, n.º 4; CIRC art. 41.º)
   - A lei não prevê a interrupção da prescrição pelo PEPEX (a confirmar) — não usar como ato interruptivo
   - Passo a passo em `playbooks/cliente-nao-paga.md` (ramo PEPEX)

## Juros de Mora
- **Entre empresas (comerciais)**: taxa BCE + 8 pontos percentuais (DL 62/2013)
- **Com consumidores**: taxa legal civil (4% — Portaria 291/2003, verificar atualizações)
- **Juros contratuais**: se o contrato previr taxa superior (atenção ao limite da usura)
- **Várias faturas**: juros fatura a fatura, por tramos semestrais desde o vencimento, com a tool `calc_juros_lote` (ou `scripts/juros_mora.py --lote`); nas transações comerciais, os 40 € de custos de cobrança (DL 62/2013, art. 7.º) são devidos **por cada fatura** vencida, mesmo reclamadas em conjunto (TJUE, acórdão de 20/10/2022, proc. C-585/20) — carta `assets/templates/carta-cobranca-varias-faturas.md`
- O "montante devido" sobre o qual correm os juros inclui as taxas e encargos que constam da fatura, isto é, o IVA (DL 62/2013, art. 3.º, al. h); TJUE C-585/20)

## Créditos Incobráveis — Tratamento Fiscal
- Provisões para créditos de cobrança duvidosa
- Perdas por imparidade fiscalmente aceites (Art. 28º-A CIRC)
- IVA: regularização a favor do sujeito passivo (Art. 78º-A CIVA) — quando a dívida for considerada incobrável
- **IRC — imparidades** (CIRC art. 28.º-B): créditos de cobrança duvidosa quando o devedor tem execução, insolvência, PER ou SIREVE pendente, quando o crédito foi reclamado judicialmente ou em arbitragem, ou quando está em mora há mais de 6 meses com provas objetivas de imparidade e diligências de cobrança — neste último caso, dedução limitada a percentagens crescentes com a antiguidade da mora (n.º 2). Excluídos: créditos sobre o Estado, com seguro ou garantia real, e sobre sócios com mais de 10 %, membros dos órgãos sociais ou participadas (n.º 3)
- **IRC — créditos incobráveis** (CIRC art. 41.º): gasto direto em execução (após o registo do art. 717.º, n.º 2, al. b), CPC), insolvência, plano de insolvência ou PER homologado, RERE, entre outros, se não tiver sido admitida imparidade ou esta for insuficiente; certidão de incobrabilidade do PEPEX (Lei 32/2014, art. 25.º)
- **IVA — regime dos arts. 78.º-A a 78.º-D CIVA** (créditos vencidos desde 1/1/2013 — Lei 66-B/2012, art. 198.º, n.º 7):
  - **Cobrança duvidosa** (art. 78.º-A, n.º 2): (a) mora há mais de 12 meses, com provas objetivas de imparidade e diligências de cobrança → **pedido de autorização prévia** eletrónico nos 6 meses seguintes (art. 78.º-B, n.º 1; Portaria 303/2020); a AT decide em 4 meses, sem resposta = indeferido, salvo créditos abaixo do limiar por fatura do art. 78.º-B, n.º 4 (deferimento tácito); (b) mora há mais de 6 meses, valor até ao limiar da al. b) e devedor particular ou isento sem direito à dedução → sem autorização prévia (art. 78.º-B, n.º 3). Limiares em `references/valores-2026.md` [VERIFICAR]
  - **Incobráveis** (art. 78.º-A, n.º 4): execução após o registo do art. 717.º, n.º 2, al. b), CPC; insolvência limitada, encerrada por insuficiência de bens ou com rateio final sem pagamento; plano de insolvência ou PER homologado; acordo RERE; certidão de incobrabilidade do PEPEX → sem autorização prévia, no prazo de 2 anos a contar do 1.º dia do ano civil seguinte (art. 78.º-B, n.º 3)
  - **Comunicação ao devedor**: na cobrança duvidosa, a AT notifica o adquirente sujeito passivo para corrigir a dedução (arts. 78.º-B, n.º 5, e 78.º-C, n.º 1); nos incobráveis, é o credor que comunica a anulação do imposto, identificando faturas, montantes, processo e período (art. 78.º-B, n.º 9)
  - **Certificação** por ROC ou, até ao limiar por pedido do art. 78.º-D, n.º 1, al. a), por contabilista certificado independente (art. 78.º-D; Portaria 303/2020, art. 3.º)
  - **Exclusões** (art. 78.º-A, n.º 6): créditos com seguro ou garantia real, sobre entidades com relações especiais, sobre o Estado e autarquias, ou sobre devedores já na lista pública de execuções ou insolventes quando a operação foi feita; a cessão do crédito faz perder o direito (n.os 7 e 8)
  - **Recuperação** posterior do crédito → entregar o IVA no período do recebimento (art. 78.º-C, n.º 3)
  - Passo a passo em `playbooks/cliente-nao-paga.md` (ramo do IVA)

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Lembrete amigável de pagamento (email) — `assets/templates/carta-cobranca-amigavel.md`
- Carta formal de cobrança — `assets/templates/carta-cobranca-formal-registada.md`
- Carta registada — interpelação final — `assets/templates/carta-cobranca-formal-registada.md`
- Interpelação com várias faturas (tabela por fatura, juros e 40 € por fatura) — `assets/templates/carta-cobranca-varias-faturas.md`
- Acordo de pagamento faseado — `assets/templates/acordo-pagamento-faseado.md`
- Reconhecimento de dívida — `assets/templates/reconhecimento-divida.md`
- Requerimento de injunção (guião para preenchimento no Citius) — `assets/templates/requerimento-injuncao.md`
