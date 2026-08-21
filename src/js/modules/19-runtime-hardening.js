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
  var script=document.createElement('script');
  script.src='js/modules/20-engine-stability.js';
  script.onload=function(){
    if(window.__ANGELIC_BLACK_ENGINE__)runtime.ready=true;
    else runtime.reportFatal(new Error('Engine stability supervisor failed to initialize.'));
  };
  script.onerror=function(){runtime.reportFatal(new Error('Failed to load engine stability supervisor.'));};
  document.body.appendChild(script);
})();
