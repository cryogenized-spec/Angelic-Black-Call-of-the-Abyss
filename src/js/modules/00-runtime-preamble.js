'use strict';

(function (root) {
  if (root.__ANGELIC_BLACK_RUNTIME__) return;
  var fatalShown = false;
  var runtime = {
    version: 'pass-2d',
    ready: false,
    assertElement: function (id) {
      var el = document.getElementById(id);
      if (!el) throw new Error('Missing required DOM element: #' + id);
      return el;
    },
    reportFatal: function (error) {
      if (fatalShown) return;
      fatalShown = true;
      try {
        var panel = document.createElement('div');
        panel.id = 'runtimeFatalOverlay';
        panel.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:#05020a;color:#e8e6d4;font:14px/1.5 monospace;text-align:left';
        var box = document.createElement('div');
        box.style.cssText = 'max-width:720px;border:1px solid #7446ab;padding:20px;background:#0b0612';
        var title = document.createElement('div');
        title.textContent = 'ANGELIC BLACK — RUNTIME FAILURE';
        title.style.cssText = 'font-weight:bold;letter-spacing:.08em;margin-bottom:12px;color:#d8a94e';
        var msg = document.createElement('div');
        msg.textContent = error && error.message ? error.message : String(error || 'Unknown error');
        box.appendChild(title); box.appendChild(msg); panel.appendChild(box); document.body.appendChild(panel);
      } catch (fallbackError) { try { console.error(fallbackError); } catch (ignore) {} }
      try { console.error('[Angelic Black] fatal runtime error', error); } catch (ignore2) {}
    }
  };
  root.__ANGELIC_BLACK_RUNTIME__ = runtime;
  window.addEventListener('error', function (event) { if (event && event.error) runtime.reportFatal(event.error); });
  window.addEventListener('unhandledrejection', function (event) { runtime.reportFatal(event && event.reason ? event.reason : new Error('Unhandled promise rejection')); });
})(window);
