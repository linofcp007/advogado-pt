---
description: Calendário anual de obrigações legais da empresa (IVA, Modelo 22, IES, Segurança Social, contas, RCBE, Relatório Único…), exportável para o Google Calendar. Yearly compliance calendar for the company, exportable to Google Calendar.
argument-hint: "[ano | mês | 'exportar' para gerar o .ics | nome do perfil]"
---

Ativa a skill `advogado-pt` para o calendário de obrigações: $ARGUMENTS.

1. Lê o perfil da empresa (`obter_perfil_empresa`). Se faltar ou estiver incompleto (forma jurídica, regime de IVA, trabalhadores, contabilidade, clientes UE), pergunta só esses campos e oferece guardar com `guardar_perfil_empresa` — sem eles as datas vêm marcadas "a confirmar".
2. Gera o calendário com a tool MCP `calendario_obrigacoes` (`ano`, por defeito o corrente; `mes` se o utilizador quiser só um mês; `perfil` se indicar um perfil nomeado). Mostra as datas por mês com ⏰ nas que terminam nos próximos 30 dias e explica as que mudaram de data (fim de semana, feriado, férias fiscais de agosto, prorrogação por despacho).
3. Se pedir para exportar ("Google Calendar", "Outlook", "exportar"), chama `calendario_obrigacoes` com `exportar: true` e explica a importação (Google Calendar → Definições → Importar e exportar → Importar). Se houver um conector de calendário ativo na sessão, oferece criar os eventos diretamente a partir da lista (pede confirmação antes).
4. Lembra que prorrogações posteriores por despacho podem mudar datas e que a referência é o Portal das Finanças e a Segurança Social Direta.

**EN:** Activate the `advogado-pt` skill for the compliance calendar: $ARGUMENTS. Read the company profile (`obter_perfil_empresa`), generate the calendar with the `calendario_obrigacoes` MCP tool and, when asked, export it as an `.ics` file (`exportar: true`) to import into Google Calendar or Outlook.

*Exemplos · Examples: "/calendario 2026", "/calendario outubro", "/calendario exportar para o Google Calendar", "/calendario cliente-a".*
