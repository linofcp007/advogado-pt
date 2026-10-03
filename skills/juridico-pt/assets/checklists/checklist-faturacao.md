# Checklist — Conformidade das faturas (Portugal)

> **Quando usar:** para auditar a faturação de qualquer empresa ou ENI: o sistema (programa, séries, comunicação à AT, arquivo) e cada fatura (elementos obrigatórios, prazos, ATCUD e QR). Usa-a também na preparação para **1/1/2027**, quando as faturas em PDF passam a exigir **assinatura ou selo eletrónico qualificado**. Adapta ao perfil da empresa (`.juridico-pt/perfil-empresa.md`): como emite as faturas e se tem clientes particulares, empresas, entidades públicas ou estrangeiros.
> **Referência:** `references/faturacao.md` (fundamentação e fontes); `references/iva-internacional.md` (menções e códigos de isenção, autoliquidação, clientes estrangeiros); `playbooks/faturacao-eletronica-2027.md` (passos até 1/1/2027). Limiares e coimas em `references/valores-2026.md`. Confirmar sempre a redação em vigor em diariodarepublica.pt e no Portal das Finanças.

## Programa e meios de emissão (DL 28/2019, arts. 3.º e 4.º)
- [ ] O meio de emissão é um dos admitidos: programa de faturação, aplicação da AT no Portal das Finanças, outros meios eletrónicos (só faturas simplificadas) ou papel de tipografia autorizada (art. 3.º; art. 4.º, n.º 5)
- [ ] Programa **certificado pela AT** quando obrigatório: volume de negócios acima do limiar (ver `valores-2026`), uso de programa informático ou contabilidade organizada (art. 4.º, n.º 1). A versão em uso consta da lista do Portal das Finanças (art. 4.º, n.º 3)
- [ ] Plano para inoperacionalidade do programa: papel de tipografia autorizada, depois recuperado para o programa (art. 4.º, n.º 4)
- [ ] Faturas simplificadas só dentro dos limites do art. 40.º, n.º 1, CIVA (ver `valores-2026`), ou no regime do art. 53.º (al. c))

## Séries, ATCUD e código QR (DL 28/2019, arts. 7.º e 35.º; Portaria 195/2020)
- [ ] Cada série comunicada à AT **antes** de ser usada e código de validação recebido (art. 35.º; Portaria 195/2020, art. 2.º)
- [ ] Séries numeradas de forma progressiva e contínua, com duração mínima de um ano fiscal (art. 7.º, n.º 4)
- [ ] **ATCUD** em todas as faturas e documentos fiscalmente relevantes, incluindo recibos, guias e pré-impressos, no formato `ATCUD:CodigodeValidação-NumeroSequencial`, em todas as páginas (Portaria 195/2020, art. 4.º)
- [ ] **Código QR** nos documentos de programa certificado, legível, na primeira ou na última página, com o ATCUD imediatamente acima (Portaria 195/2020, arts. 4.º, n.º 3, e 6.º)
- [ ] Documentos em modo de treino identificados como tal (art. 7.º, n.º 6)

## Elementos obrigatórios da fatura (CIVA, art. 36.º, n.º 5)
- [ ] Data e número sequencial
- [ ] Nome/firma, sede ou domicílio e NIF do fornecedor e do adquirente sujeito passivo (al. a))
- [ ] Quantidade e denominação usual dos bens ou serviços, suficiente para determinar a taxa (al. b))
- [ ] Preço líquido de imposto e outros elementos do valor tributável (al. c))
- [ ] Taxa(s) e montante de IVA, separados por taxa (al. d))
- [ ] Motivo da isenção ou não liquidação, com o código da AT (al. e)); "IVA - autoliquidação" quando o devedor é o cliente (n.º 13); "IVA – regime de isenção" no art. 53.º — ver `references/iva-internacional.md`
- [ ] Data da entrega ou da prestação, se diferente da data de emissão (al. f))
- [ ] NIF do consumidor particular quando este o pede (n.º 16)
- [ ] Notas de crédito e débito com referência à fatura retificada e às menções alteradas (n.º 6)
- [ ] Todas as menções inseridas pelo próprio programa, sem campos escritos à mão (DL 28/2019, art. 7.º, n.º 1)

## Prazos de emissão (CIVA, art. 36.º, n.º 1)
- [ ] ⏰ Até ao **5.º dia útil** seguinte ao momento em que o IVA é devido (al. a))
- [ ] ⏰ Serviços a empresas de outros Estados-Membros (autoliquidação no destino): até ao **dia 15 do mês seguinte** (al. b))
- [ ] ⏰ Adiantamentos: fatura na **data do recebimento** (al. c))

## Comunicação à AT (DL 198/2012, art. 3.º)
- [ ] Via escolhida: tempo real (webservice), ficheiro SAF-T (PT) ou inserção no Portal. Quem produz SAF-T usa uma das duas primeiras (n.os 1 e 3)
- [ ] ⏰ Comunicação até ao **dia 5 do mês seguinte** ao da emissão (n.º 2)
- [ ] ⏰ Meses sem faturas: comunicação de "sem faturação" no mesmo prazo (n.º 9)
- [ ] Comprovativos das submissões guardados; falhas corrigidas antes do prazo (falta de comunicação é contraordenação grave — RGIT, art. 117.º, n.º 9)

## Fatura eletrónica — até 31/12/2026 e a partir de 1/1/2027 (DL 28/2019, art. 12.º)
- [ ] Até **31/12/2026**: PDF sem assinatura aceite como fatura eletrónica (Lei 73-A/2025, art. 95.º, n.º 3) — sem nova prorrogação confirmada a 4/10/2026
- [ ] A partir de **1/1/2027**, cada fatura enviada em formato eletrónico tem um destes mecanismos (art. 12.º, n.º 2):
  - selo eletrónico **qualificado** da empresa;
  - assinatura eletrónica **qualificada**;
  - EDI com acordo segundo o "Acordo tipo EDI europeu".
- [ ] Certificado **qualificado** (não "avançado"), emitido por prestador na **lista de confiança** (eIDAS, art. 22.º; GNS — DL 12/2021, art. 6.º), em nome da empresa (selo) ou de quem tem poderes para a representar (assinatura)
- [ ] O programa verifica se o certificado está revogado, caducado ou suspenso antes de assinar (art. 13.º, al. d)); renovação do certificado na agenda (`registar_prazo`)
- [ ] Assinatura validada num leitor de PDF comum numa fatura de teste
- [ ] Aceitação da via eletrónica pelos clientes registada por escrito (CIVA, art. 36.º, n.º 10; art. 12.º, n.º 1); quem recusar recebe em papel
- [ ] Clientes particulares sem envio: dispensa de impressão só com NIF na fatura, programa certificado e comunicação em tempo real (art. 8.º; Portaria 144/2019)

## Faturas recebidas
- [ ] Faturas de fornecedores em nome da empresa, com os elementos do art. 36.º (requisito da dedução — CIVA, art. 19.º, n.º 2, al. a))
- [ ] A partir de 1/1/2027: PDF recebidos com assinatura ou selo qualificado válidos. Os que não tiverem são devolvidos com pedido de versão assinada, EDI ou papel antes de deduzir o IVA **(a confirmar a orientação da AT para 2027)**
- [ ] Fornecedores avisados por escrito da regra de 2027
- [ ] Ficheiro original guardado (não só a impressão nem os dados do e-fatura)

## Contratos públicos (CCP, art. 299.º-B)
- [ ] Grande empresa: fatura eletrónica CIUS-PT desde 1/1/2021 (DL 111-B/2017, art. 9.º, n.º 3)
- [ ] **PME**: fatura eletrónica **CIUS-PT a partir de 1/1/2027** (art. 9.º, n.º 4, prorrogado até 31/12/2026 pela Lei 73-A/2025, art. 260.º, n.º 2). PDF por e-mail não serve
- [ ] Canal definido com cada entidade pública: programa com CIUS-PT, parceiro tecnológico ou Microportal FE-AP da eSPap (limite de documentos em `valores-2026`)

## Conservação e arquivo (DL 28/2019, arts. 19.º a 30.º)
- [ ] ⏰ Faturas, registos e documentos de suporte guardados **10 anos** (art. 19.º, n.º 1), ou mais se correr prazo de caducidade superior (n.º 2)
- [ ] Faturas eletrónicas emitidas e recebidas guardadas sem alterações, por ordem cronológica, **só em formato eletrónico** (art. 28.º, n.º 1)
- [ ] Arquivo eletrónico num Estado-Membro da UE; fora da UE só com autorização prévia da AT (arts. 20.º e 21.º); localização indicada na declaração de atividade (art. 20.º, n.º 5)
- [ ] Papel digitalizado com controlos de integridade; originais destruídos só depois de assegurados esses controlos e, nas faturas de compra, depois da dedução e do registo (art. 23.º, n.os 3 e 4)
- [ ] Cópias de segurança em local distinto do original (art. 27.º)
- [ ] Contrato com o fornecedor do programa ou do arquivo na cloud garante a exportação de todos os documentos e do SAF-T no fim do contrato e tem acordo de tratamento de dados (`assets/templates/dpa-bilingue.md`)

## SAF-T (PT) da contabilidade
- [ ] Contabilista avisado: o SAF-T da contabilidade aplica-se aos períodos de **2027** e seguintes, com entrega em **2028** (Lei 73-A/2025, art. 95.º, n.º 2; Portaria 31/2019)
- [ ] Programa de contabilidade exporta o ficheiro de auditoria tributária (DL 28/2019, art. 11.º, n.º 5)

## Coimas a evitar (RGIT — montantes em `valores-2026`)
- [ ] Faturas emitidas e dentro do prazo (art. 123.º, n.º 1); faturas exigidas e conservadas (art. 123.º, n.º 2)
- [ ] Comunicação à AT feita a tempo (art. 117.º, n.º 9)
- [ ] Programa certificado quando obrigatório e que cumpre os requisitos (art. 128.º, n.os 2 e 3)
- [ ] Recebeste uma notificação de coima ou de falta de comunicação → `playbooks/recebi-notificacao-at.md`
