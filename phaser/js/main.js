/* Angelic Black — Phaser 4 entry point. */
(function(){
  'use strict';
  const cfg=window.ANGELIC_PHASER_CONFIG;
  try{
    const Title=window.TitleScene;
    const Game=window.GameScene;
    if(typeof Title!=='function')throw new ReferenceError('TitleScene is not defined after loader completion');
    if(typeof Game!=='function')throw new ReferenceError('GameScene is not defined after loader completion');
    const game=new Phaser.Game({type:Phaser.CANVAS,parent:'game-root',width:cfg.width,height:cfg.height,backgroundColor:'#0b0611',pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:cfg.width,height:cfg.height},physics:{default:'arcade',arcade:{gravity:{y:cfg.gravityY},debug:false}},scene:[Title,Game],banner:false});
    window.ANGELIC_PHASER_GAME=game;
    window.ANGELIC_BOOT_READY=true;
  }catch(err){window.dispatchEvent(new ErrorEvent('error',{message:err?.message||String(err),error:err}));}
})();
