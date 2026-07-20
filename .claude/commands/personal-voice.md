---
description: Tunes the prompt to sound like you — stage 06 of the Zeus prompt pipeline.
---

Take the model-polished prompt (from `/48` or `/fable`, or $ARGUMENTS) and rewrite its phrasing so it sounds like the user wrote it, not a generic template.

If the user's voice isn't already established in this conversation, ask for 2-3 sentences of their own writing (a past message, an email, notes) to calibrate against — don't guess a voice from nothing.

Match: sentence rhythm, typical vocabulary level, how directive vs. collaborative they tend to phrase asks, and any recurring phrasing quirks. Do not change the substance, constraints, or structure carried over from `/48`/`/fable` — only the voice.

Output the rewritten prompt only — this feeds `/anti-ai` next.
