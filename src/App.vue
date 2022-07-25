<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$stLog({
        params: {
          eventId: "show_ve",
          pve_cur: "REPLACE_LOG_PVE_CUR" + "/0",
          extras: "REPLACE_LOG_EXTRAS",
          portal: this.$portal,
        },
      });
    },
  };
</script>
<style lang="css">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease-in-out;
  }
  .fade-enter, .fade-leave-to 
  /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
