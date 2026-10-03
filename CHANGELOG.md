# Changelog

Todas as alterações relevantes ao **juridico-pt** (até à 1.2.1, **advogado-pt**). O formato segue
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adere ao
[Versionamento Semântico](https://semver.org/lang/pt-BR/). A versão refere-se ao plugin como um todo.

## [2.0.0] - 2026-10

**O plugin passa a chamar-se `juridico-pt` ("Jurídico PT") e apresenta-se como assistente jurídico.** A renomeação é direta, sem migração automática (decisão D-1: só havia um utilizador).

### Changed

- **Nome novo em todo o lado**: plugin e marketplace `juridico-pt`, servidor MCP `juridico-pt`, skill em `skills/juridico-pt/`, CLI `cli/juridico-pt.mjs`, hook `hooks/juridico-hook.mjs`, URI dos resources `juridico-pt://`, pacote `juridico-pt.skill`. Não há atalhos com o nome antigo.
- **Assistente jurídico, não advogado**: a persona, o prompt (`assistente_juridico`, antes `advogado_pt`), a skill, os commands e a documentação deixam de dizer "És o advogado"; mantém-se o aviso de que não substitui advogado inscrito na Ordem dos Advogados.
- **Dados locais em `.juridico-pt/`** (projeto) e `~/.juridico-pt/` (perfil geral; a variável passa a `JURIDICO_PT_HOME`). A pasta `.advogado-pt/` nunca é lida nem apagada.
- As regras de editor da raiz (`.cursor/`, `.windsurf/`) e `integrations/windsurf/.windsurfrules` passam a ser geradas a partir da persona única (`gerar-integracoes.mjs`); tinham um perfil fixo antigo.

### Added

- **Cobrança em lote**: `calc_juros_lote` (juros por fatura por tramos semestrais, 40 € por fatura comercial vencida, totais por cliente e geral; Python `juros_mora.py --lote`), template `carta-cobranca-varias-faturas`, PEPEX (Lei 32/2014) e IVA de créditos incobráveis (CIVA, arts. 78.º-A a 78.º-D) no playbook `cliente-nao-paga`; `/cobrar` usa o conector de faturação quando existe e propõe `registar_prazo`.
- **Faturação 2027**: referência `faturacao`, playbook `faturacao-eletronica-2027`, checklist `checklist-faturacao` e `/faturacao` — faturas em PDF aceites até 31/12/2026 (Lei 73-A/2025, art. 95.º, n.º 3) e assinatura ou selo eletrónico qualificado a partir de 1/1/2027 (DL 28/2019, art. 12.º); a data entra no calendário.
- **Contratação pública**: `calc_procedimento_ccp` (limiares do DL 177/2026; regime anterior para procedimentos iniciados até 30/9/2026; Python `procedimento_ccp.py`), playbook `vender-ao-estado` e 4 templates (esclarecimentos, erros e omissões, audiência prévia, impugnação administrativa).
- **NIS2 e fundos europeus**: `checklist-nis2` (DL 125/2025 e Regulamento CNCS 756/2026); referência `fundos-europeus` e playbook `recebi-pedido-devolucao-apoio` (PRR e Portugal 2030).
- **Templates do dia a dia**: convocatória de assembleia geral, ata de aprovação de contas, procuração, caducidade do contrato a termo e resposta ao Livro de Reclamações.
- **Modo contabilista**: `painel_clientes` e `/painel` (obrigações e prazos dos próximos 30 dias de todos os perfis), prazos com `perfil`, `.ics` por perfil (`calendario_obrigacoes` com `por_perfil`); 9 campos novos no perfil (CAE, concelho, fim do período de tributação, imóveis, viaturas, setor NIS2, vendas B2C, trabalhadores estrangeiros, emite faturas).
- **Calendário**: IMI (CIMI, art. 120.º), IUC pelo mês da matrícula até 2026 e anual a partir de 2027 (DL 161/2026), Modelo 22, IES e pagamentos por conta com período de tributação diferente do ano civil.
- **Formatos**: `exportar_documento`, `/exportar` e CLI `exportar` — `.docx` sem dependências (Word e LibreOffice), sem a lista "Antes de enviar"; pacote `.mcpb` para o Claude Desktop (`npm --prefix mcp-server run build:mcpb`).
- **Perfil por formulário**: sem perfil, o `calendario_obrigacoes` pede os dados num formulário (elicitation) com listas fechadas; sem suporte do cliente, pergunta em texto.
- **Atualidade**: `verificar_atualidade` e aviso no início da sessão quando passou a "Próxima revisão" do `valores-2026.md` ou falta a taxa de juros do semestre.
- **Subagentes**: `verificador-citacoes` (verifica artigos e acórdãos na fonte oficial) e `revisor-contratos` (semáforo vermelho/amarelo/verde), só de leitura.
- **Privacidade**: referência `privacidade-plugin` e secção no README; `apagar_perfil`; aviso e `acrescentar_gitignore` em repositórios git; prazos cumpridos há mais de 12 meses saem de `prazos.md`.
- **Avaliações**: 53 casos em `evals/` para o `claude plugin eval` (golden, adversariais e de regressão), com a base da 1.2.1 registada.

### Fixed

- Início de sessão numa linha (≤ 200 caracteres) em projetos sem `.juridico-pt/`; descrições dos commands com ≤ 150 caracteres.
- Convenção única de placeholders em todos os templates (`{{MAIUSCULAS}}`, `N_FATURA`, `{{ESCOLHER: …}}`, `{{PREENCHER: …}}`, `{{OPCIONAL: …}}`).
- Livro de Reclamações (`consumo.md`): o livro eletrónico é obrigatório para todos os fornecedores e os prazos de 15 dias úteis distinguem o eletrónico do físico.
- Prestação de contas (`societario.md`): 5 meses com contas consolidadas (CSC, art. 65.º, n.º 5).
- NIS2 (`data-breach.md`): notificação inicial em 24 h, atualização em 72 h e relatório final em 30 dias úteis (DL 125/2025).

### Migração

Quem tinha o `advogado-pt` instalado troca a instalação com estes comandos no Claude Code:

```text
/plugin uninstall advogado-pt@advogado-pt-marketplace
/plugin marketplace remove advogado-pt-marketplace
/plugin marketplace add linofcp007/juridico-pt
/plugin install juridico-pt@juridico-pt
```

Depois, em cada projeto onde guardaste dados, renomeia à mão a pasta `.advogado-pt/` para `.juridico-pt/` (e `~/.advogado-pt/` para `~/.juridico-pt/` no perfil geral). Se usavas `ADVOGADO_PT_HOME`, passa a `JURIDICO_PT_HOME`.

## [1.2.1] - 2026-10

**Correções da revisão completa de 3/10/2026.** Sem funcionalidades novas: prazos, prescrição, impostos e conteúdo jurídico corrigidos e reconfirmados em fonte; escrita de ficheiros e hook endurecidos; distribuição alinhada com as regras do Claude Code e do claude.ai. Cada correção jurídica ficou protegida por um facto de referência (`factos.json`, ids `v121-`) com o texto errado em `naoContem`.

### Fixed

- **Prazos** (`calc_prazo`, `prazos.py`, CLI): novo tipo `judicial` (CPC, art. 138.º) — contínuo, suspenso nas **férias judiciais** (LOSJ, art. 28.º), processo `urgente`, termo em dia não útil transferido; `corridos` passa a transferir o termo e a mostrar o termo legal; o tipo por defeito passa a `corridos` (era `uteis`). Exemplo: 30 dias desde 1/10/2026 → 2/11/2026 (antes 13/11/2026 em dias úteis). SKILL.md com as **regras de contagem** por meio de defesa; playbooks de citação/injunção (embargos 728.º, penhora 785.º, multa do 139.º, n.º 5) e da AT atualizados.
- **Prescrição** (`calc_prescricao`, `prescricao.py`): faturas entre empresas **20 anos** (CC, art. 309.º — antes 5 anos); serviços de profissões liberais e vendas a não comerciantes **2 anos presuntivos** (art. 317.º, als. b) e c)), com aviso; rendas, juros e prestações periódicas pelas alíneas certas do art. 310.º; Lei 23/96 nos serviços essenciais. Playbook `cliente-nao-paga` alinhado (CC 323.º, n.º 2; indemnização de 40 € do DL 62/2013).
- **IMT Jovem**: também isenta o **Imposto do Selo** (dedução à coleta do art. 7.º-A CIS, DL 48-A/2024) — 400.000 €: Selo 555,69 € (antes 3.200 €).
- **IRS simplificado**: propriedade intelectual com coeficiente **0,95** (CIRS, art. 31.º, n.º 1, al. d) — antes 0,50); dedução de **4.587,09 €**; tabela das deduções à coleta no `valores-2026.md` (rendas: 900 € em 2026, a confirmar — antes 502 €).
- **Segurança Social**: ENI e EIRL a **25,2%**, base de 1/3 do rendimento relevante, mínimo de 20 €; MOE no art. 69.º do Código Contributivo.
- **Injunção**: nas transações comerciais **sem limite de valor** (DL 62/2013, art. 10.º) — calculadora e conteúdo.
- **Notificações da AT** na área reservada do Portal das Finanças: 5.º dia (CPPT, art. 38.º-A, n.º 4); **coimas laborais** pela Lei 107/2009 (15 dias contínuos, impugnação em 20 dias com efeito devolutivo); prescrição do RGCO (art. 27.º: 5, 3 ou 1 ano); coima fiscal a 75% só depois de fixada (RGIT, art. 78.º).
- **Arrendamento** pelos arts. 1083.º e 1096.º a 1101.º CC (renovação por 3 anos, oposição à 1.ª renovação, antecedências 240/120/90/60, denúncia com 5 anos, mora igual ou superior a 3 meses).
- **Afirmações desatualizadas**: CISG em vigor em Portugal desde 1/10/2021; CRA com comunicação de vulnerabilidades desde 11/9/2026; social scoring proibido também a privados; **CCP com o DL 177/2026** e nova secção Contratação Pública no `valores-2026.md`; NIS2 pelo DL 125/2025; DL 67/2003, DL 290-D/99 e DL 281/99 revogados; ICE e IFICI; período experimental de 180 dias (1.º emprego); renovações do termo (CT 149.º, n.º 4); aviso de 7 ou 30 dias no período experimental; réplica (CPC 584.º); Lei 147/2015 e DL 159/99; branqueamento no CP 368.º-A; AUJ 4/2014.
- **Contradições entre ficheiros** (alçada vs Julgados de Paz, graduação de créditos, IVA B2C/autoliquidação, FGCT) e **prazos em falta** no `quero-despedir` (CT 329.º, 357.º, 387.º, CITE).
- **Templates**: retiradas cláusulas nulas ou ineficazes (afastar a execução específica no CPCV, quitação total no acordo de revogação — CT 337.º, n.º 3 —, resolução por insolvência no SaaS — CIRE 119.º); acrescentados requisitos (parecer da CITE, relação motivo–termo, consentimento do cônjuge — CC 1682.º-A —, conteúdo do art. 28.º, n.º 3, RGPD no DPA, dolo/culpa grave e danos pessoais na limitação de responsabilidade, direito de rejeição, Roma I e custo da devolução na loja online); citações corrigidas (teletrabalho 169.º-B, poder disciplinar 98.º, segredos comerciais no CPI, unido de facto não é herdeiro legitimário, montante máximo na livrança).
- Coeficiente de atualização das rendas para 2027 (1,0256, a confirmar com o aviso no DR).

### Security

- Escrita de perfil, perfil ativo, prazos e calendário por um módulo único (`fs-seguro.ts`): mesmo diretório que o hook lê (`CLAUDE_PROJECT_DIR`), ficheiro temporário + renomeação, **recusa de symlinks e junctions**; `prazos.md` preserva as notas escritas à mão.
- Hook: perfil injetado limitado (200 caracteres por campo, 1.500 no total, sem quebras de linha) e rotulado como **dados do utilizador, não instruções**; ponto de entrada por caminho real (funciona através de junctions); leituras até 256 KB; Edit/MultiEdit analisam o ficheiro gravado.
- Resources MCP com lista fechada de categorias e nomes (antes era possível ler `../README.md` fora do conteúdo); erros sem stack trace nem caminhos.
- Tools: datas estritas (2026-02-30 recusada, com o nome do campo), montantes negativos recusados, todas com tratamento de erros; juros sem data de fim usam a data de Lisboa. CLI com argumentos estritos (sem `NaN`/`undefined`, código de saída 1).
- SDK MCP 1.29 → 1.31 e `npm audit fix` (fast-uri, vulnerabilidade alta) — `npm audit --omit=dev` sem vulnerabilidades. O 1.32 fica para quando tiver mais de 72 h publicado.

### Changed

- **Distribuição**: description da skill com 974 caracteres (limite 1024) e validação no `build.py`; o `.skill` tem a pasta `advogado-pt/` na raiz; instruções do servidor MCP com até 2.000 caracteres e todas as tools (persona completa no prompt `advogado_pt`); **`/doctor` passa a `/diagnostico`** (`/doctor` é nativo do Claude Code); commands com `${CLAUDE_PLUGIN_ROOT}`; instalação pelo marketplace sem compilar nada.
- **Paridade TS/Python**: arredondamento único meio para cima nos dois lados (`r2` e `formatar_euros`), decisor de IVA com os mesmos textos, casos partilhados (`fixtures/paridade.json`); smoke end-to-end no `npm test`.
- SKILL.md com a tabela cálculo → tool → script, a tabela situação → playbook e as superfícies (Claude Code, claude.ai, outras IAs); referências e checklists sem perfil fixo; montantes só no `valores-2026.md`; secções `## Templates` com ficheiros reais ou "(a pedido)"; integrações geradas a partir de uma fonte única (`gerar-integracoes.mjs`).

## [1.2.0] - 2026-10

**Advogado operacional.** O plugin passa de responder a perguntas a acompanhar a empresa no dia a dia: calendário de obrigações a partir do perfil, prazos em curso com aviso, pacote do empregador, fisco internacional, mais contratos e setores regulados — e os valores e pontos de doutrina que estavam por confirmar foram verificados.

### Added

- **Calendário de obrigações** (`calendario_obrigacoes`, `/calendario`, `cli calendario`): obrigações do ano a partir do perfil (IVA mensal/trimestral e recapitulativa, e-fatura, inventário, DMR, retenções, Modelo 10, Modelo 22, pagamentos por conta, IES, Modelo 3 e Cat. B para ENI, Segurança Social e trabalhador independente, aprovação de contas, RCBE, Relatório Único, mapa de férias, formação, RGPC), cada data com base legal e fonte; feriados, fins de semana, férias fiscais de agosto, IVA de junho em setembro e prorrogações por despacho (Modelo 22 de 2026 até 30/6) aplicados; perfil incompleto → datas "a confirmar". Exportação **`.ics`** (RFC 5545) para Google Calendar/Outlook.
- **Prazos em curso** (`registar_prazo`, `listar_prazos`, `concluir_prazo`, `/prazos`, `cli prazos`): guardados em `.advogado-pt/prazos.md`; o hook avisa ao abrir a sessão os vencidos e os que terminam em 7 dias (fail-open).
- **Vários perfis** (`listar_perfis`, `ativar_perfil`; `perfil` em `obter/guardar_perfil_empresa`): `perfis/<nome>.md` + perfil ativo, para contabilistas e consultores; o hook mostra o ativo.
- **Calculadoras novas** (Python + TS + tool + CLI, com testes): `calc_salario_liquido` (tabelas de retenção do Despacho 233-A/2026, SS 11%, subsídio de refeição), `calc_custo_trabalhador` (14 meses, TSU 23,75%, refeição, seguro AT), `calc_irc` (19/18/17% e PME 15%, prejuízos 65%, derramas, tributação autónoma com agravamento), `calc_iva_operacao` (onde se tributa, quem liquida, menção e código AT, declarações, OSS) e `calc_taxa_justica` (RCP, Tabela I, remanescente, redução eletrónica).
- **Referências**: `compliance` (RGPC e canal de denúncias por dimensão), `iva-internacional`, `licenciamento-setorial` (alojamento local, restauração, construção, transportes/TVDE, mediação imobiliária).
- **Templates (17)**: plano de prevenção de riscos de corrupção, regulamento do canal de denúncias, regulamento interno, registo dos tempos de trabalho, contratos de agência (indemnização de clientela), distribuição, franquia e SaaS B2B, acordo parassocial com vesting, cessão de quotas, arrendamento não habitacional, trespasse, oposição à injunção, embargos de executado, política de uso de IA (art. 4.º do AI Act), videovigilância e monitorização de trabalhadores.
- **Playbooks** `lay-off`, `despedimento-coletivo`, `faturar-cliente-estrangeiro`, `dissolucao-liquidacao`; **checklists** `checklist-compliance-dimensao` e `checklist-seguranca-saude-trabalho`; **commands** `/calendario`, `/prazos`, `/salario`, `/irc`, `/compliance`.
- **Factos de referência** (`mcp-server/test/factos.json`, 67 factos com fonte): cada erro corrigido fica testado para não voltar.

### Changed

- `valores-2026.md`: retenção de IRS 2026, IRC 2026-2028, SS pelo DL 127/2025, custas (Tabelas I e II), coimas laborais (leve/grave/muito grave), RGPC, Lei 93/2021, RGPD e AI Act, limiares de IVA intracomunitário, licenciamento setorial; os **18 valores** por confirmar e as **45 marcas** dos ficheiros novos resolvidos com fonte oficial.
- **Pontos de doutrina** resolvidos com posição recomendada e grau de certeza: software por encomenda (DL 252/94), decisões do sócio único, renúncia ao pacto de não concorrência, botão de livre resolução (Diretiva 2023/2673, ainda não transposta).
- Hook: deteta as peças processuais e os regulamentos internos novos (sempre pela estrutura, com teste de precisão).
- Pontos "(a confirmar)" verificados em fonte oficial: M40 nos serviços B2B a empresas de fora da UE (informações vinculativas da AT); Relatório Único de 2026 alargado até 12/6 (DGCP); Mod. 21-RFI (Despacho 8363/2020); Lei 59/2026 do TVDE (25% sem IVA, coimas até 44.000 €, fim do teto da tarifa dinâmica); classes de alvará da Portaria 212/2022; DL 108/2026 (RJUE) em vigor desde 1/10/2026; CSRD pós-Omnibus (450 M€ e 1.000 trabalhadores; não transposta); ANACOM ainda não designada para o AI Act.
- AI Act: calendário pela redação do Reg. (UE) 2026/1744 (Anexo III em 2/12/2027, Anexo I em 2/8/2028) e literacia do art. 4.º como dever de promover; coima mais baixa das *small mid caps* só nos n.os 4 e 5 do art. 99.º.

### Fixed

- **Compensação por despedimento**: sem mínimo de 3 meses no regime atual, extinção do posto a 14 dias/ano, tetos do art. 366.º e regime transitório por períodos (validado contra o simulador da ACT); `laboral.md` e `quero-despedir.md` alinhados.
- Comunicação de admissão à SS **até ao início da execução do contrato** (DL 127/2025).
- Honorários de profissões liberais: prescrição **presuntiva de 2 anos** (art. 317.º, al. c), CC), não 5 anos.
- Taxas de IVA dos Açores e da Madeira em `fiscal.md`; Imposto do Selo da renda é encargo do senhorio; periodicidade mensal do IVA a partir de 650.000 € (inclusive).

## [1.1.0] - 2026-10

**Advogado para qualquer empresa.** O plugin deixa de assumir um "ENI de tecnologia": guarda o perfil da empresa, corrige erros jurídicos encontrados numa revisão comparativa e acrescenta cobertura empresarial (fisco, banca, concorrência, UE).

### Added

- **Perfil da empresa guardado** em `<projeto>/.advogado-pt/perfil-empresa.md` (prioridade) ou no perfil geral `~/.advogado-pt/perfil-empresa.md`: carregado pelo hook `SessionStart`, lido/gravado pelas tools `obter_perfil_empresa` / `guardar_perfil_empresa` e pelo comando `/perfil`; pede confirmação se tiver mais de 12 meses; nunca grava dados de terceiros.
- **Juros de mora por tramos semestrais** (`calc_juros_mora`, `scripts/juros_mora.py`, `cli calc juros`): tabela de taxas do 2.º semestre de 2013 ao 2.º semestre de 2026 (com o aviso de cada semestre), novo tipo `comercial-geral` (art. 102.º §3 CCom), memória de cálculo pronta a anexar, taxa estimada para semestres sem aviso e lembrete dos 40 € (art. 7.º DL 62/2013).
- **Calculadoras novas** (Python + TS + tool + CLI): `calc_creditos_laborais` (proporcionais de férias, subsídios de férias e de Natal, férias não gozadas; alerta do art. 245.º/3 CT) e `calc_legitima` (legítima, quota disponível e divisão por herdeiro, arts. 2156.º-2162.º CC).
- **Referências**: `contencioso-tributario`, `bancario`, `concorrencia`, `uniao-europeia`.
- **Templates (17)**: reclamação graciosa, audição prévia, prestações na execução fiscal, informação vinculativa, pacto social unipessoal, decisão do sócio único, desenvolvimento de software com cessão de direitos, cease and desist de PI, notice and takedown (DSA), reclamação de créditos na insolvência, pacto de não concorrência, código contra o assédio, formulário de livre resolução, reclamação ao banco por operação não autorizada, registo de atividades de tratamento, resposta a pedidos de titulares, queixa à Comissão Europeia.
- **Playbooks** `recebi-notificacao-at` e `cliente-insolvente`; **checklists** de registo de marca, loja online e concorrência; **commands** `/fisco`, `/insolvencia`, `/perfil`.
- **Método em todos os templates**: linha `Âmbito:` (nacional / ue / misto) e secção final `## Antes de enviar — verificar`, entregue separada do documento; convenção `{{CAMPO}}` vs `[VERIFICAR]`. Um teste de estrutura impede regressões.
- **`cli prompt <nome>`**: exporta um template/playbook/checklist/referência como prompt autocontido para ChatGPT, Gemini, Copilot, etc.
- `procurar_conteudo` agrupa os resultados por tipo; `listar_*` mostram o âmbito.

### Changed

- Persona genérica (qualquer forma jurídica, setor e dimensão) em `persona.ts`, `SKILL.md`, `AGENTS.md`, `GEMINI.md` e em todas as `integrations/`.
- `valores-2026.md`: taxas do 2.º semestre de 2026 (10,40% / 9,40%, Aviso n.º 16623/2026/2) e indemnização de 40 €.
- `listar()` deixa de devolver o `README` como se fosse um template.

### Fixed

- **`carta-cobranca-formal-registada`** dizia que a carta interrompe a prescrição — falso: só a citação/notificação judicial ou o reconhecimento da dívida a interrompem (arts. 323.º e 325.º CC).
- **Juros com taxa única** aplicada a períodos que atravessam semestres (ex.: 2025 inteiro dava 507,50 € em vez de 532,29 €) e taxa do 1.º semestre de 2026 ainda em uso em outubro.
- **Título executivo**: um reconhecimento de dívida só com assinatura reconhecida, ou uma fatura assinada, já não é título executivo — é preciso documento autenticado (art. 703.º, n.º 1, al. b), CPC) (`reconhecimento-divida`, `cobrancas`, `cliente-nao-paga`).
- Comunicação do arrendamento às Finanças: até ao fim do mês seguinte ao do início (art. 60.º, n.º 2, CIS), não "30 dias".
- Segredos comerciais: Código da Propriedade Industrial (DL 110/2018, arts. 313.º e ss.), não "DL 49/2018".
- Cessão de direitos de autor: escrito com reconhecimento notarial (parcial) ou escritura pública (total e definitiva) — arts. 43.º/44.º CDADC.
- Teletrabalho: regime de duração/cessação do art. 167.º CT (60 dias na duração indeterminada; até 6 meses renováveis; denúncia nos primeiros 30 dias).
- Modelo 1 do Imposto do Selo: até ao fim do 3.º mês seguinte ao do óbito (art. 26.º CIS).
- Comunicação de admissão à Segurança Social: nos 15 dias anteriores ao início do contrato (art. 29.º, n.º 2, Código Contributivo).
- `SKILL.md` "Prazos comuns": impugnação judicial tributária é de 3 meses (art. 102.º CPPT), recurso de coima 20 dias (art. 59.º/3 RGCO).
- `fiscal.md` / `fiscal-pessoal.md`: impugnação judicial em **3 meses** (art. 102.º, n.º 1, CPPT), não "90 dias".
- `multas.md` / `recebi-citacao-ou-injuncao.md` / `defesa-contraordenacao.md`: coimas fiscais (RGIT) têm defesa e recurso em **30 dias** (arts. 70.º e 80.º); redução e pagamento antecipado de coimas com os artigos certos (arts. 29.º-32.º e 75.º RGIT).
- Notificações eletrónicas da AT: consideram-se feitas no **15.º dia** após a disponibilização (art. 39.º, n.º 10, CPPT).
- `insolvencia.md`: suspensão das execuções no PER de **4 meses + 1** (art. 17.º-E CIRE, Lei 9/2022); reclamação de créditos também sem advogado (e-mail/carta registada — art. 128.º).
- `consumo.md`: presunção de não conformidade de **2 anos** e bens usados redutíveis a **18 meses** (arts. 12.º-13.º DL 84/2021); plataforma ODR encerrada em 20/07/2025.
- `pi.md`: software feito por encomenda pertence, por defeito, ao **cliente** (art. 3.º, n.º 3, DL 252/94).
- Reserva legal das Lda com o mínimo de **2.500 €** (art. 218.º, n.º 2, CSC) em `societario.md`, na checklist de constituição e em `valores-2026.md`.
- `digital-ue.md`: execução nacional do DSA pela **Lei 12-A/2026** (ANACOM como Coordenador dos Serviços Digitais; revogação dos arts. 12.º-19.º do DL 7/2004).
- Hook `PostToolUse`: reconhece os novos tipos de ato (reclamação graciosa, pedido de informação vinculativa, código de boa conduta, ata, formulário de livre resolução…) sem disparar em títulos técnicos parecidos (testes de regressão).

### Valores (`valores-2026.md`)

- Novas secções **Fisco — contencioso e execução fiscal**, **Banca, pagamentos e branqueamento** e **Concorrência e direito da UE**, com valores confirmados na lei (CAAD 10 M€; dispensa de garantia 5.000/10.000 €; numerário 3.000 €; franquia de 50 € em operações não autorizadas; RCBE; limiares de concentrações; *de minimis* 300.000 €; pequeno montante 5.000 €; OSS 10.000 €). O que não foi confirmado fica `[VERIFICAR]`.

## [1.0.5] - 2026-08

Correção da **sincronização do marketplace** no Claude Desktop / claude.ai.

### Fixed

- O diretório de topo `bin/` foi renomeado para `cli/`. O Claude Desktop não clona o repositório localmente — delega a validação num serviço remoto da Anthropic, que rejeitava o plugin com `status=failed_content`: *"Plugin contains a top-level bin/ directory ('bin/advogado-pt.mjs'). claude.ai-hosted plugins may not ship bin/ executables because they are added to PATH on the CLI but are not shown on the admin approval surface."* Na UI isto aparecia apenas como **"Falha na sincronização do marketplace. Verifique a URL do repositório"** — mensagem enganadora, porque a URL estava correta e o repositório é público. A instalação pelo CLI (`/plugin marketplace add`) nunca foi afetada, porque usa `git clone` local e não passa por esta validação.
- Atualizadas as 16 referências a `bin/advogado-pt.mjs` (README, INSTALL, CONTRIBUTING, CLAUDE.md, llms-install, `commands/doctor.md`, todas as `integrations/` e o campo `bin` + script `setup` do `package.json`). O comando passa a ser `node cli/advogado-pt.mjs`.

## [1.0.4] - 2026-07

Correção de **falsos positivos** do hook `PostToolUse`.

### Fixed

- O hook `PostToolUse` deixou de anunciar *"Documento jurídico detetado"* em ficheiros técnicos. Detetava por presença de palavras (`contrato`, `cláusula`, `NDA`, …), mas num plugin de direito esse vocabulário **é** o assunto: disparava em 105 ficheiros do próprio repositório — incluindo `mcp-server/src/tools.ts`, todas as `references/` e todos os `playbooks/` — e em specs de software que dizem "contrato" no sentido de *contrato de interface*. Passa a classificar pela **estrutura do instrumento** (título de documento, bloco de outorgantes, cláusulas numeradas, assunto/fecho de carta), ignorando ficheiros que não sejam prosa, caminhos técnicos (`.specs/`, `src/`, `scripts/`, …) e referências da casa (`## Legislação Base`). Medido no repositório: 52/56 templates detetados, **0 falsos positivos em 190** ficheiros não-jurídicos.

### Added

- `mcp-server/test/hooks.test.mjs` — testes do detetor, incluindo o caso de regressão que originou a correção.
- `detetarDocumentoJuridico()` passa a ser exportada de `hooks/advogado-hook.mjs`; o dispatcher só corre quando o ficheiro é executado diretamente, para ser testável sem efeitos secundários.

## [1.0.3] - 2026-06

Correção do **carregamento de hooks** após instalação.

### Fixed

- `plugin.json`: removida a referência `"hooks": "./hooks/hooks.json"`. O Claude Code carrega `hooks/hooks.json` (caminho padrão) **automaticamente**, pelo que declará-lo no manifesto provocava *"Duplicate hooks file detected"* e a falha do carregamento dos hooks (`SessionStart`, `PostToolUse`). O campo `manifest.hooks` só deve apontar para ficheiros de hooks **adicionais**, fora do caminho padrão.

## [1.0.2] - 2026-06

Correção de **instalação via marketplace**: o plugin instala e o servidor MCP arranca sem passos manuais.

### Fixed

- `marketplace.json`: o campo `author` da entrada do plugin passou de string para objeto `{name, email}`, como exige o schema. Antes, a validação da entrada falhava e o Claude Code mostrava o erro genérico *"This plugin uses a source type your Claude Code version does not support. Update Claude Code"* — impedindo a instalação (o problema não era a versão do Claude Code nem o `source`).
- Servidor MCP deixou de exigir `npm install`/build manual depois de instalado: `mcp-server/dist/index.js` passou a ser um **bundle self-contained** (dependências `@modelcontextprotocol/sdk` e `zod` embebidas via esbuild) e é versionado, tal como `mcp-server/content/`. Sem isto, `node dist/index.js` falhava com *"Cannot find package"* num plugin instalado via marketplace (onde não há `node_modules`).

### Changed

- Build do servidor MCP: novo passo `build:server` (esbuild) dentro de `npm run build`; `esbuild` adicionado como devDependency. O `tsc` mantém-se para type-check e para a árvore `dist/` usada nos testes.
- `.gitignore` (raiz e `mcp-server/`) passam a versionar `mcp-server/dist/index.js` e `mcp-server/content/`, mantendo ignorado o resto da saída do `tsc`.

## [1.0.1] - 2026-06

Ronda de **semântica de utilização** — melhora a ativação do plugin e a seleção das ferramentas certas, em PT e EN.

### Added

- `instructions` ao nível do servidor MCP (persona + router intenção→ferramenta) — clientes injetam como contexto.
- Annotations `readOnlyHint` nas 17 tools; autocomplete (`completable`/`complete`) dos argumentos de conteúdo e dos resources.
- 7 prompts MCP por área (`cobranca`, `contrato`, `rgpd`, `laboral`, `imovel`, `heranca`, `sociedade`), além do `advogado_pt`.
- Dicionário de sinónimos/calão na persona; exemplos de gatilho (PT/EN) nos 22 commands.

### Changed

- `SKILL.md` description com gatilhos EN (paridade) e mais frases coloquiais PT.
- Descrições das 17 tools reescritas em estilo "usa-quando" + sinónimos + pista EN.
- `plugin.json` keywords (10→20, PT/EN); `marketplace.json` description com frases-gatilho.

## [1.0.0] - 2026-06

Primeira versão pública consolidada. Reúne o trabalho desenvolvido de forma incremental (v1→v6, antes
registado informalmente no `README.md`) numa única release versionada, com distribuição multi-plataforma.

### Added

- **Skill de assessoria jurídica de Portugal** (`skills/advogado-pt/`): persona de advogado pessoal e
  empresarial (PT/EN), com **26 referências** de conhecimento por área (empresarial, pessoal e
  transversal), **28 templates** de documentos com placeholders `{{...}}`, **5 playbooks** (árvores de
  decisão) e **5 checklists** acionáveis.
- **8 calculadoras determinísticas**: juros de mora, IMT, prazos legais, prescrição/caducidade,
  compensação por cessação de contrato, custas (injunção), imposto do selo e IRS simplificado.
- **Ficheiro central de valores** `valores-2026.md` — ponto único de verdade para taxas, montantes,
  prazos e tabela de IMT; as restantes referências remetem para lá em vez de repetir números.
- **Servidor MCP em TypeScript** (`mcp-server/`): **17 tools** (as 8 calculadoras + 9 ferramentas de
  conteúdo), **resources** (todo o conteúdo jurídico em `advogado-pt://{categoria}/{nome}`) e um
  **prompt** `advogado_pt` (persona). Funciona em Claude, Cursor, Windsurf, Codex, Gemini e
  ChatGPT/OpenAI.
- **Plugin do Claude Code**: `commands/`, `hooks/` e `.claude-plugin/` (com `marketplace.json` para
  instalação local).
- **Integrações multi-plataforma** (`integrations/`): manifestos e ficheiros de persona prontos a usar
  para Claude Code (plugin), Claude Desktop, Cursor, Windsurf, Gemini CLI, Codex CLI e ChatGPT/OpenAI.

### Changed

- Conteúdo reestruturado para `skills/advogado-pt/`, separando a skill do empacotamento MCP e do plugin.
  O pacote `.skill` passa a excluir `mcp-server/` e `integrations/`.

### Fixed

- **IRC** corrigido para as taxas vigentes (15% / 19%), eliminando os valores residuais 17% / 21%.
- **Compensação por cessação** corrigida para 14 dias/ano (de 12) nas modalidades aplicáveis.
- **Custas de injunção** atualizadas (escalões e taxa de justiça desatualizados).
- Removido o link da **Plataforma ODR** (extinta) e demais correções de revisão de QA.

[1.0.3]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.3
[1.0.2]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.2
[1.0.1]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.1
[1.0.0]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.0
