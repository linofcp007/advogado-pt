# Faturação — Requisitos, Comunicação à AT e Fatura Eletrónica

> **Âmbito:** misto — regras fiscais portuguesas (CIVA, DL 28/2019, DL 198/2012) com regras da UE (Regulamento eIDAS; Diretiva 2014/55/UE nos contratos públicos).
>
> 💶 **Valores, limiares e coimas:** consulta sempre `references/valores-2026.md` (ponto único de verdade). Aqui ficam as regras e as datas.
>
> Remete para: `references/fiscal.md` (IVA nacional, taxas, regimes), `references/iva-internacional.md` (faturar a clientes estrangeiros, menções e códigos de isenção, autoliquidação), `references/contratacao-publica.md` (contratos públicos) e `playbooks/faturacao-eletronica-2027.md` (o que fazer até 1/1/2027).

## Legislação Base
- **Código do IVA (CIVA)**: art. 19.º, n.º 2, al. a) (só dá direito à dedução o IVA de faturas passadas na forma legal); art. 29.º, n.º 1, al. b) (obrigação de faturar); art. 35.º-A (quando se aplicam as regras portuguesas de faturação); art. 36.º (prazos e elementos da fatura; n.º 10: fatura eletrónica sujeita a aceitação do destinatário); art. 40.º (fatura simplificada)
- **DL 28/2019, de 15 de fevereiro** (processamento de faturas e arquivo), na redação do DL 48/2020 e do DL 49/2025: arts. 2.º (definições), 3.º e 4.º (meios de processamento e programas certificados), 4.º-A (aplicação de faturação da AT), 6.º (autenticidade, integridade e legibilidade), 7.º (requisitos; n.º 3: código QR e código único de documento), 8.º (dispensa de impressão), **12.º (fatura eletrónica)**, 13.º (requisitos dos programas de faturação eletrónica), 19.º a 30.º (arquivo), 35.º (comunicação das séries)
- **DL 198/2012, de 24 de agosto**, art. 3.º (comunicação dos elementos das faturas à AT — e-fatura)
- **Portaria 195/2020, de 13 de agosto** (código QR e ATCUD); **Portaria 302/2016** (estrutura do SAF-T (PT)); **Portaria 144/2019** (dispensa de impressão); **Portaria 363/2010** (certificação de programas, na parte não revogada pelo DL 28/2019); **Portaria 31/2019** (SAF-T (PT) da contabilidade)
- **Lei 73-A/2025, de 30 de dezembro** (Orçamento do Estado para 2026): **art. 95.º, n.º 3** (faturas em PDF aceites como faturas eletrónicas até 31/12/2026); art. 95.º, n.º 2 (SAF-T da contabilidade); **art. 260.º, n.º 2** (prorroga até 31/12/2026 a dispensa das PME na faturação eletrónica dos contratos públicos)
- **Código dos Contratos Públicos (CCP)**, art. 299.º-B (fatura eletrónica nos contratos públicos); **DL 111-B/2017**, art. 9.º (prazos de adaptação); **Portaria 289/2019, de 5 de setembro** (modelo CIUS-PT)
- **Regulamento (UE) 910/2014 (eIDAS)**: art. 3.º, pontos 12) e 27) (assinatura e selo eletrónico qualificado), art. 22.º (listas de confiança); **DL 12/2021**, arts. 3.º (força probatória) e 6.º (o GNS é a entidade supervisora e gere a lista de confiança portuguesa)
- **RGIT** (Lei 15/2001): arts. 117.º, n.º 9, 123.º e 128.º (coimas); art. 26.º, n.º 4 (limites em dobro para pessoas coletivas)

## Quem fatura e com que meio
- **Obrigação**: uma fatura por cada venda ou prestação de serviços, mesmo que o cliente não a peça, e pelos pagamentos antecipados (art. 29.º, n.º 1, al. b), CIVA).
- **Meios admitidos** (art. 3.º DL 28/2019):
  - programa informático de faturação, incluindo a aplicação de faturação da AT no Portal das Finanças (art. 4.º-A);
  - outros meios eletrónicos (máquinas registadoras, terminais, balanças) — só para faturas simplificadas (art. 4.º, n.º 5);
  - documentos pré-impressos em tipografia autorizada.
- **Programa certificado pela AT obrigatório** (art. 4.º, n.º 1) quando se verifique qualquer destas condições:
  - volume de negócios do ano anterior acima do limiar legal (ver `valores-2026`);
  - usas um programa informático de faturação (seja qual for o volume);
  - tens contabilidade organizada, por obrigação ou opção.
- A AT publica a **lista de programas certificados** e respetivas versões (art. 4.º, n.º 3). Programa inoperacional: emite em papel de tipografia autorizada e recupera depois os documentos para o programa (art. 4.º, n.º 4).
- **Fatura simplificada** (art. 40.º CIVA): admitida até aos limites do n.º 1 (ver `valores-2026`) e, sem limite de valor, pelos sujeitos passivos do regime de isenção do art. 53.º (al. c), na redação do DL 35/2025).

## Elementos obrigatórios da fatura (CIVA, art. 36.º, n.º 5)
- Data e **numeração sequencial** (por série; séries com duração mínima de um ano fiscal — art. 7.º, n.º 4, DL 28/2019).
- Nome/firma, sede ou domicílio e **NIF do fornecedor** e do **adquirente sujeito passivo** (al. a)).
- Quantidade e denominação usual dos bens ou serviços, com o necessário para determinar a taxa (al. b)).
- Preço líquido de imposto e outros elementos do valor tributável (al. c)).
- **Taxas** e **montante de IVA** (al. d)) — separados por taxa quando há várias.
- **Motivo da não aplicação do imposto**, se for o caso (al. e)) — códigos e menções em `references/iva-internacional.md`; "IVA - autoliquidação" quando o devedor é o cliente (n.º 13).
- Data da entrega ou da prestação, se diferente da data da fatura (al. f)).
- **NIF do consumidor particular** sempre que o peça (n.º 16).
- Representante fiscal, se o fornecedor não residente o tiver (n.º 9); autofaturação com acordo prévio escrito e a menção "autofaturação" (n.º 11).
- Documentos retificativos (notas de crédito/débito): data, numeração, identificação das partes e referência à fatura retificada (n.º 6).
- Programa certificado: todas as menções obrigatórias têm de ser inseridas **pelo próprio programa** (art. 7.º, n.º 1, DL 28/2019).

## Prazos de emissão (CIVA, art. 36.º, n.º 1)
- ⏰ Regra: até ao **5.º dia útil** seguinte ao momento em que o IVA é devido (al. a)).
- ⏰ Serviços intracomunitários tributados noutro Estado-Membro (autoliquidação pelo cliente da UE): até ao **dia 15 do mês seguinte** (al. b)).
- ⏰ Pagamento antecipado (ou que coincide com a operação): **na data do recebimento** (al. c)).
- Faturas globais: processadas até 5 dias úteis após o fim do período a que respeitam (n.º 2).

## ATCUD e código QR
- **Base**: art. 7.º, n.º 3, e art. 35.º DL 28/2019; **Portaria 195/2020**. Hoje são ambos obrigatórios; o ATCUD é obrigatório desde **1/1/2023** (foi facultativo em 2022 — Despacho SEAAF n.º 351/2021-XXII).
- **Séries**: antes de usar uma série, comunica-a à AT no Portal das Finanças (art. 35.º, n.º 1); a AT devolve um código de validação (art. 35.º, n.º 2; Portaria 195/2020, art. 2.º).
- **ATCUD** = código de validação da série + "-" + número sequencial do documento, no formato `ATCUD:CodigodeValidação-NumeroSequencial` (Portaria 195/2020, arts. 3.º e 4.º, n.º 1):
  - obrigatório em **todas** as faturas e documentos fiscalmente relevantes, por **qualquer** meio de processamento e **independentemente do volume de negócios ou do regime** (art. 4.º, n.º 1; FAQ da AT);
  - em documentos com várias páginas, em **todas** as páginas, imediatamente acima do QR (art. 4.º, n.º 3).
- **Código QR**:
  - obrigatório nos documentos emitidos por **programas certificados** (Portaria 195/2020, art. 6.º, n.º 1); não se exige nos pré-impressos de tipografia (FAQ da AT);
  - dentro do corpo do documento, legível em qualquer suporte, na primeira ou na última página (art. 6.º, n.os 2 e 3), segundo as especificações técnicas da AT (art. 5.º);
  - no **EDI** basta o campo ATCUD no ficheiro; se for junta uma imagem do documento, essa imagem leva o QR (FAQ da AT, questão 4124).

## Comunicação das faturas à AT (e-fatura)
- **Quem**: quem está sujeito às regras portuguesas de faturação (art. 35.º-A CIVA) e pratica cá operações sujeitas a IVA (DL 198/2012, art. 3.º, n.º 1).
- **Como** (art. 3.º, n.º 1):
  - em tempo real (webservice);
  - ficheiro SAF-T (PT) de faturação;
  - inserção direta no Portal das Finanças.
  Quem é obrigado a produzir SAF-T (PT) só pode usar as duas primeiras vias (n.º 3).
- ⏰ **Prazo**: até ao **dia 5 do mês seguinte** ao da emissão (art. 3.º, n.º 2, na redação atual; aplicável aos documentos emitidos desde 1/1/2023 — FAQ da AT, questão 4936).
- ⏰ **Mês sem faturas**: comunica esse facto no mesmo prazo (art. 3.º, n.º 9).
- Inclui faturas, documentos de conferência de mercadorias/serviços e recibos; o ATCUD é um dos campos comunicados (art. 3.º, n.º 4, al. p)).
- Falta ou atraso na comunicação: contraordenação **grave** (RGIT, art. 117.º, n.º 9) — montantes em `valores-2026`.

## Fatura eletrónica (DL 28/2019, art. 12.º)
- **Definição**: fatura **emitida e recebida** em formato eletrónico (art. 2.º, al. d)). Emitir por via eletrónica depende da **aceitação do destinatário** (art. 12.º, n.º 1; CIVA, art. 36.º, n.º 10) — o cliente pode recusar a via eletrónica, mas não a pode impor ao fornecedor.
- **Autenticidade da origem e integridade do conteúdo** consideram-se garantidas, nomeadamente, com um destes procedimentos (art. 12.º, n.º 2):
  - a) **assinatura eletrónica qualificada**;
  - b) **selo eletrónico qualificado** (Regulamento eIDAS);
  - c) **EDI** com acordo entre emitente e destinatário segundo o "Acordo tipo EDI europeu" (Recomendação 94/820/CE).
- **Assinatura vs. selo**:
  - assinatura eletrónica qualificada — de uma **pessoa singular** (ex.: o empresário ou o gerente; Cartão de Cidadão ou Chave Móvel Digital permitem assinatura qualificada — autenticacao.gov.pt); equivale à assinatura manuscrita (DL 12/2021, art. 3.º, n.º 2);
  - selo eletrónico qualificado — da **empresa** (pessoa coletiva), pensado para assinar documentos em lote e de forma automática a partir do programa de faturação;
  - ambos exigem certificado qualificado emitido por um **prestador qualificado de serviços de confiança** que conste da **lista de confiança** (eIDAS, art. 22.º; em Portugal, gerida pelo GNS — DL 12/2021, art. 6.º).
- **Programas de faturação eletrónica** têm de garantir: validação cronológica, não repúdio, não duplicação e verificação de que o certificado não está **revogado, caducado ou suspenso** na data de emissão (art. 13.º).
- **"Nomeadamente"**:
  - a AT admitiu em abstrato outras tecnologias que assegurem autenticidade e integridade (Ofício-Circulado 30213/2019, ponto 16), mas só se derem garantias semelhantes ou superiores às da lista;
  - os meros controlos de gestão do art. 6.º não substituem os procedimentos do art. 12.º, n.º 2 (ficha doutrinária, processo n.º 17741, de 22/07/2020);
  - na prática, a via segura é a assinatura ou o selo qualificado, ou o EDI.
- **PDF não é, por si, fatura eletrónica**: segundo a AT, digitalizar ou "imprimir para PDF" e enviar por e-mail não é emitir fatura eletrónica, e o PDF sem os requisitos não serve para a dedução do IVA (processo n.º 17741, pontos 19 e 24). Faturas de programa certificado que não cumpram os requisitos da via eletrónica têm de ser **impressas** (ponto 25).
- **Dispensa de impressão** (art. 8.º; Portaria 144/2019) — só para clientes **não sujeitos passivos**, se cumpridas cumulativamente estas condições:
  - a fatura tem o NIF do cliente;
  - é emitida por programa certificado;
  - comunicas as faturas à AT **em tempo real**.
  O cliente consulta a fatura no Portal das Finanças, mas recebe-a se a pedir.

## Faturas em PDF — o regime transitório acaba a 31/12/2026
- Desde 2020, sucessivos despachos e leis do Orçamento aceitaram faturas em **PDF sem assinatura qualificada** como faturas eletrónicas.
- A prorrogação em vigor é a do **art. 95.º, n.º 3, da Lei 73-A/2025** (OE 2026): "Até 31 de dezembro de 2026 são aceites faturas em ficheiro PDF, sendo consideradas como faturas eletrónicas para todos os efeitos previstos na legislação fiscal."
- ⏰ A partir de **1 de janeiro de 2027**, sem nova prorrogação, um PDF só vale como fatura eletrónica se cumprir o **art. 12.º do DL 28/2019**: assinatura ou selo eletrónico **qualificado**, ou EDI.
- Até 4/10/2026 não encontrámos nova prorrogação nem orientação específica da AT para 2027. A proposta de Orçamento do Estado para 2027 pode voltar a mexer na data: confirmar em diariodarepublica.pt antes de dezembro.
- **Alternativas válidas a partir de 2027**:
  - PDF com selo ou assinatura qualificada;
  - EDI ou formato estruturado com acordo;
  - fatura em **papel** — impressa e entregue, continua a ser válida;
  - dispensa de impressão do art. 8.º nas vendas a particulares.

## Faturas recebidas (lado do cliente)
- O IVA só é dedutível com fatura **passada na forma legal**, em nome e na posse do adquirente (CIVA, art. 19.º, n.º 2, al. a)).
- A partir de 1/1/2027, um PDF **sem** assinatura ou selo qualificado de um fornecedor deixa de estar coberto pelo regime transitório. Risco: a AT pode recusar a dedução do IVA (posição do processo n.º 17741, ponto 19) — **(a confirmar a orientação da AT para 2027)**.
- Pede ao fornecedor a versão assinada, EDI ou o original em papel. Valida a assinatura (certificado qualificado, em nome do fornecedor, válido na data) e guarda o ficheiro original sem alterações.
- Os dados que o fornecedor comunicou no e-fatura **não substituem** a fatura para efeitos de dedução.

## Fatura eletrónica nos contratos públicos (CCP, art. 299.º-B)
- Na execução de contratos públicos, o cocontratante **tem de emitir fatura eletrónica** no modelo da norma europeia (art. 299.º-B, n.os 1 e 3), exceto em contratos secretos ou com medidas especiais de segurança (n.º 2).
- **Modelo**: CIUS-PT (Portaria 289/2019), conforme a norma europeia EN 16931 (FAQ da eSPap).
- **Prazos** (DL 111-B/2017, art. 9.º):
  - grandes empresas: obrigadas desde 1/1/2021 (n.º 3);
  - **micro, pequenas e médias empresas** e entidades públicas cocontratantes: dispensadas até **31/12/2026** (n.º 4, prorrogado pelo art. 260.º, n.º 2, da Lei 73-A/2025) → **obrigadas a partir de 1/1/2027** (FAQ da eSPap).
- Um **PDF enviado por e-mail não é fatura eletrónica** para efeitos do CCP (FAQ da eSPap, 3.2).
- Formas de cumprir:
  - programa de faturação que gere CIUS-PT;
  - parceiro tecnológico (prestador de serviços de faturação eletrónica);
  - **Microportal FE-AP** da eSPap, para fornecedores com poucos documentos por ano (limite em `valores-2026`).
- Ver também `references/contratacao-publica.md`.

## SAF-T (PT) da contabilidade
- A entrega do ficheiro SAF-T (PT) da contabilidade (Portaria 31/2019) aplica-se aos **períodos de 2027 e seguintes**, a entregar em **2028** ou depois (Lei 73-A/2025, art. 95.º, n.º 2). Não confundir com o SAF-T de **faturação**, que é mensal (ver acima).
- Os programas de faturação e de contabilidade têm de exportar o ficheiro de auditoria tributária (DL 28/2019, art. 11.º, n.º 5; CIRC, art. 123.º, n.º 8).

## Arquivo e conservação
- ⏰ **10 anos** para livros, registos e documentos de suporte, salvo prazo especial. O arquivo mantém-se enquanto durar o prazo de caducidade se exerceres um direito com prazo superior (DL 28/2019, art. 19.º, n.os 1 e 2).
- **Faturas eletrónicas** (emitidas e recebidas):
  - conservadas **sem alterações**, por ordem cronológica e **exclusivamente em formato eletrónico** (art. 28.º, n.º 1);
  - sem macros nem código executável (art. 29.º);
  - com controlos de integridade, recuperação em caso de incidente e reprodução legível (art. 30.º).
- **Onde**:
  - papel em Portugal;
  - suporte eletrónico em qualquer Estado-Membro (art. 20.º, n.º 1);
  - fora da UE, só com **autorização prévia da AT** (arts. 20.º, n.º 2, e 21.º);
  - a localização do arquivo eletrónico vai na declaração de início ou de alterações de atividade (art. 20.º, n.º 5).
- **Papel digitalizado**: podes arquivar em formato eletrónico com controlos de integridade. Só destróis o original depois de assegurados esses controlos e, nas faturas de compra, depois de exercida a dedução (art. 23.º).
- **Cópias de segurança** obrigatórias, guardadas em local distinto do original (art. 27.º).
- Conservação de faturas e recibos é também dever sancionado (RGIT, art. 123.º, n.º 2).

## Infrações (RGIT) — montantes em `valores-2026`
- Não emitir fatura ou emiti-la fora de prazo; não a exigir ou não a conservar — art. 123.º, n.os 1 e 2.
- Falta ou atraso na comunicação das faturas à AT — art. 117.º, n.º 9 (contraordenação grave).
- Não usar programa certificado quando obrigatório; usar programa que não cumpre os requisitos — art. 128.º, n.os 2 e 3.
- Pessoas coletivas: limites mínimo e máximo em dobro (art. 26.º, n.º 4).
- Defesa perante a AT: `playbooks/recebi-notificacao-at.md`.

## Erros comuns
- Enviar em 2027 o mesmo PDF de sempre por e-mail, sem selo ou assinatura qualificada.
- Comprar um certificado de assinatura "avançada" ou não qualificado: não cumpre o art. 12.º, n.º 2.
- Usar o certificado pessoal de um trabalhador que saiu ou um certificado caducado. A assinatura com certificado revogado, caducado ou suspenso equivale a falta de assinatura (DL 12/2021, art. 3.º, n.º 4).
- Abrir uma série nova em janeiro sem a comunicar à AT: as faturas saem sem ATCUD válido.
- Esquecer a comunicação "sem faturação" nos meses parados.
- Guardar só a impressão de uma fatura eletrónica recebida e apagar o ficheiro original.
- Contratos públicos: julgar que o PDF assinado chega. Para a entidade pública é preciso CIUS-PT a partir de 1/1/2027.

## Para o contexto do utilizador
- Lê o perfil da empresa (`.juridico-pt/perfil-empresa.md`, ou a tool `obter_perfil_empresa`). Interessam:
  - forma jurídica (ENI ou sociedade);
  - se emite faturas e por que meio (programa certificado, Portal das Finanças, papel);
  - tipo de clientes (empresas, particulares, entidades públicas, estrangeiros);
  - volume de documentos por mês.
- **Serviços B2B** (software, consultoria): o caso típico é o PDF enviado por e-mail. Até 31/12/2026 está coberto; a partir de 1/1/2027 o caminho mais simples é ativar o **selo eletrónico qualificado** no programa de faturação.
- **ENI que emite faturas-recibo no Portal das Finanças**: os documentos ficam disponíveis ao cliente no Portal (art. 4.º-A, n.º 3, DL 28/2019). Não confirmámos se o PDF gerado pela aplicação da AT leva selo qualificado — **(a confirmar)** antes de o enviar como fatura eletrónica em 2027.
- **Clientes do setor público**: CIUS-PT obrigatório a partir de 1/1/2027 para PME — fala já com o fornecedor do programa.
- **Clientes estrangeiros**: as regras de faturação portuguesas aplicam-se nos casos do art. 35.º-A CIVA — ver `references/iva-internacional.md`.
- Regista as datas com `registar_prazo` e vê o calendário anual com `calendario_obrigacoes`.

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Pedido de informação vinculativa à AT (ex.: validar uma tecnologia "equivalente" ou o tratamento de faturas recebidas sem assinatura) — `assets/templates/pedido-informacao-vinculativa.md`
- Acordo de tratamento de dados com o fornecedor do programa de faturação ou do arquivo na cloud — `assets/templates/dpa-bilingue.md`
- Contrato com o fornecedor do programa de faturação em modelo SaaS (níveis de serviço, dados, exportação do SAF-T e do arquivo, saída) — `assets/templates/contrato-saas-b2b.md`, como base para rever o contrato do fornecedor (com `assets/checklists/checklist-revisao-contrato.md`)
- Comunicação aos clientes sobre a passagem à fatura eletrónica com selo qualificado (aceitação da via eletrónica) (a pedido)
- Pedido aos fornecedores de faturas com assinatura ou selo qualificado a partir de 1/1/2027 (a pedido)
- Acordo EDI com um cliente ou fornecedor (modelo "Acordo tipo EDI europeu") (a pedido)
