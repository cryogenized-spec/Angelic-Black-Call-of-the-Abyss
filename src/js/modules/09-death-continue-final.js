/* ================= DEATH / CONTINUE / FINAL ================= */
var overOverlay=document.getElementById('overOverlay');
var contLine=document.getElementById('contLine');
var finalOverlay=document.getElementById('finalOverlay');
var finalImgB=document.getElementById('finalImgB');
var endPanel=document.getElementById('endPanel');
function openOver(){ mode='over';
  contLine.textContent='CONTINUES: '+continuesLeft;
  overOverlay.hidden=false; }
function revive(){
  var p=player;
  continuesLeft--;
  overOverlay.hidden=true;
  p.alive=true; p.hp=Math.max(40,Math.round(p.maxHp*0.8));
  p.invT=2; p.hurtT=0; p.burnT=0; p.beam=null; p.lanceT=0; boltHeld=false;
  for(var i=0;i<foes.length;i++){ var f=foes[i];
    if(!f.dead&&!f.dying&&Math.abs(f.x-p.x)<170){ f.dead=true; puff(f.x,foeCY(f),10,'#7446ab',140,-40,0.5,3); } }
  mode='playing';
}
document.getElementById('btnContinue').addEventListener('click',revive);
document.getElementById('btnRestart1').addEventListener('click',function(){startRun();});
document.getElementById('btnMenu1').addEventListener('click',gotoMenu);
document.getElementById('btnRestart2').addEventListener('click',function(){startRun();});
document.getElementById('btnMenu2').addEventListener('click',gotoMenu);
function startFinal(){
  mode='finalfall';
  finalOverlay.hidden=false;
  finalImgB.style.opacity=0;
  finalOverlay.classList.remove('dark');
  endPanel.style.display='none';
  setTimeout(function(){ finalImgB.style.opacity=1; sfx.boom(); },2200);
  setTimeout(function(){ finalOverlay.classList.add('dark'); },3600);
  setTimeout(function(){ endPanel.style.display='flex'; mode='finalend'; },4500);
}

