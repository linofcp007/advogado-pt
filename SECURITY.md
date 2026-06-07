# Política de Segurança

## Comunicar uma vulnerabilidade

Comunica qualquer problema de segurança **em privado**, por email, para:

**carlospereira@prodigitalkey.com**

Por favor, **não** abras um issue público para vulnerabilidades. Inclui uma descrição do problema,
passos para reproduzir e, se possível, uma sugestão de correção. Procuramos confirmar a receção com
brevidade e manter-te informado durante a resolução. A divulgação coordenada é bem-vinda.

## Âmbito

Esta política cobre o conteúdo deste repositório:

- a skill `advogado-pt` (`skills/advogado-pt/`),
- o servidor MCP em TypeScript (`mcp-server/`),
- o plugin do Claude Code (`commands/`, `hooks/`, `.claude-plugin/`) e as `integrations/`.

## Postura de segurança: local-only

- **Sem rede.** Nem a skill nem o servidor MCP fazem chamadas de rede. O conteúdo jurídico e as
  calculadoras são puramente locais.
- **Sem telemetria.** Não há recolha de dados, analytics nem reporting. Nada sai da tua máquina.
- **Sem chaves nem segredos.** O servidor MCP não precisa de API keys e não armazena credenciais.

As calculadoras são determinísticas e operam apenas sobre os argumentos que recebem; o conteúdo é
servido a partir de ficheiros locais empacotados.

## Aviso legal importante

O `advogado-pt` fornece **orientação informativa** baseada na legislação portuguesa. **Não constitui
aconselhamento jurídico** e **não substitui um advogado inscrito na Ordem dos Advogados**. Os valores,
taxas e prazos referem-se a 2026 e devem ser confirmados no ano corrente. Para ações judiciais formais
ou situações de elevada complexidade, recorre a um advogado.
