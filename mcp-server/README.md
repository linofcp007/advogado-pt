# juridico-pt-mcp

Servidor **MCP (Model Context Protocol)** que disponibiliza a skill **Jurídico PT** — assessoria jurídica de Portugal — a qualquer cliente compatível com MCP: **Claude Desktop/Code, Cursor, Windsurf, Codex, Gemini CLI e OpenAI Agents/ChatGPT**.

## O que expõe

38 tools no total:

- **Tools — calculadoras** (17): `calc_juros_mora`, `calc_juros_lote`, `calc_prazo`, `calc_compensacao_despedimento`, `calc_custas_injuncao`, `calc_imposto_selo_heranca`, `calc_imt`, `calc_prescricao`, `calc_irs_simplificado`, `calc_creditos_laborais`, `calc_legitima`, `calc_salario_liquido`, `calc_custo_trabalhador`, `calc_irc`, `calc_iva_operacao`, `calc_taxa_justica`, `calc_procedimento_ccp`.
- **Tools — perfil, calendário e prazos** (10): `obter_perfil_empresa`, `guardar_perfil_empresa`, `listar_perfis`, `ativar_perfil`, `apagar_perfil`, `calendario_obrigacoes`, `registar_prazo`, `listar_prazos`, `concluir_prazo`, `painel_clientes`.
- **Tools — conteúdo e documentos** (11): `listar_areas_juridicas`, `ler_referencia`, `listar_templates`, `obter_template`, `listar_playbooks`, `obter_playbook`, `listar_checklists`, `obter_checklist`, `procurar_conteudo`, `exportar_documento` (`.docx`), `verificar_atualidade`.
- **Resources**: todo o conteúdo jurídico em `juridico-pt://{categoria}/{nome}` (referências, templates, playbooks, checklists).
- **Prompt**: `assistente_juridico` — ativa o assistente jurídico de direito português.

## Instalação rápida

O `dist/index.js` é um bundle autocontido e versionado no repositório: basta clonar e ter **Node ≥ 18**, sem `npm install` nem build. Liga qualquer cliente MCP a esse ficheiro. No **Claude Desktop** há também a extensão `.mcpb`, que não precisa de Node (`npm run build:mcpb` → `../dist/juridico-pt-<versão>.mcpb`; ver `../integrations/claude-desktop/`).

Bloco de configuração genérico (Claude Desktop, Cursor, Windsurf, Gemini, …) — usa o caminho absoluto da tua máquina:

```json
{
  "mcpServers": {
    "juridico-pt": {
      "command": "node",
      "args": ["/CAMINHO/ABSOLUTO/juridico-pt/mcp-server/dist/index.js"]
    }
  }
}
```

Ver `../integrations/` para instruções específicas de cada plataforma.

## Desenvolvimento

```bash
npm ci            # dependências de desenvolvimento (o lockfile manda)
npm run build     # empacota o conteúdo + verifica tipos + gera o bundle dist/index.js
npm test          # build + todos os testes (node --test) + smoke por MCP
npm run build:mcpb  # build + extensão ../dist/juridico-pt-<versão>.mcpb para o Claude Desktop
npm start         # arranca o servidor em stdio
```

Ao mudar `src/` ou o conteúdo da skill, corre `npm run build` e faz commit de `dist/index.js` (servidor), `dist/cli-lib.js` (o que o CLI usa) e `content/` regenerados — é o que o plugin e o CLI usam quando são instalados pelo marketplace.

## Como está construído

- `src/calculators/` — as calculadoras portadas de Python para TypeScript, uma por script (testadas em `test/`, com casos partilhados com o Python em `test/fixtures/paridade.json`).
- `src/content.ts` — carrega o conteúdo jurídico empacotado em `content/`.
- `src/tools.ts`, `src/resources.ts`, `src/prompts.ts` — registo MCP.
- `scripts/bundle-content.mjs` — copia `references/`, `assets/`, `playbooks/` da skill para `content/` (corre no `build`).

O conteúdo jurídico é o mesmo da skill `juridico-pt`; ao atualizar a skill, corre `npm run build` para re-empacotar.

## Aviso legal

Orientação informativa baseada na legislação portuguesa. Não substitui advogado inscrito na Ordem dos Advogados. Licença MIT.
