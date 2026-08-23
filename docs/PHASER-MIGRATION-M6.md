# Phaser 4 Migration — M6 Combat Architecture Expansion

Date: 2026-08-23

## Scope
Expand the M5 combat vertical slice into the core Level 1 combat roster while keeping the old production runtime untouched.

## Added

- shared enemy roster/base behaviour;
- Knight, Zombie, Cultist, Mage, Bat and Mara gameplay enemies;
- Grave Lord boss with health phases and summon pressure;
- enemy projectiles and Queen hit handling;
- pickup drops and collection;
- Grave Lance, Ossuary Mantle and Gravefall spell systems;
- wave compositions through the first boss wave;
- boss title presentation and basic defeat/respawn loop;
- procedural fallback textures for all migrated combat actors.

## Deliberate limits

Final sprites, cinematic boss entrance/defeat scenes, the full inventory/vendor UI, touch combat, advanced FX/lighting, and the remaining narrative systems are separate migration passes.

## Design rule

Mechanics are migrated first. Visual polish is layered on afterward through authored sprites and reusable FX so gameplay parity never depends on final art being present.
