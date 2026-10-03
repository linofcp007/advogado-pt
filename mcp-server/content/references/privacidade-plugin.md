# Privacidade do Próprio Plugin — Que Dados o Jurídico PT Guarda

> **Âmbito:** misto — RGPD (Regulamento (UE) 2016/679) e Lei 58/2019 aplicados aos dados que o plugin guarda no computador do utilizador.
>
> Responde a "que dados guarda o plugin?", "onde ficam?", "por quanto tempo?", "como os apago?" e "quem vê as minhas conversas?". Não é uma política de privacidade de um serviço: o plugin corre no computador do utilizador e não tem servidores próprios.

## Legislação Base

- RGPD, art. 4.º — definições (dados pessoais, tratamento, responsável pelo tratamento, subcontratante)
- RGPD, art. 5.º — princípios: minimização dos dados, limitação da conservação, integridade e confidencialidade
- RGPD, arts. 13.º e 14.º — informação a dar aos titulares (relevante quando o utilizador guarda dados de clientes)
- RGPD, art. 17.º — direito ao apagamento
- RGPD, art. 28.º — subcontratante (o fornecedor do modelo, conforme os termos que o utilizador aceitou)
- RGPD, art. 32.º — segurança do tratamento
- Lei 58/2019 — execução do RGPD em Portugal

## Que dados o plugin guarda e onde

Tudo fica em ficheiros de texto no computador do utilizador, numa pasta `.juridico-pt/`:

- `<projeto>/.juridico-pt/` — dados do projeto/pasta aberta; `~/.juridico-pt/` — perfil geral (a pasta muda com a variável `JURIDICO_PT_HOME`).
- `perfil-empresa.md` — o perfil da empresa (forma jurídica, setor, n.º de trabalhadores, regime de IVA, etc.), só com os campos que o utilizador quis guardar.
- `perfis/<nome>.md` e `perfil-ativo` — perfis nomeados (modo contabilista: um por cliente) e qual está ativo.
- `prazos.md` — prazos em curso registados com `registar_prazo` (data, descrição, origem e, se indicado, o perfil).
- `calendario-<ano>[-<perfil>].ics` — calendários exportados.
- `exportados/<nome>.docx` — documentos exportados com `exportar_documento`.

O plugin **não envia** estes ficheiros para nenhum servidor seu, não tem telemetria e não guarda o conteúdo das conversas. O servidor MCP e os hooks correm localmente e só leem e escrevem dentro destas pastas (sem seguir ligações simbólicas).

## Por quanto tempo

- **Prazos cumpridos há mais de 12 meses** saem de `prazos.md` na escrita seguinte; prazos em aberto nunca saem sozinhos.
- **Perfis, calendários `.ics` e documentos exportados** ficam até o utilizador os apagar.
- **Perfil sem atualização há mais de 12 meses**: é assinalado como desatualizado no início da sessão (para confirmar os dados), mas não é apagado.

## Como apagar

- `apagar_perfil` (nome do perfil; `perfil-empresa` para o perfil por defeito) — apaga o ficheiro do perfil, os prazos desse perfil, os seus calendários `.ics` e a marca de perfil ativo. Não se desfaz.
- Os documentos exportados apagam-se à mão em `.juridico-pt/exportados/`.
- Para apagar tudo: apagar a pasta `.juridico-pt/` do projeto e a de `~/.juridico-pt/`.

## Repositórios git

Num projeto que é um repositório git, os dados da `.juridico-pt/` podiam ser publicados por engano. Ao guardar um perfil, o plugin avisa se o `.gitignore` não exclui a pasta; com `acrescentar_gitignore` junta a linha `.juridico-pt/` (uma só vez).

## Conversas e o fornecedor do modelo

- O conteúdo das conversas (perguntas, documentos colados, respostas) é tratado pelo **fornecedor do modelo** que o utilizador escolheu (por exemplo, a Anthropic no Claude, ou outro fornecedor noutras IAs), nos termos e na política de privacidade que o utilizador aceitou com esse fornecedor — não pelo plugin.
- O plugin não controla nem altera esse tratamento. Quem precisar de garantias (conservação, uso para treino, localização dos dados, acordo de subcontratação do art. 28.º RGPD) deve confirmá-las nos termos do fornecedor e nas definições da sua conta.
- Minimização: partilhar só o necessário para a questão; anonimizar nomes e NIF de terceiros quando não forem precisos.

## Para o contexto do utilizador

- **Empresa a tratar os seus próprios dados**: o perfil guarda sobretudo dados da empresa; se for um ENI, alguns são dados pessoais do próprio.
- **Contabilista ou consultor com perfis de clientes**: o utilizador é o **responsável pelo tratamento** desses dados — precisa de fundamento (em regra, o contrato com o cliente), de informar os clientes (arts. 13.º e 14.º) e de os apagar quando deixarem de ser necessários (`apagar_perfil`).
- **Computador partilhado ou portátil**: proteger a conta e o disco (cifra) — os ficheiros ficam em texto simples.
- Dúvidas sobre o próprio RGPD da empresa: ver `references/rgpd.md`.

## Templates

- `assets/templates/registo-atividades-tratamento.md` — para incluir no registo da empresa o uso de ferramentas de IA com dados de clientes
- `assets/templates/politica-uso-ia.md` — regras internas para usar IA com dados da empresa e de clientes
