<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$log({
        params: {
          eventId: "show_ve",
          pve_cur: REPLACE_LOG_PVE_CUR + "/0",
          extras: REPLACE_LOG_EXTRAS,
          portal: this.$portal,
        },
      });
    },
  };
</script>
