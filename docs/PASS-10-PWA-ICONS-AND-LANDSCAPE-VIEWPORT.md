# Pass 10 — PWA Icons & Landscape Viewport Boundary

## PWA icon upload location

Place authored application icons in `assets/icons/`:

- `icon-192.png` — 192×192 PNG.
- `icon-512.png` — 512×512 PNG.

`manifest.json` and `index.html` already reference these paths.

## Landscape boundary

The product direction is now landscape-first. Pass 9 established the manifest orientation and runtime landscape request. Pass 10 deliberately does not stretch the existing 540×675 internal renderer into 16:9.

The existing simulation/render coordinates remain the prototype baseline until the dedicated landscape-geometry pass converts the viewport, camera framing, HUD, touch controls and coordinate mapping as one coherent change.

## Next geometry pass requirements

- choose and document the new logical landscape resolution;
- preserve game-world simulation units where possible;
- separate simulation coordinates from presentation coordinates;
- expand horizontal camera visibility;
- reposition HUD and touch controls for landscape-safe zones;
- update cutscene and overlay composition for widescreen artwork;
- ensure pixel-perfect scaling without horizontal distortion;
- test portrait rejection/landscape entry on mobile browsers and installed PWA.
