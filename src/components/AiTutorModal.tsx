import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { answerCourseQuestionLocally } from '../utils/tutorKnowledge';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Explique-moi la différence entre Coupe, Série et Panel avec un exemple de Safi.',
  'Pourquoi dit-on que "Ne pas rejeter H₀ ≠ Prouver H₀" ?',
  'Comment calcule-t-on les degrés de liberté pour le test de Student ?',
  'Donne-moi un problème type examen sur le test de Fisher avec la solution.',
  'Quelle est la définition exacte de la p-valeur sous l’angle du tribunal ?',
];

function isStaticHosting(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host.endsWith('github.io') || window.location.protocol === 'file:';
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Bonjour ! Je suis votre tuteur pédagogique pour l’Économétrie 1 (Séance 2 : Données & Tests d’hypothèse — FEG Safi). Je peux vous expliquer n’importe quel concept, décortiquer les formules de Student et Fisher, ou vous entraîner avec des questions types pour l’examen final. Quelle est votre question ?',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      // On static hosting (e.g. GitHub Pages) there is no Express backend; answer directly from course slides
      if (isStaticHosting()) {
        const localAnswer = answerCourseQuestionLocally(textToSend);
        setMessages((prev) => [...prev, { role: 'assistant', content: localAnswer }]);
        return;
      }

      const res = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.status === 404 || !contentType.includes('application/json')) {
        // Static deployment fallback when /api/ask-tutor route does not exist
        const localAnswer = answerCourseQuestionLocally(textToSend);
        setMessages((prev) => [...prev, { role: 'assistant', content: localAnswer }]);
        return;
      }

      const data = await res.json();
      if (res.ok && data.answer) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        const localAnswer = answerCourseQuestionLocally(textToSend);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `📚 Réponse directe du cours (mode hors-ligne) :\n\n${localAnswer}`,
          },
        ]);
      }
    } catch {
      const localAnswer = answerCourseQuestionLocally(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `📚 Réponse directe du cours (mode hors-ligne) :\n\n${localAnswer}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-none sm:rounded-3xl w-full max-w-2xl h-dvh sm:h-[600px] sm:max-h-[90dvh] flex flex-col shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-teal-900 to-slate-900 text-white px-4 py-3.5 sm:p-4.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                <span className="truncate">Tuteur Économétrique IA</span>
                <span className="text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded-full font-medium border border-teal-600/40 shrink-0">
                  Séance 2
                </span>
              </h3>
              <p className="text-[11px] text-teal-200 truncate">
                FEG Safi · Posez vos questions sur les diapositives
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le tuteur"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line break-words">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse delay-75" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse delay-150" />
                <span>Le tuteur formule une réponse rigoureuse...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions Bar */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
            Suggestions :
          </span>
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(sug)}
              className="min-h-[36px] text-[11px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors cursor-pointer border border-slate-200/60"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Posez votre question (ex: interpréter p = 0.03 ?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 min-h-[44px] px-3.5 py-2 text-base sm:text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Envoyer la question"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
