import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "motion-hero-demo.html");
const html = fs.readFileSync(htmlPath, "utf8");

// jsdom does not implement <script type="module"> execution (it's an explicit
// TODO in jsdom's HTMLScriptElement), so the animation script itself never
// runs here. These tests instead verify the two things that actually matter:
// the no-js/JS-enabled CSS states a real browser would render before the
// module script executes, and (via static checks) that the script still
// wires up the DOM/vendor contract it depends on.
function loadPage() {
  const dom = new JSDOM(html, { url: "http://localhost/demo/motion-hero-demo.html", pretendToBeVisual: true });
  return { window: dom.window, document: dom.window.document };
}

describe("no-js progressive enhancement", () => {
  test("body starts in the no-js state", () => {
    const { document } = loadPage();
    assert.equal(document.body.classList.contains("no-js"), true);
  });

  test("hero content is fully visible before any JS runs", () => {
    const { window, document } = loadPage();
    const title = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");
    const cta = document.getElementById("cta");

    assert.equal(window.getComputedStyle(title).opacity, "1");
    assert.equal(window.getComputedStyle(subtitle).opacity, "1");
    assert.equal(window.getComputedStyle(cta).opacity, "1");
  });

  test("hero content starts hidden once JS is enabled, ready for the entrance animation", () => {
    const { window, document } = loadPage();
    document.body.classList.remove("no-js");
    const title = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");
    const cta = document.getElementById("cta");

    assert.equal(window.getComputedStyle(title).opacity, "0");
    assert.equal(window.getComputedStyle(subtitle).opacity, "0");
    assert.equal(window.getComputedStyle(cta).opacity, "0");
  });
});

describe("animation script wiring (static checks)", () => {
  test("references elements that actually exist in the markup", () => {
    const { document } = loadPage();
    assert.ok(document.getElementById("title"));
    assert.ok(document.getElementById("subtitle"));
    assert.ok(document.getElementById("cta"));
  });

  function getModuleScriptText() {
    const { document } = loadPage();
    const script = Array.from(document.querySelectorAll('script[type="module"]')).find((s) =>
      s.textContent.includes("motion.bundle.js")
    );
    assert.ok(script, "expected a <script type=\"module\"> importing motion.bundle.js");
    return script.textContent;
  }

  test("imports the vendored motion library from the expected relative path", () => {
    const scriptText = getModuleScriptText();
    assert.match(scriptText, /from\s+["']\.\/vendor\/motion\.bundle\.js["']/);
  });

  test("the imported vendor file actually exists on disk", () => {
    const vendorPath = path.join(__dirname, "vendor", "motion.bundle.js");
    assert.equal(fs.existsSync(vendorPath), true);
  });

  test("removes the no-js class so CSS reveals content once JS has taken over", () => {
    const scriptText = getModuleScriptText();
    assert.match(scriptText, /classList\.remove\(\s*["']no-js["']\s*\)/);
  });

  test("checks prefers-reduced-motion and skips the full entrance animation for it", () => {
    const scriptText = getModuleScriptText();
    assert.match(scriptText, /matchMedia\(\s*["']\(prefers-reduced-motion:\s*reduce\)["']\s*\)/);
    assert.match(scriptText, /if\s*\(\s*prefersReducedMotion\s*\)/);
  });

  test("only wires up the hover gesture outside the reduced-motion branch", () => {
    const scriptText = getModuleScriptText();
    const reducedMotionBranch = scriptText.split(/if\s*\(\s*prefersReducedMotion\s*\)/)[1].split("} else {")[0];
    const fullMotionBranch = scriptText.split("} else {")[1];

    assert.doesNotMatch(reducedMotionBranch, /hover\(/);
    assert.match(fullMotionBranch, /hover\(\s*cta/);
  });
});
