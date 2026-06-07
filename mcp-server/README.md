# advogado-pt-mcp

Servidor **MCP (Model Context Protocol)** que disponibiliza a skill **Advogado PT** — assessoria jurídica de Portugal — a qualquer cliente compatível com MCP: **Claude Desktop/Code, Cursor, Windsurf, Codex, Gemini CLI e OpenAI Agents/ChatGPT**.

## O que expõe

- **Tools — calculadoras**: `calc_juros_mora`, `calc_prazo`, `calc_compensacao_despedimento`, `calc_custas_injuncao`, `calc_imposto_selo_heranca`, `calc_imt`, `calc_prescricao`, `calc_irs_simplificado`.
- **Tools — conteúdo**: `listar_areas_juridicas`, `ler_referencia`, `listar_templates`, `obter_template`, `listar_playbooks`, `obter_playbook`, `listar_checklists`, `obter_checklist`, `procurar_conteudo`.
- **Resources**: todo o conteúdo jurídico em `advogado-pt://{categoria}/{nome}` (referências, templates, playbooks, checklists).
- **Prompt**: `advogado_pt` — ativa a persona de advogado de Portugal.

## Instalação rápida

Depois de publicado no npm, qualquer cliente MCP arranca o servidor com:

```bash
npx -y advogado-pt-mcp
```

Bloco de configuração genérico (Claude Desktop, Cursor, Windsurf, Gemini, …):

```json
{
  "mcpServers": {
    "advogado-pt": {
      "command": "npx",
      "args": ["-y", "advogado-pt-mcp"]
    }
  }
}
```

Ver `../integrations/` para instruções específicas de cada plataforma.

## Desenvolvimento

```bash
npm install
npm run build      # empacota o conteúdo + compila TypeScript -> dist/
npm test           # build + testes das calculadoras (node --test)
npm start          # arranca o servidor em stdio
```

### Modo local (sem publicar)

```json
{
  "mcpServers": {
    "advogado-pt": {
      "command": "node",
      "args": ["/CAMINHO/ABSOLUTO/advogado-pt/mcp-server/dist/index.js"]
    }
  }
}
```

## Como está construído

- `src/calculators/` — as 8 calculadoras portadas de Python para TypeScript (testadas em `test/`).
- `src/content.ts` — carrega o conteúdo jurídico empacotado em `content/`.
- `src/tools.ts`, `src/resources.ts`, `src/prompts.ts` — registo MCP.
- `scripts/bundle-content.mjs` — copia `references/`, `assets/`, `playbooks/` da skill para `content/` (corre no `build`).

O conteúdo jurídico é o mesmo da skill `advogado-pt`; ao atualizar a skill, corre `npm run build` para re-empacotar.

## Aviso legal

Orientação informativa baseada na legislação portuguesa. Não substitui advogado inscrito na Ordem dos Advogados. Licença MIT.
