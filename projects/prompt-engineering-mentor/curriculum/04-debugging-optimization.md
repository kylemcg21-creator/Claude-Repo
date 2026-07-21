# Module 04 — Debugging & Optimization

## Lesson Focus

A systematic method for diagnosing failing prompts — **name the failure class before touching the prompt** — plus rebuild patterns for each class, and how to test prompts across models and measure consistency.

### The failure taxonomy

Almost every disappointing output falls into one of six classes. Diagnosing the class first matters because the fixes are *different* — and the instinctive fix (add more instructions) makes several classes worse.

| # | Failure class | Signature | Root cause |
|---|---|---|---|
| 1 | **Unclear intent** | Output is competent but answers the wrong question | The prompt is a lossy proxy for the goal; the model optimized the proxy |
| 2 | **Weak role framing** | Right content, wrong stance — describes when you needed evaluation, hedges when you needed a call | No role, or a role that sets voice without setting judgment |
| 3 | **Format misalignment** | Right content, wrong shape — prose where you needed a table, JSON with extra chat | Format contract missing, buried early in the prompt, or edge cases unspecified |
| 4 | **Underspecification** | Generic, average, "could apply to anything" output | Unfilled dimensions defaulted to the statistical mean (Module 01) |
| 5 | **Overconstraint / contradiction** | Model ignores some rules, or output is stilted and evasive | Rules conflict, or there are too many for all to bind; the model silently drops the losers |
| 6 | **Capability mismatch** | Errors persist across all rewrites — arithmetic slips, hallucinated citations, lost mid-context details | The task exceeds what prompting can fix; needs tools, retrieval, decomposition, or a different model |

**The diagnostic question order:** Is the content right but shape wrong? → class 3. Content generic? → class 4. Content specific but aimed wrong? → class 1 or 2. Rules being ignored? → class 5 (count and check for conflicts). Same error surviving every rewrite? → class 6, stop rewriting.

Class 5 deserves emphasis because it's the one that punishes effort: every rule you add dilutes every other rule. A 40-rule prompt doesn't get 40 rules followed; it gets an unpredictable ~30, chosen by the model. **Optimization is subtraction at least as often as addition.**

### The rebuild procedure

1. **Reproduce** the failure — run the prompt 2–3 times. A one-off oddity is sampling noise; a pattern is a defect. Don't debug noise.
2. **Classify** using the taxonomy. Write the class down (session log).
3. **Apply the class-specific fix:**
   - Class 1 → add the goal-behind-the-ask and the downstream use; delete instructions that encode *your guess* at the method, keep the ones that encode the *outcome*
   - Class 2 → replace the generic role with one that changes judgment ("skeptical reviewer who assumes at least one bug exists")
   - Class 3 → move format to the end, specify edge/empty cases, add one worked example of the shape
   - Class 4 → run the intent interrogation (Module 03, step 2); add the missing dimensions
   - Class 5 → **delete rules.** Keep the ~7 that encode your rejection criteria; then resolve any remaining conflicts by stating precedence ("when brevity and completeness conflict, prefer brevity")
   - Class 6 → stop prompt-tweaking; decompose the task, provide source material, add tools, or change models
4. **Contextual reinforcement** — for rules that keep slipping in long conversations: restate the critical rule in the *final* position of the prompt, closest to generation. Position is a weight, use it.
5. **Re-run the same 2–3 probes** and compare against the original failures — not against your general impression.

### Cross-model testing and consistency measurement

You don't need an eval platform to be rigorous. The minimum honest test:

1. **Fix a probe set**: 3–5 representative inputs, including one edge case and one adversarial case (e.g., input containing something that looks like an instruction).
2. **Run each probe 3 times per model** (temperature/sampling means single runs are anecdotes).
3. **Score against written criteria** — the rejection criteria from Module 03, turned into a checklist. Binary pass/fail per criterion beats a 1–10 gut score; gut scores drift.
4. **Record a consistency grade per (prompt, model) pair:**
   - **Stable** — all runs pass all criteria
   - **Wobbly** — runs pass but shape/quality varies visibly
   - **Divergent** — some runs fail criteria outright
5. **Compare models on the same grid.** Now "works better on Claude" means something: *which* probes, *which* criteria, how consistently.

A prompt that's Stable on one model and Divergent on another usually differs in one of: format contract strictness (tighten it), implicit vendor-specific behavior you relied on without noticing (make it explicit), or context length sensitivity. Portability is mostly about making the implicit explicit.

## Example Prompts

### Before — a real failing prompt (class 5 + class 1)

```text
You are a world-class copywriter. Write a product description for our
ergonomic keyboard. Make it compelling and persuasive but not salesy.
Be creative but professional. Keep it short but include all the
features: split design, tenting kit, hot-swap switches, 3 connection
modes, 8-week battery. Make it emotional but factual. SEO-optimize it
but keep it natural. Around 150 words but don't sacrifice quality.
```

Every pair of instructions contains a tension the model must resolve silently: compelling/not salesy, creative/professional, emotional/factual, SEO/natural, short/complete. Output: beige copy that half-serves every master. Also class 1: no stated audience or goal, so "compelling" has no target.

### After — rebuilt (subtraction + precedence + intent)

```text
Write a product description for the Volt75 split ergonomic keyboard.

Audience: programmers with wrist pain who have researched ergo boards
and are comparing 2-3 finalists. They distrust marketing language.

Goal: get them to add it to cart. For this reader, that means sounding
like a knowledgeable friend, not an ad.

Rules, in priority order (higher wins on conflict):
1. Every claim ties to a feature: split design, tenting kit, hot-swap
   switches, 3 connection modes, 8-week battery
2. Lead with the wrist-pain relief, not the specs
3. 120-160 words
4. No superlatives ("best", "ultimate", "world-class")

One paragraph, then a single spec line listing the five features.
```

### The diff, annotated

| Change | Failure class addressed | Expected behavioral difference |
|---|---|---|
| 9 vibe-instructions → 4 rules | 5 (overconstraint) | Each remaining rule actually binds; output stops averaging between contradictions |
| Explicit priority order | 5 (contradiction) | Conflicts now resolve *your* way instead of randomly per-run |
| Skeptical-researcher audience | 1 (intent) | "Not salesy" was a vibe; "reader distrusts marketing" is a model of *why*, which the model can act on |
| "Add to cart" goal | 1 (intent) | "Compelling" now has a measurable target |
| "No superlatives" replaces "not salesy" | 4 → concrete | The vague instruction becomes a checkable ban — and it makes the "world-class copywriter" role unnecessary |
| Word range instead of "short but complete" | 3 (format) | Quantified length is followable; the tension dissolves |

## Key Takeaways

- Classify before you fix — the instinctive fix (add instructions) actively worsens overconstraint failures.
- Reproduce failures 2–3 times before debugging; single bad outputs are often sampling noise.
- Every rule dilutes every other rule. Keep the ones that encode rejection criteria; state precedence for the rest.
- Consistency is a measurement, not an impression: fixed probes × 3 runs × written pass/fail criteria.
- When the same error survives every rewrite, the problem isn't the prompt — decompose, ground, add tools, or change models.

## Debugging Notes

The meta-failure to watch for in yourself: **fixing the output instead of the prompt.** Editing the model's answer by hand feels productive, but the defect is still in the prompt, and it will be back tomorrow. The discipline: every manual edit you make to an output is a constraint you failed to write — go write it.

Second meta-failure: **debugging in a moving context.** A prompt that fails at turn 30 of a conversation may be fine — the conversation is the problem (buried rules, accumulated contradictions). Test the prompt fresh before rewriting it.

## Mastery Checklist

- [ ] I can classify a failing output into the six classes from the signature alone
- [ ] My first move on a failure is reproduction, not rewriting
- [ ] I have deleted rules from a prompt and watched compliance *improve* — and can explain why
- [ ] I have a written probe set for at least one production prompt of mine
- [ ] I've run a 2-model consistency grid (probes × 3 runs × criteria) and recorded the grades
- [ ] I can recognize a class-6 (capability) failure and know the four escape routes

**Next:** [Module 05 — System Design](05-system-design.md) — from single prompts to workflows, loops, and multi-agent systems.
