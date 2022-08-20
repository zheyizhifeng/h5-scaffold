import * as Integrations from "@sentry/tracing";
import * as Sentry from "@sentry/vue";
import Vue from "vue";
const inAPP = window.client && window.shareitBridge;
if (APP_ENV.VITE_NODE_ENV === "production") {
  Sentry.init({
    Vue,
    dsn: "",
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.02,
    attachProps: true,
    logErrors: true,
    release: "version_" + APP_VERSION,
    environment: APP_ENV.VITE_ENVIRONMENT,
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
