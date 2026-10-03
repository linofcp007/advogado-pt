# Playbook: Faturas em PDF — o que muda a 1/1/2027 e o que fazer até lá

> Quando usar: emites ou recebes faturas em PDF por e-mail, ou faturas a entidades públicas, e queres estar pronto para **1 de janeiro de 2027**. Nessa data acaba o regime transitório que aceita PDF sem assinatura como fatura eletrónica (Lei 73-A/2025, art. 95.º, n.º 3). Serve para qualquer empresa (ENI, Lda, SA) e setor. Âmbito: misto. A fundamentação está em `references/faturacao.md`. Antes de começar, confirma no perfil (`.juridico-pt/perfil-empresa.md` ou `obter_perfil_empresa`) como emites as faturas e que tipo de clientes tens. Valores e limiares: `references/valores-2026.md`.

## Passo 0 — Não percas prazos

- ⏰ **31/12/2026** — último dia em que um PDF **sem** assinatura ou selo qualificado conta como fatura eletrónica (Lei 73-A/2025, art. 95.º, n.º 3).
- ⏰ **1/1/2027** — o PDF enviado por e-mail só vale como fatura eletrónica com **assinatura eletrónica qualificada**, **selo eletrónico qualificado** ou **EDI** (DL 28/2019, art. 12.º, n.º 2).
- ⏰ **1/1/2027** — **PME** que faturam a entidades públicas passam a ter de emitir fatura eletrónica **CIUS-PT** (CCP, art. 299.º-B; DL 111-B/2017, art. 9.º, n.º 4, prorrogado até 31/12/2026 pela Lei 73-A/2025, art. 260.º, n.º 2).
- ⏰ **Dia 5 de cada mês** — comunicação à AT das faturas do mês anterior (DL 198/2012, art. 3.º, n.º 2). As de dezembro de 2026 vão até 5/1/2027.
- ⏰ **Antes da primeira fatura de 2027** — se abrires séries novas, comunica-as à AT para obter o código do ATCUD (DL 28/2019, art. 35.º).
- ⏰ **Período de 2027** — o SAF-T (PT) da contabilidade aplica-se a partir dos períodos de 2027, com entrega em 2028 (Lei 73-A/2025, art. 95.º, n.º 2). Combina com o contabilista.
- Não deixes para dezembro: obter um certificado qualificado exige identificação junto do prestador e configurar o programa leva tempo.
- **Agenda**: regista estas datas com `registar_prazo` e vê o calendário anual com `calendario_obrigacoes`.
- Verificado a 4/10/2026. A proposta de Orçamento do Estado para 2027 pode voltar a prorrogar o prazo: confirma em diariodarepublica.pt em novembro e dezembro.

## Fluxo de decisão

1. **Como emites as faturas hoje?**
   - **Programa certificado** (local ou cloud) → passo 2.
   - **Aplicação de faturação do Portal das Finanças** (ex.: faturas-recibo de ENI) → não confirmámos se o PDF da AT leva selo qualificado **(a confirmar)**. Até confirmares, entrega-as por outra via segura, como as descritas no passo 2. O cliente pode consultar o documento no Portal (DL 28/2019, art. 4.º-A, n.º 3).
   - **Papel de tipografia autorizada ou máquina registadora** → nada muda na emissão. Confirma só o ATCUD em todos os documentos e passa ao passo 6 (faturas recebidas).

2. **Como entregas as faturas aos clientes?**
   - **Em papel** (impressas e entregues ou enviadas por correio) → continua válido em 2027. Passo 6.
   - **A particulares, sem envio**, com o NIF na fatura → podes usar a **dispensa de impressão** se comunicares as faturas à AT em **tempo real** (DL 28/2019, art. 8.º; Portaria 144/2019). Se o cliente pedir a fatura, envia-lha.
   - **Por EDI** → confirma que existe um acordo escrito com cada parceiro segundo o "Acordo tipo EDI europeu" (art. 12.º, n.º 2, al. c)). No ficheiro basta o campo ATCUD; não precisa de imagem do QR (FAQ da AT, questão 4124).
   - **PDF por e-mail ou portal de cliente** → passo 3.
   - **Entidades públicas** (contratos ao abrigo do CCP) → passo 7.

3. **Escolhe o mecanismo para os PDF**:
   - **Selo eletrónico qualificado** — certificado em nome da **empresa**, aplicado automaticamente pelo programa a cada PDF. **Recomendado** para quem emite faturas com regularidade. Não depende de uma pessoa concreta.
   - **Assinatura eletrónica qualificada** — certificado de uma **pessoa singular** (empresário ou gerente). O Cartão de Cidadão e a Chave Móvel Digital permitem assiná-la (autenticacao.gov.pt). Juridicamente serve, mas é assinatura documento a documento: só é prático com poucas faturas por mês. Numa sociedade, quem assina tem de ter poderes de representação.
   - **EDI / formato estruturado** — quando o cliente o pede, como grandes retalhistas ou a Administração Pública (CIUS-PT).
   - ⚠️ Certificados "avançados" ou "simples" **não** cumprem o art. 12.º, n.º 2. Tem de ser **qualificado**.

4. **Verifica com o fornecedor do programa de faturação** (pede a resposta por escrito):
   - o programa e a versão estão **certificados pela AT** (lista no Portal das Finanças; DL 28/2019, art. 4.º, n.º 3);
   - aplica selo ou assinatura **qualificada** ao PDF e a assinatura é validável num leitor de PDF comum;
   - verifica se o certificado está **revogado, caducado ou suspenso** antes de assinar (art. 13.º, al. d));
   - o certificado é fornecido por eles ou tens de o comprar a um prestador qualificado;
   - custo, renovação e o que acontece quando o certificado expira;
   - exportação do SAF-T de faturação e, para 2027, da contabilidade;
   - geração de CIUS-PT, se tiveres clientes públicos.

5. **Confirma o prestador do certificado**:
   - consta da **lista de confiança** como prestador qualificado, com o serviço "certificado qualificado de selo" (ou "de assinatura") em estado ativo;
   - em Portugal a lista é gerida pelo **GNS** (DL 12/2021, art. 6.º; eIDAS, art. 22.º);
   - para prestadores de outros Estados-Membros, usa o navegador da Comissão Europeia: eidas.ec.europa.eu → *Trusted List Browser*;
   - o certificado de selo tem de estar em nome da tua empresa (NIF/denominação); o de assinatura, em nome de quem assina.

6. **Faturas que recebes** (o teu lado de cliente):
   - Até 31/12/2026, os PDF sem assinatura estão cobertos.
   - A partir de 1/1/2027, um PDF **sem** assinatura ou selo qualificado deixa de estar coberto. Risco de a AT recusar a **dedução do IVA** (CIVA, art. 19.º, n.º 2, al. a); posição da AT no processo n.º 17741, ponto 19) **(a confirmar a orientação da AT para 2027)**.
   - Em novembro, avisa os fornecedores de que, a partir de 2027, só aceitas PDF com assinatura ou selo qualificado, EDI ou papel (texto redigido a pedido).
   - Cria um endereço único para receber faturas. Valida a assinatura de cada PDF (prestador qualificado, em nome do fornecedor, válida na data) e guarda o **ficheiro original**, não uma impressão.
   - PDF sem assinatura em 2027 → pede a versão assinada ou o original em papel antes de deduzir o IVA.

7. **Faturas a entidades públicas** (B2G):
   - És **PME** (Recomendação 2003/361/CE)? → a partir de **1/1/2027** emites fatura eletrónica **CIUS-PT** em todos os contratos públicos (CCP, art. 299.º-B). Um PDF por e-mail, mesmo assinado, não chega (FAQ da eSPap).
   - Opções:
     - programa que gera CIUS-PT;
     - parceiro tecnológico (prestador de serviços de faturação eletrónica);
     - **Microportal FE-AP** da eSPap, para poucos documentos por ano (limite em `valores-2026`), quando a entidade pública adere ao FE-AP.
   - Pede a cada entidade pública cliente o canal de receção que usa. Ver `references/contratacao-publica.md`.

8. **Clientes privados: aceitação da via eletrónica**:
   - A fatura eletrónica depende da **aceitação do destinatário** (CIVA, art. 36.º, n.º 10; DL 28/2019, art. 12.º, n.º 1).
   - Informa os clientes por escrito e inclui a cláusula nas condições gerais e nos contratos novos.
   - Quem recusar recebe em papel.

9. **Testa antes de 31/12/2026**:
   - emite faturas de teste em **modo de treino** (identificadas como tal — DL 28/2019, art. 7.º, n.º 6);
   - abre o PDF num leitor comum e confirma: assinatura válida e qualificada, **ATCUD** em todas as páginas por cima do **QR**, QR legível;
   - envia uma fatura real a um cliente de confiança em dezembro e confirma que a receção funciona.

10. **Arquivo**:
    - **10 anos** (DL 28/2019, art. 19.º);
    - faturas eletrónicas emitidas **e recebidas** guardadas **sem alterações**, por ordem cronológica e **só em formato eletrónico** (art. 28.º);
    - arquivo eletrónico em qualquer Estado-Membro; fora da UE só com autorização prévia da AT (art. 20.º);
    - cópias de segurança em local distinto (art. 27.º);
    - se mudares de programa, garante que exportas tudo, incluindo os PDF assinados e o SAF-T, antes de cancelar a subscrição.

## Documentos a usar

- `references/faturacao.md` — requisitos, ATCUD e QR, comunicação à AT, fatura eletrónica, regime transitório, contratos públicos e arquivo
- `assets/checklists/checklist-faturacao.md` — verificação de conformidade, fatura a fatura e do sistema
- `references/fiscal.md` — IVA nacional e regimes
- `references/iva-internacional.md` — faturar a clientes estrangeiros (menções, autoliquidação, códigos)
- `references/contratacao-publica.md` — contratos públicos
- `assets/templates/pedido-informacao-vinculativa.md` — perguntar à AT por uma tecnologia "equivalente" ou pelo tratamento de faturas recebidas sem assinatura
- `assets/templates/dpa-bilingue.md` — acordo de tratamento de dados com o fornecedor do programa ou do arquivo na cloud
- `assets/checklists/checklist-revisao-contrato.md` — rever o contrato com o fornecedor do programa
- `registar_prazo` e `calendario_obrigacoes` (tools MCP) — datas de 31/12/2026, 1/1/2027 e comunicação mensal
- Comunicação a clientes e pedido a fornecedores sobre a fatura eletrónica — redigidos a pedido

## Quando chamar contabilista certificado ou advogado

- **Contabilista certificado**:
  - configuração do programa, séries e ATCUD;
  - comunicação mensal à AT;
  - SAF-T de faturação e da contabilidade (períodos de 2027);
  - tratamento de faturas recebidas sem assinatura e a respetiva dedução de IVA.
- **Fornecedor do programa ou parceiro tecnológico**:
  - selo qualificado;
  - CIUS-PT e ligação ao FE-AP;
  - integração EDI.
- **Advogado ou consultor fiscal**:
  - pedido de informação vinculativa sobre uma solução que não seja assinatura, selo ou EDI;
  - inspeção ou coima por falta de comunicação ou por faturas sem requisitos;
  - recusa de dedução de IVA pela AT;
  - litígio com o fornecedor do software;
  - contratos públicos com exigências de faturação fora do comum.
- **Sempre** que, depois de 1/1/2027, um fornecedor relevante insistir em enviar PDF sem assinatura: decide com o contabilista antes de deduzir o IVA dessas faturas.
