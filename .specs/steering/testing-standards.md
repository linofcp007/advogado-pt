# Padrões de Teste

## Runner e Ferramentas
- Unit (TS): `node --test` sobre `mcp-server/test/*.test.mjs`, importando `../dist/` (corre `npm test` = build + testes).
- Unit (Python): `unittest` em `skills/advogado-pt/scripts/test_scripts.py`.
- Estrutura/conteúdo: `mcp-server/test/plugin.test.mjs` lê os `.md` e o `tools.ts` diretamente.
- E2E: `mcp-server/test/smoke-client.mjs` (manual).
- Mocking: nenhum — calculadoras são puras; datas passadas explicitamente.

## Política de Cobertura
- Cada calculadora: pelo menos um valor de referência verificado à mão em cada lado (Python e TS), mais os casos de erro.
- Taxas e tabelas: um teste por valor publicado que a calculadora usa.

## Disciplina TDD
- Sem implementação antes de um teste a falhar que exercite o caminho real.
- 'Falhar pela razão certa' = assertion/NotImplemented, não erro de import/sintaxe.
- O T-ID vai no nome do teste: `test("T-01 …")` em JS, `def test_T01_…` em Python.
