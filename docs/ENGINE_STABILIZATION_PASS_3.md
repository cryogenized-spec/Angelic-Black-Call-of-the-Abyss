# Pass 3 — Engine Stabilisation & Dependency Cleanup

Pass 3 strengthens the existing vanilla/classic-script runtime before deeper subsystem refactoring.

## Stabilisation contract

- `20-engine-stability.js` owns frame-health telemetry, periodic numeric-state validation, debug diagnostics, and browser visibility/resume handling.
- Runtime readiness is not declared until the stability supervisor has initialized successfully.
- The main loop reports frame timing to the supervisor without changing simulation or render order.
- State validation is observational: invalid numeric state is reported rather than silently repaired.
- Debug telemetry is opt-in through `?debug=1` and is absent during normal play.

## Non-goals

No gameplay rebalance, entity caps, sprite changes, asset changes, framework adoption, or ES-module conversion are part of Pass 3.
