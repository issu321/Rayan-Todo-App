import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { QuickAddBar } from './components/QuickAddBar';
import { FilterControls } from './components/FilterControls';
import { TaskCard } from './components/TaskCard';
import { KanbanView } from './components/KanbanView';
import { TaskModal } from './components/TaskModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { BackupModal } from './components/BackupModal';
import { Task, FilterState, TaskStatus, Priority } from './types';
import { loadTasks, saveTasks } from './utils/storage';
import { sound } from './utils/sound';
import { formatDueDate } from './utils/dateUtils';
import { 
  Inbox, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Terminal,
  Zap
} from 'lucide-react';

const DEFAULT_CATEGORIES = ['Dev', 'Design', 'Security', 'Ops', 'Personal', 'Work'];

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
    sortBy: 'dueDate',
    sortDirection: 'asc',
    viewMode: 'list',
  });

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Search input ref for hotkey focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Persist tasks on change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Dynamic available categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    tasks.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (e.key === 'Escape') {
        setIsTaskModalOpen(false);
        setIsShortcutsOpen(false);
        setIsBackupOpen(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      if (!isInputActive) {
        if (e.key === '/' || e.key === '?') {
          e.preventDefault();
          searchInputRef.current?.focus();
        } else if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          sound.playClick();
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        } else if (e.key === 'm' || e.key === 'M') {
          sound.toggleSound();
        } else if (e.key === '1') {
          setFilter(prev => ({ ...prev, viewMode: 'list' }));
        } else if (e.key === '2') {
          setFilter(prev => ({ ...prev, viewMode: 'grid' }));
        } else if (e.key === '3') {
          setFilter(prev => ({ ...prev, viewMode: 'kanban' }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Handlers
  const handleCreateOrUpdateTask = (taskData: Partial<Task>) => {
    if (taskToEdit) {
      // Update existing
      setTasks(prev => prev.map(t => {
        if (t.id === taskToEdit.id) {
          const updatedCompleted = taskData.completed !== undefined ? taskData.completed : t.completed;
          return {
            ...t,
            ...taskData,
            completed: updatedCompleted,
            status: taskData.status || (updatedCompleted ? 'completed' : 'todo'),
            completedAt: updatedCompleted && !t.completed ? Date.now() : t.completedAt,
          } as Task;
        }
        return t;
      }));
    } else {
      // Create new
      const newTask: Task = {
        id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: taskData.title || 'Untitled Mission',
        description: taskData.description,
        completed: taskData.completed || false,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        category: taskData.category || 'Dev',
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
        estimatedMinutes: taskData.estimatedMinutes,
        pinned: taskData.pinned || false,
        subtasks: taskData.subtasks || [],
        tags: taskData.tags || [taskData.category || 'Dev'],
        createdAt: Date.now(),
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          status: nextCompleted ? 'completed' : 'todo',
          completedAt: nextCompleted ? Date.now() : undefined,
        };
      }
      return t;
    }));
  };

  const handleTogglePin = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleDuplicateTask = (task: Task) => {
    const duplicated: Task = {
      ...task,
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${task.title} (Clone)`,
      completed: false,
      status: 'todo',
      createdAt: Date.now(),
      completedAt: undefined,
      subtasks: task.subtasks.map(s => ({
        ...s,
        id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        completed: false
      }))
    };
    setTasks(prev => [duplicated, ...prev]);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        // If all subtasks are complete, don't automatically close task unless user wants, but keep track
        return {
          ...t,
          subtasks: updatedSubtasks
        };
      }
      return t;
    }));
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    sound.playClick();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isNowDone = newStatus === 'completed';
        return {
          ...t,
          status: newStatus,
          completed: isNowDone,
          completedAt: isNowDone ? Date.now() : undefined
        };
      }
      return t;
    }));
  };

  const handleBatchComplete = () => {
    setTasks(prev => prev.map(t => ({
      ...t,
      completed: true,
      status: 'completed',
      completedAt: Date.now(),
    })));
  };

  const handleBatchClearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const handleImportTasks = (imported: Task[], replace: boolean) => {
    if (replace) {
      setTasks(imported);
    } else {
      // Merge by ID
      const existingIds = new Set(tasks.map(t => t.id));
      const newItems = imported.filter(t => !existingIds.has(t.id));
      setTasks([...newItems, ...tasks]);
    }
  };

  const handleResetToDefault = () => {
    localStorage.removeItem('kronos_tasks_matrix_v1');
    setTasks(loadTasks());
  };

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search query
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Status filter
    if (filter.status === 'active') {
      result = result.filter(t => !t.completed);
    } else if (filter.status === 'completed') {
      result = result.filter(t => t.completed);
    } else if (filter.status === 'pinned') {
      result = result.filter(t => t.pinned);
    }

    // Category filter
    if (filter.category !== 'all') {
      result = result.filter(t => t.category === filter.category);
    }

    // Priority filter
    if (filter.priority !== 'all') {
      result = result.filter(t => t.priority === filter.priority);
    }

    // Sorting
    const priorityWeight: Record<Priority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1
    };

    result.sort((a, b) => {
      // Keep pinned active items near top
      if (a.pinned !== b.pinned && !a.completed && !b.completed) {
        return a.pinned ? -1 : 1;
      }

      // If one is completed and other is not, active items come first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      let comp = 0;
      if (filter.sortBy === 'priority') {
        comp = priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (filter.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const timeA = `${a.dueDate} ${a.dueTime || '23:59'}`;
        const timeB = `${b.dueDate} ${b.dueTime || '23:59'}`;
        comp = timeA.localeCompare(timeB);
      } else if (filter.sortBy === 'createdAt') {
        comp = b.createdAt - a.createdAt;
      } else if (filter.sortBy === 'alphabetical') {
        comp = a.title.localeCompare(b.title);
      }

      return filter.sortDirection === 'desc' ? -comp : comp;
    });

    return result;
  }, [tasks, filter]);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-black cyber-grid">
      
      {/* Top Navbar */}
      <Header
        onOpenNewTaskModal={() => {
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        }}
        onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        totalTasks={tasks.length}
        completedTasks={completedCount}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Productivity & Metrics Widget */}
        <StatsDashboard 
          tasks={tasks}
          onFilterOverdue={() => {
            setFilter(prev => ({ ...prev, status: 'active', sortBy: 'dueDate', sortDirection: 'asc' }));
          }}
          onFilterUrgent={() => {
            setFilter(prev => ({ ...prev, status: 'active', priority: 'urgent' }));
          }}
        />

        {/* Quick Task Input Bar */}
        <QuickAddBar
          onAddTask={handleCreateOrUpdateTask}
          onOpenFullModal={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          availableCategories={availableCategories}
        />

        {/* Search, Filter Tabs, Sort, and View Modes */}
        <FilterControls
          filter={filter}
          onFilterChange={(newF) => setFilter(prev => ({ ...prev, ...newF }))}
          tasks={tasks}
          availableCategories={availableCategories}
          onBatchComplete={handleBatchComplete}
          onBatchClearCompleted={handleBatchClearCompleted}
          searchInputRef={searchInputRef}
        />

        {/* Tasks Views */}
        {filter.viewMode === 'kanban' ? (
          <KanbanView
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onTogglePin={handleTogglePin}
            onDelete={handleDeleteTask}
            onEdit={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
            onDuplicate={handleDuplicateTask}
            onToggleSubtask={handleToggleSubtask}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : filteredTasks.length === 0 ? (
          /* Empty state */
          <div className="obsidian-card rounded-2xl p-12 text-center max-w-md mx-auto my-8 border-dashed border-emerald-950 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-emerald-900/60 flex items-center justify-center text-emerald-400 mb-4 shadow-glow-sm">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-mono font-bold text-white mb-1">
              Zero Active Signals
            </h3>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              {filter.search || filter.status !== 'all' || filter.category !== 'all' || filter.priority !== 'all'
                ? 'No missions match your active search filter parameters.'
                : 'All matrix missions are completed or cleared. Time to initialize new objectives.'}
            </p>
            <div className="flex gap-2.5">
              {(filter.search || filter.status !== 'all' || filter.category !== 'all' || filter.priority !== 'all') && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setFilter(prev => ({
                      ...prev,
                      search: '',
                      status: 'all',
                      category: 'all',
                      priority: 'all',
                    }));
                  }}
                  className="px-4 py-2 rounded-xl bg-dark-900 border border-emerald-900 text-xs font-mono text-emerald-400 hover:border-emerald-500 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => {
                  sound.playClick();
                  setTaskToEdit(null);
                  setIsTaskModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-emerald-400 shadow-glow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Initialize Mission</span>
              </button>
            </div>
          </div>
        ) : filter.viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onTogglePin={handleTogglePin}
                onDelete={handleDeleteTask}
                onEdit={(t) => {
                  setTaskToEdit(t);
                  setIsTaskModalOpen(true);
                }}
                onDuplicate={handleDuplicateTask}
                onToggleSubtask={handleToggleSubtask}
                compactGrid={true}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onTogglePin={handleTogglePin}
                onDelete={handleDeleteTask}
                onEdit={(t) => {
                  setTaskToEdit(t);
                  setIsTaskModalOpen(true);
                }}
                onDuplicate={handleDuplicateTask}
                onToggleSubtask={handleToggleSubtask}
                compactGrid={false}
              />
            ))}
          </div>
        )}

      </main>

      {/* Futuristic Obsidian Footer */}
      <footer className="border-t border-emerald-950/60 bg-black/90 py-5 px-4 text-xs font-mono text-zinc-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span className="text-zinc-400 font-bold">KRONOS TO-DO MATRIX</span>
            <span className="text-zinc-600">// DEEPEST BLACK & NEON EMERALD UI</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-600">
            <span className="hover:text-emerald-400 transition-colors">
              Storage: Local Matrix Active
            </span>
            <span>•</span>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>Hotkeys: Press '?'</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
        availableCategories={availableCategories}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        tasks={tasks}
        onImportTasks={handleImportTasks}
        onResetToDefault={handleResetToDefault}
      />

    </div>
  );
};

