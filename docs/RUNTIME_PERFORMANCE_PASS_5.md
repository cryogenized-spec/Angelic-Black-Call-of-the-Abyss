# Pass 5 — Runtime, Browser & Performance Hardening

Pass 5 makes behavior-preserving performance improvements to the browser runtime.

## Changes

- replaces per-frame `Array.prototype.filter()` cleanup in the particle/floater/ring/debris path with in-place compaction to reduce transient allocations and garbage-collection pressure;
- caches the fixed 540×675 scanline overlay once and composites it as a single image draw instead of issuing 225 fill operations every frame;
- strengthens the engine lifecycle supervisor with explicit paused state on document visibility changes and clearer debug telemetry;
- preserves the existing fixed-step clamp, simulation ordering, rendering order, gameplay values, encounter logic, and effect appearance.

## Non-goals

No enemy/boss balance changes, no entity-count caps, no art changes, no asset changes, no framework adoption, and no ES-module conversion.

## Runtime invariant

The game must continue to behave the same when the debug overlay is disabled. Performance work in this pass is intended to reduce CPU/GC overhead without changing the game's rules or visual composition.
