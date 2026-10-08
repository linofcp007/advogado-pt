<!-- Template: estrutura de parecer jurídico. Usar para análises de caso (não para documentos a enviar
     a terceiros). Espelha a secção "Formatos de Output" do SKILL.md. Manter linguagem clara.
     Âmbito: nacional -->

# Parecer Jurídico — {{ASSUNTO}}

**Para:** {{NOME}}  |  **Data:** {{DATA}}  |  **Área:** {{AREA}}

## 1. Situação
{{PREENCHER: Resumo dos factos em 2-3 linhas.}}

## 2. Enquadramento legal
- Diplomas aplicáveis: {{LEIS}}
- Artigos relevantes: {{ARTIGOS}} *(confirmar citações determinantes em dre.pt/dgsi.pt)*

## 3. Posição jurídica
{{ESCOLHER: Forte / Média / Fraca}} — porque {{FUNDAMENTACAO}}.

## 4. Opções
| Opção | Custo estimado | Tempo | Probabilidade de êxito | Risco |
|---|---|---|---|---|
| {{A}} | {{PREENCHER: €}} | {{PREENCHER: prazo}} | {{PREENCHER: %/qualitativo}} | {{ESCOLHER: baixo/médio/alto}} |
| {{B}} | ... | ... | ... | ... |
| {{C}} | ... | ... | ... | ... |

## 5. Matriz de risco
- Probabilidade de desfecho desfavorável: {{ESCOLHER: baixa/média/alta}}
- Impacto financeiro estimado: {{PREENCHER: €}}

## 6. Recomendação
{{PREENCHER: A opção aconselhada e porquê. Honesto quando a posição é fraca.}}

## 7. Próximos passos
1. {{PASSO_1}} — ⏰ {{PRAZO_1}}
2. {{PASSO_2}}
3. {{PASSO_3}}

## 8. Prazos a vigiar
- ⏰ {{PRAZO}}: {{PREENCHER: descrição}} — consequência: {{CONSEQUENCIA}}

---
⚖️ *Orientação informativa baseada na legislação portuguesa vigente. Para ações judiciais ou alta complexidade, validar com advogado inscrito na Ordem dos Advogados.*

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Preencher a secção 8 com todos os prazos calculados (`calc_prazo` / `calc_prescricao`) e a consequência de cada um; havendo prazos judiciais a correr, recomendar advogado inscrito na Ordem.
- [ ] Cada artigo ou acórdão usado como fundamento verificado em dre.pt / dgsi.pt; o que não for verificado fica marcado "(a confirmar)".
- [ ] Montantes, taxas e limiares retirados de `references/valores-2026.md`, com indicação do ano/semestre a que respeitam.
- [ ] Opções com custos estimados (custas: `calc_custas_injuncao` e UC em `references/valores-2026.md`) e probabilidade fundamentada — honesto quando a posição é fraca.
- [ ] Documento interno: confirmar o destinatário e enviar por canal seguro (contém factos e dados pessoais do caso).
