# Pass 2D — Runtime Dependency Map

The runtime is intentionally still loaded as classic scripts. Modules communicate through shared top-level `var` and function declarations, so script order is currently part of the runtime contract.

## Stable order

`00-runtime-preamble` → `01-setup` → `02-hidden-consequence-variables` → `03-title-state-machine` → `04-comic` → `05-audio` → `06-input-router` → `07-hotkeys` → `08-state` → `09-death-continue-final` → `10-cutscenes` → `11-level-up` → `12-menu` → `13-sprites` → `14-world-draw` → `15-hud` → `16-fx-only-update` → `17-update` → `18-main-loop`.

## Current dependency pattern

- `01-setup` owns canvas/DOM setup, asset URLs, and early shared constants.
- `05-audio` exposes the shared `AC`, `tone`, and `sfx` globals used across gameplay and narrative modules.
- `08-state` owns the majority of mutable game state and shared helpers such as `clamp`, `rnd`, `waveDef`, `makePlayer`, and `startRun`.
- `09`–`12` consume state, cutscene, audio, DOM, inventory, and progression globals.
- `13`–`15` are rendering consumers of state and helpers.
- `16`–`17` are simulation consumers of nearly every gameplay global.
- `18` is the terminal scheduler and dispatches all major runtime modes.

## Pass 2D policy

This pass does **not** convert the runtime to ES modules and does **not** rename gameplay globals. Instead it establishes a diagnostic runtime contract and documents the dependency edges so future migration can be incremental and testable.
