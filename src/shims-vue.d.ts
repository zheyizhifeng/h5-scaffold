import VueRouter, { Route } from "vue-router";

declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter; // 这表示this下有这个东西
    $route: Route;
  }
}

declare global {
  declare const REPLACE_LOG_PVE_CUR;
  declare const REPLACE_LOG_EXTRAS;
  declare const APP_ENV;
  interface Window {
    rem: number;
    shareitBridge: {
      syncInvoke: (portal: string, method: string, params: string) => any;
      asyncInvoke: (portal: string, method: string, blank: string, params: string) => any;
    };
  }
}
