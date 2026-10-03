# Classificação: juridico-pt v2.0

## Modo
Spec — renomeação incompatível do plugin (identificador, marketplace, repositório, pastas de dados) com migração, mais quatro grupos de funcionalidades novas (faturação e cobrança, qualidade e confiança, contabilistas e PME, formatos e instalação).

## Tracks Ativos
core +tdd +ai +privacy

## Sinais
- **+tdd:** calculadoras novas que dão dinheiro e procedimentos legais (`calc_juros_lote`, `calc_procedimento_ccp`), pasta de dados locais (perfis e prazos) que não se pode corromper, gerador `.docx`/ZIP sem bibliotecas. Correção > tudo.
- **+ai:** a qualidade do produto depende do comportamento do modelo — instruções e persona (prompts como código), subagentes (verificador de citações, revisor de contratos), avaliações com `claude plugin eval`, custo fixo de tokens por sessão (achado da revisão: instruções truncadas e persona injetada em todas as sessões). O plugin não chama modelos diretamente; usa o modelo do cliente do utilizador.
- **+privacy:** o modo contabilista guarda localmente dados de vários clientes, que incluem pessoas singulares (ENI); prazos e documentos exportados podem ter dados pessoais de terceiros; o conteúdo das conversas vai para o fornecedor do modelo. Precisa de inventário, conservação, apagamento e transparência.
- **+sec considerado:** a escrita segura e a validação de entradas vêm da 1.2.1 (`fs-seguro`, datas estritas); as novas escritas (`.docx`, `.ics` por perfil, migração) reutilizam-nas. Não há credenciais (os conectores de terceiros são do utilizador).
- **+api considerado e rejeitado:** os nomes e parâmetros das tools mantêm-se; a mudança de identificador do plugin e do servidor está tratada na migração (US-1) e no design.
- **+ui rejeitado:** os formulários são os do cliente MCP (elicitation), não uma interface própria.

## Raio de Impacto
- Migração falhada = utilizadores sem o plugin ou sem os seus perfis e prazos; mitigado por leitura da pasta antiga e aviso na última `advogado-pt`.
- Conteúdo novo errado (faturação 2027, CCP) leva a faturas inválidas ou procedimentos errados.
- Recuperável com nova versão; a pasta antiga nunca é apagada.

## Tags de Conformidade
GDPR (dados de clientes no modo contabilista; transparência sobre o fornecedor do modelo)

## Tamanho
l — cadeia completa.

## Resumo
Renomear para juridico-pt (assistente jurídico) com migração, e acrescentar faturação 2027 e cobrança completa, avaliações e subagentes, modo contabilista, templates do dia a dia, NIS2, fundos e contratação pública, exportação .docx, elicitation e instalador .mcpb.
