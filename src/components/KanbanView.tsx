import React from 'react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { CircleDot, Clock, CheckCircle2, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onDuplicate,
  onToggleSubtask,
  onUpdateStatus,
}) => {
  const columns: { status: TaskStatus; title: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { status: 'todo', title: 'To Do', icon: CircleDot, color: 'text-zinc-400 border-zinc-800' },
    { status: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-amber-400 border-amber-900/50' },
    { status: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-400 border-emerald-900/50' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((col) => {
        const Icon = col.icon;
        const columnTasks = tasks.filter(t => {
          if (col.status === 'completed') return t.completed || t.status === 'completed';
          if (col.status === 'in_progress') return !t.completed && t.status === 'in_progress';
          return !t.completed && (t.status === 'todo' || !t.status);
        });

        return (
          <div 
            key={col.status}
            className="flex flex-col rounded-2xl bg-dark-950/80 border border-emerald-950/70 p-4 min-h-[450px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-emerald-950/80">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${col.color.split(' ')[0]}`} />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                  {col.title}
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-dark-900 border border-emerald-950 text-zinc-400">
                {columnTasks.length}
              </span>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3.5 flex-1 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="h-32 border border-dashed border-emerald-950/60 rounded-xl flex items-center justify-center text-xs font-mono text-zinc-600">
                  No missions in this lane
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task.id} className="relative group/kanban">
                    <TaskCard
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onTogglePin={onTogglePin}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onDuplicate={onDuplicate}
                      onToggleSubtask={onToggleSubtask}
                      compactGrid={true}
                    />
                    
                    {/* Fast Status Switch Quick Bar on Card Bottom */}
                    <div className="mt-1 flex items-center justify-between px-2 py-1 bg-dark-900/90 rounded-lg border border-emerald-950/80 text-[10px] font-mono text-zinc-400">
                      <span>Move to:</span>
                      <div className="flex items-center gap-1">
                        {col.status !== 'todo' && (
                          <button
                            onClick={() => onUpdateStatus(task.id, 'todo')}
                            className="px-1.5 py-0.5 rounded bg-dark-950 hover:text-white border border-zinc-800 transition-colors"
                          >
                            To Do
                          </button>
                        )}
                        {col.status !== 'in_progress' && (
                          <button
                            onClick={() => onUpdateStatus(task.id, 'in_progress')}
                            className="px-1.5 py-0.5 rounded bg-dark-950 hover:text-amber-400 border border-zinc-800 transition-colors"
                          >
                            In Progress
                          </button>
                        )}
                        {col.status !== 'completed' && (
                          <button
                            onClick={() => onUpdateStatus(task.id, 'completed')}
                            className="px-1.5 py-0.5 rounded bg-dark-950 hover:text-emerald-400 border border-zinc-800 transition-colors"
                          >
                            Done
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

