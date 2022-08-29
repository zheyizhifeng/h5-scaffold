<template>
  <transition name="toast-fade" @after-leave="destroyElement">
    <div v-show="visible" class="my-toast">
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Toast",
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
      }
    },
  },

  mounted() {
    this.startTimer();
  },

  methods: {
    destroyElement() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    close() {
      this.closed = true;
      if (typeof this.onClose === "function") {
        this.onClose(this);
      }
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
  box-sizing: border-box;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 15%;
  line-height: 30px;
  font-size: 28px;
  text-align: center;
  transition: all 0.3s;
  color: #fff;
  width: 75%;
  span {
    background: rgba(0, 0, 0, 0.8);
    border-radius: 18px;
    padding: 25px 30px;
    max-width: 100%;
    display: inline-block;
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
