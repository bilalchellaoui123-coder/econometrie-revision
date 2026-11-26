import React, { useState } from 'react';
import { STUDY_PILLARS, COURSE_INFO } from '../data/courseData';
import {
  Scale,
  Table as TableIcon,
  Activity,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ChapterRevisionProps {
  searchQuery: string;
}

const GoldRulesCard: React.FC = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
    <div className="flex items-center gap-2 font-bold text-amber-900">
      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
      <span>Règles d’Or pour l’Examen</span>
    </div>
    <ul className="space-y-1.5 text-amber-800 list-disc list-inside leading-relaxed">
      <li>
        <strong>Ne jamais écrire</strong> : « On accepte H₀ » ou « H₀ est prouvée ». Dites :{' '}
        <em>« On ne rejette pas H₀ par manque de preuve »</em>.
      </li>
      <li>
        Une <strong>identité comptable</strong> n’a pas de paramètre à estimer (VRAI).
      </li>
      <li>
        Le seuil <strong>α</strong> se fixe <em>toujours AVANT</em> de regarder les données.
      </li>
      <li>
        <strong>ddl de Student (2 groupes)</strong> = n₁ + n₂ - 2.
      </li>
    </ul>
  </div>
);

export const ChapterRevision: React.FC<ChapterRevisionProps> = ({ searchQuery }) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('terminology');
  const [matrixHighlight, setMatrixHighlight] = useState<'all' | 'column' | 'row' | 'none'>('column');
  const [roadmapOpenMobile, setRoadmapOpenMobile] = useState<boolean>(false);

  // Filter pillars and concepts if search query exists
  const query = searchQuery.trim().toLowerCase();
  const filteredPillars = STUDY_PILLARS.map((p) => {
    if (!query) return { ...p, matches: true };
    const matchesPillar =
      p.title.toLowerCase().includes(query) ||
      p.subtitle.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query);
    const matchedConcepts = p.keyConcepts.filter(
      (c) =>
        c.term.toLowerCase().includes(query) ||
        c.definition.toLowerCase().includes(query) ||
        (c.examNote && c.examNote.toLowerCase().includes(query))
    );
    const matchedNotes = p.detailedNotes.filter((n) => n.toLowerCase().includes(query));
    return {
      ...p,
      matches: matchesPillar || matchedConcepts.length > 0 || matchedNotes.length > 0,
      matchedConceptsCount: matchedConcepts.length,
    };
  }).filter((p) => p.matches);

  const activePillar =
    filteredPillars.find((p) => p.id === selectedPillarId) ||
    filteredPillars[0] ||
    STUDY_PILLARS[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Roadmap banner (compact & collapsible on mobile, expanded on desktop) */}
      <section className="bg-linear-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-teal-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 sm:mb-4">
            <div className="min-w-0">
              <span className="inline-block text-[11px] sm:text-xs uppercase tracking-wider font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-800/60">
                Progression du Semestre · Économétrie 1
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black mt-1.5 text-white leading-snug">
                Fiche Complète de Révision pour l’Évaluation Finale
              </h2>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 shrink-0">
              Support : <span className="text-teal-300 font-semibold">31 Diapositives (S2)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mb-3 sm:mb-5">
            {COURSE_INFO.overview}
          </p>

          {/* Mobile toggle button for roadmap */}
          <button
            type="button"
            onClick={() => setRoadmapOpenMobile((prev) => !prev)}
            className="sm:hidden w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-xs font-semibold text-teal-200 cursor-pointer"
          >
            <span>Programme du semestre (4 étapes)</span>
            {roadmapOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Module stages */}
          <div className={`${roadmapOpenMobile ? 'grid mt-3' : 'hidden'} sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3`}>
            {COURSE_INFO.roadmap.map((stage, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  stage.current
                    ? 'bg-teal-600/30 border-teal-400/80 shadow-inner'
                    : 'bg-slate-800/50 border-slate-700/60 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-teal-300">{stage.title}</span>
                  {stage.current && (
                    <span className="text-[10px] bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-sm shrink-0">
                      En cours
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-snug">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Pillars Navigation & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left column on desktop / Top compact 2x2 selector on mobile */}
        <div className="lg:col-span-4 min-w-0 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Les 4 Piliers du Chapitre 0 (S2)
            </h3>
            <span className="text-xs text-slate-400">{filteredPillars.length} sections</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {filteredPillars.map((p) => {
              const isSelected = activePillar.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPillarId(p.id)}
                  className={`w-full min-h-[56px] text-left p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs ring-1 ring-teal-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md whitespace-nowrap ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Pilier {p.number}
                    </span>
                    <span className="hidden sm:inline text-[10px] text-slate-400 font-medium truncate">
                      {p.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                    {p.title}
                  </h4>
                  <p className="hidden lg:block text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {p.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Quick Exam Tips Widget (Desktop placement) */}
          <div className="hidden lg:block">
            <GoldRulesCard />
          </div>
        </div>

        {/* Right column: Active Pillar Details */}
        <div className="lg:col-span-8 min-w-0 space-y-4 sm:space-y-6">
          {/* Active Pillar Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 md:p-6 shadow-xs space-y-5 sm:space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-md">
                  Pilier {activePillar.number} · {activePillar.badge}
                </span>
                <span className="text-xs text-slate-400">FEG Safi · Prof. S. Marso</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">{activePillar.title}</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">{activePillar.subtitle}</p>
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                <strong>Synthèse de cours :</strong> {activePillar.summary}
              </div>
            </div>

            {/* Special Interactive Matrix Explorer when in Pillar 2 (Data Types) */}
            {activePillar.id === 'data-types' && (
              <div className="bg-slate-900 text-white rounded-xl p-3.5 sm:p-4.5 space-y-3.5 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="font-bold text-xs sm:text-sm text-teal-200">
                      Visualiseur Matriciel Interactif (Slide 7)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-[11px] sm:text-xs">
                    <button
                      type="button"
                      onClick={() => setMatrixHighlight('column')}
                      className={`min-h-[38px] sm:min-h-0 px-2 sm:px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        matrixHighlight === 'column'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Coupe <span className="hidden sm:inline">(Colonne)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixHighlight('row')}
                      className={`min-h-[38px] sm:min-h-0 px-2 sm:px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        matrixHighlight === 'row'
                          ? 'bg-amber-600 text-white font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Série <span className="hidden sm:inline">(Ligne)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixHighlight('all')}
                      className={`min-h-[38px] sm:min-h-0 px-2 sm:px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        matrixHighlight === 'all'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Panel <span className="hidden sm:inline">(Tout)</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  {matrixHighlight === 'column' && (
                    <span className="text-blue-300 font-medium">
                      🔵 <strong>Coupe instantanée :</strong> On regarde une seule date (ex: colonne 2020) pour
                      les 3 entreprises A, B, C. Plusieurs individus, un seul moment.
                    </span>
                  )}
                  {matrixHighlight === 'row' && (
                    <span className="text-amber-300 font-medium">
                      🟠 <strong>Série temporelle :</strong> On suit une seule entreprise (ex: ligne Entreprise
                      A) au fil des années 2020, 2021, 2022. Un individu, plusieurs dates.
                    </span>
                  )}
                  {matrixHighlight === 'all' && (
                    <span className="text-emerald-300 font-medium">
                      🟢 <strong>Données de Panel :</strong> On suit simultanément toutes les entreprises
                      (A, B, C) sur l’ensemble des années (2020 à 2022). Double dimension spatio-temporelle.
                    </span>
                  )}
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto -mx-1 px-1">
                  <table className="w-full min-w-[460px] text-xs text-center border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2 px-2.5 text-left whitespace-nowrap">Entreprise \ Année</th>
                        <th className={`py-2 px-2.5 ${matrixHighlight === 'column' ? 'bg-blue-600/30 text-blue-200 font-bold border-x border-blue-500' : ''}`}>
                          2020
                        </th>
                        <th className="py-2 px-2.5">2021</th>
                        <th className="py-2 px-2.5">2022</th>
                        <th className="py-2 px-2.5 text-left whitespace-nowrap">Type de lecture</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr className={matrixHighlight === 'row' ? 'bg-amber-600/30 text-amber-200 font-bold border-y border-amber-500' : matrixHighlight === 'all' ? 'bg-emerald-600/20 text-emerald-100' : ''}>
                        <td className="py-2.5 px-2.5 text-left font-bold text-white whitespace-nowrap">Entreprise A</td>
                        <td className={`py-2.5 px-2.5 whitespace-nowrap ${matrixHighlight === 'column' ? 'bg-blue-600/30 text-blue-200 font-bold' : ''}`}>120 MDhs</td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">135 MDhs</td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">140 MDhs</td>
                        <td className="py-2.5 px-2.5 text-left text-[11px] text-slate-400">
                          {matrixHighlight === 'row' ? '👉 Série temporelle de l’Entreprise A' : 'Ligne'}
                        </td>
                      </tr>
                      <tr className={matrixHighlight === 'all' ? 'bg-emerald-600/20 text-emerald-100' : ''}>
                        <td className="py-2.5 px-2.5 text-left font-bold text-white whitespace-nowrap">Entreprise B</td>
                        <td className={`py-2.5 px-2.5 whitespace-nowrap ${matrixHighlight === 'column' ? 'bg-blue-600/30 text-blue-200 font-bold' : ''}`}>100 MDhs</td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">110 MDhs</td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">125 MDhs</td>
                        <td className="py-2.5 px-2.5 text-left text-[11px] text-slate-400">Ligne</td>
                      </tr>
                      <tr className={matrixHighlight === 'all' ? 'bg-emerald-600/20 text-emerald-100' : ''}>
                        <td className="py-2.5 px-2.5 text-left font-bold text-white whitespace-nowrap">Entreprise C</td>
                        <td className={`py-2.5 px-2.5 whitespace-nowrap ${matrixHighlight === 'column' ? 'bg-blue-600/30 text-blue-200 font-bold' : ''}`}>90 MDhs</td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">100 MDhs</td>
                        <td className="py-2.5 px-2.5 whitespace-nowrap">115 MDhs</td>
                        <td className="py-2.5 px-2.5 text-left text-[11px] text-slate-400">Ligne</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1 border-t border-slate-800">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Conclusion du Prof. Marso :</strong> Tout dépend de ce qu’on lit : une colonne (coupe), une ligne (série) ou tout le tableau (panel).
                  </span>
                </div>
              </div>
            )}

            {/* Special Tribunal vs Test Table when in Pillar 4 */}
            {activePillar.id === 'hypothesis-tests' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-4 py-2.5 text-xs font-bold flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>L’Analogie Incontournable du Tribunal (Slide 16)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Étape au Tribunal</th>
                        <th className="py-2.5 px-3">Correspondance dans un Test Statistique</th>
                        <th className="py-2.5 px-3">Signification Profonde</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">Présumé innocent</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-700">H₀ : Pas de différence, pas d’effet</td>
                        <td className="py-2.5 px-3 text-slate-600">On démarre en supposant l’effet nul (statut quo).</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">L’accusation</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-700">H₁ : Il y a un effet / différence</td>
                        <td className="py-2.5 px-3 text-slate-600">Ce que le chercheur cherche à prouver empiriquement.</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">Les pièces à conviction</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">Les données de l’échantillon</td>
                        <td className="py-2.5 px-3 text-slate-600">Statistiques calculées (moyennes, variances, écarts).</td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-red-50/40">
                        <td className="py-2.5 px-3 font-semibold text-red-900">Condamné si preuves fortes</td>
                        <td className="py-2.5 px-3 font-bold text-red-700">On REJETTE H₀</td>
                        <td className="py-2.5 px-3 text-red-800">L’écart observé est trop grand pour être dû au pur hasard.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-emerald-50/50">
                        <td className="py-2.5 px-3 font-semibold text-emerald-950">Acquitté ≠ Innocent prouvé</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">Ne pas rejeter H₀ ≠ Prouver H₀</td>
                        <td className="py-2.5 px-3 text-emerald-900 font-medium">
                          On manque seulement de preuves tangibles contre H₀.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Key Concepts Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Définitions & Notions Clés à Connaître par Cœur</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activePillar.keyConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col justify-between min-w-0"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-teal-900 mb-1">
                        {concept.term}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line break-words">
                        {concept.definition}
                      </p>
                    </div>
                    {concept.examNote && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[11px] text-amber-800 font-medium flex items-start gap-1">
                        <span className="text-amber-600 font-bold shrink-0">⚠️ Piège :</span>
                        <span className="break-words">{concept.examNote}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed course notes & numerical applications */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Démonstrations & Exemples Numériques Détaillés du Cours</span>
              </h4>

              <div className="space-y-2.5">
                {activePillar.detailedNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line break-words"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulas if any */}
            {activePillar.formulas && activePillar.formulas.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Formules Mathématiques Officielles</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activePillar.formulas.map((form, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5 min-w-0"
                    >
                      <span className="text-xs font-bold text-slate-800 block">{form.name}</span>
                      <div className="p-2.5 bg-slate-900 text-teal-300 font-mono text-[11px] sm:text-xs rounded-lg overflow-x-auto whitespace-nowrap tracking-wide text-center">
                        {form.latex}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{form.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exam traps callout */}
            {activePillar.examTraps && activePillar.examTraps.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Pièges Fréquents Sanctionnés à l’Examen (À Éviter Absolument)</span>
                </div>
                <ul className="space-y-1 text-rose-800 list-disc list-inside">
                  {activePillar.examTraps.map((trap, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {trap}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Exam Tips Widget (Mobile placement — below active pillar so content comes first) */}
          <div className="lg:hidden">
            <GoldRulesCard />
          </div>
        </div>
      </div>
    </div>
  );
};
