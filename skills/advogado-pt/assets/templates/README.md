# Templates de Documentos Jurídicos

Esqueletos reais e reutilizáveis. Quando o utilizador pede um documento, **parte do template correspondente** em vez de redigir do zero — garante estrutura completa, cláusulas essenciais e foro/lei aplicável corretos.

## Como usar

1. Lê o template aplicável (o comentário de topo diz o **âmbito** — `nacional`, `ue` ou `misto` — e a base legal).
2. Substitui todos os `{{PLACEHOLDERS}}` pelos dados do caso (pede ao utilizador os que faltarem).
3. Adapta cláusulas ao caso concreto — os templates são pontos de partida, não camisas-de-forças.
4. Confirma valores/taxas em `references/valores-2026.md`.
5. Remove notas entre `<!-- ... -->` (são instruções para ti, não para o documento final).
6. Cada template termina com **`## Antes de enviar — verificar`**: é uma lista para quem envia, **não faz parte do documento**. Entrega-a ao utilizador **separada** do documento final, já preenchida com os prazos ⏰ do caso.

## Convenção de marcas

| Marca | Significa | O que fazer |
|---|---|---|
| `{{CAMPO}}` | Dado a preencher (nomes, datas, valores) | Pedir ao utilizador; nunca inventar |
| `{{CAMPO: opcional — texto}}` | Cláusula ou parágrafo opcional | Manter só se se aplicar ao caso |
| `[VERIFICAR]` | Facto, norma ou valor a confirmar antes de enviar | Confirmar (dre.pt, `valores-2026.md`, documentos do caso) e só depois retirar a marca |
| `(a confirmar)` | Citação que não foi confirmada em fonte oficial | Confirmar antes de a usar como fundamento |

## Convenção de placeholders

- `{{REMETENTE_NOME}}`, `{{REMETENTE_NIF}}`, `{{REMETENTE_MORADA}}`
- `{{DESTINATARIO_NOME}}`, `{{DESTINATARIO_NIF}}`, `{{DESTINATARIO_MORADA}}`
- `{{DATA}}`, `{{LOCAL}}`, `{{VALOR}}`, `{{Nº_FATURA}}`, `{{DATA_VENCIMENTO}}`
- `{{PRAZO_DIAS}}`, `{{IBAN}}`

## Índice

### Cobranças e dívidas
- [carta-cobranca-amigavel.md](carta-cobranca-amigavel.md) — 1.º lembrete cordial
- [carta-cobranca-formal-registada.md](carta-cobranca-formal-registada.md) — interpelação final com AR
- [reconhecimento-divida.md](reconhecimento-divida.md) — reconhecimento de dívida (interrompe a prescrição; título executivo se autenticado)
- [acordo-pagamento-faseado.md](acordo-pagamento-faseado.md) — plano de pagamentos com vencimento antecipado
- [requerimento-injuncao.md](requerimento-injuncao.md) — guião de injunção (Citius/BNI)
- [reclamacao-creditos-insolvencia.md](reclamacao-creditos-insolvencia.md) — reclamar créditos na insolvência/PER/PEAP de um cliente

### Contratos e disputas
- [contrato-prestacao-servicos-ti.md](contrato-prestacao-servicos-ti.md) — serviços de tecnologia/consultoria
- [nda-bilingue.md](nda-bilingue.md) — acordo de confidencialidade PT/EN
- [carta-interpelacao-incumprimento.md](carta-interpelacao-incumprimento.md) — interpelação admonitória (Art. 808.º CC)
- [notificacao-resolucao-contrato.md](notificacao-resolucao-contrato.md) — resolução por incumprimento (Art. 432.º CC)
- [contrato-desenvolvimento-software.md](contrato-desenvolvimento-software.md) — desenvolvimento por encomenda + cessão de direitos (PT/EN)

### RGPD e digital
- [politica-privacidade.md](politica-privacidade.md) — website/app (PT)
- [dpa-bilingue.md](dpa-bilingue.md) — Data Processing Agreement (Art. 28.º RGPD)
- [termos-condicoes-loja-online.md](termos-condicoes-loja-online.md) — e-commerce (DL 24/2014 + DL 84/2021)
- [cookie-policy.md](cookie-policy.md) — política de cookies (ePrivacy + RGPD)
- [registo-atividades-tratamento.md](registo-atividades-tratamento.md) — registo das atividades de tratamento (Art. 30.º RGPD)
- [resposta-pedido-titular-dados.md](resposta-pedido-titular-dados.md) — resposta a pedidos de acesso/apagamento/oposição (Arts. 12.º-22.º RGPD)
- [notificacao-remocao-conteudo.md](notificacao-remocao-conteudo.md) — notice and takedown a plataformas (DSA, art. 16.º)
- [formulario-livre-resolucao.md](formulario-livre-resolucao.md) — formulário de livre resolução para a loja online (DL 24/2014)

### Laboral
- [contrato-trabalho-sem-termo.md](contrato-trabalho-sem-termo.md)
- [acordo-teletrabalho.md](acordo-teletrabalho.md)
- [contrato-trabalho-termo-certo.md](contrato-trabalho-termo-certo.md) — contrato a termo certo (motivo justificativo)
- [nota-de-culpa.md](nota-de-culpa.md) — abertura de processo disciplinar
- [carta-despedimento-justa-causa.md](carta-despedimento-justa-causa.md) — decisão final do processo disciplinar
- [acordo-revogacao.md](acordo-revogacao.md) — cessação por mútuo acordo
- [pacto-nao-concorrencia.md](pacto-nao-concorrencia.md) — não concorrência pós-contratual (Art. 136.º CT)
- [politica-prevencao-assedio.md](politica-prevencao-assedio.md) — código de boa conduta contra o assédio (Art. 127.º CT)

### Arrendamento
- [contrato-arrendamento-habitacional.md](contrato-arrendamento-habitacional.md)
- [carta-atualizacao-renda.md](carta-atualizacao-renda.md)

### Contraordenações
- [defesa-contraordenacao.md](defesa-contraordenacao.md) — defesa escrita genérica

### Fisco (defesa perante a AT)
- [direito-audicao-previa.md](direito-audicao-previa.md) — audição prévia / projeto de relatório de inspeção (Art. 60.º LGT)
- [reclamacao-graciosa.md](reclamacao-graciosa.md) — reclamação graciosa de uma liquidação (Arts. 68.º e ss. CPPT)
- [pedido-pagamento-prestacoes-at.md](pedido-pagamento-prestacoes-at.md) — prestações em execução fiscal e dispensa de garantia
- [pedido-informacao-vinculativa.md](pedido-informacao-vinculativa.md) — pedir à AT um entendimento vinculativo (Art. 68.º LGT)

### Sociedades
- [pacto-social-unipessoal-lda.md](pacto-social-unipessoal-lda.md) — contrato de sociedade unipessoal por quotas (base para Lda)
- [decisao-socio-unico.md](decisao-socio-unico.md) — decisões do sócio único (contas, gerência, sede, lucros)

### Propriedade intelectual
- [carta-cessacao-violacao-pi.md](carta-cessacao-violacao-pi.md) — cease and desist (marca, direitos de autor, concorrência desleal)

### Banca
- [reclamacao-banco-operacao-nao-autorizada.md](reclamacao-banco-operacao-nao-autorizada.md) — fraude/phishing: pedir reembolso ao banco (DL 91/2018)

### União Europeia
- [queixa-comissao-europeia.md](queixa-comissao-europeia.md) — queixa por incumprimento do direito da UE (Art. 258.º TFUE)

### Imobiliário
- [contrato-promessa-compra-venda.md](contrato-promessa-compra-venda.md) — CPCV de imóvel (sinal, execução específica)

### Seguros
- [carta-participacao-sinistro.md](carta-participacao-sinistro.md) — participação de sinistro à seguradora

### Garantias
- [livranca-pacto-preenchimento.md](livranca-pacto-preenchimento.md) — livrança em branco + pacto de preenchimento

### Heranças
- [acordo-partilha-extrajudicial.md](acordo-partilha-extrajudicial.md)

### Processo e análise
- [intake-caso.md](intake-caso.md) — ficha de recolha inicial de um caso novo
- [parecer-juridico.md](parecer-juridico.md) — estrutura de parecer (situação→opções→recomendação)

> Outros documentos listados nos ficheiros de referência (ex.: licença de software proprietário, contrato a termo certo, recurso judicial de contraordenação) são gerados a pedido, seguindo o mesmo estilo e convenções destes templates.
