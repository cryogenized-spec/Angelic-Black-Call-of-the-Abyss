/* ================= UI ASSET REGISTRY ================= */
(function(){
  'use strict';

  var local={
    queenDialogue:'assets/art/portraits/dialogue/necro-queen-dialogue.png',
    nameADialogue:'assets/art/portraits/dialogue/name-a-dialogue.png',
    nameBDialogue:'assets/art/portraits/dialogue/name-b-dialogue.png',
    witchDialogue:'assets/art/portraits/dialogue/witch-dialogue.png',
    maraDialogue:'assets/art/portraits/dialogue/mara-dialogue.png',
    noblemanDialogue:'assets/art/portraits/dialogue/nobleman-dialogue.png',
    jesterDialogue:'assets/art/portraits/dialogue/jester-dialogue.png',
    queenLevelUp:'assets/art/portraits/level-up/necro-queen-level-up.png'
  };

  var fallback={
    queenDialogue:DIALOG_PORTRAIT,
    nameADialogue:NAMEA_IMG,
    nameBDialogue:NAMEB_IMG,
    maraDialogue:MARA_IMG,
    noblemanDialogue:NOBLE_IMG,
    witchDialogue:null,
    jesterDialogue:null,
    queenLevelUp:DIALOG_PORTRAIT
  };

  window.__ANGELIC_BLACK_UI_ASSETS__={
    dialogue:{
      queen:{path:local.queenDialogue,side:'left',shape:'circle'},
      nameA:{path:local.nameADialogue,side:'right',shape:'circle'},
      nameB:{path:local.nameBDialogue,side:'right',shape:'circle'},
      witch:{path:local.witchDialogue,side:'right',shape:'circle'},
      mara:{path:local.maraDialogue,side:'right',shape:'circle'},
      nobleman:{path:local.noblemanDialogue,side:'right',shape:'circle'},
      jester:{path:local.jesterDialogue,side:'right',shape:'circle'}
    },
    levelUp:{path:local.queenLevelUp,side:'left',shape:'wallpaper'}
  };

  function loadWithFallback(img,primary,secondary){
    if(!img||!primary)return;
    var failed=false;
    img.onerror=function(){
      if(failed||!secondary)return;
      failed=true; img.src=secondary;
    };
    img.src=primary;
  }

  /* The existing renderer already creates these Image objects. Point them at the new
     canonical UI assets while retaining prototype fallbacks until the new artwork exists. */
  loadWithFallback(window.dlgImg,local.queenDialogue,fallback.queenDialogue);
  loadWithFallback(window.nameAImg,local.nameADialogue,fallback.nameADialogue);
  loadWithFallback(window.nameBImg,local.nameBDialogue,fallback.nameBDialogue);
  loadWithFallback(window.maraImg,local.maraDialogue,fallback.maraDialogue);
  loadWithFallback(window.nobleImg,local.noblemanDialogue,fallback.noblemanDialogue);

  var witchDialogueImg=new Image();
  var jesterDialogueImg=new Image();
  loadWithFallback(witchDialogueImg,local.witchDialogue,fallback.witchDialogue||WITCH_IMG);
  loadWithFallback(jesterDialogueImg,local.jesterDialogue,null);
  window.__ANGELIC_BLACK_UI_PORTRAITS__={witch:witchDialogueImg,jester:jesterDialogueImg};

  var lvlImg=document.getElementById('portrait');
  if(lvlImg){
    loadWithFallback(lvlImg,local.queenLevelUp,fallback.queenLevelUp);
  }

  /* Canvas dialogue treatment: Queen badge LEFT, every named character RIGHT. */
  var originalDrawCSOverlay=window.drawCSOverlay;
  if(typeof originalDrawCSOverlay==='function'){
    function portraitForSpeaker(who){
      if(who==='THE NECRO QUEEN')return {img:window.dlgImg,side:'left',color:'rgba(216,169,78,.8)',nameColor:'#d8a94e',textColor:'#cfd6e6'};
      if(who==='NAME A')return {img:window.nameAImg,side:'right',color:'rgba(92,255,160,.6)',nameColor:'#7dffc0',textColor:'#b9c4b9'};
      if(who==='NAME B')return {img:window.nameBImg,side:'right',color:'rgba(92,255,160,.6)',nameColor:'#7dffc0',textColor:'#b9c4b9'};
      if(who==='MARA')return {img:window.maraImg,side:'right',color:'rgba(120,170,255,.6)',nameColor:'#8fb7ff',textColor:'#cfd6e6'};
      if(who==='NOBLEMAN')return {img:window.nobleImg,side:'right',color:'rgba(216,169,78,.6)',nameColor:'#d8a94e',textColor:'#cfd6e6'};
      if(who==='THE WITCH')return {img:window.__ANGELIC_BLACK_UI_PORTRAITS__.witch,side:'right',color:'rgba(177,140,255,.6)',nameColor:'#b18cff',textColor:'#cfd6e6'};
      if(who==="THE JESTER'S HEAD")return {img:window.__ANGELIC_BLACK_UI_PORTRAITS__.jester,side:'right',color:'rgba(255,177,92,.6)',nameColor:'#ffb15c',textColor:'#cfd6e6'};
      return {img:null,side:'right',color:'rgba(214,224,240,.45)',nameColor:'#cfd6e6',textColor:'#cfd6e6'};
    }

    function drawDialoguePanel(g,d){
      var bh=154, bx=24, bw=VW-48, by=VH-CONTROL_BAND-14-bh;
      g.fillStyle='rgba(8,5,14,0.95)'; g.fillRect(bx,by,bw,bh);
      g.strokeStyle='rgba(214,224,240,.48)'; g.lineWidth=1; g.strokeRect(bx+.5,by+.5,bw-1,bh-1);
      g.strokeStyle='rgba(216,169,78,.7)';
      g.strokeRect(bx+3.5,by+3.5,8,8); g.strokeRect(bx+bw-12.5,by+3.5,8,8);
      g.strokeRect(bx+3.5,by+bh-12.5,8,8); g.strokeRect(bx+bw-12.5,by+bh-12.5,8,8);

      var who=d.who, spec=portraitForSpeaker(who);
      var pad=20, radius=46, cy=by+bh/2;
      var portraitX=spec.side==='left'?bx+pad+radius:bx+bw-pad-radius;
      var tx, maxW;
      if(spec.side==='left'){
        tx=bx+pad+radius*2+18; maxW=bw-(tx-bx)-18;
      }else{
        tx=bx+18; maxW=(portraitX-bx)-radius-30;
      }

      if(spec.img&&spec.img.complete&&spec.img.naturalWidth>0){
        g.save(); g.beginPath(); g.arc(portraitX,cy,radius,0,6.283); g.clip();
        var sc=Math.max((radius*2)/spec.img.width,(radius*2)/spec.img.height);
        var iw=spec.img.width*sc, ih=spec.img.height*sc;
        g.drawImage(spec.img,portraitX-iw/2,cy-ih/2,iw,ih);
        g.restore();
        g.strokeStyle=spec.color; g.lineWidth=2.5;
        g.beginPath(); g.arc(portraitX,cy,radius,0,6.283); g.stroke();
      }

      if(who)txt(g,who,tx,by+18,8,spec.nameColor);
      var ital=d.text.charAt(0)==='[';
      g.font=(ital?'italic ':'')+'16.5px "EB Garamond", serif';
      g.textAlign='left'; g.textBaseline='top'; g.fillStyle=spec.textColor;
      wrapText(g,d.text,tx,by+46,maxW,21);
      if(Math.floor(tGlobal*2)%2===0){
        g.fillStyle='#7dffc0'; g.save(); g.translate(spec.side==='left'?bx+bw-20:bx+20,by+bh-18); g.rotate(.785); g.fillRect(-4,-4,8,8); g.restore();
      }
    }

    window.drawCSOverlay=function(g){
      if(window.cs&&window.cs.dialog){
        var saved=window.cs.dialog; window.cs.dialog=null;
        originalDrawCSOverlay(g);
        window.cs.dialog=saved;
        drawDialoguePanel(g,saved);
      }else{
        originalDrawCSOverlay(g);
      }
    };
  }

  /* Landscape level-up wallpaper treatment. */
  var style=document.createElement('style');
  style.id='ab-ui-asset-layout';
  style.textContent='@media (orientation:landscape){' +
    '#lvlPanel{grid-template-columns:42% 58%;gap:0;padding:0;background:linear-gradient(90deg,#0a0714 0%,#0f091b 44%,#120b1d 100%);}' +
    '#lvlLeft{border:0;border-right:1px solid rgba(214,224,240,.2);justify-content:flex-start;background:#090612;}' +
    '#lvlLeft::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(9,6,18,0) 0%,rgba(9,6,18,.06) 40%,rgba(9,6,18,.92) 100%),linear-gradient(0deg,rgba(5,3,10,.35),transparent 55%);pointer-events:none;}' +
    '#portrait{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:24% 30%;filter:saturate(1.02) contrast(1.05);}' +
    '#lvlRight{position:relative;z-index:3;padding:5% 7%;justify-content:center;background:linear-gradient(90deg,rgba(13,8,22,.02),rgba(13,8,22,.72) 12%,rgba(13,8,22,.96) 100%);}' +
    '.bk-name{font-size:4.4cqw}.bk-title{font-size:2.5cqw}.bk-lvl{font-size:2.7cqw}.bk-choose{font-size:3.6cqw}' +
    '.trait{padding:1.5cqw 2cqw}.trait .tname{font-size:3.5cqw}.trait .tdesc{font-size:2.5cqw}.trait ul{font-size:2.4cqw;}' +
  '}';
  document.head.appendChild(style);
})();
