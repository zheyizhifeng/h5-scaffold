<template>
  <transition name="toast-fade">
    <div v-show="visible" class="my-toast">
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        visible: false,
        message: "",
        duration: 3000,
        timer: null,
        closed: false,
      };
    },

    computed: {},

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener("transitionend", this.destroyElement);
        }
      },
    },

    mounted() {
      this.startTimer();
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener("transitionend", this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      close() {
        this.closed = true;
      },
      clearTimer() {
        clearTimeout(this.timer);
      },
      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (this.visible) {
              this.close();
            }
          }, this.duration);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .my-toast {
    position: fixed;
    bottom: 15%;
    left: 50%;
    box-sizing: border-box;
    width: 60%;
    font-size: 28px;
    line-height: 32px;
    color: #fff;
    text-align: center;
    transition: all 0.3s;
    transform: translateX(-50%);

    span {
      display: inline-block;
      max-width: 100%;
      padding: 25px 30px;
      background: rgb(0 0 0 / 80%);
      border-radius: 18px;
    }
    // min-width: rem(100px);
    // max-width: rem(1000px);
    // word-break: keep-all;
  }

  .toast-fade-enter,
  .toast-fade-leave-active {
    opacity: 0;
    transform: translate(-50%, 20%);
  }
</style>
