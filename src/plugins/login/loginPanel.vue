<template>
  <transition name="panelfade" @after-leave="destroyElement">
    <div class="login-panel" v-show="visible" @touchmove.prevent>
      <div class="login-panel-main">
        <!-- 关闭按钮 -->
        <img
          @click="closePanel('button')"
          class="login-close"
          src="./images/close.png"
          alt=""
        />
        <!-- 头图 -->
        <img class="title-img" src="./images/head_img.png" alt="" />
        <!-- 标题 -->
        <div class="title">
          {{ loginCoins }}
          <!-- 金币右上角tip -->
          <div
            class="tip"
            :class="{ moreleft: loginCoinsTip.length > 10 }"
            v-show="loginCoinsTip"
          >
            {{ loginCoinsTip }}
          </div>
        </div>
        <!-- 描述 -->
        <div class="desc">{{ loginTitle }}</div>
        <!-- 登陆按钮 -->
        <div class="button-list">
          <!-- facebook -->
          <div
            v-if="showFacebookBtn"
            class="btn btn-fb"
            @click="handleLogin('facebook')"
          >
            <img src="./images/fb.png" alt="" />
            <span>Facebook</span>
          </div>
          <!-- google -->
          <div
            v-if="showGoogleBtn"
            class="btn btn-gg"
            @click="handleLogin('google')"
          >
            <img src="./images/gg.png" alt="" />
            <span>Google</span>
          </div>
          <!-- phone -->
          <div
            v-if="showPhoneBtn"
            class="btn btn-ph"
            @click="handleLogin('phone')"
          >
            <img src="./images/ph.png" alt="" />
            <span>Phone</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { stLog } from "@/plugins/stLog";
export default {
  name: "LoginPanel",
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      closed: false,
      loginCoins: "",
      loginTitle: "",
      loginCoinsTip: "",
    };
  },
  computed: {
    showFacebookBtn() {
      return this.supportLoginType.includes("facebook");
    },
    showGoogleBtn() {
      return this.supportLoginType.includes("google");
    },
    showPhoneBtn() {
      return this.supportLoginType.includes("phone");
    },
  },
  watch: {
    closed(newVal) {
      console.log("-----", newVal);
      if (newVal) {
        this.visible = false;
      }
    },
  },
  created() {},
  mounted() {
    // 曝光埋点
    stLog({
      params: {
        eventId: "show_ve",
        pve_cur: `/${this.pve_cur}/login/x`,
      },
    });
  },
  methods: {
    destroyElement() {
      console.log("----destroyeeeeee");
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    closePanel(from) {
      if (from === "button") {
        this.clickLog("close");
      }
      console.log("关闭登录弹窗");
      console.log("this.closed :>> ", this.closed);
      this.closed = true;
      if (typeof this.onClose === "function") {
        this.onClose(this);
      }
    },
    handleLogin(channel) {
      this.clickLog(channel);
      console.log("channel :>> ", channel);
      console.log(this.callbackName);

      const pve_cur = `/${this.pve_cur}/login/${channel}`;
      if (channel === "phone") {
        // 优化部分机型，手机号登陆弹窗关闭动画导致页面高度改变，展示的登陆弹窗闪一下
        this.visible = false;
        setTimeout(() => {
          this.$entryLogin.callLogin(
            this.callbackName,
            channel,
            pve_cur,
            this.hybirdPortal || "web"
          );
          this.closePanel();
        }, 350);
      } else {
        this.$entryLogin.callLogin(
          this.callbackName,
          channel,
          pve_cur,
          this.hybirdPortal || "web"
        );
      }
    },
    clickLog(area) {
      stLog({
        params: {
          eventId: "click_ve",
          pve_cur: `/${this.pve_cur}/login/${area}`,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.panelfade-enter-active,
.panelfade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.panelfade-enter, .panelfade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.login-panel {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999999;
  background: rgba($color: #000000, $alpha: 0.7);
  .login-panel-main {
    width: 644px;
    min-height: 519px;
    background: #fff;
    background: linear-gradient(0deg, #fc5324 0%, #fe8338 100%);
    border-radius: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-top: 122px;
    padding-bottom: 37px;
    text-align: center;

    .title-img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 510px;
      height: 298px;
      top: -180px;
    }
    .login-close {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -93px;
      width: 69px;
      height: 69px;
    }
    .title {
      text-align: center;
      font-size: 90px;
      font-family: DINCond-Black;
      font-weight: 400;
      color: #ffffff;
      margin-bottom: 10px;
      position: relative;
      // display: inline-block;
      height: 88px;
      line-height: 88px;
      .tip {
        position: absolute;
        min-width: 117px;
        height: 40px;
        background: #ffc721;
        border-radius: 20px;
        top: -40px;
        left: 71%;
        font-size: 26px;
        font-family: Roboto;
        font-weight: 400;
        color: #ffffff;
        line-height: 40px;
        border-bottom-left-radius: 5px;
        padding: 0 15px;
      }
      .moreleft {
        left: 67%;
      }
    }
    .desc {
      font-size: 30px;
      font-family: Roboto;
      font-weight: 400;
      color: #fedd44;
      text-align: center;
      padding: 0 20px;
      margin-bottom: 38px;
    }
    .button-list {
      width: 433px;
      margin: 0 auto;
      .btn {
        width: 433px;
        height: 90px;
        background: #ffffff;
        border-radius: 45px;
        margin-bottom: 20px;
        padding-left: 96px;
        display: flex;
        align-items: center;
        img {
          width: 74px;
          height: 74px;
          margin-right: 16px;
        }
      }
    }
  }

  .login-panel-main:lang(ru) {
    .title {
      font-size: 76px;
      .tip {
        font-size: 23px;
      }
    }
    .desc {
      font-size: 28px;
    }
  }
}
</style>
