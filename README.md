# Claude-Repo

A starter repository for experimenting with Claude Code on the web.

## Getting started

Clone the repo and open it in [Claude Code](https://claude.ai/code) to start building with AI assistance.

## Dependencies

- [`google-antigravity`](https://pypi.org/project/google-antigravity/) — the [Google Antigravity SDK](https://github.com/Google-Antigravity/antigravity-sdk-python) for building AI agents with Gemini. Install with:

  ```sh
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -e .
  ```

  The package ships a compiled runtime binary in its PyPI wheels, so it must be installed via `pip` (not just cloned from GitHub). Import it as `from google import antigravity` — the top-level `antigravity` name is reserved by Python's stdlib easter-egg module.

## Testing the root site

The root site (`index.html`, `css/styles.css`, `js/main.js`) has no build step and
is deployed as-is (see `vercel.json`), but its interactive JS is covered by a
small jsdom-based test suite:

```sh
npm install
npm test
```

This exercises `js/main.js` (mobile nav toggle, scroll-spy highlighting,
back-to-top visibility, FAQ accordion) against the real `index.html` markup.
It's dev-only tooling — `node_modules` is gitignored and nothing here affects
the deployed static site.

## Skills

- `nano-banana` (`.claude/skills/nano-banana/`) — generate and edit images with Google's Nano Banana models (`gemini-2.5-flash-image` / `gemini-3-pro-image-preview`). Text-to-image and image-to-image with curated transformation presets (anime-to-life, photo-restoration, imax-portrait, real-mecha, character-reference-sheet, j-idol, j-cover, figure-to-life) plus a J-Poses library. Presets ported from [ShinChven/nano-banana-skills](https://github.com/ShinChven/nano-banana-skills).

## Resources

- [Claude Code documentation](https://code.claude.com/docs)
- [Claude API reference](https://docs.anthropic.com)
