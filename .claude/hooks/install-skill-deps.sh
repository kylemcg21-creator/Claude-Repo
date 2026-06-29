#!/usr/bin/env bash
# SessionStart hook: ensure Python deps for the nano-banana skill are available
# in fresh (e.g. Claude Code on the web) environments. Idempotent and quiet.
set -u

REQ=".claude/skills/nano-banana/requirements.txt"

# Already installed? Nothing to do.
if python3 -c "import google.genai" >/dev/null 2>&1; then
  exit 0
fi

if [ -f "$REQ" ]; then
  echo "[nano-banana] installing image-generation deps..." >&2
  python3 -m pip install -q -r "$REQ" >&2 2>&1 || \
    echo "[nano-banana] pip install failed; run 'pip install -r $REQ' manually." >&2
fi

exit 0
