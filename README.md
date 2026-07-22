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

## Skills

- `nano-banana` (`.claude/skills/nano-banana/`) — generate and edit images with Google's Nano Banana models (`gemini-2.5-flash-image` / `gemini-3-pro-image-preview`). Text-to-image and image-to-image with curated transformation presets (anime-to-life, photo-restoration, imax-portrait, real-mecha, character-reference-sheet, j-idol, j-cover, figure-to-life) plus a J-Poses library. Presets ported from [ShinChven/nano-banana-skills](https://github.com/ShinChven/nano-banana-skills).

## Resources

- [Claude Code documentation](https://code.claude.com/docs)
- [Claude API reference](https://docs.anthropic.com)
