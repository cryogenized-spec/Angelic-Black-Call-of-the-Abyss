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

`index.html` is the GitHub Pages entry point. During Pass 2 the canonical runtime has moved to `src/game.html` while the original `Main.html` is retained as a rollback/reference copy.

## Development roadmap

### Pass 1 — Baseline & Hardening

Establish a reproducible baseline, GitHub Pages entry point, smoke-test contract, and project documentation without changing gameplay.

### Pass 2 — Engine Refactor

Stage the monolithic HTML extraction into explicit static boundaries while preserving gameplay behaviour. The first step relocates the canonical runtime; later Pass 2 commits will extract CSS, engine state, gameplay systems, narrative, UI, and audio modules.

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

## Pass documentation

- [`docs/PASS-1-BASELINE.md`](docs/PASS-1-BASELINE.md)
- [`docs/PASS-2-ENGINE-REFACTOR.md`](docs/PASS-2-ENGINE-REFACTOR.md)
