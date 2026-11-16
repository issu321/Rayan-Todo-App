import { Task } from '../types';

const STORAGE_KEY = 'kronos_tasks_matrix_v1';

// Default initial tasks if user has no saved data
const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Deploy Production Matrix Service',
    description: 'Ensure environment variables, SSL certificates, and database replication health checks pass before deploying build v2.4.0.',
    completed: false,
    status: 'in_progress',
    priority: 'urgent',
    category: 'Dev',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    pinned: true,
    tags: ['Deployment', 'AWS', 'Security'],
    estimatedMinutes: 45,
    createdAt: Date.now() - 3600000 * 5,
    subtasks: [
      { id: 's-1', title: 'Verify database migrations', completed: true },
      { id: 's-2', title: 'Run automated end-to-end test suite', completed: true },
      { id: 's-3', title: 'Check CDN cache invalidation rules', completed: false },
      { id: 's-4', title: 'Monitor Prometheus latency dashboards', completed: false }
    ]
  },
  {
    id: 't-2',
    title: 'Finalize Dark Emerald Design System',
    description: 'Review contrast ratios, glassmorphism border highlights, and micro-interaction states for dark mode buttons.',
    completed: false,
    status: 'todo',
    priority: 'high',
    category: 'Design',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '14:30',
    pinned: true,
    tags: ['UI/UX', 'Figma', 'EmeraldTheme'],
    estimatedMinutes: 60,
    createdAt: Date.now() - 3600000 * 12,
    subtasks: [
      { id: 's-5', title: 'Tune neon green glow falloff shadow', completed: true },
      { id: 's-6', title: 'Export SVG icon pack with glowing stroke', completed: false }
    ]
  },
  {
    id: 't-3',
    title: 'Implement Web Audio Haptic Sound Matrix',
    description: 'Synthesize custom frequency ramps for clicks, completions, and error alerts using native Web Audio oscillators.',
    completed: true,
    status: 'completed',
    priority: 'medium',
    category: 'Dev',
    dueDate: new Date().toISOString().split('T')[0],
    pinned: false,
    tags: ['Audio', 'WebAPI'],
    estimatedMinutes: 30,
    createdAt: Date.now() - 3600000 * 24,
    completedAt: Date.now() - 3600000 * 2,
    subtasks: [
      { id: 's-7', title: 'Harmonic chord synthesis', completed: true },
      { id: 's-8', title: 'Mute/unmute persistence', completed: true }
    ]
  },
  {
    id: 't-4',
    title: 'Review System Architecture & Security Logs',
    description: 'Audit API endpoint authentication rate-limits and token expiration policies.',
    completed: false,
    status: 'todo',
    priority: 'medium',
    category: 'Security',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    pinned: false,
    tags: ['Audit', 'Auth0'],
    estimatedMinutes: 40,
    createdAt: Date.now() - 3600000 * 18,
    subtasks: []
  },
  {
    id: 't-5',
    title: 'Nightly Workout & Recovery Routine',
    description: '45 mins calisthenics followed by mobility stretching and hydration tracking.',
    completed: true,
    status: 'completed',
    priority: 'low',
    category: 'Personal',
    pinned: false,
    tags: ['Health', 'Fitness'],
    estimatedMinutes: 45,
    createdAt: Date.now() - 3600000 * 28,
    completedAt: Date.now() - 3600000 * 10,
    subtasks: [
      { id: 's-9', title: 'Hydration 2L minimum', completed: true }
    ]
  }
];

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to load tasks from local storage', err);
    return INITIAL_TASKS;
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to local storage', err);
  }
};

