# Checklist — Prontidão legal antes de lançar produto/feature

> **Quando usar:** como porta de saída (gate) antes de colocar em produção um produto ou nova feature de software, para confirmar a conformidade legal.
> **Referência:** `references/contratos.md` (T&C, CCG) e `references/rgpd.md` (dados). Regulação digital (AI Act, CRA, NIS2) em `references/digital-ue.md`. Consumo em `references/consumo.md`. Seguros em `references/seguros.md`.

## Termos & Condições publicados
- [ ] T&C publicados e acessíveis antes da contratação
- [ ] Aceitação registada (clickwrap) com prova de versão e data
- [ ] Limitação de responsabilidade e foro revistos (CCG, DL 446/85)

## Política de Privacidade e cookies
- [ ] Política de privacidade publicada e atualizada (`references/rgpd.md`)
- [ ] Cookie policy publicada e banner com opções granulares
- [ ] Cookies não essenciais só após consentimento (ePrivacy, `references/digital-ue.md`)

## Consentimentos
- [ ] Consentimentos recolhidos de forma livre, específica e informada
- [ ] Prova de consentimento armazenada e mecanismo de retirada disponível
- [ ] Opt-in para marketing (e soft opt-in apenas a clientes existentes)

## DPA com subcontratantes cloud
- [ ] DPA assinado com cada fornecedor cloud/SaaS (Art. 28.º RGPD)
- [ ] Sub-subcontratantes listados e transferências internacionais cobertas (SCCs)
- [ ] Localização de dados preferencialmente UE/EEE

## Licenças de software open-source cumpridas
- [ ] Inventário de dependências e respetivas licenças (SBOM)
- [ ] Obrigações de atribuição/copyleft cumpridas (avisos, fonte, NOTICE)
- [ ] Sem licenças incompatíveis com o modelo de distribuição (cross-ref `references/pi.md`)

## Marcas / nome verificados (INPI)
- [ ] Nome do produto e marca pesquisados no INPI (anterioridades)
- [ ] Registo de marca ponderado/efetuado para as classes relevantes
- [ ] Domínios e contas verificados sem conflito com marcas de terceiros

## Transparência de IA (AI Act)
- [ ] Mapear o risco do sistema de IA, se usado (`references/digital-ue.md`)
- [ ] Avisar o utilizador quando interage com IA / bot
- [ ] Rotular conteúdo gerado por IA (deepfakes/geração)
- [ ] Literacia em IA da equipa que opera os sistemas (Art. 4.º AI Act)
- [ ] Se cair em alto risco: planear avaliação de conformidade

## Acessibilidade / consumo (se B2C)
- [ ] Cumprir requisitos do consumidor: informação pré-contratual e direito de livre resolução (`references/consumo.md`)
- [ ] Vendas à distância (DL 24/2014) cumpridas
- [ ] Requisitos de acessibilidade ponderados para o público-alvo

## Segurança mínima (CRA / NIS2 se aplicável)
- [ ] Security by design e gestão de vulnerabilidades (CRA, `references/digital-ue.md`)
- [ ] Encriptação, controlo de acessos e logging mínimos
- [ ] Se for fornecedor de entidade regulada: requisitos NIS2 antecipados nos contratos
- [ ] Procedimento de comunicação de incidentes/vulnerabilidades definido

## Seguro cyber / RC profissional
- [ ] Seguro de responsabilidade civil profissional em vigor (`references/seguros.md`)
- [ ] Seguro cyber adequado ao risco do produto
- [ ] Cobertura alinhada com o cap de responsabilidade nos contratos
