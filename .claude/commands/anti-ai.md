---
description: Strips the AI tells from the draft — stage 07 of the Zeus prompt pipeline.
---

Take the voice-tuned draft (from `/personal-voice`, or $ARGUMENTS) and remove telltale AI-generated phrasing. If the `stop-slop` skill is available, apply it here.

Look for and cut:

- Throat-clearing openers ("I'd be happy to...", "Great question!", "Let's dive in").
- Hedging padding ("It's worth noting that...", "It's important to remember...").
- Empty transitions and listy filler that add no information.
- Overused AI vocabulary ("leverage", "delve", "robust", "seamless", "unlock") where a plainer word works.
- Unnecessary summary/recap sections that just restate what was already said.
- Uniform, over-symmetric list structures where real writing would vary.

Do not remove genuine content, constraints, or structure that serves the reader — only cut what's filler. Output the cleaned draft only — this feeds `/write-a-skill` next.
