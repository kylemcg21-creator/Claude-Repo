---
description: Search the MCP connector registry for an app or task and show install status.
---

Find connectors matching `$ARGUMENTS` (a named app, like "asana" or "figma", or an intent, like "manage my tasks").

1. Derive 2-5 keyword phrases from `$ARGUMENTS` and call `SearchMcpRegistry` with them.
2. From the ranked results, for any that look like strong matches and are not yet installed, call `SuggestConnectors` with their `directoryUuid` values to get fuller detail (sample tools, description).
3. Present a ranked list: **Name**, **Install state**, **Enabled in this chat**, **Description**, **Sample tools**.
4. For anything not installed, tell the user they can connect it via claude.ai — these tools cannot install or authenticate a connector themselves.
5. If nothing relevant turns up, say so and suggest rephrasing the query with a more specific app name or task.
