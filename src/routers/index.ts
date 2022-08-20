import Home from "@views/Home.vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: Home,
    component: Home,
  },
];

export const router = createRouter({
  history: createWebHashHistory(APP_ENV.VITE_BASE_URL),
  routes,
});
