// Perfil da empresa do utilizador, guardado em ficheiro local:
//   <projeto>/.advogado-pt/perfil-empresa.md  (prioridade)
//   ~/.advogado-pt/perfil-empresa.md          (perfil geral)
// (Stub — Phase 4; implementação na tarefa 11.)

export const CAMPOS_PERFIL = [
  "forma_juridica",
  "denominacao",
  "setor",
  "trabalhadores",
  "volume_negocios",
  "regime_iva",
  "contabilidade",
  "clientes",
  "dados_pessoais",
  "linguas",
  "notas",
  "atualizado_em",
] as const;

export interface Perfil {
  origem: "projeto" | "geral";
  caminho: string;
  campos: Record<string, string>;
  desatualizado: boolean;
}

export interface OpcoesPerfil {
  projeto?: string;
  home?: string;
  hoje?: Date;
}

export function lerPerfil(_opts: OpcoesPerfil = {}): Perfil | null {
  throw new Error("não implementado");
}

export function guardarPerfil(
  _campos: Record<string, string>,
  _destino: "projeto" | "geral",
  _opts: OpcoesPerfil = {}
): Perfil {
  throw new Error("não implementado");
}

export function textoPerguntasPerfil(): string {
  throw new Error("não implementado");
}
