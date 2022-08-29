import LoginTemplate from "./loginPanel.vue";
import { deviceInfo } from "shareit-hybird-js-sdk";
import i18n from "@/i18n";
import { stLog, portal } from "@/plugins/stLog";
let appVersion = 9999999;
let instance = null;
try {
  const deviceInfoData = deviceInfo() || {};
  if (deviceInfoData && deviceInfoData.app_ver) {
    appVersion = deviceInfoData.app_ver;
  }
} catch (e) {
  console.log(e);
}

/**
 *
 * @param {String} callbackName 登录回调函数名
 * @param {String} loginType 直接登录，不吊起面板（facebook/google/phone）
 * @param {String} pveCur 直接登录上报的登录结果埋点pve_cur
 * @param {String} hybirdPortal 调用客户端接口传入的portal,会统计在客户端埋点
 */
const callLogin = (
  callbackName,
  loginType = "",
  pveCur = "",
  hybirdPortal = "web"
) => {
  console.log("loginType :>> ", loginType);
  try {
    window.__HandleLoginCallback__ = (res) => {
      let result = {};
      try {
        result = JSON.parse(res);
      } catch (e) {
        console.log("e :>> ", e);
      }
      console.log("🤡 调用登陆结果 :>> ", result);
      const resCode = result.responseCode || "";
      // h5上报登陆结果埋点
      if (loginType && pveCur) {
        stLog({
          params: {
            eventId: "login_result",
            pve_cur: pveCur,
            extras: {
              result: resCode === "0" ? "success" : `failed_${resCode}`,
            },
          },
        });
      }
      // 如果使用了h5登录面板，登陆成功关闭
      if (resCode === "0" && instance) {
        instance.vm.closePanel();
      }
      // 调用传入的业务回调
      if (window[callbackName] && typeof window[callbackName] === "function") {
        window[callbackName](result);
      } else {
        console.warn(`login callback [${callbackName}] is not find!`);
      }
    };
    const params = {
      login_type: loginType,
    };
    window.shareitBridge.asyncInvoke(
      hybirdPortal,
      "entryLogin",
      "__HandleLoginCallback__",
      JSON.stringify(params)
    );
  } catch (e) {
    console.log("😢 call entryLogin failed! :>> ", e);
  }
};

const LoginPlugin = {
  /**
   * userConfig
   * @param {String} hybirdPortal 调用客户端接口传入的portal,会统计在客户端埋点
   * @param {String} portal h5面板埋点上报的页面来源
   * @param {String} callbackName 登录结果回调函数名
   * @param {Boolean} useH5Login 是否使用h5登录面板
   * @param {String} h5LoginVersion 使用h5登录的最低版本（不包含h5LoginVersion，默认>4060262）
   * @param {Array} supportLoginType h5登录面板支持的登录方式["facebook", "google", "phone"]
   * @param {String} title h5登录面板title （暂未使用）
   * @param {String} desc h5登录面板描述 （暂未使用）
   * @param {String} pve_cur h5登录面板上报埋点pve_cur（eg: 传入 task =>> 上报 task/login/x）
   */
  install(Vue, options = {}) {
    // console.log("options :>> ", options);
    if (Object.prototype.toString.call(options) !== "[object Object]") {
      console.log("😱 [options] must be a Object!");
      return;
    }

    const LoginConstructor = Vue.extend(LoginTemplate);

    // 默认配置
    const defaultConfig = {
      useH5Login: true, // 是否使用h5登陆面板
      h5LoginVersion: 4060262, // 使用h5登录面板的版本号
      portal: portal,
      supportLoginType: ["facebook", "google", "phone"], // h5登录展示的按钮
    };
    // 合并注册插件时传入配置
    const config = {
      ...defaultConfig,
      ...options,
    };
    // console.log("config :>> ", config);
    // 吊起登录方法
    const entryLoginFn = (userConfig = {}) => {
      // console.log("userConfig :>> ", userConfig);
      if (Object.prototype.toString.call(userConfig) !== "[object Object]") {
        console.log("😱 param [userConfig] must be a Object!");
        return;
      } else if (!userConfig.callbackName) {
        console.log("😱 [callbackName] param is needed in userConfig!");
        return;
      } else if (
        typeof userConfig.callbackName !== "string" ||
        typeof window[userConfig.callbackName] !== "function"
      ) {
        console.log("😱 [callbackName] param is must be a function in window!");
        return;
      }

      const loginConfig = {
        ...config,
        loginCoins: i18n.t("login.loginCoins"), // h5面板展示的金币数
        loginCoinsTip: i18n.t("login.higgest"), // h5面板展示的金币数右上角浮标
        loginTitle: i18n.t("login.loginTitle"), // h5面板展示的title
        ...userConfig,
      };

      // 是否使用h5登录面板
      const supportH5Login =
        loginConfig.useH5Login && appVersion > loginConfig.h5LoginVersion;
      if (supportH5Login) {
        console.log("吊起h5登录面板");
        loginConfig.onClose = function () {
          instance = null;
        };
        instance = new LoginConstructor({
          data: loginConfig,
        });
        instance.vm = instance.$mount();
        instance.dom = instance.vm.$el;
        document.body.appendChild(instance.dom);
        instance.vm.visible = true;
        return instance.vm;
      } else {
        console.log("吊起客户端登录");
        callLogin(
          loginConfig.callbackName,
          "",
          "",
          loginConfig.hybirdPortal || "web"
        );
      }
    };

    // 通过$entryLogin直接调用hybird登录
    entryLoginFn.callLogin = callLogin;
    // 关闭h5登录弹窗
    entryLoginFn.closeH5Login = function () {
      if (instance) {
        instance.vm.closePanel();
      }
    };
    // 检查h5登录弹窗是否开启
    entryLoginFn.isH5LoginShow = function () {
      return instance;
    };
    // 注册吊起登录方法
    Vue.prototype.$entryLogin = entryLoginFn;
  },
};

export default LoginPlugin;
