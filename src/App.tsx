import React, { useState, useEffect } from 'react';
import { ViewMode, Deck, UserStats, SrsRating, DayActivity, AiPracticeWord } from './types';
import { 
  INITIAL_DECKS, 
  INITIAL_USER_STATS, 
  INITIAL_AI_PRACTICE_WORDS, 
  generateActivityHistory 
} from './data/mockData';
import { sounds } from './utils/audio';

import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StudySessionView } from './components/StudySessionView';
import { ReviewView } from './components/ReviewView';
import { DecksView } from './components/DecksView';
import { AiPracticeView } from './components/AiPracticeView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';

import { CommandPaletteModal } from './components/CommandPaletteModal';
import { NewDeckModal } from './components/NewDeckModal';
import { AiDeckMakerModal } from './components/AiDeckMakerModal';

export default function App() {
  // Local storage loaded state with fallbacks
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [decks, setDecks] = useState<Deck[]>(() => {
    const saved = localStorage.getItem('memora_decks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DECKS;
      }
    }
    return INITIAL_DECKS;
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('memora_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_STATS;
      }
    }
    return INITIAL_USER_STATS;
  });

  const [activeStudyDeck, setActiveStudyDeck] = useState<Deck>(decks[0] || INITIAL_DECKS[0]);
  const [studyReturnView, setStudyReturnView] = useState<ViewMode>('dashboard');
  const [activityHistory, setActivityHistory] = useState<DayActivity[]>(() => generateActivityHistory());
  const [practiceWords, setPracticeWords] = useState<AiPracticeWord[]>(INITIAL_AI_PRACTICE_WORDS);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewDeckOpen, setIsNewDeckOpen] = useState(false);
  const [isAiDeckMakerOpen, setIsAiDeckMakerOpen] = useState(false);

  // Sync sound settings
  useEffect(() => {
    sounds.enabled = userStats.soundEffects;
  }, [userStats.soundEffects]);

  // Persist decks
  useEffect(() => {
    localStorage.setItem('memora_decks', JSON.stringify(decks));
  }, [decks]);

  // Persist userStats
  useEffect(() => {
    localStorage.setItem('memora_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Global keyboard shortcuts (⌘K or Ctrl+K for search)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Handler: Start studying a specific deck
  const handleStartStudy = (deck: Deck) => {
    sounds.playProgress();
    setActiveStudyDeck(deck);
    setStudyReturnView('dashboard');
    setCurrentView('study');
  };

  const learnedCards = decks.flatMap(deck =>
    deck.cards.filter(card => card.status !== 'new').map(card => ({ card, deck }))
  );

  const handleStartReview = () => {
    if (learnedCards.length === 0) return;

    setActiveStudyDeck({
      id: 'learned-words-review',
      title: 'Learned Words Review',
      category: 'Custom',
      level: 'C1',
      description: 'Review all vocabulary you have already studied.',
      cardCount: learnedCards.length,
      dueCount: learnedCards.length,
      masteryRate: 0,
      lastReviewed: 'Just now',
      colorScheme: 'indigo',
      tags: ['Review', 'Learned words'],
      cards: learnedCards.map(({ card }) => card),
    });
    sounds.playProgress();
    setStudyReturnView('review');
    setCurrentView('study');
  };

  // Handler: Spaced repetition card reviewed
  const handleCardReviewed = (cardId: string, rating: SrsRating) => {
    // Calculate new intervals and ease factor using standard SM-2 algorithm
    setDecks(prevDecks => prevDecks.map(d => {
      const cardIndex = d.cards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return d;

      const card = d.cards[cardIndex];
      let newEase = card.easeFactor || 2.5;
      let newInterval = card.intervalDays || 1;
      let newReps = card.repetitions || 0;
      let newStatus = card.status;

      if (rating === 'again') {
        newEase = Math.max(1.3, newEase - 0.2);
        newInterval = 1;
        newReps = 0;
        newStatus = 'learning';
      } else if (rating === 'hard') {
        newEase = Math.max(1.3, newEase - 0.15);
        newInterval = Math.max(1, Math.floor(newInterval * 1.2));
        newReps += 1;
        newStatus = 'learning';
      } else if (rating === 'good') {
        newReps += 1;
        newInterval = newReps === 1 ? 1 : newReps === 2 ? 3 : Math.floor(newInterval * newEase);
        newStatus = newInterval >= 21 ? 'mastered' : 'review';
      } else if (rating === 'easy') {
        newEase += 0.15;
        newReps += 1;
        newInterval = newReps === 1 ? 4 : Math.floor(newInterval * newEase * 1.3);
        newStatus = newInterval >= 21 ? 'mastered' : 'review';
      }

      const updatedCard = {
        ...card,
        easeFactor: Number(newEase.toFixed(2)),
        intervalDays: newInterval,
        repetitions: newReps,
        status: newStatus,
        lastReviewDate: new Date().toISOString(),
      };

      const updatedCards = [...d.cards];
      updatedCards[cardIndex] = updatedCard;

      const dueCount = Math.max(0, d.dueCount - 1);
      const masteredCount = updatedCards.filter(c => c.status === 'mastered').length;
      const masteryRate = updatedCards.length > 0 ? Math.round((masteredCount / updatedCards.length) * 100) : 0;

      return {
        ...d,
        cards: updatedCards,
        dueCount,
        masteryRate,
        lastReviewed: 'Just now',
      };
    }));

    // Update user stats (XP, daily goals, accuracy)
    setUserStats(prev => ({
      ...prev,
      currentXp: prev.currentXp + 15,
      dailyGoalCompleted: Math.min(prev.dailyGoalTarget + 10, prev.dailyGoalCompleted + 1),
      totalWordsMastered: rating === 'easy' ? prev.totalWordsMastered + 1 : prev.totalWordsMastered,
    }));
  };

  // Handler: Deck completion
  const handleDeckCompleted = (deckId: string, cardsReviewedCount: number) => {
    // Add to activity history
    const todayStr = new Date().toISOString().split('T')[0];
    setActivityHistory(prev => {
      const todayIndex = prev.findIndex(item => item.date === todayStr);
      if (todayIndex !== -1) {
        const updated = [...prev];
        updated[todayIndex] = {
          ...updated[todayIndex],
          count: updated[todayIndex].count + cardsReviewedCount,
        };
        return updated;
      }
      return prev;
    });
  };

  // Handler: Complete AI practice word
  const handleCompleteAiWord = (word: string, xpEarned: number) => {
    setUserStats(prev => ({
      ...prev,
      currentXp: prev.currentXp + xpEarned,
      dailyGoalCompleted: prev.dailyGoalCompleted + 1,
    }));
  };

  // Handler: Add new custom deck
  const handleCreateDeck = (newDeck: Deck) => {
    sounds.playSuccess();
    setDecks(prev => [newDeck, ...prev]);
  };

  // Handler: Delete custom deck
  const handleDeleteDeck = (deckId: string) => {
    setDecks(prev => prev.filter(d => d.id !== deckId));
  };

  // Handler: Export all data JSON
  const handleExportData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      userStats,
      decks,
      activityHistory,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `memora-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="app-shell min-h-screen home-background text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <div className="home-background-art" aria-hidden="true">
        <span className="home-background-wing home-background-wing-left" />
        <span className="home-background-wing home-background-wing-right" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[480px] sm:max-w-full">
      {/* Global Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          sounds.playFlip();
          setCurrentView(view);
        }}
        userStats={userStats}
        onOpenCommandPalette={() => {
          sounds.playModalOpen();
          setIsCommandPaletteOpen(true);
        }}
        onOpenNewDeck={() => {
          sounds.playModalOpen();
          setIsNewDeckOpen(true);
        }}
        soundEnabled={userStats.soundEffects}
        onToggleSound={() => {
          sounds.playProgress();
          setUserStats(prev => ({ ...prev, soundEffects: !prev.soundEffects }));
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-16">
        {currentView === 'dashboard' && (
          <DashboardView
            userStats={userStats}
            decks={decks}
            onStartStudy={handleStartStudy}
            onNavigateDecks={() => {
              sounds.playFlip();
              setCurrentView('decks');
            }}
            onNavigatePractice={() => {
              sounds.playProgress();
              setCurrentView('practice');
            }}
            onOpenNewDeck={() => {
              sounds.playModalOpen();
              setIsNewDeckOpen(true);
            }}
          />
        )}

        {currentView === 'study' && (
          <StudySessionView
            deck={activeStudyDeck}
            onEndSession={() => setCurrentView(studyReturnView)}
            onCardReviewed={handleCardReviewed}
            onDeckCompleted={handleDeckCompleted}
          />
        )}

        {currentView === 'review' && (
          <ReviewView
            decks={decks}
            onStartReview={handleStartReview}
          />
        )}

        {currentView === 'decks' && (
          <DecksView
            decks={decks}
            onStartStudy={handleStartStudy}
            onOpenNewDeck={() => setIsNewDeckOpen(true)}
            onOpenAiDeckMaker={() => setIsAiDeckMakerOpen(true)}
            onDeleteDeck={handleDeleteDeck}
          />
        )}

        {currentView === 'practice' && (
          <AiPracticeView
            practiceWords={practiceWords}
            onCompleteWord={handleCompleteAiWord}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            userStats={userStats}
            activityHistory={activityHistory}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            userStats={userStats}
            onUpdateStats={(newStats) => setUserStats(prev => ({ ...prev, ...newStats }))}
            onExportData={handleExportData}
          />
        )}
      </main>

      {/* Global Modals */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => {
          sounds.playModalClose();
          setIsCommandPaletteOpen(false);
        }}
        decks={decks}
        onSelectDeck={handleStartStudy}
        onNavigate={(view) => {
          sounds.playFlip();
          setCurrentView(view);
        }}
      />

      <NewDeckModal
        isOpen={isNewDeckOpen}
        onClose={() => {
          sounds.playModalClose();
          setIsNewDeckOpen(false);
        }}
        onCreateDeck={handleCreateDeck}
      />

      <AiDeckMakerModal
        isOpen={isAiDeckMakerOpen}
        onClose={() => {
          sounds.playModalClose();
          setIsAiDeckMakerOpen(false);
        }}
        onDeckGenerated={handleCreateDeck}
      />
      </div>
    </div>
  );
}
