# NeuroLink Installation Guide

[NeuroLink](https://github.com/juspay/neurolink) is a universal AI integration platform that unifies 30+ LLM providers under a single consistent API.

## Installation

### Prerequisites

- Node.js 16+ (for TypeScript environment)
- Package manager: npm, yarn, or pnpm

### Using pnpm (Recommended)

```bash
pnpm add @juspay/neurolink
```

### Using npm

```bash
npm install @juspay/neurolink
```

### Using yarn

```bash
yarn add @juspay/neurolink
```

### CLI Usage (No Installation Required)

To use NeuroLink CLI without installing as a package:

```bash
npx @juspay/neurolink --help
```

## Quick Start

### Basic Chat Completion

```javascript
import { NeuroLink } from '@juspay/neurolink';

const client = new NeuroLink({
  providers: ['openai', 'anthropic'],
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
  }
});

// Simple completion
const response = await client.chat.completions.create({
  messages: [
    { role: 'user', content: 'What is machine learning?' }
  ],
  model: 'gpt-4',
});

console.log(response.choices[0].message.content);
```

### Multi-Provider with Automatic Fallback

```javascript
const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'gpt-4',
  fallbackTo: ['claude-3-sonnet', 'gemini-pro'], // Try other providers if primary fails
});
```

### Cost-Aware Provider Selection

```javascript
const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Analyze this data...' }],
  selectProvider: 'cheapest', // Automatically select lowest-cost provider
  model: 'auto', // Let NeuroLink choose based on capabilities
});
```

## Supported Providers

NeuroLink integrates with 30+ providers including:

- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Palm 2
- **AWS Bedrock**: Claude, Llama, Mistral
- **Azure OpenAI**: Full GPT suite via Azure endpoints
- **Cohere**: Command, Command Light
- **Mistral**: Mistral Large, Mistral Medium
- **Perplexity**: Sonar models
- **Together AI**: Open-source models
- **Groq**: Fast inference models
- And 15+ more providers

## Key Features

### 1. Multimodal Support

```javascript
// Image input
const response = await client.chat.completions.create({
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What\'s in this image?' },
        {
          type: 'image_url',
          image_url: { url: 'https://example.com/image.jpg' }
        }
      ]
    }
  ],
  model: 'gpt-4-vision',
});

// File support (PDF, CSV, Excel, etc.)
const response = await client.chat.completions.create({
  messages: [
    { role: 'user', content: 'Summarize this document' }
  ],
  files: ['./document.pdf'],
  model: 'claude-3-opus',
});
```

### 2. Retrieval-Augmented Generation (RAG)

```javascript
const rag = client.rag.create({
  strategy: 'semantic', // or 'bm25', 'hybrid'
  chunkSize: 1000,
  overlapSize: 200,
});

const documents = await rag.addDocuments([
  'path/to/doc1.pdf',
  'path/to/doc2.txt'
]);

const response = await rag.query('Find information about topic X');
```

### 3. Conversation Memory

```javascript
// With Redis backend
const conversation = client.memory.create({
  backend: 'redis',
  redisUrl: 'redis://localhost:6379',
  conversationId: 'user-123',
});

// Add messages to memory
await conversation.addMessage('user', 'What is Python?');
const response = await client.chat.completions.create({
  messages: await conversation.getMessages(),
  model: 'gpt-4',
});
await conversation.addMessage('assistant', response.choices[0].message.content);

// Or use S3/SQLite
const conversation = client.memory.create({
  backend: 's3',
  bucket: 'my-bucket',
  conversationId: 'user-123',
});
```

### 4. Voice Support

```javascript
// Text-to-Speech
const audio = await client.audio.speech.create({
  input: 'Hello, how are you?',
  voice: 'alloy',
  model: 'tts-1',
  provider: 'openai',
});

// Speech-to-Text
const transcript = await client.audio.transcription.create({
  file: './audio.mp3',
  model: 'whisper-1',
  provider: 'openai',
});
```

### 5. MCP Server Integration

NeuroLink integrates with 58+ MCP servers:

```javascript
const client = new NeuroLink({
  providers: ['anthropic'],
  apiKeys: { anthropic: process.env.ANTHROPIC_API_KEY },
  mcpServers: [
    {
      name: 'filesystem',
      command: 'python',
      args: ['-m', 'mcp.server.filesystem', '/home/user'],
    },
    {
      name: 'web-search',
      command: 'node',
      args: ['./mcp-web-search.js'],
    }
  ]
});

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Search for AI news' }],
  model: 'claude-3-opus',
  tools: 'all', // Use available MCP tools
});
```

## Configuration

### Environment Variables

```bash
# API Keys
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export GOOGLE_API_KEY="..."
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."

# Optional: Set default provider
export NEUROLINK_DEFAULT_PROVIDER="anthropic"

# Optional: Set fallback chain
export NEUROLINK_FALLBACK_CHAIN="gpt-4,claude-3-opus,gemini-pro"
```

### Initialize from Config File

```javascript
const client = new NeuroLink({
  configPath: './neurolink.config.json'
});
```

**neurolink.config.json:**
```json
{
  "defaultProvider": "gpt-4",
  "providers": [
    "openai",
    "anthropic",
    "google"
  ],
  "fallbackChain": ["gpt-4", "claude-3-opus", "gemini-pro"],
  "timeout": 30000,
  "retryPolicy": {
    "maxRetries": 3,
    "backoffMultiplier": 2
  },
  "observability": {
    "enabled": true,
    "otelEndpoint": "http://localhost:4317"
  }
}
```

## Advanced Features

### Context Window Management

```javascript
const response = await client.chat.completions.create({
  messages: longMessageHistory,
  model: 'gpt-4',
  contextCompaction: {
    enabled: true,
    strategy: 'summarize', // or 'truncate', 'sliding-window'
    maxTokens: 128000,
  }
});
```

### Extended Thinking (for complex reasoning)

```javascript
const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Solve this complex problem...' }],
  model: 'claude-3-opus',
  extendedThinking: {
    enabled: true,
    budget: 10000, // tokens for thinking
  }
});
```

### Human-in-the-Loop Workflows

```javascript
const approval = client.hitl.create({
  approverEmail: 'approver@example.com'
});

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Generate a report' }],
  model: 'gpt-4',
  requireApproval: true,
  approvalHandler: approval,
});
```

### OpenTelemetry Observability

```javascript
const client = new NeuroLink({
  providers: ['openai'],
  apiKeys: { openai: process.env.OPENAI_API_KEY },
  observability: {
    enabled: true,
    otelEndpoint: 'http://localhost:4317',
    tracingSampleRate: 0.1,
  }
});

// All requests are automatically traced
const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Test' }],
  model: 'gpt-4',
});
```

## Troubleshooting

### Common Issues

**1. API Key Not Found**
```javascript
// Solution: Ensure environment variables are set
console.log(process.env.OPENAI_API_KEY); // Should not be undefined

// Or pass directly
const client = new NeuroLink({
  apiKeys: {
    openai: 'sk-...',
  }
});
```

**2. Provider Timeout**
```javascript
const client = new NeuroLink({
  timeout: 60000, // Increase timeout to 60s
});
```

**3. No Available Fallback**
```javascript
// Ensure fallback chain has providers with valid keys
const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Test' }],
  model: 'gpt-4',
  fallbackTo: ['claude-3-opus'], // Fallback provider must have valid API key
});
```

## Examples

See [NeuroLink examples](https://github.com/juspay/neurolink/tree/main/examples) for:
- Multi-language support
- Function calling across providers
- Vision models
- Real-time streaming
- Batch processing
- And more

## Resources

- [NeuroLink GitHub](https://github.com/juspay/neurolink)
- [NeuroLink Documentation](https://github.com/juspay/neurolink#readme)
- [Supported Models](https://github.com/juspay/neurolink/blob/main/docs/MODELS.md)
- [API Reference](https://github.com/juspay/neurolink/blob/main/docs/API.md)

## Support

For issues, feature requests, or questions:
- [GitHub Issues](https://github.com/juspay/neurolink/issues)
- [Discussions](https://github.com/juspay/neurolink/discussions)
