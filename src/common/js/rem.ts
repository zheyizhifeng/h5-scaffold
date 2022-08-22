"use strict";
(function (win) {
  let h: string | number | NodeJS.Timeout | undefined;
  const docEl = document.documentElement;
  function setUnitA() {
    const w = docEl.getBoundingClientRect().width;
    const r = 20;
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
