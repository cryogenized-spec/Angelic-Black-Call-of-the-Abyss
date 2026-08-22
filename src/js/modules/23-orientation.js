/* ================= LANDSCAPE ORIENTATION ================= */
(function(root){
  var gate=null;
  var attempted=false;

  function ensureHead(){
    if(!document.querySelector('link[rel="manifest"]')){
      var manifest=document.createElement('link');
      manifest.rel='manifest';
      manifest.href='../manifest.json';
      document.head.appendChild(manifest);
    }
    if(!document.querySelector('link[data-ab-orientation-css]')){
      var css=document.createElement('link');
      css.rel='stylesheet';
      css.href='css/orientation.css';
      css.setAttribute('data-ab-orientation-css','1');
      document.head.appendChild(css);
    }
  }

  function ensureGate(){
    ensureHead();
    if(gate)return;
    gate=document.createElement('div');
    gate.id='orientationGate';
    gate.innerHTML='<div class="og-panel"><h2>LANDSCAPE REQUIRED</h2><p>Angelic Black is designed for a horizontal display.</p><p>Rotate your device sideways to enter the Quiet Court.</p><p class="og-sub">If your browser allows orientation locking, the game will request it automatically.</p></div>';
    document.body.appendChild(gate);
  }

  function isPortrait(){
    return root.matchMedia&&root.matchMedia('(orientation: portrait)').matches;
  }

  function showGate(){
    ensureGate();
    if(gate)gate.classList.toggle('show',isPortrait());
  }

  function requestLandscape(){
    if(attempted)return;
    attempted=true;
    var lock=root.screen&&root.screen.orientation&&root.screen.orientation.lock;
    var fullscreen=document.documentElement&&document.documentElement.requestFullscreen;

    function lockNow(){
      if(lock){
        try{
          var result=root.screen.orientation.lock('landscape');
          if(result&&typeof result.catch==='function')result.catch(function(){});
        }catch(e){}
      }
      showGate();
      setTimeout(showGate,350);
    }

    if(fullscreen&&!document.fullscreenElement){
      try{
        var p=fullscreen.call(document.documentElement);
        if(p&&typeof p.then==='function')p.then(lockNow).catch(lockNow);
        else lockNow();
      }catch(e){lockNow();}
    }else{
      lockNow();
    }
  }

  root.__ANGELIC_BLACK_ORIENTATION__={requestLandscape:requestLandscape,refresh:showGate};
  ensureHead();
  document.addEventListener('pointerdown',requestLandscape,{once:true,capture:true});
  root.addEventListener('orientationchange',showGate);
  root.addEventListener('resize',showGate);
  setTimeout(showGate,500);
})(window);
