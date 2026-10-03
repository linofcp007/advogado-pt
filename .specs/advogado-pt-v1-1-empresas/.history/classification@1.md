# Classificação: advogado-pt v1.1 empresas

## Modo
Spec — trabalho com várias partes (conteúdo jurídico, calculadoras em dois lados, servidor MCP, CLI, testes, release).

## Tracks Ativos
core +tdd

## Sinais
- **+tdd:** calculadoras que produzem valores em euros usados em cartas e processos (juros por semestre, créditos laborais, legítima) — um erro de cálculo é um erro jurídico com dinheiro em causa; e um teste de estrutura que trava templates sem verificação/âmbito.
- **+ai rejeitado:** "prompt" refere-se a exportar templates como texto para outras IAs; nenhum código chama um LLM nem depende da qualidade do seu output.
- **+privacy rejeitado:** "RGPD" é tema do conteúdo (templates sobre RGPD); o plugin não recolhe, guarda nem partilha dados pessoais.
- **+api considerado e rejeitado:** as tools MCP mudam o texto devolvido (memória de cálculo, âmbito, agrupamento) mas mantêm nomes e parâmetros; as 2 tools novas são aditivas. Coberto pelos testes de estrutura existentes.

## Raio de Impacto
- Um template ou taxa errados chegam a cartas enviadas a devedores, à AT ou a tribunais: perda de direitos (prescrição), juros mal pedidos, coimas. Recuperável com nova versão, mas o documento enviado não se desfaz.
- Afeta todos os utilizadores do plugin (marketplace) e das integrações (Cursor, Windsurf, Codex, Gemini, ChatGPT).
- Rollback: reverter o commit e repor a versão 1.0.5 no marketplace (minutos).

## Tags de Conformidade
nenhuma (o conteúdo trata RGPD, mas o sistema não trata dados pessoais)

## Tamanho
m — cinco histórias, cadeia completa.

## Resumo
Corrigir dois erros encontrados na comparação com a Skills Jurídicas (template de cobrança diz que a carta interrompe a prescrição; juros com taxa única e desatualizada), dar método a todos os templates (verificação final, âmbito nacional/UE/misto), generalizar a persona para qualquer empresa e acrescentar cobertura empresarial (tributário, societário, PI de software, insolvência do cliente, laboral, loja online, bancário, RGPD, concorrência, UE), duas calculadoras novas e exportação como prompt.
