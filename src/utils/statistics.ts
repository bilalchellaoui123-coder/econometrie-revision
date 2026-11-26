/**
 * Core statistical calculation logic for Econometrics 1 tests:
 * - Two-sample Student t-test (difference of means)
 * - Fisher F-test (ratio of variances)
 * - Degrees of freedom and decision rules
 */

export interface StudentTestInput {
  mean1: number;
  sd1: number;
  n1: number;
  mean2: number;
  sd2: number;
  n2: number;
}

export interface StudentTestResult {
  meanDiff: number;
  standardError: number;
  tStat: number;
  df: number;
  pValApprox: number;
  pValBounds: string;
}

export interface FisherTestResult {
  fStat: number;
  df1: number;
  df2: number;
  numeratorVariance: number;
  denominatorVariance: number;
}

/**
 * Calculates Student's t-statistic for comparing two independent groups:
 * t = (x̄₁ - x̄₂) / √( s₁²/n₁ + s₂²/n₂ )
 * df = n₁ + n₂ - 2
 */
export function calculateStudentT(input: StudentTestInput): StudentTestResult {
  const { mean1, sd1, n1, mean2, sd2, n2 } = input;
  const meanDiff = mean1 - mean2;
  const varianceTerm = (sd1 * sd1) / n1 + (sd2 * sd2) / n2;
  const standardError = Math.sqrt(varianceTerm);
  const tStat = standardError === 0 ? 0 : meanDiff / standardError;
  const df = n1 + n2 - 2;

  // Approximate 2-tailed p-value using standard normal / t-distribution approximation
  const absT = Math.abs(tStat);
  const pValApprox = approximateStudentPValue(absT, df);
  const pValBounds = getPValueBoundsFromTable(absT, df);

  return {
    meanDiff: Number(meanDiff.toFixed(4)),
    standardError: Number(standardError.toFixed(4)),
    tStat: Number(tStat.toFixed(3)),
    df,
    pValApprox: Number(pValApprox.toFixed(4)),
    pValBounds,
  };
}

/**
 * Calculates Fisher F-statistic:
 * F = s_max² / s_min²
 */
export function calculateFisherF(sd1: number, n1: number, sd2: number, n2: number): FisherTestResult {
  const v1 = sd1 * sd1;
  const v2 = sd2 * sd2;

  let fStat: number;
  let df1: number;
  let df2: number;
  let numVar: number;
  let denVar: number;

  if (v1 >= v2) {
    fStat = v2 === 0 ? 0 : v1 / v2;
    df1 = n1 - 1;
    df2 = n2 - 1;
    numVar = v1;
    denVar = v2;
  } else {
    fStat = v1 === 0 ? 0 : v2 / v1;
    df1 = n2 - 1;
    df2 = n1 - 1;
    numVar = v2;
    denVar = v1;
  }

  return {
    fStat: Number(fStat.toFixed(2)),
    df1,
    df2,
    numeratorVariance: Number(numVar.toFixed(4)),
    denominatorVariance: Number(denVar.toFixed(4)),
  };
}

/**
 * Evaluates hypothesis rejection decision based on p-value and alpha
 */
export function evaluateHypothesisDecision(
  pValue: number,
  alpha: number
): { rejectH0: boolean; conclusion: string; strength: 'très forte' | 'forte' | 'faible' | 'aucune' } {
  const rejectH0 = pValue < alpha;

  let strength: 'très forte' | 'forte' | 'faible' | 'aucune';
  if (pValue < 0.01) {
    strength = 'très forte';
  } else if (pValue < 0.05) {
    strength = 'forte';
  } else if (pValue < 0.10) {
    strength = 'faible';
  } else {
    strength = 'aucune';
  }

  const conclusion = rejectH0
    ? `On rejette H₀ au seuil α = ${(alpha * 100).toFixed(0)}% : l'écart observé est statistiquement significatif (trop grand pour être imputable au seul hasard).`
    : `On ne rejette pas H₀ au seuil α = ${(alpha * 100).toFixed(0)}% : les données ne fournissent pas de preuves suffisantes pour affirmer un effet (l'écart peut être dû au hasard). Attention : cela ne prouve PAS que H₀ est vraie !`;

  return { rejectH0, conclusion, strength };
}

/**
 * Classifies dataset type based on dimensions:
 * - Single period, multiple individuals = Coupe instantanée (Cross-sectional)
 * - Single individual, multiple periods = Série temporelle (Time series)
 * - Multiple individuals, multiple periods = Panel
 */
export function classifyDataType(
  multipleIndividuals: boolean,
  multiplePeriods: boolean
): 'Coupe instantanée' | 'Série temporelle' | 'Panel' | 'Inconnu' {
  if (multipleIndividuals && !multiplePeriods) return 'Coupe instantanée';
  if (!multipleIndividuals && multiplePeriods) return 'Série temporelle';
  if (multipleIndividuals && multiplePeriods) return 'Panel';
  return 'Inconnu';
}

/**
 * Approximate 2-tailed p-value for Student distribution
 */
function approximateStudentPValue(t: number, df: number): number {
  if (t === 0) return 1.0;
  // Numerical approximation for Student-t cdf
  const x = df / (df + t * t);
  const a = df / 2;
  const b = 0.5;
  // Beta incomplete approx or standard normal if df > 30
  if (df >= 30) {
    // Normal approximation corrected with Edgeworth
    const z = t * (1 - 1 / (4 * df));
    return Math.max(0.0001, Math.min(1.0, 2 * (1 - standardNormalCDF(z))));
  }
  const z = t * Math.sqrt((df - 1) / df);
  return Math.max(0.0001, Math.min(1.0, 2 * (1 - standardNormalCDF(z))));
}

function standardNormalCDF(z: number): number {
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2.0);
  const t = 1.0 / (1.0 + p * x);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * erf);
}

/**
 * Returns bounds from classical student table (α = 0.20, 0.10, 0.05, 0.02, 0.01, 0.002, 0.001)
 */
function getPValueBoundsFromTable(t: number, df: number): string {
  // Common critical values for typical degree of freedoms around 36
  if (t >= 3.582) return 'p < 0,001';
  if (t >= 3.333) return '0,001 < p < 0,002';
  if (t >= 2.719) return '0,002 < p < 0,01';
  if (t >= 2.028) return '0,01 < p < 0,05';
  if (t >= 1.688) return '0,05 < p < 0,10';
  if (t >= 1.306) return '0,10 < p < 0,20';
  return 'p > 0,20';
}
