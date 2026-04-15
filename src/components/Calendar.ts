import { state, navigateMonth, selectDate, getTasksForDate } from '../state';
import {
  toDateStr,
  getTodayStr,
  getDaysInMonth,
  getFirstDayOfMonth,
  MONTH_NAMES,
  DAY_LABELS,
} from '../utils';
import type { Task } from '../types';

function statusDotColor(status: Task['status']): string {
  const map: Record<Task['status'], string> = {
    scheduled: 'var(--c-sage)',
    'in-progress': 'var(--c-gold)',
    done: 'var(--c-done)',
  };
  return map[status];
}

export function renderCalendar(): string {
  const { currentYear: y, currentMonth: m } = state;
  const today = getTodayStr();
  const daysInMonth = getDaysInMonth(y, m);
  const firstDay = getFirstDayOfMonth(y, m);

  const dayLabels = DAY_LABELS.map(
    (label) => `<div class="cal-label">${label}</div>`
  ).join('');

  const emptyCells = Array.from({ length: firstDay }, () => `<div class="cal-cell cal-cell--empty"></div>`).join('');

  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = toDateStr(y, m, day);
    const tasks = getTasksForDate(dateStr);
    const isToday = dateStr === today;
    const busyClass = tasks.length >= 4 ? 'cal-cell--very-busy' : tasks.length >= 2 ? 'cal-cell--busy' : '';
    const todayClass = isToday ? 'cal-cell--today' : '';

    const dots = tasks
      .slice(0, 6)
      .map(
        (t) =>
          `<span class="dot" style="background:${statusDotColor(t.status)}" title="${t.status}"></span>`
      )
      .join('');

    return `
      <div
        class="cal-cell ${busyClass} ${todayClass}"
        data-date="${dateStr}"
        role="button"
        tabindex="0"
        aria-label="${dateStr}, ${tasks.length} task${tasks.length !== 1 ? 's' : ''}"
      >
        <span class="cal-day-num">${day}</span>
        ${dots ? `<div class="cal-dots">${dots}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="calendar">
      <div class="calendar__header">
        <button class="cal-nav-btn" data-dir="-1" aria-label="Previous month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 class="calendar__title">${MONTH_NAMES[m]} ${y}</h2>
        <button class="cal-nav-btn" data-dir="1" aria-label="Next month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="calendar__grid">
        ${dayLabels}
        ${emptyCells}
        ${dayCells}
      </div>
    </div>
  `;
}

export function bindCalendarEvents(root: HTMLElement): void {
  root.querySelectorAll<HTMLButtonElement>('.cal-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigateMonth(parseInt(btn.dataset['dir'] ?? '0') as -1 | 1);
    });
  });

  root.querySelectorAll<HTMLElement>('.cal-cell:not(.cal-cell--empty)').forEach((cell) => {
    const handler = () => {
      const d = cell.dataset['date'];
      if (d) selectDate(d);
    };
    cell.addEventListener('click', handler);
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}

export function renderLegend(): string {
  return `
    <div class="legend">
      <h4 class="legend__title">Calendar Legend</h4>
      <ul class="legend__list">
        <li class="legend__item"><span class="dot dot--scheduled"></span> Scheduled</li>
        <li class="legend__item"><span class="dot dot--in-progress"></span> In Progress</li>
        <li class="legend__item"><span class="dot dot--done"></span> Done</li>
        <li class="legend__item"><span class="dot dot--today-ring"></span> Today</li>
        <li class="legend__item">
          <span class="dot dot--scheduled"></span><span class="dot dot--scheduled"></span><span class="dot dot--scheduled"></span>
          &nbsp;More dots = busier day
        </li>
      </ul>
    </div>
  `;
}
