import { state } from '../state';
import { renderCalendar, renderLegend } from './Calendar';
import { esc, formatDateLong } from '../utils';

function renderOverview(): string {
  const scheduled = state.tasks.filter((t) => t.status === 'scheduled').length;
  const inProgress = state.tasks.filter((t) => t.status === 'in-progress').length;
  const done = state.tasks.filter((t) => t.status === 'done').length;

  return `
    <section class="overview" aria-label="Task overview">
      <h3 class="section-title">Overview</h3>
      <div class="overview__cards">
        <div class="overview__card overview__card--scheduled">
          <span class="overview__num">${scheduled}</span>
          <span class="overview__label">Scheduled</span>
        </div>
        <div class="overview__card overview__card--in-progress">
          <span class="overview__num">${inProgress}</span>
          <span class="overview__label">In Progress</span>
        </div>
        <div class="overview__card overview__card--done">
          <span class="overview__num">${done}</span>
          <span class="overview__label">Done</span>
        </div>
      </div>
    </section>
  `;
}

function renderSidePanel(): string {
  const inProgress = state.tasks.filter((t) => t.status === 'in-progress');

  const content =
    inProgress.length === 0
      ? `<p class="panel__empty">nothing in progress right now. living the dream.</p>`
      : inProgress
          .map(
            (t) => `
          <div class="panel-card">
            <div class="panel-card__header">
              <span class="panel-card__title">${esc(t.title)}</span>
              <span class="badge badge--priority-${t.priority}">${t.priority}</span>
            </div>
            <p class="panel-card__date">${formatDateLong(t.deadline)}</p>
            ${t.description ? `<p class="panel-card__desc">${esc(t.description)}</p>` : ''}
          </div>
        `
          )
          .join('');

  return `
    <aside class="side-panel" aria-label="In progress tasks">
      <h3 class="section-title">In Progress</h3>
      <div class="panel__list">${content}</div>
    </aside>
  `;
}

export function renderOwnerView(): string {
  return `
    <div class="owner-layout">
      <div class="owner-layout__main">
        ${renderOverview()}
        <div class="stack-md">
          ${renderCalendar()}
          ${renderLegend()}
        </div>
      </div>
      ${renderSidePanel()}
    </div>
  `;
}
