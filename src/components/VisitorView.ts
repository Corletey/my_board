import { state, addTask } from '../state';
import { renderCalendar, renderLegend } from './Calendar';
import { esc } from '../utils';
import type { FormInput } from '../types';

function renderHero(): string {
  return `
    <div class="hero" role="banner">
      <div class="hero__content">
        <p class="hero__script">welcome to</p>
        <h2 class="hero__title">My Board</h2>
        <p class="hero__sub">see my schedule and drop a task request below</p>
      </div>
      <div class="hero__deco" aria-hidden="true">
        <span class="hero__petal hero__petal--1"></span>
        <span class="hero__petal hero__petal--2"></span>
        <span class="hero__petal hero__petal--3"></span>
        <span class="hero__petal hero__petal--4"></span>
        <span class="hero__petal hero__petal--5"></span>
      </div>
    </div>
  `;
}

function renderForm(): string {
  return `
    <aside class="form-panel" aria-label="Submit a task request">
      <div class="form-panel__inner">
        <h3 class="section-title">Submit a Request</h3>
        <p class="form-panel__sub">got something for me? drop it here and i'll get to it</p>

        ${state.toast ? `<div class="toast" role="alert">${esc(state.toast)}</div>` : ''}

        <form id="task-form" class="task-form" novalidate>
          <div class="field">
            <label class="field__label" for="f-name">Your Name <span class="req">*</span></label>
            <input class="field__input" type="text" id="f-name" name="submittedBy" placeholder="e.g. Nadia" required autocomplete="name" />
          </div>
          <div class="field">
            <label class="field__label" for="f-title">Task Title <span class="req">*</span></label>
            <input class="field__input" type="text" id="f-title" name="title" placeholder="what needs doing?" required />
          </div>
          <div class="field">
            <label class="field__label" for="f-desc">Description</label>
            <textarea class="field__input field__textarea" id="f-desc" name="description" placeholder="any extra details..." rows="3"></textarea>
          </div>
          <div class="field-row">
            <div class="field">
              <label class="field__label" for="f-deadline">Deadline <span class="req">*</span></label>
              <input class="field__input" type="date" id="f-deadline" name="deadline" required />
            </div>
            <div class="field">
              <label class="field__label" for="f-priority">Priority</label>
              <select class="field__input field__select" id="f-priority" name="priority">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div class="field-errors" id="form-errors" role="alert" aria-live="polite"></div>
          <button type="submit" class="btn-primary">Send Request</button>
        </form>
      </div>
    </aside>
  `;
}

export function renderVisitorView(): string {
  return `
    <div class="visitor-layout">
      ${renderHero()}
      <div class="visitor-layout__body">
        <div class="stack-md">
          ${renderCalendar()}
          ${renderLegend()}
        </div>
        ${renderForm()}
      </div>
    </div>
  `;
}

export function bindVisitorFormEvents(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('#task-form');
  const errBox = root.querySelector<HTMLElement>('#form-errors');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const title = (fd.get('title') as string).trim();
    const description = (fd.get('description') as string).trim();
    const deadline = (fd.get('deadline') as string).trim();
    const priority = (fd.get('priority') as string) as FormInput['priority'];
    const submittedBy = (fd.get('submittedBy') as string).trim();

    const errors: string[] = [];
    if (!submittedBy) errors.push('Name is required.');
    if (!title) errors.push('Task title is required.');
    if (!deadline) errors.push('Deadline is required.');

    if (errBox) {
      errBox.innerHTML = errors.map((err) => `<p class="field-error">${esc(err)}</p>`).join('');
    }

    if (errors.length > 0) return;

    addTask({ title, description, deadline, priority, submittedBy });
    form.reset();
    if (errBox) errBox.innerHTML = '';
  });
}
