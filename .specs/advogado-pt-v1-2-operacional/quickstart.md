# Quickstart: advogado-pt v1.2 operacional

## Pré-condições
- Branch `feat/v1.2-operacional`, `npm run setup` feito.
- Pasta de teste com `.advogado-pt/perfil-empresa.md` (Lda, IVA trimestral, 12 trabalhadores, contabilidade organizada).

## Passos (caminho feliz)
1. `node cli/advogado-pt.mjs calendario --ano 2026 --ics` -> **Esperado:** ≥ 15 obrigações com base legal e `.advogado-pt/calendario-2026.ics` criado; importar no Google Calendar (Definições -> Importar) sem erros (SC-002).
2. No Claude: "regista o prazo de oposição à execução fiscal até dia X" -> `prazos.md` atualizado; nova sessão mostra "faltam N dias".
3. `node cli/advogado-pt.mjs calc salario --bruto 1500 --tabela I --dependentes 0` e `calc custo --base 1500` -> valores iguais aos casos de referência (SC-003).
4. `calc irc --lucro 100000 --pme --derrama 1.5` e `calc iva --tipo servicos --cliente empresa --destino UE` -> IRC por escalões; "IVA - autoliquidação".
5. `calc taxa-justica --valor 30000` -> taxa em UC e €.
6. `/perfil` com dois perfis nomeados -> ativar o 2.º e ver o hook a mostrá-lo.
7. `node --test mcp-server/test/factos.test.mjs` -> ≥ 40 factos verdes (SC-005).
8. `grep -rc "VERIFICAR — valores-2026" skills/` -> ≤ 3 marcas, cada uma com fonte (SC-001); todos os itens pedidos nos índices (SC-004).

## Caminho negativo
1. Lixo em `prazos.md` e em `perfil-ativo` -> sessão abre sem erro, sem aviso de prazos e com o perfil por defeito.
2. `calc iva` de bens para empresa UE sem NIF VIES -> tributa em Portugal (EC-5).

## Concluído quando
- [ ] O caminho feliz produz o resultado esperado.
- [ ] O caminho negativo é tratado de forma controlada.
- [ ] Os Critérios de Sucesso (SC-001…SC-005) são observavelmente cumpridos.
