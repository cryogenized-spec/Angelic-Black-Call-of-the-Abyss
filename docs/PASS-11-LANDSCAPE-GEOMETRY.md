# Pass 11 — Landscape Geometry

Convert the logical game viewport from portrait 540×675 to landscape 960×540.

The simulation/world model remains authoritative. The 2880px world therefore exposes roughly three landscape screens while physics, entity positions, and world-space logic remain unchanged except for the shared ground presentation constant.

This pass must preserve GitHub Pages/PWA compatibility, pixel scaling, cutscene overlays, HUD readability, and touch controls.
