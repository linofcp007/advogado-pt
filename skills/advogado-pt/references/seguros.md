# Seguros (Negócio e Pessoais)

## Legislação Base
- Regime Jurídico do Contrato de Seguro (LCS): DL 72/2008, de 16 de abril
- Código Civil (CC): responsabilidade civil extracontratual — Arts. 483.º e seguintes
- Regime de reparação de acidentes de trabalho e doenças profissionais: Lei 98/2009 (cross-ref `laboral.md`)
- Seguro obrigatório de responsabilidade civil automóvel: DL 291/2007
- Supervisão do setor: Autoridade de Supervisão de Seguros e Fundos de Pensões (ASF) — regime no DL 147/2015 (acesso e exercício da atividade seguradora e resseguradora)

## Conceitos-Chave do Contrato de Seguro

### Partes e intervenientes (não confundir)
- **Tomador do seguro**: quem celebra o contrato com a seguradora e fica obrigado ao pagamento do prémio
- **Segurado**: a pessoa ou entidade cujo risco/interesse está coberto (pode coincidir ou não com o tomador)
- **Beneficiário**: quem recebe a indemnização ou o capital (relevante sobretudo em seguros de pessoas/vida)
- **Segurador**: a empresa de seguros que assume o risco

### Elementos económicos
- **Prémio**: contrapartida paga pela cobertura. Regra geral, sem pagamento não há cobertura (Arts. 59.º-61.º LCS — princípio "no premium, no cover")
- **Capital seguro**: limite máximo da responsabilidade do segurador por sinistro e/ou anuidade
- **Franquia**: parte do dano que fica a cargo do segurado (descontada da indemnização)
- **Período de carência**: período inicial durante o qual certas coberturas ainda não produzem efeitos
- **Sub-rogação do segurador**: depois de pagar, o segurador fica sub-rogado nos direitos do segurado contra o terceiro responsável (Art. 136.º LCS)

### Dever de declaração inicial do risco (Art. 24.º LCS)
- O tomador/segurado tem o dever de **declarar com exatidão todas as circunstâncias** que conheça e que sejam relevantes para a apreciação do risco — mesmo as que não constem do questionário
- Consequências da **omissão ou inexatidão** (Arts. 25.º e 26.º LCS):
  - **Dolosa** (Art. 25.º): o contrato é **anulável** mediante declaração do segurador; este pode ficar com o prémio e, em certos casos, não paga o sinistro
  - **Negligente** (Art. 26.º): o segurador pode propor alteração ou cessar o contrato; o pagamento do sinistro pode ser **proporcionalmente reduzido** ou recusado consoante o nexo entre a circunstância omitida e o sinistro
- Implicação prática: responder com rigor aos questionários de subscrição (sobretudo em RC profissional e cyber) — declarações inexatas são a principal causa de recusa lícita de indemnização

### Sinistro e regularização
- **Participação do sinistro** (Art. 100.º LCS): dever de comunicar ao segurador a ocorrência no prazo previsto na apólice (frequentemente 8 dias), sob pena de redução da indemnização pelos danos agravados pelo atraso
- **Regularização**: processo de avaliação do dano (peritagem) e pagamento; o segurador deve concluí-lo em prazo razoável
- **Salvados** e dever de **minoração do dano**: o segurado deve tomar medidas para limitar as consequências do sinistro

## Seguros Obrigatórios Relevantes
- **Acidentes de trabalho**: obrigatório desde o 1.º dia para qualquer trabalhador (cross-ref `laboral.md`, "Obrigações Essenciais do Empregador"). O ENI com trabalhadores e a Lda estão sujeitos. O próprio trabalhador independente pode/deve segurar-se consoante a atividade.
- **Responsabilidade Civil Automóvel (RCA)**: obrigatório para qualquer veículo terrestre a motor (DL 291/2007). Cobre danos causados a terceiros.
- **Seguros obrigatórios setoriais**: várias profissões e atividades têm seguro de RC profissional **obrigatório por lei** (ex.: advogados, arquitetos, mediadores, certas atividades reguladas). Verificar caso a caso o regime da atividade concreta (a confirmar consoante o setor).

## Seguros Recomendados (tech / software / consultoria)

### Responsabilidade Civil Profissional (RC Profissional / E&O — Errors & Omissions)
- Cobre danos a clientes resultantes de **erros e omissões** na prestação de serviços (bugs com impacto, falhas de aconselhamento, atrasos críticos, perda de dados causada por negligência)
- **Crítico**: alinhar o **capital seguro** com os **caps/limites de responsabilidade** acordados nos contratos. Se um contrato fixa um cap de responsabilidade de, p. ex., 250.000€, ter apólice com capital inferior deixa exposição a descoberto (cross-ref `contratos.md` "Limitação de responsabilidade" e `contratos-internacionais.md` para os limites em contratos com clientes estrangeiros)
- Atenção à base de cobertura **"claims made"** (ver Aspetos Jurídicos abaixo)

### Cyber / Ciber-risco
- Cobre **violações de dados** (ver `rgpd.md` sobre os custos típicos de uma data breach: notificação à CNPD, comunicação aos titulares, investigação forense, coimas), **ransomware**, **interrupção de atividade** por ataque, custos de resposta a incidentes e, por vezes, responsabilidade perante terceiros
- Relação regulatória: a exposição cresce com **NIS2** e **CRA (Cyber Resilience Act)** — obrigações de segurança e de comunicação de incidentes (cross-ref `digital-ue.md`). Empresas abrangidas devem considerar o ciber-risco como exposição estrutural, não acessória
- Verificar exclusões frequentes: atos de guerra/ciberguerra, infraestruturas em fim de vida, falta de medidas mínimas de segurança (MFA, backups)

### RC Exploração / Geral
- Cobre **danos a terceiros** decorrentes da atividade (ex.: dano físico de visitante no escritório, dano a equipamento de cliente nas instalações). Distinta da RC profissional, que cobre o serviço prestado.

### D&O (Responsabilidade de Administradores e Gerentes)
- Cobre a responsabilidade pessoal de gerentes/administradores por atos de gestão
- Particularmente relevante **após a transição de ENI para Lda**: o gerente responde pessoalmente em certas situações (cross-ref `societario.md` — responsabilidade do gerente perante a sociedade, sócios, credores e terceiros)
- Cobre custos de defesa em ações de responsabilidade civil de gerência

### Patrimoniais / continuidade
- **Multirriscos do escritório/equipamento**: incêndio, furto/roubo, danos por água, fenómenos elétricos sobre hardware
- **Lucros cessantes / interrupção de atividade**: compensa perda de rendimento durante a paragem causada por um sinistro coberto

## Aspetos Jurídicos Práticos
- **Leitura das exclusões**: as exclusões definem o real âmbito da cobertura tanto quanto as coberturas. Ler condições gerais **e** particulares; as cláusulas de exclusão e de delimitação do risco devem ser destacadas e comunicadas (regime das cláusulas contratuais gerais — DL 446/85, cross-ref `contratos.md`).
- **Âmbito territorial**: confirmar se a apólice cobre sinistros e reclamações **fora de Portugal/UE** — essencial com clientes internacionais. Apólices limitadas à "UE/EEE" deixam fora reclamações de clientes dos EUA, Reino Unido, etc. (cross-ref `contratos-internacionais.md`).
- **Base "claims made" vs. "ocorrência"** (típico em RC profissional e cyber):
  - **Ocorrência**: cobre o sinistro cujo facto gerador ocorreu durante a vigência, mesmo que a reclamação surja anos depois
  - **Claims made**: cobre apenas as **reclamações apresentadas durante a vigência** (e eventual período de retroatividade/prazo de notificação posterior). Ao mudar/cancelar apólice, atenção à **continuidade da retroatividade** para não ficar sem cobertura para serviços já prestados
- **Sub-rogação**: depois de indemnizar, o segurador pode agir contra o terceiro responsável; relevante em sinistros com múltiplos intervenientes/subcontratados
- **Prescrição**: os direitos emergentes do contrato de seguro prescrevem, em regra, no prazo de **5 anos** (Art. 121.º LCS)

## Litígios com Seguradoras
1. **Reclamação interna** junto da seguradora (gestão de reclamações obrigatória)
2. **Provedor do cliente** da seguradora, quando exista
3. **ASF — Autoridade de Supervisão de Seguros e Fundos de Pensões**: queixa/participação por práticas irregulares; a ASF supervisiona mas não fixa indemnizações individuais
4. **Centro de Informação, Mediação e Provedoria de Seguros (CIMPAS)** e demais **mediação/arbitragem** de seguros — via extrajudicial para resolver o diferendo
5. **Via judicial**: ação cível para exigir o pagamento da indemnização; ter presente o prazo de prescrição de 5 anos

## Para o Contexto do Utilizador

### Pacote de seguros recomendado (ENI/Lda de tecnologia com clientes internacionais)
- **Obrigatório**: acidentes de trabalho (se tiver trabalhadores ou consoante a atividade), RCA (se houver viatura)
- **Essencial**: **RC Profissional (E&O)** com **âmbito territorial alargado** (incluir EUA/UK se houver clientes aí) e **capital alinhado com os caps de responsabilidade contratual** — rever a cada novo contrato relevante (cross-ref `contratos-internacionais.md`)
- **Essencial**: **Cyber** (violação de dados + ransomware + interrupção), coerente com as obrigações de RGPD/NIS2/CRA (cross-ref `rgpd.md`, `digital-ue.md`)
- **Recomendado**: RC Exploração/Geral; multirriscos de escritório/equipamento; lucros cessantes
- **Após passar a Lda**: avaliar **D&O** para a gerência (cross-ref `societario.md`)
- Para montantes concretos de capitais/franquias não há tabela legal — dependem do risco e do mercado; confirmar valores de referência fiscais/contributivos relacionados em `valores-2026.md`

### Regra de ouro: alinhar capital com o contrato
Antes de assinar cada contrato de serviços, comparar o **cap de responsabilidade** aí previsto com o **capital seguro da RC profissional**. Se o contrato expuser a um valor superior ao capital da apólice, negociar a redução do cap, aumentar o capital seguro, ou ambos.

## Templates
> Documentos gerados a pedido neste estilo. Os que já existem como ficheiro estão em `assets/templates/` (ver índice); os restantes são redigidos quando pedires.

- Carta de participação de sinistro à seguradora
- Reclamação por recusa de indemnização (com indicação de queixa à ASF/mediação)
- Checklist de cobertura de seguros para contratos de serviços TI (verificação do alinhamento capital ↔ cap de responsabilidade, âmbito territorial e base claims made)
