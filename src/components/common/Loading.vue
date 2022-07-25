<template>
  <div class="loading-block">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "MyLoading",
  };
</script>
<style lang="scss" scoped>
  .loading-block {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba($color: #fff, $alpha: 0.7);
    z-index: 1000;
    .lds-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
    }
    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 40px;
      height: 40px;
      margin: 8px;
      border: 8px solid #368aff;
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #368aff transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }
    @keyframes lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
