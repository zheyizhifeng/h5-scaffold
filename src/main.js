import "@js/rem";
import { getUrlParam } from "@js/utils";
import "normalize.css/normalize.css";
import Vue from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./routers";
import store from "./stores";
import { log } from "shareit-hybird-js-sdk";

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
