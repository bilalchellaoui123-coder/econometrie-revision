import { STUDY_PILLARS, FLASHCARDS_DECK, EXAM_QUIZ_QUESTIONS } from '../data/courseData';

/**
 * Offline/static-hosting course assistant grounded strictly in Prof. S. Marso's
 * Séance 2 slides (Économétrie 1 · FEG Safi), used when no backend API is hosted
 * (for example on GitHub Pages static deployments).
 */
export function answerCourseQuestionLocally(rawQuestion: string): string {
  const q = rawQuestion.trim().toLowerCase();
  if (!q) {
    return 'Posez-moi une question sur le cours d’Économétrie 1 (Séance 2 : données, Student, Fisher, p-valeur, identité comptable…).';
  }

  // 1. Typologie des données (Coupe / Série / Panel)
  if (
    q.includes('coupe') ||
    q.includes('panel') ||
    q.includes('série') ||
    q.includes('serie') ||
    q.includes('donnée') ||
    q.includes('donnee') ||
    q.includes('matrice')
  ) {
    return [
      'Typologie des données économiques (Slide 7) :',
      '',
      '1. Coupe instantanée (Cross-section) : plusieurs individus observés à une seule date (colonne du tableau).',
      '   • Exemple Safi/Maroc : taux de chômage des 12 régions en 2025 ; 100 ménages de Safi en 2025.',
      '',
      '2. Série temporelle (Time series) : un seul individu observé sur plusieurs périodes successives (ligne du tableau).',
      '   • Exemple Safi/Maroc : PIB trimestriel du Maroc 2010-2025 ; trafic mensuel du Port de Safi.',
      '',
      '3. Données de Panel : plusieurs individus suivis sur plusieurs périodes (tout le tableau : individus × temps).',
      '   • Exemple Safi/Maroc : 100 ménages de Safi suivis de 2010 à 2025 ; CA de 15 conserveries de 2020 à 2025.',
      '',
      'Astuce examen : vérifiez toujours s’il y a 1 date ou plusieurs dates, et 1 individu ou plusieurs individus.',
    ].join('\n');
  }

  // 2. Non-rejet de H0 / Tribunal / Prouver H0
  if (
    q.includes('prouver') ||
    q.includes('accepter') ||
    q.includes('tribunal') ||
    q.includes('h0') ||
    q.includes('h₀') ||
    q.includes('innocent') ||
    q.includes('rejeter')
  ) {
    return [
      'Règle d’or & Analogie du Tribunal (Slide 16) :',
      '',
      '• H₀ (Hypothèse nulle) = le prévenu présumé innocent (ex : μ₁ = μ₂, pas d’effet).',
      '• H₁ (Hypothèse alternative) = l’accusation (il existe une différence significative).',
      '• Les données de l’échantillon = les pièces à conviction.',
      '',
      'Pourquoi « Ne pas rejeter H₀ ≠ Prouver H₀ » ?',
      'Au tribunal, acquitter faute de preuves suffisantes ne prouve pas que l’accusé est innocent : cela veut simplement dire que l’accusation n’a pas apporté de preuves assez solides.',
      '',
      'À l’examen : n’écrivez JAMAIS « on accepte H₀ » ou « H₀ est prouvée ». Écrivez toujours : « On ne rejette pas H₀ par manque de preuve statistique ».',
    ].join('\n');
  }

  // 3. p-valeur
  if (q.includes('p-valeur') || q.includes('pvaleur') || q.includes('p-value') || q.includes('p =') || q.includes('alpha') || q.includes('α')) {
    return [
      'Comprendre la p-valeur et le seuil α :',
      '',
      '• Définition exacte : p = P(|T| ≥ |t| | H₀). C’est la probabilité d’observer un écart au moins aussi grand que celui de votre échantillon SI H₀ était vraie (par pur hasard).',
      '• Règle de décision :',
      '  - Si p < α (ex : p = 0,03 < 0,05) → on REJETTE H₀ (résultat statistiquement significatif).',
      '  - Si p ≥ α (ex : p = 0,19 ≥ 0,05) → on NE REJETTE PAS H₀.',
      '',
      '⚠️ Piège classique d’examen : la p-valeur n’est PAS la probabilité que H₀ soit vraie ! Et le seuil α doit toujours être fixé AVANT de regarder les données.',
    ].join('\n');
  }

  // 4. Test de Fisher & Variances
  if (q.includes('fisher') || q.includes('variance') || q.includes('dispersion') || q.includes('homog')) {
    return [
      'Test de Fisher-Snedecor (Slide 28) :',
      '',
      '• Objectif : comparer les variances (dispersions) de deux groupes avant ou en complément du test de Student.',
      '• Hypothèses : H₀ : σ₁² = σ₂² vs H₁ : σ₁² ≠ σ₂².',
      '• Formule : F = s_max² / s_min² (on met toujours la plus grande variance au numérateur pour avoir F ≥ 1).',
      '',
      'Exemple du cours (Filles vs Garçons) :',
      '• Garçons : s₂ = 2 ⇒ s₂² = 4 ; Filles : s₁ = 1,5 ⇒ s₁² = 2,25.',
      '• F = 4 / 2,25 = 1,78.',
      '• Valeur critique (5%) = 2,57. Comme 1,78 < 2,57 (p ≈ 0,23 > 0,05), on ne rejette pas l’égalité des variances.',
    ].join('\n');
  }

  // 5. Test de Student & Degrés de liberté
  if (q.includes('student') || q.includes('ddl') || q.includes('degré') || q.includes('degre') || q.includes('moyenne')) {
    return [
      'Test de Student pour 2 groupes indépendants (Slides 21–29) :',
      '',
      '• Formule : t = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂) = Effet observé / Bruit dû au hasard.',
      '• Degrés de liberté : ddl = n₁ + n₂ - 2.',
      '',
      'Exemple du cours (Notes Filles vs Garçons, Slide 25) :',
      '• Filles (n₁ = 20, x̄₁ = 16, s₁ = 1,5) vs Garçons (n₂ = 18, x̄₂ = 14, s₂ = 2).',
      '• ddl = 20 + 18 - 2 = 36.',
      '• t = (16 - 14) / √(1,5²/20 + 2²/18) = 2 / 0,5786 = 3,457.',
      '• Valeur critique à 5% (36 ddl) = 2,028. Comme 3,457 > 2,028 (0,001 < p < 0,002), on rejette H₀ : l’écart de 2 points est statistiquement significatif.',
    ].join('\n');
  }

  // 6. Identité comptable / Dirhams courants vs constants / Résidus / Estimateur
  if (q.includes('identité') || q.includes('identite') || q.includes('comptable') || q.includes('dirham') || q.includes('inflation') || q.includes('résidu') || q.includes('residu') || q.includes('estimateur')) {
    return [
      'Notions fondamentales de modélisation (Pilier 1) :',
      '',
      '• Identité comptable vs Modèle : une identité comptable (ex : Y = C + S) est une égalité exacte sans paramètre à estimer (question d’examen : VRAI). Un modèle économétrique contient des paramètres inconnus et un terme d’erreur.',
      '• Dirhams courants vs constants : les dirhams courants intègrent l’inflation ; pour analyser l’évolution réelle, il faut déflater en dirhams constants.',
      '• Résidus : eᵢ = yᵢ - ŷᵢ (écart entre valeur observée et valeur prédite).',
      '• Estimateur sans biais : E(θ̂) = θ.',
    ].join('\n');
  }

  // 7. Keyword search across course pillars, flashcards, and quiz explanations
  const tokens = q.split(/\s+/).filter((w) => w.length >= 4);
  const scoredMatches: { score: number; text: string }[] = [];

  for (const pillar of STUDY_PILLARS) {
    for (const c of pillar.keyConcepts) {
      const hay = `${c.term} ${c.definition} ${c.examNote ?? ''}`.toLowerCase();
      const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
      if (score > 0) {
        scoredMatches.push({
          score,
          text: `${c.term} (${pillar.title}) :\n${c.definition}${c.examNote ? `\n⚠️ Piège : ${c.examNote}` : ''}`,
        });
      }
    }
  }

  for (const card of FLASHCARDS_DECK) {
    const hay = `${card.question} ${card.answer}`.toLowerCase();
    const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
    if (score > 0) {
      scoredMatches.push({
        score,
        text: `${card.question}\n→ ${card.answer}${card.formula ? `\nFormule : ${card.formula}` : ''}`,
      });
    }
  }

  for (const quiz of EXAM_QUIZ_QUESTIONS) {
    const hay = `${quiz.question} ${quiz.explanation}`.toLowerCase();
    const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
    if (score > 0) {
      scoredMatches.push({
        score,
        text: `Point QCM (Slide ${quiz.slideRef}) :\n${quiz.explanation}`,
      });
    }
  }

  scoredMatches.sort((a, b) => b.score - a.score);
  if (scoredMatches.length > 0) {
    return scoredMatches.slice(0, 2).map((m) => m.text).join('\n\n---\n\n');
  }

  // Default 4-step exam checklist
  return [
    'Méthodologie complète d’un test d’hypothèse en 4 étapes (Économétrie 1 · FEG Safi) :',
    '',
    '1. Formuler H₀ (absence d’effet, ex : μ₁ = μ₂) et H₁ (présence d’effet, ex : μ₁ ≠ μ₂).',
    '2. Choisir le seuil de risque α (5%, 1% ou 10%) AVANT de regarder les données.',
    '3. Calculer la statistique de test (t de Student avec ddl = n₁ + n₂ - 2, ou F de Fisher = s_max² / s_min²) et la p-valeur.',
    '4. Décision : si p < α (ou |t| > t_critique), on rejette H₀ ; sinon on ne rejette pas H₀ (sans jamais écrire « on accepte/prouve H₀ »).',
    '',
    'Vous pouvez me demander des précisions sur : Coupe vs Série vs Panel, le test de Student, le test de Fisher, la p-valeur ou l’analogie du tribunal.',
  ].join('\n');
}
