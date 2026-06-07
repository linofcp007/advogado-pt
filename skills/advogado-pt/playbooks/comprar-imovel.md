# Playbook: Comprar um imóvel

> Quando usar: vais adquirir um imóvel (habitação própria, escritório/sede, investimento) e queres fazer a due diligence, assinar o contrato-promessa em segurança, simular os impostos e chegar à escritura sem surpresas.

## Passo 0 — Não percas prazos

- ⏰ **Prazos do CPCV**: o contrato-promessa fixa o prazo para a escritura e as consequências do incumprimento. **Não deixes passar a data marcada** — quem falta perde o sinal (comprador) ou restitui o sinal em dobro (vendedor) — Art. 442.º CC. Marca a data da escritura no calendário e cumpre os prazos para obter financiamento e documentos.
- ⏰ **Validade de documentos**: certidão permanente do registo predial, caderneta predial e certificado energético têm de estar **atualizados** à data da escritura — pede-os com pouca antecedência.
- ⏰ **Registo predial**: regista a aquisição **de imediato** após a escritura. Pelo princípio da prioridade (Art. 6.º CRPredial), quem regista primeiro prevalece — proteges-te contra dupla venda/oneração superveniente.
- ⏰ Se contas com **isenção de IMT por reinvestimento** futuro ou regras de mais-valias, há prazos próprios na venda do imóvel anterior — ver Ramo mais-valias.

## Fluxo de decisão

1. **DUE DILIGENCE antes de assinar seja o que for.** Reúne e verifica (checklist em `assets/checklists/checklist-due-diligence-imovel.md`; enquadramento em `references/imobiliario.md`, secção "Due Diligence do Comprador"):
   - **Certidão permanente do registo predial** → titularidade atual, cadeia de transmissões, **ónus/hipotecas/penhoras/arrestos**.
   - **Caderneta predial** (Finanças) → identificação fiscal, VPT, titular.
   - **Licença de utilização** (câmara) → finalidade autorizada (sem ela, o ato pode estar comprometido — DL 281/99).
   - **Certificado energético** (ADENE) → obrigatório para venda.
   - **Ficha técnica de habitação** (se licenciado após 30/03/2004).
   - **Dívidas de condomínio** e estado das partes comuns.
   - **Há ónus/hipotecas/penhoras na certidão?** → se SIM: exige **distrate/cancelamento** antes ou no ato da escritura (minuta de distrate em `references/imobiliario.md`) · se NÃO: avança.

2. **Tudo limpo na due diligence?** → se NÃO (ónus por levantar, licença em falta, divergências de áreas, processo pendente): **não assines o CPCV** sem resolver ou sem cláusulas que te protejam · se SIM: passo 3.

3. **Contrato-Promessa de Compra e Venda (CPCV) com sinal.** Usa `assets/templates/contrato-promessa-compra-venda.md`. Pontos críticos:
   - **Sinal** (Art. 442.º CC): define o valor; incumprimento do comprador = perde o sinal; do vendedor = devolve em dobro.
   - **Execução específica** (Art. 830.º CC): se quiseres poder obrigar à venda por sentença, **não** afastes a execução específica (atenção, com sinal pode estar convencionada em contrário).
   - **Forma**: escrito com **reconhecimento de assinaturas** (prédios — Art. 410.º n.º 3 CC).
   - **Tradição da coisa** (se receberes já o imóvel): confere direito de retenção que prevalece sobre hipoteca anterior.
   - Fixa **prazo e local da escritura**, condição de financiamento, e o que acontece se o crédito não for aprovado.

4. **Simula os impostos da aquisição** para saberes o custo total antes de te comprometeres:
   ```
   python scripts/imt.py --valor <preço ou VPT, o maior>      # junta --jovem se ≤35 anos e 1.ª HPP
   ```
   - **IMT**: incide sobre o **maior** entre preço e VPT; taxas progressivas (2% a 8%).
   - **Tens ≤ 35 anos e é 1.ª habitação própria e permanente?** → **IMT Jovem**: isenção total até 330.539€; isenção parcial entre 330.539€ e 660.982€; também isento de **Imposto do Selo** na compra.
   - **Imposto do Selo (verba 1.1)**: **0,8%** sobre o maior de VPT/preço.
   - ⚠️ Em alternativa ao script, a **Tabela IMT 2026** e os requisitos do **IMT Jovem** estão em `references/valores-2026.md` (ponto único de verdade — escalões, parcela a abater e limites).

5. **Financiamento (se houver crédito à habitação).** Pede a **FINE** ao banco (DL 74-A/2017), respeita o prazo de reflexão e confirma as condições. A escritura de compra e a de mútuo com hipoteca celebram-se, em regra, **no mesmo ato**. Garante que o crédito está aprovado **antes** da data da escritura fixada no CPCV.

6. **Escritura / DPA + registo.** A compra exige forma autêntica (escritura notarial **ou** Documento Particular Autenticado). Considera o procedimento **"Casa Pronta"** (IRN), que pode reunir escritura, liquidação de impostos e registo num só ato. **Paga IMT e Imposto do Selo antes da escritura** (sem isso o notário não titula). **Regista de imediato.**

### Ramo — Mais-valias futuras (quando venderes)

- Guarda **todos os comprovativos** de aquisição, obras e despesas — servem para reduzir a mais-valia tributável na venda futura.
- Regra geral: **50% do ganho** englobado em IRS (Categoria G). **Isenção por reinvestimento** da habitação própria e permanente noutra HPP (24 meses antes / 36 meses depois). Detalhe em `references/fiscal-pessoal.md` e `references/imobiliario.md` (secção Mais-Valias).

### Ramo — Imóvel para sede/escritório (ENI/Lda)

- Pondera **deter na sociedade vs. na esfera pessoal e arrendar à Lda** (impacto em IMI/AIMI, mais-valias futuras, proteção patrimonial).
- **IVA vs. IMT** e possível **renúncia à isenção de IVA** entre sujeitos passivos — analisar com o contabilista. Ver `references/imobiliario.md`, secção "Imóvel para Sede / Escritório".

## Documentos a usar

- `assets/checklists/checklist-due-diligence-imovel.md` — checklist de verificação do comprador
- `assets/templates/contrato-promessa-compra-venda.md` — CPCV com sinal e execução específica
- `scripts/imt.py` — simulação de IMT / IMT Jovem (ou, em alternativa, a Tabela IMT 2026 em `references/valores-2026.md`)
- `references/imobiliario.md` — fases da compra, due diligence, impostos, distrate, imóvel para sede
- `references/valores-2026.md` — Tabela IMT 2026, IMT Jovem, Imposto do Selo, IMI/AIMI
- `references/fiscal-pessoal.md` — mais-valias imobiliárias e reinvestimento

## Quando chamar advogado presencial

- **Ónus, hipotecas, penhoras ou litígios** sobre o imóvel que é preciso levantar/negociar antes da escritura.
- **Licença de utilização em falta**, divergências de áreas, construções não legalizadas ou imóvel em herança/condomínio com situação complexa.
- Redação do **CPCV** quando o sinal é elevado ou queres assegurar execução específica/cláusulas de salvaguarda.
- Aquisição **pela sociedade** com renúncia à isenção de IVA ou planeamento fiscal (em conjunto com o contabilista).
- Qualquer dúvida sobre **dupla venda**, direito de retenção, ou prioridade de registo.
