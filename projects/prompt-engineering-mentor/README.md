# Prompt Engineering Mentor

A repo-based learning system for mastering prompt design across AI models and contexts. It turns the mentorship into something durable: a curriculum you work through, a prompt library that grows with you, and a session log that forces the meta-analysis where real learning happens.

## Why a repo instead of a chat?

Chat-based learning evaporates. This system persists three things a chat can't:

1. **A curriculum** you can revisit, annotate, and check off (`curriculum/`)
2. **A prompt library** — your accumulating asset of proven, tagged prompts (`prompt-library/`)
3. **A session log** — the mastery loop: what worked, what didn't, what principle you extracted (`sessions/`)

The mentor persona itself lives in [`MENTOR.md`](MENTOR.md), which doubles as a worked example of prompt optimization — it's a production-grade rebuild of the prompt that created this project, with annotations explaining every decision.

## Directory map

```
prompt-engineering-mentor/
├── MENTOR.md                     ← the mentor system prompt (portable, annotated)
├── curriculum/
│   ├── 01-foundations.md         ← context hierarchy, clarity, specificity, intent alignment
│   ├── 02-prompt-architecture.md ← role/goal/constraints/format; XML vs JSON vs prose; model differences
│   ├── 03-applied-practice.md    ← build real prompts; word-level sensitivity experiments
│   ├── 04-debugging-optimization.md ← failure taxonomy, rebuild patterns, cross-model testing
│   ├── 05-system-design.md       ← chains, loops, multi-agent systems, memory layering
│   └── 06-mastery-loop.md        ← library maintenance, meta-analysis ritual, self-assessment
├── prompt-library/
│   ├── README.md                 ← tagging schema + index
│   ├── _TEMPLATE.md              ← blank entry template
│   └── *.md                      ← your prompts (starter entries included)
└── sessions/
    ├── _TEMPLATE.md              ← session meta-analysis template
    └── YYYY-MM-DD-session-NN.md  ← one file per mentoring session
```

## How to run a mentoring session

1. **Open a session** with Claude (or any capable model) using `MENTOR.md` as the system prompt or first message.
2. **Pick a focus**: either the next curriculum module, or a real task you're facing (the mentor will map it onto the curriculum).
3. **Work the loop**: draft a prompt → run it → critique the output together → rebuild → re-run. Every module is built around this loop, not around reading.
4. **Close the session** by filling in a copy of `sessions/_TEMPLATE.md`. This is not optional busywork — the meta-analysis is where the principle gets extracted from the experience.
5. **Bank the wins**: any prompt that survived testing goes into `prompt-library/` using `_TEMPLATE.md`, tagged so you can find it again.

## Curriculum sequence

Work modules 1–2 in order — everything else builds on them. Modules 3–4 are a pair (build, then debug) and can be revisited any number of times with different tasks. Modules 5–6 come last.

| Module | What you'll be able to do afterward |
|---|---|
| [01 Foundations](curriculum/01-foundations.md) | Explain *why* a prompt works or fails, using four core principles |
| [02 Prompt Architecture](curriculum/02-prompt-architecture.md) | Structure prompts in layers; choose XML/JSON/prose deliberately; adapt across models |
| [03 Applied Practice](curriculum/03-applied-practice.md) | Build an optimized prompt for a real task; predict how small edits change behavior |
| [04 Debugging & Optimization](curriculum/04-debugging-optimization.md) | Diagnose a failing prompt by failure class and rebuild it systematically |
| [05 System Design](curriculum/05-system-design.md) | Compose prompts into chains, loops, and multi-agent workflows |
| [06 Mastery Loop](curriculum/06-mastery-loop.md) | Run the documentation and self-assessment practice that compounds skill over time |

## Checking the repo's structure

This project is markdown, not code — its real test is running prompts from
`prompt-library/` against a live model and scoring the output against the
criteria in `prompt-library/README.md`, which no automated suite can do. What
*is* checkable without a model is whether the repo's own conventions still
hold — every curriculum module has its standard sections, every prompt-library
entry follows `_TEMPLATE.md` and is tagged consistently with the README index,
and every session follows `sessions/_TEMPLATE.md`. Run it with:

```sh
cd projects/prompt-engineering-mentor
npm test
```

## Ground rules (inherited from the mentor)

- **Always explain the why.** A prompt edit without a stated reason is a superstition, not a technique.
- **Experiment over doctrine.** Every claim about model behavior is testable — test it.
- **Teaching over producing.** The goal is that *you* can build the prompt next time, not that a prompt got built.
- **Structured, visual, practical.** Tables, before/after diffs, and checklists beat walls of prose.
