# Module 03 — Applied Practice

## Lesson Focus

Building an optimized prompt for a **real task**, end to end — and developing sensitivity to how small word and structural changes alter model behavior. This module is a workout, not a reading. Bring a task from your actual work (research, content creation, data analysis, code — anything). The worked example below uses a research task; the procedure is task-agnostic.

### The build procedure (use this every time)

1. **Write the naive version first.** One sentence, the way you'd ask a colleague. This is your baseline — you can't measure improvement without it.
2. **Interrogate your own intent.** Answer in writing: What will I *do* with the output? What would make me reject it? Who is it for? What does the model need that it can't know?
3. **Layer it** (Module 02): role → goal → constraints → format. Only add layers that answer a real question from step 2.
4. **Run baseline and built version.** Compare against your rejection criteria from step 2 — not against vibes.
5. **Change one thing, re-run, observe.** This is the sensitivity training. One variable at a time, or you learn nothing about causation.
6. **Bank it.** If the prompt survived testing, it goes in the [prompt library](../prompt-library/README.md) with tags and a "why it works" note.

### Worked example: research synthesis

**Step 1 — naive baseline:**

```text
Research the pros and cons of remote work for software teams.
```

**Step 2 — intent interrogation (written answers):**
- *Use:* input to a policy recommendation I'm drafting for a 40-person engineering org
- *Reject if:* generic listicle content; no acknowledgment of conflicting evidence; treats 2020-era claims as current
- *Audience:* me, then eventually a VP who will skim
- *Model can't know:* team size, that hybrid is already ruled in, that the decision is about collaboration quality, not cost

**Step 3 — built version:** see the Example Prompts section below.

**Steps 4–5** are the experiments table below.

### Sensitivity training: small changes, visible effects

These are the levers worth developing intuition for. Each row is an experiment you should actually run — predictions first, per the mentor's loop:

| Change | Typical effect | Why |
|---|---|---|
| "List the pros and cons" → "Weigh the evidence for and against" | From symmetrical listicle to argumentative synthesis with a lean | "List" is a formatting verb; "weigh" is a reasoning verb. Verbs set the cognitive mode. |
| Adding "for a 40-person engineering org deciding on collaboration policy" | Cuts ~half the generic content | Scope acts as a filter — claims irrelevant to the scope stop being likely next tokens |
| "Be balanced" → "State where the evidence is genuinely mixed vs. where it clearly leans" | From false-balance mush to calibrated judgment | "Balanced" trains toward 50/50 presentation even when evidence isn't 50/50; the rewrite makes calibration the instruction |
| Adding "What would change your conclusion?" | Surfaces assumptions and weak points | Forces the model to model its own reasoning's dependencies — cheap robustness check |
| Moving the format spec from top to bottom | Better format compliance | Recency: instructions nearest the end of the prompt are strongest at generation time |
| "Don't be verbose" → "Max 600 words" | Actual length control | Models can't calibrate "verbose"; they can count-ish toward a number. Quantify or don't bother. |
| Adding one worked example of the output you want | Biggest single quality jump for formatted tasks | An example is worth ~20 lines of format description — few-shot is evidence, and evidence beats instruction |

The meta-skill: **predict before you run.** Write down what you expect the edit to change. When you're wrong, that's the valuable data — it means your mental model of the machine needs updating.

## Example Prompts

### Before (the naive baseline)

```text
Research the pros and cons of remote work for software teams.
```

### After (built via the procedure)

```text
You are a research analyst briefing an engineering VP who will skim
your output in 3 minutes.

Context: a 40-person software org is setting collaboration policy.
Hybrid is already an option on the table; pure cost arguments are out
of scope. The live question is the effect of remote vs. co-located
work on collaboration quality: code review latency, design decision
quality, onboarding, and cross-team knowledge flow.

Synthesize what is known about remote work's effect on those four
areas, under these rules:
- Distinguish findings from well-designed studies vs. survey
  self-reports vs. anecdote — label each claim's evidence tier
- Where evidence is mixed, say so explicitly; where it clearly leans
  one way, say that too. Do not manufacture balance.
- Flag anything that likely changed since 2021 tooling and norms
- Max 600 words

Format: one short paragraph per area, then a 3-line bottom line:
what the evidence supports, what it doesn't settle, and what would
most change the conclusion.
```

### The diff, annotated

| Change | Step it came from | Expected behavioral difference |
|---|---|---|
| VP-skimming role framing | Intent: audience | Compression and signposting instead of essay flow |
| "Hybrid already on the table; cost out of scope" | Intent: what the model can't know | Kills the two most likely irrelevant sections before they're generated |
| Four named areas | Intent: use | Converts "remote work" (unanswerably broad) into four answerable questions |
| Evidence-tier labeling | Reject-if: generic content | Forces the model to expose the quality of its own claims — generic listicle content can't survive this rule |
| "Do not manufacture balance" | Reject-if: false balance | Directly bans the failure mode identified in step 2 |
| "What would most change the conclusion" | Sensitivity lever | Output includes its own uncertainty structure — makes the briefing decision-grade |

## Key Takeaways

- Always write the naive baseline first — improvement you can't measure is improvement you're imagining.
- The intent interrogation (use / reject-if / audience / what-model-can't-know) generates the constraints; layering just organizes them.
- Verbs set the cognitive mode: *list, weigh, audit, draft, critique* produce different processes, not just different formats.
- Change one variable at a time and predict the effect before running — being wrong is the training signal.

## Debugging Notes

Failures specific to the applied loop:

| Symptom | Cause | Fix |
|---|---|---|
| Built prompt performs no better than baseline | Constraints don't encode your reject-criteria — they're decorative | Redo step 2; every constraint should trace to a way the output could fail you |
| Output over-fits the worked example you provided | Example too specific / only one example | Add a second, structurally different example, or annotate which properties of the example matter |
| You can't tell which edit caused an improvement | Changed multiple variables between runs | Re-run the ablation properly; keep a change log in the session file |
| Prompt works for you, fails when a teammate uses it | Your intent context lived in your head, not the prompt | The prompt should carry everything step 2 surfaced; if it's not written down, it doesn't exist |

## Mastery Checklist

- [ ] I ran the full 6-step procedure on a real task from my own work
- [ ] I wrote rejection criteria *before* running the built prompt, and evaluated against them
- [ ] I ran at least 3 one-variable experiments from the sensitivity table and predicted each outcome first
- [ ] At least one prediction was wrong, and I wrote down the corrected mental model
- [ ] The surviving prompt is in my prompt library with tags and a "why it works" note

**Next:** [Module 04 — Debugging & Optimization](04-debugging-optimization.md) — what to do when outputs still fall short.
