# Nano Banana Preset Catalog

Each preset is a curated, battle-tested prompt for a specific image
transformation. Presets are defined in `../presets.json` and applied with
`--preset <name>`. Presets marked **needs image** require at least one
`--image` reference (image-to-image / editing); the rest can also accept
references to anchor identity, pose, or composition.

| Preset | Needs image | Default ratio | What it does | Trigger phrases |
|--------|:-----------:|:-------------:|--------------|-----------------|
| `anime-to-life` | ✅ | source | Anime / art / 3D render → photorealistic cosplay photo of the same character, same pose & background. | "anime to life", "make this anime real", "cosplay version" |
| `figure-to-life` | ✅ | source | Figure / toy / statue photo → photorealistic human cosplayer; overrides plastic textures, matches lore. | "figure to life", "make this figure real", "statue to person" |
| `photo-restoration` | ✅ | source | Vintage / blurry photo → crystal-clear 8k while preserving identity, pose, composition. | "restore this photo", "fix this blurry image", "upscale and sharpen" |
| `imax-portrait` | ✅ | 4:3¹ | Outpaints & recomposes into IMAX 70mm portrait (1.43:1), centered subject, Nolan-esque grain & bokeh. | "IMAX portrait", "expand to IMAX 70mm", "Christopher Nolan style" |
| `real-mecha` | ✅ | source | 2D / anime mecha → photorealistic hard-surface 3D render, exact silhouette & loadout. | "make this mecha real", "photorealistic mecha", "robot drawing to photo" |
| `character-reference-sheet` | ✅ | 3:2 | 3:2 sheet: detailed portrait + full-body front + full-body back, matching source style. | "character reference sheet", "turnaround sheet", "3-view sheet" |
| `j-idol` | ✅ | 2:3 | New photorealistic J-Idol editorial portrait using reference for identity only; soft dreamy grade. | "J-idol portrait", "gravure portrait", "idol photoshoot" |
| `j-cover` | ✅ | source | J-Media magazine cover: 20% outpaint + bilingual typography, barcode, lore icon, price/date. | "magazine cover", "J-cover", "make a cover" |

¹ `imax-portrait` targets a 1.43:1 IMAX frame. Gemini's closest supported
aspect ratio is `4:3`; the prompt instructs the model to frame for 1.43:1.

See also `poses.md` for the J-Poses library (posture/framing descriptors that
pair well with `j-idol` or any portrait prompt).

## Choosing a model

- **Nano Banana** (`gemini-2.5-flash-image`, default) — fast, high-volume,
  great for drafts and iteration.
- **Nano Banana Pro** (`gemini-3-pro-image-preview`, `--pro`) — higher fidelity
  and stronger reasoning; prefer for final renders, text/typography (e.g.
  `j-cover`), and complex multi-view layouts (`character-reference-sheet`).
