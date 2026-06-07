# Direito Digital e Regulação Europeia (AI Act, NIS2, DSA, CRA)

> Área crítica e em rápida evolução para um negócio de software/tecnologia com clientes internacionais. Datas de aplicação são faseadas — **confirma sempre o estado atual** (a regulação UE entra em vigor por etapas). Articula com `references/rgpd.md` (dados pessoais) e `references/pi.md` (software).

## Legislação Base
- **Regulamento (UE) 2024/1689** — Regulamento da Inteligência Artificial ("AI Act")
- **Diretiva (UE) 2022/2555** — Cibersegurança ("NIS2")
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
| **Risco inaceitável** (proibido) | Ex.: *social scoring* por entidades públicas, manipulação subliminar, *scraping* indiscriminado de rostos, reconhecimento de emoções no trabalho/escola. **Proibido.** |
| **Alto risco** (Anexos I e III) | Ex.: IA em recrutamento, crédito, educação, biometria, infraestruturas críticas. Sujeito a gestão de risco, qualidade de dados, documentação técnica, supervisão humana, registo, avaliação de conformidade e marcação CE. |
| **Risco limitado** (transparência) | Chatbots, *deepfakes*, conteúdo gerado por IA → **dever de informar** o utilizador de que interage com IA / de que o conteúdo é artificial. |
| **Risco mínimo** | Maioria das aplicações (filtros de spam, jogos). Sem obrigações específicas. |

### Modelos de IA de finalidade geral (GPAI)
Quem desenvolve ou ajusta modelos fundacionais tem obrigações próprias (documentação, política de direitos de autor, resumo dos dados de treino); obrigações reforçadas para modelos com "risco sistémico".

### Calendário de aplicação (faseado — confirmar)
- **Práticas proibidas**: aplicáveis desde **02/02/2025**.
- **Obrigações de GPAI**: desde **02/08/2025**.
- **Maioria das regras (incl. alto risco do Anexo III)**: **02/08/2026**.
- **Alto risco do Anexo I (produtos regulados)**: **02/08/2027**.

### Obrigações práticas mais prováveis para o utilizador (deployer/provider de risco limitado)
- **Transparência**: rotular conteúdo gerado por IA e avisar quando o utilizador fala com um bot.
- **Literacia em IA** (Art. 4.º): garantir que a equipa que opera os sistemas tem formação adequada.
- Se construir/integrar algo que caia em **alto risco**, planear avaliação de conformidade com antecedência.
- **Coimas**: até **35 M€ ou 7%** do volume de negócios mundial (práticas proibidas); escalões inferiores para outras infrações.

### Supervisão
Cada Estado-Membro designa autoridade(s). Em Portugal o quadro de supervisão está a ser definido — verificar a autoridade nacional competente e o *AI Office* europeu.

---

## 2. NIS2 — Cibersegurança (Diretiva (UE) 2022/2555)

Eleva as exigências de cibersegurança para **entidades essenciais e importantes** em setores como energia, saúde, infraestrutura digital, **fornecedores de serviços TIC geridos e digitais**, etc. Mesmo PME podem ser abrangidas se prestarem serviços críticos ou forem **fornecedores numa cadeia** de uma entidade abrangida.

- **Medidas de gestão de risco** (Art. 21.º): políticas de segurança, gestão de incidentes, continuidade, segurança da cadeia de fornecimento, cifra, controlo de acessos.
- **Reporte de incidentes**: *early warning* em **24h**, notificação em **72h**, relatório final em 1 mês.
- **Responsabilidade da gestão**: os órgãos de administração respondem pela supervisão das medidas.
- **Autoridade em Portugal**: CNCS — Centro Nacional de Cibersegurança. Verificar o diploma nacional de transposição e o âmbito setorial.
- **Coimas**: significativas (entidades essenciais até 10 M€ ou 2% do volume de negócios mundial).

> Mesmo que não seja diretamente abrangido, é frequente que **clientes abrangidos pela NIS2 imponham contratualmente** requisitos de segurança aos seus fornecedores — antecipar nos contratos.

---

## 3. DSA — Serviços Digitais (Regulamento (UE) 2022/2065)

Aplica-se a **intermediários online**: serviços de simples transporte, *caching*, **alojamento** e **plataformas online** (marketplaces, redes). Um site de venda direta de produtos próprios geralmente **não** é "plataforma"; mas se o utilizador operar um **marketplace** ou permitir conteúdos de terceiros, aplicam-se deveres acrescidos.

- Obrigações graduais conforme o papel: termos transparentes, ponto de contacto, mecanismos de notificação e ação (*notice-and-action*), fundamentação de remoções, rastreabilidade de vendedores (*KYBC*) em marketplaces.
- Micro e pequenas empresas estão isentas de algumas obrigações mais pesadas.
- VLOPs (grandes plataformas) têm obrigações reforçadas — não aplicável a PME.

---

## 4. CRA — Ciber-resiliência (Regulamento (UE) 2024/2847)

Estabelece **requisitos de cibersegurança para produtos com elementos digitais** (software e hardware ligado) colocados no mercado da UE. **Muito relevante se o utilizador vende software/produtos digitais.**

- Requisitos *security by design*, gestão de vulnerabilidades, atualizações de segurança durante o período de suporte, marcação CE.
- Dever de comunicar vulnerabilidades ativamente exploradas e incidentes graves (à ENISA/autoridade).
- Aplicação faseada — obrigações principais a partir de **2027** (verificar). Planear o ciclo de desenvolvimento desde já.

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
- [ ] **Usa ou vende IA?** → mapear o risco no AI Act; garantir transparência e literacia (Art. 4.º).
- [ ] **Vende software/produtos digitais na UE?** → preparar conformidade CRA (calendário até 2027).
- [ ] **É fornecedor TIC de entidades reguladas?** → antecipar requisitos NIS2 nos contratos.
- [ ] **Opera plataforma/marketplace?** → deveres do DSA (notice-and-action, KYBC).
- [ ] **Usa cookies/marketing?** → consentimento ePrivacy + base RGPD.
- [ ] **Cláusulas contratuais**: repercutir obrigações de segurança e IA nos contratos com clientes e fornecedores (ver `references/contratos-internacionais.md`).

## Templates (gerados a pedido)
- Aviso de transparência de IA (rotulagem de conteúdo gerado / interação com bot)
- Cláusula contratual de cibersegurança e NIS2 para fornecedores
- Política de gestão de vulnerabilidades (CRA)
- Cookie banner / Cookie policy
