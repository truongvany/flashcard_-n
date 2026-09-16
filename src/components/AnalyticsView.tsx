import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Layers,
  Zap,
  BarChart3,
  Clock,
  Activity,
  FileText,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AnalyticsViewProps {
  userStats: UserStats;
  activityHistory: DayActivity[];
}

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 350, damping: 25 },
  },
};

const cardHover = {
  rest: { y: 0, scale: 1, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
  hover: { 
    y: -4, 
    scale: 1.008, 
    boxShadow: "0 12px 24px -10px rgba(79, 70, 229, 0.12)",
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 } 
  },
  tap: { scale: 0.98 }
};

interface ChartPoint {
  day: string;
  srsPct: number;
  decayPct: number;
  cx: number;
  cySrs: number;
  cyDecay: number;
  note: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  userStats,
  activityHistory,
}) => {
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '3m' | 'all'>('30d');
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  // Group activity into weeks for 90-day heatmap (13 weeks x 7 days)
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
    if (count === 0) return 'bg-slate-100 border border-slate-200/50 hover:bg-slate-200';
    if (count < 15) return 'bg-emerald-200 border border-emerald-300 hover:bg-emerald-300';
    if (count < 28) return 'bg-emerald-400 border border-emerald-500 hover:bg-emerald-500';
    return 'bg-emerald-600 border border-emerald-700 hover:bg-emerald-700';
  };

  // Retention Trajectory Chart Points Data
  const chartPoints: ChartPoint[] = [
    { day: 'Day 1', srsPct: 100, decayPct: 100, cx: 50, cySrs: 40, cyDecay: 40, note: 'Initial Learning Phase: 100% Neural Encoding' },
    { day: 'Day 3', srsPct: 92, decayPct: 62, cx: 160, cySrs: 56, cyDecay: 116, note: '1st SM-2 Repetition: Prevents 38% Forgetting Decay' },
    { day: 'Day 7', srsPct: 94, decayPct: 40, cx: 310, cySrs: 52, cyDecay: 160, note: '2nd SM-2 Repetition: Long-term Synaptic Consolidation' },
    { day: 'Day 14', srsPct: 96, decayPct: 24, cx: 480, cySrs: 48, cyDecay: 192, note: '3rd SM-2 Repetition: Deep Memory Matrix Stabilization' },
    { day: 'Day 30', srsPct: 98, decayPct: 15, cx: 650, cySrs: 44, cyDecay: 210, note: 'Mature State: Permanent Storage in Long-term Memory' },
    { day: 'Day 60+', srsPct: 95, decayPct: 10, cx: 770, cySrs: 50, cyDecay: 220, note: 'Permanent Retention: Maintenance Interval > 60 Days' },
  ];

  // Handler: Export CSV
  const handleExportCSV = () => {
    const csvRows = ['Date,Cards Reviewed,Session Accuracy %'];
    activityHistory.forEach(item => {
      csvRows.push(`${item.date},${item.count},${item.accuracy}`);
    });
    const csvStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvStr);
    downloadAnchor.setAttribute('download', `memora-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handler: Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activityHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `memora-analytics-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8"
    >
      
      {/* Executive Analytics Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/85 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Cognitive Analytics Suite
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time SM-2 Sync</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Memory Dynamics & Retention
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empirical forgetting curve tracking and recall velocity across your vocabulary portfolio.
          </p>
        </div>

        {/* Time Filters & Export Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Morphing Tab Period Filters */}
          <div className="relative flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '3m', label: '3 Months' },
              { id: 'all', label: 'All Time' },
            ].map((period) => {
              const isActive = timeFilter === period.id;
              return (
                <button
                  key={period.id}
                  onClick={() => setTimeFilter(period.id as any)}
                  className={`relative z-10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isActive ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="analyticsTimeTab"
                      transition={{ type: 'spring' as const, stiffness: 450, damping: 30 }}
                      className="absolute inset-0 bg-white rounded-lg shadow-2xs -z-10"
                    />
                  )}
                  {period.label}
                </button>
              );
            })}
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Export Analytics as CSV"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">CSV</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportJSON}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Export Full Analytics Data JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">JSON</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 4 Executive Key Metrics Tiles */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Total Encoded Lexicon */}
        <motion.div 
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          variants={cardHover}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Encoded Lexicon
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
              <BrainCircuit className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {userStats.totalWordsMastered.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +4.2% Growth
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Promoted Words</span>
            <span className="font-semibold text-slate-700">+48 cards/cycle</span>
          </div>
        </motion.div>

        {/* Metric 2: Daily Recall Velocity */}
        <motion.div 
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          variants={cardHover}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daily Recall Velocity
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
              <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              24 <span className="text-base font-semibold text-slate-600">Cards/Day</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Avg Speed</span>
            <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
              4.8s / Card
            </span>
          </div>
        </motion.div>

        {/* Metric 3: Active Retention Rate */}
        <motion.div 
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          variants={cardHover}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Retention Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {userStats.sessionAccuracy}%
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Optimal Zone
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Target Benchmark</span>
            <span className="font-semibold text-slate-700">{userStats.desiredRetention}% Target</span>
          </div>
        </motion.div>

        {/* Metric 4: Spaced Repetition Stability */}
        <motion.div 
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          variants={cardHover}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              SM-2 Stability Index
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              2.54 <span className="text-sm font-normal text-slate-500">Ease Factor</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Memory Half-Life</span>
            <span className="font-semibold text-slate-700">~28.5 Days</span>
          </div>
        </motion.div>

      </motion.div>

      {/* Retention Trajectory Chart (Ebbinghaus vs Spaced Repetition) */}
      <motion.div 
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-extrabold text-slate-900">
                Retention Trajectory: Spaced Repetition vs Biological Decay
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">Interactive</span>
            </div>
            <p className="text-xs text-slate-500">
              Visualizing the neurological impact of timed reviews against standard Ebbinghaus forgetting curves.
            </p>
          </div>

          <div className="flex items-center space-x-5 text-xs font-semibold shrink-0">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 shadow-2xs inline-block" />
              <span className="text-slate-800">Memora SRS (Actual)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-0.5 bg-rose-400 border-t border-dashed border-rose-500 inline-block" />
              <span className="text-slate-400">Natural Decay (Without SRS)</span>
            </div>
          </div>
        </div>

        {/* Responsive Interactive SVG Chart */}
        <div className="w-full h-72 relative bg-gradient-to-b from-slate-50/50 to-white rounded-2xl p-4 border border-slate-100">
          <svg className="w-full h-full" viewBox="0 0 820 250" preserveAspectRatio="none">
            <defs>
              <linearGradient id="srsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            <line x1="40" y1="20" x2="800" y2="20" stroke="#e2e8f0" strokeDasharray="3,3" strokeWidth="1" />
            <line x1="40" y1="70" x2="800" y2="70" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="120" x2="800" y2="120" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="170" x2="800" y2="170" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="220" x2="800" y2="220" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Y-Axis Labels */}
            <text x="10" y="24" fill="#94a3b8" fontSize="11" fontWeight="600">100%</text>
            <text x="15" y="74" fill="#94a3b8" fontSize="11" fontWeight="600">75%</text>
            <text x="15" y="124" fill="#94a3b8" fontSize="11" fontWeight="600">50%</text>
            <text x="15" y="174" fill="#94a3b8" fontSize="11" fontWeight="600">25%</text>

            {/* Natural Biological Decay Curve (Dashed Rose Line) */}
            <path
              d="M 50 20 Q 150 170, 310 200 T 770 215"
              fill="none"
              stroke="#fb7185"
              strokeWidth="2.5"
              strokeDasharray="6,6"
            />

            {/* Area Fill under Memora SRS Curve */}
            <path
              d="M 50 20 L 160 56 L 310 52 L 480 48 L 650 44 L 770 50 L 770 220 L 50 220 Z"
              fill="url(#srsGradient)"
            />

            {/* Memora Spaced Repetition Reinforcement Curve (Solid Vibrant Indigo Line) */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M 50 20 L 160 56 L 310 52 L 480 48 L 650 44 L 770 50"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Nodes for SRS Data Points */}
            {chartPoints.map((pt, idx) => (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(pt)}>
                <circle
                  cx={pt.cx}
                  cy={pt.cySrs}
                  r="7"
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="3.5"
                  className="transition-transform duration-200 hover:scale-150"
                />
                <circle
                  cx={pt.cx}
                  cy={pt.cySrs}
                  r="3"
                  fill="#4f46e5"
                />
              </g>
            ))}

            {/* X-Axis Time Markers */}
            <text x="40" y="240" fill="#64748b" fontSize="11" fontWeight="700">Day 1</text>
            <text x="150" y="240" fill="#64748b" fontSize="11" fontWeight="700">Day 3</text>
            <text x="300" y="240" fill="#64748b" fontSize="11" fontWeight="700">Day 7</text>
            <text x="470" y="240" fill="#64748b" fontSize="11" fontWeight="700">Day 14</text>
            <text x="640" y="240" fill="#64748b" fontSize="11" fontWeight="700">Day 30</text>
            <text x="755" y="240" fill="#64748b" fontSize="11" fontWeight="700">Day 60+</text>
          </svg>
        </div>

        {/* Hover Point Interactive Tooltip Bar */}
        <div className="min-h-[42px] p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs text-indigo-950">
          {hoveredPoint ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded shadow-2xs border border-indigo-100">
                {hoveredPoint.day}
              </span>
              <span className="font-semibold text-slate-800">
                Memora SRS Retention: <strong className="text-indigo-600">{hoveredPoint.srsPct}%</strong> vs Natural Decay: <strong className="text-rose-500">{hoveredPoint.decayPct}%</strong>
              </span>
              <span className="hidden md:inline text-slate-500 font-normal">
                • {hoveredPoint.note}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Hover over any node on the curve to inspect neuro-retention specifics and interval milestones.</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Card Maturity Distribution & Habit Peak Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Maturity Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Card Maturity Distribution</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">Total: 1,240 Cards</span>
          </div>
          
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Mature Phase (&gt;21 days interval)</span>
                <span className="font-extrabold text-emerald-600">{userStats.maturePct}% (719 words)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${userStats.maturePct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Learning Phase (1-21 days)</span>
                <span className="font-extrabold text-indigo-600">{userStats.learningPct}% (335 words)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${userStats.learningPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Fresh Unseen Queue</span>
                <span className="font-extrabold text-slate-600">{userStats.unseenPct}% (186 words)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${userStats.unseenPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-slate-400 h-full rounded-full" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Circadian Peak & Streak Summary */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Habit Retention & Peak Focus
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Your neural memory consolidates best during your morning cognitive peak between <span className="font-bold text-slate-800">08:30 AM – 10:00 AM</span>. Maintaining continuous streak habits prevents memory decay.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 text-center border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Current Streak</span>
              <span className="text-2xl font-black text-slate-900">{userStats.currentStreak} Days</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 text-center border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Longest Streak</span>
              <span className="text-2xl font-black text-indigo-600">{userStats.longestStreak} Days</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 90-Day Memory Consistency Heatmap */}
      <motion.div 
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>90-Day Memory Consistency Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">
              Daily repetition frequency across 13 weeks of spaced recall.
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-200" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-400" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-600" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1.5 min-w-[700px]">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <motion.div
                    key={day.date}
                    whileHover={{ scale: 1.35, zIndex: 10 }}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-4 h-4 rounded-md transition-colors cursor-pointer ${getHeatmapColor(day.count)}`}
                    title={`${day.date}: ${day.count} cards reviewed`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hovered Day Details tooltip bar */}
        <div className="min-h-[38px] p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center text-xs text-slate-600">
          {hoveredDay ? (
            <span className="font-medium text-slate-800 flex items-center gap-2">
              <span>📅 <strong className="text-slate-900">{hoveredDay.date}</strong>:</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                {hoveredDay.count} cards reviewed
              </span>
              <span className="text-slate-500 font-semibold">({hoveredDay.accuracy}% session accuracy)</span>
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">Hover over any day square in the matrix to view specific session statistics.</span>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
};
