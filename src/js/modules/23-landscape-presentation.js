/* ================= LANDSCAPE PRESENTATION ================= */
(function(){
  'use strict';

  /* Presentation-only styling. The simulation canvas remains the 960×540 logical viewport. */
  var style=document.createElement('style');
  style.id='ab-landscape-presentation';
  style.textContent=[
    '@media (orientation:landscape){',
      'body{padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px);box-sizing:border-box}',
      '#stage{width:min(100vw,calc(100vh * 16 / 9));height:min(100vh,calc(100vw * 9 / 16));}',
      '#coverArt{background-position:50% 45%}',
      '#coverShade{background:linear-gradient(to top,rgba(4,2,9,.96) 0%,rgba(4,2,9,.55) 22%,transparent 52%)}',
      '#comicOverlay{padding:0}',
      '#comicImg{width:100%;height:100%;object-fit:cover;image-rendering:auto}',
      '.cap{left:6%;right:6%;padding:1.6cqw 2.4cqw;font-size:3cqw}',
      '.cap.top{top:3%}.cap.bottom{bottom:3%}',
      'body.touch.inplay #padLeft{left:16px;bottom:calc(14px + env(safe-area-inset-bottom,0px));gap:10px}',
      'body.touch.inplay #padRight{right:16px;bottom:calc(14px + env(safe-area-inset-bottom,0px));grid-template-columns:repeat(2,60px);gap:10px}',
      '.pbtn{width:60px;height:60px;font-size:15px}',
      '.pbtn .sico{font-size:17px}.pbtn .cost{font-size:7px;bottom:4px;right:7px}',
      '#invBtn,#assignBtn{top:12px;width:38px;height:38px}',
      '#invBtn{right:12px}#assignBtn{right:58px}',
      '.pnl{width:78%;max-height:88%;padding:2.2cqw}',
    '}',
    '@media (orientation:landscape) and (max-height:560px){',
      '#coverTitle{bottom:4%;gap:.8cqw}',
      '#coverLore{bottom:30%;font-size:2.8cqw}',
      '#bootText,#tapHint{bottom:22%;font-size:2.2cqw}',
      '.pnl h2{font-size:4.2cqw;margin-bottom:1cqw}',
    '}',
    '@media (orientation:portrait){',
      '/* The installed PWA prefers landscape; keep a clear visual signal if a browser ignores it. */',
      'body::before{content:"ROTATE TO LANDSCAPE";position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#05030a;color:#b18cff;font:600 16px/1.4 Georgia,serif;letter-spacing:.16em;text-align:center;padding:24px}',
      '#stage{display:none!important}',
    '}'
  ].join('');
  document.head.appendChild(style);

  /* Landscape look-ahead: bias the camera toward the player's facing direction so the Queen
     occupies roughly the near-left/near-right third instead of sitting dead centre. */
  var originalUpdate=window.update;
  if(typeof originalUpdate==='function'){
    window.update=function(dt){
      originalUpdate(dt);
      if(!window.player)return;
      var face=window.player.face||1;
      var focus=face>0?VW*0.40:VW*0.60;
      var desired=clamp(window.player.x-focus,0,WORLD_W-VW);
      window.camX += (desired-window.camX)*Math.min(1,dt*7);
    };
  }

  window.__ANGELIC_BLACK_LANDSCAPE__={
    version:'1',
    viewport:{width:VW,height:VH,aspect:'16:9'},
    ready:true
  };
})();
