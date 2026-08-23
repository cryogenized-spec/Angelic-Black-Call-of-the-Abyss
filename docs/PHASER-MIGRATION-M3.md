# Phaser 4 Migration — M3 Necro Queen Sprite Pipeline

Date: 2026-08-23

## Objective

Connect the authored Necro Queen gameplay sprite sheets to the Phaser 4 player without coupling artwork filenames to gameplay logic.

## Production asset contract

All gameplay sheets are horizontal strips with 64×96 logical frames:

| Action | Filename | Frames | Sheet size | Playback |
|---|---|---:|---:|---:|
| Idle | `assets/sprites/player/queen-idle.png` | 4 | 256×96 | 6 fps, loop |
| Walk | `assets/sprites/player/queen-walk.png` | 8 | 512×96 | 10 fps, loop |
| Jump | `assets/sprites/player/queen-jump.png` | 4 | 256×96 | 8 fps |
| Cast | `assets/sprites/player/queen-cast.png` | 6 | 384×96 | 10 fps |
| Hurt | `assets/sprites/player/queen-hurt.png` | 3 | 192×96 | 12 fps |
| Death | `assets/sprites/player/queen-death.png` | 6 | 384×96 | 8 fps |
| Special | `assets/sprites/player/queen-special.png` | 8 | 512×96 | 10 fps |

The fourth frame of the jump sheet is used as the falling/descending pose until a dedicated fall sheet is ever justified.

## Runtime behavior

`QueenAssetCatalog.js` queues the sheets from the canonical asset paths and defines the Phaser animation keys. Missing files are tolerated; the corresponding animation falls back to the procedural 64×96 placeholder.

The Phaser sandbox displays which authored sheets are actually installed and provides keyboard action triggers for visual verification:

- `1` Idle
- `2` Walk
- `3` Jump
- `4` Cast
- `5` Hurt
- `6` Death
- `7` Special

The `NecroQueen` controller now supports temporary action states so a cast/hurt/special/death animation is not immediately overwritten by the locomotion state machine.

## Upload rule

Do not upload the source MP4 files to the repository. Extract the required frames, assemble the exact horizontal PNG strips, and place only the PNG sheets into `assets/sprites/player/`.

## Migration rule

M3 is visual/animation infrastructure only. Damage, spell mechanics, health, mana, enemy interaction, inventory and narrative remain outside this pass.
