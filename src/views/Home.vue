<template>
  <div class="home-container">
    <h1>This is Home Page</h1>
    <div class="test" @click="loading = !loading">展示loading</div>
    <div class="pop" @click="changeLanguage"></div>
    <h2>测试拦截器</h2>
    <div>
      <div>{{ $t("common.noNetworkTip") }}</div>
      <div @click="testfun1">click1</div>
      <div @click="testfun2">click2</div>
    </div>
    <transition name="fade">
      <Loading v-show="loading" loadingStyle="type1"></Loading>
    </transition>
  </div>
</template>

<script>
import { GetApi, PostApi } from "@/api/index";
export default {
  name: "Home",
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    testfun1() {
      const params = {
        name: "testname",
        age: 11,
      };
      GetApi(params, { hideNetCheck: true })
        .then((res) => {
          console.log("get res :>> ", res);
        })
        .catch((err) => {
          console.log("geterr", err);
        });
    },
    testfun2() {
      const params = {
        name: "testname",
        age: 11,
      };
      PostApi(params, { hideNetCheck: false })
        .then((res) => {
          console.log("post res :>> ", res);
        })
        .catch((err) => {
          console.log("posterr", err);
        });
    },
    changeLanguage() {
      console.log(this.$i18n.local);
      this.$root.$i18n.locale = "en";
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  .test {
    width: 700px;
    height: 50px;
    background: pink;
  }
  .pop {
    // @include popup(999, red);
    @include wh(300px, 300px);
    background: hotpink;
    transform: scale(0.7);
  }
}
</style>
