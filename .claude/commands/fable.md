---
description: Same polish, but for Fable 5 — stage 04 of the Zeus prompt pipeline (alternate to /48).
---

Take the current draft prompt (from `/how-to`'s roadmap folded into prose, or $ARGUMENTS) and rewrite it to get the best results specifically from **Fable 5**.

Use exactly one of `/48` or `/fable` per pipeline run — pick `/fable` when the finished prompt is meant to drive Fable 5 specifically. Never run both on the same draft.

Fable 5 tuning checklist:

- Keep instructions concrete and directive — state exactly what's wanted rather than relying on inference.
- Favor clear, bounded output specs (format, length, structure) over open-ended asks.
- Preserve every concrete constraint and piece of context from the spec; polishing tone must not drop information.
- If the task is creative or narrative in nature, give Fable 5 explicit latitude where creativity is wanted and explicit limits where it isn't — don't leave that ambiguous.

Output the rewritten prompt only — this feeds `/personal-voice` next.
