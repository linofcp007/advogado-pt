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
- [contrato-saas-b2b.md](contrato-saas-b2b.md) — subscrição SaaS B2B PT/EN (SLA, créditos de serviço, dados, mudança de fornecedor — Data Act)

### Distribuição comercial
- [contrato-agencia.md](contrato-agencia.md) — agência com indemnização de clientela, pré-aviso e não concorrência (DL 178/86)
- [contrato-distribuicao.md](contrato-distribuicao.md) — distribuição / concessão comercial (indemnização de clientela por analogia; Reg. UE 2022/720)
- [contrato-franquia.md](contrato-franquia.md) — franquia: saber-fazer, rede, não concorrência (Reg. UE 2022/720)

### RGPD e digital
- [politica-privacidade.md](politica-privacidade.md) — website/app (PT)
- [dpa-bilingue.md](dpa-bilingue.md) — Data Processing Agreement (Art. 28.º RGPD)
- [termos-condicoes-loja-online.md](termos-condicoes-loja-online.md) — e-commerce (DL 24/2014 + DL 84/2021)
- [cookie-policy.md](cookie-policy.md) — política de cookies (ePrivacy + RGPD)
- [registo-atividades-tratamento.md](registo-atividades-tratamento.md) — registo das atividades de tratamento (Art. 30.º RGPD)
- [resposta-pedido-titular-dados.md](resposta-pedido-titular-dados.md) — resposta a pedidos de acesso/apagamento/oposição (Arts. 12.º-22.º RGPD)
- [notificacao-remocao-conteudo.md](notificacao-remocao-conteudo.md) — notice and takedown a plataformas (DSA, art. 16.º)
- [formulario-livre-resolucao.md](formulario-livre-resolucao.md) — formulário de livre resolução para a loja online (DL 24/2014)
- [politica-uso-ia.md](politica-uso-ia.md) — política interna de IA: inventário, ferramentas aprovadas e literacia em IA (Art. 4.º do AI Act)

### Laboral
- [contrato-trabalho-sem-termo.md](contrato-trabalho-sem-termo.md)
- [acordo-teletrabalho.md](acordo-teletrabalho.md)
- [contrato-trabalho-termo-certo.md](contrato-trabalho-termo-certo.md) — contrato a termo certo (motivo justificativo)
- [nota-de-culpa.md](nota-de-culpa.md) — abertura de processo disciplinar
- [carta-despedimento-justa-causa.md](carta-despedimento-justa-causa.md) — decisão final do processo disciplinar
- [acordo-revogacao.md](acordo-revogacao.md) — cessação por mútuo acordo
- [pacto-nao-concorrencia.md](pacto-nao-concorrencia.md) — não concorrência pós-contratual (Art. 136.º CT)
- [politica-prevencao-assedio.md](politica-prevencao-assedio.md) — código de boa conduta contra o assédio (Art. 127.º CT)
- [regulamento-interno.md](regulamento-interno.md) — regulamento interno de empresa (Art. 99.º CT; audição e publicitação)
- [politica-registo-tempos-trabalho.md](politica-registo-tempos-trabalho.md) — registo dos tempos de trabalho e do trabalho suplementar (Arts. 202.º e 231.º CT; 5 anos)
- [politica-monitorizacao-trabalhadores.md](politica-monitorizacao-trabalhadores.md) — meios informáticos, e-mail, geolocalização e monitorização (Arts. 20.º-22.º CT; CNPD)
- [politica-videovigilancia.md](politica-videovigilancia.md) — videovigilância no local de trabalho (Lei 58/2019, arts. 19.º e 28.º; 30 dias)

### Compliance (50 ou mais trabalhadores)
- [plano-prevencao-riscos-corrupcao.md](plano-prevencao-riscos-corrupcao.md) — Plano de Prevenção de Riscos de Corrupção (RGPC, DL 109-E/2021), com matriz de risco e relatórios
- [regulamento-canal-denuncias.md](regulamento-canal-denuncias.md) — canal de denúncia interna (Lei 93/2021: 7 dias, 3 meses, confidencialidade)

### Arrendamento
- [contrato-arrendamento-habitacional.md](contrato-arrendamento-habitacional.md)
- [carta-atualizacao-renda.md](carta-atualizacao-renda.md)
- [contrato-arrendamento-nao-habitacional.md](contrato-arrendamento-nao-habitacional.md) — arrendamento comercial/escritórios (Arts. 1108.º-1113.º CC)
- [contrato-trespasse.md](contrato-trespasse.md) — trespasse de estabelecimento (Art. 1112.º CC; transmissão dos trabalhadores, Art. 285.º CT)

### Tribunais (defesa)
- [oposicao-injuncao.md](oposicao-injuncao.md) — oposição ao requerimento de injunção (⏰ 15 dias; DL 269/98)
- [oposicao-execucao.md](oposicao-execucao.md) — embargos de executado e oposição à penhora (⏰ 20 dias; Arts. 728.º-731.º CPC)

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
- [acordo-parassocial.md](acordo-parassocial.md) — acordo parassocial com vesting, good/bad leaver, tag/drag-along e impasse (Art. 17.º CSC)
- [contrato-cessao-quotas.md](contrato-cessao-quotas.md) — cessão de quota (Arts. 228.º-231.º CSC; registo em 2 meses)

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

> Outros documentos listados nos ficheiros de referência (ex.: licença de software proprietário, contrato de fiança, recurso judicial de contraordenação) são gerados a pedido, seguindo o mesmo estilo e convenções destes templates.
