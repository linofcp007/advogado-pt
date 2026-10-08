# Direito Digital e Regulação Europeia (AI Act, NIS2, DSA, CRA)

> **Âmbito:** misto
>
> Área crítica e em rápida evolução para um negócio de software/tecnologia com clientes internacionais. Datas de aplicação são faseadas — **confirma sempre o estado atual** (a regulação UE entra em vigor por etapas). Articula com `references/rgpd.md` (dados pessoais) e `references/pi.md` (software).

## Legislação Base
- **Regulamento (UE) 2024/1689** — Regulamento da Inteligência Artificial ("AI Act")
- **Diretiva (UE) 2022/2555** — Cibersegurança ("NIS2")
- **DL 125/2025**, de 4 de dezembro — Regime Jurídico da Cibersegurança (transposição da NIS2), em vigor desde 3/4/2026; revogou a Lei 46/2018 e o DL 65/2021. Regulamentado pelo **Regulamento do CNCS n.º 756/2026** (DR, 2.ª série, n.º 118, de 22/6/2026)
- **Regulamento (UE) 2022/2065** — Serviços Digitais ("DSA")
- **Regulamento (UE) 2022/1925** — Mercados Digitais ("DMA")
- **Regulamento (UE) 2024/2847** — Ciber-resiliência ("CRA")
- **Regulamento (UE) 2023/2854** — Dados ("Data Act")
- **Diretiva 2002/58/CE + Lei 41/2004** — Privacidade nas comunicações eletrónicas ("ePrivacy": cookies, marketing)

---

## 1. AI Act — Regulamento da IA (UE) 2024/1689

Aplica-se a quem **desenvolve (provider)**, **utiliza (deployer)**, importa ou distribui sistemas de IA com impacto na UE — independentemente de estar sediado na UE, se o output for usado na UE. Relevante se o utilizador integra IA nos seus produtos/serviços (ex.: copilotos, geração de conteúdo, scoring, chatbots).

### Abordagem por risco
| Categoria | Tratamento |
|---|---|
| **Risco inaceitável** (proibido) | Ex.: *social scoring* (por entidades públicas ou privadas), manipulação subliminar, *scraping* indiscriminado de rostos, reconhecimento de emoções no trabalho/escola. **Proibido.** |
| **Alto risco** (Anexos I e III) | Ex.: IA em recrutamento, crédito, educação, biometria, infraestruturas críticas. Sujeito a gestão de risco, qualidade de dados, documentação técnica, supervisão humana, registo, avaliação de conformidade e marcação CE. |
| **Risco limitado** (transparência) | Chatbots, *deepfakes*, conteúdo gerado por IA → **dever de informar** o utilizador de que interage com IA / de que o conteúdo é artificial. |
| **Risco mínimo** | Maioria das aplicações (filtros de spam, jogos). Sem obrigações específicas. |

### Modelos de IA de finalidade geral (GPAI)
Quem desenvolve ou ajusta modelos fundacionais tem obrigações próprias (documentação, política de direitos de autor, resumo dos dados de treino); obrigações reforçadas para modelos com "risco sistémico".

### Calendário de aplicação (redação do Reg. (UE) 2026/1744 — "Omnibus Digital", em vigor desde 27/07/2026; art. 113.º)
- **Práticas proibidas e literacia em IA**: desde **02/02/2025**; as novas proibições acrescentadas ao art. 5.º aplicam-se a partir de **02/12/2026**.
- **Obrigações de GPAI**: desde **02/08/2025**.
- **Transparência (art. 50.º)**: desde **02/08/2026**.
- **Alto risco do Anexo III** (incl. recrutamento e gestão de trabalhadores) e obrigações do art. 26.º: **02/12/2027**.
- **Alto risco do Anexo I (produtos regulados)**: **02/08/2028**.

### Obrigações práticas mais prováveis para o utilizador (deployer/provider de risco limitado)
- **Transparência**: rotular conteúdo gerado por IA e avisar quando o utilizador fala com um bot.
- **Literacia em IA** (Art. 4.º, redação do Reg. 2026/1744): adotar medidas para **promover** a literacia em IA de quem opera os sistemas — não exige garantir um nível específico. Template: `assets/templates/politica-uso-ia.md`.
- Se construir/integrar algo que caia em **alto risco**, planear avaliação de conformidade com antecedência.
- **Coimas**: até **35 M€ ou 7%** do volume de negócios mundial (práticas proibidas); escalões inferiores para outras infrações — ver `references/valores-2026.md`.

### Supervisão
Cada Estado-Membro designa autoridade(s) (art. 70.º). Em Portugal o Governo manifestou a intenção de designar a **ANACOM** (19/9/2025), mas a designação ainda não foi publicada (pendente a 3/10/2026); a CNPD mantém a competência em dados pessoais. Verificar em diariodarepublica.pt e no *AI Office* europeu.

---

## 2. NIS2 — Cibersegurança (Diretiva (UE) 2022/2555)

Eleva as exigências de cibersegurança para **entidades essenciais e importantes** em setores como energia, saúde, infraestrutura digital, **fornecedores de serviços TIC geridos e digitais**, etc. Mesmo PME podem ser abrangidas se prestarem serviços críticos ou forem **fornecedores numa cadeia** de uma entidade abrangida.

- **Medidas de gestão de risco** (Art. 21.º): políticas de segurança, gestão de incidentes, continuidade, segurança da cadeia de fornecimento, cifra, controlo de acessos.
- **Reporte de incidentes**: *early warning* em **24h**, notificação em **72h**, relatório final em 1 mês. É a regra da diretiva (art. 23.º); a lei portuguesa fixou prazos próprios, descritos abaixo.
- **Responsabilidade da gestão**: os órgãos de administração respondem pela supervisão das medidas.
- **Autoridade em Portugal**: CNCS — Centro Nacional de Cibersegurança. Transposição: **DL 125/2025** (Regime Jurídico da Cibersegurança — ver `references/compliance.md`); confirmar o âmbito setorial e a dimensão da entidade.
- **Coimas**: significativas (entidades essenciais até 10 M€ ou 2% do volume de negócios mundial). Molduras portuguesas por tipo de entidade e por gravidade em `references/valores-2026.md`.

### Em Portugal — DL 125/2025 (Regime Jurídico da Cibersegurança)
- **Transposição**: o DL 125/2025, de 4 de dezembro (DR, 1.ª série, n.º 234), aprova o regime em anexo e está em vigor desde **3/4/2026** (art. 11.º do decreto-lei: 120 dias após a publicação). **Revogou a Lei 46/2018 e o DL 65/2021** (art. 9.º). Os artigos citados abaixo são do regime anexo.
- **Âmbito** (arts. 3.º e 4.º): entidades dos tipos dos anexos I (10 setores de importância crítica) e II (7 outros setores críticos) que sejam **médias empresas ou maiores**. Algumas ficam abrangidas qualquer que seja a dimensão: comunicações eletrónicas, serviços de confiança, TLD, DNS, prestador único de serviço essencial e entidades críticas. Inclui ainda a Administração Pública, como "entidades públicas relevantes" dos grupos A e B (art. 7.º).
- **Qualificação** (art. 6.º): são **essenciais**, entre outras, as entidades do anexo I acima dos limiares de média empresa e os prestadores qualificados de confiança, TLD e DNS de qualquer dimensão. As restantes entidades abrangidas são **importantes**. A qualificação é feita pelo CNCS depois da autoidentificação, com audiência prévia de 10 dias úteis (Regulamento 756/2026, art. 9.º).
- ⏰ **Registo na plataforma MyCiber** (art. 8.º, n.º 1): 30 dias após o início da atividade ou, para quem já estava em atividade, 60 dias após a abertura da plataforma, contados em dias úteis. A plataforma abriu a 23/6/2026 e o prazo terminou a **15/9/2026** (CNCS).
- **Governação** (arts. 25.º, 31.º e 32.º):
  - o órgão de administração aprova e supervisiona as medidas e assegura formação regular;
  - os administradores podem responder com dolo ou culpa grave;
  - **responsável de cibersegurança** e **ponto de contacto permanente 24/7**, comunicados em 20 dias úteis após a notificação da qualificação final (Regulamento 756/2026, arts. 14.º e 15.º).
- ⏰ **Incidentes significativos** (arts. 40.º a 44.º):
  - notificação inicial **até 24 horas** depois de concluíres que há, ou pode haver, um incidente significativo;
  - atualização até **72 horas**, quando necessário;
  - notificação do **fim do impacto** até 24 horas depois de este terminar (se o incidente ficar resolvido em 2 horas, basta esta);
  - **relatório final em 30 dias úteis** a contar da notificação do fim do impacto.
  - Tudo é submetido na MyCiber. A notificação ao CNCS não dispensa a da CNPD (RGPD, 72 horas) — ver `playbooks/data-breach.md`.
- **Medidas** (arts. 26.º a 30.º): as áreas mínimas do art. 27.º, n.º 1 (incidentes, continuidade, cadeia de abastecimento, desenvolvimento seguro, ciber-higiene e formação, criptografia, controlo de acessos, MFA) e as medidas mínimas do anexo III do Regulamento 756/2026, por nível de conformidade (básico, substancial ou elevado). ⏰ As medidas, a cadeia de abastecimento, o risco residual e o relatório anual, com as coimas respetivas, só produzem efeitos **24 meses após a regulamentação** (art. 10.º, n.º 2, do decreto-lei); segundo o CNCS, a contar de 22/6/2026 (a confirmar a data exata). A **lista de ativos acessíveis pela Internet** é devida até 31/1 do ano seguinte à qualificação, ou 6 meses depois desta, o que vencer primeiro (Regulamento, art. 32.º).
- **Supervisão e sanções** (arts. 54.º a 69.º): supervisão *ex ante* para as essenciais e *ex post* para as importantes; contraordenações muito graves, graves e leves. Sem dolo, há **advertência prévia** antes de processo (art. 66.º, n.º 5). Durante 12 meses a contar da entrada em vigor, pode pedir-se a **dispensa de coimas** por falta de procedimento interno de adaptação (art. 65.º — a confirmar o alcance). A impugnação judicial das coimas é apresentada ao CNCS e decidida pelos tribunais judiciais (art. 80.º).
- Checklist completa: `assets/checklists/checklist-nis2.md`.

> Mesmo que não seja diretamente abrangido, é frequente que **clientes abrangidos pela NIS2 imponham contratualmente** requisitos de segurança aos seus fornecedores — antecipar nos contratos.

---

## 3. DSA — Serviços Digitais (Regulamento (UE) 2022/2065)

Aplica-se a **intermediários online**: serviços de simples transporte, *caching*, **alojamento** e **plataformas online** (marketplaces, redes). Um site de venda direta de produtos próprios geralmente **não** é "plataforma"; mas se o utilizador operar um **marketplace** ou permitir conteúdos de terceiros, aplicam-se deveres acrescidos.

- Obrigações graduais conforme o papel: termos transparentes, ponto de contacto, mecanismos de notificação e ação (*notice-and-action*), fundamentação de remoções, rastreabilidade de vendedores (*KYBC*) em marketplaces.
- Micro e pequenas empresas estão isentas de algumas obrigações mais pesadas.
- VLOPs (grandes plataformas) têm obrigações reforçadas — não aplicável a PME.
- **Execução em Portugal**: Lei 12-A/2026, de 15 de abril — a **ANACOM** é o Coordenador dos Serviços Digitais (art. 5.º); revogou os arts. 12.º a 19.º do DL 7/2004 (antigo regime de responsabilidade dos prestadores intermediários e "solução provisória de litígios") e o DL 20-B/2024 (art. 35.º). Notificações de conteúdo ilegal: template `assets/templates/notificacao-remocao-conteudo.md`.

---

## 4. CRA — Ciber-resiliência (Regulamento (UE) 2024/2847)

Estabelece **requisitos de cibersegurança para produtos com elementos digitais** (software e hardware ligado) colocados no mercado da UE. **Muito relevante se o utilizador vende software/produtos digitais.**

- Requisitos *security by design*, gestão de vulnerabilidades, atualizações de segurança durante o período de suporte, marcação CE.
- Dever de comunicar vulnerabilidades ativamente exploradas e incidentes graves (à ENISA/autoridade).
- Aplicação faseada (Reg. (UE) 2024/2847, art. 71.º): o dever de comunicar vulnerabilidades ativamente exploradas e incidentes graves (art. 14.º) aplica-se desde **11/9/2026**; as restantes obrigações a partir de **11/12/2027**. Planear o ciclo de desenvolvimento desde já.

---

## 5. ePrivacy, cookies e marketing eletrónico (Lei 41/2004)

- **Cookies/tracking não essenciais**: consentimento prévio, livre e granular (banner). Estritamente necessários: dispensam consentimento.
- **Marketing por email/SMS**: regra do *opt-in*; exceção de cliente existente para produtos similares (*soft opt-in*), sempre com opção de cancelamento.
- Cruzar com `references/rgpd.md` (base de licitude do tratamento associado).

---

## 6. Data Act e outros (Regulamento (UE) 2023/2854)

- **Data Act**: direitos de acesso e portabilidade de dados gerados por **produtos conectados (IoT)** e serviços relacionados; cláusulas contratuais equilibradas para partilha de dados B2B. Relevante se o utilizador desenvolve hardware/IoT ou serviços sobre dados de dispositivos.
- **Data Governance Act**, **P2B (UE 2019/1150)** (equidade para empresas que dependem de plataformas) — verificar aplicabilidade caso a caso.

---

## Para o Contexto do Utilizador (tech/software, clientes internacionais)

Checklist rápido de exposição regulatória:
- [ ] **Usa ou vende IA?** → mapear o risco no AI Act; transparência (Art. 50.º) e medidas de literacia (Art. 4.º) — `assets/templates/politica-uso-ia.md`.
- [ ] **Vende software/produtos digitais na UE?** → comunicação de vulnerabilidades e incidentes já obrigatória (desde 11/9/2026); conformidade CRA completa até 11/12/2027.
- [ ] **É fornecedor TIC de entidades reguladas?** → antecipar requisitos NIS2 nos contratos.
- [ ] **Atua num setor dos anexos do DL 125/2025 e é média ou grande empresa (ou presta serviços geridos, nuvem, centro de dados)?** → registo na MyCiber (prazo das entidades em atividade terminou a 15/9/2026), responsável de cibersegurança e incidentes em 24 horas — `assets/checklists/checklist-nis2.md`.
- [ ] **Opera plataforma/marketplace?** → deveres do DSA (notice-and-action, KYBC).
- [ ] **Usa cookies/marketing?** → consentimento ePrivacy + base RGPD.
- [ ] **Cláusulas contratuais**: repercutir obrigações de segurança e IA nos contratos com clientes e fornecedores (ver `references/contratos-internacionais.md`).

## Templates (gerados a pedido)
- Aviso de transparência de IA (rotulagem de conteúdo gerado / interação com bot) (a pedido)
- Cláusula contratual de cibersegurança e NIS2 para fornecedores (a pedido)
- Política de gestão de vulnerabilidades (CRA) (a pedido)
- Cookie banner / Cookie policy — `assets/templates/cookie-policy.md`
- Checklist NIS2 (DL 125/2025) — `assets/checklists/checklist-nis2.md`
