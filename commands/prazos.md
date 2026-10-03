---
description: Prazos em curso do projeto — registar, listar e marcar cumpridos, com aviso ao abrir a sessão. Running deadlines — save, list and mark done, with start-of-session reminders.
argument-hint: "[vazio para listar | 'registar <data> <o quê>' | 'cumprido <data> <o quê>']"
---

Ativa a skill `advogado-pt` para os prazos em curso: $ARGUMENTS.

- **Listar** (sem argumentos): usa a tool MCP `listar_prazos` e destaca com ⏰ os vencidos e os que terminam nos próximos 7 dias. Para cada vencido, avalia logo o que ainda se pode fazer (justo impedimento, multa do art. 139.º CPC, outro meio de defesa).
- **Registar**: se o utilizador ainda não tem a data-limite, calcula-a primeiro com `calc_prazo` (dias úteis/corridos, férias judiciais, dilação) e confirma-a com ele; depois grava com `registar_prazo` (`data` AAAA-MM-DD, `descricao`, `origem` com a norma e o ato que fez correr o prazo). Ficam em `.advogado-pt/prazos.md`, e o hook avisa no início de cada sessão.
- **Cumprido**: marca com `concluir_prazo` (data e descrição como aparecem em `listar_prazos`).

Nunca dês um prazo judicial como garantido: indica a regra de contagem usada e recomenda advogado quando o prazo for perentório e estiver próximo.

**EN:** Activate the `advogado-pt` skill for running deadlines: $ARGUMENTS. List them with `listar_prazos`, compute new ones with `calc_prazo` and save them with `registar_prazo`; mark them done with `concluir_prazo`. The session-start hook warns about overdue deadlines and those due within 7 days.

*Exemplos · Examples: "/prazos", "/prazos registar 2026-10-20 oposição à execução fiscal (art. 203.º CPPT)", "/prazos cumprido 2026-10-06 audição prévia".*
