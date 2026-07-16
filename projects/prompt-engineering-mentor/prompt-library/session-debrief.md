# Session debrief (meta-analysis extractor)

**Tags:** use-case: `debrief` · format: `structured-md` · strength: `proven`
**Models tested:** Claude (2026-07)
**Situational conditions:** run at the *end* of a working session, in the same conversation, so the model has the session in context

## The prompt

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

## Placeholders

None — it reads the live conversation. Paste the output into a copy of [`sessions/_TEMPLATE.md`](../sessions/_TEMPLATE.md).

## Why it works

- **Template sections are cognitive operations**: "summarize" triggers chronology mode; named extraction sections (WORKED/FAILED/PRINCIPLE) trigger analysis mode (Module 06).
- **Taxonomy required in FAILED** makes failures consistently named, hence greppable across months of logs (Module 04 taxonomy doing double duty).
- **The falsifiability bar with a counter-example**: showing "be specific" as the anti-pattern teaches the standard by contrast — one example is worth a paragraph of definition (Module 03).
- **"Flattery makes this worthless"**: states *why* harshness serves the goal, recruiting intent alignment against the model's politeness default (Module 01).
- **"Say none"**: the explicit out — without it, the model manufactures a principle every session, and fake principles poison the log (Module 01, factuality pattern).

## Testing evidence

- **Probes:** end of a productive session (should yield a real principle); end of a thin session (should yield "none"); a session with a clear failure (should classify it correctly)
- **Criteria:** all four sections present; principle passes the falsifiability bar or is "none"; FAILED entries carry a class label
- **Result:** met criteria, single model — `proven`

## Known limitations

- Quality is bounded by what's actually in the conversation window — in very long sessions, early experiments may have been outweighed or compacted away; debrief incrementally in marathon sessions.
- The model's self-assessment of "measurably helped" inherits your rigor: if the session never compared outputs, WORKED will be impressionistic.

## Changelog

- 2026-07-16 — banked from curriculum Module 06 worked example.
