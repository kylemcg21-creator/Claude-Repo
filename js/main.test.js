import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "main.js"), "utf8");

// A minimal IntersectionObserver stand-in: jsdom has no layout engine, so real
// intersection detection isn't possible. This captures what main.js observes
// and lets tests fire synthetic entries to drive the scroll-spy callback.
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.observed = [];
    MockIntersectionObserver.instances.push(this);
  }
  observe(el) {
    this.observed.push(el);
  }
  unobserve() {}
  disconnect() {}
}
MockIntersectionObserver.instances = [];

// Loads index.html into a fresh jsdom window and runs js/main.js against it,
// mirroring what a <script src="js/main.js"> tag does in a real browser.
function loadPage({ withIntersectionObserver = true } = {}) {
  MockIntersectionObserver.instances = [];
  const dom = new JSDOM(html, { url: "http://localhost/", runScripts: "dangerously" });
  const { window } = dom;
  if (withIntersectionObserver) {
    window.IntersectionObserver = MockIntersectionObserver;
  } else {
    delete window.IntersectionObserver;
  }
  window.eval(script);
  return { window, document: window.document };
}

describe("mobile nav toggle", () => {
  test("opening sets the open class and aria-expanded", () => {
    const { document } = loadPage();
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    navToggle.dispatchEvent(new document.defaultView.Event("click", { bubbles: true }));

    assert.equal(navLinks.classList.contains("open"), true);
    assert.equal(navToggle.getAttribute("aria-expanded"), "true");
  });

  test("clicking again closes it", () => {
    const { document } = loadPage();
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const click = () => navToggle.dispatchEvent(new document.defaultView.Event("click", { bubbles: true }));

    click();
    click();

    assert.equal(navLinks.classList.contains("open"), false);
    assert.equal(navToggle.getAttribute("aria-expanded"), "false");
  });

  test("clicking a nav link closes the open menu", () => {
    const { document } = loadPage();
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const firstLink = navLinks.querySelector("a");
    const Event = document.defaultView.Event;

    navToggle.dispatchEvent(new Event("click", { bubbles: true }));
    assert.equal(navLinks.classList.contains("open"), true);

    firstLink.dispatchEvent(new Event("click", { bubbles: true }));

    assert.equal(navLinks.classList.contains("open"), false);
    assert.equal(navToggle.getAttribute("aria-expanded"), "false");
  });
});

describe("scroll-spy nav highlighting", () => {
  test("observes every main section with an id", () => {
    const { document } = loadPage();
    const observer = MockIntersectionObserver.instances[0];
    const sections = document.querySelectorAll("main section[id]");

    assert.equal(observer.observed.length, sections.length);
  });

  test("marks the matching nav link active when a section intersects", () => {
    const { document } = loadPage();
    const observer = MockIntersectionObserver.instances[0];
    const techniquesSection = document.getElementById("techniques");
    const techniquesLink = document.querySelector('.nav-links a[href="#techniques"]');

    observer.callback([{ target: techniquesSection, isIntersecting: true }]);

    assert.equal(techniquesLink.classList.contains("active"), true);
  });

  test("moves the active class when a different section intersects", () => {
    const { document } = loadPage();
    const observer = MockIntersectionObserver.instances[0];
    const techniquesSection = document.getElementById("techniques");
    const stylesSection = document.getElementById("styles");
    const techniquesLink = document.querySelector('.nav-links a[href="#techniques"]');
    const stylesLink = document.querySelector('.nav-links a[href="#styles"]');

    observer.callback([{ target: techniquesSection, isIntersecting: true }]);
    observer.callback([{ target: stylesSection, isIntersecting: true }]);

    assert.equal(techniquesLink.classList.contains("active"), false);
    assert.equal(stylesLink.classList.contains("active"), true);
  });

  test("does nothing for a section with no matching nav link", () => {
    const { document } = loadPage();
    const observer = MockIntersectionObserver.instances[0];
    const heroSection = document.getElementById("top"); // no ".nav-links a[href=\"#top\"]" exists

    assert.doesNotThrow(() => {
      observer.callback([{ target: heroSection, isIntersecting: true }]);
    });
  });

  test("is skipped entirely when IntersectionObserver is unsupported", () => {
    assert.doesNotThrow(() => loadPage({ withIntersectionObserver: false }));
    assert.equal(MockIntersectionObserver.instances.length, 0);
  });
});

describe("back-to-top button", () => {
  test("stays hidden below the scroll threshold", () => {
    const { document } = loadPage();
    const backToTop = document.querySelector(".back-to-top");

    assert.equal(backToTop.classList.contains("visible"), false);
  });

  test("becomes visible once scrollY passes 600", () => {
    const { window, document } = loadPage();
    const backToTop = document.querySelector(".back-to-top");

    Object.defineProperty(window, "scrollY", { value: 700, configurable: true });
    window.dispatchEvent(new window.Event("scroll"));

    assert.equal(backToTop.classList.contains("visible"), true);
  });

  test("hides again once scrolled back up", () => {
    const { window, document } = loadPage();
    const backToTop = document.querySelector(".back-to-top");

    Object.defineProperty(window, "scrollY", { value: 700, configurable: true });
    window.dispatchEvent(new window.Event("scroll"));
    assert.equal(backToTop.classList.contains("visible"), true);

    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    window.dispatchEvent(new window.Event("scroll"));

    assert.equal(backToTop.classList.contains("visible"), false);
  });
});

describe("FAQ accordion", () => {
  test("opening one item closes the others", () => {
    const { document } = loadPage();
    const faqItems = Array.from(document.querySelectorAll(".faq-item"));
    const Event = document.defaultView.Event;

    faqItems[0].open = true;
    faqItems[0].dispatchEvent(new Event("toggle"));
    faqItems[1].open = true;
    faqItems[1].dispatchEvent(new Event("toggle"));

    assert.equal(faqItems[0].open, false);
    assert.equal(faqItems[1].open, true);
    faqItems.slice(2).forEach((item) => assert.equal(item.open, false));
  });

  test("closing the open item leaves the others untouched", () => {
    const { document } = loadPage();
    const faqItems = Array.from(document.querySelectorAll(".faq-item"));
    const Event = document.defaultView.Event;

    faqItems[0].open = true;
    faqItems[0].dispatchEvent(new Event("toggle"));
    faqItems[0].open = false;
    faqItems[0].dispatchEvent(new Event("toggle"));

    faqItems.forEach((item) => assert.equal(item.open, false));
  });
});
