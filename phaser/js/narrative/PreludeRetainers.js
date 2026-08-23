/* Angelic Black — Level 1 prelude retainer pixel renderer. */
(function(){
  const W=64,H=96;
  const P={
    ink:0x14131a,deep:0x211d28,shadow:0x37313b,bone:0xd8d0bd,boneHi:0xf0e8d6,boneSh:0x9f988b,
    steel:0x5b5863,steelHi:0x8b8792,steelSh:0x36343d,
    clothA:0x30263b,clothB:0x4e3b5a,clothHi:0x72577b,
    bronze:0x8e6a43,bronzeHi:0xc39a58,
    leather:0x4a3027,leatherHi:0x6b4837,
    magicA:0x8f79d6,magicB:0xbca9ff,
    crimson:0x7b303a
  };

  function px(g,x,y,w,h,c){g.fillStyle(c,1);g.fillRect(x,y,w,h);}
  function poly(g,pts,c){g.fillStyle(c,1);g.fillPoints(pts,true);}
  function line(g,x1,y1,x2,y2,c,t){g.lineStyle(t,c,1);g.lineBetween(x1,y1,x2,y2);}

  function skull(g,variant){
    const dx=variant===1?0:1;
    poly(g,[{x:21+dx,y:8},{x:42+dx,y:8},{x:48+dx,y:14},{x:48+dx,y:28},{x:43+dx,y:35},{x:38+dx,y:39},{x:25+dx,y:39},{x:19+dx,y:34},{x:16+dx,y:27},{x:16+dx,y:15}],P.ink);
    poly(g,[{x:22+dx,y:10},{x:40+dx,y:10},{x:45+dx,y:15},{x:45+dx,y:27},{x:41+dx,y:33},{x:36+dx,y:36},{x:26+dx,y:36},{x:21+dx,y:32},{x:19+dx,y:25},{x:19+dx,y:15}],P.bone);
    px(g,23+dx,11,11,3,P.boneHi); px(g,20+dx,16,4,10,P.boneSh); px(g,39+dx,14,5,12,P.boneSh);
    px(g,22+dx,18,8,7,P.ink); px(g,34+dx,18,9,7,P.ink);
    px(g,23+dx,19,4,2,P.shadow); px(g,35+dx,19,5,2,P.shadow);
    px(g,25+dx,21,2,2,P.magicA); px(g,38+dx,21,2,2,P.magicA);
    px(g,30+dx,24,5,5,P.ink); px(g,29+dx,29,8,4,P.boneSh);
    px(g,21+dx,28,4,4,P.boneSh); px(g,40+dx,27,4,5,P.boneSh);
    px(g,23+dx,33,20,7,P.ink); px(g,25+dx,31,16,6,P.bone);
    px(g,26+dx,33,2,4,P.boneHi); px(g,31+dx,33,2,4,P.boneHi); px(g,36+dx,33,2,4,P.boneHi);
    px(g,28+dx,34,2,3,P.shadow); px(g,34+dx,34,2,3,P.shadow);
    line(g,21+dx,12,25+dx,16,P.boneSh,1); line(g,41+dx,11,38+dx,15,P.boneSh,1);
  }

  function armourA(g){
    px(g,18,41,29,5,P.ink); px(g,14,46,37,20,P.ink); px(g,20,39,23,5,P.steelSh);
    px(g,17,47,31,16,P.steel); px(g,21,46,7,15,P.steelHi); px(g,36,46,8,15,P.steelSh);
    poly(g,[{x:27,y:48},{x:37,y:48},{x:35,y:58},{x:29,y:58}],P.clothB);
    px(g,31,50,3,6,P.bronzeHi); px(g,29,53,7,2,P.bronze);
    px(g,11,44,9,8,P.ink); px(g,13,45,9,5,P.steelHi); px(g,43,44,9,8,P.ink); px(g,43,45,8,5,P.steelSh);
    px(g,15,62,36,5,P.ink); px(g,18,61,31,3,P.bronze); px(g,29,61,7,4,P.bronzeHi);
    px(g,18,66,11,19,P.steelSh); px(g,36,66,11,19,P.steel);
    px(g,21,68,6,15,P.steelHi); px(g,38,68,6,14,P.steelSh);
    poly(g,[{x:18,y:67},{x:29,y:68},{x:28,y:90},{x:20,y:85}],P.clothA);
    poly(g,[{x:35,y:68},{x:47,y:67},{x:44,y:87},{x:36,y:91}],P.clothB);
    px(g,20,85,10,7,P.ink); px(g,36,85,10,7,P.ink);
    px(g,22,86,6,6,P.leather); px(g,38,86,6,6,P.leather);
    px(g,20,91,10,4,P.ink); px(g,36,91,10,4,P.ink);
  }

  function armourB(g){
    px(g,19,41,26,5,P.ink); px(g,16,45,33,22,P.ink);
    px(g,19,45,27,18,P.steelSh); px(g,22,46,8,15,P.steel); px(g,36,46,7,14,P.steelHi);
    px(g,27,46,6,22,P.clothB); px(g,28,49,2,17,P.clothHi);
    px(g,23,40,18,5,P.bronze); px(g,29,42,6,6,P.bronzeHi); px(g,31,43,2,4,P.crimson);
    px(g,13,46,8,7,P.ink); px(g,14,47,7,4,P.steel); px(g,44,46,8,7,P.ink); px(g,44,47,7,4,P.steelSh);
    px(g,16,63,33,5,P.ink); px(g,19,63,28,3,P.leatherHi); px(g,29,63,7,4,P.bronze);
    poly(g,[{x:20,y:67},{x:45,y:67},{x:48,y:89},{x:39,y:94},{x:24,y:94},{x:16,y:88}],P.clothA);
    px(g,22,68,5,23,P.clothB); px(g,39,68,4,22,P.clothB); px(g,29,70,5,22,P.deep);
    px(g,19,90,11,5,P.ink); px(g,36,90,11,5,P.ink);
    px(g,21,90,7,4,P.leather); px(g,38,90,7,4,P.leather);
  }

  function weaponA(g){
    line(g,49,55,60,24,P.ink,4); line(g,50,55,59,24,P.bronzeHi,2);
    poly(g,[{x:58,y:25},{x:60,y:17},{x:61,y:25},{x:59,y:29}],P.steelHi);
    px(g,47,53,7,3,P.bronze); px(g,51,51,3,5,P.leatherHi);
  }

  function weaponB(g){
    line(g,9,85,9,18,P.ink,4); line(g,9,84,9,20,P.bronzeHi,2);
    poly(g,[{x:9,y:17},{x:4,y:25},{x:9,y:24},{x:14,y:25}],P.steelHi);
    px(g,6,74,7,3,P.bronze); px(g,7,82,5,3,P.leatherHi);
  }

  function generate(scene,key,variant){
    if(scene.textures.exists(key))return;
    const g=scene.add.graphics();
    skull(g,variant);
    if(variant===1){armourA(g);weaponA(g);}else{armourB(g);weaponB(g);}
    px(g,18,94,28,1,0x17131c);
    g.generateTexture(key,W,H);
    g.destroy();
  }

  function ensureTextures(scene){
    generate(scene,'prelude-retainer-a',1);
    generate(scene,'prelude-retainer-b',2);
  }

  GameScene.prototype.showPreludeRetainers=function(){
    ensureTextures(this);
    if(this._preludeRetainers)this.hidePreludeRetainers();
    const q=this.queen;
    const mk=(key,x)=>{
      const s=this.add.image(x,q.y,key).setOrigin(.5,1).setDepth(24).setAlpha(0).setScale(1);
      this.tweens.add({targets:s,alpha:1,y:q.y-3,duration:520,ease:'Cubic.Out'});
      return s;
    };
    this._preludeRetainers=[mk('prelude-retainer-a',q.x+115),mk('prelude-retainer-b',q.x+205)];
  };

  GameScene.prototype.hidePreludeRetainers=function(){
    if(!this._preludeRetainers)return;
    const group=this._preludeRetainers;this._preludeRetainers=null;
    group.forEach(s=>{if(s&&s.active)this.tweens.add({targets:s,alpha:0,y:s.y+12,duration:260,onComplete:()=>s.destroy()});});
  };
})();
