# Angelic Black — Call of the Abyss

A browser-first gothic action/RPG prototype.

## Runtime target

The game is intentionally a static web game:

- HTML
- CSS
- vanilla JavaScript
- Canvas 2D
- GitHub Pages

No backend or server runtime is required.

## Current entry point

`index.html` is the GitHub Pages entry point and forwards to the existing `Main.html` prototype. `Main.html` remains the authoritative game source during Pass 1.

## Development roadmap

### Pass 1 — Baseline & Hardening

Establish a reproducible baseline, GitHub Pages entry point, smoke-test contract, and project documentation without changing gameplay.

### Pass 2 — Engine Refactor

Split the monolithic HTML into maintainable static JS/CSS modules while preserving gameplay behaviour.

### Pass 3 — Local Assets

Remove runtime dependence on externally hosted artwork/fonts and introduce a local asset manifest/loading layer.

### Pass 4 — Runtime Hardening

Stabilise state transitions, entity lifecycle, timers, input, audio, cutscenes, inventory, progression, and error handling.

### Pass 5 — Performance

Profile and optimise simulation/rendering/particle/audio workloads.

### Pass 6 — Gameplay Integrity

Balance and test progression, combat, waves, bosses, XP, mana, drops, and consequences.

### Pass 7 — Art Replacement

Replace prototype cinematic artwork with authored final art.

### Pass 8 — Sprite Renaissance

Polish or replace procedural gameplay sprites with a consistent authored sprite system.

## Pass 1 documentation

See [`docs/PASS-1-BASELINE.md`](docs/PASS-1-BASELINE.md).
