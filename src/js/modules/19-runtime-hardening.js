/* ================= RUNTIME HARDENING ================= */
(function(){
  var runtime=window.__ANGELIC_BLACK_RUNTIME__;
  if(!runtime)return;
  var required=['stage','gameCanvas','grain','coverScreen','comicOverlay','choiceOverlay','invOverlay','vendorOverlay','tutOverlay','assignOverlay'];
  for(var i=0;i<required.length;i++){
    if(!document.getElementById(required[i])){
      runtime.reportFatal(new Error('Missing required DOM element: #'+required[i]));
      return;
    }
  }

  function load(src,onload,onerror){
    var script=document.createElement('script');
    script.src=src;
    script.onload=onload;
    script.onerror=onerror;
    document.body.appendChild(script);
  }
  function fail(message){runtime.reportFatal(new Error(message));}

  load('js/modules/20-engine-stability.js',function(){
    if(!window.__ANGELIC_BLACK_ENGINE__){fail('Engine stability supervisor failed to initialize.');return;}
    load('js/modules/21-gameplay-integrity.js',function(){
      load('js/modules/22-art-integration.js',function(){
        runtime.ready=true;
      },function(){fail('Failed to load cinematic art integration module.');});
    },function(){fail('Failed to load gameplay integrity module.');});
  },function(){fail('Failed to load engine stability supervisor.');});
})();
