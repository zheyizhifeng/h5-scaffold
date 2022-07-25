import Vue from "vue";
import * as Sentry from "@sentry/vue";
// import { Integrations } from "@sentry/tracing";
import * as Integrations from "@sentry/tracing";

const inAPP = window.client && window.shareitBridge;
// Sentry
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    Vue,
    dsn: "",
    autoSessionTracking: true, // When set to true, the SDK will send session events to Sentry. This is supported in all browser SDKs, emitting one session per pageload to Sentry.
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.02, // A number between 0 and 1, controlling the percentage chance a given transaction will be sent to Sentry.
    attachProps: true, // 发送vue组件相关日志
    logErrors: true, // true 调用vue的logError 方法
    release: "version_" + process.env.VUE_APP_PACKAGE_VERSION, // 版本号
    environment: process.env.VUE_APP_ENVIRONMENT, // 环境
    ignoreErrors: [/Network Error/, "timeout of 0ms exceeded"],
    beforeSend(event) {
      // APP内上报异常
      if (inAPP) {
        return event;
      } else {
        return null;
      }
    },
  });
  Vue.prototype.$sentry = Sentry;
}
