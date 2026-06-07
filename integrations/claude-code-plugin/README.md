# Claude Code — Plugin `advogado-pt`

Este plugin liga o servidor MCP `advogado-pt-mcp` ao **Claude Code**. Uma vez instalado, o
Claude Code passa a ter acesso às calculadoras jurídicas, referências legais, templates,
playbooks e checklists, bem como ao prompt `advogado_pt`.

## Estrutura

```text
claude-code-plugin/
└── .claude-plugin/
    ├── plugin.json        # Manifesto do plugin (inclui mcpServers)
    └── marketplace.json   # Entrada de marketplace de exemplo
```

## Instalação via marketplace

O Claude Code instala plugins a partir de um *marketplace* (um repositório/diretoria que
contém um `.claude-plugin/marketplace.json`). Passos:

1. **Adicionar o marketplace** (a partir de um repositório Git ou de um caminho local):

   ```text
   /plugin marketplace add prodigitalkey/advogado-pt
   ```

   ou, em modo local, aponta à diretoria que contém `.claude-plugin/marketplace.json`:

   ```text
   /plugin marketplace add "C:/Users/Administrator/Desktop/CLAUDE SKILLS/advogado-pt/integrations/claude-code-plugin"
   ```

2. **Instalar o plugin**:

   ```text
   /plugin install advogado-pt@advogado-pt-marketplace
   ```

   (Em alternativa, abre o gestor interativo com `/plugin` e seleciona **advogado-pt**.)

3. **Reinicia o Claude Code** se for pedido. O servidor MCP arranca automaticamente via
   `npx -y advogado-pt-mcp`.

4. **Confirma** que ficou ligado:

   ```text
   /mcp
   ```

   Deves ver o servidor `advogado-pt` ligado, com as tools e o prompt `advogado_pt`
   disponíveis.

## Modo publicado vs. modo local

O manifesto (`plugin.json`) usa por omissão o **modo publicado**:

```json
"mcpServers": {
  "advogado-pt": {
    "command": "npx",
    "args": ["-y", "advogado-pt-mcp"]
  }
}
```

Para **modo local (desenvolvimento)**, compila primeiro o servidor:

```powershell
# dentro de mcp-server/
npm install
npm run build
```

e edita o `mcpServers` em `.claude-plugin/plugin.json` para apontar ao build local:

```json
"mcpServers": {
  "advogado-pt": {
    "command": "node",
    "args": ["C:/Users/Administrator/Desktop/CLAUDE SKILLS/advogado-pt/mcp-server/dist/index.js"]
  }
}
```

> Usa o caminho **absoluto** para `dist/index.js` na tua máquina.

## Usar a persona

O servidor expõe o prompt `advogado_pt`. No Claude Code podes invocá-lo a partir do menu de
prompts MCP (`/` → escolhe `advogado_pt`) para carregar a persona do advogado pessoal e
empresarial em Portugal antes de começar um tema jurídico.

## Remover

```text
/plugin uninstall advogado-pt@advogado-pt-marketplace
/plugin marketplace remove advogado-pt-marketplace
```
