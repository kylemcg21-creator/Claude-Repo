# Module 06 — Documentation & The Mastery Loop

## Lesson Focus

The practice layer: maintaining a **prompt library** that compounds, and running the **session meta-analysis** that converts experience into transferable principles. This module has the least content and the most leverage — skill without documentation plateaus at whatever fits in your head.

### Why documentation is the mastery mechanism (not the paperwork)

Two facts make this non-optional:

1. **Prompting knowledge is perishable.** Models update; a trick that worked in March silently stops mattering in June. Undocumented knowledge can't be re-tested, so you can't tell your live skills from your expired ones.
2. **Learning happens at extraction, not experience.** Running 50 prompt experiments teaches you almost nothing if each result evaporates. The step where you write *"principle: quantified length constraints bind, adjective ones don't"* is the step where the experiment becomes yours.

The loop, one sentence: **work → log the session → extract the principle → bank the prompt → re-test the bank periodically.**

### The prompt library

Lives in [`prompt-library/`](../prompt-library/). The rules that keep it useful:

- **Entry bar: survived testing.** A prompt gets banked only after it's been run against real inputs and met written criteria (Module 03, step 4). The library is proven assets, not drafts — the moment untested prompts get in, you stop trusting it, and an untrusted library dies.
- **Every entry carries "why it works."** A prompt without its reasoning is a cargo-cult artifact — you can't adapt it to a new situation, only copy it and hope. The why-note is what makes an entry *reusable* rather than *re-runnable*.
- **Three tag axes** — use case, format, strength — defined in the [library README](../prompt-library/README.md). Tags exist for one purpose: future-you, mid-task, finding the right entry in under a minute.
- **Entries have a changelog.** When you improve a banked prompt, note what changed and what observation drove it (git commits count, per Module 05).
- **Prune ruthlessly.** An entry that fails re-testing gets fixed or moved to a graveyard section with a note on how it died. Dead entries teach too — but only if labeled dead.

### The session meta-analysis

Every working session ends with a copy of [`sessions/_TEMPLATE.md`](../sessions/_TEMPLATE.md), filled in. Five minutes, four questions:

1. **What worked?** — concrete: which prompt, which edit, which pattern.
2. **What didn't?** — with the failure class (Module 04 taxonomy). Naming the class is what makes failures searchable later.
3. **What principle was learned?** — one line, stated generally enough to transfer. This is the hard one and the whole point. "The competitor prompt worked" is a fact; "making hallucination checkable-as-absence beats telling the model not to hallucinate" is a principle.
4. **What's queued?** — open questions, next experiments, prompts that need banking.

The discipline that matters: **the principle line must be falsifiable.** "Be more specific" is not a principle, it's a horoscope. "Naming three banned clichés removed all hype language in 3/3 runs" is a principle with a test attached.

### The self-assessment cadence

- **Weekly-ish:** skim the last few session logs. Are the same failure classes recurring? A repeated class-4 (underspecification) means the intent-interrogation habit hasn't stuck — that's a you-fix, not a prompt-fix.
- **Monthly-ish:** re-run probes on your 3 most-used library entries against the current models. Update, note drift, prune.
- **Per model release:** re-test the cross-model table from Module 02 for the models you actually use. Vendor releases are when (b)-class folklore expires.

### Course self-assessment

You've completed the curriculum when every module's mastery checklist is checked *with artifacts* — a checked box with no session log, library entry, or probe grid behind it is aspiration, not mastery. The honest final exam: take a prompt task in a domain you haven't practiced, and produce a built prompt + probe results + banked entry in under an hour, narrating the why of every decision. That narration is the skill.

## Example Prompts

Even documentation is a prompting task. A meta-example — using a model to run your session debrief:

### Before

```text
Summarize what we did this session.
```

Produces a chronological recap — accurate, and useless for learning. Summaries describe; debriefs extract.

### After

```text
Session debrief. Fill in this template from our conversation:

WORKED: the specific prompt edits or patterns that measurably helped
(quote the edit, name the effect observed).

FAILED: what fell short, classified per the 6-class taxonomy (unclear
intent / weak role / format misalignment / underspecification /
overconstraint / capability mismatch).

PRINCIPLE: ONE falsifiable, transferable sentence. Not advice
("be specific") — a claim with an implied test ("X change produced
Y effect under Z conditions").

QUEUED: open questions and prompts that are candidates for the library.

Be harsh in FAILED — flattery makes this document worthless. If no
principle emerged this session, say "none" rather than inventing one.
```

### The diff, annotated

| Change | Why |
|---|---|
| Template with named sections | Converts "summarize" (chronology mode) into extraction mode — the sections are the cognitive operations |
| Taxonomy required in FAILED | Failures get named consistently, so they're greppable across months of session logs |
| "Falsifiable, not advice" + counter-example | Blocks the horoscope failure mode; the contrast pair ("be specific" vs. a testable claim) teaches the bar by example |
| "Be harsh / flattery makes this worthless" | Debrief prompts hit the model's agreeable default hard; stating *why* harshness serves the goal recruits intent alignment against politeness |
| "Say 'none' rather than inventing one" | The explicit out (Module 01, factuality) — otherwise the model manufactures a principle every time, and fake principles poison the log |

## Key Takeaways

- Documentation is the mechanism of mastery, not its paperwork — extraction is where experience becomes skill.
- The library's value rests on its entry bar (tested only) and its why-notes; either one missing turns it into a snippet junk drawer.
- The session principle must be falsifiable — a claim with an implied test, not advice.
- Knowledge expires on model releases; scheduled re-testing is what separates a live library from a museum.

## Debugging Notes

Failure modes of the loop itself:

| Symptom | Cause | Fix |
|---|---|---|
| Library grows but you never open it | Entries lack tags or why-notes; retrieval cost exceeds rewrite cost | Enforce the template; prune; if an entry took >1 min to find, fix the tags now |
| Session logs are chronicles, not lessons | Skipping the principle-extraction step (it's the effortful one) | Use the debrief prompt above; allow "none" so the habit survives thin sessions |
| Same failure class recurring for weeks | Reading logs but not acting on the pattern | Weekly skim explicitly asks "what class repeated?" — then drill that module again |
| Banked prompts quietly degrading | No re-test cadence | Calendar the monthly probe re-run; treat a model release as a fire drill |

## Mastery Checklist

- [ ] My library has ≥5 entries, all tested, all with why-notes and tags on three axes
- [ ] I can find any library entry in under a minute
- [ ] Every working session in the last month has a log with a falsifiable principle (or an honest "none")
- [ ] I've re-tested a banked prompt, found drift or decay, and updated the entry with a changelog note
- [ ] I've identified a recurring failure class from my own logs and drilled the matching module
- [ ] I passed the final exam: unfamiliar domain → built prompt + probes + banked entry in an hour, why-narrated throughout

**You've reached the end of the curriculum — which is the beginning of the loop.** [Back to the README](../README.md) · [Open the library](../prompt-library/README.md) · [Log a session](../sessions/_TEMPLATE.md)
