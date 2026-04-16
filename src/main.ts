import './styles/main.css';
import { state, subscribe, seedDemoTasks } from './state';
import { renderHeader, bindHeaderEvents } from './components/Header';
import { renderOwnerView } from './components/OwnerView';
import { renderVisitorView, bindVisitorFormEvents } from './components/VisitorView';
import { renderModal, bindModalEvents } from './components/Modal';
import { bindCalendarEvents } from './components/Calendar';
import { esc } from './utils';

seedDemoTasks();

function renderToast(): string {
  if (!state.toast) return '';
  return `<div class="toast-global" role="status" aria-live="polite">${esc(state.toast)}</div>`;
}

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const bodyContent =
    state.view === 'owner' ? renderOwnerView() : renderVisitorView();

  app.innerHTML = `
    ${renderHeader()}
    <main class="app-main">
      ${bodyContent}
    </main>
    <footer class="app-footer">
      <span>My Board &middot; Personal Task Calendar</span>
      <div class="footer-dots" aria-hidden="true">
        <span class="dot dot--scheduled"></span>
        <span class="dot dot--in-progress"></span>
        <span class="dot dot--done"></span>
      </div>
    </footer>
    ${renderModal()}
    ${renderToast()}
  `;

  bindHeaderEvents(app);
  bindCalendarEvents(app);

  if (state.view === 'visitor') {
    bindVisitorFormEvents(app);
  }

  if (state.showModal) {
    bindModalEvents(app);
  }
}

subscribe(render);
render();
