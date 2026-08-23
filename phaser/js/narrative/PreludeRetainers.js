/* Angelic Black — Level 1 prelude retainer presentation. */
(function(){
  function ensureTextures(scene){
    if(!scene.textures.exists('prelude-retainer-a')){const g=scene.add.graphics();g.fillStyle(0xddd6c7,1).fillCircle(24,14,10);g.fillStyle(0x26212d,1).fillRect(12,24,24,30);g.fillStyle(0x6d5a8f,1).fillRect(9,29,30,4);g.fillStyle(0x9b7a55,1).fillRect(6,26,5,30);g.fillStyle(0x9b7a55,1).fillRect(37,25,5,31);g.fillStyle(0x22202a,1).fillRect(14,52,7,12);g.fillStyle(0x22202a,1).fillRect(27,52,7,12);g.generateTexture('prelude-retainer-a',48,68);g.destroy();}
    if(!scene.textures.exists('prelude-retainer-b')){const g=scene.add.graphics();g.fillStyle(0xd2cab9,1).fillCircle(24,14,10);g.fillStyle(0x2f2933,1).fillRect(13,24,22,30);g.fillStyle(0x4c3a50,1).fillRect(10,29,28,4);g.fillStyle(0x80704f,1).fillRect(7,27,4,28);g.fillStyle(0x80704f,1).fillRect(37,27,4,28);g.fillStyle(0x25212a,1).fillRect(15,52,7,12);g.fillStyle(0x25212a,1).fillRect(26,52,7,12);g.generateTexture('prelude-retainer-b',48,68);g.destroy();}
  }
  GameScene.prototype.showPreludeRetainers=function(){
    ensureTextures(this);if(this._preludeRetainers)this.hidePreludeRetainers();const q=this.queen;const mk=(key,x)=>{const s=this.add.image(x,q.y,key).setOrigin(.5,1).setDepth(24).setAlpha(0).setScale(1.08);this.tweens.add({targets:s,alpha:1,y:q.y-2,duration:520,ease:'Cubic.Out'});return s;};this._preludeRetainers=[mk('prelude-retainer-a',q.x+115),mk('prelude-retainer-b',q.x+195)];
  };
  GameScene.prototype.hidePreludeRetainers=function(){if(!this._preludeRetainers)return;const group=this._preludeRetainers;this._preludeRetainers=null;group.forEach(s=>{if(s&&s.active)this.tweens.add({targets:s,alpha:0,y:s.y+12,duration:260,onComplete:()=>s.destroy()});});};
})();
