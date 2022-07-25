import Loading from "@/components/common/Loading.vue";
import Toast from "@/components/common/Toast/index.js";
import "@/plugins/intersection.js"; // 曝光插件
import "normalize.css/normalize.css";
import { close, deviceInfo, log } from "shareit-hybird-js-sdk";
import Vue from "vue";
import PullTo from "vue-pull-to";
import App from "./App.vue";
import * as filters from "./common/js/filter";
import "./common/js/rem";
import { getClientCountry, getUrlParam, getWebviewLocale, throttle } from "./common/js/utils";
import i18n from "./i18n";
import router from "./routes";
import store from "./stores";
Vue.component("MyLoading", Loading);
Vue.component("pull-to", PullTo);
const hybirdPortal = "mvp-fiction";
Vue.prototype.$hybirdPortal = hybirdPortal;
const device = deviceInfo();
Vue.prototype.isNativeNovelTab = device?.app_ver > 4062050;
Vue.prototype.handleBack = function () {
  // ! deeplink 链接, 方案不可行
  // location.href =
  //   "shareits://router/60?page_url=/home/activity/main&portal_from=h5_novel_detail&main_tab_name=m_trending&sub_tab=novel";
  const quit_page = getUrlParam("quit_page");
  if (quit_page === "1") {
    close({ portal: hybirdPortal });
  } else {
    // * 命令式跳转, 方案可行
    let json = {
      feedAction: "60",
      param: JSON.stringify({
        page_url: "/home/activity/main",
        PortalType: "novel_detail",
        main_tab_name: "m_trending",
        sub_tab: "novel",
        portal: "novel_detail",
      }),
    };
    window?.shareitBridge?.asyncInvoke(hybirdPortal, "executeAppEvent", "", JSON.stringify(json));
  }
};
let json = {
  visible: false,
};
window?.shareitBridge?.syncInvoke("banQiu", "setTitleBarVisible", JSON.stringify(json));
String.prototype.startsWith = function (str) {
  return this.indexOf(str) === 0;
};
Vue.prototype.$toast = Toast;

Vue.prototype.$stLog = ({ params = {} }) => {
  log({
    params: {
      ...params,
      type: "0",
    },
  });
};
Vue.prototype.$portal = getUrlParam("portal");
Vue.prototype.item_id = getUrlParam("item_id");
Vue.prototype.$throttle = throttle;
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
const country = getClientCountry();
Vue.prototype.country = country;
if (["ID", "PH", "MX"].includes(country)) {
  Vue.prototype.books = require(`./views/${country}_book.json`);
} else {
  Vue.prototype.books = [];
}

Vue.prototype.getClientCountry = getClientCountry;
Vue.prototype.getWebviewLocale = getWebviewLocale;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
