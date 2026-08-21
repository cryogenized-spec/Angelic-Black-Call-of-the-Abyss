/* ================= SPRITES ================= */
var COL={robe:'#4a2472',robed:'#331654',robel:'#7446ab',trim:'#d8a94e',skin:'#eecfa8',skind:'#cfa87f',
 hair:'#e6e9fb',haird:'#b3b9dd',eye:'#5cffa0',staff:'#43301f',orb:'#7dffc0',orbc:'#eafff3',boot:'#241236',
 bone:'#e8e6d4',boned:'#b9b6a2',steel:'#9aa5b8',steeld:'#5f6a7d',steell:'#dfe6f2',dark:'#1c2430',
 plume:'#7a1f2b',wing:'#5b3a86',batbody:'#3a2350',redeye:'#ff5c6d',
 barrmor:'#3d3352',barmorD:'#241b38',bcape:'#2a1240',beye:'#ff5c6d',bhorn:'#cfc9b4',bblade:'#bfe8ff',
 cape:'#2a1240',zskin:'#7d8a6a',zcloth:'#33402c',zdark:'#1c2418',mrobe:'#2a2440',mfire:'#ff9a3d',
 rust:'#7a4a2a',rustl:'#8a5a3a',moss:'#4a5a3e',chood:'#20242e',crobe:'#2a2440',ceye:'#8fb7ff',
 mhood:'#141820',msword:'#dfe6f2'};
function N(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function necroBody(g,tt,walking,castAmt,aura){
  aura=aura||0;
  var lift=Math.round(aura*2);
  var sway=Math.round(Math.sin(tt*3)*(1+aura*2));
  var c;
  for(c=0;c<11;c++){
    var cw=3+Math.floor(c*0.5);
    var cx=-5-Math.floor(c*0.4)-Math.round(Math.sin(tt*3+c*0.5)*(1+(walking?1:0)+aura*2));
    N(g,cx,-20+c,cw,1,COL.cape);
  }
  N(g,-7,-27-lift,3,22,COL.haird);
  N(g,-8+sway,-22-lift,2,17,COL.haird);
  N(g,-9+sway,-13,2,9,COL.hair);
  N(g,-6,-30-lift,4,5,COL.hair);
  var step=walking?Math.round(Math.sin(tt*11)*2):0;
  N(g,-3-step,-3,2,3,COL.boot); N(g,1+step,-3,2,3,COL.boot);
  for(var r=0;r<9;r++){
    var l=-3-Math.floor(r*0.66), rr=4+Math.floor(r*0.45);
    N(g,l,-13+r,rr-l+1,1,(r>=7?COL.robed:COL.robe));
    if(r%2===0){ N(g,l,-13+r,1,1,COL.trim); N(g,rr,-13+r,1,1,COL.trim); }
  }
  N(g,-3,-21,7,8,COL.robe); N(g,-3,-21,2,8,COL.robed); N(g,2,-20,2,6,COL.robel);
  N(g,-3,-14,7,1,COL.trim); N(g,0,-19,2,2,COL.eye);
  g.globalAlpha=0.3+0.2*Math.sin(tt*4)+0.3*castAmt;
  g.fillStyle=COL.eye; g.beginPath(); g.arc(1,-18,2.4,0,6.2832); g.fill(); g.globalAlpha=1;
  N(g,-4,-19,2,4,COL.robed);
  N(g,-2,-30,6,8,COL.skin); N(g,-2,-30,1,8,COL.skind);
  var eyeHot=(castAmt>0||aura>0);
  N(g,2,-27,1,1,eyeHot?'#b8ffe0':COL.eye);
  if(eyeHot){ g.globalAlpha=0.5; g.fillStyle=COL.eye; g.fillRect(1,-28,3,3); g.globalAlpha=1; }
  N(g,3,-23,1,1,'#b06a5e');
  N(g,-3,-32,8,3,COL.hair); N(g,-4,-31,2,4,COL.hair); N(g,4,-30,1,3,COL.haird);
  N(g,-1,-29,4,1,COL.trim); N(g,0,-30,1,1,COL.trim); N(g,2,-30,1,1,COL.trim);
  N(g,7,-31,1,29,COL.staff);
  N(g,3,-19,2,2,COL.robe); N(g,4,-17,3,2,COL.robel); N(g,3,-16,2,3,COL.robel); N(g,6,-16,2,2,COL.skin);
  N(g,6,-34,3,3,COL.orb); N(g,7,-33,1,1,COL.orbc);
  var pulse=0.5+0.5*Math.sin(tt*5);
  g.globalAlpha=0.22+0.18*pulse+0.45*castAmt;
  g.fillStyle=COL.orb; g.beginPath(); g.arc(7.5,-32.5,2.2+1.8*castAmt+0.6*pulse,0,6.2832); g.fill(); g.globalAlpha=1;
  if(castAmt>0){ N(g,9,-33,2,1,COL.orbc); N(g,10,-32,2,1,COL.orb); }
}
function knightBody(g,ph,lunge){
  var st=Math.round(Math.sin(ph)*1.5);
  N(g,-2-st,-9,2,9,COL.dark); N(g,1+st,-9,2,9,COL.dark);
  N(g,-2-st,-2,2,2,COL.steel); N(g,1+st,-2,2,2,COL.steel);
  N(g,-3,-17,7,8,COL.steeld); N(g,-2,-16,4,4,COL.steel); N(g,-3,-10,7,1,COL.dark);
  N(g,-2,-22,5,5,COL.steel); N(g,1,-20,2,1,COL.dark); N(g,-2,-24,2,2,COL.plume);
  var up=lunge?-2:0;
  N(g,3,-16,2,2,COL.steeld); N(g,4,-17+up,3,1,COL.dark); N(g,5,-22+up,1,5,COL.steell);
}
function cultistBody(g,ph,lunge){
  var st=Math.round(Math.sin(ph)*1.5);
  N(g,-2-st,-9,2,9,COL.dark); N(g,1+st,-9,2,9,COL.dark);
  N(g,-3,-18,7,9,COL.crobe); N(g,-3,-18,2,9,'#1c1830');
  N(g,-3,-24,7,6,COL.chood); N(g,-2,-22,4,3,'#0a0c12');
  N(g,-1,-21,1,1,COL.ceye); N(g,1,-21,1,1,COL.ceye);
  var up=lunge?-2:0;
  N(g,3,-15,2,2,COL.skin); N(g,4,-16+up,1,5,COL.steell);
}
function maraBody(g,ph,lunge){
  var st=Math.round(Math.sin(ph)*2);
  N(g,-2-st,-9,2,9,'#101318'); N(g,1+st,-9,2,9,'#101318');
  N(g,-3,-18,7,9,COL.mhood); N(g,-3,-18,2,9,'#0c0f14');
  N(g,-3,-24,7,6,'#141820'); N(g,-2,-22,4,3,'#0a0c12');
  N(g,-1,-21,1,1,'#4da3ff'); N(g,1,-21,1,1,'#4da3ff');
  var up=lunge?-2:0;
  N(g,3,-15,2,2,COL.skin); N(g,4,-16+up,1,6,COL.msword); N(g,4,-17+up,1,1,COL.steell);
}
function zombBody(g,ph,lunge){
  var st=Math.round(Math.sin(ph));
  N(g,-3-st,-10,3,10,COL.zdark); N(g,1+st,-10,3,10,'#222b1f');
  N(g,-4,-20,9,10,COL.zcloth);
  N(g,-4,-18,3,2,COL.zdark); N(g,0,-15,3,2,COL.zdark);
  N(g,-2,-17,4,3,COL.zskin);
  N(g,5,-19,4,2,'#4a5a3e'); N(g,6,-17,4,2,'#4a5a3e');
  N(g,-3,-26,6,6,COL.zskin);
  N(g,0,-24,1,1,COL.eye);
  N(g,-3,-24,2,3,COL.zdark);
  var up=lunge?-1:0;
  N(g,5,-20+up,3,2,COL.zskin);
}
function mageBody(g,tt){
  var bob=Math.round(Math.sin(tt*2));
  g.globalAlpha=0.25+0.1*Math.sin(tt*5);
  g.fillStyle='#ff9a3d'; g.beginPath(); g.arc(0,-14+bob,9,0,6.2832); g.fill(); g.globalAlpha=1;
  N(g,-3,-10+bob,6,7,COL.mrobe);
  N(g,-4,-6+bob,2,3,COL.mrobe); N(g,3,-7+bob,2,4,COL.mrobe);
  N(g,-2,-4+bob,1,3,COL.dark); N(g,1,-3+bob,1,4,COL.dark);
  N(g,-2,-16+bob,4,6,COL.boned);
  N(g,-2,-15+bob,1,4,COL.boned); N(g,1,-14+bob,1,3,COL.boned);
  N(g,-2,-21+bob,5,5,COL.bone);
  N(g,0,-19+bob,1,1,COL.mfire); N(g,2,-19+bob,1,1,COL.mfire);
  N(g,-2,-22+bob,5,1,COL.trim);
  N(g,-4,-13+bob,2,2,COL.boned); N(g,3,-13+bob,2,2,COL.boned);
}
function bossBody(g,ph,lunge){
  var st=Math.round(Math.sin(ph)*1.5);
  N(g,-7,-20,3,15,COL.bcape); N(g,-8+st,-16,2,10,COL.bcape);
  N(g,-3-st,-10,3,10,'#141021'); N(g,1+st,-10,3,10,'#141021');
  N(g,-3-st,-2,3,2,COL.barrmor); N(g,1+st,-2,3,2,COL.barrmor);
  N(g,-4,-19,9,9,COL.barmorD); N(g,-3,-18,6,5,COL.barrmor); N(g,-4,-11,9,1,COL.trim);
  N(g,-3,-25,7,6,COL.barrmor); N(g,1,-23,3,2,'#0c0815');
  N(g,1,-23,1,1,COL.beye); N(g,3,-23,1,1,COL.beye);
  N(g,-5,-28,2,4,COL.bhorn); N(g,4,-28,2,4,COL.bhorn); N(g,-2,-27,5,2,COL.trim);
  var up=lunge?-3:0;
  N(g,5,-17,2,2,COL.barmorD); N(g,6,-19+up,4,1,COL.trim); N(g,7,-27+up,2,8,COL.bblade);
}
function skelordBody(g,ph,lunge){
  var st=Math.round(Math.sin(ph)*1.5);
  N(g,-9,-24,3,18,'#1a1026'); N(g,-10+st,-18,2,10,'#1a1026');
  N(g,-3-st,-12,2,12,COL.boned); N(g,2+st,-12,2,12,COL.bone);
  N(g,-4,-22,9,10,COL.boned);
  N(g,-4,-20,9,1,COL.dark); N(g,-4,-17,9,1,COL.dark); N(g,-4,-14,9,1,COL.dark);
  N(g,-7,-25,4,4,COL.barrmor); N(g,4,-25,4,4,COL.barrmor);
  N(g,-7,-22,4,1,COL.trim); N(g,4,-22,4,1,COL.trim);
  N(g,-3,-30,7,7,COL.bone);
  N(g,-1,-27,1,1,COL.eye); N(g,2,-27,1,1,COL.eye);
  N(g,-3,-31,7,2,COL.trim); N(g,-2,-33,1,2,COL.trim); N(g,0,-34,1,3,COL.trim); N(g,2,-33,1,2,COL.trim);
  var up=lunge?-3:0;
  N(g,6,-20,2,3,COL.boned); N(g,7,-21+up,1,4,COL.dark);
  N(g,8,-38+up,2,18,COL.steeld); N(g,9,-38+up,1,18,COL.steell); N(g,8,-40+up,2,2,COL.steell);
}
function skelBody(g,ph,atk,bow,variant){
  variant=variant||0;
  var st=Math.round(Math.sin(ph)*2);
  var eyeC=inv.signet>0?'#b8ffe0':COL.eye;
  N(g,-2-st,-6,1,6,COL.boned); N(g,1+st,-6,1,6,COL.bone);
  N(g,-1,-9,3,1,COL.boned); N(g,0,-13,1,4,COL.boned);
  N(g,-2,-13,5,1,COL.bone); N(g,-2,-11,5,1,COL.boned);
  var ext=atk?2:0;
  N(g,1,-13,4+ext,1,COL.bone); N(g,1,-12,3+ext,1,COL.boned);
  if(bow){
    N(g,5,-17,1,9,COL.staff);
    N(g,4,-17,1,1,COL.boned); N(g,4,-9,1,1,COL.boned);
    N(g,6,-13,3,1,COL.boned);
  } else if(variant===1||variant===2){
    if(atk){ N(g,4+ext,-14,1,2,COL.rust); N(g,5+ext,-14,5,1,COL.rust); N(g,9+ext,-15,2,1,COL.rustl); }
    else { N(g,5,-19,1,7,COL.rust); N(g,6,-20,1,2,COL.rustl); N(g,5,-12,2,2,COL.rust); }
  } else if(atk){ N(g,4+ext,-14,1,3,COL.dark); N(g,5+ext,-13,6,1,COL.steell); N(g,10+ext,-13,1,1,COL.steell); }
  else { N(g,4,-12,3,1,COL.dark); N(g,5,-19,1,7,COL.steell); N(g,5,-20,1,1,COL.steell); }
  if(variant===1){ N(g,-3,-15,7,1,COL.rust); N(g,-2,-14,5,1,COL.rust); }
  if(variant===2){ N(g,-3,-16,2,2,COL.moss); N(g,2,-13,2,2,COL.moss); N(g,2,-21,1,2,COL.dark); }
  N(g,-2,-18,5,4,COL.bone); N(g,-2,-14,4,1,COL.boned);
  N(g,0,-17,1,1,eyeC); N(g,2,-17,1,1,eyeC);
}
function batBody(g,tt){
  var up=Math.floor(tt*10)%2===0;
  N(g,-2,-1,4,3,COL.batbody);
  N(g,-1,-1,1,1,COL.redeye); N(g,1,-1,1,1,COL.redeye);
  if(up){N(g,-6,-3,4,2,COL.wing); N(g,2,-3,4,2,COL.wing);}
  else {N(g,-6,0,4,2,COL.wing); N(g,2,0,4,2,COL.wing);}
}
function drawNecroAt(g,sx,sy,face,tt,walking,castAmt,aura){
  g.save(); g.translate(sx,sy-Math.round((aura||0)*2)); g.scale(3*face,3);
  necroBody(g,tt,walking,castAmt,aura||0); g.restore(); }
function drawSwordGhost(g,x,y){
  g.save(); g.translate(x,y);
  g.globalAlpha=0.28; g.fillStyle='#5cc8ff'; g.fillRect(-5,-26,10,52);
  g.globalAlpha=0.85;
  g.fillStyle='#bfe8ff'; g.fillRect(-2,-24,4,42);
  g.fillStyle='#7fd4ff'; g.fillRect(-2,-24,1,42);
  g.fillStyle='#e8f6ff'; g.fillRect(0,-24,1,40);
  g.fillStyle='#5cc8ff'; g.fillRect(-6,16,12,3);
  g.fillStyle='#bfe8ff'; g.fillRect(-1,19,2,6);
  g.globalAlpha=1; g.restore();
}
function drawBeam(g,p){
  if(!p.beam)return;
  var bm=p.beam;
  var k=bm.t<0.45?1:Math.max(0,1-(bm.t-0.45)/0.5);
  if(k<=0)return;
  var dir=bm.dir, y=bm.y;
  var x0=p.x+dir*24;
  var x1=dir>0?camX+VW+80:camX-80;
  var len=x1-x0;
  var layers=[[26,'#1c0a2a',0.55],[14,'#7446ab',0.8],[6,'#e8f6ff',0.95]];
  for(var s=0;s<3;s++){
    var hgt=layers[s][0]*k;
    g.globalAlpha=layers[s][2];
    g.fillStyle=layers[s][1];
    var stepsN=26;
    var seg=Math.abs(len)/stepsN;
    for(var i2=0;i2<=stepsN;i2++){
      var xx=x0+len*(i2/stepsN);
      var wob=Math.sin(i2*1.7+tGlobal*40)*(hgt*0.25)+(hashN(i2+Math.floor(tGlobal*30))*2-1)*(hgt*0.2);
      g.fillRect(xx-seg/2-1,y-hgt/2+wob,seg+2,hgt);
    }
  }
  g.globalAlpha=0.22*k; g.fillStyle='#b18cff';
  g.beginPath(); g.ellipse((x0+x1)/2,y,Math.abs(len)/2,30*k,0,0,6.283); g.fill();
  g.globalAlpha=1;
}
function shadow(g,x,y,w){ g.fillStyle='rgba(0,0,0,0.35)';
  g.beginPath(); g.ellipse(x,y+2,w,4,0,0,6.283); g.fill(); }

function txt(g,str,x,y,size,color,align){
  g.font=size+'px "Press Start 2P", monospace'; g.textAlign=align||'left'; g.textBaseline='top';
  g.fillStyle=color; g.fillText(str,x,y); }
function txtShadow(g,str,x,y,size,color,align){
  txt(g,str,x+2,y+2,size,'#0a0512',align); txt(g,str,x,y,size,color,align); }

