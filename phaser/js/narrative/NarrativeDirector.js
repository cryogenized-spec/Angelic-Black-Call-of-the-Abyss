/* Angelic Black — Phaser narrative / cinematic director. */
class NarrativeDirector{
  constructor(scene){
    this.scene=scene;this.active=false;this.steps=[];this.index=0;this.timer=0;this.waiting=false;this.done=null;this.previousState='playing';
    const{width,height}=scene.config;
    this.blocker=scene.add.rectangle(width/2,height/2,width,height,0,0).setScrollFactor(0).setDepth(700).setVisible(false);
    this.shade=scene.add.rectangle(width/2,height/2,width,height,0x05030a,.32).setScrollFactor(0).setDepth(701).setVisible(false);
    this.image=scene.add.image(width/2,height/2,'narrative-fallback').setDisplaySize(width,height).setScrollFactor(0).setDepth(700).setVisible(false);
    this.panel=scene.add.rectangle(width/2,height-92,880,130,0x090611,.94).setStrokeStyle(2,0x6d5a8f,.95).setScrollFactor(0).setDepth(702).setVisible(false);
    this.name=scene.add.text(88,height-144,'',{fontFamily:'Georgia,serif',fontStyle:'bold',fontSize:'19px',color:'#d8a94e',stroke:'#05030a',strokeThickness:6}).setScrollFactor(0).setDepth(703).setVisible(false);
    this.text=scene.add.text(88,height-112,'',{fontFamily:'Georgia,serif',fontSize:'18px',color:'#eee6f4',wordWrap:{width:815,useAdvancedWrap:true},lineSpacing:7}).setScrollFactor(0).setDepth(703).setVisible(false);
    this.interlude=scene.add.text(width/2,height/2,'',{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'24px',color:'#e7d8f2',align:'center',wordWrap:{width:760},lineSpacing:12}).setOrigin(.5).setScrollFactor(0).setDepth(704).setVisible(false);
    this.comicTop=scene.add.text(width/2,28,'',{fontFamily:'EB Garamond',fontStyle:'italic',fontSize:'26px',color:'#f2ead8',align:'center',wordWrap:{width:850,useAdvancedWrap:true},stroke:'#05030a',strokeThickness:5}).setOrigin(.5,0).setScrollFactor(0).setDepth(704).setVisible(false);
    this.comicBottom=scene.add.text(width/2,height-30,'',{fontFamily:'EB Garamond',fontStyle:'italic',fontSize:'26px',color:'#f2ead8',align:'center',wordWrap:{width:850,useAdvancedWrap:true},stroke:'#05030a',strokeThickness:5}).setOrigin(.5,1).setScrollFactor(0).setDepth(704).setVisible(false);
    scene.input.on('pointerdown',()=>this.advance());scene.input.keyboard.on('keydown-ENTER',()=>this.advance());
  }
  ensureFallback(){if(this.scene.textures.exists('narrative-fallback'))return;const g=this.scene.add.graphics(),{width,height}=this.scene.config;g.fillGradientStyle(0x120b1f,0x120b1f,0x05030a,0x05030a,1);g.fillRect(0,0,width,height);g.fillStyle(0x2b2140,.8);g.fillCircle(width*.72,height*.38,120);g.lineStyle(2,0x6d5a8f,.5);g.strokeCircle(width*.72,height*.38,120);g.generateTexture('narrative-fallback',width,height);g.destroy();}
  setVisible(v){[this.blocker,this.shade,this.image,this.panel,this.name,this.text,this.interlude,this.comicTop,this.comicBottom].forEach(o=>o.setVisible(v));}
  hideTextLayers(){[this.panel,this.name,this.text,this.interlude,this.comicTop,this.comicBottom].forEach(o=>o.setVisible(false));}
  open(steps,done){this.ensureFallback();this.previousState=this.scene.progression?.state||'playing';if(this.scene.progression){this.scene.progression.state='narrative';this.scene.progression.syncPhysicsPause();}this.active=true;this.steps=steps;this.index=0;this.timer=0;this.waiting=false;this.done=done||null;this.setVisible(true);this.applyStep();}
  close(){this.active=false;this.setVisible(false);if(this.scene.progression){this.scene.progression.state=this.previousState==='narrative'?'playing':this.previousState;this.scene.progression.syncPhysicsPause();}const d=this.done;this.done=null;if(d)d();}
  setStill(key){const tex=key&&this.scene.textures.exists(key)?key:'narrative-fallback';this.image.setTexture(tex).setDisplaySize(this.scene.config.width,this.scene.config.height).setVisible(true);}
  say(who,text){this.image.setVisible(true);this.hideTextLayers();this.shade.setAlpha(.32).setVisible(true);this.name.setText(who||'');this.text.setText(text||'');this.panel.setVisible(true);this.name.setVisible(true);this.text.setVisible(true);this.waiting=true;}
  comic(top,bottom,key){this.setStill(key);this.hideTextLayers();this.shade.setAlpha(.08).setVisible(true);this.comicTop.setText(top||'');this.comicBottom.setText(bottom||'');this.comicTop.setVisible(!!top);this.comicBottom.setVisible(!!bottom);this.waiting=true;}
  interludeCard(text){this.image.setVisible(false);this.shade.setAlpha(1).setVisible(true);this.hideTextLayers();this.interlude.setText(text||'').setVisible(true);this.waiting=true;}
  showRetainers(){this.scene.showPreludeRetainers?.();}
  hideRetainers(){this.scene.hidePreludeRetainers?.();}
  applyStep(){const s=this.steps[this.index];if(!s){this.close();return;}this.timer=0;this.waiting=false;
    if(s.type==='still'){this.setStill(s.key);this.shade.setAlpha(s.dim==null?.28:s.dim).setVisible(true);this.hideTextLayers();this.waiting=true;}
    else if(s.type==='comic')this.comic(s.top,s.bottom,s.key);
    else if(s.type==='say')this.say(s.who,s.text);
    else if(s.type==='interlude')this.interludeCard(s.text);
    else if(s.type==='wait'){this.image.setVisible(true);this.hideTextLayers();this.waiting=false;}
    else if(s.type==='fade'){this.image.setVisible(true);this.hideTextLayers();this.shade.setVisible(true).setAlpha(s.alpha==null?1:s.alpha);}
    else if(s.type==='crows'){this.scene.fx?.burst(this.scene.queen.x,this.scene.queen.y-90,0x111018,24,180,2.5,.8);this.index++;this.applyStep();}
    else if(s.type==='summon'){this.showRetainers();this.scene.fx?.sigil(this.scene.queen.x+95,this.scene.queen.y-36,44,0xb18cff,.7);this.scene.fx?.sigil(this.scene.queen.x+175,this.scene.queen.y-36,44,0x6d5a8f,.9);this.index++;this.applyStep();}
    else if(s.type==='hideRetainers'){this.hideRetainers();this.index++;this.applyStep();}
    else if(s.type==='run'){s.run?.();this.index++;this.applyStep();}
  }
  advance(){if(this.active&&this.waiting){this.index++;this.applyStep();}}
  update(delta){if(!this.active)return;this.timer+=Math.min(delta,50)/1000;const s=this.steps[this.index];if(!s)return;if((s.type==='wait'||s.type==='fade')&&this.timer>=s.duration){this.index++;this.applyStep();}}
  opening(done){this.open([
    {type:'interlude',text:'Beneath the ruined kingdom, centuries passed in silence.'},
    {type:'comic',key:'comic-01',top:'Before the kingdoms learned to fear the dead, there was a Queen whose name was struck from every record.',bottom:'Her own court betrayed her. The paladins of the corrupted order sealed her beneath the First Tomb.'},
    {type:'comic',key:'comic-02',top:'Centuries passed. Roots and rust ate the seals.',bottom:'Darkness gathered where honour was broken — and the seal grew thin.'},
    {type:'comic',key:'comic-03',top:'On the night the moon turned away, the seal broke.',bottom:'She rose. And the dead remembered their Queen.'},
    {type:'interlude',text:'THE FIRST TOMB\n\nThe dead are waiting.'},
    {type:'fade',alpha:1,duration:.8}
  ],done);}
  levelOnePrelude(done){const prelude=[
    {type:'still',key:'first-tomb',dim:.12},{type:'summon'},
    {type:'say',who:'THE NECRO QUEEN',text:'Rise.'},
    {type:'say',who:'RETAINER A',text:'Your Majesty.'},
    {type:'say',who:'RETAINER B',text:'We heard your call.'},
    {type:'say',who:'THE NECRO QUEEN',text:'Then stand. The old court is dead. You are the first to answer.'},
    {type:'say',who:'RETAINER A',text:'As you command.'},
    {type:'say',who:'RETAINER B',text:'We remember.'},
    {type:'say',who:'THE NECRO QUEEN',text:'Good. Let the First Tomb remember us.'},
    {type:'hideRetainers'}
  ];
  const finish=()=>{window.ANGELIC_START_OPENING=false;if(done)done();};
  if(window.ANGELIC_START_OPENING){window.ANGELIC_START_OPENING=false;return this.open([{type:'interlude',text:'The seal breaks.\nSomething in the tomb answers.'},...prelude],finish);}this.open(prelude,finish);}
  graveLordConfrontation(done){this.open([{type:'still',key:'first-tomb',dim:.18},{type:'wait',duration:.5},{type:'say',who:'THE NECRO QUEEN',text:'...You remain.'},{type:'run',run:()=>this.scene.fx?.bossEntrance(this.scene.queen.x+220,this.scene.config.ground-40)},{type:'say',who:'THE NECRO QUEEN',text:'You should have stayed in the grave.'}],done);}
  graveLordDefeat(done){this.open([{type:'still',key:'first-tomb',dim:.18},{type:'wait',duration:.4},{type:'say',who:'THE NECRO QUEEN',text:'And now...'},{type:'say',who:'THE NECRO QUEEN',text:'...you will pay for your betrayal.'},{type:'run',run:()=>this.scene.fx?.cameraPunch(.01,260)},{type:'say',who:'THE NECRO QUEEN',text:'CORPSE BOMB!'},{type:'run',run:()=>this.scene.fx?.impact(this.scene.queen.x,this.scene.queen.y-30,0xa42c46,1.8)},{type:'wait',duration:1.1}],done);}
  aftermath(done){this.open([{type:'still',key:'aftermath',dim:.18},{type:'say',who:'THE NECRO QUEEN',text:'...My seal.'},{type:'say',who:'THE NECRO QUEEN',text:'So ends the first of those who betrayed me.'},{type:'say',who:'THE NECRO QUEEN',text:'My strength is still incomplete.'},{type:'crows',duration:2},{type:'say',who:'THE WITCH',text:'Your Majesty... the grave suits you, and yet you leave it.'},{type:'say',who:'THE NECRO QUEEN',text:'You know me, witch.'}],done);}
}
window.NarrativeDirector=NarrativeDirector;
