// 获取url参数
const getUrlParam = (name: string) => {
  const match = location.hash.match(/#[^?]+(\?.+)/);
  const u = window.location.search || (match && match[1]) || "",
    reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
    r = u.substr(u.indexOf("?") + 1).match(reg);
  return r != null ? r[2] : "";
};

// 13位时间戳格式转化为 yyyy/m/dd h:m Am
const getDateTime = (timeStamp: string | number | Date) => {
  const date = new Date(timeStamp),
    y = date.getFullYear();
  let minute = date.getMinutes(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours();
  let mS = m < 10 ? "0" + m : m;
  let dS = d < 10 ? "0" + d : d;
  let minuteS = minute < 10 ? "0" + minute : minute;
  const unit = h < 12 ? "AM" : "PM";
  h = h < 12 ? h : h - 12;
  return y + "-" + mS + "-" + dS + " " + h + ":" + minuteS + " " + unit;
};

// 动态插入script
const dynamicLoadJs = (url: string) => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject();
    };
    script.src = url;
    document.body.appendChild(script);
  });
};

// 获取UUID
const getUUID = () => {
  return +new Date() + Math.random().toString(16).replace(".", "");
};

/** 防抖函数
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
function debounce(func: Function, wait: number, immediate: boolean) {
  let timeout: NodeJS.Timeout | null, args: any[] | null, context: any, timestamp: number, result: any;
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function (this: any, ...args: any) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
}

// 节流函数 每隔time执行一次函数
const throttle = function (this: any, fun: Function, time = 100) {
  let base = 0;
  return (...args: any) => {
    const now = +new Date();
    if (now - base > time) {
      base = now;
      fun.apply(this, args);
    }
  };
};

/**
 * 获取客户端云控项（online）
 * @param {*} cloudKey
 * @returns
 */
const getCloudConfig = (cloudKey: any) => {
  let _a;
  try {
    const configDataJson =
      (_a = window === null || window === void 0 ? void 0 : window.shareitBridge) === null || _a === void 0
        ? void 0
        : _a.syncInvoke(
            "web-likeitlite",
            "getCloudConfig",
            JSON.stringify({
              cloudKey: cloudKey,
            })
          );
    const res = JSON.parse(configDataJson || "{}");
    if (res && res.responseCode === "0") {
      return res.value;
    } else {
      return null;
    }
  } catch (err) {
    console.error("getCloudConfig Err:", err);
    return null;
  }
};

/**
 * 外部浏览器打开链接
 * @param {*} url 网页链接
 */
const openInBrowser = (url: any) => {
  let _a;
  try {
    (_a = window === null || window === void 0 ? void 0 : window.shareitBridge) === null || _a === void 0
      ? void 0
      : _a.asyncInvoke(
          "likeitlite-task-upgrade",
          "executeAppEvent",
          "",
          JSON.stringify({
            id: "likeitlite-task-upgrade",
            feedAction: "6",
            param: url,
          })
        );
  } catch (err) {
    console.error(err);
  }
};

// 获取客户端所在的国家
function getClientCountry() {
  let _a;
  const locationString =
    (_a = window === null || window === void 0 ? void 0 : window.shareitBridge) === null || _a === void 0
      ? void 0
      : _a.syncInvoke("PayPhoneFare", "getLocationInfo", "");
  const info = JSON.parse(locationString || "{}");
  return (info === null || info === void 0 ? void 0 : info.lCountryCode) || "";
}

// 获取浏览器或Webview的语言
function getWebviewLocale() {
  const language =
    navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
  return (language === null || language === void 0 ? void 0 : language.toLowerCase()) || "";
}
export {
  getUrlParam,
  getDateTime,
  dynamicLoadJs,
  getUUID,
  debounce,
  throttle,
  getCloudConfig,
  openInBrowser,
  getClientCountry,
  getWebviewLocale,
};
