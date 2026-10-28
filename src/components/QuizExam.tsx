import React, { useState } from 'react';
import { EXAM_QUIZ_QUESTIONS } from '../data/courseData';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { fireConfetti } from '../utils/confetti';

export const QuizExam: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'stepper' | 'all'>('stepper');

  const questions = EXAM_QUIZ_QUESTIONS;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (selectedAnswers[questionId]) return; // already answered in stepper mode
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (selected === correctOpt?.id) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinish = () => {
    setShowResults(true);
    const score = calculateScore();
    if (score >= Math.ceil(questions.length * 0.75)) {
      fireConfetti();
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentIdx(0);
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-md">
                Évaluation Blanche
              </span>
              <span className="text-xs text-slate-400">Questions Tirées des Slides & Devoirs</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Entraînement QCM & Pièges d’Examen Final
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-slate-500">Progression : </span>
              <strong className="text-teal-700 font-mono">
                {answeredCount} / {questions.length}
              </strong>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
              <button
                onClick={() => setViewMode('stepper')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'stepper'
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Question par Question
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tout Afficher
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Results Banner if finished */}
      {showResults && (
        <div className="bg-linear-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0">
              <Award className="w-8 h-8 text-teal-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Bilan de l'évaluation
              </span>
              <h3 className="text-2xl font-black text-white">
                Votre Score : {score} / {questions.length} ({percentage}%)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {percentage >= 80
                  ? '🎉 Excellent ! Vous maîtrisez parfaitement les concepts, calculs et pièges de la Séance 2.'
                  : percentage >= 50
                  ? '👍 Bon niveau de base. Révisez les pièges d’examen sur la p-valeur et le test de Fisher.'
                  : '⚠️ Nécessite de revoir les fiches de cours, en particulier la signification du non-rejet de H₀.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recommencer le Test</span>
          </button>
        </div>
      )}

      {/* Questions Render Mode: Stepper */}
      {viewMode === 'stepper' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-md">
                Question {currentIdx + 1} sur {questions.length}
              </span>
              <span className="text-xs text-slate-400 font-mono">Slide {currentQ.slideRef}</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">{currentQ.title}</span>
          </div>

          {/* Context box if available */}
          {currentQ.context && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
              {currentQ.context}
            </div>
          )}

          <h3 className="text-base font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              const hasAnswered = !!selectedAnswers[currentQ.id];
              let optionStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

              if (hasAnswered) {
                if (opt.isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium ring-1 ring-emerald-500';
                } else if (isSelected && !opt.isCorrect) {
                  optionStyle = 'bg-red-50 border-red-500 text-red-950 line-through';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center font-bold text-[10px] shrink-0">
                      {opt.id.toUpperCase()}
                    </span>
                    <span>{opt.text}</span>
                  </div>

                  {hasAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {selectedAnswers[currentQ.id] && (
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs space-y-2">
              <div className="font-bold text-teal-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Explication & Corrigé Officiel</span>
              </div>
              <p className="text-teal-900 leading-relaxed">{currentQ.explanation}</p>

              {currentQ.examTrapWarning && (
                <div className="mt-2 pt-2 border-t border-teal-200 text-amber-900 font-medium flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Piège d’Examen :</strong> {currentQ.examTrapWarning}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Précédente
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>Suivante</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Voir le Bilan Final</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions Render Mode: All in one list */}
      {viewMode === 'all' && (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const hasAnswered = !!selectedAnswers[q.id];
            return (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-md">
                    Question {idx + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Slide {q.slideRef}</span>
                </div>

                {q.context && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                    {q.context}
                  </div>
                )}

                <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedAnswers[q.id] === opt.id;
                    let style = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

                    if (hasAnswered) {
                      if (opt.isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium';
                      else if (isSelected && !opt.isCorrect) style = 'bg-red-50 border-red-500 text-red-950';
                      else style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between gap-3 cursor-pointer ${style}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center font-bold text-[10px] shrink-0">
                            {opt.id.toUpperCase()}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {hasAnswered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 leading-relaxed">
                    <strong>Corrigé :</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          <div className="text-center pt-2">
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Calculer ma Note Finale d’Examen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
