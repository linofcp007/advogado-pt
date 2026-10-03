# Feature: advogado-pt v1.2.1 correções

## Resumo
Corrigir todos os defeitos encontrados na revisão completa de 3/10/2026 (código, conteúdo jurídico, estrutura do plugin, qualidade da skill): calculadoras com resultados juridicamente errados, conteúdo e templates com erros ou risco de nulidade, escrita de ficheiros e hook inseguros, entradas inválidas aceites, problemas de distribuição e falta de paridade Python/TS. Sai ainda com o nome `advogado-pt`, para chegar por atualização a quem já instalou a 1.2.0. Sem funcionalidades novas (essas vão na 2.0.0).

## Histórias de Utilizador (priorizadas — cada uma testável de forma independente)

Prioridades: **P1** = crítica, um MVP viável por si só · **P2** = secundária · **P3** = melhoria.
Cada história deve entregar valor autónomo se for lançada sozinha.

### US-1 (P1 — MVP): Prazos contados como a lei manda
**Como** utilizador que recebeu uma citação ou notificação, **quero** que a data-limite calculada seja a da lei, **para que** não perca um prazo perentório.
**Porquê P1:** hoje uma contestação citada a 1/10/2026 dá 13/11 em vez de 2/11 — depois do fim do prazo.
**Teste Independente:** contar a contestação (30 dias) e a oposição à injunção (15 dias) com início em 1/10/2026 e em 1/7/2026, e ler o playbook de citações.

#### Critérios de Aceitação (EARS)
1. **US-1.AC-1** — QUANDO é pedido um prazo do tipo `judicial`, O SISTEMA DEVE contá-lo de forma contínua, suspendê-lo durante as férias judiciais (22/12 a 3/1, Domingo de Ramos a Segunda-feira de Páscoa, 16/7 a 31/8) salvo processo urgente ou prazo igual ou superior a 6 meses, e passar o termo que caia em dia não útil para o 1.º dia útil seguinte (CPC, art. 138.º; LOSJ, art. 28.º), em Python e TypeScript.
2. **US-1.AC-2** — QUANDO é pedido um prazo do tipo `corridos`, O SISTEMA DEVE passar o termo que caia em sábado, domingo ou feriado nacional para o 1.º dia útil seguinte e indicar a data legal antes da transferência.
3. **US-1.AC-3** — O SISTEMA DEVE indicar, na tool `calc_prazo`, no CLI, no SKILL.md e nos playbooks, que tipo de contagem se aplica a cada meio de defesa (CPC: `judicial`; RGIT e CPPT: `corridos`; contraordenações laborais: contínuo, sem férias judiciais; RGCO e CPA: `uteis`), e o tipo por defeito da tool DEVE deixar de ser `uteis`.
4. **US-1.AC-4** — SE a data de início for inválida ou o número de dias for negativo ou superior a 3650, ENTÃO O SISTEMA DEVE recusar o cálculo com uma mensagem que nomeia o campo, sem ciclo infinito.

### US-2 (P1): Prescrição dos créditos correta
**Como** empresa com faturas por cobrar, **quero** saber até quando posso cobrar, **para que** não abandone um crédito válido nem confie num prazo que já passou.
**Teste Independente:** pedir a prescrição de um crédito comercial B2B, de honorários de profissão liberal e de uma venda a consumidor.

#### Critérios de Aceitação (EARS)
1. **US-2.AC-1** — QUANDO é pedida a prescrição de um crédito comercial entre empresas, O SISTEMA DEVE aplicar a regra geral de 20 anos (CC, art. 309.º), salvo prestação periódica (art. 310.º), em Python e TypeScript.
2. **US-2.AC-2** — QUANDO o crédito é de serviços de profissão liberal ou de venda de comerciante a não comerciante, O SISTEMA DEVE aplicar a prescrição presuntiva de 2 anos (CC, art. 317.º, als. c) e b)) e avisar que se presume o pagamento e só se afasta por confissão (arts. 312.º a 314.º).
3. **US-2.AC-3** — O SISTEMA DEVE citar a alínea certa do art. 310.º em cada tipo (rendas e alugueres: al. b); juros: al. d); prestações periódicas: al. g)), e o playbook `cliente-nao-paga` e o SKILL.md DEVEM usar os mesmos prazos que a calculadora.

### US-3 (P1): Impostos, contribuições e custas certos
**Como** gestor ou contabilista, **quero** que as calculadoras e os valores de referência deem o montante da lei, **para que** não pague a mais nem declare mal.
**Teste Independente:** IMT Jovem a 300.000 €, IRS simplificado de propriedade intelectual, contribuições de um ENI, injunção B2B de 40.000 €.

#### Critérios de Aceitação (EARS)
1. **US-3.AC-1** — QUANDO se aplica o IMT Jovem, O SISTEMA DEVE aplicar a mesma isenção ao Imposto do Selo da aquisição (total na isenção total; só sobre o excesso na isenção parcial), em Python e TypeScript.
2. **US-3.AC-2** — O SISTEMA DEVE usar no regime simplificado de IRS os coeficientes do art. 31.º, n.º 1, CIRS (serviços em geral 0,35; tabela do art. 151.º 0,75; propriedade intelectual 0,95) e a dedução de 8,54 × IAS (4.587,09 € em 2026), em Python, TypeScript, `valores-2026.md` e `fiscal.md`.
3. **US-3.AC-3** — O SISTEMA DEVE indicar para o ENI a taxa contributiva de 25,2%, a base de 1/3 do rendimento relevante do trimestre (70% dos serviços, 20% das vendas) e a contribuição mínima de 20 €, e as taxas dos MOE com base no art. 69.º do Código Contributivo.
4. **US-3.AC-4** — QUANDO a dívida resulta de uma transação comercial entre empresas, O SISTEMA DEVE indicar a injunção como admissível qualquer que seja o valor (DL 62/2013, art. 10.º) no playbook `cliente-nao-paga`, em `cobrancas.md` e na calculadora de custas de injunção.

### US-4 (P1): Conteúdo jurídico corrigido
**Como** utilizador que segue as referências e os playbooks, **quero** que digam o que a lei em vigor diz, **para que** possa agir com base neles.
**Teste Independente:** correr os factos de referência novos (um por correção) e ler os ficheiros alterados.

#### Critérios de Aceitação (EARS)
1. **US-4.AC-1** — O SISTEMA DEVE indicar que a notificação na área reservada do Portal das Finanças e a citação eletrónica em execução fiscal se consideram feitas ao 5.º dia (CPPT, arts. 38.º-A, n.º 4, e 191.º, n.º 6), reservando o 15.º dia para a caixa postal eletrónica, no SKILL.md e no playbook `recebi-notificacao-at`.
2. **US-4.AC-2** — O SISTEMA DEVE indicar que a defesa em contraordenação laboral é de 15 dias contínuos sem suspensão em férias judiciais, a impugnação judicial de 20 dias e com efeito meramente devolutivo (Lei 107/2009, arts. 6.º, 17.º, 33.º e 35.º), e que a prescrição no RGCO é de 1, 3 ou 5 anos (art. 27.º).
3. **US-4.AC-3** — O SISTEMA DEVE indicar em `arrendamento.md` os prazos dos arts. 1096.º a 1101.º e 1083.º CC na redação em vigor (denúncia pelo senhorio com 5 anos; avisos do arrendatário de 120/90/60 dias ou 1/3 do prazo; renovação supletiva de 3 anos; oposição à 1.ª renovação só eficaz 3 anos após a celebração; mora igual ou superior a 3 meses).
4. **US-4.AC-4** — O SISTEMA DEVE corrigir as afirmações erradas ou desatualizadas identificadas na revisão (CISG em vigor em Portugal desde 1/10/2021; art. 14.º do CRA aplicável desde 11/9/2026; CCP alterado pelo DL 177/2026; NIS2 pelo DL 125/2025; DL 67/2003, DL 290-D/99 e DL 281/99 revogados; remuneração convencional do capital substituída pelo ICE; RNH substituído pelo IFICI; período experimental de 180 dias e aviso de 30 dias; réplica só para reconvenção; direito de retenção do promitente-comprador só do consumidor; seguro de acidentes de trabalho obrigatório para independentes; Lei 147/2015; crime de branqueamento no art. 368.º-A CP; social scoring também por privados).
5. **US-4.AC-5** — O SISTEMA DEVE resolver as contradições entre ficheiros identificadas na revisão (alçadas e Julgados de Paz; graduação de créditos; pagamento voluntário de coima do RGIT só depois de fixada; taxa da marca nacional; limiar das vendas B2C; menção "IVA - autoliquidação"; FGCT; remissões do IVA intra-UE para `iva-internacional.md`), deixando uma única versão correta.
6. **US-4.AC-6** — O SISTEMA DEVE acrescentar aos playbooks os prazos em falta (embargos 20 dias, oposição à penhora 10 dias, multa do art. 139.º, n.º 5, CPC; decisão disciplinar em 30 dias, prescrição de 1 ano da infração, impugnação em 60 dias, parecer da CITE; injunção pelo menos 5 dias antes do fim da prescrição, art. 323.º, n.º 2, CC; indemnização de 40 €).
7. **US-4.AC-7** — SE uma correção não puder ser confirmada em fonte oficial ENTÃO O SISTEMA DEVE marcá-la "(a confirmar)" com a fonte onde se confirma, em vez de afirmar.
8. **US-4.AC-8** — O SISTEMA DEVE ter um facto de referência em `factos.json` para cada correção dos ACs US-4.AC-1 a US-4.AC-6, com o texto errado em `naoContem`.

### US-5 (P1): Templates sem risco de nulidade
**Como** quem envia um documento gerado, **quero** que as cláusulas sejam válidas, **para que** o documento produza efeitos.
**Teste Independente:** ler os templates corrigidos e correr o teste de templates.

#### Critérios de Aceitação (EARS)
1. **US-5.AC-1** — O SISTEMA NÃO DEVE oferecer nos templates cláusulas que a lei fere de nulidade ou ineficácia identificadas na revisão (afastar a execução específica num CPCV de edifício ou fração; quitação total por remissão abdicativa num acordo de revogação; resolução por insolvência num contrato SaaS; eficácia real num documento particular).
2. **US-5.AC-2** — O SISTEMA DEVE incluir nos templates os requisitos cuja falta torna o ato ilícito, anulável ou incompleto (parecer prévio da CITE na carta de despedimento; relação entre o motivo e o termo no contrato a termo certo; consentimento do cônjuge no trespasse, arrendamentos e pacto social; conteúdo do art. 28.º RGPD no DPA; ressalva de dolo, culpa grave e danos pessoais na limitação de responsabilidade; devolução, rejeição em 30 dias, Roma I art. 6.º e função de livre resolução nos termos e condições da loja online).
3. **US-5.AC-3** — O SISTEMA DEVE corrigir as citações de artigos erradas nos templates (169.º-B, 98.º, 356.º n.º 3, 149.º, 27.º RGCO, CPI arts. 313.º e ss.) e as cláusulas enganadoras (epígrafe "título executivo" sem autenticação; ameaça de ação executiva só com fatura; unido de facto como herdeiro legitimário; livrança sem teto).

### US-6 (P1): Escrita de ficheiros e hook seguros
**Como** utilizador que abre repositórios de terceiros, **quero** que o plugin não escreva fora do sítio nem injete texto de terceiros no contexto, **para que** um repositório malicioso não me ataque através dele.
**Teste Independente:** testes com symlink em `.advogado-pt/`, perfil gigante com instruções, e resource com `..`.

#### Critérios de Aceitação (EARS)
1. **US-6.AC-1** — QUANDO o plugin grava perfis, prazos, perfil ativo ou calendários, O SISTEMA DEVE gravar no mesmo diretório de projeto que o hook lê (`CLAUDE_PROJECT_DIR`, senão o cwd), através de ficheiro temporário e renomeação, e preservar as linhas de `prazos.md` que não são prazos.

#### [SEC] Critérios de Aceitação (EARS)
10. **US-6.AC-10** — SE o caminho de destino ou a pasta `.advogado-pt` for um symlink ou junction, ENTÃO O SISTEMA DEVE recusar a escrita com uma mensagem clara e não tocar no alvo do link.
11. **US-6.AC-11** — O SISTEMA DEVE limitar o texto do perfil injetado pelo hook no início da sessão (cada campo até 200 caracteres, total até 1.500), retirar quebras de linha e marcá-lo como dados do utilizador, não instruções.
12. **US-6.AC-12** — SE um resource MCP for pedido com uma categoria desconhecida ou um nome com `..`, `/` ou `\`, ENTÃO O SISTEMA DEVE recusá-lo sem ler ficheiros fora de `content/`.
13. **US-6.AC-13** — QUANDO o hook é chamado através de symlink ou junction, O SISTEMA DEVE executar normalmente (deteção do ponto de entrada por caminho real).
14. **US-6.AC-14** — O SISTEMA NÃO DEVE pedir, guardar nem devolver segredos ou credenciais (tokens, palavras-passe, chaves): os ficheiros `.advogado-pt/` só guardam os campos do perfil e os prazos, e as respostas de erro das tools e do CLI mostram só a mensagem, sem stack trace nem caminhos internos do sistema.

### US-7 (P2): Entradas inválidas recusadas
**Como** utilizador do CLI ou das tools, **quero** que um erro de digitação dê uma mensagem clara, **para que** não receba um resultado errado com ar de certo.
**Teste Independente:** datas impossíveis, argumentos em falta e valores negativos no CLI e nas tools.

#### Critérios de Aceitação (EARS)
1. **US-7.AC-1** — SE uma tool ou o CLI receber uma data que não existe no calendário (ex.: 2026-02-30) ou num formato diferente de AAAA-MM-DD, ENTÃO O SISTEMA DEVE recusá-la nomeando o campo, em vez de a normalizar.
2. **US-7.AC-2** — SE um argumento obrigatório faltar ou um montante for negativo ou não numérico, ENTÃO O SISTEMA DEVE terminar com erro e código de saída diferente de 0, sem imprimir `NaN` nem `undefined`.
3. **US-7.AC-3** — O SISTEMA DEVE tratar erros em todas as tools com uma mensagem ao utilizador, sem exceção não tratada.
4. **US-7.AC-4** — QUANDO não é dada data de fim aos juros, O SISTEMA DEVE usar a data de hoje em Lisboa.

### US-8 (P1): Distribuição que funciona em todas as superfícies
**Como** quem instala o plugin (Claude Code, Desktop, claude.ai ou `.skill`), **quero** que tudo funcione à primeira, **para que** não fique com comandos partidos ou instruções cortadas.
**Teste Independente:** validar o plugin, gerar o `.skill`, ligar o servidor e correr `/diagnostico` numa instalação do marketplace.

#### Critérios de Aceitação (EARS)
1. **US-8.AC-1** — O SISTEMA DEVE ter a `description` da skill com no máximo 1024 caracteres e o `name` no padrão `^[a-z0-9-]{1,64}$`, e o `build.py` e os testes DEVEM falhar se não cumprir.
2. **US-8.AC-2** — O SISTEMA DEVE enviar como instruções do servidor MCP um texto de no máximo 2000 caracteres com o encaminhamento intenção → tool de todas as tools, mantendo a persona completa no prompt `advogado_pt` e no SKILL.md, com teste que falha acima do limite.
3. **US-8.AC-3** — O SISTEMA NÃO DEVE ter um command com o nome de um comando nativo do Claude Code; o `/doctor` do plugin DEVE passar a `/diagnostico`.
4. **US-8.AC-4** — O SISTEMA DEVE usar `${CLAUDE_PLUGIN_ROOT}` em todos os caminhos de ficheiros do plugin citados nos commands (diagnóstico e recurso a Python) e não pedir build numa instalação do marketplace.
5. **US-8.AC-5** — O SISTEMA DEVE gerar o `.skill` com a estrutura de pastas aceite no upload de claude.ai, e atualizar as dependências do servidor até não haver vulnerabilidades altas no `npm audit --omit=dev`.
6. **US-8.AC-6** — O SISTEMA DEVE ter um teste que falha se existir um diretório `bin/` na raiz e analisar também os `edits` do MultiEdit no hook PostToolUse.

### US-9 (P2): Paridade Python/TypeScript e cobertura de testes
**Como** quem mantém o plugin, **quero** que as duas implementações deem o mesmo resultado e que tudo tenha teste, **para que** um erro num lado não passe despercebido.
**Teste Independente:** correr o teste diferencial com casos partilhados nos dois lados.

#### Critérios de Aceitação (EARS)
1. **US-9.AC-1** — O SISTEMA DEVE arredondar ao cêntimo da mesma forma em Python e TypeScript (meio para cima) e devolver os mesmos textos no decisor de IVA, verificado por casos partilhados nos dois lados.
2. **US-9.AC-2** — O SISTEMA DEVE ter testes para `contarPrazo`, custas de injunção e Imposto do Selo nas heranças, e o smoke do servidor DEVE correr com `npm test`.
3. **US-9.AC-3** — SE um teste fixar um resultado juridicamente errado ENTÃO O SISTEMA DEVE substituí-lo por um caso de referência com fonte.

### US-10 (P3): Coerência e manutenção do conteúdo
**Como** utilizador de qualquer empresa e quem mantém o plugin, **quero** um conteúdo coerente, genérico e fácil de atualizar, **para que** as respostas sirvam qualquer perfil e a atualização anual não deixe valores velhos.
**Teste Independente:** procurar perfis fixos de ENI nas referências, montantes duplicados e personas das integrações.

#### Critérios de Aceitação (EARS)
1. **US-10.AC-1** — O SISTEMA NÃO DEVE assumir um perfil fixo (ENI de tecnologia) nas referências e checklists; o teste de perfil genérico DEVE abranger `references/` e `assets/checklists/`.
2. **US-10.AC-2** — O SISTEMA DEVE ter no SKILL.md uma tabela única cálculo → tool → script, uma tabela de encaminhamento situação → playbook → template, as regras de contagem de prazos e o que fazer em cada superfície (Claude Code, Desktop, claude.ai, `.skill`).
3. **US-10.AC-3** — O SISTEMA DEVE substituir os montantes duplicados fora do `valores-2026.md` por remissões e ter um teste que compara os montantes que ficarem com o `valores-2026.md`.
4. **US-10.AC-4** — O SISTEMA DEVE gerar as instruções das integrações (Codex, Gemini, Cursor, ChatGPT, AGENTS.md, GEMINI.md) a partir da mesma fonte que as instruções do servidor, com as tools da v1.2, e as contagens na documentação DEVEM bater com o repositório.
5. **US-10.AC-5** — O SISTEMA DEVE indicar nas secções `## Templates` das referências o nome do ficheiro quando o template existe e marcar "(a pedido)" quando não existe.

## Critérios de Sucesso (mensuráveis, agnósticos à tecnologia)
- **SC-001** — 100% dos achados críticos e importantes da revisão de 3/10/2026 ficam corrigidos ou marcados "(a confirmar)" com a fonte.
- **SC-002** — As calculadoras reproduzem ao cêntimo e ao dia os casos de referência com fonte (prazos, prescrição, IMT Jovem, IRS, injunção) em Python e TypeScript.
- **SC-003** — Pelo menos 30 factos de referência novos protegem as correções contra regressão.
- **SC-004** — O plugin passa o validador oficial e o `.skill` é aceite no upload de claude.ai.
- **SC-005** — Zero vulnerabilidades altas no `npm audit --omit=dev`.

## Casos Limite e Tratamento de Erros
- **EC-1** — Prazo judicial que começa dentro das férias judiciais: só começa a correr no 1.º dia depois delas.
- **EC-2** — Prazo judicial em processo urgente: corre em férias judiciais.
- **EC-3** — IMT Jovem com valor no escalão de isenção parcial: Imposto do Selo só sobre o excesso.
- **EC-4** — `prazos.md` editado à mão com notas: as notas mantêm-se depois de registar um prazo.
- **EC-5** — Pasta `.advogado-pt` que é um symlink: escrita recusada, alvo intacto.
- **EC-6** — Valor de rendas de 2027 ainda não publicado no DR: fica "(a confirmar)" com a fonte.

## Requisitos Não-Funcionais
- **NFR-1** — Nenhuma dependência nova; só atualização das existentes (SDK do MCP, transitivas).
- **NFR-2** — Versão 1.2.1 nos 6 sítios do bump (mais o `package-lock.json`), CHANGELOG, bundle e conteúdo regenerados, tags `v1.1.0`, `v1.2.0` e `v1.2.1`.
- **NFR-3** — `npm --prefix mcp-server test` e `python skills/advogado-pt/scripts/test_scripts.py` passam com 0 falhas; o validador oficial do plugin passa.
- **NFR-4** — O hook continua sem dependências e fail-open, com SessionStart abaixo de 300 ms.

## Fora de Âmbito
- Funcionalidades novas (faturação 2027, cobrança em lote, avaliações, subagentes, modo contabilista, .docx, .mcpb) e a renomeação: vão na 2.0.0.
- Reduzir as 312 marcas "(a confirmar)" por inteiro: só as que a revisão já confirmou e as dos achados corrigidos.
- Placeholders inconsistentes entre templates (uniformização vai na 2.0.0).

## Pressupostos
- As correções jurídicas seguem as fontes citadas na revisão; cada uma é reconfirmada em fonte oficial na tarefa que a aplica.
- A 1.2.1 chega a quem tem a 1.2.0 por `/plugin marketplace update` e atualização do plugin.

<!-- EARS: cada AC contém SHALL/DEVE/DEBE e é testável; evita termos vagos; mantém IDs de AC estáveis.
     Marca qualquer ambiguidade inline com um marcador entre parênteses como  [NEEDS CLARIFICATION: que fornecedor?] .
     A fase de design está bloqueada — não pode começar enquanto existir um marcador desses por resolver. -->
