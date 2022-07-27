import axios from "axios";
import getCommonParams from "./commonParams";

const { VITE_API_URL, VITE_NODE_ENV } = APP_ENV;
const service = axios.create({
  baseURL: VITE_NODE_ENV === "production" ? VITE_API_URL : "/api",
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
