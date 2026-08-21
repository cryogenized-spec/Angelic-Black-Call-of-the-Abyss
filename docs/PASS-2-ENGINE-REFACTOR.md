# Pass 2 — Engine Refactor

## Objective

Create a maintainable static-engine boundary without changing gameplay behaviour.

## Pass 2A completed

- `Main.html` is preserved as the original prototype baseline.
- A canonical runtime copy is established at `src/game.html` using the existing game blob; no gameplay code was rewritten during relocation.
- `index.html` will target `src/game.html` for the GitHub Pages runtime path.
- The repository remains static HTML/CSS/vanilla JavaScript and requires no build step.

## Why this is staged

The game source is a single large HTML document containing DOM, CSS, runtime state, rendering, combat, AI, narrative, cutscenes, UI, input, and audio. A blind one-shot extraction would create a high regression risk.

Pass 2 therefore uses a staged extraction strategy. The relocated runtime becomes the canonical source first; subsequent Pass 2 commits will peel CSS, data, runtime systems, and UI into separate static modules while preserving behaviour at every step.

## Target structure

```text
src/
  game.html          # temporary canonical runtime during extraction
  css/
  js/
    core/
    gameplay/
    narrative/
    ui/
    audio/
  assets/            # introduced formally in Pass 3
```

## Non-goals

No balance changes, art replacement, gameplay redesign, local asset migration, or framework adoption.

## Exit criteria

- GitHub Pages entry resolves to the canonical runtime.
- Prototype still starts and plays without requiring a build process.
- The original `Main.html` remains available as a rollback/reference copy until extraction is complete.
