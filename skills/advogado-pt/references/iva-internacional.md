# IVA em Operações Internacionais

> **Âmbito:** misto
> 💶 **Valores, taxas e montantes:** consulta `references/valores-2026.md` (ponto único de verdade). Lá estão o limiar comum UE das vendas à distância e dos serviços eletrónicos a consumidores, o limiar e a margem de tolerância do art. 53.º e o limiar da periodicidade mensal da declaração periódica. O limite por remessa do IOSS, o limiar UE do regime transfronteiriço PME, o limiar da declaração recapitulativa mensal e o limiar das aquisições do art. 5.º RITI → todos em `references/valores-2026.md` (secções IVA e Concorrência e UE).
> 🧮 **Decisor:** a tool `calc_iva_operacao` devolve onde se tributa, quem liquida, a menção na fatura, as declarações e a base legal (ver "Como usar o decisor").
> Remete para: `references/fiscal.md` (IVA nacional, taxas, faturação), `references/uniao-europeia.md` (mercado interno), `references/contratos-internacionais.md` (lei aplicável, foro, Incoterms no contrato), `assets/checklists/checklist-loja-online.md` (e-commerce B2C) e `playbooks/faturar-cliente-estrangeiro.md` (passo a passo).

## Legislação Base
- **Código do IVA (CIVA)** — DL 394-B/84:
  - art. 2.º, n.º 1, al. e): autoliquidação nas aquisições de serviços a prestadores não estabelecidos em PT;
  - art. 6.º: localização das operações (n.º 1 bens; n.º 6 regra geral dos serviços; n.ºs 7 a 15 exceções; redação do DL 33/2025 para eventos e *streaming*);
  - art. 6.º-A: limiar comum UE para vendas à distância e serviços eletrónicos a consumidores (Lei 47/2020);
  - art. 14.º: isenção nas exportações e no transporte internacional de pessoas;
  - art. 27.º: pagamento do imposto; art. 41.º: prazo da declaração periódica (redação do DL 49/2025);
  - art. 29.º: obrigações (n.º 1, al. i): declaração recapitulativa dos serviços B2B UE; n.ºs 8 e 9: prova da exportação);
  - art. 36.º: fatura (n.º 1: prazos; n.º 5, al. e): motivo da não liquidação; n.º 13: menção "IVA - autoliquidação");
  - arts. 53.º, 57.º e 58.º: regime de isenção das pequenas empresas; arts. 58.º-A a 58.º-D: regime transfronteiriço (DL 35/2025).
- **Regime do IVA nas Transações Intracomunitárias (RITI)** — DL 290/92: art. 5.º (derrogação nas aquisições), art. 8.º (localização das aquisições; n.º 3, operações triangulares), arts. 10.º e 11.º (vendas à distância), art. 14.º (isenção das transmissões intracomunitárias; n.º 2, a declaração recapitulativa como condição; n.º 7, exclusão do art. 53.º), arts. 23.º e 30.º (obrigações e declaração recapitulativa).
- **Lei 47/2020**, de 24 de agosto — pacote IVA do comércio eletrónico (em vigor desde 1/7/2021). O **Anexo I** aprova os regimes especiais do balcão único: regime da União (OSS), regime extra-União e regime de importação (IOSS).
- **Diretiva 2006/112/CE** (Diretiva IVA) e **Regulamento de Execução (UE) 282/2011**: art. 18.º (prova do estatuto do cliente, VIES), art. 45.º-A (prova do transporte intracomunitário, aditado pelo Reg. 2018/1912) e art. 57.º-D (início do OSS).
- **DL 35/2025**, de 24 de março — novo regime de isenção das pequenas empresas, interno e transfronteiriço (transpõe a Diretiva (UE) 2020/285; em vigor desde 1/7/2025).
- **Portaria 302/2016** — estrutura do SAF-T e tabela dos códigos de motivo de isenção ou de não liquidação (versão 4.0 da tabela, de 18/06/2026, no Portal das Finanças).
- **Portaria 221/2017** (modelo da declaração periódica), alterada pela **Portaria 298/2026/1**, de 16 de julho: novo modelo para os períodos a partir de **1/7/2027**.
- **Doutrina da AT**: Ofício-Circulado 30218/2020 (prova do transporte), 30238/2021 e 30240/2021 (comércio eletrónico e balcão único), 25062/2025 e 25065/2025 (regime de isenção, interno e transfronteiriço).
- **Fontes**: textos consolidados em info.portaldasfinancas.gov.pt (CIVA e RITI) e dre.pt; legislação da UE em eur-lex.europa.eu.

## Como decidir: as quatro perguntas
1. **Bens ou serviços?** Hardware e mercadorias são bens. Software descarregado ou em SaaS, licenças, consultoria e desenvolvimento são serviços. Num pacote misto, decide pela prestação principal (a confirmar caso a caso).
2. **O cliente é empresa (sujeito passivo) ou consumidor?**
   - **Cliente da UE**: o teste é o **número de IVA válido no VIES** (ec.europa.eu/taxation_customs/vies). Se o cliente te comunica o número e confirmas no VIES a validade, o nome e a morada, podes tratá-lo como empresa (Reg. 282/2011, art. 18.º, n.º 1, al. a)). Se não te dá o número, podes tratá-lo como consumidor (n.º 2).
   - **Cliente de fora da UE**: serve um certificado da administração fiscal dele, um número fiscal ou de empresa, ou outro elemento comprovativo, com verificação razoável (n.º 3).
3. **Onde está o cliente e para onde vão os bens?** Pode ser Portugal, outro Estado-Membro (EM) ou fora da UE.
   - Há territórios fora do território IVA da UE, mesmo pertencendo a EM: Canárias, Ceuta e Melilha, Monte Atos, ilhas Åland, entre outros. Trata-os como fora da UE (a confirmar no art. 6.º da Diretiva IVA).
   - A Irlanda do Norte segue as regras da UE para bens: prefixo XI (a confirmar).
4. **Há uma regra especial?** Verifica se é um imóvel, transporte de passageiros, restauração, evento presencial, locação de meio de transporte ou serviço eletrónico a consumidor. Verifica também se estás no regime de isenção do art. 53.º.

## Tabela-resumo

| Cenário | Onde se tributa | Quem liquida | Menção na fatura (código AT) | Declarações |
|---|---|---|---|---|
| Bens a empresa da UE com NIF válido no VIES e prova do transporte | EM de chegada (aquisição intracomunitária do cliente) | o cliente, no país dele | "Isento artigo 14.º do RITI" (M16) | DP campo 7 + Quadro 04; declaração recapitulativa |
| Bens a empresa da UE sem NIF válido ou sem prova do transporte | Portugal | tu (IVA PT) | taxa portuguesa | DP |
| Bens a consumidor da UE, abaixo do limiar comum (sem opção) | Portugal | tu (IVA PT) | taxa portuguesa | DP |
| Bens a consumidor da UE, acima do limiar comum (ou opção) | EM do consumidor | tu (IVA do EM de destino) | taxa do EM de destino | OSS trimestral (ou registo nesse EM) |
| Bens exportados para fora da UE (empresa ou consumidor) | isento em PT | ninguém em PT (o destino cobra na importação) | "Isento artigo 14.º do CIVA" (M05) | DP campo 8; prova aduaneira |
| Serviços a empresa da UE (regra geral) | EM do cliente | o cliente (autoliquidação) | "IVA - autoliquidação" (M40) | DP campo 7 + Quadro 04; declaração recapitulativa |
| Serviços a empresa fora da UE (regra geral) | fora de PT (não tributado cá) | regras do país do cliente | M40 — norma "art. 6.º, n.º 6, al. a), *a contrário*" (a confirmar a menção, ver abaixo) | DP campo 8 |
| Serviços a consumidor em PT ou na UE (regra geral, não eletrónicos) | Portugal | tu (IVA PT) | taxa portuguesa | DP |
| Serviços a consumidor fora da UE da lista do art. 6.º, n.º 11 | fora de PT | — | "IVA – Regras específicas - artigo 6.º" (M44) | DP campo 8 |
| Serviços a consumidor fora da UE fora da lista do n.º 11 | Portugal | tu (IVA PT) | taxa portuguesa | DP |
| Serviços eletrónicos, telecomunicações e radiodifusão (TBE) a consumidor da UE, abaixo do limiar comum | Portugal | tu (IVA PT) | taxa portuguesa | DP |
| TBE a consumidor da UE, acima do limiar comum (ou opção) | EM do consumidor | tu (IVA do EM do consumidor) | taxa do EM do consumidor | OSS trimestral |
| TBE a consumidor fora da UE | fora de PT (art. 6.º, n.º 9, al. h)) | regras do país do cliente | M44 | DP campo 8 |
| Exceção do art. 6.º, n.ºs 7 e seguintes, localizada fora de PT (imóvel, evento presencial, restauração, transporte, locação curta) | onde está o imóvel, o evento, a execução ou o percurso | regras desse país (pode obrigar a registo lá) | M44 | DP campo 8 |
| Regime do art. 53.º: bens ou serviços a empresa da UE | bens: isentos em PT pelo art. 53.º; serviços: EM do cliente | bens: ninguém; serviços: o cliente | "IVA – regime de isenção" (M10) | sem declaração recapitulativa |
| Regime transfronteiriço PME (isento noutro EM) | EM onde a operação se localiza, isenta lá | ninguém | "IVA – regime transfronteiriço de isenção" (M45) | declaração trimestral do art. 58.º-B |

DP = declaração periódica do IVA (modelo em vigor até aos períodos que começam antes de 1/7/2027).

## Como usar o decisor (`calc_iva_operacao`)
- **Indicas**:
  - o tipo de operação (`bens` ou `servicos`);
  - o cliente (`empresa` ou `consumidor`);
  - o destino (`PT`, `UE` ou `fora-UE`);
  - se o NIF do cliente é válido no VIES;
  - o volume de vendas à distância e de TBE a consumidores da UE (ano anterior e corrente);
  - o tipo de serviço, quando há regra especial (`eletronico`, `imovel`, `evento`, `transporte-passageiros`, `restauracao`; por omissão `geral`).
- **Recebes**: onde se tributa, quem liquida, a menção na fatura, as declarações a entregar e a base legal.
- **Exemplo**:
  ```text
  calc_iva_operacao  tipo=servicos  cliente=empresa  destino=UE  nifVIES=true
  ```
- **Limites**: o decisor cobre os cenários típicos desta referência. Fora deles devolve "regime especial — confirmar". Exemplos de casos fora do decisor:
  - regime do art. 53.º e regime transfronteiriço;
  - operações em cadeia e triangulares;
  - bens sujeitos a impostos especiais de consumo;
  - meios de transporte novos;
  - regime da margem;
  - a lista do art. 6.º, n.º 11.
  Nesses casos, segue esta referência e o playbook.

## Menções na fatura (tabela de códigos da AT)
- A fatura sem IVA tem de indicar o **motivo justificativo da não aplicação do imposto** (art. 36.º, n.º 5, al. e), CIVA). O código vai também no SAF-T e na comunicação à AT (Portaria 302/2016; tabela obrigatória desde 1/1/2023).
- Sempre que o devedor do imposto é o cliente, a fatura tem a expressão **"IVA - autoliquidação"** (art. 36.º, n.º 13).

| Código | Menção na fatura | Quando |
|---|---|---|
| M05 | Isento artigo 14.º do CIVA | exportação de bens; transporte internacional de pessoas (art. 14.º, n.º 1, al. r)) |
| M10 | IVA – regime de isenção | sujeito passivo no regime de isenção do art. 53.º (em todas as faturas — art. 57.º, n.º 2) |
| M16 | Isento artigo 14.º do RITI | transmissão intracomunitária de bens a empresa da UE |
| M40 | IVA - autoliquidação | serviços B2B localizados fora de PT pela regra geral (art. 6.º, n.º 6, al. a), *a contrário*) |
| M41 | IVA - autoliquidação | operação triangular (art. 8.º, n.º 3, RITI) |
| M44 | IVA – Regras específicas - artigo 6.º | operações não localizadas em PT pelas exceções dos n.ºs 7 e seguintes do art. 6.º |
| M45 | IVA – regime transfronteiriço de isenção | operações isentas noutro EM pelo regime transfronteiriço (art. 58.º-A) |
| M99 | Não sujeito ou não tributado | outras situações de não liquidação (ex.: art. 3.º, n.º 4, e art. 4.º, n.º 5) |

- **Serviços B2B a clientes de fora da UE**: a norma do M40 (art. 6.º, n.º 6, al. a), *a contrário*) abrange todos os serviços B2B localizados fora de PT. Mesmo assim, há quem use M99 quando o cliente está fora da UE. Alinha com o contabilista e com o programa de faturação (a confirmar).

## Bens para empresas da UE (transmissão intracomunitária)
- **Isenção** (art. 14.º, n.º 1, al. a), RITI). Exige, cumulativamente:
  - és sujeito passivo do **regime normal** (o art. 53.º não dá esta isenção — n.º 7);
  - o cliente está **registado para IVA noutro EM**, usou e comunicou-te esse número, e o número é válido no **VIES**;
  - os bens **saem de PT para outro EM**, transportados por ti, pelo cliente ou por conta de um de vocês;
  - entregas a **declaração recapitulativa**. Sem ela a isenção não se aplica, salvo correção da falta em casos justificados (art. 14.º, n.º 2, RITI).
- **Prova do transporte** (Reg. 282/2011, art. 45.º-A; Ofício-Circulado 30218/2020). Presume-se que os bens saíram quando tens **dois elementos de prova não contraditórios**, emitidos por partes independentes entre si, de ti e do cliente:
  - dois documentos de transporte (CMR assinado, conhecimento de embarque, fatura do frete aéreo, fatura do transportador); **ou**
  - um documento de transporte e um outro elemento (apólice de seguro do transporte, comprovativo bancário do pagamento do transporte, documento oficial de chegada, recibo de armazenagem no destino).
- **Se é o cliente que transporta**, precisas ainda de uma **declaração escrita do cliente** com o EM de destino, a data e o local de chegada, os bens e quem os recebeu. ⏰ O cliente deve entregá-la até ao **dia 10 do mês seguinte** ao da entrega dos bens. A AT pode ilidir a presunção.
- **Falha alguma condição?** A venda é tributada em PT, porque os bens estavam cá no início do transporte (art. 6.º, n.º 1, CIVA): faturas com **IVA português**.
- **Fatura**: M16, com o número de IVA do cliente e o prefixo do país.
- **DP**: valor no **campo 7** e **Quadro 04** assinalado.
- ⏰ **Declaração recapitulativa** (RITI, art. 30.º):
  - até ao **dia 20 do mês seguinte** se és mensal;
  - até ao **dia 20 do mês seguinte ao fim do trimestre** se és trimestral;
  - passa a mensal quando as transmissões intracomunitárias de bens excedem o limiar no trimestre em curso ou em qualquer dos 4 anteriores (n.º 2; limiar de 50.000 € — `valores-2026.md`);
  - só se entrega nos períodos em que há operações (n.º 4).
- **Operações em cadeia** (art. 14.º, n.ºs 3 a 5, RITI) e **triangulares** (art. 8.º, n.º 3, RITI; código M41): a isenção depende de quem organiza o transporte e do número de IVA que usa. Decide com o contabilista antes de faturar.

## Vendas à distância a consumidores da UE e balcão único (OSS / IOSS)
- **Limiar comum UE** (art. 6.º-A, n.º 1, CIVA): só para quem está estabelecido **apenas em PT**. Soma, sem IVA:
  - as vendas à distância intracomunitárias de bens;
  - os serviços eletrónicos, de telecomunicações e de radiodifusão (TBE) prestados a consumidores de outros EM.
  Conta o ano anterior **ou** o ano em curso. O valor do limiar está em `references/valores-2026.md`.
- **Até ao limiar**: IVA português, como numa venda nacional. Podes optar pela tributação no destino, ficando nessa opção pelo menos **2 anos civis** (art. 6.º-A, n.º 4).
- **Acima do limiar**: o IVA é o do **EM de chegada dos bens** ou do **EM do consumidor** (art. 10.º, al. a), RITI; art. 6.º, n.º 9, al. h), CIVA).
  - A mudança dá-se **a partir da operação em que o limiar é excedido**, a meio do ano (art. 6.º-A, n.º 3).
  - A fatura leva a **taxa do outro EM**. As regras de faturação continuam a ser as portuguesas para quem está registado no OSS em PT (Ofício-Circulado 30240/2021, ponto 16).
- **OSS — regime da União** (Anexo I à Lei 47/2020, arts. 10.º a 14.º). Em vez de te registares em cada EM, declaras e pagas tudo em PT:
  - **Registo**: no Portal das Finanças (art. 2.º do regime). Produz efeitos no **1.º dia do trimestre seguinte**. Se a 1.ª operação for anterior, aplica-se desde essa operação, desde que comuniques a opção até ao **dia 10 do mês seguinte** (Reg. 282/2011, art. 57.º-D; Ofício-Circulado 30240/2021).
  - ⏰ **Declaração**: **trimestral**, até ao **fim do mês seguinte** ao trimestre (art. 13.º, n.º 1, do regime), ou seja, 30/4, 31/7, 31/10 e 31/1.
  - ⏰ **Pagamento**: até ao termo do mesmo prazo (art. 6.º, n.º 1). Se a fatura não estiver em euros, usa o câmbio do último dia do período (n.º 3).
  - **Correções**: em declarações posteriores, até **3 anos** (art. 8.º, n.º 2).
  - **Dedução**: o OSS não permite deduzir IVA. O IVA português suportado deduz-se na DP (art. 4.º do regime).
  - **Arquivo**: guarda os registos das operações durante **10 anos** (art. 9.º, n.º 3).
- **IOSS — regime de importação** (Anexo I à Lei 47/2020, arts. 19.º e seguintes):
  - **Para quê**: vendas à distância de **bens importados de países terceiros** (ex.: *dropshipping* a partir de fora da UE), sem impostos especiais de consumo, com valor intrínseco por remessa até ao limite do art. 19.º (150 € — `valores-2026.md`).
  - **Como funciona**: cobras o IVA ao consumidor no momento da venda e a importação é feita sem IVA.
  - ⏰ **Declaração**: **mensal**, até ao **fim do mês seguinte** (art. 27.º do regime).
  - **Sem IOSS ou acima do limite**: o IVA é cobrado na importação.
- **E-commerce**: os preços ao consumidor incluem o IVA do país certo. Ver `assets/checklists/checklist-loja-online.md` e `assets/templates/termos-condicoes-loja-online.md`.

## Exportações (bens para fora da UE)
- **Isenção** (art. 14.º, n.º 1, CIVA):
  - al. a): bens transportados para fora da UE **por ti** ou por conta tua;
  - al. b): bens transportados por um **adquirente sem residência nem estabelecimento em PT**.
  Vale para clientes empresa e consumidor e **mantém o direito à dedução** (DP campo 8).
- **Prova** (art. 29.º, n.º 8): declaração aduaneira com a **certificação de saída**, ou certificado de exportação simplificado emitido pela AT. ⚠️ Sem prova, **liquidas tu o IVA** (art. 29.º, n.º 9).
- **Fatura**: M05.
- **Incoterms**: em EXW, quem trata da exportação é o cliente. Garante contratualmente que te entrega a prova de saída, porque o risco do IVA fica do teu lado. Ver `references/contratos-internacionais.md`.
- **Regime do art. 53.º**: quem exporta **sai do regime de isenção** (art. 53.º, n.º 1). Passa ao regime normal a partir desse momento (art. 58.º, n.os 2, al. c), e 4, al. c)). ⏰ Entrega a declaração de alterações em **15 dias úteis** (art. 58.º, n.º 5, al. c)).

## Serviços a empresas (B2B) — regra geral
- **Regra**: tributa-se **onde está o cliente sujeito passivo**, ou seja, a sede ou o estabelecimento para o qual o serviço é prestado (art. 6.º, n.º 6, al. a), CIVA). Cobre consultoria, desenvolvimento de software, SaaS, marketing, design e formação à distância, entre outros.
- **Cliente da UE com NIF válido no VIES**:
  - o serviço não é tributado em PT e é o cliente que autoliquida no país dele;
  - **fatura** sem IVA, com "IVA - autoliquidação" (M40). ⏰ Emite-a até ao **dia 15 do mês seguinte** ao da prestação (art. 36.º, n.º 1, al. b));
  - **DP**: campo 7 e Quadro 04;
  - **declaração recapitulativa**: obrigatória (art. 29.º, n.º 1, al. i), CIVA; prazos do art. 30.º RITI). Só a entregas nos períodos com operações; podes excluir as operações isentas no EM do cliente (art. 29.º, n.º 17).
- **Cliente da UE sem número de IVA**: em regra é tratado como consumidor (Reg. 282/2011, art. 18.º, n.º 2) e o serviço leva IVA português. Pede o número **antes** de faturar.
- **Cliente fora da UE** (Reino Unido, Suíça, EUA, Brasil, Angola…):
  - não é tributado em PT e não há declaração recapitulativa;
  - **DP**: campo 8;
  - **fatura** sem IVA, com o código M40 (ver a nota sobre M40/M99 acima);
  - guarda a prova de que o cliente é empresa (art. 18.º, n.º 3).
- ⚠️ **Retenção na fonte no país do cliente**: alguns países retêm imposto sobre o rendimento nos pagamentos de serviços. Não é IVA. Vê a convenção para evitar a dupla tributação (a confirmar país a país).

## Serviços a consumidores (B2C)
- **Regra**: IVA português, porque se tributa onde está o prestador (art. 6.º, n.º 6, al. b), CIVA). Vale para consumidores de PT, da UE e de fora da UE, salvo as exceções abaixo.
- **Consumidor fora da UE**: **não** se tributam em PT os serviços da lista do **art. 6.º, n.º 11** (código M44, DP campo 8):
  - cessão de direitos de autor, licenças e marcas;
  - publicidade;
  - serviços de consultores, engenheiros, advogados, economistas e contabilistas, e gabinetes de estudo (incluindo organização, investigação e desenvolvimento);
  - tratamento de dados e fornecimento de informações;
  - operações bancárias, financeiras e de seguros (exceto cofres-fortes);
  - colocação de pessoal à disposição;
  - locação de bens móveis corpóreos (exceto meios de transporte);
  - acesso a redes de gás, eletricidade, aquecimento e arrefecimento;
  - obrigação de não exercer uma atividade ou um destes direitos.
  Fora da lista, o serviço leva IVA português.
- **TBE a consumidores** (telecomunicações, radiodifusão e serviços por via eletrónica, nomeadamente os do **Anexo D do CIVA**: SaaS, apps, *downloads*, *streaming*, alojamento de sites, conteúdos digitais):
  - **Consumidor da UE**: IVA português até ao **limiar comum UE**; acima dele, IVA do EM do consumidor via OSS (art. 6.º-A; art. 6.º, n.º 9, al. h)).
  - **Consumidor fora da UE**: não tributado em PT (art. 6.º, n.º 9, al. h)), salvo se o serviço for **utilizado efetivamente em PT** (art. 6.º, n.os 12, al. d), e 14). Alguns países terceiros exigem registo a prestadores digitais estrangeiros (a confirmar país a país).
  - **Prova do país do consumidor**: guarda os elementos que o identificam, como a morada de faturação, o IP, o banco ou cartão e o cartão SIM. Há presunções no Reg. 282/2011, arts. 24.º-A e seguintes (a confirmar).

## Exceções à regra geral (art. 6.º, n.ºs 7 a 15)
Valem para clientes **empresa e consumidor**, salvo indicação em contrário:

| Serviço | Onde se tributa | Base (fora de PT / em PT) |
|---|---|---|
| Ligado a um **imóvel** (obras, arquitetos, fiscalização, peritos e agentes imobiliários, alojamento hoteleiro, direitos de utilização) | onde está o imóvel | n.º 7, al. a) / n.º 8, al. a) |
| **Transporte de passageiros** | pela distância percorrida em cada território; o transporte internacional está isento (art. 14.º, n.º 1, al. r), código M05) | n.º 7, al. b) / n.º 8, al. b) |
| **Restauração e bebidas** | onde é executado (a bordo: lugar de partida do transporte intracomunitário) | n.º 7, als. c) e d) / n.º 8, als. c) e d) |
| **Acesso presencial a eventos** culturais, artísticos, científicos, desportivos, de ensino, feiras, exposições e conferências, e serviços acessórios | onde o evento tem lugar | n.º 7, al. e) / n.º 8, al. e) (DL 33/2025) |
| **Locação de curta duração de meio de transporte** | onde é posto à disposição | n.º 7, al. f) / n.º 8, al. f) |
| Só B2C: transporte de bens, trabalhos sobre bens móveis, intermediários, serviços culturais, desportivos, de ensino e similares (além do acesso), locação de longa duração de meio de transporte, eventos com acesso virtual ou em *streaming* | regras próprias de cada alínea (ex.: serviços culturais presenciais → onde têm lugar; evento virtual e locação longa → onde está o consumidor) | n.º 9 / n.º 10 |

- **Localizada em PT**: há **IVA português**, mesmo com cliente estrangeiro. Exemplos: conferência presencial em Lisboa para uma empresa alemã; obra num imóvel no Porto.
- **Localizada noutro país**:
  - fatura sem IVA português, com M44, e DP campo 8;
  - podes ter de te **registar para IVA nesse país**, ou o cliente pode ter de autoliquidar (a confirmar caso a caso). É típico em formações, eventos e obras no estrangeiro.

## Regime de isenção do art. 53.º e operações com o estrangeiro
- **Quem beneficia**: o sujeito passivo com sede ou domicílio em PT que **não exporta** e cujo volume de negócios em PT, no ano anterior, não passou o limiar.
- **Quando sai do regime**:
  - se no ano em curso exceder o limiar com a margem de tolerância, sai **nesse momento** (art. 58.º, n.os 2, al. b), e 4, al. b));
  - ⏰ entrega a declaração de alterações em **15 dias úteis** (n.º 5, al. b)).
  - O limiar e a margem estão em `references/valores-2026.md`.
- **Fatura**: todas levam **"IVA – regime de isenção"** (M10) (art. 57.º, n.º 2). Não há direito à dedução (art. 53.º, n.º 3).
- **Bens a empresas da UE**: ficam isentos pelo **art. 53.º**, não pelo RITI (art. 14.º, n.º 7, RITI, de natureza interpretativa — DL 35/2025, art. 9.º). Não há declaração recapitulativa.
- **Serviços a empresas (UE ou fora)**: localizam-se no país do cliente pela regra geral. Estás **dispensado da declaração recapitulativa** (Ofício-Circulado 25062/2025, ponto 28). A menção "IVA – regime de isenção" é obrigatória; confirma com o contabilista se acrescentas "IVA - autoliquidação" e que código comunicas à AT (a confirmar).
- **Bens e TBE a consumidores da UE acima do limiar comum**: o IVA passa a ser devido no país do consumidor (art. 6.º-A, n.º 3). Fala com o contabilista sobre o registo no OSS e sobre o efeito no regime de isenção (a confirmar o enquadramento).
- **Compras de serviços a fornecedores estrangeiros** (ex.: publicidade online, software ou alojamento faturados por empresas da Irlanda ou dos EUA):
  - pela aquisição, és sujeito passivo (art. 2.º, n.º 1, al. e)): **tens de liquidar o IVA português** e não o podes deduzir;
  - ⏰ declaras e pagas até ao **fim do mês seguinte** (art. 27.º, n.º 3, CIVA, redação do DL 97/2026);
  - confirma o formulário no Portal das Finanças (a confirmar).
- **Compras intracomunitárias de bens**:
  - abaixo do limiar do art. 5.º RITI (10.000 € — `valores-2026.md`): não estão sujeitas em PT e pagas o IVA do país do fornecedor;
  - acima desse limiar, ou se optares: liquidas o IVA português;
  - confirma o teu enquadramento no art. 2.º, n.º 1, al. b), RITI (a confirmar).

## Regime transfronteiriço das pequenas empresas (arts. 58.º-A a 58.º-D CIVA)
- **O que é**: permite faturar **isento noutros EM** as operações que aí se localizam, desde que:
  - o volume de negócios nesse EM não passe o **limiar fixado por esse EM** (consulta a base TEDB da Comissão Europeia);
  - o **volume de negócios anual na UE** não passe o limiar da al. b) do n.º 1 do art. 58.º-A (100.000 € — `valores-2026.md`);
  - tenhas feito a **notificação prévia** à AT (aplicação "SME" no Portal das Finanças);
  - tenhas obtido o número com o **sufixo "EX"**. A AT decide em até **35 dias úteis** (n.º 8) e a isenção só se aplica a partir da atribuição (n.º 7).
- **Quem pode usar**: também está aberto a quem está no **regime normal** em PT (Ofício-Circulado 25065/2025, ponto 4).
- **Fatura**: M45, "IVA – regime transfronteiriço de isenção".
- ⏰ **Declaração trimestral**: até ao **fim do mês seguinte** a cada trimestre, mesmo sem operações (art. 58.º-B, n.os 3 e 4).
- ⏰ **Comunicações à AT**:
  - em **15 dias úteis**, se passares o limiar da UE (art. 58.º-C, n.º 1, al. d)); a isenção cessa nesse momento e entregas a declaração trimestral do período até essa data (n.º 4);
  - em **5 dias úteis**, a cessação de operações num EM ou a mudança do EM de estabelecimento (als. b) e c)).

## Compras ao estrangeiro (aquisições)

| Aquisição | Onde se tributa | Quem liquida | Onde declarar (DP atual) |
|---|---|---|---|
| Bens de fornecedor da UE (dás o teu NIF PT, válido no VIES) | PT — aquisição intracomunitária (art. 8.º, n.º 1, RITI) | tu (art. 23.º, n.º 1, al. a), RITI) | campos 12 e 13; dedução nos campos 20 a 24 |
| Serviços de fornecedor da UE (regra geral) | PT (art. 6.º, n.º 6, al. a), CIVA) | tu (art. 2.º, n.º 1, al. e), CIVA) | campos 16 e 17; dedução |
| Serviços do art. 6.º, n.º 8, ou bens localizados em PT, de fornecedor da UE | PT | tu | campos 1/5/3 e 2/6/4, com a base no Quadro 06-A, campo 97 |
| Bens ou serviços localizados em PT, de fornecedor de fora da UE | PT (art. 2.º, n.º 1, al. e), CIVA) | tu | campos 1/5/3 e 2/6/4, com a base no Quadro 06-A, campo 98; dedução |
| Importação de bens | PT | pago na alfândega ou, se optaste, na DP (art. 27.º, n.º 8; campos 18 e 19) | (a confirmar as condições da opção) |

- **Fatura do fornecedor da UE sem IVA**: confirma que traz o teu número de IVA e a menção de autoliquidação (*reverse charge*). Se te cobrou IVA do país dele indevidamente, não o deduzes em PT: pede a correção da fatura.
- **Novo modelo da DP** para os períodos a partir de **1/7/2027** (Portaria 298/2026/1):
  - o ponto 3 do Quadro 06 passa a ser "aquisições de serviços a sujeitos passivos de outros Estados-Membros, cujo imposto foi autoliquidado pelo declarante";
  - o campo 24 é eliminado e substituído pelos campos 27 a 29 (por taxa);
  - há novos quadros 06-B e 06-C.
  Revê o mapeamento de campos com o contabilista antes dessa data.

## Declarações e prazos ⏰
- **Fatura**: até ao **5.º dia útil** seguinte ao momento em que o imposto é devido (art. 36.º, n.º 1, al. a)). Serviços B2B a clientes da UE: até ao **dia 15 do mês seguinte** (al. b)).
- **Declaração periódica** (art. 41.º, n.º 1, CIVA):
  - **mensal** (volume de negócios do ano anterior igual ou superior ao limiar de `references/valores-2026.md`): até ao **dia 20 do 2.º mês seguinte** ao mês;
  - **trimestral**: até ao **dia 20 do 2.º mês seguinte** ao trimestre;
  - as declarações de **junho** e do **2.º trimestre**: até **20 de setembro** (n.º 10).
- **Pagamento**: até ao **dia 25 do 2.º mês seguinte** ao mês ou ao trimestre (art. 27.º, n.º 1). Na Agenda Fiscal de 2026, junho e julho (mensal) e o 2.º trimestre pagam-se até 25 de setembro.
- **Declaração recapitulativa** (art. 30.º RITI): até ao **dia 20 do mês seguinte** ao mês (mensais) ou ao trimestre (trimestrais). Torna-se mensal acima do limiar do n.º 2.
- **OSS** (regime da União): trimestral, até ao **fim do mês seguinte** ao trimestre, com o pagamento.
- **IOSS**: mensal, até ao **fim do mês seguinte**.
- **Regime transfronteiriço PME**: declaração trimestral até ao **fim do mês seguinte** ao trimestre.
- **Art. 53.º com compras de serviços ao estrangeiro**: declaração e pagamento até ao **fim do mês seguinte** (art. 27.º, n.º 3).
- **Agenda**: gera o calendário com `calendario_obrigacoes` e regista os prazos próprios com `registar_prazo`.

## Armadilhas comuns
- **Menção errada**: "autoliquidação" numa venda de bens a empresa da UE (é M16) ou "Isento artigo 14.º do CIVA" num serviço B2B (é M40).
- **Faturar sem IVA sem validar o NIF no VIES**: se o número for inválido, o IVA português fica a teu cargo. Guarda o comprovativo da consulta, com data, de preferência do dia da fatura.
- **Esquecer a declaração recapitulativa**: a isenção dos bens cai (art. 14.º, n.º 2, RITI) e há coima.
- **Não guardar a prova do transporte ou da saída**: na inspeção, a AT liquida o IVA português (art. 29.º, n.º 9, CIVA).
- **Contar mal o limiar comum UE**:
  - soma bens à distância **e** TBE a consumidores, no ano anterior **e** no corrente;
  - quando é excedido a meio do ano, a mudança é **imediata**.
- **Achar que o limiar comum vale para todos os serviços B2C**: só vale para TBE (e vendas de bens à distância). Uma consultoria a um particular de outro EM leva IVA português desde a primeira fatura.
- **Formações, eventos presenciais e obras no estrangeiro**: são tributados **lá** e podem obrigar a registo nesse país.
- **Exportar estando no art. 53.º**: perdes a isenção.
- **Comprar serviços estrangeiros estando no art. 53.º** (publicidade online, SaaS): tens de autoliquidar o IVA, sem o deduzir.
- **Territórios fora do IVA da UE** (Canárias, Ceuta, Melilha, etc.): são tratados como fora da UE (a confirmar).
- **Confundir IVA com imposto sobre o rendimento**: a retenção na fonte feita pelo cliente estrangeiro não é IVA.
- **Prever o novo modelo da DP** (1/7/2027): os campos mudam.

## Para o contexto do utilizador
- **Lê primeiro o perfil** em `.advogado-pt/perfil-empresa.md` (ou com `obter_perfil_empresa`):
  - regime de IVA (normal mensal, normal trimestral ou isenção do art. 53.º);
  - volume de negócios;
  - se vendes bens ou serviços;
  - se vendes a empresas (B2B) ou a consumidores (B2C);
  - mercados (UE, fora da UE);
  - se tens loja online.
- **Prestador de serviços B2B** (consultoria, software, marketing), seja ENI, Unipessoal ou Lda:
  - clientes da UE: VIES + M40 + DP campo 7 + declaração recapitulativa;
  - clientes de fora da UE: M40 + DP campo 8;
  - **no art. 53.º**: M10 em todas as faturas, sem declaração recapitulativa, mas atenção às compras de serviços ao estrangeiro.
- **Empresa que vende bens a empresas da UE**:
  - processo fixo: VIES, dossier de prova do transporte por expedição e declaração recapitulativa;
  - acima do limiar de operações intracomunitárias, a recapitulativa passa a mensal.
- **Loja online com consumidores na UE**:
  - controla mensalmente o limiar comum;
  - acima dele: registo no OSS, preços com o IVA de cada país e declaração trimestral;
  - ver `assets/checklists/checklist-loja-online.md`.
- **SaaS e software**: a clientes empresa aplica-se a regra geral B2B; a consumidores, é TBE (limiar comum e depois OSS).
- **Exportador de bens**:
  - prova aduaneira de saída em cada envio;
  - Incoterms claros no contrato;
  - a pequena empresa no art. 53.º passa ao regime normal ao exportar.
- **Na dúvida sobre a localização ou a isenção**:
  - antes de faturar valores relevantes, pede uma **informação vinculativa** à AT (art. 68.º LGT): `assets/templates/pedido-informacao-vinculativa.md`;
  - o contabilista certificado trata da DP, da recapitulativa e do OSS;
  - recorre a advogado ou consultor fiscal em operações em cadeia, risco de estabelecimento estável no estrangeiro, registos noutros EM ou inspeção da AT (`playbooks/recebi-notificacao-at.md`).

## Templates
- `playbooks/faturar-cliente-estrangeiro.md` — árvore de decisão para faturar a cliente estrangeiro: menção, declarações, prazos e prova a guardar
- `assets/templates/pedido-informacao-vinculativa.md` — confirmar com a AT o enquadramento de uma operação internacional duvidosa
- `assets/templates/termos-condicoes-loja-online.md` — termos de venda online (preços com o IVA do país do consumidor)
- `assets/templates/contrato-prestacao-servicos-ti.md` — cláusula de preço e impostos em serviços a clientes estrangeiros (preço sem IVA, autoliquidação pelo cliente)
