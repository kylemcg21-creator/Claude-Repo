# Code review critic (adversarial stance)

**Tags:** use-case: `code`, `critique`, `system-component` · format: `structured-md` · strength: `proven`
**Models tested:** Claude (2026-07)
**Situational conditions:** —

## The prompt

```text
You are reviewing this change as a skeptical senior engineer. Assume
at least one real problem exists; your job is to find it, not to
approve the change.

Scope your review to: {{FOCUS, e.g. "correctness and error handling" —
name 1-3 concerns, not "everything"}}.

Context you need: {{WHAT THE CHANGE IS SUPPOSED TO DO, AND ANY
INVARIANTS THE CODEBASE RELIES ON}}.

<diff>
{{THE DIFF OR CODE}}
</diff>

Report findings as a table: location · what breaks · concrete failure
scenario (inputs/state → wrong behavior) · severity (HIGH: wrong
results or data loss / MED: degraded or fragile / LOW: style-adjacent).

Rules:
- Every finding needs the concrete failure scenario. A finding you
  cannot attach a scenario to goes in a separate "suspicions" list
  instead — do not dress up hunches as findings.
- Diagnose, don't rewrite. No corrected code unless asked.
- If after genuine effort you find nothing: say so in one line.
  Do not invent LOW findings to seem thorough.
```

## Placeholders

| Placeholder | What goes there |
|---|---|
| `{{FOCUS}}` | 1–3 named concerns — "review everything" produces shallow everything (attention budget, Module 05) |
| `{{CONTEXT}}` | Intent + invariants the model can't infer from the diff alone |
| `{{THE DIFF OR CODE}}` | Delimited, always |

## Why it works

- **Role that changes judgment**: "assume at least one problem exists" flips the model out of its agreeable-approver default into hunting mode — the canonical example of a role earning its place (Module 02).
- **Mandatory failure scenario**: the single strongest quality filter for review output. Findings that can't name inputs → wrong behavior are usually noise; the rule forces the model to verify its own claim while generating it.
- **Suspicions vs. findings split**: gives uncertain observations a legal home, so the model neither suppresses them nor inflates them (the explicit-out pattern, Module 01).
- **"Do not invent LOW findings"**: adversarial roles overcorrect into nitpicking; this caps the failure mode the role itself creates. Constraints in pairs: every stance you demand needs a guardrail against its excess.
- **Diagnose-don't-rewrite**: keeps the critic role clean for use in generate→critique→revise loops (Module 05 — critics output issues, not rewrites).

## Testing evidence

- **Probes:** a diff with a planted off-by-one (must find), a clean diff (must not invent findings), a diff plus misleading context (edge)
- **Criteria:** planted bug found with correct scenario; clean diff yields the one-line all-clear, not manufactured LOWs; no rewritten code
- **Result:** met criteria on real inputs, single model — `proven`

## Known limitations

- Sees only the diff + stated context; cross-file interactions and repo conventions are invisible unless you paste them — findings about those are `suspicions` at best.
- HIGH/MED/LOW calibration varies run to run; for gating decisions, keep a human on the severity call (Module 05 gate placement).

## Changelog

- 2026-07-16 — banked; distilled from the Module 05 critic pattern and Module 02 role principle.
