# Module 01 — Foundations

## Lesson Focus

The four core principles every other technique is built on: **context hierarchy**, **clarity**, **specificity**, and **intent alignment** — and how prompt structure affects reasoning, creativity, and factuality.

### The mental model that makes everything else click

A language model is a next-token predictor conditioned on everything in its context window. That single fact explains most prompt engineering:

- **Everything in context is evidence.** The model doesn't "follow instructions" the way a program does — it predicts what text should come next given all the evidence you've provided. Instructions, examples, tone, even your typos are evidence about what response is likely.
- **Evidence has weight, and position/framing affect weight.** This is why *where* and *how* you say something matters, not just *what* you say.
- **The model fills every gap with the statistical default.** Anything you don't specify gets the most-average interpretation. Vague prompts don't produce errors — they produce *generic* output, which is worse because it looks acceptable.

### Principle 1: Context hierarchy

Not all parts of a prompt carry equal authority. The rough precedence, strongest first:

1. **System prompt** — persistent, applies to every turn, best place for role, rules, and format contracts
2. **Recent user messages** — recency matters; the last message dominates immediate behavior
3. **Earlier conversation** — decays in influence; long chats "forget" early rules (they're still in context, just outweighed)
4. **Retrieved/quoted documents** — treated as material to work *on*, not instructions to *follow* (usually — see prompt-injection, Module 05)

**Practical consequence:** durable rules go in the system prompt; task-of-the-moment goes in the user message; reference material gets clearly delimited so the model knows it's data, not directive.

### Principle 2: Clarity

Clarity is the absence of competing interpretations. The model doesn't ask clarifying questions by default — it picks an interpretation and commits. Ambiguity you leave in is a decision you delegated.

The most common clarity failures:
- **Pronoun/reference ambiguity**: "summarize it and make it shorter" — which *it*?
- **Bundled asks**: three requests in one sentence, model addresses one well and two shallowly
- **Contradictions at a distance**: "be comprehensive" in paragraph 1, "keep it brief" in paragraph 4

### Principle 3: Specificity

Specificity is choosing the defaults instead of inheriting them. Every unspecified dimension — length, audience, format, tone, what to exclude — gets filled by the statistical average.

The test: **could two reasonable people read your prompt and expect visibly different outputs?** If yes, specify the dimension they'd disagree on.

Anti-pattern warning: specificity is not word count. Ten precise constraints beat three paragraphs of vibes. Padding *reduces* specificity by burying the signal.

### Principle 4: Intent alignment

The prompt you wrote is a proxy for the outcome you want. Misalignment happens when the literal request diverges from the actual goal:

- You ask for "a summary" but actually want *a decision-ready briefing* — different selection criteria.
- You ask "is this code correct?" but actually want *find the bug I suspect exists* — different stance (a verifier confirms; an auditor hunts).
- You ask for "creative ideas" but will actually reject anything off-brand — the constraint existed, you just didn't state it.

**Practical consequence:** state the *goal behind the ask* ("I'll use this to decide X") and the model can optimize for the outcome instead of the literal instruction.

### How structure affects reasoning, creativity, and factuality

| You want more... | Structure that helps | Why it works |
|---|---|---|
| **Reasoning** | Ask for analysis *before* the answer; decompose into ordered steps; give it permission to say "it depends" | Tokens are computation — an answer produced after visible reasoning is conditioned on that reasoning. An answer demanded first is a guess that then gets rationalized. |
| **Creativity** | Constrain the *frame*, free the *content* ("a lullaby about network security" beats "be creative"); ask for N options; explicitly ban the obvious ("no puns on 'phishing'") | Unconstrained "be creative" regresses to the most common creative tropes. Tight frames force the model off the statistical center. |
| **Factuality** | Provide source material and scope answers to it; require citations to the provided text; give an explicit out ("say 'not in the source' when it isn't") | The model can't distinguish remembering from confabulating. Grounding in provided text turns recall into reading. The explicit out makes "I don't know" a legal move — otherwise fluent guessing is the path of least resistance. |

## Example Prompts

### Before

```text
Write something about our new product launch for social media. Make it good
and engaging. It's a productivity app.
```

### After

```text
You are writing launch-day social posts for "Flowdesk," a productivity app
for freelancers who juggle multiple clients.

Goal: drive signups to the free tier (link goes in the post).

Write 3 options for a single X/Twitter post:
- Max 240 characters each
- Voice: confident, plain-spoken, no hype words ("revolutionary",
  "game-changer", "unleash")
- Each option must lead with a concrete pain point (missed invoices,
  context-switching, scattered client notes), not with the product
- No hashtags, no emoji

After the 3 options, add one line on which you'd pick and why.
```

### The diff, annotated

| Change | Principle | Expected behavioral difference |
|---|---|---|
| Named the product, audience, and platform | Specificity | Output references freelancer pain instead of generic "boost your productivity!" filler |
| Stated the goal (signups) behind the ask (posts) | Intent alignment | Posts get a call-to-action shape, not just engagement bait |
| "3 options" instead of one | Specificity + creativity | Model spreads bets instead of committing to its single most-average idea |
| Banned specific hype words | Clarity (negative constraint) | "Make it good" gave the model nothing to avoid; naming the failure mode blocks the exact clichés you'd have rejected |
| "Lead with a pain point, not the product" | Structure → creativity | Forces a hook pattern the model wouldn't default to |
| "Which you'd pick and why" | Teaching-yourself trick | The model's own selection reasoning tells you what it thinks the criteria are — cheap intent-alignment check |

**Run both versions and compare.** The "before" prompt isn't broken — it will produce grammatical, on-topic text. That's the trap: vague prompts fail silently by producing acceptable-looking averageness.

## Key Takeaways

- The model fills every unspecified dimension with the statistical average — vague prompts fail *silently*.
- Put durable rules in the system prompt, the current task in the user message, and delimit reference material as data.
- State the goal behind the ask; the literal request is a lossy proxy for what you want.
- Structure is a lever on cognition: reasoning-before-answer, constrained frames, and grounded sources shift reasoning, creativity, and factuality respectively.

## Debugging Notes

Common failure signatures at this level, and their diagnosis:

| Symptom | Likely principle violated | First fix to try |
|---|---|---|
| Output is generic, "could describe any product" | Specificity | Add audience + concrete details + banned clichés |
| Model answered a different question than intended | Intent alignment | State the downstream use ("I will use this to...") |
| Model ignored a rule from earlier in a long chat | Context hierarchy | Repeat the rule in the latest message or move it to the system prompt |
| Output addresses one of your three asks well, two shallowly | Clarity (bundling) | Split into separate prompts, or number the asks and require numbered responses |
| Confident wrong facts | Factuality structure | Ground in provided text + give an explicit "not in source" out |

## Mastery Checklist

- [ ] I can explain why an ambiguous prompt produces *generic* output rather than an error
- [ ] I can name the four principles and diagnose a failing prompt by which one it violates
- [ ] I know what goes in a system prompt vs. a user message vs. delimited data, and why
- [ ] I can state the goal behind an ask, and I do it habitually
- [ ] I can predict which structural change (reasoning-first, constrained frame, grounding) will move which quality (reasoning, creativity, factuality)
- [ ] I rewrote one of my own real prompts using the before/after pattern above and compared outputs

**Next:** [Module 02 — Prompt Architecture](02-prompt-architecture.md), where these principles become a layered, reusable structure.
