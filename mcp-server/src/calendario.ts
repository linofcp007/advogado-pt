// Calendário de obrigações legais a partir do perfil. Stub — Phase 4 (tarefa 7).
export interface Obrigacao {
  id: string; titulo: string; area: string; data: string; dataOriginal?: string; nota?: string;
  base: string; fonte: string; transferivel: boolean; aConfirmar: boolean; camposEmFalta: string[];
}
export function gerarCalendario(_ano: number, _perfil: Record<string, string> | null): Obrigacao[] { throw new Error("não implementado"); }
export function paraICS(_obrigacoes: Obrigacao[], _opts: { hoje?: Date } = {}): string { throw new Error("não implementado"); }
