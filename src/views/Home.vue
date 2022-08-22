<template>
  <div class="wrap">
    <div class="text">Hello Vue2 + Vite</div>
    <img class="vue-logo" src="../assets/images/Vue.png" alt="" />
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
