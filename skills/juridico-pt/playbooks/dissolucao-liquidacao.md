# Playbook: Quero fechar a empresa (dissolução e liquidação)

> Quando usar: queres encerrar uma **sociedade** (Unipessoal Lda, Lda ou SA) — porque o negócio acabou, os sócios se separam ou a sociedade está parada. Serve a qualquer setor e dimensão; o caminho depende de a sociedade ter **ativo**, **passivo** e **trabalhadores** — confirma no perfil da empresa (`.juridico-pt/perfil-empresa.md`, tool `obter_perfil_empresa`) a forma jurídica, o n.º de trabalhadores e o regime de IVA/IRC.
> **Empresário em nome individual (ENI)?** Não há dissolução: entregas a **declaração de cessação de atividade** nas Finanças em 30 dias (art. 33.º CIVA) e as dívidas continuam a ser tuas — ver `references/fiscal.md` e `references/insolvencia.md`.
> **Âmbito:** nacional (CSC, arts. 141.º-165.º; RJPADLEC — Anexo III ao DL 76-A/2006; confirmar a redação em vigor em dre.pt).

## Passo 0 — Não percas prazos

- ⏰ **A sociedade não consegue pagar as dívidas** (ou o passivo é manifestamente superior ao ativo)? Então isto **não é uma dissolução voluntária — é insolvência**: dever de apresentação em **30 dias** a contar do conhecimento (art. 18.º CIRE). O atraso faz presumir culpa grave dos gerentes (art. 186.º, n.º 3, CIRE). Vai já para `references/insolvencia.md`.
- ⏰ **Registo da dissolução:** pedir em **2 meses** a contar da deliberação (CRCom, art. 15.º, n.º 2; art. 145.º, n.º 2, CSC). Com o registo, a sociedade entra em liquidação mas mantém a personalidade jurídica.
- ⏰ **Contas reportadas à data da dissolução:** organizadas e aprovadas nos **60 dias** seguintes à dissolução (art. 149.º, n.os 1 e 2, CSC).
- ⏰ **Duração máxima da liquidação:** encerrada e partilha aprovada em **2 anos** a contar da dissolução, prorrogáveis **uma vez por 1 ano** por deliberação dos sócios (art. 150.º, n.os 1 e 2, CSC). Depois disso, a conservatória promove **oficiosamente** a liquidação administrativa (n.º 3).
- ⏰ **Registo do encerramento da liquidação:** pedir em **2 meses** a contar da deliberação que aprova as contas finais. A sociedade só se **extingue com este registo** (art. 160.º CSC).
- ⏰ **Finanças:** declaração de cessação em **30 dias** — IVA, a contar da cessação (art. 33.º CIVA); IRC, a cessação ocorre na **data do encerramento da liquidação** (art. 8.º, n.º 5, al. a), CIRC) e a declaração entrega-se em 30 dias (art. 118.º, n.º 6, CIRC). Declaração Modelo 22 do período da cessação até ao **30.º dia** seguinte (art. 120.º, n.º 3, CIRC — a confirmar a redação atual).
- ⏰ **Trabalhadores:** o encerramento total e definitivo faz **caducar** os contratos, mas obriga a seguir o procedimento do despedimento coletivo (arts. 346.º, n.º 3, e 360.º e ss. CT); em **microempresa**, basta informar cada trabalhador com a antecedência do art. 363.º, n.os 1 e 2 (art. 346.º, n.º 4). Há sempre **compensação** (art. 346.º, n.º 5) — tool `calc_compensacao_despedimento`.
- ⏰ **Conservação de documentos:** os livros e documentos ficam com o **depositário** designado pelos sócios durante **5 anos** (art. 157.º, n.º 4, CSC); para efeitos fiscais, a contabilidade e os documentos de suporte guardam-se **10 anos** (art. 123.º, n.º 4, CIRC — a confirmar a redação atual). Guarda **10 anos**.
- Regista cada prazo com a tool `registar_prazo` e vê as obrigações periódicas que continuam a correr durante a liquidação com `calendario_obrigacoes`.

## Fluxo de decisão

1. **A sociedade tem dívidas que não consegue pagar?** → se SIM: **insolvência** (ou, se ainda for recuperável, PER/RERE) — `references/insolvencia.md`. **Não** faças uma "dissolução na hora" a declarar que não há passivo: se aparecerem credores, respondes como antigo sócio até ao que recebeste na partilha (art. 163.º CSC) e, como gerente, arriscas a reversão de dívidas fiscais e à Segurança Social (LGT, art. 24.º) e a qualificação de insolvência culposa · se NÃO: passo 2.

2. **Que via de encerramento?**
   - **Sem ativo e sem passivo** (contas bancárias a zero e encerradas, sem bens, sem dívidas a ninguém — Finanças, Segurança Social, trabalhadores, fornecedores, banco) **e todos os sócios de acordo** → **Ramo A — Extinção imediata ("Dissolução e Liquidação na Hora")**.
   - **Sem dívidas, mas com bens ou dinheiro para repartir** → **Ramo B — Dissolução com partilha imediata** (art. 147.º CSC).
   - **Com ativo e com dívidas que consegues pagar** → **Ramo C — Dissolução e liquidação** (arts. 146.º e ss. CSC).
   - **Sociedade parada ou sócios desavindos** sem acordo para deliberar → **Ramo D — Dissolução administrativa**.

3. **Toma a decisão de dissolver.**
   - **Unipessoal:** decisão do sócio único, registada em ata por ele assinada (art. 270.º-E CSC) — adapta `assets/templates/decisao-socio-unico.md` (dissolução, nomeação de liquidatário, contas finais e partilha).
   - **Lda pluripessoal:** deliberação por maioria de **3/4 dos votos correspondentes ao capital social**, salvo se o pacto exigir mais (art. 270.º, n.º 1, CSC); a extinção imediata (Ramo A) exige **unanimidade**.
   - **Forma:** a dissolução deliberada em assembleia não depende de forma especial — basta a ata (art. 145.º, n.º 1, CSC) [VERIFICAR — documento exigido no registo se houver imóveis a partilhar].
   - **RCBE:** a declaração tem de estar **atualizada** para o registo da dissolução.

4. **Quem liquida?** Os gerentes passam a **liquidatários** a partir da dissolução, salvo cláusula do pacto ou deliberação em contrário (art. 151.º, n.º 1, CSC). Os sócios podem destituí-los e nomear outros a todo o tempo (n.º 2). Pessoas coletivas só podem ser liquidatárias se forem sociedades de advogados ou de ROC (n.º 5). Designação e destituição sujeitas a registo (n.º 7). Na firma acrescenta-se **"em liquidação"** (art. 146.º, n.º 3).

5. **Liquida (Ramo C):**
   - Aprova as contas à data da dissolução em 60 dias (art. 149.º).
   - **Converte o ativo em dinheiro**: cobra clientes, vende equipamento, stock, viaturas, marcas e domínios (ou atribui-os em espécie na partilha — só se o pacto o previr ou os sócios o deliberarem por unanimidade, art. 156.º, n.º 1).
   - **Termina os contratos**: arrendamento (pré-avisos — `references/arrendamento.md`), leasing e renting, fornecedores, software, seguros, licenças. Trabalhadores: passo 0 e `playbooks/quero-despedir.md`.
   - **Paga todas as dívidas** para as quais o ativo chegue (art. 154.º, n.º 1). Credor que não aparece → **consignação em depósito** (n.º 2); dívida litigiosa → **caução** (n.º 3). Suprimentos dos sócios só são reembolsados depois de pagos os credores (art. 245.º, n.º 3, CSC).
   - **Se afinal o ativo não chegar** para as dívidas → para e volta ao passo 1 (insolvência).

6. **Contas finais e partilha.**
   - Os liquidatários apresentam **contas finais, relatório completo da liquidação e projeto de partilha** (art. 157.º, n.os 1 e 3), declarando expressamente que **todos os credores estão pagos ou acautelados** (n.º 2). Declarar isto falsamente torna-os **pessoalmente responsáveis** perante os credores (art. 158.º CSC — a confirmar a redação).
   - Os sócios deliberam sobre as contas e o relatório e designam o **depositário dos livros e documentos** (art. 157.º, n.º 4).
   - **Partilha:** primeiro reembolsam-se as entradas efetivamente realizadas; o saldo reparte-se na proporção da distribuição de lucros (art. 156.º, n.os 2 e 4).
   - **Fiscal da partilha:** o que cada sócio recebe acima do custo das quotas é tributado (IRS ou IRC) e os bens atribuídos em espécie podem ter IVA e mais-valias na sociedade — fala com o contabilista certificado e vê `references/fiscal.md` (a confirmar o enquadramento) e `calc_irc`.

7. **Regista o encerramento da liquidação** (art. 160.º, n.º 1) em 2 meses — com ele, a sociedade extingue-se (n.º 2). Custos de registo: [VERIFICAR] (Regulamento Emolumentar dos Registos e Notariado — confirmar em justica.gov.pt).

8. **Finanças, Segurança Social e outros.**
   - **AT:** declaração de cessação (IVA, art. 33.º CIVA; IRC, art. 118.º, n.º 6, CIRC) — o portal do registo indica que a comunicação da cessação à AT cabe ao requerente; Modelo 22 e IES do último período (prazo da IES final: a confirmar); IVA e retenções até ao último período.
   - **Segurança Social:** a cessação comunicada à AT e o registo do encerramento da liquidação chegam à Segurança Social por via eletrónica (a confirmar em seg-social.pt); cessa antes os **vínculos dos trabalhadores** na Segurança Social Direta (prazo: a confirmar) e paga as contribuições do último mês entre os dias 1 e 25 do mês seguinte.
   - **Bancos** (encerrar contas só depois do último pagamento), **câmara municipal** (licenças), **INPI** (marcas), **registos de domínio**, **RGPD** (apagar ou entregar dados que já não tenhas fundamento para guardar — `references/rgpd.md`).

9. **Depois da extinção.**
   - **Passivo superveniente:** os antigos sócios respondem pelo passivo não satisfeito ou acautelado **até ao montante que receberam na partilha** (art. 163.º, n.º 1); as ações correm contra os sócios na pessoa dos liquidatários (n.º 2).
   - **Dívidas fiscais ainda não exigíveis** à data da partilha imediata: os sócios respondem **ilimitada e solidariamente** (art. 147.º, n.º 2) — reserva verba para elas.
   - **Ativo superveniente** (um crédito ou bem que apareça depois) → partilha adicional pelos antigos sócios (art. 164.º CSC — a confirmar o procedimento).

### Ramo A — Extinção imediata ("Dissolução e Liquidação na Hora")

- **Pressupostos cumulativos** (RJPADLEC, art. 27.º): requerimento de **qualquer sócio ou gerente**; **ata com deliberação unânime** de dissolução e liquidação tomada por **todos** os sócios; **declaração, na própria ata, de que não existe ativo nem passivo a liquidar** (confirmar a redação em vigor em dre.pt). Na unipessoal, a ata é a decisão do sócio único.
- **Onde:** conservatória do registo comercial ou balcão Empresa na Hora/Espaço Empresa; o pedido deve ser feito até **2 meses** após a ata (a confirmar). A conservatória declara a dissolução e o encerramento da liquidação no próprio ato e comunica-os eletronicamente à AT e à Segurança Social (a confirmar na redação atual do RJPADLEC).
- **Antes de ir:** contas bancárias a zero e encerradas, bens vendidos ou distribuídos, IVA, retenções e contribuições declarados e pagos, trabalhadores com contratos cessados e compensações pagas, RCBE atualizado. **Se houver qualquer dívida, não é este o caminho.**
- **Depois:** entrega a declaração de cessação e as declarações fiscais do último período (passo 8); guarda os documentos (passo 0).

### Ramo B — Dissolução com partilha imediata

- Se, à data da dissolução, **não houver dívidas**, os sócios podem partilhar logo os haveres (art. 147.º, n.º 1, CSC), pela ordem do art. 156.º (passo 6), registando **dissolução e encerramento da liquidação em simultâneo**.
- **Dívidas fiscais ainda não exigíveis** não impedem a partilha, mas os sócios respondem por elas **ilimitada e solidariamente** (art. 147.º, n.º 2) — ex.: IVA ou IRC do último período.

### Ramo D — Dissolução administrativa

- **A pedido** da sociedade, de sócios, sucessores ou credores (RJPADLEC, art. 4.º), com fundamento, nomeadamente, em: atividade **parada há 2 anos consecutivos**, atividade contratual impossível, atividade diferente do objeto, ou número de sócios abaixo do mínimo legal há mais de 1 ano (art. 142.º CSC).
- **Oficiosa**, pela conservatória (RJPADLEC, art. 5.º), por exemplo quando a sociedade **não deposita as contas durante 2 anos consecutivos** e a AT comunica a falta da declaração de rendimentos, ou quando a AT comunica a ausência de atividade ou a cessação oficiosa (art. 8.º, n.º 6, CIRC).
- **"Deixar morrer" a empresa não é estratégia:** as obrigações declarativas continuam (coimas), os gerentes continuam expostos à reversão (LGT, art. 24.º) e a falta de depósito das contas pesa contra eles numa eventual insolvência (art. 186.º, n.º 3, CIRE). Se a sociedade tem dívidas, é o passo 1.

## Documentos a usar

- `assets/templates/decisao-socio-unico.md` — base para a ata do sócio único: dissolução, designação/destituição de liquidatário, aprovação das contas finais e partilha (adaptar)
- `references/societario.md` — deveres e responsabilidade dos gerentes, quotas, suprimentos
- `references/insolvencia.md` — se o passivo exceder o ativo: dever de apresentação, PER, RERE, insolvência culposa
- `references/fiscal.md` — cessação de atividade, IVA, IRC e tributação da partilha
- `references/laboral.md` e `playbooks/quero-despedir.md` — cessação dos contratos de trabalho e compensações
- `references/arrendamento.md` — denúncia ou oposição à renovação do arrendamento da sede/loja
- `assets/templates/contrato-trespasse.md` — alternativa: vender o estabelecimento (com clientela e trabalhadores) antes de dissolver
- `assets/templates/contrato-cessao-quotas.md` — alternativa: vender a sociedade em vez de a fechar
- `references/valores-2026.md` — compensação de despedimento e outros valores de referência
- Tool `calc_compensacao_despedimento` — compensação por caducidade dos contratos (art. 346.º, n.º 5, e art. 366.º CT)
- Tool `calc_irc` — estimativa do IRC do último período
- Tools `registar_prazo` / `calendario_obrigacoes` — prazos de registo, cessação e obrigações declarativas finais

## Quando chamar advogado presencial

- Há **passivo** que a sociedade não consegue pagar, ou credores em litígio — insolvência ou negociação com credores, nunca uma extinção "na hora".
- Os sócios **não estão de acordo** sobre dissolver, liquidar ou partilhar, ou há sócio minoritário a contestar.
- Há **trabalhadores** e a empresa não é microempresa — procedimento de despedimento coletivo, com comunicações aos trabalhadores, às suas estruturas representativas e ao serviço competente do ministério do trabalho (arts. 360.º e ss. CT — a confirmar), e alto risco de impugnação.
- Há **imóveis**, participações noutras sociedades, marcas valiosas ou bens a atribuir em espécie — forma, registos e impacto fiscal da partilha.
- A sociedade tem **dívidas fiscais ou à Segurança Social** em execução, ou os gerentes já foram citados para **reversão**.
- Foi **dissolvida oficiosamente** e queres reagir, ou apareceu **passivo superveniente** depois da extinção.
