# Advogado PT — Skill de Assessoria Jurídica para Claude

Skill personalizada para o Claude atuar como advogado pessoal e empresarial em Portugal — para **qualquer empresa** (ENI, Unipessoal Lda, Lda, SA; qualquer setor e dimensão) e para particulares, adaptando-se ao **perfil da empresa** guardado no projeto.

## Disponível em todas as IAs

Além da Skill para Claude, o Advogado PT corre como **servidor MCP** (`mcp-server/`), ligando-se a **Cursor, Windsurf, Codex, Gemini CLI e ChatGPT/OpenAI** — além de Claude. Um servidor único expõe as calculadoras (tools), as referências/templates (resources) e a persona (prompt). Guia completo em [INSTALL.md](INSTALL.md); configs por plataforma em [integrations/](integrations/).

```json
{ "mcpServers": { "advogado-pt": { "command": "node", "args": ["/CAMINHO/ABSOLUTO/advogado-pt/mcp-server/dist/index.js"] } } }
```

## Instalação

**Como plugin Claude Code** (recomendado — traz comandos, hooks e MCP):

```text
/plugin marketplace add linofcp007/advogado-pt
/plugin install advogado-pt
```

Depois, no repositório, **uma vez**: `npm run setup` (instala + compila o servidor MCP e corre o diagnóstico).

**Como Skill** (Claude.ai / Claude Desktop):

1. Gera o pacote com `python build.py` (ou `./build.ps1`) → `advogado-pt.skill`
2. No Claude, **Settings → Skills** e faz upload do ficheiro

**Noutras IAs** (Cursor, Windsurf, Codex, Gemini, ChatGPT): ver [INSTALL.md](INSTALL.md) e [integrations/](integrations/), ou corre `node cli/advogado-pt.mjs mcp-config <host>`.

### Comandos (slash commands)

`/advogado` · `/parecer` · `/cobrar` · `/contrato` · `/prazo` · `/juros` · `/imt` · `/defesa` · `/rgpd` · `/despedir` · `/citacao` · `/sociedade` · `/comprar-imovel` · `/herancas` · `/arrendamento` · `/fisco` · `/insolvencia` · `/perfil` · `/template` · `/referencia` · `/procurar` (+ `/adv`, `/intake`, `/prescricao`, `/doctor`).

## Estrutura

```text
advogado-pt/                     # plugin Claude Code
├── .claude-plugin/             # plugin.json + marketplace.json
├── .mcp.json                   # servidor MCP (${CLAUDE_PLUGIN_ROOT})
├── commands/        (25)       # slash commands (/advogado, /cobrar, /fisco, /perfil, /doctor…)
├── hooks/                      # hooks.json + advogado-hook.mjs (SessionStart/PostToolUse)
├── cli/advogado-pt.mjs         # CLI universal (mcp-config + calc + prompt + doctor)
├── skills/advogado-pt/         # a skill (conteúdo jurídico)
│   ├── SKILL.md                # lógica, fluxo, protocolos de rigor
│   ├── references/   (30)      # ⭐ valores-2026.md = ponto único de verdade
│   ├── assets/templates/  (45) # documentos com {{...}}, [VERIFICAR] e "Antes de enviar"
│   ├── assets/checklists/ (8)
│   ├── playbooks/    (7)       # árvores de decisão
│   └── scripts/      (10)      # calculadoras Python + testes
├── mcp-server/                 # servidor MCP TypeScript (21 tools + resources + prompt)
├── integrations/               # configs por plataforma (Cursor, Windsurf, Codex, Gemini, ChatGPT)
├── .cursor/ .windsurf/ .gemini/ .vscode/   # dotfiles de editor (dogfooding)
├── AGENTS.md · GEMINI.md · CLAUDE.md        # persona portátil + manutenção
├── build.py · build.ps1        # empacota a .skill
└── LICENSE · CHANGELOG.md · CONTRIBUTING.md · SECURITY.md · glama.json
```

## Áreas Cobertas

- **Empresarial**: contratos TI/SaaS, contratos internacionais, cobranças, insolvência/PER (como devedor e como credor), societário, garantias e crédito, laboral, fiscal, **contencioso tributário** (`contencioso-tributario`), **bancário e serviços financeiros** (`bancario`), **concorrência** (`concorrencia`), **direito da UE para empresas** (`uniao-europeia`), RGPD, regulação digital UE (AI Act/NIS2/CRA), propriedade intelectual, consumo/e-commerce, contratação pública, seguros
- **Pessoal**: imobiliário (compra/venda), arrendamento, família e regimes de bens, heranças, sucessões internacionais, IRS, multas e contraordenações
- **Transversal**: contencioso civil e ADR, penal económico e cibercrime, estrangeiros e imigração, glossário PT↔EN

## O que esta skill faz de diferente

- **Perfil da empresa guardado**: `.advogado-pt/perfil-empresa.md` no projeto (ou o perfil geral em `~/.advogado-pt/`) — carregado no início de cada sessão; pergunta só o que falta.
- **Templates reais** (45), não promessas: cada documento parte de um esqueleto, declara o **âmbito** (nacional / UE / misto) e termina com a lista **"Antes de enviar — verificar"** (prazos ⏰, forma de envio, normas a confirmar).
- **Playbooks** (7): árvores de decisão que transformam conhecimento em ação guiada (cliente não paga, citação, despedir, data breach, comprar imóvel, notificação das Finanças, cliente insolvente).
- **Checklists** (8): verificação acionável (RGPD, due diligence, constituição, contrato, pré-deploy, registo de marca, loja online, concorrência).
- **Calculadoras** (10, Python + TypeScript, com testes): juros **por tramos semestrais com memória de cálculo**, prazos, compensação, **créditos laborais na cessação**, custas, imposto de selo, IMT, prescrição, IRS simplificado, **legítima**.
- **Exportar como prompt** para qualquer IA: `node cli/advogado-pt.mjs prompt <template>`.
- **Ponto único de verdade** para valores (`skills/advogado-pt/references/valores-2026.md`) — sem números desatualizados espalhados.
- **Protocolos de rigor**: anti-alucinação de citações e anti-desatualização de valores (ver SKILL.md).

## Empacotamento e qualidade

```powershell
python build.py                                      # gera advogado-pt.skill
python skills/advogado-pt/scripts/test_scripts.py    # testes das calculadoras Python
cd mcp-server; npm test                              # calculadoras TS + estrutura do plugin
```

`build.py`/`build.ps1` empacotam `skills/advogado-pt/` (excluem `__pycache__`, `.pyc`, `.git`, `.skill`).

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

O advogado não assume quem és. Guarda o perfil (forma jurídica, setor, n.º de trabalhadores, volume de negócios, IVA, clientes…) em:

- `<projeto>/.advogado-pt/perfil-empresa.md` — a empresa deste projeto (tem prioridade);
- `~/.advogado-pt/perfil-empresa.md` — o perfil geral, usado em qualquer pasta sem perfil próprio.

Vê ou atualiza com `/perfil` (ou as tools `obter_perfil_empresa` / `guardar_perfil_empresa`). É um ficheiro de texto, editável à mão; não guarda dados de trabalhadores nem de clientes.

## Manutenção

Os valores legais mudam — ver `CLAUDE.md` para o guia completo. Pontos de revisão:
- **Janeiro** (pós-OE): IRC, IRS, IAS, salário mínimo, deduções, IMT/IMI
- **Janeiro e julho**: juros de mora comerciais do semestre (aviso da ETF) — acrescentar a linha em `juros_mora.py` **e** `juros.ts`
- **Outubro**: coeficiente de atualização de rendas (INE)

## Changelog

> Histórico formal (SemVer) em [CHANGELOG.md](CHANGELOG.md). Resumo da evolução:

- **v1.1.0 (2026-10)**: para **qualquer empresa** — perfil da empresa guardado (projeto/geral), persona genérica; juros por tramos semestrais com memória de cálculo e taxas do 2.º sem. 2026; correção da carta de cobrança (não interrompe a prescrição) e de 7 outros erros jurídicos; todos os templates com âmbito e "Antes de enviar — verificar"; + contencioso tributário, bancário, concorrência e UE; + 17 templates, 2 playbooks, 3 checklists; + calculadoras de créditos laborais e legítima; `/fisco`, `/insolvencia`, `/perfil`; `cli prompt`.

- **v7 (2026-06)**: convertido em **plugin Claude Code** — `.claude-plugin/` (marketplace), 22 slash commands, hooks (SessionStart/PostToolUse), CLI `cli/` (`mcp-config`/`calc`/`doctor`), dotfiles de editor e `AGENTS.md`/`GEMINI.md` na raiz, governance (LICENSE/CONTRIBUTING/SECURITY/glama), conteúdo reestruturado para `skills/advogado-pt/`, teste de estrutura do plugin. Publicado em github.com/linofcp007/advogado-pt.
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
