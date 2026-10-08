/**
 * Tudo o que o CLI (`cli/juridico-pt.mjs`) usa do servidor, num só ponto de entrada.
 *
 * O `scripts/build-server.mjs` empacota-o em `dist/cli-lib.js` (self-contained e versionado,
 * como o `dist/index.js`): uma instalação pelo marketplace não tem a saída do tsc em `dist/`,
 * e o CLI tem de funcionar na mesma.
 */
export * from "./calculators/index.js";
export { gerarCalendario, formatarCalendario, exportarICS } from "./calendario.js";
export { lerPerfil } from "./perfil.js";
export { painelClientes, textoPainel } from "./painel.js";
export { verificarAtualidade, textoAtualidade } from "./atualidade.js";
export { exportarDocumento } from "./exportar.js";
export { lerPrazos, registarPrazo, concluirPrazo, prazosProximos } from "./prazos-estado.js";
