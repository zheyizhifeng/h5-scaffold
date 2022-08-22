<template>
  <div class="wrap">
    <div class="logo-box">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="@images/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
  </div>
</template>

<script>
  import HelloWorld from "./components/HelloWorld.vue";
  export default {
    components: {
      HelloWorld,
    },
  };
</script>

<style scoped lang="scss">
  .wrap {
    text-align: center;

    .logo-box {
      .logo {
        height: 200px;
        padding: 40px;
        will-change: filter;
      }

      .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
      }

      .logo.vue:hover {
        filter: drop-shadow(0 0 2em #42b883aa);
      }
    }
  }
</style>
