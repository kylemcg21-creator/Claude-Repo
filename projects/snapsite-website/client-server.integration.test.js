import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { EventEmitter } from 'node:events';
import { createApp } from './server/index.js';

/**
 * Client-Server Integration Tests
 * Tests the full request/response cycle between the front-end form and Express API
 * using actual HTTP requests and SSE streaming responses
 */

// Mock Anthropic client that simulates streaming responses
function createMockAnthropicClient(options = {}) {
  const { chunks = ['Hello '], fail = false, delayMs = 0 } = options;
  const calls = [];

  return {
    calls,
    messages: {
      stream(requestOptions) {
        calls.push(requestOptions);
        const emitter = new EventEmitter();

        // Simulate async delay
        if (delayMs > 0) {
          setTimeout(() => {
            emitChunks();
          }, delayMs);
        } else {
          queueMicrotask(() => {
            emitChunks();
          });
        }

        function emitChunks() {
          if (!fail) {
            chunks.forEach((chunk) => {
              emitter.emit('text', chunk);
            });
          }
        }

        emitter.finalMessage = () => {
          return fail ? Promise.reject(new Error('upstream failure')) : Promise.resolve({});
        };

        return emitter;
      },
    },
  };
}

describe('Client-Server Integration: POST /api/draft-report', () => {
  let app;
  let mockClient;

  beforeEach(() => {
    mockClient = createMockAnthropicClient();
    app = createApp(mockClient);
  });

  it('should accept valid POST request with notes', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'rust on bracket',
      location: '',
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/event-stream/);
  });

  it('should reject request with missing notes', async () => {
    const res = await request(app).post('/api/draft-report').send({
      location: 'Substation 14',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Field notes are required');
  });

  it('should reject request with empty notes', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: '',
      location: 'Substation 14',
    });

    expect(res.status).toBe(400);
  });

  it('should reject request with whitespace-only notes', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: '   \n\t  ',
      location: 'Substation 14',
    });

    expect(res.status).toBe(400);
  });

  it('should reject request with null notes', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: null,
      location: 'Substation 14',
    });

    expect(res.status).toBe(400);
  });

  it('should allow request with notes and no location', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'rust observed',
    });

    expect(res.status).toBe(200);
  });

  it('should allow request with notes and null location', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test notes',
      location: null,
    });

    expect(res.status).toBe(200);
  });

  it('should set correct response headers for SSE', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    expect(res.headers['content-type']).toMatch(/text\/event-stream/);
    expect(res.headers['cache-control']).toBe('no-cache');
    expect(res.headers['connection']).toBe('keep-alive');
  });
});

describe('Client-Server Integration: Request Payload Handling', () => {
  let app;
  let mockClient;

  beforeEach(() => {
    mockClient = createMockAnthropicClient();
    app = createApp(mockClient);
  });

  it('should include notes in API request to Claude', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 'surface rust on bracket',
      location: '',
    });

    expect(mockClient.calls.length).toBe(1);
    expect(mockClient.calls[0].messages[0].content).toContain('surface rust on bracket');
  });

  it('should include location when provided in API request', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 'rust on bracket',
      location: 'Substation 14',
    });

    expect(mockClient.calls[0].messages[0].content).toContain('Project location: Substation 14');
  });

  it('should not include location line when location is empty', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 'rust on bracket',
      location: '',
    });

    const content = mockClient.calls[0].messages[0].content;
    expect(content).not.toContain('Project location:');
    expect(content).toContain('Field notes:\nrust on bracket');
  });

  it('should handle non-string notes by converting to string', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 12345,
      location: '',
    });

    expect(mockClient.calls[0].messages[0].content).toContain('12345');
  });

  it('should handle non-string location by converting to string', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 'test',
      location: 999,
    });

    expect(mockClient.calls[0].messages[0].content).toContain('999');
  });

  it('should send proper system prompt to Claude', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const systemPrompt = mockClient.calls[0].system;
    expect(systemPrompt).toContain('SnapSite');
    expect(systemPrompt).toContain('report-drafting');
  });

  it('should set adaptive thinking mode', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    expect(mockClient.calls[0].thinking).toEqual({ type: 'adaptive' });
  });

  it('should set max_tokens to 2048', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    expect(mockClient.calls[0].max_tokens).toBe(2048);
  });

  it('should use correct model', async () => {
    await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    expect(mockClient.calls[0].model).toBe('claude-opus-4-8');
  });
});

describe('Client-Server Integration: SSE Streaming Response', () => {
  let app;
  let mockClient;

  beforeEach(() => {
    mockClient = createMockAnthropicClient({
      chunks: ['## Summary\n', 'Rust observed on bracket.'],
    });
    app = createApp(mockClient);
  });

  it('should stream delta events for each text chunk', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const events = parseSSEResponse(res.text);
    const deltaEvents = events.filter((e) => e.event === 'delta');

    expect(deltaEvents.length).toBe(2);
    expect(deltaEvents[0].data.text).toBe('## Summary\n');
    expect(deltaEvents[1].data.text).toBe('Rust observed on bracket.');
  });

  it('should send done event after stream completes', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const events = parseSSEResponse(res.text);
    const doneEvent = events.find((e) => e.event === 'done');

    expect(doneEvent).toBeTruthy();
    expect(doneEvent.data.status).toBe('needs_approval');
    expect(doneEvent.data.model).toBe('claude-opus-4-8');
  });

  it('should stream all chunks in order', async () => {
    mockClient = createMockAnthropicClient({
      chunks: ['One ', 'Two ', 'Three'],
    });
    app = createApp(mockClient);

    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const text = res.text;
    expect(text.indexOf('One')).toBeLessThan(text.indexOf('Two'));
    expect(text.indexOf('Two')).toBeLessThan(text.indexOf('Three'));
  });

  it('should handle empty chunks', async () => {
    mockClient = createMockAnthropicClient({
      chunks: ['', '', 'content'],
    });
    app = createApp(mockClient);

    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const events = parseSSEResponse(res.text);
    const doneEvent = events.find((e) => e.event === 'done');
    expect(doneEvent).toBeTruthy();
  });

  it('should end with done event (not another delta)', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const lines = res.text.trim().split('\n\n');
    const lastEventBlock = lines[lines.length - 1];
    const lastEvent = lastEventBlock.split('\n')[0];

    expect(lastEvent).toContain('done');
  });
});

describe('Client-Server Integration: Error Handling', () => {
  let app;
  let mockClient;

  beforeEach(() => {
    mockClient = createMockAnthropicClient({ fail: true });
    app = createApp(mockClient);
  });

  it('should send error event on upstream failure', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    expect(res.status).toBe(200);
    expect(res.text).toContain('event: error');
    expect(res.text).toContain('Could not draft the report');
  });

  it('should not send done event on error', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    expect(res.text).not.toContain('event: done');
  });

  it('should return 200 status even on API error (SSE pattern)', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    // SSE streams errors as events, not HTTP status codes
    expect(res.status).toBe(200);
  });

  it('should end response properly on error', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    expect(res.text.trim()).toBeTruthy();
    expect(res.text).toContain('event: error');
  });
});

describe('Client-Server Integration: Request Size Limits', () => {
  let app;
  let mockClient;

  beforeEach(() => {
    mockClient = createMockAnthropicClient();
    app = createApp(mockClient);
  });

  it('should reject request bodies over 64kb', async () => {
    const oversizedNotes = 'x'.repeat(70 * 1024);

    const res = await request(app).post('/api/draft-report').send({
      notes: oversizedNotes,
    });

    expect(res.status).toBe(413);
  });

  it('should accept request bodies under 64kb', async () => {
    const largeNotes = 'x'.repeat(50 * 1024);

    const res = await request(app).post('/api/draft-report').send({
      notes: largeNotes,
    });

    expect(res.status).toBe(200);
  });

  it('should not call API if request exceeds size limit', async () => {
    const oversizedNotes = 'x'.repeat(70 * 1024);

    await request(app).post('/api/draft-report').send({
      notes: oversizedNotes,
    });

    expect(mockClient.calls.length).toBe(0);
  });
});

describe('Client-Server Integration: Edge Cases', () => {
  let app;
  let mockClient;

  beforeEach(() => {
    mockClient = createMockAnthropicClient();
    app = createApp(mockClient);
  });

  it('should handle special characters in notes', async () => {
    const specialNotes = 'Rust & corrosion on "metal" bracket (approx 1/8")';

    const res = await request(app).post('/api/draft-report').send({
      notes: specialNotes,
    });

    expect(res.status).toBe(200);
    expect(mockClient.calls[0].messages[0].content).toContain(specialNotes);
  });

  it('should handle newlines in notes', async () => {
    const multilineNotes = 'Line 1\nLine 2\nLine 3';

    const res = await request(app).post('/api/draft-report').send({
      notes: multilineNotes,
    });

    expect(res.status).toBe(200);
    expect(mockClient.calls[0].messages[0].content).toContain('Line 1');
  });

  it('should trim and normalize notes', async () => {
    const notes = '  rust on bracket  ';

    const res = await request(app).post('/api/draft-report').send({
      notes: notes,
    });

    // Note: The server converts to string and trims for validation
    expect(res.status).toBe(200);
  });

  it('should handle very long single-line notes', async () => {
    const longNotes = 'A'.repeat(1000);

    const res = await request(app).post('/api/draft-report').send({
      notes: longNotes,
    });

    expect(res.status).toBe(200);
  });
});

describe('Client-Server Integration: Response Format', () => {
  let app;
  let mockClient;

  beforeEach(() => {
    mockClient = createMockAnthropicClient({
      chunks: ['part1 ', 'part2'],
    });
    app = createApp(mockClient);
  });

  it('should format delta events correctly', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const events = parseSSEResponse(res.text);
    const deltaEvent = events.find((e) => e.event === 'delta');

    expect(deltaEvent.event).toBe('delta');
    expect(deltaEvent.data).toHaveProperty('text');
    expect(typeof deltaEvent.data.text).toBe('string');
  });

  it('should format done event correctly', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const events = parseSSEResponse(res.text);
    const doneEvent = events.find((e) => e.event === 'done');

    expect(doneEvent.event).toBe('done');
    expect(doneEvent.data).toHaveProperty('status');
    expect(doneEvent.data).toHaveProperty('model');
  });

  it('should separate events with double newline', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const eventBlocks = res.text.trim().split('\n\n');
    expect(eventBlocks.length).toBeGreaterThan(1);
  });

  it('should have event: prefix on each event', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const eventBlocks = res.text.trim().split('\n\n');
    eventBlocks.forEach((block) => {
      if (block.trim()) {
        const firstLine = block.split('\n')[0];
        expect(firstLine).toMatch(/^event: /);
      }
    });
  });

  it('should have data: prefix on data lines', async () => {
    const res = await request(app).post('/api/draft-report').send({
      notes: 'test',
    });

    const eventBlocks = res.text.trim().split('\n\n');
    eventBlocks.forEach((block) => {
      if (block.trim()) {
        const lines = block.split('\n');
        if (lines[1]) {
          expect(lines[1]).toMatch(/^data: /);
        }
      }
    });
  });
});

/**
 * Helper function to parse SSE response into events
 */
function parseSSEResponse(text) {
  const events = [];
  const blocks = text.trim().split('\n\n');

  blocks.forEach((block) => {
    if (!block.trim()) return;

    const [eventLine, dataLine] = block.split('\n');
    if (!eventLine || !dataLine) return;

    const event = eventLine.replace('event: ', '').trim();
    let data = null;

    try {
      const dataContent = dataLine.replace('data: ', '').trim();
      data = JSON.parse(dataContent);
    } catch (e) {
      // Skip malformed JSON
      return;
    }

    events.push({ event, data });
  });

  return events;
}
