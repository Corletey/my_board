import { state, setView } from '../state';
import type { ViewMode } from '../types';

export function renderHeader(): string {
  const isOwner = state.view === 'owner';
  return `
    <header class="app-header">
      <div class="header-brand">
        <div class="header-logo" aria-hidden="true">
          <!-- 5-petal cherry blossom -->
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(12,12)">
              <ellipse cx="0" cy="-4.8" rx="2.6" ry="4.2" fill="currentColor" opacity="0.9"/>
              <ellipse cx="0" cy="-4.8" rx="2.6" ry="4.2" fill="currentColor" opacity="0.9" transform="rotate(72)"/>
              <ellipse cx="0" cy="-4.8" rx="2.6" ry="4.2" fill="currentColor" opacity="0.9" transform="rotate(144)"/>
              <ellipse cx="0" cy="-4.8" rx="2.6" ry="4.2" fill="currentColor" opacity="0.9" transform="rotate(216)"/>
              <ellipse cx="0" cy="-4.8" rx="2.6" ry="4.2" fill="currentColor" opacity="0.9" transform="rotate(288)"/>
              <circle cx="0" cy="0" r="2.8" fill="white" opacity="0.85"/>
              <circle cx="0" cy="0" r="1.4" fill="currentColor" opacity="0.7"/>
            </g>
          </svg>
        </div>
        <div>
          <h1 class="header-title">My Board</h1>
          <p class="header-subtitle">${isOwner ? 'Owner View' : 'Visitor View'}</p>
        </div>
      </div>
      <nav class="header-nav" role="navigation" aria-label="View switcher">
        <button
          class="view-btn ${isOwner ? 'view-btn--active' : ''}"
          data-view="owner"
          aria-pressed="${isOwner}"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          My Side
        </button>
        <button
          class="view-btn ${!isOwner ? 'view-btn--active' : ''}"
          data-view="visitor"
          aria-pressed="${!isOwner}"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
          Visitor
        </button>
      </nav>
    </header>
  `;
}

export function bindHeaderEvents(root: HTMLElement): void {
  root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setView(btn.dataset['view'] as ViewMode);
    });
  });
}
