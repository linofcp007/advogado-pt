# Jurídico PT — Skill de Assessoria Jurídica para Claude

Skill personalizada para o Claude atuar como assistente jurídico pessoal e empresarial em Portugal (não substitui advogado inscrito na Ordem dos Advogados) — para **qualquer empresa** (ENI, Unipessoal Lda, Lda, SA; qualquer setor e dimensão) e para particulares, adaptando-se ao **perfil da empresa** guardado no projeto.

## Disponível em todas as IAs

Além da Skill para Claude, o Jurídico PT corre como **servidor MCP** (`mcp-server/`), ligando-se a **Cursor, Windsurf, Codex, Gemini CLI e ChatGPT/OpenAI** — além de Claude. Um servidor único expõe as calculadoras (tools), as referências/templates (resources) e a persona (prompt). Guia completo em [INSTALL.md](INSTALL.md); configs por plataforma em [integrations/](integrations/).

```json
{ "mcpServers": { "juridico-pt": { "command": "node", "args": ["/CAMINHO/ABSOLUTO/juridico-pt/mcp-server/dist/index.js"] } } }
```

## Instalação

Há três formas de o usar no Claude. Escolhe pela app onde trabalhas:

| | **Plugin** (recomendado) | **Extensão `.mcpb`** | **Skill `.skill`** |
|---|---|---|---|
| Onde | Claude Code; conta claude.ai / app Claude (**Customize > Plugins**), sincronizado com o Claude Code | Conversas da app Claude Desktop, no computador onde a instalas | Claude.ai, Claude Desktop e Claude Code (sistema de Skills) |
| O que traz | Tudo: o conteúdo jurídico, as 38 tools (calculadoras, perfil, prazos, calendário, exportação `.docx`), os slash commands, os hooks (aviso de prazos e de atualidade ao abrir a sessão) e os subagentes | Só o servidor MCP: as 38 tools, o conteúdo como resources e o prompt `assistente_juridico` — sem commands, hooks nem subagentes | O conteúdo, as instruções e as calculadoras em Python (quando o Claude pode executar código) — sem as tools do servidor |
| Node.js | ≥ 18 no computador (servidor MCP e hooks) | Não é preciso: usa o que o Claude Desktop traz | Não é preciso |
| Atualizações | Automáticas, a partir deste repositório | À mão: instalar o `.mcpb` novo | À mão: carregar o `.skill` novo |

**Plugin no Claude Code:**

```text
/plugin marketplace add linofcp007/juridico-pt
/plugin install juridico-pt
```

Não é preciso compilar nada: o servidor MCP vem empacotado no plugin. Se alguma coisa não responder, corre `/diagnostico`.

**Plugin na conta claude.ai / app Claude:** em **Customize > Plugins > Add > Add marketplace**, indica `linofcp007/juridico-pt` e instala o `juridico-pt`. O Claude Code das tuas máquinas sincroniza-o no arranque seguinte como `juridico-pt@synced`.

**Extensão no Claude Desktop:**

1. Gera o pacote: `npm --prefix mcp-server run build:mcpb` → `dist/juridico-pt-<versão>.mcpb`
2. No Claude Desktop, **Definições → Extensões → Instalar extensão…** e escolhe o ficheiro.

Se as tools do `juridico-pt` já aparecem nas conversas do Desktop através do plugin da conta, a extensão é desnecessária (terias as mesmas tools em duplicado). Detalhes em [integrations/claude-desktop/](integrations/claude-desktop/).

**Skill** (Claude.ai / Claude Desktop):

1. Gera o pacote com `python build.py` (ou `./build.ps1`) → `juridico-pt.skill`
2. No Claude, **Settings → Skills** e faz upload do ficheiro

**Noutras IAs** (Cursor, Windsurf, Codex, Gemini, ChatGPT): ver [INSTALL.md](INSTALL.md) e [integrations/](integrations/), ou corre `node cli/juridico-pt.mjs mcp-config <host>`.

### Vinhas do `advogado-pt`?

A 2.0 mudou de nome e não migra nada sozinha. Troca a instalação conforme a tinhas:

- **Marketplace no Claude Code:**

  ```text
  /plugin uninstall advogado-pt@advogado-pt-marketplace
  /plugin marketplace remove advogado-pt-marketplace
  /plugin marketplace add linofcp007/juridico-pt
  /plugin install juridico-pt@juridico-pt
  ```

- **Na conta claude.ai / app Claude** (no Claude Code aparece como `advogado-pt@synced`): em **Customize > Plugins**, remove o `advogado-pt`, adiciona o marketplace `linofcp007/juridico-pt` (**Add > Add marketplace**) e instala o `juridico-pt`. A troca vale para todas as tuas máquinas.
- **Só no Claude Code de um computador**, sem mexer na conta (num terminal):

  ```text
  claude plugin disable advogado-pt@synced
  claude plugin marketplace add linofcp007/juridico-pt
  claude plugin install juridico-pt@juridico-pt
  ```

Em qualquer dos casos, renomeia à mão a pasta de dados `.advogado-pt/` para `.juridico-pt/` em cada projeto (e `~/.advogado-pt/` para `~/.juridico-pt/`).

**Vindo de uma 1.0.x**, nota ainda que o diagnóstico do plugin se chama agora `/diagnostico` (o nome antigo, doctor, é um comando do próprio Claude Code) e que o perfil deixou de estar escrito no plugin: grava-o uma vez com `/perfil geral …` e fica em `~/.juridico-pt/perfil-empresa.md` para todos os projetos. Nenhuma tool, template, referência ou command da 1.0.x desapareceu. Detalhes no [CHANGELOG](CHANGELOG.md).

### Comandos (slash commands)

`/advogado` · `/parecer` · `/cobrar` · `/faturacao` · `/painel` · `/exportar` · `/contrato` · `/prazo` · `/prazos` · `/calendario` · `/juros` · `/imt` · `/defesa` · `/rgpd` · `/despedir` · `/salario` · `/irc` · `/compliance` · `/citacao` · `/sociedade` · `/comprar-imovel` · `/herancas` · `/arrendamento` · `/fisco` · `/insolvencia` · `/perfil` · `/template` · `/referencia` · `/procurar` (+ `/adv`, `/intake`, `/prescricao`, `/diagnostico`).

## Estrutura

```text
juridico-pt/                     # plugin Claude Code
├── .claude-plugin/             # plugin.json + marketplace.json
├── .mcp.json                   # servidor MCP (${CLAUDE_PLUGIN_ROOT})
├── commands/        (33)       # slash commands (/advogado, /cobrar, /calendario, /painel, /exportar…)
├── agents/                     # subagentes só de leitura: verificador-citacoes, revisor-contratos
├── hooks/                      # hooks.json + juridico-hook.mjs (SessionStart/PostToolUse)
├── cli/juridico-pt.mjs         # CLI universal (mcp-config + calc + calendario + prazos + painel + exportar + atualidade + prompt + doctor)
├── skills/juridico-pt/         # a skill (conteúdo jurídico)
│   ├── SKILL.md                # lógica, fluxo, protocolos de rigor
│   ├── references/   (36)      # ⭐ valores-2026.md = ponto único de verdade
│   ├── assets/templates/  (72) # documentos com {{...}}, [VERIFICAR] e "Antes de enviar"
│   ├── assets/checklists/ (12)
│   ├── playbooks/    (14)      # árvores de decisão
│   └── scripts/      (15)      # calculadoras Python + testes
├── mcp-server/                 # servidor MCP TypeScript (38 tools + resources + prompt); build:mcpb → extensão .mcpb
├── evals/                      # 53 casos para o `claude plugin eval` (golden, adversariais, regressão)
├── integrations/               # configs por plataforma (Claude Desktop, Cursor, Windsurf, Codex, Gemini, ChatGPT)
├── .cursor/ .windsurf/ .gemini/ .vscode/   # dotfiles de editor (dogfooding)
├── AGENTS.md · GEMINI.md · CLAUDE.md        # persona portátil + manutenção
├── build.py · build.ps1        # empacota a .skill
└── LICENSE · CHANGELOG.md · CONTRIBUTING.md · SECURITY.md · glama.json
```

## Áreas Cobertas

- **Empresarial**: contratos TI/SaaS, contratos internacionais, cobranças, insolvência/PER (como devedor e como credor), societário, garantias e crédito, laboral, fiscal, **contencioso tributário** (`contencioso-tributario`), **bancário e serviços financeiros** (`bancario`), **concorrência** (`concorrencia`), **direito da UE para empresas** (`uniao-europeia`), **compliance por dimensão** (`compliance`: RGPC, canal de denúncias), **IVA internacional** (`iva-internacional`), **licenciamento setorial** (`licenciamento-setorial`: AL, restauração, construção, transportes, mediação imobiliária), RGPD, regulação digital UE (AI Act/NIS2/CRA), propriedade intelectual, consumo/e-commerce, contratação pública, seguros
- **Pessoal**: imobiliário (compra/venda), arrendamento, família e regimes de bens, heranças, sucessões internacionais, IRS, multas e contraordenações
- **Transversal**: contencioso civil e ADR, penal económico e cibercrime, estrangeiros e imigração, glossário PT↔EN

## O que esta skill faz de diferente

- **Perfil da empresa guardado**: `.juridico-pt/perfil-empresa.md` no projeto (ou o perfil geral em `~/.juridico-pt/`) — carregado no início de cada sessão; pergunta só o que falta. **Vários perfis** para contabilistas e consultores (`ativar_perfil`).
- **Calendário de obrigações** a partir do perfil (IVA, Modelo 22, IES, SS, contas, RCBE, Relatório Único, RGPC…), com base legal por data e exportação `.ics` para Google Calendar/Outlook (`/calendario`).
- **Prazos em curso** guardados no projeto, com aviso ao abrir a sessão (`/prazos`).
- **Templates reais** (72), não promessas: cada documento parte de um esqueleto, declara o **âmbito** (nacional / UE / misto) e termina com a lista **"Antes de enviar — verificar"** (prazos ⏰, forma de envio, normas a confirmar).
- **Playbooks** (14): árvores de decisão que transformam conhecimento em ação guiada (cliente não paga, citação, despedir, despedimento coletivo, lay-off, data breach, comprar imóvel, notificação das Finanças, cliente insolvente, faturar ao estrangeiro, fechar a empresa, faturação eletrónica 2027, pedido de devolução de apoio, vender ao Estado).
- **Checklists** (12): verificação acionável (RGPD, due diligence, constituição, contrato, pré-deploy, registo de marca, loja online, concorrência, compliance por dimensão, segurança e saúde no trabalho, faturação, NIS2).
- **Calculadoras** (15, Python + TypeScript, com testes): juros **por tramos semestrais com memória de cálculo** (também em lote, várias faturas), prazos, **procedimento de contratação pública** (CCP), compensação (**regime transitório por períodos**, validada contra o simulador da ACT), créditos laborais, **salário líquido e custo do trabalhador**, **IRC** (PME, derramas, tributação autónoma), **decisor de IVA internacional**, **taxa de justiça**, custas de injunção, imposto de selo, IMT, prescrição, IRS simplificado, legítima.
- **Factos de referência** (`mcp-server/test/factos.json`): perguntas jurídicas verificadas, testadas a cada build para que um erro corrigido não volte.
- **Exportar como prompt** para qualquer IA: `node cli/juridico-pt.mjs prompt <template>`.
- **Ponto único de verdade** para valores (`skills/juridico-pt/references/valores-2026.md`) — sem números desatualizados espalhados.
- **Protocolos de rigor**: anti-alucinação de citações e anti-desatualização de valores (ver SKILL.md).

## Empacotamento e qualidade

Para desenvolver a partir de um clone precisas de **Node.js ≥ 18** e **Python 3** (para o `build.py` e os testes das calculadoras). Num computador novo, `npm run setup` instala as dependências, compila o servidor MCP e corre o diagnóstico.

```powershell
npm run setup                                        # bootstrap: dependências + build do MCP + doctor
python build.py                                      # gera juridico-pt.skill
npm --prefix mcp-server run build:mcpb               # gera dist/juridico-pt-<versão>.mcpb (Claude Desktop)
python skills/juridico-pt/scripts/test_scripts.py    # testes das calculadoras Python
cd mcp-server; npm test                              # calculadoras TS + estrutura do plugin + smoke
```

`build.py`/`build.ps1` empacotam `skills/juridico-pt/` (excluem `__pycache__`, `.pyc`, `.git`, `.skill`). Os dois testes externos (`npm audit` e `claude plugin validate`) só correm com `JURIDICO_PT_TESTES_EXTERNOS=1` e precisam do CLI `claude` no PATH.

## Exemplo trabalhado

**Caso:** uma Lda de distribuição tem uma fatura de 5.000 € vencida a 1 de janeiro de 2025 e o cliente (outra empresa) não paga.

1. `/cobrar` → o playbook `cliente-nao-paga` pergunta o que falta e lembra que a carta de cobrança **não interrompe a prescrição** (só a citação/notificação judicial ou o reconhecimento da dívida).
2. Juros com `calc_juros_mora` (`capital: 5000`, `data_inicio: 2025-01-01`, `data_fim: 2026-01-01`, `tipo: comercial`) → memória de cálculo por tramos:
   ```text
   - 2025-01-01 a 2025-07-01: 181 dias × 11,15% = 276,46 €  [Aviso n.º 1278/2025/2]
   - 2025-07-01 a 2026-01-01: 184 dias × 10,15% = 255,84 €  [Aviso n.º 16792/2025/2]
   Juros: 532,29 € · acresce a indemnização de 40,00 € (art. 7.º DL 62/2013)
   ```
3. Documento com `obter_template` → `carta-cobranca-formal-registada`: preenche os `{{CAMPOS}}`, inclui o parágrafo opcional dos 40 € (é B2B) e anexa a memória de cálculo.
4. O assistente entrega, **separada** da carta, a lista "Antes de enviar — verificar" (prazo da interpelação, carta registada com AR, prescrição, juros por tramos).
5. Sem pagamento → `calc_custas_injuncao` + template `requerimento-injuncao`.

## Perfil da empresa

O assistente não assume quem és. Guarda o perfil (forma jurídica, setor, n.º de trabalhadores, volume de negócios, IVA, clientes…) em:

- `<projeto>/.juridico-pt/perfil-empresa.md` — a empresa deste projeto (tem prioridade);
- `~/.juridico-pt/perfil-empresa.md` — o perfil geral, usado em qualquer pasta sem perfil próprio.

Vê ou atualiza com `/perfil` (ou as tools `obter_perfil_empresa` / `guardar_perfil_empresa`). É um ficheiro de texto, editável à mão; não guarda dados de trabalhadores nem de clientes.

**Vários perfis** (contabilista com muitos clientes): grava cada empresa com um nome (`perfis/<nome>.md`) e escolhe a ativa com `ativar_perfil`; o hook, as respostas e o calendário passam a usar essa.

**Modo contabilista**: `/painel` (tool `painel_clientes`) mostra num só pedido as obrigações e os prazos dos próximos 30 dias de todos os clientes; os prazos podem ser associados a um perfil e o calendário exporta um `.ics` por cliente.

## Privacidade e dados guardados

- **Que dados e onde:** só ficheiros de texto no teu computador, na pasta `.juridico-pt/` do projeto (perfil, perfis de clientes, `prazos.md`, calendários `.ics`, documentos exportados) e em `~/.juridico-pt/` (perfil geral). O plugin não tem servidores, não envia estes ficheiros a ninguém e não tem telemetria.
- **Por quanto tempo:** os prazos cumpridos com data-limite há mais de **12 meses** saem na escrita seguinte; perfis, calendários e documentos ficam até os apagares; um perfil sem atualização há mais de 12 meses é assinalado no início da sessão.
- **Apagar:** `apagar_perfil` apaga um perfil e os prazos e calendários dele; para apagar tudo, apaga as pastas `.juridico-pt/`. Num repositório git, o plugin avisa se o `.gitignore` não exclui `.juridico-pt/`.
- **Conversas:** o conteúdo das conversas é tratado pelo **fornecedor do modelo** que escolheste (ex.: a Anthropic no Claude), nos termos que aceitaste com ele — não pelo plugin.

Detalhes em [`references/privacidade-plugin.md`](skills/juridico-pt/references/privacidade-plugin.md).

## Manutenção

Os valores legais mudam — ver `CLAUDE.md` para o guia completo. Pontos de revisão:
- **Janeiro** (pós-OE): IRC, IRS, IAS, salário mínimo, deduções, IMT/IMI
- **Janeiro e julho**: juros de mora comerciais do semestre (aviso da ETF) — acrescentar a linha em `juros_mora.py` **e** `juros.ts`
- **Outubro**: coeficiente de atualização de rendas (INE)

## Changelog

> Histórico formal (SemVer) em [CHANGELOG.md](CHANGELOG.md). Resumo da evolução:

- **v2.0.1 (2026-10)**: o CLI (`calc`, `calendario`, `prazos`, `painel`, `exportar`, `atualidade`) e o `/diagnostico` funcionam no plugin instalado pelo marketplace (bundle versionado `dist/cli-lib.js`); documentação de instalação (plugin, extensão `.mcpb` ou skill) e de migração revista.
- **v2.0.0 (2026-10)**: passa a chamar-se **juridico-pt** e apresenta-se como **assistente jurídico** (repositório renomeado para github.com/linofcp007/juridico-pt; dados em `.juridico-pt/`); faturação eletrónica 2027, cobrança em lote e PEPEX, contratação pública (limiares do DL 177/2026), NIS2, fundos europeus, 5 templates do dia a dia; **modo contabilista** (`/painel`, prazos e `.ics` por perfil); exportação `.docx`, extensão `.mcpb` para o Claude Desktop e perfil por formulário; aviso de atualidade dos valores; subagentes `verificador-citacoes` e `revisor-contratos`; privacidade (`apagar_perfil`, conservação de 12 meses); 53 casos de avaliação.
- **v1.2.1 (2026-10)**: correções da revisão completa — prazos judiciais, prescrição, impostos e conteúdo jurídico reconfirmados em fonte; escrita de ficheiros e hook endurecidos; distribuição alinhada com o Claude Code e o claude.ai.
- **v1.2.0 (2026-10)**: plugin operacional — calendário de obrigações a partir do perfil com `.ics`, prazos em curso com aviso, vários perfis, calculadoras de salário líquido, custo do trabalhador, IRC, IVA internacional e taxa de justiça; + compliance, IVA internacional e licenciamento setorial; + 17 templates; o diagnóstico do plugin passa a `/diagnostico`.
- **v1.1.0 (2026-10)**: para **qualquer empresa** — perfil da empresa guardado (projeto/geral), persona genérica; juros por tramos semestrais com memória de cálculo e taxas do 2.º sem. 2026; correção da carta de cobrança (não interrompe a prescrição) e de 7 outros erros jurídicos; todos os templates com âmbito e "Antes de enviar — verificar"; + contencioso tributário, bancário, concorrência e UE; + 17 templates, 2 playbooks, 3 checklists; + calculadoras de créditos laborais e legítima; `/fisco`, `/insolvencia`, `/perfil`; `cli prompt`.

- **v7 (2026-06)**: convertido em **plugin Claude Code** — `.claude-plugin/` (marketplace), 22 slash commands, hooks (SessionStart/PostToolUse), CLI `cli/` (`mcp-config`/`calc`/`doctor`), dotfiles de editor e `AGENTS.md`/`GEMINI.md` na raiz, governance (LICENSE/CONTRIBUTING/SECURITY/glama), conteúdo reestruturado para `skills/juridico-pt/`, teste de estrutura do plugin. Publicado em github.com/linofcp007/advogado-pt (hoje juridico-pt).
- **v6 (2026-06)**: distribuição multi-plataforma — servidor **MCP** em TypeScript (`mcp-server/`) com as 8 calculadoras portadas (18 testes + smoke end-to-end), conteúdo jurídico como resources e persona como prompt; manifestos para Claude Code (plugin), Claude Desktop, Cursor, Windsurf, Gemini CLI, Codex e ChatGPT em [integrations/](integrations/); guia [INSTALL.md](INSTALL.md). O pacote `.skill` exclui agora `mcp-server/` e `integrations/`.
- **v5 (2026-06)**: revisão completa de QA — corrigidos 9 defeitos (custas de injunção desatualizadas, link da Plataforma ODR extinta, IRC 17%/21% residual, placeholder partido, "Modelo 2 do IMT"→Selo, etc.); + 5 templates nucleares (injunção, cookie policy, contrato a termo certo, despedimento com justa causa, livrança); emolumentos centralizados em valores-2026.md; "(a confirmar)" da LCS/Haia confirmados; nota mitigadora nas secções "## Templates" das referências (28 templates).
- **v4 (2026-06)**: + áreas penal/cibercrime, contencioso, contratação pública, sucessões internacionais, estrangeiros, garantias (26 referências); + pasta `playbooks/` (5 árvores de decisão); + `assets/checklists/` (5); + calculadoras IMT/prescrição/IRS simplificado e `test_scripts.py` (18 testes); + templates intake e parecer; + `CLAUDE.md` e `.gitignore`; tabela IMT 2026 no ficheiro central; correção do laboral.md (compensação 12→14 dias).
- **v3 (2026-06)**: + imobiliário, família, seguros, glossário PT↔EN; + CPCV e participação de sinistro; + `build.py`/`build.ps1`; valores IMT/IMI/IS.
- **v2 (2026-06)**: + ficheiro central de valores 2026; + templates reais; + calculadoras; + societário, insolvência, contratos internacionais, digital UE; RGPD com IA; protocolos de rigor; correção do IRC (15%/19%).
- **v1**: versão inicial — SKILL.md + 11 referências.

## Aviso Legal

Orientação informativa baseada na legislação portuguesa. Para ações judiciais formais ou situações de elevada complexidade, recomenda-se validação por advogado inscrito na Ordem dos Advogados.

## Licença

MIT — ver [LICENSE](LICENSE).
