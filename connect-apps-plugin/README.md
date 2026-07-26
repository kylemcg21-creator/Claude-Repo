# connect-apps-plugin

A small Claude Code plugin for managing Claude's app connectors (Slack, Notion, Linear, Gmail, and the rest of the MCP connector directory) from directly inside a session.

## Load it

```
claude --plugin-dir ./connect-apps-plugin
```

## Commands

- **`/connectors-list [keywords]`** — lists the connectors installed for the user's org and whether each is connected at the org level and enabled in the current chat.
- **`/connectors-find <app or task>`** — searches the MCP connector registry for a named app (e.g. "asana") or an intent (e.g. "manage my tasks") and reports install status for the best matches.
- **`/connectors-troubleshoot <connector name>`** — diagnoses why a specific connector isn't working: not installed, not connected at the org level, or connected but toggled off for the current chat.

None of these commands connect, disconnect, or authenticate anything themselves — connectors are managed in claude.ai's connector settings. The commands only read status (via the `ListConnectors`, `SearchMcpRegistry`, and `SuggestConnectors` tools) and point the user at the right fix.
