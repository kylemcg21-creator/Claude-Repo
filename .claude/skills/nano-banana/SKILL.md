---
name: nano-banana
description: "Generate and edit images with Google's Nano Banana models (gemini-2.5-flash-image and gemini-3-pro-image-preview). Text-to-image and image-to-image (editing, outpainting, style transfer). Includes curated transformation presets: anime-to-life, figure-to-life, photo-restoration, imax-portrait, real-mecha, character-reference-sheet, j-idol, j-cover, plus a J-Poses library. Actions: generate image, create image, edit photo, restore photo, transform, outpaint, upscale, cosplay, magazine cover, reference sheet."
argument-hint: "[preset] [--image path] [prompt]"
license: MIT
metadata:
  author: claudekit
  version: "1.0.0"
  inspired-by: "https://github.com/ShinChven/nano-banana-skills"
---

# Nano Banana - Image Generation & Editing

Generate brand-new images from text, or transform uploaded images
(editing, outpainting, restoration, style transfer) using Google's
"Nano Banana" image models. Ships with curated transformation presets ported
from the [nano-banana-skills](https://github.com/ShinChven/nano-banana-skills)
project. This skill handles raster image generation and editing only — it does
not handle vector logos (use the `design` skill), HTML/slide layout, or video.

## When to Activate

- User asks to **generate / create an image** from a description.
- User asks to **edit, transform, restore, upscale, outpaint, or re-style** an image.
- User references a named transformation: "anime to life", "figure to life",
  "photo restoration", "IMAX portrait", "real mecha", "character reference
  sheet", "J-idol portrait", "magazine cover".
- User says "use nano banana" / "nano banana pro".

## Models

| Model | ID | Flag | Use for |
|-------|----|------|---------|
| Nano Banana | `gemini-2.5-flash-image` | _(default)_ | Drafts, fast iteration, high volume |
| Nano Banana Pro | `gemini-3-pro-image-preview` | `--pro` | Final renders, typography, complex multi-view layouts |

## Setup

Requires `GEMINI_API_KEY` and the `google-genai` package.

```bash
pip install -r requirements.txt
export GEMINI_API_KEY="your-key"      # or add it to .claude/.env
```

The script auto-loads `GEMINI_API_KEY` from `.claude/skills/.env`,
`~/.claude/skills/.env`, or `~/.claude/.env` if not already in the environment.

## Instructions

1. **Determine intent**: a fresh image (text-to-image) or a transformation of an
   existing image (image-to-image). For transformations, you need the path(s) to
   the user's image(s).
2. **Pick a preset if one fits** the request (see the table below or run
   `--list-presets`). Presets carry the full, tuned prompt; you only add the
   image and any extra guidance via `--prompt`. Otherwise write a direct prompt.
3. **Choose the model**: default Nano Banana for drafts; add `--pro` for final
   quality, anything with text/typography (`j-cover`), or multi-view layouts
   (`character-reference-sheet`).
4. **Run the script** from the skill directory.
5. **Report the output path** to the user. If the model returns text instead of
   an image (a refusal), relay that and adjust the prompt.

## Commands

Run from `.claude/skills/nano-banana/`:

```bash
# List presets
python scripts/generate.py --list-presets

# Text-to-image
python scripts/generate.py --prompt "a red panda barista, studio lighting" -o panda.png

# Text-to-image with aspect ratio + Pro model
python scripts/generate.py --prompt "neon cyberpunk alley at night" -r 16:9 --pro -o alley.png

# Apply a preset to an uploaded image (image-to-image)
python scripts/generate.py --preset photo-restoration --image old_photo.jpg -o restored.png
python scripts/generate.py --preset anime-to-life --image character.png --pro -o real.png

# Preset + extra guidance + multiple references
python scripts/generate.py --preset character-reference-sheet \
  --image front.png --image side.png --prompt "studio softbox lighting" --pro
```

### Options

| Flag | Description |
|------|-------------|
| `--prompt`, `-p` | Text prompt, or extra guidance appended to a preset |
| `--preset` | Curated transformation preset (see catalog) |
| `--image`, `-img` | Reference/input image path (repeat for multiple) |
| `--output`, `-o` | Output file path (default: `nano_banana_<timestamp>.png`) |
| `--aspect-ratio`, `-r` | One of `1:1 16:9 9:16 4:3 3:4 3:2 2:3` |
| `--pro` | Use Nano Banana Pro (`gemini-3-pro-image-preview`) |
| `--list-presets` | List available presets and exit |

## Presets

| Preset | Needs image | Purpose |
|--------|:-----------:|---------|
| `anime-to-life` | ✅ | Anime/art/3D → photorealistic cosplay photo, same pose & background |
| `figure-to-life` | ✅ | Figure/toy/statue → photorealistic human cosplayer |
| `photo-restoration` | ✅ | Vintage/blurry → crystal-clear 8k, identity preserved |
| `imax-portrait` | ✅ | Outpaint & recompose into IMAX 70mm portrait (1.43:1) |
| `real-mecha` | ✅ | 2D/anime mecha → photorealistic hard-surface render |
| `character-reference-sheet` | ✅ | 3:2 sheet: portrait + full-body front + back |
| `j-idol` | ✅ | New photorealistic J-Idol editorial portrait (identity from reference) |
| `j-cover` | ✅ | J-Media magazine cover: outpaint + bilingual typography + barcode |

Full descriptions, trigger phrases, and model recommendations are in
`references/presets.md`. The J-Poses posture/framing library is in
`references/poses.md`.

## Examples

**User:** "Restore this old photo of my grandmother." _(attaches `gma.jpg`)_
**Action:**
```bash
python scripts/generate.py --preset photo-restoration --image gma.jpg --pro -o gma_restored.png
```
Then report: "Restored to `gma_restored.png`."

**User:** "Turn this anime character into a real cosplayer."
**Action:**
```bash
python scripts/generate.py --preset anime-to-life --image char.png --pro -o cosplay.png
```

**User:** "Generate a 16:9 hero image of a misty mountain lake at sunrise."
**Action:**
```bash
python scripts/generate.py --prompt "misty mountain lake at sunrise, soft fog, golden light, photorealistic" -r 16:9 --pro -o hero.png
```
