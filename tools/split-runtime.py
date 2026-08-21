#!/usr/bin/env python3
"""Split the monolithic game runtime into ordered classic-script modules.

This is intentionally mechanical: section boundaries come only from the
existing `/* ================= NAME ================= */` markers, and the
module bodies are emitted byte-for-byte in their original order.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = ROOT / "src" / "js" / "game.js"
HTML = ROOT / "src" / "game.html"
MODULE_DIR = ROOT / "src" / "js" / "modules"

HEADER_RE = re.compile(r"(?m)^/\*\s*=+\s*(.*?)\s*=+\s*\*/\s*$")
SCRIPT_RE = re.compile(r'(?m)^<script\s+src=["\']js/game\.js["\']></script>\s*$')


def slug(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "section"


def main() -> int:
    source = JS.read_text(encoding="utf-8")
    matches = list(HEADER_RE.finditer(source))
    if not matches:
        raise SystemExit("No section markers found in src/js/game.js")

    sections: list[tuple[str, str]] = []
    prefix = source[: matches[0].start()]
    if prefix:
        sections.append(("runtime-preamble", prefix))

    for i, match in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(source)
        sections.append((match.group(1).strip(), source[match.start():end]))

    MODULE_DIR.mkdir(parents=True, exist_ok=True)
    module_paths: list[Path] = []
    used: dict[str, int] = {}

    for index, (name, body) in enumerate(sections):
        base = slug(name)
        used[base] = used.get(base, 0) + 1
        suffix = f"-{used[base]}" if used[base] > 1 else ""
        path = MODULE_DIR / f"{index:02d}-{base}{suffix}.js"
        path.write_text(body, encoding="utf-8")
        module_paths.append(path)

    reconstructed = "".join(path.read_text(encoding="utf-8") for path in module_paths)
    if reconstructed != source:
        raise SystemExit("Split integrity failure: modules do not reconstruct src/js/game.js byte-for-byte")

    document = HTML.read_text(encoding="utf-8")
    if not SCRIPT_RE.search(document):
        raise SystemExit("src/game.html does not contain the expected js/game.js script tag")

    tags = "\n".join(
        f'<script src="js/modules/{html.escape(path.name, quote=True)}"></script>'
        for path in module_paths
    )
    updated = SCRIPT_RE.sub(tags, document, count=1)
    HTML.write_text(updated, encoding="utf-8")

    print(f"Generated {len(module_paths)} runtime modules.")
    print("Verified byte-for-byte reconstruction of src/js/game.js.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
