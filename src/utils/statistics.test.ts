import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStudentT,
  calculateFisherF,
  evaluateHypothesisDecision,
  classifyDataType,
} from './statistics';

test('Student t-test matches Course Slide 25 (Filles vs Garçons)', () => {
  // Slide 25: 20 filles (moyenne 16, sd 1.5) vs 18 garcons (moyenne 14, sd 2.0)
  const result = calculateStudentT({
    mean1: 16,
    sd1: 1.5,
    n1: 20,
    mean2: 14,
    sd2: 2.0,
    n2: 18,
  });

  assert.equal(result.df, 36);
  assert.equal(result.meanDiff, 2);
  // t should round to 3.46 as shown on slide 25
  assert.equal(Math.round(result.tStat * 100) / 100, 3.46);

  // Decision at alpha = 5%
  const decision = evaluateHypothesisDecision(result.pValApprox, 0.05);
  assert.equal(decision.rejectH0, true);
  assert.equal(decision.strength, 'très forte');
});

test('Student t-test matches Course Slide 21 (Essai Clinique Hypertension)', () => {
  // Slide 21: 20 medicament (moyenne 12, sd 5.5) vs 20 placebo (moyenne 8, sd 5.5)
  const result = calculateStudentT({
    mean1: 12,
    sd1: 5.5,
    n1: 20,
    mean2: 8,
    sd2: 5.5,
    n2: 20,
  });

  assert.equal(result.df, 38);
  assert.equal(result.meanDiff, 4);
  // t is 4 / 1.739 = 2.30
  assert.equal(Math.round(result.tStat * 10) / 10, 2.3);
  assert.equal(result.pValApprox < 0.05, true);
});

test('Fisher F-test matches Course Slide 28 (Variances Filles vs Garçons)', () => {
  // Slide 28: F = s_G^2 / s_F^2 = 4 / 2.25 = 1.78
  const result = calculateFisherF(1.5, 20, 2.0, 18);
  assert.equal(result.fStat, 1.78);
  assert.equal(result.numeratorVariance, 4);
  assert.equal(result.denominatorVariance, 2.25);
});

test('Data type classification rules work correctly', () => {
  // Coupe: multiple individuals, single date
  assert.equal(classifyDataType(true, false), 'Coupe instantanée');
  // Série: single individual, multiple dates
  assert.equal(classifyDataType(false, true), 'Série temporelle');
  // Panel: multiple individuals, multiple dates
  assert.equal(classifyDataType(true, true), 'Panel');
});

test('Hypothesis decision rule handles non-rejection properly without claiming H0 is proven', () => {
  const decNonReject = evaluateHypothesisDecision(0.19, 0.05);
  assert.equal(decNonReject.rejectH0, false);
  // Must emphasize that not rejecting does NOT prove H0
  assert.ok(decNonReject.conclusion.includes('ne prouve PAS que H₀ est vraie'));
});
