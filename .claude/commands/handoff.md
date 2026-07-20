---
description: Creates a handoff doc to start your next chat — stage 09 (final) of the Zeus prompt pipeline.
---

Take everything produced by the pipeline so far (from `/write-a-skill` or `/anti-ai`, or $ARGUMENTS) and produce one self-contained handoff document that lets a fresh chat — with no memory of this conversation — pick up cold.

Include:

- **Clear goal** — the one-sentence goal from `/prompt-master`, unchanged in substance.
- **Full context** — decisions made, constraints confirmed in `/grill-me`, the roadmap from `/how-to`, files/paths touched or referenced, and anything ruled out along the way.
- **The ready-to-use prompt** — the final `/anti-ai`-cleaned text, in the user's voice, ready to paste as-is.
- **Voice notes** — a short note on the tone/phrasing calibration from `/personal-voice`, so future polish stays consistent.

This is the pipeline's finish line. After producing it, ask the user whether they want it started now (dispatch via the `Agent` tool to whichever agent type fits) or saved for them to paste into a new chat themselves — don't assume either.
