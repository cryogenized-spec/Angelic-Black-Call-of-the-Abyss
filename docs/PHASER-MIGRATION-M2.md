# Phaser 4 Migration — M2 Necro Queen Player Foundation

Date: 2026-08-23

## Objective

Port the Necro Queen's player foundation into Phaser 4 while preserving the legacy game's 960×540 landscape presentation contract.

## Implemented

- Phaser Arcade Physics is now enabled for the migration runtime.
- `NecroQueen` is a dedicated `Phaser.Physics.Arcade.Sprite`.
- Horizontal movement uses acceleration and drag rather than direct position writes.
- Jumping uses coyote time and jump buffering so the controller is forgiving without changing the intended feel.
- Facing direction is maintained independently from velocity and drives horizontal sprite flipping.
- Player states are explicit: `idle`, `walk`, `jump`, and `fall`.
- The camera follows the Queen and adds directional look-ahead inside the 2880px world.
- A 64×96 generated placeholder texture is used until the authored Queen sprite sheets are uploaded.
- Animation keys are reserved as `queen-idle`, `queen-walk`, `queen-jump`, and `queen-fall` so the real extracted sheets can be connected without rewriting controller logic.

## Asset contract

The eventual production gameplay assets remain:

- `assets/sprites/player/queen-idle.png`
- `assets/sprites/player/queen-walk.png`
- `assets/sprites/player/queen-jump.png`
- `assets/sprites/player/queen-cast.png`
- `assets/sprites/player/queen-hurt.png`
- `assets/sprites/player/queen-death.png`
- `assets/sprites/player/queen-special.png`

The current fallback is deliberately not production art.

## Migration rule

M2 establishes controller behavior and engine contracts only. Combat, spells, health, mana, inventory, progression, enemy interaction, touch controls and narrative remain unmigrated until their own parity stages.
