/**
 * Estimador de taxa de justiça de injunção (Portugal).
 *
 * Porta de `scripts/custas_injuncao.py`. Estima a taxa de justiça a pagar num
 * procedimento de injunção, em função do valor da dívida (UC 2026 = 102€).
 *
 *   dívida <= 5.000€            -> 0,5 UC  =  51€
 *   dívida 5.000,01 a 15.000€   -> 1,0 UC  = 102€
 *   dívida > 15.000€            -> 1,5 UC  = 153€
 */

const UC_2026 = 102.0; // Unidade de Conta para 2026, em euros.

export function custasInjuncao(valor: number): { escalao: string; taxa: number } {
  if (valor <= 5000) {
    return { escalao: "Dívida até 5.000€", taxa: 0.5 * UC_2026 };
  }
  if (valor <= 15000) {
    return {
      escalao: "Dívida de 5.000,01€ a 15.000€",
      taxa: 1.0 * UC_2026,
    };
  }
  return {
    escalao: "Dívida superior a 15.000€ (em regra segue forma de ação)",
    taxa: 1.5 * UC_2026,
  };
}
