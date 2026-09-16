import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Deck } from '../types';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock3, 
  RotateCcw, 
  Search, 
  Sparkles,
  Play,
  ChevronRight,
  Zap,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ReviewViewProps {
  decks: Deck[];
  onStartReview: () => void;
}

type ReviewFilter = 'all' | Card['status'];

interface LearnedCard {
  card: Card;
  deck: Deck;
}

const statusConfig: Record<Card['status'], { label: string; bg: string; text: string; dot: string }> = {
  new:      { label: 'New',      bg: 'bg-slate-100',   text: 'text-slate-600',  dot: 'bg-slate-400'  },
  learning: { label: 'Learning', bg: 'bg-amber-50',    text: 'text-amber-700',  dot: 'bg-amber-400'  },
  review:   { label: 'Review',   bg: 'bg-indigo-50',   text: 'text-indigo-700', dot: 'bg-indigo-500' },
  mastered: { label: 'Mastered', bg: 'bg-emerald-50',  text: 'text-emerald-700',dot: 'bg-emerald-500'},
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const up = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
};

export const ReviewView: React.FC<ReviewViewProps> = ({ decks, onStartReview }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>('all');

  const learnedCards: LearnedCard[] = decks.flatMap(deck =>
    deck.cards.filter(c => c.status !== 'new').map(card => ({ card, deck }))
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCards = learnedCards.filter(({ card, deck }) => {
    const matchesFilter = selectedFilter === 'all' || card.status === selectedFilter;
    const matchesSearch = !normalizedQuery || [
      card.word, card.definition, card.vietnameseMeaning, deck.title,
    ].some(v => v.toLowerCase().includes(normalizedQuery));
    return matchesFilter && matchesSearch;
  });

  const counts = learnedCards.reduce<Record<Card['status'], number>>(
    (acc, { card }) => { acc[card.status]++; return acc; },
    { new: 0, learning: 0, review: 0, mastered: 0 }
  );

  const masteryPct = learnedCards.length > 0
    ? Math.round((counts.mastered / learnedCards.length) * 100)
    : 0;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-lg mx-auto px-4 pt-4 pb-8 space-y-5"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div variants={up}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-sm">
              <RotateCcw className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-[20px] font-black text-slate-900 tracking-tight">Review</h1>
          </div>
          <span className="text-[12px] text-slate-400 font-medium">{learnedCards.length} words learned</span>
        </div>
        <p className="text-[12px] text-slate-400 ml-9">Strengthen every word in your memory bank</p>
      </motion.div>

      {/* ── Hero CTA Card ───────────────────────────────────────────────────── */}
      <motion.div
        variants={up}
        className="relative overflow-hidden rounded-3xl text-white p-6 shadow-xl shadow-indigo-600/20"
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #6d28d9 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full bg-violet-400/20 blur-xl pointer-events-none" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Retention Library</p>
              <h2 className="text-2xl font-black tracking-tight">
                {counts.review + counts.learning}
                <span className="text-lg font-semibold text-indigo-200 ml-2">cards pending</span>
              </h2>
            </div>
            {/* Mastery ring */}
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 64 64" className="-rotate-90 w-16 h-16">
                <circle cx="32" cy="32" r="26" strokeWidth="5" fill="none" stroke="rgba(255,255,255,0.15)" />
                <motion.circle
                  cx="32" cy="32" r="26" strokeWidth="5" fill="none"
                  stroke="white" strokeLinecap="round"
                  strokeDasharray={163}
                  initial={{ strokeDashoffset: 163 }}
                  animate={{ strokeDashoffset: 163 - (163 * masteryPct) / 100 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black">{masteryPct}%</span>
                <span className="text-[8px] font-bold text-indigo-200 uppercase">Mastery</span>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { sounds.playProgress(); onStartReview(); }}
            disabled={learnedCards.length === 0}
            className="w-full py-4 rounded-2xl bg-white text-indigo-700 font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:bg-indigo-50 transition-colors"
          >
            <Play className="w-5 h-5 fill-indigo-600 text-indigo-600" />
            Start Review Session
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Stat Pills ──────────────────────────────────────────────────────── */}
      <motion.div variants={up} className="grid grid-cols-4 gap-2">
        {[
          { label: 'Total',    value: learnedCards.length,  icon: <BookOpen className="w-3.5 h-3.5" />,     bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200' },
          { label: 'Learning', value: counts.learning,      icon: <Brain className="w-3.5 h-3.5" />,       bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100' },
          { label: 'Review',   value: counts.review,        icon: <TrendingUp className="w-3.5 h-3.5" />,  bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-100'},
          { label: 'Mastered', value: counts.mastered,      icon: <Zap className="w-3.5 h-3.5" />,         bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100'},
        ].map(s => (
          <div key={s.label} className={`rounded-2xl ${s.bg} border ${s.border} p-3 flex flex-col items-center gap-1`}>
            <div className={s.text}>{s.icon}</div>
            <span className="text-[18px] font-black text-slate-900 leading-none">{s.value}</span>
            <span className={`text-[9px] font-bold uppercase tracking-wide ${s.text}`}>{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Search & Filter ─────────────────────────────────────────────────── */}
      <motion.div variants={up} className="space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search words, meanings, decks..."
            className="w-full bg-white border border-slate-200/70 rounded-2xl py-3 pl-10 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', 'learning', 'review', 'mastered'] as ReviewFilter[]).map(f => {
            const active = selectedFilter === f;
            const count = f === 'all' ? learnedCards.length : counts[f];
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white border border-slate-200/70 text-slate-600 active:bg-slate-50'
                }`}
              >
                {f === 'all' ? 'All' : statusConfig[f].label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[12px] text-slate-400 px-1">
          Showing <strong className="text-slate-700">{filteredCards.length}</strong> of {learnedCards.length} words
        </p>
      </motion.div>

      {/* ── Word List ───────────────────────────────────────────────────────── */}
      <motion.div variants={up} className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredCards.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="text-[14px] font-bold text-slate-700 mb-1">No words found</h3>
              <p className="text-[12px] text-slate-400">Try a different search or filter</p>
            </motion.div>
          ) : (
            filteredCards.map(({ card, deck }, i) => {
              const cfg = statusConfig[card.status];
              return (
                <motion.div
                  key={`${deck.id}-${card.id}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: Math.min(i, 10) * 0.04, type: 'spring', stiffness: 380, damping: 28 }}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Word + phonetic */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[15px] font-extrabold text-slate-900">{card.word}</span>
                        <span className="text-[11px] text-slate-400 font-mono truncate">{card.phonetic}</span>
                      </div>
                      {/* Vietnamese meaning */}
                      <p className="text-[12px] text-slate-600 font-medium mb-2">{card.vietnameseMeaning}</p>
                      {/* Deck + CEFR */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">{deck.title}</span>
                        <span className="text-[10px] font-bold text-slate-400">{deck.level}</span>
                      </div>
                    </div>

                    {/* Right side — status + interval */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${cfg.bg} ${cfg.text} flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                        <Clock3 className="w-3 h-3" />
                        {card.intervalDays}d
                      </div>
                    </div>
                  </div>

                  {/* Ease factor bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">Ease</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, ((card.easeFactor - 1.3) / (3.5 - 1.3)) * 100)}%` }}
                        transition={{ duration: 0.7, delay: i * 0.03 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">{card.easeFactor.toFixed(1)}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Secondary CTA at bottom ─────────────────────────────────────────── */}
      {learnedCards.length > 0 && filteredCards.length > 0 && (
        <motion.div variants={up} className="pt-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { sounds.playProgress(); onStartReview(); }}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 active:bg-indigo-700 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Review All {learnedCards.length} Words
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};
