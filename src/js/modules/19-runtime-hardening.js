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
  runtime.ready=true;
})();
