---
description: Bottles the finished prompt as a reusable skill — stage 08 of the Zeus prompt pipeline.
---

Take the cleaned, finished prompt (from `/anti-ai`, or $ARGUMENTS) and package it as a reusable Claude Code skill, so this exact workflow doesn't need to be re-derived next time.

If the `skill-creator` skill is available, use it. Otherwise produce a `SKILL.md`-shaped file with:

- A name and a description written for triggering — what request should cause this skill to fire, in concrete terms (not just a topic label).
- The finished prompt's instructions as the skill body, generalized just enough to be reusable (strip anything that was one-off/session-specific from `/prompt-master`'s original brain dump, keep everything that's a durable rule).

If this run doesn't warrant a reusable skill (a true one-off task), say so and skip straight to `/handoff` instead of forcing a skill into existence.
