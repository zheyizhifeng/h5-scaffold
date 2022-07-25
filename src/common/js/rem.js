(function (win) {
  let h;
  let docEl = document.documentElement;
  function setUnitA() {
    let w = docEl.getBoundingClientRect().width;
    let r = 20;
    // const device = deviceInfo();
    // if (device?.os_ver <= 19) {
    //   win.rem = 36;
    // } else {
    win.rem = w / r;
    // }
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
