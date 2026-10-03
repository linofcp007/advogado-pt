/**
 * Créditos laborais na cessação do contrato de trabalho (estimativa bruta).
 *
 * Port de `scripts/creditos_laborais.py` — os dois têm de dar os mesmos resultados.
 *
 * Base mensal = retribuição base + diuturnidades.
 * - Proporcionais do ano da cessação (arts. 245.º, n.º 1, al. b), e 263.º, n.º 2, al. b), CT):
 *     férias, subsídio de férias e subsídio de Natal = base × fração,
 *     fração = dias de serviço no ano da cessação / dias do ano (365 ou 366),
 *     contados desde 1 de janeiro (ou desde a admissão, se no mesmo ano) até à cessação, inclusive.
 * - Férias vencidas e não gozadas: base / 22 × dias úteis por gozar.
 * - Subsídio de férias vencido em falta (indicado pelo utilizador): 1 × base.
 * - Art. 245.º, n.º 3, CT: se a cessação ocorre no ano civil seguinte ao da admissão ou o
 *   contrato durou até 12 meses, o total de férias não pode exceder o proporcional à duração
 *   do contrato — assinalado em `limite245n3` para revisão manual.
 *
 * Não inclui: retribuição do mês em curso, compensação por despedimento (calc_compensacao),
 * formação não prestada, nem descontos de IRS/Segurança Social.
 */

export interface ParamsCreditos {
  retribuicaoBase: number;
  diuturnidades?: number;
  dataAdmissao: Date;
  dataCessacao: Date;
  /** Dias úteis de férias vencidas e não gozadas. */
  feriasVencidasNaoGozadas?: number;
  /** O subsídio de férias das férias vencidas ainda não foi pago. */
  subsidioFeriasVencidoEmFalta?: boolean;
}

export interface ResultadoCreditos {
  diasServicoAno: number;
  diasAno: number;
  fracao: number;
  proporcionalFerias: number;
  proporcionalSubsidioFerias: number;
  proporcionalSubsidioNatal: number;
  feriasVencidas: number;
  subsidioFeriasVencido: number;
  total: number;
  limite245n3: boolean;
}

const MS_POR_DIA = 24 * 60 * 60 * 1000;

function utcDia(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function bissexto(ano: number): boolean {
  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}

export function calcularCreditosCessacao(p: ParamsCreditos): ResultadoCreditos {
  const diut = p.diuturnidades ?? 0;
  const feriasDias = p.feriasVencidasNaoGozadas ?? 0;
  if (!(p.retribuicaoBase >= 0)) throw new Error("A retribuição base tem de ser um valor positivo.");
  if (!(diut >= 0)) throw new Error("As diuturnidades não podem ser negativas.");
  if (!(feriasDias >= 0)) throw new Error("Os dias de férias vencidas não podem ser negativos.");
  const adm = utcDia(p.dataAdmissao);
  const ces = utcDia(p.dataCessacao);
  if (ces < adm) throw new Error("A data de cessação é anterior à data de admissão.");

  const anoCes = new Date(ces).getUTCFullYear();
  const anoAdm = new Date(adm).getUTCFullYear();
  const inicioAno = Math.max(Date.UTC(anoCes, 0, 1), adm);
  const diasServicoAno = Math.round((ces - inicioAno) / MS_POR_DIA) + 1;
  const diasAno = bissexto(anoCes) ? 366 : 365;
  const fracao = diasServicoAno / diasAno;

  const base = p.retribuicaoBase + diut;
  const proporcional = base * fracao;
  const feriasVencidas = (base / 22) * feriasDias;
  const subsidioFeriasVencido = p.subsidioFeriasVencidoEmFalta ? base : 0;

  // Duração até 12 meses: a cessação ocorre antes do dia em que se completariam 12 meses.
  const dAdm = new Date(adm);
  const doze = Date.UTC(dAdm.getUTCFullYear() + 1, dAdm.getUTCMonth(), dAdm.getUTCDate());
  const limite245n3 = anoCes === anoAdm + 1 || anoCes === anoAdm || ces < doze;

  return {
    diasServicoAno,
    diasAno,
    fracao,
    proporcionalFerias: proporcional,
    proporcionalSubsidioFerias: proporcional,
    proporcionalSubsidioNatal: proporcional,
    feriasVencidas,
    subsidioFeriasVencido,
    total: 3 * proporcional + feriasVencidas + subsidioFeriasVencido,
    limite245n3,
  };
}
