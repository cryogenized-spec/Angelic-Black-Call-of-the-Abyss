# Pass 1 — Baseline & Hardening

## Purpose

Pass 1 establishes a low-risk, reproducible baseline without changing gameplay systems or refactoring the existing game engine.

## Baseline source

- Current game source: `Main.html`
- Rendering: Canvas 2D, internal resolution `540 × 675`
- World width: `2880`
- Runtime: browser JavaScript with static HTML/CSS assets
- Deployment target: GitHub Pages

## Pass 1 changes

- Added `index.html` as the GitHub Pages entry point.
- Added `.nojekyll` for explicit static-site handling.
- Preserved `Main.html` unchanged.
- Documented the baseline and future hardening scope here.

## Important current dependency

`Main.html` still references externally hosted fonts and artwork, including `image.qwenlm.ai`. This is intentionally **not** changed in Pass 1; asset localisation is scheduled for a later pass.

## Smoke-test target

Before accepting Pass 1 as complete, verify in a browser:

1. GitHub Pages opens `index.html`.
2. `index.html` forwards to `Main.html`.
3. Title/boot sequence appears.
4. Comic sequence can be advanced.
5. A new run can start.
6. Player movement, jump, basic attack and summon work.
7. Inventory opens and closes.
8. Level-up can trigger and resolve.
9. Death/continue flow works.
10. Restart returns to a fresh run.

## Deliberately deferred

- Engine/module refactor
- Gameplay changes
- Balance changes
- Local asset migration
- Sprite replacement
- New content
- Performance optimisation

Those belong to later passes so that each change remains attributable and reversible.
