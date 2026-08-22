# Angelic Black — Sprite Production Manifest

All gameplay character sprites target a crisp pixel-art presentation. Queen frames use 64x96 logical pixels. Other characters may use smaller or larger logical frames as specified by their silhouette.

## Player — Necro Queen

Source videos should be short, locked-camera side-view animation clips using the canonical Queen design. Generate the movement in the direction named, then extract frames into the named sheets. The runtime should flip the canonical right-facing artwork for left-facing movement; do not author duplicate left/right sheets unless a future animation requires asymmetry.

### `assets/sprites/player/queen-idle.png`
4 frames, 64x96 each.
1 neutral standing; 2 subtle inhale; 3 neutral; 4 subtle exhale.
Source video: quiet idle loop, full-body side view, minimal movement. Hair, chains and shredded train provide most of the secondary motion.

### `assets/sprites/player/queen-walk.png`
8 frames, 64x96 each.
1 right leg forward; 2 passing; 3 left leg forward; 4 passing; 5 right leg forward; 6 passing; 7 left leg forward; 8 passing.
Source video: elegant side-on walk toward screen-right. Upper body stays controlled and nearly level. Long hair, chains and train follow the gait.

### `assets/sprites/player/queen-jump.png`
4 frames, 64x96 each.
1 takeoff preparation; 2 ascending; 3 apex; 4 descending.
Source video: restrained supernatural jump. No exaggerated crouch or acrobatics.

### `assets/sprites/player/queen-cast.png`
6 frames, 64x96 each.
1 neutral; 2 casting hand rises; 3 arm extended; 4 spell peak; 5 release; 6 return.
Source video: Gravebolt-style casting. Body remains controlled; magic, hair and train provide motion.

### `assets/sprites/player/queen-hurt.png`
3 frames, 64x96 each.
1 impact; 2 recoil; 3 recovery.
Source video: brief controlled hit reaction. Preserve regal posture; no exaggerated ragdoll.

### `assets/sprites/player/queen-death.png`
6 frames, 64x96 each.
1 stagger; 2 loss of balance; 3 descending/kneeling; 4 collapse; 5 fallen; 6 still.
Source video: dignified supernatural defeat. Train and hair settle with the body.

### `assets/sprites/player/queen-special.png`
8 frames, 64x96 each.
Signature necromantic ability / Grave Lance / high-power spell animation. Preserve restrained aristocratic movement while allowing large magical effects.

## Enemy roster

Generate canonical side-view clips facing screen-right. Runtime may flip for the opposite direction.

### `assets/sprites/enemies/knight.png`
Suggested 48x64 frames.
Required motions: idle, walk, attack, hurt, death.
Source videos: ceremonial corrupted knight; heavy controlled movement; sword-based attack.

### `assets/sprites/enemies/zombie.png`
Suggested 48x64 frames.
Required motions: idle, walk, attack, hurt, death.
Source videos: shambling undead movement; asymmetric posture; slow melee attack.

### `assets/sprites/enemies/cultist.png`
Suggested 48x64 frames.
Required motions: idle, walk, cast, hurt, death.
Source videos: robed occult enemy; restrained ritual casting; staff/hand magic.

### `assets/sprites/enemies/mage.png`
Suggested 48x64 frames.
Required motions: idle, walk, cast, hurt, death.
Source videos: hostile spellcaster; readable casting pose; minimal footwork.

### `assets/sprites/enemies/fly.png`
Suggested 32x32 frames.
Required motions: hover, fly-forward, attack, hurt/death.
Source videos: small airborne undead/insect creature; rapid wing movement.

### `assets/sprites/enemies/bat.png`
Suggested 32x32 frames.
Required motions: hover, flight loop, attack, hurt/death.
Source videos: gothic bat silhouette; strong readable wing cycle.

### `assets/sprites/enemies/mara.png`
Suggested 48x72 frames.
Required motions: idle, walk, attack, hurt, death.
Source videos: capable human warrior; grounded and alert movement rather than monster animation.

## Bosses

### `assets/sprites/bosses/grave-lord.png`
Suggested 64x96 or 80x112 frames.
Required motions: idle, walk, heavy attack, special attack, hurt, death.
Source videos: enormous corrupted knight / undead lord. Heavy, deliberate movement. Large silhouette.

### `assets/sprites/bosses/skeletal-lord.png`
Suggested 96x128 frames.
Required motions: idle, walk, attack, summon, special, hurt, death.
Source videos: towering skeletal sovereign. Strong silhouette, long limbs, ritualistic movement.

## Summons

### `assets/sprites/summons/skeleton-retainer-a.png`
Suggested 48x64 frames.
Required motions: idle, walk, scimitar attack, hurt, death.
Source video: ancient loyal royal guard; aggressive scimitar style.

### `assets/sprites/summons/skeleton-retainer-b.png`
Suggested 48x64 frames.
Required motions: idle, walk, attack, hurt, death.
Source video: older/deliberate royal guard; more measured movement than Retainer A.

### `assets/sprites/summons/skeleton-archer.png`
Suggested 48x64 frames.
Required motions: idle, walk, aim, fire, hurt, death.
Source video: undead archer retainer; calm deliberate bow handling.

## Extraction rules

Keep the camera locked and the character centered identically across the source video. Keep feet aligned to a constant baseline. Do not include UI, text, ground shadows that move between frames, background scenery, camera motion, zoom, depth-of-field effects, or changing lighting.

Prefer a clean flat or transparent-compatible background so frames can be isolated cleanly. Generate screen-right-facing canonical artwork. Mirror in code for screen-left movement.

The generated video is the source material. Only extracted individual PNG frames and assembled sprite sheets belong in the repository; source videos do not need to be committed unless specifically useful as production references.
