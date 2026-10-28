import React, { useState, useEffect } from 'react';
import { FLASHCARDS_DECK, Flashcard } from '../data/courseData';
import {
  Layers,
  RotateCw,
  Check,
  X,
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS_DECK);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mastered_econometrie_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories = ['Tous', 'Données', 'Tests', 'Validation', 'Modélisation', 'Statistique'];

  const filteredCards = cards.filter(
    (c) => selectedCategory === 'Tous' || c.category === selectedCategory
  );

  const currentCard = filteredCards[currentIndex] || filteredCards[0] || cards[0];

  useEffect(() => {
    try {
      localStorage.setItem('mastered_econometrie_cards', JSON.stringify(masteredIds));
    } catch {
      // ignore
    }
  }, [masteredIds]);

  const toggleMastered = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const isCurrentMastered = masteredIds.includes(currentCard.id);

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-md">
                Mémorisation Active
              </span>
              <span className="text-xs text-slate-400">Répétition Espacée</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Flashcards de Définitions & Formules Clés
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              Maîtrisées :{' '}
              <strong className="text-emerald-700 font-mono font-bold">
                {masteredIds.length} / {cards.length}
              </strong>
            </div>

            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Mélanger</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Card */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[320px] rounded-3xl p-6 md:p-8 cursor-pointer select-none transition-all duration-300 shadow-md border flex flex-col justify-between relative overflow-hidden ${
            isFlipped
              ? 'bg-linear-to-br from-teal-900 via-teal-950 to-slate-900 text-white border-teal-700'
              : 'bg-white text-slate-900 border-slate-200 hover:border-teal-400 hover:shadow-lg'
          }`}
        >
          {/* Top metadata */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isFlipped
                  ? 'bg-teal-700 text-teal-100 border border-teal-500/40'
                  : 'bg-slate-100 text-teal-800'
              }`}
            >
              {currentCard.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleMastered(currentCard.id, e)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                  isCurrentMastered
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isCurrentMastered ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isCurrentMastered ? 'Maîtrisé' : 'Marquer comme su'}</span>
              </button>

              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {filteredCards.length}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="py-6 my-auto text-center space-y-3">
            {!isFlipped ? (
              <div>
                <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mb-2">
                  Question de Révision
                </span>
                <h3 className="text-lg md:text-xl font-bold leading-relaxed text-slate-900">
                  {currentCard.question}
                </h3>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                  Réponse Détaillée & Démonstration
                </span>
                <p className="text-sm md:text-base leading-relaxed text-slate-100 whitespace-pre-line font-medium">
                  {currentCard.answer}
                </p>
                {currentCard.formula && (
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-teal-500/30 font-mono text-teal-300 text-xs text-center">
                    {currentCard.formula}
                  </div>
                )}
                {currentCard.tip && (
                  <div className="mt-3 p-3 bg-teal-800/40 border border-teal-600/30 rounded-xl text-xs text-teal-200">
                    💡 <strong>Astuce Mémo :</strong> {currentCard.tip}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom hint */}
          <div className="pt-4 border-t border-current/10 flex items-center justify-between text-xs opacity-75">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Cliquez pour {isFlipped ? 'voir la question' : 'révéler la réponse'}</span>
            </span>
            <span className="font-mono text-[11px]">Économétrie 1 · UCA</span>
          </div>
        </div>

        {/* Stepper buttons */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédente</span>
          </button>

          <button
            onClick={() => toggleMastered(currentCard.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isCurrentMastered
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isCurrentMastered ? 'Marquer à réviser ❌' : 'Je maîtrise ✅'}
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <span>Suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
