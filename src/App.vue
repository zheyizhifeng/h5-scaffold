<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<!-- <script lang="ts">
  import { getCurrentInstance } from "vue";
  export default {
    setup() {
      const { proxy } = getCurrentInstance() as any;
      proxy.$log({
        params: {
          eventId: "show_ve",
          pve_cur: REPLACE_LOG_PVE_CUR + "/0",
          extras: REPLACE_LOG_EXTRAS,
          portal: proxy.$portal,
        },
      });
    },
  };
</script> -->
