import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserStats, DayActivity } from '../types';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Flame, 
  Zap,
  BarChart3,
  Clock,
  BookOpen,
  Star,
  CheckCircle2,
  Calendar,
  BrainCircuit,
} from 'lucide-react';

interface AnalyticsViewProps {
  userStats: UserStats;
  activityHistory: DayActivity[];
}

// ── Variants ──────────────────────────────────────────────────────────────────
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const up = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 28 } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const heatColor = (count: number) => {
  if (count === 0) return 'bg-slate-100';
  if (count < 10) return 'bg-indigo-100';
  if (count < 25) return 'bg-indigo-300';
  if (count < 50) return 'bg-indigo-500';
  return 'bg-indigo-700';
};

// ── Thin bar chart using SVG ──────────────────────────────────────────────────
const MiniBarChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const max = Math.max(...data, 1);
  const H = 64;
  const W = 100; // percent-based via flex
  return (
    <div className="flex items-end justify-between gap-1 h-16">
      {data.map((v, i) => {
        const h = Math.max(4, Math.round((v / max) * H));
        const isLast = i === data.length - 1;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
              className={`w-full rounded-t-md ${isLast ? 'bg-indigo-600' : 'bg-indigo-200'}`}
              style={{ height: h }}
            />
            <span className={`text-[9px] font-bold ${isLast ? 'text-indigo-600' : 'text-slate-400'}`}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Retention curve (simple SVG polyline) ─────────────────────────────────────
const RetentionCurve: React.FC<{ data: number[] }> = ({ data }) => {
  const W = 280, H = 80;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / 100) * H;
    return `${x},${y}`;
  }).join(' ');
  const fill = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / 100) * H;
    return `${x},${y}`;
  }).join(' ') + ` ${W},${H} 0,${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={fill}
        fill="url(#retGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  userStats,
  activityHistory,
}) => {
  const [tab, setTab] = useState<'overview' | 'activity' | 'progress'>('overview');

  // Build 7-day and 30-day slices
  const last7 = activityHistory.slice(-7);
  const last30 = activityHistory.slice(-30);
  const totalLast7 = last7.reduce((a, d) => a + d.count, 0);
  const avgAccuracy = Math.round(last7.reduce((a, d) => a + d.accuracy, 0) / (last7.length || 1));
  const bestDay = last30.reduce((a, b) => (b.count > a.count ? b : a), last30[0] ?? { count: 0, date: '-', accuracy: 0 });
  const weekLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekData = last7.map(d => d.count);

  // Last 5 weeks heatmap (35 days)
  const heatDays = activityHistory.slice(-35);

  // Retention mock curve
  const retentionCurve = [100, 82, 68, 58, 52, 60, 66, 71, 75, 78, 80];

  // Card status breakdown
  const deckCount = 0; // placeholder
  const statCards = [
    { label: 'Words Mastered', value: userStats.totalWordsMastered.toLocaleString(), icon: <Star className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-50', sub: '+34 this week', subColor: 'text-emerald-600' },
    { label: 'Best Streak',    value: `${userStats.longestStreak}d`,                  icon: <Flame className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-50', sub: `Current: ${userStats.currentStreak}d`, subColor: 'text-slate-500' },
    { label: 'Total XP',       value: userStats.currentXp.toLocaleString(),           icon: <Zap className="w-4 h-4 text-indigo-600" />,   bg: 'bg-indigo-50', sub: `+${userStats.currentXp - 1200} this week`, subColor: 'text-emerald-600' },
    { label: 'Avg Accuracy',   value: `${avgAccuracy}%`,                              icon: <Target className="w-4 h-4 text-emerald-600" />,  bg: 'bg-emerald-50', sub: 'Optimal range', subColor: 'text-slate-500' },
  ];

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'overview',  label: 'Overview'  },
    { id: 'activity',  label: 'Activity'  },
    { id: 'progress',  label: 'Progress'  },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-lg mx-auto px-4 pt-4 pb-8 space-y-5"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div variants={up} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-4 h-4 text-white" />
            </span>
            Analytics
          </h1>
          <p className="text-[12px] text-slate-400 mt-0.5 ml-9">Your learning intelligence · last 30 days</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            {userStats.levelTitle}
          </p>
        </div>
      </motion.div>

      {/* ── Tab switcher ────────────────────────────────────────────────────── */}
      <motion.div variants={up} className="flex items-center bg-slate-100 p-1 rounded-2xl">
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative flex-1 py-2 text-[13px] font-bold rounded-xl transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="analytics-tab"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${active ? 'text-indigo-700' : 'text-slate-500'}`}>{t.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* ── TABS CONTENT ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ======= OVERVIEW ======= */}
        {tab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* 2×2 stat grid */}
            <div className="grid grid-cols-2 gap-3">
              {statCards.map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4">
                  <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                    {s.icon}
                  </div>
                  <p className="text-[22px] font-black text-slate-900 leading-none mb-0.5">{s.value}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{s.label}</p>
                  <p className={`text-[11px] font-bold mt-1 ${s.subColor}`}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Retention curve */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-[14px] font-extrabold text-slate-900">Memory Retention</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  {userStats.desiredRetention}% target
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">Ebbinghaus forgetting curve vs. SRS reviews</p>
              <RetentionCurve data={retentionCurve} />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>Day 0</span>
                <span>Day 10</span>
              </div>
            </div>

            {/* Card breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
              <h3 className="text-[14px] font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Lexicon Breakdown
              </h3>
              {[
                { label: 'Mastered', pct: userStats.maturePct, color: 'bg-indigo-500' },
                { label: 'Learning', pct: userStats.learningPct, color: 'bg-amber-400' },
                { label: 'New',      pct: userStats.unseenPct, color: 'bg-slate-200' },
              ].map(item => (
                <div key={item.label} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-[12px] font-semibold text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-[12px] font-bold text-slate-900">{item.pct}%</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ======= ACTIVITY ======= */}
        {tab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* This-week bar chart */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[14px] font-extrabold text-slate-900">This Week</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Cards reviewed per day</p>
                </div>
                <div>
                  <p className="text-[22px] font-black text-indigo-700 text-right leading-none">{totalLast7}</p>
                  <p className="text-[10px] text-slate-400 text-right font-semibold">total cards</p>
                </div>
              </div>
              <MiniBarChart data={weekData} labels={weekLabels} />
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Best day', value: Math.max(...weekData) },
                  { label: 'Avg/day',  value: Math.round(totalLast7 / 7) },
                  { label: 'Streak',   value: `${userStats.currentStreak}d` },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-[16px] font-black text-slate-900">{s.value}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 35-day heatmap */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <h3 className="text-[14px] font-extrabold text-slate-900">35-Day Heatmap</h3>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {['M','T','W','T','F','S','S'].map(d => (
                  <div key={d} className="text-center text-[9px] font-bold text-slate-400">{d}</div>
                ))}
                {heatDays.map((day, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    title={`${day.date}: ${day.count} cards`}
                    className={`aspect-square rounded-md ${heatColor(day.count)}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-3 justify-end">
                <span className="text-[10px] text-slate-400 font-semibold">Less</span>
                {['bg-slate-100','bg-indigo-100','bg-indigo-300','bg-indigo-500','bg-indigo-700'].map(c => (
                  <span key={c} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
                ))}
                <span className="text-[10px] text-slate-400 font-semibold">More</span>
              </div>
            </div>

            {/* Best day highlight */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-5 text-white shadow-lg shadow-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-amber-300" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-indigo-200">Personal Best</span>
              </div>
              <p className="text-4xl font-black mb-1">{bestDay.count}<span className="text-xl font-semibold text-indigo-200 ml-2">cards</span></p>
              <p className="text-[13px] text-indigo-200">{bestDay.date} · {bestDay.accuracy}% accuracy</p>
            </div>
          </motion.div>
        )}

        {/* ======= PROGRESS ======= */}
        {tab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* XP Level progress */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-900">{userStats.levelTitle}</h3>
                  <p className="text-[12px] text-slate-500">{userStats.currentXp.toLocaleString()} / {userStats.nextLevelXp.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((userStats.currentXp / userStats.nextLevelXp) * 100)}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-right font-semibold">
                {userStats.nextLevelXp - userStats.currentXp} XP to next level
              </p>
            </div>

            {/* CEFR milestone tracker */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
              <h3 className="text-[14px] font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                CEFR Milestones
              </h3>
              <div className="space-y-3">
                {[
                  { level: 'A1', label: 'Beginner',      done: true,  words: 500  },
                  { level: 'A2', label: 'Elementary',    done: true,  words: 1000 },
                  { level: 'B1', label: 'Intermediate',  done: true,  words: 2000 },
                  { level: 'B2', label: 'Upper-Inter.',  done: true,  words: 3500 },
                  { level: 'C1', label: 'Advanced',      done: false, words: 6000 },
                  { level: 'C2', label: 'Mastery',       done: false, words: 10000 },
                ].map((m, i) => (
                  <div key={m.level} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-black shadow-sm ${
                      m.done ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {m.level}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[13px] font-bold ${m.done ? 'text-slate-900' : 'text-slate-400'}`}>{m.label}</span>
                        <span className="text-[11px] font-semibold text-slate-400">{m.words.toLocaleString()} words</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${m.done ? 'bg-indigo-500' : 'bg-slate-200'}`}
                          initial={{ width: 0 }}
                          animate={{ width: m.done ? '100%' : `${Math.round((userStats.totalWordsMastered / m.words) * 100)}%` }}
                          transition={{ duration: 0.8, delay: i * 0.07 }}
                        />
                      </div>
                    </div>
                    {m.done && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* SRS health */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5">
              <h3 className="text-[14px] font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                SRS Health Score
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 80 80" className="-rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="33" strokeWidth="6" fill="none" stroke="#f1f5f9" />
                    <motion.circle
                      cx="40" cy="40" r="33" strokeWidth="6" fill="none"
                      stroke="#6366f1" strokeLinecap="round"
                      strokeDasharray={207}
                      initial={{ strokeDashoffset: 207 }}
                      animate={{ strokeDashoffset: 207 - (207 * userStats.desiredRetention) / 100 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[18px] font-black text-slate-900">{userStats.desiredRetention}%</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Retention</span>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-slate-600">New/day limit</span>
                    <span className="font-bold text-slate-900">{userStats.maxNewCardsPerDay} cards</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-slate-600">Review limit</span>
                    <span className="font-bold text-slate-900">{userStats.dailyReviewLimit} cards</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-slate-600">Mature cards</span>
                    <span className="font-bold text-emerald-600">{userStats.maturePct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
