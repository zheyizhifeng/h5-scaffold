import * as Integrations from "@sentry/tracing";
import * as Sentry from "@sentry/vue";
import Vue from "vue";

const inAPP = window.client && window.shareitBridge;

if (APP_ENV.VITE_NODE_ENV === "production") {
  Sentry.init({
    Vue,
    dsn: "", // TODO: sentry dsn
    autoSessionTracking: true, // When set to true, the SDK will send session events to Sentry. This is supported in all browser SDKs, emitting one session per pageload to Sentry.
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.02, // A number between 0 and 1, controlling the percentage chance a given transaction will be sent to Sentry.
    attachProps: true, // 发送vue组件相关日志
    logErrors: true, // true 调用vue的logError 方法
    release: "version_" + APP_VERSION, // 版本号
    environment: APP_ENV.VITE_ENVIRONMENT, // 环境
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
