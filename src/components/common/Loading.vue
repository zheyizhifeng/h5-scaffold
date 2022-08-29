<template>
  <div class="loading-block" :class="{ 'loading-part-block': !fullscreen }">
    <div class="lds-style1" v-if="loadingStyle === 'type1'">
      <div class="lds-style1-inner">
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="lds-ring" v-else>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    /**
     * @param fullScreen:loading类型
     * @value true: 全屏 false: 局部
     */
    fullscreen: {
      default: true,
    },
    loadingStyle: {
      type: String,
      default: "default",
    },
  },
};
</script>

<style lang="scss" scoped>
.loading-block {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba($color: #fff, $alpha: 0.5);
  z-index: 999999;
  .lds-ring {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #ea7535;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #ea7535 transparent transparent transparent;
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
.loading-part-block {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 99999;
}

// style1
@keyframes lds-style1-inner {
  0% {
    top: 94px;
    left: 94px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 57px;
    left: 57px;
    width: 74px;
    height: 74px;
    opacity: 0;
  }
}
.lds-style1-inner div {
  position: absolute;
  border-width: 6px;
  border-style: solid;
  opacity: 1;
  border-radius: 50%;
  animation: lds-style1-inner 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-style1-inner div:nth-child(1) {
  border-color: #0c7ee9;
  animation-delay: 0s;
}
.lds-style1-inner div:nth-child(2) {
  border-color: #f046ba;
  animation-delay: -0.5s;
}
.lds-style1 {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.lds-style1-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.lds-style1-inner div {
  box-sizing: content-box;
}
</style>
