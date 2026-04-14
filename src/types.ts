export type TaskStatus = 'scheduled' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type ViewMode = 'owner' | 'visitor';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  submittedBy?: string;
  createdAt: string;
}

export interface FormInput {
  title: string;
  description: string;
  deadline: string;
  priority: TaskPriority;
  submittedBy: string;
}
