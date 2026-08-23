# Phaser M11 — Browser / Input / PWA Parity

Landscape-first browser parity for the Phaser runtime.

- 960×540 logical viewport remains authoritative.
- Touch controls are overlaid on the lower safe areas.
- Fullscreen is requested from a user gesture where supported.
- `screen.orientation.lock('landscape')` is attempted after the gesture and remains best-effort.
- The Phaser runtime can be installed as a standalone PWA from `/phaser/` without changing the legacy root game yet.
