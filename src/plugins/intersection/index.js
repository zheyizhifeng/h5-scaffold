import Vue from "vue";
// import vueIntersectionPlugin from "vue-intersection-plugin-revision";
import vueIntersectionPlugin from "./intersectionObserver.js";
// import { log } from "shareit-hybird-js-sdk";
// import { stLog } from "../stLog";

Vue.use(vueIntersectionPlugin, {
  handler: (logData) => {
    console.log("===曝光===", logData.params.pve_cur);
    // stLog(logData);
  },
});
