# Test Coverage Analysis

**Last updated:** July 28, 2026  
**Repository:** Claude-Repo (sandbox/starter repo)

## Executive Summary

The codebase has **selective unit test coverage** focused on utility functions and server logic. Critical gaps exist in:
- **DOM integration tests** (event listeners, class toggling, actual navigation behavior)
- **React component testing** (SnapSite.jsx, location-map-demo components)
- **E2E and integration tests** (client-server streaming, real browser behavior)
- **Accessibility and performance tests** (beyond ARIA attributes)

---

## Current Test Coverage

### ✅ Well-Tested Areas

#### 1. **js/main.test.js** (449 lines, ~100% unit coverage)
Tests extracted utilities used in the root site's navigation and FAQ:
- **Navigation toggle**: State management, reset behavior
- **FAQ localStorage**: Persistence, restoration, clearing
- **Markdown renderer**: XSS protection (escaping HTML), heading/list rendering, bold text
- **Form validation**: Empty/whitespace rejection, trimming, location handling
- **ARIA management**: aria-expanded, aria-label updates
- **Keyboard navigation**: Arrow key handling, focus history, boundary conditions
- **Storage quota**: Size tracking, overflow detection, item replacement

**Note:** These are *extracted/testable* versions of the logic, not the actual DOM implementations.

#### 2. **projects/snapsite-website/index.test.js** (511 lines, client-side utilities)
Tests client-side helpers for the SnapSite front-end:
- **Markdown rendering & XSS**: Same as above, specific to SnapSite HTML structure
- **Form validation**: Notes and location field handling
- **SSE event parsing**: Parsing delta, done, error events from the server stream
- **Stream buffer management**: Incomplete chunks, event extraction, malformed event skipping
- **Timeout & retry logic**: State transitions, max retry limits, reset behavior

**Note:** Again, *extracted* utility logic, not the actual React component.

#### 3. **projects/snapsite-website/server/index.test.js** (302 lines, Node test runner)
Tests the Express API endpoint thoroughly:
- **Request validation**: Empty/whitespace notes rejection, location optional handling
- **Prompt assembly**: Location line presence/absence, field note formatting
- **SSE streaming**: Delta events, done event with status, sequential delivery
- **Error handling**: Upstream failures sent as SSE error events (no 500 status)
- **Request body limits**: 64 KB limit enforcement
- **Edge cases**: Non-string values, special characters, empty chunks, model/thinking parameters

---

## ❌ Gaps & Untested Code

### 1. **DOM Integration (High Priority)**

**File:** `js/main.js` (87 lines, 0% coverage)

The actual DOM manipulation code is untested:
- NavToggle event listener and class toggling
- IntersectionObserver scroll-spy for nav highlighting (not unit-testable without DOM)
- Back-to-top button visibility toggle on scroll
- FAQ item toggle event listeners and localStorage integration in real DOM
- Focus restoration for accessibility

**Why tested logic exists separately:** The utilities are extracted to be testable in jsdom, but the actual wiring to the DOM elements is not tested.

**Example untested flow:**
```javascript
navToggle.addEventListener('click', function () {
  var isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));  // ← tested in isolation
});
// ^ the actual event firing, element selection, and class toggle are not tested
```

### 2. **React Components (High Priority)**

#### **SnapSite.jsx** (41+ KB, 0% coverage)
- Component rendering and layout
- Icon rendering (11 custom SVG icons)
- Feature cards, step cards, testimonials rendering
- Demo report draft rendering with markdown
- Form state management and submission
- Streaming response handling (connects to server)
- Loading states, error states
- Mobile responsiveness (Tailwind classes)

#### **location-map-demo/src/App.tsx** (44 lines, 0% coverage)
- Location mapping and card positioning
- DraggableCardContainer integration
- LOCATIONS data transformation and rendering
- Component composition

#### **location-map-demo/src/components/** (4+ files, 0% coverage)
- `expand-map.tsx`: LocationMap component (map rendering, coordinates display)
- `draggable-card.tsx`: Card dragging/tilting interaction
- `lib/utils.ts`: Any utility functions

### 3. **Integration & E2E (High Priority)**

**Missing end-to-end flows:**
1. **Client-Server Streaming**
   - User enters notes, submits form
   - Server receives request, validates, calls Claude API
   - Stream response arrives in browser as SSE events
   - React component accumulates deltas and renders live
   - Test: Actual HTTP request/response, not mocked client

2. **Full SnapSite Flow**
   - Open index.html, enter notes, click "Draft Report"
   - Wait for streaming response
   - Verify markdown is rendered safely in the DOM
   - User reviews and can "Approve" or "Edit"

3. **Location Map Interaction**
   - Drag card with momentum
   - Card tilts based on mouse position
   - Click to expand and see map/coordinates
   - Click to collapse

### 4. **Accessibility (Medium Priority)**

**Currently tested (unit level):**
- ARIA attribute values (aria-expanded, aria-label)

**Not tested:**
- Keyboard navigation (Tab, Enter, Escape through actual DOM)
- Screen reader announcement of state changes
- Focus trap behavior in modal-like components
- Semantic HTML structure (headings hierarchy, list nesting)
- Color contrast (no visual regression tests)
- Link/button semantics (actual clickability)

**Tools available:** Could use `axe-core`, `pa11y`, or Playwright's accessibility checks.

### 5. **Static Sites (Lower Priority)**

**index.html** (marketing/sales site, 29 KB)
- Root site navigation and layout
- Scroll-spy highlighting
- FAQ accordion behavior
- No automated tests; manual verification only

**demo/motion-hero-demo.html** (standalone demo)
- Motion library integration
- No tests; visual verification only

### 6. **Performance & Load (Lower Priority)**

**Not tested:**
- SSE stream performance (latency, memory during long responses)
- Large markdown document rendering (XSS protection with huge payloads)
- Storage quota exhaustion scenarios (garbage collection, recovery)
- localStorage quota errors in real browser

---

## Test Recommendations (Priority Order)

### **Phase 1: Critical (Blocks production use)**

#### 1.1 DOM Integration Tests for `js/main.js`
- **Tool:** Vitest with jsdom
- **Tests to add:**
  - Navigation toggle: Click event fires, class toggles, ARIA updates
  - FAQ state: Click toggles details element, localStorage persists, only one open
  - Scroll-spy: IntersectionObserver fires, active link updates as you scroll
  - Back-to-top button: Appears at 600px scroll, clicking scrolls to top
  - Focus management: FAQ toggle receives focus, keyboard nav works
- **Estimated coverage:** 80–90% (IntersectionObserver is hard to mock)
- **Files to create:** `js/main.integration.test.js` (200–300 lines)

#### 1.2 React Component Tests for SnapSite
- **Tool:** Vitest + React Testing Library (or `@testing-library/react`)
- **Tests to add:**
  - SnapSite renders without errors
  - Form submission calls `/api/draft-report` with notes and location
  - Streaming SSE events are parsed and appended to DOM
  - Markdown is rendered safely (no XSS even if server sends malicious data)
  - Error state is shown if streaming fails
  - Loading spinner while draft is generated
  - "Approve" / "Edit" buttons appear after draft completes
  - Mobile layout is responsive
- **Estimated coverage:** 70–80% (interactive animations harder to test)
- **Files to create:** `projects/snapsite-website/SnapSite.test.jsx` (400–500 lines)

#### 1.3 Client-Server Integration Test
- **Tool:** Vitest + supertest (or fetch in jsdom)
- **Tests to add:**
  - POST `/api/draft-report` with valid notes and location
  - SSE response stream parses correctly in browser
  - Multiple delta events accumulate into final text
  - Done event arrives after stream ends
  - Error event on upstream failure
  - Cancel mid-stream (AbortController)
- **Estimated coverage:** 100% (happy path + error path)
- **Files to create:** `projects/snapsite-website/client-server.integration.test.js` (200–300 lines)

### **Phase 2: High-Value (Improves reliability)**

#### 2.1 location-map-demo Component Tests
- **Tool:** Vitest + React Testing Library
- **Tests to add:**
  - App renders location cards at correct positions
  - DraggableCardContainer applies 3D perspective
  - Dragging card tilts and follows mouse
  - Clicking card expands to full-screen map view
  - Map shows correct coordinates
  - Responsive behavior on mobile (card positions scale)
- **Estimated coverage:** 60–70% (drag animations complex to test)
- **Files to create:** `projects/location-map-demo/src/App.test.tsx`, `src/components/*.test.tsx` (300–400 lines)

#### 2.2 Accessibility (a11y) Tests
- **Tool:** Vitest + axe-core
- **Tests to add:**
  - SnapSite form: Labels associated with inputs, ARIA properties correct
  - Navigation: Keyboard navigation only (no mouse), skip links work
  - FAQ: Heading hierarchy, list structure valid
  - Color contrast: Text on background (automated)
  - Root site: Link text not just "click here"
- **Estimated coverage:** 85%+ (axe catches most issues)
- **Files to create:** `a11y.test.js` (150–200 lines)

#### 2.3 Markdown Safety Edge Cases
- **Tool:** Vitest (extend existing tests)
- **Tests to add:**
  - Nested HTML entities (e.g., `&lt;script&gt;`)
  - Data URIs in markdown (e.g., `![](data:...)`)
  - SVG injection attempts
  - Huge payloads (10 MB of text)
  - Mixed escaped/unescaped content
- **Estimated coverage:** 95%+
- **Files to update:** `js/main.test.js`, `projects/snapsite-website/index.test.js` (100 lines total)

### **Phase 3: Nice-to-Have (Polish)**

#### 3.1 E2E Tests with Playwright
- **Tool:** Playwright or Cypress
- **Tests:**
  - Full SnapSite user flow: Load, enter notes, submit, see draft stream, approve
  - Location map: Drag card, expand, close
  - Root site: Navigation scroll-spy, back-to-top, FAQ toggle persistence
- **Estimated coverage:** 80%+
- **Files to create:** `e2e/snapsite.spec.js`, `e2e/location-map.spec.js` (300–400 lines)

#### 3.2 Performance Tests
- **Tool:** Lighthouse, Vitest benchmarks
- **Tests:**
  - SSE latency: Time from request to first delta event
  - Rendering time: Accumulating 100+ delta events and re-rendering
  - localStorage quota: Performance degradation as quota approaches
- **Estimated coverage:** Sampling only (not 100%)
- **Files to create:** `perf.bench.js` (150 lines)

#### 3.3 Visual Regression Tests
- **Tool:** Percy, Chromatic, or pixelmatch
- **Tests:**
  - SnapSite layout on mobile/tablet/desktop
  - location-map card positions and animations
  - Root site hero and sections
- **Estimated coverage:** ~100% (visual area)
- **No new test files; CI/CD integration**

---

## Test Infrastructure Setup

### Current Setup
- **Test Runner:** Vitest 1.0.0
- **Environment:** jsdom (DOM simulation)
- **Scope:** `js/*.test.js`, `projects/**/*.test.js`
- **Exclude:** `node_modules/`, `server/` (server tests use Node's `test` module)
- **Scripts:** `npm test`, `npm run test:ui`, `npm run test:coverage`

### Recommended Additions
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "axe-core": "^4.7.0",
    "axe-vitest": "^0.2.0",
    "supertest": "^6.3.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Recommended Configuration Updates
- Add `@testing-library/react` configuration to `vitest.config.js`
- Add `.coverage/` to `.gitignore`
- Create GitHub Actions workflow to run tests on PR

---

## Coverage Targets

| Area | Current | Target | Priority |
|------|---------|--------|----------|
| `js/main.js` | 0% (DOM) | 80% | Critical |
| `SnapSite.jsx` | 0% | 70% | Critical |
| `location-map-demo/src/` | 0% | 60% | High |
| `Server API` | ~95% | 98% | High |
| Accessibility | Unit-only | E2E | Medium |
| Performance | 0% | Sampling | Low |
| E2E flows | 0% | 80% | Low |

---

## Quick Start: Add Your First Test

To start with Phase 1.1 (DOM integration for main.js):

```bash
# 1. Create the test file
touch js/main.integration.test.js

# 2. Write a minimal test
cat > js/main.integration.test.js << 'EOF'
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('js/main.js DOM Integration', () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM(`
      <html>
        <body>
          <nav>
            <button class="nav-toggle" aria-expanded="false">Menu</button>
            <div class="nav-links"></div>
          </nav>
        </body>
      </html>
    `);
    document = dom.window.document;
  });

  it('should toggle nav-links open class on button click', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.dispatchEvent(new dom.window.Event('click'));
    expect(navLinks.classList.contains('open')).toBe(true);
  });
});
EOF

# 3. Run the test
npm test js/main.integration.test.js
```

---

## Files to Create/Modify

### Create
- [ ] `js/main.integration.test.js` (200–300 lines)
- [ ] `projects/snapsite-website/SnapSite.test.jsx` (400–500 lines)
- [ ] `projects/snapsite-website/client-server.integration.test.js` (200–300 lines)
- [ ] `projects/location-map-demo/src/App.test.tsx` (200–300 lines)
- [ ] `e2e/snapsite.spec.js` (300–400 lines, phase 3)

### Update
- [ ] `vitest.config.js` (add React testing library config)
- [ ] `package.json` (add devDependencies)
- [ ] `.github/workflows/test.yml` (add CI workflow if needed)

---

## Success Criteria

✅ **Phase 1 Complete:** 80%+ coverage on all critical paths
- DOM navigation, FAQ, scroll-spy working
- SnapSite form-to-draft flow tested
- Client-server streaming verified

✅ **Phase 2 Complete:** Accessibility passed, reliability high
- a11y tests pass (axe, keyboard nav)
- location-map components tested
- XSS edge cases covered

✅ **Phase 3 Complete:** E2E, visual, and performance baselines
- Full user flows testable in browser
- Visual regression caught before merge
- Performance benchmarks tracked

---

## Notes

1. **Separated Unit Tests:** Utilities are tested in isolation (extracted from `main.js`), but the actual integration with the DOM is untested. This is intentional but creates a gap — Phase 1 closes it.

2. **SnapSite.jsx Complexity:** The component is large (~42 KB) with inline data, icons, and forms. Breaking it into smaller components first may make testing easier.

3. **Location Map:** Depends on Aceternity UI and vendored libraries. May need to mock or spy on drag handlers.

4. **Server Test Coverage:** Already solid (~95%). Only minor additions needed (edge cases, concurrency).

5. **No Test Coverage Tool Configured:** Run `npm run test:coverage` to generate reports and find gaps in real time.
