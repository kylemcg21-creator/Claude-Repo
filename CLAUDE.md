# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is a sandbox/starter repo for experimenting with Claude Code on the web. It is not a single application — it's a loose collection of independent, self-contained demos and mini-projects at various levels of completeness. Treat each top-level item (root site, `demo/`, each folder under `projects/`) as its own isolated context; changes in one should not assume shared tooling, build systems, or dependencies with another.

## Structure

- **Root site** (`index.html`, `css/styles.css`, `js/main.js`) — a static, dependency-free HTML/CSS/vanilla-JS marketing page ("BlockCraft Guide").
- **`demo/`** — standalone HTML demos (e.g. `motion-hero-demo.html`) with vendored JS libraries in `demo/vendor/` (e.g. `motion.bundle.js`). These are single-file, open-in-browser demos, not part of the root site's build.
- **`projects/`** — independent sub-projects, each with its own README, conventions, and CLAUDE.md (where present). Don't assume conventions from one apply to another.

## The Zeus prompt-engineering pipeline

`.claude/agents/zeus.md` defines a subagent meant as the first stop for messy, half-formed requests. It drives nine slash commands in `.claude/commands/` in a fixed sequence, each stage's output feeding the next: `/prompt-master` (raw input → task spec) → `/grill-me` (resolve open questions) → `/how-to` (execution roadmap) → `/48` or `/fable` (model-specific polish — pick one, not both) → `/personal-voice` (match the user's writing style) → `/anti-ai` (strip AI writing tells, using the `stop-slop` skill if available) → `/write-a-skill` (package as a reusable skill, unless it's a one-off) → `/handoff` (final handoff doc). Each command file is self-contained and can also be invoked directly outside the pipeline. Don't skip stages when running the full pipeline — the sequence is the point, not just the final output.

## Agent skills

- `.claude/skills/` and `.agents/skills/` hold installed Claude Code / Codex agent skills (design, UI, brand, Vercel, animation, writing-guidelines, `stop-slop`, etc.), tracked via `skills-lock.json` (records each skill's upstream GitHub source and content hash). These are vendored dependencies, not application code — don't hand-edit files under these directories; they'd be overwritten by the skill manager.
- `.claude/skills/nano-banana/` is the one exception: a repo-local, hand-maintained skill (not in `skills-lock.json`) for generating/editing images with Google's Nano Banana models, with its own `scripts/generate.py` and preset library. It requires `GEMINI_API_KEY`. Its Python deps are auto-installed on session start via the `SessionStart` hook wired in `.claude/settings.json`, which runs `.claude/hooks/install-skill-deps.sh` (idempotent — checks whether `google.genai` already imports before installing anything).

## Python dependency

- The `google-antigravity` dependency must be installed with `pip`, not just cloned, because its PyPI wheel ships a compiled runtime binary. Import it as `from google import antigravity` — the bare `antigravity` name collides with Python's stdlib easter-egg module.

## Testing and verification

There is no root-level package.json, test runner, or linter for the repo as a whole. Verification is project-specific:
- Root site / `demo/`: open the HTML file in a browser and check it manually — there's no build or test step.
- `projects/snapsite-website` and `projects/prompt-engineering-mentor`: see each project's own CLAUDE.md.
