# CLAUDE.md — Guia de Manutenção da Skill `advogado-pt`

Este ficheiro orienta quem (humano ou Claude) **mantém ou desenvolve** a skill. Não é carregado em runtime como conhecimento jurídico — o ponto de entrada da skill é o `SKILL.md`.

## O que é

Assessor jurídico de Portugal para um **empresário tech** (ENI, possível transição para Unipessoal Lda; software/retalho/serviços/consultoria; clientes nacionais e internacionais; PT + EN). Conhecimento por área em `references/`, documentos em `assets/templates/`, ação guiada em `playbooks/`, verificações em `assets/checklists/`, cálculos em `scripts/`.

## Princípios invioláveis

1. **Ponto único de verdade para valores**: todos os montantes/taxas/limiares vivem em `references/valores-2026.md`. Os outros ficheiros **remetem** para lá; não repetem números. Ao mudar de ano, atualizar esse ficheiro e renomeá-lo.
2. **Anti-alucinação**: nunca inventar números de artigos ou jurisprudência. Marcar "(a confirmar)" e verificar em dre.pt/dgsi.pt. Ver "Princípios de Rigor" no `SKILL.md`.
3. **Estilo da casa**: H1; `## Legislação Base` com diplomas/artigos; secções em bullets; `## Para o contexto do utilizador`; `## Templates`. Listas coladas aos cabeçalhos (o linter MD022/MD032 sinaliza, mas é o estilo consistente da skill — não perseguir).
4. **Cross-refs com nomes reais**: usar `references/x.md`, `assets/templates/y.md`, `scripts/z.py` que existam mesmo.

## Calendário de manutenção (valores mudam!)

| Quando | Rever em `valores-2026.md` |
|---|---|
| **Janeiro** (pós-OE) | IRC, IRS, IAS, salário mínimo, deduções, IMT/IMI, isenções jovem |
| **Julho** | juros de mora comerciais do 2.º semestre (aviso da ETF) |
| **Outubro** | coeficiente de atualização de rendas (INE) |
| Sempre que mudar uma lei estrutural | atualizar o ficheiro de referência da área + nota de correção |

Ao corrigir um valor, **atualizar também a "Última atualização"** no topo do `valores-2026.md`.

## Como adicionar conteúdo

- **Nova área jurídica** → criar `references/nova-area.md` no estilo da casa + ligar em `SKILL.md` (secção "Áreas de Competência") + no `README.md`.
- **Novo template** → `assets/templates/nome.md` com comentário `<!-- Template: ... -->`, placeholders `{{...}}`, base legal; registar no índice `assets/templates/README.md`.
- **Novo playbook** → `playbooks/nome.md` (árvore de decisão) + índice.
- **Nova checklist** → `assets/checklists/nome.md` (checkboxes) + índice.
- **Nova calculadora** → `scripts/nome.py` (stdlib, `argparse`, `formatar_euros`, AVISO no output) + adicionar teste em `scripts/test_scripts.py` + registar no `scripts/README.md`.

## Antes de publicar

```powershell
python scripts/test_scripts.py     # testes de regressão das calculadoras
python build.py                    # gera advogado-pt.skill
```

`build.py`/`build.ps1` empacotam tudo exceto `__pycache__`, `.pyc`, `.git` e o próprio `.skill`. Fazer upload em **Claude → Settings → Skills**.

## Notas técnicas

- Scripts em Python 3 (stdlib apenas); output reconfigurado para UTF-8 para não rebentar na consola cp1252 do Windows; usar `->` em vez de setas unicode nas mensagens.
- O conteúdo jurídico foi parcialmente gerado com subagentes a partir de especificações detalhadas; rever sempre citações determinantes antes de confiar nelas.
