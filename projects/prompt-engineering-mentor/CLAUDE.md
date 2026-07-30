# prompt-engineering-mentor

A repo-based prompt-engineering course, not code. `MENTOR.md` holds the portable mentor system prompt (with annotations on why it's designed the way it is); `curriculum/` holds numbered lesson modules (work 01-02 in order, then 03-04 as a pair, then 05-06); `prompt-library/` is an index of proven prompts with a tagging schema (use case / format / strength) — entries only get added after being tested against real inputs, per `prompt-library/README.md`; `sessions/` logs one file per mentoring session using `_TEMPLATE.md`.

When editing this project, follow its own ground rules: always explain *why* a prompt change was made; label behavioral claims as documented/widely-reproduced/untested.

## Testing

"Testing" means running the prompts in `prompt-library/` against a real model and checking output against the criteria described in `prompt-library/README.md`, not automated tests.
