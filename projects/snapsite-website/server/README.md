# SnapSite report-drafting API

A tiny Express server that powers the **AI report drafting** demo on the SnapSite
site. It exposes one endpoint that turns rough field notes into a clean
inspection-report draft using the Anthropic Claude API (`claude-opus-4-8`).

The draft is always returned as `status: "needs_approval"` — mirroring the app's
rule that nothing is saved until the inspector approves it.

## Run it

```bash
cd projects/snapsite-website/server
npm install
export ANTHROPIC_API_KEY=sk-ant-...
npm start
```

Then open http://localhost:3000 — the server serves `index.html` and the demo's
**Draft report with AI** button calls the live endpoint.

Without a running server (e.g. opening `index.html` directly), the demo falls
back to a representative sample draft so the UI still works.

## Test it

```bash
cd projects/snapsite-website/server
npm install
npm test
```

Tests use Node's built-in test runner and `supertest`, with a mock Anthropic
client (no `ANTHROPIC_API_KEY` or network access needed). They cover request
validation, the location/notes prompt assembly, the SSE `delta`/`done`/`error`
event framing, the `needs_approval` invariant, and the request body size limit.

## Endpoint

`POST /api/draft-report`

```json
{ "notes": "lower bracket has surface rust...", "location": "Substation 14" }
```

Response:

```json
{ "draft": "## Summary\n...", "status": "needs_approval", "model": "claude-opus-4-8" }
```

The request streams the model response (`messages.stream(...).finalMessage()`)
to avoid timeouts on longer drafts, and uses adaptive thinking.
