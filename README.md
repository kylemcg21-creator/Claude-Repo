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

## Resources

- [Claude Code documentation](https://code.claude.com/docs)
- [Claude API reference](https://docs.anthropic.com)
