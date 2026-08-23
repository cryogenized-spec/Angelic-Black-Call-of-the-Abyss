/* Phaser M12 — Level 1 wave parity. */
class WaveSystem {
  constructor(scene,combat){this.scene=scene;this.combat=combat;this.wave=0;this.remaining=0;this.spawnTimer=0;this.intermission=0;this.spawnedThisWave=0;this.bossActive=false;this.bossCleared=false;this.deferredOpeningWave=false;this.defs=[
    {count:8,interval:1.2,comp:[['knight',1]]},
    {count:12,interval:1.0,comp:[['knight',0.6],['zombie',0.4]]},
    {count:15,interval:0.85,comp:[['knight',0.5],['zombie',0.3],['mage',0.2]]},
    {count:20,interval:0.7,comp:[['knight',0.45],['zombie',0.3],['mage',0.25]]},
    {boss:true}
  ];}
  startNext(){
    if(this.wave===0&&window.ANGELIC_START_OPENING&&this.scene.narrative&&!this.scene.narrative.active){this.deferredOpeningWave=true;return;}
    this.wave+=1; const def=this.defs[Math.min(this.wave-1,this.defs.length-1)]; this.spawnedThisWave=0; this.bossActive=false;
    if(def.boss){this.remaining=0;this.bossActive=true;this.scene.showBossTitle?.('THE SKELETAL LORD');this.combat.spawnEnemy('boss',Phaser.Math.Clamp(this.scene.queen.x+520,180,this.scene.config.worldWidth-180));this.scene.showBanner('THE SKELETAL LORD RISES');return;}
    this.remaining=def.count;this.spawnTimer=0.05;this.scene.showBanner(`WAVE ${this.wave}`);
    if(this.wave===3)this.scene.unlockSpell?.('gravefall');
    if(this.wave===4)this.scene.unlockSpell?.('mantle');
  }
  pickKind(comp){const r=Math.random();let acc=0;for(const [kind,weight] of comp){acc+=weight;if(r<acc)return kind;}return comp[0][0];}
  resetToWaveOne(){this.wave=0;this.remaining=0;this.spawnTimer=0;this.intermission=0;this.bossActive=false;this.bossCleared=false;this.deferredOpeningWave=false;this.startNext();}
  update(delta){
    const dt=Math.min(delta,50)/1000;
    if(this.deferredOpeningWave&&!this.scene.narrative?.active){this.deferredOpeningWave=false;this.startNext();return;}
    if(this.intermission>0){this.intermission=Math.max(0,this.intermission-dt);if(this.intermission===0&&this.wave<5)this.startNext();return;}
    if(this.wave===0){this.startNext();return;}
    const active=this.combat.enemies.countActive(true),def=this.defs[Math.min(this.wave-1,this.defs.length-1)];
    if(def.boss){if(active===0&&!this.bossCleared){this.bossCleared=true;this.scene.showBanner('SKELETAL LORD DEFEATED');this.scene.onLevelOneComplete?.();this.intermission=9999;}return;}
    if(this.remaining>0){this.spawnTimer-=dt;if(this.spawnTimer<=0){const side=this.scene.queen.x<this.scene.config.worldWidth*0.5?1:-1;const x=Phaser.Math.Clamp(this.scene.queen.x+side*(500+Math.random()*160),80,this.scene.config.worldWidth-80);this.combat.spawnEnemy(this.pickKind(def.comp),x);this.remaining--;this.spawnedThisWave++;this.spawnTimer=def.interval;}return;}
    if(active===0){this.intermission=2.2;this.scene.showBanner(`WAVE ${this.wave} CLEARED`);}
  }
}
