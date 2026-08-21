/* ================= CUTSCENES ================= */
var cs=null;
function playCS(steps,onDone){ if(cs)return;
  cs={steps:steps,i:0,t:0,onDone:onDone,tint:0,fade:0,blackA:0,blood:null,dialog:null,still:false,stillImg:null,crows:null,choiceShown:false,pendingOptions:null};
  mode='cutscene'; }
function csNext(){ cs.i++; cs.t=0; cs.dialog=null; cs.choiceShown=false; hideChoices();
  if(cs.i>=cs.steps.length){ var d=cs.onDone; cs=null; mode='playing'; if(d)d(); } }
function csTap(){ if(!cs)return;
  if(cs.dialog){ sfx.tap(); csNext(); } }
function stepCS(dt){
  if(!cs)return;
  var s=cs.steps[cs.i]; if(!s){csNext();return;}
  cs.t+=dt;
  if(s.k==='wait'){ if(cs.t>=s.d)csNext(); }
  else if(s.k==='still'){ cs.still=!!s.v; if(s.img)cs.stillImg=s.img; csNext(); }
  else if(s.k==='say'){ if(!cs.dialog)cs.dialog={who:s.who,text:s.text}; }
  else if(s.k==='choice'){ if(!cs.choiceShown){ cs.choiceShown=true; showChoices(s.options); } }
  else if(s.k==='goto'){ jumpTo(s.goto); }
  else if(s.k==='gotoIf'){ jumpTo(FLAGS[s.flag]?s.yes:s.no); }
  else if(s.k==='shake'){ shakeT=Math.max(shakeT,s.amp); if(cs.t>=s.d)csNext(); }
  else if(s.k==='tint'){ cs.tint=Math.min(1,cs.t/s.d); if(cs.t>=s.d)csNext(); }
  else if(s.k==='untint'){ cs.tint=Math.max(0,1-cs.t/s.d); if(cs.t>=s.d)csNext(); }
  else if(s.k==='black'){ cs.blackA=Math.min(1,cs.t/s.d); if(cs.t>=s.d)csNext(); }
  else if(s.k==='unblack'){ cs.blackA=Math.max(0,1-cs.t/s.d); if(cs.t>=s.d)csNext(); }
  else if(s.k==='crows'){
    if(!cs.crows||cs.crows.mode!==s.mode)initCrows(s.mode,s.d);
    cs.crows.t+=dt;
    if(cs.crows.t>=s.d){ cs.crows=null; csNext(); }
  }
  else if(s.k==='fn'){ s.run(); csNext(); }
  else if(s.k==='blood'){
    if(!cs.blood){ cs.blood=[]; for(var i=0;i<26;i++){ cs.blood.push({x:rnd(0,VW),y:rnd(-40,0),
      len:rnd(20,90),spd:rnd(30,90),w:rnd(2,5)}); } }
    cs.fade=Math.min(1,cs.t/s.d);
    for(var b=0;b<cs.blood.length;b++){ cs.blood[b].y+=cs.blood[b].spd*dt; }
    if(cs.t>=s.d)csNext();
  }
  else if(s.k==='end'){ var r=s.run; cs=null; hideChoices(); mode='playing'; if(r)r(); }
}
function drawCrowShape(g,x,y,f){
  g.fillStyle='#0a0a12';
  g.fillRect(x-2,y-1,5,2);
  g.beginPath();
  if(f){ g.moveTo(x-1,y); g.lineTo(x-6,y-4); g.lineTo(x-1,y-1);
    g.moveTo(x+2,y); g.lineTo(x+7,y-4); g.lineTo(x+2,y-1); }
  else { g.moveTo(x-1,y); g.lineTo(x-6,y+3); g.lineTo(x-1,y-1);
    g.moveTo(x+2,y); g.lineTo(x+7,y+3); g.lineTo(x+2,y-1); }
  g.fill();
}
function drawCrows(g){
  var c=cs.crows; if(!c)return;
  var k=Math.min(1,c.t/c.d); var e=k*k*(3-2*k);
  for(var i=0;i<c.list.length;i++){ var cr=c.list[i];
    var x,y,a=1;
    if(c.mode==='in'){ x=cr.sx+(cr.tx-cr.sx)*e; y=cr.sy+(cr.ty-cr.sy)*e; }
    else { x=cr.sx+(cr.tx-cr.sx)*e; y=cr.sy+(cr.ty-cr.sy)*e; a=1-e*0.9; }
    var f=Math.sin(cr.ph+c.t*14)>0;
    g.globalAlpha=a;
    drawCrowShape(g,x,y,f);
  }
  g.globalAlpha=1;
}
function bossIntroCS(){
  playCS([
    {k:'still',v:1,img:bossImg},
    {k:'shake',amp:0.35,d:0.45},
    {k:'say',who:'THE NECRO QUEEN',text:'...You remain.'},
    {k:'still',v:0}
  ]);
}
function corpseBomb(f){
  f.dying=true;
  corpseFx={x:f.x,y:f.y,t:0,ref:f,s1:false,s2:false,s3:false,lt:0};
  sfx.charge();
}
function bossDefeatCS(f){
  playCS([
    {k:'still',v:1,img:bossImg},{k:'wait',d:0.4},
    {k:'say',who:'THE NECRO QUEEN',text:'And now...'},
    {k:'say',who:'THE NECRO QUEEN',text:BETRAYER_NAME+'...'},
    {k:'say',who:'THE NECRO QUEEN',text:'...you will pay for your betrayal.'},
    {k:'still',v:0},
    {k:'fn',run:function(){ player.castFx=0.5; }},
    {k:'say',who:'THE NECRO QUEEN',text:'CORPSE BOMB!'},
    {k:'fn',run:function(){ corpseBomb(f); }},
    {k:'shake',amp:0.6,d:0.5},
    {k:'wait',d:1.6},
    {k:'fn',run:function(){ inv.signet=1; }},
    {k:'say',who:'THE NECRO QUEEN',text:'...My seal.'},
    {k:'black',d:0.7},
    {k:'still',v:1,img:aftermathImg},
    {k:'unblack',d:0.9},
    {k:'wait',d:0.6},
    {k:'say',who:'THE NECRO QUEEN',text:'So ends the first of those who betrayed me.'},
    {k:'say',who:'THE NECRO QUEEN',text:'It cost more than it should have. My strength is still incomplete.'},
    {k:'say',who:'THE NECRO QUEEN',text:'But the dead now know their Queen walks again. Rise, my guards — we move.'},
    {k:'black',d:0.8},
    {k:'still',v:1,img:roadImg},
    {k:'unblack',d:0.9},
    {k:'wait',d:1.4},
    {k:'crows',mode:'in',d:2.4},
    {k:'black',d:0.3},
    {k:'still',v:1,img:witchImg},
    {k:'unblack',d:0.5},
    {k:'say',who:'THE WITCH',text:'Your Majesty... the grave suits you, and yet you leave it.'},
    {k:'say',who:'THE NECRO QUEEN',text:'You know me, witch.'},
    {k:'say',who:'THE WITCH',text:'I know what you will need before the second tomb. Browse, then. The crows grow restless.'},
    {k:'end',run:function(){ openVendor(); }}
  ]);
}
function witchDepartCS(){
  playCS([
    {k:'still',v:1,img:witchImg},
    {k:'say',who:'THE WITCH',text:'Spend well, Your Majesty. The crows do not wait.'},
    {k:'say',who:'',text:'[The witch gives a faint, almost courtly bow.]'},
    {k:'crows',mode:'out',d:2.0},
    {k:'say',who:'',text:'[The Necro Queen continues along the road.]'},
    {k:'black',d:0.7},
    {k:'end',run:function(){ gameFade=0.6; startRidgeCS(); }}
  ]);
}
function firstZombieCS(){
  playCS([
    {k:'wait',d:0.3},
    {k:'say',who:'THE NECRO QUEEN',text:'My old guard...'},
    {k:'say',who:'THE NECRO QUEEN',text:'...now mindless shamblers.'}
  ],function(){
    memoryCS('lance','GRAVE LANCE',[
      'These shamblers press as soldiers once pressed.',
      'A bolt is not enough. I remember the heavier hand.']);
  });
}
function jesterCS(){
  playCS([
    {k:'wait',d:0.4},
    {k:'say',who:"THE JESTER'S HEAD",text:'You know, Your Majesty...'},
    {k:'say',who:"THE JESTER'S HEAD",text:'...I have been meaning to mention something.'},
    {k:'wait',d:0.3}
  ]);
}
function wrapText(g,text,x,y,maxW,lh){
  var words=text.split(' '), line='', yy=y;
  for(var i=0;i<words.length;i++){
    var test=line+words[i]+' ';
    if(g.measureText(test).width>maxW&&i>0){ g.fillText(line,x,yy); line=words[i]+' '; yy+=lh; }
    else line=test;
  }
  g.fillText(line,x,yy);
}
var bgImg=new Image(); var bgReady=false;
bgImg.onload=function(){bgReady=true;};
bgImg.src='https://image.qwenlm.ai/public_source/de086523-4053-4904-8d82-f5f98bd17fc5/1b96349d4-2f58-48fa-a8ca-8810611553b2.png';
var bossImg=new Image(); var bossReady=false;
bossImg.onload=function(){bossReady=true;};
bossImg.src='https://image.qwenlm.ai/public_source/de086523-4053-4904-8d82-f5f98bd17fc5/1061cc221-1c1e-4ad5-9ac2-8629b9f9dd3e.png';
var aftermathImg=new Image(); aftermathImg.src=AFTERMATH_IMG;
var roadImg=new Image(); roadImg.src=ROAD_IMG;
var witchImg=new Image(); witchImg.src=WITCH_IMG;
var prestageImg=new Image(); prestageImg.src=PRESTAGE_IMG;
var ridgeImg=new Image(); ridgeImg.src=RIDGE_IMG;
var nameAImg=new Image(); nameAImg.src=NAMEA_IMG;
var nameBImg=new Image(); nameBImg.src=NAMEB_IMG;
var maraImg=new Image(); maraImg.src=MARA_IMG;
var nobleImg=new Image(); nobleImg.src=NOBLE_IMG;
var dlgImg=new Image(); dlgImg.src=DIALOG_PORTRAIT;
var itemImg=new Image(); var itemReady=false;
itemImg.onload=function(){itemReady=true;};
itemImg.src='https://image.qwenlm.ai/public_source/de086523-4053-4904-8d82-f5f98bd17fc5/189d2f744-5e3b-4c80-9251-5b47aeaa0adb.png';
var griefImg=new Image(); var griefReady=false;
griefImg.onload=function(){griefReady=true;};
griefImg.src='https://image.qwenlm.ai/public_source/de086523-4053-4904-8d82-f5f98bd17fc5/1457c9621-2876-433c-bb7b-90c06f84c8be.png';
var signetImg=new Image(); var signetReady=false;
signetImg.onload=function(){signetReady=true;};
signetImg.src='https://image.qwenlm.ai/public_source/de086523-4053-4904-8d82-f5f98bd17fc5/17fce66db-6d20-475b-81a9-2a57f1832260.png';
var pImg=new Image(); pImg.src=DIALOG_PORTRAIT;

var ICON={heart:[10,10,320,320],shard:[352,10,320,320],gold:[694,10,320,320],
 tincture:[10,352,320,320],pewter:[352,352,640,320],jester:[10,694,320,320],page:[352,694,320,320]};
function drawIcon(g,key,x,y,s){ if(!itemReady)return; var r=ICON[key];
  g.drawImage(itemImg,r[0],r[1],r[2],r[3],x,y,s,s); }

function drawCSOverlay(g){
  if(!cs)return;
  if(cs.still){
    var img=cs.stillImg||bossImg;
    if(img.complete&&img.naturalWidth>0){
      g.fillStyle='#05030a'; g.fillRect(0,0,VW,VH);
      var sc=Math.max(VW/img.width,VH/img.height);
      var iw=img.width*sc, ih=img.height*sc;
      g.drawImage(img,(VW-iw)/2,(VH-ih)/2,iw,ih);
      g.fillStyle='rgba(5,0,10,0.25)'; g.fillRect(0,0,VW,VH);
    }
  }
  if(cs.tint>0){ g.fillStyle='rgba(5,0,10,'+(0.55*cs.tint).toFixed(2)+')'; g.fillRect(0,0,VW,VH); }
  if(cs.crows){ drawCrows(g); }
  if(cs.dialog){
    var bh=140, bx=24, bw=VW-48, by=VH-CONTROL_BAND-14-bh;
    g.fillStyle='rgba(8,5,14,0.94)'; g.fillRect(bx,by,bw,bh);
    g.strokeStyle='rgba(214,224,240,.45)'; g.lineWidth=1; g.strokeRect(bx+0.5,by+0.5,bw-1,bh-1);
    g.strokeStyle='rgba(216,169,78,.7)';
    g.strokeRect(bx+3.5,by+3.5,8,8); g.strokeRect(bx+bw-12.5,by+3.5,8,8);
    g.strokeRect(bx+3.5,by+bh-12.5,8,8); g.strokeRect(bx+bw-12.5,by+bh-12.5,8,8);
    var who=cs.dialog.who;
    var tx=bx+16, maxW=bw-32;
    var isQueen=(who==='THE NECRO QUEEN');
    var isSkeleton=(who==='NAME A'||who==='NAME B');
    if(isQueen&&dlgImg.complete&&dlgImg.naturalWidth>0){
      g.save(); g.beginPath(); g.arc(bx+52,by+70,42,0,6.283); g.clip();
      g.drawImage(dlgImg,bx+8,by+26,88,88); g.restore();
      g.strokeStyle='rgba(216,169,78,.7)'; g.lineWidth=2;
      g.beginPath(); g.arc(bx+52,by+70,42,0,6.283); g.stroke();
      tx=bx+106; maxW=bw-(tx-bx)-16;
    } else if(!isQueen&&(isSkeleton||who==='MARA'||who==='NOBLEMAN')){
      var simg=isSkeleton?((who==='NAME A')?nameAImg:nameBImg):((who==='MARA')?maraImg:nobleImg);
      if(simg.complete&&simg.naturalWidth>0){
        g.save(); g.beginPath(); g.arc(bx+bw-52,by+70,42,0,6.283); g.clip();
        g.drawImage(simg,bx+bw-96,by+26,88,88); g.restore();
        g.strokeStyle=(who==='MARA')?'rgba(120,170,255,.6)':'rgba(92,255,160,.6)'; g.lineWidth=2;
        g.beginPath(); g.arc(bx+bw-52,by+70,42,0,6.283); g.stroke();
      }
      maxW=bw-16-104;
    }
    if(who)txt(g,who,tx,by+16,8,isQueen?'#d8a94e':(who==='MARA'?'#8fb7ff':(isSkeleton?'#7dffc0':'#cfd6e6')));
    var ital=cs.dialog.text.charAt(0)==='[';
    g.font=(ital?'italic ':'')+'16.5px "EB Garamond", serif';
    g.textAlign='left'; g.textBaseline='top';
    g.fillStyle=isSkeleton?'#b9c4b9':'#cfd6e6';
    wrapText(g,cs.dialog.text,tx,by+44,maxW,21);
    if(Math.floor(tGlobal*2)%2===0){
      g.fillStyle='#7dffc0';
      g.save(); g.translate(bx+bw-20,by+bh-18); g.rotate(0.785); g.fillRect(-4,-4,8,8); g.restore();
    }
  }
  if(cs.fade>0){
    g.fillStyle='rgba(2,1,4,'+cs.fade.toFixed(2)+')'; g.fillRect(0,0,VW,VH);
    if(cs.blood){
      for(var i=0;i<cs.blood.length;i++){ var d=cs.blood[i];
        g.fillStyle='rgba(120,15,25,'+(0.8*cs.fade).toFixed(2)+')';
        g.fillRect(d.x,d.y,d.w,d.len);
        g.fillRect(d.x-1,d.y+d.len,d.w+2,3);
      }
    }
  }
  if(cs.blackA>0){ g.fillStyle='rgba(0,0,0,'+cs.blackA.toFixed(2)+')'; g.fillRect(0,0,VW,VH); }
}

