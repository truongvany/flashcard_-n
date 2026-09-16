import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserStats } from '../types';
import { 
  Flame, 
  Sparkles, 
  Settings, 
  Download,
  CheckCircle2,
  Brain,
  Volume2,
  Headphones,
  SlidersHorizontal,
  ChevronRight,
  Medal,
  Target,
  Zap,
  Globe2,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface ProfileViewProps {
  userStats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onExportData: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 350, damping: 25 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

// ── Switch Toggle Component ───────────────────────────────────────────────────
const Switch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-indigo-600' : 'bg-slate-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const ProfileView: React.FC<ProfileViewProps> = ({
  userStats,
  onUpdateStats,
  onExportData,
}) => {
  const [retentionRate, setRetentionRate] = useState(userStats.desiredRetention);
  const [maxNewCards, setMaxNewCards] = useState(userStats.maxNewCardsPerDay);
  const [soundEnabled, setSoundEnabled] = useState(userStats.soundEffects);
  const [autoplayAudio, setAutoplayAudio] = useState(userStats.autoplayAudio);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveSettings = () => {
    onUpdateStats({
      desiredRetention: retentionRate,
      maxNewCardsPerDay: maxNewCards,
      soundEffects: soundEnabled,
      autoplayAudio: autoplayAudio,
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const badges = [
    { id: 'streak14', title: 'Ignition', desc: '14-day recall streak', icon: <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />, color: 'from-orange-500 to-amber-500', earned: true },
    { id: 'titan', title: 'Lexicon Titan', desc: 'Encoded 1,000+ words', icon: <Medal className="w-6 h-6 text-indigo-100" />, color: 'from-indigo-500 to-violet-500', earned: true },
    { id: 'speed', title: 'Neural Speed', desc: 'Sub-4s pacing', icon: <Zap className="w-6 h-6 text-yellow-100 fill-yellow-200" />, color: 'from-yellow-400 to-amber-500', earned: true },
    { id: 'polyglot', title: 'Master Class', desc: 'Level 10 reached', icon: <Lock className="w-5 h-5 text-slate-400" />, color: 'from-slate-200 to-slate-300', earned: false },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-lg mx-auto px-4 pt-4 pb-12 space-y-6"
    >
      {/* ── 1. Hero Profile Card (Promax Style) ─────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-[32px] p-6 text-white shadow-2xl shadow-indigo-900/20"
        style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 20px 40px -10px rgba(30,27,75,0.4)',
        }}
      >
        {/* Glow effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/30 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-violet-600/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar with animated gradient ring */}
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin-slow blur-sm opacity-70" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" style={{ padding: '2px' }}>
              <div className="w-full h-full bg-[#1e1b4b] rounded-[22px]" />
            </div>
            <div className="relative w-20 h-20 flex items-center justify-center rounded-[22px] bg-gradient-to-br from-indigo-600 to-violet-700 text-2xl font-black shadow-inner">
              {userStats.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            
            {/* PRO Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-[9px] font-black tracking-widest text-white shadow-lg border border-white/20 whitespace-nowrap uppercase">
              Pro Member
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight mb-1">{userStats.name}</h1>
          <p className="text-indigo-200 text-xs font-medium bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            @{userStats.handle} • {userStats.levelTitle}
          </p>

          {/* Quick Stats Row */}
          <div className="flex items-center gap-6 mt-6 pt-5 border-t border-white/10 w-full justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span className="text-lg font-black">{userStats.currentStreak}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day Streak</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-lg font-black">{userStats.currentXp >= 1000 ? (userStats.currentXp/1000).toFixed(1) + 'k' : userStats.currentXp}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-black">Top 5%</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Rank</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Badges Showcase ───────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" /> Achievements
          </h2>
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            3 Unlocked
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {badges.map(b => (
            <div 
              key={b.id} 
              className={`relative overflow-hidden rounded-2xl p-4 border transition-all ${
                b.earned 
                  ? 'bg-white border-slate-200/70 shadow-sm' 
                  : 'bg-slate-50 border-dashed border-slate-200 opacity-60 grayscale'
              }`}
            >
              {b.earned && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-slate-100 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center shadow-sm mb-3`}>
                {b.icon}
              </div>
              <h3 className="text-[13px] font-bold text-slate-900 leading-tight mb-1">{b.title}</h3>
              <p className="text-[10px] text-slate-500 leading-snug">{b.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 3. Engine Settings (Glassmorphism Cards) ────────────────────── */}
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" /> Learning Engine
          </h2>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden">
          
          {/* Target Retention Slider */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-500" />
                <span className="text-[13px] font-bold text-slate-900">Target Retention</span>
              </div>
              <span className="text-[12px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {retentionRate}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Higher retention means more frequent reviews.</p>
            <input
              type="range"
              min="80" max="95" step="1"
              value={retentionRate}
              onChange={(e) => setRetentionRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2">
              <span>80% (Fast)</span>
              <span>95% (Perfect)</span>
            </div>
          </div>

          {/* New Cards Limit */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-[13px] font-bold text-slate-900">New Cards / Day</span>
              </div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[10, 20, 30, 50].map(val => (
                <button
                  key={val}
                  onClick={() => setMaxNewCards(val)}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                    maxNewCards === val 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Toggles */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Volume2 className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-900">Sound Effects</p>
                  <p className="text-[10px] text-slate-400">UI feedback sounds</p>
                </div>
              </div>
              <Switch checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-900">Autoplay Audio</p>
                  <p className="text-[10px] text-slate-400">Read words out loud</p>
                </div>
              </div>
              <Switch checked={autoplayAudio} onChange={() => setAutoplayAudio(!autoplayAudio)} />
            </div>
          </div>

        </div>
      </motion.div>

      {/* ── 4. Actions (Save / Export) ────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="pt-2 pb-6 space-y-3">
        <AnimatePresence>
          {showSavedToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-center gap-2 text-[12px] font-bold text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-100"
            >
              <CheckCircle2 className="w-4 h-4" /> Preferences Saved
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleSaveSettings}
          className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 active:bg-indigo-700 transition-colors"
        >
          <Settings className="w-4 h-4" /> Save Engine Settings
        </button>

        <button
          onClick={onExportData}
          className="w-full py-3.5 rounded-2xl bg-white border border-slate-200/70 text-slate-700 font-bold text-[13px] flex items-center justify-center gap-2 active:bg-slate-50 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-400" /> Export Backup Data
        </button>
      </motion.div>

    </motion.div>
  );
};
