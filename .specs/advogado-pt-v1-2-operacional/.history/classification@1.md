# Classificação: advogado-pt v1.2 operacional

## Modo
Spec — 12 histórias, 5 calculadoras novas em dois lados, gerador de calendário, prazos com aviso, vários perfis e ~25 documentos novos.

## Tracks Ativos
core +tdd

## Sinais
- **+tdd:** calculadoras de dinheiro (salário líquido, custo do trabalhador, IRC, taxa de justiça) e um decisor de IVA cujas saídas vão para faturas e orçamentos; um calendário de prazos legais em que um dia errado é uma coima. Correção > tudo.
- **+privacy considerado e rejeitado:** perfis e prazos ficam em ficheiros locais do utilizador; não há tratamento por terceiros (NFR-4).
- **+ai rejeitado:** nenhuma chamada a modelos; as "perguntas de referência" são factos verificados por teste determinístico, não avaliação de LLM.
- **+api considerado:** 12 tools novas aditivas; as existentes mantêm nome e parâmetros (`obter/guardar_perfil_empresa` ganham um parâmetro opcional `perfil`).

## Raio de Impacto
- Um prazo ou taxa errados levam a coimas, juros ou faturas mal emitidas; afeta todos os utilizadores do marketplace e das integrações.
- Recuperável com nova versão; documentos já emitidos não.

## Tags de Conformidade
nenhuma (o conteúdo trata RGPD, RGPC e IVA; o sistema não trata dados de terceiros)

## Tamanho
l — cadeia completa.

## Resumo
Fecha as lacunas da v1.1 e torna o advogado operacional para qualquer empresa: calendário e prazos, cumprimento por dimensão, empregador, fisco, contratos/societário/tribunais, setores regulados, IA/videovigilância, vários perfis e testes de regressão jurídica.
