<!-- Template: Registo das Atividades de Tratamento (RAT / ROPA) — art. 30.º do RGPD — em formato de tabela, com a
     Parte II para a empresa enquanto RESPONSÁVEL pelo tratamento (n.º 1) e a Parte III enquanto SUBCONTRATANTE
     (n.º 2). Inclui linhas-exemplo típicas de uma PME de qualquer setor (clientes/faturação, trabalhadores/RH,
     marketing, videovigilância, candidatos, site/cookies) — apagar o que não se aplica e acrescentar o resto.
     Âmbito: ue
     Base legal: Regulamento (UE) 2016/679 (RGPD) — arts. 30.º, 5.º, n.º 1, al. e), e n.º 2 (conservação e
     responsabilidade), 6.º e 9.º (licitude; categorias especiais), 10.º (condenações penais), 28.º
     (subcontratantes), 32.º (segurança), 35.º (AIPD), 44.º a 49.º (transferências); Lei 58/2019 (execução
     nacional); Lei 41/2004 (cookies e marketing eletrónico).
     Uso: documento INTERNO, por escrito, podendo ser eletrónico (art. 30.º, n.º 3) — não se envia à CNPD; é
     disponibilizado à CNPD quando esta o pedir (art. 30.º, n.º 4). Manter atualizado: rever ⏰ pelo menos uma vez
     por ano e sempre que entre um tratamento, finalidade, fornecedor ou transferência novos. Pode ser mantido
     numa folha de cálculo com as mesmas colunas. Articular com assets/templates/politica-privacidade.md,
     assets/templates/cookie-policy.md, assets/templates/dpa-bilingue.md e assets/checklists/checklist-rgpd.md. -->

# REGISTO DAS ATIVIDADES DE TRATAMENTO

> Artigo 30.º do Regulamento (UE) 2016/679 (RGPD) — documento interno de {{EMPRESA_NOME}}.

## Parte I — Identificação

| Campo | Preenchimento |
|---|---|
| Responsável pelo tratamento / subcontratante | {{EMPRESA_NOME}}, NIF/NIPC {{EMPRESA_NIF}}, sede em {{EMPRESA_MORADA}} |
| Contacto para proteção de dados | {{EMAIL_PRIVACIDADE}} · {{TELEFONE}} |
| Encarregado da proteção de dados (EPD/DPO) | {{EPD: nome e contacto — ou "Não designado (art. 37.º RGPD não aplicável — fundamentação: {{MOTIVO}})"}} |
| Representante na UE (art. 27.º) | {{REPRESENTANTE: opcional — só se a empresa não estiver estabelecida na UE}} |
| Responsáveis conjuntos (art. 26.º) | {{CORRESPONSAVEIS: opcional}} |
| Versão / data da última revisão | {{VERSAO}} · {{DATA_REVISAO}} |
| Responsável interno pela manutenção do registo | {{NOME_E_FUNCAO}} |

## Parte II — Atividades enquanto RESPONSÁVEL pelo tratamento (art. 30.º, n.º 1)

> Colunas obrigatórias: finalidades (al. b)), categorias de titulares e de dados (al. c)), destinatários (al. d)), transferências para países terceiros e garantias (al. e)), prazos de apagamento (al. f), "se possível") e medidas de segurança (al. g), "se possível"). O fundamento de licitude não é exigido pelo art. 30.º, mas registá-lo aqui facilita a política de privacidade e a prova da responsabilidade (art. 5.º, n.º 2).

| N.º | Atividade | Finalidade(s) | Fundamento de licitude (art. 6.º; art. 9.º se categorias especiais) | Categorias de titulares | Categorias de dados | Destinatários (incl. subcontratantes) | Transferências internacionais e garantias | Prazo de conservação | Medidas de segurança (art. 32.º) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Clientes — encomendas, contratos e faturação | Executar contratos, faturar, cobrar, apoio ao cliente, gestão de reclamações | Art. 6.º, n.º 1, al. b) (contrato) e al. c) (obrigações fiscais e contabilísticas); al. f) para cobrança e defesa em litígios | Clientes particulares; representantes e contactos de clientes empresariais | Identificação, contacto, NIF, morada, encomendas, faturas, dados de pagamento (sem guardar dados completos de cartão), comunicações | Contabilista certificado, software de faturação/ERP e alojamento (subcontratantes); AT (comunicação legal de faturas); bancos/PSP; transportadoras; advogados/agentes de cobrança | {{Nenhuma \| fornecedor {{X}} — {{PAÍS}} — decisão de adequação / Data Privacy Framework / Cláusulas-tipo (Decisão (UE) 2021/914)}} | Documentos contabilísticos e fiscais: 10 anos (art. 123.º CIRC — a confirmar); restantes dados do contrato: até ao fim do prazo de prescrição aplicável (a confirmar) | Perfis de acesso, MFA, cifra em trânsito, cópias de segurança, registo de acessos ao ERP |
| 2 | Trabalhadores — gestão de RH e processamento salarial | Gerir a relação laboral, salários, Segurança Social, IRS, seguro de acidentes de trabalho, SST, formação, registo de tempos de trabalho | Art. 6.º, n.º 1, als. b) e c); art. 9.º, n.º 2, al. b) (dados de saúde para medicina do trabalho; filiação sindical para quotização) | Trabalhadores, ex-trabalhadores, estagiários; dependentes (para IRS) | Identificação, NIF, NISS, IBAN, remunerações, assiduidade, férias, formação, avaliação; aptidão médica (ficha de aptidão, sem diagnóstico) | Gabinete de processamento salarial e software de RH (subcontratantes); Segurança Social; AT; ACT; seguradora de acidentes de trabalho; serviço de SST | {{Nenhuma \| ...}} | Duração do contrato + prazos legais laborais, fiscais e contributivos (ex.: créditos laborais prescrevem 1 ano após a cessação — art. 337.º CT, a confirmar) | Acesso restrito a RH; dados de saúde em pasta separada; cifra dos recibos enviados por e-mail |
| 3 | Marketing — newsletters e comunicações comerciais | Envio de newsletters, promoções e campanhas; medição de aberturas | Art. 6.º, n.º 1, al. a) (consentimento — Lei 41/2004, a confirmar artigo); para clientes existentes e produtos ou serviços semelhantes, regime de _soft opt-in_ com oposição fácil (a confirmar) | Subscritores; clientes | Nome, e-mail, preferências, prova do consentimento (data, origem, texto aceite), métricas de interação | Plataforma de e-mail marketing (subcontratante) | {{ex. plataforma nos EUA — Data Privacy Framework ou Cláusulas-tipo}} | Até à retirada do consentimento ou à oposição; manter lista de exclusão para não voltar a contactar; prova do consentimento enquanto for necessária para a demonstrar (a confirmar) | Dupla confirmação (_double opt-in_), lista de supressão, acesso restrito à plataforma |
| 4 | Videovigilância nas instalações | Proteção de pessoas e bens | Art. 6.º, n.º 1, al. f) (interesse legítimo), nos limites do art. 19.º da Lei 58/2019 (a confirmar) e, se houver empresa de segurança privada, da Lei 34/2013 | Trabalhadores, clientes, visitantes, fornecedores | Imagens (sem captação de som) | Empresa de segurança (subcontratante); autoridades judiciárias e policiais, mediante pedido legal | Nenhuma | 30 dias (art. 31.º, n.º 2, Lei 34/2013 — a confirmar) | Acesso só a pessoas autorizadas, registo de acessos, gravador fechado; avisos afixados; câmaras sem captar zonas de descanso, vestiários ou instalações sanitárias; proibido usar para controlar o desempenho dos trabalhadores (art. 20.º CT — a confirmar) |
| 5 | Candidatos — recrutamento | Selecionar candidatos; bolsa de candidaturas futuras | Art. 6.º, n.º 1, al. b) (diligências pré-contratuais a pedido do titular); al. a) (consentimento) para a bolsa de candidaturas | Candidatos a emprego e a estágio | CV, contactos, habilitações, experiência, notas de entrevista | Plataforma de recrutamento ou agência (subcontratantes) | {{Nenhuma \| ...}} | Registo do processo de recrutamento: 5 anos (art. 32.º, n.º 1, CT); CV na bolsa: {{PRAZO: ex. 12 meses}}, só com consentimento; restantes CV: apagar após o fim do processo | Acesso restrito a quem recruta; CV em pasta própria; apagamento programado |
| 6 | Site, formulários e cookies | Funcionamento e segurança do site; responder a contactos; estatísticas; publicidade | Cookies estritamente necessários: dispensam consentimento (Lei 41/2004 — a confirmar artigo), com base no art. 6.º, n.º 1, al. f); cookies analíticos e de marketing: al. a) (consentimento); formulário de contacto: al. b) ou f) | Visitantes do site; quem preenche formulários | IP, identificadores online, dados de navegação, preferências de cookies, dados do formulário | Alojamento, ferramenta de analítica, redes de publicidade, plataforma de gestão de consentimentos | {{ex. analítica/publicidade nos EUA — Data Privacy Framework ou Cláusulas-tipo}} | Conforme a política de cookies, cookie a cookie (`assets/templates/cookie-policy.md`); registos do servidor: {{PRAZO}}; prova do consentimento de cookies: {{PRAZO}} | TLS, atualizações de segurança, WAF, gestão de consentimentos que bloqueia cookies não essenciais até ao consentimento |
| 7 | {{OUTRA_ATIVIDADE: ex. fornecedores, frota/GPS, controlo biométrico de assiduidade, canal de denúncias}} | {{...}} | {{...}} | {{...}} | {{...}} | {{...}} | {{...}} | {{...}} | {{...}} |

## Parte III — Atividades enquanto SUBCONTRATANTE (art. 30.º, n.º 2)

> Preencher só se a empresa trata dados POR CONTA de clientes (ex.: software/SaaS, alojamento, processamento salarial ou contabilidade para terceiros, agência de marketing, call center). Cada linha deve corresponder a um contrato com acordo de tratamento de dados (art. 28.º — `assets/templates/dpa-bilingue.md`).

| N.º | Responsável por conta de quem trata (nome, contacto, EPD) | Categorias de tratamento efetuadas | Sub-subcontratantes autorizados | Transferências internacionais e garantias | Medidas de segurança (art. 32.º) | Contrato / DPA de referência |
|---|---|---|---|---|---|---|
| 1 | {{CLIENTE_1}} | {{ex. alojamento e manutenção da plataforma de vendas do cliente, com dados dos clientes finais deste}} | {{ex. fornecedor cloud {{X}}, região UE}} | {{Nenhuma \| ...}} | {{ex. cifra em repouso, MFA, segregação de ambientes, testes de restauro}} | {{ex. Contrato n.º {{N}} de {{DATA}}, Anexo DPA}} |
| 2 | {{CLIENTE_2}} | {{ex. processamento salarial dos trabalhadores do cliente}} | {{...}} | {{...}} | {{...}} | {{...}} |

## Parte IV — Notas de preenchimento

- **Exceção do n.º 5 do art. 30.º — raramente se aplica.** O RGPD dispensa o registo às empresas com **menos de 250 trabalhadores**, mas **só** se o tratamento (i) não for suscetível de implicar risco para os direitos e liberdades dos titulares, (ii) for **ocasional** e (iii) não abranger categorias especiais de dados (art. 9.º, n.º 1) nem dados sobre condenações penais (art. 10.º). Basta uma condição falhar para o registo ser obrigatório quanto a esse tratamento — e a faturação a clientes, o processamento salarial ou a videovigilância **não são ocasionais**, pelo que quase todas as empresas com clientes ou trabalhadores têm de manter registo pelo menos dessas atividades. Além disso, o registo é a forma mais simples de provar o cumprimento (art. 5.º, n.º 2). Está em curso, a nível da UE, uma proposta de simplificação que alarga esta exceção (pacote "Omnibus") — enquanto não for publicada no Jornal Oficial vale o texto atual [VERIFICAR].
- **Fundamento de licitude**: um por finalidade; o consentimento não deve ser usado quando o tratamento é necessário ao contrato ou imposto por lei. Interesse legítimo: documentar o teste de ponderação.
- **Categorias especiais** (saúde, biometria, origem racial ou étnica, convicções, filiação sindical, vida sexual — art. 9.º, n.º 1): exigem, além do art. 6.º, uma exceção do art. 9.º, n.º 2, e muitas vezes uma avaliação de impacto (art. 35.º).
- **Prazos de conservação**: indicar um prazo ou um critério objetivo; confirmar os prazos legais setoriais aplicáveis à empresa (fiscais, laborais, contributivos, regulatórios).
- **Transferências**: identificar o país e a garantia (decisão de adequação, Cláusulas-tipo, regras vinculativas, derrogações do art. 49.º — estas últimas documentadas).
- **Ligações**: cada destinatário que seja subcontratante tem de ter DPA; a política de privacidade deve refletir as Partes II e III.

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] Documento interno, por escrito (incluindo formato eletrónico) — **não** se envia à CNPD, só se disponibiliza a pedido (art. 30.º, n.os 3 e 4 RGPD).
- [ ] ⏰ Data da próxima revisão agendada (recomendado: anual) e processo para atualizar o registo quando entra um fornecedor, sistema ou finalidade novos.
- [ ] Prazos de conservação marcados "(a confirmar)" confirmados na legislação setorial em vigor (CIRC/CIVA, Código do Trabalho, Segurança Social, Lei 58/2019, Lei 34/2013) em dre.pt.
- [ ] Cada subcontratante listado tem acordo de tratamento de dados (`assets/templates/dpa-bilingue.md`); transferências para os EUA: confirmar a adesão do fornecedor ao Data Privacy Framework e a vigência deste (a confirmar).
- [ ] Avaliação de impacto (art. 35.º) ponderada para os tratamentos de risco elevado (videovigilância extensa, biometria, geolocalização de trabalhadores, perfilagem).
- [ ] Exceção do art. 30.º, n.º 5, e eventual alteração legislativa da UE confirmadas [VERIFICAR].
- [ ] Coerência com a política de privacidade (`assets/templates/politica-privacidade.md`), a política de cookies (`assets/templates/cookie-policy.md`) e `assets/checklists/checklist-rgpd.md`.
