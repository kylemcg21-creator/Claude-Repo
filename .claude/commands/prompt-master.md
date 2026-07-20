---
description: Brain dump in, clean task spec out — stage 01 of the Zeus prompt pipeline.
---

Take the user's raw, messy input — a brain dump, rambling description, half-formed idea, or the text passed as $ARGUMENTS — and turn it into a clean task spec. Do not execute the task and do not add scope that wasn't implied. Reorganize signal out of noise; don't invent requirements.

Output exactly this shape:

- **Goal** — one sentence: what does success look like.
- **Context** — relevant background, constraints, or prior decisions already implied in the brain dump.
- **Deliverable** — what artifact or outcome is expected.
- **Open questions** — anything genuinely unclear that still needs resolving. If the brain dump already answers something, do not list it here.

This is the input to `/grill-me` next — the open-questions list is what that stage works through.
