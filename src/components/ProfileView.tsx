import React, { useState } from 'react';
import { UserStats } from '../types';
import { 
  User, 
  Award, 
  Settings, 
  Sliders, 
  Download, 
  Upload, 
  Volume2, 
  Sparkles, 
  Flame, 
  BookOpen, 
  ShieldCheck, 
  Check, 
  CheckCircle2 
} from 'lucide-react';

interface ProfileViewProps {
  userStats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onExportData: () => void;
}

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

  const badges = [
    { id: 'streak14', title: 'Fortnight Master', desc: '14-day continuous recall streak', icon: '🔥', earned: true },
    { id: 'titan1000', title: 'Lexicon Titan', desc: 'Encoded over 1,000 distinct words', icon: '📚', earned: true },
    { id: 'speed', title: 'Speed Recall', desc: 'Maintained sub-4s response pacing', icon: '⚡', earned: true },
    { id: 'ai-champ', title: 'AI Conversant', desc: 'Composed 10+ contextual executive sentences', icon: '🤖', earned: true },
    { id: 'perfect', title: 'Perfect Retention', desc: 'Flawless 100% accuracy in 25 reviews', icon: '🎯', earned: true },
    { id: 'polyglot', title: 'Master Class', desc: 'Reach Level 10 Lexiconist', icon: '👑', earned: false },
  ];

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-800 text-white font-bold text-2xl flex items-center justify-center ring-4 ring-indigo-50 shadow-md">
            SM
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {userStats.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              @{userStats.handle} • {userStats.levelTitle}
            </p>
            <div className="flex items-center space-x-3 pt-1 text-xs text-slate-600">
              <span className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-semibold">{userStats.currentStreak}d Streak</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold">{userStats.currentXp.toLocaleString()} XP</span>
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Top 5% Global</span>
            </div>
          </div>
        </div>

        <button
          onClick={onExportData}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 self-stretch sm:self-auto justify-center"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Backup JSON</span>
        </button>
      </div>

      {/* Badges & Milestones Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Earned Badges & Milestones
            </h2>
            <p className="text-xs text-slate-500">
              Cognitive mastery achievements unlocked through continuous spaced learning.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600">
            5 / 6 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.earned
                  ? 'bg-slate-50/70 border-slate-200/90'
                  : 'bg-slate-50/30 border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                {badge.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight">
                {badge.desc}
              </p>
              {badge.earned && (
                <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  ✓ Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SRS Configuration Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Spaced Repetition (SRS) Engine Settings
          </h2>
          <p className="text-xs text-slate-500">
            Fine-tune the mathematical parameters governing interval leaps and review frequency.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Desired Retention Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Target Retention Rate ({retentionRate}%)
              </span>
              <span className="text-slate-400">
                {retentionRate >= 90 ? 'High Mastery (Standard)' : 'Fast Pacing (Less Rehearsals)'}
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="95"
              step="1"
              value={retentionRate}
              onChange={(e) => setRetentionRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>80% (Rapid throughput)</span>
              <span>90% (Optimal balance)</span>
              <span>95% (Maximum memory lock)</span>
            </div>
          </div>

          {/* Max New Cards per Day */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Max New Cards Per Day
            </span>
            <div className="grid grid-cols-4 gap-2.5">
              {[10, 20, 30, 50].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setMaxNewCards(count)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    maxNewCards === count
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {count} Cards
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Audio & Sound Effects
                </span>
                <span className="text-[11px] text-slate-400">
                  Synthesizer feedback on card flip and SRS interval grading.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  soundEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Autoplay Audio on Card Reveal
                </span>
                <span className="text-[11px] text-slate-400">
                  Automatically pronounces English vocabulary when flipped.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoplayAudio(!autoplayAudio)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  autoplayAudio ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoplayAudio ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {showSavedToast ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences saved successfully!</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                All changes synchronize directly with your study sessions.
              </span>
            )}

            <button
              type="button"
              id="profile-save-settings-btn"
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
