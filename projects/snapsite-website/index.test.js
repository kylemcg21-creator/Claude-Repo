import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

// --- DOM-driven behavior extracted from index.html's inline <script> ---
// (mobile nav, draft rendering, fallback typing animation, approve/redraft)

function buildDemoFixture() {
  document.body.innerHTML = `
    <header>
      <button id="menu-btn" aria-expanded="false" aria-label="Open menu">Menu</button>
      <nav id="primary-nav">
        <a href="#services">Services</a>
      </nav>
    </header>
    <textarea id="demo-notes"></textarea>
    <input id="demo-loc" />
    <button id="demo-run">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 6.5L22 12l-6.5 2.5L13 21l-2.5-6.5L4 12l6.5-2.5L13 3Z"/></svg> Draft report with AI
    </button>
    <button id="demo-regen-btn">Regenerate</button>
    <div id="demo-out"></div>
    <div id="demo-approve">
      <button id="demo-approve-btn">Approve</button>
      <button id="demo-redraft-btn">Redraft</button>
    </div>
    <div id="demo-disclaimer" style="display:none"></div>
  `;
}

// Verbatim port of index.html's inline <script> body (minus the outer IIFE),
// so these tests exercise the same DOM-manipulation logic that ships to the page.
function initDemo() {
  var header = document.querySelector('header');
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('primary-nav');
  if (menuBtn && header && nav) {
    var setOpen = function (open) {
      header.classList.toggle('nav-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', function () {
      setOpen(!header.classList.contains('nav-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
  }

  var runBtn = document.getElementById('demo-run');
  var notesEl = document.getElementById('demo-notes');
  var locEl = document.getElementById('demo-loc');
  var outEl = document.getElementById('demo-out');
  var approveRow = document.getElementById('demo-approve');
  var approveBtn = document.getElementById('demo-approve-btn');
  var redraftBtn = document.getElementById('demo-redraft-btn');
  var regenBtn = document.getElementById('demo-regen-btn');
  var disclaimer = document.getElementById('demo-disclaimer');

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function render(md) {
    var lines = esc(md).split('\n');
    var html = '', inList = false;
    lines.forEach(function (line) {
      var h = line.match(/^(#{1,3})\s+(.*)$/);
      var li = line.match(/^\s*[-*]\s+(.*)$/);
      function bold(t) { return t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
      if (h) {
        if (inList) { html += '</ul>'; inList = false; }
        var lvl = h[1].length + 1;
        html += '<h' + lvl + '>' + bold(h[2]) + '</h' + lvl + '>';
      } else if (li) {
        if (!inList) { html += "<ul style='margin:6px 0 6px 18px'>"; inList = true; }
        html += '<li>' + bold(li[1]) + '</li>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        if (line.trim() === '') html += '<br>';
        else html += '<div>' + bold(line) + '</div>';
      }
    });
    if (inList) html += '</ul>';
    return html;
  }

  function setLoading(on) {
    runBtn.disabled = on;
    runBtn.innerHTML = on
      ? '<span class="spinner"></span> Drafting…'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 6.5L22 12l-6.5 2.5L13 21l-2.5-6.5L4 12l6.5-2.5L13 3Z"/></svg> Draft report with AI';
  }

  var DRAFT_BANNER =
    '<div class="draft-banner">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>' +
    'AI draft · needs approval</div>';

  var SAMPLE_DRAFT =
    '## Summary\n' +
    'Routine inspection of **Transformer 3**. Minor surface corrosion and loose access-panel hardware noted; pressure reading within normal range. All items photographed.\n\n' +
    '## Observations\n' +
    '- Lower mounting bracket shows surface rust, approx. 1/8" deep.\n' +
    '- Pressure gauge reads 42 psi — within normal operating range.\n' +
    '- Access panel screws found loose; two were tightened on site.\n\n' +
    '## Recommended Actions\n' +
    '- Monitor bracket corrosion; schedule treatment or replacement if it progresses.\n' +
    '- Re-torque remaining access-panel fasteners on next visit.\n\n' +
    '## Items to confirm\n' +
    '- Total number of access-panel screws and how many remain loose.\n\n' +
    '_Demo draft — connect the report API (server/) for live output._';

  function paint(text) {
    outEl.innerHTML = DRAFT_BANNER + render(text);
  }
  function finishDraft() {
    outEl.setAttribute('aria-busy', 'false');
    approveRow.classList.add('show');
    disclaimer.style.display = 'block';
  }

  function typeOut(text) {
    var i = 0, step = Math.max(2, Math.round(text.length / 90));
    outEl.setAttribute('aria-busy', 'true');
    (function tick() {
      i = Math.min(text.length, i + step);
      paint(text.slice(0, i));
      if (i < text.length) { setTimeout(tick, 24); }
      else { finishDraft(); setLoading(false); }
    })();
  }

  function streamDraft() {
    var notes = (notesEl.value || '').trim();
    if (!notes) { notesEl.focus(); return; }
    setLoading(true);
    approveRow.classList.remove('show');
    disclaimer.style.display = 'none';
    outEl.setAttribute('aria-busy', 'true');
    outEl.innerHTML = '<span class="placeholder">Reading your notes and drafting…</span>';

    fetch('/api/draft-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: notes, location: (locEl.value || '').trim() })
    })
      .then(function (r) {
        if (!r.ok || !r.body) throw new Error('bad status');
        var reader = r.body.getReader();
        var decoder = new TextDecoder();
        var buf = '', acc = '';
        function pump() {
          return reader.read().then(function (res) {
            if (res.done) { finishDraft(); setLoading(false); return; }
            buf += decoder.decode(res.value, { stream: true });
            var frames = buf.split('\n\n');
            buf = frames.pop();
            frames.forEach(function (frame) {
              var ev = (frame.match(/event: (.*)/) || [])[1];
              var dm = frame.match(/data: (.*)/);
              if (!dm) return;
              var data = JSON.parse(dm[1]);
              if (ev === 'delta') { acc += data.text; paint(acc); }
              else if (ev === 'error') { throw new Error(data.error); }
            });
            return pump();
          });
        }
        return pump();
      })
      .catch(function () {
        // Backend not running (static preview) — reveal a representative draft.
        typeOut(SAMPLE_DRAFT);
      });
  }

  if (runBtn) runBtn.addEventListener('click', streamDraft);
  if (regenBtn) regenBtn.addEventListener('click', streamDraft);

  if (approveBtn) {
    approveBtn.addEventListener('click', function () {
      var banner = outEl.querySelector('.draft-banner');
      if (banner) {
        banner.classList.add('approved');
        banner.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Approved &amp; saved to project';
      }
      approveRow.classList.remove('show');
    });
  }
  if (redraftBtn) {
    redraftBtn.addEventListener('click', function () {
      approveRow.classList.remove('show');
      disclaimer.style.display = 'none';
      outEl.innerHTML = '<span class="placeholder">Edit your notes and draft again.</span>';
      notesEl.focus();
    });
  }
}

function fillAndRun(notes, location) {
  document.getElementById('demo-notes').value = notes;
  if (location !== undefined) document.getElementById('demo-loc').value = location;
  document.getElementById('demo-run').click();
}

describe('Mobile Navigation Toggle (index.html)', () => {
  beforeEach(() => {
    buildDemoFixture();
    initDemo();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('opens the nav and updates aria attributes on menu button click', () => {
    const menuBtn = document.getElementById('menu-btn');
    const header = document.querySelector('header');

    menuBtn.click();

    expect(header.classList.contains('nav-open')).toBe(true);
    expect(menuBtn.getAttribute('aria-expanded')).toBe('true');
    expect(menuBtn.getAttribute('aria-label')).toBe('Close menu');
  });

  it('closes the nav on a second menu button click', () => {
    const menuBtn = document.getElementById('menu-btn');
    const header = document.querySelector('header');

    menuBtn.click();
    menuBtn.click();

    expect(header.classList.contains('nav-open')).toBe(false);
    expect(menuBtn.getAttribute('aria-expanded')).toBe('false');
    expect(menuBtn.getAttribute('aria-label')).toBe('Open menu');
  });

  it('closes the nav when a nav link is clicked', () => {
    const menuBtn = document.getElementById('menu-btn');
    const header = document.querySelector('header');
    const link = document.querySelector('#primary-nav a');

    menuBtn.click();
    expect(header.classList.contains('nav-open')).toBe(true);

    link.click();
    expect(header.classList.contains('nav-open')).toBe(false);
    expect(menuBtn.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('Draft Request Guard and Loading State', () => {
  beforeEach(() => {
    buildDemoFixture();
    initDemo();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('does not call fetch and refocuses notes when notes are empty', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    document.getElementById('demo-run').click();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.getElementById('demo-notes'));
  });

  it('sends trimmed notes and location as the request body', () => {
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);

    fillAndRun('  Transformer reading nominal  ', '  Substation 14  ');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/draft-report',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ notes: 'Transformer reading nominal', location: 'Substation 14' }),
      })
    );
  });

  it('disables the run button and shows a spinner immediately on click', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

    fillAndRun('Some notes');

    const runBtn = document.getElementById('demo-run');
    expect(runBtn.disabled).toBe(true);
    expect(runBtn.innerHTML).toContain('Drafting');
  });

  it('shows a placeholder message in the output area while drafting', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

    fillAndRun('Some notes');

    expect(document.getElementById('demo-out').innerHTML).toContain(
      'Reading your notes and drafting'
    );
  });

  it('hides the approve row and disclaimer when a new draft starts', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

    document.getElementById('demo-approve').classList.add('show');
    document.getElementById('demo-disclaimer').style.display = 'block';

    fillAndRun('Some notes');

    expect(document.getElementById('demo-approve').classList.contains('show')).toBe(false);
    expect(document.getElementById('demo-disclaimer').style.display).toBe('none');
  });
});

describe('Streamed Draft Rendering', () => {
  beforeEach(() => {
    buildDemoFixture();
    initDemo();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  function makeStreamingResponse(chunks) {
    let index = 0;
    return {
      ok: true,
      body: {
        getReader() {
          return {
            read() {
              if (index >= chunks.length) {
                return Promise.resolve({ done: true, value: undefined });
              }
              const value = new TextEncoder().encode(chunks[index]);
              index++;
              return Promise.resolve({ done: false, value });
            },
          };
        },
      },
    };
  }

  it('paints accumulated delta text as it streams in', async () => {
    const response = makeStreamingResponse([
      'event: delta\ndata: {"text":"## Summary\\n"}\n\n',
      'event: delta\ndata: {"text":"Looks good."}\n\n',
    ]);
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(response)));

    fillAndRun('Some notes');
    await vi.waitFor(() => {
      expect(document.getElementById('demo-out').textContent).toContain('Looks good.');
    });

    const out = document.getElementById('demo-out');
    expect(out.querySelector('h3').textContent).toBe('Summary');
  });

  it('shows approve controls and re-enables the run button once streaming completes', async () => {
    const response = makeStreamingResponse(['event: delta\ndata: {"text":"Done."}\n\n']);
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(response)));

    fillAndRun('Some notes');
    await vi.waitFor(() => {
      expect(document.getElementById('demo-approve').classList.contains('show')).toBe(true);
    });

    expect(document.getElementById('demo-disclaimer').style.display).toBe('block');
    expect(document.getElementById('demo-run').disabled).toBe(false);
  });

  it('falls back to the sample draft when the response is not ok', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, body: null })));

    fillAndRun('Some notes');
    await vi.runAllTimersAsync();
    vi.useRealTimers();

    expect(document.getElementById('demo-out').textContent).toContain('connect the report API');
  });
});

describe('Fallback Sample Draft (backend unavailable)', () => {
  beforeEach(() => {
    buildDemoFixture();
    initDemo();
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network error'))));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('reveals the fallback draft progressively rather than all at once', async () => {
    fillAndRun('Some notes');

    // Let the rejected fetch promise's .catch() handler kick off typeOut,
    // which paints its first slice synchronously.
    await vi.advanceTimersByTimeAsync(0);

    const out = document.getElementById('demo-out');
    expect(out.textContent.length).toBeGreaterThan(0);
    expect(out.textContent).not.toContain('connect the report API');
  });

  it('finishes revealing the full sample draft and re-enables the UI', async () => {
    fillAndRun('Some notes');
    await vi.runAllTimersAsync();

    const out = document.getElementById('demo-out');
    expect(out.textContent).toContain('Routine inspection of');
    expect(out.textContent).toContain('connect the report API');
    expect(out.getAttribute('aria-busy')).toBe('false');
    expect(document.getElementById('demo-approve').classList.contains('show')).toBe(true);
    expect(document.getElementById('demo-run').disabled).toBe(false);
  });
});

describe('Approve / Redraft Actions', () => {
  beforeEach(async () => {
    buildDemoFixture();
    initDemo();
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network error'))));

    fillAndRun('Some notes');
    await vi.runAllTimersAsync();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('marks the draft approved and hides the approve row', () => {
    document.getElementById('demo-approve-btn').click();

    const banner = document.querySelector('.draft-banner');
    expect(banner.classList.contains('approved')).toBe(true);
    expect(banner.textContent).toContain('Approved');
    expect(document.getElementById('demo-approve').classList.contains('show')).toBe(false);
  });

  it('resets the output and refocuses notes on redraft', () => {
    document.getElementById('demo-redraft-btn').click();

    const out = document.getElementById('demo-out');
    expect(out.textContent).toContain('Edit your notes and draft again.');
    expect(document.getElementById('demo-approve').classList.contains('show')).toBe(false);
    expect(document.getElementById('demo-disclaimer').style.display).toBe('none');
    expect(document.activeElement).toBe(document.getElementById('demo-notes'));
  });
});
