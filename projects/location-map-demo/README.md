# Location Map Demo

A self-contained **Vite + React + TypeScript + Tailwind** subproject (shadcn/ui
conventions) that integrates the `LocationMap` (`expand-map`) component inside a
**moveable, draggable interface**.

This folder is its own isolated context — it does **not** share tooling with the
rest of the repo (the root site is static HTML/CSS/vanilla JS). Everything here
runs from this directory.

## Run it

```bash
cd projects/location-map-demo
npm install
npm run dev      # http://localhost:5173
```

Other scripts: `npm run build` (type-check + production bundle),
`npm run preview` (serve the build).

## What's inside

```
src/
  components/ui/
    expand-map.tsx      # LocationMap — the integrated component (verbatim)
    draggable-card.tsx  # the moveable wrapper (framer-motion drag)
  App.tsx               # demo: three draggable maps on a bounded canvas
  main.tsx              # React entry
  index.css             # Tailwind + shadcn CSS variables (light/dark tokens)
components.json         # shadcn config (so `npx shadcn add` keeps working)
tailwind.config.js      # maps bg-background / border-border / muted-* to vars
```

### Why `src/components/ui`

shadcn/ui vendors component **source** into your repo rather than shipping an
npm package. The `@/components/ui/*` import alias (`@` → `src`, wired in
`tsconfig.json` + `vite.config.ts`) is the convention every shadcn component —
and the original `demo.tsx` (`import { LocationMap } from "@/components/ui/expand-map"`)
— assumes. Keeping components there means the alias, `components.json`, and any
future `npx shadcn@latest add` calls all resolve without edits.

## The moveable interface

`DraggableCard` wraps any child in a bounded drag surface built on
[framer-motion](https://www.framer.com/motion/)'s `drag` primitive — the same
foundation the [21st.dev draggable components](https://21st.dev/preetsuthar17/draggable-list)
use, so no extra dependency was added. It provides:

- **Bounded dragging** via `dragConstraints` (cards stay on the canvas) with
  elastic edges and release momentum.
- **Grab affordance** — lifts and scales while held, `cursor-grab` → `grabbing`.
- **Drag-vs-click guard** — the child stays interactive. `LocationMap` expands
  on click; a real drag is detected by pointer distance and its trailing
  synthetic click is swallowed in the capture phase, so repositioning a card
  never toggles its expanded state.

### Props answered (integration guidelines)

| Question | Answer |
| --- | --- |
| Data / props | `LocationMap` takes `location`, `coordinates`, `className` (all optional, with SF defaults). `App.tsx` passes three real cities. |
| State management | Purely local — `useState` for hover/expanded in the map, drag state in the wrapper. No global store or context needed. |
| Required assets | None. The "map" is drawn with inline SVG + Tailwind, so no images/fonts to fetch. |
| Responsive behavior | The canvas is fluid (`max-w-5xl`, `h-[70vh]`); the map animates between fixed collapsed (240×140) and expanded (360×280) sizes and is dragged within the canvas bounds. |
| Where to use it | A "current location" / live-site indicator, a contact section, or a playful board of saved places. |

## Notes on tokens

The component uses shadcn semantic tokens (`background`, `border`, `muted`,
`muted-foreground`, `foreground`). Those are defined as HSL CSS variables in
`src/index.css` and mapped in `tailwind.config.js`. The demo mounts under a
`.dark` wrapper so the neon-emerald accent reads against a dark board; remove
that class for the light theme.
