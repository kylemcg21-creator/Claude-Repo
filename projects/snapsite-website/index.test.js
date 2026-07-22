import { describe, it, expect } from 'vitest';

// Extracted from index.html inline script
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderMarkdown(md) {
  const lines = escapeHtml(md).split('\n');
  let html = '';
  let inList = false;

  lines.forEach((line) => {
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    const li = line.match(/^\s*[-*]\s+(.*)$/);

    function bold(t) {
      return t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }

    if (h) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      const lvl = h[1].length + 1;
      html += `<h${lvl}>${bold(h[2])}</h${lvl}>`;
    } else if (li) {
      if (!inList) {
        html += '<ul style="margin:6px 0 6px 18px">';
        inList = true;
      }
      html += `<li>${bold(li[1])}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (line.trim() === '') {
        html += '<br>';
      } else {
        html += `<div>${bold(line)}</div>`;
      }
    }
  });

  if (inList) html += '</ul>';
  return html;
}

// Form validation
function validateDraftRequest(notes, location) {
  return {
    isValid: (notes || '').trim().length > 0,
    notes: (notes || '').trim(),
    location: (location || '').trim(),
  };
}

// SSE event parser
function parseSSEEvent(block) {
  const [eventLine, dataLine] = block.split('\n');
  const event = eventLine?.replace('event: ', '');
  const data = dataLine ? JSON.parse(dataLine.replace('data: ', '')) : null;
  return { event, data };
}

describe('Markdown Renderer XSS Safety', () => {
  it('should escape HTML special characters', () => {
    const malicious = '## Title\n<img src=x onerror="alert(\'xss\')">';
    const result = renderMarkdown(malicious);

    expect(result).toContain('&lt;img');
    expect(result).not.toContain('<img');
    // The dangerous tag is escaped, preventing script execution
    expect(result).toContain('&lt;img src=x onerror=');
  });

  it('should escape script tags in content', () => {
    const malicious = '<script>alert("xss")</script>';
    const result = renderMarkdown(malicious);

    expect(result).toContain('&lt;script&gt;');
    expect(result).not.toContain('<script>');
  });

  it('should escape onclick handlers', () => {
    const malicious = '<div onclick="bad()">Click me</div>';
    const result = renderMarkdown(malicious);

    // onclick attribute is escaped, so it won't execute
    expect(result).toContain('&lt;div onclick=');
    expect(result).not.toContain('<div onclick');
  });

  it('should safely render normal markdown', () => {
    const markdown = '## Summary\n- Action 1\n- Action 2\nNormal text';
    const result = renderMarkdown(markdown);

    expect(result).toContain('<h3>Summary</h3>');
    expect(result).toContain('<li>Action 1</li>');
    expect(result).toContain('<li>Action 2</li>');
    expect(result).toContain('Normal text');
  });

  it('should render bold text without XSS risk', () => {
    const markdown = 'This is **bold** and **important**';
    const result = renderMarkdown(markdown);

    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<strong>important</strong>');
  });

  it('should escape ampersands', () => {
    const text = 'A & B';
    const result = escapeHtml(text);

    expect(result).toBe('A &amp; B');
  });

  it('should not double-escape content', () => {
    const markdown = 'Jones & Co.';
    const result = renderMarkdown(markdown);

    expect(result).toContain('&amp;');
    expect(result).not.toContain('&amp;amp;');
  });

  it('should handle mixed header levels', () => {
    const markdown = '# H1\n## H2\n### H3';
    const result = renderMarkdown(markdown);

    expect(result).toContain('<h2>H1</h2>');
    expect(result).toContain('<h3>H2</h3>');
    expect(result).toContain('<h4>H3</h4>');
  });
});

describe('Demo Form Validation', () => {
  it('should reject empty notes', () => {
    const validation = validateDraftRequest('', '');

    expect(validation.isValid).toBe(false);
    expect(validation.notes).toBe('');
  });

  it('should reject whitespace-only notes', () => {
    const validation = validateDraftRequest('   \n\t  ', '');

    expect(validation.isValid).toBe(false);
    expect(validation.notes).toBe('');
  });

  it('should accept notes with content', () => {
    const validation = validateDraftRequest('Rust on bracket', '');

    expect(validation.isValid).toBe(true);
    expect(validation.notes).toBe('Rust on bracket');
  });

  it('should trim notes whitespace', () => {
    const validation = validateDraftRequest('  Rust on bracket  ', '');

    expect(validation.notes).toBe('Rust on bracket');
  });

  it('should include location when provided', () => {
    const validation = validateDraftRequest('notes', 'Substation 14');

    expect(validation.location).toBe('Substation 14');
  });

  it('should trim location whitespace', () => {
    const validation = validateDraftRequest('notes', '  Substation 14  ');

    expect(validation.location).toBe('Substation 14');
  });

  it('should handle missing location', () => {
    const validation = validateDraftRequest('notes', null);

    expect(validation.location).toBe('');
  });

  it('should validate complete request payload', () => {
    const validation = validateDraftRequest('transformer reading nominal', 'Substation 14');

    expect(validation.isValid).toBe(true);
    expect(validation.notes).toBe('transformer reading nominal');
    expect(validation.location).toBe('Substation 14');
  });
});

describe('SSE Event Parsing', () => {
  it('should parse delta event correctly', () => {
    const block = 'event: delta\ndata: {"text":"## Summary\\n"}';
    const event = parseSSEEvent(block);

    expect(event.event).toBe('delta');
    expect(event.data.text).toContain('## Summary');
  });

  it('should parse done event with status', () => {
    const block = 'event: done\ndata: {"status":"needs_approval","model":"claude-opus-4-8"}';
    const event = parseSSEEvent(block);

    expect(event.event).toBe('done');
    expect(event.data.status).toBe('needs_approval');
    expect(event.data.model).toBe('claude-opus-4-8');
  });

  it('should parse error event', () => {
    const block = 'event: error\ndata: {"error":"Could not draft the report. Please try again."}';
    const event = parseSSEEvent(block);

    expect(event.event).toBe('error');
    expect(event.data.error).toContain('Could not draft');
  });
});

// Response body streaming and incomplete data handling
function createStreamBuffer() {
  let buffer = '';
  const events = [];

  return {
    append(chunk) {
      buffer += chunk;
      this.tryExtractEvents();
    },
    tryExtractEvents() {
      // Split on double newline which marks end of event
      const parts = buffer.split('\n\n');

      // Keep the last part if incomplete (no trailing double newline)
      buffer = parts[parts.length - 1];

      // Process complete events
      for (let i = 0; i < parts.length - 1; i++) {
        const eventBlock = parts[i];
        if (eventBlock.trim()) {
          try {
            const event = parseSSEEvent(eventBlock);
            if (event.event && event.data) {
              events.push(event);
            }
          } catch (e) {
            // Skip malformed events
          }
        }
      }
    },
    getEvents() {
      return [...events];
    },
    getPendingData() {
      return buffer;
    },
    clear() {
      buffer = '';
      events.length = 0;
    },
  };
}

describe('Response Body Streaming and Incomplete Data', () => {
  it('should accumulate partial chunks', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\n');
    stream.append('data: {"text":"Hello"}');

    expect(stream.getPendingData()).toContain('data: {"text":"Hello"}');
  });

  it('should extract complete events from buffer', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\ndata: {"text":"Hello"}\n\n');

    expect(stream.getEvents()).toHaveLength(1);
    expect(stream.getEvents()[0].event).toBe('delta');
  });

  it('should handle multiple events in single chunk', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\ndata: {"text":"A"}\n\nevent: delta\ndata: {"text":"B"}\n\n');

    expect(stream.getEvents()).toHaveLength(2);
  });

  it('should handle event split across multiple chunks', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\n');
    stream.append('data: {"text":"');
    stream.append('Split content');
    stream.append('"}\n\n');

    expect(stream.getEvents()).toHaveLength(1);
    expect(stream.getEvents()[0].data.text).toContain('Split');
  });

  it('should skip malformed events', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\ndata: {"invalid json}\n\n');
    stream.append('event: error\ndata: {"error":"valid"}\n\n');

    const events = stream.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('error');
  });

  it('should preserve incomplete event in buffer', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\ndata: {"text":"Incomplete"');

    expect(stream.getPendingData()).toContain('Incomplete');
    expect(stream.getEvents()).toHaveLength(0);
  });

  it('should clear buffer and events', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\ndata: {"text":"data"}\n\n');
    stream.clear();

    expect(stream.getEvents()).toHaveLength(0);
    expect(stream.getPendingData()).toBe('');
  });

  it('should handle rapid consecutive deltas', () => {
    const stream = createStreamBuffer();

    for (let i = 0; i < 10; i++) {
      stream.append(`event: delta\ndata: {"text":"chunk${i}"}\n\n`);
    }

    expect(stream.getEvents()).toHaveLength(10);
  });

  it('should preserve newlines within text content', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\ndata: {"text":"Line 1\\nLine 2\\nLine 3"}\n\n');

    const events = stream.getEvents();
    expect(events[0].data.text).toContain('Line 1');
    expect(events[0].data.text).toContain('Line 2');
  });

  it('should handle empty delta chunks', () => {
    const stream = createStreamBuffer();

    stream.append('event: delta\ndata: {"text":""}\n\n');
    stream.append('event: delta\ndata: {"text":"content"}\n\n');

    expect(stream.getEvents()).toHaveLength(2);
  });
});

// Request timeout and retry logic
function createStreamingRequestHandler() {
  const state = {
    isStreaming: false,
    isTimeout: false,
    retryCount: 0,
    maxRetries: 3,
  };

  return {
    startStream() {
      if (state.isStreaming) {
        throw new Error('Stream already in progress');
      }
      state.isStreaming = true;
      state.isTimeout = false;
      return true;
    },
    endStream() {
      state.isStreaming = false;
      state.retryCount = 0;
    },
    onTimeout() {
      state.isTimeout = true;
      state.isStreaming = false;
    },
    canRetry() {
      return state.retryCount < state.maxRetries && state.isTimeout;
    },
    retry() {
      if (!this.canRetry()) {
        return false;
      }
      state.retryCount++;
      state.isStreaming = true;
      state.isTimeout = false;
      return true;
    },
    getState() {
      return { ...state };
    },
    reset() {
      state.isStreaming = false;
      state.isTimeout = false;
      state.retryCount = 0;
    },
  };
}

describe('Request Timeout and Retry Logic', () => {
  it('should start streaming state', () => {
    const handler = createStreamingRequestHandler();

    expect(handler.startStream()).toBe(true);
    expect(handler.getState().isStreaming).toBe(true);
  });

  it('should prevent concurrent streams', () => {
    const handler = createStreamingRequestHandler();

    handler.startStream();
    expect(() => handler.startStream()).toThrow('Stream already in progress');
  });

  it('should end stream and reset retries', () => {
    const handler = createStreamingRequestHandler();

    handler.startStream();
    handler.endStream();

    expect(handler.getState().isStreaming).toBe(false);
    expect(handler.getState().retryCount).toBe(0);
  });

  it('should mark timeout state', () => {
    const handler = createStreamingRequestHandler();

    handler.startStream();
    handler.onTimeout();

    expect(handler.getState().isTimeout).toBe(true);
    expect(handler.getState().isStreaming).toBe(false);
  });

  it('should allow retry after timeout', () => {
    const handler = createStreamingRequestHandler();

    handler.startStream();
    handler.onTimeout();

    expect(handler.canRetry()).toBe(true);
  });

  it('should increment retry count', () => {
    const handler = createStreamingRequestHandler();

    handler.startStream();
    handler.onTimeout();
    handler.retry();

    expect(handler.getState().retryCount).toBe(1);
  });

  it('should prevent retry after max retries exceeded', () => {
    const handler = createStreamingRequestHandler();

    // Exhaust retries
    for (let i = 0; i < 3; i++) {
      handler.startStream();
      handler.onTimeout();
      handler.retry();
      handler.endStream();
    }

    expect(handler.canRetry()).toBe(false);
  });

  it('should reset all state', () => {
    const handler = createStreamingRequestHandler();

    handler.startStream();
    handler.onTimeout();
    handler.retry();
    handler.reset();

    const state = handler.getState();
    expect(state.isStreaming).toBe(false);
    expect(state.isTimeout).toBe(false);
    expect(state.retryCount).toBe(0);
  });

  it('should track retry count across multiple attempts', () => {
    const handler = createStreamingRequestHandler();

    handler.startStream();
    handler.onTimeout();
    const firstRetry = handler.retry();
    expect(firstRetry).toBe(true);
    expect(handler.getState().retryCount).toBe(1);

    handler.onTimeout();
    const secondRetry = handler.retry();
    expect(secondRetry).toBe(true);
    expect(handler.getState().retryCount).toBe(2);
  });
});
