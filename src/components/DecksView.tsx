import React, { useState } from 'react';
import { Deck } from '../types';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Tag, 
  Filter, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface DecksViewProps {
  decks: Deck[];
  onStartStudy: (deck: Deck) => void;
  onOpenNewDeck: () => void;
  onOpenAiDeckMaker: () => void;
  onDeleteDeck: (deckId: string) => void;
}

export const DecksView: React.FC<DecksViewProps> = ({
  decks,
  onStartStudy,
  onOpenNewDeck,
  onOpenAiDeckMaker,
  onDeleteDeck,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'IELTS', 'Oxford 3000', 'Business', 'Daily', 'GRE / Roots', 'Custom'];

  const filteredDecks = decks.filter(deck => {
    const matchesSearch = 
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || deck.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalWords = decks.reduce((acc, d) => acc + d.cardCount, 0);
  const avgMastery = decks.length > 0 
    ? Math.round(decks.reduce((acc, d) => acc + d.masteryRate, 0) / decks.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Curated Spaced Repetition
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Decks & Library
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Active Lexicon</span>
            <span className="text-xl font-extrabold text-slate-900">{totalWords.toLocaleString()} Words</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Average Recall</span>
            <span className="text-xl font-extrabold text-emerald-600">{avgMastery}%</span>
          </div>
          <button
            id="decks-create-new-btn"
            onClick={onOpenNewDeck}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Deck</span>
          </button>
        </div>
      </div>

      {/* AI Instant Deck Maker Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              Generate Custom Decks with AI
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Paste an article, enter any specific niche (e.g. Legal Contracts, Medicine, Japanese Travel), and Memora will synthesize smart spaced flashcards with phonetic IPA, definitions, and native collocations.
            </p>
          </div>
        </div>

        <button
          id="decks-open-ai-generator-btn"
          onClick={onOpenAiDeckMaker}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          Try Instant Deck Maker
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, morpheme, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Result Count Indicator */}
          <span className="text-xs text-slate-500 self-center">
            Showing {filteredDecks.length} {filteredDecks.length === 1 ? 'deck' : 'decks'}
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Decks Grid */}
      {filteredDecks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No decks matched your filter.</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for another topic or create a new deck.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDecks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {deck.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                      {deck.level}
                    </span>
                    {deck.category === 'Custom' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete deck "${deck.title}"?`)) {
                            onDeleteDeck(deck.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete custom deck"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                  {deck.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {deck.description}
                </p>

                {/* Sample Card Words Tags */}
                {deck.cards && deck.cards.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {deck.cards.slice(0, 3).map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-50 text-[11px] font-mono text-slate-600 border border-slate-100">
                        {c.word}
                      </span>
                    ))}
                    {deck.cards.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                        +{deck.cards.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                {/* Due badge & Mastery */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Retention Mastery</span>
                  <span className="font-bold text-slate-800">{deck.masteryRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${deck.masteryRate}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-semibold text-amber-600">
                    {deck.dueCount} cards due
                  </span>
                  <button
                    id={`deck-card-start-${deck.id}`}
                    onClick={() => {
                      sounds.playFlip();
                      onStartStudy(deck);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Study Deck</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
