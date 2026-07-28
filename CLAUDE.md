# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is a sandbox/starter repo for experimenting with Claude Code on the web. It is not a single application — it's a loose collection of independent, self-contained demos and mini-projects at various levels of completeness. Treat each top-level item (root site, `demo/`, each folder under `projects/`) as its own isolated context; changes in one should not assume shared tooling, build systems, or dependencies with another.

## Structure

- **Root site** (`index.html`, `css/styles.css`, `js/main.js`) — a static, dependency-free HTML/CSS/vanilla-JS marketing page ("BlockCraft Guide"). No build step: open `index.html` directly or serve the directory statically. `js/main.js` is an IIFE handling mobile nav toggle, scroll-spy nav highlighting, a back-to-top button, and accordion-style FAQ items.
- **`demo/`** — standalone HTML demos (e.g. `motion-hero-demo.html`) with vendored JS libraries in `demo/vendor/` (e.g. `motion.bundle.js`). These are single-file, open-in-browser demos, not part of the root site's build.
- **`projects/`** — independent sub-projects, each with its own README and conventions. Don't assume conventions from one apply to another:
  - **`prompt-engineering-mentor/`** — a repo-based prompt-engineering course, not code. `MENTOR.md` holds the portable mentor system prompt (with annotations on why it's designed the way it is); `curriculum/` holds numbered lesson modules (work 01-02 in order, then 03-04 as a pair, then 05-06); `prompt-library/` is an index of proven prompts with a tagging schema (use case / format / strength) — entries only get added after being tested against real inputs, per `prompt-library/README.md`; `sessions/` logs one file per mentoring session using `_TEMPLATE.md`. When editing this project, follow its own ground rules (always explain *why* a prompt change was made; label behavioral claims as documented/widely-reproduced/untested).
  - **`location-map-demo/`** — a Vite + React + TypeScript + Tailwind subproject with its own `npm` scripts and isolated build. Features a `LocationMap` (expand-map) component integrated into a draggable, 3D-perspective interface using Aceternity UI's Draggable Card. Run with `cd projects/location-map-demo && npm install && npm run dev` (http://localhost:5173). Deploys as its own Vercel project with a separate root directory setting. See `projects/location-map-demo/README.md` for component integration details, token setup, and responsive behavior.
  - **`snapsite-website/`** — a static marketing site (`index.html`, `SnapSite.jsx` reference component) for a fictional field-photo/inspection app, plus a small live backend in `server/`: an Express server (`server/index.js`) exposing `POST /api/draft-report`, which streams a Claude completion via SSE to turn field notes into a draft inspection report. Run it with `cd projects/snapsite-website/server && npm install && export ANTHROPIC_API_KEY=sk-ant-... && npm start`, then open `http://localhost:3000`. Without the server running, the front-end demo falls back to a canned sample draft. The system prompt in `server/index.js` enforces a strict rule: never invent facts not present in the notes, and the output is always `status: "needs_approval"` (nothing is auto-saved). This sub-project has a comprehensive automated test suite — see Testing section below.

## Agent skills and plugins

### Claude Code Plugin: connect-apps-plugin
`connect-apps-plugin/` is a small Claude Code plugin for managing app connectors (Slack, Notion, Linear, Gmail, MCP connectors, etc.) directly from within a session.

**Load it:**
```bash
claude --plugin-dir ./connect-apps-plugin
```

**Commands:**
- `/connectors-list [keywords]` — lists installed connectors for the org and whether each is connected/enabled in the current chat
- `/connectors-find <app or task>` — searches the MCP connector registry for a named app (e.g. "asana") or intent (e.g. "manage my tasks")
- `/connectors-troubleshoot <connector name>` — diagnoses why a connector isn't working

These commands read status only via `ListConnectors`, `SearchMcpRegistry`, and `SuggestConnectors` tools — connector auth/management happens in claude.ai's settings.

### Installed agent skills

`.claude/skills/` and `.agents/skills/` hold installed Claude Code / Codex agent skills (design, UI, brand, Vercel, animation, writing-guidelines, `stop-slop`, etc.), tracked via `skills-lock.json` (records each skill's upstream GitHub source and content hash). These are vendored dependencies, not application code — don't hand-edit files under these directories; they'd be overwritten by the skill manager.

**Special case: nano-banana**
`.claude/skills/nano-banana/` is a repo-local, hand-maintained skill (not in `skills-lock.json`) for generating/editing images with Google's Nano Banana models (`gemini-2.5-flash-image` / `gemini-3-pro-image-preview`). Includes transformation presets (anime-to-life, photo-restoration, imax-portrait, real-mecha, etc.) and a J-Poses library. Requires `GEMINI_API_KEY`. Python deps are auto-installed on session start via the `SessionStart` hook (see Setup section).

### The Zeus prompt-engineering pipeline

`.claude/agents/zeus.md` defines a subagent meant as the first stop for messy, half-formed requests. It drives nine slash commands in `.claude/commands/` in a fixed sequence, each stage's output feeding the next: `/prompt-master` (raw input → task spec) → `/grill-me` (resolve open questions) → `/how-to` (execution roadmap) → `/48` or `/fable` (model-specific polish — pick one, not both) → `/personal-voice` (match the user's writing style) → `/anti-ai` (strip AI writing tells, using the `stop-slop` skill if available) → `/write-a-skill` (package as a reusable skill, unless it's a one-off) → `/handoff` (final handoff doc). Each command file is self-contained and can also be invoked directly outside the pipeline. Don't skip stages when running the full pipeline — the sequence is the point, not just the final output.

## Deployment

- `vercel.json` deploys the repo as a static site with no build/install command (`outputDirectory: "."`) — the root `index.html` is the deployed artifact. `.vercelignore` excludes non-site content from the deploy.

## Optional integrations

### NeuroLink — Multi-provider LLM integration

[NeuroLink](https://github.com/juspay/neurolink) is a universal AI integration platform unifying 30+ LLM providers (OpenAI, Anthropic, Google, AWS Bedrock, etc.) under a single consistent API.

**Install:**
```bash
npm install @juspay/neurolink    # or: pnpm add @juspay/neurolink
```

**Quick start:**
```javascript
import { NeuroLink } from '@juspay/neurolink';

const client = new NeuroLink({
  providers: ['openai', 'anthropic'],
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
  }
});

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'gpt-4',
  fallbackTo: 'claude-3-sonnet', // automatic fallback
});
```

Features: automatic fallback, cost-aware routing, multimodal (voice, images, PDFs, CSVs, Excel), RAG & MCP, conversation memory backends, enterprise observability.

See `NEUROLINK_INSTALLATION.md` for detailed setup.

### Graphify — AI coding assistant skill

[Graphify](https://github.com/Graphify-Labs/graphify) turns a folder of code, docs, papers, images, or videos into a queryable knowledge graph — no vector DB, just a real, traversable graph with labeled edges.

**Install:**
```bash
uv tool install graphifyy    # or: pipx install graphifyy
graphify install             # registers /graphify skill
```

**Quick start (in Claude Code):**
```
/graphify .
```

Produces `graphify-out/`:
- `graph.html` — interactive force-directed graph
- `GRAPH_REPORT.md` — key concepts, connections, suggested questions
- `graph.json` — full queryable graph

Features: local code parsing (tree-sitter AST, no LLM calls), labeled edges (EXTRACTED vs INFERRED), 20+ assistant integrations (Claude Code, Codex, Cursor, Aider, etc.).

See `GRAPHIFY_INSTALLATION.md` for prerequisites, troubleshooting, and optional extras (PDF, Office, video transcription).

### Python dependency

`pyproject.toml` declares one dependency, `google-antigravity` (the Google Antigravity SDK for building Gemini-based agents), installed via a venv + `pip install -e .`. It must be installed with `pip` because its PyPI wheel ships a compiled runtime binary. Import as `from google import antigravity` — the bare `antigravity` name collides with Python's stdlib easter-egg module.

## Setup and environment

### Python environment setup

```bash
python3 -m venv .venv
source .venv/bin/activate  # or: .venv\Scripts\activate on Windows
pip install -e .
```

### Windows setup

- **PowerShell:** Run `setup.ps1` for automated environment setup (Node, Python, virtual environment)
- **Batch:** Run `setup.bat` for a more basic setup option

See `WINDOWS_SETUP.md` for manual steps and troubleshooting.

### SessionStart hook

`.claude/settings.json` wires a `SessionStart` hook that runs `.claude/hooks/install-skill-deps.sh` (idempotent — checks if `google.genai` imports before installing). This auto-installs Python dependencies for `.claude/skills/nano-banana/` (Google Nano Banana image generation).

## Testing and verification

### Root-level test suite (Vitest)

The repo now includes a comprehensive test suite using Vitest v1 with jsdom, covering 100+ tests:

**Run tests:**
```bash
npm install              # one-time setup
npm test                 # run all tests
npm run test:ui         # interactive UI
npm run test:coverage   # coverage report
```

**Test files:**
- `js/main.test.js` — 39 tests for root site (mobile nav, FAQ state, markdown XSS safety, form validation, ARIA accessibility, keyboard navigation, localStorage quota)
- `projects/snapsite-website/index.test.js` — 38 tests for frontend demo (XSS, validation, SSE parsing, response streaming, timeout/retry logic)

Configuration: `vitest.config.js` (jsdom, globals, include `**/*.test.js`, exclude `node_modules` and `server/`)

### Project-specific testing

- **Root site / `demo/`**: manual browser testing — open the HTML file and check visually.
- **`projects/snapsite-website/server`**: Express API test suite — `cd projects/snapsite-website/server && npm install && npm test` (Node's built-in test runner + `supertest`, against a mocked Anthropic client — no `ANTHROPIC_API_KEY` or network access needed). 23 tests cover request validation, prompt assembly, SSE event framing, the `needs_approval` invariant, and request body size limits. Run after touching `server/index.js`.
- **`projects/location-map-demo`**: manual browser testing — `cd projects/location-map-demo && npm run dev` and check the draggable map interface.
- **`projects/prompt-engineering-mentor`**: "testing" means running the prompts in `prompt-library/` against a real model and checking output against the criteria described in `prompt-library/README.md`, not automated tests.

### Test coverage summary

See `TEST_COVERAGE_IMPROVEMENTS.md` for the full breakdown of 100 tests across security (XSS, form validation), state management, error handling, accessibility (ARIA, keyboard nav), storage (quota enforcement), and network resilience (streaming, timeouts, retries).
