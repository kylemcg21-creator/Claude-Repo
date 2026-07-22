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
