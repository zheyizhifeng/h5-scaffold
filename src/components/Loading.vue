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
<style lang="scss" scoped>
  .loading-block {
    @include overlay(1000, #fff, 0.7);

    .lds-ring {
      @include absolute-center();

      width: 40px;
      height: 40px;
    }

    .lds-ring div {
      position: absolute;
      display: block;
      width: 40px;
      height: 40px;
      margin: 8px;
      border: 8px solid #368aff;
      border-color: #368aff transparent transparent;
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
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
