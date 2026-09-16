import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewMode, UserStats } from '../types';
import { 
  Sparkles, 
  Flame, 
  Search, 
  Layers, 
  BookOpen, 
  RotateCcw,
  BarChart3, 
  Bot,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  userStats: UserStats;
  onOpenCommandPalette: () => void;
  onOpenNewDeck: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const navItems: { id: ViewMode; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Home',    Icon: ({ className }) => <Layers    className={className} /> },
  { id: 'decks',     label: 'Library', Icon: ({ className }) => <BookOpen  className={className} /> },
  { id: 'review',    label: 'Review',  Icon: ({ className }) => <RotateCcw className={className} /> },
  { id: 'practice',  label: 'AI',      Icon: ({ className }) => <Bot       className={className} /> },
  { id: 'analytics', label: 'Stats',   Icon: ({ className }) => <BarChart3 className={className} /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  userStats,
  onOpenCommandPalette,
}) => {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          TOP HEADER — Fixed on mobile, sticky on desktop
          Liquid Glass: multi-layer white/blur with border shimmer
      ═══════════════════════════════════════════════════════════════ */}
      <header
        className="fixed top-0 inset-x-0 z-50 md:sticky"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(248,250,252,0.72) 50%, rgba(238,242,255,0.70) 100%)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          borderBottom: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 1px 0 rgba(99,102,241,0.06), 0 4px 24px rgba(99,102,241,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {/* Subtle inner shimmer layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.6) 0%, transparent 100%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">

            {/* Brand */}
            <button
              id="nav-brand-logo"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 shrink-0 focus:outline-none"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
              >
                <span className="text-sm font-black text-white tracking-wide">M</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[18px] font-black tracking-tight text-slate-900">Memora</span>
                <span
                  className="rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08))',
                    border: '1px solid rgba(139,92,246,0.25)',
                    color: '#7c3aed',
                  }}
                >
                  AI
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              {navItems.map(({ id, label, Icon }) => {
                const active = currentView === id;
                return (
                  <button
                    key={id}
                    onClick={() => { sounds.playFlip(); onNavigate(id); }}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    style={active ? {
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(238,242,255,0.8) 100%)',
                      border: '1px solid rgba(99,102,241,0.18)',
                      boxShadow: '0 2px 8px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
                    } : undefined}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {label}
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={onOpenCommandPalette}
                className="flex items-center justify-center h-9 w-9 rounded-xl transition-colors"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.80), rgba(248,250,252,0.60))',
                  border: '1px solid rgba(226,232,240,0.80)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
                title="Search (⌘K)"
              >
                <Search className="h-4 w-4 text-slate-500" />
              </button>

              {/* Streak pill */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(254,243,199,0.70))',
                  border: '1px solid rgba(251,191,36,0.30)',
                  boxShadow: '0 2px 8px rgba(251,191,36,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                  color: '#b45309',
                }}
              >
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                {userStats.currentStreak}d
              </div>

              {/* XP pill — desktop */}
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(238,242,255,0.70))',
                  border: '1px solid rgba(99,102,241,0.22)',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
                  color: '#4338ca',
                }}
              >
                <Sparkles className="h-4 w-4 text-indigo-500" />
                {userStats.currentXp.toLocaleString()} XP
              </div>

              {/* Avatar */}
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center justify-center"
                title="Profile"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-black text-white"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 3px 10px rgba(99,102,241,0.30), inset 0 1px 0 rgba(255,255,255,0.20)',
                  }}
                >
                  {userStats.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content doesn't hide under fixed top header on mobile */}
      <div className="h-16 md:hidden" />

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM NAV — Mobile only, fixed with liquid glass
      ═══════════════════════════════════════════════════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          borderTop: '1px solid rgba(255,255,255,0.65)',
          boxShadow: '0 -1px 0 rgba(99,102,241,0.06), 0 -8px 32px rgba(99,102,241,0.06), inset 0 -1px 0 rgba(226,232,240,0.4)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
        }}
      >
        {/* Inner shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 60%)',
          }}
        />

        <div className="relative flex items-stretch justify-around px-2 pt-2 pb-1">
          {navItems.map(({ id, label, Icon }) => {
            const active = currentView === id;
            return (
              <button
                key={id}
                onClick={() => { sounds.playFlip(); onNavigate(id); }}
                className="relative flex flex-col items-center justify-center flex-1 gap-1 py-1.5 rounded-2xl transition-all active:scale-90"
              >
                {/* Glass pill for active item */}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="bottom-pill"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(238,242,255,0.95) 0%, rgba(255,255,255,0.80) 100%)',
                        border: '1px solid rgba(99,102,241,0.18)',
                        boxShadow: '0 2px 8px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
                      }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </AnimatePresence>

                <span className="relative z-10">
                  <Icon className={`w-[22px] h-[22px] transition-all duration-200 ${active ? 'text-indigo-600 scale-110' : 'text-slate-400'}`} />
                </span>

                <span className={`relative z-10 text-[10px] font-bold leading-none tracking-wide transition-colors duration-200 ${
                  active ? 'text-indigo-700' : 'text-slate-400'
                }`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
