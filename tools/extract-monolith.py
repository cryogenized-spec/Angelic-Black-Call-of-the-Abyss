#!/usr/bin/env python3
"""Mechanically split the canonical game document without rewriting runtime code."""
from pathlib import Path

GAME = Path('src/game.html')
CSS = Path('src/css/game.css')
JS = Path('src/js/game.js')

source = GAME.read_text(encoding='utf-8')
style_open, style_close = '<style>', '</style>'
script_open, script_close = '<script>', '</script>'

if source.count(style_open) != 1 or source.count(style_close) != 1:
    raise SystemExit('Expected exactly one inline style block.')
if source.count(script_open) != 1 or source.count(script_close) != 1:
    raise SystemExit('Expected exactly one inline game script block.')

s0 = source.index(style_open)
s1 = source.index(style_close, s0)
j0 = source.index(script_open)
j1 = source.index(script_close, j0)

css = source[s0 + len(style_open):s1].lstrip('\n').rstrip() + '\n'
js = source[j0 + len(script_open):j1].lstrip('\n').rstrip() + '\n'

out = source[:s0] + '<link rel="stylesheet" href="css/game.css">\n' + source[s1 + len(style_close):j0]
out += '<script src="js/game.js"></script>\n' + source[j1 + len(script_close):]

CSS.parent.mkdir(parents=True, exist_ok=True)
JS.parent.mkdir(parents=True, exist_ok=True)
CSS.write_text(css, encoding='utf-8')
JS.write_text(js, encoding='utf-8')
GAME.write_text(out, encoding='utf-8')

check = GAME.read_text(encoding='utf-8')
if '<style>' in check or '<script>\n' in check:
    raise SystemExit('Extraction failed: inline style/script remains.')
if 'href="css/game.css"' not in check or 'src="js/game.js"' not in check:
    raise SystemExit('Extraction failed: external module references missing.')

print('Pass 2B extraction complete.')
