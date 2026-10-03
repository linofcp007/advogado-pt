<!-- Template: comunicação do EMPREGADOR ao trabalhador da caducidade do contrato de trabalho a termo —
     versão [A] termo certo (não renovação) e versão [B] termo incerto — manter só a aplicável.
     Âmbito: nacional
     Base legal: Código do Trabalho (Lei 7/2009), na versão consolidada em pgdlisboa.pt (última alteração:
     Lei 32/2025, de 27/03; a proposta de reforma "Trabalho XXI", que alargava a duração dos contratos a
     termo, foi rejeitada no Parlamento em junho de 2026, segundo a imprensa (a confirmar) — [VERIFICAR em
     dre.pt se houve alteração posterior]):
     - art. 340.º, al. a), e art. 343.º, al. a) (a caducidade pelo termo é forma de cessação);
     - art. 344.º, n.º 1 (termo certo: caduca no fim do prazo ou da renovação se o EMPREGADOR comunicar por
       ESCRITO a vontade de o fazer cessar até 15 DIAS antes de o prazo expirar — 8 dias se for o trabalhador);
       n.º 2 (compensação, calculada nos termos do art. 366.º, salvo se a caducidade resultar de declaração
       do trabalhador); n.º 5 (contraordenação grave);
     - art. 345.º, n.º 1 (termo incerto: comunicação com a antecedência mínima de 7, 30 ou 60 DIAS, conforme o
       contrato tenha durado até 6 meses, de 6 meses a 2 anos, ou mais); n.º 3 (sem comunicação, paga-se a
       retribuição do aviso prévio em falta); n.os 4 e 5 (compensação, nos termos do art. 366.º);
     - art. 147.º, n.º 2 (conversão em contrato SEM TERMO: renovação ilegal, limites de duração ou de renovações
       excedidos, ou trabalhador a termo incerto que continua a trabalhar após a data comunicada ou 15 dias
       após o termo); arts. 148.º e 149.º (duração máxima e renovação; sem declaração de cessação, o contrato
       renova-se por igual período — art. 149.º, n.º 2);
     - art. 144.º, n.º 1 (comunicar a cessação à comissão de trabalhadores e ao sindicato em 5 dias úteis) e
       n.º 3 (trabalhadora grávida, puérpera ou lactante, trabalhador em licença parental ou cuidador:
       comunicar o motivo da não renovação à entidade para a igualdade — CITE — com a antecedência mínima de
       5 dias úteis a contar da data do aviso prévio);
     - art. 341.º (certificado de trabalho e documentos para fins oficiais) e art. 342.º (devolução de
       instrumentos de trabalho); Código Civil, art. 224.º (a comunicação só é eficaz quando chega ao
       trabalhador).
     Valores: compensação com a tool `calc_compensacao_despedimento` (modalidade "termo", com data de
     admissão e de cessação) e restantes créditos com `calc_creditos_laborais`; dias por ano de antiguidade e
     tetos em references/valores-2026.md. -->

{{EMPREGADOR_NOME}}
{{EMPREGADOR_MORADA}}
NIF: {{EMPREGADOR_NIF}}

{{TRABALHADOR_NOME}}
{{TRABALHADOR_MORADA}}

{{LOCAL}}, {{DATA}}

**ASSUNTO: Comunicação de caducidade do contrato de trabalho a termo {{MODALIDADE: certo / incerto}}**
**({{FORMA_ENTREGA: carta registada com aviso de receção / entregue em mão contra recibo}})**

Exmo(a). Senhor(a) {{TRABALHADOR_NOME}},

<!-- ===================== [A] TERMO CERTO ===================== -->

Nos termos e para os efeitos do artigo 344.º, n.º 1, do Código do Trabalho, comunicamos a V. Exa. que não pretendemos renovar o contrato de trabalho a termo certo celebrado em {{DATA_CONTRATO}}, com início em {{DATA_INICIO}}{{RENOVACOES: opcional — e renovado em …}}, para o exercício das funções de {{CATEGORIA}}.

Em consequência, o contrato **cessa por caducidade no termo do prazo em curso, em {{DATA_FIM}}**, que será o seu último dia de trabalho.

<!-- ===================== [B] TERMO INCERTO ===================== -->

Nos termos e para os efeitos do artigo 345.º, n.º 1, do Código do Trabalho, comunicamos a V. Exa. que, prevendo-se a ocorrência do termo do contrato de trabalho a termo incerto celebrado em {{DATA_CONTRATO}}, com início em {{DATA_INICIO}}, para o exercício das funções de {{CATEGORIA}} — {{MOTIVO_TERMO: ex. o regresso ao serviço de … , trabalhador(a) substituído(a) / a conclusão da obra, projeto ou tarefa …}} —, o contrato **cessa por caducidade em {{DATA_FIM}}**, que será o seu último dia de trabalho.

Tendo o contrato durado {{DURACAO}}, a presente comunicação é feita com a antecedência mínima de {{ANTECEDENCIA_DIAS}} dias prevista no referido artigo.

<!-- ===================== COMUM ===================== -->

Na data da cessação, ou no prazo de {{PRAZO_PAGAMENTO: opcional — … dias}}, ser-lhe-ão pagos, por transferência para o IBAN {{IBAN_TRABALHADOR}}:

- a) A compensação por caducidade prevista no artigo {{ARTIGO_COMPENSACAO: 344.º, n.º 2 / 345.º, n.º 4}} do Código do Trabalho, no montante ilíquido de {{VALOR_COMPENSACAO}};
- b) As férias vencidas e não gozadas e o respetivo subsídio, bem como os proporcionais de férias, de subsídio de férias e de subsídio de Natal do ano da cessação, no montante ilíquido de {{VALOR_CREDITOS}};
- c) {{OUTROS_CREDITOS: opcional — retribuição de … / trabalho suplementar / formação não ministrada …}}.

Serão ainda entregues o certificado de trabalho e os documentos destinados a fins oficiais, designadamente a declaração para efeitos de proteção no desemprego (art. 341.º do Código do Trabalho).

Solicitamos que, até ao último dia de trabalho, proceda à devolução dos instrumentos de trabalho e de quaisquer outros bens da empresa que tenha em seu poder, designadamente {{BENS_A_DEVOLVER: ex. computador portátil, telemóvel, cartão de acesso, viatura}} (art. 342.º do Código do Trabalho).

Agradecemos a colaboração prestada e ficamos ao dispor para qualquer esclarecimento.

Com os melhores cumprimentos,

_______________________________
{{EMPREGADOR_REPRESENTANTE}}, {{EMPREGADOR_QUALIDADE: gerente / administrador / diretor de recursos humanos}}

{{RECIBO: se entregue em mão — Recebi o original desta comunicação em … (data). Assinatura do(a) trabalhador(a): ____________________}}

---

## Antes de enviar — verificar

_(Lista para quem envia — não faz parte do documento.)_

- [ ] ⏰ **Termo certo**: a carta tem de **chegar** ao trabalhador pelo menos **15 dias** antes do fim do prazo (art. 344.º, n.º 1, CT; a declaração só é eficaz quando chega ao destinatário — art. 224.º CC). Contar com `calc_prazo` (tipo `corridos`) para trás a partir de `{{DATA_FIM}}` e enviar com folga para a entrega do registado. Sem comunicação atempada, o contrato **renova-se** por igual período (art. 149.º, n.º 2). Se o contrato tiver cláusula de não renovação (art. 149.º, n.º 1), enviar a comunicação na mesma, por cautela [VERIFICAR].
- [ ] ⏰ **Termo incerto**: antecedência mínima de **7 dias** (contrato até 6 meses), **30 dias** (de 6 meses a 2 anos) ou **60 dias** (mais de 2 anos) — art. 345.º, n.º 1. Em falta, paga-se a retribuição do período em falta (n.º 3). Se o trabalhador continuar a trabalhar depois da data indicada (ou 15 dias após o termo, sem comunicação), o contrato passa a **sem termo** (art. 147.º, n.º 2, al. c)).
- [ ] **O contrato ainda é mesmo a termo?** Confirmar motivo justificativo concreto, forma escrita, duração máxima (termo certo: 2 anos; termo incerto: 4 anos — art. 148.º, n.os 1 e 5) e renovações (até 3 e, no total, não mais do que o período inicial — art. 149.º, n.º 4). Se já se converteu em contrato sem termo (art. 147.º), esta carta pode valer como **despedimento ilícito** — parar e consultar um advogado.
- [ ] ⏰ **Parentalidade e cuidadores**: trabalhadora grávida, puérpera ou lactante, trabalhador em licença parental ou trabalhador cuidador → comunicar à CITE o motivo da não renovação com a antecedência mínima de **5 dias úteis** a contar da data do aviso prévio (art. 144.º, n.º 3 — contraordenação grave se faltar).
- [ ] ⏰ Comunicar a cessação à comissão de trabalhadores e ao sindicato em que o trabalhador esteja filiado em **5 dias úteis**, e ao serviço com competência inspetiva nos termos da portaria aplicável (art. 144.º, n.os 1 e 2) [VERIFICAR o meio de comunicação à ACT e a comunicação à Segurança Social].
- [ ] **Valores**: compensação (arts. 344.º, n.º 2, e 345.º, n.º 4 — dias por ano e tetos em `references/valores-2026.md`) com `calc_compensacao_despedimento`, modalidade `termo`, com `data_admissao` e `data_cessacao`; férias e proporcionais com `calc_creditos_laborais`. Não há compensação se a caducidade decorrer de declaração do próprio trabalhador (art. 344.º, n.º 2, parte final). Retenções de IRS e Segurança Social — com o contabilista.
- [ ] Entregar o certificado de trabalho e os documentos para fins oficiais (art. 341.º — contraordenação leve se faltar); confirmar o modelo da declaração para o subsídio de desemprego [VERIFICAR].
- [ ] Prova da entrega: carta registada com AR ou entrega em mão com data e assinatura de receção. Apagar a versão [A] ou [B] que não se aplica e os comentários `<!-- -->`.
