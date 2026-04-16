import { state, closeModal, updateTaskStatus, deleteTask, getTasksForDate } from '../state';
import { formatDateLong, esc } from '../utils';
import type { Task } from '../types';

function priorityBadge(p: Task['priority']): string {
  return `<span class="badge badge--priority-${p}">${p}</span>`;
}

function statusBadge(s: Task['status']): string {
  const label: Record<Task['status'], string> = {
    scheduled: 'Scheduled',
    'in-progress': 'In Progress',
    done: 'Done',
  };
  return `<span class="badge badge--status-${s}">${label[s]}</span>`;
}

function taskCard(task: Task, isOwner: boolean): string {
  return `
    <div class="task-card" data-id="${task.id}">
      <div class="task-card__top">
        <span class="task-card__title">${esc(task.title)}</span>
        <div class="task-card__badges">
          ${priorityBadge(task.priority)}
          ${statusBadge(task.status)}
        </div>
      </div>
      ${task.description ? `<p class="task-card__desc">${esc(task.description)}</p>` : ''}
      ${task.submittedBy ? `<p class="task-card__by">Requested by ${esc(task.submittedBy)}</p>` : ''}
      ${
        isOwner
          ? `
        <div class="task-card__actions">
          <select class="status-select" data-task-id="${task.id}" aria-label="Update status">
            <option value="scheduled" ${task.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
          </select>
          <button class="btn-icon btn-icon--danger delete-btn" data-task-id="${task.id}" aria-label="Delete task">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      `
          : ''
      }
    </div>
  `;
}

export function renderModal(): string {
  if (!state.showModal || !state.selectedDate) return '';

  const tasks = getTasksForDate(state.selectedDate);
  const isOwner = state.view === 'owner';
  const label = formatDateLong(state.selectedDate);

  return `
    <div class="modal-backdrop" id="modal-backdrop" role="dialog" aria-modal="true" aria-label="Tasks for ${label}">
      <div class="modal">
        <div class="modal__header">
          <div>
            <p class="modal__date">${label}</p>
            <p class="modal__count">${tasks.length === 0 ? 'Nothing here yet' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} scheduled`}</p>
          </div>
          <button class="btn-icon modal__close" id="modal-close" aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body">
          ${
            tasks.length === 0
              ? `<p class="modal__empty">Free as a bird on this day. no meetings, no chaos. actually kinda nice.</p>`
              : tasks.map((t) => taskCard(t, isOwner)).join('')
          }
        </div>
      </div>
    </div>
  `;
}

export function bindModalEvents(root: HTMLElement): void {
  const backdrop = root.querySelector<HTMLElement>('#modal-backdrop');
  if (!backdrop) return;

  root.querySelector('#modal-close')?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  root.querySelectorAll<HTMLSelectElement>('.status-select').forEach((sel) => {
    sel.addEventListener('change', () => {
      updateTaskStatus(sel.dataset['taskId']!, sel.value as Task['status']);
    });
  });

  root.querySelectorAll<HTMLButtonElement>('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (window.confirm('Delete this task? gone forever. no undo.')) {
        deleteTask(btn.dataset['taskId']!);
      }
    });
  });
}
