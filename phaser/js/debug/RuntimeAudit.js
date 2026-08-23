/* Angelic Black — Phaser M8 runtime audit overlay. */
class RuntimeAudit {
  constructor(scene){
    this.scene=scene; this.visible=false; this.failures=[]; this.lastScan=0;
    const cfg=scene.config;
    this.panel=scene.add.rectangle(12,12,360,176,0x05030a,0.88).setOrigin(0,0).setScrollFactor(0).setDepth(900).setVisible(false);
    this.text=scene.add.text(24,24,'',{fontFamily:'monospace',fontSize:'11px',color:'#b8c0cc',lineSpacing:4}).setScrollFactor(0).setDepth(901).setVisible(false);
    this.hint=scene.add.text(cfg.width-18,cfg.height-20,'F3 DIAGNOSTICS',{fontFamily:'monospace',fontSize:'10px',color:'#6d5a8f'}).setOrigin(1,1).setScrollFactor(0).setDepth(901);
    scene.input.keyboard.on('keydown-F3',()=>this.toggle());
  }
  toggle(){this.visible=!this.visible;this.panel.setVisible(this.visible);this.text.setVisible(this.visible);}
  assert(ok,label){if(!ok)this.failures.push(label);}
  scan(){
    const s=this.scene,q=s.queen,p=s.progression,c=s.combat,w=s.waves;
    this.failures=[];
    this.assert(!!q,'Queen missing');
    this.assert(q && (q.active || p.state!=='playing'),'Queen inactive during active run');
    this.assert(q && q.maxHp>0 && q.hp>=0 && q.hp<=q.maxHp+0.001,'HP out of range');
    this.assert(q && q.maxMana>0 && q.mana>=-0.001 && q.mana<=q.maxMana+0.001,'Mana out of range');
    this.assert(p && ['playing','level-up','death','level-complete'].includes(p.state),'Invalid progression state');
    this.assert(c && c.enemies.countActive(true)<80,'Enemy count runaway');
    this.assert(c && c.projectiles.countActive(true)<120,'Player projectile runaway');
    this.assert(c && c.enemyProjectiles.countActive(true)<160,'Enemy projectile runaway');
    this.assert(w && w.wave>=1,'Wave never started');
    this.assert(s.physics.world.isPaused === (p.state!=='playing'),'Physics pause mismatch');
    return {state:p?.state,level:p?.level,wave:w?.wave,enemies:c?.enemies.countActive(true),projectiles:c?.projectiles.countActive(true),enemyProjectiles:c?.enemyProjectiles.countActive(true),failures:this.failures.slice()};
  }
  update(time){
    if(time-this.lastScan<250)return;
    this.lastScan=time;
    const r=this.scan();
    if(this.visible){
      const failures=r.failures.length?r.failures.map(x=>`! ${x}`).join('\n'):'OK — no invariant failures';
      this.text.setText(`RUNTIME AUDIT\nstate ${r.state}  level ${r.level}  wave ${r.wave}\nfoes ${r.enemies}  shots ${r.projectiles}  enemy shots ${r.enemyProjectiles}\nphysics ${this.scene.physics.world.isPaused?'PAUSED':'RUNNING'}\n\n${failures}`);
    }
  }
}
