import React from 'react';
import { Deck, UserStats } from '../types';
import { 
  Flame, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Plus, 
  Layers,
  BrainCircuit,
  Info
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

export const DashboardView: React.FC<DashboardViewProps> = ({
  userStats,
  decks,
  onStartStudy,
  onNavigateDecks,
  onNavigatePractice,
  onOpenNewDeck,
}) => {
  const totalDueCards = decks.reduce((acc, d) => acc + d.dueCount, 0);
  const primaryDeck = decks[0] || null;

  // Determine greeting based on current local hour
  const currentHour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 18) {
    timeGreeting = 'Good afternoon';
  } else if (currentHour >= 18) {
    timeGreeting = 'Good evening';
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
      
      {/* Top Greeting & Status Strip */}
      <div className="flex flex-col gap-3 pb-2 border-b border-slate-200/70 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {timeGreeting}, {userStats.name.split(' ')[0]}
            </h1>
            <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Synaptic Peak Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            CEFR Level: <span className="font-semibold text-slate-700">B2 / C1 Upper Intermediate</span> • Circadian retention efficiency is optimal right now.
          </p>
        </div>

        {/* Daily Goal Gauge */}
        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs md:justify-start">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="#e2e8f0"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="#4f46e5"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={119.38}
                strokeDashoffset={119.38 - (119.38 * (userStats.dailyGoalCompleted / userStats.dailyGoalTarget))}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-800">
              {Math.round((userStats.dailyGoalCompleted / userStats.dailyGoalTarget) * 100)}%
            </span>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Daily Target</div>
            <div className="text-sm font-bold text-slate-900">
              {userStats.dailyGoalCompleted} / {userStats.dailyGoalTarget} Cards
            </div>
          </div>
        </div>
      </div>

      {/* Hero Study Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-10 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-6 w-48 h-48 rounded-full bg-violet-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-[10px] sm:text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Spaced Repetition Queue</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
            {totalDueCards} cards due today
          </h2>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-5 sm:mb-6">
            Estimated ~12 mins session to maintain perfect retention. Rehearsing these items today prevents biological forgetting decay.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              id="dashboard-start-session-hero-btn"
              onClick={() => {
                if (primaryDeck) {
                  sounds.playFlip();
                  onStartStudy(primaryDeck);
                }
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Start Study Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="dashboard-practice-ai-hero-btn"
              onClick={onNavigatePractice}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-indigo-800/60 hover:bg-indigo-700/70 border border-indigo-400/30 text-indigo-100 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>AI Context Sandbox</span>
            </button>

            <span className="hidden sm:inline-block text-xs text-slate-400 ml-2">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Space</kbd> anytime
            </span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Consistency */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Consistency
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {userStats.currentStreak} Days
            </span>
            <span className="text-xs font-bold text-emerald-600">
              Personal Best
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Top 5% consistency rank on Memora this month.
          </p>
        </div>

        {/* Metric 2: Session Accuracy */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Session Accuracy
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {userStats.sessionAccuracy}%
            </span>
            <span className="text-xs font-bold text-emerald-600">
              +4.2% vs baseline
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Optimal recall sweet-spot (Target: 85% - 90%).
          </p>
        </div>

        {/* Metric 3: Mastered Vocabulary */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mastered Lexicon
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {userStats.totalWordsMastered.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-indigo-600">
              +34 this week
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Over 21 days repetition interval achieved.
          </p>
        </div>
      </div>

      {/* Active Decks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Active Decks
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              {decks.length}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="dashboard-new-deck-btn"
              onClick={onOpenNewDeck}
              className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Deck</span>
            </button>
            <button
              id="dashboard-view-all-decks-btn"
              onClick={onNavigateDecks}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              View All Decks →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {deck.category}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {deck.lastReviewed}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {deck.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {deck.description}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Mastery ({deck.masteryRate}%)</span>
                  <span className="font-semibold text-amber-600">
                    {deck.dueCount} due
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${deck.masteryRate}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    {deck.cardCount} total cards
                  </span>
                  <button
                    id={`deck-study-btn-${deck.id}`}
                    onClick={() => {
                      sounds.playFlip();
                      onStartStudy(deck);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>Study Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Tip & Spaced Repetition Science Banner */}
      <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start space-x-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-indigo-950 mb-1">
            Cognitive Principle: The Spacing Effect
          </h4>
          <p className="text-xs text-indigo-900/80 leading-relaxed">
            According to Hermann Ebbinghaus’s forgetting curve, reviewing a word just before you are about to forget it triggers neurochemical long-term potentiation. Memora’s dynamic algorithm calculates this exact inflection point.
          </p>
        </div>
      </div>
    </div>
  );
};
