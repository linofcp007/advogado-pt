# Playbook: Faturar a um cliente estrangeiro (IVA)

> Quando usar: vais faturar a um cliente com sede ou residência fora de Portugal (empresa ou consumidor, na UE ou fora dela), ou vender bens que saem de Portugal. Serve para decidir se cobras IVA, que menção pões na fatura, que declarações entregas e que provas guardas. Âmbito: misto. A fundamentação está em `references/iva-internacional.md`. Antes de começar, confirma no perfil (`.juridico-pt/perfil-empresa.md` ou `obter_perfil_empresa`) o teu regime de IVA: normal mensal, normal trimestral ou isenção do art. 53.º. Valores e limiares: `references/valores-2026.md`.

## Passo 0 — Não percas prazos

- ⏰ **Fatura**:
  - regra: até ao **5.º dia útil** seguinte ao momento em que o imposto é devido (art. 36.º, n.º 1, al. a), CIVA);
  - serviços a empresas da UE: até ao **dia 15 do mês seguinte** (al. b)).
- ⏰ **Declaração recapitulativa** (bens e serviços a empresas da UE):
  - até ao **dia 20 do mês seguinte** se és mensal, ou do **mês seguinte ao fim do trimestre** se és trimestral (art. 30.º RITI);
  - passa a mensal acima do limiar de transmissões intracomunitárias de bens (50.000 € por trimestre — `references/valores-2026.md`);
  - ⚠️ sem ela, a isenção dos bens cai (art. 14.º, n.º 2, RITI).
- ⏰ **Declaração periódica (DP)**:
  - até ao **dia 20 do 2.º mês seguinte** ao mês ou ao trimestre (art. 41.º, n.º 1, CIVA); junho e o 2.º trimestre vão até **20 de setembro** (n.º 10);
  - **pagamento** até ao **dia 25 do 2.º mês seguinte** (art. 27.º, n.º 1).
- ⏰ **OSS** (vendas à distância e serviços eletrónicos a consumidores da UE acima do limiar): declaração e pagamento **trimestrais**, até ao **fim do mês seguinte** ao trimestre, ou seja, 30/4, 31/7, 31/10 e 31/1 (Anexo I à Lei 47/2020, arts. 6.º e 13.º).
- ⏰ **IOSS** (bens importados vendidos a consumidores da UE): declaração **mensal**, até ao fim do mês seguinte (art. 27.º do regime).
- ⏰ **Regime do art. 53.º**:
  - se exportares ou passares o limiar com a margem de tolerância, entrega a declaração de alterações em **15 dias úteis** (art. 58.º, n.º 5, CIVA);
  - se compraste serviços a fornecedores estrangeiros, declara e paga o IVA autoliquidado até ao **fim do mês seguinte** (art. 27.º, n.º 3).
- ⏰ **Regime transfronteiriço PME**:
  - declaração trimestral até ao **fim do mês seguinte** ao trimestre (art. 58.º-B, n.º 4);
  - **15 dias úteis** para comunicar que passaste o limiar da UE (art. 58.º-C, n.º 1, al. d)).
- **Agenda**: gera o calendário com `calendario_obrigacoes` e regista os prazos da operação com `registar_prazo`.

## Fluxo de decisão

0. **Corre o decisor** com os dados da operação e confirma o resultado nos passos seguintes:
   ```text
   calc_iva_operacao  tipo=<bens|servicos>  cliente=<empresa|consumidor>  destino=<PT|UE|fora-UE>  nifVIES=<true|false>  vendasDistanciaUE=<total do ano>  servico=<geral|eletronico|imovel|evento|transporte-passageiros|restauracao>
   ```
   - O decisor cobre os cenários típicos. Se devolver "regime especial — confirmar", segue os passos à mão e vê `references/iva-internacional.md`.
   - Ficam fora do decisor, entre outros: o art. 53.º, as operações em cadeia, os impostos especiais de consumo e o regime da margem.

1. **Estás no regime de isenção do art. 53.º?** → se SIM: vai ao passo 9 · se NÃO (regime normal): passo 2.

2. **Vendes bens ou serviços?**
   - **Bens**, incluindo hardware → passo 3.
   - **Serviços**, incluindo SaaS, licenças, desenvolvimento, consultoria, marketing e formação → passo 6.
   - **Pacote misto**: decide pela prestação principal (a confirmar caso a caso).

3. **Bens: para onde vão fisicamente?**
   - **Não saem de PT** (entregas cá e ficam cá): IVA português, como numa venda nacional (art. 6.º, n.º 1, CIVA).
   - **Saem para outro Estado-Membro** → passo 4.
   - **Saem para fora da UE** → passo 5. ⚠️ Canárias, Ceuta e Melilha contam como fora da UE para o IVA (a confirmar).

4. **Bens para a UE: o cliente é uma empresa com número de IVA válido no VIES?** Consulta em ec.europa.eu/taxation_customs/vies e guarda o comprovativo datado.
   - **SIM, e vais ter prova do transporte** → transmissão intracomunitária isenta (art. 14.º, n.º 1, al. a), RITI):
     - **fatura** sem IVA, com "Isento artigo 14.º do RITI" (código **M16**) e o número de IVA do cliente com o prefixo do país;
     - **DP**: campo 7, com o Quadro 04 assinalado;
     - ⏰ **declaração recapitulativa** no prazo.
   - **Prova do transporte** (Reg. 282/2011, art. 45.º-A; Ofício-Circulado 30218/2020): dois documentos independentes e não contraditórios, por exemplo o CMR assinado e a fatura do transportador, ou um documento de transporte mais o seguro ou o pagamento do frete. Se é o **cliente que transporta**, junta a declaração escrita dele, ⏰ entregue até ao **dia 10 do mês seguinte**.
   - **SIM, mas sem prova possível** (ex.: EXW e o cliente não te dá documentos) → fatura **com IVA português**. Se a prova chegar depois, vê a regularização com o contabilista (a confirmar).
   - **NÃO** (consumidor, ou número inválido ou ausente) → é uma **venda à distância**:
     - Soma, sem IVA, as vendas à distância para a UE e os serviços eletrónicos a consumidores de outros EM, no ano anterior e no corrente.
     - **Até ao limiar comum UE** (`references/valores-2026.md`): **IVA português**.
     - **Acima** (ou se optaste pelo destino, por 2 anos — art. 6.º-A, n.º 4): **IVA do país do consumidor**, a partir da venda que ultrapassa o limiar (art. 6.º-A, n.º 3). Regista-te no **OSS** no Portal das Finanças; produz efeitos desde a 1.ª venda se o comunicares até ao **dia 10 do mês seguinte**. Faturas com a taxa do país de destino e ⏰ declaração trimestral.

5. **Bens para fora da UE (exportação)** → isenta (art. 14.º, n.º 1, als. a) e b), CIVA), seja o cliente empresa ou consumidor:
   - **fatura** sem IVA, com "Isento artigo 14.º do CIVA" (código **M05**);
   - **DP**: campo 8;
   - **prova**: guarda a **declaração aduaneira com certificação de saída**, ou o certificado de exportação simplificado (art. 29.º, n.º 8). ⚠️ Sem ela, liquidas tu o IVA (n.º 9).
   - **Vendes a consumidores da UE bens enviados de fora da UE** (*dropshipping*)? → **IOSS** até ao limite por remessa (150 € — `references/valores-2026.md`); acima dele, o IVA é cobrado na importação.

6. **Serviços: há uma regra especial de localização?** (art. 6.º, n.ºs 7 e 8, CIVA)
   - **Casos especiais**: serviço ligado a um **imóvel**; **acesso presencial a evento**, conferência, feira ou formação presencial; **restauração**; **transporte de passageiros**; **aluguer de curta duração** de veículo ou barco.
   - **SIM e acontece em PT** → **IVA português**, mesmo com cliente estrangeiro. O transporte internacional de passageiros está isento (art. 14.º, n.º 1, al. r)), com o código M05.
   - **SIM e acontece noutro país**:
     - **fatura** sem IVA português, com "IVA – Regras específicas - artigo 6.º" (código **M44**);
     - **DP**: campo 8;
     - ⚠️ podes ter de te **registar para IVA nesse país** (a confirmar caso a caso).
   - **NÃO** → passo 7.

7. **Serviços: o cliente é uma empresa?**
   - **Empresa da UE com número válido no VIES** → regra geral (art. 6.º, n.º 6, al. a)):
     - não há IVA português; o cliente autoliquida;
     - **fatura** com "IVA - autoliquidação" (código **M40**; art. 36.º, n.º 13), ⏰ até ao dia 15 do mês seguinte;
     - **DP**: campo 7 + Quadro 04;
     - ⏰ **declaração recapitulativa** (art. 29.º, n.º 1, al. i)).
   - **Empresa da UE sem número válido** → pede o número **antes** de faturar. Sem ele, trata o cliente como consumidor (Reg. 282/2011, art. 18.º, n.º 2) → passo 8.
   - **Empresa fora da UE** → não tributado em PT:
     - **fatura** sem IVA com a menção "IVA - autoliquidação" (código M40 — confirmado pela AT nas informações vinculativas 16210 e 27890);
     - **DP**: campo 8, sem declaração recapitulativa;
     - **prova** de que é empresa: certificado fiscal, número de empresa ou registo (art. 18.º, n.º 3).
   - **Consumidor** → passo 8.

8. **Serviços a consumidor:**
   - **Serviço eletrónico, de telecomunicações ou de radiodifusão** (SaaS, apps, *downloads*, *streaming*, alojamento — Anexo D do CIVA)?
     - **Consumidor da UE**: IVA português até ao **limiar comum UE**; acima dele, IVA do país do consumidor via **OSS** (art. 6.º-A).
     - **Consumidor fora da UE**: não tributado em PT (art. 6.º, n.º 9, al. h)), com M44 e DP campo 8. Vê se o país do cliente exige registo a prestadores digitais (a confirmar).
     - Guarda prova do país do cliente: morada de faturação, IP, cartão ou banco.
   - **Outro serviço, a consumidor da UE** → IVA português, desde a primeira fatura (o limiar comum não se aplica).
   - **Outro serviço, a consumidor fora da UE**: está na lista do **art. 6.º, n.º 11**? (direitos de autor e licenças, publicidade, consultoria, engenharia, advocacia, contabilidade e estudos, tratamento de dados e informações, operações financeiras e seguros, cedência de pessoal, aluguer de bens móveis exceto veículos)
     - **SIM** → não tributado em PT: M44, DP campo 8;
     - **NÃO** → IVA português.

9. **Ramo art. 53.º (isento):**
   - **Vais exportar bens para fora da UE?** → **perdes a isenção** a partir dessa operação (art. 53.º, n.º 1; art. 58.º, n.os 2, al. c), e 4, al. c)). ⏰ Declaração de alterações em 15 dias úteis; fala já com o contabilista.
   - **Bens a empresa da UE** → isentos pelo art. 53.º, não pelo RITI (art. 14.º, n.º 7, RITI): fatura com "IVA – regime de isenção" (código **M10**), sem declaração recapitulativa.
   - **Serviços a empresa (UE ou fora)** → não são tributados em PT pela regra geral:
     - fatura com "IVA – regime de isenção", obrigatória em todas as faturas (art. 57.º, n.º 2);
     - estás dispensado da declaração recapitulativa (Ofício-Circulado 25062/2025, ponto 28);
     - confirma com o contabilista se acrescentas "IVA - autoliquidação" (a confirmar).
   - **Bens à distância ou serviços eletrónicos a consumidores da UE** → até ao limiar comum, M10; acima dele, o IVA é devido no país do consumidor: fala com o contabilista sobre o OSS (a confirmar).
   - **Queres faturar isento noutros Estados-Membros?** → regime transfronteiriço PME (arts. 58.º-A a 58.º-D):
     - **condições**: volume de negócios na UE até ao limiar (100.000 € — `references/valores-2026.md`) e notificação prévia na aplicação "SME" do Portal das Finanças;
     - número com sufixo **EX**, atribuído em até 35 dias úteis;
     - **fatura**: código **M45**, "IVA – regime transfronteiriço de isenção";
     - ⏰ **declaração trimestral**.
   - **Compras serviços a fornecedores estrangeiros** (publicidade online, software, alojamento)? → tens de **autoliquidar o IVA português**, sem dedução (art. 2.º, n.º 1, al. e), e art. 53.º, n.º 3). ⏰ Declaras e pagas até ao fim do mês seguinte (art. 27.º, n.º 3).
   - Controla o volume de negócios todos os meses face ao limiar e à margem de tolerância (`references/valores-2026.md`).

10. **Emite a fatura**, num programa certificado, e verifica:
    - os dados do cliente, com o **número de IVA e o prefixo do país** nas vendas B2B da UE;
    - a descrição do bem ou serviço e a data da operação;
    - o valor sem IVA;
    - a **taxa** aplicada (portuguesa, do outro EM ou nenhuma);
    - o **motivo da não liquidação** e o **código** certo (M05, M10, M16, M40, M44, M45 — tabela em `references/iva-internacional.md`), que segue na comunicação à AT;
    - a língua: fatura bilingue se o cliente precisar (a confirmar requisitos do país do cliente).

11. **Declara e arquiva**:
    - inscreve a operação no **campo certo da DP**: 7 nas intracomunitárias com declaração recapitulativa; 8 nas exportações, nos serviços B2B fora da UE e nas exceções do art. 6.º;
    - entrega a **declaração recapitulativa** e o **OSS** quando aplicáveis;
    - arquiva o dossier de prova;
    - ⚠️ para os períodos a partir de **1/7/2027**, a DP tem um novo modelo, com campos diferentes (Portaria 298/2026/1).

### Ramo — Já faturei mal

- **Cobraste IVA que não devias, ou não cobraste o que devias?** → emite o **documento retificativo** (nota de crédito ou de débito — art. 29.º, n.º 7, CIVA) e regulariza na DP com o contabilista (art. 78.º CIVA; prazos e condições a confirmar).
- **Esqueceste uma declaração recapitulativa?** → entrega-a já: a correção justificada pode salvar a isenção (art. 14.º, n.º 2, RITI), embora haja coima.
- **Já chegou uma notificação ou inspeção da AT?** → `playbooks/recebi-notificacao-at.md`.

### Ramo — A operação não encaixa (cadeias, triangulares, estabelecimento no estrangeiro)

- Operações em cadeia (art. 14.º, n.os 3 a 5, RITI), operações triangulares (art. 8.º, n.º 3, RITI, código M41), *call-off stock*, bens com impostos especiais de consumo e regime da margem → **não faturar sem parecer** do contabilista ou do consultor fiscal.
- Dúvida séria e valor relevante → pede uma **informação vinculativa** à AT (art. 68.º LGT): `assets/templates/pedido-informacao-vinculativa.md`.

## Documentos a usar

- `references/iva-internacional.md` — regras por cenário, tabela de códigos, OSS e IOSS, art. 53.º, regime transfronteiriço, aquisições
- `references/fiscal.md` — IVA nacional, taxas e faturação
- `references/uniao-europeia.md` — mercado interno e resumo de IVA intracomunitário
- `references/contratos-internacionais.md` — lei aplicável, foro e cláusulas (Incoterms, impostos) no contrato
- `assets/checklists/checklist-loja-online.md` — e-commerce B2C, incluindo OSS e IOSS
- `assets/templates/termos-condicoes-loja-online.md` — preços com o IVA do país do consumidor
- `assets/templates/contrato-prestacao-servicos-ti.md` — cláusula de preço sem IVA e autoliquidação pelo cliente
- `assets/templates/pedido-informacao-vinculativa.md` — confirmar o enquadramento com a AT
- `references/valores-2026.md` — limiar comum UE, limiar do art. 53.º e periodicidade da DP
- `calc_iva_operacao` (tool MCP) — onde se tributa, quem liquida, menção, declarações e base legal
- `calendario_obrigacoes` e `registar_prazo` (tools MCP) — prazos da DP, da declaração recapitulativa e do OSS
- **Dossier de prova a guardar** (por fatura):
  - comprovativo da consulta ao VIES, com data;
  - CMR, fatura do transportador, seguro ou pagamento do frete e declaração do cliente (bens para a UE);
  - declaração aduaneira com certificação de saída (exportação);
  - prova do país do consumidor (serviços eletrónicos);
  - prova de que o cliente de fora da UE é empresa;
  - contrato ou encomenda e comprovativo de pagamento.
  Conserva tudo pelo prazo de arquivo fiscal (ver `references/fiscal.md`); os registos do OSS guardam-se 10 anos (Anexo I à Lei 47/2020, art. 9.º, n.º 3).

## Quando chamar contabilista certificado ou advogado

- **Contabilista certificado**:
  - preenchimento da DP, da declaração recapitulativa e do OSS;
  - registo no OSS ou IOSS;
  - transição do art. 53.º para o regime normal;
  - regularizações de faturas;
  - adaptação ao novo modelo da DP em 2027.
- **Consultor fiscal ou advogado**:
  - operações em cadeia ou triangulares;
  - risco de **estabelecimento estável** noutro país (equipa ou armazém no estrangeiro);
  - registo para IVA noutros Estados-Membros;
  - pedido de informação vinculativa;
  - inspeção ou liquidação adicional da AT.
- **Sempre** que vás faturar sem IVA um valor relevante sem teres o VIES validado ou a prova do transporte assegurada: o IVA em falta fica a teu cargo.
