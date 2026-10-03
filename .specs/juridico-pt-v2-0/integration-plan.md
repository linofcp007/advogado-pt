# Integration Plan: juridico-pt v2.0

## Pontos de Integração
- Identidade do plugin: `.claude-plugin/plugin.json`, `marketplace.json`, `.mcp.json`, `mcp-server/src/index.ts` (nome do servidor), `resources.ts` (URI), `prompts.ts`.
- Pastas e ficheiros com o nome antigo: `skills/advogado-pt/`, `cli/advogado-pt.mjs`, `hooks/advogado-hook.mjs`, `build.py`, `integrations/`, `README.md`, `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.specs/steering/constitution.md`.
- Estado local: `perfil.ts`, `prazos-estado.ts`, `calendario.ts` e o hook passam a resolver a pasta através de `dados.ts`.
- Motores: `juros.ts` (lote), calculadoras novas (`ccp.ts`); calendário com campos novos.
- Testes: `plugin.test.mjs`, `v12.test.mjs`, `v121.test.mjs` e `factos.json` citam caminhos com `advogado-pt` — atualizados na renomeação.

## Modificações Necessárias
- Renomeação de identificadores e pastas (git mv para manter o histórico).
- Pasta de dados `.juridico-pt/` (a antiga `.advogado-pt/` renomeia-se à mão).
- Instruções e persona sem "advogado".
- Hook: linha curta fora de projetos com dados; aviso de atualidade.

## Sequenciamento
- Fase 1: investigação, testes a falhar, base das avaliações.
- Fase 2: renomeação e migração (US-1) — bloqueia o resto, porque muda os caminhos.
- Fase 3: MVP de funcionalidades (faturação, cobrança).
- Fase 4: restantes histórias em paralelo onde não partilham ficheiros.
- Fase 5: índices, bump 2.0.0, avaliações, validação.
- Fase 6: push e renomeação do repositório (com confirmação), quickstart.

## Riscos e Mitigações
- Registo antigo do marketplace deixa de atualizar: aceite (um só utilizador); passos de troca no CHANGELOG (D-1).
- Testes antigos que citam caminhos `advogado-pt`: atualizados na mesma tarefa da renomeação; suite completa a verde antes de seguir.
- Dados só em `.advogado-pt/`: o plugin não os lê nem apaga; o CHANGELOG manda renomear a pasta.
- Rollback: a 1.2.1 continua no histórico e no marketplace até ao push da 2.0.0; um `git revert` do merge repõe tudo.

## Ficheiros Afetados (melhor estimativa)
- `.claude-plugin/*`, `.mcp.json` → identidade
- `skills/advogado-pt/**` → `skills/juridico-pt/**` (renomeado) + conteúdo novo
- `mcp-server/src/{index,tools,resources,prompts,persona,perfil,prazos-estado,calendario,dados,painel,atualidade,docx,zip,elicitacao}.ts`, `mcp-server/src/calculators/{juros-lote,ccp}.ts`
- `mcp-server/scripts/{build-mcpb,gerar-integracoes}.mjs`, `build.py`
- `cli/juridico-pt.mjs`, `hooks/juridico-hook.mjs`, `hooks/hooks.json`
- `agents/*.md`, `evals/**`, `commands/{faturacao,painel,exportar,cobrar}.md`
- `README.md`, `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `INSTALL.md`, `integrations/**`, `CHANGELOG.md`
- `mcp-server/test/{v20.test.mjs,plugin.test.mjs,factos.json,fixtures/**}`, `skills/juridico-pt/scripts/test_scripts.py`
