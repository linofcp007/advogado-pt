/**
 * Arredondamento ao cêntimo, meio para cima (afastando de zero nos empates), sobre a
 * representação decimal mais curta do número — o mesmo que o Python faz com
 * `Decimal(repr(x)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)`.
 *
 * `Math.round(x * 100) / 100` falha em casos como 1234,5 × 0,11 = 135,795 (em binário
 * 135,79499…), que daria 135,79 em vez de 135,80.
 */
export function r2(x: number): number {
  if (!Number.isFinite(x)) return x;
  const negativo = x < 0;
  const texto = String(Math.abs(x)); // representação mais curta, como o repr() do Python
  if (/e/i.test(texto)) {
    // Muito pequeno (< 1e-6) arredonda para 0; muito grande (>= 1e21) não tem cêntimos.
    return Math.abs(x) < 1 ? 0 : x;
  }
  const [inteiro, fracao = ""] = texto.split(".");
  if (fracao.length <= 2) return x;
  let centimos = BigInt(inteiro + fracao.slice(0, 2));
  if (fracao.charCodeAt(2) - 48 >= 5) centimos += 1n;
  const v = Number(centimos) / 100;
  return negativo && v !== 0 ? -v : v;
}
