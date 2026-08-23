/* Angelic Black — M12 Level 1 inventory/vendor parity. */
class Level1Menu {
  constructor(scene, progression, queen){
    this.scene=scene; this.progression=progression; this.queen=queen; this.mode=null;
    const {width,height}=scene.config;
    this.shade=scene.add.rectangle(width/2,height/2,width,height,0x05030a,.82).setScrollFactor(0).setDepth(900).setVisible(false);
    this.panel=scene.add.rectangle(width/2,height/2,820,420,0x100a18,.98).setStrokeStyle(2,0x6d5a8f,.95).setScrollFactor(0).setDepth(901).setVisible(false);
    this.title=scene.add.text(100,92,'',{fontFamily:'Georgia,serif',fontSize:'28px',color:'#d8a94e',stroke:'#05030a',strokeThickness:7}).setScrollFactor(0).setDepth(902).setVisible(false);
    this.body=scene.add.text(100,150,'',{fontFamily:'monospace',fontSize:'13px',color:'#e7d8f2',lineSpacing:10,wordWrap:{width:760}}).setScrollFactor(0).setDepth(902).setVisible(false);
    this.hint=scene.add.text(100,474,'',{fontFamily:'monospace',fontSize:'11px',color:'#b18cff'}).setScrollFactor(0).setDepth(902).setVisible(false);
  }
  visible(v){[this.shade,this.panel,this.title,this.body,this.hint].forEach(o=>o.setVisible(v));}
  openInventory(){ if(this.mode)return; this.mode='inventory'; this.scene.progression.state='menu'; this.scene.progression.syncPhysicsPause(); this.title.setText('INVENTORY'); this.hint.setText('I / ESC  CLOSE   1 HEART   2 SHARD   3 TINCTURE'); this.renderInventory(); this.visible(true); }
  renderInventory(){const inv=this.progression.inventory;this.body.setText(`GOLD  ${inv.gold}\n\nCONSUMABLES\nHEART      ×${inv.heart}   Restore 40 life\nSHARD      ×${inv.shard}   Restore 40 mana\nTINCTURE   ×${inv.tincture}   Ward the Queen\n\nRELICS / STORY\nSIGNET OF POWER   ×${inv.signet}\nJESTER TOKEN       ×${inv.jester}\nPEWTER RELIC       ×${inv.pewter}\n\nCHARACTER\nLEVEL      ${this.progression.level}\nLIFE       ${Math.ceil(this.queen.hp)}/${this.queen.maxHp}\nMANA       ${Math.floor(this.queen.mana)}/${this.queen.maxMana}\nARMOUR     ${Math.round(this.queen.armor*100)}%\nBONE AURA  ${Math.round(this.queen.shield)}`);}
  openVendor(){this.mode='vendor';this.scene.progression.state='menu';this.scene.progression.syncPhysicsPause();this.title.setText('THE WITCH');this.hint.setText('1 BUY HEART   2 BUY SHARD   3 BUY TINCTURE   V / ESC LEAVE');this.renderVendor();this.visible(true);}
  renderVendor(){const inv=this.progression.inventory;this.body.setText(`FLATTENED GOLD  ${inv.gold}\n\n“Spend well, Your Majesty. The crows do not wait.”\n\n1. HEART OF THE SEPULCHRE     25 GOLD\n   Restore 40 life.\n\n2. GRAVE SHARD                 25 GOLD\n   Restore 40 mana.\n\n3. BLACK TINCTURE              40 GOLD\n   Temporarily wards the Queen.\n\nThe Signet of Power has already been claimed.`);}
  buy(index){if(this.mode!=='vendor')return;const inv=this.progression.inventory,prices=[25,25,40],keys=['heart','shard','tincture'];if(inv.gold<prices[index-1])return;inv.gold-=prices[index-1];inv[keys[index-1]]++;this.renderVendor();}
  leaveVendor(done){if(this.mode!=='vendor')return;this.mode=null;this.visible(false);this.scene.progression.state='playing';this.scene.progression.syncPhysicsPause();done?.();}
  close(){if(!this.mode)return;this.mode=null;this.visible(false);this.scene.progression.state='playing';this.scene.progression.syncPhysicsPause();}
  update(){if(!this.mode)return; if(Phaser.Input.Keyboard.JustDown(this.scene.menu1Key)){if(this.mode==='vendor')this.buy(1);else this.use('heart');} if(Phaser.Input.Keyboard.JustDown(this.scene.menu2Key)){if(this.mode==='vendor')this.buy(2);else this.use('shard');} if(Phaser.Input.Keyboard.JustDown(this.scene.menu3Key)){if(this.mode==='vendor')this.buy(3);else this.use('tincture');} if(Phaser.Input.Keyboard.JustDown(this.scene.closeMenuKey))this.close();}
  use(key){if(this.mode!=='inventory')return;const inv=this.progression.inventory;if(key==='heart'&&inv.heart>0&&this.queen.hp<this.queen.maxHp){inv.heart--;this.queen.hp=Math.min(this.queen.maxHp,this.queen.hp+40);this.renderInventory();}else if(key==='shard'&&inv.shard>0&&this.queen.mana<this.queen.maxMana){inv.shard--;this.queen.mana=Math.min(this.queen.maxMana,this.queen.mana+40);this.renderInventory();}else if(key==='tincture'&&inv.tincture>0){inv.tincture--;this.queen.invulnerable=true;this.scene.time.delayedCall(30000,()=>{if(this.queen.active)this.queen.invulnerable=false;});this.renderInventory();}}
}
window.Level1Menu=Level1Menu;
