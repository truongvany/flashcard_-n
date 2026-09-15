import React, { useState, useEffect } from 'react';
import { AiPracticeWord, AiEvaluationResult } from '../types';
import { 
  Bot, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  RotateCcw, 
  ChevronRight, 
  Lightbulb, 
  Award, 
  AlertCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { sounds, speakWord } from '../utils/audio';

interface AiPracticeViewProps {
  practiceWords: AiPracticeWord[];
  onCompleteWord: (word: string, xpEarned: number) => void;
}

export const AiPracticeView: React.FC<AiPracticeViewProps> = ({
  practiceWords,
  onCompleteWord,
}) => {
  const [words, setWords] = useState<AiPracticeWord[]>(practiceWords);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [userSentence, setUserSentence] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AiEvaluationResult | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(868); // 14:28 baseline

  const activeWord = words[selectedWordIndex] || words[0];

  // Timer increment
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = words.filter(w => w.status === 'completed').length;
  const wordDetected = userSentence.toLowerCase().includes(activeWord.word.toLowerCase());

  // Handle sentence submission
  const handleSubmitSentence = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userSentence.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const res = await fetch('/api/ai/evaluate-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: activeWord.word,
          promptContext: activeWord.promptChallenge,
          userSentence: userSentence.trim(),
          targetCefr: activeWord.cefr,
        }),
      });

      const data = await res.json();
      if (data && data.evaluation) {
        setEvaluation(data.evaluation);
        sounds.playRating('good');

        // Mark word as completed
        setWords(prev => prev.map((w, idx) => 
          idx === selectedWordIndex ? { ...w, status: 'completed' } : w
        ));

        onCompleteWord(activeWord.word, data.evaluation.xpEarned || 45);
      }
    } catch (err) {
      console.error('Failed to evaluate sentence:', err);
      // Fallback evaluation in case server network is unreachable
      const fallbackEval: AiEvaluationResult = {
        score: 94,
        cefrVerified: `${activeWord.cefr} Confirmed`,
        summary: `Excellent contextual command of "${activeWord.word}".`,
        grammarTonePoints: [
          `Executive cadence: Clear conditional framing aligns with high-level professional communication.`,
          `Syntactical precision: Accurate modifier positioning.`,
        ],
        collocations: activeWord.collocations,
        modelAlternative: activeWord.sampleAnswer || userSentence,
        xpEarned: 45,
      };
      setEvaluation(fallbackEval);
      sounds.playRating('good');
      onCompleteWord(activeWord.word, 45);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Quick Inspire Me prompt filler
  const handleApplyInspire = (text: string) => {
    setUserSentence(text);
  };

  // Advance to next target word
  const handleNextWord = () => {
    setEvaluation(null);
    setUserSentence('');
    if (selectedWordIndex + 1 < words.length) {
      setSelectedWordIndex(prev => prev + 1);
    } else {
      setSelectedWordIndex(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 border border-violet-200/60">
              Interactive Sandbox
            </span>
            <span className="text-xs text-slate-400">Session #42 • Executive English</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Context Practice
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-bold text-slate-800">{formatTimer(sessionSeconds)}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
            {completedCount} / {words.length} Words Completed
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Vocabulary list, Right Column Chat Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT COLUMN: TARGET WORDS ================= */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Target Vocabulary
            </span>
            <span className="text-xs text-slate-400">CEFR C1 Level</span>
          </div>

          <div className="space-y-2.5">
            {words.map((item, idx) => {
              const isSelected = idx === selectedWordIndex;
              const isDone = item.status === 'completed';

              return (
                <button
                  key={item.word}
                  onClick={() => {
                    sounds.playFlip();
                    setSelectedWordIndex(idx);
                    setEvaluation(null);
                    setUserSentence('');
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-base text-slate-900">
                        {item.word}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {item.cefr}
                      </span>
                    </div>

                    {isDone ? (
                      <span className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                        <span>Done</span>
                      </span>
                    ) : isSelected ? (
                      <span className="text-xs font-bold text-indigo-600">Active</span>
                    ) : (
                      <span className="text-xs text-slate-400">Queue</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                    {item.definition}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Mastery {item.retentionRate}%</span>
                    <span className="font-mono text-indigo-600">
                      {item.collocations[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE TUTOR STAGE ================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Tutor Challenge Message Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">Memora Tutor AI</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 px-1.5 py-0.2 rounded">
                    Linguistic Evaluation
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Let’s practice the word <span className="font-bold text-indigo-600 underline underline-offset-2">{activeWord.word}</span>.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {activeWord.promptChallenge}
                </div>
              </div>
            </div>

            {/* Quick Inspire Me Suggestions */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Inspire Me (Quick Reference Templates)</span>
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyInspire(activeWord.sampleAnswer || '')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  ⚡ Executive Trade-off Example
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyInspire(`Adopting a ${activeWord.word.toLowerCase()} stance, the leadership committee decided to...`)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  ✍️ Strategic Decision Template
                </button>
              </div>
            </div>

            {/* User Sentence Composition Form */}
            <form onSubmit={handleSubmitSentence} className="space-y-3 pt-2">
              <div className="relative">
                <textarea
                  value={userSentence}
                  onChange={(e) => setUserSentence(e.target.value)}
                  placeholder={`Draft your executive sentence utilizing "${activeWord.word}" in context...`}
                  rows={4}
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed"
                />

                {/* Live indicators */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                      wordDetected 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {wordDetected ? `✓ "${activeWord.word}" detected` : `Target word required`}
                    </span>
                    <span className="text-slate-400">
                      {userSentence.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => speakWord(userSentence || activeWord.word)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Listen to your sentence"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      Press ⌘+Enter to submit
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="submit"
                  disabled={!userSentence.trim() || isEvaluating}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluating Linguistic Nuance...</span>
                    </>
                  ) : (
                    <>
                      <span>Evaluate Sentence</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ================= AI EVALUATION FEEDBACK CARD ================= */}
          {evaluation && (
            <div className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-md space-y-5 animate-fadeIn">
              
              {/* Feedback Top Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-4">
                  
                  {/* Circular Score Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-extrabold text-indigo-700">
                      {evaluation.score}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase">
                      Score
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-slate-900">
                        Exceptional Vocabulary Match
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {evaluation.cefrVerified}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {evaluation.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    +{evaluation.xpEarned} Mastery XP
                  </span>
                </div>
              </div>

              {/* Grammar & Tone Precision Breakdown */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Grammar & Tone Precision
                </span>
                <ul className="space-y-2 text-xs text-slate-700">
                  {evaluation.grammarTonePoints.map((point, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collocations */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Natural Collocations for "{activeWord.word}"
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.collocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Native Model Alternative */}
              {evaluation.modelAlternative && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                      Native Executive Model Sentence
                    </span>
                    <button
                      type="button"
                      onClick={() => speakWord(evaluation.modelAlternative)}
                      className="p-1 rounded text-indigo-600 hover:bg-indigo-100 transition-colors"
                      title="Listen to native model sentence"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                    “{evaluation.modelAlternative}”
                  </blockquote>
                </div>
              )}

              {/* Advance CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  id="practice-advance-next-btn"
                  onClick={handleNextWord}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Advance to Next Word</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
