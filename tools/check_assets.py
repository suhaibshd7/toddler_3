#!/usr/bin/env python3
"""Validate all project WebP assets and the cat overlay canvas dimensions."""
from pathlib import Path
import sys

from PIL import Image, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
CAT_ASSETS = ASSETS / "cat"
errors = []
checked = 0

for path in sorted(ASSETS.rglob("*.webp")):
    checked += 1
    try:
        with Image.open(path) as image:
            image.load()
            if CAT_ASSETS in path.parents and image.size != (418, 418):
                errors.append(
                    f"{path.relative_to(ROOT)}: expected 418x418, got {image.width}x{image.height}"
                )
    except (OSError, UnidentifiedImageError, ValueError) as exc:
        errors.append(f"{path.relative_to(ROOT)}: cannot decode ({exc})")

if errors:
    print(f"Asset check failed: {len(errors)} issue(s) across {checked} WebP file(s).")
    for error in errors:
        print(f" - {error}")
    sys.exit(1)

print(f"Asset check passed: {checked} WebP file(s) decoded; all cat assets are 418x418.")
