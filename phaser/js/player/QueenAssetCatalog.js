/* Angelic Black — Necro Queen gameplay sprite catalog. */
(function(){
  'use strict';
  const BASE='../assets/sprites/player/';
  const actions={
    idle:{file:'queen-idle.png',frames:3,fps:6,repeat:-1},
    walk:{file:'queen-walk.png',frames:4,fps:10,repeat:-1},
    jump:{file:'queen-jump.png',frames:4,fps:9,repeat:0},
    cast:{file:'queen-cast.png',frames:4,fps:10,repeat:0},
    special:{file:'queen-special.png',frames:4,fps:8,repeat:0},
    hurt:{file:'queen-hurt.png',frames:3,fps:12,repeat:0},
    death:{file:'queen-death.png',frames:6,fps:8,repeat:0}
  };
  window.ANGELIC_QUEEN_ASSETS={
    width:64,height:96,base:BASE,actions,
    queue(scene){Object.values(actions).forEach(spec=>{if(spec.file){scene.load.spritesheet('queen-'+spec.file.replace(/^queen-|-?\.png$/g,''),BASE+spec.file,{frameWidth:64,frameHeight:96,startFrame:0,endFrame:spec.frames-1});}});},
    defineAnimations(scene){
      Object.entries(actions).forEach(([action,spec])=>{
        const key='queen-'+action;if(scene.anims.exists(key))scene.anims.remove(key);
        const textureKey=spec.texture||key;const hasTexture=scene.textures.exists(textureKey);const fallback=scene.textures.exists('queen-idle')?'queen-idle':'queen-fallback';const source=hasTexture?textureKey:fallback;const count=hasTexture?spec.frames:1;const frames=scene.anims.generateFrameNumbers(source,{start:0,end:Math.max(0,count-1)});
        scene.anims.create({key,frames,frameRate:spec.fps,repeat:spec.repeat,skipMissedFrames:true});
      });
      const fall='queen-fall';if(scene.anims.exists(fall))scene.anims.remove(fall);const jumpTex=scene.textures.exists('queen-jump')?'queen-jump':(scene.textures.exists('queen-idle')?'queen-idle':'queen-fallback');scene.anims.create({key:fall,frames:[{key:jumpTex,frame:scene.textures.exists('queen-jump')?3:2}],frameRate:1,repeat:-1});
    },
    installed(scene){return Object.keys(actions).filter(action=>scene.anims.exists('queen-'+action));}
  };
})();
