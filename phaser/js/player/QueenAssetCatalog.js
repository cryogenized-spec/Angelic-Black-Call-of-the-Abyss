/* Angelic Black — Necro Queen gameplay sprite catalog. */
(function(){
  'use strict';

  const BASE = '../assets/sprites/player/';

  const actions = {
    idle:    { file: 'queen-idle.png',    frames: 4, fps: 6,  repeat: -1 },
    walk:    { file: 'queen-walk.png',    frames: 8, fps: 10, repeat: -1 },
    jump:    { file: 'queen-jump.png',    frames: 4, fps: 8,  repeat: 0  },
    cast:    { file: 'queen-cast.png',    frames: 6, fps: 10, repeat: 0  },
    hurt:    { file: 'queen-hurt.png',    frames: 3, fps: 12, repeat: 0  },
    death:   { file: 'queen-death.png',   frames: 6, fps: 8,  repeat: 0  },
    special: { file: 'queen-special.png', frames: 8, fps: 10, repeat: 0  }
  };

  window.ANGELIC_QUEEN_ASSETS = {
    width: 64,
    height: 96,
    base: BASE,
    actions,

    queue(scene){
      Object.entries(actions).forEach(([action, spec]) => {
        scene.load.spritesheet('queen-' + action, BASE + spec.file, {
          frameWidth: 64,
          frameHeight: 96,
          startFrame: 0,
          endFrame: spec.frames - 1
        });
      });
    },

    defineAnimations(scene){
      Object.entries(actions).forEach(([action, spec]) => {
        const key = 'queen-' + action;
        if (scene.anims.exists(key)) scene.anims.remove(key);

        const textureKey = scene.textures.exists(key) ? key : 'queen-fallback';
        const availableFrames = scene.textures.exists(key) ? spec.frames : 1;
        const frames = scene.anims.generateFrameNumbers(textureKey, {
          start: 0,
          end: Math.max(0, availableFrames - 1)
        });

        scene.anims.create({
          key,
          frames,
          frameRate: spec.fps,
          repeat: spec.repeat,
          skipMissedFrames: true
        });
      });

      if (!scene.anims.exists('queen-fall')) {
        scene.anims.create({
          key: 'queen-fall',
          frames: [{ key: scene.textures.exists('queen-jump') ? 'queen-jump' : 'queen-fallback', frame: scene.textures.exists('queen-jump') ? 3 : 0 }],
          frameRate: 1,
          repeat: -1
        });
      } else {
        scene.anims.remove('queen-fall');
        scene.anims.create({
          key: 'queen-fall',
          frames: [{ key: scene.textures.exists('queen-jump') ? 'queen-jump' : 'queen-fallback', frame: scene.textures.exists('queen-jump') ? 3 : 0 }],
          frameRate: 1,
          repeat: -1
        });
      }
    },

    installed(scene){
      return Object.keys(actions).filter(action => scene.textures.exists('queen-' + action));
    }
  };
})();
