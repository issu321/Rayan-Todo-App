import React, { useState } from 'react';
import { 
  Check, 
  Star, 
  Calendar, 
  Clock, 
  Trash2, 
  Edit3, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { Priority, Task } from '../types';
import { formatDueDate } from '../utils/dateUtils';
import { sound } from '../utils/sound';
import { triggerNeonConfetti } from '../utils/confetti';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  compactGrid?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleSubtask,
  compactGrid = false,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);

  const dueInfo = formatDueDate(task.dueDate, task.dueTime);
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleCheckboxClick = () => {
    if (!task.completed) {
      sound.playComplete();
      triggerNeonConfetti();
    } else {
      sound.playClick();
    }
    onToggleComplete(task.id);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPin();
    onTogglePin(task.id);
  };

  const priorityMeta: Record<Priority, { label: string; bg: string; text: string; border: string }> = {
    urgent: { 
      label: 'URGENT', 
      bg: 'bg-red-950/60', 
      text: 'text-red-400', 
      border: 'border-red-500/40' 
    },
    high: { 
      label: 'HIGH', 
      bg: 'bg-amber-950/60', 
      text: 'text-amber-400', 
      border: 'border-amber-500/40' 
    },
    medium: { 
      label: 'MED', 
      bg: 'bg-emerald-950/60', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/30' 
    },
    low: { 
      label: 'LOW', 
      bg: 'bg-zinc-900/60', 
      text: 'text-zinc-400', 
      border: 'border-zinc-800' 
    },
  };

  const pConfig = priorityMeta[task.priority];

  return (
    <div 
      className={`obsidian-card rounded-2xl p-4 sm:p-5 relative transition-all duration-200 group flex flex-col justify-between ${
        task.completed 
          ? 'opacity-65 border-emerald-950/40 bg-dark-950/60' 
          : task.pinned 
            ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(0,255,102,0.1)]' 
            : 'border-emerald-900/25'
      }`}
    >
      <div>
        {/* Top Header Row: Category, Priority, Pinned, Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category badge */}
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-dark-950 text-zinc-300 border border-emerald-900/40">
              {task.category}
            </span>

            {/* Priority badge */}
            <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md border ${pConfig.bg} ${pConfig.text} ${pConfig.border} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                task.priority === 'urgent' ? 'bg-red-400 animate-ping' : 
                task.priority === 'high' ? 'bg-amber-400' : 
                task.priority === 'medium' ? 'bg-emerald-400' : 'bg-zinc-500'
              }`} />
              {pConfig.label}
            </span>

            {/* Estimated time */}
            {task.estimatedMinutes && (
              <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" />
                {task.estimatedMinutes}m
              </span>
            )}
          </div>

          {/* Star/Pin Button */}
          <button
            onClick={handlePinClick}
            className={`p-1.5 rounded-lg transition-all ${
              task.pinned 
                ? 'text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-500/40' 
                : 'text-zinc-600 hover:text-zinc-400 hover:bg-dark-900'
            }`}
            title={task.pinned ? 'Unpin mission' : 'Pin mission to top'}
          >
            <Star className={`w-4 h-4 ${task.pinned ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Task Title & Custom Cyber Checkbox */}
        <div className="flex items-start gap-3.5 mb-2.5">
          <button
            onClick={handleCheckboxClick}
            className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              task.completed
                ? 'bg-emerald-500 border-emerald-400 text-black shadow-glow-sm'
                : 'bg-dark-950 border-emerald-700/60 hover:border-emerald-400 hover:shadow-glow-sm text-transparent'
            }`}
            title={task.completed ? 'Mark uncompleted' : 'Mark completed'}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="flex-1 min-w-0">
            <h3 
              onClick={handleCheckboxClick}
              className={`text-base font-semibold leading-snug cursor-pointer transition-colors ${
                task.completed 
                  ? 'line-through text-zinc-500 decoration-zinc-600' 
                  : 'text-zinc-100 hover:text-emerald-300'
              }`}
            >
              {task.title}
            </h3>

            {/* Optional Description / Notes */}
            {task.description && (
              <p className={`mt-1.5 text-xs text-zinc-400 leading-relaxed font-normal ${
                compactGrid ? 'line-clamp-2' : ''
              }`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Due Date Indicator */}
        {task.dueDate && (
          <div className="mt-2.5 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-md border ${
              dueInfo.isOverdue && !task.completed
                ? 'bg-red-950/70 text-red-300 border-red-500/50 animate-pulse'
                : dueInfo.isToday && !task.completed
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                  : 'bg-dark-950 text-zinc-400 border-emerald-950'
            }`}>
              {dueInfo.isOverdue && !task.completed ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{dueInfo.text}</span>
            </span>
          </div>
        )}

        {/* Subtasks Progress & Toggle */}
        {totalSubtasks > 0 && (
          <div className="mt-3 pt-3 border-t border-emerald-950/60">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500">{subtasksPercent}%</span>
                {showSubtasks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {/* Subtasks Mini Progress Bar */}
            <div className="w-full h-1.5 bg-dark-950 rounded-full overflow-hidden mt-1.5 border border-emerald-950">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${subtasksPercent}%` }}
              />
            </div>

            {/* Expandable Subtasks Checklist */}
            {showSubtasks && (
              <div className="mt-2.5 space-y-1.5 pl-1 animate-fade-in">
                {task.subtasks.map((st) => (
                  <div 
                    key={st.id}
                    onClick={() => {
                      sound.playClick();
                      onToggleSubtask(task.id, st.id);
                    }}
                    className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white cursor-pointer py-1 px-1.5 rounded hover:bg-dark-900/60 transition-colors"
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                      st.completed 
                        ? 'bg-emerald-500 border-emerald-400 text-black' 
                        : 'border-zinc-700 bg-dark-950'
                    }`}>
                      {st.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={st.completed ? 'line-through text-zinc-500' : ''}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags Chips */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {task.tags.map(tag => (
              <span 
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300/80 border border-emerald-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer Actions: Edit, Duplicate, Delete */}
      <div className="mt-4 pt-3 border-t border-emerald-950/60 flex items-center justify-between text-zinc-500 text-xs font-mono">
        <span className="text-[10px] text-zinc-600">
          ID: {task.id.slice(0, 8)}
        </span>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              sound.playClick();
              onEdit(task);
            }}
            className="p-1.5 rounded-lg hover:text-emerald-400 hover:bg-emerald-950/50 transition-colors"
            title="Edit Mission"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onDuplicate(task);
            }}
            className="p-1.5 rounded-lg hover:text-emerald-400 hover:bg-emerald-950/50 transition-colors"
            title="Duplicate Mission"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playDelete();
              onDelete(task.id);
            }}
            className="p-1.5 rounded-lg hover:text-red-400 hover:bg-red-950/40 transition-colors"
            title="Delete Mission"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

