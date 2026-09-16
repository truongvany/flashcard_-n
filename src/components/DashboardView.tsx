import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Deck, UserStats } from '../types';
import {
  Flame,
  Zap,
  ArrowRight,
  BookOpen,
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  ChevronRight,
  Plus,
  CheckCircle,
  Play,
  Star,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface DashboardViewProps {
  userStats: UserStats;
  decks: Deck[];
  onStartStudy: (deck: Deck) => void;
  onNavigateDecks: () => void;
  onNavigatePractice: () => void;
  onOpenNewDeck: () => void;
}

// ─── Motion Variants ────────────────────────────────────────────────────────
const page = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const up = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
};

// ─── Deck color map ──────────────────────────────────────────────────────────
const deckColors: Record<string, { bg: string; ring: string; badge: string; icon: string }> = {
  indigo:  { bg: 'from-indigo-500 to-indigo-600',   ring: 'ring-indigo-200',  badge: 'bg-indigo-100 text-indigo-700',  icon: 'text-indigo-100' },
  emerald: { bg: 'from-emerald-500 to-teal-600',    ring: 'ring-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-100' },
  amber:   { bg: 'from-amber-500 to-orange-500',    ring: 'ring-amber-200',   badge: 'bg-amber-100 text-amber-700',    icon: 'text-amber-100' },
  sky:     { bg: 'from-sky-500 to-cyan-500',        ring: 'ring-sky-200',     badge: 'bg-sky-100 text-sky-700',        icon: 'text-sky-100' },
  rose:    { bg: 'from-rose-500 to-pink-600',       ring: 'ring-rose-200',    badge: 'bg-rose-100 text-rose-700',      icon: 'text-rose-100' },
  violet:  { bg: 'from-violet-500 to-purple-600',   ring: 'ring-violet-200',  badge: 'bg-violet-100 text-violet-700',  icon: 'text-violet-100' },
};

const getColor = (scheme?: string) => deckColors[scheme ?? 'indigo'] ?? deckColors.indigo;

// ─── Small Sparkline component ───────────────────────────────────────────────
const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const max = Math.max(...values, 1);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 60},${20 - (v / max) * 18}`)
    .join(' ');
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Animated XP progress ring ───────────────────────────────────────────────
const XpRing: React.FC<{ pct: number }> = ({ pct }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct / 100, 1);
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-90">
      <circle cx="30" cy="30" r={r} strokeWidth="4" fill="none" stroke="#e2e8f0" />
      <motion.circle
        cx="30" cy="30" r={r} strokeWidth="4" fill="none"
        stroke="url(#xpGrad)" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export const DashboardView: React.FC<DashboardViewProps> = ({
  userStats,
  decks,
  onStartStudy,
  onNavigateDecks,
  onNavigatePractice,
  onOpenNewDeck,
}) => {
  const [tipIdx, setTipIdx] = useState(0);

  const totalDue = decks.reduce((a, d) => a + d.dueCount, 0);
  const primaryDeck = decks.find(d => d.dueCount > 0) ?? decks[0] ?? null;
  const activeDecks = decks.slice(0, 4);
  const xpPct = Math.round((userStats.currentXp / userStats.nextLevelXp) * 100);

  // Greeting
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const greetEmoji = h < 12 ? '☀️' : h < 18 ? '⛅' : '🌙';

  // Mock weekly sparkline data
  const weekData = [18, 32, 27, 55, 40, 68, 24];

  // Rotating micro-tips
  const tips = [
    'Review cards just before they expire for maximum retention.',
    'Aim for 85–90% accuracy — the optimal difficulty zone.',
    'Short daily sessions beat long weekly marathons.',
    'Audio recall activates an extra memory pathway.',
  ];
  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 5000);
    return () => clearInterval(id);
  }, [tips.length]);

  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="w-full max-w-lg mx-auto px-4 pt-4 pb-8 space-y-5"
    >
      {/* ── 1. Greeting row ──────────────────────────────────────────────── */}
      <motion.div variants={up} className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">
            {greetEmoji} {greeting},{' '}
            <span className="text-indigo-600">{userStats.name.split(' ')[0]}</span>
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5 font-medium">
            {userStats.levelTitle} · CEFR {userStats.totalWordsMastered > 1000 ? 'C1' : 'B2'}
          </p>
        </div>
        {/* Streak pill */}
        <motion.div
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-sm px-3.5 py-2 rounded-2xl shadow-md shadow-amber-300/40 cursor-default"
        >
          <Flame className="w-4 h-4 fill-white text-white" />
          {userStats.currentStreak}d
        </motion.div>
      </motion.div>

      {/* ── 2. Hero "Start Study" card ───────────────────────────────────── */}
      <motion.div variants={up} className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-xl shadow-indigo-600/30">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-violet-400/20 blur-2xl" />
        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />

        <div className="relative z-10 p-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-[11px] font-bold mb-4">
            <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
            SRS Queue Active
          </div>

          {/* Count */}
          <div className="flex items-end gap-3 mb-1">
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              className="text-6xl font-black tracking-tight leading-none"
            >
              {totalDue}
            </motion.span>
            <span className="text-indigo-200 text-base font-semibold mb-2 leading-tight">
              cards<br />due today
            </span>
          </div>
          <p className="text-indigo-300 text-[13px] mb-5">
            Est. ~{Math.max(3, Math.ceil(totalDue * 0.75))} min session
          </p>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { sounds.playProgress(); primaryDeck && onStartStudy(primaryDeck); }}
            className="w-full bg-white text-indigo-700 font-extrabold text-[15px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 active:bg-indigo-50 transition-colors"
          >
            <Play className="w-4 h-4 fill-indigo-600 text-indigo-600" />
            Start Review Session
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </motion.div>

      {/* ── 3. Stat pills row ────────────────────────────────────────────── */}
      <motion.div variants={up} className="grid grid-cols-3 gap-3">
        {/* Daily Goal */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-col items-center gap-1 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Goal</span>
          <span className="text-base font-black text-slate-900">
            {userStats.dailyGoalCompleted}
            <span className="text-slate-400 font-semibold text-xs">/{userStats.dailyGoalTarget}</span>
          </span>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (userStats.dailyGoalCompleted / userStats.dailyGoalTarget) * 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-col items-center gap-1 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
          <span className="text-base font-black text-slate-900">{userStats.sessionAccuracy}%</span>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full mt-1">Optimal</span>
        </div>

        {/* XP Ring */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-col items-center gap-1 shadow-sm">
          <div className="relative flex items-center justify-center">
            <XpRing pct={xpPct} />
            <span className="absolute text-[10px] font-black text-indigo-700">{xpPct}%</span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">XP</span>
          <span className="text-[11px] font-semibold text-indigo-600">{userStats.currentXp.toLocaleString()}</span>
        </div>
      </motion.div>

      {/* ── 4. Quick modes ──────────────────────────────────────────────── */}
      <motion.div variants={up} className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-[15px] font-extrabold text-slate-900">Quick Study Modes</h2>
          <Brain className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
          {[
            { label: 'SRS Review',  sub: 'Scheduled queue',   icon: <Clock className="w-5 h-5" />,    color: 'text-indigo-600', bg: 'bg-indigo-50', action: () => primaryDeck && onStartStudy(primaryDeck) },
            { label: 'AI Practice', sub: 'Contextual writing', icon: <Sparkles className="w-5 h-5" />, color: 'text-violet-600', bg: 'bg-violet-50', action: onNavigatePractice },
            { label: 'All Decks',   sub: 'Browse library',    icon: <BookOpen className="w-5 h-5" />,  color: 'text-sky-600',    bg: 'bg-sky-50',    action: onNavigateDecks },
            { label: 'New Deck',    sub: 'Create custom',     icon: <Plus className="w-5 h-5" />,      color: 'text-emerald-600', bg: 'bg-emerald-50', action: onOpenNewDeck },
          ].map(m => (
            <motion.button
              key={m.label}
              whileTap={{ scale: 0.96, backgroundColor: '#f8fafc' }}
              onClick={() => { sounds.playFlip(); m.action(); }}
              className="flex items-center gap-3 p-4 text-left w-full active:bg-slate-50 transition-colors group"
            >
              <div className={`p-2 rounded-xl ${m.bg} ${m.color} shrink-0`}>{m.icon}</div>
              <div>
                <p className="text-[13px] font-bold text-slate-800 group-active:text-indigo-700">{m.label}</p>
                <p className="text-[11px] text-slate-400">{m.sub}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── 5. Active Decks ──────────────────────────────────────────────── */}
      <motion.div variants={up} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[15px] font-extrabold text-slate-900">Active Decks</h2>
          <button
            onClick={onNavigateDecks}
            className="text-[13px] font-bold text-indigo-600 flex items-center gap-0.5 active:text-indigo-800"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {activeDecks.map((deck, i) => {
              const c = getColor(deck.colorScheme);
              const mastery = deck.masteryRate;
              return (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 380, damping: 28 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => { sounds.playFlip(); onStartStudy(deck); }}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden active:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Icon swatch */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                      <BookOpen className={`w-5 h-5 ${c.icon}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[14px] font-bold text-slate-900 truncate">{deck.title}</h3>
                        {deck.dueCount > 0 && (
                          <span className="shrink-0 text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            {deck.dueCount} due
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${c.badge} px-1.5 py-0.5 rounded-md`}>{deck.category}</span>
                        <span className="text-[11px] text-slate-400">{deck.cardCount} cards</span>
                      </div>
                      {/* Mastery bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${c.bg}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${mastery}%` }}
                            transition={{ duration: 0.9, delay: i * 0.08 }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 shrink-0">{mastery}%</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── 6. Weekly Activity ───────────────────────────────────────────── */}
      <motion.div variants={up} className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900">This Week</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Cards reviewed per day</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <TrendingUp className="w-3 h-3" />
            +12% vs last
          </div>
        </div>
        <div className="flex items-end justify-between gap-1.5">
          {weekData.map((v, i) => {
            const max = Math.max(...weekData);
            const h = Math.max(8, Math.round((v / max) * 60));
            const isToday = i === weekData.length - 1;
            const days = ['M','T','W','T','F','S','S'];
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
                  className={`w-full rounded-t-lg ${isToday ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : 'bg-slate-100'}`}
                  style={{ height: h }}
                />
                <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{days[i]}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Total', value: weekData.reduce((a, b) => a + b, 0) },
            { label: 'Best day', value: Math.max(...weekData) },
            { label: 'Streak', value: `${userStats.currentStreak}d` },
          ].map(s => (
            <div key={s.label}>
              <p className="text-base font-black text-slate-900">{s.value}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 7. Word mastery progress ─────────────────────────────────────── */}
      <motion.div variants={up} className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-extrabold text-slate-900">Lexicon Progress</h2>
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl font-black text-slate-900">{userStats.totalWordsMastered.toLocaleString()}</div>
          <div className="text-sm text-slate-500 font-medium">words mastered<br /><span className="text-emerald-600 font-bold">+34 this week</span></div>
        </div>
        {/* Segmented bar */}
        <div className="flex rounded-full overflow-hidden h-3 mb-3">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${userStats.maturePct}%` }}
            transition={{ duration: 1 }}
          />
          <motion.div
            className="bg-gradient-to-r from-amber-400 to-amber-300 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${userStats.learningPct}%` }}
            transition={{ duration: 1, delay: 0.1 }}
          />
          <motion.div
            className="bg-slate-100 h-full flex-1"
          />
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5 text-indigo-600"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"/>Mastered {userStats.maturePct}%</span>
          <span className="flex items-center gap-1.5 text-amber-600"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>Learning {userStats.learningPct}%</span>
          <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-200 inline-block"/>New {userStats.unseenPct}%</span>
        </div>
      </motion.div>

      {/* ── 8. Micro Tip rotator ─────────────────────────────────────────── */}
      <motion.div variants={up} className="flex items-start gap-3 bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
        <div className="p-2 bg-indigo-100 rounded-xl shrink-0">
          <CheckCircle className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-extrabold text-indigo-500 uppercase tracking-widest mb-1">Memory Tip</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-[13px] font-medium text-indigo-900 leading-snug"
            >
              {tips[tipIdx]}
            </motion.p>
          </AnimatePresence>
          <div className="flex gap-1 mt-2">
            {tips.map((_, i) => (
              <button key={i} onClick={() => setTipIdx(i)} className={`h-1 rounded-full transition-all ${i === tipIdx ? 'bg-indigo-500 w-4' : 'bg-indigo-200 w-1.5'}`} />
            ))}
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};
