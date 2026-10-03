<!-- Template: formulário de recolha inicial (intake) de um caso novo. Preencher com o utilizador no
     início de cada assunto jurídico. Espelha a secção "Recolha Inicial de Informação" do SKILL.md.
     Serve para montar a cronologia e detetar prazos de imediato.
     Âmbito: nacional -->

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

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Identificar no próprio dia todos os prazos já a correr e calculá-los com `calc_prazo` / `calc_prescricao`; havendo prazo judicial, recomendar advogado de imediato.
- [ ] Confirmar a data efetiva de receção de cada notificação (AR, carimbo, data de acesso no Citius ou na caixa postal eletrónica) — é a partir dela que os prazos se contam.
- [ ] Recolher cópias dos documentos assinalados na secção 4 antes de avaliar a posição e anotar o que falta.
- [ ] Registar o perfil da empresa (forma jurídica, n.º de trabalhadores, volume de negócios, B2B/B2C) em `.juridico-pt/perfil-empresa.md` — muda o regime aplicável.
- [ ] A ficha contém dados pessoais de terceiros: guardá-la com acesso restrito e não a partilhar fora do âmbito do caso (RGPD).
