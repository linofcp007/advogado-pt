# Contribuir para o juridico-pt

Obrigado por ajudar a melhorar este plugin. O `juridico-pt` é, ao mesmo tempo, uma **skill** de
assessoria jurídica de Portugal, um **servidor MCP** e um **plugin do Claude Code**. Algumas regras
mantêm-no coerente e rigoroso — respeita-as em cada alteração.

## Estrutura do repositório

```text
juridico-pt/
├── skills/juridico-pt/   # A skill: SKILL.md, references/, assets/templates/, assets/checklists/,
│                         #   playbooks/, scripts/ (calculadoras Python) — a fonte de verdade do conteúdo
├── mcp-server/           # Servidor MCP em TypeScript (src/, test/, scripts/bundle-content.mjs → content/)
├── commands/             # Slash commands do plugin do Claude Code
├── agents/               # Subagentes só de leitura (verificador-citacoes, revisor-contratos)
├── hooks/                # Hooks locais do plugin (hooks.json + juridico-hook.mjs)
├── cli/                  # CLI / entry point (cli/juridico-pt.mjs)
├── evals/                # Casos para o `claude plugin eval`
├── integrations/         # Configs por plataforma (Cursor, Windsurf, Gemini, Codex, ChatGPT, Claude)
└── .claude-plugin/       # plugin.json + marketplace.json
```

## Requisitos

- **Node.js ≥ 18** (servidor MCP, CLI, hooks e testes).
- **Python 3** (`build.py` e testes das calculadoras em `skills/juridico-pt/scripts/`).
- Opcional: o CLI **`claude`** no PATH, para os testes externos (`JURIDICO_PT_TESTES_EXTERNOS=1`: `npm audit` e `claude plugin validate`).

Num computador novo, `npm run setup` na raiz instala as dependências, compila o servidor MCP e corre o diagnóstico.

## Construir o pacote `.skill`

A partir da raiz:

```bash
python build.py            # gera juridico-pt.skill (exclui mcp-server/ e integrations/)
```

## Construir e testar o servidor MCP

```bash
cd mcp-server
npm ci                     # dependências (respeita o package-lock.json)
npm run build              # empacota o conteúdo da skill em content/ + compila → dist/
npm test                   # build + todos os testes (node --test) + smoke por MCP
npm run build:mcpb         # build + extensão ../dist/juridico-pt-<versão>.mcpb (Claude Desktop)
```

O conteúdo jurídico é **o mesmo da skill**: ao mudar `skills/juridico-pt/` ou `mcp-server/src/`, corre
`npm run build` no `mcp-server/` e faz commit de `mcp-server/dist/index.js`, `mcp-server/dist/cli-lib.js` e
`mcp-server/content/` regenerados — o plugin instalado pelo marketplace usa-os tal como estão no repositório.

## Versionamento

Ao subir a versão, faz o bump **em simultâneo** em todos estes sítios, para não dessincronizar:

1. `.claude-plugin/plugin.json` (`version`)
2. `.claude-plugin/marketplace.json` (`metadata.version` **e** `plugins[0].version`)
3. `package.json` da raiz (`version`)
4. `mcp-server/package.json` (`version`)
5. `mcp-server/src/index.ts` (versão reportada pelo servidor)
6. `CHANGELOG.md` (nova entrada no formato Keep a Changelog + SemVer)

Depois, `npm run build` no `mcp-server/` e commit dos bundles `mcp-server/dist/index.js` e `mcp-server/dist/cli-lib.js` regenerados.

## Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`,
`refactor:`, `test:`. Mantém os commits pequenos e focados.

## Rigor jurídico (regra inviolável)

- **Não inventar.** Nunca inventes números de artigos, diplomas ou jurisprudência. Em caso de dúvida,
  marca `(a confirmar)` e verifica em [dre.pt](https://dre.pt) / [dgsi.pt](https://www.dgsi.pt).
- **Valores num só sítio.** Todos os montantes, taxas, limiares e prazos vivem em
  `skills/juridico-pt/references/valores-2026.md`. As outras referências **remetem** para lá — não
  repetem números. Ao corrigir um valor, atualiza também a "Última atualização" no topo desse ficheiro.
- **Estilo da casa.** Mantém o estilo consistente das referências (ver `CLAUDE.md`). O linter de
  Markdown está configurado em `.markdownlint.jsonc` para não perseguir esse estilo intencional.

Ao contribuir, concordas que as tuas contribuições ficam sob a [Licença MIT](./LICENSE) do projeto.
