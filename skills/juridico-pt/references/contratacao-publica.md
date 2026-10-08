# Contratação Pública (Vender ao Estado)

> **Âmbito:** misto
>
> 💶 **Limiares dos procedimentos, valores de caução e taxas de justiça do contencioso pré-contratual:** ver `references/valores-2026.md` e o CCP (os limiares são atualizados, designadamente pelas diretivas UE). Cláusulas contratuais gerais em `references/contratos.md`; consórcios e vertente internacional em `references/contratos-internacionais.md`.

## Legislação Base
- Código dos Contratos Públicos — CCP: DL 18/2008 e alterações (incl. DL 111-B/2017 e **DL 177/2026**, 17.ª alteração, em vigor a 1/10/2026 para os procedimentos iniciados a partir dessa data — sobe os limiares do ajuste direto e da consulta prévia e revoga as medidas especiais da Lei 30/2021; limiares em `references/valores-2026.md`, secção Contratação Pública)
- Diretivas UE 2014/24 (setores clássicos) e 2014/25 (setores especiais: água, energia, transportes)
- Código de Processo nos Tribunais Administrativos — CPTA: contencioso pré-contratual urgente
- Lei dos Tribunais Administrativos e Fiscais (organização da jurisdição administrativa)
- DL 177/2026: aplicação no tempo — as alterações aplicam-se aos procedimentos **iniciados após** 1/10/2026 e aos contratos deles resultantes; aos procedimentos e contratos em curso só se aplicam já as regras novas de **modificação objetiva do contrato** e de **resolução alternativa de litígios** (DL 177/2026, arts. 10.º e 11.º); norma transitória dos limiares e do cálculo acumulado do art. 113.º, n.º 2 (art. 7.º, n.os 2 e 3); revogações, incl. o antigo art. 22.º do CCP e os arts. 2.º a 16.º da Lei 30/2021 (art. 8.º). Também alterou o DL 104/2011 (defesa e segurança)
- Código do Procedimento Administrativo — CPA, art. 87.º: contagem dos prazos da fase de formação (dias úteis, sem dilação — CCP, arts. 267.º, n.º 2, e 470.º); subsidiário nas impugnações administrativas (CCP, art. 267.º, n.º 1)
- Lei 96/2015, de 17 de agosto (plataformas eletrónicas de contratação pública): escolha livre entre plataformas licenciadas pelo IMPIC (arts. 4.º e 5.º), pelo menos 3 acessos gratuitos aos serviços base (art. 23.º, n.os 2 e 3; serviços base no art. 24.º), registo gratuito em até 3 dias úteis (art. 28.º, n.º 3), assinatura eletrónica qualificada dos documentos (art. 54.º) — sem alterações segundo a PGDL (a confirmar no DR)
- Fatura eletrónica nos contratos públicos: CCP, art. 299.º-B; DL 111-B/2017, art. 9.º (redação do DL 123/2018) — dispensa das micro, pequenas e médias empresas prorrogada até 31/12/2026 pela Lei 73-A/2025, art. 260.º, n.º 2 (pormenores em `references/faturacao.md`)

## Tipos de procedimento (escolha em função do valor e do objeto)
- **Ajuste direto**: convite a uma única entidade; só para valores baixos ou casos excecionais
- **Consulta prévia**: convite a, em regra, três ou mais entidades
- **Concurso público**: aberto a todos os interessados; obrigatório a partir de certos limiares (e sempre para valores acima dos limiares europeus)
- **Concurso limitado por prévia qualificação**: fase de qualificação dos candidatos + fase de apresentação de propostas
- **Procedimento de negociação** e **diálogo concorrencial**: para necessidades complexas, com negociação das propostas/soluções
- **Parceria para a inovação**: desenvolvimento de soluções inovadoras ainda não disponíveis no mercado
- Limiares concretos (valor do contrato) → remeter ao CCP e a `references/valores-2026.md`
- **Procedimento pelo valor** → tool `calc_procedimento_ccp` (ou `scripts/procedimento_ccp.py`): ajuste direto e consulta prévia abaixo dos limiares dos arts. 19.º, als. c) e d) (empreitadas), e 20.º, n.º 1, als. c) e d) (bens e serviços), na redação do DL 177/2026; outros contratos: art. 21.º. Concurso público ou limitado: qualquer valor, com anúncio no JOUE acima dos limiares europeus (art. 474.º)
- **Valor estimado do contrato** (DL 177/2026): preço estimado a pagar pela entidade adjudicante e por terceiros, mais contrapartidas e vantagens do adjudicatário (art. 17.º, n.º 1), sem IVA (art. 473.º); regras especiais de cálculo no art. 17.º-A; **proibição de fracionamento** e soma de prestações do mesmo tipo contratadas em vários procedimentos no art. 17.º-B (substitui o antigo art. 22.º, revogado); adjudicação por lotes no art. 46.º-A
- **Escolha por critérios materiais** (independente do valor): arts. 23.º a 30.º-A (ajuste direto: arts. 24.º a 27.º; o art. 27.º-A está revogado)
- **Consulta prévia especial** (novos arts. 127.º-A a 127.º-C): convite a pelo menos 5 entidades, abaixo dos limiares europeus e de um teto próprio, só para certos objetos (fundos europeus, habitação pública, equipamentos informáticos, software, cloud, consultoria para transformação digital, saúde e apoio social, intervenções prioritárias) — substitui a consulta prévia simplificada da Lei 30/2021
- **Ajuste direto simplificado** (arts. 128.º e 129.º, **sem alteração** pelo DL 177/2026): adjudicação sobre fatura, sem plataforma nem fatura eletrónica; contrato até 3 anos, preço não revisível. Novo regime para estados de emergência/calamidade (art. 129.º-A). Limiares em `references/valores-2026.md`
- **Concurso público flexível** abaixo dos limiares europeus (novos arts. 161.º-A a 161.º-E): a entidade pode simplificar regras, exigir requisitos mínimos de capacidade, avaliar por fases; prazo de audiência prévia pode ser de 3 dias e as impugnações administrativas correm em 3 dias (art. 161.º-B)
- **Setores especiais** (água, energia, transportes, serviços postais): entidades do art. 7.º só sujeitas à parte II acima dos limiares europeus (art. 11.º) e com escolha de procedimento própria (art. 33.º); organismos de direito público nesses setores seguem as mesmas regras especiais (art. 12.º)

## Plataformas e publicidade
- **Plataformas eletrónicas de contratação pública** certificadas: submissão obrigatoriamente eletrónica (propostas, esclarecimentos, etc.)
- **Portal BASE.gov.pt**: publicitação de procedimentos, anúncios e contratos celebrados
- Procedimentos acima dos limiares europeus: publicação também no **JOUE / TED**

## Candidatura e proposta
- **Documentos de habilitação**: situação regularizada perante AT e Segurança Social, registo criminal dos titulares, não verificação de impedimentos
- **Capacidade técnica e financeira**: experiência, meios humanos/técnicos, demonstração de robustez financeira (quando exigida)
- **Critérios de adjudicação**: (i) **mais baixo preço** ou (ii) **melhor relação qualidade-preço** (preço + fatores como qualidade técnica, prazo, suporte)
- **Erros e omissões**: prazo para os apresentar/identificar nas peças, sob pena de não poderem ser invocados depois
  - Precisão (CCP, art. 50.º, não alterado pelo DL 177/2026): os **interessados** pedem esclarecimentos e **devem** apresentar a lista de erros e omissões no **1.º terço** do prazo de apresentação das propostas (n.º 1); a entidade responde até ao fim do **2.º terço** ou no prazo do convite/programa, e os erros não aceites expressamente consideram-se **rejeitados** (n.º 5). Consequência típica nas empreitadas: o empreiteiro suporta metade dos trabalhos complementares de erros e omissões detetáveis nessa fase (art. 378.º, n.º 3). Convite com prazo inferior a 6 dias: art. 116.º
- **Documentos da proposta** (DL 177/2026): foi revogada a antiga declaração de aceitação do caderno de encargos (art. 57.º, n.º 1, al. a), e anexo I); nos procedimentos com anúncio no JOUE apresenta-se o DEUCP (art. 57.º, n.º 6). Prazo para apresentar propostas é contínuo (art. 470.º, n.º 3); manutenção das propostas: 66 dias (art. 65.º)
- **Habilitação "só uma vez"** (DL 177/2026): a entidade obtém oficiosamente os documentos por interoperabilidade e só pede os que não conseguir (art. 81.º, n.º 10; força probatória no art. 83.º-A); plano de prevenção da corrupção exigível se o contrato for a visto do Tribunal de Contas, salvo PME certificada (art. 81.º, n.º 9)
- **Novos instrumentos para fornecedores** (DL 177/2026): iniciativas espontâneas (art. 35.º-B), período de teste gratuito de sistemas de TI (art. 35.º-C), contratos reservados a PME e a startups (art. 54.º-A, n.º 1, als. b) e d))
- **Audiência prévia** sobre o relatório preliminar (não alterada pelo DL 177/2026): consulta prévia — prazo não inferior a **3 dias** (art. 123.º, n.º 1); concurso público — não inferior a **5 dias** (art. 147.º); nova audiência se o relatório final mudar a ordenação ou propuser novas exclusões (arts. 124.º, n.º 2, e 148.º, n.º 2)

## Impedimentos, exclusão e garantias
- **Impedimentos** (Art. 55.º CCP): condenações, dívidas fiscais/contributivas, conflitos de interesse, falsas declarações
- **Causas de exclusão de propostas**: preço anormalmente baixo não justificado, não conformidade com o caderno de encargos, falta de documentos essenciais
- **Caução**: garantia do cumprimento do contrato (percentagem do preço contratual); confirmar montantes em `references/valores-2026.md`
  - DL 177/2026 (nova redação do art. 88.º, n.º 2, al. a)): pode não ser exigida abaixo de um certo preço contratual (limiar anterior a confirmar) ou ser substituída por seguro de execução / declaração bancária de responsabilidade solidária (art. 88.º, n.º 4); presta-se em 10 dias após a notificação da adjudicação (art. 90.º, n.º 1); falta de caução → caducidade da adjudicação (art. 91.º). Limiar e percentagens máximas (art. 89.º) em `references/valores-2026.md`
- **Exclusão de propostas** (DL 177/2026): causas unificadas no art. 70.º (n.º 2 — formais; n.º 3 — materiais); preço ou custo anormalmente baixo só depois de pedir esclarecimentos ao concorrente (art. 71.º, n.º 3); irregularidades formais supríveis em até 5 dias (art. 72.º, n.º 3). Nova causa de não adjudicação: todas as propostas abaixo da pontuação global mínima (art. 79.º, n.º 1, al. h))
- **Impedimentos e dívidas**: a entidade pode admitir quem tenha dívidas fiscais/contributivas até um limiar, com cessão do crédito à AT/SS (art. 55.º, n.º 3 — limiar em `references/valores-2026.md`)

## Execução do contrato
- **Contrato escrito** (regra) e sujeito a fiscalização pela entidade adjudicante
- **Modificações objetivas**: admissíveis dentro de limites legais (circunstâncias imprevistas, alterações de pequeno valor)
- **Sanções contratuais** por incumprimento (multas contratuais, resolução)
- **Revisão de preços**: nos termos contratualmente previstos e da lei

## Impugnações (prazos curtos!)
- **Reclamações** das peças do procedimento e **impugnações administrativas** de atos (ex.: ato de exclusão, de adjudicação)
- **Contencioso pré-contratual urgente** nos **tribunais administrativos** (CPTA): prazos reduzidos; pode pedir-se medida cautelar de suspensão do procedimento
- Importa reagir **de imediato** — perder o prazo precludindo o direito de impugnar é frequente
- ⏰ **Impugnação administrativa** (CCP, arts. 267.º a 274.º, não alterados pelo DL 177/2026): facultativa (art. 268.º); de quaisquer decisões e das peças (art. 269.º); **5 dias úteis** a contar da notificação (art. 270.º; 3 dias no concurso flexível — art. 161.º-B, n.º 4); todos os fundamentos no requerimento; recurso das deliberações do júri para o órgão competente para a decisão de contratar (art. 271.º); não suspende o procedimento, mas trava qualificação, negociação e adjudicação até à decisão (art. 272.º); decisão em 5 dias, silêncio = rejeição (art. 274.º)
- ⏰ **Contencioso pré-contratual** (CPTA, arts. 100.º a 103.º-B): ação em **1 mês** (art. 101.º), processo urgente (art. 36.º, n.º 1, al. c)), advogado obrigatório (art. 11.º, n.º 1); impugnação das peças durante o procedimento (art. 103.º); a ação contra a adjudicação proposta em **10 dias úteis** suspende automaticamente a adjudicação ou o contrato quando há prazo de suspensão (art. 103.º-A; CCP, arts. 95.º, n.º 3, e 104.º, n.º 1, al. a) — não no ajuste direto nem na consulta prévia); medidas provisórias (art. 103.º-B). A impugnação administrativa suspende o prazo da ação (CPTA, art. 59.º, n.º 4, por remissão do art. 101.º) — (a confirmar com advogado)
- **Arbitragem voluntária e comissões de conciliação** para litígios pré-contratuais e contratuais (DL 177/2026: CCP, arts. 464.º-B a 464.º-G; aplicam-se também a procedimentos e contratos em curso — DL 177/2026, art. 10.º, n.º 2, al. b))

## Para o contexto do utilizador (empresa de software/consultoria)
- **Como concorrer**: registar-se numa plataforma eletrónica certificada, manter situação fiscal/contributiva regularizada e os documentos de habilitação prontos a apresentar
- **Cuidados na proposta**: ler o caderno de encargos na íntegra; respeitar requisitos técnicos mínimos (são eliminatórios); fundamentar o preço para evitar exclusão por "preço anormalmente baixo"; usar a fase de esclarecimentos/erros e omissões
- **Consórcios / agrupamentos de concorrentes**: permitem somar capacidade técnica e financeira para concursos de maior dimensão (regular bem responsabilidades e repartição — ver `references/contratos.md` e `references/contratos-internacionais.md`)
- Em prazos de impugnação ou contencioso pré-contratual, recomenda-se **advogado** (ver `SKILL.md`)
- **Guia passo a passo**: `playbooks/vender-ao-estado.md` (registo na plataforma, oportunidades, procedimento pelo valor com `calc_procedimento_ccp`, prazos ⏰, audiência prévia, impugnações, caução, faturação e pagamento — art. 299.º: 30 dias, com teto contratual de 60)
- **Antes de começar a executar** um contrato de ajuste direto ou consulta prévia: confirma a publicitação no portal BASE — é condição de eficácia para quaisquer pagamentos (art. 127.º, n.º 3)

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Checklist de submissão de proposta (habilitação, capacidade, conformidade com o caderno de encargos) (a pedido)
- `assets/templates/pedido-esclarecimentos-ccp.md` — pedido de esclarecimentos sobre as peças (art. 50.º)
- `assets/templates/lista-erros-omissoes-ccp.md` — lista de erros e omissões (art. 50.º)
- `assets/templates/pronuncia-audiencia-previa-ccp.md` — pronúncia sobre o relatório preliminar (arts. 123.º / 147.º)
- `assets/templates/impugnacao-administrativa-ccp.md` — reclamação ou recurso administrativo de peças ou de atos do procedimento (arts. 267.º a 274.º), com nota sobre o contencioso pré-contratual urgente
