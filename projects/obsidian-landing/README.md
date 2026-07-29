# Obsidian Landing — imported from Claude Design

Imported from the Claude Design project `6009bd55-6b5e-41b8-a257-08140674bd32`
("Shared design project") via the `DesignSync` tool.

## What's here

| File | Size | Notes |
| --- | ---: | --- |
| `Obsidian Landing.dc.html` | 41,415 | The landing page |
| `Obsidian Landing copy.dc.html` | 41,415 | Byte-identical to the above |
| `Obsidian Landing Standalone.src.dc.html` | 42,207 | Same page plus bundler thumbnail + `ext-resource-dependency` on the Command Center |
| `Obsidian Command Center.dc.html` | 16,166 | 1920×1080 dashboard, embedded in the landing via `<dc-import>` |
| `image-slot.js` | 64,449 | `<image-slot>` custom element (omelette starter scaffold) |
| `support.js` | 69,150 | Generated `dc-runtime` bundle |
| `github.md` | 603 | Sync metadata pointing at `.claude/skills/ui-ux-pro-max` |

## Missing: the three uploads

`uploads/IMG_0006.png`, `uploads/IMG_0011.png`, and `uploads/IMG_9984.jpeg` are
**not** in this directory. `DesignSync.get_file` caps a read at 256 KiB, and all
three exceed it — each came back with `truncated: true` at exactly 262,144 base64
characters. Writing them would have produced corrupt image files, so they were
skipped rather than saved in a broken state.

All three are referenced by the pages:

- `IMG_0011.png` — hero image, right column
- `IMG_0006.png` — "The Streak" bento card background
- `IMG_9984.jpeg` — journal section, rotated -90°

To complete the import, download them from the Claude Design project UI and drop
them into `uploads/`. Nothing else needs to change — the paths in the HTML
already match.

## Rendering

These are `.dc.html` files: `<x-dc>` template + a `DCLogic` class in a
`<script type="text/x-dc">` block, driven by `support.js`. They need the Claude
Design runtime (or its `dc-runtime` host) to render — opening them directly in a
browser will not evaluate the `{{ }}` bindings, `<sc-for>`, `<sc-if>`, or
`<dc-import>`.
