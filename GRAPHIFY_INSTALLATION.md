# Graphify Installation Guide

[Graphify](https://github.com/Graphify-Labs/graphify) is an AI coding
assistant skill — for Claude Code, Codex, Cursor, and 15+ other assistants —
that turns a folder of code, docs, papers, images, or videos into a
queryable knowledge graph you can search instead of grepping through files.

## Installation

### Prerequisites

- Python 3.10+
- [`uv`](https://docs.astral.sh/uv/) (recommended) or [`pipx`](https://pypa.github.io/pipx/)

### Step 1 — install the CLI

```bash
uv tool install graphifyy      # recommended: isolated env
# or
pipx install graphifyy
```

> **Naming note:** the PyPI package is `graphifyy` (double-y) — other
> `graphify*` packages on PyPI are not affiliated. The installed command is
> still `graphify`.

If `graphify: command not found` shows up right after install, the tool bin
dir (`~/.local/bin`) isn't on `PATH` yet:

```bash
uv tool update-shell   # or: pipx ensurepath
```

then open a new terminal.

### Step 2 — register the assistant skill

```bash
graphify install
```

This registers a `/graphify` skill for Claude Code by default. To install
into this repo instead of your user profile (writes under
`.claude/skills/graphify/SKILL.md`, alongside this repo's other vendored
skills):

```bash
graphify install --project
```

For other assistants, pass `--platform`, e.g. `graphify install --platform codex`.

## Quick start

```bash
graphify install
```

Then, inside your AI assistant:

```
/graphify .
```

That produces three files under `graphify-out/`:

- `graph.html` — an interactive force-directed graph, open in any browser
- `GRAPH_REPORT.md` — key concepts, surprising connections, suggested questions
- `graph.json` — the full graph, queryable without re-reading source files

## Key features

- **Code maps are fully local.** Code is parsed with tree-sitter AST —
  deterministic, no LLM calls, nothing leaves your machine. Docs, PDFs,
  images, and video use your assistant's model (or a configured API key) for
  a semantic pass.
- **Every edge is labeled.** Connections are tagged `EXTRACTED` (explicit in
  the source) or `INFERRED` (resolved by graphify), so you can tell what was
  read directly from what was inferred.
- **Not a vector index.** No embeddings, no vector store — a real graph you
  traverse, not a retrieval layer.

## Optional extras

Install only what you need, e.g.:

```bash
uv tool install "graphifyy[pdf]"    # PDF extraction
uv tool install "graphifyy[office]" # .docx / .xlsx support
uv tool install "graphifyy[video]"  # video/audio transcription
uv tool install "graphifyy[mcp]"    # MCP stdio server
uv tool install "graphifyy[all]"    # everything
```

## Troubleshooting

**`graphify: command not found`** — the tool bin dir isn't on `PATH` yet;
run `uv tool update-shell` (or `pipx ensurepath`) and open a new terminal.

**`ModuleNotFoundError: No module named 'graphify'` after `pip install`** —
avoid plain `pip install` if possible. The skill resolves Python at runtime
from `graphify-out/.graphify_python`; if that points to a different
environment than where `pip` installed the package, resolution breaks.
`uv tool install` and `pipx install` isolate the package and avoid this
entirely.

## Resources

- [Graphify GitHub](https://github.com/Graphify-Labs/graphify)
- [Graphify on PyPI](https://pypi.org/project/graphifyy/)
