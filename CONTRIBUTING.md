# Contribuir para o advogado-pt

Obrigado por ajudar a melhorar este plugin. O `advogado-pt` é, ao mesmo tempo, uma **skill** de
assessoria jurídica de Portugal, um **servidor MCP** e um **plugin do Claude Code**. Algumas regras
mantêm-no coerente e rigoroso — respeita-as em cada alteração.

## Estrutura do repositório

```text
advogado-pt/
├── skills/advogado-pt/   # A skill: SKILL.md, references/, assets/templates/, assets/checklists/,
│                         #   playbooks/, scripts/ (calculadoras Python) — a fonte de verdade do conteúdo
├── mcp-server/           # Servidor MCP em TypeScript (src/, test/, scripts/bundle-content.mjs → content/)
├── commands/             # Slash commands do plugin do Claude Code
├── hooks/                # Hooks locais do plugin (hooks.json)
├── bin/                  # CLI / entry point (bin/advogado-pt.mjs)
├── integrations/         # Configs por plataforma (Cursor, Windsurf, Gemini, Codex, ChatGPT, Claude)
└── .claude-plugin/       # plugin.json + marketplace.json
```

## Construir o pacote `.skill`

A partir da raiz:

```bash
python build.py            # gera advogado-pt.skill (exclui mcp-server/ e integrations/)
```

## Construir e testar o servidor MCP

```bash
cd mcp-server
npm install
npm run build              # empacota o conteúdo da skill em content/ + compila TypeScript → dist/
npm test                   # build + testes das calculadoras (node --test)
```

O conteúdo jurídico é **o mesmo da skill**: ao mudar `skills/advogado-pt/`, corre `npm run build` no
`mcp-server/` para re-empacotar antes de publicar.

## Versionamento

Ao subir a versão, faz o bump **em simultâneo** nos três sítios, para não dessincronizar:

1. `.claude-plugin/plugin.json` (`version`)
2. `package.json` da raiz (`version`)
3. `CHANGELOG.md` (nova entrada no formato Keep a Changelog + SemVer)

O `mcp-server/package.json` segue a mesma versão sempre que o servidor MCP mudar.

## Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`,
`refactor:`, `test:`. Mantém os commits pequenos e focados.

## Rigor jurídico (regra inviolável)

- **Não inventar.** Nunca inventes números de artigos, diplomas ou jurisprudência. Em caso de dúvida,
  marca `(a confirmar)` e verifica em [dre.pt](https://dre.pt) / [dgsi.pt](https://www.dgsi.pt).
- **Valores num só sítio.** Todos os montantes, taxas, limiares e prazos vivem em
  `skills/advogado-pt/references/valores-2026.md`. As outras referências **remetem** para lá — não
  repetem números. Ao corrigir um valor, atualiza também a "Última atualização" no topo desse ficheiro.
- **Estilo da casa.** Mantém o estilo consistente das referências (ver `CLAUDE.md`). O linter de
  Markdown está configurado em `.markdownlint.jsonc` para não perseguir esse estilo intencional.

Ao contribuir, concordas que as tuas contribuições ficam sob a [Licença MIT](./LICENSE) do projeto.
