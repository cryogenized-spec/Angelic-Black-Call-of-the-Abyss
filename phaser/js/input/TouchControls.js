/* Angelic Black — M11 landscape touch controls. */
class TouchControls {
  constructor(scene){
    this.scene=scene;this.buttons={};
    this.createButton('left',64,scene.config.height-58,'‹');this.createButton('right',154,scene.config.height-58,'›');
    this.createButton('jump',scene.config.width-208,scene.config.height-58,'↑');
    this.createButton('bolt',scene.config.width-118,scene.config.height-58,'✦');
    this.createButton('special',scene.config.width-58,scene.config.height-122,'◆');
    scene.input.on('pointerup',p=>this.releasePointer(p));scene.input.on('pointercancel',p=>this.releasePointer(p));
  }
  createButton(key,x,y,label){
    const r=this.scene.add.rectangle(x,y,58,58,0x100a18,.72).setStrokeStyle(2,0x6d5a8f,.9).setScrollFactor(0).setDepth(800).setInteractive();
    this.scene.add.text(x,y,label,{fontFamily:'Georgia,serif',fontSize:'28px',color:'#e7d8f2'}).setOrigin(.5).setScrollFactor(0).setDepth(801);
    r.on('pointerdown',p=>{r.setFillStyle(0x2b2140,.92);const b=this.buttons[key];b.pointerId=p.id;b.down=true;b.just=true;});
    r.on('pointerup',()=>r.setFillStyle(0x100a18,.72));r.on('pointerout',()=>r.setFillStyle(0x100a18,.72));this.buttons[key]={pointerId:null,down:false,just:false};
  }
  releasePointer(p){for(const k of Object.keys(this.buttons)){const b=this.buttons[k];if(b.pointerId===p.id){b.down=false;b.pointerId=null;}}}
  hold(key){return !!this.buttons[key]?.down;}
  justPressed(key){const b=this.buttons[key];if(!b)return false;const v=b.just;b.just=false;return v;}
  reset(){Object.values(this.buttons).forEach(b=>{b.down=false;b.pointerId=null;b.just=false;});}
}
window.TouchControls=TouchControls;
