import axios from "axios";
import getCommonParams from "./commonParams";
// 创建axios实例
const hash = window?.location?.hash;
const isOld = hash?.indexOf("#/book") > -1;
const service = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? isOld
        ? process.env.VUE_APP_CDN_URL
        : process.env.VUE_APP_API_URL
      : "/api",
});

// request拦截器
service.interceptors.request.use(
  (config) => {
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
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
