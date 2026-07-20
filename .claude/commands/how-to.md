---
description: Maps the steps you don't know yet — stage 03 of the Zeus prompt pipeline.
---

Given the clarified spec (from `/grill-me`, or $ARGUMENTS), produce a step-by-step execution roadmap — not the execution itself.

For each step:

- Number it in dependency order.
- Mark it **known** (routine, no discovery needed) or **needs discovery** (requires research, a spike, or a decision before it can be planned precisely).
- For anything marked needs-discovery, name specifically what's unknown and how it would get resolved (read a file, ask the user, run a lookup, etc.) — don't hand-wave it.

The output is a roadmap of what to do and what's still fuzzy about how to do it. This feeds the polish stage next (`/48` or `/fable`, depending on the target model) — it does not feed execution directly.
