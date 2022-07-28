<template>
  <div class="wrap">
    <div class="text">Hello Vue2 + Vite</div>
    <img class="vite-logo" src="https://cn.vitejs.dev/logo-with-shadow.png" alt="" srcset="" />
  </div>
</template>

<script></script>

<style lang="scss" scoped>
  .wrap {
    @include flex(column);

    .vite-logo {
      max-height: 200px;
    }
  }
</style>
