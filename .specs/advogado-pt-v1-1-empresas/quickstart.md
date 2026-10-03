# Quickstart: advogado-pt v1.1 empresas

Cenário de aceitação manual, de ponta a ponta.

## Pré-condições
- Repo no branch `feat/v1.1-empresas`, `npm run setup` feito (MCP compilado).
- Claude Code aberto numa pasta de teste sem `.advogado-pt/`.

## Passos (caminho feliz — US-1 / P1)
1. `node cli/advogado-pt.mjs calc juros --capital 5000 --inicio 2025-01-01 --fim 2026-01-01`
2. **Esperado:** 2 tramos (11,15% e 10,15%), juros 532,29 € e nota dos 40 € (SC-002).
3. Pedir ao Claude "redige a carta de cobrança formal para um cliente que me deve 3.000 €".
4. **Esperado:** a carta não diz que interrompe a prescrição; no fim vem a lista "Antes de enviar — verificar" separada do documento (SC-001).
5. Na mesma sessão: "sou uma Lda de restauração com 12 trabalhadores, guarda isto". **Esperado:** grava `.advogado-pt/perfil-empresa.md`; numa nova sessão o hook mostra o perfil (origem: projeto).
6. Noutra pasta sem perfil, com perfil geral gravado: **Esperado:** o hook mostra o perfil geral (origem: geral).
7. `node cli/advogado-pt.mjs prompt reclamacao-graciosa` e colar noutra IA. **Esperado:** prompt com persona, rigor e template (SC-004).
8. `listar_templates` e `procurar_conteudo "prazo"` no MCP. **Esperado:** âmbito ao lado de cada nome; resultados agrupados por tipo (SC-003: as 10 áreas aparecem nos índices).

## Caminho negativo
1. `node cli/advogado-pt.mjs calc juros --capital 1000 --inicio 2012-01-01` -> **Esperado:** erro claro (antes de 2013-07-01), exit 1.
2. `node cli/advogado-pt.mjs prompt nao-existe` -> **Esperado:** lista de templates, exit 1.
3. Pôr lixo binário em `.advogado-pt/perfil-empresa.md` e abrir sessão -> **Esperado:** sessão abre sem perfil e sem erro.

## Concluído quando
- [ ] O caminho feliz produz o resultado esperado.
- [ ] O caminho negativo é tratado de forma controlada.
- [ ] Os Critérios de Sucesso (SC-001…SC-004) são observavelmente cumpridos.
