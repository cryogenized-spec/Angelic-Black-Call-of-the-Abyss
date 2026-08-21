/* ================= TITLE STATE MACHINE ================= */
var coverEl=document.getElementById('coverScreen');
var coverArtEl=document.getElementById('coverArt');
var veilEl=document.getElementById('coverVeil');
var bootTextEl=document.getElementById('bootText');
var tapHintEl=document.getElementById('tapHint');
var coverLoreEl=document.getElementById('coverLore');
var boot={state:'loading',started:performance.now(),cover:false,fonts:false,awT:0};
var loreTimer=null, loreIdx=0;

var probe=new Image();
probe.onload=function(){ boot.cover=true; };
probe.onerror=function(){
  coverArtEl.style.backgroundImage='url('+FALLBACK_ART+')';
  var p2=new Image();
  p2.onload=function(){boot.cover=true;};
  p2.onerror=function(){boot.cover=true;};
  p2.src=FALLBACK_ART;
};
probe.src=POSTER_URL;
if(document.fonts&&document.fonts.load){
  Promise.all([
    document.fonts.load('8px "Press Start 2P"'),
    document.fonts.load('16px "Grenze Gotisch"'),
    document.fonts.load('15px "EB Garamond"'),
    document.fonts.load('16px "UnifrakturMaguntia"'),
    document.fonts.load('16px "Noto Serif JP"')
  ]).then(function(){boot.fonts=true;}).catch(function(){boot.fonts=true;});
}else{ boot.fonts=true; }
for(var prei=0;prei<COMIC_PAGES.length;prei++){ var pre=new Image(); pre.src=COMIC_PAGES[prei]; }
var preAfter=new Image(); preAfter.src=AFTERMATH_IMG;
var preRoad=new Image(); preRoad.src=ROAD_IMG;
var preWitch=new Image(); preWitch.src=WITCH_IMG;
var preNA=new Image(); preNA.src=NAMEA_IMG;
var preNB=new Image(); preNB.src=NAMEB_IMG;
var preMara=new Image(); preMara.src=MARA_IMG;
var preNoble=new Image(); preNoble.src=NOBLE_IMG;
var preRidge=new Image(); preRidge.src=RIDGE_IMG;

function checkBoot(dt){
  var el=performance.now()-boot.started;
  if(boot.state==='loading'){
    if((boot.cover&&boot.fonts)||el>9000){
      boot.state='awakening'; boot.awT=0;
      veilEl.style.opacity=0;
      bootTextEl.textContent='AWAKENING';
      bootTextEl.classList.add('awake');
    }
  } else if(boot.state==='awakening'){
    boot.awT+=dt;
    if(boot.awT>1.6){
      boot.state='waiting';
      bootTextEl.style.display='none';
      tapHintEl.classList.add('show');
      startLoreCycle();
    }
  }
}
function startLoreCycle(){
  if(loreTimer)return;
  coverLoreEl.innerHTML=LORE[0];
  setTimeout(function(){coverLoreEl.style.opacity=1;},100);
  loreTimer=setInterval(function(){
    coverLoreEl.style.opacity=0;
    setTimeout(function(){
      loreIdx=(loreIdx+1)%LORE.length;
      coverLoreEl.innerHTML=LORE[loreIdx];
      coverLoreEl.style.opacity=1;
    },800);
  },7000);
}
function beginTransition(){
  if(boot.state!=='waiting')return;
  boot.state='transitioning';
  tapHintEl.classList.remove('show');
  coverLoreEl.style.opacity=0;
  if(loreTimer){clearInterval(loreTimer);loreTimer=null;}
  coverEl.classList.add('pulse');
  sfx.tap();
  setTimeout(function(){
    coverEl.classList.add('gone');
    setTimeout(function(){coverEl.hidden=true;},950);
    startComic();
  },260);
}
function gotoMenu(){
  overOverlay.hidden=true; finalOverlay.hidden=true;
  coverEl.hidden=false; coverEl.classList.remove('gone');
  veilEl.style.opacity=0;
  boot.state='waiting';
  tapHintEl.classList.add('show');
  mode='boot';
}

