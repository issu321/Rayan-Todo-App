import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  ListFilter
} from 'lucide-react';
import { Task } from '../types';
import { formatDueDate } from '../utils/dateUtils';

interface StatsDashboardProps {
  tasks: Task[];
  onFilterOverdue?: () => void;
  onFilterUrgent?: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ 
  tasks,
  onFilterOverdue,
  onFilterUrgent
}) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const urgentOrHigh = tasks.filter(
    t => !t.completed && (t.priority === 'urgent' || t.priority === 'high')
  ).length;

  const overdueCount = tasks.filter(t => {
    if (t.completed || !t.dueDate) return false;
    return formatDueDate(t.dueDate, t.dueTime).isOverdue;
  }).length;

  // Streak calculation from completed tasks
  const streakDays = Math.max(1, Math.min(14, Math.floor(completed / 2) + 1));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      
      {/* Progress & Overall Rate */}
      <div className="col-span-2 sm:col-span-1 lg:col-span-2 obsidian-card rounded-2xl p-4 flex flex-col justify-between border-emerald-900/30 relative overflow-hidden group">
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
              Matrix Velocity
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            {completionRate}% Complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-emerald-950">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-neon-green transition-all duration-700 ease-out shadow-[0_0_12px_rgba(0,255,102,0.6)]"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-zinc-500">
            <span>{completed} done</span>
            <span>{active} pending / {total} total</span>
          </div>
        </div>
      </div>

      {/* Active Tasks Card */}
      <div className="obsidian-card rounded-2xl p-4 flex flex-col justify-between border-emerald-900/30">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-mono uppercase tracking-wider">Pending</span>
          <Clock className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-white font-mono tracking-tight">
            {active}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">active items</span>
        </div>
      </div>

      {/* High / Urgent Priority Card */}
      <div 
        onClick={onFilterUrgent}
        className={`obsidian-card rounded-2xl p-4 flex flex-col justify-between transition-all ${
          urgentOrHigh > 0 
            ? 'border-amber-900/40 hover:border-amber-500/50 cursor-pointer group' 
            : 'border-emerald-900/30'
        }`}
      >
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-mono uppercase tracking-wider">Critical</span>
          <AlertTriangle className={`w-4 h-4 ${urgentOrHigh > 0 ? 'text-amber-400 animate-pulse' : 'text-zinc-600'}`} />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className={`text-2xl font-black font-mono tracking-tight ${urgentOrHigh > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
            {urgentOrHigh}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {urgentOrHigh > 0 ? 'priority focus' : 'all clear'}
          </span>
        </div>
      </div>

      {/* Overdue Alert or Streak Card */}
      {overdueCount > 0 ? (
        <div 
          onClick={onFilterOverdue}
          className="obsidian-card rounded-2xl p-4 flex flex-col justify-between border-red-900/50 bg-red-950/20 hover:border-red-500/60 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-red-400">
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-red-400 tracking-tight">
              {overdueCount}
            </span>
            <span className="text-[10px] text-red-300 font-mono underline decoration-red-500/50">
              review now →
            </span>
          </div>
        </div>
      ) : (
        <div className="obsidian-card rounded-2xl p-4 flex flex-col justify-between border-emerald-900/30">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Focus Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {streakDays}d
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">streak heat 🔥</span>
          </div>
        </div>
      )}

    </div>
  );
};

