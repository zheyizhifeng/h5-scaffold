import VueRouter, { Route } from "vue-router";

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter; // 这表示this下有这个东西
    $route: Route;
  }
}

// declare module "shareit-hybird-js-sdk" {
//   const content: any
//   export default content;
// };

// declare const APP_ENV: {
//   VITE_BASE_URL: string;
// };

declare module "*.json" {
  const value: any;
  export default value;
}
