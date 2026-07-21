# Research synthesis for a decision

**Tags:** use-case: `research` · format: `structured-md` · strength: `proven`
**Models tested:** Claude (2026-07)
**Situational conditions:** —

## The prompt

```text
You are a research analyst briefing {{DECISION_MAKER}} who will skim
your output in 3 minutes.

Context: {{THE DECISION BEING MADE, WHAT IS ALREADY SETTLED, AND WHAT
IS OUT OF SCOPE}}. The live question is {{THE SPECIFIC QUESTION}},
broken into these areas: {{3-5 NAMED SUB-AREAS}}.

Synthesize what is known about each area, under these rules:
- Label each claim's evidence tier: strong study / survey or
  self-report / anecdote or expert opinion
- Where evidence is mixed, say so explicitly; where it clearly leans
  one way, say that too. Do not manufacture balance.
- Flag anything likely outdated given {{RELEVANT RECENT CHANGES,
  e.g. "post-2021 tooling"}}
- Max {{N}} words

Format: one short paragraph per area, then a 3-line bottom line:
what the evidence supports, what it doesn't settle, and what would
most change the conclusion.
```

## Placeholders

| Placeholder | What goes there |
|---|---|
| `{{DECISION_MAKER}}` | Who consumes this and how (sets compression level) |
| `{{CONTEXT...}}` | The decision, what's already ruled in/out — kills irrelevant sections before generation |
| `{{THE SPECIFIC QUESTION}}` + sub-areas | Converts an unanswerably broad topic into 3–5 answerable ones |
| `{{N}}` | Quantified length — adjective lengths ("brief") don't bind |

## Why it works

- **Scope-as-filter**: stating what's settled and out of scope removes the most likely generic sections (intent alignment, Module 01).
- **Named sub-areas**: decomposition inside a single prompt — each area gets dedicated attention instead of a blended overview (Module 03).
- **Evidence-tier labeling**: forces the model to expose the quality of its own claims; generic listicle content can't survive the rule (Module 03 worked example).
- **"Do not manufacture balance"**: blocks the false-balance default that "be balanced" instructions actively train toward (Module 03 sensitivity table).
- **"What would most change the conclusion"**: makes the output carry its own uncertainty structure — the decision-grade upgrade.

## Testing evidence

- **Probes:** remote-work policy question (Module 03 worked example); one deliberately over-broad topic as edge case
- **Criteria:** no unlabeled claims; mixed-evidence areas identified as such; within word budget; bottom-line present
- **Result:** met criteria on real inputs, single model — `proven`

## Known limitations

- Evidence tiers are the model's self-assessment, not verification — for high-stakes decisions, pair with retrieval/sources and require citations to them.
- Very recent developments (post-cutoff) get flagged at best, not filled in; pair with a search-capable model or tool when recency is load-bearing.

## Changelog

- 2026-07-16 — banked from curriculum Module 03 worked example.
