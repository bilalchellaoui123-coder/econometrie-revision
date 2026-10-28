import React, { useState } from 'react';
import { COURSE_INFO, STUDY_PILLARS } from '../data/courseData';
import { Printer, Copy, Check, FileDown, BookOpen, Scale, AlertTriangle } from 'lucide-react';

interface PrintableSummaryProps {
  onCopyMarkdown: () => void;
  copied: boolean;
}

export const PrintableSummary: React.FC<PrintableSummaryProps> = ({ onCopyMarkdown, copied }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden when printing) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Fiche Mémo Synthétique & Formulaire d’Examen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mise en page optimisée pour l’impression A4 ou la consultation hors ligne.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onCopyMarkdown}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Markdown Copié !' : 'Copier en Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / Enregistrer PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Document */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none print-container">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-teal-800">
                {COURSE_INFO.university} — {COURSE_INFO.faculty}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-950 mt-1">
                {COURSE_INFO.module} · Fiche de Synthèse d’Examen
              </h1>
              <div className="text-sm font-semibold text-slate-700 mt-1">
                {COURSE_INFO.session} · {COURSE_INFO.track}
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              Enseignant : {COURSE_INFO.professor}
              <br />
              Format : Examen Final
            </div>
          </div>
        </div>

        {/* Section 1: Typologie des Données (Matrice) */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-slate-950 uppercase tracking-wide border-l-4 border-teal-600 pl-3">
            1. Typologie Fondamentale des Données Économiques
          </h2>
          <div className="overflow-x-auto border border-slate-300 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-900">
                <tr>
                  <th className="p-2.5">Type de Données</th>
                  <th className="p-2.5">Dimension Spatiale (Individus N)</th>
                  <th className="p-2.5">Dimension Temporelle (Dates T)</th>
                  <th className="p-2.5">Exemples Réels du Cours (Safi / Maroc)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold text-teal-900">Coupe instantanée (Cross-section)</td>
                  <td className="p-2.5 text-slate-700 font-medium">Plusieurs individus</td>
                  <td className="p-2.5 text-slate-700 font-medium">Une seule date fixe (T = 1)</td>
                  <td className="p-2.5 text-slate-600">
                    Chômage des 12 régions en 2025 ; 250 étudiants interrogés ce mois-ci ; 100 ménages de Safi en 2025.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-teal-900">Série temporelle (Time series)</td>
                  <td className="p-2.5 text-slate-700 font-medium">Un seul individu (N = 1)</td>
                  <td className="p-2.5 text-slate-700 font-medium">Plusieurs dates successives</td>
                  <td className="p-2.5 text-slate-600">
                    PIB trimestriel du Maroc de 2010 à 2025 ; Température mensuelle à Safi ; Trafic du Port de Safi.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-teal-900">Données de Panel (Longitudinales)</td>
                  <td className="p-2.5 text-slate-700 font-medium">Plusieurs individus (N &gt; 1)</td>
                  <td className="p-2.5 text-slate-700 font-medium">Plusieurs dates (T &gt; 1)</td>
                  <td className="p-2.5 text-slate-600">
                    100 ménages de Safi suivis de 2010 à 2025 ; 30 pays observés sur 20 ans ; CA de 15 conserveries (2020-2025).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600 italic">
            <strong>Règle de lecture matricielle :</strong> Dans un tableau [Individus × Années], une colonne = coupe instantanée, une ligne = série temporelle, tout le tableau = données de panel.
          </p>
        </section>

        {/* Section 2: Tests d'hypothèses et les 4 étapes */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-slate-950 uppercase tracking-wide border-l-4 border-teal-600 pl-3">
            2. Protocole Méthodologique d’un Test Statistique en 4 Étapes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-teal-900 block">Étape 1 : Formuler H₀ et H₁</span>
              <p className="text-slate-700">
                • <strong>H₀ (Hypothèse nulle) :</strong> Absence d’effet ou égalité (μ₁ = μ₂ ou β = 0). Présumé innocent.
                <br />
                • <strong>H₁ (Hypothèse alternative) :</strong> Présence d’un effet significatif (μ₁ ≠ μ₂). L’accusation.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-teal-900 block">Étape 2 : Choisir le seuil α</span>
              <p className="text-slate-700">
                Fixé <em>avant</em> l’expérience : α = 5% (usage courant, 95% confiance), α = 10% (exploratoire), α = 1% (erreur coûteuse).
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-teal-900 block">Étape 3 : Calculer statistique &amp; p-valeur</span>
              <p className="text-slate-700">
                • <strong>Student :</strong> t = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂), avec ddl = n₁ + n₂ - 2.
                <br />
                • <strong>Fisher :</strong> F = s_max² / s_min² pour tester l’égalité des variances.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-teal-900 block">Étape 4 : Règle de Décision</span>
              <p className="text-slate-700">
                • Si <strong>p-valeur &lt; α</strong> (ou |t| &gt; t_crit) : <strong>On rejette H₀</strong> (effet statistiquement significatif).
                <br />
                • Si <strong>p-valeur ≥ α</strong> : <strong>On ne rejette pas H₀</strong> (manque de preuve statistique).
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Extrait Officiel de la Table de Student */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-slate-950 uppercase tracking-wide border-l-4 border-teal-600 pl-3">
            3. Table de Student (Valeurs Critiques Bilatérales - Slide 26)
          </h2>
          <div className="overflow-x-auto border border-slate-300 rounded-xl">
            <table className="w-full text-xs text-center border-collapse font-mono">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-900">
                <tr>
                  <th className="p-2 text-left">ddl \ α</th>
                  <th className="p-2">0,20</th>
                  <th className="p-2">0,10</th>
                  <th className="p-2 bg-teal-50 border-x border-teal-300 font-black text-teal-950">0,05</th>
                  <th className="p-2">0,02</th>
                  <th className="p-2">0,01</th>
                  <th className="p-2">0,002</th>
                  <th className="p-2">0,001</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="p-2 text-left font-bold font-sans">35</td>
                  <td className="p-2">1,306</td>
                  <td className="p-2">1,690</td>
                  <td className="p-2 bg-teal-50 border-x border-teal-200 font-bold">2,030</td>
                  <td className="p-2">2,438</td>
                  <td className="p-2">2,724</td>
                  <td className="p-2">3,340</td>
                  <td className="p-2">3,591</td>
                </tr>
                <tr className="bg-teal-50/50 font-bold">
                  <td className="p-2 text-left font-sans text-teal-950">36 (Filles/Garçons)</td>
                  <td className="p-2">1,306</td>
                  <td className="p-2">1,688</td>
                  <td className="p-2 bg-teal-100 border-x border-teal-300 text-teal-950 font-black">2,028</td>
                  <td className="p-2">2,434</td>
                  <td className="p-2">2,719</td>
                  <td className="p-2">3,333</td>
                  <td className="p-2">3,582</td>
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold font-sans">37</td>
                  <td className="p-2">1,305</td>
                  <td className="p-2">1,687</td>
                  <td className="p-2 bg-teal-50 border-x border-teal-200 font-bold">2,026</td>
                  <td className="p-2">2,431</td>
                  <td className="p-2">2,715</td>
                  <td className="p-2">3,326</td>
                  <td className="p-2">3,574</td>
                </tr>
                <tr>
                  <td className="p-2 text-left font-bold font-sans">48 (TD Groupe A/B)</td>
                  <td className="p-2">1,299</td>
                  <td className="p-2">1,677</td>
                  <td className="p-2 bg-teal-50 border-x border-teal-200 font-bold">2,011</td>
                  <td className="p-2">2,407</td>
                  <td className="p-2">2,682</td>
                  <td className="p-2">3,269</td>
                  <td className="p-2">3,505</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Exemple d’encadrement de p-valeur :</strong> Avec t = 3,46 à 36 ddl :
            comme 3,333 &lt; 3,46 &lt; 3,582, la p-valeur se situe strictement entre <strong>0,001 &lt; p &lt; 0,002</strong>.
          </div>
        </section>

        {/* Section 4: Pièges d'Examen Cruciaux */}
        <section className="space-y-3 border-t border-slate-200 pt-5">
          <h2 className="text-base font-black text-rose-950 uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>4. Les 5 Pièges d’Examen qui Coûtent des Points</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-1">
              <strong>1. « On a prouvé H₀ » ❌ :</strong> En statistique, on ne prouve JAMAIS H₀. Tout comme au tribunal un prévenu acquitté n’est pas « prouvé innocent », ne pas rejeter H₀ signifie simplement un <em>manque de preuves empiriques</em>.
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-1">
              <strong>2. « La p-valeur est la probabilité que H₀ soit vraie » ❌ :</strong> FAUX. La p-valeur est calculée EN SUPPOSANT que H₀ est vraie : p = P(|T| ≥ |t| | H₀). Elle mesure la surprise du résultat, pas la vérité de H₀.
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-1">
              <strong>3. Une identité comptable vs Modèle :</strong> Une identité comptable n’a PAS de paramètre à estimer (VRAI).
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-1">
              <strong>4. Déflation des grandeurs :</strong> L’inflation gonfle les grandeurs en dirhams courants. Pour analyser l’effet réel, on utilise les dirhams constants.
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-1">
              <strong>5. T (majuscule) vs t (minuscule) :</strong> T est la variable aléatoire théorique (avant l’échantillon). t est la valeur fixe calculée sur nos données spécifiques.
            </div>
          </div>
        </section>

        {/* Document Footer */}
        <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Économétrie 1 · Faculté d’Économie et de Gestion de Safi · Université Cadi Ayyad</span>
          <span>Support de révision complet généré le {new Date().toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
};
