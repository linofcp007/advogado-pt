// Prazos em curso do projeto (<projeto>/.advogado-pt/prazos.md). Stub — Phase 4 (tarefa 9).
export interface PrazoRegistado { data: string; descricao: string; origem?: string; concluido: boolean }
export function lerPrazos(_dir?: string): PrazoRegistado[] { throw new Error("não implementado"); }
export function registarPrazo(_p: { data: string; descricao: string; origem?: string }, _dir?: string): PrazoRegistado { throw new Error("não implementado"); }
export function concluirPrazo(_data: string, _descricao: string, _dir?: string): boolean { throw new Error("não implementado"); }
export function prazosProximos(_prazos: PrazoRegistado[], _hoje: Date, _dias = 7): { vencidos: PrazoRegistado[]; proximos: Array<PrazoRegistado & { faltam: number }> } { throw new Error("não implementado"); }
