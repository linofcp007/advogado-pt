<!-- Template: formulário de recolha inicial (intake) de um caso novo. Preencher com o utilizador no
     início de cada assunto jurídico. Espelha a secção "Recolha Inicial de Informação" do SKILL.md.
     Serve para montar a cronologia e detetar prazos de imediato. -->

# Ficha de Caso — Intake

**Data de abertura:** {{DATA}}
**Área(s) provável(eis):** {{AREA}}  <!-- ex.: cobranças, laboral, RGPD... -->

## 1. Partes
- **Eu / a empresa:** {{NOME}}, {{ENI_OU_LDA}}, NIF {{NIF}}
- **Contraparte:** {{CONTRAPARTE_NOME}}, {{CONTRAPARTE_NIF}}
- **A contraparte já tem advogado?** {{SIM/NÃO}}

## 2. Factos (cronologia)
| Data | O que aconteceu |
|---|---|
| {{DATA_1}} | {{FACTO_1}} |
| {{DATA_2}} | {{FACTO_2}} |
| ... | ... |

## 3. Valores em causa
- Montante principal: {{VALOR}}
- Outros (juros, danos, custas estimadas): {{OUTROS}}

## 4. Documentos disponíveis
- [ ] Contrato / proposta
- [ ] Faturas / recibos
- [ ] Emails / mensagens
- [ ] Notificações recebidas (com data)
- [ ] Outros: {{OUTROS_DOCS}}

## 5. Prazos
- **Há algum prazo já a correr?** {{SIM/NÃO}}
- **Data da última notificação/citação recebida:** {{DATA_NOTIFICACAO}}
- ⏰ **Prazo-limite identificado:** {{PRAZO}} — *(usar `scripts/prazos.py` ou `scripts/prescricao.py`)*

## 6. Objetivo
{{O_QUE_QUERO: ex. cobrar, rescindir, defender-me, prevenir, negociar}}

## 7. Avaliação inicial (preenchido pelo advogado)
- Posição jurídica: {{forte / média / fraca}}
- Próximo passo recomendado: {{PASSO}}
- Recomenda advogado presencial? {{SIM/NÃO — porquê}}
