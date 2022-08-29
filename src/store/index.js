import Vue from "vue";
import Vuex from "vuex";
import { loginInfo, deviceInfo, locationInfo } from "shareit-hybird-js-sdk";
// import i18n from "@/i18n";
import { portal } from "@/plugins/stLog";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pvePre: portal,
    // 登陆信息
    isLogin: false,
    loginInfo: {},
  },
  getters: {
    // 埋点的extras公共参数
    commonExtras: () => {
      return {
        // login_status: Number(state.isLogin),
      };
    },
  },
  mutations: {
    // 设置pve_pre
    setPvePre(state, data) {
      state.pvePre = data;
    },
    // 获取用户登陆信息
    getLoginInfo(state) {
      const loginData = loginInfo() || {};
      console.log("用户登陆信息 :>> ", loginData);
      state.isLogin = !(loginData.user_type === "visitor");
      state.loginInfo = loginData;

      // 设置sentry上报用户信息
      // try {
      //   const { user_id, user_type } = state.loginInfo;
      //   const { beyla_id, device_model, manufacturer, release_channel } =
      //     state.deviceData;
      //   window.Sentry.setUser({
      //     user_id,
      //     user_type,
      //     beyla_id,
      //     device_model,
      //     manufacturer,
      //     release_channel,
      //     country: state.country,
      //   });
      // } catch (e) {
      //   console.log("e :>> ", e);
      // }
    },
    // 获取设备信息
    getBasicInfo(state) {
      // 保存设备信息
      const deviceInfoData = deviceInfo() || {};
      console.log("用户设备信息 :>> ", deviceInfoData);
      state.appVersion = deviceInfoData.app_ver || 0;
      state.deviceData = deviceInfoData;
      // 保存国家信息
      const locationData = locationInfo() || {};
      console.log("用户位置信息 :>> ", locationData);
      state.country =
        locationData.lCountryCode || locationData.sCountryCode || "";
      // 设置语言
      const lang = state.country.toLowerCase();
      document.documentElement.setAttribute("lang", lang);
      // i18n.loadLanguageAsync(lang); // 设置i18n语言

      // 设置sentry上报用户信息
      // try {
      //   const { app_id, app_ver, os_ver, os_type } = state.deviceData;
      //   window.Sentry.setTags({
      //     app_id,
      //     app_ver,
      //     os_type,
      //     os_ver,
      //   });
      // } catch (e) {
      //   console.log("e :>> ", e);
      // }
    },
  },
  actions: {},
  modules: {},
});
