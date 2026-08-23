# Angelic Black — Legacy Runtime Archive

**ARCHIVE ONLY — NOT PART OF THE PRODUCTION GAME.**

This directory preserves the pre-Phaser 4 Angelic Black runtime for historical and reference purposes. The live game runs exclusively from `phaser/` using Phaser 4.2.1; the production boot chain does not load anything from this directory. The root `index.html` redirects to `phaser/`. 

## Archived runtime

`pre-phaser4-archive.txt` is the preserved source of the former monolithic HTML/Canvas implementation.

The archived runtime contains the old cover/title flow, comic sequence, audio system, keyboard/touch input routing, global game state, combat and enemy logic, skeleton retinue, spells, dialogue and cutscenes, waves and bosses, progression and level-ups, inventory and vendor systems, HUD, rendering, and the old main loop.

It is retained because it is useful as a reference for behaviour, story logic, old balance values, and historical implementation details while the Phaser runtime continues to evolve.

## Why the file is `.txt`

The archived source has deliberately been renamed from its previous runnable HTML path to `pre-phaser4-archive.txt`.

Do **not** rename it back to `.html` on `main`.

A `.txt` file is not an HTML document and is therefore not a game page that the browser will execute as part of the production site. GitHub Pages may still make the text file directly downloadable/viewable if someone knows its URL; that is different from it being an executable HTML entry point.

## Production boundary

Production entry:

`index.html` → `phaser/`

Active runtime:

`phaser/`

Legacy archive:

`legacy/`

Nothing in the Phaser boot chain should reference files under `legacy/`.

## Important maintenance rule

Treat this directory as read-only history. New gameplay work belongs in the Phaser runtime, not here.

For a backup that is **not published at all**, keep an additional copy in a separate branch or repository that is not deployed through GitHub Pages.