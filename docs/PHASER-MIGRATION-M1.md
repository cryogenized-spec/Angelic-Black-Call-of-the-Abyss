# Phaser 4 Migration — M1 Foundation

Date: 2026-08-23

## Objective

Create a parallel Phaser 4 runtime without changing or replacing the current GitHub Pages game.

## Baseline contract

- Browser-first
- Static hosting / GitHub Pages compatible
- HTML + CSS + JavaScript
- Landscape-first
- 960×540 logical game surface
- 2880px world width
- Pixel-art rendering
- PWA remains the production shell during migration

## Implementation

The migration target lives under `phaser/` and is reachable as a separate static page while `index.html` continues to launch the legacy runtime.

Phaser 4.2.1 is temporarily loaded from jsDelivr. This is a migration convenience only; the production target will vendor or bundle Phaser so the final game is not dependent on a third-party CDN.

The initial runtime contains:

- `BootScene` — confirms Phaser bootstrap and target presentation settings.
- `MigrationProbeScene` — proves the logical viewport, world bounds, camera, pixel-art configuration, landscape gate, and frame lifecycle without porting gameplay yet.

## Migration rule

No gameplay system is considered migrated until the Phaser implementation reaches parity with the legacy game's behavior. The legacy runtime remains the rollback/reference build throughout the port.

## Next migration stage

M2 ports the asset and character foundation, beginning with the Necro Queen gameplay sprite at 64×96 and the player-facing camera/controller contract.
