import React from 'react';
import { ViewMode, UserStats } from '../types';
import { 
  Sparkles, 
  Flame, 
  Search, 
  Layers, 
  BookOpen, 
  BarChart3, 
  Bot, 
  User, 
  Bell, 
  Plus, 
  Volume2, 
  VolumeX 
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

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  userStats,
  onOpenCommandPalette,
  onOpenNewDeck,
  soundEnabled,
  onToggleSound,
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'study', label: 'Study Session', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'decks', label: 'Decks & Library', icon: <Layers className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'practice', label: 'AI Practice', icon: <Bot className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.4),rgba(255,255,255,0.18),rgba(255,255,255,0.08))] backdrop-blur-2xl shadow-[0_8px_30px_rgba(148,163,184,0.18)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <button
              id="nav-brand-logo"
              onClick={() => onNavigate('dashboard')}
              className="group flex items-center gap-3 focus:outline-none"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(168,85,247,0.35),rgba(59,130,246,0.2))] shadow-[0_10px_25px_rgba(168,85,247,0.22)] transition-transform duration-200 group-hover:scale-105">
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_40%)]" />
                <span className="relative text-lg font-black tracking-[0.22em] text-slate-900">M</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-[-0.04em] text-slate-900">Memora</span>
                <span className="rounded-full border border-violet-300/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(216,180,254,0.5))] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700 shadow-[0_4px_12px_rgba(168,85,247,0.15)]">
                  AI
                </span>
              </div>
            </button>

            <nav className="hidden items-center gap-1.5 md:flex">
              {navItems.map((item) => {
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => {
                      sounds.playFlip();
                      onNavigate(item.id);
                    }}
                    className={`group flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.6),rgba(255,255,255,0.25))] text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_25px_rgba(148,163,184,0.18)]'
                        : 'border-transparent bg-transparent text-slate-600 hover:border-white/40 hover:bg-white/25 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`rounded-md p-1.5 transition-colors ${
                        isActive ? 'bg-white/65 text-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]' : 'bg-white/35 text-slate-500 group-hover:text-slate-700'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="nav-search-trigger"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 rounded-xl border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.2))] px-3 py-2 text-xs font-medium text-slate-700 transition-all hover:border-violet-300/80 hover:bg-white/40 hover:text-slate-900"
              title="Search vocabulary, decks & actions (⌘K)"
            >
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-white/60 bg-white/50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 sm:inline-block">
                ⌘K
              </kbd>
            </button>

            <div
              className="flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(254,243,199,0.7))] px-2.5 py-1.5 text-xs font-semibold text-amber-800 shadow-[0_5px_12px_rgba(251,191,36,0.18)]"
              title={`${userStats.currentStreak} day learning streak!`}
            >
              <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              <span>{userStats.currentStreak}d</span>
            </div>

            <div
              className="hidden items-center gap-1.5 rounded-full border border-violet-300/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(233,213,255,0.7))] px-2.5 py-1.5 text-xs font-medium text-violet-800 lg:flex"
              title="Current Level Experience"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span>{userStats.currentXp.toLocaleString()} XP</span>
            </div>

            <button
              id="nav-sound-toggle"
              onClick={onToggleSound}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.2))] text-slate-700 transition-all hover:border-violet-300/80 hover:bg-white/45 hover:text-slate-900"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-violet-700" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
            </button>

            <button
              id="nav-new-deck-cta"
              onClick={onOpenNewDeck}
              className="hidden items-center gap-2 rounded-xl bg-[linear-gradient(135deg,rgba(139,92,246,0.9),rgba(59,130,246,0.8))] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(129,140,248,0.35)] transition-all hover:brightness-110 sm:flex"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Deck</span>
            </button>

            <button
              id="nav-profile-avatar"
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 rounded-xl border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.2))] p-1.5 transition-all hover:border-violet-300/80 hover:bg-white/40"
              title="Sarah Miller - Profile & Settings"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a78bfa,#6366f1,#22d3ee)] text-xs font-black text-white shadow-[0_0_18px_rgba(99,102,241,0.25)]">
                SM
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),rgba(255,255,255,0.12))] md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-around gap-1 px-2 py-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playFlip();
                  onNavigate(item.id);
                }}
                className={`flex flex-col items-center rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'bg-white/50 text-violet-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="mb-0.5">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
