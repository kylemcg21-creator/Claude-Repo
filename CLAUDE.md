# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is a sandbox/starter repo for experimenting with Claude Code on the web. It is not a single application — it's a loose collection of independent, self-contained demos and mini-projects at various levels of completeness. Treat each top-level item (root site, `demo/`, each folder under `projects/`) as its own isolated context; changes in one should not assume shared tooling, build systems, or dependencies with another.

## Structure

- **Root site** (`index.html`, `css/styles.css`, `js/main.js`) — a static, dependency-free HTML/CSS/vanilla-JS marketing page ("BlockCraft Guide"). No build step: open `index.html` directly or serve the directory statically. `js/main.js` is an IIFE handling mobile nav toggle, scroll-spy nav highlighting, a back-to-top button, and accordion-style FAQ items.
- **`demo/`** — standalone HTML demos (e.g. `motion-hero-demo.html`) with vendored JS libraries in `demo/vendor/` (e.g. `motion.bundle.js`). These are single-file, open-in-browser demos, not part of the root site's build.
- **`projects/`** — independent sub-projects, each with its own README and conventions. Don't assume conventions from one apply to another:
  - **`prompt-engineering-mentor/`** — a repo-based prompt-engineering course, not code. `MENTOR.md` holds the portable mentor system prompt (with annotations on why it's designed the way it is); `curriculum/` holds numbered lesson modules (work 01-02 in order, then 03-04 as a pair, then 05-06); `prompt-library/` is an index of proven prompts with a tagging schema (use case / format / strength) — entries only get added after being tested against real inputs, per `prompt-library/README.md`; `sessions/` logs one file per mentoring session using `_TEMPLATE.md`. When editing this project, follow its own ground rules (always explain *why* a prompt change was made; label behavioral claims as documented/widely-reproduced/untested).
  - **`snapsite-website/`** — a static marketing site (`index.html`, `SnapSite.jsx` reference component) for a fictional field-photo/inspection app, plus a small live backend in `server/`: an Express server (`server/index.js`) exposing `POST /api/draft-report`, which streams a Claude (`claude-opus-4-8`) completion via SSE to turn field notes into a draft inspection report. Run it with `cd projects/snapsite-website/server && npm install && export ANTHROPIC_API_KEY=sk-ant-... && npm start`, then open `http://localhost:3000`. Without the server running, the front-end demo falls back to a canned sample draft. The system prompt in `server/index.js` enforces a strict rule: never invent facts not present in the notes, and the output is always `status: "needs_approval"` (nothing is auto-saved). This is the one sub-project with an automated test suite — see below.

## The Zeus prompt-engineering pipeline

`.claude/agents/zeus.md` defines a subagent meant as the first stop for messy, half-formed requests. It drives nine slash commands in `.claude/commands/` in a fixed sequence, each stage's output feeding the next: `/prompt-master` (raw input → task spec) → `/grill-me` (resolve open questions) → `/how-to` (execution roadmap) → `/48` or `/fable` (model-specific polish — pick one, not both) → `/personal-voice` (match the user's writing style) → `/anti-ai` (strip AI writing tells, using the `stop-slop` skill if available) → `/write-a-skill` (package as a reusable skill, unless it's a one-off) → `/handoff` (final handoff doc). Each command file is self-contained and can also be invoked directly outside the pipeline. Don't skip stages when running the full pipeline — the sequence is the point, not just the final output.

## Agent skills

- `.claude/skills/` and `.agents/skills/` hold installed Claude Code / Codex agent skills (design, UI, brand, Vercel, animation, writing-guidelines, `stop-slop`, etc.), tracked via `skills-lock.json` (records each skill's upstream GitHub source and content hash). These are vendored dependencies, not application code — don't hand-edit files under these directories; they'd be overwritten by the skill manager.
- `.claude/skills/nano-banana/` is the one exception: a repo-local, hand-maintained skill (not in `skills-lock.json`) for generating/editing images with Google's Nano Banana models, with its own `scripts/generate.py` and preset library. It requires `GEMINI_API_KEY`. Its Python deps are auto-installed on session start via the `SessionStart` hook wired in `.claude/settings.json`, which runs `.claude/hooks/install-skill-deps.sh` (idempotent — checks whether `google.genai` already imports before installing anything).

## Deployment

- `vercel.json` deploys the repo as a static site with no build/install command (`outputDirectory: "."`) — the root `index.html` is the deployed artifact. `.vercelignore` excludes non-site content from the deploy.

## Python dependency

- `pyproject.toml` declares one dependency, `google-antigravity` (the Google Antigravity SDK for building Gemini-based agents), installed via a venv + `pip install -e .` (per `README.md`). It must be installed with `pip`, not just cloned, because its PyPI wheel ships a compiled runtime binary. Import it as `from google import antigravity` — the bare `antigravity` name collides with Python's stdlib easter-egg module.

## Testing and verification

There is no root-level package.json, test runner, or linter for the repo as a whole. Verification is project-specific:
- Root site / `demo/`: open the HTML file in a browser and check it manually — there's no build or test step.
- `projects/snapsite-website/server`: has an actual test suite — `cd projects/snapsite-website/server && npm install && npm test` (Node's built-in test runner + `supertest`, against a mocked Anthropic client — no `ANTHROPIC_API_KEY` or network access needed). Covers request validation, prompt assembly, SSE event framing, the `needs_approval` invariant, and the request body size limit. Run this after touching `server/index.js`.
- `projects/prompt-engineering-mentor`: "testing" means running the prompts in `prompt-library/` against a real model and checking output against the criteria described in `prompt-library/README.md`, not automated tests.
