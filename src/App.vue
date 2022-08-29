<template>
  <div id="app">
    <Home></Home>
    <!-- <router-view /> -->
  </div>
</template>

<script>
import Home from "@/views/Home.vue";
export default {
  name: "App",
  components: {
    Home,
  },
  created() {
    // this.$store.commit("getBasicInfo");
    // this.$store.commit("getLoginInfo");
  },
  mounted() {
    const duration = window.__FE_PAGE_START_TIME__
      ? `${new Date().getTime() - window.__FE_PAGE_START_TIME__}`
      : "";
    console.log(
      "👀👀👀👀👀👀👀 page load duration 👀👀👀👀👀👀👀 :>> ",
      duration
    );
    this.$stLog({
      params: {
        eventId: "show_ve",
        pve_cur: "REPLACE_LOG_PVE_CUR" + "/0",
        extras: "REPLACE_LOG_EXTRAS",
        portal: this.$portal,
        duration,
        url: window.location.href,
      },
    });
  },
};
</script>
<style lang="scss">
#app {
  width: 100%;
  min-height: 100%;
}
// 全局淡入/淡出动画，用于弹窗、遮罩层展示隐藏
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
