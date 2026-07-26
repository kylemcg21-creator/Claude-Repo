---
description: List the user's app connectors and their connection status.
---

List the MCP connectors installed for the user's org.

1. Call `ListConnectors`. If `$ARGUMENTS` is non-empty, pass it as the `keywords` filter; otherwise call it with no filter to list everything.
2. Present the results as a table with columns: **Name**, **Connected (org)**, **Enabled in this chat**, **Description**.
   - `connected: true` — authenticated at the org level.
   - `connected: false` — not connected; the user needs to connect it via claude.ai.
   - `connected: null` — status check was unavailable; report this as "unknown," never as disconnected.
   - `enabledInChat: false` with `connected: true` — the connector is authenticated but toggled off for this specific chat. Tell the user to enable it in this chat's connector settings if they want to use it here.
3. If the list is empty, say so plainly and suggest `/connectors-find <app or task>` to discover connectors worth adding.

Do not claim to connect, enable, or fix anything yourself — this command only reports status. Point the user to claude.ai connector settings for any state change.
