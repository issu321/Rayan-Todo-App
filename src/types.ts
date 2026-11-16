export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  subtasks: SubTask[];
  pinned: boolean;
  tags: string[];
  createdAt: number;
  completedAt?: number;
  estimatedMinutes?: number;
}

export type ViewMode = 'list' | 'grid' | 'kanban';

export type SortOption = 'dueDate' | 'priority' | 'createdAt' | 'alphabetical';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  status: 'all' | 'active' | 'completed' | 'pinned';
  category: string;
  priority: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
  viewMode: ViewMode;
}

