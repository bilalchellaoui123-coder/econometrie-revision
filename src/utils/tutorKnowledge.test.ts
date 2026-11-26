import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerCourseQuestionLocally } from './tutorKnowledge.ts';

test('explains Coupe, Série, and Panel with Safi examples', () => {
  const answer = answerCourseQuestionLocally('Explique la différence entre Coupe, Série et Panel');
  assert.match(answer, /Coupe instantanée/i);
  assert.match(answer, /Série temporelle/i);
  assert.match(answer, /Données de Panel/i);
  assert.match(answer, /Safi/i);
});

test('explains tribunal analogy and non-rejection rule', () => {
  const answer = answerCourseQuestionLocally('Pourquoi ne pas rejeter H0 ne veut pas dire prouver H0 ?');
  assert.match(answer, /tribunal/i);
  assert.match(answer, /Ne pas rejeter H₀/i);
});

test('explains Student test degrees of freedom and Fisher variance test', () => {
  const student = answerCourseQuestionLocally('Comment calcule-t-on les degrés de liberté pour Student ?');
  assert.match(student, /n₁ \+ n₂ - 2/);

  const fisher = answerCourseQuestionLocally('Explique le test de Fisher sur les variances');
  assert.match(fisher, /1,78/);
});
