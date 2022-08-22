import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@views/Home.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(APP_ENV.VITE_BASE_URL),
  routes,
});
