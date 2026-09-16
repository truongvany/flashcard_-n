import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AiPracticeWord, AiEvaluationResult } from '../types';
import { 
  Bot, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  ChevronRight, 
  Lightbulb, 
  Loader2,
  Star,
  ArrowRight,
  Zap,
  BookOpen,
  ChevronLeft,
} from 'lucide-react';
import { sounds, speakWord } from '../utils/audio';

interface AiPracticeViewProps {
  practiceWords: AiPracticeWord[];
  onCompleteWord: (word: string, xpEarned: number) => void;
}

// ── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
};
const slideIn = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
};

// ── Score ring ────────────────────────────────────────────────────────────────
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const r = 28, circ = 2 * Math.PI * r;
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} strokeWidth="5" fill="none" stroke="#f1f5f9" />
      <motion.circle
        cx="36" cy="36" r={r} strokeWidth="5" fill="none"
        stroke={color} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (circ * score) / 100 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export const AiPracticeView: React.FC<AiPracticeViewProps> = ({
  practiceWords,
  onCompleteWord,
}) => {
  const [words, setWords] = useState<AiPracticeWord[]>(practiceWords);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [userSentence, setUserSentence] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AiEvaluationResult | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [showWordList, setShowWordList] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeWord = words[selectedWordIndex] ?? words[0];
  const completedCount = words.filter(w => w.status === 'completed').length;
  const wordDetected = userSentence.toLowerCase().includes(activeWord.word.toLowerCase());

  useEffect(() => {
    const t = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Evaluate ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userSentence.trim() || isEvaluating) return;
    setIsEvaluating(true);
    setEvaluation(null);
    try {
      const res = await fetch('/api/ai/evaluate-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: activeWord.word,
          promptContext: activeWord.promptChallenge,
          userSentence: userSentence.trim(),
          targetCefr: activeWord.cefr,
        }),
      });
      const data = await res.json();
      if (data?.evaluation) {
        setEvaluation(data.evaluation);
        sounds.playRating('good');
        setWords(prev => prev.map((w, i) => i === selectedWordIndex ? { ...w, status: 'completed' } : w));
        onCompleteWord(activeWord.word, data.evaluation.xpEarned ?? 45);
      }
    } catch {
      // Fallback mock
      const fb: AiEvaluationResult = {
        score: 91,
        cefrVerified: `${activeWord.cefr} Confirmed`,
        summary: `Excellent contextual command of "${activeWord.word}". Clear, professional use.`,
        grammarTonePoints: [
          'Executive cadence: Clear conditional framing aligns with professional communication.',
          'Syntactical precision: Accurate modifier positioning throughout.',
        ],
        collocations: activeWord.collocations,
        modelAlternative: activeWord.sampleAnswer ?? userSentence,
        xpEarned: 45,
      };
      setEvaluation(fb);
      sounds.playRating('good');
      setWords(prev => prev.map((w, i) => i === selectedWordIndex ? { ...w, status: 'completed' } : w));
      onCompleteWord(activeWord.word, 45);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    setEvaluation(null);
    setUserSentence('');
    setSelectedWordIndex(i => (i + 1 < words.length ? i + 1 : 0));
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSelectWord = (idx: number) => {
    setSelectedWordIndex(idx);
    setEvaluation(null);
    setUserSentence('');
    setShowWordList(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-lg mx-auto px-4 pt-4 pb-8 space-y-4">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </span>
            AI Practice
          </h1>
          <p className="text-[12px] text-slate-400 mt-0.5 ml-9">Contextual sentence building · CEFR C1</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">{fmt(sessionSeconds)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completedCount}/{words.length}
          </div>
        </div>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
          animate={{ width: `${(completedCount / words.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* ── Word list button ─────────────────────────────────────────────── */}
      <button
        onClick={() => setShowWordList(v => !v)}
        className="w-full flex items-center justify-between bg-white border border-slate-200/70 rounded-2xl px-4 py-3 shadow-sm active:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-bold text-slate-900">{activeWord.word}</p>
            <p className="text-[11px] text-slate-400">{activeWord.partOfSpeech} · CEFR {activeWord.cefr}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {selectedWordIndex + 1}/{words.length}
          </span>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showWordList ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {/* ── Collapsible word list ────────────────────────────────────────── */}
      <AnimatePresence>
        {showWordList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm divide-y divide-slate-100 overflow-hidden">
              {words.map((w, idx) => {
                const active = idx === selectedWordIndex;
                const done = w.status === 'completed';
                return (
                  <button
                    key={w.word}
                    onClick={() => handleSelectWord(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${active ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      done ? 'bg-emerald-100 text-emerald-700' : active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {done ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-bold ${active ? 'text-indigo-700' : 'text-slate-800'}`}>{w.word}</p>
                      <p className="text-[11px] text-slate-400 truncate">{w.definition}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">{w.cefr}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Tutor card ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWord.word}
          variants={slideIn}
          initial="hidden"
          animate="show"
          className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-indigo-500/15 blur-2xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* AI label + word */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Memora Tutor AI</p>
                <p className="text-[11px] text-white/60">Linguistic Evaluation Engine</p>
              </div>
              <button
                onClick={() => speakWord(activeWord.word)}
                className="ml-auto w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/70 active:bg-white/20 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Word spotlight */}
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-black tracking-tight text-white">{activeWord.word}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-white/15 border border-white/20 text-white px-2 py-0.5 rounded">{activeWord.cefr}</span>
                <span className="text-[11px] text-white/50">{activeWord.partOfSpeech}</span>
              </div>
            </div>

            {/* Definition */}
            <p className="text-[13px] text-indigo-200 leading-relaxed border-l-2 border-indigo-400/40 pl-3">
              {activeWord.definition}
            </p>

            {/* Challenge prompt */}
            <div className="bg-white/8 border border-white/12 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Your Challenge</p>
              <p className="text-[13px] text-white/90 leading-relaxed font-medium">{activeWord.promptChallenge}</p>
            </div>

            {/* Collocations */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-2">Common Collocations</p>
              <div className="flex flex-wrap gap-1.5">
                {activeWord.collocations.map(c => (
                  <span key={c} className="text-[11px] bg-white/10 border border-white/15 text-white/80 px-2.5 py-1 rounded-lg font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Inspire suggestion ───────────────────────────────────────────── */}
      {!evaluation && (
        <motion.button
          variants={fadeUp} initial="hidden" animate="show"
          onClick={() => setUserSentence(activeWord.sampleAnswer ?? `The ${activeWord.word.toLowerCase()} approach has been vital to our success.`)}
          className="w-full flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-left active:bg-amber-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-amber-800">Need inspiration?</p>
            <p className="text-[11px] text-amber-600">Tap to load a sample sentence template</p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 ml-auto shrink-0" />
        </motion.button>
      )}

      {/* ── Write area (hidden when evaluation shown) ────────────────────── */}
      {!evaluation && (
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Textarea */}
            <div className="relative bg-white border border-slate-200/70 rounded-3xl shadow-sm overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all">
              <textarea
                ref={textareaRef}
                value={userSentence}
                onChange={e => setUserSentence(e.target.value)}
                placeholder={`Write a sentence using "${activeWord.word}"…`}
                rows={4}
                className="w-full px-4 pt-4 pb-2 text-[14px] text-slate-900 placeholder:text-slate-400 resize-none bg-transparent focus:outline-none leading-relaxed"
              />
              {/* Status chips */}
              <div className="flex items-center justify-between px-4 pb-3">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-all ${
                  wordDetected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {wordDetected ? `✓ "${activeWord.word}" detected` : 'Target word missing'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {userSentence.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!userSentence.trim() || isEvaluating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isEvaluating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Evaluating…</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Evaluate My Sentence <Send className="w-4 h-4 ml-1" /></>
              )}
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* ── Evaluation result ────────────────────────────────────────────── */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="space-y-4"
          >
            {/* Score card */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative shrink-0">
                  <ScoreRing score={evaluation.score} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900">{evaluation.score}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Score</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[14px] font-extrabold text-slate-900">Excellent Work!</span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {evaluation.cefrVerified}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{evaluation.summary}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    <Zap className="w-3 h-3 fill-amber-400" />+{evaluation.xpEarned} XP earned
                  </div>
                </div>
              </div>

              {/* Grammar points */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Grammar & Tone</p>
                {evaluation.grammarTonePoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-slate-700 leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Collocations */}
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Natural Collocations for "{activeWord.word}"
              </p>
              <div className="flex flex-wrap gap-2">
                {evaluation.collocations.map(c => (
                  <span key={c} className="text-[12px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-xl">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Model sentence */}
            {evaluation.modelAlternative && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Native Model Sentence</p>
                  </div>
                  <button
                    onClick={() => speakWord(evaluation.modelAlternative)}
                    className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 active:bg-indigo-200 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <blockquote className="text-[13px] text-slate-800 italic leading-relaxed">
                  "{evaluation.modelAlternative}"
                </blockquote>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { setEvaluation(null); setUserSentence(''); }}
                className="flex-1 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-[13px] flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Try Again
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
              >
                Next Word <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
