/* ================= COMIC ================= */
var comicOverlay=document.getElementById('comicOverlay');
var comicImg=document.getElementById('comicImg');
var capTop=document.getElementById('capTop');
var capBot=document.getElementById('capBot');
var comicIdx=0, comicBusy=false, comicAuto=null;
function setComicPage(i){
  comicImg.src=COMIC_PAGES[i];
  var c=COMIC_CAPTIONS[i];
  capTop.innerHTML=c.top||''; capTop.style.display=c.top?'block':'none';
  capBot.innerHTML=c.bottom||''; capBot.style.display=c.bottom?'block':'none';
}
function startComic(){ mode='comic'; comicIdx=0; comicBusy=false;
  setComicPage(0); comicOverlay.hidden=false;
  requestAnimationFrame(function(){comicOverlay.classList.add('show');});
  scheduleComicAuto(); }
function scheduleComicAuto(){
  if(comicAuto)clearTimeout(comicAuto);
  if(comicIdx===COMIC_PAGES.length-1){
    comicAuto=setTimeout(function(){ comicNext(); },4500);
  }
}
function comicNext(){
  if(comicBusy)return; comicBusy=true;
  if(comicAuto)clearTimeout(comicAuto);
  sfx.tap();
  comicOverlay.classList.remove('show');
  setTimeout(function(){
    comicIdx++;
    if(comicIdx<COMIC_PAGES.length){
      setComicPage(comicIdx);
      comicOverlay.classList.add('show');
      comicBusy=false;
      scheduleComicAuto();
    } else {
      comicOverlay.hidden=true; comicBusy=false;
      startRun();
    }
  },420);
}

