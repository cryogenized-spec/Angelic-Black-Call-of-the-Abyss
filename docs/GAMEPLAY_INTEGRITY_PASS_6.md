# Pass 6 — Gameplay Integrity & Balance Foundations

Pass 6 establishes runtime validation around the gameplay model before numerical balance tuning.

## Validation scope

- Player health, armour, mana, XP and level values remain finite and non-negative where appropriate.
- Inventory quantities never become negative or non-numeric.
- Wave definitions have valid counts/intervals and composition weights.
- Current wave/stage/spawn counters remain finite and sane.
- Spell hotkeys only reference acquired spells or intentionally empty slots.
- Core gameplay collections remain arrays and do not accumulate invalid entities.

## Balance policy

No combat, XP, mana, damage, enemy-health or wave-count values are changed purely by inspection. Numerical tuning follows an observed-playthrough pass once the game can be executed interactively in a browser.
