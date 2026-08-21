/* ================= INPUT ROUTER ================= */
var keys={};
var touch={left:false,right:false,jump:false};
var overT=0, gameFade=0;
window.addEventListener('pointerdown',function(){
  unlockAudio();
  if(mode==='boot'){
    if(boot.state==='waiting')beginTransition();
    else if(boot.state==='awakening')boot.awT=99;
    return;
  }
  if(mode==='comic'){ comicNext(); return; }
  if(mode==='cutscene'){ csTap(); return; }
});
window.addEventListener('keydown',function(e){
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].indexOf(e.code)>=0)e.preventDefault();
  keys[e.code]=true; unlockAudio();
  if(e.code==='Enter'||e.code==='Space'){ advanceFlow(); if(e.code==='Space')return; }
  if(e.code==='KeyX'&&!e.repeat){ boltDown(); }
  if(e.code==='KeyC'&&!e.repeat){ castSpellById('rite'); }
  if(e.code==='KeyZ'&&!e.repeat){ castSpellById('lance'); }
  if(e.code==='KeyV'&&!e.repeat){ castSpellById('gravefall'); }
  if(e.code==='KeyB'&&!e.repeat){ castSpellById('mantle'); }
});
window.addEventListener('keyup',function(e){ keys[e.code]=false; if(e.code==='KeyX')boltUp(); });
function advanceFlow(){
  if(mode==='boot'){
    if(boot.state==='waiting')beginTransition();
    else if(boot.state==='awakening')boot.awT=99;
  }
  else if(mode==='comic'){ comicNext(); }
  else if(mode==='cutscene'){ csTap(); }
}
var pbtnsL=document.querySelectorAll('#padLeft .pbtn');
for(var tb=0; tb<pbtnsL.length; tb++){
  (function(btn){
    var kk=btn.getAttribute('data-k');
    function onEv(ev){ev.preventDefault();ev.stopPropagation(); touch[kk]=true; unlockAudio();}
    function offEv(ev){ev.preventDefault(); touch[kk]=false;}
    btn.addEventListener('pointerdown',onEv); btn.addEventListener('pointerup',offEv);
    btn.addEventListener('pointerleave',offEv); btn.addEventListener('pointercancel',offEv);
  })(pbtnsL[tb]);
}
function readInput(){ return {
  left:keys.ArrowLeft||keys.KeyA||touch.left, right:keys.ArrowRight||keys.KeyD||touch.right,
  jump:keys.ArrowUp||keys.KeyW||keys.Space||touch.jump };}

