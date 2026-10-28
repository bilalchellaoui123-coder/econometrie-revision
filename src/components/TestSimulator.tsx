import React, { useState } from 'react';
import {
  calculateStudentT,
  calculateFisherF,
  evaluateHypothesisDecision,
  StudentTestInput,
} from '../utils/statistics';
import {
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PresetOption {
  id: string;
  name: string;
  subtitle: string;
  slideRef: number;
  input: StudentTestInput;
  alpha: number;
  fisherInput?: { sd1: number; n1: number; sd2: number; n2: number; fCrit: number };
}

const PRESETS: PresetOption[] = [
  {
    id: 'course-girls-boys',
    name: 'Notes Filles vs Garçons (Cours Safi)',
    subtitle: 'Slide 25 : 20 filles (moyenne 16) vs 18 garçons (moyenne 14)',
    slideRef: 25,
    alpha: 0.05,
    input: {
      mean1: 16,
      sd1: 1.5,
      n1: 20,
      mean2: 14,
      sd2: 2.0,
      n2: 18,
    },
    fisherInput: { sd1: 1.5, n1: 20, sd2: 2.0, n2: 18, fCrit: 2.57 },
  },
  {
    id: 'clinical-trial',
    name: 'Essai Clinique Hypertension',
    subtitle: 'Slide 21 : Médicament (n=20) vs Placebo (n=20)',
    slideRef: 21,
    alpha: 0.05,
    input: {
      mean1: 12,
      sd1: 5.5,
      n1: 20,
      mean2: 8,
      sd2: 5.5,
      n2: 20,
    },
  },
  {
    id: 'td-exercise',
    name: 'Exercice de TD en Classe',
    subtitle: 'Slide 29 : Groupe A (n=25) vs Groupe B (n=25)',
    slideRef: 29,
    alpha: 0.05,
    input: {
      mean1: 12,
      sd1: 2.0,
      n1: 25,
      mean2: 11,
      sd2: 3.2,
      n2: 25,
    },
    fisherInput: { sd1: 2.0, n1: 25, sd2: 3.2, n2: 25, fCrit: 2.27 },
  },
];

export const TestSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'fisher'>('student');
  const [activePresetId, setActivePresetId] = useState<string>('course-girls-boys');

  // Student test inputs
  const [mean1, setMean1] = useState<number>(16);
  const [sd1, setSd1] = useState<number>(1.5);
  const [n1, setN1] = useState<number>(20);

  const [mean2, setMean2] = useState<number>(14);
  const [sd2, setSd2] = useState<number>(2.0);
  const [n2, setN2] = useState<number>(18);

  const [alpha, setAlpha] = useState<number>(0.05);

  // Load preset
  const handleLoadPreset = (preset: PresetOption) => {
    setActivePresetId(preset.id);
    setMean1(preset.input.mean1);
    setSd1(preset.input.sd1);
    setN1(preset.input.n1);
    setMean2(preset.input.mean2);
    setSd2(preset.input.sd2);
    setN2(preset.input.n2);
    setAlpha(preset.alpha);
  };

  // Compute student test
  const studentResult = calculateStudentT({
    mean1,
    sd1,
    n1,
    mean2,
    sd2,
    n2,
  });

  const decision = evaluateHypothesisDecision(studentResult.pValApprox, alpha);

  // Critical value lookup approximation for typical df ~ 36-48
  const getCriticalValue = (df: number, a: number): number => {
    if (a === 0.10) return df >= 40 ? 1.684 : 1.688;
    if (a === 0.01) return df >= 40 ? 2.704 : 2.719;
    // default 0.05
    if (df === 36) return 2.028;
    if (df === 38) return 2.024;
    if (df === 48) return 2.011;
    return 2.028;
  };

  const tCrit = getCriticalValue(studentResult.df, alpha);
  const inRejectionZone = Math.abs(studentResult.tStat) > tCrit;

  // Fisher Test Calculation
  const fisherResult = calculateFisherF(sd1, n1, sd2, n2);
  const activePreset = PRESETS.find((p) => p.id === activePresetId);
  const fCrit = activePreset?.fisherInput?.fCrit || 2.57;
  const rejectFisher = fisherResult.fStat > fCrit;

  // SVG dimensions for bell curve
  const svgWidth = 600;
  const svgHeight = 220;
  const centerX = svgWidth / 2;
  const scaleX = 75; // px per t unit
  const tPos = Math.max(-3.8, Math.min(3.8, studentResult.tStat));
  const tMarkerX = centerX + tPos * scaleX;
  const tCritLeftX = centerX - tCrit * scaleX;
  const tCritRightX = centerX + tCrit * scaleX;

  // Gaussian path generator
  const points: [number, number][] = [];
  for (let x = -4; x <= 4; x += 0.1) {
    const y = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    const px = centerX + x * scaleX;
    const py = svgHeight - 35 - y * 380;
    points.push([px, py]);
  }
  const curvePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  return (
    <div className="space-y-6">
      {/* Intro card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-md">
                Module Interactif de Calcul
              </span>
              <span className="text-xs text-slate-400">Séance 2 · Tests Paramétriques</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Simulateur & Résolveur Pas-à-Pas des Tests d’Hypothèse
            </h2>
          </div>

          {/* Test switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Test de Student (Moyennes)
            </button>
            <button
              onClick={() => setActiveTab('fisher')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'fisher'
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Test de Fisher (Variances)
            </button>
          </div>
        </div>

        {/* Course Presets */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Charger un cas concret du cours du Prof. Marso :
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 text-teal-950 font-medium ring-1 ring-teal-500/30'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{preset.name}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                      Slide {preset.slideRef}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{preset.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeTab === 'student' ? (
        /* Student Test Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-teal-600" />
                  <span>Données des Deux Échantillons</span>
                </h3>
                <span className="text-xs text-slate-400">Variables indépendantes</span>
              </div>

              {/* Group 1 */}
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 space-y-2.5">
                <span className="text-xs font-bold text-teal-900 block">
                  Groupe 1 (ex: Filles / Médicament / Groupe A)
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-500 text-[10px] mb-1">Moyenne (x̄₁)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={mean1}
                      onChange={(e) => setMean1(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold font-mono focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] mb-1">Écart-type (s₁)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={sd1}
                      onChange={(e) => setSd1(parseFloat(e.target.value) || 0.1)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold font-mono focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] mb-1">Taille (n₁)</label>
                    <input
                      type="number"
                      min="2"
                      value={n1}
                      onChange={(e) => setN1(parseInt(e.target.value, 10) || 2)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold font-mono focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2 */}
              <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-100 space-y-2.5">
                <span className="text-xs font-bold text-cyan-900 block">
                  Groupe 2 (ex: Garçons / Placebo / Groupe B)
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-500 text-[10px] mb-1">Moyenne (x̄₂)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={mean2}
                      onChange={(e) => setMean2(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] mb-1">Écart-type (s₂)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={sd2}
                      onChange={(e) => setSd2(parseFloat(e.target.value) || 0.1)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] mb-1">Taille (n₂)</label>
                    <input
                      type="number"
                      min="2"
                      value={n2}
                      onChange={(e) => setN2(parseInt(e.target.value, 10) || 2)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Alpha Threshold */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Seuil de risque fixé (α) :</span>
                  <span className="font-bold text-teal-700 font-mono">{(alpha * 100).toFixed(0)}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0.10, label: '10% (Exploratoire)' },
                    { val: 0.05, label: '5% (Standard)' },
                    { val: 0.01, label: '1% (Erreur coûteuse)' },
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      onClick={() => setAlpha(lvl.val)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        alpha === lvl.val
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Valeur critique associée pour {studentResult.df} ddl : <strong>±{tCrit}</strong>
                </span>
              </div>
            </div>

            {/* Quick summary card */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-xs space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-teal-400 font-bold">
                Résultat Synthétique
              </span>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black font-mono text-white">
                    t = {studentResult.tStat > 0 ? `+${studentResult.tStat}` : studentResult.tStat}
                  </div>
                  <div className="text-xs text-slate-300">
                    Degrés de liberté : <strong className="text-teal-300">{studentResult.df} ddl</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-teal-300">{studentResult.pValBounds}</div>
                  <div className="text-[10px] text-slate-400">p ≈ {studentResult.pValApprox}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Resolution Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Visual Bell Curve */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Courbe de la Loi de Student & Zones Critiques</span>
                <span className="text-slate-400">ddl = {studentResult.df}</span>
              </div>

              {/* Bell Curve SVG */}
              <div className="w-full overflow-hidden bg-slate-50 rounded-xl p-2 border border-slate-100">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                  {/* Left rejection shaded tail */}
                  <rect
                    x="0"
                    y="0"
                    width={Math.max(0, tCritLeftX)}
                    height={svgHeight - 35}
                    fill="#fee2e2"
                    opacity="0.7"
                  />
                  {/* Right rejection shaded tail */}
                  <rect
                    x={tCritRightX}
                    y="0"
                    width={Math.max(0, svgWidth - tCritRightX)}
                    height={svgHeight - 35}
                    fill="#fee2e2"
                    opacity="0.7"
                  />

                  {/* Horizontal baseline */}
                  <line
                    x1="20"
                    y1={svgHeight - 35}
                    x2={svgWidth - 20}
                    y2={svgHeight - 35}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />

                  {/* Critical value lines */}
                  <line
                    x1={tCritLeftX}
                    y1="20"
                    x2={tCritLeftX}
                    y2={svgHeight - 35}
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <line
                    x1={tCritRightX}
                    y1="20"
                    x2={tCritRightX}
                    y2={svgHeight - 35}
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />

                  {/* Critical values text */}
                  <text
                    x={tCritLeftX}
                    y="15"
                    textAnchor="middle"
                    fill="#dc2626"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    -{tCrit}
                  </text>
                  <text
                    x={tCritRightX}
                    y="15"
                    textAnchor="middle"
                    fill="#dc2626"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    +{tCrit}
                  </text>

                  {/* Acceptance label */}
                  <text
                    x={centerX}
                    y="110"
                    textAnchor="middle"
                    fill="#0f766e"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Zone de non-rejet de H₀ ({((1 - alpha) * 100).toFixed(0)}%)
                  </text>
                  <text
                    x={tCritLeftX - 35}
                    y={svgHeight - 45}
                    textAnchor="middle"
                    fill="#b91c1c"
                    fontSize="10"
                  >
                    Rejet {(alpha * 50).toFixed(1)}%
                  </text>
                  <text
                    x={tCritRightX + 35}
                    y={svgHeight - 45}
                    textAnchor="middle"
                    fill="#b91c1c"
                    fontSize="10"
                  >
                    Rejet {(alpha * 50).toFixed(1)}%
                  </text>

                  {/* Bell curve line */}
                  <path d={curvePath} fill="none" stroke="#0f766e" strokeWidth="2.5" />

                  {/* Calculated t position */}
                  <circle cx={tMarkerX} cy={svgHeight - 35} r="6" fill={inRejectionZone ? '#dc2626' : '#0d9488'} />
                  <line
                    x1={tMarkerX}
                    y1={svgHeight - 35}
                    x2={tMarkerX}
                    y2={svgHeight - 70}
                    stroke={inRejectionZone ? '#dc2626' : '#0d9488'}
                    strokeWidth="2"
                  />
                  <rect
                    x={tMarkerX - 35}
                    y={svgHeight - 95}
                    width="70"
                    height="22"
                    rx="4"
                    fill={inRejectionZone ? '#b91c1c' : '#0f766e'}
                  />
                  <text
                    x={tMarkerX}
                    y={svgHeight - 80}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    t = {studentResult.tStat}
                  </text>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>0 = Valeur théorique si aucun effet sous H₀</span>
                <span className={`font-bold ${inRejectionZone ? 'text-red-600' : 'text-emerald-700'}`}>
                  {inRejectionZone ? '🎯 t est dans la ZONE DE REJET' : '✅ t est dans la ZONE DE NON-REJET'}
                </span>
              </div>
            </div>

            {/* Step-by-Step Formal Resolution Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Résolution Rigoureuse selon les 4 Étapes du Cours (Prof. Marso)
              </h4>

              {/* Step 1 */}
              <div className="flex items-start gap-3 text-xs">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-slate-900">Formulation des Hypothèses :</strong>
                  <div className="mt-1 font-mono text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-800">
                    H₀ : μ₁ = μ₂ (Pas de différence, même niveau moyen)
                    <br />
                    H₁ : μ₁ ≠ μ₂ (Test bilatéral : il existe une différence significative)
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 text-xs">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-slate-900">Choix du Seuil de Risque :</strong>
                  <p className="text-slate-600 mt-0.5">
                    On fixe α = {(alpha * 100).toFixed(0)}% avant d’analyser les données (degrés de liberté :
                    ddl = {n1} + {n2} - 2 = <strong>{studentResult.df}</strong>).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 text-xs">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="space-y-1 w-full">
                  <strong className="text-slate-900">Calcul de la Statistique de Test :</strong>
                  <div className="font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800 space-y-1">
                    <div>
                      • Numérateur (Effet observé) = {mean1} - {mean2} = <strong>{studentResult.meanDiff}</strong>
                    </div>
                    <div>
                      • Dénominateur (Bruit dû au hasard) = √( {sd1}²/{n1} + {sd2}²/{n2} ) ={' '}
                      <strong>{studentResult.standardError}</strong>
                    </div>
                    <div className="pt-1 text-teal-800 font-bold border-t border-slate-200">
                      t = {studentResult.meanDiff} / {studentResult.standardError} ={' '}
                      <span className="bg-teal-100 px-1.5 py-0.5 rounded text-teal-950 font-black">
                        {studentResult.tStat}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 text-xs">
                <span
                  className={`w-6 h-6 rounded-full text-white font-bold flex items-center justify-center shrink-0 ${
                    inRejectionZone ? 'bg-red-600' : 'bg-emerald-600'
                  }`}
                >
                  4
                </span>
                <div className="space-y-2 w-full">
                  <strong className="text-slate-900">Décision & Conclusion Formelle :</strong>
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      inRejectionZone
                        ? 'bg-red-50 border-red-200 text-red-950'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      {inRejectionZone ? (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span>
                        {inRejectionZone
                          ? `Décision : REJET DE H₀ (p < ${(alpha * 100).toFixed(0)}%)`
                          : `Décision : NON-REJET DE H₀ (p ≥ ${(alpha * 100).toFixed(0)}%)`}
                      </span>
                    </div>
                    <p>{decision.conclusion}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] font-mono">
                      Comparaison critique : |t| = {Math.abs(studentResult.tStat)} {inRejectionZone ? '>' : '≤'}{' '}
                      t_crit = {tCrit}.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fisher Variance Test Section */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              <span>Test de Fisher-Snedecor (Comparaison des Variances / Dispersions)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Slide 28 : Tester l’égalité des variances (homogénéité) avant la comparaison de moyennes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">Hypothèses du Test de Fisher :</span>
                <div className="font-mono bg-white p-3 rounded-lg border border-slate-200">
                  H₀ : σ₁² = σ₂² (Les deux variances sont égales)
                  <br />
                  H₁ : σ₁² ≠ σ₂² (Les variances sont différentes)
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  On place toujours la plus grande variance d’échantillon au numérateur de façon à obtenir F ≥ 1.
                </p>
              </div>

              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 space-y-2 text-xs">
                <span className="font-bold text-teal-950 block">Calcul de la Statistique F :</span>
                <div className="font-mono text-xs bg-white p-3 rounded-lg border border-teal-100 space-y-1">
                  <div>
                    s₁² = {sd1}² = <strong>{(sd1 * sd1).toFixed(2)}</strong> (ddl₁ = {n1 - 1})
                  </div>
                  <div>
                    s₂² = {sd2}² = <strong>{(sd2 * sd2).toFixed(2)}</strong> (ddl₂ = {n2 - 1})
                  </div>
                  <div className="pt-2 text-teal-900 font-bold border-t border-teal-100 text-sm">
                    F = {fisherResult.numeratorVariance} / {fisherResult.denominatorVariance} ={' '}
                    <span className="bg-teal-200 px-2 py-0.5 rounded text-teal-950 font-black">
                      {fisherResult.fStat}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className={`p-5 rounded-2xl border text-xs space-y-3 ${
                  rejectFisher
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  {rejectFisher ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  <span>
                    {rejectFisher
                      ? 'Rejet de H₀ : Variances Hétérogènes'
                      : 'Non-Rejet de H₀ : Égalité des Variances Maintenue'}
                  </span>
                </div>

                <div className="font-mono text-xs bg-white/80 p-3 rounded-xl border border-current/20 space-y-1">
                  <div>Statistique F calculée : {fisherResult.fStat}</div>
                  <div>Valeur critique F_crit (5%) : ≈ {fCrit}</div>
                  <div>
                    Condition : {fisherResult.fStat} {rejectFisher ? '>' : '<'} {fCrit}
                  </div>
                </div>

                <p className="leading-relaxed">
                  {rejectFisher
                    ? `Comme F (${fisherResult.fStat}) dépasse la valeur critique (${fCrit}), l'écart entre les dispersions est trop grand pour être dû au hasard. Les deux groupes ont des dispersions statistiquement inégales.`
                    : `Comme F (${fisherResult.fStat}) est inférieur à la valeur critique (${fCrit}) et que la p-valeur dépasse 0,05, on ne rejette pas l'égalité des variances. On peut considérer que les deux populations ont des variances comparables.`}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Lien avec la Régression Linéaire (Chapitre 1 & 2) :</strong> Le test de Fisher sera
                  utilisé ultérieurement pour tester la <em>significativité globale</em> de tous les coefficients
                  de la régression à la fois !
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
