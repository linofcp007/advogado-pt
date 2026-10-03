# Direito Bancário e Serviços Financeiros

> **Âmbito:** misto
> 💶 **Valores, taxas e montantes:** consulta `references/valores-2026.md` (ponto único de verdade). Artigos e prazos confirmados nos textos consolidados (pgdlisboa.pt, versão de 2026) e em bportugal.pt; o que não foi confirmado leva "(a confirmar)".
>
> 🔗 Garantias bancárias, fianças, avales e livranças: `references/garantias.md`. Empresa em incumprimento com o banco (PER, RERE): `references/insolvencia.md`. Burla informática e queixa-crime: `references/penal-cibercrime.md`. Livro de reclamações e RAL de consumo em geral: `references/consumo.md`. Seguros de crédito, de cartões e ciber-risco: `references/seguros.md`.

## Legislação Base
- **RGICSF** — Regime Geral das Instituições de Crédito e Sociedades Financeiras (DL 298/92): deveres de conduta das instituições e supervisão comportamental do Banco de Portugal; reclamações ao BdP (art. 77.º-A)
- **RJSPME** — Regime Jurídico dos Serviços de Pagamento e da Moeda Eletrónica (DL 91/2018, transpõe a PSD2 — Diretiva (UE) 2015/2366): operações não autorizadas, autenticação forte, débitos diretos, reclamações e RAL
- **Regulamento (UE) 2024/886** (transferências imediatas): **verificação do beneficiário** (nome ↔ IBAN) obrigatória e gratuita desde 09/10/2025
- **Regulamento (UE) 260/2012** (SEPA): transferências e débitos diretos em euros
- **Crédito aos consumidores**: DL 133/2009. A nova Diretiva (UE) 2023/2225 aplica-se a partir de 20/11/2026 — estado da transposição portuguesa (a confirmar)
- **Crédito à habitação e crédito com garantia imobiliária** a consumidores: DL 74-A/2017
- **PARI / PERSI** — prevenção e regularização do incumprimento de clientes bancários: DL 227/2012
- **Contas e comissões**: DL 27-C/2000 (serviços mínimos bancários); DL 107/2017 (contas de pagamento — comparabilidade de comissões, mudança de conta) (a confirmar); Lei 57/2020 (proteção do consumidor de serviços financeiros — comissões)
- **Venda de créditos bancários** a terceiros e gestores de créditos: DL 103/2025
- **Livro de Reclamações**: DL 156/2005; **RAL de consumo**: Lei 144/2015
- **Branqueamento de capitais**: Lei 83/2017; **proibição de pagamentos em numerário**: art. 63.º-E LGT; **RCBE**: Lei 89/2017 (Regime Jurídico do Registo Central do Beneficiário Efetivo, em anexo)
- **Investimento**: Código dos Valores Mobiliários (supervisão CMVM); criptoativos: Regulamento (UE) 2023/1114 (MiCA)

## Supervisão e onde reclamar
- **Banco de Portugal**: supervisiona a conduta de bancos, instituições de pagamento e de moeda eletrónica (informação, comissões, crédito, contas, pagamentos). Aprecia reclamações e pode impor medidas à instituição (art. 77.º-A RGICSF; art. 143.º DL 91/2018), mas **não fixa indemnizações** — para seres ressarcido precisas de acordo, RAL ou tribunal
- Escalada recomendada:
  1. **Reclamação escrita ao banco** (com cópia guardada). Em serviços de pagamento, resposta em ⏰ **15 dias úteis**, ou até **35 dias úteis** em casos excecionais justificados (art. 142.º, n.ºs 2-4 DL 91/2018)
  2. **Livro de Reclamações** físico (balcão) ou eletrónico (livroreclamacoes.pt) — segue para o BdP (DL 156/2005; ver `references/consumo.md`)
  3. **Portal do Cliente Bancário** (clientebancario.bportugal.pt) — reclamação direta ao Banco de Portugal
  4. **Resolução alternativa de litígios**: bancos e prestadores de pagamento têm de aderir a **pelo menos duas** entidades de RAL, para litígios até à alçada da 1.ª instância (art. 144.º, n.ºs 1-2 DL 91/2018); litígios transfronteiriços via rede **FIN-NET** (n.º 3). A lista consta do site e do contrato do banco (n.ºs 5-6)
  5. **Tribunal** (ou julgado de paz, dentro da sua competência — `references/valores-2026.md`)
- Crédito **vendido a um fundo** ou gerido por um "servicer": o regime da cessão e gestão de créditos bancários (DL 103/2025) manteve direitos do devedor e alargou a intervenção do BdP a estas entidades (a confirmar o âmbito exato)

## Serviços de pagamento: operações não autorizadas (fraude, phishing, SIM swap)
- **Os teus deveres**: usar o instrumento conforme as condições, proteger as credenciais e **comunicar sem atraso** a perda, furto ou utilização não autorizada (art. 110.º DL 91/2018). O banco tem de ter um canal disponível **a todo o momento** e gratuito (art. 111.º)
- ⏰ **Prazo para comunicar**: logo que saibas, sem atraso injustificado e **nunca mais de 13 meses** após a data do débito (art. 112.º, n.º 1) — o limite não se aplica se o banco não te deu a informação obrigatória sobre a operação (n.º 2)
- **Ónus da prova do banco**: tem de provar que a operação foi autenticada, registada e não afetada por avaria; o simples registo de utilização do instrumento **não basta** para provar que autorizaste, que agiste com fraude ou com negligência grosseira — o banco tem de apresentar elementos concretos (art. 113.º)
- ⏰ **Reembolso pelo banco**: **imediato**, o mais tardar até ao **fim do 1.º dia útil seguinte** à tua comunicação, com data-valor do débito (art. 114.º, n.ºs 1 e 3). Só pode não reembolsar nesse prazo se tiver motivos razoáveis para suspeitar de **fraude tua** e os comunicar **por escrito às autoridades judiciárias** no mesmo prazo (n.º 2). Sem isso, deve juros à **taxa legal + 10 pontos percentuais** desde a tua contestação (n.º 10; taxa legal em `references/valores-2026.md`)
- **Quanto podes ter de suportar** (art. 115.º):
  - Instrumento perdido, furtado ou apropriado: até ao **limite fixo** do n.º 1 — ver `references/valores-2026.md` — e **nada** se a perda não era detetável por ti ou foi causada pelo banco/seus agentes (n.º 2)
  - **Negligência grosseira**: até ao saldo disponível ou ao limite de crédito associado (n.º 4)
  - **Fraude** tua ou incumprimento **deliberado** dos teus deveres: todas as perdas (n.º 3)
  - Banco **não exigiu autenticação forte**: nada, salvo fraude (n.º 5)
  - **Depois de comunicares** a perda/furto/uso indevido: nada, salvo fraude (n.º 7)
- **Autenticação forte** obrigatória para aceder à conta online, iniciar pagamentos eletrónicos e atos remotos com risco de fraude (art. 104.º)
- **Phishing, vishing, smishing, SIM swap**: a discussão é quase sempre se houve **negligência grosseira** (ex.: entregar códigos de autenticação a um "falso funcionário", ignorar alertas). A jurisprudência é casuística — ver acórdãos concretos em dgsi.pt (a confirmar). Não aceites a recusa genérica do banco: exige os elementos de prova do art. 113.º, n.º 4
- **Fraude com pagamento autorizado por ti** (burla do "olá pai/mãe", **fornecedor falso que muda o IBAN**, "CEO fraud"): se foste tu a dar a ordem, em regra **não** é operação "não autorizada" e o reembolso do art. 114.º não se aplica (a confirmar caso a caso). O banco não responde pela execução conforme o IBAN indicado, mas tem de fazer **esforços razoáveis para recuperar** os fundos e dar-te a informação para agires judicialmente (art. 129.º). A **verificação do beneficiário** (Reg. (UE) 2024/886) avisa quando nome e IBAN não coincidem — prosseguir apesar do alerta pesa contra ti (a confirmar)
- **Atuar no próprio dia**: bloquear cartões/acessos → comunicar ao banco por escrito → pedir recall/bloqueio da transferência → **queixa-crime** (burla — art. 217.º CP; burla informática — art. 221.º CP; ver `references/penal-cibercrime.md`) → reclamação ao BdP se o banco não reembolsar
- **Débitos diretos**: débito **autorizado** iniciado pelo credor — pedido de reembolso em ⏰ **8 semanas** após o débito (art. 118.º, n.º 1); nos débitos diretos SEPA "core" o reembolso é **incondicional** (art. 117.º, n.º 6); o banco reembolsa ou justifica a recusa em **10 dias úteis** (art. 118.º, n.º 2). Débito **sem mandato** = operação não autorizada → regime dos 13 meses
- Ver `assets/templates/reclamacao-banco-operacao-nao-autorizada.md`

## Cliente consumidor vs. empresa
- **Consumidor**: pessoa singular que atua fora da sua atividade comercial ou profissional (art. 2.º, al. f) DL 91/2018). **Microempresa** (definição da Recomendação 2003/361/CE — menos de 10 trabalhadores e volume de negócios ou balanço até ao limiar europeu (ver `references/valores-2026.md`)) é **equiparada ao consumidor** nos serviços de pagamento (arts. 76.º, n.º 2 e 100.º, n.º 1), salvo se aceitar débitos diretos B2B sem reembolso (art. 117.º, n.º 7)
- **Empresas que não são microempresas** — o contrato pode afastar (art. 76.º, n.º 3 e art. 100.º, n.º 2 DL 91/2018):
  - as regras de **informação** pré-contratual e contratual
  - o **ónus da prova** do banco (art. 113.º), os **limites de responsabilidade** do ordenante (art. 115.º), o reembolso de débitos autorizados (arts. 117.º-118.º) e regras de execução e responsabilidade (arts. 101.º, n.º 2, 103.º, n.ºs 6-7, 121.º, 130.º-132.º)
  - o **prazo de 13 meses** para comunicar (art. 112.º) — pode ser encurtado
  - O dever de reembolso imediato do art. 114.º **não** consta dessa lista de derrogações
- Na prática, para empresas: ler o contrato de homebanking empresarial (prazos de reclamação, utilizadores e perfis de autorização, limites, obrigações de segurança); usar **dupla autorização** para transferências; confirmar mudanças de IBAN de fornecedores **por telefone para um contacto já conhecido**; preferir débitos SEPA "core" se quiseres manter o direito de reembolso
- **ENI**: no crédito, é consumidor só quando contrata para fins **alheios** à atividade (art. 4.º DL 133/2009; art. 4.º DL 74-A/2017) — crédito para o negócio não beneficia do regime do consumo nem do PERSI

## Crédito aos consumidores e crédito à habitação (traços gerais)
- **Crédito aos consumidores** (DL 133/2009; montantes abrangidos e exclusões no art. 2.º — (ver `references/valores-2026.md`)):
  - ⏰ **Livre revogação: 14 dias** de calendário, sem motivo, desde a celebração ou da receção do contrato (art. 17.º); devolver capital e juros em 30 dias
  - **Reembolso antecipado** a todo o tempo com pré-aviso mínimo de 30 dias; comissão só em taxa fixa, com teto legal em percentagem do capital (art. 19.º)
  - **Usura**: TAEG máximas por tipo de crédito, divulgadas **trimestralmente** pelo Banco de Portugal; o excesso reduz-se automaticamente (art. 28.º)
- **Crédito à habitação** (DL 74-A/2017): Ficha de Informação Normalizada Europeia (FINE); **período de reflexão** de 7 dias antes de aceitar a proposta (art. 13.º, n.º 5); **reembolso antecipado** com pré-aviso (7 dias úteis parcial / 10 dias úteis total) e comissão máxima em percentagem do capital, conforme taxa variável ou fixa; isento em caso de morte, desemprego ou deslocação profissional (art. 23.º). Medidas temporárias de apoio ao aumento das taxas: confirmar vigência (a confirmar)
- Garantias pessoais pedidas pelo banco (fiança, aval, livrança): ver `references/garantias.md`

## PERSI — clientes bancários em dificuldades (DL 227/2012)
- Aplica-se a **consumidores** mutuários (art. 3.º, al. a)) em crédito à habitação, crédito aos consumidores e descobertos (art. 2.º). **Não** se aplica a empresas
- **PARI** (arts. 9.º-11.º-C): se estás em **risco** de incumprir, avisa o banco por escrito — tem de acompanhar a situação e procurar soluções antes da mora; se depois entrares em mora, a integração no PERSI é imediata (art. 14.º, n.º 2, al. b))
- Na renegociação, o banco **não pode cobrar comissões** pela análise/formalização nem **agravar a taxa de juro** (art. 8.º)
- ⏰ **Integração obrigatória** no PERSI entre o **31.º e o 60.º dia** após o vencimento em falta (art. 14.º, n.º 1); imediata se, já em mora, o pedires por escrito (n.º 2); o banco comunica a integração em 5 dias (n.º 4)
- **Proteções**: durante o PERSI o banco **não pode** resolver o contrato, **intentar ações judiciais** nem ceder o crédito (salvo exceções) (art. 18.º, n.º 1) — instaurar execução sem PERSI prévio é exceção invocável pelo devedor (a confirmar a jurisprudência dominante em dgsi.pt)
- **Extinção**: pagamento, acordo, **91.º dia** após a integração (salvo prorrogação), insolvência, ou por iniciativa do banco nos casos do art. 17.º, n.º 2 — sempre comunicada por escrito com fundamento (n.ºs 3-4)
- **Fiador**: informado em 15 dias após o vencimento em mora e pode pedir PERSI próprio em 10 dias após ser interpelado (art. 21.º)
- **Rede extrajudicial de apoio a clientes bancários** (coordenada pela DGC): informação, aconselhamento e acompanhamento **gratuitos** (art. 6.º) — o banco tem de te indicar estas entidades

## Contas, comissões e débitos
- Comissões só se previstas no **preçário** e no contrato; limites e proibições específicas (ex.: comissões em transferências por apps, processamento de prestações) na Lei 57/2020 e no RGICSF (a confirmar o detalhe vigente)
- **Serviços mínimos bancários** (DL 27-C/2000): conta à ordem com cartão de débito e operações essenciais a custo reduzido, para particulares que a peçam (a confirmar condições atuais)
- **Mudança de conta** e documento de informação sobre comissões: DL 107/2017 (a confirmar)
- **Débitos diretos**: podes limitar montantes/periodicidade ou bloquear credores no teu banco; para reembolso ver acima (arts. 117.º-118.º DL 91/2018)
- **Central de Responsabilidades de Crédito** do BdP: consulta gratuita das responsabilidades reportadas em teu nome e pedido de retificação ao banco que reportou (a confirmar o regime)

## Garantias bancárias e fianças
- Garantia bancária autónoma "on first demand", fiança, aval e livrança em financiamentos: ver `references/garantias.md`
- Para suspender uma execução fiscal com garantia bancária: ver `references/contencioso-tributario.md`

## Branqueamento de capitais — obrigações das empresas (Lei 83/2017)
- **Entidades obrigadas não financeiras** (art. 4.º, n.º 1), entre outras: atividade imobiliária; auditores, contabilistas certificados e consultores fiscais; advogados, solicitadores e notários nas operações do n.º 2 (imóveis, sociedades, contas, fundos); **prestadores de serviços a sociedades** (domiciliação, constituição, administração fiduciária — n.º 3); leiloeiras e prestamistas; comércio de obras de arte e de **bens de elevado valor** (ouro, joias, antiguidades, veículos, embarcações, aeronaves) acima dos limiares de pagamento; e **qualquer comerciante ou prestador de serviços que receba em numerário** valor igual ou superior ao limiar da al. n) — limiares: (ver `references/valores-2026.md`)
- **Deveres** (art. 11.º): identificação e diligência sobre clientes e beneficiários efetivos (arts. 23.º ss.); **comunicar operações suspeitas** de imediato ao DCIAP e à UIF (art. 43.º); **abster-se** de executar operações suspeitas (art. 47.º); **conservar** documentos **7 anos** (art. 51.º); formação (art. 55.º); políticas e controlo internos proporcionais à dimensão
- Fiscalização por autoridade setorial conforme a atividade (art. 89.º — ex.: ASAE, IMPIC, ordens profissionais) (a confirmar a entidade concreta do teu setor)
- **Pagamentos em numerário** (art. 63.º-E LGT): **proibido** pagar ou receber em numerário em transações a partir do limiar do n.º 1 (limiar mais alto para particulares não residentes que não atuem como empresários — n.º 3); empresas obrigadas a ter conta bancária (art. 63.º-C) pagam faturas a partir do limiar do n.º 2 por meio que identifique o destinatário; os pagamentos **fracionados somam-se** (n.º 4); impostos em numerário acima do limiar do n.º 5 são proibidos — limiares: (ver `references/valores-2026.md`)
- O novo Regulamento (UE) 2024/1624 (AMLR) prevê um limite europeu a pagamentos em numerário, aplicável a partir de 2027 (a confirmar data e valor); Portugal pode manter o seu limite mais baixo

## RCBE — Registo Central do Beneficiário Efetivo (Lei 89/2017)
- **Quem**: sociedades e demais entidades do art. 3.º do regime anexo (exclusões no art. 4.º — a confirmar a lista); quem declara: gerentes/administradores ou quem tenha legitimidade (art. 6.º do regime)
- ⏰ **Declaração inicial**: **30 dias** após o registo de constituição (ou inscrição no Ficheiro Central de Pessoas Coletivas) (art. 12.º, n.º 1 do regime)
- ⏰ **Alterações** (cessão de quotas, novo sócio controlador, mudança de gerência relevante): no mais curto prazo, **nunca além de 30 dias** após o facto (art. 14.º, n.º 1)
- ⏰ **Confirmação anual até 31 de dezembro** (art. 15.º, n.º 1), que pode ser feita com a **IES** (n.º 2); dispensada se já atualizaste nesse ano sem novas alterações (n.º 3)
- **Sócios** devem informar a sociedade e atualizar os seus dados em **15 dias** após qualquer alteração; o incumprimento após notificação permite a **amortização da quota** (art. 5.º da Lei 89/2017)
- **Sem RCBE em dia**, a sociedade fica impedida de: **distribuir lucros**, contratar com o Estado e entidades públicas, concorrer a concessões, receber **fundos europeus** e apoios públicos, intervir em negócios sobre **imóveis**, entre outros (art. 37.º, n.º 1 do regime); o incumprimento é publicitado (n.º 2). Coima e emolumento agravado por atraso: (ver `references/valores-2026.md`). Falsas declarações: crime (art. 348.º-A CP) e responsabilidade civil (art. 38.º)
- Os bancos e outras entidades obrigadas identificam o beneficiário efetivo no "KYC" (Lei 83/2017) e consultam o RCBE — RCBE desatualizado pode atrasar ou bloquear a abertura de conta e operações (a confirmar o fundamento concreto)

## CMVM e investimento (breve)
- A **CMVM** supervisiona intermediários financeiros (incluindo bancos na vertente de investimento), mercados, fundos e plataformas; reclamações de investidores no site da CMVM (a confirmar o canal atual)
- Antes de investir: o intermediário tem de avaliar a **adequação** do produto ao teu perfil e informar sobre riscos e custos (Código dos Valores Mobiliários / MiFID II) (a confirmar artigos)
- **Depósitos** estão cobertos pelo Fundo de Garantia de Depósitos até um limite por depositante e por instituição; **instrumentos financeiros** confiados a intermediários, pelo Sistema de Indemnização aos Investidores (não cobre perdas de mercado) — limites: (ver `references/valores-2026.md`)
- Confirma sempre se a entidade está **autorizada** (registos e alertas de entidades não autorizadas do BdP e da CMVM). **Criptoativos**: só prestadores autorizados ao abrigo do MiCA (autoridade nacional competente a confirmar)

## Para o contexto do utilizador
- **Empresa (Lda/SA)**: as proteções de consumidor nos pagamentos só se aplicam se fores **microempresa**; acima disso, o contrato manda — negociar prazos de reclamação, limites e regras de prova. Implementa controlo interno anti-fraude (dupla autorização, verificação do beneficiário, confirmação de IBAN por canal independente)
- **Gerentes**: o banco consulta o RCBE e exige identificação dos beneficiários efetivos — manter RCBE e pacto social atualizados evita bloqueios de conta e impedimentos de distribuir lucros
- **ENI e particulares**: tens as proteções de consumidor nas contas pessoais; numa conta usada para a atividade, o banco pode tratar-te como não consumidor (a confirmar no contrato)
- **Setores de risco BC/FT** (imobiliário, contabilidade, consultoria fiscal, serviços a sociedades, comércio de bens de luxo/veículos, leilões, arte): verificar se és entidade obrigada e montar os procedimentos da Lei 83/2017
- **Qualquer empresa que receba numerário**: respeitar o limite do art. 63.º-E LGT (proibição) e, acima do limiar da al. n) do art. 4.º, os deveres de entidade obrigada
- Usa o perfil da empresa (`.advogado-pt/perfil-empresa.md`) para saber se é microempresa (n.º de trabalhadores e volume de negócios), o setor e a forma jurídica
- Fraude de valor elevado, recusa de reembolso com acusação de negligência grosseira, ou execução bancária iminente → **advogado** e, em paralelo, reclamação ao BdP

## Templates
- `assets/templates/reclamacao-banco-operacao-nao-autorizada.md` — reclamação ao banco por operação de pagamento não autorizada (arts. 110.º-115.º DL 91/2018), com pedido de reembolso e escalada para o BdP/RAL
- `assets/templates/carta-participacao-sinistro.md` — participação à seguradora quando a fraude ou perda está coberta (seguro de cartões, ciber-risco, proteção de pagamentos)
