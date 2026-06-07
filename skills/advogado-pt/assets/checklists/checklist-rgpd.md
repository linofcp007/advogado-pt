# Checklist — Conformidade RGPD (negócio tech)

> **Quando usar:** antes de lançar (ou para auditar) um produto/serviço de software que trata dados pessoais, garantindo conformidade com o RGPD e a Lei 58/2019.
> **Referência:** `references/rgpd.md` (princípios, bases, direitos, breach). Para IA, cookies/ePrivacy e regulação digital, `references/digital-ue.md`. Coimas e limiares em `references/valores-2026.md`.

## Bases de licitude mapeadas (Art. 6.º)
- [ ] Cada finalidade de tratamento tem uma base de licitude identificada e documentada
- [ ] Consentimento (quando usado): livre, específico, informado, inequívoco e com prova de obtenção
- [ ] Mecanismo de retirada de consentimento tão fácil como a sua concessão
- [ ] Interesse legítimo: teste de balanceamento (LIA) documentado
- [ ] Dados de categorias especiais (Art. 9.º): base reforçada identificada quando aplicável

## Política de privacidade publicada
- [ ] Política de privacidade publicada no website/app e acessível antes da recolha
- [ ] Inclui identidade do responsável, finalidades, bases, prazos de conservação e destinatários
- [ ] Informa sobre direitos dos titulares e contacto para os exercer (e DPO, se existir)
- [ ] Linguagem clara e em PT-PT (e EN se houver clientes internacionais)

## Registo de atividades de tratamento (Art. 30.º)
- [ ] Registo (RAT/ROPA) criado e mantido atualizado
- [ ] Lista finalidades, categorias de titulares e de dados, destinatários e prazos
- [ ] Identifica transferências internacionais e respetivas salvaguardas
- [ ] Descreve, em termos gerais, as medidas técnicas e organizativas de segurança

## Contratos com subcontratantes (DPA, Art. 28.º)
- [ ] DPA assinado com cada subcontratante (cloud, email, analytics, pagamentos, etc.)
- [ ] DPA cobre objeto, duração, natureza, finalidade, instruções e obrigações do Art. 28.º, n.º 3
- [ ] Sub-subcontratantes listados; obrigação de notificar alterações
- [ ] Garantias de segurança e de apoio ao responsável (breach, direitos, auditoria)

## Cookies / consentimento
- [ ] Banner de cookies com opções granulares (aceitar / rejeitar / configurar)
- [ ] Cookies não essenciais só disparam após consentimento prévio
- [ ] Cookies estritamente necessários identificados (dispensam consentimento)
- [ ] Cookie policy publicada (ver ePrivacy/Lei 41/2004 em `references/digital-ue.md`)

## Segurança (encriptação, acessos, backups)
- [ ] Encriptação em trânsito (TLS) e em repouso para dados sensíveis
- [ ] Pseudonimização aplicada onde possível (privacy by design, Art. 25.º)
- [ ] Controlo de acessos por perfis (princípio do menor privilégio) e MFA
- [ ] Logs de acesso e auditoria ativos
- [ ] Backups regulares, testados e cifrados
- [ ] Ambientes de teste sem dados reais (ou anonimizados)

## Procedimento de data breach (72h)
- [ ] Procedimento interno escrito de deteção e resposta a violações
- [ ] Notificação à CNPD em 72h após conhecimento (Art. 33.º)
- [ ] Critério e canal para notificar titulares se risco elevado (Art. 34.º)
- [ ] Registo interno de todas as violações, mesmo as não notificadas

## Resposta a direitos dos titulares (1 mês)
- [ ] Canal definido para receber e identificar pedidos
- [ ] Processo para acesso, retificação, apagamento, limitação, portabilidade e oposição
- [ ] Resposta no prazo de 1 mês (prorrogável até 3 meses se complexo, com aviso)
- [ ] Procedimento de verificação de identidade do requerente
- [ ] Template de resposta disponível

## Transferências internacionais (SCC)
- [ ] Transferências para fora do EEE identificadas
- [ ] Cobertas por decisão de adequação, SCCs (Decisão 2021/914) ou BCRs
- [ ] Transfer Impact Assessment (TIA) feito quando se usam SCCs
- [ ] EUA: confirmar adesão ao EU-US Data Privacy Framework (se aplicável)
- [ ] Preferência por localização de dados na UE/EEE quando possível

## DPIA quando alto risco
- [ ] Avaliação prévia de necessidade de DPIA (perfilagem, larga escala, dados sensíveis, monitorização)
- [ ] DPIA elaborada e documentada quando o tratamento é de alto risco (Art. 35.º)
- [ ] Consulta prévia à CNPD se o risco residual for elevado

## IA / decisões automatizadas (Art. 22.º)
- [ ] Identificadas decisões exclusivamente automatizadas com efeitos significativos (scoring, seleção)
- [ ] Garantido direito a intervenção humana, a expor o ponto de vista e a contestar
- [ ] Transparência sobre a existência e a lógica das decisões (Arts. 13.º-15.º)
- [ ] Base de licitude definida para treino de modelos com dados pessoais (minimização; cuidado com scraping)
- [ ] DPIA quando há IA sobre dados pessoais em larga escala ou perfilagem
- [ ] Alinhamento com o AI Act (transparência, literacia, alto risco) — `references/digital-ue.md`
