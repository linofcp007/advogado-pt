# Integrações — juridico-pt-mcp

O **núcleo** deste projeto é um servidor **MCP (Model Context Protocol)** chamado
`juridico-pt-mcp`. Ele expõe, por transporte **stdio**:

- **TOOLS** (38) — calculadoras determinísticas (juros de mora, também em lote, IMT, prazos,
  prescrição, compensação e créditos laborais, salário líquido e custo do trabalhador, IRC, IVA
  internacional, taxa de justiça, custas de injunção, imposto de selo, IRS, legítima,
  procedimento de contratação pública), perfil da empresa, calendário de obrigações, prazos,
  painel de clientes, exportação `.docx`, verificação de atualidade e ferramentas de conteúdo
  (listar/obter referências, templates, playbooks, checklists; procurar).
- **RESOURCES** — todo o conteúdo jurídico em markdown (referências por área, templates,
  playbooks, checklists).
- **PROMPT** — um prompt reutilizável chamado `assistente_juridico` que carrega a persona do
  assistente jurídico de direito português.

Como o protocolo é o mesmo em todo o lado, **o servidor liga-se a praticamente qualquer
cliente de IA com suporte MCP**. Cada subpasta desta diretoria contém as instruções e os
ficheiros de configuração específicos de **uma plataforma**. Escolhe a tua e segue o
respetivo `README.md`.

## Como o servidor é arrancado

O servidor corre a partir do repositório. O comando é sempre o mesmo em todas as
plataformas; muda só onde colas o bloco de configuração.

**1. Clona o repo.** O servidor já vem compilado e autocontido em `mcp-server/dist/index.js`:
basta ter **Node ≥ 18**, sem `npm install` nem build. (No Claude Desktop há ainda a extensão
`.mcpb`, que nem precisa de Node — ver [`claude-desktop/`](./claude-desktop/).)

**2. Aponta a configuração ao `dist/index.js` com o caminho ABSOLUTO:**

```json
{
  "command": "node",
  "args": ["/ABSOLUTE/PATH/TO/juridico-pt/mcp-server/dist/index.js"]
}
```

> Substitui `/ABSOLUTE/PATH/TO/juridico-pt` pelo caminho absoluto correto na tua máquina. Em
> Windows podes usar `/` ou `\\` (com escape) no JSON.
>
> Atalho: na raiz do repo corre `node cli/juridico-pt.mjs mcp-config <host>` (hosts:
> `claude-desktop`, `claude-code`, `cursor`, `windsurf`, `gemini`, `codex`, `vscode`,
> `generic`, ou `all`) e o comando imprime o bloco de configuração com o caminho **absoluto**
> já preenchido para a tua máquina, pronto a colar.

## Plataformas suportadas

| Plataforma | Pasta | Configuração MCP | Persona / instruções |
|---|---|---|---|
| **Claude Code** (plugin) | raiz: `.claude-plugin/` | `/plugin marketplace add linofcp007/juridico-pt` | prompt `assistente_juridico` do servidor |
| **Claude Desktop** | [`claude-desktop/`](./claude-desktop/) | extensão `.mcpb` ou `claude_desktop_config.json` (`mcpServers`) | prompt `assistente_juridico` do servidor |
| **Cursor** | [`cursor/`](./cursor/) | `.cursor/mcp.json` | `.cursor/rules/juridico-pt.mdc` |
| **Windsurf** | [`windsurf/`](./windsurf/) | `mcp_config.json` | `.windsurfrules` |
| **Gemini CLI** | [`gemini-cli/`](./gemini-cli/) | `~/.gemini/settings.json` (`mcpServers`) | `GEMINI.md` |
| **Codex CLI** (OpenAI) | [`codex/`](./codex/) | `~/.codex/config.toml` (`[mcp_servers.*]`) | `AGENTS.md` |
| **ChatGPT / OpenAI** | [`chatgpt/`](./chatgpt/) | conector MCP (remoto/HTTP) ou Custom GPT | `custom-gpt-instructions.md` |

## Nota sobre a persona

O servidor MCP já inclui o prompt `assistente_juridico` com a persona completa. Nos clientes que
**não** consomem prompts MCP automaticamente (Cursor, Windsurf, Gemini CLI, Codex, Custom
GPT), incluímos a **mesma persona** num ficheiro de regras/instruções nativo da plataforma
(`.mdc`, `.windsurfrules`, `GEMINI.md`, `AGENTS.md`, `custom-gpt-instructions.md`) para
garantir comportamento consistente.

## Aviso

Orientação informativa baseada na legislação portuguesa. Para ações judiciais ou situações
de elevada complexidade, validar com advogado inscrito na Ordem dos Advogados (OA).
