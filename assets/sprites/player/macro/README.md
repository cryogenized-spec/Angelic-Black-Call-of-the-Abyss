# Macro Queen Sprite Library

This folder is reserved for the high-detail, landscape-first Queen sprite tier.

## Target frame size

128×192 logical pixels per frame.

## Canonical source

Generate short locked-camera side-view videos using the approved Queen master character reference. Use screen-right as the canonical authored direction; the runtime will mirror the finished frames for screen-left movement.

## Initial animation sheets

- `queen-macro-idle.png` — 4 frames: subtle breathing/secondary hair and train motion.
- `queen-macro-walk.png` — 8 frames: alternating gait, controlled upper body, moving hair/chains/train.
- `queen-macro-jump.png` — 4 frames: preparation, ascent, apex, descent.
- `queen-macro-cast.png` — 6 frames: hand rise, extension, spell peak, release, recovery.
- `queen-macro-hurt.png` — 3 frames: impact, recoil, recovery.
- `queen-macro-death.png` — 6 frames: stagger, descent, collapse, stillness.
- `queen-macro-special.png` — 8 frames: signature high-power necromantic action.

## Extraction rules

Camera locked. Character scale locked. Constant ground baseline. No camera movement, zoom, UI, text, changing lighting, moving scenery, or animated ground shadow. Keep the entire silhouette inside the 128×192 frame with consistent margins.
