#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nano Banana image generation & editing.

Generates new images from text or transforms uploaded reference images using
Google's "Nano Banana" models:
  - Nano Banana (default): gemini-2.5-flash-image - fast, high-volume, low-latency
  - Nano Banana Pro (--pro): gemini-3-pro-image-preview - professional quality

Curated transformation presets (anime-to-life, photo-restoration, imax-portrait,
j-idol, real-mecha, ...) live in ../presets.json and can be applied with --preset.

Usage:
    # text-to-image
    python generate.py --prompt "a red panda barista, studio lighting" -o panda.png

    # image-to-image with a preset
    python generate.py --preset photo-restoration --image old.jpg -o restored.png
    python generate.py --preset anime-to-life --image char.png --pro

    # preset + extra guidance
    python generate.py --preset imax-portrait --image me.png --prompt "golden hour"

    # list presets
    python generate.py --list-presets
"""

import argparse
import json
import mimetypes
import os
import sys
from datetime import datetime
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
PRESETS_PATH = SKILL_DIR / "presets.json"


def load_env():
    """Load .env files in priority order (does not override existing env)."""
    env_paths = [
        SKILL_DIR.parent / ".env",            # .claude/skills/.env
        Path.home() / ".claude" / "skills" / ".env",
        Path.home() / ".claude" / ".env",
    ]
    for env_path in env_paths:
        if env_path.exists():
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, value = line.split("=", 1)
                        if key not in os.environ:
                            os.environ[key] = value.strip("\"'")


load_env()


def _import_genai():
    """Import google-genai lazily so --list-presets works without the SDK."""
    try:
        from google import genai
        from google.genai import types
        return genai, types
    except ImportError:
        print("Error: google-genai package not installed.")
        print("Install with: pip install -r requirements.txt  (or: pip install google-genai)")
        sys.exit(1)


GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

GEMINI_FLASH = "gemini-2.5-flash-image"        # Nano Banana
GEMINI_PRO = "gemini-3-pro-image-preview"      # Nano Banana Pro

ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"]


def _safety_settings(types):
    return [
        types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="BLOCK_LOW_AND_ABOVE"),
        types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="BLOCK_LOW_AND_ABOVE"),
        types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="BLOCK_LOW_AND_ABOVE"),
        types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="BLOCK_LOW_AND_ABOVE"),
    ]


def load_presets():
    if not PRESETS_PATH.exists():
        return {}
    with open(PRESETS_PATH) as f:
        return json.load(f)


def build_contents(types, prompt, image_paths):
    """Build the contents list: reference images first, then the text prompt."""
    contents = []
    for img_path in image_paths:
        p = Path(img_path)
        if not p.exists():
            print(f"Error: image not found: {img_path}")
            sys.exit(1)
        mime = mimetypes.guess_type(str(p))[0] or "image/png"
        contents.append(types.Part.from_bytes(data=p.read_bytes(), mime_type=mime))
    contents.append(prompt)
    return contents


def generate(prompt, image_paths=None, output_path=None, use_pro=False, aspect_ratio=None):
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not set")
        print("Set it with: export GEMINI_API_KEY='your-key'  (or add it to .claude/.env)")
        return None

    image_paths = image_paths or []
    genai, types = _import_genai()
    client = genai.Client(api_key=GEMINI_API_KEY)

    model = GEMINI_PRO if use_pro else GEMINI_FLASH
    model_label = "Nano Banana Pro (gemini-3-pro-image-preview)" if use_pro \
        else "Nano Banana (gemini-2.5-flash-image)"

    image_config = None
    if aspect_ratio and aspect_ratio in ASPECT_RATIOS:
        image_config = types.ImageConfig(aspect_ratio=aspect_ratio)

    mode = "image-to-image" if image_paths else "text-to-image"
    print(f"Model: {model_label}")
    print(f"Mode:  {mode}" + (f" ({len(image_paths)} reference image(s))" if image_paths else ""))
    if aspect_ratio:
        print(f"Aspect ratio: {aspect_ratio}")
    print(f"Prompt: {prompt[:150]}{'...' if len(prompt) > 150 else ''}\n")

    try:
        config_kwargs = {
            "response_modalities": ["IMAGE", "TEXT"],
            "safety_settings": _safety_settings(types),
        }
        if image_config is not None:
            config_kwargs["image_config"] = image_config

        response = client.models.generate_content(
            model=model,
            contents=build_contents(types, prompt, image_paths),
            config=types.GenerateContentConfig(**config_kwargs),
        )

        image_data = None
        for part in response.candidates[0].content.parts:
            if getattr(part, "inline_data", None) and part.inline_data.mime_type.startswith("image/"):
                image_data = part.inline_data.data
                break

        if not image_data:
            print("No image generated. The model may have refused or returned text only.")
            for part in response.candidates[0].content.parts:
                if getattr(part, "text", None):
                    print(f"Model said: {part.text}")
            return None

        if output_path is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = f"nano_banana_{timestamp}.png"

        with open(output_path, "wb") as f:
            f.write(image_data)

        print(f"Image saved to: {output_path}")
        return output_path

    except Exception as e:
        print(f"Error generating image: {e}")
        return None


def main():
    presets = load_presets()

    parser = argparse.ArgumentParser(description="Generate or edit images with Nano Banana (Gemini)")
    parser.add_argument("--prompt", "-p", type=str, help="Text prompt (or extra guidance appended to a preset)")
    parser.add_argument("--preset", choices=list(presets.keys()) if presets else None,
                        help="Apply a curated transformation preset")
    parser.add_argument("--image", "-img", action="append", default=[],
                        help="Reference/input image path (repeat for multiple)")
    parser.add_argument("--output", "-o", type=str, help="Output file path")
    parser.add_argument("--aspect-ratio", "-r", choices=ASPECT_RATIOS, help="Output aspect ratio")
    parser.add_argument("--pro", action="store_true",
                        help="Use Nano Banana Pro (gemini-3-pro-image-preview)")
    parser.add_argument("--list-presets", action="store_true", help="List available presets and exit")

    args = parser.parse_args()

    if args.list_presets:
        if not presets:
            print("No presets found.")
            return
        print("Available presets:\n")
        for name, p in presets.items():
            img = " [needs --image]" if p.get("requires_image") else ""
            print(f"  {name}{img}\n    {p.get('description', '')}\n")
        return

    if not args.prompt and not args.preset:
        parser.error("Provide --prompt and/or --preset")

    prompt = args.prompt or ""
    aspect_ratio = args.aspect_ratio

    if args.preset:
        preset = presets[args.preset]
        if preset.get("requires_image") and not args.image:
            parser.error(f"Preset '{args.preset}' requires at least one --image")
        # Preset default aspect ratio unless the user overrode it
        if aspect_ratio is None and preset.get("aspect_ratio"):
            aspect_ratio = preset["aspect_ratio"]
        preset_prompt = preset["prompt"]
        prompt = f"{preset_prompt}\n\nAdditional guidance: {prompt}" if prompt else preset_prompt

    generate(
        prompt=prompt,
        image_paths=args.image,
        output_path=args.output,
        use_pro=args.pro,
        aspect_ratio=aspect_ratio,
    )


if __name__ == "__main__":
    main()
