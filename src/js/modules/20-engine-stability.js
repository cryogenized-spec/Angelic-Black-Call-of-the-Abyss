/* ================= ENGINE STABILITY ================= */
(function(root){
  var runtime=root.__ANGELIC_BLACK_RUNTIME__;
  if(!runtime)return;
  var stability={version:'pass-3',frames:0,lastFrameMs:0,maxFrameMs:0,droppedFrames:0,validationFailures:0,hiddenSince:0,lastValidation:0,frameStart:0,expectedFrameMs:1000/60,debug:(new URLSearchParams(root.location.search)).get('debug')==='1',panel:null};
  function finite(v){return typeof v==='number'&&isFinite(v);}
  function validateArray(name,value){
    if(!Array.isArray(value))throw new Error('Runtime state '+name+' is not an array.');
    for(var i=0;i<value.length;i++){
      var item=value[i]; if(!item||typeof item!=='object')continue;
      if(('x' in item)&&!finite(item.x))throw new Error('Runtime state '+name+'['+i+'].x became invalid.');
      if(('y' in item)&&!finite(item.y))throw new Error('Runtime state '+name+'['+i+'].y became invalid.');
      if(('hp' in item)&&!finite(item.hp))throw new Error('Runtime state '+name+'['+i+'].hp became invalid.');
    }
  }
  function validateGameState(){
    try{
      if(typeof player!=='undefined'&&player){
        var fields=['x','y','vx','vy','hp','maxHp','mana','maxMana','level','xp'];
        for(var i=0;i<fields.length;i++)if(!finite(player[fields[i]]))throw new Error('Player '+fields[i]+' became invalid.');
      }
      var arrays=['foes','minions','bolts','ebolts','arrows','parts','floaters','rings','swordRain','pickups','debris'];
      for(var j=0;j<arrays.length;j++)if(typeof root[arrays[j]]!=='undefined')validateArray(arrays[j],root[arrays[j]]);
      return true;
    }catch(err){stability.validationFailures++;runtime.reportFatal(err);return false;}
  }
  function updatePanel(){
    if(!stability.debug||!stability.panel)return;
    var count=0,names=['foes','minions','bolts','ebolts','arrows','parts','floaters','rings','swordRain','pickups','debris'];
    for(var i=0;i<names.length;i++)if(Array.isArray(root[names[i]]))count+=root[names[i]].length;
    stability.panel.textContent='AB ENGINE 3.0 | '+stability.lastFrameMs.toFixed(1)+'ms | max '+stability.maxFrameMs.toFixed(1)+'ms | entities '+count+' | dropped '+stability.droppedFrames+' | validation '+stability.validationFailures;
  }
  stability.beginFrame=function(){stability.frameStart=performance.now();};
  stability.endFrame=function(){
    var ms=performance.now()-stability.frameStart;
    stability.lastFrameMs=ms;if(ms>stability.maxFrameMs)stability.maxFrameMs=ms;
    if(ms>stability.expectedFrameMs*2.5)stability.droppedFrames++;stability.frames++;
    if(stability.frames%30===0)updatePanel();
    if(performance.now()-stability.lastValidation>1000){stability.lastValidation=performance.now();validateGameState();}
  };
  stability.handleVisibility=function(){
    if(document.hidden){stability.hiddenSince=performance.now();return;}
    if(stability.hiddenSince){stability.hiddenSince=0;if(typeof root.lastT==='number')root.lastT=performance.now();if(typeof root.flashT==='number')root.flashT=0;if(typeof root.hitstopT==='number')root.hitstopT=0;}
  };
  if(stability.debug){
    stability.panel=document.createElement('div');
    stability.panel.style.cssText='position:fixed;left:6px;bottom:6px;z-index:100000;padding:5px 7px;background:rgba(5,2,10,.88);color:#d8a94e;border:1px solid #7446ab;font:10px/1.3 monospace;pointer-events:none;white-space:nowrap';
    stability.panel.textContent='AB ENGINE 3.0';document.body.appendChild(stability.panel);
  }
  document.addEventListener('visibilitychange',stability.handleVisibility);
  root.__ANGELIC_BLACK_ENGINE__=stability;
})(window);
