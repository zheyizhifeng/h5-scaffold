import { log, version } from "shareit-hybird-js-sdk";
import store from "@/store";
import { getUrlParam } from "@/common/js/utils";
const portal = getUrlParam("portal");
console.log("portal :>> ", portal);

console.log("Hybird Version :>> ", version);
// 通用的埋点方法，会添加公共的extras参数
const stLog = function (args) {
  const logData = args.params;
  if (!logData.extras || typeof logData.extras === "object") {
    // extras添加公共参数
    const globalExtras = store.getters.commonExtras;
    logData.extras = logData.extras
      ? {
          ...logData.extras,
          ...globalExtras,
        }
      : globalExtras;
  }
  const pvePre = store.state.pvePre;
  // console.log("logData :>> ", logData);
  log({
    params: {
      ...logData,
      portal: portal,
      pve_pre: pvePre,
    },
  });
};

export { stLog, portal };
