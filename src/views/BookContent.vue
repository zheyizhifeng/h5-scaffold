<template>
  <div class="book-container" @click="showGuide = false" @touchmove="handleScrollReadBook">
    <div class="book-header" :class="isFullScreen ? 'full-screen' : ''">
      <div v-if="!isFullScreen" class="back icon" @click="backHandler"></div>
      <div :class="isFullScreen ? 'full-screen-book-title' : 'not-full-screen-book-title'">
        {{ bookTitle }}
      </div>
      <div
        v-if="!isFullScreen"
        class="subscribe-btn"
        :class="isSubscribed ? 'subscribed' : 'not-subscribed'"
        @click="toggleSubscribe">
        {{ isSubscribed ? $t("subscribed") : $t("subscribe") }}
        <div v-if="showGuide" class="subscribe-guide">
          {{ $t("guideText") }}
        </div>
      </div>
    </div>

    <div class="book-body" @click="isFullScreen = !isFullScreen">
      <pull-to
        :bottom-load-method="hanldeBottomPull"
        :is-top-bounce="false"
        :bottom-block-height="0"
        :bottom-config="bottomConfig"
        ref="scrollRef">
        <div class="chapter-title">{{ chapterTitle }}</div>
        <div class="book-text" v-html="chapterText"></div>
        <template slot="bottom-block">
          <div></div>
        </template>
      </pull-to>
      <div class="system-footer" v-if="isFullScreen">
        <div class="system-time">{{ systemTime }}</div>
        <div class="pager">{{ chapterNum + 1 }}/{{ chapterListLength }}</div>
      </div>
    </div>
    <div class="book-footer" v-if="!isFullScreen">
      <span
        class="prev-chapter chapter-icon"
        :class="chapterNum < 1 ? 'disabled' : ''"
        @click="toogleChapter(chapterNum - 1)"></span>
      <div class="chapter-num">{{ $t("chapter") }} {{ chapterNum + 1 }}</div>
      <span
        class="next-chapter chapter-icon"
        :class="
          chapterNum >= chapterListLength - 1 || chapterNum + 1 === availableChapterNumEveryDay * diffDay
            ? 'disabled'
            : ''
        "
        @click="toogleChapter(chapterNum + 1)"></span>
    </div>
    <transition name="fade">
      <Loading v-if="loading" loadingStyle="type1"></Loading>
    </transition>
  </div>
</template>

<script>
  import { getChapterInfo, getChapterText } from "../apis/";
  import { getCloudConfig } from "../common/js/utils";
  import PullTo from "vue-pull-to";
  import { inject, close, lifecycleCallback } from "shareit-hybird-js-sdk";
  export default {
    components: { PullTo },
    data() {
      const { book_id: bookId, tab } = this.$route.query;
      const book = this.books.find((book) => book.source_id === bookId);
      const opened = localStorage.getItem(`${bookId}_opened`);
      let diffDay = 1;
      if (!opened) {
        localStorage.setItem(`${bookId}_opened`, Date.now());
      } else {
        const now = Date.now();
        const firstTime = new Date(new Date(+opened).toDateString()).getTime();
        diffDay = Math.ceil((now - firstTime) / (1000 * 60 * 60 * 24));
      }
      return {
        loading: false,
        isFullScreen: false,
        isSubscribed: !!localStorage.getItem(`${bookId}_s`),
        showGuide: false,
        bookId,
        bookTitle: book.title,
        chapterTitle: "",
        chapterNum: +localStorage.getItem(`${bookId}_last_chapter`) || 0,
        chapterText: "",
        chapterList: [],
        chapterListLength: +book.chapters,
        diffDay,
        enterTime: Date.now(),
        systemTime: new Date().toTimeString().slice(0, 5),
        timer: null,
        bottomConfig: {
          pullText: "",
          triggerText: "",
          loadingText: "",
          doneText: "",
          failText: "",
          loadedStayTime: 400,
          stayDistance: 50,
          triggerDistance: 70,
        },
        isTab: !!tab,
      };
    },
    watch: {
      chapterNum(newChap) {
        localStorage.setItem(`${this.bookId}_last_chapter`, newChap);
        document.querySelector(".vue-pull-to-wrapper > .scroll-container").scrollTop = 0;
      },
    },
    computed: {
      availableChapterNumEveryDay() {
        const cloudRes = getCloudConfig("unlocked_chapter_num_every_day");
        if (parseInt(cloudRes) > 0) {
          return parseInt(cloudRes);
        } else {
          return Math.ceil(this.chapterListLength / 7);
        }
      },
    },
    created() {
      this.toggleSubscribe = this.$throttle(this.handleSubscribe, 1000);
      lifecycleCallback({
        portal: this.$hybirdPortal,
        callbackName: "__LIFECYCLE_UPDATE__",
      });
      window.__LIFECYCLE_UPDATE__ = (res) => {
        try {
          const data = JSON.parse(res);
          if (data?.lifecycle === "onResume") {
            this.enterTime = Date.now();
          } else if (data?.lifecycle === "onPause") {
            this.leaveBuryPoint();
          }
        } catch (error) {
          window.addEventListener("pagehide", this.leaveBuryPoint);
          window.addEventListener("pageshow", () => {
            this.enterTime = Date.now();
          });
        }
      };
      if (!localStorage.getItem("guide_has_show")) {
        this.showGuide = true;
        localStorage.setItem("guide_has_show", true);
      }
      this.fetchChapterInfo();
      this.timer = setInterval(() => {
        this.systemTime = new Date().toTimeString().slice(0, 5);
      }, 1000 * 60);
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
          pve_cur: "/novel/detail/x",
          items: JSON.stringify({
            item_id: this.bookId,
            load_duration: Math.max(loadTime, 0),
          }),
          portal: this.$portal,
        },
      });
    },
    destroyed() {
      this.leaveBuryPoint();
    },
    methods: {
      leaveBuryPoint() {
        const now = Date.now();
        this.$stLog({
          params: {
            eventId: "out_page",
            pve_cur: "/novel/detail/x",
            items: JSON.stringify({
              item_id: this.bookId,
              read_duration: now - this.enterTime,
              chapter: this.chapterNum + 1,
            }),
            portal: this.$portal,
          },
        });
      },
      hanldeBottomPull(loaded) {
        loaded("done");
        this.toogleChapter(this.chapterNum + 1);
      },
      handleScrollReadBook() {
        this.showGuide = false;
        this.isFullScreen = true;
      },
      backHandler() {
        // this.leaveBuryPoint();
        if (this.isTab) {
          close({ portal: this.$hybirdPortal });
        } else {
          this.$router.push("/");
        }
      },
      handleSubscribe() {
        if (this.isSubscribed) {
          this.$toast(this.$t("unsubscribeSucceed"));
          localStorage.removeItem(`${this.bookId}_s`);
        } else {
          localStorage.setItem(`${this.bookId}_s`, "true");
          this.$toast(this.$t("subscribeSucceed"));
        }
        this.$stLog({
          params: {
            eventId: "click_ve",
            pve_cur: `/novel/detail/${this.isSubscribed ? "unfollow" : "follow"}`,
            items: JSON.stringify({
              item_id: this.bookId,
            }),
            portal: this.$portal,
          },
        });
        this.isSubscribed = !this.isSubscribed;
      },
      fetchChapterInfo() {
        this.loading = true;
        getChapterInfo({ book_id: this.bookId })
          .then((res) => {
            this.chapterList = res;
            const chapterItem = this.chapterList[this.chapterNum] || {};
            this.chapterTitle = chapterItem?.chapter_title;
            this.fetchChapterText();
          })
          .catch(() => {
            this.$toast("Request failed, Please try again");
            this.loading = false;
          });
      },
      fetchChapterText(cb) {
        this.loading = true;
        getChapterText({
          book_id: this.bookId,
          chapter_num: this.chapterNum + 1,
        })
          .then((res) => {
            this.chapterText = res;
            cb && cb();
          })
          .catch(() => {
            this.$toast("Request failed, Please try again");
          })
          .finally(() => {
            this.loading = false;
          });
      },
      toogleChapter(newChapterNum) {
        this.$stLog({
          params: {
            eventId: "click_ve",
            pve_cur: `/novel/detail/${newChapterNum > this.chapterNum ? "next" : ""}`,
            items: JSON.stringify({
              item_id: this.bookId,
            }),
            portal: this.$portal,
          },
        });
        if (newChapterNum === this.availableChapterNumEveryDay * this.diffDay) {
          this.$toast(this.$t("unlockTitle"));
          return;
        }
        if (newChapterNum < 0 || newChapterNum >= this.chapterListLength) return;
        this.chapterNum = newChapterNum;
        const chapterItem = this.chapterList[this.chapterNum] || {};
        this.fetchChapterText(() => {
          this.chapterTitle = chapterItem?.chapter_title;
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .book-container {
    height: 100vh;
    background: #fcf8eb;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .book-header {
      padding: 60px 30px 12px 12px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      box-shadow: 0px 1px 0px 0px #e7e1ca;
      height: 146px;
      &.full-screen {
        padding-left: 40px;
        padding-right: 40px;
        box-shadow: none;
      }
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
      .not-full-screen-book-title {
        flex: 1;
        margin-left: 60px;
        height: 44px;
        line-height: 44px;
        font-size: 36px;
        font-family: ProductSans-Bold, ProductSans;
        font-weight: bold;
        color: #191919;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 40px;
      }
      .full-screen-book-title {
        height: 44px;
        line-height: 44px;
        font-size: 24px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
        color: #9e9880;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .subscribe-btn {
        height: 56px;
        line-height: 56px;
        border-radius: 12px;
        padding: 0 22px;
        font-size: 24px;
        font-family: ProductSans-Bold, ProductSans;
        font-weight: bold;
        position: relative;
        &.not-subscribed {
          background: #247fff;
          color: #ffffff;
        }
        &.subscribed {
          background: #f7f1db;
          color: #a49887;
        }
        .subscribe-guide {
          z-index: 100;
          position: absolute;
          top: calc(100% + 30px);
          right: 0;
          width: 444px;
          background: #247fff;
          border-radius: 12px;
          padding: 20px 27px;
          font-size: 26px;
          font-family: ProductSans-Regular, ProductSans;
          font-weight: 400;
          color: #ffffff;
          line-height: 32px;
          &::before {
            content: "";
            position: absolute;
            width: 32px;
            height: 22px;
            top: 0;
            right: 70px;
            transform: translateY(-100%);
            background: url("../assets/images/tooltip-arrow.png") no-repeat;
            background-size: cover;
          }
        }
      }
    }
    .book-body {
      flex: 1;
      max-height: 100vh;
      padding: 0 40px;
      overflow-y: scroll;
      position: relative;
      .chapter-title {
        font-size: 48px;
        font-family: ProductSans-Bold, ProductSans;
        font-weight: bold;
        color: #171920;
        line-height: 80px;
        margin: 44px 0 60px;
      }
      .book-text {
        font-size: 38px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
        color: #171920;
        line-height: 72px;
        margin-bottom: 104px;
      }
      .system-footer {
        display: flex;
        justify-content: space-between;
        height: 32px;
        font-size: 26px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
        color: #9e9880;
        line-height: 32px;
        position: fixed;
        background: #fcf8eb;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 36px 40px;
      }
    }
    .book-footer {
      height: 96px;
      box-shadow: 0px -2px 5px 0px rgba(0, 0, 0, 0.06);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 100px;
      .chapter-icon {
        width: 46px;
        height: 46px;
      }
      .prev-chapter {
        background: url("../assets/images/prev-enabled.png") no-repeat;
        background-size: cover;
        &.disabled {
          background-image: url("../assets/images/prev-disabled.png");
        }
      }
      .chapter-num {
        flex: 1;
        text-align: center;
        font-size: 30px;
        font-family: ProductSans-Regular, ProductSans;
        font-weight: 400;
        color: #191919;
        line-height: 37px;
      }
      .next-chapter {
        background: url("../assets/images/next-enabled.png") no-repeat;
        background-size: cover;
        &.disabled {
          background-image: url("../assets/images/next-disabled.png");
        }
      }
    }
  }
</style>
