import Home from "@views/Home.vue";
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: Home,
    component: Home,
  },
];

const router = new VueRouter({
  mode: "hash",
  base: APP_ENV.VITE_BASE_URL,
  routes,
});

export default router;
