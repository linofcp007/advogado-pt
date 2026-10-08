---
description: Painel do contabilista — prazos dos próximos dias de todos os clientes. Accountant dashboard — upcoming deadlines for all clients.
argument-hint: "[dias, por defeito 30]"
---

Mostra o painel do modo contabilista com a tool MCP `painel_clientes` (com `dias` = $ARGUMENTS, ou 30): as obrigações legais tiradas do perfil de cada cliente (`.juridico-pt/perfis/<nome>.md`) e os prazos registados com `registar_prazo` (parâmetro `perfil`), por data e por perfil, e os prazos já vencidos à parte.

- Sem perfis nomeados: explica como os criar (`guardar_perfil_empresa` com `perfil`) e, se o utilizador quiser, ajuda a importar a lista de clientes, um a um.
- Obrigações "a confirmar": diz que campo do perfil falta (ex.: `regime_iva`, `trabalhadores`) para o calendário desse cliente ficar certo.
- Para levar para o calendário: `calendario_obrigacoes` com `por_perfil: true` gera um `.ics` por cliente.

Sem MCP: `node "${CLAUDE_PLUGIN_ROOT}/cli/juridico-pt.mjs" painel --dias 30`.

**EN:** Show the accountant dashboard with the `painel_clientes` MCP tool (`dias` = $ARGUMENTS or 30): legal obligations from each client profile and saved deadlines, by date and client, plus overdue deadlines.

*Exemplos · Examples: "/painel", "/painel 7".*
