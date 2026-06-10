# Changelog

Todas as alterações relevantes ao **advogado-pt**. O formato segue
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adere ao
[Versionamento Semântico](https://semver.org/lang/pt-BR/). A versão refere-se ao plugin como um todo.

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

[1.0.2]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.2
[1.0.1]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.1
[1.0.0]: https://github.com/linofcp007/advogado-pt/releases/tag/v1.0.0
