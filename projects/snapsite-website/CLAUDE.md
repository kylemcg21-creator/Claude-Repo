# snapsite-website

A static marketing site (`index.html`, `SnapSite.jsx` reference component) for a fictional field-photo/inspection app, plus a small live backend in `server/`.

## The backend

`server/index.js` is an Express server exposing `POST /api/draft-report`, which streams a Claude (`claude-opus-4-8`) completion via SSE to turn field notes into a draft inspection report.

Run it with:

```
cd projects/snapsite-website/server && npm install && export ANTHROPIC_API_KEY=sk-ant-... && npm start
```

then open `http://localhost:3000`. Without the server running, the front-end demo falls back to a canned sample draft.

## Invariant

The system prompt in `server/index.js` enforces a strict rule: never invent facts not present in the notes, and the output is always `status: "needs_approval"` — nothing is auto-saved.

## Testing

This is the one sub-project in the repo with an automated test suite:

```
cd projects/snapsite-website/server && npm install && npm test
```

Node's built-in test runner plus `supertest`, against a mocked Anthropic client — no `ANTHROPIC_API_KEY` or network access needed. Covers request validation, prompt assembly, SSE event framing, the `needs_approval` invariant, and the request body size limit. Run this after touching `server/index.js`.
