# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A starter repository for experimenting with Claude Code on the web (see `README.md`). It is not a single application — it's a loose collection of static demo sites and experiments, each self-contained, plus a large set of installed AI-agent skills. There is no root build system, package manager, bundler, or test suite; everything is deployed as-is.

## Repo layout

- `index.html`, `css/styles.css`, `js/main.js` — the root static site: a single-page "BlockCraft Guide" (Minecraft building guide) demo. Plain HTML/CSS/vanilla JS, no framework, no build step. CSS is organized with `/* ---------- Section ---------- */` banner comments (Tokens, Header, Buttons, Hero, Cards, FAQ, etc.) inside `:root`-based custom-property tokens.
- `demo/` — standalone animation demo(s), e.g. `motion-hero-demo.html`, which imports the local `demo/vendor/motion.bundle.js` (a vendored copy of Motion.dev) as an ES module. Fully self-contained, no build step.
- `projects/snapsite-website/` — a second, separate static site ("SnapSite" marketing site) with its own `index.html` and a `SnapSite.jsx` (React component source, hand-authored icons, not currently wired into a build pipeline — treat it as a reference/source file for the design rather than something that gets compiled here).
  - `projects/snapsite-website/server/` — a small Express backend (`index.js`) that powers the site's "AI report drafting" demo. It calls the Anthropic Claude API (`claude-opus-4-8`) via `@anthropic-ai/sdk`, streams the response back to the browser over SSE (`/api/draft-report`), and serves the static site from the parent directory. Requires `ANTHROPIC_API_KEY` in the environment. See `projects/snapsite-website/server/README.md` for the exact run steps and endpoint contract. Without the server running, the front-end demo falls back to a canned sample draft.
- `.claude/skills/` and `.agents/skills/` — installed Claude Code / Codex agent skills (design, UI, brand, Vercel, animation, writing-guidelines, etc.), tracked via `skills-lock.json` (records each skill's upstream GitHub source and content hash). These are vendored dependencies, not application code — don't hand-edit files under these directories; they'd be overwritten by the skill manager.
- `pyproject.toml` / `.venv` — local Python tooling only, for the optional `google-antigravity` SDK dependency mentioned in `README.md`. Not used by the deployed site (see Deployment below).

## Adding a new project/demo

Follow the existing pattern: each experiment lives in its own directory (either top-level like `demo/`, or under `projects/<name>/`) as a self-contained static HTML/CSS/JS bundle. Don't introduce a shared build system unless a project actually needs one — vendor any JS dependency locally (as `demo/vendor/motion.bundle.js` does) rather than adding a package manager at the root.

## Running things locally

- Static pages (`index.html`, `demo/*.html`, `projects/snapsite-website/index.html`) can be opened directly in a browser — no server required.
- SnapSite's live AI-drafting endpoint needs the Express server:
  ```sh
  cd projects/snapsite-website/server
  npm install
  export ANTHROPIC_API_KEY=sk-ant-...
  npm start
  ```
  Then open `http://localhost:3000`.
- Python deps (only needed for `google-antigravity`, unrelated to the sites):
  ```sh
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -e .
  ```
  Import it as `from google import antigravity` — the top-level `antigravity` name is reserved by Python's stdlib easter-egg module.

There is no lint, test, or build command configured at the repo root.

## Deployment

The repo deploys to Vercel as a static site (`vercel.json`: `framework: null`, `outputDirectory: "."`). `.vercelignore` deliberately excludes `pyproject.toml` and `projects/snapsite-website/server` so Vercel doesn't mis-detect the repo as a Python or Node app — the Express server is for local use only and is not part of the deployed static output.
