import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Tag, 
  Flag, 
  SlidersHorizontal, 
  ArrowRight 
} from 'lucide-react';
import { Priority, Task } from '../types';
import { sound } from '../utils/sound';

interface QuickAddBarProps {
  onAddTask: (taskData: Partial<Task>) => void;
  onOpenFullModal: () => void;
  availableCategories: string[];
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  onAddTask,
  onOpenFullModal,
  availableCategories
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<string>('Dev');
  const [dueDate, setDueDate] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playClick();
    onAddTask({
      title: title.trim(),
      priority,
      category,
      dueDate: dueDate || undefined,
      completed: false,
      status: 'todo',
      subtasks: [],
      pinned: false,
      tags: [category],
    });

    setTitle('');
    setDueDate('');
  };

  const priorityColors: Record<Priority, { label: string; color: string; border: string }> = {
    urgent: { label: 'Urgent', color: 'text-red-400 bg-red-950/60', border: 'border-red-500/40' },
    high: { label: 'High', color: 'text-amber-400 bg-amber-950/60', border: 'border-amber-500/40' },
    medium: { label: 'Medium', color: 'text-emerald-400 bg-emerald-950/60', border: 'border-emerald-500/40' },
    low: { label: 'Low', color: 'text-zinc-400 bg-zinc-900', border: 'border-zinc-700' },
  };

  return (
    <div className="mb-6">
      <form 
        onSubmit={handleSubmit}
        className="obsidian-card rounded-2xl p-2 sm:p-2.5 border-emerald-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)] focus-within:border-emerald-400 focus-within:shadow-[0_0_25px_rgba(0,255,102,0.15)] transition-all"
      >
        <div className="flex items-center gap-2">
          {/* Quick Plus Icon */}
          <div className="pl-3 text-emerald-400 flex items-center justify-center">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>

          {/* Main Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type a mission and press Enter... (e.g. Deploy v2.5 matrix API)"
            className="flex-1 bg-transparent px-2 py-2 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none font-medium"
          />

          {/* Toggle inline quick controls */}
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1.5 ${
              showOptions 
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50' 
                : 'bg-dark-900 text-zinc-400 border-emerald-950 hover:text-zinc-200'
            }`}
            title="Toggle Priority & Date options"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Options</span>
          </button>

          {/* More details / Full modal button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenFullModal();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-emerald-400 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-900/60 transition-all text-xs font-mono hidden md:inline-flex items-center gap-1"
            title="Open Full Detail Modal"
          >
            <span>Full Form</span>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 rounded-xl bg-emerald-500 disabled:opacity-40 disabled:hover:brightness-100 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 shadow-glow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Add</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* Expandable Options Row */}
        {showOptions && (
          <div className="mt-3 pt-3 border-t border-emerald-950/80 flex flex-wrap items-center justify-between gap-3 px-2 text-xs font-mono animate-fade-in">
            {/* Priority Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-zinc-400" />
                Priority:
              </span>
              <div className="flex items-center gap-1">
                {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => {
                  const conf = priorityColors[p];
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition-all ${
                        isSelected 
                          ? `${conf.color} ${conf.border} shadow-[0_0_10px_rgba(0,0,0,0.5)] scale-105` 
                          : 'bg-dark-900/60 text-zinc-500 border-zinc-800/80 hover:text-zinc-300'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-zinc-400" />
                Category:
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-dark-900 border border-emerald-900/60 text-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-400"
              >
                {availableCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Quick Due Date */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                Due:
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-dark-900 border border-emerald-900/60 text-zinc-200 rounded-lg px-2 py-0.5 text-xs focus:outline-none focus:border-emerald-400 [color-scheme:dark]"
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="text-zinc-500 hover:text-red-400 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

