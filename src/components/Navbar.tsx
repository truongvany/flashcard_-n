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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-6">
            <button 
              id="nav-brand-logo"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="font-bold text-lg tracking-wider">M</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xl text-slate-900 tracking-tight">Memora</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 rounded-md border border-violet-200/60">
                  AI
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
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
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Quick Command Search Button */}
            <button
              id="nav-search-trigger"
              onClick={onOpenCommandPalette}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-xs font-medium text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              title="Search vocabulary, decks & actions (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search library...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Streak Badge */}
            <div 
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold shadow-2xs"
              title={`${userStats.currentStreak} day learning streak!`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{userStats.currentStreak}d</span>
            </div>

            {/* XP Badge */}
            <div 
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-medium"
              title="Current Level Experience"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{userStats.currentXp.toLocaleString()} XP</span>
            </div>

            {/* Sound Toggle */}
            <button
              id="nav-sound-toggle"
              onClick={onToggleSound}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Quick Add Deck CTA */}
            <button
              id="nav-new-deck-cta"
              onClick={onOpenNewDeck}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Deck</span>
            </button>

            {/* User Profile Avatar */}
            <button
              id="nav-profile-avatar"
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
              title="Sarah Miller - Profile & Settings"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-200 shadow-2xs">
                SM
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sub-Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-100 bg-white">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playFlip();
                onNavigate(item.id);
              }}
              className={`flex flex-col items-center py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="mb-0.5">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
