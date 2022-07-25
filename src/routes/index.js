import { deviceInfo } from "shareit-hybird-js-sdk";
import Vue from "vue";
import VueRouter from "vue-router";
import BookContent from "../views/BookContent.vue";
import BookDetail from "../views/BookDetail.vue";
import BookList from "../views/BookList.vue";
Vue.use(VueRouter);
const device = deviceInfo();
const isNativeNovelTab = device?.app_ver > 4062050;
const rootName = isNativeNovelTab ? "BookDetail" : "BookList";
const rootComponent = isNativeNovelTab ? BookDetail : BookList;
const routes = [
  {
    path: "/",
    name: rootName,
    component: rootComponent,
  },
  {
    path: "/books",
    name: "BookList",
    component: BookList,
  },
  {
    path: "/book",
    name: "BookContent",
    component: BookContent,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = new VueRouter({
  mode: "hash",
  base: import.meta.env.VITE_BASE_URL,
  routes,
});

export default router;
