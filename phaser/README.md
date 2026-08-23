# Phaser 4 Migration Runtime

This directory is the parallel migration target for **Angelic Black — Call of the Abyss**.

It is intentionally not the GitHub Pages production entry point yet. The legacy runtime remains under `src/game.html` until Phaser reaches gameplay parity.

## Current foundation

- Phaser 4.2.1
- 960×540 logical game surface
- 16:9 landscape-first presentation
- pixel-art rendering (`pixelArt: true`)
- FIT scaling with centered canvas
- 2880px world width
- explicit portrait orientation gate
- Boot scene + migration probe scene

The Phaser library is temporarily loaded from jsDelivr. After the migration proves stable, we will vendor or bundle Phaser for a self-contained production build.
