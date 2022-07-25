<template>
  <div class="books-container" :class="isInTab ? 'in-tab' : ''" ref="tabContainer">
    <div v-if="!isInTab" class="books-header">
      <div class="back icon" @click="backHandler"></div>
      <div class="title">{{ $t("readerChoice") }}</div>
      <div class="message icon" @click="jumpToFeedback"></div>
    </div>
    <div class="books-body">
      <div class="books-notice" v-if="!!noticeTxt">
        <span class="notice-icon"></span>
        <div class="notice-text" v-html="noticeTxt" @click.prevent.stop="clickNotice"></div>
      </div>
      <div class="books-wrapper">
        <book-item v-for="book in books" :key="key(book.source_id)" :book="book" :is-tab="isInTab"></book-item>
      </div>
    </div>
  </div>
</template>

<script>
  import BookItem from "../components/layout/BookItem.vue";
  import { getCloudConfig } from "../common/js/utils";
  import { executeAppEventCollection, inject, close } from "shareit-hybird-js-sdk";

  export default {
    components: { BookItem },
    data() {
      const { tab_id, tab } = this.$route.query;
      return {
        books: this.books,
        enterTime: Date.now(),
        tab_id: tab_id || tab,
        isInTab: !!tab_id || !!tab,
      };
    },
    computed: {
      noticeTxt() {
        const cloudRes = getCloudConfig("mvp_fiction_notice");
        const noticeMap = JSON.parse(cloudRes || "{}");
        // eslint-disable-next-line no-prototype-builtins
        if (noticeMap.hasOwnProperty(this.country.toLowerCase())) {
          return noticeMap[this.country.toLowerCase()];
        }
        return "";
      },
      key() {
        return function (bookId) {
          if (this.isInTab) {
            return localStorage.getItem(`${bookId}_opened`) || bookId;
          }
          return bookId;
        };
      },
    },
    created() {
      this.sendLoadingToClient();
    },
    mounted() {
      inject({ callbackName: "" });
      inject({ callbackName: "outPageCallback" });
      window.outPageCallback = this.backHandler;
      let t = window.performance.timing;
      const loadTime = t.loadEventEnd - t.navigationStart;
      this.$stLog({
        params: {
          eventId: "in_page",
          pve_cur: "/novel/landing/x",
          items: JSON.stringify({
            load_duration: Math.max(loadTime, 0),
          }),
          portal: this.$portal,
        },
      });
      if (this.isInTab) {
        this.initAbsTop();
        const that = this;
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            that.$forceUpdate();
          } else {
            that.leaveBuryPoint();
          }
        });
      }
    },
    destroyed() {
      this.leaveBuryPoint();
    },
    methods: {
      openPageInClient(href) {
        let json = {
          id: "cuatom",
          feedAction: "7",
          param: JSON.stringify({
            url: href,
            quit_action: "qa_start_app",
            new_task: false,
            is_hybrid: true,
            is_remote: false,
          }),
        };
        window?.shareitBridge?.asyncInvoke("custom", "executeAppEvent", "", JSON.stringify(json));
      },
      clickNotice($event) {
        const t = $event.target;
        if (t.nodeName === "A") {
          const href = t.getAttribute("href") || t.href;
          this.openPageInClient(href);
        }
      },
      sendLoadingToClient() {
        window?.shareitBridge?.syncInvoke(
          "PayPhoneFare",
          "hideTrendingH5Loading",
          JSON.stringify({
            sub_tab_id: this.tab_id, // eg.  sub_tab_id: 'NEWS'
          })
        );
      },
      leaveBuryPoint() {
        const now = Date.now();
        this.$stLog({
          params: {
            eventId: "out_page",
            pve_cur: "/novel/landing/x",
            items: JSON.stringify({
              stay_duration: now - this.enterTime,
            }),
            portal: this.$portal,
          },
        });
      },
      backHandler() {
        close({ portal: this.$hybirdPortal });
      },
      initAbsTop() {
        let res = JSON.parse(window?.shareitBridge?.syncInvoke("PayPhoneFare", "getTrendingTopPadding", "") || "{}");
        if (res?.responseCode === "0") {
          this.$refs.tabContainer.style.top = `${res.padding_top / window.devicePixelRatio}px`;
        }
      },

      jumpToFeedback() {
        this.$stLog({
          params: {
            eventId: "click_ve",
            pve_cur: "/books/feedback/x",
            portal: this.$portal,
          },
        });
        executeAppEventCollection({
          id: "web_feedback",
          feedAction: "60",
          param: {
            inner_func_type: 28,
            page_url: "/feedback/activity/submit",
            portal: this.$hybirdPortal,
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .books-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    &.in-tab {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: auto;
    }
    .books-header {
      padding: 60px 12px 12px;
      display: flex;
      align-items: center;
      .icon {
        width: 72px;
        height: 72px;
        &.back {
          background: url("../assets/images/back-old.png") no-repeat;
          background-size: cover;
        }
        &.message {
          background: url("../assets/images/message.png") no-repeat;
          background-size: cover;
        }
      }
      .title {
        flex: 1;
        margin-left: 60px;
        height: 44px;
        font-size: 36px;
        font-family: ProductSans-Bold, ProductSans;
        font-weight: bold;
        color: #191919;
        line-height: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .books-body {
      flex: 1;
      overflow-y: scroll;
    }
    .books-notice {
      background: #ecf4ff;
      border-radius: 12px;
      margin: 24px 36px 0;
      padding: 22px 28px;
      color: #368aff;
      display: flex;
      align-items: center;
      .notice-icon {
        width: 30px;
        height: 30px;
        margin-right: 16px;
        background: url("../assets/images/notice.png") no-repeat;
        background-size: cover;
      }
      .notice-text {
        flex: 1;
        font-size: 24px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
        color: #368aff;
      }
    }
    .books-wrapper {
      padding: 0 36px;
    }
  }
</style>
