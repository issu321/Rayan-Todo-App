import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  Tag, 
  Flag, 
  Clock, 
  Star, 
  CheckSquare, 
  Save 
} from 'lucide-react';
import { Priority, Task, TaskStatus, SubTask } from '../types';
import { sound } from '../utils/sound';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  taskToEdit?: Task | null;
  availableCategories: string[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  availableCategories,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [category, setCategory] = useState<string>('Dev');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined);
  const [pinned, setPinned] = useState(false);

  // Subtasks state
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Tags state
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status || (taskToEdit.completed ? 'completed' : 'todo'));
      setCategory(taskToEdit.category);
      setDueDate(taskToEdit.dueDate || '');
      setDueTime(taskToEdit.dueTime || '');
      setEstimatedMinutes(taskToEdit.estimatedMinutes);
      setPinned(taskToEdit.pinned || false);
      setSubtasks(taskToEdit.subtasks || []);
      setTags(taskToEdit.tags || []);
      setIsCustomCategory(false);
    } else {
      // Defaults for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setCategory(availableCategories[0] || 'Dev');
      setDueDate('');
      setDueTime('');
      setEstimatedMinutes(undefined);
      setPinned(false);
      setSubtasks([]);
      setTags([]);
      setIsCustomCategory(false);
      setCustomCategory('');
    }
  }, [taskToEdit, isOpen, availableCategories]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    sound.playClick();
    setSubtasks([
      ...subtasks,
      {
        id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      }
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    sound.playClick();
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const handleRemoveSubtask = (id: string) => {
    sound.playDelete();
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playClick();
    const finalCategory = isCustomCategory && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      completed: status === 'completed',
      category: finalCategory,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      estimatedMinutes: estimatedMinutes || undefined,
      pinned,
      subtasks,
      tags: tags.length > 0 ? tags : [finalCategory],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#050806] border border-emerald-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(0,255,102,0.15)] overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-emerald-950 flex items-center justify-between bg-dark-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 beacon-pulse" />
            <h2 className="text-sm font-mono font-bold tracking-wider uppercase text-zinc-100">
              {taskToEdit ? 'Modify Mission Parameters' : 'Initialize New Mission'}
            </h2>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-dark-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Mission Title <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Secure Auth Token Refresh"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-emerald-950 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-400 text-sm font-medium transition-all"
            />
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Detailed Briefing / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add architecture details, links, test requirements..."
              className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-emerald-950 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-400 text-sm font-normal resize-none transition-all"
            />
          </div>

          {/* Priority & Status Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-emerald-400" />
                Priority Tier
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 rounded-lg text-xs font-mono uppercase font-bold tracking-wider border transition-all ${
                        isSelected 
                          ? p === 'urgent' 
                            ? 'bg-red-500/20 text-red-400 border-red-500' 
                            : p === 'high' 
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500' 
                              : p === 'medium' 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' 
                                : 'bg-zinc-700/40 text-zinc-300 border-zinc-600'
                          : 'bg-dark-900 text-zinc-500 border-emerald-950/70 hover:text-zinc-300'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lane Status Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Execution State
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((s) => {
                  const isSelected = status === s;
                  const labels = { todo: 'To Do', in_progress: 'In Progress', completed: 'Done' };
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-1.5 rounded-lg text-xs font-mono uppercase font-semibold border transition-all ${
                        isSelected 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400' 
                          : 'bg-dark-900 text-zinc-500 border-emerald-950/70 hover:text-zinc-300'
                      }`}
                    >
                      {labels[s]}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Category & Estimated Minutes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                Category
              </label>
              <div className="flex gap-2">
                {!isCustomCategory ? (
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setIsCustomCategory(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="flex-1 bg-dark-900 border border-emerald-950 text-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                  >
                    {availableCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__new__">+ New Custom Category...</option>
                  </select>
                ) : (
                  <div className="flex-1 flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Custom category name..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="flex-1 bg-dark-900 border border-emerald-500 text-white rounded-xl px-3 py-2 text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Estimated Minutes */}
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Estimated Duration (Min)
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 45"
                value={estimatedMinutes || ''}
                onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-dark-900 border border-emerald-950 text-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

          </div>

          {/* Due Date & Due Time & Pinned */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-dark-900 border border-emerald-950 text-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-dark-900 border border-emerald-950 text-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 [color-scheme:dark]"
              />
            </div>

            {/* Pinned Switch */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPinned(!pinned)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
                  pinned 
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/50 shadow-glow-sm' 
                    : 'bg-dark-900 text-zinc-400 border-emerald-950 hover:text-zinc-200'
                }`}
              >
                <Star className={`w-4 h-4 ${pinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{pinned ? 'Pinned to Top' : 'Pin to Top'}</span>
              </button>
            </div>
          </div>

          {/* Subtasks Builder */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Checklist Subtasks ({subtasks.filter(s => s.completed).length}/{subtasks.length})
              </span>
            </label>

            <div className="space-y-2 mb-2.5">
              {subtasks.map((st) => (
                <div 
                  key={st.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-dark-900/80 border border-emerald-950"
                >
                  <div 
                    onClick={() => handleToggleSubtask(st.id)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      st.completed ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-700 bg-dark-950'
                    }`}>
                      {st.completed && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <span className={`text-xs ${st.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                      {st.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="p-1 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask and press Enter or Click +..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 bg-dark-900 border border-emerald-950 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 rounded-xl bg-dark-900 border border-emerald-900 hover:border-emerald-500 text-emerald-400 text-xs font-mono flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Tags (press Enter or comma to create)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-dark-900 border border-emerald-950">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag..."
                className="flex-1 min-w-[100px] bg-transparent text-xs text-white focus:outline-none"
              />
            </div>
          </div>

        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-emerald-950 flex items-center justify-between bg-dark-950/60">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-dark-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono uppercase tracking-wider shadow-glow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{taskToEdit ? 'Save Changes' : 'Confirm Mission'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

