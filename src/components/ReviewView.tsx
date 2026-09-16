import React, { useState } from 'react';
import { Card, Deck } from '../types';
import { BookOpen, CheckCircle2, Clock3, RotateCcw, Search, Sparkles } from 'lucide-react';

interface ReviewViewProps {
  decks: Deck[];
  onStartReview: () => void;
}

type ReviewFilter = 'all' | Card['status'];

interface LearnedCard {
  card: Card;
  deck: Deck;
}

const statusLabels: Record<Card['status'], string> = {
  new: 'New',
  learning: 'Learning',
  review: 'Review',
  mastered: 'Mastered',
};

const statusStyles: Record<Card['status'], string> = {
  new: 'bg-slate-100 text-slate-600',
  learning: 'bg-amber-50 text-amber-700',
  review: 'bg-indigo-50 text-indigo-700',
  mastered: 'bg-emerald-50 text-emerald-700',
};

export const ReviewView: React.FC<ReviewViewProps> = ({ decks, onStartReview }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>('all');

  const learnedCards: LearnedCard[] = decks.flatMap(deck =>
    deck.cards
      .filter(card => card.status !== 'new')
      .map(card => ({ card, deck }))
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCards = learnedCards.filter(({ card, deck }) => {
    const matchesFilter = selectedFilter === 'all' || card.status === selectedFilter;
    const matchesSearch = !normalizedQuery || [
      card.word,
      card.definition,
      card.vietnameseMeaning,
      deck.title,
    ].some(value => value.toLowerCase().includes(normalizedQuery));

    return matchesFilter && matchesSearch;
  });

  const statusCounts = learnedCards.reduce<Record<Card['status'], number>>((counts, { card }) => {
    counts[card.status] += 1;
    return counts;
  }, { new: 0, learning: 0, review: 0, mastered: 0 });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="flex flex-col gap-5 border-b border-slate-200/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Retention Library
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Review learned words
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Revisit every word you have already studied and strengthen the connections that matter most.
          </p>
        </div>

        <button
          id="review-start-all-btn"
          onClick={onStartReview}
          disabled={learnedCards.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Start review session</span>
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <BookOpen className="mb-3 h-5 w-5 text-indigo-600" />
          <span className="block text-2xl font-extrabold text-slate-900">{learnedCards.length}</span>
          <span className="text-xs font-medium text-slate-500">Learned words</span>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
          <Clock3 className="mb-3 h-5 w-5 text-amber-600" />
          <span className="block text-2xl font-extrabold text-slate-900">{statusCounts.learning}</span>
          <span className="text-xs font-medium text-slate-500">Still learning</span>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
          <Sparkles className="mb-3 h-5 w-5 text-violet-600" />
          <span className="block text-2xl font-extrabold text-slate-900">{statusCounts.review}</span>
          <span className="text-xs font-medium text-slate-500">In review</span>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-600" />
          <span className="block text-2xl font-extrabold text-slate-900">{statusCounts.mastered}</span>
          <span className="text-xs font-medium text-slate-500">Mastered</span>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Search words, meanings, or decks..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <span className="text-xs font-medium text-slate-500">
            Showing {filteredCards.length} of {learnedCards.length} words
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'learning', 'review', 'mastered'] as ReviewFilter[]).map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                selectedFilter === filter
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {filter === 'all' ? 'All learned' : statusLabels[filter]}
              <span className="ml-1.5 opacity-60">{filter === 'all' ? learnedCards.length : statusCounts[filter]}</span>
            </button>
          ))}
        </div>

        {filteredCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <h2 className="text-sm font-bold text-slate-700">No learned words found</h2>
            <p className="mt-1 text-xs text-slate-500">
              Try another search or choose a different status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)_120px_100px] gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:grid">
              <span>Word</span>
              <span>Deck</span>
              <span>Status</span>
              <span>Interval</span>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredCards.map(({ card, deck }) => (
                <div key={`${deck.id}-${card.id}`} className="grid gap-3 px-4 py-4 transition-colors hover:bg-indigo-50/30 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)_120px_100px] sm:items-center sm:gap-4 sm:px-5">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h3 className="truncate text-sm font-bold text-slate-900">{card.word}</h3>
                      <span className="shrink-0 font-mono text-[11px] text-slate-400">{card.phonetic}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-500">{card.vietnameseMeaning}</p>
                  </div>
                  <div className="min-w-0 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">{deck.title}</span>
                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{deck.level}</span>
                  </div>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[card.status]}`}>
                    {statusLabels[card.status]}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {card.intervalDays} {card.intervalDays === 1 ? 'day' : 'days'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
