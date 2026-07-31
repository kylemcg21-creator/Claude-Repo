# Claude-Repo

A starter repository for experimenting with Claude Code on the web.

## Getting started

Clone the repo and open it in [Claude Code](https://claude.ai/code) to start building with AI assistance.

## Dependencies

- [`google-antigravity`](https://pypi.org/project/google-antigravity/) — the [Google Antigravity SDK](https://github.com/Google-Antigravity/antigravity-sdk-python) for building AI agents with Gemini. Install with:

  ```sh
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -e .
  ```

  The package ships a compiled runtime binary in its PyPI wheels, so it must be installed via `pip` (not just cloned from GitHub). Import it as `from google import antigravity` — the top-level `antigravity` name is reserved by Python's stdlib easter-egg module.

  On Windows, you can install [`uv`](https://docs.astral.sh/uv/) — a fast drop-in replacement for `pip`/`venv` — via `setup-uv.ps1` or `setup-uv.bat`. See [UV_SETUP.md](UV_SETUP.md) for details.

### NeuroLink

[**NeuroLink**](https://github.com/juspay/neurolink) is a universal AI integration platform that unifies 30+ LLM providers under a single consistent API. Perfect for multi-provider AI applications.

**Installation:**

Using pnpm (recommended):
```sh
pnpm add @juspay/neurolink
```

Or npm:
```sh
npm install @juspay/neurolink
```

Or use the CLI without installation:
```sh
npx @juspay/neurolink --help
```

**Features:**
- **Multi-provider support**: Integrate OpenAI, Anthropic, Google, AWS Bedrock, and 25+ other LLM providers
- **Automatic fallback**: Intelligent provider failover and cost-aware routing
- **Multimodal capabilities**: Voice (TTS/STT), images, PDFs, CSVs, Excel, and 50+ file types
- **RAG & MCP**: Retrieval-Augmented Generation with 10+ chunking strategies, 58+ MCP servers
- **Conversation memory**: Redis/S3/SQLite backends for persistent context
- **Enterprise features**: Human-in-the-loop workflows, OpenTelemetry observability, context window management

**Quick start:**
```javascript
import { NeuroLink } from '@juspay/neurolink';

const client = new NeuroLink({
  providers: ['openai', 'anthropic'],
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
  }
});

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'gpt-4',
  fallbackTo: 'claude-3-sonnet', // automatic fallback
});
```

For detailed documentation, see [NeuroLink GitHub](https://github.com/juspay/neurolink).

### Graphify

[**Graphify**](https://github.com/Graphify-Labs/graphify) is an AI coding
assistant skill that turns a folder of code, docs, papers, images, or videos
into a queryable knowledge graph instead of grepping through files.

**Installation:**

```sh
uv tool install graphifyy      # install the CLI (or: pipx install graphifyy)
graphify install               # register the skill with your AI assistant
```

Then, in your assistant:

```
/graphify .
```

**Features:**
- **Local code parsing**: tree-sitter AST, no LLM calls, nothing leaves your machine
- **Labeled edges**: every connection is tagged `EXTRACTED` (explicit in source) or `INFERRED`
- **Not a vector index**: a real, traversable graph — `graph.html`, `GRAPH_REPORT.md`, `graph.json`
- **20+ assistant integrations**: Claude Code, Codex, Cursor, Aider, Gemini CLI, and more

See [GRAPHIFY_INSTALLATION.md](GRAPHIFY_INSTALLATION.md) for the full guide.

## Skills

- `nano-banana` (`.claude/skills/nano-banana/`) — generate and edit images with Google's Nano Banana models (`gemini-2.5-flash-image` / `gemini-3-pro-image-preview`). Text-to-image and image-to-image with curated transformation presets (anime-to-life, photo-restoration, imax-portrait, real-mecha, character-reference-sheet, j-idol, j-cover, figure-to-life) plus a J-Poses library. Presets ported from [ShinChven/nano-banana-skills](https://github.com/ShinChven/nano-banana-skills).

## Resources

- [Claude Code documentation](https://code.claude.com/docs)
- [Claude API reference](https://docs.anthropic.com)
