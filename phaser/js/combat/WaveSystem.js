/* Angelic Black — Phaser M5 wave parity foundation. */
class WaveSystem {
  constructor(scene, combat){
    this.scene=scene; this.combat=combat;
    this.wave=0; this.remaining=0; this.spawnTimer=0; this.intermission=0;
    this.defs=[
      {count:8,interval:1.2},
      {count:12,interval:1.0}
    ];
    this.enabled=true;
    this.spawnedThisWave=0;
  }

  startNext(){
    this.wave += 1;
    const def=this.defs[Math.min(this.wave-1,this.defs.length-1)];
    this.remaining=def.count;
    this.spawnTimer=0.05;
    this.spawnedThisWave=0;
    this.scene.showBanner(`WAVE ${this.wave}`);
  }

  update(delta){
    const dt=Math.min(delta,50)/1000;
    if(this.intermission>0){
      this.intermission=Math.max(0,this.intermission-dt);
      if(this.intermission===0) this.startNext();
      return;
    }
    if(this.wave===0){ this.startNext(); return; }

    const active=this.combat.enemies.countActive(true);
    const def=this.defs[Math.min(this.wave-1,this.defs.length-1)];
    if(this.remaining>0){
      this.spawnTimer-=dt;
      if(this.spawnTimer<=0){
        const side=this.scene.queen.x < this.scene.config.worldWidth*0.5 ? 1 : -1;
        const x=Phaser.Math.Clamp(this.scene.queen.x + side*(500+Math.random()*160),80,this.scene.config.worldWidth-80);
        this.combat.spawnEnemy('knight',x);
        this.remaining -= 1;
        this.spawnedThisWave += 1;
        this.spawnTimer=def.interval;
      }
      return;
    }

    if(active===0 && this.intermission<=0){
      this.intermission=2.2;
      this.scene.showBanner(`WAVE ${this.wave} CLEARED`);
    }
  }
}
