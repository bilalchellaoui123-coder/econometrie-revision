import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  Layers,
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  Search,
  X,
} from 'lucide-react';
import { COURSE_INFO } from '../data/courseData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenTutor: () => void;
  onPrint: () => void;
  onCopyMarkdown: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenTutor,
  onPrint,
  onCopyMarkdown,
  copied,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const tabs = [
    { id: 'revision', label: 'Fiche de Révision', compactLabel: 'Révision', mobileLabel: 'Révision', icon: BookOpen },
    { id: 'simulator', label: 'Simulateur', compactLabel: 'Simulateur', mobileLabel: 'Tests', icon: Calculator },
    { id: 'quiz', label: 'Quiz d’Examen', compactLabel: 'Quiz (9)', mobileLabel: 'Quiz', icon: CheckCircle2 },
    { id: 'flashcards', label: 'Flashcards', compactLabel: 'Flashcards', mobileLabel: 'Cartes', icon: Layers },
    { id: 'printable', label: 'Synthèse PDF', compactLabel: 'Mémo PDF', mobileLabel: 'Mémo', icon: FileText },
  ];

  const handleMobileTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Compact Top App Bar (<= 56px sticky height) */}
      <header className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
        <div className="px-3 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-teal-800 to-cyan-900 flex items-center justify-center font-bold text-xs tracking-wider text-teal-100 shrink-0 shadow-xs">
              UCA
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-teal-700 truncate">
                {COURSE_INFO.faculty} · {COURSE_INFO.track}
              </div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight truncate">
                {COURSE_INFO.module} · S2
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label="Rechercher dans le cours"
              aria-expanded={mobileSearchOpen}
              className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                mobileSearchOpen || searchQuery
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={onCopyMarkdown}
              aria-label="Copier le résumé en Markdown"
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={onOpenTutor}
              aria-label="Ouvrir le Tuteur IA"
              className="min-h-[40px] px-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tuteur</span>
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Search Drawer */}
        {mobileSearchOpen && (
          <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher (Student, p-valeur, panel...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'revision') setActiveTab('revision');
                }}
                autoFocus
                className="w-full min-h-[44px] pl-9 pr-9 py-2 text-base bg-slate-100 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Thumb-Zone Tab Bar (<= 60px + safe area) */}
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)] no-print"
      >
        <div className="grid grid-cols-5 items-center h-[60px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleMobileTabClick(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative h-full min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-1 transition-colors cursor-pointer ${
                  isActive ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-teal-600" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700 stroke-[2.25]' : 'text-slate-500'}`} />
                <span className={`text-[10px] leading-tight tracking-tight whitespace-nowrap ${isActive ? 'font-bold text-teal-800' : 'font-medium'}`}>
                  {tab.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Full Sticky Header (md and above) */}
      <header className="hidden md:block bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
        {/* Top institution bar */}
        <div className="bg-linear-to-r from-teal-900 via-teal-800 to-cyan-900 text-white px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-teal-700/80 border border-teal-500/40 flex items-center justify-center font-bold text-xs tracking-wider text-teal-200 shadow-inner">
                UCA
              </div>
              <div>
                <div className="text-xs font-semibold tracking-wide text-teal-200 flex items-center gap-1.5">
                  <span>{COURSE_INFO.university}</span>
                  <span className="text-teal-400">•</span>
                  <span>{COURSE_INFO.faculty}</span>
                </div>
                <h1 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{COURSE_INFO.module}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-600/60 text-teal-100 font-normal border border-teal-500/30">
                    {COURSE_INFO.track}
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-teal-300">
                Enseignant : <strong className="text-white font-medium">{COURSE_INFO.professor}</strong>
              </span>
              <span className="text-teal-500">|</span>
              <span className="bg-teal-700/60 text-teal-100 px-2.5 py-1 rounded-md border border-teal-600/40 font-medium">
                Chapitre 0 · Séance 2 (Données & Tests)
              </span>
            </div>
          </div>
        </div>

        {/* Main navigation & quick tools */}
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-2.5">
            {/* Tabs */}
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none min-w-0" aria-label="Sections de révision">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="xl:hidden">{tab.compactLabel}</span>
                    <span className="hidden xl:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick search & actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="relative w-32 lg:w-40 xl:w-48">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onOpenTutor}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Poser une question au tuteur IA sur le cours"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tuteur IA</span>
              </button>

              <button
                type="button"
                onClick={onCopyMarkdown}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                title="Copier le résumé complet en Markdown"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden xl:inline">{copied ? 'Copié !' : 'Markdown'}</span>
              </button>

              <button
                type="button"
                onClick={onPrint}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                title="Imprimer ou enregistrer en PDF la fiche d'examen"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
