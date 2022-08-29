<template>
  <div class="observer" />
</template>
<script type="text/ecmascript-6">
import 'intersection-observer';

export default {
  props: {
    //IntersectionObserver 配置项
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    //数据是否加载完成
    completed: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      observer: null,
    }
  },
  watch: {
    completed (value) {
      if (value) {
        this.observer.unobserve(this.$el);
      }
    },
  },
  mounted () {
    const options = this.options || {};
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) return;
      this.$emit('load')
      console.log('in ----')
    }, options);
    this.observer.observe(this.$el)
  },
  destroyed () {
    this.observer.disconnect()
  },
};
</script>
<style scoped lang="scss">
.observer {
  width: 100%;
  height: 20px;
}
</style>
