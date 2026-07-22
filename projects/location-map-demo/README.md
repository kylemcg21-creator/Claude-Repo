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
    draggable-card.tsx  # Aceternity Draggable Card (via 21st.dev)
  lib/utils.ts          # cn() helper (clsx + tailwind-merge)
  App.tsx               # demo: three draggable maps on a 3D-perspective canvas
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

The draggable surface is **Aceternity UI's Draggable Card**, as published on
21st.dev — `DraggableCardContainer` (sets the 3D perspective) + `DraggableCardBody`
(the drag + tilt surface). Install it in a fresh project with:

```bash
npx shadcn@latest add "https://21st.dev/r/aceternity/draggable-card"
```

The vendored copy in `src/components/ui/draggable-card.tsx` is the upstream
component with two small, documented adaptations (called out in its header):

1. Imports come from `framer-motion` (already a dependency) rather than the
   newer `motion/react` package — identical re-exported hooks.
2. 3D depth uses an inline `transformStyle: "preserve-3d"` instead of Tailwind
   v4's `transform-3d` utility, since this project targets Tailwind v3.

What it gives you:

- **Velocity-based momentum** — release mid-fling and the card carries its speed.
- **Spring 3D tilt** — the card rotates toward the cursor (`rotateX`/`rotateY`)
  and springs flat on release; a moving glare sweeps across as you drag.
- **Viewport-wide constraints** — cards can be dragged anywhere on screen, with
  bounds recomputed on resize.

In `App.tsx` the default card chrome (`bg`, padding, fixed `min-h-96 w-80`,
shadow) is overridden so the body hugs the `LocationMap` instead of framing it,
and `overflow-visible` keeps the map's "Click to expand" hint and its expand
growth from being clipped. `LocationMap` stays fully interactive — click still
toggles the expanded street-grid view.

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
