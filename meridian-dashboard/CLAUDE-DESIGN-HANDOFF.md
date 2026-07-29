# Meridian — Claude Design handoff

Paste the prompt below into your Claude Design project. It contains the full spec
needed to rebuild the dashboard there, with no reference to outside files.

If you'd rather not retype the code, the ready-made single-file build is
`meridian-bundle.html` (250 KB, all CSS + JS inlined, no external requests except
the Playfair Display webfont).

---

## Paste-ready prompt

Add a luxury wealth-analytics dashboard called **Meridian** as a new page.

**Vibe:** Editorial Luxury — warm cream background (`#FFFBEB` light / `#020617`
dark), Playfair Display serif for all headings, system sans for body. Amber
(`#B45309` light / `#FBBF24` dark) is the single accent, used for eyebrow labels,
gradient text, progress bars, and chart fills. No second accent hue.

**Layout:** five stacked sections, each `py-32 px-6 md:px-12`, content capped at
`max-w-6xl mx-auto`. Cards are `rounded-3xl` with a hairline border
(`border-amber-100` light / `border-slate-800` dark) on a white/`slate-900`
surface.

**1. Navigation** — a floating glass pill, not a full-width bar: sticky, `mt-6`,
`mx-auto w-max`, `rounded-full`, `px-8 py-3`, backdrop blur, subtle shadow.
Contains a small amber gradient circle + the wordmark "Meridian" in serif, and a
light/dark theme toggle button on the right.

**2. Hero** — eyebrow "YOUR WEALTH" in amber, uppercase, `tracking-widest`,
`text-sm`. Then an H1 at `text-6xl md:text-7xl`, max two lines:
"Navigate Your **Financial Path**" — the second phrase in an amber gradient
clip-text. Below it, three metric cards in a `md:grid-cols-3` row, each entering
with a staggered fade-up (0s / 0.1s / 0.2s):

| Label | Value | Sub-line |
|---|---|---|
| Total Assets | $5.62M | +9.2% YTD (green) |
| Monthly Return | +$287K | ↑ 8.7% month-over-month (blue) |
| Risk Score | Moderate | Well-balanced portfolio (orange) |

**3. Portfolio Composition** — eyebrow "ASSET ALLOCATION", H2 "Portfolio
Composition". A `md:grid-cols-2` grid of four cards, one per asset class. Each
card shows the class name (serif), its allocation %, an amber gradient progress
bar that animates from 0% to its value when the card scrolls into view, the
dollar value, and the 12-month return in green/red.

| Asset class | Value | Allocation | 12M return |
|---|---|---|---|
| Equities | $2.84M | 52% | +8.2% |
| Fixed Income | $1.68M | 31% | +1.4% |
| Alternatives | $680K | 13% | +12.6% |
| Real Estate | $420K | 8% | +3.1% |

Cards reveal on scroll via IntersectionObserver — `opacity-0 translate-y-8` →
`opacity-100 translate-y-0` over 700ms, staggered 100ms apart by index. On hover
they lift: `scale-[1.02]` plus a larger shadow.

**4. Growth Trajectory** — eyebrow "PERFORMANCE", H2 "Growth Trajectory". One
wide card containing a 7-bar column chart, `h-64`, bars flex-filled and bottom-
aligned with `rounded-t-lg` amber gradient fills. Bar height is the value as a
percentage of the max. Month label sits under each bar; the dollar value fades in
under the label on hover only.

Jan $4.20M · Feb $4.38M · Mar $4.52M · Apr $4.68M · May $4.92M · Jun $5.22M ·
Jul $5.62M

**5. Footer** — brand block on the left (mark + wordmark + the line "Navigate your
financial future with precision and confidence. Premium wealth management for
discerning investors."), and three link columns on the right: Product
(Dashboard, Analytics, Reports), Company (About, Blog, Contact), Legal (Privacy,
Terms, Security). A hairline rule above a centered copyright line.

**Motion rules:** every transition uses a custom cubic-bezier, never `linear` or
`ease-in-out`. Animate only `transform` and `opacity`. Apply backdrop blur only
to the sticky nav, never to scrolling content.

**Responsive:** below `768px` every grid collapses to a single column, the H1
drops to `text-6xl`, and section padding tightens. Nothing overlaps or rotates on
mobile.

---

## Source of truth in this repo

- `src/App.tsx` — the implementation the spec above describes
- `src/App.css` — Playfair import, `fadeUp` keyframes, scrollbar styling
- `meridian-bundle.html` — built single-file version
