<!-- Template: resposta do fornecedor de bens ou prestador de serviços a uma reclamação apresentada pelo
     consumidor no LIVRO DE RECLAMAÇÕES — formato eletrónico [E] (Plataforma Digital, livroreclamacoes.pt)
     ou formato físico [F] (folha do livro no estabelecimento).
     Âmbito: nacional
     Base legal: DL 156/2005, de 15 de setembro, na versão consolidada em pgdlisboa.pt (12.ª versão — última
     alteração: DL 102/2026, de 22/05; as alterações de 2025-2026 mexeram no art. 11.º e no anexo, não nos
     artigos abaixo):
     - [E] art. 5.º-B, n.º 4: RESPONDER AO CONSUMIDOR no prazo máximo de 15 DIAS ÚTEIS a contar da data da
       reclamação (salvo prazo inferior em lei especial), para o endereço de correio eletrónico indicado no
       formulário, informando-o, quando aplicável, das medidas adotadas; n.º 5 (aplica-se o art. 5.º, n.º 2:
       a resposta acompanha a reclamação junto da entidade competente).
     - [F] art. 5.º, n.º 1: REMETER O ORIGINAL da folha de reclamação à entidade de controlo de mercado ou
       reguladora do setor (art. 11.º e anexo; na falta, à entidade de acreditação; na falta desta, à ASAE)
       no prazo de 15 DIAS ÚTEIS, salvo prazo distinto em lei especial; n.º 2, al. a) (acompanhada da
       resposta já enviada ao consumidor, quando aplicável); n.º 3 (pode juntar esclarecimentos e o
       seguimento dado); n.º 4 (duplicado para o consumidor, triplicado fica no livro); art. 5.º-A (envio por
       via eletrónica quando a entidade o determine ou o fornecedor opte).
     - Prazo de resposta ao consumidor no livro FÍSICO: a lei geral não fixa um; só os prestadores de serviços
       públicos essenciais (Lei 23/96) têm de responder em 15 DIAS ÚTEIS a contar da reclamação (art. 3.º,
       n.º 5). Boa prática: responder no mesmo prazo e juntar a resposta ao envio do original.
     - Contraordenações (art. 9.º, regime do RJCE): não enviar o original e os elementos (art. 5.º, n.os 1 e 2)
       é GRAVE; não responder no livro eletrónico (art. 5.º-B, n.º 4) é LEVE; serviços públicos essenciais
       (art. 3.º, n.º 5) é LEVE.
     - Lei 144/2015, art. 18.º: dever de informar o consumidor das entidades de resolução alternativa de
       litígios (RAL) a que a empresa está vinculada, com o respetivo sítio na Internet.
     A resposta pode ser lida pela entidade reguladora: tom factual e cortês, sem ataques ao consumidor nem
     dados pessoais de terceiros. -->

{{EMPRESA_NOME}}
{{EMPRESA_MORADA}}
NIF: {{EMPRESA_NIF}}
Estabelecimento: {{ESTABELECIMENTO: nome e morada do estabelecimento ou sítio da Internet a que respeita a reclamação}}

{{RECLAMANTE_NOME}}
{{RECLAMANTE_CONTACTO: [E] endereço de correio eletrónico indicado no formulário da Plataforma Digital / [F] morada indicada na folha de reclamação}}

{{LOCAL}}, {{DATA}}

**ASSUNTO: Resposta à reclamação apresentada em {{DATA_RECLAMACAO}} no Livro de Reclamações {{FORMATO: eletrónico — reclamação n.º … / físico — folha n.º …}}**

Exmo(a). Senhor(a) {{RECLAMANTE_NOME}},

Acusamos a receção da reclamação que apresentou em {{DATA_RECLAMACAO}}, relativa a {{OBJETO_RECLAMACAO: ex. atraso na entrega da encomenda n.º … / qualidade do serviço prestado em … / cobrança de …}}, que mereceu a nossa melhor atenção.

**1. A situação reclamada**

Segundo a sua reclamação, {{RESUMO_RECLAMACAO: resumo fiel e neutro do que o consumidor relatou}}.

**2. O que apurámos**

Analisada a situação, verificámos que {{FACTOS_APURADOS: factos objetivos, com datas e documentos — ex. a encomenda foi expedida em … , com o número de seguimento … ; o equipamento foi reparado em … ao abrigo da garantia}}.

**3. A nossa posição e as medidas adotadas**

{{POSICAO: escolher uma das alternativas e apagar as restantes}}

- {{PROCEDENTE: Reconhecemos que a situação não correspondeu ao que lhe era devido e pedimos desculpa pelo incómodo causado. Para a resolver, … (solução concreta).}}
- {{PARCIALMENTE_PROCEDENTE: Reconhecemos que … . Quanto a … , porém, … , pelo que propomos … .}}
- {{IMPROCEDENTE: Pelas razões expostas no ponto anterior, entendemos que … . Ainda assim, … (gesto comercial opcional, sem reconhecimento de responsabilidade).}}

{{MEDIDAS: opcional — Para evitar situações semelhantes, adotámos as seguintes medidas: … (art. 5.º-B, n.º 4, do DL 156/2005).}}

{{SOLUCAO_PRAZO: opcional — A solução indicada será concretizada até … , através de … (reembolso para o IBAN que nos indicar / troca / reparação / crédito em conta).}}

**4. Resolução alternativa de litígios**

Caso não concorde com esta resposta, poderá recorrer à entidade de resolução alternativa de litígios de consumo {{ENTIDADE_RAL: nome da entidade de RAL a que a empresa está vinculada}}, {{URL_RAL: sítio da Internet da entidade}} (art. 18.º da Lei n.º 144/2015, de 8 de setembro).

Uma cópia desta resposta segue para {{ENTIDADE_COMPETENTE: entidade de controlo de mercado ou reguladora do setor — ex. ASAE / ERSE / ANACOM / Banco de Portugal / Entidade Reguladora da Saúde}}, juntamente com a reclamação, nos termos do DL 156/2005.

Ficamos ao dispor para qualquer esclarecimento através de {{CONTACTO_RESPOSTA: email / telefone de apoio ao cliente}}.

Com os melhores cumprimentos,

_______________________________
{{SIGNATARIO_NOME}}, {{SIGNATARIO_FUNCAO}}
{{EMPRESA_NOME}}

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ **[E] Livro eletrónico**: responder ao consumidor em **15 dias úteis** a contar da data da reclamação, para o email indicado no formulário (DL 156/2005, art. 5.º-B, n.º 4), salvo prazo inferior em lei especial do setor [VERIFICAR]. Contar com `calc_prazo` (tipo `uteis`) e registar o prazo com `registar_prazo`.
- [ ] ⏰ **[F] Livro físico**: remeter o **original** da folha de reclamação à entidade competente em **15 dias úteis**, acompanhado da resposta já enviada ao consumidor, quando exista (art. 5.º, n.os 1 e 2 — contraordenação grave se faltar); por via eletrónica se a entidade o exigir (art. 5.º-A). O duplicado fica com o consumidor e o triplicado no livro (art. 5.º, n.º 4).
- [ ] Entidade competente certa: a do setor indicada no art. 11.º e no anexo do DL 156/2005 (o anexo foi alterado em 2025 e 2026 — confirmar a versão em vigor); na falta, a entidade de acreditação ou a ASAE (art. 5.º, n.º 1, als. b) a d)). É a mesma que consta do letreiro afixado no estabelecimento (art. 3.º, n.º 1, al. c), subal. ii)).
- [ ] Serviço público essencial (água, eletricidade, gás canalizado, comunicações eletrónicas, serviços postais, águas residuais, resíduos urbanos, transporte de passageiros — Lei 23/96, art. 1.º, n.º 2): resposta ao consumidor em **15 dias úteis** também no livro físico (art. 3.º, n.º 5).
- [ ] Conteúdo: factos verificáveis e datas; medidas adotadas, quando aplicável (art. 5.º-B, n.º 4); nada de dados pessoais de terceiros nem de trabalhadores identificados (RGPD — `references/rgpd.md`); não admitir responsabilidade que não se reconhece. Se o consumidor pede reembolso ou garantia, confirmar os prazos legais em `references/consumo.md`.
- [ ] RAL: indicar a entidade de RAL a que a empresa está **realmente** vinculada e o seu sítio na Internet (Lei 144/2015, art. 18.º) — ver a lista do CNIACC/DGC [VERIFICAR a adesão da empresa].
- [ ] Guardar cópia da resposta, comprovativo de envio e (no físico) comprovativo da remessa do original — arquivo dos livros encerrados durante pelo menos 3 anos (art. 3.º, n.º 1, al. d); art. 5.º-A, n.º 3).
- [ ] Apagar as alternativas do ponto 3 que não se aplicam, os comentários `<!-- -->` e os campos opcionais não usados.
