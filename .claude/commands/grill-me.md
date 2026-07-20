---
description: Asks questions until nothing in the task spec is vague — stage 02 of the Zeus prompt pipeline.
---

Take the current task spec (from `/prompt-master`, or from $ARGUMENTS if given directly) and interrogate it.

For every open question or ambiguous point, ask the user directly — one focused question at a time, or a small batch of clearly related ones. Keep going until:

- Scope is unambiguous (what's in, what's explicitly out)
- Success criteria are concrete enough to check against
- No term in the spec could reasonably mean two different things
- Any destructive, hard-to-reverse, or high-blast-radius implication has been surfaced and confirmed

Do not ask about anything you can resolve yourself by reading the repo or that wouldn't change the outcome either way — only ask what actually matters. Prefer `AskUserQuestion` with concrete options over open-ended questions when the space of answers is small.

When nothing is left vague, restate the spec cleanly (same shape as `/prompt-master`'s output, now with the open-questions section resolved or empty) and hand off to `/how-to`.
