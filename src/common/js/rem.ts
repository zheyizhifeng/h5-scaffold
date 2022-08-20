"use strict";
(function (win) {
  let h;
  let docEl = document.documentElement;
  function setUnitA() {
    let w = docEl.getBoundingClientRect().width;
    let r = 20;
    win.rem = w / r;
    docEl.style.fontSize = win.rem + "px";
  }
  win.addEventListener(
    "resize",
    function () {
      clearTimeout(h);
      h = setTimeout(setUnitA, 300);
    },
    false
  );
  win.addEventListener(
    "pageshow",
    function (e) {
      if (e.persisted) {
        clearTimeout(h);
        h = setTimeout(setUnitA, 300);
      }
    },
    false
  );
  setUnitA();
})(window);
