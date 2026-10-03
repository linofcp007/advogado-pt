/**
 * Formatação de valores em euros no formato PT: "1.234,56 €".
 *
 * Réplica de `formatar_euros` dos scripts Python: arredonda ao cêntimo meio para cima (r2,
 * igual ao `Decimal(repr(x))` com ROUND_HALF_UP do Python) e troca os separadores para o
 * formato português (milhares "." e decimal ",").
 */
import { r2 } from "./arredondar.js";

export function formatarEuros(valor: number): string {
  const fixo = r2(valor).toFixed(2); // ex.: "1234.56" ou "-1234.56"
  const negativo = fixo.startsWith("-");
  const semSinal = negativo ? fixo.slice(1) : fixo;
  const [parteInteira, parteDecimal] = semSinal.split(".");

  // Insere separador de milhares "." na parte inteira.
  const inteiroComMilhares = parteInteira.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  );

  const corpo = `${inteiroComMilhares},${parteDecimal}`;
  return `${negativo ? "-" : ""}${corpo} €`;
}
