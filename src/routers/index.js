import Home from "@views/Home.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
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
