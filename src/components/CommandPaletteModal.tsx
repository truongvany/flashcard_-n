import React, { useState, useEffect } from 'react';
import { Deck, Card, ViewMode } from '../types';
import { Search, BookOpen, Layers, Bot, BarChart3, User, ArrowRight, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: Deck[];
  onSelectDeck: (deck: Deck) => void;
  onNavigate: (view: ViewMode) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  decks,
  onSelectDeck,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search through all cards across all decks
  const allCardsWithDeck: { card: Card; deck: Deck }[] = [];
  decks.forEach(d => {
    d.cards.forEach(c => {
      allCardsWithDeck.push({ card: c, deck: d });
    });
  });

  const matchingCards = query.trim()
    ? allCardsWithDeck.filter(item => 
        item.card.word.toLowerCase().includes(query.toLowerCase()) ||
        item.card.definition.toLowerCase().includes(query.toLowerCase()) ||
        item.card.vietnameseMeaning.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchingDecks = query.trim()
    ? decks.filter(d => 
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const navigationActions = [
    { label: 'Go to Dashboard', view: 'dashboard' as ViewMode, icon: <Layers className="w-4 h-4" /> },
    { label: 'Open Study Session', view: 'study' as ViewMode, icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Browse Decks & Library', view: 'decks' as ViewMode, icon: <Layers className="w-4 h-4" /> },
    { label: 'AI Context Practice', view: 'practice' as ViewMode, icon: <Bot className="w-4 h-4" /> },
    { label: 'Retention Analytics', view: 'analytics' as ViewMode, icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Profile & SRS Settings', view: 'profile' as ViewMode, icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words, decks, or commands..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          
          {/* Matching Vocabulary */}
          {matchingCards.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                Vocabulary
              </span>
              {matchingCards.map(({ card, deck }) => (
                <button
                  key={card.id}
                  onClick={() => {
                    sounds.playFlip();
                    onSelectDeck(deck);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-baseline space-x-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600">
                      {card.word}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {card.phonetic}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">
                      • {card.vietnameseMeaning}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {deck.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Matching Decks */}
          {matchingDecks.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                Decks
              </span>
              {matchingDecks.map(deck => (
                <button
                  key={deck.id}
                  onClick={() => {
                    sounds.playFlip();
                    onSelectDeck(deck);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-left transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600">
                      {deck.title}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({deck.cardCount} cards)
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Navigation Commands */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
              Navigation
            </span>
            {navigationActions.map(action => (
              <button
                key={action.view}
                onClick={() => {
                  sounds.playFlip();
                  onNavigate(action.view);
                  onClose();
                }}
                className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-slate-100 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <span className="text-slate-400">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with <b>↑</b> <b>↓</b>, select with <b>Enter</b></span>
          <span>Press <b>ESC</b> to dismiss</span>
        </div>
      </div>
    </div>
  );
};
