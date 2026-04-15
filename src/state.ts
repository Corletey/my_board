import type { Task, TaskStatus, ViewMode } from './types';
import { loadTasks, saveTasks } from './storage';
import { generateId, toDateStr } from './utils';

export interface AppState {
  view: ViewMode;
  currentYear: number;
  currentMonth: number;
  selectedDate: string | null;
  tasks: Task[];
  showModal: boolean;
  toast: string | null;
}

function getToday(): { year: number; month: number } {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() };
}

const { year, month } = getToday();

export const state: AppState = {
  view: 'visitor',
  currentYear: year,
  currentMonth: month,
  selectedDate: null,
  tasks: loadTasks(),
  showModal: false,
  toast: null,
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function setView(view: ViewMode): void {
  state.view = view;
  state.selectedDate = null;
  state.showModal = false;
  notify();
}

export function navigateMonth(dir: -1 | 1): void {
  state.currentMonth += dir;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear++;
  } else if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear--;
  }
  notify();
}

export function selectDate(dateStr: string): void {
  state.selectedDate = dateStr;
  state.showModal = true;
  notify();
}

export function closeModal(): void {
  state.selectedDate = null;
  state.showModal = false;
  notify();
}

export function addTask(data: Omit<Task, 'id' | 'createdAt' | 'status'>): void {
  const task: Task = {
    ...data,
    id: generateId(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };
  state.tasks.push(task);
  saveTasks(state.tasks);
  showToast(`"${data.title}" added to the board!`);
  notify();
}

export function updateTaskStatus(id: string, status: TaskStatus): void {
  const task = state.tasks.find((t) => t.id === id);
  if (task) {
    task.status = status;
    saveTasks(state.tasks);
    notify();
  }
}

export function deleteTask(id: string): void {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  saveTasks(state.tasks);
  notify();
}

export function getTasksForDate(dateStr: string): Task[] {
  return state.tasks.filter((t) => t.deadline === dateStr);
}

function showToast(msg: string): void {
  state.toast = msg;
  setTimeout(() => {
    state.toast = null;
    notify();
  }, 3500);
}

export function seedDemoTasks(): void {
  if (state.tasks.length > 0) return;
  const { year: y, month: m } = getToday();
  const demos: Omit<Task, 'id' | 'createdAt'>[] = [
    {
      title: 'Design system update',
      description: 'Refresh component tokens and spacing scale.',
      deadline: toDateStr(y, m, 8),
      priority: 'high',
      status: 'in-progress',
      submittedBy: undefined,
    },
    {
      title: 'Write quarterly report',
      description: 'Compile metrics and key wins from Q1.',
      deadline: toDateStr(y, m, 12),
      priority: 'medium',
      status: 'scheduled',
      submittedBy: undefined,
    },
    {
      title: 'Team retrospective',
      description: 'Facilitating the sprint retro meeting.',
      deadline: toDateStr(y, m, 15),
      priority: 'low',
      status: 'scheduled',
      submittedBy: undefined,
    },
    {
      title: 'Client feedback review',
      description: 'Go through feedback doc and flag blockers.',
      deadline: toDateStr(y, m, 18),
      priority: 'high',
      status: 'in-progress',
      submittedBy: 'Visitor - Client Team',
    },
    {
      title: 'Deploy staging build',
      description: 'Push latest changes to staging for QA.',
      deadline: toDateStr(y, m, 22),
      priority: 'medium',
      status: 'scheduled',
      submittedBy: undefined,
    },
  ];
  demos.forEach((d) =>
    state.tasks.push({ ...d, id: generateId(), createdAt: new Date().toISOString() })
  );
  saveTasks(state.tasks);
}
