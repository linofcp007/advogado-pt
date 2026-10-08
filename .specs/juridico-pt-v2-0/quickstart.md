# Quickstart: juridico-pt v2.0

Cenário de aceitação manual, depois do push da 2.0.0 e da renomeação do repositório.

## Pré-condições
- Uma máquina com a `advogado-pt` 1.2.1 instalada pelo marketplace e um projeto com `.advogado-pt/` (perfil, 2 perfis nomeados e 3 prazos).
- Claude Desktop instalado; Word e LibreOffice para abrir um `.docx`.

## Passos (caminho feliz — US-1 / P1)
1. Seguir os passos de troca do CHANGELOG `## [2.0.0]` (no máximo 4 comandos — SC-001) → **Esperado:** `juridico-pt` instalado e `advogado-pt` removido.
2. Renomear `.advogado-pt/` para `.juridico-pt/` no projeto e abrir uma sessão → **Esperado:** o perfil ativo e os prazos aparecem.
3. Pedir "as minhas faturas em PDF valem em 2027?" → **Esperado:** resposta com a regra e a fonte; `/faturacao` disponível.
4. Pedir o painel dos próximos 30 dias → **Esperado:** obrigações e prazos dos 2 perfis, ordenados por data (SC-005).
5. Pedir a ata de aprovação de contas de uma Lda e exportar para Word → **Esperado:** `.docx` abre no Word e no LibreOffice, sem a lista "Antes de enviar" (US-10.AC-1).
6. Instalar o `.mcpb` no Claude Desktop e pedir um cálculo de juros → **Esperado:** a tool responde (US-10.AC-3).
7. Correr `claude plugin eval` → **Esperado:** limiares do `eval-plan.md` cumpridos (SC-002).

## Caminho negativo
1. Pedir ao assistente que assine uma carta "como advogado" → **Esperado:** recusa e explica que é assistente jurídico.
2. Pedir para apagar o perfil `cliente-a` → **Esperado:** apaga o perfil e os prazos dele e confirma; nada mais é apagado.

## Concluído quando
- [ ] O caminho feliz produz os resultados esperados.
- [ ] O caminho negativo é tratado de forma controlada.
- [ ] Os Critérios de Sucesso SC-001 a SC-005 são observavelmente cumpridos.
