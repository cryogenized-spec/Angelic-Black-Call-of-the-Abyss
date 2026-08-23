# Phaser 4 Migration — M4 World & Camera

Date: 2026-08-23

## Objective
Port the first playable world's presentation foundation into Phaser 4 while preserving the 960×540 landscape contract and the M2 Necro Queen controller.

## Implemented

- First Tomb world presentation is now a dedicated `FirstTombWorld` class.
- 2880px world bounds are retained.
- Procedural ground, distant silhouettes, grave markers and sparse environmental decorations are rendered as Phaser display objects.
- Three background depth layers provide horizontal parallax.
- Foreground mist/fog is animated independently of the camera.
- The ground is a real Arcade Physics static body; the Queen collides with it.
- Camera follow and directional look-ahead remain controlled by the player scene.
- Camera bounds are locked to the 2880×540 world.

## Deliberate non-goals

This is not yet the complete Level 1 content migration. Enemy spawning, combat, pickups, scripted events, cinematic triggers, NPCs and narrative world interactions remain separate migration stages.

Prototype art is still procedural. Authored scenery can later replace individual world layers without changing the camera or player controller.

## Design rule

The world should use actual Phaser display objects/layers for scene composition, while the gameplay world remains coordinate-driven. We do not introduce a tilemap merely for the sake of using one.
