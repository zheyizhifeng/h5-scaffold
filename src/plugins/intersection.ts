import Vue from "vue";
import vueIntersectionPlugin from "vue-intersection-plugin-revision";
Vue.use(vueIntersectionPlugin, {
  handler: (logData) => {
    console.log("🚀 ~ file: intersection.js ~ line 6 ~ logData", logData);
  },
});
