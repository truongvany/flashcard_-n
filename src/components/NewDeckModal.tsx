import React, { useState } from 'react';
import { Deck, CefrLevel } from '../types';
import { X, Plus, Layers, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NewDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeck: (newDeck: Deck) => void;
}

export const NewDeckModal: React.FC<NewDeckModalProps> = ({
  isOpen,
  onClose,
  onCreateDeck,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Deck['category']>('Custom');
  const [level, setLevel] = useState<CefrLevel>('B2');
  const [description, setDescription] = useState('');
  const [firstWord, setFirstWord] = useState('');
  const [firstDefinition, setFirstDefinition] = useState('');
  const [firstVietnamese, setFirstVietnamese] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playRating('good');

    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      title: title.trim(),
      category,
      level,
      description: description.trim() || 'Custom created vocabulary deck.',
      cardCount: firstWord ? 1 : 0,
      dueCount: firstWord ? 1 : 0,
      masteryRate: 0,
      lastReviewed: 'Just created',
      tags: [category, level, 'Custom'],
      cards: firstWord.trim() ? [
        {
          id: `card-${Date.now()}`,
          word: firstWord.trim(),
          phonetic: `/${firstWord.toLowerCase()}/`,
          partOfSpeech: 'Noun',
          definition: firstDefinition.trim() || 'Custom definition',
          vietnameseMeaning: firstVietnamese.trim() || 'Ý nghĩa tùy chỉnh',
          exampleSentence: `“Studying ${firstWord.trim()} reinforces language retention.”`,
          usageContext: 'Custom Practice',
          synonyms: [],
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
          dueDate: new Date().toISOString(),
          status: 'new',
        }
      ] : [],
    };

    onCreateDeck(newDeck);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create New Deck</h2>
              <p className="text-xs text-slate-500">Configure your custom spaced repetition deck.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Deck Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced Tech Negotiations"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Deck['category'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Custom">Custom</option>
                <option value="IELTS">IELTS</option>
                <option value="Oxford 3000">Oxford 3000</option>
                <option value="Business">Business</option>
                <option value="Daily">Daily</option>
                <option value="GRE / Roots">GRE / Roots</option>
                <option value="Specialized">Specialized</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target CEFR Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CefrLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="A1">A1 Beginner</option>
                <option value="A2">A2 Elementary</option>
                <option value="B1">B1 Intermediate</option>
                <option value="B2">B2 Upper Int</option>
                <option value="C1">C1 Advanced</option>
                <option value="C2">C2 Mastery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this deck's focus..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Optional First Card */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-indigo-700 block mb-2">
              Add Initial Card (Optional)
            </span>
            <div className="space-y-2">
              <input
                type="text"
                value={firstWord}
                onChange={(e) => setFirstWord(e.target.value)}
                placeholder="Front Word (e.g. Ubiquitous)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={firstDefinition}
                onChange={(e) => setFirstDefinition(e.target.value)}
                placeholder="English Definition"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={firstVietnamese}
                onChange={(e) => setFirstVietnamese(e.target.value)}
                placeholder="Nghĩa Tiếng Việt"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all"
            >
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
