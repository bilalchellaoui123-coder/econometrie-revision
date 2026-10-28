/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChapterRevision } from './components/ChapterRevision';
import { TestSimulator } from './components/TestSimulator';
import { QuizExam } from './components/QuizExam';
import { FlashcardsView } from './components/FlashcardsView';
import { PrintableSummary } from './components/PrintableSummary';
import { AiTutorModal } from './components/AiTutorModal';
import { COURSE_INFO, STUDY_PILLARS, FLASHCARDS_DECK, EXAM_QUIZ_QUESTIONS } from './data/courseData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('revision');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Markdown summary generation for instant export
  const generateMarkdownSummary = (): string => {
    return `# ${COURSE_INFO.module} — Fiche Complète de Révision pour l'Évaluation Finale
**${COURSE_INFO.university} — ${COURSE_INFO.faculty}**
Enseignant : ${COURSE_INFO.professor}
Parcours : ${COURSE_INFO.track}
Séance : ${COURSE_INFO.session}

---

## 1. Typologie Fondamentale des Données Économiques
- **Coupe instantanée (Cross-section) :** Plusieurs individus observés au même moment (une seule date, pas de temps). Ex: Taux de chômage des 12 régions du Maroc en 2025 ; 250 étudiants interrogés ce mois-ci. (Colonne du tableau)
- **Série temporelle (Time series) :** Un individu observé sur plusieurs périodes successives. Ex: PIB trimestriel du Maroc 2010-2025 ; Température mensuelle à Safi 2000-2023. (Ligne du tableau)
- **Données de Panel :** Plusieurs individus suivis sur plusieurs périodes (double dimension individus × temps). Ex: 100 ménages de Safi suivis de 2010 à 2025 ; CA de 15 conserveries 2020-2025. (Matrice complète)

---

## 2. Distributions & Loi Normale
- Une distribution décrit la répartition des valeurs d'une variable.
- L'histogramme en cloche se résume par deux paramètres : la moyenne $\\mu$ (position centrale) et l'écart-type $\\sigma$ (dispersion).
- La loi normale est le socle des tests paramétriques (Student, Fisher) et du Théorème Central Limite (TCL).

---

## 3. Méthodologie Complète d'un Test d'Hypothèse en 4 Étapes
### L'analogie du tribunal (Slide 16) :
- **H₀ (Présumé innocent) :** Pas de différence, pas d'effet (ex: $\\mu_1 = \\mu_2$).
- **H₁ (L'accusation) :** Il y a une différence significative ($\\mu_1 \\neq \\mu_2$).
- **Les preuves :** Les données de l'échantillon.
- **Condamné si preuves fortes :** On rejette H₀ si l'écart est trop grand pour être dû au hasard.
- **Règle d'or :** *Ne pas rejeter H₀ ≠ Prouver H₀* (Acquitté n'est pas innocent prouvé !).

### Les 4 étapes :
1. **Formuler H₀ et H₁**
2. **Choisir le risque $\\alpha$** (souvent 5%, 1% ou 10%) AVANT de regarder les données.
3. **Calculer la statistique de test et la p-valeur :**
   - Student : $t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$ avec $ddl = n_1 + n_2 - 2$.
   - Fisher : $F = \\frac{s_{max}^2}{s_{min}^2}$ pour tester l'égalité des variances.
4. **Règle de décision :**
   - Si $p < \\alpha$ (ou $|t| > t_{critique}$) : On rejette H₀.
   - Si $p \\ge \\alpha$ : On ne rejette pas H₀ (manque de preuve statistique).

---

## 4. Cas Pratiques Traités en Cours
1. **Notes Filles vs Garçons (Slide 25) :**
   - Filles ($n=20, \\bar{x}=16, s=1,5$) vs Garçons ($n=18, \\bar{x}=14, s=2$).
   - $ddl = 36$, $t = 3,46$, $t_{critique}(5\\%) = 2,028$.
   - Comme $3,46 > 2,028$ et $0,001 < p < 0,002$ ($p = 0,0014 < 0,05$), on rejette H₀ : l'écart de 2 points n'est pas dû au hasard.
2. **Test de Fisher sur les variances (Slide 28) :**
   - $F = 2^2 / 1,5^2 = 4 / 2,25 = 1,78$.
   - $F_{critique} = 2,57$. Comme $1,78 < 2,57$ et $p \\approx 0,23 > 0,05$, on ne rejette pas l'égalité des variances.
3. **Exercice en classe TD (Slide 29) :**
   - Groupe A ($n=25, \\bar{x}=12, s=2$) vs Groupe B ($n=25, \\bar{x}=11, s=3,2$).
   - $ddl = 48$, $t = 1,32 < 2,011$. On ne rejette pas H₀ ($p \\approx 0,19 > 0,05$).

---

## 5. Pièges d'Examen Sanctionnés
- Dire "On accepte H₀" ou "On a prouvé H₀" (TOUJOURS dire : "On ne rejette pas H₀ par manque de preuve").
- Dire que la p-valeur est la probabilité que H₀ soit vraie (Faux : c'est la probabilité d'obtenir un écart aussi grand SI H₀ était vraie).
- Une identité comptable n'a PAS de paramètre à estimer (Vrai).
- Les dirhams courants subissent l'inflation, il faut déflater en dirhams constants.
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownSummary();
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    setActiveTab('printable');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenTutor={() => setIsTutorOpen(true)}
        onPrint={handlePrint}
        onCopyMarkdown={handleCopyMarkdown}
        copied={copied}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'revision' && <ChapterRevision searchQuery={searchQuery} />}
        {activeTab === 'simulator' && <TestSimulator />}
        {activeTab === 'quiz' && <QuizExam />}
        {activeTab === 'flashcards' && <FlashcardsView />}
        {activeTab === 'printable' && (
          <PrintableSummary onCopyMarkdown={handleCopyMarkdown} copied={copied} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 space-y-1 no-print">
        <div className="font-semibold text-slate-700">
          {COURSE_INFO.module} · {COURSE_INFO.session}
        </div>
        <div>
          {COURSE_INFO.faculty} · {COURSE_INFO.university} · Enseignant : {COURSE_INFO.professor}
        </div>
        <div className="text-[11px] text-slate-400">
          Conçu pour la préparation intensive aux examens et évaluations finales de licence.
        </div>
      </footer>

      {/* AI Tutor Modal */}
      <AiTutorModal isOpen={isTutorOpen} onClose={() => setIsTutorOpen(false)} />
    </div>
  );
}
