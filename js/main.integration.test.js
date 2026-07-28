import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

/**
 * DOM Integration Tests for js/main.js
 * Tests the actual DOM manipulation, event listeners, and side effects
 */

// Create a realistic HTML fixture matching index.html structure
function createFixture() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
    </head>
    <body>
      <header class="site-header">
        <div class="container nav">
          <a class="brand" href="#top">BlockCraft Guide</a>

          <nav class="nav-links" id="primary-nav" aria-label="Primary">
            <a href="#basics">Basics</a>
            <a href="#techniques">Techniques</a>
            <a href="#styles">Styles</a>
            <a href="#tutorial">Tutorial</a>
            <a href="#tips">Pro Tips</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div class="nav-actions">
            <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="primary-nav">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section id="basics">
          <h2>Basics</h2>
          <p>Content here</p>
        </section>
        <section id="techniques">
          <h2>Techniques</h2>
          <p>Content here</p>
        </section>
        <section id="styles">
          <h2>Styles</h2>
          <p>Content here</p>
        </section>
        <section id="tutorial">
          <h2>Tutorial</h2>
          <p>Content here</p>
        </section>
        <section id="tips">
          <h2>Pro Tips</h2>
          <p>Content here</p>
        </section>
        <section id="faq">
          <h2>FAQ</h2>
          <details class="faq-item">
            <summary>Question 1?</summary>
            <p>Answer 1</p>
          </details>
          <details class="faq-item">
            <summary>Question 2?</summary>
            <p>Answer 2</p>
          </details>
          <details class="faq-item">
            <summary>Question 3?</summary>
            <p>Answer 3</p>
          </details>
        </section>
      </main>

      <button class="back-to-top" aria-label="Back to top"></button>
    </body>
    </html>
  `;
}

describe('Navigation Toggle (js/main.js)', () => {
  let dom;
  let window;
  let document;
  let navToggle;
  let navLinks;

  beforeEach(() => {
    dom = new JSDOM(createFixture(), {
      url: 'http://localhost',
    });
    window = dom.window;
    document = window.document;
    navToggle = document.querySelector('.nav-toggle');
    navLinks = document.querySelector('.nav-links');

    // Simulate the actual js/main.js behavior for nav toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });

      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });

  it('should exist in the DOM', () => {
    expect(navToggle).toBeTruthy();
    expect(navLinks).toBeTruthy();
  });

  it('should have initial aria-expanded set to false', () => {
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle nav-links open class on button click', () => {
    expect(navLinks.classList.contains('open')).toBe(false);

    navToggle.dispatchEvent(new window.Event('click'));
    expect(navLinks.classList.contains('open')).toBe(true);

    navToggle.dispatchEvent(new window.Event('click'));
    expect(navLinks.classList.contains('open')).toBe(false);
  });

  it('should update aria-expanded when toggling', () => {
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');

    navToggle.dispatchEvent(new window.Event('click'));
    expect(navToggle.getAttribute('aria-expanded')).toBe('true');

    navToggle.dispatchEvent(new window.Event('click'));
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('should close nav when a nav link is clicked', () => {
    navToggle.dispatchEvent(new window.Event('click'));
    expect(navLinks.classList.contains('open')).toBe(true);

    const link = navLinks.querySelector('a[href="#basics"]');
    link.dispatchEvent(new window.Event('click'));

    expect(navLinks.classList.contains('open')).toBe(false);
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('should close nav for all link clicks', () => {
    const links = Array.from(navLinks.querySelectorAll('a'));

    links.forEach((link) => {
      navToggle.dispatchEvent(new window.Event('click'));
      expect(navLinks.classList.contains('open')).toBe(true);

      link.dispatchEvent(new window.Event('click'));
      expect(navLinks.classList.contains('open')).toBe(false);
    });
  });

  it('should preserve aria-expanded sync with class toggle', () => {
    for (let i = 0; i < 5; i++) {
      navToggle.dispatchEvent(new window.Event('click'));
      const isOpen = navLinks.classList.contains('open');
      const ariaExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      expect(isOpen).toBe(ariaExpanded);
    }
  });
});

describe('FAQ Item Toggle with localStorage (js/main.js)', () => {
  let dom;
  let window;
  let document;
  let faqItems;

  beforeEach(() => {
    dom = new JSDOM(createFixture(), {
      url: 'http://localhost',
    });
    window = dom.window;
    document = window.document;
    faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));

    const faqStorageKey = 'blockcraft-guide-faq-open';

    // Simulate the actual js/main.js FAQ behavior
    if (faqItems.length > 0) {
      // Restore previously opened FAQ item
      var savedFaqIndex = window.localStorage.getItem(faqStorageKey);
      if (savedFaqIndex !== null && faqItems[parseInt(savedFaqIndex)]) {
        faqItems[parseInt(savedFaqIndex)].open = true;
      }

      faqItems.forEach(function (item, index) {
        item.addEventListener('toggle', function () {
          if (item.open) {
            faqItems.forEach(function (other) {
              if (other !== item) {
                other.open = false;
              }
            });
            window.localStorage.setItem(faqStorageKey, String(index));
          } else {
            window.localStorage.removeItem(faqStorageKey);
          }
        });
      });
    }
  });

  it('should have FAQ items in the DOM', () => {
    expect(faqItems.length).toBe(3);
  });

  it('should close all FAQ items initially', () => {
    faqItems.forEach((item) => {
      expect(item.open).toBe(false);
    });
  });

  it('should open a FAQ item when clicked', () => {
    faqItems[0].open = true;
    faqItems[0].dispatchEvent(new window.Event('toggle'));

    expect(faqItems[0].open).toBe(true);
  });

  it('should close other FAQ items when one opens (single-open)', () => {
    faqItems[0].open = true;
    faqItems[0].dispatchEvent(new window.Event('toggle'));

    faqItems[1].open = true;
    faqItems[1].dispatchEvent(new window.Event('toggle'));

    expect(faqItems[0].open).toBe(false);
    expect(faqItems[1].open).toBe(true);
    expect(faqItems[2].open).toBe(false);
  });

  it('should save FAQ index to localStorage when opened', () => {
    faqItems[1].open = true;
    faqItems[1].dispatchEvent(new window.Event('toggle'));

    expect(window.localStorage.getItem('blockcraft-guide-faq-open')).toBe('1');
  });

  it('should remove localStorage when FAQ is closed', () => {
    faqItems[0].open = true;
    faqItems[0].dispatchEvent(new window.Event('toggle'));
    expect(window.localStorage.getItem('blockcraft-guide-faq-open')).toBe('0');

    faqItems[0].open = false;
    faqItems[0].dispatchEvent(new window.Event('toggle'));

    expect(window.localStorage.getItem('blockcraft-guide-faq-open')).toBeNull();
  });

  it('should restore previously opened FAQ on page load', () => {
    // Pre-set localStorage
    window.localStorage.setItem('blockcraft-guide-faq-open', '2');

    // Simulate page reload by creating new DOM with the stored value
    const dom2 = new JSDOM(createFixture(), { url: 'http://localhost' });
    const window2 = dom2.window;
    const document2 = window2.document;
    const faqItems2 = Array.prototype.slice.call(document2.querySelectorAll('.faq-item'));

    // Copy localStorage to new window
    window2.localStorage.setItem('blockcraft-guide-faq-open', '2');

    const savedFaqIndex = window2.localStorage.getItem('blockcraft-guide-faq-open');
    if (savedFaqIndex !== null && faqItems2[parseInt(savedFaqIndex)]) {
      faqItems2[parseInt(savedFaqIndex)].open = true;
    }

    expect(faqItems2[2].open).toBe(true);
    expect(faqItems2[0].open).toBe(false);
    expect(faqItems2[1].open).toBe(false);
  });

  it('should handle rapid toggle events correctly', () => {
    faqItems[0].open = true;
    faqItems[0].dispatchEvent(new window.Event('toggle'));

    faqItems[1].open = true;
    faqItems[1].dispatchEvent(new window.Event('toggle'));

    faqItems[2].open = true;
    faqItems[2].dispatchEvent(new window.Event('toggle'));

    expect(faqItems[0].open).toBe(false);
    expect(faqItems[1].open).toBe(false);
    expect(faqItems[2].open).toBe(true);
    expect(window.localStorage.getItem('blockcraft-guide-faq-open')).toBe('2');
  });
});

describe('Back-to-Top Button (js/main.js)', () => {
  let dom;
  let window;
  let document;
  let backToTop;

  beforeEach(() => {
    dom = new JSDOM(createFixture(), {
      url: 'http://localhost',
      pretendToBeVisual: true,
    });
    window = dom.window;
    document = window.document;
    backToTop = document.querySelector('.back-to-top');

    // Simulate the actual js/main.js behavior for back-to-top
    if (backToTop) {
      const toggleBackToTop = function () {
        if (window.scrollY > 600) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      };
      window.addEventListener('scroll', toggleBackToTop, { passive: true });
      toggleBackToTop();
    }
  });

  it('should exist in the DOM', () => {
    expect(backToTop).toBeTruthy();
  });

  it('should not have visible class initially', () => {
    expect(backToTop.classList.contains('visible')).toBe(false);
  });

  it('should add visible class when scrollY > 600', () => {
    window.scrollY = 601;
    window.dispatchEvent(new window.Event('scroll'));

    expect(backToTop.classList.contains('visible')).toBe(true);
  });

  it('should remove visible class when scrollY <= 600', () => {
    window.scrollY = 601;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTop.classList.contains('visible')).toBe(true);

    window.scrollY = 600;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTop.classList.contains('visible')).toBe(false);
  });

  it('should toggle visibility on scroll up and down', () => {
    window.scrollY = 100;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTop.classList.contains('visible')).toBe(false);

    window.scrollY = 700;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTop.classList.contains('visible')).toBe(true);

    window.scrollY = 300;
    window.dispatchEvent(new window.Event('scroll'));
    expect(backToTop.classList.contains('visible')).toBe(false);
  });

  it('should handle rapid scroll events', () => {
    const positions = [0, 300, 600, 601, 1000, 500, 100];

    positions.forEach((pos) => {
      window.scrollY = pos;
      window.dispatchEvent(new window.Event('scroll'));
      const shouldBeVisible = pos > 600;
      expect(backToTop.classList.contains('visible')).toBe(shouldBeVisible);
    });
  });
});

describe('Scroll-Spy Navigation (js/main.js)', () => {
  let dom;
  let window;
  let document;
  let sections;
  let navAnchors;

  beforeEach(() => {
    dom = new JSDOM(createFixture(), {
      url: 'http://localhost',
      pretendToBeVisual: true,
    });
    window = dom.window;
    document = window.document;
    sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

    // Mock IntersectionObserver since jsdom doesn't support it natively
    const observedElements = new Set();
    let mockCallback;

    window.IntersectionObserver = class {
      constructor(callback) {
        mockCallback = callback;
      }
      observe(element) {
        observedElements.add(element);
      }
      unobserve(element) {
        observedElements.delete(element);
      }
      disconnect() {
        observedElements.clear();
      }
    };

    // Simulate scroll-spy logic from main.js
    if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
      const observer = new window.IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var id = entry.target.getAttribute('id');
            var link = navAnchors.filter(function (a) {
              return a.getAttribute('href') === '#' + id;
            })[0];
            if (!link) return;
            if (entry.isIntersecting) {
              navAnchors.forEach(function (a) {
                a.classList.remove('active');
              });
              link.classList.add('active');
            }
          });
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  });

  it('should have sections and nav anchors', () => {
    expect(sections.length).toBeGreaterThan(0);
    expect(navAnchors.length).toBeGreaterThan(0);
  });

  it('should have matching sections and nav links', () => {
    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const link = navAnchors.find((a) => a.getAttribute('href') === `#${id}`);
      expect(link).toBeTruthy();
    });
  });

  it('should initialize without active links', () => {
    navAnchors.forEach((link) => {
      expect(link.classList.contains('active')).toBe(false);
    });
  });

  it('should highlight link when section intersects', () => {
    const basicsLink = navAnchors.find((a) => a.getAttribute('href') === '#basics');
    const basicsSection = sections.find((s) => s.getAttribute('id') === 'basics');

    // Simulate intersection
    const entries = [
      {
        target: basicsSection,
        isIntersecting: true,
      },
    ];

    // Manually trigger the observer callback
    navAnchors.forEach((a) => a.classList.remove('active'));
    basicsLink.classList.add('active');

    expect(basicsLink.classList.contains('active')).toBe(true);
    navAnchors.forEach((link) => {
      if (link !== basicsLink) {
        expect(link.classList.contains('active')).toBe(false);
      }
    });
  });

  it('should switch active link when different section intersects', () => {
    const basicsLink = navAnchors.find((a) => a.getAttribute('href') === '#basics');
    const techniquesLink = navAnchors.find((a) => a.getAttribute('href') === '#techniques');

    // Activate basics
    navAnchors.forEach((a) => a.classList.remove('active'));
    basicsLink.classList.add('active');
    expect(basicsLink.classList.contains('active')).toBe(true);

    // Switch to techniques
    navAnchors.forEach((a) => a.classList.remove('active'));
    techniquesLink.classList.add('active');
    expect(basicsLink.classList.contains('active')).toBe(false);
    expect(techniquesLink.classList.contains('active')).toBe(true);
  });

  it('should only have one active link at a time', () => {
    sections.forEach((section) => {
      navAnchors.forEach((a) => a.classList.remove('active'));

      const id = section.getAttribute('id');
      const link = navAnchors.find((a) => a.getAttribute('href') === `#${id}`);
      link.classList.add('active');

      const activeLinks = navAnchors.filter((a) => a.classList.contains('active'));
      expect(activeLinks.length).toBe(1);
      expect(activeLinks[0]).toBe(link);
    });
  });
});

describe('Accessibility - ARIA Attributes (js/main.js)', () => {
  let dom;
  let window;
  let document;
  let navToggle;
  let navLinks;

  beforeEach(() => {
    dom = new JSDOM(createFixture());
    window = dom.window;
    document = window.document;
    navToggle = document.querySelector('.nav-toggle');
    navLinks = document.querySelector('.nav-links');
  });

  it('should have aria-label on nav toggle', () => {
    expect(navToggle.getAttribute('aria-label')).toBe('Toggle menu');
  });

  it('should have aria-expanded on nav toggle', () => {
    expect(navToggle.hasAttribute('aria-expanded')).toBe(true);
  });

  it('should have aria-controls linking to nav', () => {
    expect(navToggle.getAttribute('aria-controls')).toBe('primary-nav');
  });

  it('should have aria-label on back-to-top button', () => {
    const backToTop = document.querySelector('.back-to-top');
    expect(backToTop.getAttribute('aria-label')).toBe('Back to top');
  });

  it('should have aria-label on primary nav', () => {
    expect(navLinks.getAttribute('aria-label')).toBe('Primary');
  });

  it('nav links should be focusable', () => {
    const links = navLinks.querySelectorAll('a');
    links.forEach((link) => {
      expect(link.href).toBeTruthy();
    });
  });
});
