# My Board

A personal task and calendar board I built for myself. Lets me see what's on my plate for the month, track task statuses, and let people submit requests directly to my board.

## What it does

**My Side (owner view)**
- Monthly calendar showing all tasks with color-coded status dots
- Click any day to see tasks and update their status (Scheduled / In Progress / Done)
- Side panel keeping in-progress tasks front and center
- Overview stats so I can see at a glance how loaded I am

**Visitor view**
- Anyone with the link can see my schedule and how busy each day is
- Click a day to see how many tasks are already on it before requesting
- Submit a task request (title, description, deadline, priority, name) and it shows up on the calendar immediately
- No editing or deleting, just requesting

## Stack

- **Vite + TypeScript** (strict mode, no `any`)
- Vanilla DOM rendering, no framework
- `localStorage` for persistence, no backend needed
- CSS custom properties design system

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    Calendar.ts     # calendar grid + legend
    Header.ts       # header + view toggle
    Modal.ts        # day detail modal (owner can edit, visitor reads)
    OwnerView.ts    # overview stats + in-progress panel
    VisitorView.ts  # hero + visitor form
  styles/
    main.css        # all styles via CSS custom properties
  main.ts           # entry point + render loop
  state.ts          # global state + subscribe/notify
  storage.ts        # localStorage helpers
  types.ts          # Task, FormInput, ViewMode interfaces
  utils.ts          # date helpers, escape, constants
```
