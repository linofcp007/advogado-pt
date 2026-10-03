# Classificação: advogado-pt v1.2.1 correções

## Modo
Spec — correção de cerca de 60 defeitos confirmados pela revisão completa de 3/10/2026 (5 auditorias independentes: código, conteúdo jurídico, estrutura do plugin, qualidade da skill, produto). Não é um bugfix único: são defeitos em várias superfícies, por isso segue a cadeia completa com testes de regressão por defeito.

## Tracks Ativos
core +tdd +sec

## Sinais
- **+tdd:** calculadoras que dão datas-limite e montantes errados (contestação com data depois do fim do prazo; crédito válido dado como prescrito; Imposto do Selo cobrado numa compra isenta) e testes antigos que fixam o comportamento errado. Cada defeito precisa de um teste que falhe antes da correção.
- **+sec:** escrita de ficheiros que segue symlinks (confirmado: sobrescreveu um ficheiro fora do projeto), texto do perfil injetado sem limite no contexto pelo hook (vetor de prompt injection a partir de um repositório clonado), travessia de caminhos nos resources MCP, dependência com vulnerabilidade alta no bundle distribuído.
- **+privacy considerado e rejeitado nesta versão:** não muda o tratamento de dados (perfis e prazos locais); o modo contabilista com dados de vários clientes é da 2.0.0, que tem +privacy.
- **+api considerado e rejeitado:** os nomes e parâmetros das tools mantêm-se; só muda o valor por defeito de `calc_prazo.tipo` e aparece o tipo `judicial` (aditivo). O command `/doctor` passa a `/diagnostico` (o nativo já o tapava, por isso ninguém o usava com esse nome).

## Raio de Impacto
- Um prazo errado faz perder um meio de defesa (irreversível); um montante errado leva a pagamentos ou declarações erradas. Afeta todos os utilizadores do marketplace e das integrações.
- A correção chega por atualização do plugin; documentos já enviados não se corrigem.

## Tags de Conformidade
nenhuma (o conteúdo trata RGPD e direito fiscal; o sistema não trata dados de terceiros nesta versão)

## Tamanho
m — cadeia completa, com as secções repetidas dos tracks fundidas.

## Resumo
Corrigir os defeitos encontrados na revisão completa: calculadoras e conteúdo jurídico errados, templates com risco de nulidade, segurança da escrita de ficheiros e do hook, distribuição e paridade Python/TS.
