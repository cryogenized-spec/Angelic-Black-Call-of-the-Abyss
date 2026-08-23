# Phaser 4 Migration — M5 Combat Parity

Date: 2026-08-23

## Objective

Establish a real playable combat slice in Phaser before migrating the rest of the enemy roster.

## Migrated mechanics

- Necro Queen HP and mana resources.
- Mana regeneration at 6/sec.
- Grave Bolt: 4 mana, short cast cooldown, directional projectile.
- Charged Grave Bolt: 18 mana, charge timing up to 2 seconds, higher damage and camera response.
- Queen/enemy collision damage with temporary invulnerability.
- Knight enemy with 12 HP and 12 contact damage.
- Projectile hit response, knockback, flash, and death fade.
- Wave 1: 8 Knights, 1.2s spawn interval.
- Wave 2: 12 Knights, 1.0s spawn interval.
- Wave-clear intermission and next-wave banner.

## Controls

- `←` / `→` move.
- `Space` / `↑` jump.
- `Z` cast Grave Bolt.
- Hold `X` to charge; release `X` to fire.

## Intentionally deferred

The remaining enemy archetypes, advanced spells, pickups, inventory, boss fights, scripted narrative, and mobile touch combat are not claimed as migrated by M5.

## Art policy

Combat uses procedural fallback textures until authored sprite sheets are uploaded. This keeps gameplay validation independent of the final art pipeline.

## Parity policy

M5 is a representative vertical slice. Damage/resource constants mirror the documented legacy prototype values where they are already explicit; visual effects and balance tuning will be handled separately after the core migration is proven.
