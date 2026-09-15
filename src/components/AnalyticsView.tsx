import React, { useState } from 'react';
import { UserStats, DayActivity } from '../types';
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  Target, 
  BrainCircuit, 
  Award, 
  CheckCircle2, 
  Flame, 
  Layers 
} from 'lucide-react';

interface AnalyticsViewProps {
  userStats: UserStats;
  activityHistory: DayActivity[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  userStats,
  activityHistory,
}) => {
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '3m' | 'all'>('30d');
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);

  // Group activity into weeks for heatmap (13 weeks x 7 days)
  const weeks: DayActivity[][] = [];
  let currentWeek: DayActivity[] = [];

  activityHistory.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === activityHistory.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 border border-slate-200/50';
    if (count < 15) return 'bg-emerald-200 border border-emerald-300';
    if (count < 28) return 'bg-emerald-400 border border-emerald-500';
    return 'bg-emerald-600 border border-emerald-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Cognitive Dynamics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Memory Dynamics & Retention
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empirical forgetting curve tracking and recall velocity across your vocabulary portfolio.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Time filters */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {(['7d', '30d', '3m', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  timeFilter === period
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '3m' ? '3 Months' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activityHistory, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "memora-memory-analytics.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Export analytics data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Top Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Total Encoded Lexicon
          </span>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {userStats.totalWordsMastered.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600">+4.2% growth</span>
          </div>
          <p className="text-xs text-slate-500">
            +48 words promoted to long-term memory this cycle.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Daily Recall Velocity
          </span>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              24 Cards/Day
            </span>
            <span className="text-xs font-bold text-indigo-600">120% Pacing</span>
          </div>
          <p className="text-xs text-slate-500">
            Average review completion speed: 4.8s per card.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Active Retention Rate
          </span>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {userStats.sessionAccuracy}%
            </span>
            <span className="text-xs font-bold text-emerald-600">Optimal Zone</span>
          </div>
          <p className="text-xs text-slate-500">
            Target retention: {userStats.desiredRetention}% (±1.4% algorithmic variance).
          </p>
        </div>
      </div>

      {/* Retention Trajectory Chart (Ebbinghaus vs Spaced Repetition) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Retention Trajectory: Spaced Repetition vs. Biological Decay
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing the neurological impact of timed reviews against standard Ebbinghaus forgetting curves.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
              <span className="text-slate-700">Memora SRS (Actual)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-rose-400 border-t border-dashed border-rose-500 inline-block" />
              <span className="text-slate-400">Natural Decay (Without SRS)</span>
            </div>
          </div>
        </div>

        {/* Responsive SVG Chart */}
        <div className="w-full h-64 sm:h-72 relative">
          <svg className="w-full h-full" viewBox="0 0 800 280" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="40" y1="40" x2="780" y2="40" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="100" x2="780" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="160" x2="780" y2="160" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="220" x2="780" y2="220" stroke="#f1f5f9" strokeWidth="1" />

            {/* Y-Axis Labels */}
            <text x="10" y="45" fill="#94a3b8" fontSize="11" fontWeight="600">100%</text>
            <text x="15" y="105" fill="#94a3b8" fontSize="11" fontWeight="600">75%</text>
            <text x="15" y="165" fill="#94a3b8" fontSize="11" fontWeight="600">50%</text>
            <text x="15" y="225" fill="#94a3b8" fontSize="11" fontWeight="600">25%</text>

            {/* Natural Biological Decay (Steep downward exponential curve) */}
            <path
              d="M 50 50 Q 150 190, 300 230 T 780 245"
              fill="none"
              stroke="#fb7185"
              strokeWidth="2.5"
              strokeDasharray="6,6"
            />

            {/* Memora Spaced Repetition Reinforcement Curve (Sawtooth sawtooth that stabilizes at 90%) */}
            <path
              d="M 50 50 L 120 120 L 125 55 L 240 100 L 245 52 L 420 85 L 425 50 L 620 70 L 625 48 L 780 60"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Active Reinforcement nodes */}
            <circle cx="50" cy="50" r="5" fill="#4f46e5" />
            <circle cx="125" cy="55" r="5" fill="#4f46e5" />
            <circle cx="245" cy="52" r="5" fill="#4f46e5" />
            <circle cx="425" cy="50" r="5" fill="#4f46e5" />
            <circle cx="625" cy="48" r="5" fill="#4f46e5" />
            <circle cx="780" cy="60" r="5" fill="#4f46e5" />

            {/* X-Axis time markers */}
            <text x="50" y="265" fill="#94a3b8" fontSize="11">Day 1</text>
            <text x="125" y="265" fill="#94a3b8" fontSize="11">Day 3</text>
            <text x="245" y="265" fill="#94a3b8" fontSize="11">Day 7</text>
            <text x="425" y="265" fill="#94a3b8" fontSize="11">Day 14</text>
            <text x="625" y="265" fill="#94a3b8" fontSize="11">Day 30</text>
            <text x="740" y="265" fill="#94a3b8" fontSize="11">Day 60+</text>
          </svg>
        </div>
      </div>

      {/* Card Maturity Distribution & Daily Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Maturity Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Card Maturity Breakdown
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Mature (&gt;21 days interval)</span>
                <span className="font-bold text-emerald-600">{userStats.maturePct}% (719 words)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${userStats.maturePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Learning Phase (1-21 days)</span>
                <span className="font-bold text-indigo-600">{userStats.learningPct}% (335 words)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${userStats.learningPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Fresh Unseen (Queue)</span>
                <span className="font-bold text-slate-500">{userStats.unseenPct}% (186 words)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: `${userStats.unseenPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Circadian Peak & Streak Summary */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Habit Retention Streak
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Your neural memory consolidates best during your morning cognitive peak between <span className="font-semibold text-slate-800">08:30 AM – 10:00 AM</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Current Streak</span>
              <span className="text-xl font-bold text-slate-900">{userStats.currentStreak} Days</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Longest Streak</span>
              <span className="text-xl font-bold text-indigo-600">{userStats.longestStreak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 90-Day Memory Consistency Heatmap */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              90-Day Memory Consistency Calendar
            </h3>
            <p className="text-xs text-slate-500">
              Daily repetition frequency across 13 weeks of spaced recall.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span>Less</span>
            <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
            <div className="w-3 h-3 rounded bg-emerald-200" />
            <div className="w-3 h-3 rounded bg-emerald-400" />
            <div className="w-3 h-3 rounded bg-emerald-600" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1.5 min-w-[700px]">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-4 h-4 rounded-md transition-transform hover:scale-125 cursor-pointer ${getHeatmapColor(day.count)}`}
                    title={`${day.date}: ${day.count} cards reviewed`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hovered Day Details tooltip bar */}
        <div className="h-6 flex items-center text-xs text-slate-500">
          {hoveredDay ? (
            <span className="font-medium text-slate-800">
              📅 {hoveredDay.date}: <span className="font-bold text-emerald-600">{hoveredDay.count} cards reviewed</span> ({hoveredDay.accuracy}% session accuracy)
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">Hover over any cell to view session specifics.</span>
          )}
        </div>
      </div>
    </div>
  );
};
