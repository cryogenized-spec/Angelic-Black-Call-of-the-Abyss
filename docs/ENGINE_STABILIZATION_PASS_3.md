# Pass 3 — Engine Stabilisation & Dependency Cleanup

Pass 3 keeps the existing vanilla/classic-script architecture and strengthens the runtime boundary before deeper subsystem refactoring.

## Stabilisation contract

- `src/js/modules/20-engine-stability.js` owns frame-health telemetry, periodic numeric state validation, debug diagnostics, and browser visibility/resume handling.
- The runtime hardening chain loads the stability supervisor before declaring the runtime ready.
- The main loop reports frame timing to the supervisor without changing simulation rules or render order.
- State validation is intentionally observational: it reports invalid numeric state instead of mutating gameplay state.
- Debug telemetry is opt-in with `?debug=1` and is absent during normal play.

## Non-goals

No gameplay rebalance, entity caps, sprite changes, asset changes, framework adoption, or ES-module conversion are part of Pass 3.
