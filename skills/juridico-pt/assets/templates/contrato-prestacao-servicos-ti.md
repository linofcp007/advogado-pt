<!-- Template: Contrato de prestação de serviços de tecnologia/consultoria (Art. 1154.º CC).
     Pontos críticos para TI: propriedade do output, SLA, cap de responsabilidade, exit plan, RGPD.
     Para clientes internacionais, ver também references/contratos-internacionais.md.
     Âmbito: misto -->

# CONTRATO DE PRESTAÇÃO DE SERVIÇOS

**Primeiro Outorgante (Prestador):** {{PRESTADOR_NOME}}, NIF {{PRESTADOR_NIF}}, {{PRESTADOR_MORADA}}.
**Segundo Outorgante (Cliente):** {{CLIENTE_NOME}}, NIF/registo {{CLIENTE_NIF}}, {{CLIENTE_MORADA}}.

## 1. Objeto
O Prestador obriga-se a prestar ao Cliente os serviços de {{DESCRICAO_SERVICOS}}, conforme âmbito (*scope*) e entregáveis descritos no **Anexo I**.

## 2. Entregáveis e prazos
Os entregáveis, marcos (*milestones*) e prazos constam do Anexo I. {{REGIME_PRAZOS: ex. os prazos dependem da entrega atempada de inputs pelo Cliente}}.

## 3. Critérios de aceitação
Cada entregável considera-se aceite se o Cliente não comunicar, por escrito e fundamentadamente, não conformidade no prazo de {{DIAS_ACEITACAO}} dias após a entrega.

## 4. Preço e pagamento
Preço: {{VALOR}} {{REGIME: por projeto / por hora / mensal}}, acrescido de IVA à taxa legal. Faturação {{PERIODICIDADE}}; pagamento a {{DIAS_PAGAMENTO}} dias. Em mora, vencem juros à taxa legal comercial (ver `references/valores-2026.md`).

## 5. Propriedade intelectual
{{OPCAO_PI:
 (A) Cessão: o Prestador cede ao Cliente, após pagamento integral, os direitos patrimoniais de autor sobre os entregáveis desenvolvidos especificamente para este contrato. A cessão parcial exige documento escrito com reconhecimento notarial das assinaturas (Art. 43.º CDADC) e a transmissão total e definitiva exige escritura pública com identificação da obra e do preço (Art. 44.º CDADC), sob pena de nulidade — [VERIFICAR] a forma adotada; para software feito por encomenda ver também o Art. 14.º CDADC e o DL 252/94 (a confirmar).
 (B) Licença: o Prestador concede ao Cliente uma licença {{ESCOLHER: exclusiva/não exclusiva}} de uso, retendo a titularidade.}}
O Prestador mantém a titularidade de ferramentas, bibliotecas e know-how preexistentes (*background IP*), concedendo ao Cliente o direito de uso necessário ao funcionamento dos entregáveis.

## 6. Níveis de serviço (SLA) <!-- se aplicável -->
Disponibilidade alvo: {{UPTIME}}; tempo de resposta a incidentes: {{TEMPO_RESPOSTA}}. Penalizações/créditos em caso de incumprimento: {{SLA_PENALIZACOES}}.

## 7. Confidencialidade e proteção de dados
As Partes obrigam-se a confidencialidade recíproca. Quando o Prestador trate dados pessoais por conta do Cliente, aplica-se um **Acordo de Tratamento de Dados (DPA)** nos termos do Art. 28.º RGPD (ver template `dpa-bilingue.md`).

## 8. Responsabilidade
A responsabilidade total do Prestador por danos emergentes deste contrato fica limitada a {{CAP: ex. o valor pago nos 12 meses anteriores ao facto}}. Exclui-se a responsabilidade por danos indiretos, lucros cessantes ou perda de dados não imputáveis ao Prestador. Nenhuma limitação ou exclusão se aplica a danos causados com dolo ou culpa grave, nem a danos pessoais (morte, lesão da integridade física ou da saúde) — Art. 809.º do Código Civil e Art. 18.º, als. a) a d), do DL 446/85.

## 9. Força maior
Nenhuma Parte responde por incumprimento devido a facto fora do seu controlo razoável (Art. 790.º CC).

## 10. Alterações de âmbito (change requests)
Alterações ao âmbito carecem de acordo escrito, com revisão de prazos e preço.

## 11. Duração e cessação
Vigência: {{DURACAO}}. Qualquer Parte pode resolver por incumprimento não sanado em {{DIAS_SANACAO}} dias após interpelação. Em caso de cessação, o Prestador entrega ao Cliente os trabalhos em curso e dados (**exit plan**), mediante pagamento do devido.

## 12. Lei e foro
Lei portuguesa. Foro: {{FORO}}. {{PREENCHER: Para clientes internacionais, ponderar arbitragem — ver contratos-internacionais.md}}.

{{LOCAL}}, {{DATA}}

O Prestador: __________________   O Cliente: __________________

---
**ANEXO I — Âmbito, Entregáveis e Prazos**
{{DETALHE_ANEXO}}

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ Preencher prazos concretos: dias de aceitação (cl. 3), prazo de pagamento (cl. 4) e prazo de sanação (cl. 11); entre empresas, o prazo de pagamento tem limites no DL 62/2013 (a confirmar) e os juros comerciais estão em `references/valores-2026.md`.
- [ ] Propriedade intelectual (cl. 5): a transmissão total e definitiva de direitos patrimoniais de autor exige escritura pública (art. 44.º CDADC) e a parcial documento escrito com reconhecimento notarial das assinaturas (art. 43.º, n.º 2, CDADC) — a cláusula já o diz; confirmar a aplicação ao software (DL 252/94) e, na dúvida, preferir a opção (B) licença ou o template `contrato-desenvolvimento-software.md`.
- [ ] Dados pessoais: se o Prestador tratar dados por conta do Cliente, assinar em simultâneo o `dpa-bilingue.md` (art. 28.º RGPD).
- [ ] Cap de responsabilidade (cl. 8): não cobre dolo nem culpa grave (art. 809.º CC e art. 18.º DL 446/85), nem danos pessoais, e deve estar alinhado com o capital da RC profissional (`references/seguros.md`).
- [ ] Cliente estrangeiro: rever lei aplicável e foro/arbitragem (`references/contratos-internacionais.md`) e IVA (`references/iva-internacional.md` — serviços a empresas da UE: autoliquidação pelo cliente) e retenção na fonte (`references/fiscal.md`); numa versão bilingue, acrescentar cláusula de prevalência linguística.
- [ ] Assinatura por quem obriga cada parte (certidão permanente ou registo do cliente); a assinatura eletrónica qualificada (Cartão de Cidadão/Chave Móvel Digital) serve à distância.
