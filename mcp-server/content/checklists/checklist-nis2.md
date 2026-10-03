# Checklist — Cibersegurança NIS2 (DL 125/2025, Regime Jurídico da Cibersegurança)

> **Quando usar:** para saber se a empresa está abrangida pelo novo regime de cibersegurança, se é entidade essencial ou importante e o que tem de ter em dia: registo no CNCS, governação, medidas, notificação de incidentes, cadeia de abastecimento e supervisão. Serve também ao fornecedor de TIC de uma entidade abrangida, que recebe as exigências por contrato.
> **Âmbito:** misto — Diretiva (UE) 2022/2555 (NIS2) transposta pelo DL 125/2025 e regulamentada pelo Regulamento do CNCS n.º 756/2026.
> **Referência:** `references/digital-ue.md` (NIS2), `references/compliance.md` (quadro por dimensão), `references/rgpd.md` e `playbooks/data-breach.md` (violação de dados). Coimas e limiares de dimensão em `references/valores-2026.md`. Confirmar a redação em vigor em diariodarepublica.pt e as instruções técnicas em cncs.gov.pt (MyCiber). O setor, o número de trabalhadores e o volume de negócios estão no perfil da empresa (`.juridico-pt/perfil-empresa.md`).

## Antes de começar — o quadro legal
- [ ] **DL 125/2025**, de 4 de dezembro (DR, 1.ª série, n.º 234): aprova em anexo o **Regime Jurídico da Cibersegurança (RJC)** e transpõe a Diretiva (UE) 2022/2555. Em vigor desde **3/4/2026**, 120 dias após a publicação (art. 11.º do decreto-lei). Os artigos citados abaixo sem outra indicação são do RJC (anexo)
- [ ] O DL 125/2025 **revogou** a Lei 46/2018 (antigo regime jurídico da segurança do ciberespaço) e o DL 65/2021, que a regulamentava (art. 9.º, als. b) e c), do decreto-lei). A revogação dos arts. 59.º a 65.º da Lei das Comunicações Eletrónicas (Lei 16/2022) só produz efeitos quando a ANACOM substituir os seus regulamentos (arts. 9.º, al. d), e 10.º, n.º 1)
- [ ] **Regulamento n.º 756/2026** do CNCS (DR, 2.ª série, n.º 118, de 22/6/2026), em vigor desde 23/6/2026 (art. 34.º): plataforma **MyCiber**, Quadro Nacional de Referência para a Cibersegurança (QNRCS), matriz de risco, níveis de conformidade (**básico, substancial, elevado**) e medidas mínimas (anexos III e IV)
- [ ] ⏰ **Efeitos diferidos**: as medidas de cibersegurança (art. 27.º, n.os 1 e 2), a cadeia de abastecimento (art. 28.º), a gestão do risco residual (art. 29.º), o relatório anual (art. 30.º) e as coimas correspondentes (art. 61.º, n.º 1, als. b), c) e f)) só produzem efeitos **24 meses após a publicação da regulamentação** (art. 10.º, n.º 2, do decreto-lei). O CNCS conta os 24 meses a partir da publicação do Regulamento 756/2026, o que aponta para junho de 2028 (a confirmar a data exata). O registo, o responsável de cibersegurança, o ponto de contacto e a notificação de incidentes **já se aplicam**

## 1. Estou abrangido?
- [ ] A atividade corresponde a um **tipo de entidade dos anexos I ou II** (lista completa na FAQ do CNCS e no anexo do DL 125/2025):
  - **Anexo I — setores de importância crítica**: energia; transportes; setor bancário; infraestruturas do mercado financeiro; saúde; água potável; águas residuais; infraestruturas digitais (pontos de troca de tráfego, DNS, registos de TLD, computação em nuvem, centros de dados, redes de distribuição de conteúdos, serviços de confiança, redes e serviços de comunicações eletrónicas); **gestão de serviços TIC entre empresas** (prestadores de serviços geridos e de serviços de segurança geridos); espaço.
  - **Anexo II — outros setores críticos**: serviços postais e de estafeta; gestão de resíduos; produtos químicos; produtos alimentares; indústria transformadora (dispositivos médicos, equipamentos informáticos, eletrónicos e óticos, equipamento elétrico, máquinas e, a confirmar no anexo, veículos e outro equipamento de transporte); **prestadores de serviços digitais** (mercados em linha, motores de pesquisa, redes sociais); investigação.
- [ ] **Critério de dimensão** (art. 3.º, n.º 1, al. a)): a entidade privada só fica abrangida se for **média empresa ou maior** — 50 ou mais trabalhadores, ou acima dos limiares financeiros da pequena empresa (anexo III, art. 2.º, que reproduz a Recomendação 2003/361/CE; limiares em `references/valores-2026.md`). Se a regra europeia de somar empresas parceiras e associadas se aplica também aqui, não está confirmado: o anexo III só transcreve as definições (a confirmar com o CNCS)
- [ ] **Abrangido qualquer que seja a dimensão** (art. 3.º, n.os 2 e 5): redes e serviços de comunicações eletrónicas; prestadores de serviços de confiança; registos de TLD, serviços de registo de domínios e DNS; único prestador de um serviço essencial; entidade cuja perturbação afete a segurança, a proteção ou a saúde públicas, ou gere riscos sistémicos; entidade crítica nacional ou regional; entidades críticas da Diretiva (UE) 2022/2557
- [ ] **Território** (art. 4.º): tem estabelecimento em Portugal. Para nuvem, centros de dados, CDN, serviços geridos, serviços de segurança geridos, mercados em linha, motores de pesquisa e redes sociais conta o **estabelecimento principal**, isto é, onde se tomam as decisões de gestão do risco de cibersegurança (n.º 2)
- [ ] **Setor financeiro**: o DORA (Reg. (UE) 2022/2554) não é afastado (art. 3.º, n.º 9). Mesmo assim, a entidade regista-se, designa o responsável e o ponto de contacto e notifica incidentes nos termos do RJC (Regulamento 756/2026, art. 10.º, n.os 2 e 3)
- [ ] Testado o **simulador do CNCS** na MyCiber. É indicativo e não vinculativo, e não cobre os critérios das als. b) a e) do n.º 2 nem o n.º 5 do art. 3.º
- [ ] **Não abrangido, mas fornecedor de TIC** de uma entidade abrangida → ver a secção 7 (cadeia de abastecimento): as obrigações chegam por contrato

## 2. Entidade essencial ou importante?
- [ ] **Entidade essencial** (art. 6.º, n.º 1), entre outras:
  - tipos do anexo I que **excedam os limiares de média empresa** (grandes empresas);
  - prestadores qualificados de serviços de confiança, registos de TLD e prestadores de DNS, de qualquer dimensão;
  - fornecedores de redes ou serviços de comunicações eletrónicas que sejam médias empresas;
  - entidades críticas da Diretiva (UE) 2022/2557;
  - outras que o CNCS qualifique como essenciais em função do risco, com audiência prévia (art. 8.º, n.os 3 e 4).
- [ ] **Entidade importante** (art. 6.º, n.os 2 e 3): as restantes entidades dos anexos I e II abrangidas, por exemplo uma média empresa do anexo I ou uma média ou grande empresa do anexo II
- [ ] Mais do que uma qualificação possível → aplica-se a mais exigente (art. 9.º, n.º 1)
- [ ] Diferenças práticas registadas:
  - supervisão **ex ante** para as essenciais (art. 54.º) e **ex post**, após indícios, para as importantes (art. 55.º);
  - relatório anual **remetido** pelas essenciais e entregue **a pedido** pelas importantes (art. 30.º, n.os 2 e 4);
  - molduras de coima diferentes (`references/valores-2026.md`).
- [ ] **Nível de conformidade** (básico, substancial ou elevado) e medidas mínimas aplicáveis lidos na notificação final de qualificação (Regulamento 756/2026, arts. 9.º, n.º 5, e 28.º)

## 3. Registo e qualificação na MyCiber
- [ ] ⏰ **Autoidentificação** na plataforma MyCiber (art. 8.º, n.º 1):
  - entidade que inicie atividade: **30 dias** após o início;
  - entidade já em atividade: **60 dias** após a disponibilização da plataforma. O CNCS conta em **dias úteis** (CPA, art. 87.º): a MyCiber abriu a 23/6/2026, e o prazo terminou a **15/9/2026**.
  - Falhaste o prazo? Regista-te já. Não cumprir os deveres dos arts. 8.º e 35.º é **contraordenação grave** (art. 62.º, n.º 1, als. a) e b)), mas há advertência prévia antes de processo, salvo dolo (art. 66.º, n.º 5).
- [ ] Registo feito pelo **representante legal**, com Cartão de Cidadão ou Chave Móvel Digital. Se for outra pessoa, comprovativo de poderes ou procuração (Regulamento 756/2026, art. 7.º)
- [ ] Dados submetidos (art. 35.º; Regulamento, art. 8.º): nome, NIF, contactos, **gamas de endereços IP**, setor e subsetor, Estados-Membros onde presta serviços, número de trabalhadores, volume de negócios ou balanço e adesão ao serviço público de notificações eletrónicas
- [ ] ⏰ **Projeto de ato de qualificação**: audiência dos interessados em **10 dias úteis** (Regulamento, art. 9.º, n.º 2; CPA, arts. 121.º e seguintes). Confirma o setor, a dimensão e a qualificação antes de deixar passar o prazo
- [ ] Qualificação final notificada (prazo do CNCS: 30 dias — art. 8.º, n.º 5). Pode ser impugnada pelos meios e prazos do CPA (Regulamento, art. 9.º, n.º 10)
- [ ] ⏰ Dados mantidos atualizados: alterações comunicadas em **30 dias úteis** (art. 35.º, n.º 3), ou **3 meses** para TLD, DNS, nuvem, centros de dados, CDN, serviços geridos, mercados em linha, motores de pesquisa e redes sociais (n.º 4)
- [ ] Área reservada consultada com regularidade: as notificações do CNCS consideram-se feitas na data da consulta ou, sem consulta, **3 dias** depois da receção (art. 72.º, n.º 4)

## 4. Governação — órgão de administração, responsável e ponto de contacto
- [ ] O **órgão de gestão ou administração** (art. 25.º, n.º 1):
  - **aprova** as medidas de gestão dos riscos de cibersegurança;
  - **supervisiona** a sua aplicação;
  - assegura o cumprimento das medidas de supervisão e de execução;
  - assegura **formação regular** em cibersegurança.
- [ ] Administradores e gerentes informados de que **podem responder** por ação ou omissão, com dolo ou culpa grave (art. 25.º, n.º 2). A responsabilidade só pode ser delegada num dos titulares do órgão (n.º 3). Uma das sanções acessórias possíveis é a **interdição temporária** de funções (art. 67.º, al. f))
- [ ] Prova guardada: ata de aprovação das medidas, registo da formação dos administradores e relatórios do responsável ao órgão
- [ ] **Responsável de cibersegurança** designado (art. 31.º): membro do órgão de gestão ou alguém que lhe responda diretamente (n.º 1). Pode acumular outras funções (n.º 8). Num grupo, pode haver um responsável comum (n.º 7)
- [ ] **Ponto de contacto permanente**, pessoa ou equipa, disponível **24 horas por dia, 7 dias por semana** durante os períodos de ativação comunicados pela autoridade, com contactos principais e alternativos (art. 32.º, n.os 1, 2 e 6)
- [ ] ⏰ Responsável e ponto de contacto comunicados ao CNCS em **20 dias úteis**. Para as entidades já em atividade, o prazo conta da **notificação da qualificação final** (Regulamento 756/2026, arts. 14.º, n.º 2, e 15.º, n.º 2; RJC, arts. 31.º, n.os 3 e 4, e 32.º, n.os 3 e 4). Substituições comunicadas sem demora (arts. 31.º, n.º 5, e 32.º, n.º 5)

## 5. Gestão de riscos e medidas de cibersegurança
- [ ] **Sistema de gestão de riscos** que cubra todos os ativos das redes e sistemas de informação, incluindo o ambiente físico, com medidas proporcionais à exposição, à dimensão e ao impacto (art. 26.º, n.os 1 a 3)
- [ ] Medidas nas **áreas mínimas** do art. 27.º, n.º 1:
  - a) tratamento de incidentes;
  - b) continuidade das atividades (cópias de segurança, recuperação de desastres) e gestão de crises;
  - c) segurança da cadeia de abastecimento;
  - d) segurança na aquisição, desenvolvimento e manutenção de sistemas, incluindo a gestão e divulgação de vulnerabilidades;
  - e) avaliação da eficácia das medidas;
  - f) ciber-higiene e formação, **incluindo os órgãos de gestão**;
  - g) criptografia e cifragem;
  - h) segurança dos recursos humanos, controlo de acessos e gestão de ativos;
  - i) **autenticação multifator** ou contínua, comunicações seguras e comunicações de emergência.
- [ ] Medidas mínimas do **anexo III do Regulamento 756/2026** para o nível de conformidade atribuído, e também as dos níveis inferiores (Regulamento, art. 30.º, n.os 1 e 2)
- [ ] **Análise de riscos** pelo menos **uma vez por ano** e sempre que o CNCS notifique uma ameaça emergente (Regulamento, art. 31.º, n.º 2). Análise do risco residual documentada (RJC, art. 29.º, n.º 3)
- [ ] ⏰ **Lista de ativos acessíveis publicamente pela Internet** (serviço suportado, equipamento ou software, versão, IP, FQDN, fabricante, dependências) comunicada ao CNCS (Regulamento, art. 32.º):
  - versão inicial até **31 de janeiro** do ano seguinte à notificação da qualificação, ou **6 meses** após essa notificação, o que vencer primeiro;
  - atualização anual, em janeiro.
  - A lista é informação classificada como "reservado": restringe o acesso interno.
- [ ] Certificação considerada: o certificado do esquema QNRCS, ou ISO/IEC 27001 com âmbito que cubra todos os sistemas dos serviços abrangidos, dá **presunção de cumprimento** (Regulamento, art. 27.º). ⏰ Revogação do certificado comunicada em **72 horas**; suspensão, renovação ou alteração de âmbito em **10 dias úteis** (n.º 6)
- [ ] ⏰ **Prazos de adaptação**: medidas com efeitos diferidos (ver "Antes de começar"); se a qualificação ou as medidas mínimas mudarem, **6 meses**, prorrogáveis até 1 ano a pedido fundamentado (art. 26.º, n.º 8)
- [ ] ⏰ **Relatório anual** (art. 30.º), quando produzir efeitos: as entidades essenciais remetem-no até ao **último dia útil de janeiro**, assinado pelo responsável de cibersegurança. As importantes entregam-no quando o CNCS o pedir. Inclui a estatística trimestral de incidentes, por isso o registo interno de incidentes começa já

## 6. Incidentes significativos — notificação ao CNCS
- [ ] Procedimento interno de resposta a incidentes, com critérios de **"impacto significativo"** (art. 40.º, n.os 3 e 4):
  - para infraestruturas digitais e serviços TIC, os do Regulamento de Execução (UE) 2024/2690;
  - para as restantes entidades, os da instrução técnica do CNCS (Regulamento 756/2026, art. 20.º, n.º 3).
- [ ] ⏰ **Notificação inicial**: sem demora injustificada e **até 24 horas** depois de concluíres que existe, ou pode vir a existir, um incidente significativo (art. 42.º, n.º 1)
- [ ] ⏰ **Atualização em 72 horas**: quando necessário, até 72 horas após a verificação, com uma avaliação inicial da gravidade, do impacto e dos indicadores de exposição (art. 42.º, n.º 3)
- [ ] ⏰ **Notificação do fim do impacto significativo**: até **24 horas** após o fim do impacto (art. 43.º, n.º 1). Se o incidente ficar resolvido nas **2 horas** seguintes à deteção, basta esta notificação (art. 41.º, n.º 2)
- [ ] ⏰ **Relatório final**: **30 dias úteis** a contar da notificação do fim do impacto (art. 44.º, n.º 1). Atenção: a lei portuguesa **não** segue o "relatório final em 1 mês" da diretiva (art. 23.º NIS2). Se o incidente continuar em curso, a autoridade pode pedir relatórios intercalares semanais (art. 44.º, n.º 3)
- [ ] Notificações feitas na **MyCiber** (art. 40.º, n.º 6). Se a plataforma ou a tua capacidade estiverem em baixo, a título excecional, por e-mail ou telefone (art. 83.º, n.º 3; Regulamento, arts. 17.º e 20.º, n.º 4)
- [ ] **Destinatários dos serviços** informados, sem demora, dos incidentes significativos que os possam afetar e das medidas que podem tomar, gratuitamente e em linguagem simples (art. 48.º)
- [ ] Notificações paralelas verificadas, porque a do CNCS não as dispensa (art. 40.º, n.º 5):
  - **CNPD** em 72 horas, se houver dados pessoais (RGPD, art. 33.º) — `playbooks/data-breach.md`;
  - Polícia Judiciária ou Ministério Público, se houver crime;
  - autoridade financeira, se a entidade estiver no DORA.

## 7. Cadeia de abastecimento
- [ ] Inventário dos **fornecedores e prestadores de serviços diretos** de TIC (art. 27.º, n.º 1, al. c))
- [ ] Avaliação de cada um (art. 28.º):
  - vulnerabilidades específicas;
  - qualidade dos produtos em cibersegurança;
  - práticas de cibersegurança e de **desenvolvimento seguro**;
  - avaliações coordenadas de risco da UE (art. 22.º da Diretiva NIS2);
  - restrições ou exclusões de equipamentos decididas ao abrigo do art. 18.º, n.º 3.
- [ ] **Cláusulas contratuais** com os fornecedores críticos: cooperação na notificação de incidentes em prazo compatível com as 24 horas, auditorias, controlo da subcontratação, gestão de vulnerabilidades e saída do serviço — cláusula 8.3 de `assets/templates/contrato-saas-b2b.md`, `assets/templates/contrato-prestacao-servicos-ti.md` e `assets/templates/dpa-bilingue.md`
- [ ] **És fornecedor** de uma entidade abrangida? Prepara as evidências (políticas, MFA, cópias de segurança, gestão de vulnerabilidades, plano de resposta a incidentes) para os questionários e cláusulas que vão chegar

## 8. Supervisão, coimas e defesa
- [ ] Medidas de **supervisão** conhecidas:
  - nas essenciais, inspeções, auditorias regulares, *ad hoc* ou direcionadas, verificações e pedidos de informação e de provas (art. 54.º);
  - nas importantes, as mesmas medidas, mas só *ex post* (art. 55.º);
  - os custos das auditorias direcionadas ficam a cargo da entidade (arts. 54.º, n.º 3, e 55.º, n.º 4);
  - pode vir a ser cobrada uma taxa de supervisão, fixada por portaria (art. 82.º — a confirmar se já foi publicada).
- [ ] Medidas de **execução** possíveis (art. 56.º): advertências, instruções vinculativas, designação de um supervisor, publicitação das infrações e, nas essenciais, suspensão de certificações ou licenças. ⏰ Antes delas, **audiência prévia** com prazo não inferior a **10 dias** (art. 58.º, n.º 1), dispensável só em urgência fundamentada (n.º 2)
- [ ] **Contraordenações** mapeadas:
  - **muito graves** (art. 61.º): medidas de cibersegurança, relatório anual, responsável, ponto de contacto, certificação exigida, **notificação de incidentes** e comunicação aos destinatários;
  - **graves** (art. 62.º): registo e qualificação (arts. 8.º e 35.º), pedidos de informação, advertências e ordens do CNCS;
  - **leves** (art. 63.º): uso indevido de marcas de certificação.
  - Coimas por tipo de entidade (essencial, importante, pública) e sanção pecuniária compulsória diária: ver `references/valores-2026.md`. A negligência é punível, com os limites reduzidos a metade (art. 64.º).
- [ ] ⏰ **Dispensa de coimas** (art. 65.º): pode ser pedida, de forma fundamentada, com base na inexistência de um procedimento interno de adaptação ao novo regime, durante **12 meses a contar da entrada em vigor** (até abril de 2027; a confirmar o alcance e a contagem)
- [ ] Sem dolo, o CNCS tem de **advertir primeiro** e dar prazo para cumprir antes de abrir processo (art. 66.º, n.º 5). Responde à advertência e cumpre dentro do prazo
- [ ] Sanções acessórias possíveis (art. 67.º): publicação da condenação, **proibição de participar em contratação pública**, plano de formação ou de segurança em 6 meses, suspensão do serviço e interdição temporária de administradores
- [ ] Defesa no processo de contraordenação: `assets/templates/defesa-contraordenacao.md`, com o RGCO como direito subsidiário (art. 81.º). A **impugnação judicial** da coima vai para os tribunais judiciais, mas é apresentada ao CNCS (art. 80.º, n.º 3). Tem efeito suspensivo (n.º 4) e a Relação de Lisboa decide em última instância (n.os 8 e 9). Prazo: o do RGCO (art. 59.º, n.º 3 — 20 dias, a confirmar a contagem)
- [ ] Prescrição do procedimento: **5 anos** nas graves e muito graves e **3 anos** nas leves (art. 69.º)
- [ ] **Recomenda-se advogado** se houver um processo de contraordenação ou uma medida de execução, desacordo com a qualificação ou um incidente grave com dados pessoais ou suspeita de crime

## Calendário (registar em `calendario_obrigacoes`)
- [ ] **15/9/2026**: fim do registo na MyCiber para as entidades já em atividade (já passou: se falhou, regista já)
- [ ] **20 dias úteis após a qualificação final**: comunicar o responsável de cibersegurança e o ponto de contacto permanente
- [ ] **31/1/2027**, ou 6 meses após a qualificação se vencer antes: lista de ativos acessíveis pela Internet
- [ ] **Até abril de 2027**: pedido de dispensa de coimas do art. 65.º, se se justificar (a confirmar)
- [ ] **Anual**: análise de riscos, atualização da lista de ativos e formação dos órgãos de gestão; relatório anual em janeiro, quando produzir efeitos
- [ ] **Junho de 2028** (a confirmar): passam a produzir efeitos as medidas de cibersegurança (arts. 27.º a 29.º), o relatório anual (art. 30.º) e as coimas respetivas
- [ ] Revisão desta checklist sempre que o CNCS publicar instruções técnicas (taxonomia de incidentes, ativos, matriz de risco) ou mudar a qualificação
