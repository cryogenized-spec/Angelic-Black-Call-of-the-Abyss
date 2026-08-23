# Phaser 4 Migration — M13 Production Cutover

Date: 2026-08-23

## Scope
Make the Phaser runtime the shipped GitHub Pages entry point while preserving the legacy engine in `src/` for rollback/reference.

## Cutover

- root `index.html` launches `/phaser/`;
- root `manifest.json` points PWA start-up at `/phaser/`;
- Phaser is the gameplay runtime presented to users;
- legacy runtime remains in the repository but is no longer the production entry point.

## Validation contract

- 960×540 logical viewport;
- landscape-first browser presentation;
- PWA install metadata and icons preserved;
- Phaser assets remain under `phaser/` and `assets/`;
- GitHub Pages requires no build step.

## Rollback

The legacy runtime remains intact in `src/` and can be restored as the root launcher by reverting the M13 root entry-point commit.

## Next phase

M13 marks the end of the engine migration. Subsequent work is normal Angelic Black development: final art, expanded environments, bosses, narrative content, audio, balance, and production QA.
