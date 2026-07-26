---
description: Diagnose why a specific app connector isn't working.
---

Diagnose the connector named in `$ARGUMENTS`. If no name was given, ask which connector is having trouble before continuing.

1. Call `ListConnectors` with `$ARGUMENTS` as the keyword filter.
2. **Not found in the results:** call `SearchMcpRegistry` with the same term.
   - If it turns up there but isn't installed, tell the user it exists but was never connected — they need to add it via claude.ai connector settings.
   - If it doesn't turn up at all, say the name wasn't recognized and ask them to double-check it or try `/connectors-find`.
3. **Found in the results**, read `connected` and `enabledInChat`:
   - `connected: false` → not authenticated at the org level. Direct the user to connect it in claude.ai connector settings.
   - `connected: null` → status is unknown, not necessarily broken. Say so explicitly and suggest trying it once to see if it actually fails.
   - `connected: true`, `enabledInChat: false` → it's authenticated but switched off for this chat. Tell the user to enable it in this chat's connector settings — that alone is usually the fix.
   - `connected: true`, `enabledInChat: true` but the user reports failures anyway → this is beyond what `ListConnectors` can diagnose. Ask for the specific error or failing tool call, and suggest re-authenticating the connector or checking whether it needs additional permission scopes.
4. End with one clear next action, not a list of possibilities — pick the most likely cause given what the flags showed.
