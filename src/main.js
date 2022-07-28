import "@js/rem";
import { getUrlParam } from "@js/utils";
import "@plugins/intersection.js"; // 曝光插件
import "@plugins/sentry.js"; // sentry插件
import "@scss/common.scss";
import "normalize.css/normalize.css";
import { log } from "shareit-hybird-js-sdk";
import Vue from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./routers";
import store from "./stores";

Vue.prototype.$hybirdPortal = ""; //! Hybrid SDK 接口的portal参数, 自行设置
Vue.prototype.$portal = getUrlParam("portal"); //! 埋点的portal参数, 从url中获取
Vue.prototype.$log = log;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
