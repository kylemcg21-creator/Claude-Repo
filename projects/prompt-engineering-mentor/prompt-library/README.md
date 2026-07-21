# Prompt Library

Proven, tested prompts — the accumulating asset of this course. **Entry bar:** a prompt gets banked only after it has been run against real inputs and met written criteria (see [Module 03](../curriculum/03-applied-practice.md), step 4). Drafts live in session files, not here.

New entry: copy [`_TEMPLATE.md`](_TEMPLATE.md), fill in every section (especially *Why it works* — an entry without its reasoning is a cargo-cult artifact), tag it on all three axes, and add a row to the index below.

## Tagging schema

Three axes. Tag every entry on each.

**Use case** — what job it does:
`research` · `content` · `data-analysis` · `code` · `extraction` · `critique` · `planning` · `debrief` · `system-component` (part of a pipeline/loop)

**Format** — the output contract:
`prose` · `structured-md` (tables/sections) · `json` · `list` · `dialogue` · `mixed`

**Strength** — trust level, earned by testing:
- `battle-tested` — Stable across probes on 2+ models, used repeatedly in real work
- `proven` — met criteria on probes, one model, real inputs
- `situational` — works well but depends on stated conditions (model, context length, input type — must be noted in the entry)
- `graveyard` — failed re-testing; kept with a cause-of-death note because dead entries teach too

## Index

| Entry | Use case | Format | Strength |
|---|---|---|---|
| [research-synthesis](research-synthesis.md) | research | structured-md | proven |
| [structured-extraction](structured-extraction.md) | extraction | json | proven |
| [code-review-critic](code-review-critic.md) | code, critique | structured-md | proven |
| [session-debrief](session-debrief.md) | debrief | structured-md | proven |

## Maintenance rules

- **Changelog on every improvement** — what changed and what observation drove it (git commit messages count).
- **Monthly re-test** of the 3 most-used entries against current models; downgrade or graveyard on failure ([Module 06](../curriculum/06-mastery-loop.md) cadence).
- **Retrieval test**: if finding the right entry took over a minute, fix the tags or the index now.
