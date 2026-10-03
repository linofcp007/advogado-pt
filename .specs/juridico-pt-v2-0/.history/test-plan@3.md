# Test Plan: juridico-pt v2.0

## Estratégia
- **Test runner:** `node --test` (`mcp-server/test/v20.test.mjs` para a versão; `plugin.test.mjs` para nomes, manifestos e versão) e `unittest` (`skills/juridico-pt/scripts/test_scripts.py`). Avaliações de comportamento com `claude plugin eval` (à parte, antes de lançar — ver `eval-plan.md`).
- **Abordagem de mocking:** sem mocks nos motores; pastas temporárias para dados; o servidor MCP é testado por um cliente real em processo (como o smoke) para a elicitation, com e sem a capacidade anunciada.
- **Alvo de cobertura:** cada AC com pelo menos um teste; cada regra jurídica nova com um facto em `factos.json` (ids `v20-…`).
- **Caminhos críticos que exigem 100% de cobertura de ramos:** pasta de dados (`dados.ts`), `apagar_perfil`, conservação dos prazos, `zip.ts` (CRC32 e cabeçalhos), juros em lote e procedimento CCP.

## Matriz de Rastreabilidade

| Test ID | Camada | Tipo | Descrição | Cobre (AC IDs) | Ficheiro |
|---------|--------|------|-----------|----------------|----------|
| T-301 | unit | example | identificador `juridico-pt` no plugin, marketplace, servidor, pasta da skill, CLI e `.skill`; nome "Jurídico PT" | US-1.AC-1 | `mcp-server/test/plugin.test.mjs` |
| T-302 | integração | property | nenhum ficheiro de persona, instruções, commands, agents ou documentação diz "És o advogado" ou apresenta o plugin como advogado; todos dizem "assistente jurídico"; o aviso da Ordem dos Advogados mantém-se | US-1.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-303 | integração | example | perfil, perfil ativo, prazos e calendário gravados e lidos em `.juridico-pt/`; uma `.advogado-pt/` presente é ignorada e fica intacta | US-1.AC-3, EC-1 | `mcp-server/test/v20.test.mjs` |
| T-304 | unit | example | o CHANGELOG `## [2.0.0]` tem os comandos de troca (no máximo 4) e a instrução para renomear `.advogado-pt/` | US-1.AC-4, SC-001 | `mcp-server/test/v20.test.mjs` |
| T-305 | unit | example | `JURIDICO_PT_HOME` define a pasta do perfil geral; `ADVOGADO_PT_HOME` é ignorada | US-1.AC-5 | `mcp-server/test/v20.test.mjs` |
| T-306 | integração | example | referência `faturacao`, playbook, checklist e `/faturacao` existem, indexados, com fonte por regra; factos `v20-fatura-` | US-2.AC-1 | `mcp-server/test/v20.test.mjs` |
| T-307 | unit | example | calendário 2026 de um perfil com `emite_faturas: sim` inclui a data-limite das faturas em PDF sem assinatura qualificada, com base legal; sem o campo, fica "a confirmar" | US-2.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-308 | unit | example | `calcularJurosLote`: 5 faturas de 2 clientes → juros por tramos por fatura, 40 € nas comerciais, totais por cliente e geral; fatura ainda não vencida → 0 | US-3.AC-1, EC-2 | `mcp-server/test/v20.test.mjs` |
| T-309 | unit | example | Python `calcular_juros_lote`: os mesmos casos | US-3.AC-1 | `skills/juridico-pt/scripts/test_scripts.py` |
| T-310 | integração | example | template de carta com várias faturas; `cliente-nao-paga` com PEPEX (Lei 32/2014) e IVA de créditos incobráveis, com fonte | US-3.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-311 | integração | example | `/cobrar` explica o uso do conector de faturação quando existe e propõe `registar_prazo` para o seguimento | US-3.AC-3, US-3.AC-4 | `mcp-server/test/v20.test.mjs` |
| T-312 | integração | example | `evals/` tem ≥ 40 casos válidos no formato do `claude plugin eval`, cada um com pelo menos uma verificação determinística | US-4.AC-1 | `mcp-server/test/v20.test.mjs` |
| T-313 | avaliação | example | `claude plugin eval` corre; base registada no `eval-plan.md`; limiares cumpridos | US-4.AC-2, SC-002 | `claude plugin eval (comando local)` |
| T-314 | integração | example | SessionStart com `hoje` depois da "próxima revisão" do ficheiro de valores mostra uma linha de aviso | US-5.AC-1 | `mcp-server/test/v20.test.mjs` |
| T-315 | unit | example | `verificar_atualidade` lista valores, taxas semestrais e tabelas com a data e o estado | US-5.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-316 | unit | example | `agents/verificador-citacoes.md` e `agents/revisor-contratos.md` com frontmatter válido, só ferramentas de leitura e saída no formato pedido | US-6.AC-1, US-6.AC-2 | `mcp-server/test/plugin.test.mjs` |
| T-317 | integração | example | os subagentes mandam marcar "não verificada" quando não acedem à fonte | US-6.AC-3, EC-5 | `mcp-server/test/v20.test.mjs` |
| T-318 | integração | example | `painel_clientes` com 10 perfis e prazos: obrigações e prazos dos próximos 30 dias, por data e perfil; sem perfis → perfil por defeito e explicação; CLI `painel` | US-7.AC-1, EC-6, SC-005 | `mcp-server/test/v20.test.mjs` |
| T-319 | integração | example | prazo associado a um perfil e `.ics` por perfil | US-7.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-320 | unit | example | campos novos do perfil aceites; calendário com IMI e IUC quando há imóveis/viaturas e com período de tributação diferente do ano civil | US-7.AC-3 | `mcp-server/test/v20.test.mjs` |
| T-321 | integração | example | os 5 templates do dia a dia existem, no estilo da casa, indexados | US-8.AC-1 | `mcp-server/test/v20.test.mjs` |
| T-322 | integração | property | todos os placeholders de todos os templates seguem `{{MAIUSCULAS_SEM_ACENTO}}` (com a parte opcional após `:`) e o mesmo dado tem o mesmo nome | US-8.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-323 | integração | example | `checklist-nis2` com base no DL 125/2025 | US-9.AC-1 | `mcp-server/test/v20.test.mjs` |
| T-324 | integração | example | referência `fundos-europeus` e playbook `recebi-pedido-devolucao-apoio`, com fonte | US-9.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-325 | unit | example | `calcularProcedimentoCCP`: valores abaixo, igual e acima de cada limiar, bens/serviços e empreitadas | US-9.AC-3, EC-3 | `mcp-server/test/v20.test.mjs` |
| T-326 | unit | example | Python `procedimento_ccp`: os mesmos casos | US-9.AC-3 | `skills/juridico-pt/scripts/test_scripts.py` |
| T-327 | integração | example | playbook `vender-ao-estado` e os 4 templates de contratação pública | US-9.AC-4 | `mcp-server/test/v20.test.mjs` |
| T-328 | unit | example | `.docx` gerado: ZIP válido (CRC32, diretório central), `[Content_Types].xml`, `word/document.xml` bem formado, títulos/listas/negrito, `&`/`<`/aspas/acentos, sem "Antes de enviar" | US-10.AC-1, EC-4 | `mcp-server/test/v20.test.mjs` |
| T-329 | integração | example | sem perfil: cliente com elicitation recebe o formulário com listas fechadas; cliente sem elicitation recebe as perguntas em texto | US-10.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-330 | integração | example | o `.mcpb` gerado tem um manifesto válido e o bundle do servidor, e o servidor arranca a partir dele | US-10.AC-3 | `mcp-server/test/v20.test.mjs` |
| T-331 | integração | example | ao criar `.juridico-pt/` num repositório git sem a exclusão no `.gitignore`: aviso; com `acrescentar_gitignore` a linha é acrescentada uma só vez | US-11.AC-1 | `mcp-server/test/v20.test.mjs` |
| T-332 | integração | example | `apagar_perfil` apaga o perfil e os prazos dele, repõe o perfil ativo, recusa nomes inválidos e links | US-11.AC-2 | `mcp-server/test/v20.test.mjs` |
| T-333 | integração | property | num projeto sem `.juridico-pt/`, o SessionStart tem uma linha com ≤ 200 caracteres; o texto fixo total é menos de metade do da 1.2.1 | US-11.AC-3, SC-003 | `mcp-server/test/v20.test.mjs` |
| T-334 | integração | example | README e referência `privacidade-plugin` dizem que dados, onde, por quanto tempo e o papel do fornecedor do modelo | US-11.AC-4 | `mcp-server/test/v20.test.mjs` |
| T-335 | unit | example | prazos cumpridos há mais de 12 meses saem na escrita seguinte; perfil com mais de 12 meses é assinalado e não apagado | US-11.AC-5 | `mcp-server/test/v20.test.mjs` |
| T-336 | unit | example | dependências de runtime iguais às da 1.2.1 | NFR-1 | `mcp-server/test/plugin.test.mjs` |
| T-337 | unit | example | versão 2.0.0 em todos os sítios; CHANGELOG `## [2.0.0]` com secção "Migração" | NFR-2 | `mcp-server/test/plugin.test.mjs` |
| T-338 | integração | example | `claude plugin validate` e as duas suites passam | NFR-3 | `claude plugin validate (comando local)` |
| T-339 | integração | example | SessionStart < 300 ms com perfil, prazos e verificação de atualidade | NFR-4 | `mcp-server/test/v20.test.mjs` |
| T-340 | integração | example | todos os itens dos quatro grupos existem, estão indexados e têm teste | SC-004 | `mcp-server/test/v20.test.mjs` |
| T-341 | manual | example | `.mcpb` instalado no Claude Desktop e `.docx` aberto no Word e no LibreOffice | US-10.AC-1, US-10.AC-3 | `quickstart.md (manual)` |

## Verificação de Cobertura
Cada AC aparece em pelo menos uma célula "Cobre". Sem lacunas.

## Dados de Teste e Fixtures
- `mcp-server/test/fixtures/contabilista/` — 10 perfis e prazos de exemplo (empresas fictícias, sem dados reais).
- `mcp-server/test/fixtures/paridade.json` (da 1.2.1) estendido com juros em lote e CCP.
- `.advogado-pt/` de exemplo para confirmar que a pasta antiga é ignorada.
- Factos `v20-<tema>-…` em `factos.json`.

## Fora de Âmbito para Testes
- Ações no GitHub (renomear o repositório) e o sync do Claude Desktop: verificação manual no quickstart.
- Conectores de terceiros (programa de faturação): só o texto das instruções é testado.
