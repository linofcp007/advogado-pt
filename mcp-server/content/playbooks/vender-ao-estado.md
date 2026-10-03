# Playbook: Quero vender ao Estado (responder a um procedimento de contratação pública)

> Quando usar: a empresa (ENI, Unipessoal Lda, Lda, SA, de qualquer setor) quer fornecer bens, serviços ou obras a uma entidade pública — Estado, autarquia, instituto público, hospital, universidade, empresa pública — ou recebeu um convite, viu um anúncio ou perdeu um concurso e quer reagir. Âmbito: nacional (com remissões para o JOUE acima dos limiares europeus). Regime: Código dos Contratos Públicos (CCP) na redação do **Decreto-Lei n.º 177/2026**, de 4 de setembro (17.ª alteração, republica o CCP), em vigor a **1/10/2026**. Fundo teórico: `references/contratacao-publica.md`. Montantes e limiares: `references/valores-2026.md` (secção Contratação Pública) — nunca de memória.

## Passo 0 — Não percas prazos

- ⏰ **Os prazos da contratação pública são curtos e contam-se de forma própria:**
  - Prazos da fase de formação do contrato (esclarecimentos, audiência prévia, impugnações, habilitação): **dias úteis** — contam-se nos termos do art. 87.º do CPA (suspendem-se aos sábados, domingos e feriados; não conta o dia do evento) e **nunca** têm dilação (CCP, arts. 267.º, n.º 2, e 470.º, n.º 1).
  - **Exceção**: o prazo para **apresentar propostas** (e candidaturas) é **contínuo** — corre também aos sábados, domingos e feriados (CCP, art. 470.º, n.º 3).
  - As notificações por e-mail ou pela plataforma consideram-se feitas **na data da expedição** (CCP, arts. 467.º e 469.º, n.º 1, al. a)) — não esperes por "abrir" a mensagem. Define quem vigia diariamente a plataforma e o e-mail indicado (perfil `.juridico-pt/perfil-empresa.md`).
  - Conta com `calc_prazo` (`tipo=uteis` para a fase de formação) e regista logo com `registar_prazo`:
    ```text
    calc_prazo  inicio=<AAAA-MM-DD da notificação>  dias=5  tipo=uteis
    registar_prazo  data=<data-limite>  descricao="Audiência prévia — procedimento X"  origem="CCP, art. 147.º"
    ```
- ⏰ **Mapa de prazos principais** (confirma sempre o prazo fixado no anúncio, convite ou programa do procedimento — o júri pode dar mais do que o mínimo):

  | Momento | Prazo | Conta a partir de | Base |
  |---|---|---|---|
  | Pedir esclarecimentos sobre as peças | **1.º terço** do prazo de apresentação das propostas | início do prazo das propostas | CCP, art. 50.º, n.º 1 |
  | Apresentar a lista de erros e omissões | **1.º terço** (o mesmo prazo) | idem | CCP, art. 50.º, n.os 1 a 3 |
  | Resposta da entidade (esclarecimentos e erros/omissões) | até ao fim do **2.º terço** (ou o prazo do convite/programa); silêncio sobre erros e omissões = rejeição | — | CCP, art. 50.º, n.º 5 |
  | Convite com prazo de proposta inferior a 6 dias | esclarecimentos e retificações até ao dia anterior ao termo | — | CCP, art. 116.º |
  | Apresentar a proposta | o fixado (mínimos legais no concurso público: arts. 135.º e 136.º) | envio do anúncio / convite | CCP, arts. 63.º, 135.º e 136.º |
  | Manter a proposta | 66 dias (ou mais, se as peças o fixarem) | termo do prazo das propostas | CCP, art. 65.º |
  | Reclamar por não constar da lista de concorrentes | 3 dias | publicitação da lista | CCP, art. 138.º, n.º 3 |
  | Suprir irregularidades formais a pedido do júri | até 5 dias | pedido do júri | CCP, art. 72.º, n.º 3 |
  | Audiência prévia — consulta prévia / ajuste direto | o fixado, **nunca menos de 3 dias** | envio do relatório preliminar | CCP, art. 123.º, n.º 1 |
  | Audiência prévia — concurso público | o fixado, **nunca menos de 5 dias** (no concurso público flexível pode ser reduzido para 3) | envio do relatório preliminar | CCP, arts. 147.º e 161.º-B, n.º 1, al. b) |
  | Impugnação administrativa (reclamação ou recurso) | **5 dias** (3 no concurso público flexível) | notificação da decisão | CCP, arts. 270.º e 161.º-B, n.º 4 |
  | Pronúncia como contrainteressado | 5 dias | notificação | CCP, art. 273.º |
  | Ação de contencioso pré-contratual (tribunal) | **1 mês**, processo urgente | notificação do ato | CPTA, arts. 36.º, n.º 1, al. c), e 101.º |
  | Suspensão automática da adjudicação impugnada | ação proposta em **10 dias úteis** (só onde há prazo de suspensão — ver passo 7) | notificação da adjudicação a todos | CPTA, art. 103.º-A, n.º 1 |
  | Documentos de habilitação | o fixado no programa/convite; prorrogável até 5 dias a pedido | notificação da adjudicação | CCP, arts. 77.º, n.º 2, e 85.º, n.º 2 |
  | Prestar a caução | 10 dias (comprovar no dia seguinte) | notificação da adjudicação | CCP, art. 90.º, n.º 1 |
  | Reclamar da minuta do contrato | 5 dias (2 no ajuste direto e na consulta prévia); silêncio = aceitação | notificação da minuta | CCP, art. 101.º |
  | Pagamento pela entidade | 30 dias após a fatura, salvo prazo contratual (com teto legal) | receção da fatura | CCP, arts. 299.º e 299.º-A |

- ⏰ **Procedimento iniciado antes de 1/10/2026?** O DL 177/2026 aplica-se aos procedimentos **iniciados após a sua entrada em vigor** e aos contratos deles resultantes; aos procedimentos em curso continuam a aplicar-se as regras anteriores, salvo a modificação objetiva do contrato e a resolução alternativa de litígios (DL 177/2026, arts. 10.º e 11.º). Procedimento lançado exatamente a 1/10/2026 → (a confirmar), lê o anúncio/convite.

## Fluxo de decisão

1. **Prepara-te antes de haver concurso** — sem isto não consegues responder a tempo:
   - **Plataforma eletrónica**: as propostas, esclarecimentos, listas de erros e omissões, pronúncias e impugnações são feitos na plataforma usada pela entidade adjudicante (CCP, art. 62.º, n.º 1; Lei 96/2015, art. 24.º, n.º 1). Escolhes livremente a plataforma entre as licenciadas pelo IMPIC (Lei 96/2015, arts. 4.º e 5.º) [VERIFICAR lista atual em impic.pt / base.gov.pt]. Cada plataforma tem de te dar **gratuitamente pelo menos 3 acessos simultâneos** aos serviços base (Lei 96/2015, art. 23.º, n.os 2 e 3); só os serviços avançados são pagos (art. 25.º). O registo gratuito pode demorar até **3 dias úteis** (art. 28.º, n.º 3) — regista-te já, não na véspera.
   - **Certificado qualificado de assinatura eletrónica** de quem obriga a empresa (gerente/administrador) — os documentos submetidos têm de ser assinados com assinatura eletrónica qualificada (Lei 96/2015, art. 54.º, n.os 1 e 2). Se o certificado não mostrar os poderes de representação, junta documento oficial que os prove (art. 54.º, n.º 7) — ex.: certidão permanente.
   - **Situação regularizada** perante a AT e a Segurança Social e **registo criminal** limpo da empresa e dos gerentes/administradores em funções (CCP, art. 55.º, n.º 1, als. b), d), e) e h), e n.º 5). Com dívidas pequenas há uma válvula: a entidade **pode** admitir-te se a dívida não exceder o limiar legal e cederes o crédito à AT/SS (CCP, art. 55.º, n.º 3 — limiar em `references/valores-2026.md`).
   - **Estatuto de PME certificada** (IAPMEI) ou de **startup** (Lei 21/2023): abre contratos reservados (CCP, art. 54.º-A, n.º 1, als. b) e d)) e dispensa o plano de prevenção da corrupção quando o contrato vai ao Tribunal de Contas (CCP, art. 81.º, n.º 9).
   - Guarda no perfil `.juridico-pt/perfil-empresa.md` quem assina, a plataforma usada e o e-mail de notificações.

2. **Procura oportunidades** (e conhece o mercado):
   - **Diário da República, 2.ª série** — todos os concursos públicos são anunciados aí (CCP, art. 130.º, n.º 1); acima dos limiares europeus também no **JOUE / TED** (CCP, arts. 131.º e 474.º).
   - **Portal BASE** (base.gov.pt) — contratos celebrados, incluindo os ajustes diretos e as consultas prévias (CCP, arts. 127.º e 465.º): vê quem compra o quê, a quem e por quanto. Útil para fixar preço e para te dares a conhecer.
   - **Alertas da plataforma** eletrónica por palavras-chave / CPV.
   - **Ajuste direto e consulta prévia são por convite**: a entidade escolhe quem convida (CCP, arts. 112.º e 113.º, n.º 1). Atenção ao **limite de convites repetidos**: não podes ser convidado se a mesma entidade já te adjudicou, no ano em curso e nos dois anteriores, por ajuste direto/consulta prévia escolhidos pelo valor, contratos cujo preço acumulado atinja o limiar respetivo (CCP, art. 113.º, n.os 2 e 3; regra de transição no DL 177/2026, art. 7.º, n.º 2). Fornecimentos **gratuitos** à entidade também te podem impedir de ser convidado (art. 113.º, n.º 5).
   - **Novidades do DL 177/2026 para quem quer entrar**: **consulta preliminar ao mercado** (CCP, art. 35.º-A); **iniciativa espontânea** — apresentas um estudo técnico; a entidade tem 90 dias para o analisar e, se o usar e tu concorreres sem ganhar nem seres excluído, tens direito ao reembolso dos encargos com o estudo (art. 35.º-B); **período de teste de sistemas de TI**, gratuito, até 30 dias (prorrogável até 90), publicitado no portal, sem direito de preferência e sem poderes usar os dados da entidade para fins próprios, incluindo treino de modelos de IA (art. 35.º-C).

3. **Que procedimento se aplica pelo valor?** → corre a calculadora:
   ```text
   calc_procedimento_ccp  valor=<valor estimado SEM IVA>  tipo=bens-servicos|empreitada  [inicio=AAAA-MM-DD]
   python scripts/procedimento_ccp.py --valor <valor> --tipo bens-servicos
   ```
   - Limiares do ajuste direto e da consulta prévia na redação do **DL 177/2026** (CCP, arts. 19.º, als. c) e d), e 20.º, n.º 1, als. c) e d)) — valores em `references/valores-2026.md`. Com `inicio` anterior a 1/10/2026, a calculadora usa os limiares antigos.
   - **Valor estimado do contrato** = preço estimado a pagar pela entidade e por terceiros, mais contrapartidas e vantagens do adjudicatário (CCP, art. 17.º, n.º 1), **sem IVA** (art. 473.º). É proibido calcular o valor ou **fracionar** o objeto para fugir às regras; prestações do mesmo tipo contratadas em vários procedimentos somam-se (CCP, art. 17.º-B, n.os 1 e 3 — o antigo art. 22.º foi revogado). Adjudicação por lotes: art. 46.º-A.
   - **Escolha por critérios materiais** (urgência imperiosa, exclusividade técnica, concurso deserto…), independente do valor: CCP, arts. 23.º a 30.º-A (ajuste direto: arts. 24.º a 27.º).
   - **Outros caminhos**: **consulta prévia especial** — convite a pelo menos 5 entidades, só para certos objetos (projetos com fundos europeus, habitação pública, **equipamentos informáticos, software, cloud e consultoria para transformação digital**, saúde e apoio social, intervenções prioritárias) e abaixo dos limiares (CCP, arts. 127.º-A a 127.º-C; substitui a consulta prévia simplificada da Lei 30/2021); **ajuste direto simplificado** — adjudicação sobre fatura, sem plataforma nem fatura eletrónica, contrato de no máximo 3 anos e preço não revisível (CCP, arts. 128.º e 129.º); **concurso público flexível** abaixo dos limiares europeus — prazos de audiência e impugnação reduzidos a 3 dias, requisitos mínimos de capacidade, avaliação faseada (arts. 161.º-A a 161.º-E). Limiares em `references/valores-2026.md`.
   - **Setores especiais** (água, energia, transportes, serviços postais — ex.: empresas municipais de águas, operadores de transportes): regime próprio, só sujeito à parte II do CCP acima dos limiares europeus (CCP, arts. 7.º, 11.º, 12.º e 33.º). Defesa e segurança: DL 104/2011 (também alterado pelo DL 177/2026).

4. **Lê as peças e usa a fase de esclarecimentos / erros e omissões** ⏰ (1.º terço do prazo):
   - Lê **todo** o programa do procedimento (ou convite) e o caderno de encargos: parâmetros base (CCP, art. 42.º), **preço base** — inclui prorrogações e uma proposta acima dele é excluída (arts. 47.º, n.º 1, e 70.º, n.º 3, al. d)), critério de adjudicação e modelo de avaliação (arts. 74.º, 75.º e 139.º), documentos a apresentar (art. 57.º), caução (arts. 88.º e 89.º).
   - Dúvidas de interpretação → `assets/templates/pedido-esclarecimentos-ccp.md`.
   - Erros, desconformidades com a realidade, quantidades em falta, condições técnicas inexequíveis → `assets/templates/lista-erros-omissoes-ccp.md` (art. 50.º, n.os 1 a 3). Nas **empreitadas**, o empreiteiro suporta metade dos trabalhos complementares de erros e omissões que devia ter detetado nesta fase e não identificou (art. 378.º, n.º 3).
   - Esclarecimentos e retificações **prevalecem** sobre as peças (art. 50.º, n.º 9) e ficam visíveis para todos (art. 50.º, n.º 8). Resposta tardia → o prazo das propostas é prorrogado (art. 64.º, n.os 1 e 3); podes ainda pedir prorrogação fundamentada (art. 64.º, n.º 4).
   - Peças **ilegais** (ex.: especificações que favorecem uma marca, requisitos desproporcionados) → podem ser impugnadas administrativamente (CCP, art. 269.º, n.º 2) ou em tribunal durante o procedimento (CPTA, art. 103.º) → advogado.

5. **Prepara e submete a proposta** ⏰ (prazo contínuo):
   - Documentos da proposta: os que contêm os **atributos** e os **termos ou condições** exigidos (CCP, art. 57.º, n.º 1, als. b) e c)); nos procedimentos com anúncio no JOUE, o **DEUCP** (art. 57.º, n.º 6). O DL 177/2026 revogou a antiga declaração de aceitação do caderno de encargos (art. 57.º, n.º 1, al. a), e anexo I — DL 177/2026, art. 8.º, al. a)) [VERIFICAR se o convite ou programa ainda pede alguma declaração].
   - Em **português** (art. 58.º), assinados com **assinatura eletrónica qualificada** por quem obriga a empresa (art. 57.º, n.º 4; Lei 96/2015, art. 54.º). Em agrupamento: representante comum com mandatos ou todos assinam (art. 57.º, n.º 5).
   - **Preço**: se estiver muito abaixo do mercado, prepara já a justificação (economia do processo, soluções técnicas, condições de trabalho, decomposição do preço com documentos) — o júri tem de te pedir esclarecimentos antes de excluir por preço anormalmente baixo (art. 71.º, n.os 3 e 4; exclusão: art. 70.º, n.º 3, al. e)).
   - **Submete com folga** (horas, não minutos): proposta entregue depois do termo é excluída (art. 70.º, n.º 2, al. a)). Até ao termo podes retirá-la e apresentar outra (art. 137.º, no concurso público).
   - Consórcio / agrupamento para somar capacidade (art. 54.º) — mas no ajuste direto e na consulta prévia escolhidos pelo valor a entidade convidada **não** pode concorrer em agrupamento (art. 117.º, n.º 2).
   - Falhas formais supríveis (documento que comprova factos anteriores, tradução, assinatura em falta) → o júri tem de pedir o suprimento em até 5 dias (art. 72.º, n.º 3) e, no concurso público, não pode propor a exclusão sem o ter pedido (art. 146.º, n.º 5).

6. **Relatório preliminar → audiência prévia** ⏰ (≥ 3 dias na consulta prévia; ≥ 5 dias no concurso público; 3 no concurso flexível):
   - O relatório **ainda não é a decisão**: é a melhor oportunidade para corrigir uma exclusão ou uma avaliação. Antes de escrever, **consulta as propostas dos outros** na plataforma (art. 138.º, n.º 2) e, na consulta prévia com negociação, as atas e versões finais (art. 123.º, n.º 2).
   - Pronúncia escrita: `assets/templates/pronuncia-audiencia-previa-ccp.md` — fundamentos típicos: exclusão indevida (art. 70.º; suprimento não pedido — arts. 72.º, n.º 3, e 146.º, n.º 5), erro na avaliação (modelo/grelha publicado — art. 139.º; erros de cálculo — art. 72.º, n.º 4), preço anormalmente baixo de um concorrente sem justificação aceite (art. 71.º) ou o teu próprio preço sem te terem pedido esclarecimentos, proposta concorrente que devia ser excluída (preço acima do preço base, violação de parâmetros base, documentos em falta, impedimentos — arts. 55.º e 70.º).
   - Se o relatório final mudar a ordenação ou propuser novas exclusões, há **nova audiência** (arts. 124.º, n.º 2, e 148.º, n.º 2).

7. **Perdeste, foste excluído ou a decisão é ilegal** → reage a tempo:
   - **Impugnação administrativa** (reclamação para o autor, ou recurso das deliberações do júri para o órgão competente para a decisão de contratar — CCP, art. 271.º, n.º 2): ⏰ **5 dias úteis** da notificação (art. 270.º; 3 no concurso flexível — art. 161.º-B, n.º 4). É **facultativa** (art. 268.º) e **não suspende** o procedimento, mas impede a adjudicação, a qualificação e o início da negociação enquanto não for decidida ou não passar o prazo de decisão (art. 272.º). Decisão em 5 dias; **silêncio = rejeição** (art. 274.º). Template: `assets/templates/impugnacao-administrativa-ccp.md`.
   - **Contencioso pré-contratual** no tribunal administrativo: ⏰ **1 mês**, processo **urgente** (CPTA, arts. 36.º, n.º 1, al. c), 100.º e 101.º); advogado **obrigatório** (CPTA, art. 11.º, n.º 1). A impugnação administrativa suspende o prazo da ação até à decisão ou ao fim do prazo para decidir (CPTA, art. 59.º, n.º 4, aplicável por remissão do art. 101.º) — (a confirmar com advogado; por prudência, não contes com essa suspensão).
   - **Suspensão automática**: a ação contra a **adjudicação** proposta em ⏰ **10 dias úteis** suspende os efeitos da adjudicação ou a execução do contrato — **só** nos procedimentos em que há prazo de suspensão antes do contrato (CCP, arts. 95.º, n.º 3, e 104.º, n.º 1, al. a): em regra, anúncio publicado no JOUE e mais do que uma proposta; **não** no ajuste direto nem na consulta prévia — art. 104.º, n.º 2) (CPTA, art. 103.º-A). Nos restantes casos, pedir medidas provisórias (CPTA, art. 103.º-B).
   - **Arbitragem / conciliação**: o DL 177/2026 criou um regime de arbitragem voluntária para litígios pré-contratuais e comissões de conciliação (CCP, arts. 464.º-B a 464.º-G; anexo XII) [VERIFICAR se o programa do procedimento prevê a aceitação de um centro de arbitragem].

8. **Ganhaste — da adjudicação ao contrato:**
   - **Habilitação**: a entidade deve obter oficiosamente os documentos por interoperabilidade e só te pede os que não conseguir (CCP, art. 81.º, n.os 1 e 10; força probatória: art. 83.º-A). Prazo do programa/convite, prorrogável até 5 dias (art. 85.º, n.º 2). Falhar por facto teu → **caducidade da adjudicação** e adjudicação ao segundo (art. 86.º), com audiência prévia de até 5 dias (art. 86.º, n.º 3).
   - **Plano de prevenção da corrupção**: pedido se o contrato estiver sujeito a fiscalização prévia do Tribunal de Contas, salvo PME certificada ou pessoa singular (art. 81.º, n.º 9) → `assets/templates/plano-prevencao-riscos-corrupcao.md`.
   - **Caução** (arts. 88.º a 91.º): pode ser dispensada abaixo de certo preço contratual ou substituída por seguro de execução / declaração bancária de responsabilidade solidária (art. 88.º, n.os 2 e 4); prestada em 10 dias por depósito, garantia bancária ou seguro-caução (art. 90.º). Limiar e percentagens máximas em `references/valores-2026.md`. Não prestar → caducidade da adjudicação (art. 91.º). No concurso flexível, dispensa também se provares falta de liquidez (termo de ROC ou contabilista certificado) **e** que não obtiveste seguro de execução nem declaração bancária junto de pelo menos duas entidades (art. 161.º-B, n.º 2).
   - **Minuta**: reclama em 5 dias (2 no ajuste direto/consulta prévia), senão considera-se aceite (arts. 101.º e 102.º). **Outorga** com assinatura eletrónica; quando há prazo de suspensão, nunca antes de 10 dias após a notificação da adjudicação (art. 104.º).
   - ⚠️ **Não comeces a executar nem a faturar cedo de mais**: nos contratos por ajuste direto ou consulta prévia, a publicitação no portal BASE é **condição de eficácia para quaisquer pagamentos** (art. 127.º, n.os 1 e 3); sem contrato escrito, não se pode iniciar a execução antes de apresentada a habilitação, prestada a caução e — quando aplicável (art. 95.º, n.º 4) — decorridos 10 dias da notificação da adjudicação (art. 95.º, n.º 3).

9. **Executar e receber:**
   - **Fatura eletrónica** obrigatória na execução de contratos públicos, no modelo da norma europeia publicitado no portal (CCP, art. 299.º-B, n.os 1 e 3) [VERIFICAR formato e canal aceites pela entidade]. **Micro, pequenas e médias empresas** podem usar outros mecanismos de faturação até **31/12/2026** (DL 111-B/2017, art. 9.º, n.º 4, na redação do DL 123/2018, prorrogado pela Lei 73-A/2025, art. 260.º, n.º 2) → prepara a faturação estruturada (CIUS-PT) para **1/1/2027** [VERIFICAR nova prorrogação]. O ajuste direto simplificado está dispensado (art. 128.º, n.º 3). Pormenores em `references/faturacao.md` (secção "Fatura eletrónica nos contratos públicos").
   - **Prazo de pagamento**: 30 dias após a fatura (ou após a receção dos bens/serviços ou a aceitação, conforme o caso); o contrato pode fixar outro, com teto de 60 dias (CCP, art. 299.º). Cláusulas com prazos superiores a 60 dias sem motivo justificado são nulas (art. 299.º-A).
   - **Atraso no pagamento** → juros de mora comerciais: `calc_juros_mora` (tipo comercial) e `playbooks/cliente-nao-paga.md` (aplicação do DL 62/2013 às entidades públicas — a confirmar caso a caso).
   - Modificações, trabalhos a mais/complementares, multas contratuais e resolução: CCP, parte III (arts. 278.º e seguintes) — ver `references/contratacao-publica.md`; litígio relevante → advogado.

### Ramo — Empresa com dívidas, em PER ou insolvência

- Dívidas à AT/SS: regulariza, ou fica numa das situações que a lei equipara a regularizada (ex.: plano de prestações a ser cumprido, garantia prestada — CCP, art. 55.º, n.º 2, que remete para o art. 177.º-A, n.º 1, als. b) a d), do CPPT e o art. 208.º, n.º 2, do Código Contributivo) [VERIFICAR com o contabilista certificado]. Insolvência declarada, liquidação, dissolução ou cessação de atividade impedem a participação, **salvo** se estiver em curso ou pendente acordo de reestruturação ou plano de recuperação (PER, RERE, plano de insolvência) (art. 55.º, n.º 1, al. a)). Ver `playbooks/recebi-notificacao-at.md` e `references/insolvencia.md`.

### Ramo — Concorrer com parceiros ou subcontratados

- Agrupamento de concorrentes ou recurso à capacidade de terceiros: regula responsabilidades, repartição e quem assina → `references/contratos.md` e `references/contratos-internacionais.md`; compromissos de terceiros têm de ser confirmados após a adjudicação (CCP, arts. 77.º, n.º 2, al. c), e 92.º a 93.º).

## Documentos a usar

- `assets/templates/pedido-esclarecimentos-ccp.md` — dúvidas sobre as peças (art. 50.º; 1.º terço do prazo)
- `assets/templates/lista-erros-omissoes-ccp.md` — erros e omissões das peças (art. 50.º; 1.º terço do prazo)
- `assets/templates/pronuncia-audiencia-previa-ccp.md` — pronúncia sobre o relatório preliminar (arts. 123.º / 147.º)
- `assets/templates/impugnacao-administrativa-ccp.md` — reclamação ou recurso administrativo (arts. 267.º a 274.º), com nota sobre o contencioso urgente
- `assets/templates/plano-prevencao-riscos-corrupcao.md` — se o contrato for ao Tribunal de Contas (art. 81.º, n.º 9)
- `references/contratacao-publica.md` — procedimentos, critérios, impugnações e execução do contrato
- `references/valores-2026.md` — limiares do DL 177/2026, caução e limiares europeus
- `calc_procedimento_ccp` (tool MCP) ou `scripts/procedimento_ccp.py` — procedimento admissível pelo valor
- `calc_prazo` (`tipo=uteis`) e `registar_prazo` — prazos da fase de formação
- `calc_juros_mora` — juros por atraso no pagamento

## Quando chamar advogado

- **Sempre** para o contencioso pré-contratual (mandatário obrigatório — CPTA, art. 11.º, n.º 1) e quando quiseres a suspensão automática da adjudicação (10 dias úteis).
- **Antes** de impugnar peças do procedimento (art. 269.º, n.º 2; CPTA, art. 103.º) ou quando a exclusão te tira um contrato relevante para a tesouraria.
- Suspeita de conluio, conflito de interesses ou favorecimento (CCP, arts. 55.º, als. i) a k) e m), e 70.º, n.º 3, al. g)) — e se a entidade te imputar falsas declarações (art. 87.º; risco penal).
- Na execução: resolução do contrato, multas contratuais elevadas, reequilíbrio financeiro ou trabalhos complementares em empreitadas.
- **Contabilista certificado**: faturação eletrónica, certidões de não dívida, prova de falta de liquidez para dispensa de caução no concurso flexível.
