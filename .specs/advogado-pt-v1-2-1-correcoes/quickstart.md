# Quickstart: advogado-pt v1.2.1 correções

Cenário de aceitação manual, feito numa instalação real pelo marketplace, depois do push da 1.2.1.

## Pré-condições
- Claude Code com o marketplace `advogado-pt-marketplace` atualizado (`/plugin marketplace update`) e o plugin na 1.2.1.
- Um projeto vazio de teste (sem `.advogado-pt/`).

## Passos (caminho feliz — US-1 / P1)
1. Pedir: "Fui citado a 1 de outubro de 2026 para contestar em 30 dias. Até quando tenho?"
2. **Esperado:** o assistente usa `calc_prazo` com `tipo: judicial` e responde **2/11/2026**, explicando a contagem contínua e a transferência do termo (SC-002).
3. Pedir: "E se tivesse sido citado a 1 de julho?" → **Esperado:** **16/9/2026**, com a suspensão das férias judiciais.
4. Pedir: "Uma fatura de serviços de consultoria a uma empresa, de janeiro de 2020, ainda se pode cobrar?" → **Esperado:** sim, regra geral de 20 anos (art. 309.º), com nota sobre a presuntiva de 2 anos só para profissões liberais e vendas a consumidores.
5. Pedir o IMT de uma casa de 300.000 € para um comprador de 30 anos (1.ª habitação própria) → **Esperado:** IMT 0 € e Imposto do Selo 0 €.
6. Correr `/diagnostico` → **Esperado:** tudo OK, sem pedir build.
7. Gerar o `.skill` (`python build.py`) e fazer upload em claude.ai → Settings → Skills → **Esperado:** aceite (SC-004).

## Caminho negativo
1. Criar no projeto de teste `.advogado-pt` como junction para outra pasta com um ficheiro `prazos.md` de controlo e pedir para registar um prazo.
2. **Esperado:** o registo é recusado com uma mensagem clara e o ficheiro de controlo fica intacto (US-6.AC-10).
3. Correr `node cli/advogado-pt.mjs calc prazo --inicio amanha --dias 10` → **Esperado:** erro imediato que nomeia `--inicio`, código de saída ≠ 0.

## Revisão final contra a revisão de 3/10/2026 (SC-001)
- [ ] Cada achado crítico e importante dos cinco relatórios está corrigido ou marcado "(a confirmar)" com fonte (lista no CHANGELOG da 1.2.1).

## Concluído quando
- [ ] O caminho feliz produz os resultados esperados.
- [ ] O caminho negativo é tratado de forma controlada.
- [ ] Os Critérios de Sucesso SC-001 a SC-005 são observavelmente cumpridos.
