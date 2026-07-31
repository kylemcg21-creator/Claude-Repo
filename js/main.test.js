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

// ARIA attribute management for accessibility
function createARIAManager() {
  const attributes = new Map();

  return {
    setAttribute(element, attr, value) {
      if (!attributes.has(element)) {
        attributes.set(element, {});
      }
      attributes.get(element)[attr] = String(value);
    },
    getAttribute(element, attr) {
      return attributes.get(element)?.[attr] || null;
    },
    updateForNavState(navToggleEl, isOpen) {
      this.setAttribute(navToggleEl, 'aria-expanded', isOpen);
      this.setAttribute(navToggleEl, 'aria-label', isOpen ? 'Close menu' : 'Open menu');
    },
  };
}

describe('ARIA Attribute Updates', () => {
  it('should update aria-expanded when nav opens', () => {
    const aria = createARIAManager();
    const navToggle = { id: 'nav-toggle' };

    aria.updateForNavState(navToggle, true);
    expect(aria.getAttribute(navToggle, 'aria-expanded')).toBe('true');
  });

  it('should update aria-expanded when nav closes', () => {
    const aria = createARIAManager();
    const navToggle = { id: 'nav-toggle' };

    aria.updateForNavState(navToggle, false);
    expect(aria.getAttribute(navToggle, 'aria-expanded')).toBe('false');
  });

  it('should update aria-label to Close when open', () => {
    const aria = createARIAManager();
    const navToggle = { id: 'nav-toggle' };

    aria.updateForNavState(navToggle, true);
    expect(aria.getAttribute(navToggle, 'aria-label')).toBe('Close menu');
  });

  it('should update aria-label to Open when closed', () => {
    const aria = createARIAManager();
    const navToggle = { id: 'nav-toggle' };

    aria.updateForNavState(navToggle, false);
    expect(aria.getAttribute(navToggle, 'aria-label')).toBe('Open menu');
  });

  it('should maintain separate state for multiple elements', () => {
    const aria = createARIAManager();
    const toggle1 = { id: 'toggle-1' };
    const toggle2 = { id: 'toggle-2' };

    aria.updateForNavState(toggle1, true);
    aria.updateForNavState(toggle2, false);

    expect(aria.getAttribute(toggle1, 'aria-expanded')).toBe('true');
    expect(aria.getAttribute(toggle2, 'aria-expanded')).toBe('false');
  });
});

// Keyboard navigation and focus management
function createFocusManager() {
  const focusHistory = [];
  const focusableElements = new Map();

  return {
    registerFocusable(id, element) {
      focusableElements.set(id, element);
    },
    focus(id) {
      const el = focusableElements.get(id);
      if (el) {
        focusHistory.push(id);
        return true;
      }
      return false;
    },
    getFocusHistory() {
      return [...focusHistory];
    },
    getLastFocused() {
      return focusHistory[focusHistory.length - 1] || null;
    },
    clearFocusHistory() {
      focusHistory.length = 0;
    },
    handleKeydown(keyCode, currentFocusId) {
      // Arrow key navigation
      const focusIds = Array.from(focusableElements.keys());
      const currentIndex = focusIds.indexOf(currentFocusId);

      if (keyCode === 'ArrowRight' || keyCode === 'ArrowDown') {
        const nextId = focusIds[currentIndex + 1];
        if (nextId) {
          this.focus(nextId);
          return nextId;
        }
      } else if (keyCode === 'ArrowLeft' || keyCode === 'ArrowUp') {
        const prevId = focusIds[currentIndex - 1];
        if (prevId) {
          this.focus(prevId);
          return prevId;
        }
      }

      return null;
    },
  };
}

describe('Keyboard Navigation and Focus Management', () => {
  it('should register focusable elements', () => {
    const focus = createFocusManager();
    const btn = { id: 'btn-1' };

    focus.registerFocusable('btn-1', btn);
    expect(focus.focus('btn-1')).toBe(true);
  });

  it('should track focus history', () => {
    const focus = createFocusManager();
    focus.registerFocusable('btn-1', {});
    focus.registerFocusable('btn-2', {});

    focus.focus('btn-1');
    focus.focus('btn-2');

    expect(focus.getFocusHistory()).toEqual(['btn-1', 'btn-2']);
  });

  it('should return null when focusing unregistered element', () => {
    const focus = createFocusManager();
    expect(focus.focus('non-existent')).toBe(false);
  });

  it('should navigate right with ArrowRight key', () => {
    const focus = createFocusManager();
    focus.registerFocusable('link-1', {});
    focus.registerFocusable('link-2', {});
    focus.registerFocusable('link-3', {});

    focus.focus('link-1');
    const next = focus.handleKeydown('ArrowRight', 'link-1');

    expect(next).toBe('link-2');
    expect(focus.getLastFocused()).toBe('link-2');
  });

  it('should navigate left with ArrowLeft key', () => {
    const focus = createFocusManager();
    focus.registerFocusable('link-1', {});
    focus.registerFocusable('link-2', {});

    focus.focus('link-2');
    const prev = focus.handleKeydown('ArrowLeft', 'link-2');

    expect(prev).toBe('link-1');
  });

  it('should not navigate beyond last element with ArrowRight', () => {
    const focus = createFocusManager();
    focus.registerFocusable('link-1', {});
    focus.registerFocusable('link-2', {});

    const result = focus.handleKeydown('ArrowRight', 'link-2');
    expect(result).toBeNull();
  });

  it('should not navigate before first element with ArrowLeft', () => {
    const focus = createFocusManager();
    focus.registerFocusable('link-1', {});
    focus.registerFocusable('link-2', {});

    const result = focus.handleKeydown('ArrowLeft', 'link-1');
    expect(result).toBeNull();
  });

  it('should clear focus history', () => {
    const focus = createFocusManager();
    focus.registerFocusable('btn-1', {});
    focus.focus('btn-1');

    expect(focus.getFocusHistory().length).toBe(1);
    focus.clearFocusHistory();
    expect(focus.getFocusHistory().length).toBe(0);
  });
});

// localStorage quota and error handling
function createStorageManager(maxSize = 5242880) {
  // 5MB default limit
  const store = new Map();
  let currentSize = 0;

  return {
    setItem(key, value) {
      const size = key.length + value.length;

      if (currentSize + size > maxSize) {
        throw new Error('QuotaExceededError');
      }

      if (store.has(key)) {
        currentSize -= store.get(key).length;
      }

      store.set(key, value);
      currentSize += size;

      return true;
    },
    getItem(key) {
      return store.get(key) || null;
    },
    removeItem(key) {
      if (store.has(key)) {
        currentSize -= store.get(key).length;
        store.delete(key);
      }
    },
    clear() {
      store.clear();
      currentSize = 0;
    },
    getCurrentSize() {
      return currentSize;
    },
    getMaxSize() {
      return maxSize;
    },
  };
}

describe('localStorage Quota and Error Handling', () => {
  it('should store items within quota', () => {
    const storage = createStorageManager(100);

    expect(() => storage.setItem('key1', 'value1')).not.toThrow();
    expect(storage.getItem('key1')).toBe('value1');
  });

  it('should throw QuotaExceededError when exceeding limit', () => {
    const storage = createStorageManager(10);

    expect(() => storage.setItem('key', 'value that is very long')).toThrow(
      'QuotaExceededError'
    );
  });

  it('should track current size usage', () => {
    const storage = createStorageManager(1000);

    storage.setItem('key1', 'hello');
    expect(storage.getCurrentSize()).toBe('key1'.length + 'hello'.length);
  });

  it('should update size when replacing values', () => {
    const storage = createStorageManager(1000);

    storage.setItem('key', 'short');
    const sizeAfterShort = storage.getCurrentSize();

    storage.setItem('key', 'a much longer value');
    const sizeAfterLong = storage.getCurrentSize();

    expect(sizeAfterLong).toBeGreaterThan(sizeAfterShort);
  });

  it('should reduce size when removing items', () => {
    const storage = createStorageManager(1000);

    storage.setItem('key', 'value');
    const sizeWithItem = storage.getCurrentSize();

    storage.removeItem('key');
    expect(storage.getCurrentSize()).toBeLessThan(sizeWithItem);
  });

  it('should clear all items and reset size', () => {
    const storage = createStorageManager(1000);

    storage.setItem('key1', 'value1');
    storage.setItem('key2', 'value2');

    storage.clear();

    expect(storage.getCurrentSize()).toBe(0);
    expect(storage.getItem('key1')).toBeNull();
  });

  it('should allow storing items after clearing quota error', () => {
    const storage = createStorageManager(30);

    storage.setItem('key1', 'value1');

    expect(() => storage.setItem('key2', 'very long value that exceeds limit')).toThrow(
      'QuotaExceededError'
    );

    storage.removeItem('key1');
    expect(() => storage.setItem('key2', 'short')).not.toThrow();
  });
});

// Scroll-spy: highlights the nav link for the section currently intersecting the viewport
function createScrollSpy(navLinks) {
  return {
    handleIntersection(entries) {
      entries.forEach((entry) => {
        const link = navLinks.find((a) => a.href === '#' + entry.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classes.delete('active'));
          link.classes.add('active');
        }
      });
    },
    getActiveLink() {
      return navLinks.find((a) => a.classes.has('active')) || null;
    },
  };
}

function makeNavLink(href) {
  return { href, classes: new Set() };
}

describe('Scroll-Spy Navigation Highlighting', () => {
  it('should mark the link for an intersecting section as active', () => {
    const links = [makeNavLink('#intro'), makeNavLink('#features')];
    const spy = createScrollSpy(links);

    spy.handleIntersection([{ id: 'features', isIntersecting: true }]);

    expect(spy.getActiveLink().href).toBe('#features');
  });

  it('should remove active from other links when a new section intersects', () => {
    const links = [makeNavLink('#intro'), makeNavLink('#features')];
    const spy = createScrollSpy(links);

    spy.handleIntersection([{ id: 'intro', isIntersecting: true }]);
    expect(spy.getActiveLink().href).toBe('#intro');

    spy.handleIntersection([{ id: 'features', isIntersecting: true }]);
    expect(spy.getActiveLink().href).toBe('#features');
    expect(links[0].classes.has('active')).toBe(false);
  });

  it('should ignore entries that are not intersecting', () => {
    const links = [makeNavLink('#intro'), makeNavLink('#features')];
    const spy = createScrollSpy(links);

    spy.handleIntersection([{ id: 'intro', isIntersecting: true }]);
    spy.handleIntersection([{ id: 'features', isIntersecting: false }]);

    expect(spy.getActiveLink().href).toBe('#intro');
  });

  it('should do nothing when no nav link matches the section id', () => {
    const links = [makeNavLink('#intro')];
    const spy = createScrollSpy(links);

    spy.handleIntersection([{ id: 'unknown-section', isIntersecting: true }]);

    expect(spy.getActiveLink()).toBeNull();
  });

  it('should return null when no section has ever intersected', () => {
    const links = [makeNavLink('#intro'), makeNavLink('#features')];
    const spy = createScrollSpy(links);

    expect(spy.getActiveLink()).toBeNull();
  });

  it('should activate the last intersecting entry when multiple entries fire together', () => {
    const links = [makeNavLink('#intro'), makeNavLink('#features'), makeNavLink('#pricing')];
    const spy = createScrollSpy(links);

    spy.handleIntersection([
      { id: 'intro', isIntersecting: true },
      { id: 'features', isIntersecting: true },
    ]);

    expect(spy.getActiveLink().href).toBe('#features');
  });
});

// Back-to-top button visibility toggle based on scroll position
function createBackToTopController(threshold = 600) {
  let visible = false;
  return {
    isVisible() {
      return visible;
    },
    updateVisibility(scrollY) {
      visible = scrollY > threshold;
      return visible;
    },
  };
}

describe('Back-to-Top Button', () => {
  it('should be hidden before any scroll update', () => {
    const backToTop = createBackToTopController();
    expect(backToTop.isVisible()).toBe(false);
  });

  it('should stay hidden below the scroll threshold', () => {
    const backToTop = createBackToTopController();
    backToTop.updateVisibility(300);
    expect(backToTop.isVisible()).toBe(false);
  });

  it('should stay hidden at exactly the threshold', () => {
    const backToTop = createBackToTopController(600);
    backToTop.updateVisibility(600);
    expect(backToTop.isVisible()).toBe(false);
  });

  it('should become visible just past the threshold', () => {
    const backToTop = createBackToTopController(600);
    backToTop.updateVisibility(601);
    expect(backToTop.isVisible()).toBe(true);
  });

  it('should become hidden again when scrolling back up', () => {
    const backToTop = createBackToTopController(600);
    backToTop.updateVisibility(1000);
    expect(backToTop.isVisible()).toBe(true);

    backToTop.updateVisibility(0);
    expect(backToTop.isVisible()).toBe(false);
  });

  it('should respect a custom threshold', () => {
    const backToTop = createBackToTopController(100);
    backToTop.updateVisibility(150);
    expect(backToTop.isVisible()).toBe(true);
  });

  it('should track visibility across repeated scroll events', () => {
    const backToTop = createBackToTopController(600);

    [0, 700, 200, 900, 50].forEach((scrollY) => {
      backToTop.updateVisibility(scrollY);
      expect(backToTop.isVisible()).toBe(scrollY > 600);
    });
  });
});
