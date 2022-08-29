import axios from "axios";
import { networkStatus } from "shareit-hybird-js-sdk";
import Toast from "@/components/common/Toast/index.js";
import i18n from "@/i18n";
import getCommonParams from "./commonParams";
// 创建axios实例
const service = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.VUE_APP_API_URL
      : "/api",
});

/**
 * @name clientConfig
 * @description 请求自定义配置项
 * @param {Boolean} hideNetCheck - 是否关闭请求前网络状态检查
 * @param {String} noNetworkTip - 网络状态检查无网络时提示文案
 */
// request拦截器
service.interceptors.request.use(
  (config) => {
    console.log("request config :>> ", config);
    const { clientConfig = {} } = config;
    // 处理第二个接口域名
    // if (clientConfig.otherApi) {
    //   config.baseURL =
    //     process.env.NODE_ENV === "production"
    //       ? process.env.VUE_APP_OTHER_API_URL
    //       : "/api2";
    // }
    // 网络状态检查
    if (!clientConfig.hideNetCheck) {
      const netRes = networkStatus({ portal: "web" });
      if (netRes && netRes.networkStatus === "OFFLINE") {
        Toast(
          clientConfig.noNetworkTip ||
            i18n.t("networkError") ||
            "No network, Please check network settings!"
        );
        return Promise.reject(
          new Error(`Network Offline! Request url: ${config.url}`)
        );
      }
    }
    // eslint-disable-next-line no-prototype-builtins
    if (config.hasOwnProperty("params")) {
      config.params = {
        ...getCommonParams(),
        ...config.params,
      };
    }
    // eslint-disable-next-line no-prototype-builtins
    if (config.hasOwnProperty("data")) {
      config.data = {
        ...getCommonParams(),
        ...config.data,
      };
    }
    return config;
  },
  (error) => {
    Toast("Network error, Please try later!");
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response) => {
    const result_code = response?.data?.result_code;
    if (result_code === 200) {
      return response.data;
    } else if (Object.keys(i18n.t("errorCode")).includes(String(result_code))) {
      Toast(`${i18n.t("errorCode." + result_code)}`);
      return Promise.reject(result_code);
    } else {
      Toast(`[${result_code}] ${i18n.t("defaultError")}`);
      return Promise.reject(result_code);
    }
  },
  (error) => {
    if (
      typeof error === "string" &&
      error.indexOf("Network Offline! Request url") === -1
    ) {
      Toast(`${i18n.t("defaultError")}`);
    }
    return Promise.reject(error);
  }
);

export default service;
