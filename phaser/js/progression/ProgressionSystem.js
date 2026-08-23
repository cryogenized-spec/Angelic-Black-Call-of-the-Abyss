/* Angelic Black — Phaser M8 progression / pause-safe state machine. */
class ProgressionSystem {
  constructor(scene, queen){
    this.scene=scene; this.queen=queen; this.level=1; this.xp=0; this.xpNeed=120; this.continues=3;
    this.inventory={heart:0,shard:0,gold:0,tincture:0,page:0,grief:0,signet:0,jester:0,pewter:0};
    this.state='playing'; this.levelChoices=[]; this.levelOverlay=null; this.deathOverlay=null;
    this.createOverlays();
    this.syncPhysicsPause();
  }
  createOverlays(){
    const {width,height}=this.scene.config;
    const shade=this.scene.add.rectangle(width/2,height/2,width,height,0x05030a,0.84).setScrollFactor(0).setDepth(500).setVisible(false);
    const panel=this.scene.add.rectangle(width/2,height/2,760,380,0x100a18,0.97).setStrokeStyle(2,0x6d5a8f,0.9).setScrollFactor(0).setDepth(501).setVisible(false);
    const title=this.scene.add.text(width/2-380,112,'',{fontFamily:'Georgia,serif',fontSize:'32px',color:'#d8a94e',stroke:'#05030a',strokeThickness:7}).setScrollFactor(0).setDepth(502).setVisible(false);
    const body=this.scene.add.text(width/2-340,168,'',{fontFamily:'monospace',fontSize:'14px',color:'#e7d8f2',lineSpacing:10}).setScrollFactor(0).setDepth(502).setVisible(false);
    this.levelOverlay={shade,panel,title,body};
    const deathShade=this.scene.add.rectangle(width/2,height/2,width,height,0x05030a,0.8).setScrollFactor(0).setDepth(510).setVisible(false);
    const deathTitle=this.scene.add.text(width/2,190,'THE QUEEN HAS FALLEN',{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'30px',color:'#b18cff',stroke:'#05030a',strokeThickness:8}).setOrigin(0.5).setScrollFactor(0).setDepth(511).setVisible(false);
    const deathBody=this.scene.add.text(width/2,245,'',{fontFamily:'monospace',fontSize:'14px',align:'center',color:'#e7d8f2',lineSpacing:10}).setOrigin(0.5).setScrollFactor(0).setDepth(511).setVisible(false);
    this.deathOverlay={deathShade,deathTitle,deathBody};
  }
  syncPhysicsPause(){
    if(this.scene.physics?.world) this.scene.physics.world.isPaused = this.state !== 'playing';
  }
  awardXp(amount){
    if(this.state!=='playing') return;
    this.xp+=amount;
    if(this.xp>=this.xpNeed){
      this.xp-=this.xpNeed; this.level++; this.xpNeed=Math.floor(this.xpNeed*1.28+20); this.openLevelUp();
    }
  }
  addGold(amount=1){this.inventory.gold+=amount;this.queen.gold=this.inventory.gold;}
  addItem(kind,amount=1){if(!(kind in this.inventory))this.inventory[kind]=0;this.inventory[kind]+=amount;}
  openLevelUp(){
    this.state='level-up'; this.syncPhysicsPause();
    this.levelChoices=[
      {label:'VITALITY',desc:'+18 maximum HP and restore 18 HP.',apply:()=>{this.queen.maxHp+=18;this.queen.hp=Math.min(this.queen.maxHp,this.queen.hp+18);}},
      {label:'CHARISMA',desc:'+10 maximum Mana and +1.5 mana regeneration.',apply:()=>{this.queen.maxMana+=10;this.queen.mana=this.queen.maxMana;this.queen.manaRegen+=1.5;}}
    ];
    const o=this.levelOverlay;o.shade.setVisible(true);o.panel.setVisible(true);o.title.setVisible(true);o.body.setVisible(true);o.title.setText(`LEVEL ${this.level}`);this.renderLevelChoices();
  }
  renderLevelChoices(){
    const lines=this.levelChoices.map((c,i)=>`${i+1}. ${c.label}\n   ${c.desc}`).join('\n\n');
    this.levelOverlay.body.setText(`Choose a trait.\n\n${lines}\n\nPress 1 or 2.`);
  }
  chooseLevelUp(index){
    if(this.state!=='level-up')return;const choice=this.levelChoices[index];if(!choice)return;choice.apply();this.state='playing';
    const o=this.levelOverlay;Object.values(o).forEach(obj=>obj.setVisible(false));this.syncPhysicsPause();this.scene.showBanner(`${choice.label} CHOSEN`);
  }
  onQueenDefeated(){
    if(this.state==='death')return;this.state='death';this.continues=Math.max(0,this.continues-1);this.syncPhysicsPause();
    const o=this.deathOverlay;Object.values(o).forEach(obj=>obj.setVisible(true));
    o.deathBody.setText(this.continues>0?`${this.continues} resurrection${this.continues===1?'':'s'} remain.\nThe grave will not keep you.\n\nPress R to rise again.`:'No resurrections remain.\nPress R to restart the run.');
  }
  respawn(){
    if(this.state!=='death')return;
    this.state='playing';this.queen.setActive(true).setVisible(true);this.queen.body.enable=true;this.queen.alpha=1;this.queen.hp=this.queen.maxHp;this.queen.mana=this.queen.maxMana;this.queen.invulnerable=true;this.queen.setPosition(240,this.scene.config.ground);this.queen.setVelocity(0,0);this.queen.actionState=null;this.queen.actionTimer=0;this.queen.state='idle';
    this.scene.time.delayedCall(800,()=>{if(this.queen.active)this.queen.invulnerable=false;});this.scene.clearEnemiesForRespawn?.();Object.values(this.deathOverlay).forEach(obj=>obj.setVisible(false));this.scene.showBanner('THE QUEEN RISES AGAIN');this.scene.waves.resetToWaveOne?.();this.syncPhysicsPause();
  }
  update(){
    if(this.state==='level-up'){
      if(Phaser.Input.Keyboard.JustDown(this.scene.levelOneKey))this.chooseLevelUp(0);
      if(Phaser.Input.Keyboard.JustDown(this.scene.levelTwoKey))this.chooseLevelUp(1);
      return;
    }
    if(this.state==='death'&&Phaser.Input.Keyboard.JustDown(this.scene.resetKey)){
      if(this.continues>0)this.respawn();else this.scene.restart();
    }
  }
}
