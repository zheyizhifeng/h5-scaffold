import Vue from "vue";
import App from "./App.vue";
import "normalize.css/normalize.css";
import "@/common/scss/common.scss";
import "@/common/scss/sprite.scss";
import Toast from "@/components/common/Toast/index.js";
import Loading from "@/components/common/Loading.vue";
import { stLog, portal } from "@/plugins/stLog.js";
import { HYBIRD_PORTAL } from "./config";

// 【 Use Vue-Router 】
// import router from "./router";

// 【 Use Sentry 】
// import "@/plugins/sentry.js";

// 【 Use Intersection 】
// import "@/plugins/intersection/index.js"; // 曝光插件

// 【 Use Vuex 】
// import store from "./store";

// 【 Use i18n 】
import i18n from "./i18n";

// 【 注册物理返回 】
// import "@/plugins/injectBack.js";

// 【 注册吊起登录插件 】
// import LoginPlugin from "@/plugins/login/index.js";

// 【 注册filter 】
// import * as filters from "./common/js/filter";
// Object.keys(filters).forEach((key) => {
//   Vue.filter(key, filters[key]);
// });

// common Loading componetnt
Vue.component("Loading", Loading);

Vue.prototype.$toast = Toast; // 通用Toast
Vue.prototype.$hybirdPortal = HYBIRD_PORTAL; // 传hybird方法中的portal
Vue.prototype.$stLog = stLog;
Vue.prototype.$portal = portal; // 页面来源portal

Vue.config.productionTip = false;

// dev/test/pre环境添加vconsole
if (
  process.env.VUE_APP_ENVIRONMENT === "pre" ||
  process.env.VUE_APP_ENVIRONMENT === "test" ||
  process.env.VUE_APP_ENVIRONMENT === "dev"
) {
  const vconsole = require("vconsole");
  new vconsole();
}

new Vue({
  // router,
  // store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
