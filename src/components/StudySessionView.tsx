import React, { useState, useEffect, useCallback } from 'react';
import { Card, Deck, SrsRating } from '../types';
import { 
  Volume2, 
  RotateCw, 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Keyboard, 
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { sounds, speakWord } from '../utils/audio';

interface StudySessionViewProps {
  deck: Deck;
  onEndSession: () => void;
  onCardReviewed: (cardId: string, rating: SrsRating) => void;
  onDeckCompleted: (deckId: string, cardsReviewedCount: number) => void;
}

export const StudySessionView: React.FC<StudySessionViewProps> = ({
  deck,
  onEndSession,
  onCardReviewed,
  onDeckCompleted,
}) => {
  const [cards, setCards] = useState<Card[]>(deck.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedHistory, setReviewedHistory] = useState<{ cardId: string; rating: SrsRating }[]>([]);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const currentCard = cards[currentIndex];
  const progressPercent = cards.length > 0 ? Math.round((currentIndex / cards.length) * 100) : 0;

  // Handle Card Flip
  const handleFlip = useCallback(() => {
    sounds.playFlip();
    setIsFlipped(prev => !prev);
  }, []);

  // Handle Speech Pronunciation
  const handlePronounce = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentCard) {
      speakWord(currentCard.word);
    }
  }, [currentCard]);

  // Handle SRS Rating
  const handleRate = useCallback((rating: SrsRating) => {
    if (!currentCard) return;

    sounds.playRating(rating);
    onCardReviewed(currentCard.id, rating);

    const newHistory = [...reviewedHistory, { cardId: currentCard.id, rating }];
    setReviewedHistory(newHistory);

    // Reset flip state and move to next card
    setIsFlipped(false);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      sounds.playRating('easy');
      onDeckCompleted(deck.id, cards.length);
    }
  }, [currentCard, currentIndex, cards.length, reviewedHistory, onCardReviewed, onDeckCompleted, deck.id]);

  // Keyboard Shortcuts (Space to flip, 1-4 for SRS ratings)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handlePronounce();
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleRate('again');
        } else if (e.key === '2') {
          e.preventDefault();
          handleRate('hard');
        } else if (e.key === '3') {
          e.preventDefault();
          handleRate('good');
        } else if (e.key === '4') {
          e.preventDefault();
          handleRate('easy');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, handleFlip, handlePronounce, handleRate]);

  // Toggle Bookmark
  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    setCards(prev => prev.map(c => c.id === currentCard.id ? { ...c, isBookmarked: !c.isBookmarked } : c));
  };

  if (sessionCompleted) {
    const goodEasyCount = reviewedHistory.filter(h => h.rating === 'good' || h.rating === 'easy').length;
    const accuracy = reviewedHistory.length > 0 ? Math.round((goodEasyCount / reviewedHistory.length) * 100) : 100;
    const xpEarned = cards.length * 15;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/20">
            <Award className="w-9 h-9" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-wider">
            Session Completed
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4 mb-2">
            Fantastic Retention Run!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
            You’ve successfully reinforced <span className="font-semibold text-slate-800">{cards.length} cards</span> from <span className="font-semibold text-slate-800">{deck.title}</span>. Your neural retention curve has been boosted.
          </p>

          {/* Session Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Accuracy</span>
              <span className="text-2xl font-bold text-emerald-600">{accuracy}%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">XP Earned</span>
              <span className="text-2xl font-bold text-indigo-600">+{xpEarned}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Retention Interval</span>
              <span className="text-2xl font-bold text-violet-600">+4.2d</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="session-finish-restart-btn"
              onClick={() => {
                setCurrentIndex(0);
                setIsFlipped(false);
                setSessionCompleted(false);
                setReviewedHistory([]);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              Review Deck Again
            </button>
            <button
              id="session-finish-dashboard-btn"
              onClick={onEndSession}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <p className="text-slate-500 mb-4">No cards available in this deck.</p>
        <button onClick={onEndSession} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
          Return
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      
      {/* Session Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="study-exit-session-btn"
          onClick={onEndSession}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Session</span>
        </button>

        {/* Deck Title & CEFR */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {deck.title}
            </span>
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {deck.level}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Card {currentIndex + 1} of {cards.length} ({progressPercent}%)
          </span>
        </div>

        {/* Keyboard shortcut hint */}
        <button
          id="study-shortcuts-btn"
          onClick={() => setShowShortcutsModal(true)}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Keyboard shortcuts guide"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shortcuts</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Flashcard Container */}
      <div className="perspective-1200 w-full mb-8">
        <div
          id="study-flashcard-stage"
          onClick={handleFlip}
          className={`relative w-full min-h-[380px] sm:min-h-[420px] rounded-3xl cursor-pointer transition-transform duration-500 transform-style-3d select-none shadow-xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          
          {/* ================= CARD FRONT ================= */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 flex flex-col justify-between backface-hidden shadow-xs hover:border-indigo-300/80 transition-colors">
            
            {/* Front Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {currentCard.partOfSpeech}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                  CEFR {deck.level}
                </span>
                {currentCard.rootOrigin && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/50">
                    Etymology
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  id="card-front-pronounce-btn"
                  onClick={handlePronounce}
                  className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  title="Listen to pronunciation (P)"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  id="card-front-bookmark-btn"
                  onClick={toggleBookmark}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    currentCard.isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Bookmark card"
                >
                  <Star className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Front Center (Word + Phonetic) */}
            <div className="text-center py-6">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight font-sans mb-3">
                {currentCard.word}
              </h1>
              <p className="text-base sm:text-lg font-mono text-slate-500">
                {currentCard.phonetic}
              </p>
              {currentCard.usageContext && (
                <span className="inline-block mt-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {currentCard.usageContext}
                </span>
              )}
            </div>

            {/* Front Footer Hint */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Tap card or press <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold border border-slate-200">Space</kbd> to reveal</span>
              </span>
              <span className="text-[11px] text-indigo-600 font-medium hidden sm:inline">
                Spaced Repetition Active
              </span>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-3xl border border-indigo-200/80 p-6 sm:p-10 flex flex-col justify-between backface-hidden rotate-y-180 shadow-md">
            
            {/* Back Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  {currentCard.word}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentCard.phonetic}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  id="card-back-pronounce-btn"
                  onClick={handlePronounce}
                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  title="Pronounce again"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Back Center Body */}
            <div className="space-y-4 py-2 overflow-y-auto max-h-[260px] pr-1">
              
              {/* Definition */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Definition
                </span>
                <p className="text-base text-slate-800 font-medium leading-relaxed">
                  {currentCard.definition}
                </p>
              </div>

              {/* Vietnamese Translation */}
              {currentCard.vietnameseMeaning && (
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-0.5">
                    Nghĩa Tiếng Việt
                  </span>
                  <p className="text-sm font-semibold text-indigo-950">
                    {currentCard.vietnameseMeaning}
                  </p>
                </div>
              )}

              {/* Example Sentence */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Contextual Usage
                </span>
                <blockquote className="text-sm sm:text-base text-slate-700 italic border-l-2 border-indigo-400 pl-3 py-0.5">
                  {currentCard.exampleSentence}
                </blockquote>
              </div>

              {/* Root & Etymology */}
              {currentCard.rootOrigin && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-500">Root Origin: </span>
                  <span className="font-mono text-indigo-700 bg-slate-100 px-1.5 py-0.5 rounded">
                    {currentCard.rootOrigin}
                  </span>
                </div>
              )}

              {/* Synonyms & Collocations */}
              {currentCard.synonyms && currentCard.synonyms.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Synonyms:
                  </span>
                  {currentCard.synonyms.map((syn, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Back Footer Hint */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Select your recall interval below</span>
              <span className="hidden sm:inline">Keys 1 - 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SRS RATING ACTION BAR ================= */}
      {isFlipped ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 animate-fadeIn">
          {/* AGAIN */}
          <button
            id="srs-btn-again"
            onClick={() => handleRate('again')}
            className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 transition-all cursor-pointer group shadow-2xs hover:shadow"
          >
            <div className="flex items-center space-x-1 mb-0.5">
              <kbd className="text-[10px] font-bold px-1.5 py-0.2 bg-white rounded border border-rose-300 text-rose-700 shadow-2xs">
                1
              </kbd>
              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
                Again
              </span>
            </div>
            <span className="text-[11px] text-rose-600/90 font-medium">
              &lt; 1 min
            </span>
            <span className="text-[10px] text-rose-500/80 hidden sm:inline">
              Reset memory
            </span>
          </button>

          {/* HARD */}
          <button
            id="srs-btn-hard"
            onClick={() => handleRate('hard')}
            className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-all cursor-pointer group shadow-2xs hover:shadow"
          >
            <div className="flex items-center space-x-1 mb-0.5">
              <kbd className="text-[10px] font-bold px-1.5 py-0.2 bg-white rounded border border-amber-300 text-amber-800 shadow-2xs">
                2
              </kbd>
              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
                Hard
              </span>
            </div>
            <span className="text-[11px] text-amber-700/90 font-medium">
              12 hours
            </span>
            <span className="text-[10px] text-amber-600/80 hidden sm:inline">
              Low ease
            </span>
          </button>

          {/* GOOD */}
          <button
            id="srs-btn-good"
            onClick={() => handleRate('good')}
            className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 transition-all cursor-pointer group shadow-2xs hover:shadow"
          >
            <div className="flex items-center space-x-1 mb-0.5">
              <kbd className="text-[10px] font-bold px-1.5 py-0.2 bg-white rounded border border-emerald-300 text-emerald-800 shadow-2xs">
                3
              </kbd>
              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
                Good
              </span>
            </div>
            <span className="text-[11px] text-emerald-700/90 font-medium">
              1 day
            </span>
            <span className="text-[10px] text-emerald-600/80 hidden sm:inline">
              Target interval
            </span>
          </button>

          {/* EASY */}
          <button
            id="srs-btn-easy"
            onClick={() => handleRate('easy')}
            className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/80 transition-all cursor-pointer group shadow-2xs hover:shadow"
          >
            <div className="flex items-center space-x-1 mb-0.5">
              <kbd className="text-[10px] font-bold px-1.5 py-0.2 bg-white rounded border border-sky-300 text-sky-800 shadow-2xs">
                4
              </kbd>
              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
                Easy
              </span>
            </div>
            <span className="text-[11px] text-sky-700/90 font-medium">
              4 days
            </span>
            <span className="text-[10px] text-sky-600/80 hidden sm:inline">
              Mastery leap
            </span>
          </button>
        </div>
      ) : (
        /* Front prompt button */
        <div className="text-center">
          <button
            id="study-show-answer-cta"
            onClick={handleFlip}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all cursor-pointer inline-flex items-center justify-center space-x-2"
          >
            <span>Show Answer</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-slate-700 rounded text-slate-300 font-mono">
              Space
            </kbd>
          </button>
        </div>
      )}

      {/* Shortcuts Guide Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center space-x-2">
              <Keyboard className="w-5 h-5 text-indigo-600" />
              <span>Study Keyboard Shortcuts</span>
            </h3>
            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Flip Card (Front / Back)</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold">Space</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Pronounce Word</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold">P</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Rate: Again</span>
                <kbd className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-xs font-bold">1</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Rate: Hard</span>
                <kbd className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-bold">2</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Rate: Good</span>
                <kbd className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">3</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Rate: Easy</span>
                <kbd className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-xs font-bold">4</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcutsModal(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
