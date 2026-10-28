import React from 'react';
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
  const tabs = [
    { id: 'revision', label: 'Fiche de Révision', icon: BookOpen },
    { id: 'simulator', label: 'Simulateur de Tests', icon: Calculator, badge: 'Student & Fisher' },
    { id: 'quiz', label: 'Quiz d’Examen', icon: CheckCircle2, badge: '9 QCM' },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, badge: '12 Cartes' },
    { id: 'printable', label: 'Synthèse Imprimable', icon: FileText },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
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
            <span className="hidden sm:inline text-teal-300">
              Enseignant : <strong className="text-white font-medium">{COURSE_INFO.professor}</strong>
            </span>
            <span className="hidden sm:inline text-teal-500">|</span>
            <span className="bg-teal-700/60 text-teal-100 px-2.5 py-1 rounded-md border border-teal-600/40 font-medium">
              Chapitre 0 · Séance 2 (Données & Tests)
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation & quick tools */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none" aria-label="Sections de révision">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive
                          ? 'bg-teal-800 text-teal-100'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick search & actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher (Student, p-valeur, panel...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={onOpenTutor}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Poser une question au tuteur IA sur le cours"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tuteur IA</span>
            </button>

            <button
              onClick={onCopyMarkdown}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              title="Copier le résumé complet en Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{copied ? 'Copié !' : 'Markdown'}</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              title="Imprimer ou enregistrer en PDF la fiche d'examen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
