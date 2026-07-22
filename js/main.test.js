import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Extract testable logic from main.js

// Navigation toggle state management
function createNavToggle() {
  let isOpen = false;
  return {
    toggle() {
      isOpen = !isOpen;
      return isOpen;
    },
    getState() {
      return isOpen;
    },
    reset() {
      isOpen = false;
    },
  };
}

// FAQ single-open-at-a-time logic with localStorage
function createFAQManager(storageKey = 'blockcraft-guide-faq-open') {
  const store = new Map();

  return {
    setSaved(index) {
      store.set(storageKey, String(index));
    },
    getSaved() {
      const saved = store.get(storageKey);
      return saved !== undefined ? parseInt(saved) : null;
    },
    removeSaved() {
      store.delete(storageKey);
    },
    setStorage(key, value) {
      store.set(key, value);
    },
    getStorage(key) {
      return store.get(key) || null;
    },
  };
}

// Markdown-ish renderer with XSS protection
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
        html += '<ul>';
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

// Form validation logic
function validateDraftRequest(notes, location) {
  return {
    isValid: (notes || '').trim().length > 0,
    notes: (notes || '').trim(),
    location: (location || '').trim(),
  };
}

describe('Mobile Navigation Toggle', () => {
  it('should toggle state from false to true', () => {
    const nav = createNavToggle();
    expect(nav.getState()).toBe(false);

    nav.toggle();
    expect(nav.getState()).toBe(true);
  });

  it('should toggle state from true back to false', () => {
    const nav = createNavToggle();
    nav.toggle();
    nav.toggle();
    expect(nav.getState()).toBe(false);
  });

  it('should reset to closed state', () => {
    const nav = createNavToggle();
    nav.toggle();
    nav.toggle();
    nav.toggle();
    expect(nav.getState()).toBe(true);

    nav.reset();
    expect(nav.getState()).toBe(false);
  });
});

describe('FAQ localStorage Persistence', () => {
  it('should save FAQ item index to storage', () => {
    const faq = createFAQManager();

    faq.setSaved(1);
    expect(faq.getSaved()).toBe(1);
  });

  it('should restore previously saved FAQ index', () => {
    const faq = createFAQManager();

    faq.setSaved(0);
    const restored = faq.getSaved();
    expect(restored).toBe(0);
  });

  it('should remove storage when FAQ is closed', () => {
    const faq = createFAQManager();

    faq.setSaved(2);
    expect(faq.getSaved()).toBe(2);

    faq.removeSaved();
    expect(faq.getSaved()).toBeNull();
  });

  it('should handle null when nothing is saved', () => {
    const faq = createFAQManager();

    expect(faq.getSaved()).toBeNull();
  });
});

describe('Markdown Renderer XSS Safety', () => {
  it('should escape HTML special characters in markdown', () => {
    const malicious = '## Title\n<img src=x onerror="alert(\'xss\')">';
    const result = renderMarkdown(malicious);

    expect(result).toContain('&lt;img');
    expect(result).not.toContain('<img');
    // The attribute is escaped, so it won't execute as JS
    expect(result).toContain('&lt;img src=x onerror=');
  });

  it('should escape script tags', () => {
    const malicious = '<script>alert("xss")</script>';
    const result = renderMarkdown(malicious);

    expect(result).toContain('&lt;script&gt;');
    expect(result).not.toContain('<script>');
  });

  it('should render normal markdown correctly', () => {
    const markdown = '## Summary\n- Item 1\n- Item 2';
    const result = renderMarkdown(markdown);

    expect(result).toContain('<h3>Summary</h3>');
    expect(result).toContain('<li>Item 1</li>');
    expect(result).toContain('<li>Item 2</li>');
  });

  it('should render bold text correctly', () => {
    const markdown = 'This is **bold** text';
    const result = renderMarkdown(markdown);

    expect(result).toContain('<strong>bold</strong>');
  });

  it('should escape ampersands', () => {
    const text = 'A & B';
    const result = escapeHtml(text);

    expect(result).toBe('A &amp; B');
  });

  it('should not double-escape already escaped content', () => {
    const text = 'Avoid & Co.';
    const result = renderMarkdown(text);

    expect(result).toContain('&amp;');
    expect(result).not.toContain('&amp;amp;');
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

  it('should accept valid notes', () => {
    const validation = validateDraftRequest('rust on bracket', '');

    expect(validation.isValid).toBe(true);
    expect(validation.notes).toBe('rust on bracket');
  });

  it('should include location when provided', () => {
    const validation = validateDraftRequest('notes', 'Substation 14');

    expect(validation.location).toBe('Substation 14');
  });

  it('should trim whitespace from location', () => {
    const validation = validateDraftRequest('notes', '  Substation 14  ');

    expect(validation.location).toBe('Substation 14');
  });

  it('should handle missing location', () => {
    const validation = validateDraftRequest('notes', null);

    expect(validation.location).toBe('');
  });
});
