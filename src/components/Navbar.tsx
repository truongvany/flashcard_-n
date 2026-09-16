import React from 'react';
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
  User, 
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
    { id: 'dashboard', label: 'Home', icon: <Layers className="w-5 h-5" /> },
    { id: 'decks', label: 'Library', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'review', label: 'Review', icon: <RotateCcw className="w-5 h-5" /> },
    { id: 'practice', label: 'AI', icon: <Bot className="w-5 h-5" /> },
    { id: 'analytics', label: 'Stats', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* TOP HEADER (Sticky for both Mobile & Desktop) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-5">
              <button
                id="nav-brand-logo"
                onClick={() => onNavigate('dashboard')}
                className="group flex items-center gap-2 focus:outline-none"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <span className="relative text-sm font-black tracking-widest text-white">M</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black tracking-tight text-slate-900">Memora</span>
                  <span className="rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-700">
                    AI
                  </span>
                </div>
              </button>

              {/* Desktop Menu */}
              <nav className="hidden items-center gap-1 md:flex ml-6">
                {navItems.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sounds.playFlip();
                        onNavigate(item.id);
                      }}
                      className={`group flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={`${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Actions (Search, Stats, Profile) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onOpenCommandPalette}
                className="flex items-center justify-center h-9 w-9 sm:w-auto sm:px-3 sm:py-2 gap-2 rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                title="Search (⌘K)"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-semibold">Search</span>
              </button>

              <div
                className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-2.5 py-1.5 text-xs font-bold text-amber-600"
                title={`${userStats.currentStreak} day learning streak!`}
              >
                <Flame className="h-4 w-4 fill-amber-400 text-amber-500" />
                <span>{userStats.currentStreak}d</span>
              </div>

              <div
                className="hidden md:flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 text-xs font-bold text-indigo-700"
              >
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>{userStats.currentXp.toLocaleString()} XP</span>
              </div>

              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center justify-center rounded-xl bg-slate-100 p-1 hover:bg-slate-200 transition-colors"
                title="Profile & Settings"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-400 to-violet-400 text-[10px] font-black text-white shadow-sm">
                  SM
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* BOTTOM NAVIGATION (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playFlip();
                  onNavigate(item.id);
                }}
                className="relative flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all"
              >
                {isActive && (
                  <span className="absolute -top-3 w-8 h-1 bg-indigo-600 rounded-b-full"></span>
                )}
                <span className={`mb-1 transition-transform [&>svg]:w-6 [&>svg]:h-6 ${isActive ? 'text-indigo-600 [&>svg]:fill-indigo-100 -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-indigo-700 opacity-100' : 'text-slate-500 opacity-80'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
