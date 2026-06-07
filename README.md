# Advogado PT — Skill de Assessoria Jurídica para Claude

Skill personalizada para o Claude atuar como advogado pessoal e empresarial em Portugal.

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

**Noutras IAs** (Cursor, Windsurf, Codex, Gemini, ChatGPT): ver [INSTALL.md](INSTALL.md) e [integrations/](integrations/), ou corre `node bin/advogado-pt.mjs mcp-config <host>`.

### Comandos (slash commands)

`/advogado` · `/parecer` · `/cobrar` · `/contrato` · `/prazo` · `/juros` · `/imt` · `/defesa` · `/rgpd` · `/despedir` · `/citacao` · `/sociedade` · `/comprar-imovel` · `/template` · `/referencia` · `/procurar` (+ `/adv`, `/intake`, `/prescricao`).

## Estrutura

```text
advogado-pt/                     # plugin Claude Code
├── .claude-plugin/             # plugin.json + marketplace.json
├── .mcp.json                   # servidor MCP (${CLAUDE_PLUGIN_ROOT})
├── commands/        (22)       # slash commands (/advogado, /cobrar, /imt, /doctor…)
├── hooks/                      # hooks.json + advogado-hook.mjs (SessionStart/PostToolUse)
├── bin/advogado-pt.mjs         # CLI universal (mcp-config + calc + doctor)
├── skills/advogado-pt/         # a skill (conteúdo jurídico)
│   ├── SKILL.md                # lógica, fluxo, protocolos de rigor
│   ├── references/   (26)      # ⭐ valores-2026.md = ponto único de verdade
│   ├── assets/templates/  (28) # documentos com placeholders {{...}}
│   ├── assets/checklists/ (5)
│   ├── playbooks/    (5)       # árvores de decisão
│   └── scripts/      (9)       # calculadoras Python + testes (18)
├── mcp-server/                 # servidor MCP TypeScript (17 tools + resources + prompt)
├── integrations/               # configs por plataforma (Cursor, Windsurf, Codex, Gemini, ChatGPT)
├── .cursor/ .windsurf/ .gemini/ .vscode/   # dotfiles de editor (dogfooding)
├── AGENTS.md · GEMINI.md · CLAUDE.md        # persona portátil + manutenção
├── build.py · build.ps1        # empacota a .skill
└── LICENSE · CHANGELOG.md · CONTRIBUTING.md · SECURITY.md · glama.json
```

## Áreas Cobertas

- **Empresarial**: contratos TI/SaaS, contratos internacionais, cobranças, insolvência/PER, societário, garantias e crédito, laboral, fiscal, RGPD, regulação digital UE (AI Act/NIS2/CRA), propriedade intelectual, consumo, contratação pública, seguros
- **Pessoal**: imobiliário (compra/venda), arrendamento, família e regimes de bens, heranças, sucessões internacionais, IRS, multas e contraordenações
- **Transversal**: contencioso civil e ADR, penal económico e cibercrime, estrangeiros e imigração, glossário PT↔EN

## O que esta skill faz de diferente

- **Templates reais** (28), não promessas: cada documento parte de um esqueleto.
- **Playbooks** (5): árvores de decisão que transformam conhecimento em ação guiada.
- **Checklists** (5): verificação acionável (RGPD, due diligence, constituição, contrato, pré-deploy).
- **Calculadoras** (8 + testes): juros, prazos, compensação, custas, imposto de selo, **IMT**, prescrição, IRS simplificado.
- **Ponto único de verdade** para valores (`skills/advogado-pt/references/valores-2026.md`) — sem números desatualizados espalhados.
- **Protocolos de rigor**: anti-alucinação de citações e anti-desatualização de valores (ver SKILL.md).

## Empacotamento e qualidade

```powershell
python build.py                                      # gera advogado-pt.skill
python skills/advogado-pt/scripts/test_scripts.py    # testes das calculadoras Python (18)
cd mcp-server; npm test                              # calculadoras TS + estrutura do plugin
```

`build.py`/`build.ps1` empacotam `skills/advogado-pt/` (excluem `__pycache__`, `.pyc`, `.git`, `.skill`).

## Perfil

- Atividade: Tecnologia, Software, Retalho, Serviços, Consultoria
- Forma jurídica: ENI (com suporte para transição a Unipessoal Lda)
- Localização: Portugal (várias zonas / remoto) · Línguas: PT + EN
- Tom: formal nos documentos, prático na estratégia

## Manutenção

Os valores legais mudam — ver `CLAUDE.md` para o guia completo. Pontos de revisão:
- **Janeiro** (pós-OE): IRC, IRS, IAS, salário mínimo, deduções, IMT/IMI
- **Julho**: juros de mora comerciais do 2.º semestre (aviso da ETF)
- **Outubro**: coeficiente de atualização de rendas (INE)

## Changelog

> Histórico formal (SemVer) em [CHANGELOG.md](CHANGELOG.md). Resumo da evolução:

- **v7 (2026-06)**: convertido em **plugin Claude Code** — `.claude-plugin/` (marketplace), 22 slash commands, hooks (SessionStart/PostToolUse), CLI `bin/` (`mcp-config`/`calc`/`doctor`), dotfiles de editor e `AGENTS.md`/`GEMINI.md` na raiz, governance (LICENSE/CONTRIBUTING/SECURITY/glama), conteúdo reestruturado para `skills/advogado-pt/`, teste de estrutura do plugin. Publicado em github.com/linofcp007/advogado-pt.
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
