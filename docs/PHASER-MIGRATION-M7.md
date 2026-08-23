# Phaser M7 — Playable parity foundation

M7 adds the minimum progression/state loop needed to play a meaningful Level 1 run through combat, death/respawn, advancement, and first-boss completion.

Implemented:
- XP and level progression;
- level-up trait selection (Vitality / Charisma);
- Queen death state with limited resurrections;
- respawn cleanup and wave-one restart;
- pickup-to-inventory bridging;
- enemy-kill XP rewards;
- first-boss/Level 1 completion handoff;
- corrected the M6 scene scope bug where `cfg` was referenced outside `create()`.

Still deferred:
- final cinematic/dialogue parity;
- final portraits and level-up artwork;
- touch combat controls;
- final audio integration;
- final FX/lighting pass;
- full GitHub Pages cutover from the legacy runtime.
