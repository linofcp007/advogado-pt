/**
 * Formatação de valores em euros no formato PT: "1.234,56 €".
 *
 * Réplica de `formatar_euros` dos scripts Python: parte-se da representação
 * com separador de milhares "," e decimal "." (formato EN, como o Python
 * `f"{valor:,.2f}"`) e trocam-se os separadores para o formato português
 * (milhares "." e decimal ",").
 */
export function formatarEuros(valor: number): string {
  // Arredonda a 2 casas decimais, tal como o `.2f` do Python.
  const fixo = valor.toFixed(2); // ex.: "1234.56" ou "-1234.56"
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
